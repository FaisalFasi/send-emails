import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  // Enable dynamic routes on client side
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
