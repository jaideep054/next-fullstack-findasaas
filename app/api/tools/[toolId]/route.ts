import { NextRequest, NextResponse } from "next/server";
import { getToolById } from "@/service/toolService";

export async function GET(
  req: NextRequest,
  context: any
) {
  const { toolId } = await context.params;
  return await getToolById(toolId);
}
