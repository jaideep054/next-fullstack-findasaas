import logger from "@/lib/logger";
import { connectDB } from "@/lib/mongodb";
import { getUserFromToken } from "@/lib/utils/authmiddleware";
import { generateQueryEmbedding } from "@/lib/utils/generateLocalEmbedding";
import {
  extractKeywordsForVector,
  extractPriceFilter,
} from "@/lib/utils/common";
import { ToolData } from "@/models/ToolData";
import User from "@/models/User";
import Fuse from "fuse.js";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const getAllApprovedTools = async () => {
  await connectDB();
  const weights = {
    reviewCount: 10,
    avgRating: 25,
    click: 3,
    linkClick: 1,
  };

  const tools = await ToolData.aggregate([
    { $match: { approved: true } },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "tool_id",
        as: "reviewsData",
      },
    },
    {
      $addFields: {
        review_count: { $size: "$reviewsData" },
        user_rating_avg: { $avg: "$reviewsData.rating" },
      },
    },
    {
      $lookup: {
        from: "analytics",
        let: { toolId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$tool_id", "$$toolId"] } } },
          {
            $group: {
              _id: "$event_type",
              totalCount: { $sum: "$count" },
            },
          },
        ],
        as: "analyticsSummary",
      },
    },
    {
      $addFields: {
        clickStats: {
          $first: {
            $filter: {
              input: "$analyticsSummary",
              cond: { $eq: ["$$this._id", "click"] },
            },
          },
        },
        linkClickStats: {
          $first: {
            $filter: {
              input: "$analyticsSummary",
              cond: { $eq: ["$$this._id", "link_click"] },
            },
          },
        },
      },
    },
    {
      $addFields: {
        click_count: { $ifNull: ["$clickStats.totalCount", 0] },
        link_click_count: { $ifNull: ["$linkClickStats.totalCount", 0] },
      },
    },
    {
      $addFields: {
        ranking_score: {
          $add: [
            { $multiply: ["$review_count", weights.reviewCount] },
            {
              $multiply: [
                { $ifNull: ["$user_rating_avg", 0] },
                weights.avgRating,
              ],
            },
            { $multiply: ["$link_click_count", weights.linkClick] },
            { $multiply: ["$click_count", weights.click] },
          ],
        },
        sortByFeatured: {
          $cond: {
            if: { $eq: [{ $type: "$featured" }, "bool"] },
            then: { $cond: { if: "$featured", then: 1, else: 0 } },
            else: 0,
          },
        },
      },
    },
    {
      $sort: {
        sortByFeatured: -1,
        ranking_score: -1,
        createdAt: -1,
      },
    },
    {
      $project: {
        reviews: 0,
        review_count: 0,
        analyticsSummary: 0,
        clickStats: 0,
        linkClickStats: 0,
        click_count: 0,
        link_click_count: 0,
      },
    },
  ]);

  return tools;
};

export const getPendingApprovalTools = async (req: NextRequest) => {
  try {
    const pendingTools = await ToolData.find({ approved: false });

    return NextResponse.json(
      { success: true, data: pendingTools },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error fetching pending tools: ${error.message}`);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};

export const getToolById = async (toolId: string) => {
  try {
    // await connectDB();
    if (!mongoose.Types.ObjectId.isValid(toolId)) {
      return NextResponse.json({ error: "Invalid Tool ID" }, { status: 400 });
    }

    const tool = await ToolData.findById(toolId)
      .populate("submittedBy")
      .populate("review_id");

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    return NextResponse.json(tool, { status: 200 });
  } catch (err) {
    console.error("[GET /api/tools/:toolId]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const semanticsearchQuery = async (req: NextRequest) => {
  try {
    await connectDB();
    const q = req.nextUrl.searchParams.get("q");
    const originalQuery = (q || "").trim();

    const maxPrice = extractPriceFilter(originalQuery);
    const semanticQueryText = extractKeywordsForVector(originalQuery);
    // logger.info(`Semantic Query Text: "${semanticQueryText}"`);

    if (!semanticQueryText && maxPrice === null) {
      return NextResponse.json(
        { success: false, message: "Meaningful search query required" },
        { status: 400 }
      );
    }

    // If only price filter is applied
    if (!semanticQueryText && maxPrice !== null) {
      console.info("Performing price-only filter search.");
      const results = await ToolData.find({
        approved: true,
        priceValue: { $lte: maxPrice },
      }).limit(50);
      return NextResponse.json({ success: true, data: results });
    }

    // Semantic vector search
    const queryVector = await generateQueryEmbedding(semanticQueryText);

    if (!queryVector) {
      return NextResponse.json(
        { success: false, message: "Failed to process search query" },
        { status: 500 }
      );
    }

    const pipeline: any = [
      {
        $vectorSearch: {
          index: "vector_index_tools",
          path: "embedding",
          queryVector: queryVector,
          numCandidates: 100,
          limit: 20,
        },
      },
      {
        $match: {
          approved: true,
          ...(maxPrice !== null && { priceValue: { $lte: maxPrice } }),
        },
      },
      {
        $addFields: {
          score: { $meta: "vectorSearchScore" },
        },
      },
      { $unset: "embedding" },
    ];

    const results = await ToolData.aggregate(pipeline);
    // console.log(queryVector,"queryVector")
    console.info(`Found ${results.length} results.`);

    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    console.error(`Error in vector search: ${error.message}`);
    return NextResponse.json(
      { success: false, message: "Internal server error during search" },
      { status: 500 }
    );
  }
};

export const listTool = async (req: NextRequest) => {};

export const generateBadge = async (toolId: string, mode: string = "light") => {
  const tool = await ToolData.findById(toolId);

  if (!tool) {
    throw new Error("Tool not found");
  }

  const themes: Record<
    string,
    {
      background: string;
      border: string;
      text: string;
      shadow: string;
    }
  > = {
    light: {
      background: "#F9FAFB",
      border: "#E5E7EB",
      text: "#1F2937",
      shadow: "rgba(0, 0, 0, 0.05)",
    },
    dark: {
      background: "#374151",
      border: "#4B5563",
      text: "#F3F4F6",
      shadow: "rgba(0, 0, 0, 0.2)",
    },
  };

  const currentTheme = themes[mode] || themes.light;
  const badgeId = `fys-badge-${tool._id}-${Date.now()}`;

  const badgeCode = `
    <style>
      @keyframes fysBadgeTextShimmer-${badgeId} {
        0% { opacity: 0.7; }
        50% { opacity: 1; }
        100% { opacity: 0.7; }
      }

      #${badgeId}:hover .fys-badge-inner {
         transform: translateY(-1px);
         box-shadow: 0 6px 10px -2px ${currentTheme.shadow}, 0 3px 6px -2px ${currentTheme.shadow};
      }
    </style>
    <a id="${badgeId}" href="https://findyoursaas.com/tool/${tool._id}/${tool.slug}" target="_blank" style="text-decoration: none; display: inline-block; color: inherit;">
      <div class="fys-badge-inner" style="
        display: flex;
        align-items: center;
        background-color: ${currentTheme.background};
        border: 1px solid ${currentTheme.border};
        border-radius: 6px;
        padding: 6px 10px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        box-shadow: 0 2px 4px -1px ${currentTheme.shadow};
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        line-height: 1;
      ">
        <img src="https://findyoursaas.com/logo.png"
             alt="FYS Logo"
             style="width: 18px; height: 18px; border-radius: 50%; margin-right: 6px; display: block;"/>
        <span style="font-size: 12px; font-weight: 500; color: ${currentTheme.text}; white-space: nowrap;">
          Featured on FYS
        </span>
      </div>
    </a>
  `;

  tool.badgeCode = badgeCode;
  await tool.save();

  return {
    badgeCode,
    badgePreview: `https://findyoursaas.com/static/fys-badge-v2-${mode}.png`,
  };
};


export const getToolByUserId = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const tools = await ToolData.find({ submittedBy: userId });
  return tools;
};
