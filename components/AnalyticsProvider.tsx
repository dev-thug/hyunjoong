"use client";

import { useEffect, useRef } from "react";
import useScrollTracking from "./hooks/useScrollTracking";
import useSectionTracking from "./hooks/useSectionTracking";
import { trackPageView } from "./GoogleAnalytics";
import { usePathname, useSearchParams } from "next/navigation";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export default function AnalyticsProvider({
  children,
}: AnalyticsProviderProps) {
  // Enable scroll tracking
  useScrollTracking();
  // Enable section view tracking
  useSectionTracking();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    // SPA 라우트 변경 시 page_view 추적 (초기 로드 중복 방지)
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    const query = searchParams?.toString();
    const url = `${window.location.origin}${pathname}${
      query ? `?${query}` : ""
    }`;
    trackPageView(url, document.title);
  }, [pathname, searchParams]);

  return <>{children}</>;
}
