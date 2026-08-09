import type { Locale } from "@/i18n-config";

export const PUBLIC_PROFILE_REVIEWED_AT = "2026-08-09";

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
    "SDLC documentation",
    "Full-stack architecture",
    "Serverless systems",
    "Software certification documentation",
  ],
  localized: {
    ko: {
      name: "김현중",
      alternateName: "Hyunjoong Kim",
      jobTitle: "AI 제품 빌더 · 풀스택 아키텍트",
      description:
        "코드와 업무 맥락을 연결해 SDLC 문서를 생성·최신화하는 Specify.app을 만드는 AI 제품 빌더이자 풀스택 아키텍트.",
      currentFocus: {
        title: "Specify.app — 코드와 함께 최신화되는 SDLC 문서",
        description:
          "의료기기 소프트웨어 인증 문서를 다루며 겪은 코드-문서 불일치에서 출발했습니다. GS 1등급 인증 또는 공공·대기업 납품을 3–6개월 안에 준비하고 전담 문서 인력이 부족한 10–100인 소프트웨어 팀을 첫 검증 대상으로 삼고 있습니다.",
        href: "https://specify.app",
      },
      introParagraphs: [
        "저는 서울을 기반으로 제품과 시스템을 만드는 AI 제품 빌더이자 풀스택 아키텍트입니다. 의료기기 소프트웨어 인증 문서를 직접 다루며 코드가 바뀔 때 설계·시험·운영 문서가 뒤처지는 문제를 경험했습니다.",
        "현재 Specify.app을 통해 코드와 업무 맥락에서 SDLC 문서를 생성하고, 변경 영향을 추적해 문서가 계속 최신 상태를 유지하도록 만드는 방법을 검증하고 있습니다. 제품 발견부터 서버리스 아키텍처, AI 에이전트 운영, 배포 품질까지 하나의 시스템으로 설계합니다.",
      ],
      skills: [
        {
          category: "제품 & AI",
          items: ["AI Agents", "RAG / GraphRAG", "SDLC Documentation", "Product Discovery"],
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
          period: "2025.07 — 현재",
          title: "제품 빌더",
          company: "Specify.app",
          companyUrl: "https://specify.app",
          description:
            "코드와 업무 맥락을 기반으로 SDLC 문서를 생성하고 변경에 맞춰 최신화하는 제품을 만들고 시장을 검증하고 있습니다.",
        },
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
      jobTitle: "AI Product Builder · Full-Stack Architect",
      description:
        "AI product builder and full-stack architect building Specify.app, which generates and keeps SDLC documentation synchronized with code and business context.",
      currentFocus: {
        title: "Specify.app — SDLC documentation that stays aligned with code",
        description:
          "The product grew from hands-on medical-device software certification documentation and the recurring gap between code and evidence. The first validation segment is Korean software teams of 10–100 people preparing for GS Grade 1 certification or public-enterprise delivery within 3–6 months without dedicated documentation staff.",
        href: "https://specify.app",
      },
      introParagraphs: [
        "I am a Seoul-based AI product builder and full-stack architect. While working directly with medical-device software certification documentation, I saw how quickly design, test, and operational evidence falls behind the code.",
        "I am now validating Specify.app: a system that generates SDLC documentation from code and business context, traces change impact, and keeps evidence current. I design product discovery, serverless architecture, AI-agent operations, and delivery quality as one operating system.",
      ],
      skills: [
        {
          category: "Product & AI",
          items: ["AI Agents", "RAG / GraphRAG", "SDLC Documentation", "Product Discovery"],
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
          period: "2025.07 — Present",
          title: "Product Builder",
          company: "Specify.app",
          companyUrl: "https://specify.app",
          description:
            "Building and validating a product that generates SDLC documentation from code and business context and keeps it aligned with change.",
        },
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
