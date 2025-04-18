import { getReviewsForProduct } from "@/service/reviewService";
import { NextRequest, NextResponse } from "next/server";
// import { getToolById } from "@/service/toolService";

export async function GET(
  req: NextRequest,
  context: any
) {
  const { toolId } = context.params;
  return await getReviewsForProduct(toolId);
}
