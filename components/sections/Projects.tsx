"use client";

import { Database, Server, Zap, Users, Bot, HeartPulse, FileText } from "lucide-react";
import { SectionHeader, SectionContainer } from "../ui";
import { ProjectCard } from "../cards";

const projects = [
  {
    title: "Specify",
    subtitle: "AI 대화 기반 요구사항 구체화 플랫폼 (개인 프로젝트)",
    description:
      "AI 에이전트와의 대화를 통해 요구사항을 점진적으로 구체화하고, 맞춤형 문서를 자동 생성하는 협업 플랫폼입니다. Bedrock LLM 기반 Stateful Context 설계로 문맥을 유지하며, Y.js CRDT로 실시간 협업 동기화를 구현했습니다.",
    tags: ["TypeScript", "Next.js 16", "CodeMirror 6", "Yjs CRDT", "AWS Bedrock", "Amplify Gen2", "AppSync", "DynamoDB", "MCP Server"],
    metrics: [
      {
        icon: <Zap className="w-4 h-4" />,
        label: "개발 효율",
        value: "70%↑",
      },
      {
        icon: <Bot className="w-4 h-4" />,
        label: "AI 문맥 유지",
        value: "Stateful",
      },
      {
        icon: <Users className="w-4 h-4" />,
        label: "실시간 협업",
        value: "CRDT",
      },
    ],
    highlights: [
      "AI 대화 기반 요구사항 자동 분해로 개발 효율 70% 향상",
      "Bedrock LLM + Stateful Context 설계로 문맥 유지 구현",
      "Y.js CRDT 엔진 기반 실시간 협업 문서 동기화",
      "MCP(Model Context Protocol) 서버 구현으로 LLM 에이전트 확장성 확보",
      "Next.js 16 + Amplify Gen2 서버리스 아키텍처로 빠른 프로토타입 개발",
    ],
    demo: "https://specify.app/",
    featured: true,
    gradient: "from-violet-500 to-indigo-500",
    mockup: "macbook",
    videoSrc: "/videos/specify.webm",
  },
  {
    title: "Fortuna Helix - 유전체 분석 플랫폼",
    subtitle: "대용량 유전체 데이터 처리 Event-Driven 서버리스 시스템",
    description:
      "100-200GB 규모의 유전체 시퀀싱 데이터를 효율적으로 처리하는 서버리스 플랫폼입니다. AWS Batch + EFS 병렬 처리로 1000개 샘플을 동시 연산하며, EFS I/O 스로틀링 및 Lambda 타임아웃 문제를 해결하여 안정성을 확보했습니다.",
    tags: ["NestJS", "TypeScript", "AWS Batch", "Lambda", "AppSync", "EventBridge", "SQS", "SNS", "EFS", "S3", "Cognito", "CloudWatch", "ECR"],
    metrics: [
      {
        icon: <Zap className="w-4 h-4" />,
        label: "분석 시간",
        value: "66%↓",
      },
      {
        icon: <Database className="w-4 h-4" />,
        label: "동시 처리",
        value: "1000개",
      },
      {
        icon: <Server className="w-4 h-4" />,
        label: "비용 절감",
        value: "92%↓",
      },
    ],
    highlights: [
      "AWS Batch + EFS 병렬 처리로 분석 시간 30분→10분 (66% 단축)",
      "서버리스 전환으로 운영 비용 월 600만→50만원 (92% 절감)",
      "EFS I/O 스로틀링 문제 분석 및 멀티 EFS 분산 구성 제안",
      "Lambda 타임아웃 최적화 및 재시도 정책 설계로 안정성 확보",
      "SQS FIFO + Lambda로 PDF 리포트 1000개 30초 생성",
      "EventBridge + SNS/SQS 기반 Event-Driven 아키텍처 설계",
    ],
    featured: false,
    gradient: "from-cyan-500 to-blue-500",
    mockup: "macbook",
    videoSrc: "/videos/fortunahelix_project.mp4",
  },
  {
    title: "Healicure - 예진 (Yejin Clinic)",
    subtitle: "AI 기반 한의원 전자차트(EMR) 시스템",
    description:
      "한의사 전용 AI 처방 추천 EMR 시스템으로, 환자 증상 입력 시 AI가 실시간 처방을 추천합니다. Amplify Gen1 멀티테넌트 인증 구조와 DynamoDB 액세스 패턴 최적화로 초진 시간을 27분에서 12분으로 단축했습니다.",
    tags: ["ReactJS", "TypeScript", "AWS Amplify Gen1", "Lambda", "DynamoDB", "GraphQL", "Cognito", "CloudFormation"],
    metrics: [
      {
        icon: <HeartPulse className="w-4 h-4" />,
        label: "초진 시간",
        value: "55%↓",
      },
      {
        icon: <Bot className="w-4 h-4" />,
        label: "AI 처방",
        value: "Real-time",
      },
      {
        icon: <FileText className="w-4 h-4" />,
        label: "전자 차트",
        value: "EMR",
      },
    ],
    highlights: [
      "AI 처방 추천으로 초진 시간 27분→12분 (55% 단축)",
      "베타 테스터 3곳 30건 초진 로그 측정으로 TIPS 선정(2023.05) 기여",
      "GraphQL 쿼리 최적화로 네트워크 오버헤드 60% 감소",
      "DynamoDB 액세스 패턴 분석 기반 키 설계 최적화",
      "Amplify Gen1 기반 멀티테넌트 인증 구조 구현",
    ],
    demo: "https://yejin.clinic/",
    featured: false,
    gradient: "from-orange-400 to-amber-500",
    mockup: "macbook",
    imageSrc: "/yejin/landing-page.png",
  },
];

export default function Projects() {

  return (
    <SectionContainer
      id="projects"
      backgroundClass="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black"
    >
      <div className="mb-(--space-24)">
        <SectionHeader
          title="Featured"
          subtitle="Projects"
          titleSize="xl"
          description={
            <>
              실제 사용자에게 가치를 전달한 프로젝트들을 통해
              <br />
              <strong className="font-medium text-gray-900 dark:text-white">
                기술적 역량과 문제 해결 능력을 확인해보세요.
              </strong>
            </>
          }
        />
      </div>

      {/* Projects Grid */}
      <div className="flex flex-col gap-(--space-24)">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.title}
            title={project.title}
            subtitle={project.subtitle}
            description={project.description}
            tags={project.tags}
            metrics={project.metrics}
            highlights={project.highlights}
            demo={project.demo}
            featured={project.featured}
            gradient={project.gradient}
            mockup={project.mockup as "macbook" | "iphone" | "desktop"}
            videoSrc={project.videoSrc}
            imageSrc={project.imageSrc}
            index={index}
          />
        ))}
      </div>

    </SectionContainer>
  );
}
