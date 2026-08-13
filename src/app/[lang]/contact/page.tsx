import { ContactForm } from "@/components/contact";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import { getDeveloperSearchMetadata } from "@/lib/metadata/developer-search";
import { buildLocalizedPageMetadata } from "@/lib/metadata/localized-page";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Locale };
  const searchMetadata = getDeveloperSearchMetadata(lang, "contact");

  return buildLocalizedPageMetadata({
    lang,
    path: "/contact",
    title: searchMetadata.title,
    description: searchMetadata.description,
    keywords: searchMetadata.keywords,
    absoluteTitle: true,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const dict = await getDictionary(lang);
  const contactTitleLineBreakIndex = lang === "ko" ? 9 : 21;
  const contactTitleFirstLine = dict.contact.title.slice(
    0,
    contactTitleLineBreakIndex
  );
  const contactTitleSecondLine = dict.contact.title
    .slice(contactTitleLineBreakIndex)
    .trim();

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <section className="flex flex-col justify-between">
            <div>
              <span className="mb-5 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">
                <span className="h-px w-8 bg-gray-700" />
                {dict.contact.eyebrow}
              </span>
              <h1 className="font-montserrat heading-decorative text-4xl font-light leading-[1.08] text-white md:text-5xl md:leading-[1.04] lg:text-6xl lg:leading-[1.02] xl:text-7xl break-keep">
                <span className="block">{contactTitleFirstLine}</span>
                {contactTitleSecondLine ? (
                  <span className="mt-1 block md:mt-2">
                    {contactTitleSecondLine}
                  </span>
                ) : null}
              </h1>
              <p className="mt-6 max-w-xl text-balance text-base font-light leading-relaxed text-gray-400 md:text-lg break-keep">
                {dict.contact.subtitle}
              </p>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm text-gray-400 md:mt-12">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500">
                {dict.contact.response_label}
              </p>
              <p className="mt-2">{dict.contact.response_time}</p>
            </div>
          </section>

          <section aria-label={dict.contact.title}>
            <ContactForm dict={dict.contact} lang={lang} />
          </section>
        </div>
      </div>
    </main>
  );
}
