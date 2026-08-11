import type { Locale } from "@/i18n-config";

export const PUBLIC_PROFILE_REVIEWED_AT = "2026-08-11";

export interface PublicProfileSkillGroup {
  readonly category: string;
  readonly items: readonly string[];
}

export interface PublicProfileExperience {
  readonly period: string;
  readonly title: string;
  readonly company: string;
  readonly companyUrl: string;
  readonly description: string;
}

export interface LocalizedPublicProfile {
  readonly name: string;
  readonly alternateName: string;
  readonly jobTitle: string;
  readonly description: string;
  readonly currentFocus: {
    readonly title: string;
    readonly description: string;
    readonly href: string;
  };
  readonly introParagraphs: readonly [string, string];
  readonly skills: readonly PublicProfileSkillGroup[];
  readonly experiences: readonly PublicProfileExperience[];
}

export const PUBLIC_PROFILE = {
  location: {
    name: "Seoul",
    country: "KR",
  },
  knowsAbout: [
    "AI agents",
    "Software engineering",
    "System design",
    "Full-stack architecture",
    "Serverless systems",
    "Cloud architecture",
  ],
  localized: {
    ko: {
      name: "김현중",
      alternateName: "Hyunjoong Kim",
      jobTitle: "소프트웨어 엔지니어",
      description:
        "고객과 팀을 위한 제품과 시스템을 만드는 소프트웨어 엔지니어.",
      currentFocus: {
        title: "제품과 시스템을 만듭니다",
        description:
          "지금은 제품 개발과 기술 방향, AWS 클라우드 시스템을 함께 다루는 일에 집중하고 있습니다.",
        href: "https://github.com/dev-thug",
      },
      introParagraphs: [
        "웹과 클라우드 환경에서 제품과 시스템을 만듭니다.",
        "고객이 제품을 막힘없이 쓰고, 팀이 중요한 일에 더 많은 시간을 쓸 수 있다면 소프트웨어는 레버리지가 됩니다.",
      ],
      skills: [
        {
          category: "AI & 시스템",
          items: ["AI Agents", "RAG / GraphRAG", "System Design", "Software Architecture"],
        },
        {
          category: "프론트엔드",
          items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
        },
        {
          category: "백엔드 & 클라우드",
          items: ["Node.js", "Python", "AWS", "Serverless"],
        },
        {
          category: "품질 & 운영",
          items: ["Test Automation", "GitHub Actions", "Docker", "Evidence-led Validation"],
        },
      ],
      experiences: [
        {
          period: "2023.12 — 현재",
          title: "테크 리드 · 풀스택/AWS 개발자",
          company: "Fortuna Helix",
          companyUrl: "https://fortunahelix.com/",
          description:
            "백엔드와 AWS 클라우드 개발을 주도하며 기술 방향과 제품 출시를 이끌고 있습니다.",
        },
        {
          period: "2021.12 — 2023.12",
          title: "백엔드 & AWS 클라우드 개발자",
          company: "Healicure",
          companyUrl: "https://yejin.clinic/",
          description:
            "헬스케어 및 기업용 솔루션을 위한 백엔드와 AWS 클라우드 개발을 담당했습니다.",
        },
        {
          period: "2015.03 — 2022.02",
          title: "컴퓨터소프트웨어공학 학사",
          company: "금오공과대학교",
          companyUrl: "https://www.kumoh.ac.kr/",
          description: "컴퓨터소프트웨어공학을 전공했습니다.",
        },
      ],
    },
    en: {
      name: "Hyunjoong Kim",
      alternateName: "김현중",
      jobTitle: "Software Engineer",
      description:
        "Software engineer building products and systems for customers and teams.",
      currentFocus: {
        title: "Building products and systems",
        description:
          "Right now, I work across product development, technical direction, and AWS cloud systems.",
        href: "https://github.com/dev-thug",
      },
      introParagraphs: [
        "I build products and systems for the web and cloud.",
        "Software becomes leverage when customers can use a product without getting stuck and teams have more time for important work.",
      ],
      skills: [
        {
          category: "AI & Systems",
          items: ["AI Agents", "RAG / GraphRAG", "System Design", "Software Architecture"],
        },
        {
          category: "Frontend",
          items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
        },
        {
          category: "Backend & Cloud",
          items: ["Node.js", "Python", "AWS", "Serverless"],
        },
        {
          category: "Quality & Operations",
          items: ["Test Automation", "GitHub Actions", "Docker", "Evidence-led Validation"],
        },
      ],
      experiences: [
        {
          period: "2023.12 — Present",
          title: "Tech Leader, Full-Stack & AWS Cloud Developer",
          company: "Fortuna Helix",
          companyUrl: "https://fortunahelix.com/",
          description:
            "Leading backend and AWS cloud development while driving technical direction and product delivery.",
        },
        {
          period: "2021.12 — 2023.12",
          title: "Backend & AWS Cloud Developer",
          company: "Healicure",
          companyUrl: "https://yejin.clinic/",
          description:
            "Built backend and AWS cloud systems for healthcare and enterprise solutions.",
        },
        {
          period: "2015.03 — 2022.02",
          title: "B.S. in Computer Software Engineering",
          company: "Kumoh National Institute of Technology",
          companyUrl: "https://www.kumoh.ac.kr/",
          description: "Studied Computer Software Engineering.",
        },
      ],
    },
  } satisfies Record<Locale, LocalizedPublicProfile>,
} as const;

export function getPublicProfile(lang: Locale): LocalizedPublicProfile {
  return PUBLIC_PROFILE.localized[lang];
}
