"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { TocItem } from "@/lib/toc";
import { calculateReadingProgress } from "@/components/blog/reading-progress";

interface BlogTocLabels {
  tocTitle: string;
  tocToggle: string;
  tocClose: string;
  readingProgress: string;
  readLabel: string;
  remainingLabel: string;
}

interface BlogTocProps {
  items: TocItem[];
  activeId?: string;
  labels: BlogTocLabels;
  targetId: string;
  mode?: "mobile" | "desktop" | "both";
  observeOn?: "mobile" | "desktop" | "always";
}

const getItemClassName = (item: TocItem, isActive: boolean): string => {
  const base =
    "block rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20";
  const depthClass = item.level === 3 ? "ml-3 text-gray-500" : "text-gray-400";
  const activeClass = isActive
    ? "bg-white/10 text-white border-l-2 border-white/50"
    : "hover:bg-white/5 hover:text-gray-200";
  return `${base} ${depthClass} ${activeClass}`;
};

export default function BlogToc({
  items,
  activeId,
  labels,
  targetId,
  mode = "both",
  observeOn = "always",
}: BlogTocProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string | undefined>();
  const [readPercent, setReadPercent] = useState(0);
  const [remainingPercent, setRemainingPercent] = useState(100);
  const progressRafRef = useRef<number | null>(null);

  const shouldEnableByViewport = (target: "mobile" | "desktop" | "always") => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    return (
      target === "always" ||
      (target === "mobile" && !isDesktop) ||
      (target === "desktop" && isDesktop)
    );
  };

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const isObserverEnabled = shouldEnableByViewport(observeOn);
    if (!isObserverEnabled) {
      return;
    }

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);
    if (headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length === 0) {
          return;
        }
        setActiveHeadingId(visible[0].target.id);
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items, observeOn]);

  useEffect(() => {
    const isProgressEnabled = shouldEnableByViewport(observeOn);
    if (!isProgressEnabled) {
      return;
    }

    const updateProgress = () => {
      progressRafRef.current = null;
      const target = document.getElementById(targetId);
      if (!target) {
        setReadPercent(0);
        setRemainingPercent(100);
        return;
      }

      const rect = target.getBoundingClientRect();
      const start = window.scrollY + rect.top;
      const totalScrollable = Math.max(1, target.scrollHeight - window.innerHeight);
      const currentScrolled = Math.min(
        totalScrollable,
        Math.max(0, window.scrollY - start)
      );
      const next = calculateReadingProgress(currentScrolled, totalScrollable);
      const roundedRead = Math.round(next.readPercent);
      const roundedRemain = Math.round(next.remainingPercent);
      setReadPercent((prev) => (prev === roundedRead ? prev : roundedRead));
      setRemainingPercent((prev) => (prev === roundedRemain ? prev : roundedRemain));
    };

    const handleScroll = () => {
      if (progressRafRef.current !== null) {
        return;
      }
      progressRafRef.current = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (progressRafRef.current !== null) {
        window.cancelAnimationFrame(progressRafRef.current);
      }
    };
  }, [targetId, observeOn]);

  const tocList = useMemo(() => {
    const resolvedActiveId = activeId ?? activeHeadingId;
    return items.map((item) => {
      const isActive = item.id === resolvedActiveId;
      return (
        <li key={item.id}>
          <Link
            href={`#${item.id}`}
            className={getItemClassName(item, isActive)}
            aria-current={isActive ? "location" : undefined}
            onClick={() => {
              setIsExpanded(false);
            }}
          >
            {item.text}
          </Link>
        </li>
      );
    });
  }, [items, activeHeadingId, activeId]);

  if (items.length === 0) {
    return null;
  }

  const panelId = "blog-toc-panel";
  const mobilePanelStyle: CSSProperties = {
    display: isExpanded ? "block" : "none",
  };

  const showMobile = mode === "both" || mode === "mobile";
  const showDesktop = mode === "both" || mode === "desktop";
  const progressWidth = `${readPercent}%`;
  const progressSection = (
    <div className="mb-4 rounded-lg border border-white/10 bg-black/20 p-3">
      <div className="mb-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-gray-500">
        <span>{labels.readingProgress}</span>
        <span>{readPercent}%</span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={readPercent}
        aria-label={labels.readingProgress}
      >
        <div
          className="h-full rounded-full bg-white/70 transition-[width] duration-200"
          style={{ width: progressWidth }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
        <span>
          {labels.readLabel}: {readPercent}%
        </span>
        <span>
          {labels.remainingLabel}: {remainingPercent}%
        </span>
      </div>
    </div>
  );

  return (
    <>
      {showMobile ? (
      <div className="mb-6 lg:hidden">
        <button
          type="button"
          className="glass-panel w-full rounded-xl border border-white/10 px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-gray-300"
          aria-expanded={isExpanded}
          aria-controls={panelId}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? labels.tocClose : labels.tocToggle}
        </button>
        <nav
          id={panelId}
          aria-label={labels.tocTitle}
          className="glass-panel mt-3 rounded-xl border border-white/10 p-3"
          style={mobilePanelStyle}
        >
          {progressSection}
          <ul className="space-y-1">{tocList}</ul>
        </nav>
      </div>
      ) : null}

      {showDesktop ? (
      <aside className="hidden lg:block lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-auto">
        <nav
          aria-label={labels.tocTitle}
          className="glass-panel rounded-xl border border-white/10 p-4"
        >
          <h2 className="mb-3 text-xs font-mono uppercase tracking-wider text-gray-500">
            {labels.tocTitle}
          </h2>
          {progressSection}
          <ul className="space-y-1">{tocList}</ul>
        </nav>
      </aside>
      ) : null}
    </>
  );
}
