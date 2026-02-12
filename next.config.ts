import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimization: Enable SWC Minification (default in Next.js 13+, but explicit is good)
  // swcMinify: true, // Deprecated in Next.js 15+ as it is default
  experimental: {
    // Optimization: Tree shake these packages aggressively
    optimizePackageImports: ['lucide-react', 'react-icons', '@vercel/analytics', '@vercel/speed-insights'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" }, // 👈 UploadThing domaini
      // ...varsa diğerleri
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          }
        ],
      },
    ]
  },
};

export default nextConfig;