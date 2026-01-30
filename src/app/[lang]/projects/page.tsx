import Link from "next/link";
import { PROJECTS } from "@/constants";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Kim Hyun-joong",
  description:
    "Selected projects showcasing full-stack development, serverless architecture, and business impact.",
};

/**
 * 프로젝트 목록 페이지
 */
export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <div>
      {/* 헤더 */}
      <div className="mb-16 pt-8">
        <h1 className="text-6xl md:text-8xl font-thin font-montserrat text-white/10 select-none">
          WORKS
        </h1>
        <p className="text-gray-400 mt-4 text-lg">
          Selected projects showcasing technical excellence and business impact.
        </p>
      </div>

      {/* 프로젝트 목록 */}
      <div className="space-y-8">
        {PROJECTS.map((project, idx) => (
          <Link
            key={project.id}
            href={`/${lang}/projects/${project.slug}`}
            className="group block p-8 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-300"
            tabIndex={0}
            aria-label={`View project: ${project.title}`}
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* 이미지 */}
              <div className="md:w-1/3 aspect-video rounded-lg overflow-hidden bg-gray-900">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-100 md:grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
              </div>

              {/* 콘텐츠 */}
              <div className="md:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs font-mono text-gray-600">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                      {project.techHighlight}
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
                    View Project
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
      </div>
    </div>
  );
}
