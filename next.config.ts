import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pokemontcg.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cards.scryfall.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tcgplayer-cdn.tcgplayer.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.pricecharting.com',
        pathname: '/**',
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
