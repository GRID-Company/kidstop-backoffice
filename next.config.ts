import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pokemontcg.io',
      },
    ],
  },
  async redirects() {
        return [
            {
                source: '/',
                permanent: true,
                destination: '/login',
            },
        ];
    },
};

export default nextConfig;
