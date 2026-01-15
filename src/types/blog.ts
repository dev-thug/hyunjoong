/**
 * 블로그 포스트 카테고리
 */
export type PostCategory = 'Engineering' | 'Business' | 'Insight';

/**
 * 블로그 포스트 메타데이터 인터페이스
 */
export interface PostMetadata {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly category: PostCategory;
  readonly date: string;
  readonly readTime: string;
}

/**
 * MDX 컨텐츠를 포함한 블로그 포스트
 */
export interface PostWithContent extends PostMetadata {
  readonly content: string;
}

/**
 * 이전/다음 포스트 네비게이션
 */
export interface PostNavigation {
  readonly prevPost: PostMetadata | null;
  readonly nextPost: PostMetadata | null;
}
