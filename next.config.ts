import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.figma.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: "www.lif.cc",
      },
      {
        protocol: "https",
        hostname: "www.mad.biz",
      },
      {
        protocol: "https",
        hostname: "www.horumyjygevi.me",
      },
      {
        protocol: "https",
        hostname: "www.besiqyfe.us",
      },
      {
        protocol: "https",
        hostname: "www.alvutdap.com",
      },
    ],
  },
};

export default nextConfig;
