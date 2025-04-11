// lib/models/User.ts
import mongoose, { Document, Model } from "mongoose";

// Define interface for User document
export interface IUser extends Document {
  google_id?: string;
  email: string;
  name?: string;
  profile_picture?: string;
  is_seller: boolean;
  payment_status: "pending" | "completed";
  tier: "normal" | "featured" | "free";
  role: "user" | "admin";
  subscribed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const UserSchema = new mongoose.Schema(
  {
    google_id: {
      type: String,
    },
    email: { type: String, required: true, unique: true },
    name: {
      type: String,
    },
    profile_picture: {
      type: String,
    },
    is_seller: { type: Boolean, default: false },
    payment_status: { 
      type: String, 
      enum: ["pending", "completed"], 
      default: "pending" 
    },
    tier: { 
      type: String, 
      enum: ["normal", "featured", "free"], 
      default: "free", 
      required: true 
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    subscribed: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User as Model<IUser>;