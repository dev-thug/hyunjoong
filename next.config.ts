import type { NextConfig } from "next";
import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // Turbopack과의 호환성을 위한 설정
  buildExcludes: [/middleware-manifest\.json$/],
});

const ContentSecurityPolicy = [
  "default-src 'self'", // 기본은 same-origin
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com https://stats.g.doubleclick.net",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://stats.g.doubleclick.net https://pagead2.googlesyndication.com",
  "frame-src https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net",
  "worker-src 'self' blob:",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next.js 16: Turbopack is enabled by default, add empty config for compatibility
  turbopack: {},
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // TASK 1 (Report-Only rollout - safest first step only):
          //   - Switched from enforcing "Content-Security-Policy" to "Content-Security-Policy-Report-Only".
          //   - Policy value is *exactly* the original (no changes, no tightening, no nonces).
          //   - All other security headers (Referrer-Policy, X-Content-Type-Options, X-Frame-Options) untouched.
          //   - Revert to old behavior: delete the Report-Only block below and restore the original 2 lines:
          //       key: "Content-Security-Policy",
          //       value: ContentSecurityPolicy,
          //   - This ensures zero impact on AdSense, GA4, PWA, inline scripts, etc. Site behavior identical.
          //   - Violations (currently none due to permissive policy; will appear in console when policy tightened later)
          //     are reported to browser DevTools + the report-uri below (placeholder, no endpoint created).
          {
            key: "Content-Security-Policy-Report-Only",
            value: ContentSecurityPolicy + "; report-uri https://csp-report.example.com/report",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);
