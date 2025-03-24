import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["files.edgestore.dev"], // Allow EdgeStore images
  },
};

export default nextConfig;
