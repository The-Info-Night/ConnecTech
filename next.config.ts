import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.jeb-incubator.com/:path*", // ton API externe
      },
    ];
  },
};

export default nextConfig;
