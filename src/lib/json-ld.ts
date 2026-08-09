import { SOCIAL_LINK_MAP } from "@/constants";
import { PUBLIC_PROFILE, getPublicProfile } from "@/data/public-profile";
import type { Locale } from "@/i18n-config";

// Escapes `<` to its JSON unicode form so that an inline <script> tag
// embedding this output cannot be terminated by `</script>` inside the
// JSON-LD payload. JSON.stringify by itself does not escape `<`.
export const safeJsonLdStringify = (value: unknown): string => {
  const serialized = JSON.stringify(value);
  if (serialized === undefined) {
    throw new TypeError("JSON-LD payload must be serializable.");
  }
  return serialized.replace(/</g, "\\u003c");
};

const withoutTrailingSlash = (value: string): string => value.replace(/\/+$/, "");

export const buildSitePerson = (baseUrl: string, lang: Locale = "en") => {
  const normalizedBaseUrl = withoutTrailingSlash(baseUrl);
  const profile = getPublicProfile(lang);

  return {
    "@type": "Person",
    "@id": `${normalizedBaseUrl}/#person`,
    name: profile.name,
    alternateName: profile.alternateName,
    url: normalizedBaseUrl,
    image: `${normalizedBaseUrl}/images/profile-photo.png`,
    jobTitle: profile.jobTitle,
    description: profile.description,
    homeLocation: {
      "@type": "Place",
      name: PUBLIC_PROFILE.location.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: PUBLIC_PROFILE.location.name,
        addressCountry: PUBLIC_PROFILE.location.country,
      },
    },
    knowsAbout: [...PUBLIC_PROFILE.knowsAbout],
    sameAs: [
      SOCIAL_LINK_MAP.github.href,
      SOCIAL_LINK_MAP.linkedin.href,
      SOCIAL_LINK_MAP.x.href,
    ],
  };
};

interface WebsiteSchemaOptions {
  readonly baseUrl: string;
  readonly lang: Locale;
  readonly title: string;
  readonly description: string;
}

export const buildWebsiteSchema = ({
  baseUrl,
  lang,
  title,
  description,
}: WebsiteSchemaOptions) => {
  const normalizedBaseUrl = withoutTrailingSlash(baseUrl);

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${normalizedBaseUrl}/#website`,
    name: title,
    description,
    url: `${normalizedBaseUrl}/${lang}`,
    inLanguage: lang,
    author: { "@id": `${normalizedBaseUrl}/#person` },
    publisher: { "@id": `${normalizedBaseUrl}/#person` },
  };
};

interface BlogSchemaPost {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly date: string;
}

interface BlogSchemaOptions {
  readonly baseUrl: string;
  readonly lang: Locale;
  readonly name: string;
  readonly description: string;
  readonly posts: readonly BlogSchemaPost[];
}

export const buildBlogSchema = ({
  baseUrl,
  lang,
  name,
  description,
  posts,
}: BlogSchemaOptions) => {
  const normalizedBaseUrl = withoutTrailingSlash(baseUrl);
  const blogUrl = `${normalizedBaseUrl}/${lang}/blog`;

  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${blogUrl}#blog`,
    name,
    description,
    url: blogUrl,
    inLanguage: lang,
    author: { "@id": `${normalizedBaseUrl}/#person` },
    publisher: { "@id": `${normalizedBaseUrl}/#person` },
    isPartOf: { "@id": `${normalizedBaseUrl}/#website` },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      inLanguage: lang,
      url: `${blogUrl}/${post.slug}`,
      author: { "@id": `${normalizedBaseUrl}/#person` },
    })),
  };
};
