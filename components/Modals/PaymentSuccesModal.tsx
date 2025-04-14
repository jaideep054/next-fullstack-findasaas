"use client"
import React from "react";

export function SuccessModal({ tier, onClose }:any) {
  const benefits:any = {
    featured: ["Featured tag & highlighted card", "Priority placement (Top Results)", "Access to premium analytics", "Social media promotions", "Newsletter promotions through mail (Soon)"],
  };

  const tierBenefits = benefits[tier] || benefits["featured"];

  const displayTier = typeof tier === "string" && tier ? tier : "Featured"; // Default display name

  return (
    // Use direct RGBA for the semi-transparent background
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
      {" "}
      {/* Added p-4 for small screen padding */}
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-md w-full">
        {" "}
        {/* Added shadow-xl, adjusted padding */}
        <div className="flex justify-between items-start mb-6">
          {" "}
          {/* Changed items-center to items-start */}
          <h2 className="text-2xl font-bold text-gray-800">Congratulations! 🎉</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
            aria-label="Close modal" // Added aria-label for accessibility
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <p className="text-lg mb-4 text-gray-700">
          {" "}
          {/* Adjusted text color */}
          Your listing has been successfully updated to the <span className="font-semibold text-blue-600 capitalize">{displayTier} Tier</span>! {/* Used font-semibold, capitalize */}
        </p>
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Your new benefits include:</h3> {/* Adjusted font-weight, margin */}
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            {" "}
            {/* Changed list style, spacing */}
            {tierBenefits.map((benefit:any, index:number) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150" // Adjusted padding, added focus states
        >
          Got it, thanks!
        </button>
      </div>
    </div>
  );
}
