import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getAllProjects,
  generateProjectParams,
} from "@/lib/projects";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

/**
 * 정적 페이지 생성을 위한 슬러그 목록
 */
export async function generateStaticParams() {
  return await generateProjectParams();
}

/**
 * 동적 메타데이터 생성
 */
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const project = await getProjectBySlug(slug, lang);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} | Hyunjoong Kim`,
    description: project.adCopy,
  };
}

/**
 * 프로젝트 상세 페이지
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { lang, slug } = await params;
  const project = await getProjectBySlug(slug, lang);

  if (!project) {
    notFound();
  }

  // 모든 프로젝트를 가져와서 이전/다음 프로젝트 찾기
  const allProjects = await getAllProjects(lang);
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  // MDX 컨텐츠 동적 import
  let ProjectContent: React.ComponentType | null = null;
  try {
    const mdxModule = await import(`@/content/projects/${slug}.${lang}.mdx`);
    ProjectContent = mdxModule.default;
  } catch (error) {
    console.error(`Failed to load MDX content for ${slug}.${lang}:`, error);
  }

  return (
    <article className="max-w-5xl mx-auto">
      {/* 헤더 */}
      <header className="mb-12">
        <Link
          href={`/${lang}/projects`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white focus-visible:ring-2 focus-visible:ring-white/20 outline-none rounded-md transition-colors duration-200 mb-8"
          aria-label="Go back to projects list"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span className="text-sm font-mono uppercase tracking-widest">
            Back to Projects
          </span>
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
      <div className="mb-12 rounded-2xl overflow-hidden relative aspect-video bg-gray-900">
        <Image
          src={project.image}
          alt={`Main showcase image for ${project.title}`}
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1024px"
          className="object-cover"
        />
      </div>

      {/* 메트릭스 */}
      <section
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        aria-label="Project metrics"
      >
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
      </section>

      {/* 태그 */}
      <div
        className="flex flex-wrap gap-3 mb-12"
        aria-label="Technologies used"
      >
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
      <section className="prose-custom mb-16" aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="text-2xl font-light text-white mb-6">
          Project Overview
        </h2>
        <div className="text-gray-400 leading-relaxed text-lg">
          {project.description}
        </div>
      </section>

      {/* MDX 본문 컨텐츠 */}
      {ProjectContent && (
        <>
          <hr className="border-gray-800 mb-16" aria-hidden="true" />
          <section className="prose-custom mb-16" aria-label="Detailed project documentation">
            <ProjectContent />
          </section>
        </>
      )}

      {/* 네비게이션 */}
      <nav
        className="mt-16 pt-8 border-t border-gray-800"
        aria-label="Project navigation"
      >
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          {prevProject ? (
            <Link
              href={`/${lang}/projects/${prevProject.slug}`}
              className="group flex-1 p-4 rounded-lg border border-gray-800 hover:border-gray-700 focus-visible:ring-2 focus-visible:ring-white/20 outline-none transition-colors duration-200"
              aria-label={`Previous project: ${prevProject.title}`}
            >
              <span className="text-xs text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <ArrowLeft size={12} aria-hidden="true" />
                Previous
              </span>
              <span className="block text-white mt-2 group-hover:text-gray-300 transition-colors duration-200 line-clamp-1">
                {prevProject.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1 hidden sm:block" />
          )}

          {nextProject ? (
            <Link
              href={`/${lang}/projects/${nextProject.slug}`}
              className="group flex-1 p-4 rounded-lg border border-gray-800 hover:border-gray-700 focus-visible:ring-2 focus-visible:ring-white/20 outline-none transition-colors duration-200 text-right"
              aria-label={`Next project: ${nextProject.title}`}
            >
              <span className="text-xs text-gray-500 uppercase tracking-widest flex items-center justify-end gap-2">
                Next
                <ArrowRight size={12} aria-hidden="true" />
              </span>
              <span className="block text-white mt-2 group-hover:text-gray-300 transition-colors duration-200 line-clamp-1">
                {nextProject.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1 hidden sm:block" />
          )}
        </div>
      </nav>
    </article>
  );
}
