import { getTotalRatingForProduct } from "@/service/reviewService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: any) {
  const { toolId } = await context.params;

  try {
    const data = await getTotalRatingForProduct(toolId);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
