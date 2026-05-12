import type { Locale } from "@/i18n-config";

/**
 * 프로젝트 메트릭 (수치 + 라벨)
 */
export interface ProjectMetric {
  readonly value: string;
  readonly label: string;
}

/**
 * 프로젝트 메타데이터 인터페이스
 */
export interface Project {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly adCopy: string;
  readonly description: string;
  readonly highlight: string;
  readonly serviceUrl?: string;
  readonly image: string;
  readonly lang: Locale;
  readonly tags: readonly string[];
  readonly metrics: readonly ProjectMetric[];
}
