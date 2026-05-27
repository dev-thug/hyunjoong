"use client";

import { Calendar, MapPin, TrendingUp, Users, Award } from "lucide-react";
import BaseCard from "../ui/BaseCard";

interface ExperienceCardProps {
  period: string;
  company: string;
  position: string;
  location: string;
  type: string;
  highlights: string[];
  technologies: string[];
  color: string;
  index: number;
}

export default function ExperienceCard({
  period,
  company,
  position,
  location,
  type,
  highlights,
  technologies,
  color,
  index,
}: ExperienceCardProps) {
  return (
    <BaseCard
      index={index}
      delay={0.2}
      padding="32px"
      gap="24px"
      gradient={color}
    >
      {/* Header */}
      <div className="flex flex-col gap-(--space-2)">
        <div className="flex items-center gap-(--space-2)">
          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="font-medium text-blue-600 dark:text-blue-400 text-[var(--text-sm)] leading-[var(--text-sm--line-height)]">
            {period}
          </span>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full font-medium py-(--space-1) px-(--space-2) text-[var(--text-xs)] leading-[var(--text-xs--line-height)]">
            {type}
          </span>
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-[var(--text-2xl)] leading-[var(--text-2xl--line-height)]">
          {position}
        </h3>
        <div className="flex items-center text-gray-600 dark:text-gray-300 gap-(--space-2)">
          <span className="font-medium">{company}</span>
          <span>•</span>
          <div className="flex items-center gap-(--space-1)">
            <MapPin className="w-3 h-3" />
            <span className="text-[var(--text-sm)] leading-[var(--text-sm--line-height)]">
              {location}
            </span>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="flex flex-col gap-(--space-3)">
        <div className="flex items-center gap-(--space-2)">
          <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="font-medium text-gray-700 dark:text-gray-300 text-[var(--text-sm)] leading-[var(--text-sm--line-height)]">
            주요 성과
          </span>
        </div>
        <ul className="flex flex-col gap-(--space-2)">
          {highlights.map((highlight, i) => (
            <li key={i} className="flex items-start gap-(--space-2)">
              <Award
                className="text-yellow-500 flex-shrink-0"
                style={{
                  width: "var(--space-3)",
                  height: "var(--space-3)",
                  marginTop: "var(--space-1)",
                }}
              />
              <span className="text-gray-600 dark:text-gray-300 text-[var(--text-sm)] leading-[var(--text-sm--line-height)]">
                {highlight}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Technologies */}
      <div className="flex flex-col gap-(--space-3)">
        <div className="flex items-center gap-(--space-2)">
          <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="font-medium text-gray-700 dark:text-gray-300 text-[var(--text-sm)] leading-[var(--text-sm--line-height)]">
            기술 스택
          </span>
        </div>
        <div className="flex flex-wrap gap-(--space-2)">
          {technologies.map((tech, i) => (
            <span
              key={i}
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-colors duration-300 font-medium py-(--space-1) px-(--space-3) text-[var(--text-xs)] leading-[var(--text-xs--line-height)]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </BaseCard>
  );
}
