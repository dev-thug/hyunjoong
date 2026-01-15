import { SOCIAL_LINKS, CONTACT_EMAIL, BRAND } from '@/constants';

const Footer = () => {
  const handleKeyDown = (event: React.KeyboardEvent, href: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      window.location.href = href;
    }
  };

  return (
    <footer className="py-12 md:py-16 lg:py-20 border-t border-white/10 bg-[#020202] relative z-10">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-12">
        <div>
          <h4 className="text-[2.5rem] md:text-[4rem] lg:text-[5rem] xl:text-[7rem] font-bold font-montserrat leading-[0.85] md:leading-[0.8] tracking-tighter mb-6 md:mb-8 text-white/20 hover:text-white transition-colors duration-700 cursor-default">
            LET&apos;S<br />TALK.
          </h4>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-base md:text-lg lg:text-xl font-light border-b border-gray-600 pb-1 text-gray-400 hover:text-white hover:border-white transition-all break-all"
            tabIndex={0}
            aria-label="Send email to contact"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <div className="text-left md:text-right w-full md:w-auto">
          <div className="flex gap-4 md:gap-6 lg:gap-8 justify-start md:justify-end mb-6 md:mb-8 text-[10px] font-mono uppercase tracking-widest text-gray-500 flex-wrap">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-white transition-colors"
                tabIndex={0}
                aria-label={link.ariaLabel}
                onKeyDown={(e) => handleKeyDown(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="text-[10px] text-gray-800 font-mono flex justify-between md:justify-end gap-4 md:gap-8">
            <span>© {BRAND.COPYRIGHT_YEAR} {BRAND.NAME}</span>
            <span>{BRAND.LOCATION}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

