import sg from "@sendgrid/mail";
import {
  ADMIN_MAIL_TEMPLATE_ID,
  LISTING_APPROVED_TEMPLATE_ID,
  LISTING_PENDING_TEMPLATE_ID,
  LISTING_REJECTED_TEMPLATE_ID,
  MAIL_LISTING_APPROVED,
  MAIL_LISTING_PENDING,
  MAIL_LISTING_REJECTED,
  MAIL_PAYMENT,
  MAIL_SIGN_UP,
  PAYMENT_TEMPLATE_ID,
  SIGNUP_TEMPLATE_ID,
  FEATURE_ROLL_OUT_TEMPLATE_ID,
  FEATURE_ROLL_OUT,
} from "@/lib/constants/constants";
import  User  from "../models/User";
import logger from "@/lib/logger";
import { Env } from "@/lib/env";

sg.setApiKey(Env.SENDGRID_API_KEY!);

type MailType =
  | typeof MAIL_SIGN_UP
  | typeof MAIL_PAYMENT
  | typeof MAIL_LISTING_PENDING
  | typeof MAIL_LISTING_APPROVED
  | typeof MAIL_LISTING_REJECTED
  | typeof FEATURE_ROLL_OUT;

interface DynamicTemplateData {
  [key: string]: any;
}

export const sendMail = async (to: string, data: DynamicTemplateData, type: MailType): Promise<void> => {
  try {
    let templateId: string | undefined;

    switch (type) {
      case MAIL_SIGN_UP:
        templateId = SIGNUP_TEMPLATE_ID;
        break;
      case MAIL_PAYMENT:
        templateId = PAYMENT_TEMPLATE_ID;
        break;
      case MAIL_LISTING_PENDING:
        templateId = LISTING_PENDING_TEMPLATE_ID;
        break;
      case MAIL_LISTING_APPROVED:
        templateId = LISTING_APPROVED_TEMPLATE_ID;
        break;
      case MAIL_LISTING_REJECTED:
        templateId = LISTING_REJECTED_TEMPLATE_ID;
        break;
      case FEATURE_ROLL_OUT:
        templateId = FEATURE_ROLL_OUT_TEMPLATE_ID;
        break;
    }

    logger.info("USING TEMPLATE ID:", templateId);

    const msg: sg.MailDataRequired = {
      to,
      from: "no-reply@findyoursaas.com",
      templateId: templateId!,
      dynamicTemplateData: data,
    };

    logger.info("SEND MAIL BODY:", msg);
    await sg.send(msg);
    logger.info("EMAIL SENT:");
  } catch (error: any) {
    logger.error("ERROR SENDING EMAIL:", error?.response?.body || error);
  }
};

export const mailToAdmin = async (): Promise<void> => {
  const templateId = ADMIN_MAIL_TEMPLATE_ID;

  logger.info("USING TEMPLATE ID:", templateId);

  const msg: sg.MailDataRequired = {
    to: "tusharkapil20@gmail.com",
    from: "no-reply@findyoursaas.com",
    templateId,
  };

  logger.info("SEND MAIL BODY:", msg);
  await sg.send(msg);
  logger.info("EMAIL SENT:");
};

export const mailToAllListed = async (data: DynamicTemplateData): Promise<void> => {
  try {
    const sellers = await User.find({ is_seller: true });

    if (sellers.length === 0) {
      logger.info("No sellers found.");
      return;
    }

    logger.info("TOTAL LISTED SELLERS:", sellers.length);

    for (const seller of sellers) {
      await sendMail(seller.email, data, FEATURE_ROLL_OUT);
    }

    logger.info(`Emails sent to ${sellers.length} sellers.`);
  } catch (error: any) {
    logger.error("MAIL ERROR:", error);
  }
};

export const sendNewsletterMail = async (
  to: string | string[],
  subject: string,
  htmlContent: string,
  textContent: string = ""
): Promise<void> => {
  const recipientEmails = Array.isArray(to) ? to : [to];

  const personalizations = recipientEmails.map((email) => ({
    to: [{ email }],
  }));

  const msg: sg.MailDataRequired = {
    personalizations,
    from: {
      email: "no-reply@findyoursaas.com",
      name: "FYS Newsletter",
    },
    subject,
    text: textContent || htmlContent.replace(/<[^>]*>?/gm, ""), // Fallback text
    html: htmlContent,
  };

  try {
    logger.info(`Attempting to send email to: ${recipientEmails.join(", ")}`);
    await sg.send(msg);
    logger.info(`Email sent successfully to: ${recipientEmails.join(", ")}`);
  } catch (error: any) {
    logger.error("ERROR SG:", error);
  }
};
