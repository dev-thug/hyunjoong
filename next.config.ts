import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

/**
 * Next.js 설정
 */
const nextConfig: NextConfig = {
  // MDX 파일을 페이지로 처리
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

/**
 * MDX 설정
 */
const withMDX = createMDX({});

export default withMDX(nextConfig);
