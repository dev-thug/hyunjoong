export * from './navigation';
export * from './ui';

import { Project, BlogPost, VisitorStat } from '@/types';

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Enterprise Serverless Migration',
    adCopy: 'Start with $300, Scale to Enterprise.',
    techHighlight: 'Amplify Gen2 · -40% Dev Time',
    image: 'https://picsum.photos/id/1/800/600',
    tags: ['AWS', 'Next.js', 'Cost Optimization'],
    metrics: [
      { label: 'Cost Reduction', value: '65%' },
      { label: 'Deployment', value: '10x Faster' }
    ]
  },
  {
    id: 'p2',
    title: 'Real-time Logistics Dashboard',
    adCopy: 'Visibility is the new competitive advantage.',
    techHighlight: 'Socket.io · <50ms Latency',
    image: 'https://picsum.photos/id/180/800/600',
    tags: ['WebSocket', 'D3.js', 'Redis'],
    metrics: [
      { label: 'Latency', value: '45ms' },
      { label: 'Concurrent', value: '10k+' }
    ]
  },
  {
    id: 'p3',
    title: 'AI-Driven Commerce Search',
    adCopy: 'Stop guessing what your users want.',
    techHighlight: 'Vector DB · +15% Conversion',
    image: 'https://picsum.photos/id/20/800/600',
    tags: ['Python', 'Pinecone', 'React'],
    metrics: [
      { label: 'Conversion', value: '+15%' },
      { label: 'Search Speed', value: '120ms' }
    ]
  }
];

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
