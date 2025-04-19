import { generateQueryEmbedding } from "@/lib/utils/generateLocalEmbedding";
import mongoose, { Document, Schema, Model } from "mongoose";
import { extractNumericPrice } from "@/lib/utils/common";

interface Platforms {
  Mac: boolean;
  Windows: boolean;
  Android: boolean;
  iOS: boolean;
  Web: boolean;
}

interface Feature {
  title: string;
  description: string;
}

export interface IToolData extends Document {
  name: string;
  logo: string;
  approved: boolean;
  user_rating: number;
  slug: string;
  review_id?: mongoose.Types.ObjectId;
  submittedBy: mongoose.Types.ObjectId;
  platforms: Platforms;
  features: Feature[];
  images: string[];
  category: string;
  pricing: string;
  priceValue: number;
  description: string;
  tool_url: string;
  status: "pending" | "approved" | "rejected";
  rejected_reason?: string;
  is_free: boolean;
  is_freemiun: boolean;
  is_onetime: boolean;
  is_paid: boolean;
  badgeCode: string;
  featured: boolean;
  embedding: number[];
  searchableText: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ToolDataSchema: Schema<IToolData> = new Schema(
  {
    name: { type: String },
    logo: { type: String },
    approved: { type: Boolean, default: false },
    user_rating: { type: Number, default: 0 },
    slug: { type: String, unique: true },
    review_id: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    platforms: {
      Mac: { type: Boolean, default: false },
      Windows: { type: Boolean, default: false },
      Android: { type: Boolean, default: false },
      iOS: { type: Boolean, default: false },
      Web: { type: Boolean, default: false },
    },
    features: [
      {
        title: { type: String },
        description: { type: String },
      },
    ],
    images: [{ type: String }],
    category: { type: String },
    pricing: { type: String },
    priceValue: { type: Number },
    description: { type: String },
    tool_url: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejected_reason: { type: String },
    is_free: { type: Boolean, default: false },
    is_freemiun: { type: Boolean, default: false },
    is_onetime: { type: Boolean, default: false },
    is_paid: { type: Boolean, default: false },
    badgeCode: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    embedding: { type: [Number], index: false },
    searchableText: { type: String, index: false },
  },
  { timestamps: true }
);

ToolDataSchema.pre<IToolData>("save", async function (next) {
  const featuresText = this.features.map((f) => `${f.title} ${f.description}`).join(" ");
  this.searchableText = `${this.name || ""} ${this.category || ""} ${this.description || ""} ${featuresText}`.trim();
  this.priceValue = extractNumericPrice(this.pricing);
  const embedding = await generateQueryEmbedding(this.searchableText);
  this.embedding = embedding ?? [];
  next();
});

export const ToolData: Model<IToolData> =
  mongoose.models.ToolData || mongoose.model<IToolData>("ToolData", ToolDataSchema);
