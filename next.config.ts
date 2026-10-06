import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  allowedDevOrigins: [
    '10.234.38.79',
    '10.234.38.79:3000',
    'localhost',
    'localhost:3000',
  ],
};

export default nextConfig;