/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unavatar.io",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
