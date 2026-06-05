import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: false,
  async rewrites() {
    if (process.env.NODE_ENV === "production") {
      return [];
    }

    const apiTarget = process.env.API_INTERNAL_URL ?? "http://localhost:3001";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiTarget}/api/v1/:path*`
      }
    ];
  }
};

export default nextConfig;
