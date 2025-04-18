// app/(pages)/tool/[id]/[slug]/page.tsx
import { Metadata } from "next";
import ToolPage from "./ToolPage";
import { getToolInformation } from "@/frontendservices/api";

// type Props = {
//   params: {
//     id: string;
//     slug: string;
//   };
// };

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { id, slug } = await params;

  const data = await getToolInformation(id as string);


  return {
    title: data?.name || slug  ,
    description: data?.description || "Default description",
    alternates: {
      canonical: `https://findyoursaas.com/tool/${id}/${slug}`,
    },
  };
}

export default function ToolSlugPage() {
  return <ToolPage />;
}
