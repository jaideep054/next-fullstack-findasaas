import Contact from "./Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with us! Whether you have questions, feedback, or partnership inquiries, we're here to help. Contact us today and let's connect.",
  alternates: {
    canonical: "https://findyoursaas.com/contactus",
  },
};

const page = () => {
  return <Contact />;
};

export default page;
