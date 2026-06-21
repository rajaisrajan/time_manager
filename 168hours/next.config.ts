import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.pike.replit.dev",
    "*.replit.dev",
    "*.repl.co",
    "*",
  ],
};

export default nextConfig;
