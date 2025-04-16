"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { getToolInformation, updateTool } from "@/services/api";
import { useParams, useRouter } from "next/navigation";

export const page = () => {
  const { toolId }: any = useParams();
  const logoInputRef = useRef<any>(null);
  const screenshotRefs = [
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
  ];
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<any>({
    name: "",
    logo: null,
    logoPreview: null,
    description: "",
    pricing: "",
    category: "Analytics",
    toolUrl: "",
    platforms: {
      Mac: false,
      Windows: false,
      Android: false,
      iOS: false,
      Web: false,
    },
    features: [
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
    ],
    screenshots: [
      { file: null, preview: "/api/placeholder/800/500" },
      { file: null, preview: "/api/placeholder/800/500" },
      { file: null, preview: "/api/placeholder/800/500" },
    ],
    isFree: true,
    isPaid: false,
    isFreemium: false,
    isOneTime: false,
  });

  useEffect(() => {
    const loadToolData = async () => {
      try {
        setIsLoading(true);
        const toolData = await getToolInformation(toolId);

        setFormData({
          name: toolData?.name || "",
          logoPreview: toolData?.logo || null,
          description: toolData?.description || "",
          pricing: toolData?.pricing || "",
          category: toolData?.category || "Analytics",
          toolUrl: toolData?.tool_url || "",
          platforms: toolData?.platforms || {
            Mac: false,
            Windows: false,
            Android: false,
            iOS: false,
            Web: false,
          },
          features: toolData?.features || [
            { title: "", description: "" },
            { title: "", description: "" },
            { title: "", description: "" },
            { title: "", description: "" },
          ],
          screenshots: toolData?.images?.map((url: any) => ({
            file: null,
            preview: url,
          })) || [
            { file: null, preview: "/api/placeholder/800/500" },
            { file: null, preview: "/api/placeholder/800/500" },
            { file: null, preview: "/api/placeholder/800/500" },
          ],
        });
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    loadToolData();
  }, [toolId]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement|any>) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setFormData({
          ...formData,
          logo: file,
          logoPreview: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScreenshotUpload = (index: number, e: ChangeEvent<HTMLInputElement|any>) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const updatedScreenshots = [...formData.screenshots];
        updatedScreenshots[index] = {
          file: file,
          preview: e.target.result,
        };

        setFormData({
          ...formData,
          screenshots: updatedScreenshots,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerLogoUpload = () => {
    logoInputRef.current.click();
  };

  const triggerScreenshotUpload = (index: number) => {
    screenshotRefs[index].current.click();
  };

  const handlePlatformChange = (platform: string) => {
    setFormData({
      ...formData,
      platforms: {
        ...formData.platforms,
        [platform]: !formData.platforms[platform],
      },
    });
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("toolUrl", formData.toolUrl);
    data.append("description", formData.description);
    data.append("pricing", formData.pricing);
    data.append("category", formData.category);
    data.append("isFree", formData.isFree);
    data.append("isPaid", formData.isPaid);
    data.append("isFreemium", formData.isFreemium);
    data.append("isOneTime", formData.isOneTime);

    if (formData.logo) {
      data.append("logo", formData.logo);
    }

    data.append("platforms", JSON.stringify(formData.platforms));
    data.append("features", JSON.stringify(formData.features));

    formData.screenshots.forEach((screenshot: any, index: number) => {
      if (screenshot.file) {
        data.append("screenshots", screenshot.file);
      }
    });

    try {
      const response = await updateTool(toolId, data);

      if (response.success) {
        router.push("/profile");
      } else {
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <p className="text-lg font-semibold">Loading tool data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Tool</h1>
            <p className="text-gray-600 mb-8">
              Update your tool's information below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tool Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="toolUrl"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tool URL*
                    </label>
                    <input
                      type="text"
                      id="toolUrl"
                      name="toolUrl"
                      value={formData.toolUrl}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Category*
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
                      required
                    >
                      <option value="Analytics">Analytics</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Productivity">Productivity</option>
                      <option value="Sales">Sales</option>
                      <option value="Customer Support">Customer Support</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Development">Development</option>
                    </select>
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Pricing*
                    </label>
                    <select
                      id="pricingType"
                      name="pricingType"
                      value={formData.pricingType || ""}
                      onChange={(e) => {
                        handleInputChange(e);

                        const value = e.target.value;

                        const pricingFlags = {
                          isFree: false,
                          isPaid: false,
                          isFreemium: false,
                          isOneTime: false,
                        };

                        if (value === "free") pricingFlags.isFree = true;
                        if (value === "paid") pricingFlags.isPaid = true;
                        if (value === "freemium")
                          pricingFlags.isFreemium = true;
                        if (value === "oneTime") pricingFlags.isOneTime = true;

                        setFormData((prevData: any) => ({
                          ...prevData,
                          ...pricingFlags,
                        }));
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
                    >
                      <option value="free">Free</option>
                      <option value="paid">Paid</option>
                      <option value="freemium">Freemium</option>
                      <option value="oneTime">One Time Payment</option>
                    </select>

                    <div>
                      <input
                        type="text"
                        id="pricing"
                        name="pricing"
                        value={formData.pricing}
                        onChange={handleInputChange}
                        className="w-full mt-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                        placeholder="e.g. 10"
                        required
                        disabled={formData.isFree} // Disable input if product is free
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo Upload */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Logo
                </h2>

                <div>
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex items-center">
                    <div
                      onClick={triggerLogoUpload}
                      className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden"
                    >
                      {formData.logoPreview ? (
                        <img
                          loading="lazy"
                          src={formData.logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <>
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            ></path>
                          </svg>
                          <span className="mt-2 text-sm text-gray-500">
                            Upload logo
                          </span>
                        </>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={triggerLogoUpload}
                      className="ml-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {formData.logoPreview ? "Change logo" : "Upload logo"}
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    PNG, JPG, GIF up to 2MB. Recommended size: 256x256px
                  </p>
                </div>
              </div>

              {/* Platforms */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Platforms
                </h2>

                <div>
                  <div className="flex flex-wrap gap-3">
                    {Object.keys(formData.platforms).map((platform) => (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => handlePlatformChange(platform)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          formData.platforms[platform]
                            ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Key Features
                  </h2>

                  <div className="space-y-4">
                    {formData.features.map((feature: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="mb-3">
                          <label
                            htmlFor={`feature-title-${index}`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Feature {index + 1} Title
                          </label>
                          <input
                            type="text"
                            id={`feature-title-${index}`}
                            value={feature.title}
                            onChange={(e) =>
                              handleFeatureChange(
                                index,
                                "title",
                                e.target.value
                              )
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`feature-description-${index}`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Feature {index + 1} Description
                          </label>
                          <textarea
                            id={`feature-description-${index}`}
                            value={feature.description}
                            onChange={(e) =>
                              handleFeatureChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            rows={2}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Screenshots */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Screenshots
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, index) => {
                      const screenshot = formData.screenshots?.[index] || {
                        file: null,
                        preview: null,
                      };

                      return (
                        <div key={index} className="relative">
                          <input
                            type="file"
                            ref={screenshotRefs[index]}
                            onChange={(e) => handleScreenshotUpload(index, e)}
                            accept="image/*"
                            className="hidden"
                          />
                          <div
                            onClick={() => triggerScreenshotUpload(index)}
                            className="aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden"
                          >
                            {screenshot.preview ? (
                              <img
                                loading="lazy"
                                src={screenshot.preview}
                                alt={`Screenshot ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <>
                                <svg
                                  className="w-8 h-8 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  ></path>
                                </svg>
                                <span className="mt-2 text-sm text-gray-500">
                                  Upload screenshot
                                </span>
                              </>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => triggerScreenshotUpload(index)}
                            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            {screenshot.file ? "Change image" : "Upload image"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF up to 5MB. Recommended size: 1280x720px
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    disabled={loading}
                    onClick={handleSubmit}
                    className="cursor-pointer w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
