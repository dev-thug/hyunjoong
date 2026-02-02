import type { NavLink, SocialLink } from "@/types/navigation";

/**
 * 메인 네비게이션 링크 생성 함수
 */
export const getNavLinks = (dict: any, lang: string): readonly NavLink[] =>
  [
    { href: `/${lang}/projects`, label: dict.navigation.works },
    { href: `/${lang}/blog`, label: dict.navigation.intelligence },
    { href: `/${lang}/profile`, label: dict.navigation.profile },
  ] as const;

/**
 * 연락처 이메일
 */
export const CONTACT_EMAIL = "de0978@gmail.com";

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
  TITLE: "Kim Hyun-joong | Full-stack Architect",
  LOCATION: "DESIGNED IN SEOUL",
  ESTABLISHED_YEAR: "2024",
  COPYRIGHT_YEAR: "2026",
} as const;
