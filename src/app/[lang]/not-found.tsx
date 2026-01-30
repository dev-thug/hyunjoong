import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { getDictionary } from "@/get-dictionary";
import { Locale, i18n } from "@/i18n-config";
import { BRAND } from "@/constants/navigation";
import { headers } from "next/headers";

/**
 * 404 Not Found Page
 * Matches the existing design system (Dark mode, Montserrat/Inter fonts, Lucide icons).
 */
export default async function NotFound() {
  const headersList = await headers();
  //referer를 통해 이전 페이지의 언어를 감지하거나, 요청된 경로에서 언어를 추론합니다.
  const referer = headersList.get("referer") || "";
  
  // URL 경로에서 지원되는 로케일(ko, en 등)을 찾아 언어를 결정합니다.
  let lang: Locale = i18n.defaultLocale;
  const localeInPath = referer.split("/").find(part => 
    (i18n.locales as readonly string[]).includes(part)
  ) as Locale | undefined;
  
  if (localeInPath) {
    lang = localeInPath;
  }

  // getDictionary는 이미 cache() 처리되어 있어 성능 저하 없이 호출 가능합니다.
  const dict = await getDictionary(lang);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black text-white overflow-hidden bg-noise">
      {/* Background decoration - Liquid-like feel */}
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
            {dict.notFound.title}
          </h1>
          
          <div className="-mt-20 md:-mt-32">
            <h2 className="text-3xl md:text-5xl font-bold font-montserrat tracking-tight mb-6 uppercase">
              {dict.notFound.subtitle}
            </h2>
            <p className="text-gray-400 font-inter text-lg md:text-xl leading-relaxed max-w-md mx-auto">
              {dict.notFound.description}
            </p>
          </div>
        </div>

        <div className="animate-fade-up delay-400">
          <Link
            href={`/${lang}`}
            className="group relative flex items-center gap-3 px-10 py-5 rounded-full bg-white text-black font-bold text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:bg-transparent hover:text-white border border-white overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <ArrowLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-2" />
              {dict.notFound.backHome}
            </span>
          </Link>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-12 left-0 w-full text-center z-10 opacity-20 animate-fade-up delay-600">
        <p className="text-[10px] font-mono tracking-[0.5em] uppercase">
          {BRAND.NAME} // {BRAND.LOCATION}
        </p>
      </div>
    </main>
  );
}
