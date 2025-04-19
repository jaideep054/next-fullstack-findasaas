"use client"
import React, { useEffect, useState } from "react";
import { markReviewHelpful } from "@/frontendservices/api";
import toast from "react-hot-toast";
import Image from "next/image";

const ReviewCard = ({ allReviews }:any) => {
  const [reviews, setReviews] = useState(allReviews);

  useEffect(() => {
    setReviews(allReviews);
  }, [allReviews]);

  const markAsHelpful = async (reviewId:any) => {
    const response = await markReviewHelpful(reviewId);
    
    if (response.success) {
      setReviews((prevReviews:any) => prevReviews.map((review:any) => (review._id === reviewId ? { ...review, helpful: review.helpful + 1 } : review)));
    } else {
      toast.error(response.message);
    }
  };

  

  return (
    <div className="space-y-6 mt-10">
      {reviews?.map((review:any) => (
        <div key={review?._id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start">
            <Image height={500} width={500} loading="lazy" src={review?.user_id?.profile_picture} alt={review?.user_id?.name} className="w-12 h-12 rounded-full mr-4" />
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                <h3 className="font-bold">{review?.user_id?.name}</h3>
                <div className="text-sm text-gray-500">
                  {(() => {
                    const date = new Date(review.createdAt);
                    const options:any = { day: "2-digit", month: "short", year: "numeric" };
                    return date.toLocaleDateString("en-GB", options);
                  })()}
                </div>
              </div>

              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className={`w-5 h-5 ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>

              <h4 className="font-medium text-lg mb-2">{review.title}</h4>
              <p className="text-gray-700 mb-4">{review.content}</p>

              <div className="flex items-center space-x-2">
                <button onClick={() => markAsHelpful(review._id)} className="flex cursor-pointer items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                  </svg>
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewCard;
