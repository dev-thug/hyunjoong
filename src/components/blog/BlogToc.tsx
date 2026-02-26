"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import type { TocItem } from "@/lib/toc";

interface BlogTocLabels {
  tocTitle: string;
  tocToggle: string;
  tocClose: string;
}

interface BlogTocProps {
  items: TocItem[];
  activeId?: string;
  labels: BlogTocLabels;
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
  mode = "both",
  observeOn = "always",
}: BlogTocProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string | undefined>();

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const isObserverEnabled =
      observeOn === "always" ||
      (observeOn === "mobile" && !isDesktop) ||
      (observeOn === "desktop" && isDesktop);
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
          <ul className="space-y-1">{tocList}</ul>
        </nav>
      </aside>
      ) : null}
    </>
  );
}
