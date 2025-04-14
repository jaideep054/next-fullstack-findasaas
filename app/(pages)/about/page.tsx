"use client";
import React, { useEffect } from "react";

const page = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div className="px-6 py-12 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 relative overflow-hidden">
      {/* <Helmet>
        <title>About</title>
        <meta name="description" content="Discover and list SaaS products for free! Founded by Tushar Kapil, our marketplace connects businesses and users to the best software solutions effortlessly." />
        <link rel="canonical" href="https://findyoursaas.com/about" />
      </Helmet> */}
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
        <p className="text-gray-600 text-sm mb-2">About</p>

        <h1 className="text-4xl font-bold text-gray-900 mb-10">
          Get To Know The Product
        </h1>
        <p className="text-gray-700 mb-6">
          <strong>FindYourSaaS</strong> is built to help businesses and
          individuals discover the right software solutions for their needs.
          Whether you're looking for marketing automation tools, project
          management software, or productivity apps, FindYourSaaS makes it
          easier to explore and compare SaaS products.
        </p>

        <p className="text-gray-700 mb-6">
          With a focus on providing unbiased reviews and practical insights,
          <strong> findyoursaas</strong> is growing into a go-to resource for
          anyone looking to optimize their workflow with the best software tools
          available. This is just the beginning, and the platform will continue
          evolving with new features to help users make smarter software
          choices.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Behind FindYourSaaS
        </h2>

        <p className="text-gray-700 mb-10">
          <strong>Tushar Kapil</strong> is the sole founder and developer behind
          FindYourSaaS, bringing his expertise in building tech solutions to
          create a platform that helps users navigate the vast landscape of SaaS
          products effectively.
        </p>
      </div>
    </div>
  );
};

export default page;
