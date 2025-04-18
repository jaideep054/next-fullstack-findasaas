"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const ReviewToast = ({ reviews }: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mostHelpfulReview, setMostHelpfulReview] = useState<any>(null);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const sortedReviews = [...reviews].sort(
        (a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0)
      );
      setMostHelpfulReview(sortedReviews[0]);

      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [reviews]);

  const closeToast = () => {
    setIsVisible(false);
  };

  if (!mostHelpfulReview) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 max-w-sm"
          initial={{ opacity: 0, y: 50, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">Top Review</h3>
                <button
                  onClick={closeToast}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-3 flex">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {mostHelpfulReview?.user_id?.profile_picture ? (
                      <Image
                        loading="lazy"
                        src={mostHelpfulReview?.user_id?.profile_picture}
                        alt={mostHelpfulReview?.user_id?.name || "User"}
                        className="w-10 h-10 rounded-full object-cover"
                        width={500}
                        height={500}
                      />
                    ) : (
                      <svg
                        className="w-6 h-6 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {mostHelpfulReview?.user_id?.name || "Anonymous User"}
                  </p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < (mostHelpfulReview.rating || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <h4 className="font-medium text-gray-900">
                  {mostHelpfulReview?.title}
                </h4>
                <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                  {mostHelpfulReview?.content}
                </p>
              </div>

              <div className="mt-3 flex items-center text-sm text-gray-500">
                <svg
                  className="w-4 h-4 mr-1 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span>
                  {mostHelpfulReview?.helpful || 0}{" "}
                  {mostHelpfulReview?.helpful === 1 ? "person" : "people"} found
                  this helpful
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewToast;
