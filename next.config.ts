import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
    viewTransition: true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cwsmgmt.corsair.com"
      }
    ]
  }
};

export default nextConfig;
