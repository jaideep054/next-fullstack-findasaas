import CancellationAndRefunds from "./CancellationAndRefunds";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellations and Refunds",
  description:
    "Cancellations and refunds policy for FindYourSaaS. Learn about our process for cancellations and non-refundable purchases.",
  alternates: {
    canonical: "https://findyoursaas.com/cancellations-refunds",
  },
};

const page = () => {
  return <CancellationAndRefunds />;
};

export default page;
