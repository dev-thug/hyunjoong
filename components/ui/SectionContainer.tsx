"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface SectionContainerProps {
  id: string;
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl";
  background?: "gradient" | "solid" | "custom";
  backgroundClass?: string;
  enableParallax?: boolean;
}

const maxWidthClasses = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  "2xl": "max-w-7xl",
  "7xl": "max-w-7xl",
};

const backgroundClasses = {
  gradient:
    "bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black",
  solid: "bg-white dark:bg-black",
  custom: "",
};

export default function SectionContainer({
  id,
  children,
  className = "",
  maxWidth = "7xl",
  background = "gradient",
  backgroundClass = "",
  enableParallax = true,
}: SectionContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["50px", "-50px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const bgClass = backgroundClass || backgroundClasses[background];

  return (
    <section
      ref={containerRef}
      id={id}
      data-section={id}
      className={`relative min-h-screen flex items-center justify-center ${bgClass} overflow-hidden ${className}`}
    >
      <div
        className={`relative z-10 w-full ${maxWidthClasses[maxWidth]} mx-auto `}
        style={{ padding: "2rem 0" }}
      >
        <motion.div
          style={enableParallax ? { y, opacity } : {}}
          className="flex flex-col gap-24 py-20"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
