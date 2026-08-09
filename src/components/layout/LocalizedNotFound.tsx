"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { BRAND } from "@/constants/navigation";
import type { Locale } from "@/i18n-config";
import { getLocaleFromPathname } from "@/lib/pathname-locale";

const notFoundCopy = {
  ko: {
    title: "404",
    subtitle: "연결할 수 없는 경로",
    description:
      "요청하신 페이지가 이동되었거나, 현재 아키텍처에 존재하지 않는 리소스입니다.",
    backHome: "홈으로 돌아가기",
  },
  en: {
    title: "404",
    subtitle: "Beyond the Reach",
    description:
      "The page you are looking for has been moved or no longer exists in this architecture.",
    backHome: "Back to Home",
  },
} as const;

interface LocalizedNotFoundProps {
  readonly locale?: Locale;
}

const LocalizedNotFound = ({ locale }: LocalizedNotFoundProps) => {
  const pathname = usePathname();
  const lang = locale ?? getLocaleFromPathname(pathname);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const copy = notFoundCopy[lang];

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black text-white overflow-hidden bg-noise">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
        <div className="mb-12 p-6 rounded-3xl glass-panel animate-fade-up">
          <FileQuestion size={64} className="text-gray-300" strokeWidth={1} />
        </div>

        <div className="space-y-4 mb-12 animate-fade-up delay-200">
          <h1 className="text-[12rem] md:text-[16rem] font-black font-montserrat tracking-tighter opacity-5 leading-none select-none">
            {copy.title}
          </h1>

          <div className="-mt-20 md:-mt-32">
            <h2 className="text-3xl md:text-5xl font-bold font-montserrat tracking-tight mb-6 uppercase">
              {copy.subtitle}
            </h2>
            <p className="text-gray-400 font-inter text-lg md:text-xl leading-relaxed max-w-md mx-auto">
              {copy.description}
            </p>
          </div>
        </div>

        <div className="animate-fade-up delay-400">
          <Link
            href={`/${lang}`}
            className="group relative flex items-center gap-3 px-10 py-5 rounded-full bg-white text-black font-bold text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:bg-transparent hover:text-white border border-white overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <ArrowLeft
                size={18}
                className="transition-transform duration-300 group-hover:-translate-x-2"
              />
              {copy.backHome}
            </span>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-12 left-0 w-full text-center z-10 opacity-20 animate-fade-up delay-600">
        <p className="text-[10px] font-mono tracking-[0.5em] uppercase">
          {`${BRAND.NAME} // ${BRAND.LOCATION}`}
        </p>
      </div>
    </main>
  );
};

export default LocalizedNotFound;
