"use client"
import React, { useEffect } from "react";

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div className="px-6 py-12 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 relative overflow-hidden">

      <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto ">
        <p className="text-gray-600 text-sm mb-2">Contact</p>

        <h1 className="text-4xl font-bold text-gray-900 mb-10">
          Get in Touch with Our Team
        </h1>

        <p className="text-gray-700 mb-6">
          <strong>FindYourSaaS</strong> is dedicated to helping individuals and
          businesses discover the best software solutions for their needs. Our
          goal is to simplify the software selection process by providing
          insights and recommendations to help you find the right tools for work
          and productivity.
        </p>

        <p className="text-gray-700 mb-10">
          Founded by <strong>Tushar Kapil</strong>, a software developer
          passionate about technology and efficiency,{" "}
          <strong>FindYourSaaS</strong> is built to be a trusted resource for
          exploring SaaS products without bias.
        </p>

        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Before You Contact, Please Note:
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              We provide independent reviews and insights on software tools.
            </li>
            <li>
              Our objective is to offer informative, unbiased recommendations.
            </li>
          </ul>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Looking to Become a Sponsor?
          </h2>
          <p className="text-gray-700 mb-4">
            Sponsorship opportunities are available for businesses looking to
            expand their reach. You can promote your product through targeted
            display ads, newsletters, and search campaigns.
          </p>
          <p className="text-gray-700 font-semibold">
            Thank you for your interest in FindYourSaaS!
          </p>
        </div>

        <div className="text-center py-4">
          <p className="text-gray-700">
            📩 <strong>Get in touch:</strong>{" "}
            <a
              href="mailto:tusharkapil62@gmail.com"
              className="text-purple-600 hover:text-purple-800"
            >
              tusharkapil62@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact
