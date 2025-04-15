"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  getProductRating,
  getReviews,
  getToolInformation,
  trackAnalytics,
} from "@/services/api";
import ReviewCard from "@/components/ReviewCard";
import CreateReview from "@/components/CreateReview";
import { useAuth } from "@/hooks/useAuth";
import ReviewToast from "@/components/ReviewToast";
import { formatDate, replaceS3WithCloudFront } from "@/utils/common";
import { useParams } from "next/navigation";
import Head from "next/head";

const ToolPage = () => {
  const { isLoggedIn } = useAuth();
  const { id }: any = useParams();

  const [toolInfo, setToolInfo] = useState<any>({});
  const [productRating, setProductRating] = useState<any>({});
  const [allReviews, setAllReviews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const descriptionRef = useRef<any>(null);

  useEffect(() => {
    const fetchToolInfo = async () => {
      const data = await getToolInformation(id);
      setToolInfo(data);
    };

    fetchToolInfo();
  }, [id]);

  useEffect(() => {
    if (!toolInfo?._id) return;

    const getAllReviews = async () => {
      const data: any = await getReviews(toolInfo?._id);
      setAllReviews(data);
    };

    getAllReviews();
  }, [toolInfo]);

  useEffect(() => {
    if (!toolInfo?._id) return;

    const getProductRatingCall = async () => {
      const data = await getProductRating(toolInfo?._id);
      setProductRating(data);
    };
    getProductRatingCall();
  }, [toolInfo]);

  useEffect(() => {
    const handleEsc = (e: any) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // modal for images
  const openModal = () => {
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleReadMore = () => {
    if (descriptionRef.current) {
      descriptionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === toolInfo.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? toolInfo.images.length - 1 : prevIndex - 1
    );
  };

  const handleTrackEventClick = async (eventType: any) => {
    const res = await trackAnalytics(toolInfo._id, eventType);
  };

  const getPricingDisplay = () => {
    if (toolInfo?.is_free) {
      return (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
          Free
        </span>
      );
    } else if (toolInfo?.is_freemiun) {
      return (
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
          Freemium {toolInfo?.pricing && `• Premium from $${toolInfo?.pricing}`}
        </span>
      );
    } else if (toolInfo?.is_onetime) {
      return (
        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
          One-time ${toolInfo?.pricing}
        </span>
      );
    } else {
      return (
        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
          From ${toolInfo?.pricing}/month
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-14">
      {/* <Head>
        <title>{"toolInfo?.name"}</title>
        <meta name="description" content={toolInfo?.description?.slice(0, 170)} />
        <link rel="canonical" href={`https://findyoursaas.com/tool/${toolInfo?._id}`} />
      </Head> */}

      {/* Hero section with cover image */}
      <div className="bg-blue-900 relative h-64 w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 overflow-hidden opacity-90"></div>
      </div>

      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        {/* Tool header with logo, name, description */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row">
              {/* Logo circle */}
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <div className="w-24 h-24 bg-white flex items-center justify-center">
                  <img
                    title={toolInfo?.name}
                    loading="lazy"
                    src={replaceS3WithCloudFront(toolInfo?.logo)}
                    className="max-w-[80px] max-h-[80px] object-contain"
                    alt={toolInfo?.name}
                    width={80}
                    height={80}
                  />
                </div>
              </div>

              {/* Tool name and description */}
              <div className="md:ml-6 flex-grow">
                <div className="flex items-center mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {toolInfo.name}
                  </h1>
                  <svg
                    className="w-6 h-6 ml-2 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {toolInfo && (
                  <p className="text-gray-700 mb-4">
                    {toolInfo?.description?.split(" ").slice(0, 34).join(" ")}
                    ...
                  </p>
                )}

                {/* Ratings display */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                    <div className="bg-purple-100 p-2 rounded-lg mr-2">
                      <svg
                        className="w-5 h-5 text-purple-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      {productRating && (
                        <span className="font-bold">
                          {productRating?.averageRating}/5
                        </span>
                      )}
                      <div className="text-xs text-gray-500">User Rating</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-6 md:mt-0 md:ml-4 flex flex-col space-y-3">
                <a
                  onClick={() => handleTrackEventClick("link_click")}
                  href={
                    toolInfo?.tool_url?.startsWith("http")
                      ? toolInfo.tool_url
                      : `https://${toolInfo.tool_url}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center whitespace-nowrap"
                >
                  <span className="flex items-center space-x-2">
                    <span className="truncate">{`Get ${toolInfo.name}`}</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                </a>
                <button
                  onClick={handleReadMore}
                  className="border border-gray-300 cursor-pointer text-gray-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center whitespace-nowrap"
                >
                  <span>Learn More</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="border-t border-gray-200">
            <div className="flex">
              <button
                className={`px-6 cursor-pointer py-3 text-sm font-medium ${
                  activeTab === "overview"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
                onClick={() => setActiveTab("overview")}
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                  Overview
                </div>
              </button>
              <button
                className={`px-6 cursor-pointer py-3 text-sm font-medium ${
                  activeTab === "reviews"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
                onClick={() => setActiveTab("reviews")}
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Reviews ({productRating && productRating?.totalReviews})
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        {activeTab === "overview" && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image carousel */}
              {toolInfo?.images?.length != 0 && (
                <div className="rounded-lg shadow-md overflow-hidden bg-gray-50">
                  <div className="relative h-80 flex items-center justify-center ">
                    {toolInfo?.images?.[currentImageIndex] && (
                      <img
                        title={toolInfo?.name}
                        loading="lazy"
                        height={320}
                        width={600}
                        className="max-h-full max-w-full object-contain cursor-pointer"
                        src={replaceS3WithCloudFront(
                          toolInfo.images[currentImageIndex]
                        )}
                        alt={`${toolInfo?.name || "Image"} screenshot ${
                          currentImageIndex + 1
                        }`}
                        onClick={openModal}
                      />
                    )}

                    {/* Navigation arrows */}
                    <button
                      onClick={prevImage}
                      className="absolute cursor-pointer left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        className="w-6 h-6 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        className="w-6 h-6 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Thumbnail indicators */}
                  <div className="p-4 flex justify-center space-x-2">
                    {toolInfo?.images &&
                      toolInfo?.images.map((_: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            currentImageIndex === index
                              ? "bg-indigo-600"
                              : "bg-gray-300"
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Image Modal */}
              {modalOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                  onClick={closeModal}
                >
                  <div className="relative max-w-4xl max-h-screen p-4">
                    <button
                      className="absolute cursor-pointer top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                      onClick={closeModal}
                    >
                      <svg
                        className="w-6 h-6 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <img
                      loading="lazy"
                      className="max-w-full max-h-screen object-contain"
                      src={toolInfo.images[currentImageIndex]}
                      alt={`${toolInfo?.name || "Image"} full view`}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="absolute bottom-4 left-0 w-full flex justify-center space-x-4">
                      <button
                        className="bg-white cursor-pointer rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                      >
                        <svg
                          className="w-6 h-6 text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        className="bg-white cursor-pointer rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                      >
                        <svg
                          className="w-6 h-6 text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tool description */}
              <div
                ref={descriptionRef}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-2xl font-bold mb-4">
                  What is {toolInfo.name}?
                </h2>
                <p className="text-gray-700 mb-4">{toolInfo.description}</p>
              </div>

              {/* Features section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                <div className="space-y-6">
                  {toolInfo?.features
                    ?.filter(
                      (feature: any) => feature.title || feature.description
                    )
                    .map((feature: any, index: number) => (
                      <div key={index} className="flex">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-indigo-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            {feature.title}
                          </h3>
                          <p className="mt-1 text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Individual reviews */}
              <ReviewCard allReviews={allReviews} />
            </div>

            {/* Right column - Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Tool info card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold mb-4 text-gray-900">
                  Tool Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{toolInfo.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pricing</p>
                    <div className="mb-4">{getPricingDisplay()}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">
                      {formatDate(toolInfo.updatedAt)}
                    </p>
                  </div>

                  <div className="pt-2">
                    <a
                      onClick={() => handleTrackEventClick("link_click")}
                      href={
                        toolInfo?.tool_url?.startsWith("http")
                          ? toolInfo.tool_url
                          : `https://${toolInfo.tool_url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-indigo-600 text-white font-medium px-4 py-2 rounded flex items-center justify-center hover:bg-indigo-700 transition-colors"
                    >
                      <span>Visit Website</span>
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Platforms card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-medium mb-4 text-gray-900">
                  {toolInfo?.name} PLATFORMS
                </h3>
                <div className="grid grid-cols-4 gap-4 text-center">
                  {Object.entries(toolInfo?.platforms || {}).map(
                    ([platform, isAvailable]: any, index: number) =>
                      isAvailable && (
                        <div key={index} className="flex flex-col items-center">
                          {platform === "Mac" && (
                            <svg
                              className="w-8 h-8"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09998 22C7.78998 22.05 6.79998 20.68 5.95998 19.47C4.24998 17 2.93998 12.45 4.69998 9.39C5.56998 7.87 7.12998 6.91 8.81998 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.09 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                            </svg>
                          )}
                          {platform === "Windows" && (
                            <svg
                              className="w-8 h-8"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M3 5.30001L10.58 4.34001V11.51H3V5.30001ZM3 18.67L10.58 19.66V12.49H3V18.67ZM11.58 19.78L21.99 21.12V12.49H11.58V19.78ZM11.58 4.22001V11.51H21.99V2.88001L11.58 4.22001Z" />
                            </svg>
                          )}
                          {platform === "Android" && (
                            <svg
                              className="w-8 h-8"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M17.6 9.48L19.44 7.64C19.6 7.48 19.6 7.24 19.44 7.08C19.28 6.92 19.04 6.92 18.88 7.08L16.9 9.04C16.14 8.6 15.28 8.36 14.36 8.36C13.44 8.36 12.58 8.6 11.8 9.04L9.84 7.08C9.68 6.92 9.44 6.92 9.28 7.08C9.12 7.24 9.12 7.48 9.28 7.64L11.12 9.48C9.56 10.52 8.5 12.22 8.5 14.16C8.5 14.28 8.5 14.38 8.5 14.5H20.22C20.22 14.38 20.22 14.26 20.22 14.16C20.22 12.22 19.16 10.5 17.6 9.48ZM11.5 13C11.06 13 10.7 12.64 10.7 12.2C10.7 11.76 11.06 11.4 11.5 11.4C11.94 11.4 12.3 11.76 12.3 12.2C12.3 12.64 11.94 13 11.5 13ZM17.5 13C17.06 13 16.7 12.64 16.7 12.2C16.7 11.76 17.06 11.4 17.5 11.4C17.94 11.4 18.3 11.76 18.3 12.2C18.3 12.64 17.94 13 17.5 13ZM7 15.5H6V18.5C6 19.32 6.68 20 7.5 20C8.32 20 9 19.32 9 18.5V15.5H7ZM21.5 15.5H19.5V18.5C19.5 19.32 20.18 20 21 20C21.82 20 22.5 19.32 22.5 18.5V15.5H21.5Z" />
                            </svg>
                          )}
                          {platform === "iOS" && (
                            <svg
                              className="w-8 h-8"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09998 22C7.78998 22.05 6.79998 20.68 5.95998 19.47C4.24998 17 2.93998 12.45 4.69998 9.39C5.56998 7.87 7.12998 6.91 8.81998 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.09 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                            </svg>
                          )}
                          {platform === "Web" && (
                            <svg
                              className="w-8 h-8"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M16.36 14C16.44 13.34 16.5 12.68 16.5 12C16.5 11.32 16.44 10.66 16.36 10H19.74C19.9 10.64 20 11.31 20 12C20 12.69 19.9 13.36 19.74 14M14.59 19.56C15.19 18.45 15.65 17.25 15.97 16H18.92C17.96 17.65 16.43 18.93 14.59 19.56M14.34 14H9.66C9.56 13.34 9.5 12.68 9.5 12C9.5 11.32 9.56 10.65 9.66 10H14.34C14.43 10.65 14.5 11.32 14.5 12C14.5 12.68 14.43 13.34 14.34 14M12 19.96C11.17 18.76 10.5 17.43 10.09 16H13.91C13.5 17.43 12.83 18.76 12 19.96M8 8H5.08C6.03 6.34 7.57 5.06 9.4 4.44C8.8 5.55 8.35 6.75 8 8M5.08 16H8C8.35 17.25 8.8 18.45 9.4 19.56C7.57 18.93 6.03 17.65 5.08 16M4.26 14C4.1 13.36 4 12.69 4 12C4 11.31 4.1 10.64 4.26 10H7.64C7.56 10.66 7.5 11.32 7.5 12C7.5 12.68 7.56 13.34 7.64 14M12 4.03C12.83 5.23 13.5 6.57 13.91 8H10.09C10.5 6.57 11.17 5.23 12 4.03M18.92 8H15.97C15.65 6.75 15.19 5.55 14.59 4.44C16.43 5.07 17.96 6.34 18.92 8M12 2C6.47 2 2 6.5 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" />
                            </svg>
                          )}
                          <p className="text-sm mt-2">{platform}</p>
                        </div>
                      )
                  )}
                </div>
              </div>

              {/* Discount card */}
              {!isLoggedIn && (
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="p-2 bg-white rounded-lg mr-3">
                      <svg
                        className="w-6 h-6 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">
                        Want To List Your Product?
                      </h3>
                      <p className="text-sm text-gray-700">
                        Sign-up for free today!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <ReviewToast reviews={allReviews} />

        {activeTab === "reviews" && (
          <CreateReview
            toolInfo={toolInfo}
            allReviews={allReviews}
            productRating={productRating}
          />
        )}
      </div>
    </div>
  );
};

export default ToolPage;
