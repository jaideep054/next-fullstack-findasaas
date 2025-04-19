import { getUserFromToken } from "@/lib/utils/authmiddleware";
import { getToolAnalyticsService, trackAnalyticsService } from "@/service/analyticsService";
import { NextRequest , NextResponse } from "next/server";

export async function GET(req: NextRequest, context: any) {


    const { searchParams } = req.nextUrl;

    const toolId = searchParams.get('toolId');
    const filter = searchParams.get('filter');
  


  try {
    const user = await getUserFromToken(req);
    if (!user) {

      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    }


      

    if (!toolId || !filter) {
     
      return NextResponse.json({ message: "tool_id and event_type are required" }, { status: 400 });

    }


   const response = await getToolAnalyticsService(toolId, filter);


    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {
    console.error("Error tracking analytics:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
   
  }
}
