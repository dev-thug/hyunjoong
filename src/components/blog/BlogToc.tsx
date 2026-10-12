"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
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
    "block rounded-md px-2.5 py-1.5 text-sm leading-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20";
  const depthClass = item.level === 3 ? "ml-3 text-slate-400" : "font-medium text-slate-300";
  const activeClass = isActive
    ? "bg-white/6 text-zinc-100"
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
            <span className="line-clamp-2">{item.text}</span>
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
          className="w-full rounded-lg border border-slate-600 bg-slate-800/60 px-4 py-3 text-left text-sm font-semibold text-slate-100"
          aria-expanded={isExpanded}
          aria-controls={panelId}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? labels.tocClose : labels.tocToggle}
        </button>
        <nav
          id={panelId}
          aria-label={labels.tocTitle}
          className="glass-panel mt-2 rounded-lg border border-white/10 p-2.5"
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
          className="rounded-xl border border-white/10 bg-zinc-900/60 p-4"
        >
          <h2 className="mb-3 text-sm font-semibold text-slate-200">
            {labels.tocTitle}
          </h2>
          <ul className="space-y-1">{tocList}</ul>
        </nav>
      </aside>
      ) : null}
    </>
  );
}
