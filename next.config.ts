import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
      },
      {
        protocol: "https",
        hostname: "ujr1ymx20hywoxc7.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
