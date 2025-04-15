import Explore from "./Explore";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore SaaS Tools | Find Your SaaS",
  description:
    "Explore and search for the perfect SaaS tools. Filter by category, price, and more to find exactly what you need.",
  alternates: {
    canonical: "https://findyoursaas.com/explore",
  },
};

const page = () => {
  return <Explore />;
};

export default page;
