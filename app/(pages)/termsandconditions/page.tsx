import TC from "./TC";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Terms and conditions for using FindYourSaaS. Please read these terms carefully before using our platform.",
  alternates: {
    canonical: "https://findyoursaas.com/terms",
  },
};

const page = () => {
  return <TC />;
};

export default page;
