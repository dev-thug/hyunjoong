"use client";

import { Database, Server, Zap, Users, Bot, GitBranch, HeartPulse, Calendar, FileText } from "lucide-react";
import { SectionHeader, SectionContainer } from "../ui";
import { ProjectCard, CallToActionCard } from "../cards";

export default function Projects() {
  const projects = [
    {
      title: "Specify",
      subtitle: "AI-Powered Collaborative Document Platform (개인 프로젝트)",
      description:
        "AI 에이전트가 글쓰기와 문서 관리를 돕고 지식 그래프를 정리하는 협업 문서 편집 플랫폼입니다. 실시간 협업, 맥락 기반 AI 지원, 문서 간 관계 분석을 제공합니다.",
      tags: ["TypeScript", "React", "CodeMirror 6", "Yjs (CRDT)", "AWS Bedrock", "GraphQL", "DynamoDB", "AWS Amplify"],
      metrics: [
        {
          icon: <Bot className="w-4 h-4" />,
          label: "AI 컨텍스트 지원",
          value: "Context-aware",
        },
        {
          icon: <Users className="w-4 h-4" />,
          label: "실시간 협업",
          value: "Real-time",
        },
        {
          icon: <GitBranch className="w-4 h-4" />,
          label: "문서 관계 시각화",
          value: "Graph View",
        },
      ],
      highlights: [
        "CodeMirror 6 + Yjs 기반 실시간 CRDT 협업 편집기 구현",
        "AWS Bedrock 기반 맥락 인식 AI 에이전트 통합",
        "문서 간 관계 분석 및 지식 그래프 시각화 시스템 구축",
        "자동 문서 분류 및 태깅 시스템으로 생산성 향상",
      ],
      demo: "https://specify.app/",
      featured: true,
      gradient: "from-violet-500 to-indigo-500",
      mockup: "macbook",
      videoSrc: "/videos/specify.webm",
    },
    {
      title: "Fortuna Helix - 유전체 분석 플랫폼",
      subtitle: "대용량 유전체 데이터 처리 서버리스 아키텍처",
      description:
        "100-200GB 규모의 유전체 시퀀싱 데이터를 처리하는 Event-Driven 서버리스 플랫폼입니다. AWS Batch와 EFS를 활용한 병렬 처리로 1000개 샘플 동시 연산이 가능하며, 분석 시간을 66% 단축했습니다.",
      tags: ["NestJS", "TypeScript", "AWS Batch", "Lambda", "AppSync", "GraphQL", "DynamoDB", "SQS", "SNS", "EFS", "S3", "Cognito"],
      metrics: [
        {
          icon: <Zap className="w-4 h-4" />,
          label: "분석 시간 단축",
          value: "66%↓",
        },
        {
          icon: <Database className="w-4 h-4" />,
          label: "동시 샘플 처리",
          value: "1000개",
        },
        {
          icon: <Server className="w-4 h-4" />,
          label: "운영 비용 절감",
          value: "92%↓",
        },
      ],
      highlights: [
        "AWS Batch + EFS 기반 병렬 컴퓨팅으로 분석 시간 30분→10분 단축",
        "운영 비용 월 600만원→50만원으로 92% 절감 달성",
        "S3 pre-signed URL + Cognito로 파일 업로드 자동화 구현",
        "SQS FIFO + Lambda로 PDF 리포트 1000개 30초 생성 시스템 구축",
        "EventBridge + SNS/SQS 기반 이벤트 드리븐 아키텍처 설계",
        "멀티테넌트 DynamoDB NoSQL 데이터 관리 구조 구현",
      ],
      featured: true,
      gradient: "from-cyan-500 to-blue-500",
      mockup: "macbook",
      videoSrc: "/videos/fortunahelix_project.mp4",
    },
    {
      title: "예진 (Yejin Clinic)",
      subtitle: "AI 기반 한의원 EMR 시스템",
      description:
        "환자 관리부터 AI 처방 추천까지 한의원을 업그레이드하는 통합 관리 시스템입니다. ReactJS 인터랙티브 UI와 AWS Amplify Gen1 Event-Driven 아키텍처로 초진 시간을 27분에서 12분으로 55% 단축했습니다.",
      tags: ["ReactJS", "TypeScript", "AWS Amplify Gen1", "DynamoDB", "GraphQL", "PWA", "Spoqa Han Sans"],
      metrics: [
        {
          icon: <HeartPulse className="w-4 h-4" />,
          label: "초진 시간 단축",
          value: "55%↓",
        },
        {
          icon: <Bot className="w-4 h-4" />,
          label: "AI 처방 추천",
          value: "Real-time",
        },
        {
          icon: <FileText className="w-4 h-4" />,
          label: "전자 차트",
          value: "Digital EMR",
        },
      ],
      highlights: [
        "AI 기반 증상 입력→처방 추천 워크플로우로 초진 시간 27분→12분 단축",
        "GraphQL 쿼리 최적화로 네트워크 오버헤드 60% 감소",
        "DynamoDB 액세스 패턴 분석 기반 테이블 설계 및 키 최적화",
        "베타 테스터 3곳 30건 초진 로그 측정으로 TIPS 프로그램(2023.05) 선정 기여",
        "ReactJS 인터랙티브 UI로 진료 프로세스 직관화",
      ],
      demo: "https://yejin.clinic/",
      featured: true,
      gradient: "from-orange-400 to-amber-500",
      mockup: "macbook",
      imageSrc: "/yejin/landing-page.png",
    },
  ];

  return (
    <SectionContainer
      id="projects"
      backgroundClass="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black"
    >
      <div
        style={{
          marginBottom: "96px",
        }}
      >
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "96px",
        }}
      >
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

      {/* Call to Action */}
      <div
        style={{
          marginTop: "128px",
        }}
      >
        <CallToActionCard
          title="더 많은 프로젝트가 궁금하신가요?"
          description="GitHub에서 전체 포트폴리오와 오픈소스 기여를 확인해보세요."
          buttonText="GitHub 방문하기"
          buttonHref="https://github.com/dev-thug"
        />
      </div>
    </SectionContainer>
  );
}
