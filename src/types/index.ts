export * from './navigation';

export interface Project {
  id: string;
  title: string;
  adCopy: string;
  techHighlight: string;
  image: string;
  tags: string[];
  metrics: {
    label: string;
    value: string;
  }[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: 'Engineering' | 'Business' | 'Insight';
  date: string;
  readTime: string;
  likes: number;
}

export interface VisitorStat {
  time: string;
  visitors: number;
}
