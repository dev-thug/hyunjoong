import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Link from "@/components/IntentLink";
import Image from "next/image";
import { getAllProjects } from "@/lib/projects";
import { getDictionary } from "@/get-dictionary";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import type { Locale } from "@/i18n-config";
import { getDeveloperSearchMetadata } from "@/lib/metadata/developer-search";
import { buildLocalizedPageMetadata } from "@/lib/metadata/localized-page";

/**
 * 프로젝트 목록 페이지 메타데이터 (다국어)
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Locale };
  const searchMetadata = getDeveloperSearchMetadata(lang, "projects");
  return buildLocalizedPageMetadata({
    lang,
    path: "/projects",
    title: searchMetadata.title,
    description: searchMetadata.description,
    keywords: searchMetadata.keywords,
    absoluteTitle: true,
  });
}

/**
 * 프로젝트 목록 페이지
 */
export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const [projects, dict] = await Promise.all([
    getAllProjects(lang),
    getDictionary(lang),
  ]);

  return (
    <main id="main-content" tabIndex={-1}>
      <Breadcrumbs lang={lang} items={[{ name: lang === "ko" ? "홈" : "Home", path: "/" + lang }, { name: dict.nav.projects, path: "/" + lang + "/projects" }]} />
      {/* 헤더 */}
      <div className="mb-12 md:mb-16 pt-6 md:pt-8">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light font-montserrat heading-decorative select-none">
          {dict.projects.title_bg}
        </h1>
        <p className="text-gray-400 mt-4 text-lg">
          {dict.projects.page_subtitle}
        </p>
      </div>

      {/* 프로젝트 목록 */}
      <section className="space-y-8" aria-label={dict.projects.list_aria}>
        {projects.map((project, idx) => (
          <Link
            key={project.id}
            href={`/${lang}/projects/${project.slug}`}
            className="group block p-4 sm:p-8 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/20 outline-none transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* 이미지 */}
              <div className="w-full md:w-1/3 self-start  rounded-lg overflow-hidden bg-gray-900 relative" style={{ aspectRatio: project.slug === "genomic-prediction-app" ? "1440 / 804" : "16 / 10" }}>
                <Image
                  src={project.image}
                  alt={lang === "ko" ? `${project.title} 프로젝트 대표 이미지` : `Showcase image for ${project.title}`}
                  fill
                  sizes="(max-width: 767px) calc(100vw - 4rem), (max-width: 1399px) calc(33.333vw - 32px), 420px"
                  loading={idx === 0 ? "eager" : "lazy"}
                  fetchPriority={idx === 0 ? "high" : undefined}
                  className={"object-cover " + " md:grayscale group-hover:grayscale-0 group-focus-visible:grayscale-0 transition-all duration-500"}
                />
              </div>

              {/* 콘텐츠 */}
              <div className="md:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span
                      className="text-xs font-mono text-gray-400"
                      aria-hidden="true"
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                      {project.highlight}
                    </span>
                  </div>

                  <h2 className="text-3xl font-light text-white mb-3 group-hover:text-gray-200 transition-colors">
                    {project.title}
                  </h2>

                  <p className="text-gray-400 leading-relaxed">{project.adCopy}</p>
                </div>

                <div className="flex items-center justify-between gap-4 mt-6">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono px-3 py-1 rounded-full border border-gray-800 text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-sm text-gray-400 group-hover:text-white transition-colors">
                    {dict.projects.view_project}
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
