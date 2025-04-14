import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { replaceS3WithCloudFront } from "@/utils/common";
import { ExternalLink, Star } from "lucide-react";
import { trackAnalytics } from "@/services/api";
import { useRouter } from "next/navigation";

export const ToolCard = ({ card }: any) => {
  const router = useRouter();
  const isFeatured = card.featured === true;

  const cardStyles = {
    base: "bg-white border border-gray-200 text-gray-800",
    featured:
      "bg-gradient-to-br from-indigo-900 via-purple-900 to-black border-purple-800 text-white shadow-xl shadow-purple-600/30",
  };

  const gradientColors = useMemo(() => {
    const gradientOptions = [
      { from: "from-green-400", via: "via-cyan-500", to: "to-blue-500" },
      { from: "from-yellow-400", via: "via-orange-500", to: "to-red-500" },
      { from: "from-indigo-500", via: "via-purple-500", to: "to-pink-500" },
      { from: "from-teal-500", via: "via-emerald-500", to: "to-green-500" },
    ];

    return gradientOptions[Math.floor(Math.random() * gradientOptions.length)];
  }, [card._id]);

  const getPricingDisplay = (isFeaturedCard: boolean) => {
    const baseClasses =
      "px-2.5 py-1 rounded-full text-xs font-medium inline-block";
    let styles = {
      free: "bg-green-100 text-green-800",
      freemium: "bg-blue-100 text-blue-800",
      onetime: "bg-purple-100 text-purple-800",
      paid: "bg-indigo-100 text-indigo-800",
      premiumText: "text-blue-600",
    };
    if (isFeaturedCard) {
      styles = {
        free: "bg-green-500/50 text-green-200",
        freemium: "bg-blue-500/50 text-blue-200",
        onetime: "bg-purple-500/50 text-purple-200",
        paid: "bg-indigo-500/50 text-indigo-200",
        premiumText: "text-blue-300",
      };
    }

    if (card.is_free)
      return <span className={`${baseClasses} ${styles.free}`}>Free</span>;
    if (card.is_freemiun)
      return (
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
          Freemium {card.pricing && `• Premium from $${card.pricing}`}
        </span>
      );
    if (card.is_onetime)
      return (
        <span className={`${baseClasses} ${styles.onetime}`}>
          One-time ${card.pricing}
        </span>
      );
    if (card.pricing)
      return (
        <span className={`${baseClasses} ${styles.paid}`}>
          From ${card.pricing}/month
        </span>
      );
    return null;
  };

  const handleTrackEventClick = async (eventType: any) => {
    try {
      await trackAnalytics(card._id, eventType);
    } catch (error) {
      console.error("Analytics tracking failed:", error);
    }
  };

  const shortDescription = useMemo(() => {
    const words = card.description?.split(" ") || [];
    const limit = 9.5;
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : card.description || "";
  }, [card.description]);

  const logoBgStyle = isFeatured ? "bg-white p-1 rounded-lg" : "";

  const cardHoverAnimation = {
    scale: isFeatured ? 1.03 : 1.02,
    boxShadow: `0 12px 30px -6px rgba(${
      isFeatured ? "168, 85, 247, 0.35" : "0, 0, 0, 0.12"
    }), 0 10px 15px -5px rgba(${
      isFeatured ? "168, 85, 247, 0.2" : "0, 0, 0, 0.05"
    })`,
  };

  return (
    <motion.div
      className={`relative flex flex-col rounded-xl shadow-md overflow-hidden transition-shadow duration-300 ${
        isFeatured ? cardStyles.featured : cardStyles.base
      }`}
      whileHover={cardHoverAnimation}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        className={`h-2 w-full bg-gradient-to-r ${gradientColors.from} ${gradientColors.via} ${gradientColors.to}`}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 10,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          backgroundSize: "200% 200%",
        }}
      />

      <div className="p-5 md:p-6 flex flex-col flex-grow h-full">
        <div className="flex justify-between items-start mb-4 ">
          <div
            className={`w-12 h-12 flex-shrink-0 flex items-center justify-center overflow-hidden ${logoBgStyle}`}
          >
            <img
              title={card.name}
              loading="lazy"
              src={replaceS3WithCloudFront(card?.logo)}
              className="w-full h-full object-contain"
              alt={`${card.name} logo`}
              width="48"
              height="48"
            />
          </div>

          <div className="flex items-center gap-2 text-right">
            <div
              className={`text-xs font-medium ${
                isFeatured ? "text-purple-300" : "text-gray-500"
              }`}
            >
              {card.category}
            </div>
            {isFeatured && (
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
                <Star size={12} fill="currentColor" className="-ml-0.5" />
                Featured
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex items-center mb-2 gap-1.5">
          <p
            onClick={() => {
              handleTrackEventClick("click");
              router.push(`/tool/${card._id}/${card.slug}`);
            }}
            className="group"
          >
            <h3
              className={`text-xl ${
                isFeatured ? "hover:text-purple-300" : "hover:text-indigo-700"
              } hover:cursor-pointer font-bold transition-colors ${
                isFeatured ? "text-white" : "text-gray-900"
              }`}
            >
              {card.name}
            </h3>
          </p>
          <motion.svg
            className={`w-5 h-5 ${isFeatured ? "text-white" : "text-blue-500"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </motion.svg>
        </div>

        <p
          className={`mb-4 flex-grow ${
            isFeatured ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {shortDescription}
        </p>

        <div className="mb-5 h-6 flex items-center">
          {getPricingDisplay(isFeatured)}
        </div>

        <div className="mt-auto">
          <motion.a
            onClick={() => handleTrackEventClick("link_click")}
            href={
              card?.tool_url?.startsWith("http")
                ? card.tool_url
                : `https://${card.tool_url}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-2.5 px-4 font-semibold rounded-lg flex items-center justify-center transition-colors duration-200 group ${
              isFeatured
                ? "bg-white text-black hover:bg-gray-200 shadow-sm"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span>Visit {card.name}</span>
            <ExternalLink
              className={`h-4 w-4 ml-2 transition-transform duration-200 ${
                isFeatured ? "text-black" : "text-white"
              } group-hover:translate-x-1`}
            />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};
