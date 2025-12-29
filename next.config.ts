import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" }, // 👈 UploadThing domaini
      // ...varsa diğerleri
    ],
  },
};

export default nextConfig;