import type { NextConfig } from "next";

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
  // CSP violation reporting (replaces previous example.com placeholder):
  // - report-uri: legacy but widely supported (works with Report-Only)
  // - report-to: modern directive (requires Reporting-Endpoints header below)
  "report-uri /api/csp-report",
  "report-to csp-violation",
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
          //     are reported via the dedicated /api/csp-report endpoint (minimal safe handler).
          //   - Uses both report-uri (broad compat) + report-to (modern) for maximum coverage.
          //   - Reporting-Endpoints header enables report-to; endpoint performs validation + sanitized logging only.
          {
            key: "Content-Security-Policy-Report-Only",
            value: ContentSecurityPolicy,
          },
          {
            // Modern companion to report-to directive in the CSP above.
            // Format: name="url" (quotes required around the path).
            key: "Reporting-Endpoints",
            value: 'csp-violation="/api/csp-report"',
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

export default nextConfig;
