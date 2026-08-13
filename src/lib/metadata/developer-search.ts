import type { Locale } from "@/i18n-config";

export type DeveloperSearchSurface =
  | "home"
  | "profile"
  | "projects"
  | "blog"
  | "contact";

export interface DeveloperSearchMetadata {
  readonly title: string;
  readonly description: string;
  readonly keywords: readonly string[];
}

const DEVELOPER_SEARCH_METADATA: Record<
  Locale,
  Record<DeveloperSearchSurface, DeveloperSearchMetadata>
> = {
  ko: {
    home: {
      title: "김현중 | 소프트웨어 엔지니어·풀스택 개발자",
      description:
        "React·Next.js 프론트엔드, Node.js·Python 백엔드와 AWS 클라우드 시스템을 만드는 소프트웨어 엔지니어·풀스택 개발자 김현중의 포트폴리오와 기술 블로그.",
      keywords: [
        "개발자",
        "김현중 개발자",
        "풀스택 개발자",
        "백엔드 개발자",
        "프론트엔드 개발자",
        "웹 개발자",
        "AWS 개발자",
        "Next.js 개발자",
        "소프트웨어 엔지니어",
      ],
    },
    profile: {
      title: "김현중 개발자 프로필 | 풀스택·백엔드·AWS 경력",
      description:
        "React·Next.js 프론트엔드, Node.js·Python 백엔드, AWS 클라우드 개발 경력과 기술 스택을 정리한 소프트웨어 엔지니어 김현중의 프로필.",
      keywords: [
        "김현중 개발자",
        "개발자 프로필",
        "풀스택 개발자",
        "백엔드 개발자",
        "프론트엔드 개발자",
        "AWS 개발자",
        "소프트웨어 엔지니어",
      ],
    },
    projects: {
      title: "김현중 개발자 포트폴리오 | 웹·AI·AWS 프로젝트",
      description:
        "Next.js·TypeScript 웹 제품, Node.js·Python 백엔드, AWS 클라우드와 AI 에이전트 프로젝트를 담은 김현중 개발자 포트폴리오.",
      keywords: [
        "개발자 포트폴리오",
        "풀스택 개발자 포트폴리오",
        "백엔드 개발자 포트폴리오",
        "웹 개발자 포트폴리오",
        "Next.js 프로젝트",
        "AWS 프로젝트",
        "AI 개발 프로젝트",
      ],
    },
    blog: {
      title: "김현중 기술 블로그 | Next.js·AWS·AI 에이전트",
      description:
        "Next.js·React 프론트엔드, Node.js·Python 백엔드·풀스택 아키텍처, AWS와 AI 에이전트를 다루는 김현중의 기술 블로그.",
      keywords: [
        "개발자 블로그",
        "기술 블로그",
        "Next.js 개발자",
        "백엔드 개발자",
        "풀스택 개발자",
        "AWS 개발자",
        "AI 에이전트",
      ],
    },
    contact: {
      title: "김현중 연락처 | 소프트웨어 엔지니어",
      description:
        "소프트웨어 엔지니어 김현중에게 메시지를 보낼 수 있는 연락 페이지.",
      keywords: ["김현중 연락처", "개발자 연락처", "소프트웨어 엔지니어"],
    },
  },
  en: {
    home: {
      title: "Hyunjoong Kim | Software Engineer & Full-Stack Developer",
      description:
        "Portfolio and technical writing by Hyunjoong Kim, a software engineer and full-stack developer building React and Next.js frontend, Node.js and Python backend, and AWS cloud systems.",
      keywords: [
        "Hyunjoong Kim developer",
        "full-stack developer",
        "backend developer",
        "frontend developer",
        "web developer",
        "AWS developer",
        "Next.js developer",
        "software engineer",
      ],
    },
    profile: {
      title: "Hyunjoong Kim | Software Engineer Profile",
      description:
        "Software engineer profile covering Hyunjoong Kim's React and Next.js frontend, Node.js and Python backend, full-stack, and AWS cloud experience.",
      keywords: [
        "Hyunjoong Kim",
        "software engineer profile",
        "full-stack developer",
        "backend developer",
        "frontend developer",
        "AWS developer",
      ],
    },
    projects: {
      title: "Hyunjoong Kim Developer Portfolio | Web, AI & AWS Projects",
      description:
        "Developer portfolio featuring Next.js and TypeScript web products, Node.js and Python backend systems, AWS cloud architecture, and AI agent projects.",
      keywords: [
        "developer portfolio",
        "full-stack developer portfolio",
        "backend developer portfolio",
        "web developer portfolio",
        "Next.js projects",
        "AWS projects",
        "AI developer projects",
      ],
    },
    blog: {
      title: "Hyunjoong Kim Tech Blog | Next.js, AWS & AI Agents",
      description:
        "Technical writing on Next.js and React frontend, Node.js and Python backend architecture, AWS cloud systems, and AI agents.",
      keywords: [
        "developer blog",
        "software engineering blog",
        "Next.js developer",
        "backend developer",
        "full-stack developer",
        "AWS developer",
        "AI agents",
      ],
    },
    contact: {
      title: "Contact Hyunjoong Kim | Software Engineer",
      description:
        "Contact page for sending a message to software engineer Hyunjoong Kim.",
      keywords: [
        "Hyunjoong Kim contact",
        "software engineer contact",
        "developer contact",
      ],
    },
  },
};

export const getDeveloperSearchMetadata = (
  lang: Locale,
  surface: DeveloperSearchSurface
): DeveloperSearchMetadata => DEVELOPER_SEARCH_METADATA[lang][surface];

export const getBlogPaginationSearchMetadata = (
  lang: Locale,
  page: number
): Pick<DeveloperSearchMetadata, "title" | "description"> => {
  if (!Number.isSafeInteger(page) || page < 2) {
    throw new RangeError("Blog pagination metadata requires a page number of 2 or greater.");
  }

  if (lang === "ko") {
    return {
      title: `김현중 기술 블로그 ${page}페이지 | Next.js·AWS·AI 에이전트`,
      description: `Next.js, 백엔드·풀스택 아키텍처, AWS와 AI 에이전트 실전 글을 모은 김현중 기술 블로그 ${page}페이지.`,
    };
  }

  return {
    title: `Hyunjoong Kim Tech Blog — Page ${page} | Next.js, AWS & AI Agents`,
    description: `Page ${page} of Hyunjoong Kim's technical writing on Next.js, backend and full-stack architecture, AWS cloud systems, and AI agents.`,
  };
};
