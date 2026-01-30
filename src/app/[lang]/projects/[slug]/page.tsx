import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PROJECTS } from '@/constants';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

interface ProjectPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

/**
 * 정적 페이지 생성을 위한 슬러그 목록
 */
export function generateStaticParams(): { slug: string }[] {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

/**
 * slug로 프로젝트 찾기
 */
const getProjectBySlug = (slug: string) => {
  return PROJECTS.find((project) => project.slug === slug);
};

/**
 * 동적 메타데이터 생성
 */
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  
  if (!project) {
    return { title: 'Project Not Found' };
  }
  
  return {
    title: `${project.title} | Kim Hyun-joong`,
    description: project.adCopy,
  };
}

/**
 * 프로젝트 상세 페이지
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { lang, slug } = await params;
  const project = getProjectBySlug(slug);
  
  if (!project) {
    notFound();
  }

  // 이전/다음 프로젝트 찾기
  const currentIndex = PROJECTS.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? PROJECTS[currentIndex - 1] : null;
  const nextProject = currentIndex < PROJECTS.length - 1 ? PROJECTS[currentIndex + 1] : null;

  return (
    <article>
      {/* 헤더 */}
      <header className="mb-12">
        <Link
          href={`/${lang}/projects`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          tabIndex={0}
          aria-label="Go back to projects list"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-mono uppercase tracking-widest">Back to Projects</span>
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
            {project.techHighlight}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold font-montserrat text-white leading-tight">
          {project.title}
        </h1>
        
        <p className="text-xl text-gray-400 mt-4 leading-relaxed">
          {project.adCopy}
        </p>

        <hr className="border-gray-800 mt-8" />
      </header>

      {/* 메인 이미지 */}
      <div className="mb-12 rounded-2xl overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full aspect-video object-cover"
        />
      </div>

      {/* 메트릭스 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {project.metrics.map((metric) => (
          <div
            key={metric.label}
            className="p-6 rounded-xl border border-gray-800 bg-white/5"
          >
            <span className="text-3xl md:text-4xl font-bold text-white">
              {metric.value}
            </span>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-2">
              {metric.label}
            </p>
          </div>
        ))}
      </div>

      {/* 태그 */}
      <div className="flex flex-wrap gap-3 mb-12">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-4 py-2 rounded-full text-sm border border-gray-700 text-gray-300 bg-white/5"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 상세 설명 */}
      <div className="prose-custom mb-16">
        <h2 className="text-2xl font-light text-white mb-6">Project Overview</h2>
        <p className="text-gray-400 leading-relaxed text-lg">
          {project.description}
        </p>
      </div>

      {/* 네비게이션 */}
      <nav className="mt-16 pt-8 border-t border-gray-800">
        <div className="flex justify-between items-center gap-4">
          {prevProject ? (
            <Link
              href={`/${lang}/projects/${prevProject.slug}`}
              className="group flex-1 p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
              tabIndex={0}
              aria-label={`Previous project: ${prevProject.title}`}
            >
              <span className="text-xs text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <ArrowLeft size={12} />
                Previous
              </span>
              <span className="block text-white mt-2 group-hover:text-gray-300 transition-colors line-clamp-1">
                {prevProject.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextProject ? (
            <Link
              href={`/${lang}/projects/${nextProject.slug}`}
              className="group flex-1 p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors text-right"
              tabIndex={0}
              aria-label={`Next project: ${nextProject.title}`}
            >
              <span className="text-xs text-gray-500 uppercase tracking-widest flex items-center justify-end gap-2">
                Next
                <ArrowRight size={12} />
              </span>
              <span className="block text-white mt-2 group-hover:text-gray-300 transition-colors line-clamp-1">
                {nextProject.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </nav>
    </article>
  );
}
