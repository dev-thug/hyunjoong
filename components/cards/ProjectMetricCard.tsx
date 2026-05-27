"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ProjectMetricCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  gradient: string;
  index: number;
}

export default function ProjectMetricCard({
  icon,
  value,
  label,
  gradient,
  index,
}: ProjectMetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="flex flex-col items-center gap-(--space-3)">
        <div
          className={`inline-flex items-center justify-center bg-gradient-to-r ${gradient} text-white rounded-2xl`}
          style={{ width: "48px", height: "48px" }}
        >
          {icon}
        </div>
        <div className="font-bold text-gray-900 dark:text-white text-[var(--text-2xl)] leading-[var(--text-2xl--line-height)]">
          {value}
        </div>
        <div className="text-gray-600 dark:text-gray-300 text-[var(--text-sm)] leading-[var(--text-sm--line-height)]">
          {label}
        </div>
      </div>
    </motion.div>
  );
}
