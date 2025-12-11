"use client";

import { useEffect, useRef } from "react";
import { trackSectionView, trackSectionExit } from "../GoogleAnalytics";

interface SectionEntry {
  enterTime: number;
  tracked: boolean;
}

const useSectionTracking = () => {
  // 섹션별 진입 시간 및 추적 여부 관리
  const sectionDataRef = useRef<Map<string, SectionEntry>>(new Map());
  // 한 번만 추적하도록 세트 유지
  const trackedSectionsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-section]");

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute("data-section");
          if (!sectionId) return;

          if (entry.isIntersecting) {
            // 섹션 진입
            if (!trackedSectionsRef.current.has(sectionId)) {
              trackedSectionsRef.current.add(sectionId);
              trackSectionView(sectionId);
              
              // 진입 시간 기록
              sectionDataRef.current.set(sectionId, {
                enterTime: Date.now(),
                tracked: true,
              });
            }
          } else {
            // 섹션 이탈
            const sectionData = sectionDataRef.current.get(sectionId);
            if (sectionData && sectionData.tracked) {
              const dwellTime = Date.now() - sectionData.enterTime;
              // 1초 이상 체류한 경우만 이탈 이벤트 전송
              if (dwellTime >= 1000) {
                trackSectionExit(sectionId, dwellTime);
              }
              sectionData.tracked = false;
            }
          }
        });
      },
      {
        threshold: 0.5, // 50% 이상 보일 때 진입으로 간주
        rootMargin: "0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);
};

export default useSectionTracking;
