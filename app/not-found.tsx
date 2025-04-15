import NotFound from "./NotFound";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 Not Found",
  description:
    "Oops! The page you are looking for doesn't exist. It might have been moved or deleted.",
  robots: "noindex"
};

const page = () => {
  return <NotFound />;
};

export default page;
