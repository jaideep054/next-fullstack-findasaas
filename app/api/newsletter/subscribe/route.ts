import { NextRequest, NextResponse } from "next/server";
import { subscribeUserToNewsletter } from "@/service/newsletterService";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const result = await subscribeUserToNewsletter(email);
    return NextResponse.json({ message: result.message }, { status: result.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
