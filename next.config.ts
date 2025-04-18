import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint:{
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["d2srfewv7t3ba1.cloudfront.net", "lh3.googleusercontent.com"],
  },
};

export default nextConfig;
