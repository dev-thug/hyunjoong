"use client";

// 클라이언트 유틸 전용. 스크립트 주입은 @next/third-parties/google 사용
// GA_ID is sourced ONLY from env var (no hardcoded fallback ID for security/privacy).

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

// GA4 이벤트 추적 함수들
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// 페이지 뷰 추적 (only if GA_ID configured via env)
export const trackPageView = (url: string, title: string) => {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) {
    return;
  }
  window.gtag("config", GA_ID, {
    page_title: title,
    page_location: url,
  });
};

// 프로젝트 클릭 추적
export const trackProjectClick = (projectName: string, projectType: string) => {
  trackEvent("click", "project", `${projectName}_${projectType}`);
};

// 연락처 클릭 추적
export const trackContactClick = (contactType: string) => {
  trackEvent("click", "contact", contactType);
};

// 스킬 카드 클릭 추적
export const trackSkillClick = (skillName: string) => {
  trackEvent("click", "skill", skillName);
};

// 다운로드 추적 (이력서 등)
export const trackDownload = (fileName: string) => {
  trackEvent("download", "file", fileName);
};

// 외부 링크 클릭 추적
export const trackExternalLink = (url: string, linkText: string) => {
  trackEvent("click", "external_link", `${linkText}_${url}`);
};

// 스크롤 깊이 추적
export const trackScrollDepth = (depth: number) => {
  trackEvent("scroll", "engagement", `${depth}%`, depth);
};

// 섹션 뷰 추적
export const trackSectionView = (sectionId: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "section_view", {
      section_id: sectionId,
      page_location: `${window.location.href}#${sectionId}`,
    });
  }
};

// 섹션 이탈 추적 (체류 시간 포함)
export const trackSectionExit = (sectionId: string, dwellTimeMs: number) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "section_exit", {
      section_id: sectionId,
      dwell_time_ms: dwellTimeMs,
      dwell_time_sec: Math.round(dwellTimeMs / 1000),
    });
  }
};
