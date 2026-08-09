import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

/**
 * Content Security Policy
 *
 * 'unsafe-inline' is permitted for style-src because Tailwind CSS v4 emits
 * inline styles and Next.js injects critical CSS inline at runtime.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://giscus.app https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://giscus.app https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-src https://giscus.app",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains',
  },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
];

/**
 * Next.js 설정
 */
const nextConfig: NextConfig = {
  // MDX 파일을 페이지로 처리
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
    globalNotFound: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/ko/:path*',
        headers: [{ key: 'Content-Language', value: 'ko' }],
      },
      {
        source: '/en/:path*',
        headers: [{ key: 'Content-Language', value: 'en' }],
      },
    ];
  },
};

/**
 * MDX 설정
 */
// Turbopack passes loader options to a worker process, so plugins must be
// serializable. Reference them by package name (string form); Turbopack
// resolves the modules at load time. Do NOT change to imported function refs.
const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: ['rehype-highlight'],
  },
});

export default withMDX(nextConfig);
