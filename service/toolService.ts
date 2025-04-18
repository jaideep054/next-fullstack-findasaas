import logger from '@/lib/logger';
import { connectDB } from '@/lib/mongodb';
import { getUserFromToken } from '@/lib/utils/authmiddleware';
import { generateQueryEmbedding } from '@/lib/utils/generateLocalEmbedding';
import { extractKeywordsForVector, extractPriceFilter } from '@/lib/utils/searchutils';
import {ToolData} from '@/models/ToolData';
import User from '@/models/User';
import Fuse from 'fuse.js';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';



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
            $filter: { input: "$analyticsSummary", cond: { $eq: ["$$this._id", "click"] } },
          },
        },
        linkClickStats: {
          $first: {
            $filter: { input: "$analyticsSummary", cond: { $eq: ["$$this._id", "link_click"] } },
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
            { $multiply: [{ $ifNull: ["$user_rating_avg", 0] }, weights.avgRating] },
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

    const tool = await ToolData.findById(toolId).populate("submittedBy").populate("review_id");

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    return NextResponse.json(tool, { status: 200 });
  } catch (err) {
    console.error("[GET /api/tools/:toolId]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};



export const semanticsearchQuery  = async (req: NextRequest) => {
 try {
    const q = req.nextUrl.searchParams.get("q");
    const originalQuery = (q || "").trim();

    const maxPrice = extractPriceFilter(originalQuery);
    const semanticQueryText = extractKeywordsForVector(originalQuery);
    // logger.info(`Semantic Query Text: "${semanticQueryText}"`);

    if (!semanticQueryText && maxPrice === null) {
      return NextResponse.json({ success: false, message: "Meaningful search query required" }, { status: 400 });
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
      return NextResponse.json({ success: false, message: "Failed to process search query" }, { status: 500 });
    }

    const pipeline : any = [
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
    return NextResponse.json({ success: false, message: "Internal server error during search" }, { status: 500 });
  }
}






export const listTool = async (
  req: NextRequest)=>{
    
  }


// export const GET = async (req: NextRequest): Promise<NextResponse> => {
//   try {
//     const q = req.nextUrl.searchParams.get("q");
//     const originalQuery = (q || "").trim();

//     const maxPrice = extractPriceFilter(originalQuery);
//     const semanticQueryText = extractKeywordsForVector(originalQuery);
//     // logger.info(`Semantic Query Text: "${semanticQueryText}"`);

//     if (!semanticQueryText && maxPrice === null) {
//       return NextResponse.json({ success: false, message: "Meaningful search query required" }, { status: 400 });
//     }

//     // If only price filter is applied
//     if (!semanticQueryText && maxPrice !== null) {
//       console.info("Performing price-only filter search.");
//       const results = await ToolData.find({
//         approved: true,
//         priceValue: { $lte: maxPrice },
//       }).limit(50);
//       return NextResponse.json({ success: true, data: results });
//     }

//     // Semantic vector search
//     const queryVector = await generateQueryEmbedding(semanticQueryText);

//     if (!queryVector) {
//       return NextResponse.json({ success: false, message: "Failed to process search query" }, { status: 500 });
//     }

//     const pipeline : any = [
//       {
//         $vectorSearch: {
//           index: "vector_index_tools",
//           path: "embedding",
//           queryVector: queryVector,
//           numCandidates: 100,
//           limit: 20,
//         },
//       },
//       {
//         $match: {
//           approved: true,
//           ...(maxPrice !== null && { priceValue: { $lte: maxPrice } }),
//         },
//       },
//       {
//         $addFields: {
//           score: { $meta: "vectorSearchScore" },
//         },
//       },
//       { $unset: "embedding" },
//     ];

//     const results = await ToolData.aggregate(pipeline);
//     console.info(`Found ${results.length} results.`);

//     return NextResponse.json({ success: true, data: results });
//   } catch (error: any) {
//     console.error(`Error in vector search: ${error.message}`);
//     return NextResponse.json({ success: false, message: "Internal server error during search" }, { status: 500 });
//   }
// };

// import { Request, Response } from "express";
// import { generateQueryEmbedding } from "./generateEmbedding"; // Importing the new function
// import { logger } from "../index";
// import { ToolData } from "../models/ToolData";
// import { extractKeywordsForVector, extractPriceFilter } from "../utils/common";

// The searchTools function
// export const searchTools = async (req: NextRequest, res: NextResponse): Promise<Response> => {
//   try {
//     const { q } = req.query;
//     const originalQuery = (q as string).trim();

//     // 1. Extract Filters (Price in this case)
//     const maxPrice = extractPriceFilter(originalQuery);

//     // 2. Prepare Text for Semantic Search
//     const semanticQueryText = extractKeywordsForVector(originalQuery);
//     logger.info(`Semantic Query Text: "${semanticQueryText}"`);

//     if (!semanticQueryText && maxPrice === null) {
//       return res.status(400).json({ success: false, message: "Meaningful search query required" });
//     }

//     if (!semanticQueryText && maxPrice !== null) {
//       logger.info("Performing price-only filter search.");
//       const results = await ToolData.find({
//         approved: true,
//         priceValue: { $lte: maxPrice },
//       }).limit(50);
//       return res.json({ success: true, data: results });
//     }

//     // 3. Generate Query Embedding using local pipeline
//     const queryVector = await generateQueryEmbedding(semanticQueryText);

//     if (!queryVector) {
//       return res.status(500).json({ success: false, message: "Failed to process search query" });
//     }

//     // 4. Perform Vector Search using MongoDB Aggregation Pipeline
//     const pipeline = [
//       {
//         $vectorSearch: {
//           index: "vector_index_tools",
//           path: "embedding",
//           queryVector: queryVector,
//           numCandidates: 100,
//           limit: 20,
//         },
//       },
//       {
//         $match: {
//           approved: true,
//           ...(maxPrice !== null && { priceValue: { $lte: maxPrice } }),
//         },
//       },
//       {
//         $addFields: {
//           score: { $meta: "vectorSearchScore" },
//         },
//       },
//       { $unset: "embedding" },
//     ];

//     const results = await ToolData.aggregate(pipeline);
//     logger.info(`Found ${results.length} results.`);

//     return res.json({ success: true, data: results });
//   } catch (error) {
//     logger.error(`Error in vector search: ${error.message}`);
//     return res.status(500).json({ success: false, message: "Internal server error during search" });
//   }
// };

