export * from './navigation';
export * from './ui';

import { Project, BlogPost, VisitorStat } from '@/types';

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    slug: 'enterprise-serverless-migration',
    title: 'Enterprise Serverless Migration',
    adCopy: 'Start with $300, Scale to Enterprise.',
    description: 'AWS Lambda와 Amplify Gen2를 활용한 대규모 엔터프라이즈 시스템의 서버리스 마이그레이션 프로젝트입니다. 기존 모놀리식 아키텍처에서 마이크로서비스 기반 서버리스 아키텍처로 전환하여 운영 비용을 65% 절감하고, CI/CD 파이프라인 최적화를 통해 배포 속도를 10배 향상시켰습니다.',
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
    slug: 'realtime-logistics-dashboard',
    title: 'Real-time Logistics Dashboard',
    adCopy: 'Visibility is the new competitive advantage.',
    description: 'Socket.io와 Redis Pub/Sub을 활용한 실시간 물류 모니터링 대시보드입니다. 10,000개 이상의 동시 접속을 처리하면서도 45ms 이하의 레이턴시를 유지하며, D3.js를 활용한 인터랙티브 데이터 시각화로 물류 운영 효율성을 극대화했습니다.',
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
    slug: 'ai-driven-commerce-search',
    title: 'AI-Driven Commerce Search',
    adCopy: 'Stop guessing what your users want.',
    description: 'Pinecone 벡터 데이터베이스와 OpenAI 임베딩을 활용한 AI 기반 이커머스 검색 엔진입니다. 시맨틱 검색을 통해 사용자 의도를 정확히 파악하여 전환율을 15% 향상시켰으며, 120ms 이하의 빠른 검색 속도로 사용자 경험을 개선했습니다.',
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
