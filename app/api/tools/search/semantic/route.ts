import { NextRequest, NextResponse } from "next/server";

import { semanticsearchQuery } from "@/service/toolService";


export async function GET(
  req: NextRequest,
) {
  return await semanticsearchQuery(req);
}