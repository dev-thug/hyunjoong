"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Server,
  Database,
  Cloud,
  Users,
  Trophy,
  Target,
  Heart,
} from "lucide-react";
import { SectionHeader, BackgroundGrid, SectionContainer } from "../ui";
import { ValueCard, ExpertiseCard, AchievementCard } from "../cards";

const coreValues = [
  {
    icon: <Target className="w-8 h-8" />,
    title: "Cloud Native 설계",
    subtitle: "Serverless Architecture",
    description:
      "AWS 서버리스 아키텍처로 비용 92% 절감, 처리 시간 66% 단축을 실현한 경험을 보유하고 있습니다.",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "문제 해결 역량",
    subtitle: "Problem Solving",
    description:
      "EFS I/O 스로틀링, Lambda 타임아웃 등 실무에서 발생하는 복잡한 기술적 문제를 해결합니다.",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "협업과 코드 리뷰",
    subtitle: "Team Collaboration",
    description: "주간 코드 리뷰 세션을 운영하며 팀의 개발 생산성과 코드 품질을 높입니다.",
    gradient: "from-purple-500 to-violet-600",
  },
];

const expertise = [
  {
    icon: <Code2 className="w-12 h-12" />,
    title: "클라이언트 개발",
    subtitle: "Client Development",
    skills: ["Next.js 15", "ReactJS", "TypeScript", "CodeMirror 6"],
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: <Server className="w-12 h-12" />,
    title: "서버 개발",
    subtitle: "Server Development",
    skills: ["NestJS", "Event-Driven", "GraphQL", "AppSync"],
    color: "from-orange-500 to-red-600",
  },
  {
    icon: <Database className="w-12 h-12" />,
    title: "데이터베이스 설계",
    subtitle: "Database Design",
    skills: ["DynamoDB", "액세스 패턴 분석", "GSI 설계", "멀티테넌트"],
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: <Cloud className="w-12 h-12" />,
    title: "클라우드 & DevOps",
    subtitle: "Cloud & DevOps",
    skills: ["AWS Batch", "Lambda", "EFS", "EventBridge", "SNS/SQS"],
    color: "from-purple-500 to-violet-600",
  },
];

const achievements = [
  {
    number: "66%",
    title: "분석 시간 단축",
    description: "AWS Batch 병렬 처리로 30분→10분",
    icon: <Trophy className="w-8 h-8" />,
  },
  {
    number: "92%",
    title: "비용 절감",
    description: "서버리스 전환으로 600만→50만원",
    icon: <Server className="w-8 h-8" />,
  },
  {
    number: "55%",
    title: "초진 시간 단축",
    description: "AI 처방 추천으로 27분→12분",
    icon: <Users className="w-8 h-8" />,
  },
];

export default function About() {
  return (
    <SectionContainer
      id="about"
      backgroundClass="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black"
    >
      <BackgroundGrid size={32} />

      {/* Hero Section */}
      <SectionHeader
        title="About"
        subtitle="Hyunjoong"
        titleSize="xl"
        description={
          <>
            4년간 스타트업에서 서버리스 아키텍처를 설계하며
            <br />
            <strong className="font-medium text-gray-900 dark:text-white">
              대용량 데이터 처리와 운영 효율을 높였습니다.
            </strong>
          </>
        }
      />

      {/* Core Values */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="flex flex-col gap-8"
      >
        <SectionHeader title="개발 철학" />
        <div className="grid lg:grid-cols-3 gap-8">
          {coreValues.map((value, index) => (
            <ValueCard
              key={value.title}
              icon={value.icon}
              title={value.title}
              subtitle={value.subtitle}
              description={value.description}
              gradient={value.gradient}
              index={index}
            />
          ))}
        </div>
      </motion.div>

      {/* Technical Expertise */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="flex flex-col gap-8"
      >
        <SectionHeader title="핵심 기술" className="mb-16" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {expertise.map((tech, index) => (
            <ExpertiseCard
              key={tech.title}
              icon={tech.icon}
              title={tech.title}
              subtitle={tech.subtitle}
              skills={tech.skills}
              color={tech.color}
              index={index}
            />
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="flex flex-col gap-8"
      >
        <SectionHeader title="주요 성과" className="mb-16" />
        <div className="grid md:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.title}
              icon={achievement.icon}
              number={achievement.number}
              title={achievement.title}
              description={achievement.description}
              index={index}
            />
          ))}
        </div>
      </motion.div>

      {/* Ambient Light Effect */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-radial from-blue-500/5 via-purple-500/3 to-transparent dark:from-blue-400/10 dark:via-purple-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-gradient-radial from-purple-500/5 via-blue-500/3 to-transparent dark:from-purple-400/10 dark:via-blue-400/5 rounded-full blur-3xl pointer-events-none" />
    </SectionContainer>
  );
}
