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

  const skillCategories = [
    {
      title: "Backend Development & Cloud Architecture",
      subtitle: "확장성 있는 서버리스 아키텍처의 핵심",
      icon: <Server className="w-8 h-8" />,
      gradient: "from-blue-500 to-cyan-500",
      skills: [
        {
          name: "AWS Amplify",
          description:
            "서버리스 풀스택 프레임워크 - GraphQL API, Cognito 인증, 실시간 구독",
          proficiency: 95,
          icon: <Cloud className="w-5 h-5" />,
        },
        {
          name: "GraphQL & AppSync",
          description:
            "실시간 데이터 동기화, Pub/Sub 패턴, 실시간 상태 추적 시스템 구현",
          proficiency: 90,
          icon: <Code2 className="w-5 h-5" />,
        },
        {
          name: "Event-Driven Architecture",
          description:
            "AWS Lambda, SQS, SNS를 활용한 비동기 이벤트 처리 및 워크플로우 설계",
          proficiency: 93,
          icon: <Layers className="w-5 h-5" />,
        },
      ],
    },
    {
      title: "NoSQL Database & Storage",
      subtitle: "대용량 데이터 처리와 효율적인 저장",
      icon: <Database className="w-8 h-8" />,
      gradient: "from-green-500 to-emerald-500",
      skills: [
        {
          name: "Amazon DynamoDB",
          description:
            "GSI 인덱스 설계, 상태 기반 쿼리 최적화, 실시간 스트림 활용",
          proficiency: 92,
          icon: <Database className="w-5 h-5" />,
        },
        {
          name: "Amazon S3 & Data Management",
          description:
            "대용량 파일 스토리지, Pre-signed URL, 파일 압축 시스템 구현",
          proficiency: 89,
          icon: <Zap className="w-5 h-5" />,
        },
        {
          name: "Data Modeling & Access Patterns",
          description:
            "NoSQL 데이터 모델링, 상태 추적 테이블 설계, 인덱스 전략 수립",
          proficiency: 88,
          icon: <BarChart3 className="w-5 h-5" />,
        },
      ],
    },
    {
      title: "Container & Batch Processing",
      subtitle: "대규모 병렬 처리와 인프라 자동화",
      icon: <Layers className="w-8 h-8" />,
      gradient: "from-purple-500 to-violet-500",
      skills: [
        {
          name: "AWS Batch & Docker",
          description:
            "컨테이너화된 유전체 분석 파이프라인, ECR 이미지 관리, 병렬 처리",
          proficiency: 91,
          icon: <Layers className="w-5 h-5" />,
        },
        {
          name: "AWS Lambda & Serverless",
          description:
            "서버리스 PDF 생성, 이벤트 기반 처리, 실시간 상태 업데이트",
          proficiency: 94,
          icon: <Zap className="w-5 h-5" />,
        },
        {
          name: "Infrastructure as Code",
          description:
            "AWS SAM, Terraform, CloudFormation, 환경별 배포, CI/CD 파이프라인 구성",
          proficiency: 85,
          icon: <GitBranch className="w-5 h-5" />,
        },
      ],
    },
  ];

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
