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

// 경력 기간 자동 계산 함수
function calculateDuration(startDate: string, endDate?: string): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  if (years === 0) {
    return `${months}개월`;
  } else if (months === 0) {
    return `${years}년`;
  } else {
    return `${years}년 ${months}개월`;
  }
}

// 경력 기간 문자열 생성 함수
function formatPeriod(startDate: string, endDate?: string): string {
  const startFormatted = startDate.slice(0, 7).replace("-", ".");
  const endFormatted = endDate ? endDate.slice(0, 7).replace("-", ".") : "Present";
  const duration = calculateDuration(startDate, endDate);
  
  return `${startFormatted} - ${endFormatted} (${duration})`;
}

// 총 경력 연수 계산 함수 (첫 직장 시작일 기준)
function calculateTotalExperience(startDate: string): string {
  const start = new Date(startDate);
  const now = new Date();
  const years = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
  return `${years}+`;
}

// 첫 직장 시작일 (총 경력 계산용)
const firstJobStartDate = "2021-12-01";

const experiences = [
  {
    period: formatPeriod("2023-12-01"),
    company: "Fortuna Helix",
    position: "Tech Leader, Backend & AWS Cloud Developer",
    location: "서울, 대한민국",
    type: "정규직",
    highlights: [
      "AWS Batch + EFS 병렬 처리로 분석 시간 66% 단축 (30분→10분)",
      "서버리스 전환으로 운영 비용 92% 절감 (월 600만→50만원)",
      "EFS I/O 스로틀링 해결 및 멀티 EFS 분산 구성 제안",
      "Lambda 타임아웃 최적화 및 재시도 정책 설계",
      "ISO 27001 인증 기여",
    ],
    technologies: [
      "NestJS",
      "TypeScript",
      "AWS Batch",
      "Lambda",
      "EFS",
      "EventBridge",
      "SQS",
      "SNS",
      "DynamoDB",
      "ECR",
      "CloudWatch",
    ],
    color: "from-blue-500 to-cyan-500",
  },
  {
    period: formatPeriod("2021-12-01", "2023-12-01"),
    company: "(주)헬리큐어",
    position: "Backend & AWS Cloud Developer",
    location: "서울, 대한민국",
    type: "정규직",
    highlights: [
      "AI 처방 추천으로 초진 시간 55% 단축 (27분→12분)",
      "TIPS 프로그램 선정 기여 (2023.05)",
      "GraphQL 쿼리 최적화로 네트워크 오버헤드 60% 감소",
      "Amplify Gen1 기반 멀티테넌트 인증 구조 구현",
      "DynamoDB 액세스 패턴 분석 기반 테이블 설계",
    ],
    technologies: ["ReactJS", "TypeScript", "Amplify Gen1", "Lambda", "DynamoDB", "GraphQL", "Cognito", "CloudFormation"],
    color: "from-green-500 to-emerald-500",
  },
  {
    period: formatPeriod("2015-03-01", "2022-02-28"),
    company: "금오공과대학교 컴퓨터소프트웨어공학과",
    position: "학사 졸업",
    location: "구미, 대한민국",
    type: "학사",
    highlights: [],
    technologies: ["Java", "Spring", "MySQL", "REST API", "Git"],
    color: "from-purple-500 to-violet-500",
  },
];

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

  const totalYearsExperience = calculateTotalExperience(firstJobStartDate);

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
              number: totalYearsExperience,
              label: "Years Experience",
              icon: <Calendar className="w-6 h-6" />,
            },
            {
              number: "3+",
              label: "Major Projects",
              icon: <Briefcase className="w-6 h-6" />,
            },
            {
              number: "TIPS",
              label: "Program Selected",
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
