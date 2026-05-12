import Link from "next/link";
import Image from "next/image";
import { getAllProjects } from "@/lib/projects";
import { getDictionary } from "@/get-dictionary";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import type { Locale } from "@/i18n-config";
import { buildLocalizedPageMetadata } from "@/lib/metadata/localized-page";

/**
 * 포트폴리오(프로젝트 목록) 페이지 메타데이터 (다국어)
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Locale };
  const dict = await getDictionary(lang);
  return buildLocalizedPageMetadata({
    lang,
    path: "/projects",
    title: dict.projects.meta_title,
    description: dict.projects.meta_description,
  });
}

/**
 * 포트폴리오(프로젝트 목록) 페이지
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
    <main>
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
      <section className="space-y-8" aria-label="Project list">
        {projects.map((project, idx) => (
          <Link
            key={project.id}
            href={`/${lang}/projects/${project.slug}`}
            className="group block p-8 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/20 outline-none transition-all duration-300"
            aria-label={dict.projects.view_project_aria.replace("{title}", project.title)}
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* 이미지 */}
              <div className="md:w-1/3 aspect-video rounded-lg overflow-hidden bg-gray-900 relative">
                <Image
                  src={project.image}
                  alt={`Cover image for ${project.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover opacity-100 md:grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
              </div>

              {/* 콘텐츠 */}
              <div className="md:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span
                      className="text-xs font-mono text-gray-600"
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

                  <p className="text-gray-500 line-clamp-2">{project.adCopy}</p>
                </div>

                <div className="flex items-center justify-between mt-6">
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

                  <span className="inline-flex items-center gap-2 text-sm text-gray-500 group-hover:text-white transition-colors">
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
