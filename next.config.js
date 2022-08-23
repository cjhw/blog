/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 用next的image组件要设置域名白名单
  images: {
    domains: ['img1.mukewang.com'],
  },
  swcMinify: true,
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
};

const removeImports = require('next-remove-imports')();
module.exports = removeImports(nextConfig);
