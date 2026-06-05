import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@tanstack/react-query"]
  },
  async rewrites() {
    if (process.env.NODE_ENV === "production") {
      return [];
    }

    const apiTarget = process.env.API_INTERNAL_URL ?? "http://localhost:3001";
    return [
      {
        source: "/crm-api/:path*",
        destination: `${apiTarget}/:path*`
      },
      {
        source: "/api/v1/:path*",
        destination: `${apiTarget}/api/v1/:path*`
      }
    ];
  }
};

export default nextConfig;
