import SpotlightText from '@/components/SpotlightText';
import { BRAND } from '@/constants';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-4 md:px-6 overflow-hidden pt-16 md:pt-20">
      <div className="w-full max-w-[1400px] mx-auto relative h-full flex flex-col justify-between pb-8 md:pb-12">
        {/* Top Meta Info - 데스크톱에서만 표시 */}
        <div className="hidden md:flex justify-between items-start pt-4 opacity-0 mix-blend-difference animate-fade-up delay-1000">
          <span className="text-[10px] font-mono uppercase tracking-widest">
            Est. {BRAND.ESTABLISHED_YEAR}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-right">
            Full-stack Architecture<br />
            Business Intelligence
          </span>
        </div>

        {/* Main Title Area */}
        <div className="relative z-10 flex-grow flex items-center py-8 md:py-0">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -z-10 hidden md:block animate-fade-up delay-0" />

          <h1 className="text-[13vw] md:text-[15vw] font-medium font-montserrat leading-[0.85] md:leading-[0.8] tracking-tighter select-none w-full">
            <div className="flex justify-start animate-reveal delay-200">
              <SpotlightText>BEYOND</SpotlightText>
            </div>
            <div className="flex justify-end pr-[2vw] md:pr-[5vw] animate-reveal delay-500">
              <SpotlightText className="italic font-light">CODE</SpotlightText>
            </div>
          </h1>
        </div>

        {/* Bottom Narrative Block */}
        <div className="flex flex-col gap-4 md:gap-6 md:grid md:grid-cols-12 items-stretch md:items-end relative z-10">
          {/* Manifesto Text */}
          <div className="md:col-span-5 glass-panel p-5 md:p-8 rounded-xl md:rounded-2xl bg-noise backdrop-blur-3xl border border-white/5 hover:border-white/10 transition-colors duration-500 animate-fade-up delay-800">
            <h3 className="text-base md:text-lg font-light mb-3 md:mb-4 text-white font-montserrat">
              The Architect&apos;s Role
            </h3>
            <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed">
              Writing code is the baseline. The real value lies in seeing the system as a living organism—optimizing for liquidity, scalability, and tangible business velocity.
            </p>
          </div>

          {/* Right Side: Status & Scroll */}
          <div className="md:col-span-7 flex flex-col md:flex-row gap-4 md:gap-6 justify-between md:justify-end items-stretch md:items-end animate-fade-up delay-1000">
            {/* Status Pill */}
            <div className="glass-panel px-4 md:px-6 py-3 md:py-4 rounded-full flex items-center justify-center md:justify-start gap-3 md:gap-4 bg-noise border border-white/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-[10px] md:text-[10px] font-mono uppercase tracking-[0.15em] md:tracking-[0.2em] text-gray-300">
                Open for New Ventures
              </span>
            </div>

            {/* Scroll Hint - 데스크톱에서만 */}
            <div className="hidden md:flex flex-col items-center gap-2 text-gray-600 animate-pulse">
              <div className="h-16 w-[1px] bg-gradient-to-b from-transparent to-gray-500" />
              <span className="text-[10px] font-mono uppercase tracking-widest">Scroll</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

