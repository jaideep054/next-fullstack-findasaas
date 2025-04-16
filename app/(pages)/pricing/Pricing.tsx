"use client"

import React, { useEffect, useState } from "react";
import { faqs } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuth";
import { getToolByUserId, googleLogin } from "@/services/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { displayRazorpay } from "@/app/payment/razorpay";

const Pricing = () => {
  const { isLoggedIn, user, alreadyListed } = useAuth();
  const [openFAQ, setOpenFAQ] = useState<number|any>(null);
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(100, 100);
  }, []);
  const toggleFAQ = (index:number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleFeaturedPayment = async (e:any, tier:string) => {
    let userFetchedTool;
    if (user) {
      userFetchedTool = await getToolByUserId(user?._id);
    }

    e.preventDefault();

    // } else if (alreadyListed && userFetchedTool && !userFetchedTool[0]?.approved) {
    //   toast.error("Your tool is either under review or rejected. Please wait before featuring your tool.");}

    if (!isLoggedIn) {
      await googleLogin();
    } else if (user?.tier && user.tier === "featured" && !alreadyListed) {
      router.push("/onboard");
    } else if (user?.tier && user.tier === "featured") {
      toast.success("You are already featured.");
      router.push("/profile");
    } else {
      await displayRazorpay(5, user, tier);
    }
  };

  const handleFreeTierAction = async (e:any) => {
    e.preventDefault();
    if (!isLoggedIn) {
      await googleLogin();
    } else if (alreadyListed) {
      router.push("/profile");
    } else {
      router.push("/onboard");
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
    hover: {
      y: -10,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: { duration: 0.3 },
    },
  };

  const faqVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const faqItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const floatingBubbleVariants:any = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 py-16 overflow-hidden relative">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute top-20 left-20" variants={floatingBubbleVariants} animate="animate">
          <svg width="80" height="80" viewBox="0 0 80 80">
            {" "}
            <circle cx="40" cy="40" r="40" fill="rgba(79, 70, 229, 0.1)" />{" "}
          </svg>
        </motion.div>
        <motion.div className="absolute top-40 right-40" variants={floatingBubbleVariants} animate="animate" transition={{ delay: 1 }}>
          <svg width="60" height="60" viewBox="0 0 60 60">
            {" "}
            <circle cx="30" cy="30" r="30" fill="rgba(139, 92, 246, 0.1)" />{" "}
          </svg>
        </motion.div>
        <motion.div className="absolute bottom-20 left-1/4" variants={floatingBubbleVariants} animate="animate" transition={{ delay: 0.5 }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            {" "}
            <circle cx="50" cy="50" r="50" fill="rgba(124, 58, 237, 0.1)" />{" "}
          </svg>
        </motion.div>
        <svg className="absolute bottom-0 left-0 w-full opacity-10" viewBox="0 0 1440 320">
          <path fill="rgb(79, 70, 229)" d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,170.7C672,181,768,235,864,234.7C960,235,1056,181,1152,170.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto p-4 font-sans relative z-10">
        {/* Pricing Section */}
        <div className="mb-16">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl font-bold mb-3 text-gray-800">Join the NewGen SaaS Discovery Site</h1>
            <p className="text-gray-600 text-lg">List your SaaS and reach potential buyers. Select the plan that fits you best.</p>
          </motion.div>

          {/* Pricing Cards Container */}
          <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8 lg:gap-12">
            {/* Card 1: Free Tier */}
            <motion.div
              className="relative flex-1 max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col" // Added flex-col
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              whileHover="hover"
            >
              <div className="p-8 flex flex-col flex-grow">
                {" "}
                {/* Added flex-grow */}
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Standard Listing</h2>
                <div className="flex items-baseline justify-center mb-2">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center">
                      <span className="text-gray-400 line-through text-3xl font-bold">$15</span>
                      <span className="text-5xl font-bold text-black ml-3">$0</span>
                    </div>
                    <span className="text-indigo-600 text-sm mt-1 font-medium">Limited Time Offer!</span>
                  </div>
                  <span className="text-gray-500 ml-2">/one-off</span>
                </div>
                <p className="text-center text-gray-500 mb-6">Get started by listing your tool for free.</p>
                <div className="my-6 space-y-3 flex-grow">
                  {" "}
                  {/* Added flex-grow */}
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p className="text-gray-600">Basic Listing Included</p>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p className="text-gray-600">Submitted within 24 hours</p>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p className="text-gray-600">Lifetime Free Listing</p>
                  </div>
                </div>
                <motion.div className="mt-auto" whileHover={{ scale: 1.03 }} whileTap={{ scale: 1 }}>
                  {/* Use Link component for navigation or simple button styling if triggering JS */}
                  <button onClick={handleFreeTierAction} className="w-full cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-md flex items-center justify-center font-medium transition-colors duration-200">
                    {isLoggedIn ? (alreadyListed ? "Go to Profile" : "Submit Your Tool") : "Submit Your Tool"}
                  </button>
                </motion.div>
              </div>
            </motion.div>

            {/* Card 2: Featured Tier */}
            <motion.div
              className="relative flex-1 max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden border-2 border-indigo-500 flex flex-col" // Added flex-col, shadow-lg, border
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }} // Slightly delayed animation
              whileHover="hover"
            >
              <div className="p-8 flex flex-col flex-grow">
                {/* Added flex-grow */}
                <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-700">Featured Listing</h2>
                <div className="flex items-baseline justify-center mb-2">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center">
                      <span className="text-gray-400 line-through text-3xl font-bold">$30</span>
                      <span className="text-5xl font-bold text-black ml-3">$5</span>
                    </div>
                    <span className="text-indigo-600 text-sm mt-1 font-medium">Special Launch Offer!</span>
                  </div>
                  <span className="text-gray-500 ml-2">/one-off</span>
                </div>
                <p className="text-center text-gray-500 mb-6">Maximize visibility and get premium benefits.</p>
                <div className="my-6 space-y-3 flex-grow">
                  {/* Added flex-grow */}
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p className="text-gray-600">All Standard features</p>
                  </div>
                  <div className="flex items-center font-semibold text-indigo-800">
                    <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p>Featured tag & highlighted card</p>
                  </div>
                  <div className="flex items-center font-semibold text-indigo-800">
                    <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p>Priority placement (Top Results)</p>
                  </div>
                  <div className="flex items-center font-semibold text-indigo-800">
                    <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p>Unlock listing analytics</p>
                  </div>
                  <div className="flex items-center font-semibold text-indigo-800">
                    <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p>Social media promotions</p>
                  </div>
                  <div className="flex items-center font-semibold text-indigo-800">
                    <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p>Newsletter promotions (Soon)</p>
                  </div>
                  <div className="flex items-center font-semibold text-indigo-800">
                    <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p>Featured blog posts (Soon)</p>
                  </div>
                </div>
                <motion.div className="mt-auto" whileHover={{ scale: 1.03 }} whileTap={{ scale: 1 }}>
                  <button
                    onClick={(e) => handleFeaturedPayment(e, "featured")} // Call payment handler
                    className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md flex items-center justify-center font-medium transition-colors duration-200"
                  >
                    {/* We might need more sophisticated logic here if user is already featured */}
                    {isLoggedIn ? (alreadyListed ? "Upgrade To Featured Listing" : "Submit Your Tool") : "Submit Your Tool"}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section - Keep as is */}
        <motion.div className="mt-24 mb-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-8 text-gray-800">Frequently Asked Questions</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Got questions? We've got answers. If you don't find what you're looking for, feel free to contact us.</p>

          <motion.div className="max-w-3xl mx-auto space-y-6" variants={faqVariants} initial="hidden" animate="visible">
            {faqs.map((faq:Ifaqs, index:number) => (
              <motion.div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" variants={faqItemVariants}>
                <motion.div className="flex justify-between items-center cursor-pointer p-5 hover:bg-gray-50 transition-colors duration-200" onClick={() => toggleFAQ(index)}>
                  <div className="flex items-start">
                    {" "}
                    {/* Use items-start for alignment */}
                    {/* <span className="text-indigo-600 text-lg font-semibold mr-4 hidden sm:inline">{faq.id}</span> */}
                    <h3 className="text-lg font-medium text-gray-800">{faq.question}</h3>
                  </div>
                  <motion.div
                    className="text-indigo-500 ml-4 flex-shrink-0" // Added margin and shrink
                    animate={{ rotate: openFAQ === index ? -180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{
                    height: openFAQ === index ? "auto" : 0,
                    opacity: openFAQ === index ? 1 : 0,
                    marginTop: openFAQ === index ? "0px" : "0px", // Adjust spacing if needed
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-2 text-gray-600 leading-relaxed">{faq.answer}</div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing