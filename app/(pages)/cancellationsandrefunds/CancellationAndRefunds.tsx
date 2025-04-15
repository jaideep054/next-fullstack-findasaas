"use client"
import React, { useEffect } from "react";

const CancellationAndRefunds = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="px-6 py-12 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 relative overflow-hidden">
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
        <p className="text-gray-600 text-sm mb-2">Legal</p>

        <h1 className="text-4xl font-bold text-gray-900 mb-10">Cancellations and Refunds Policy</h1>

        <div className="text-gray-700 space-y-6">
          <p>FYS strives to provide the best services to its customers. This policy outlines the terms and conditions for cancellations and refunds for products and services purchased from FYS.</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Cancellation Policy</h2>
          <p>Under this policy:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>All purchases made on FindYourSaaS are final and non-refundable.</li>
            <li>Cancellations will not result in a refund once a purchase has been completed.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Refund Policy</h2>
          <p>FindYourSaaS maintains a strict no-refund policy:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Once a payment is processed, no refunds will be issued under any circumstances.</li>
            <li>We encourage customers to review their purchase carefully before making payment.</li>
            <li>For any issues regarding your purchase, please contact our Customer Service team for assistance.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Contact Us</h2>
          <p>If you have any questions about our Cancellations and Refunds Policy, please contact our Customer Service team:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Email: tusharkapil62@gmail.com</li>
            <li>Phone: 9306249256</li>
          </ul>
        </div>

        <p className="text-gray-700 mt-10 text-sm">Last updated: March 31, 2025</p>
      </div>
    </div>
  );
};

export default CancellationAndRefunds