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
  { href: "#", label: "Github", ariaLabel: "Visit Github profile" },
  { href: "#", label: "LinkedIn", ariaLabel: "Visit LinkedIn profile" },
  { href: "#", label: "Twitter", ariaLabel: "Visit Twitter profile" },
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
