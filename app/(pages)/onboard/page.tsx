"use client";

import React, { useState, useRef, useEffect } from "react";
import { listTool } from "@/frontendservices/api";
import { useAuth } from "@/hooks/useAuth";
import { FieldErrors, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";



interface FormData {
  name: string;
  toolUrl: string;
  description: string;
}

export default function OnboardPage() {
  const { alreadyListed, user, loading } = useAuth();
  const logoInputRef = useRef<any>(null);
  const screenshotRefs = [
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
  ];
  const router = useRouter();
  const [loadingButton, setLoading] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (alreadyListed) {
      router.push("/profile");
    }
  }, []);

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
      { file: null, preview: null },
      { file: null, preview: null },
      { file: null, preview: null },
    ],
    isFree: true,
    isPaid: false,
    isFreemium: false,
    isOneTime: false,
  });

  const {
    register,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      name: formData.name || "",
      toolUrl: formData.toolUrl || "",
      description: formData.description || "",
    },
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleInputChange = (e: any) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value, // Handle checkbox toggle
    });
  };

  const handleLogoUpload = (e: any) => {
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

  const handleScreenshotUpload = (index: number, e: any) => {
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

  const handlePlatformChange = (platform: any) => {
    setFormData({
      ...formData,
      platforms: {
        ...formData.platforms,
        [platform]: !formData.platforms[platform],
      },
    });
  };

  const handleFeatureChange = (index: number, field: any, value: any) => {
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

  const nextStep = () => {
    setCurrentStep(Math.min(currentStep + 1, totalSteps));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("toolUrl", formData.toolUrl);
    data.append("description", formData.description);
    data.append("pricing", formData.pricing);
    data.append("category", formData.category);
    data.append("logo", formData.logo);
    data.append("isFree", formData.isFree);
    data.append("isPaid", formData.isPaid);
    data.append("isFreemium", formData.isFreemium);
    data.append("isOneTime", formData.isOneTime);

    data.append("platforms", JSON.stringify(formData.platforms));

    data.append("features", JSON.stringify(formData.features));

    formData.screenshots.forEach((screenshot: any, index: number) => {
      if (screenshot.file) {
        data.append(`screenshots`, screenshot.file);
      }
    });

    const res = await listTool(data);

    if (res.message === "success") {
      console.log("USER FEATURED:", user);
      if (user?.tier === "featured") {
        localStorage.setItem("paymentSuccess", "true");
        localStorage.setItem("upgradedTier", user?.tier);
      }
      window.location.href = "/profile";
    }

    // setLoading(false);
  };

  useEffect(() => {
    if (loading) return;

    console.log("USER AFTER LOAD:", user);
    if (user === null) {
      router.push("/pricing");
      return;
    }

    if (alreadyListed) {
      router.push("/profile");
      return;
    }
  }, [user, loading, alreadyListed, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="flex items-center space-x-3">
            <svg
              className="animate-spin h-6 w-6 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-lg font-medium text-gray-700">
              Loading...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Form Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Form Header with Gradient */}
          <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              List Your SaaS Tool
            </h1>
            <p className="text-gray-600 mb-8">
              Complete the form below to submit your tool for review. We'll get
              back to you within 48 hours.
            </p>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center justify-center w-8 h-8 rounded-full 
                      ${
                        index + 1 === currentStep
                          ? "bg-indigo-600 text-white"
                          : index + 1 < currentStep
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                  >
                    {index + 1 < currentStep ? (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                ))}
              </div>
              <div className="relative">
                <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded"></div>
                <div
                  className="absolute top-0 left-0 h-1 bg-indigo-600 rounded transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Basic Information
                  </h2>

                  {/* Tool Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tool Name*
                    </label>
                    <input
                      {...register("name", {
                        required: "Tool name is required",
                      })}
                      onBlur={() => trigger("name")}
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg outline-none ${
                        errors.name
                          ? "border-red-300 ring-1 ring-red-300"
                          : "border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                      }`}
                      placeholder="e.g. AnalyticsPro"
                      required
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tool URL*
                    </label>
                    <input
                      {...register("toolUrl", {
                        required: "Tool URL is required",
                      })}
                      type="text"
                      id="toolUrl"
                      name="toolUrl"
                      value={formData.toolUrl}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg outline-none ${
                        errors.toolUrl
                          ? "border-red-300 ring-1 ring-red-300"
                          : "border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                      }`}
                      placeholder="e.g. findyoursaas.com"
                      required
                    />
                    {errors.toolUrl && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.toolUrl?.message}
                      </p>
                    )}
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Logo*
                    </label>
                    <input
                      type="file"
                      ref={logoInputRef}
                      onChange={handleLogoUpload}
                      accept="image/*"
                      className="hidden"
                      required
                    />
                    <div className="mt-1 flex items-center">
                      <div
                        onClick={triggerLogoUpload}
                        className={`w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${
                          formData.logoPreview
                            ? "border-indigo-300"
                            : "border-gray-300"
                        }`}
                      >
                        {formData.logoPreview ? (
                          <img
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
                        {formData.logo ? "Change logo" : "Select file"}
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      PNG, JPG, GIF up to 2MB. Recommended size: 256x256px.
                      Please follow this else listing will be rejected.
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description*
                    </label>
                    <textarea
                      {...register("description", {
                        required: "Description is required",
                      })}
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full  p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none "
                      placeholder="Briefly describe your tool (e.g., 'AI-powered SEO optimizer')."
                      required
                    />
                    {errors.description && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Category */}
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
                </div>
              )}

              {/* Step 2: Platforms and Features */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Platforms & Features
                  </h2>

                  {/* Platforms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supported Platforms
                    </label>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key Features
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                      Add up to 4 key features that make your tool stand out
                    </p>

                    <div className="space-y-4">
                      {formData.features.map((feature: any, index: number) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center mb-2">
                            <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-2 text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="text-sm font-medium text-gray-700">
                              Feature {index + 1}
                            </div>
                          </div>

                          <div className="mb-3">
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) =>
                                handleFeatureChange(
                                  index,
                                  "title",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
                              placeholder="Feature Title"
                            />
                          </div>

                          <div>
                            <textarea
                              value={feature.description}
                              onChange={(e) =>
                                handleFeatureChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
                              placeholder="Feature Description"
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Ratings and Pricing */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {" "}
                    Pricing
                  </h2>

                  {/* Free Product Checkbox */}
                  <div className="relative">
                    <div className="relative">
                      <select
                        id="pricingType"
                        name="pricingType"
                        value={formData.pricingType || ""}
                        onChange={(e) => {
                          // First update the pricingType using the existing handler
                          handleInputChange(e);

                          // Then update the corresponding boolean flags
                          const value = e.target.value;

                          // Create an object with all pricing flags set to false
                          const pricingFlags = {
                            isFree: false,
                            isPaid: false,
                            isFreemium: false,
                            isOneTime: false,
                          };

                          // Set the appropriate flag to true based on selection
                          if (value === "free") pricingFlags.isFree = true;
                          if (value === "paid") pricingFlags.isPaid = true;
                          if (value === "freemium")
                            pricingFlags.isFreemium = true;
                          if (value === "oneTime")
                            pricingFlags.isOneTime = true;

                          // Update all the flags at once
                          setFormData((prevData: any) => ({
                            ...prevData,
                            ...pricingFlags,
                          }));
                        }}
                        className="block w-full px-4 py-3 text-base rounded-lg border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-200 appearance-none cursor-pointer bg-white shadow-sm"
                      >
                        <option value="free">Free</option>
                        <option value="paid">Paid</option>
                        <option value="freemium">Freemium</option>
                        <option value="oneTime">One Time Payment</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-indigo-600">
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Optional floating label with Tailwind classes */}
                    {formData.pricingType && (
                      <span className="absolute -top-2.5 left-2 px-1 bg-white text-xs font-medium text-indigo-600">
                        Pricing Type
                      </span>
                    )}
                  </div>

                  {/* Pricing */}
                  <div>
                    <label
                      htmlFor="pricing"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Pricing*
                    </label>
                    <input
                      type="number"
                      id="pricing"
                      name="pricing"
                      value={formData.pricing}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                      placeholder="e.g. 10"
                      required
                      disabled={formData.isFree} // Disable input if product is free
                    />
                  </div>

                  {/* Pricing Examples */}
                  <div className="text-xs text-gray-500">
                    <p>Examples:</p>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Enter "29" to display as "$29/month"</li>
                      <li>Enter "99" to display as "$99/month"</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Step 4: Images and Submit */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Images & Final Review
                  </h2>

                  {/* Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Screenshots
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                      Add up to 3 screenshots of your tool in action
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {formData.screenshots.map(
                        (screenshot: any, index: number) => (
                          <div key={index} className="space-y-2">
                            <input
                              type="file"
                              ref={screenshotRefs[index]}
                              onChange={(e) => handleScreenshotUpload(index, e)}
                              accept="image/*"
                              className="hidden"
                            />
                            <div
                              onClick={() => triggerScreenshotUpload(index)}
                              className="w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden"
                            >
                              <img
                                src={screenshot.preview}
                                alt={``}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => triggerScreenshotUpload(index)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              {screenshot.file
                                ? "Change image"
                                : "Upload screenshot"}
                            </button>
                          </div>
                        )
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      PNG, JPG, GIF up to 5MB. Recommended aspect ratio: 16:9
                    </p>
                  </div>

                  {/* Review Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">
                      Submission Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Tool Name</p>
                        <p className="font-medium">
                          {formData.name || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium">{formData.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Platforms</p>
                        <p className="font-medium">
                          {Object.keys(formData.platforms)
                            .filter((platform) => formData.platforms[platform])
                            .join(", ") || "None selected"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pricing</p>
                        <p className="font-medium">
                          {formData.pricing || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start mt-6">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                      required
                    />
                    <label
                      htmlFor="terms"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      I confirm that the information provided is accurate and I
                      have the right to list this tool.
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 cursor-pointer bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    disabled={loadingButton}
                    type="submit"
                    className="px-6 py-3 cursor-pointer bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    {loadingButton ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Tool</span>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

