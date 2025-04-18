import { createReview } from "@/service/reviewService";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return await createReview(req);
}
