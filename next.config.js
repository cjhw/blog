/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 用next的image组件要设置域名白名单
  images: {
    domains: ['img1.mukewang.com'],
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
};

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const removeImports = require('next-remove-imports')();

module.exports = removeImports(withMDX(nextConfig));
