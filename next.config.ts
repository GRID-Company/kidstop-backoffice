import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
