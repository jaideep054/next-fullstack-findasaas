import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    transaction_id: String,
    stripe_payment_intent_id: { type: String, required: true },
    paid_at: Date,
    tier: { type: String, enum: ["normal", "featured"], default: "normal" },
    email: { type: String },
  },
  { timestamps: true }
);

export const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
