import mongoose, { Document, Schema, Model } from "mongoose";

export interface IReview extends Document {
  user_id: mongoose.Types.ObjectId;
  tool_id: mongoose.Types.ObjectId;
  rating?: number;
  title?: string;
  content?: string;
  helpful: number;
  helpfulUsers: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ReviewSchema: Schema<IReview> = new Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tool_id: { type: mongoose.Schema.Types.ObjectId, ref: "ToolData", required: true },
    rating: { type: Number, min: 1, max: 5 },
    title: { type: String },
    content: { type: String },
    helpful: { type: Number, default: 0 },
    helpfulUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Export the model with overwrite check
export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
