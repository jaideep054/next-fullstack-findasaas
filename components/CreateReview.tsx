import React, { useState } from "react";
import ReviewCard from "./ReviewCard";
import { createReview, googleLogin } from "@/frontendservices/api";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

const CreateReview = ({ toolInfo, allReviews, productRating }: any) => {
  const { isLoggedIn } = useAuth();

  const [submitReviewOpen, setSubmitReviewOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    content: "",
  });

  const handleRatingChange = (rating: any) => {
    setUserRating(rating);
    setNewReview({ ...newReview, rating });
  };

  const handleReviewChange = (e: any) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const submitReview = async (e: any) => {
    e.preventDefault();

    const review = {
      tool_id: toolInfo._id,
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
    };

    const response = await createReview(review);

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }

    setNewReview({ rating: 0, title: "", content: "" });
    setUserRating(0);
    setSubmitReviewOpen(false);
  };

  const loginWithGoogle = async (e: any) => {
    e.preventDefault();
    await googleLogin();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${
                      star <= productRating?.averageRating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              {productRating && (
                <p className="ml-2 text-xl font-bold">
                  {productRating?.averageRating?.toFixed(2)} out of 5
                </p>
              )}
            </div>
            {allReviews && (
              <p className="text-sm text-gray-500">
                Based on {allReviews.length} customer reviews
              </p>
            )}
          </div>

          <button
            onClick={
              isLoggedIn ? () => setSubmitReviewOpen(true) : loginWithGoogle
            }
            className="mt-4 md:mt-0 hover:cursor-pointer bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Write a Review
          </button>
        </div>
      </div>
      {submitReviewOpen && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
          <h3 className="text-xl font-bold mb-4">Write Your Review</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-8 h-8 ${
                        star <= userRating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="review-title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="review-title"
                name="title"
                value={newReview.title}
                onChange={handleReviewChange}
                className="w-full px-3 py-2 border placeholder:text-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Summarize your experience"
              />
            </div>
            <div>
              <label
                htmlFor="review-content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Review
              </label>
              <textarea
                id="review-content"
                name="content"
                value={newReview.content}
                onChange={handleReviewChange}
                rows={4}
                className="w-full px-3 placeholder:text-gray-400 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="What did you like or dislike about this tool?"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSubmitReviewOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                disabled={
                  !newReview.rating || !newReview.title || !newReview.content
                }
                className={`px-4 py-2 rounded-md text-white ${
                  !newReview.rating || !newReview.title || !newReview.content
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
      <ReviewCard toolInfo={toolInfo} allReviews={allReviews} />
    </div>
  );
};

export default CreateReview;
