import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { SOCIAL_LINKS, BRAND, getContactHref } from "@/constants";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";

const SOCIAL_ICONS = [Github, Linkedin, Twitter] as const;

const FOOTER_CTA = { main: "LET'S", sub: "TALK." } as const;

interface FooterProps {
  readonly lang: Locale;
}

const Footer = async ({ lang }: FooterProps) => {
  const dict = await getDictionary(lang);
  return (
    <footer className="py-12 md:py-16 lg:py-20 border-t border-white/10 bg-[#020202] relative z-10">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-12">
        <div>
          <h4 className="text-[2.5rem] md:text-[4rem] lg:text-[5rem] xl:text-[7rem] font-bold font-montserrat leading-[0.85] md:leading-[0.8] tracking-tighter mb-6 md:mb-8 heading-decorative hover:text-white transition-colors duration-700 cursor-default">
            {FOOTER_CTA.main}
            <br />
            {FOOTER_CTA.sub}
          </h4>
          <Link
            href={getContactHref(lang)}
            className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-5 py-3 text-xs font-mono uppercase tracking-[0.18em] text-gray-300 transition-all hover:bg-white hover:text-black"
            aria-label={dict.profile.open_contact_form_aria}
          >
            {dict.nav.contact}
          </Link>
        </div>

        <div className="text-left md:text-right w-full md:w-auto">
          <div className="flex gap-3 justify-start md:justify-end mb-6 md:mb-8">
            {SOCIAL_LINKS.map((link, i) => {
              const Icon = SOCIAL_ICONS[i];
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition-all"
                  aria-label={link.ariaLabel}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
          <div className="text-[10px] text-white font-mono flex justify-between md:justify-end gap-4 md:gap-8">
            <span>
              © {BRAND.getCurrentYear()} {BRAND.NAME}
            </span>
            <span>{BRAND.LOCATION}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
