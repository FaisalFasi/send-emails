import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Changed from 'standalone' to 'export' for Firebase Hosting
  distDir: "out",
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Critical for Firebase Hosting
};

export default nextConfig;
