import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb"; 
import { ToolData } from "@/models/ToolData"; 

export async function GET(req: NextRequest, context: { params: { toolId: string } }) {
  try {
    await connectDB();

    const { toolId } = context.params;

    if (!mongoose.Types.ObjectId.isValid(toolId)) {
      return NextResponse.json({ error: "Invalid Tool ID" }, { status: 400 });
    }

    const tool = await ToolData.findById(toolId).populate("submittedBy").populate("review_id");

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    return NextResponse.json(tool, { status: 200 });
  } catch (err) {
    console.error("[GET /api/tools/:toolId]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
