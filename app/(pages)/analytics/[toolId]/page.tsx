"use client";

import React, { useEffect, useState } from "react";
import { getToolAnalytics } from "@/frontendservices/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Clock, Link2, MousePointer, Star, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { formatDate, capitalizeFirstLetter, formatChartDate, sortChronologically } from "@/utils/common";
import { filterOptions } from "@/utils/constants";
import { useParams, useRouter } from "next/navigation";

const ToolLogo = ({ name, logo }:any) => {
  if (logo) {
    return (
      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center">
        <img
          src={logo}
          alt={`${name} logo`}
          className="w-full h-full object-contain"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </div>
    );
  }

  return <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">{name ? <span className="text-3xl font-bold text-gray-500">{name.charAt(0).toUpperCase()}</span> : <ImageIcon className="w-10 h-10 text-gray-400" />}</div>;
};

const CustomTooltip = ({ active, payload, label }:any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-md">
        <p className="font-semibold text-gray-700">{formatDate(label)}</p>
        <p className="text-blue-600">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const page = () => {
  const { user } = useAuth();
  const { toolId }:any = useParams();
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [filter, setFilter] = useState("last_2_days");
  const router = useRouter();

  useEffect(() => {
    const getToolAnalyticsCall = async () => {
      try {
        setLoading(true);
        const res = await getToolAnalytics(toolId, filter);

        if (res.click_event) {
          res.click_event = sortChronologically(res.click_event);
        }
        if (res.link_click_event) {
          res.link_click_event = sortChronologically(res.link_click_event);
        }

        setAnalyticsData(res);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getToolAnalyticsCall();
  }, [toolId, filter]);

  useEffect(() => {
    if (!loading && user && analyticsData && analyticsData.tool) {
      if (user.tier !== "featured" || user._id !== analyticsData.tool.submittedBy) {
        router.push("/");
      }
    }
  }, [user, analyticsData, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
        <p>Unable to fetch analytics. Please try again later.</p>
        <p>{error.message}</p>
      </div>
    );
  }

  if (analyticsData.message) {
    return (
      <div className="text-center p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">No Analytics Available</h2>
        <p>Looks like there's no data to display right now. Check back later!</p>
      </div>
    );
  }

  const avgRating = analyticsData.tool?.user_avg_rating;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user?.name} 👋</h1>
            <p className="text-gray-500">Here's a detailed overview of your tool's performance</p>
          </div>
        </motion.div>

        {/* Your Tool Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Tool</h2>
          <div className="grid md:grid-cols-5 gap-4 items-center">
            {/* Tool Logo */}
            <ToolLogo name={analyticsData.tool?.name} logo={analyticsData.tool?.logo} />

            <div>
              <p className="text-xs text-gray-500">Tool Name</p>
              <p className="text-sm font-medium">{analyticsData.tool?.name || "N/A"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Category</p>
              <p className="text-sm font-medium">{analyticsData.tool?.category || "N/A"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Status</p>
              <p className="text-sm font-medium">{capitalizeFirstLetter(analyticsData.tool?.status) || "N/A"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Rating</p>
              <div className="flex items-center">
                {avgRating === 0 ? <span className="text-gray-500 text-sm">No ratings available yet</span> : [...Array(5)].map((_, index) => <Star key={index} className={`w-5 h-5 ${index < Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />)}
                {avgRating !== 0 && <span className="ml-2 text-sm text-gray-600">({avgRating?.toFixed(1)})</span>}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Graphs Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Performance Graphs</h2>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Click Events Chart */}
            <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold flex items-center mb-4 text-gray-700">
                <MousePointer className="mr-2 text-blue-500" /> Click Events
              </h3>
              {analyticsData.click_event && analyticsData.click_event.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.click_event}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                    <XAxis dataKey="date" tickFormatter={formatChartDate} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="count" name="Clicks" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500 py-12">No click events found</div>
              )}
            </div>

            {/* Link Click Events Chart */}
            <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold flex items-center mb-4 text-gray-700">
                <Link2 className="mr-2 text-purple-500" /> Link Click Events
              </h3>
              {analyticsData.link_click_event && analyticsData.link_click_event.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.link_click_event}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                    <XAxis dataKey="date" tickFormatter={formatChartDate} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="count" name="Link Clicks" stroke="#8B5CF6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500 py-12">No link click events found</div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Total Analytics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Total Analytics</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg flex items-center">
              <MousePointer className="mr-3 text-blue-500" />
              <div>
                <h4 className="font-semibold text-gray-700">Total Clicks</h4>
                <p className="text-xl text-gray-800">{analyticsData.clickEventTotal}</p>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg flex items-center">
              <Link2 className="mr-3 text-green-500" />
              <div>
                <h4 className="font-semibold text-gray-700">Total Link Clicks</h4>
                <p className="text-xl text-gray-800">{analyticsData.linkClickEventTotal}</p>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg flex items-center">
              <Clock className="mr-3 text-purple-500" />
              <div>
                <h4 className="font-semibold text-gray-700">Last Activity</h4>
                <p className="text-sm text-gray-800">{formatDate(analyticsData.last_activity)}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default page;