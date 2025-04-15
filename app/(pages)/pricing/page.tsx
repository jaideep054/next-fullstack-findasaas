import Pricing from "./Pricing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & FAQ - Find Your SaaS",
  description:
    "Explore our pricing plans! Get a lifetime free listing or choose our featured plan for premium visibility. Check our FAQ for details.",
  alternates: {
    canonical: "https://findyoursaas.com/pricing",
  },
};

const page = () => {
  return <Pricing />;
};

export default page;
