import mongoose, { Document, Schema, Model } from "mongoose";

export interface IAnalytics extends Document {
  tool_id: mongoose.Types.ObjectId;
  event_type: "click" | "link_click";
  count: number;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const AnalyticsSchema: Schema<IAnalytics> = new mongoose.Schema(
  {
    tool_id: { type: mongoose.Schema.Types.ObjectId, ref: "ToolData", required: true },
    event_type: { type: String, required: true, enum: ["click", "link_click"] },
    count: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Analytics: Model<IAnalytics> =   mongoose.models.Analytics || mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);
