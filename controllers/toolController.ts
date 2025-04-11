import {ToolData} from '@/models/ToolData';
// import { logger } from '@/lib/logger';

export const getAllApprovedTools = async () => {
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
