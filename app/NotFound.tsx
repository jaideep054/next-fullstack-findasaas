"use client";
import { useRouter } from "next/navigation";
import React from "react";

const NotFound = ({ isPermanentlyGone = false }) => {
  const pageTitle = isPermanentlyGone ? "410 Gone" : "404 Not Found";
  const message = isPermanentlyGone
    ? "This page has been permanently removed and is no longer available."
    : "Oops! The page you are looking for doesn't exist. It might have been moved or deleted.";
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-center p-6">
        <h1 className="text-7xl md:text-9xl font-bold text-indigo-600 mb-4 animate-pulse">
          {isPermanentlyGone ? "410" : "404"}
        </h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-gray-800 mb-3">
          {isPermanentlyGone ? "Page Gone" : "Page Not Found"}
        </h2>
        <p className="text-md md:text-lg text-gray-600 mb-8 max-w-md">
          {message}
        </p>
        <p
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          Go Back Home
        </p>
      </div>
    </>
  );
};

export default NotFound
