import mongoose, { Document, Schema, Model } from "mongoose";

export interface INewsletterSubscriber extends Document {
  email: string;
  subscribedAt: Date;
  status: "subscribed" | "unsubscribed";
}

const NewsletterSubscriberSchema: Schema<INewsletterSubscriber> = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["subscribed", "unsubscribed"],
    default: "subscribed",
  },
});

export const NewsletterSubscriber: Model<INewsletterSubscriber> =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model<INewsletterSubscriber>("NewsletterSubscriber", NewsletterSubscriberSchema);
