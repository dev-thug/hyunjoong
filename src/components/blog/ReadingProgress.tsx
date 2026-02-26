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
}

const toRoundedPercent = (value: number): number => Math.round(value);

export default function ReadingProgress({
  targetId,
  labels,
}: ReadingProgressProps) {
  const [readPercent, setReadPercent] = useState(0);
  const [remainingPercent, setRemainingPercent] = useState(100);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
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
      setReadPercent(toRoundedPercent(next.readPercent));
      setRemainingPercent(toRoundedPercent(next.remainingPercent));
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
  }, [targetId]);

  const progressWidth = useMemo(() => `${readPercent}%`, [readPercent]);

  return (
    <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-gray-500">
        <span>{labels.readingProgress}</span>
        <span>{readPercent}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
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
