import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getAllProjects,
  generateProjectParams,
} from "@/lib/projects";
import { getDictionary } from "@/get-dictionary";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import type { Locale } from "@/i18n-config";

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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://hyunjoong.kim";

  // Build language alternates - check if project exists in both languages
  const languages: Record<string, string> = {};
  const koProject = await getProjectBySlug(slug, "ko");
  const enProject = await getProjectBySlug(slug, "en");

  if (koProject) languages.ko = `${baseUrl}/ko/projects/${slug}`;
  if (enProject) languages.en = `${baseUrl}/en/projects/${slug}`;
  if (koProject) languages["x-default"] = `${baseUrl}/ko/projects/${slug}`;

  return {
    title: `${project.title} | Hyunjoong Kim`,
    description: project.description || project.adCopy,
    alternates: {
      canonical: `${baseUrl}/${lang}/projects/${slug}`,
      languages,
    },
    openGraph: {
      title: project.title,
      description: project.description || project.adCopy,
      url: `${baseUrl}/${lang}/projects/${slug}`,
      type: "website",
      locale: lang === "ko" ? "ko_KR" : "en_US",
      images: [
        {
          url: project.image,
          alt: `${project.title} showcase image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description || project.adCopy,
      images: [project.image],
    },
  };
}

/**
 * 프로젝트 상세 페이지
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { lang, slug } = (await params) as { lang: Locale; slug: string };
  const [project, dict, allProjects] = await Promise.all([
    getProjectBySlug(slug, lang),
    getDictionary(lang),
    getAllProjects(lang),
  ]);

  if (!project) {
    notFound();
  }

  // 모든 프로젝트를 가져와서 이전/다음 프로젝트 찾기
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
          aria-label={dict.projects.back_to_portfolio_aria}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span className="text-sm font-mono uppercase tracking-widest">
            {dict.projects.back_to_portfolio}
          </span>
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
            {project.highlight}
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
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
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

      {/* 서비스 바로가기: 태그 아래 가로로 길게 */}
      {project.serviceUrl && (
        <a
          href={project.serviceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl border-2 border-white/25 bg-white/10 text-white hover:bg-white/20 hover:border-white/40 focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none transition-all duration-200 touch-action-manipulation mb-12"
          aria-label={`Visit ${project.title} service (opens in new tab)`}
        >
          <span className="text-base font-bold">Visit Service</span>
          <ExternalLink size={20} aria-hidden="true" className="shrink-0" />
        </a>
      )}

      {/* 상세 설명 */}
      <section
        className="prose-custom mb-16"
        aria-labelledby="overview-heading"
      >
        <h2
          id="overview-heading"
          className="text-2xl font-light text-white mb-6"
        >
          Project Overview
        </h2>
        <div className="text-gray-400 leading-relaxed text-lg">
          {project.description}
        </div>
      </section>

      {/* MDX 본문 컨텐츠 */}
      {ProjectContent && (
        <>
          <hr className="border-gray-800 my-8" aria-hidden="true" />
          <section
            className="prose-custom mb-16"
            aria-label="Detailed project documentation"
          >
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
