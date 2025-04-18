import { IncomingForm } from "formidable";
import { listTool } from "@/service/toolService";
import { getUserFromToken } from "@/lib/utils/authmiddleware";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {


  const user = await getUserFromToken(req);
  if (!user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

 
}
