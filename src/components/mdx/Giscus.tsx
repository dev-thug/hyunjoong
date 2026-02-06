'use client';

import { useEffect } from 'react';

interface GiscusProps {
  lang: 'ko' | 'en';
}

/**
 * Giscus 댓글 컴포넌트
 * GitHub Discussions를 기반으로 하는 댓글 시스템
 * 다국어 지원 (한국어, 영어)
 */
export default function Giscus({ lang }: GiscusProps) {
  useEffect(() => {
    const giscusDiv = document.getElementById('giscus');
    if (!giscusDiv) return;

    // 기존 Giscus 위젯 제거 (언어 변경 시 재생성)
    while (giscusDiv.firstChild) {
      giscusDiv.removeChild(giscusDiv.firstChild);
    }

    // GitHub 저장소 정보 (환경변수로 관리)
    const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
    const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
    const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

    if (!repo || !repoId || !categoryId) {
      console.warn('Giscus: Missing required environment variables');
      return;
    }

    // Giscus 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', 'Announcements');
    script.setAttribute('data-category-id', categoryId);

    // Giscus 설정
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'dark');
    script.setAttribute('data-lang', lang === 'ko' ? 'ko' : 'en');
    script.setAttribute('data-loading', 'lazy');

    giscusDiv.appendChild(script);

    // 클린업: 컴포넌트 언마운트 시 스크립트 제거
    return () => {
      while (giscusDiv.firstChild) {
        giscusDiv.removeChild(giscusDiv.firstChild);
      }
    };
  }, [lang]);

  return (
    <div
      id="giscus"
      className="my-12 py-8 border-t border-gray-800"
      data-testid="giscus-container"
    />
  );
}
