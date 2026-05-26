import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  experimental: {
    turbopackFileSystemCacheForDev: true,
    viewTransition: true,
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ],
  }
};

export default nextConfig;
