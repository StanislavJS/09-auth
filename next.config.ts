/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ac.goit.global', 'example.com'], // додай потрібні домени
  },
};

module.exports = nextConfig;
