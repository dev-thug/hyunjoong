import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  index: number;
  lang: string;
}

const ProjectCard = ({ project, index, lang }: ProjectCardProps) => {
  return (
    <Link
      href={`/${lang}/projects/${project.slug}`}
      className="group relative w-full border-t border-white/10 pt-6 md:pt-12 pb-12 md:pb-24 transition-all duration-700 hover:border-white/40 block cursor-pointer"
      tabIndex={0}
      aria-label={`View project: ${project.title}`}
    >
      <div className="flex flex-col lg:flex-row gap-6 md:gap-10 lg:gap-16">
        {/* 콘텐츠 영역 */}
        <div className="lg:w-5/12 flex flex-col justify-between order-2 lg:order-1 relative z-10">
          <div>
            {/* 메타 정보 */}
            <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-8">
              <span className="text-[10px] md:text-xs font-mono text-gray-500">
                NO. 0{index + 1}
              </span>
              <div className="h-px w-8 md:w-12 bg-gray-800" />
              <span className="text-[10px] md:text-xs font-mono text-gray-400 uppercase tracking-widest truncate">
                {project.techHighlight}
              </span>
            </div>

            {/* 타이틀 */}
            <h3 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-thin font-montserrat text-white mb-4 md:mb-8 leading-[0.9] md:leading-[0.85] tracking-tighter mix-blend-screen group-hover:mix-blend-normal transition-all duration-500">
              {project.title.split(" ").map((word, i) => (
                <span
                  key={i}
                  className="block group-hover:translate-x-1 md:group-hover:translate-x-2 transition-transform duration-700"
                >
                  {word}
                </span>
              ))}
            </h3>

            {/* 설명 */}
            <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed max-w-sm border-l border-white/10 pl-4 md:pl-6 py-2">
              {project.adCopy}
            </p>
          </div>

          {/* 태그 */}
          <div className="mt-6 md:mt-12 flex flex-wrap gap-2 md:gap-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="glass-panel px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[9px] md:text-[10px] uppercase tracking-widest text-gray-300 hover:text-white transition-colors bg-noise"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 이미지 영역 */}
        <div className="lg:w-7/12 order-1 lg:order-2 relative h-[220px] md:h-[350px] lg:h-[450px] xl:h-[500px] overflow-hidden rounded-lg md:rounded-sm group-hover:rounded-xl md:group-hover:rounded-2xl transition-all duration-700">
          <div className="absolute inset-0 bg-gray-900">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 58vw, 50vw"
              priority={index < 2}
              className="object-cover opacity-100 md:opacity-60 md:grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
            />
          </div>

          {/* Case Study 버튼 - 태블릿 이상에서만 */}
          <div className="hidden md:block absolute top-0 right-0 p-0 overflow-hidden">
            <div className="glass-panel bg-noise border-t-0 border-r-0 border-white/20 rounded-bl-2xl lg:rounded-bl-3xl p-4 lg:p-6 translate-x-full -translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500 delay-100 flex flex-col items-center gap-2">
              <span className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-white writing-vertical">
                Case Study
              </span>
              <div className="bg-white text-black p-2 lg:p-3 rounded-full mt-2">
                <ArrowUpRight size={16} className="lg:w-[18px] lg:h-[18px]" />
              </div>
            </div>
          </div>

          {/* 모바일 Case Study 버튼 */}
          <div className="md:hidden absolute bottom-3 right-3">
            <div className="bg-white text-black p-2 rounded-full">
              <ArrowUpRight size={16} />
            </div>
          </div>

          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
