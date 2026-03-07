import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disabled so useRef render counters in ui-state demos are accurate
};

const analyzed = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);

export default withNextIntl(analyzed);
