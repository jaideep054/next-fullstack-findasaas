import validator from "validator";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";
import  User  from "@/models/User";
import { ToolData } from "@/models/ToolData";
import { buildNewsletterHtml } from "@/lib/utils/newsletterUtils";
import { sendNewsletterMail } from "./mailService";

export const subscribeUserToNewsletter = async (email: string) => {
  if (!email || !validator.isEmail(email)) {
    throw new Error("Invalid email");
  }

  let subscriber = await NewsletterSubscriber.findOne({ email });
  let user = await User.findOne({ email });

  if (subscriber?.status === "subscribed") {
    return { message: "This email is already subscribed.", status: 200 };
  }

  if (subscriber?.status === "unsubscribed") {
    subscriber.status = "subscribed";
    await subscriber.save();
    if (user) {
      user.subscribed = true;
      await user.save();
    }
    return { message: "Subscription successful! Thank you.", status: 201 };
  }

  // New subscription
  const newSubscriber = new NewsletterSubscriber({ email, status: "subscribed" });
  await newSubscriber.save();

  if (user) {
    user.subscribed = true;
    await user.save();
  }

  return { message: "Subscription successful! Thank you.", status: 201 };
};

export const unsubscribeUserFromNewsletter = async (email: string) => {
  const user = await User.findOne({ email });
  const subscription = await NewsletterSubscriber.findOne({ email });

  if (!user || !subscription) {
    throw new Error("User not found");
  }

  user.subscribed = false;
  subscription.status = "unsubscribed";

  await user.save();
  await subscription.save();

  return { message: "Unsubscribed", status: 200 };
};

export const sendMonthlyNewsletterService = async () => {
  const recipientEmails = ["tusharkapil20@gmail.com", "budhirajatanya47@gmail.com"];
  const topProducts = await ToolData.find({}).limit(3);

  if (!topProducts.length) {
    return { message: "No products to feature.", status: 200 };
  }

  const subject = "Your Monthly Top Products Newsletter!";
  const htmlContent = buildNewsletterHtml(topProducts);
  const textContent = `Top products: ${topProducts.map((p) => p.name).join(", ")}`;

  await sendNewsletterMail(recipientEmails, subject, htmlContent, textContent);

  return { message: "Newsletter sent", status: 200 };
};
