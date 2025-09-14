"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import { Calendar, Users, Briefcase } from "lucide-react";
import { SectionHeader, SectionContainer } from "../ui";
import { ExperienceCard } from "../cards";

export default function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.7", "end 0.3"],
  });
  const prefersReduce = useReducedMotion();
  const lineHeight = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduce ? ["100%", "100%"] : ["0%", "100%"]
  );

  const experiences = [
    {
      period: "2023.12 - Present (1년 7개월)",
      company: "Fortuna Helix",
      position: "Tech leader, Fullstack Developer",
      location: "서울, 대한민국",
      type: "정규직",
      highlights: [
        "2000 개 샘플 유전체 병렬 분석 시스템 구축, 처리시간 30 분 → 10 분으로 단축",
        "스타트업(시리즈 Pre-A)에서 기획개발배포까지 전 과정 단독 주도 경험",
        "ISO 27001 인증",
      ],
      technologies: [
        "AWS Amplify Gen2",
        "AWS Lambda",
        "AWS Batch",
        "AWS SNS",
        "AWS SQS",
        "AWS S3",
        "NodeJS",
        "Python",
        "Docker",
        "Terraform",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      period: "2021.12 - 2023.12 (2년)",
      company: "(주)헬리큐어",
      position: "Full Stack Developer",
      location: "서울, 대한민국",
      type: "정규직",
      highlights: [
        "예진 중기부 주관 TIPS 프로그램 선정 (2023.05)",
        "Amplify Gen1로 멀티테넌트 구조의 인증, API, 인프라 자동 구성",
        "외부 결제 시스템과 연동하여 자동 결제 지원",
      ],
      technologies: ["ReactJS", "Amplify Gen1", "Python", "NodeJS"],
      color: "from-green-500 to-emerald-500",
    },
    {
      period: "2015.03 - 2022.02 (7년)",
      company: "금오공과대학교 컴퓨터소프트웨어공학과",
      position: "학사 졸업",
      location: "구미, 대한민국",
      type: "학사",
      highlights: [
        // "레거시 시스템을 모던 아키텍처로 마이그레이션",
        // "데이터베이스 쿼리 최적화로 성능 200% 향상",
        // "RESTful API 설계 및 개발 경험 축적",
      ],
      technologies: ["Java", "Spring", "MySQL", "REST API", "Git"],
      color: "from-purple-500 to-violet-500",
    },
  ];

  return (
    <SectionContainer
      id="experience"
      backgroundClass="bg-white dark:bg-black"
      maxWidth="xl"
    >
      <SectionHeader
        title="Career"
        subtitle="Journey"
        titleSize="xl"
        description={
          <>
            각 단계에서의 성장과 도전을 통해
            <br />
            <strong className="font-medium text-gray-900 dark:text-white">
              더 나은 개발자가 되어가고 있습니다.
            </strong>
          </>
        }
        className="mb-24"
      />

      {/* Timeline */}
      <div className="relative" ref={timelineRef}>
        {/* Timeline Line Background */}
        <div className="absolute left-4 md:left-1/2 top-8 bottom-8 w-px bg-gray-200 dark:bg-gray-800 transform md:-translate-x-1/2" />

        {/* Timeline Line Progress */}
        <div className="absolute left-4 md:left-1/2 top-8 bottom-8 w-px transform md:-translate-x-1/2 overflow-hidden">
          <motion.div
            className="w-full bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 origin-top will-change-transform"
            style={{
              height: lineHeight,
              filter: "drop-shadow(0 0 6px rgba(99, 102, 241, 0.4))",
            }}
          />
        </div>

        {/* Experience Items */}
        <div className="space-y-16 md:space-y-24 relative py-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.0,
                delay: index * 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: "-50px" }}
              className={`relative flex flex-col md:flex-row items-start md:items-center ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-4 md:left-1/2 w-8 h-8 transform -translate-x-1/2 md:-translate-x-1/2 z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.2 + 0.3,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  viewport={{ once: true }}
                  className={`w-full h-full rounded-full bg-gradient-to-r ${exp.color} shadow-apple-lg flex items-center justify-center ring-4 ring-white dark:ring-black transition-all duration-300 hover:shadow-xl`}
                >
                  <Briefcase className="w-4 h-4 text-white" />
                </motion.div>
              </div>

              {/* Content Card */}
              <div
                className={`w-full md:w-5/12 ml-16 md:ml-0 ${
                  index % 2 === 0 ? "md:mr-16" : "md:ml-16"
                }`}
              >
                <ExperienceCard
                  period={exp.period}
                  company={exp.company}
                  position={exp.position}
                  location={exp.location}
                  type={exp.type}
                  highlights={exp.highlights}
                  technologies={exp.technologies}
                  color={exp.color}
                  index={index}
                />
              </div>

              {/* Spacer for Desktop */}
              <div className="hidden md:block w-5/12" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="mt-32 text-center"
      >
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              number: "3+",
              label: "Years Experience",
              icon: <Calendar className="w-6 h-6" />,
            },
            {
              number: "10+",
              label: "Projects Delivered",
              icon: <Briefcase className="w-6 h-6" />,
            },
            {
              number: "100K+",
              label: "Users Served",
              icon: <Users className="w-6 h-6" />,
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SectionContainer>
  );
}
