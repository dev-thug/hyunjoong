"use client";

import { usePathname, useRouter } from "next/navigation";
import { i18n, type Locale } from "@/i18n-config";
import { Globe } from "lucide-react";

const TARGET_LANGUAGE_LABEL: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
};

interface LanguageSwitcherProps {
  readonly isScrolled?: boolean;
}

const isLocale = (value: string): value is Locale =>
  (i18n.locales as readonly string[]).includes(value);

const LanguageSwitcher = ({ isScrolled = false }: LanguageSwitcherProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const firstSegment = pathname.split("/")[1] ?? "";
  const currentLocale: Locale = isLocale(firstSegment)
    ? firstSegment
    : i18n.defaultLocale;
  const targetLocale: Locale = currentLocale === "ko" ? "en" : "ko";
  const targetLabel = TARGET_LANGUAGE_LABEL[targetLocale];

  const handleLanguageChange = () => {
    const segments = pathname.split("/");
    let newPath: string;
    if (isLocale(segments[1] ?? "")) {
      segments[1] = targetLocale;
      newPath = segments.join("/") || `/${targetLocale}`;
    } else {
      // No locale segment in current path; build a fresh prefixed path.
      const rest = pathname.replace(/^\/+/, "");
      newPath = rest ? `/${targetLocale}/${rest}` : `/${targetLocale}`;
    }

    if (typeof document !== "undefined") {
      document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; samesite=lax`;
    }

    router.push(newPath);
  };

  return (
    <button
      type="button"
      onClick={handleLanguageChange}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 group hover:bg-white/10 ${
        isScrolled ? "text-gray-200" : "text-gray-400"
      } hover:text-white`}
      aria-label={`Switch to ${targetLabel}`}
    >
      <Globe
        size={14}
        className="opacity-60 group-hover:opacity-100 transition-opacity"
      />
      <span className="text-[10px] font-mono tracking-widest uppercase">
        {targetLabel}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
