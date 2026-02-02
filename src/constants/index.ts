export * from './navigation';
export * from './ui';

import { BlogPost, VisitorStat } from '@/types';

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'serverless-pricing',
    title: 'Why your AWS bill is lying to you',
    excerpt: 'Uncovering the hidden costs of provisioned concurrency and how to fix it.',
    category: 'Business',
    date: '2024-05-12',
    readTime: '5 min',
    likes: 1240
  },
  {
    slug: 'nextjs-architecture',
    title: 'Stop using useEffect for data fetching',
    excerpt: 'A deep dive into Server Actions and why the client boundary matters.',
    category: 'Engineering',
    date: '2024-05-10',
    readTime: '8 min',
    likes: 890
  },
  {
    slug: 'freelance-mindset',
    title: 'The gap between Code and Product',
    excerpt: 'How thinking like a CEO made me a better engineer.',
    category: 'Insight',
    date: '2024-05-01',
    readTime: '4 min',
    likes: 2100
  },
  {
    slug: 'rendering-patterns',
    title: 'Rethinking Rendering Patterns in 2025',
    excerpt: 'ISR, SSR, CSR? When to use what for maximum business impact.',
    category: 'Engineering',
    date: '2024-04-20',
    readTime: '12 min',
    likes: 560
  }
];

export const MOCK_VISITOR_DATA: VisitorStat[] = [
  { time: '09:00', visitors: 120 },
  { time: '10:00', visitors: 240 },
  { time: '11:00', visitors: 450 },
  { time: '12:00', visitors: 380 },
  { time: '13:00', visitors: 520 },
  { time: '14:00', visitors: 680 },
  { time: '15:00', visitors: 890 },
];
