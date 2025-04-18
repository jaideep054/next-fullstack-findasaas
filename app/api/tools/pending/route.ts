import { NextRequest, NextResponse } from "next/server";
import { getPendingApprovalTools } from "@/service/toolService";

export async function GET(req: NextRequest) {
  return await getPendingApprovalTools(req);
}
