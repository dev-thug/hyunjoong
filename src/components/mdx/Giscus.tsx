'use client';

import { useCallback, useEffect, useRef } from 'react';

interface GiscusProps {
  lang: 'ko' | 'en';
}

/**
 * Giscus 댓글 컴포넌트
 * GitHub Discussions를 기반으로 하는 댓글 시스템
 * 다국어 지원 (한국어, 영어)
 */
export default function Giscus({ lang }: GiscusProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isWidgetLoadedRef = useRef(false);

  const createGiscusWidget = useCallback(() => {
    const giscusDiv = containerRef.current;
    if (!giscusDiv || isWidgetLoadedRef.current) return;

    const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
    const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
    const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

    if (!repo || !repoId || !categoryId) {
      console.warn('Giscus: Missing required environment variables');
      return;
    }

    while (giscusDiv.firstChild) {
      giscusDiv.removeChild(giscusDiv.firstChild);
    }

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', 'Announcements');
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'dark');
    script.setAttribute('data-lang', lang);
    script.setAttribute('data-loading', 'lazy');
    script.setAttribute('data-initialized', 'true');

    giscusDiv.appendChild(script);
    isWidgetLoadedRef.current = true;
  }, [lang]);

  useEffect(() => {
    const giscusDiv = containerRef.current;
    if (!giscusDiv) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        createGiscusWidget();
        observer.disconnect();
      },
      { rootMargin: '300px 0px' }
    );

    observer.observe(giscusDiv);
    return () => {
      observer.disconnect();
    };
  }, [createGiscusWidget]);

  useEffect(() => {
    if (!isWidgetLoadedRef.current) {
      return;
    }

    const iframe = containerRef.current?.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    if (!iframe?.contentWindow) {
      return;
    }

    iframe.contentWindow.postMessage(
      {
        giscus: {
          setConfig: {
            lang,
          },
        },
      },
      'https://giscus.app'
    );
  }, [lang]);

  useEffect(() => {
    const giscusDiv = containerRef.current;
    return () => {
      if (!giscusDiv) return;
      while (giscusDiv.firstChild) {
        giscusDiv.removeChild(giscusDiv.firstChild);
      }
      isWidgetLoadedRef.current = false;
    };
  }, []);

  return (
    <div
      id="giscus"
      ref={containerRef}
      className="my-12 py-8 border-t border-gray-800"
      data-testid="giscus-container"
    />
  );
}
