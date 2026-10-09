import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { buildBreadcrumbSchema, safeJsonLdStringify, type BreadcrumbItem } from "@/lib/json-ld";
import { getSiteBaseUrl } from "@/lib/site-config";

export default function Breadcrumbs({ items, lang }: { items: readonly BreadcrumbItem[]; lang: string }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(buildBreadcrumbSchema(getSiteBaseUrl(), items)) }} />
      <nav aria-label={lang === "ko" ? "현재 위치" : "Breadcrumb"} className="mb-6 text-xs text-zinc-400">
        <ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((item, index) => (
            <li key={item.path} className="flex min-w-0 items-center gap-2">
              {index > 0 && <ChevronRight size={12} aria-hidden="true" className="shrink-0 text-zinc-600" />}
              {index === items.length - 1 ? (
                <span aria-current="page" className="max-w-[38ch] truncate text-zinc-400">{item.name}</span>
              ) : (
                <Link prefetch={false} href={item.path} className="inline-flex min-h-8 items-center rounded hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">{item.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
