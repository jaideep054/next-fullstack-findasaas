import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, Loader2, MoveRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { newsletterSubscribe } from "@/services/api";

// --- Add CSS for the button shine effect ---
// You can put this in your main CSS file (e.g., index.css) or use a CSS-in-JS solution
// if you prefer. We'll define it here for clarity, assuming it's in a global scope.
const shineEffectCSS = `
  .button-shine::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(30deg);
    opacity: 0;
    transition: opacity 0.6s ease-in-out;
    pointer-events: none; /* Ensure it doesn't block clicks */
  }

  .button-shine:hover::after {
    opacity: 1;
    animation: shine 1.5s infinite linear;
  }

  @keyframes shine {
    0% {
      transform: rotate(30deg) translateX(-200%);
    }
    100% {
      transform: rotate(30deg) translateX(100%);
    }
  }
`;

// Inject the CSS (simple method for example, consider better approaches for production)
if (typeof window !== "undefined") {
  // Ensure running in browser
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = shineEffectCSS;
  document.head.appendChild(styleSheet);
}
// --- End CSS Injection ---

// Assume getSubscribeNewsletterURL is defined elsewhere or replace with actual URL
// const { getSubscribeNewsletterURL } = require("./path/to/url/helper");

// --- The Dark Theme Popup Component ---
export const NewsletterModal = ({ isOpen, onClose }:any) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setEmail("");
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const result = await newsletterSubscribe(email);
    setLoading(false);

    if (result) {
      toast.success(result || "Subscribed! Keep an eye on your inbox.");
      setEmail("");
      onClose();
    }
  };

  const popupVariants = {
    hidden: { opacity: 0, y: 50, x: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, x: 0, scale: 1, transition: { type: "spring", stiffness: 150, damping: 20, delay: 0.3 } },
    exit: { opacity: 0, y: 30, x: 30, scale: 0.95, transition: { duration: 0.2, ease: "easeOut" } },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 w-[calc(100%-2rem)] sm:w-auto" variants={popupVariants} initial="hidden" animate="visible" exit="exit" onClick={(e) => e.stopPropagation()}>
          {/* Popup Card: Dark theme gradient, updated shadow */}
          <div
            className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-700/50" // Dark gradient, adjusted border
          >
            {/* Close Button: Adjusted for dark theme */}
            <button
              className="absolute cursor-pointer top-2 right-2 text-gray-500 hover:text-gray-200 transition-colors rounded-full p-1.5 hover:bg-gray-700/50 z-10" // Dark theme hover
              onClick={onClose}
              aria-label="Close newsletter popup"
            >
              <X size={18} />
            </button>

            {/* Content Area */}
            <div className="p-5 pt-7">
              {/* Icon: Updated background for contrast */}
              <div
                className="mb-3 flex items-center justify-center w-10 h-10 bg-indigo-500/20 ring-1 ring-indigo-400/30 rounded-full" // Semi-transparent bg with ring
              >
                <Mail className="text-indigo-300" size={20} /> {/* Lighter icon color */}
              </div>

              {/* Text Content: Light text colors */}
              <h3 className="text-lg font-semibold text-gray-100 mb-1">Cure Your Inbox Boredom</h3>
              <p className="text-xs text-gray-400 mb-2">Imagine: a monthly email you actually want to open, packed with top-tier SaaS. Yeah, we're building that.</p>
              <p className="text-[11px] text-indigo-400 mb-4 font-medium italic">
                {" "}
                {/* Adjusted color */}
                (Newsletter launching soon)
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Email Input: Dark theme adjustments */}
                <div className="relative">
                  <label htmlFor="popup-newsletter-email" className="sr-only">
                    Email Address
                  </label>
                  <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" /> {/* Darker placeholder icon */}
                  <input
                    id="popup-newsletter-email"
                    type="email"
                    placeholder="Your best email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-700/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-500 text-gray-200" // Dark theme input styles
                    aria-label="Email for newsletter"
                  />
                </div>

                {/* Submit Button: Added 'button-shine' class and relative positioning */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  // Added 'button-shine' and 'relative overflow-hidden' for the effect
                  className={`relative cursor-pointer overflow-hidden button-shine w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400/70 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center group shadow-md hover:shadow-lg ${!loading ? "hover:from-indigo-600 hover:to-purple-700" : ""}`}
                  whileHover={!loading ? { scale: 1.03 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Joining...
                    </>
                  ) : (
                    <>
                      Subscribe
                      <MoveRight className="ml-1.5 h-4 w-4 transition-transform duration-200 ease-out transform group-hover:translate-x-1" />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
