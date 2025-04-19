
import { generateBadge } from "@/service/toolService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest , context: any) {
  try {
    const { searchParams } = req.nextUrl;
    // const body = await req.json();
    // const tool_id = body.tool_id;
    const { tool_id } = await context.params;

    const mode = searchParams.get("mode") || "light";

    if (!tool_id) {
      return NextResponse.json({ message: "tool_id is required" }, { status: 400 });
    }

    const { badgeCode, badgePreview } = await generateBadge(tool_id, mode);

    return NextResponse.json({
      success: true,
      badgeCode,
      badgePreview,
    });
  } catch (error: any) {
    console.error("Error generating badge:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
