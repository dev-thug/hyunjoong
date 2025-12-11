"use client";

import { motion, useReducedMotion, Variants } from "framer-motion";
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

// Variants for staggered animation
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const mockupVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 1.0,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function ProjectCard({
  title,
  subtitle,
  description,
  tags,
  metrics,
  highlights,
  demo,
  featured,
  gradient,
  mockup,
  videoSrc,
  imageSrc,
  index,
}: ProjectCardProps) {
  const isReversed = index % 2 === 1;
  const prefersReduce = useReducedMotion();

  // Reduced motion variants
  const reducedContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const reducedItemVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      variants={prefersReduce ? reducedContainerVariants : containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={`grid lg:grid-cols-2 items-center ${
        isReversed ? "lg:grid-flow-col-dense" : ""
      }`}
      style={{
        gap: "64px",
      }}
    >
      {/* Content */}
      <motion.div
        className={`${isReversed ? "lg:col-start-2" : ""}`}
        variants={prefersReduce ? reducedItemVariants : itemVariants}
      >
        <div
          className="flex flex-col"
          style={{
            gap: "32px",
          }}
        >
          {/* Header */}
          <motion.div variants={prefersReduce ? reducedItemVariants : itemVariants}>
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
          <motion.div
            className="grid grid-cols-3"
            style={{
              gap: "24px",
            }}
            variants={prefersReduce ? reducedItemVariants : itemVariants}
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
          </motion.div>

          {/* Highlights */}
          <motion.div variants={prefersReduce ? reducedItemVariants : itemVariants}>
            <ProjectHighlights highlights={highlights} />
          </motion.div>

          {/* Tags */}
          <motion.div variants={prefersReduce ? reducedItemVariants : itemVariants}>
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
                  delay={0}
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
              className="flex"
              style={{
                gap: "16px",
              }}
              variants={prefersReduce ? reducedItemVariants : itemVariants}
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
                whileHover={prefersReduce ? {} : { scale: 1.05, y: -2 }}
                whileTap={prefersReduce ? {} : { scale: 0.95 }}
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
      </motion.div>

      {/* Project Mockup */}
      <motion.div
        className={`${isReversed ? "lg:col-start-1 lg:row-start-1" : ""}`}
        variants={prefersReduce ? reducedItemVariants : mockupVariants}
        whileHover={prefersReduce ? {} : {
          scale: 1.03,
          rotateY: isReversed ? -3 : 3,
        }}
      >
        <DeviceMockup type={mockup}>
          <ProjectMockupContent title={title} gradient={gradient} videoSrc={videoSrc} imageSrc={imageSrc} />
        </DeviceMockup>
      </motion.div>
    </motion.div>
  );
}

