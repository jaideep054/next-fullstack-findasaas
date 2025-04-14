"use client"

import React, { useEffect, useState } from "react";
import { ToolCard } from "@/components/Modals/ToolCard";
import { getApprovedTools, searchTool } from "@/services/api";
import debounce from "lodash.debounce";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "@/utils/constants";

const page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [toolsCards, setToolsCards] = useState<any>([]);
  const [filteredTools, setFilteredTools] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [pricingTypeFilter, setPricingTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("all");

  useEffect(() => {
    const callGetApprovedTools = async () => {
      setIsLoading(true);
      try {
        const data:any = await getApprovedTools();
        setToolsCards(data);
        setFilteredTools(data);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    callGetApprovedTools();
  }, []);

  // Apply all filters
  useEffect(() => {
    let updatedTools = [...toolsCards];

    if (categoryFilter !== "all") {
      updatedTools = updatedTools.filter((tool:any) => tool.category === categoryFilter);
    }

    // Pricing type filter
    if (pricingTypeFilter === "Free") {
      updatedTools = updatedTools.filter((tool:any) => tool.is_free);
    } else if (pricingTypeFilter === "Paid") {
      updatedTools = updatedTools.filter((tool:any) => parseInt(tool.pricing) > 0 && !tool.is_freemiun);
    } else if (pricingTypeFilter === "Freemium") {
      updatedTools = updatedTools.filter((tool:any) => tool.is_freemiun);
    } else if (pricingTypeFilter === "Onetime") {
      updatedTools = updatedTools.filter((tool:any) => tool.is_onetime);
    }

    // Sorting
    if (sortBy === "Highly Rated") {
      updatedTools = updatedTools.sort((a:any, b:any) => b.user_rating_avg - a.user_rating_avg);
    } else if (sortBy === "Newest") {
      updatedTools = updatedTools.sort((a:any, b:any) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });
    }

    setFilteredTools(updatedTools);
  }, [categoryFilter, pricingTypeFilter, sortBy, toolsCards]);

  const handleSearch = debounce(async (query) => {
    if (query == null || !query.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchTool(query);

      if (!results || !Array.isArray(results)) {
        return;
      }

      setToolsCards(results);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, 600);

  useEffect(() => {
    if (!searchQuery || !searchQuery.trim()) {
      // Reset to all tools with current filters
      const callGetApprovedTools = async () => {
        setIsLoading(true);
        try {
          const data = await getApprovedTools();
          setToolsCards(data);
        } catch (error) {
        } finally {
          setIsLoading(false);
        }
      };

      callGetApprovedTools();
    } else {
      handleSearch(searchQuery);
    }
  }, [searchQuery]);

  const resetFilters = () => {
    setCategoryFilter("all");
    // setPriceFilter("all");
    setPricingTypeFilter("all");
    setSortBy("all");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Helmet>
        <title>Explore SaaS Tools | Find Your SaaS</title>
        <link rel="canonical" href="https://findyoursaas.com/explore" />
        <meta name="description" content="Explore and search for the perfect SaaS tools. Filter by category, price, and more to find exactly what you need." />
      </Helmet> */}

      {/* Header with gradient background */}
      <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
            <motion.circle
              cx="700"
              cy="100"
              r="80"
              fill="url(#grad2)"
              animate={{
                cx: [700, 720, 700, 680, 700],
                cy: [100, 90, 100, 110, 100],
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
              cy="200"
              r="100"
              fill="url(#grad3)"
              animate={{
                cx: [200, 220, 200, 180, 200],
                cy: [200, 210, 200, 190, 200],
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

        {/* Page Title */}
        <motion.div className="px-4 sm:px-6 py-8 sm:py-12 max-w-7xl mx-auto text-center relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Explore SaaS Tools</h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">Discover the perfect software solutions for your business needs with our advanced search and filtering options.</p>
        </motion.div>
      </div>

      {/* Enhanced Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div className="relative -mt-6 sm:-mt-10 w-full max-w-4xl mx-auto" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <motion.div
            className="bg-white rounded-xl shadow-2xl overflow-hidden p-1"
            whileHover={{
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
              scale: 1.01,
            }}
            animate={{
              boxShadow: ["0px 4px 20px rgba(0, 0, 0, 0.1)", "0px 8px 25px rgba(0, 0, 0, 0.15)", "0px 4px 20px rgba(0, 0, 0, 0.1)"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "mirror",
            }}
          >
            <div className="flex items-center">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-2 sm:left-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input type="text" placeholder="Search tools..." className="w-full py-3 sm:py-5 pl-8 sm:pl-12 pr-8 sm:pr-24 rounded-lg border-0 focus:outline-none focus:ring-0 text-sm sm:text-base text-gray-700" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                {searchQuery && (
                  <button className="absolute right-2 sm:right-20 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setSearchQuery("")}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              <motion.button className="py-3 sm:py-5 px-3 sm:px-6 bg-indigo-600 text-white font-medium rounded-lg ml-2 flex items-center text-sm sm:text-base" whileHover={{ scale: 1.05, backgroundColor: "#4338CA" }} whileTap={{ scale: 0.95 }}>
                <span className="hidden sm:inline">Search</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 sm:ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Filter Toggle Button (Mobile) */}
        <div className="mt-6 sm:hidden flex justify-center">
          <motion.button className="flex items-center justify-center px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-full shadow-sm font-medium" onClick={toggleFilters} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </motion.button>
        </div>

        {/* Filters Section - Collapsible on Mobile */}
        <AnimatePresence>
          {(showFilters || window.innerWidth >= 640) && (
            <motion.div className="mt-4 sm:mt-8 bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-6xl mx-auto" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-0">Filter Tools</h3>
                <motion.button className="text-sm text-gray-600 hover:text-indigo-600 flex items-center self-end" onClick={resetFilters} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Filters
                </motion.button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pricing Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Type</label>
                  <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm" value={pricingTypeFilter} onChange={(e) => setPricingTypeFilter(e.target.value)}>
                    <option value="all">All Types</option>
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                    <option value="Freemium">Freemium</option>
                    <option value="Onetime">OneTime</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="all">All</option>
                    <option value="Highly Rated">Highly Rated</option>
                    <option value="Newest">Newest</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Pills - Scrollable on mobile */}
              <AnimatePresence>
                {(categoryFilter !== "all" || pricingTypeFilter !== "all" || sortBy !== "all") && (
                  <motion.div className="flex flex-nowrap sm:flex-wrap overflow-x-auto pb-2 gap-2 mt-4 -mx-2 px-2 sm:mx-0 sm:px-0" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <span className="text-sm text-gray-500 whitespace-nowrap">Active filters:</span>

                    {categoryFilter !== "all" && (
                      <motion.span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 whitespace-nowrap" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} whileHover={{ scale: 1.05 }}>
                        {categoryFilter}
                        <button onClick={() => setCategoryFilter("all")} className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 rounded-full">
                          ×
                        </button>
                      </motion.span>
                    )}

                    {pricingTypeFilter !== "all" && (
                      <motion.span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800 whitespace-nowrap" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} whileHover={{ scale: 1.05 }}>
                        {pricingTypeFilter}
                        <button onClick={() => setPricingTypeFilter("all")} className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-pink-400 hover:bg-pink-200 hover:text-pink-500 rounded-full">
                          ×
                        </button>
                      </motion.span>
                    )}

                    {sortBy !== "all" && (
                      <motion.span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 whitespace-nowrap" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} whileHover={{ scale: 1.05 }}>
                        {sortBy}
                        <button onClick={() => setSortBy("all")} className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-blue-400 hover:bg-blue-200 hover:text-blue-500 rounded-full">
                          ×
                        </button>
                      </motion.span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <div className="mt-6 sm:mt-8 mb-12 sm:mb-20">
          <div className="flex justify-between items-center mb-4 sm:mb-8 px-1 sm:px-0">
            <motion.h2 className="text-xl sm:text-2xl font-bold" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
              {isLoading ? "Searching..." : `Here are your search results.`}
            </motion.h2>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center h-48 sm:h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-10 h-10 sm:w-12 sm:h-12 border-3 sm:border-4 border-indigo-200 border-t-indigo-600 rounded-full"
              />
            </div>
          )}

          {/* No Results State */}
          {!isLoading && filteredTools.length === 0 && (
            <motion.div className="text-center py-10 sm:py-16 px-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-900">No results found</h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-md mx-auto">We couldn't find any tools matching your criteria. Try adjusting your filters or search term.</p>
              <div className="mt-6">
                <motion.button onClick={resetFilters} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Clear Filters
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Results Grid */}
          {!isLoading && filteredTools.length > 0 && (
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-1 sm:px-0" variants={containerVariants} initial="hidden" animate="visible">
              {filteredTools.map((card:any) => (
                <motion.div key={card._id} variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                  <ToolCard card={card} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Floating decoration elements - Hidden on small screens */}
        <div className="hidden sm:block absolute top-40 right-20 opacity-10 pointer-events-none">
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "mirror",
            }}
          >
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="60" fill="#8B5CF6" />
            </svg>
          </motion.div>
        </div>

        <div className="hidden sm:block absolute bottom-40 left-20 opacity-10 pointer-events-none">
          <motion.div
            animate={{
              y: [0, 15, 0],
              rotate: [0, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "mirror",
              delay: 1,
            }}
          >
            <svg width="150" height="150" viewBox="0 0 150 150">
              <circle cx="75" cy="75" r="75" fill="#EC4899" />
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default page