import mongoose from "mongoose";
import { Analytics } from "@/models/Analytics";
import { ToolData } from "@/models/ToolData";
import  User  from "@/models/User";
import { getDateRange } from "@/lib/utils/dateUtils";
import  logger  from "@/lib/logger";

export const trackAnalyticsService = async (tool_id: string, event_type: string) => {
  if (!tool_id || !event_type) {
    throw new Error("Tool ID and event type are required");
  }

  const date = new Date(new Date().setHours(0, 0, 0, 0));

  await Analytics.updateOne(
    { tool_id, event_type, date },
    { $inc: { count: 1 } },
    { upsert: true }
  );

  console.info("ADDED TRACK EVENT");
};

export const getToolAnalyticsService = async (toolId: string, filter: string) => {
  if (!mongoose.Types.ObjectId.isValid(toolId)) {
    throw new Error("Invalid tool ID format");
  }

  const { startDate, endDate } = getDateRange(filter);
  logger.info(`ANALYTICS DATE RANGE: ${startDate} - ${endDate}`);

  const userTool = await ToolData.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(toolId) } },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "tool_id",
        as: "reviews",
      },
    },
    {
      $addFields: {
        user_avg_rating: { $avg: "$reviews.rating" },
      },
    },
    {
      $project: {
        reviews: 0,
      },
    },
  ]);

  const analytics = await Analytics.aggregate([
    {
      $match: {
        tool_id: new mongoose.Types.ObjectId(toolId),
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: { event_type: "$event_type", date: "$date" },
        count: { $sum: "$count" },
      },
    },
    {
      $group: {
        _id: "$_id.event_type",
        data: {
          $push: {
            tool_id: toolId,
            event_type: "$_id.event_type",
            count: "$count",
            date: "$_id.date",
          },
        },
      },
    },
  ]);

  const lastActivityData = await Analytics.findOne(
    { tool_id: new mongoose.Types.ObjectId(toolId) },
    { date: 1, event_type: 1 }
  ).sort({ date: -1 });

  const toolUser = await User.findById(userTool[0]?.submittedBy);

  const response: any = {
    tool: userTool[0],
    last_activity: lastActivityData?.date || null,
    user: toolUser,
    clickEventTotal: 0,
    linkClickEventTotal: 0,
  };

  analytics.forEach((event) => {
    const key = `${event._id}_event`;
    response[key] = event.data;

    if (event._id === "click") {
      response.clickEventTotal = event.data.reduce((sum: any , e: any) => sum + e.count, 0);
    }

    if (event._id === "link_click") {
      response.linkClickEventTotal = event.data.reduce((sum: any, e: any) => sum + e.count, 0);
    }
  });

  return response;
};
