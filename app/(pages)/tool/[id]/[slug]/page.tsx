// app/(pages)/tool/[id]/[slug]/page.tsx
import { Metadata } from "next";
import ToolPage from "./ToolPage";

type Props = {
  params: {
    id: string;
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  // You can fetch data here based on slug/id
  const data = {
    title: "Tool Edit Title",
    description: "Tool edit description",
  };

  return {
    title: data.title || slug,
    description: data.description || "Default description",
    alternates: {
      canonical: `https://findyoursaas.com/tool/${params.id}/${slug}`,
    },
  };
}

export default function page({ params }: Props) {
  return <ToolPage />;
}
