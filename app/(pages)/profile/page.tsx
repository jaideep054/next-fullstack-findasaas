"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  approveTool,
  deleteTool,
  getAllTools,
  getToolByUserId,
  newsletterSubscribe,
  newsletterUnsubscribe,
  rejectTool,
} from "@/services/api";
import { GenerateBadge } from "@/components/GenerateBadge";
import { formatDate } from "@/utils/common";
import ReactConfetti from "react-confetti";
import { SuccessModal } from "@/components/Modals/PaymentSuccesModal";
import { motion } from "framer-motion";
import { Rocket, Star } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

const page = () => {
  const { user }: any = useAuth();
  const router = useRouter();
  const [allListedTools, setAllListedTools] = useState<Array<any>>([]);
  const [activeTab, setActiveTab] = useState("approved");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [upgradedTier, setUpgradedTier] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const toolsPerPage = 10;

  useEffect(() => {
    // Update window dimensions when resized
    const handleResize = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    const paymentSuccess = localStorage.getItem("paymentSuccess");
    const tier = localStorage.getItem("upgradedTier");

    if (paymentSuccess === "true") {
      setShowConfetti(true);

      setUpgradedTier(tier || "featured");
      setShowModal(true);

      localStorage.removeItem("paymentSuccess");
      localStorage.removeItem("upgradedTier");

      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 8000);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", handleResize);
      };
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (!user) return;

    const fetchAllToolsData = async () => {
      try {
        let data;
        if (isAdmin()) {
          data = await getAllTools();
        } else {
          data = await getToolByUserId(user?._id);
        }
        setAllListedTools(Array.isArray(data) ? data : []);
      } catch (error) {}
    };

    fetchAllToolsData();
  }, [user]);

  // Admin functions
  const handleApproveTool = async (toolId: string) => {
    try {
      const response = await approveTool(toolId);

      if (response.success) {
        setAllListedTools((prevTools) =>
          prevTools.map((tool) =>
            tool._id === toolId ? { ...tool, status: "approved" } : tool
          )
        );
        alert("Tool approved successfully");
      }
    } catch (error) {}
  };

  const handleRejectTool = async (toolId: number) => {
    try {
      const response = await rejectTool({ toolId, reason: rejectReason });

      if (response.success || response) {
        setAllListedTools((prevTools) =>
          prevTools.map((tool) =>
            tool._id === toolId
              ? { ...tool, status: "rejected", rejected_reason: rejectReason }
              : tool
          )
        );
        closeRejectModal();
      }
    } catch (error) {}
  };

  const handleDeleteTool = async (toolId: string) => {
    const res = await deleteTool(toolId);
    if (res.success) {
      alert("Tool deleted");
    }
  };

  const handleUnsubscribe = async () => {
    const res = await newsletterUnsubscribe('');

    toast.success(res);
  };

  const handleSubscribe = async (e: any) => {
    e.preventDefault();

    const result = await newsletterSubscribe(user?.email);

    if (result) {
      toast.success(result || "Subscribed! Keep an eye on your inbox.");
    }
  };

  const isAdmin = () => {
    if (user?.role === "admin") {
      return true;
    }
    return false;
  };

  const isFeaturedUser = () => {
    if (user?.tier === "featured") {
      return true;
    }
    return false;
  };

  const getFilteredTools = () => {
    let filteredTools = allListedTools;

    if (activeTab !== "all") {
      filteredTools = filteredTools.filter((tool) => tool.status === activeTab);
    }

    if (searchQuery) {
      filteredTools = filteredTools.filter((tool) =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredTools;
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending Review",
      },
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Approved",
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Changes Required",
      },
    };

    const { bg, text, label } = badges[status] || badges.pending;

    return (
      <span
        className={`${bg} ${text} text-xs font-medium px-2.5 py-0.5 rounded-full`}
      >
        {label}
      </span>
    );
  };

  const openRejectModal = () => {
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectReason("");
  };

  const filteredTools = getFilteredTools();
  const totalPages = Math.ceil(filteredTools.length / toolsPerPage);
  const startIndex = (currentPage - 1) * toolsPerPage;
  const endIndex = startIndex + toolsPerPage;
  const displayedTools = filteredTools.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getPricingDisplay = (tool: any) => {
    if (tool.is_free) {
      return (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
          Free
        </span>
      );
    }

    if (tool.is_freemiun) {
      return (
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
          Freemium {tool.pricing && `• Premium from $${tool.pricing}`}
        </span>
      );
    }

    if (tool.is_onetime) {
      return (
        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
          One-time ${tool.pricing}
        </span>
      );
    }

    if (tool.pricing) {
      return (
        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
          From ${tool.pricing}/month
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {showConfetti && (
        <ReactConfetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.1}
        />
      )}
      {showModal && <SuccessModal tier={upgradedTier} onClose={closeModal} />}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          {/* Header Gradient */}
          <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row">
              {/* Avatar */}
              <div className="mb-4 md:mb-0 md:mr-8">
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  {user && (
                    <img
                      loading="lazy"
                      src={user?.profile_picture}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              {/* User Details */}
              <div className="flex-1">
                <div className="flex items-center mb-2 gap-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user?.name}
                  </h1>
                  {user?.tier === "featured" && (
                    <motion.svg
                      className="w-6 h-6 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                  )}
                  {isAdmin() && (
                    <span className="ml-3 px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                      Admin
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">{formatDate(user?.createdAt)}</p>
                  </div>
                </div>
                <div className="relative">
                  {<GenerateBadge tool={allListedTools[0]} />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Listed Tools Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Gradient */}
          <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {isAdmin() ? "Manage Tools" : "Your Listed Tool"}
            </h2>

            {/* Filter Tabs */}
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
              <div className="flex space-x-2">
                {isAdmin() && (
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 cursor-pointer py-2 text-sm font-medium transition-colors ${
                      activeTab === "all"
                        ? "text-indigo-600 border-b-2 border-indigo-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    All Tools
                  </button>
                )}

                <button
                  onClick={() => setActiveTab("pending")}
                  className={`px-4 py-2 cursor-pointer text-sm font-medium transition-colors ${
                    activeTab === "pending"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Pending Review
                </button>
                <button
                  onClick={() => setActiveTab("approved")}
                  className={`px-4 py-2 cursor-pointer text-sm font-medium transition-colors ${
                    activeTab === "approved"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setActiveTab("rejected")}
                  className={`px-4 py-2 cursor-pointer text-sm font-medium transition-colors ${
                    activeTab === "rejected"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Changes Required
                </button>
              </div>

              {isAdmin() && (
                <div className="ml-4">
                  <input
                    type="text"
                    placeholder="Search tools by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* Tools List */}
            <div className="space-y-6">
              {displayedTools.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No tools found in this category
                  </p>
                </div>
              ) : (
                displayedTools.map((tool) => (
                  <div
                    key={tool._id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row items-start">
                      {/* Tool Logo */}
                      <div className="mb-4 md:mb-0 md:mr-6">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          <img
                            loading="lazy"
                            src={tool.logo}
                            alt={`${tool.name} logo`}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                      </div>

                      {/* Tool Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              {tool.name}
                            </h3>
                            {user.tier === "featured" && (
                              <motion.div
                                className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 cursor-default flex-shrink-0"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                  delay: 0.2,
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 15,
                                }}
                              >
                                <Star
                                  size={12}
                                  fill="currentColor"
                                  className="-ml-0.5"
                                />
                                Featured
                              </motion.div>
                            )}
                          </div>
                          {getStatusBadge(tool.status)}
                        </div>

                        <p className="text-gray-600 mb-4">
                          {tool.description.split(" ").slice(0, 15).join(" ")}
                          ...
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500">Category</p>
                            <p className="text-sm font-medium">
                              {tool.category}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Pricing</p>
                            <p className="text-sm font-medium">
                              {getPricingDisplay(tool)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Submitted</p>
                            <p className="text-sm font-medium">
                              {formatDate(tool.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-1">
                            Platforms
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {Object.keys(tool.platforms).map(
                              (platform) =>
                                tool.platforms[platform] && (
                                  <span
                                    key={platform}
                                    className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                                  >
                                    {platform}
                                  </span>
                                )
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 mt-2">
                          <p
                            onClick={() =>
                              router.push(`/tool/${tool._id}/${tool.slug}`)
                            }
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
                          >
                            View Details
                          </p>
                          <p
                            onClick={() =>
                              router.push(`/tool/edit/${tool._id}`)
                            }
                            className="px-4 py-2 bg-white border border-indigo-300 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors text-sm font-medium"
                          >
                            Edit Listing
                          </p>

                          {!isAdmin() && !tool.featured && (
                            <Link href={"/pricing"}>
                              <motion.a
                                // to="/pricing" // Link to your pricing page
                                className={
                                  "relative inline-flex items-center justify-center px-4 py-2 " + // Base size & flex
                                  "rounded-md text-sm font-medium " + // Shape & Text (using medium like others)
                                  "bg-indigo-600 text-white " + // Solid theme color for emphasis
                                  "border border-indigo-700 " + // Slightly darker border for definition
                                  "hover:bg-indigo-700 " + // Hover state matches theme
                                  "transition-colors duration-200 ease-in-out " + // Standard transition for color
                                  "overflow-hidden whitespace-nowrap " + // Crucial: Hide overflow for shine effect
                                  "shadow-sm hover:shadow-md" // Subtle shadow like other buttons might have
                                }
                                whileTap={{ scale: 0.97 }} // Keep press down effect
                                // No whileHover scale needed if we want the shine to be the main effect
                              >
                                {/* Shine Animation Element */}
                                <motion.span
                                  className="absolute inset-0 block" // Positioned over the button content area
                                  style={{
                                    // A subtle white/light gradient angled across
                                    background:
                                      "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.35), transparent)",
                                    // Angle the shine effect
                                    transform: "skewX(-25deg)",
                                  }}
                                  // Animation properties
                                  initial={{ x: "-150%" }} // Start completely off-screen to the left
                                  animate={{ x: "150%" }} // Animate completely off-screen to the right
                                  transition={{
                                    duration: 1.0, // Speed of one shine pass (adjust as needed)
                                    ease: "linear", // Constant speed for the shine
                                    repeat: Infinity, // Loop forever
                                    repeatDelay: 1, // Wait 2.5 seconds between shines (adjust)
                                    delay: 0.3, // Initial delay before the first shine starts
                                  }}
                                />

                                {/* Button Content (needs to be above the shine) */}
                                <span className="relative z-10 inline-flex items-center gap-1.5">
                                  {" "}
                                  {/* Add relative z-10 to keep content on top */}
                                  <Rocket size={16} />
                                  <span>Promote Listing</span>
                                </span>
                              </motion.a>
                            </Link>
                          )}

                          {/* Admin Buttons */}
                          {isAdmin() && tool.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApproveTool(tool._id)}
                                className="px-4 hover:cursor-pointer py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                              >
                                Approve
                              </button>

                              <button
                                onClick={openRejectModal}
                                className="px-4 py-2 bg-red-600 hover:cursor-pointer text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {isAdmin() && (
                            <div className="px-4 py-2 sh text-slate-800 border rounded-md text-sm font-medium">
                              Submitted by {tool?.submittedBy?.email}
                            </div>
                          )}

                          {isAdmin() && (
                            <button
                              onClick={() => handleDeleteTool(tool._id)}
                              className="px-4 hover:cursor-pointer py-2 bg-red-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              Delete
                            </button>
                          )}

                          {(isAdmin() || isFeaturedUser()) && (
                            <Link href={`/analytics/${tool._id}`}>
                              <motion.a
                                //   to={}
                                className={
                                  "relative inline-flex items-center justify-center gap-2 px-4 py-2 " + // Original size
                                  "rounded-md text-sm font-medium " + // Original text/shape
                                  "text-white overflow-hidden cursor-pointer " + // Text color, hide overflow for effect
                                  "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 " + // Premium gradient
                                  "transition-shadow duration-300 ease-in-out" // Smooth transition for shadow
                                }
                                style={{
                                  backgroundSize: "200% auto", // Make gradient twice as wide
                                }}
                                animate={{
                                  // Animate backgroundPosition to create the moving effect
                                  backgroundPosition: [
                                    "0% center",
                                    "100% center",
                                    "0% center",
                                  ],
                                }}
                                transition={{
                                  backgroundPosition: {
                                    // Target only backgroundPosition animation
                                    duration: 4, // Speed of one cycle
                                    ease: "linear",
                                    repeat: Infinity, // Loop forever
                                  },
                                  // You can add default transitions for other properties like scale/shadow here if needed
                                }}
                                whileHover={{
                                  scale: 1.05, // Slightly enlarge on hover
                                  boxShadow: "0 0 15px rgba(236, 72, 153, 0.6)", // Add a pinkish glow on hover (adjust color/opacity as needed)
                                }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {/* Button Text */}
                                <span>View Analytics</span>
                              </motion.a>
                            </Link>
                          )}

                          {showRejectModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                                <h3 className="text-lg font-medium mb-4">
                                  Reject Tool
                                </h3>

                                <div className="mb-4">
                                  <label
                                    htmlFor="rejectReason"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                  >
                                    Rejection Reason
                                  </label>
                                  <textarea
                                    id="rejectReason"
                                    value={rejectReason}
                                    onChange={(e) =>
                                      setRejectReason(e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                    placeholder="Please provide a reason for rejection..."
                                    rows={4}
                                  />
                                </div>

                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={closeRejectModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleRejectTool(tool._id)}
                                    disabled={!rejectReason.trim()}
                                    className={`px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium ${
                                      !rejectReason.trim()
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-red-700"
                                    }`}
                                  >
                                    Submit Rejection
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {tool.status === "rejected" && (
                            <div className="w-full mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                              <p className="text-sm text-red-800 font-medium">
                                Changes Required
                              </p>
                              <p className="text-xs text-red-700 mt-1">
                                {tool.rejected_reason ||
                                  "Please contact for details"}
                              </p>
                            </div>
                          )}

                          {tool.status === "pending" && (
                            <div className="w-full mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                              <p className="text-sm text-yellow-800 font-medium">
                                Under Review
                              </p>
                              <p className="text-xs text-yellow-700 mt-1">
                                Your tool is being reviewed by our team. This
                                process typically takes 48 hours.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Paginationn */}
            {isAdmin() && totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-50 ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === index + 1
                          ? "bg-indigo-600 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-50 ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          {user?.subscribed && (
            <button
              onClick={handleUnsubscribe}
              className="text-sm cursor-pointer text-gray-500 hover:text-gray-700 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
              aria-label="Unsubscribe from newsletter" // Accessibility
            >
              Unsubscribe from Newsletter
            </button>
          )}

          {!user?.subscribed && (
            <button
              onClick={handleSubscribe}
              className="text-sm cursor-pointer text-gray-500 hover:text-gray-700 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
              aria-label="Unsubscribe from newsletter" // Accessibility
            >
              Subscribe to Newsletter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
