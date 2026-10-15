import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  devIndicators: false,
  outputFileTracingIncludes: {
    "/knowledge": ["./src/content/knowledge/**/*.mdx"],
    "/knowledge/*": ["./src/content/knowledge/**/*.mdx"],
    "/sitemap.xml": ["./src/content/knowledge/**/*.mdx"],
  },
};
export default nextConfig;
