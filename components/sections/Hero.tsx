"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Code, Database, Cloud } from "lucide-react";
import { useRef } from "react";
import {
  TechBadge,
  ScrollIndicator,
  BackgroundGrid,
  AnimatedText,
  SectionContainer,
  BadgeGroup,
} from "../ui";

const techStack = [
  {
    icon: <Code className="w-4 h-4" />,
    label: "NodeJS & Python",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: <Database className="w-4 h-4" />,
    label: "Database Design",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: <Cloud className="w-4 h-4" />,
    label: "AWS & DevOps",
    color: "from-purple-500 to-violet-600",
  },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const prefersReduce = useReducedMotion();
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduce ? ["0%", "0%"] : ["0%", "50%"]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.8],
    prefersReduce ? [1, 1] : [1, 0]
  );

  return (
    <SectionContainer
      id="hero"
      backgroundClass="bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-black dark:via-gray-900/50 dark:to-black"
      enableParallax={false}
      className="relative"
    >
      {/* Background Grid */}
      <BackgroundGrid />

      <div ref={containerRef} className="relative z-10 w-full mx-auto text-center h-screen">
        <motion.div style={{ y, opacity }} className="flex flex-col justify-evenly h-full py-20">
          {/* Headline */}
          <AnimatedText
            as="h1"
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-none"
            delay={0.2}
            duration={1.2}
            y={40}
          >
            <span className="block text-gray-900 dark:text-white">
              Software
            </span>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Engineer
            </span>
          </AnimatedText>

          {/* Subtitle */}
          <div className="flex justify-center">
            <AnimatedText
              as="p"
              className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-600 dark:text-gray-300 max-w-4xl text-center leading-tight tracking-wide"
              delay={0.4}
              duration={1.0}
            >
              확장 가능한 시스템을 설계하고
              <br />
              <strong className="font-medium text-gray-900 dark:text-white">
                사용자에게 가치를 전달합니다.
              </strong>
            </AnimatedText>
          </div>

          {/* Technology Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <BadgeGroup
              alignment="center"
              layout="wrap"
              gap="16px"
              responsive={true}
              customStyle={{
                justifyContent: "center",
              }}
            >
              {techStack.map((tech, index) => (
                <TechBadge
                  key={tech.label}
                  icon={tech.icon}
                  label={tech.label}
                  color={tech.color}
                  index={index}
                />
              ))}
            </BadgeGroup>
          </motion.div>

          {/* Scroll Indicator */}
          <ScrollIndicator targetId="about" />
        </motion.div>
      </div>

      {/* Ambient Light Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-500/5 via-purple-500/3 to-transparent dark:from-blue-400/10 dark:via-purple-400/5 rounded-full blur-3xl pointer-events-none" />
    </SectionContainer>
  );
}
