import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.pike.replit.dev",
    "*.replit.dev",
    "*.repl.co",
    "*",
  ],
  async rewrites() {
    return [
      {
        source: "/__mockup/:path*",
        destination: "http://localhost:3001/__mockup/:path*",
      },
    ];
  },
};

export default nextConfig;
