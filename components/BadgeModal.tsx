"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface User {
  name: string;
  is_seller?: boolean;
}

interface BadgeModalProps {
  user: User | null;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const isShown = localStorage.getItem("sellerWelcomeModalShown");

    if (user?.is_seller && !isShown) {
      setIsOpen(true);
    }
  }, [user]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("sellerWelcomeModalShown", "true");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          {/* --- Modal Content --- */}
          <motion.div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="text-center">
              <motion.div
                className="mb-6"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Congratulations {user?.name} 🎉
                </h2>
                <p className="text-gray-600 mb-6">
                  Thank you for listing with us! Create a custom badge for your
                  tool to showcase on your website. This helps increase
                  credibility and trust.
                </p>
              </motion.div>

              {/* Create Badge Button */}
              <Link href="/profile" passHref>
                <motion.button
                  onClick={handleClose}
                  className="bg-indigo-600 cursor-pointer text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center mx-auto space-x-2 shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Create Your Badge</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
