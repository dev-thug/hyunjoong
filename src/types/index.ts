export * from "./navigation";
export * from "./blog";

export interface Project {
  id: string;
  slug: string;
  title: string;
  adCopy: string;
  description: string;
  highlight: string;
  serviceUrl?: string;
  image: string;
  tags: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  lang: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: "Engineering" | "Business" | "Insight";
  date: string;
  readTime: string;
  likes: number;
}

export interface VisitorStat {
  time: string;
  visitors: number;
}
