/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_ZEGO_APP_ID: 1947780277,
    NEXT_ZEGO_SERVER_SECRET: "8ae0ee935d3284a48ec464f8a167c7c4",
  },
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
