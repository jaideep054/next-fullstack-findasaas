import { NextRequest, NextResponse } from "next/server";
import { unsubscribeUserFromNewsletter } from "@/service/newsletterService";
import { getUserFromToken } from "@/lib/utils/authmiddleware";

export async function POST(req: NextRequest) {
  try {

      const user : any = await getUserFromToken(req);
    const result = await unsubscribeUserFromNewsletter(user?.email);
    return NextResponse.json({ message: result.message }, { status: result.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
