import { getToolByUserId } from "@/service/toolService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: any) {
  const { userId } = await context.params;

  try {
    const tools = await getToolByUserId(userId);
    return NextResponse.json({ tool: tools }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching tools:", error.message);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
