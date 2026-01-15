import type { NavLink, SocialLink } from '@/types/navigation';

/**
 * 메인 네비게이션 링크
 */
export const NAV_LINKS: readonly NavLink[] = [
  { href: '#projects', label: 'Works' },
  { href: '#blog', label: 'Intelligence' },
  { href: '#about', label: 'Profile' },
] as const;

/**
 * 연락처 이메일
 */
export const CONTACT_EMAIL = 'de0978@gmail.com';

/**
 * 소셜 미디어 링크
 */
export const SOCIAL_LINKS: readonly SocialLink[] = [
  { href: '#', label: 'Github', ariaLabel: 'Visit Github profile' },
  { href: '#', label: 'LinkedIn', ariaLabel: 'Visit LinkedIn profile' },
  { href: '#', label: 'Twitter', ariaLabel: 'Visit Twitter profile' },
] as const;

/**
 * 브랜드 정보
 */
export const BRAND = {
  NAME: 'KIM HYUNJOONG',
  TITLE: 'Kim Hyun-joong | Full-stack Architect',
  LOCATION: 'DESIGNED IN SEOUL',
  ESTABLISHED_YEAR: '2024',
  COPYRIGHT_YEAR: '2026',
} as const;
