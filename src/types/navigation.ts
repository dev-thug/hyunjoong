/**
 * 네비게이션 링크 인터페이스
 */
export interface NavLink {
  readonly href: string;
  readonly label: string;
  readonly isExternal?: boolean;
}

/**
 * 소셜 미디어 링크 인터페이스
 */
export interface SocialLink {
  readonly href: string;
  readonly label: string;
  readonly ariaLabel: string;
}
