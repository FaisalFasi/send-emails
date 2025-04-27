import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Changed from 'standalone' to 'export' for Firebase Hosting
  // distDir: "out",
  images: {
    unoptimized: true, // Required for static export
  },
  experimental: {
    serverActions: {
      // Either specify allowedOrigins or bodySizeLimit, or both
      bodySizeLimit: "2mb", // Optional size limit
    },
  },
};

export default nextConfig;
