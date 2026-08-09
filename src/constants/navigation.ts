import type { NavLink, SocialLink } from "@/types/navigation";
import type { Locale } from "@/i18n-config";

export type NavLabels = {
  portfolio: string;
  intelligence: string;
  profile: string;
  contact: string;
};

/**
 * 메인 네비게이션 링크 생성 함수
 * 라벨은 호출 측에서 사전(dictionary)을 통해 주입한다.
 */
export function getNavLinks(lang: Locale, labels: NavLabels): NavLink[] {
  return [
    { href: `/${lang}/projects`, label: labels.portfolio },
    { href: `/${lang}/blog`, label: labels.intelligence },
    { href: `/${lang}/profile`, label: labels.profile },
  ];
}

export const getContactHref = (lang: Locale): string => `/${lang}/contact`;

/**
 * 소셜 미디어 링크 키 (keyed lookup용)
 */
export const SOCIAL_LINK_MAP = {
  github: {
    href: "https://github.com/dev-thug",
    label: "Github",
    ariaLabel: "Visit GitHub profile",
  },
  linkedin: {
    href: "https://www.linkedin.com/in/dev-thug/",
    label: "LinkedIn",
    ariaLabel: "Visit LinkedIn profile",
  },
  x: {
    href: "https://x.com/de0978",
    label: "X",
    handle: "@de0978",
    ariaLabel: "Visit X profile",
  },
} as const satisfies Record<
  "github" | "linkedin" | "x",
  { href: string; label: string; handle?: string; ariaLabel: string }
>;

export type SocialLinkKey = keyof typeof SOCIAL_LINK_MAP;

/**
 * 소셜 미디어 링크 (legacy array — derived from SOCIAL_LINK_MAP)
 */
export const SOCIAL_LINKS: readonly SocialLink[] = [
  SOCIAL_LINK_MAP.github,
  SOCIAL_LINK_MAP.linkedin,
  SOCIAL_LINK_MAP.x,
] as const;

/**
 * 브랜드 정보
 */
export const BRAND = {
  NAME: "Hyunjoong Kim",
  TITLE: "AI Product Builder & Full-Stack Architect",
  LOCATION: "DESIGNED IN SEOUL",
  ESTABLISHED_YEAR: "2025",
  /** Dynamically computed at render time so the copyright year never goes stale. */
  getCurrentYear: () => new Date().getFullYear(),
} as const;
