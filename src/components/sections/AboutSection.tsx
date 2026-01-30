interface AboutSectionProps {
  readonly dict: any;
}

const AboutSection = ({ dict }: AboutSectionProps) => {
  return (
    <section id="about" className="py-16 md:py-32 lg:py-48 relative z-10 border-t border-white/5">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-20">
        <div>
          <span className="block text-[10px] font-mono text-gray-500 tracking-[0.2em] uppercase mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
            <span className="w-6 md:w-8 h-[1px] bg-gray-700" />
            {dict.about.philosophy_label}
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-6xl xl:text-7xl font-light font-montserrat leading-[1.15] md:leading-[1.1]">
            &quot;{dict.about.quote_main} <br className="hidden md:block" />
            <span className="text-gray-600 italic">{dict.about.quote_sub}&quot;</span>
          </h2>
        </div>
        <div className="flex flex-col justify-end pl-0 md:pl-10 lg:pl-20">
          <p className="text-base md:text-lg lg:text-xl text-gray-400 font-light leading-relaxed mb-8 md:mb-12">
            {dict.about.description}
          </p>
          <div className="grid grid-cols-2 gap-6 md:gap-8 lg:gap-12 border-t border-white/10 pt-6 md:pt-8">
            <div>
              <span className="block text-[10px] font-mono text-gray-500 mb-1 md:mb-2 uppercase tracking-wider">
                {dict.about.stack_label}
              </span>
              <span className="text-sm md:text-base lg:text-lg text-white">Next.js / AWS / WebGL</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono text-gray-500 mb-1 md:mb-2 uppercase tracking-wider">
                {dict.about.focus_label}
              </span>
              <span className="text-sm md:text-base lg:text-lg text-white">{dict.about.focus_value}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

