"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { ReactNode } from "react";
import ProjectMetricCard from "./ProjectMetricCard";
import ProjectHighlights from "./ProjectHighlights";
import { DeviceMockup, ProjectMockupContent, Badge, BadgeGroup } from "../ui";
import { trackProjectClick, trackExternalLink } from "../GoogleAnalytics";

interface ProjectMetric {
  icon: ReactNode;
  label: string;
  value: string;
}

interface ProjectCardProps {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  metrics: ProjectMetric[];
  highlights: string[];
  github?: string;
  demo?: string;
  featured: boolean;
  gradient: string;
  mockup: "macbook" | "iphone" | "desktop";
  videoSrc?: string;
  imageSrc?: string;
  index: number;
}

export default function ProjectCard({
  title,
  subtitle,
  description,
  tags,
  metrics,
  highlights,
  github,
  demo,
  featured,
  gradient,
  mockup,
  videoSrc,
  imageSrc,
  index,
}: ProjectCardProps) {
  const isReversed = index % 2 === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1.2,
        delay: index * 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      viewport={{ once: true }}
      className={`grid lg:grid-cols-2 items-center ${
        isReversed ? "lg:grid-flow-col-dense" : ""
      }`}
      style={{
        gap: "64px",
      }}
    >
      {/* Content */}
      <div className={`${isReversed ? "lg:col-start-2" : ""}`}>
        <div
          className="flex flex-col"
          style={{
            gap: "32px",
          }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div
              className="flex flex-col"
              style={{
                gap: "16px",
              }}
            >
              {featured && (
                <span
                  className="inline-block text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded-full self-start font-medium"
                  style={{
                    padding: "8px 16px",
                    fontSize: "0.875rem",
                    lineHeight: "1.25rem",
                  }}
                >
                  ⭐ Featured Project
                </span>
              )}
              <div
                className="flex flex-col"
                style={{
                  gap: "24px",
                }}
              >
                <h3
                  className="font-bold text-gray-900 dark:text-white leading-tight"
                  style={{
                    fontSize: "2.25rem",
                    lineHeight: "2.5rem",
                  }}
                >
                  {title}
                </h3>
                <p
                  className="font-light text-gray-600 dark:text-gray-300"
                  style={{
                    fontSize: "1.25rem",
                    lineHeight: "1.75rem",
                  }}
                >
                  {subtitle}
                </p>
                <p
                  className="text-gray-600 dark:text-gray-300 leading-relaxed"
                  style={{
                    fontSize: "1.125rem",
                    lineHeight: "1.75rem",
                  }}
                >
                  {description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Metrics */}
          <div
            className="grid grid-cols-3"
            style={{
              gap: "24px",
            }}
          >
            {metrics.map((metric, metricIndex) => (
              <ProjectMetricCard
                key={metricIndex}
                icon={metric.icon}
                value={metric.value}
                label={metric.label}
                gradient={gradient}
                index={metricIndex}
              />
            ))}
          </div>

          {/* Highlights */}
          <ProjectHighlights highlights={highlights} />

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            viewport={{ once: true }}
          >
            <BadgeGroup
              alignment="start"
              layout="wrap"
              gap="12px"
              responsive={true}
              customStyle={{
                justifyContent: "flex-start",
              }}
            >
              {tags.map((tag, tagIndex) => (
                <Badge
                  key={tagIndex}
                  variant="skill"
                  size="md"
                  index={tagIndex}
                  delay={0.9}
                  animated={false}
                >
                  {tag}
                </Badge>
              ))}
            </BadgeGroup>
          </motion.div>

          {/* Action Buttons */}
          {demo && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              viewport={{ once: true }}
              className="flex"
              style={{
                gap: "16px",
              }}
            >
              <motion.a
                href={demo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackProjectClick(title, "demo");
                  trackExternalLink(demo, `${title} Demo`);
                }}
                className="group flex items-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-apple-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "16px 32px",
                  gap: "12px",
                }}
              >
                <ExternalLink
                  style={{
                    width: "20px",
                    height: "20px",
                  }}
                />
                <span>바로가기</span>
              </motion.a>
            </motion.div>
          )}
        </div>
      </div>

      {/* Project Mockup */}
      <motion.div
        className={`${isReversed ? "lg:col-start-1 lg:row-start-1" : ""}`}
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 1.0,
          delay: 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        viewport={{ once: true }}
        whileHover={{
          scale: 1.05,
          rotateY: isReversed ? -5 : 5,
        }}
      >
        <DeviceMockup type={mockup}>
          <ProjectMockupContent title={title} gradient={gradient} videoSrc={videoSrc} imageSrc={imageSrc} />
        </DeviceMockup>
      </motion.div>
    </motion.div>
  );
}
