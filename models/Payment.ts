import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPayment extends Document {
  user_id: mongoose.Types.ObjectId;
  amount: number;
  currency?: string;
  status: "pending" | "completed" | "failed";
  transaction_id?: string;
  paid_at?: Date;
  tier: "normal" | "featured";
  razorpay_order_id: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PaymentSchema: Schema<IPayment> = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    transaction_id: { type: String },
    paid_at: { type: Date },
    tier: { type: String, enum: ["normal", "featured"], default: "normal" },
    razorpay_order_id: { type: String, required: true },
    email: { type: String },
  },
  { timestamps: true }
);

export const Payment: Model<IPayment> = mongoose.model<IPayment>("Payment", PaymentSchema);
