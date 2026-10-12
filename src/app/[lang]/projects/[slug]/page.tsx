import RelatedContent from "@/components/layout/RelatedContent";
import { getRelatedPostsForProject } from "@/lib/related-content";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Link from "next/link";
import Image from "next/image";
import { extractTocItems } from "@/lib/toc";
import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getProjectSourceBySlug,
  getAllProjects,
  generateProjectParams,
  getAvailableProjectLocales,
} from "@/lib/projects";
import { getDictionary } from "@/get-dictionary";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import type { Locale } from "@/i18n-config";
import { buildContentDetailMetadata } from "@/lib/metadata/content-detail";
import { buildNotFoundMetadata } from "@/lib/metadata/not-found";
import { loadRequiredContent } from "@/lib/required-content";
import { getSiteBaseUrl, toAbsoluteSiteUrl } from "@/lib/site-config";
import { buildSitePerson, safeJsonLdStringify } from "@/lib/json-ld";

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
  const { slug, lang } = (await params) as { slug: string; lang: Locale };
  const [project, availableLocales] = await Promise.all([
    getProjectBySlug(slug, lang),
    getAvailableProjectLocales(slug),
  ]);
  const hasKo = availableLocales.includes("ko");
  const hasEn = availableLocales.includes("en");

  if (!project) {
    return buildNotFoundMetadata();
  }

  return buildContentDetailMetadata({
    lang,
    canonicalLang: lang,
    slug,
    section: "projects",
    title: project.title,
    description: project.description || project.adCopy,
    availableLocales: { ko: hasKo, en: hasEn },
    image: project.image,
  });
}

/**
 * 프로젝트 상세 페이지
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { lang, slug } = (await params) as { lang: Locale; slug: string };
  const [project, dict] = await Promise.all([
    getProjectBySlug(slug, lang),
    getDictionary(lang),
  ]);

  if (!project) {
    notFound();
  }

  // Defer prev/next list fetch until after the 404 guard so missing pages
  // don't pay for reading every project MDX file.
  const [allProjects, source, relatedPosts] = await Promise.all([
    getAllProjects(lang),
    getProjectSourceBySlug(slug, lang),
    getRelatedPostsForProject(slug, lang),
  ]);
  const sections = source ? extractTocItems(source).filter((item) => item.level === 2) : [];

  const baseUrl = getSiteBaseUrl();
  const projectUrl = `${baseUrl}/${lang}/projects/${slug}`;
  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description || project.adCopy,
    url: projectUrl,
    image: toAbsoluteSiteUrl(project.image),
    inLanguage: lang,
    mainEntityOfPage: projectUrl,
    ...(project.updatedAt ? { dateModified: project.updatedAt } : {}),
    creator: buildSitePerson(baseUrl, lang),
    isPartOf: { "@id": `${baseUrl}/#website` },
    ...(project.serviceUrl ? { sameAs: [project.serviceUrl] } : {}),
    ...(project.tags.length > 0 ? { keywords: project.tags.join(", ") } : {}),
  };
  const projectJsonLdScript = safeJsonLdStringify(projectJsonLd);

  // 모든 프로젝트를 가져와서 이전/다음 프로젝트 찾기
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  // MDX 콘텐츠는 필수입니다. import/compile 실패 시 shell 200으로 축소하지 않고 fail-closed 처리합니다.
  const mdxModule = await loadRequiredContent(
    `${slug}.${lang}.mdx`,
    () => import(`@/content/projects/${slug}.${lang}.mdx`)
  );
  const ProjectContent = mdxModule.default;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: projectJsonLdScript }}
      />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl pb-8">
        <Breadcrumbs lang={lang} items={[{ name: lang === "ko" ? "홈" : "Home", path: "/" + lang }, { name: dict.nav.projects, path: "/" + lang + "/projects" }, { name: project.title, path: "/" + lang + "/projects/" + slug }]} />

        <header className="grid items-center gap-8 border-b border-white/10 pb-10 md:gap-12 md:pb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <p className="mb-3 text-xs leading-6 tracking-wide text-zinc-400">{project.highlight}</p>
            <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-6 text-zinc-400">
              <Link href={"/" + lang + "/profile"} className="rounded hover:text-white focus-visible:ring-2 focus-visible:ring-white/40">{projectJsonLd.creator.name}</Link>
              {project.updatedAt && <time dateTime={project.updatedAt}>{lang === "ko" ? "업데이트 " : "Updated "}{project.updatedAt}</time>}
            </div>
            <h1 className="break-keep text-balance font-montserrat text-3xl font-medium leading-[1.2] tracking-tight text-white sm:text-4xl xl:text-5xl">
              {project.title}
            </h1>
            <p className="mt-5 max-w-xl break-keep text-base leading-8 text-zinc-300 md:text-lg">{project.adCopy}</p>
            {project.serviceUrl && (
              <a
                href={project.serviceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex min-h-11 items-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label={dict.projects.visit_service_aria.replace("{title}", project.title)}
              >
                {dict.projects.visit_service}
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            )}
            {(project.slug === "petty" || project.slug === "mamma") && (
<div className="mt-4 flex flex-wrap gap-3">
<a href={project.slug === "mamma" ? "https://apps.apple.com/kr/app/id6760751452" : "https://apps.apple.com/kr/app/id6811251214"} target="_blank" rel="noopener noreferrer" style={{ color: "#111827", backgroundColor: "#f8fafc", textDecoration: "none" }} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-white/20 px-4 py-3 font-semibold shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><svg width="26" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.05 12.54c.03 3.2 2.8 4.27 2.83 4.28-.02.08-.44 1.52-1.46 3.01-.88 1.29-1.8 2.58-3.24 2.61-1.41.03-1.87-.84-3.49-.84-1.61 0-2.12.81-3.46.87-1.39.05-2.45-1.4-3.34-2.68-1.81-2.62-3.19-7.4-1.33-10.63.92-1.6 2.57-2.61 4.36-2.64 1.36-.03 2.65.92 3.49.92.83 0 2.4-1.14 4.04-.97.69.03 2.62.28 3.86 2.1-.1.06-2.3 1.34-2.26 3.97ZM14.38 4.74c.74-.9 1.24-2.15 1.1-3.4-1.07.04-2.37.71-3.14 1.61-.69.8-1.3 2.09-1.14 3.32 1.2.09 2.43-.61 3.18-1.53Z" /></svg><span>{lang === "ko" ? "App Store 다운로드" : "App Store"}</span></a>
<a href={project.slug === "mamma" ? "https://play.google.com/store/apps/details?id=im.mamma.app" : "https://play.google.com/store/apps/details?id=im.petty.app"} target="_blank" rel="noopener noreferrer" style={{ color: "#111827", backgroundColor: "#dcfce7", textDecoration: "none" }} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-white/20 px-4 py-3 font-semibold shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><svg width="26" height="28" viewBox="0 0 24 26" aria-hidden="true"><path fill="#4285F4" d="M2 1 14 13 2 25Z"/><path fill="#34A853" d="m2 1 15 8-3 4Z"/><path fill="#FBBC04" d="m17 9 5 3q2 1 0 2l-5 3-3-4Z"/><path fill="#EA4335" d="m2 25 12-12 3 4Z"/></svg><span>{lang === "ko" ? "Google Play 다운로드" : "Google Play"}</span></a>
</div>
            )}
          </div>
          <div className="relative  w-full self-start overflow-hidden rounded-xl border border-white/10 bg-zinc-950 lg:self-center" style={{ aspectRatio: project.slug === "genomic-prediction-app" ? "1440 / 804" : "16 / 10" }}>
            <Image
              src={project.image}
              alt={lang === "ko" ? `${project.title} 프로젝트 대표 이미지` : `Cover illustration for ${project.title}`}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 560px"
              className={"object-cover " + ""}
            />
          </div>
        </header>

        <div className="grid gap-10 pt-10 md:pt-14 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14 xl:gap-20">
          <aside className="min-w-0" aria-label={lang === "ko" ? "프로젝트 정보와 목차" : "Project information and contents"}>
            <div className="space-y-8 lg:sticky lg:top-28 lg:max-h-[calc(100svh-8rem)] lg:overflow-y-auto lg:pr-2">
              {sections.length > 0 && (
                <nav aria-label={lang === "ko" ? "본문 목차" : "On this page"}>
                  <h2 className="mb-4 text-sm font-medium text-white">{lang === "ko" ? "이 프로젝트 이야기" : "In this project"}</h2>
                  <ol className="flex gap-x-5 overflow-x-auto pb-2 lg:block lg:space-y-3 lg:overflow-visible lg:pb-0">
                    {sections.map((section) => (
                      <li key={section.id} className="shrink-0">
                        <a href={`#${section.id}`} className="block whitespace-nowrap rounded text-sm leading-6 text-zinc-400 lg:whitespace-normal transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">{section.text}</a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
              <dl className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6 lg:grid-cols-1">
                {project.metrics.map((metric) => (
                  <div key={metric.label}>
                    <dt className="text-xs leading-5 text-zinc-400">{metric.label}</dt>
                    <dd className="mt-1 text-sm font-medium leading-6 text-zinc-200">{metric.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="border-t border-white/10 pt-6">
                <h2 className="mb-3 text-xs text-zinc-400">{lang === "ko" ? "사용 기술" : "Built with"}</h2>
                <ul className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li key={tag} className="rounded-md border border-white/10 px-2 py-1 text-xs leading-5 text-zinc-400">{tag}</li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          <div className="min-w-0 max-w-[70ch]">
            <section aria-labelledby="overview-heading" className="mb-10 border-b border-white/10 pb-8">
              <h2 id="overview-heading" className="mb-4 text-sm font-medium text-zinc-400">{dict.projects.overview_heading}</h2>
              <p className="break-keep text-lg leading-8 text-zinc-200 md:text-xl md:leading-9">{project.description}</p>
            </section>
            <section className="prose-custom project-prose" aria-label={lang === "ko" ? "프로젝트 상세 문서" : "Detailed project documentation"}>
              <ProjectContent />
            </section>
            <RelatedContent title={lang === "ko" ? "관련 기술 글" : "Related engineering notes"}
              items={relatedPosts.map(post => ({ href: "/" + post.lang + "/blog/" + post.slug, title: post.title, description: post.excerpt }))} />
          </div>
        </div>

      {/* 네비게이션 */}
      <nav
        className="mt-16 pt-8 border-t border-gray-800"
        aria-label={lang === "ko" ? "프로젝트 탐색" : "Project navigation"}
      >
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          {prevProject ? (
            <Link
              href={`/${lang}/projects/${prevProject.slug}`}
              className="group flex-1 p-4 rounded-lg border border-gray-800 hover:border-gray-700 focus-visible:ring-2 focus-visible:ring-white/20 outline-none transition-colors duration-200"
              aria-label={`${dict.projects.previous}: ${prevProject.title}`}
            >
              <span className="text-xs text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <ArrowLeft size={12} aria-hidden="true" />
                {dict.projects.previous}
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
              aria-label={`${dict.projects.next}: ${nextProject.title}`}
            >
              <span className="text-xs text-gray-400 uppercase tracking-widest flex items-center justify-end gap-2">
                {dict.projects.next}
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
      </main>
    </>
  );
}
