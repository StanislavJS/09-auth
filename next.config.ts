/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ac.goit.global', 'example.com'], // додай потрібні домени
  },
};

module.exports = nextConfig;
