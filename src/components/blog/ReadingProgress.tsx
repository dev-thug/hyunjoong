"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { calculateReadingProgress } from "@/components/blog/reading-progress";

interface ReadingProgressLabels {
  readingProgress: string;
  readLabel: string;
  remainingLabel: string;
}

interface ReadingProgressProps {
  targetId: string;
  labels: ReadingProgressLabels;
  activateOn?: "mobile" | "desktop" | "always";
}

const toRoundedPercent = (value: number): number => Math.round(value);

export default function ReadingProgress({
  targetId,
  labels,
  activateOn = "always",
}: ReadingProgressProps) {
  const [readPercent, setReadPercent] = useState(0);
  const [remainingPercent, setRemainingPercent] = useState(100);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const isEffectEnabled =
      activateOn === "always" ||
      (activateOn === "mobile" && !isDesktop) ||
      (activateOn === "desktop" && isDesktop);
    if (!isEffectEnabled) {
      return;
    }

    const updateProgress = () => {
      rafIdRef.current = null;
      const target = document.getElementById(targetId);
      if (!target) {
        setReadPercent(0);
        setRemainingPercent(100);
        return;
      }

      const rect = target.getBoundingClientRect();
      const totalScrollable = Math.max(1, target.scrollHeight - window.innerHeight);
      const currentScrolled = Math.min(
        totalScrollable,
        Math.max(0, window.scrollY - (window.scrollY + rect.top))
      );
      const next = calculateReadingProgress(currentScrolled, totalScrollable);
      const nextRead = toRoundedPercent(next.readPercent);
      const nextRemaining = toRoundedPercent(next.remainingPercent);
      setReadPercent((prev) => (prev === nextRead ? prev : nextRead));
      setRemainingPercent((prev) =>
        prev === nextRemaining ? prev : nextRemaining
      );
    };

    const handleScroll = () => {
      if (rafIdRef.current !== null) {
        return;
      }
      rafIdRef.current = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [targetId, activateOn]);

  const progressWidth = useMemo(() => `${readPercent}%`, [readPercent]);

  return (
    <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-gray-500">
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
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>
          {labels.readLabel}: {readPercent}%
        </span>
        <span>
          {labels.remainingLabel}: {remainingPercent}%
        </span>
      </div>
    </div>
  );
}
