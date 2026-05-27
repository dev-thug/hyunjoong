"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface ProjectHighlightsProps {
  highlights: string[];
  delay?: number;
}

export default function ProjectHighlights({
  highlights,
  delay = 0.7,
}: ProjectHighlightsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col gap-(--space-4)">
        <h4 className="font-semibold text-gray-900 dark:text-white text-[var(--text-lg)] leading-[var(--text-lg--line-height)]">
          주요 성과
        </h4>
        <ul className="flex flex-col gap-(--space-3)">
          {highlights.map((highlight, index) => (
            <li key={index} className="flex items-start gap-(--space-3)">
              <ArrowRight
                className="text-blue-600 dark:text-blue-400 flex-shrink-0"
                style={{
                  width: "20px",
                  height: "20px",
                  marginTop: "2px",
                }}
              />
              <span className="text-gray-600 dark:text-gray-300 text-[var(--text-base)] leading-[var(--text-base--line-height)]">
                {highlight}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
