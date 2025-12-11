"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import BaseCard from "../ui/BaseCard";

interface SkillCardProps {
  name: string;
  description: string;
  proficiency: number;
  icon: ReactNode;
  gradient: string;
  index: number;
}

export default function SkillCard({
  name,
  description,
  proficiency,
  icon,
  gradient,
  index,
}: SkillCardProps) {
  return (
    <BaseCard
      index={index}
      delay={0.1}
      padding="32px"
      gap="24px"
      gradient={gradient}
    >
      <div
        className="flex flex-col"
        style={{
          gap: "24px",
        }}
      >
        {/* Skill Header */}
        <div
          className="flex items-center"
          style={{
            gap: "16px",
          }}
        >
          <div
            className={`rounded-2xl bg-gradient-to-r ${gradient} text-white group-hover:scale-110 transition-transform duration-300`}
            style={{
              padding: "12px",
            }}
          >
            {icon}
          </div>
          <div>
            <h4
              className="font-semibold text-gray-900 dark:text-white"
              style={{
                fontSize: "1.25rem",
                lineHeight: "1.75rem",
              }}
            >
              {name}
            </h4>
          </div>
        </div>

        {/* Skill Description */}
        <p
          className="text-gray-600 dark:text-gray-300 leading-relaxed"
          style={{
            fontSize: "1rem",
            lineHeight: "1.625",
          }}
        >
          {description}
        </p>

        {/* Proficiency Bar */}
        <div
          className="flex flex-col"
          style={{
            gap: "8px",
          }}
        >
          <div className="flex justify-between items-center">
            <span
              className="font-medium text-gray-500 dark:text-gray-400"
              style={{
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
              }}
            >
              숙련도
            </span>
            <span
              className="font-semibold text-gray-900 dark:text-white"
              style={{
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
              }}
            >
              {proficiency}%
            </span>
          </div>
        <div
          className="bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
          style={{
            height: "8px",
          }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{
              duration: 1.5,
              delay: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            viewport={{ once: true }}
            className={`bg-gradient-to-r ${gradient} rounded-full`}
            style={{
              height: "100%",
              width: `${proficiency}%`,
              transformOrigin: "left",
            }}
          />
        </div>
        </div>
      </div>
    </BaseCard>
  );
}
