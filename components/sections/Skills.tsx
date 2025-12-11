"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import {
  Server,
  Database,
  Cloud,
  Code2,
  GitBranch,
  Shield,
  Zap,
  Layers,
  BarChart3,
  // Globe,
} from "lucide-react";
import { SectionHeader, SectionContainer } from "../ui";
import { SkillCard, SkillCategoryHeader } from "../cards";

const skillCategories = [
  {
    title: "Backend Development & Serverless",
    subtitle: "Event-Driven 서버리스 아키텍처 설계",
    icon: <Server className="w-8 h-8" />,
    gradient: "from-blue-500 to-cyan-500",
    skills: [
      {
        name: "AWS Amplify Gen1/Gen2",
        description:
          "서버리스 풀스택 프레임워크 - 멀티테넌트 인증, 실시간 구독, AppSync 통합",
        proficiency: 95,
        icon: <Cloud className="w-5 h-5" />,
      },
      {
        name: "Event-Driven Architecture",
        description:
          "EventBridge, SNS, SQS를 활용한 비동기 이벤트 처리 및 DLQ 모니터링",
        proficiency: 93,
        icon: <Layers className="w-5 h-5" />,
      },
      {
        name: "NestJS & GraphQL",
        description:
          "TypeScript 기반 백엔드, AppSync/GraphQL 실시간 상태 추적 시스템",
        proficiency: 90,
        icon: <Code2 className="w-5 h-5" />,
      },
    ],
  },
  {
    title: "Database & Storage",
    subtitle: "대용량 데이터 처리와 효율적인 저장",
    icon: <Database className="w-8 h-8" />,
    gradient: "from-green-500 to-emerald-500",
    skills: [
      {
        name: "Amazon DynamoDB",
        description:
          "액세스 패턴 분석 기반 GSI 설계, 멀티테넌트 구조, 키 최적화",
        proficiency: 92,
        icon: <Database className="w-5 h-5" />,
      },
      {
        name: "Amazon S3 & EFS",
        description:
          "Pre-signed URL, 대용량 참조 파일 마운트, I/O 스로틀링 해결",
        proficiency: 89,
        icon: <Zap className="w-5 h-5" />,
      },
      {
        name: "Data Modeling",
        description:
          "GraphQL 쿼리 최적화로 네트워크 오버헤드 60% 감소 달성",
        proficiency: 88,
        icon: <BarChart3 className="w-5 h-5" />,
      },
    ],
  },
  {
    title: "Batch Processing & Infrastructure",
    subtitle: "대규모 병렬 처리와 인프라 자동화",
    icon: <Layers className="w-8 h-8" />,
    gradient: "from-purple-500 to-violet-500",
    skills: [
      {
        name: "AWS Batch & Docker",
        description:
          "1000개 샘플 동시 연산, ECR 이미지 관리, 66% 처리 시간 단축",
        proficiency: 91,
        icon: <Layers className="w-5 h-5" />,
      },
      {
        name: "AWS Lambda",
        description:
          "타임아웃 최적화, 재시도 정책 설계, PDF 1000개 30초 생성",
        proficiency: 94,
        icon: <Zap className="w-5 h-5" />,
      },
      {
        name: "Infrastructure as Code",
        description:
          "CloudFormation, Terraform, Amplify CI/CD 파이프라인 구성",
        proficiency: 85,
        icon: <GitBranch className="w-5 h-5" />,
      },
    ],
  },
];

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const prefersReduce = useReducedMotion();
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduce ? ["0px", "0px"] : ["50px", "-50px"]
  );

  return (
    <SectionContainer
      id="skills"
      backgroundClass="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black"
    >
      <SectionHeader
        title="Core"
        subtitle="Technologies"
        titleSize="xl"
        description={
          <>
            4년간의 경험으로 다져진 기술 스택으로
            <br />
            <strong className="font-medium text-gray-900 dark:text-white">
              안정적이고 확장 가능한 시스템을 구축합니다.
            </strong>
          </>
        }
      />

      {/* Skills Grid */}
      <div
        ref={containerRef}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "100px",
        }}
      >
        {skillCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.0,
              delay: categoryIndex * 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Category Header */}
            <SkillCategoryHeader
              title={category.title}
              subtitle={category.subtitle}
              icon={category.icon}
              gradient={category.gradient}
              y={y}
            />

            {/* Skills Cards */}
            <div
              className="grid md:grid-cols-3"
              style={{
                gap: "32px",
              }}
            >
              {category.skills.map((skill, skillIndex) => (
                <SkillCard
                  key={skill.name}
                  name={skill.name}
                  description={skill.description}
                  proficiency={skill.proficiency}
                  icon={skill.icon}
                  gradient={category.gradient}
                  index={skillIndex}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="text-center"
        style={{
          marginTop: "60px",
        }}
      >
        <div
          className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-full"
          style={{
            gap: "12px",
            padding: "16px 32px",
          }}
        >
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            지속적인 학습과 기술 발전을 추구합니다
          </span>
        </div>
      </motion.div>
    </SectionContainer>
  );
}
