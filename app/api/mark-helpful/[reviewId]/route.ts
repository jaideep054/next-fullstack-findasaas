import { getUserFromToken } from "@/lib/utils/authmiddleware";
import { markReviewAsHelpful } from "@/service/reviewService";
import { NextRequest } from "next/server";


export async function GET(
  req: NextRequest,
  context: any,
) {
    const user = await getUserFromToken(req);
    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }


  const  { reviewId } = await context.params;
  return await markReviewAsHelpful(reviewId, user._id );
}
