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
      title: "김현중 | 소프트웨어 엔지니어",
      description:
        "소프트웨어 엔지니어이자 Specify 창업자인 김현중이 Specify·맘마·페티를 1인으로 운영하며 제품과 소프트웨어 개발 경험을 기록합니다.",
      keywords: ["김현중", "소프트웨어 엔지니어", "Specify 창업자"],
    },
    profile: {
      title: "김현중 프로필 | 소프트웨어 엔지니어",
      description:
        "Specify·맘마·페티를 1인으로 운영하는 소프트웨어 엔지니어 김현중의 경력과 기술 스택을 소개합니다.",
      keywords: ["김현중 프로필", "소프트웨어 엔지니어 경력"],
    },
    projects: {
      title: "김현중 프로젝트 | 웹·클라우드·AI",
      description:
        "웹·클라우드 제품과 AI 에이전트 등 김현중이 직접 만든 프로젝트를 소개합니다.",
      keywords: ["김현중 프로젝트", "웹·클라우드 제품", "AI 에이전트"],
    },
    blog: {
      title: "김현중 기술 블로그 | Next.js·AWS·AI 에이전트",
      description:
        "Next.js·React, AWS 클라우드와 AI 에이전트 개발 경험을 기록하는 김현중의 기술 블로그.",
      keywords: ["김현중 기술 블로그", "소프트웨어 엔지니어링", "AI 에이전트"],
    },
    contact: {
      title: "김현중 연락처 | 소프트웨어 엔지니어",
      description:
        "소프트웨어 엔지니어 김현중에게 메시지를 보낼 수 있는 연락 페이지.",
      keywords: ["김현중 연락처"],
    },
  },
  en: {
    home: {
      title: "Hyunjoong Kim | Software Engineer",
      description:
        "Hyunjoong Kim is a software engineer and founder of Specify. He independently operates Specify, Mamma, and Petty, and writes about building software products.",
      keywords: ["Hyunjoong Kim", "software engineer", "Specify founder"],
    },
    profile: {
      title: "Hyunjoong Kim | Software Engineer Profile",
      description:
        "Experience, skills, and current products from Hyunjoong Kim, a software engineer and Specify founder who independently operates Specify, Mamma, and Petty.",
      keywords: ["Hyunjoong Kim profile", "software engineer experience"],
    },
    projects: {
      title: "Hyunjoong Kim Projects | Web, Cloud & AI",
      description:
        "Projects by software engineer Hyunjoong Kim, spanning web and cloud products, software systems, and AI agents.",
      keywords: ["Hyunjoong Kim projects", "cloud software", "AI agents"],
    },
    blog: {
      title: "Hyunjoong Kim Tech Blog | Next.js, AWS & AI Agents",
      description:
        "Technical writing by Hyunjoong Kim on web engineering, AWS cloud systems, and AI agents.",
      keywords: ["software engineering blog", "AWS", "AI agents"],
    },
    contact: {
      title: "Contact Hyunjoong Kim | Software Engineer",
      description:
        "Contact page for sending a message to software engineer Hyunjoong Kim.",
      keywords: ["Hyunjoong Kim contact"],
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
