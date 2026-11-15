import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /**
   * در این محیط، سرور dev به‌صورت خودکار روی پوشه .next کار می‌کند؛
   * برای راستی‌آزمایی build بدون کندن dev، می‌توان پوشه خروجی را
   * با متغیر محیطی NEXT_DIST_DIR جدا کرد:
   *   NEXT_DIST_DIR=.next-build next build
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: false,
};

export default nextConfig;
