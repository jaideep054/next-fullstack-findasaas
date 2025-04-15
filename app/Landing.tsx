"use client"
import React, { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { motion } from "framer-motion";
import { NewsletterModal } from "@/components/Modals/NewsletterModal";
import { useRouter } from "next/navigation";
import { getApprovedTools, searchTool } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { ToolCard } from "@/components/Modals/ToolCard";

export const Landing = () => {
  const { user } = useAuth();
  const [toolsCards, setToolsCards] = useState([]);
  const [filteredTools, setFilteredTools] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const callGetApprovedTools = async () => {
      const data: any = await getApprovedTools();
      setToolsCards(data);
      setFilteredTools(data);
    };

    callGetApprovedTools();
  }, []);

  // Filter tools
  useEffect(() => {
    let updatedTools = toolsCards;

    if (filter === "free") {
      updatedTools = toolsCards.filter((tool: any) => tool.is_free);
    } else if (filter === "paid") {
      updatedTools = toolsCards.filter(
        (tool: any) => !tool.is_free && !tool.is_freemiun && !tool.is_onetime
      );
    } else if (filter === "freemium") {
      updatedTools = toolsCards.filter((tool: any) => tool.is_freemiun);
    } else if (filter === "onetime") {
      updatedTools = toolsCards.filter((tool: any) => tool.is_onetime);
    }

    setFilteredTools(updatedTools);
  }, [filter, toolsCards]);

  // Search with debouncing
  const handleSearch = debounce(async (query: any) => {
    if (query == null || !query.trim()) {
      return;
    }

    try {
      const results = await searchTool(query);

      if (!results || !Array.isArray(results)) {
        return;
      }

      setFilteredTools(results);
    } catch (error) {}
  }, 700);

  useEffect(() => {
    if (!searchQuery || !searchQuery.trim()) {
      setFilteredTools(toolsCards);
    } else {
      handleSearch(searchQuery);
    }
  }, [searchQuery, toolsCards]);

  const floatingBubbleVariants: any = {
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
    //
    <div className="min-h-screen">
      {!user?.subscribed && (
        <NewsletterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* First Part - Hero Section with Gradient Background */}
      <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 relative overflow-hidden">
        {/* Abstract SVG shapes with animations */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 600"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.circle
              cx="400"
              cy="300"
              r="250"
              fill="url(#grad1)"
              animate={{
                cx: [400, 410, 400, 390, 400],
                cy: [300, 310, 300, 290, 300],
                scale: [1, 1.03, 1, 0.97, 1],
              }}
              transition={{
                duration: 15,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />
            <motion.circle
              cx="700"
              cy="150"
              r="100"
              fill="url(#grad2)"
              animate={{
                cx: [700, 720, 700, 680, 700],
                cy: [150, 140, 150, 160, 150],
                scale: [1, 1.05, 1, 0.95, 1],
              }}
              transition={{
                duration: 12,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />
            <motion.circle
              cx="200"
              cy="450"
              r="150"
              fill="url(#grad3)"
              animate={{
                cx: [200, 220, 200, 180, 200],
                cy: [450, 460, 450, 440, 450],
                scale: [1, 1.04, 1, 0.96, 1],
              }}
              transition={{
                duration: 18,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Centered Hero Text - Mobile Optimized */}
        <motion.section
          className="px-4 sm:px-6 py-12 sm:py-16 max-w-7xl mx-auto flex flex-col items-center text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Every SaaS Tool You Need,
            <span className="block mt-1">One Click Away.</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl">
            Explore, compare, and discover the best SaaS products to power your
            business effortlessly.
          </p>
        </motion.section>
      </div>

      {/* Second Part - White Background for Search and Cards */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Search Bar with Floating Effect and Animation */}
          <motion.div
            className="relative -mt-8 w-full max-w-2xl mx-auto z-10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.12)",
            }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl p-1"
              animate={{
                boxShadow: [
                  "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  "0px 6px 16px rgba(0, 0, 0, 0.15)",
                  "0px 4px 12px rgba(0, 0, 0, 0.1)",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder={'Try: "Photo editing tools under $20"'}
                  className="w-full p-4 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <p onClick={() => router.push("/explore")}>
                  <motion.button
                    className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors flex items-center"
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                  >
                    <span>Explore</span>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="ml-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </motion.div>
                    )}
                  </motion.button>
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Tools Cards Section */}
          <motion.div
            className="mt-16 px-4 sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Title and Filter Buttons - Stack vertically on mobile, horizontally on larger screens */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-4 sm:space-y-0">
              <motion.h2
                className="text-xl sm:text-2xl font-bold"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                Popular SaaS Tools
              </motion.h2>

              {/* Filter buttons - Horizontal scrolling on mobile */}
              <motion.div
                className="flex pb-2 sm:pb-0 sm:flex-wrap sm:space-x-2 -mx-1 sm:mx-0"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex space-x-2 px-1 sm:px-0">
                  <motion.button
                    className={`whitespace-nowrap cursor-pointer px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filter === "all"
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setFilter("all")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    All
                  </motion.button>
                  <motion.button
                    className={`whitespace-nowrap cursor-pointer px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filter === "paid"
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setFilter("paid")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Paid
                  </motion.button>
                  <motion.button
                    className={`whitespace-nowrap cursor-pointer px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filter === "free"
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setFilter("free")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Free
                  </motion.button>
                  <motion.button
                    className={`whitespace-nowrap cursor-pointer px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filter === "freemium"
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setFilter("freemium")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Freemium
                  </motion.button>
                  <motion.button
                    className={`whitespace-nowrap cursor-pointer px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filter === "onetime"
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setFilter("onetime")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    OneTime
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Floating Bubbles - Hide on small screens, show on medium and up */}
            <div className="hidden md:block">
              <motion.div
                className="absolute top-20 left-20 max-w-full"
                variants={floatingBubbleVariants}
                animate="animate"
              >
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle
                    cx={40}
                    cy={40}
                    r="40"
                    fill="rgba(79, 70, 229, 0.1)"
                  />
                </svg>
              </motion.div>

              <motion.div
                className="absolute top-40 right-40 max-w-full"
                variants={floatingBubbleVariants}
                animate="animate"
                transition={{ delay: 1 }}
              >
                <svg width="60" height="60" viewBox="0 0 60 60">
                  <circle
                    cx={30}
                    cy={30}
                    r="30"
                    fill="rgba(139, 92, 246, 0.1)"
                  />
                </svg>
              </motion.div>

              <motion.div
                className="absolute bottom-20 left-1/4 max-w-full"
                variants={floatingBubbleVariants}
                animate="animate"
                transition={{ delay: 0.5 }}
              >
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle
                    cx={50}
                    cy={50}
                    r="50"
                    fill="rgba(124, 58, 237, 0.1)"
                  />
                </svg>
              </motion.div>

              <motion.div
                className="absolute bottom-40 left-1/2 max-w-full"
                variants={floatingBubbleVariants}
                animate="animate"
                transition={{ delay: 0.5 }}
              >
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="50"
                    fill="rgba(124, 58, 237, 0.1)"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Tool Cards Grid - Responsive columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
              {filteredTools.map((card: any, index: number) => (
                <ToolCard card={card} key={card._id} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
