const AboutSection = () => {
  return (
    <section id="about" className="py-32 md:py-48 relative z-10 border-t border-white/5">
      <div className="w-full max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <span className="block text-[10px] font-mono text-gray-500 tracking-[0.2em] uppercase mb-8 flex items-center gap-4">
            <span className="w-8 h-[1px] bg-gray-700" />
            The Philosophy
          </span>
          <h2 className="text-4xl md:text-7xl font-light font-montserrat leading-[1.1]">
            &quot;I don&apos;t just build software. <br />
            <span className="text-gray-600 italic">I build leverage.&quot;</span>
          </h2>
        </div>
        <div className="flex flex-col justify-end pl-0 md:pl-20">
          <p className="text-xl text-gray-400 font-light leading-relaxed mb-12">
            In an era where AI writes code, the value of an engineer shifts from execution to architecture.
            I specialize in high-impact, serverless infrastructures that scale without the overhead.
          </p>
          <div className="grid grid-cols-2 gap-12 border-t border-white/10 pt-8">
            <div>
              <span className="block text-[10px] font-mono text-gray-500 mb-2 uppercase tracking-wider">
                Core Stack
              </span>
              <span className="text-lg text-white">Next.js / AWS / WebGL</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono text-gray-500 mb-2 uppercase tracking-wider">
                Focus
              </span>
              <span className="text-lg text-white">Performance / Conversion</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
