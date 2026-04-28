import type { NavLink, SocialLink } from "@/types/navigation";

const NAV_LABELS = {
  portfolio: "Portfolio",
  intelligence: "Intelligence",
  profile: "Profile",
  contact: "Contact",
} as const;

/**
 * 메인 네비게이션 링크 생성 함수 (영어 고정)
 */
export const getNavLinks = (lang: string): readonly NavLink[] =>
  [
    { href: `/${lang}/projects`, label: NAV_LABELS.portfolio },
    { href: `/${lang}/blog`, label: NAV_LABELS.intelligence },
    { href: `/${lang}/profile`, label: NAV_LABELS.profile },
  ] as const;

export const NAV_CONTACT_LABEL = NAV_LABELS.contact;

export const getContactHref = (lang: string): string => `/${lang}/contact`;

/**
 * 소셜 미디어 링크
 */
export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    href: "https://github.com/dev-thug",
    label: "Github",
    ariaLabel: "Visit GitHub profile",
  },
  {
    href: "https://www.linkedin.com/in/dev-thug/",
    label: "LinkedIn",
    ariaLabel: "Visit LinkedIn profile",
  },
  { href: "https://x.com/de0978", label: "X", ariaLabel: "Visit X profile" },
] as const;

/**
 * 브랜드 정보
 */
export const BRAND = {
  NAME: "HYUNJOONG.KIM",
  TITLE: "Hyunjoong Kim | Software Engineer",
  LOCATION: "DESIGNED IN SEOUL",
  ESTABLISHED_YEAR: "2025",
  COPYRIGHT_YEAR: "2026",
} as const;
