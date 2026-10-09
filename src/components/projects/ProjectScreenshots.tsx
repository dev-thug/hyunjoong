import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface ProjectScreenshot {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export default function ProjectScreenshots({ images, lang = "ko" }: {
  images: ProjectScreenshot[];
  lang?: "ko" | "en";
}) {
  return (
    <div className={"my-8 grid gap-6 " + (images.length > 1 ? "sm:grid-cols-2" : "grid-cols-1")}>
      {images.map((screenshot) => (
        <figure key={screenshot.src} className="min-w-0">
          <a href={screenshot.src} target="_blank" rel="noopener noreferrer"
            aria-label={screenshot.alt + (lang === "ko" ? " — 원본 보기 (새 탭)" : " — View original (new tab)")}
            className="group relative block overflow-hidden rounded-xl border border-white/10 bg-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
            <Image src={screenshot.src} alt={screenshot.alt} width={screenshot.width} height={screenshot.height}
              sizes={images.length > 1
                ? "(max-width: 639px) 100vw, calc(35ch - 12px)"
                : "(max-width: 640px) 100vw, 70ch"}
              className="block h-auto w-full" />
            <span aria-hidden="true" className="absolute right-3 top-3 rounded-full bg-black/65 p-2 text-white backdrop-blur-sm transition-colors group-hover:bg-black/85">
              <ArrowUpRight size={14} />
            </span>
          </a>
          <figcaption className="mt-3 text-sm leading-6 text-zinc-400">{screenshot.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
