import { getUserFromToken } from "@/lib/utils/authmiddleware";
import { trackAnalyticsService } from "@/service/analyticsService";
import { NextRequest , NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {


    const body = await req.json();
    const { tool_id, event_type } = body;

    if (!tool_id || !event_type) {
     
      return NextResponse.json({ message: "tool_id and event_type are required" }, { status: 400 });

    }

    await trackAnalyticsService(tool_id, event_type);


    return NextResponse.json({ message: "Event tracked successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Error tracking analytics:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
   
  }
}
