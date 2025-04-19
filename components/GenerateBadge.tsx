"use client"
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateBadge } from "@/frontendservices/api";
import { Copy, Check, X, RefreshCw, Zap, Eye } from "lucide-react";
import toast from "react-hot-toast";

export const GenerateBadge = ({ tool }:any) => {
  const [badgeState, setBadgeState] = useState({
    mode: tool?.badgeMode || null,
    badgeCode: tool?.badgeCode || null,
    copied: false,
    isSelectDropdownOpen: false,
    isBadgeDropdownOpen: false,
    isLoading: false,
  });

  const selectDropdownRef = useRef<any>(null);
  const badgeDropdownRef = useRef<any>(null);
  const generateButtonRef = useRef<any>(null);

  const existingBadgeCode = badgeState.badgeCode;
  const currentMode = badgeState.mode;

  const generateBadgeCall = useCallback(
    
    async (mode:any) => {
    
      if (badgeState.isLoading) return;

      setBadgeState((prev) => ({ ...prev, isLoading: true }));
      try {

        const response = await generateBadge(tool?._id, mode);
        if (response?.badgeCode) {
          // Check if response is valid
          setBadgeState((prev) => ({
            ...prev,
            mode, // Store the mode that was generated
            badgeCode: response.badgeCode,
            copied: false,
            isSelectDropdownOpen: false, // Close selection
            isBadgeDropdownOpen: true, // Open badge display
            isLoading: false,
          }));
          toast.success(`Generated ${mode} mode badge!`);
        } else {
          throw new Error("Invalid response from server."); // Or handle specific error messages
        }
      } catch (error) {
        console.error("Error generating badge:", error);
        toast.error("Failed to generate badge. Please try again.");
        setBadgeState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [tool?._id, badgeState.isLoading]
  ); 

  const handleCopy = useCallback(() => {
    if (!existingBadgeCode) return;

    navigator.clipboard
      .writeText(existingBadgeCode)
      .then(() => {
        setBadgeState((prev) => ({ ...prev, copied: true }));
        toast.success("Badge code copied!");
        setTimeout(() => {
          setBadgeState((prev) => ({ ...prev, copied: false }));
        }, 2500); // Slightly longer timeout
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy code.");
      });
  }, [existingBadgeCode]); // Dependency: the code itself

  const toggleSelectDropdown = useCallback(() => {
    setBadgeState((prev) => ({
      ...prev,
      isSelectDropdownOpen: !prev.isSelectDropdownOpen,
      isBadgeDropdownOpen: false, // Close other dropdown when opening this one
    }));
  }, []);

  const toggleBadgeDropdown = useCallback(() => {
    setBadgeState((prev) => ({
      ...prev,
      isBadgeDropdownOpen: !prev.isBadgeDropdownOpen,
      isSelectDropdownOpen: false, // Close other dropdown when opening this one
    }));
  }, []);

  const closeBadgeDropdown = useCallback(() => {
    setBadgeState((prev) => ({ ...prev, isBadgeDropdownOpen: false }));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event:any) => {
      // Close Select Dropdown
      if (badgeState.isSelectDropdownOpen && selectDropdownRef.current && !selectDropdownRef.current.contains(event.target) && generateButtonRef.current && !generateButtonRef.current.contains(event.target)) {
        setBadgeState((prev) => ({ ...prev, isSelectDropdownOpen: false }));
      }

      if (badgeState.isBadgeDropdownOpen && badgeDropdownRef.current && !badgeDropdownRef.current.contains(event.target) && true) {
        closeBadgeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [badgeState.isSelectDropdownOpen, badgeState.isBadgeDropdownOpen, closeBadgeDropdown]);

  return (
    <div className="relative inline-block text-left">
      {" "}
      {/* Ensure alignment context */}
      <div className="flex items-center gap-2">
        {existingBadgeCode ? (
          <>
            {/* Button to view/copy existing badge */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 
              text-white rounded-full cursor-pointer shadow-lg hover:shadow-xl 
              transition-all duration-300 ease-in-out 
              flex items-center gap-2 group disabled:opacity-60"
              onClick={toggleBadgeDropdown}
              disabled={badgeState.isLoading} // Disable while loading new badge
            >
              <span className="font-medium">Your Badge</span>
              <Zap className="w-4 h-4 text-yellow-300 group-hover:animate-pulse" />
            </motion.button>

            {/* Button to open Regenerate options */}
            <motion.button
              ref={generateButtonRef} // Ref on the button that opens the select dropdown
              whileHover={{ rotate: badgeState.isLoading ? 0 : 180, scale: 1.1 }} // Don't rotate while loading
              whileTap={{ scale: 0.9 }}
              className={`p-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 
              text-white rounded-full cursor-pointer shadow-md hover:shadow-lg 
              transition-all duration-300 ease-in-out 
              flex items-center justify-center ${badgeState.isLoading ? "animate-spin" : ""}`}
              onClick={toggleSelectDropdown}
              disabled={badgeState.isLoading}
              aria-label="Regenerate badge"
            >
              <RefreshCw className="w-4 h-4" />
            </motion.button>
          </>
        ) : (
          // Button to Generate initial badge
          <motion.button
            ref={generateButtonRef} // Ref on the button that opens the select dropdown
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2.5 cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 
            text-white rounded-full shadow-lg hover:shadow-xl 
            transition-all duration-300 ease-in-out 
            flex items-center gap-2 group ${badgeState.isLoading ? "opacity-60 animate-pulse" : ""}`}
            onClick={toggleSelectDropdown}
            disabled={badgeState.isLoading}
          >
            <span className="font-medium">{badgeState.isLoading ? "Generating..." : "Generate Badge"}</span>
            {!badgeState.isLoading && <Zap className="w-4 h-4 text-yellow-300 group-hover:animate-pulse" />}
          </motion.button>
        )}

        <AnimatePresence>
          {/* --- Select Dropdown for Badge Mode (Regenerate/Generate) --- */}
          {badgeState.isSelectDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              ref={selectDropdownRef}
              className="absolute left-0 top-full z-[9999] mt-2 w-64 bg-white 
              rounded-xl shadow-2xl border border-gray-200 p-2.5 
              ring-1 ring-black ring-opacity-5" // Subtle ring
            >
              <p className="text-xs text-gray-500 px-1 pb-1.5 font-medium">Choose badge style:</p>
              <div className="space-y-1.5">
                <motion.button
                  whileHover={{ x: 2 }} // Subtle hover effect
                  onClick={() => generateBadgeCall("light")}
                  disabled={badgeState.isLoading}
                  className="w-full text-left px-3 py-2 
                  hover:bg-gray-100 hover:cursor-pointer rounded-lg text-sm flex items-center gap-3 
                  transition-colors duration-150 ease-in-out disabled:opacity-50"
                >
                  <div className="w-5 h-5 bg-white border-2 border-gray-400 rounded-full shadow-sm"></div>
                  <span className="text-gray-800 font-medium">Light Mode</span>
                </motion.button>
                <motion.button
                  whileHover={{ x: 2 }}
                  onClick={() => generateBadgeCall("dark")}
                  disabled={badgeState.isLoading}
                  className="w-full text-left px-3 py-2 
                  hover:bg-gray-100 hover:cursor-pointer rounded-lg text-sm flex items-center gap-3 
                  transition-colors duration-150 ease-in-out disabled:opacity-50"
                >
                  <div className="w-5 h-5 bg-gray-800 border-2 border-gray-400 rounded-full shadow-sm"></div>
                  <span className="text-gray-800 font-medium">Dark Mode</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* --- Badge Dropdown (Display/Copy/Preview) --- */}
          {existingBadgeCode && badgeState.isBadgeDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              ref={badgeDropdownRef}
              className="absolute left-0 top-full z-[9999] mt-2 w-[500px] 
              max-h-[600px] overflow-y-auto bg-white rounded-xl 
              shadow-2xl border border-gray-200 p-5 
              ring-1 ring-black ring-opacity-5"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Embed Your Badge</h3>
                <motion.button whileHover={{ rotate: 90, scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={closeBadgeDropdown} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                  <X className="w-5 h-5 cursor-pointer" />
                </motion.button>
              </div>

              {/* --- Badge Preview --- */}
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-indigo-500" />
                  Preview ({currentMode ? `${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} Mode` : "Current"})
                </h4>
                <div
                  className={`border border-dashed border-gray-300 p-4 rounded-md relative 
                     ${currentMode === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
                >
                  {/* Render the actual badge HTML */}
                  {/* IMPORTANT: Ensure existingBadgeCode is sanitized server-side before storing/sending */}
                  <div dangerouslySetInnerHTML={{ __html: existingBadgeCode }} />
                </div>
              </div>

              {/* --- Code Block --- */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-semibold text-gray-700">HTML Code</h4>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleCopy} className={`flex cursor-pointer items-center gap-1.5 text-sm px-3 py-1 rounded-md transition-colors duration-150 ease-in-out ${badgeState.copied ? "bg-green-100 text-green-700" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}>
                    {badgeState.copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {badgeState.copied ? "Copied!" : "Copy Code"}
                  </motion.button>
                </div>
                <div className="relative bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <pre
                    className="text-sm text-gray-300 overflow-x-auto 
                          max-h-48 overflow-y-auto break-words whitespace-pre-wrap 
                          font-mono leading-relaxed scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800" // Added scrollbar styling
                  >
                    {existingBadgeCode}
                  </pre>
                </div>
              </div>

              {/* Footer Tip */}
              <div className="mt-5 text-sm text-gray-500 bg-yellow-50/70 p-3 rounded-lg border border-yellow-200/50">
                <strong className="text-yellow-700">Tip:</strong> Embedding this badge on your wesbite can help visitors recognize the quality and authenticity of your product.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
