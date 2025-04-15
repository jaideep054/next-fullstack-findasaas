import PrivacyPolicy from "./PrivacyPolicy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for FindYourSaaS. Learn how we collect, use, and protect your information.",
  alternates: {
    canonical: "https://findyoursaas.com/privacy",
  },
};

const page = () => {
  return <PrivacyPolicy />;
};

export default page;
