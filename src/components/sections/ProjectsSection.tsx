import ProjectCard from '@/components/ProjectCard';
import { PROJECTS } from '@/constants';

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 relative z-10">
      <div className="w-full max-w-[1400px] mx-auto px-6">
        <div className="mb-24 flex items-end justify-between border-b border-white/10 pb-6">
          <h2 className="text-9xl md:text-[12rem] font-thin font-montserrat text-white/5 select-none absolute -translate-y-24 -translate-x-12 z-0 pointer-events-none">
            WORKS
          </h2>
          <h3 className="text-3xl font-light relative z-10">Selected Projects</h3>
          <span className="text-xs font-mono text-gray-500 relative z-10">2023 — 2026</span>
        </div>

        <div className="flex flex-col gap-20">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
