import ProjectCard from '@/components/ProjectCard';
import { PROJECTS } from '@/constants';

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-16 md:py-24 relative z-10">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="mb-12 md:mb-24 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 md:pb-6 gap-2">
          {/* 배경 텍스트 - 데스크톱에서만 표시 */}
          <h2 className="hidden md:block text-7xl lg:text-9xl xl:text-[12rem] font-thin font-montserrat text-white/5 select-none absolute -translate-y-12 lg:-translate-y-24 -translate-x-6 lg:-translate-x-12 z-0 pointer-events-none">
            WORKS
          </h2>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-light relative z-10">Selected Projects</h3>
          <span className="text-[10px] md:text-xs font-mono text-gray-500 relative z-10">2023 — 2026</span>
        </div>

        <div className="flex flex-col gap-12 md:gap-16 lg:gap-20">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

