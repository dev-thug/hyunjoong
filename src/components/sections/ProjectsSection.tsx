import ProjectCard from "@/components/ProjectCard";
import { PROJECTS } from "@/constants";

interface ProjectsSectionProps {
  readonly dict: any;
  readonly lang: string;
}

const ProjectsSection = ({ dict, lang }: ProjectsSectionProps) => {
  return (
    <section id="projects" className="py-16 md:py-24 relative z-10">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="mb-12 md:mb-24 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 md:pb-6 gap-2">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-light relative z-10">
            {dict.projects.title}
          </h3>
          <span className="text-[10px] md:text-xs font-mono text-gray-500 relative z-10">
            2023 — 2026
          </span>
        </div>

        <div className="flex flex-col gap-12 md:gap-16 lg:gap-20">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              lang={lang}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
