import { NextApiRequest, NextApiResponse } from "next";
import { Review } from "../models/Review";
import  logger  from "../lib/logger" 
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getUserFromToken } from "@/lib/utils/authmiddleware";

// Extend NextApiRequest to include the authenticated user
interface NextApiRequestWithUser extends NextApiRequest {
  user: {
    _id: Types.ObjectId;
    id?: Types.ObjectId;
  };
}

export const createReview = async (req: NextRequest) => {
  try {
    await connectDB();


    const { tool_id, rating, title, content } = await req.json();

    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }


    const existingReview = await Review.findOne({ user_id: user._id, tool_id });
    if (existingReview) {
      return NextResponse.json({ message: "You have already reviewed this product." }, { status: 400 });
    }

    const newReview = new Review({ user_id: user._id, tool_id, rating, title, content });
    await newReview.save();

    return NextResponse.json({
      success: true,
      message: "Review created successfully",
      review: newReview,
    }, { status: 201 });

  } catch (error: any) {
    console.error("ERROR:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
};


export const getReviewsForProduct = async (toolId: string) => {
  try {
    console.info("REVIEW REQ:", toolId);
    const reviews = await Review.find({ tool_id: toolId }).populate(
      "user_id",
      "name email profile_picture is_seller"
    );
    return NextResponse.json(reviews, { status: 200 });
  } catch (error: any) {
    console.error("ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const getTotalRatingForProduct = async (toolId: string) => {
  try {
  

    const reviews  = await Review.find({ tool_id: toolId });

    if (reviews.length === 0) {
      return NextResponse.json({ averageRating: 0, totalReviews: 0 }, { status: 200 });
    }

    const totalRating = reviews.reduce((sum, review) => sum + review?.rating, 0);
    const averageRating = totalRating / reviews.length;

    return NextResponse.json({ averageRating, totalReviews: reviews.length }, { status: 200 }); 
  } catch (error: any) {
    console.error("ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const markReviewAsHelpful = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  try {
    const { reviewId } = req.query;
    const user_id = req.user.id || req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (!review.helpfulUsers) {
      review.helpfulUsers = [];
    }

    if (review.helpfulUsers.includes(user_id)) {
      return res.status(400).json({ message: "You have already marked this review as helpful." });
    }

    review.helpful += 1;
    review.helpfulUsers.push(user_id);
    await review.save();

    return res.status(200).json({
      message: "Marked review as helpful",
      helpfulCount: review.helpful,
      success: true,
    });
  } catch (error: any) {
    logger.error("ERROR:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
