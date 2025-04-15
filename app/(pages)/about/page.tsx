import About from "./About";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Discover and list SaaS products for free! Founded by Tushar Kapil, our marketplace connects businesses and users to the best software solutions effortlessly.",
  alternates: {
    canonical: "https://findyoursaas.com/about",
  },
};

const page = () => {
  return <About />;
};

export default page;
