import Link from "@/components/IntentLink";
import { ArrowUpRight } from "lucide-react";

export default function RelatedContent({ title, items }: {
  title: string;
  items: readonly { href: string; title: string; description: string }[];
}) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="related-content-heading" className="mt-12 border-t border-white/10 pt-8">
      <h2 id="related-content-heading" className="mb-5 text-base font-medium text-white">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(item => (
          <Link key={item.href} href={item.href} className="group rounded-xl border border-white/10 p-5 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
            <h3 className="flex items-start justify-between gap-3 text-sm leading-6 text-zinc-200">
              {item.title}<ArrowUpRight size={14} aria-hidden="true" className="mt-1 shrink-0" />
            </h3>
            <p className="mt-2 line-clamp-2 text-xs leading-6 text-zinc-400">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
