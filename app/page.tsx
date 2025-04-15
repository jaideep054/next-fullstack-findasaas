import { Landing } from "./Landing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Your SaaS | Discover & Compare SaaS Tools Directory",
  description:
    "Discover the right SaaS for your needs. Explore, compare, and find top software solutions for free. Looking to reach a wider audience? List your SaaS for free.",
  alternates: {
    canonical: "https://findyoursaas.com/",
  },
};

export default function Home() {
  return (
    <main className="">
      <Landing />
    </main>
  );
}
