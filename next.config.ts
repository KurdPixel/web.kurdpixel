import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images longer than some upstream CDNs allow.
    // (This affects Next's /_next/image responses, not the remote origin.)
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ['@clerk/nextjs'],
  },
};

export default nextConfig;