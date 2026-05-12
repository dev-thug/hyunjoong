import { SITE_NAME } from "@/lib/site-config";

// Escapes `<` to its JSON unicode form so that an inline <script> tag
// embedding this output cannot be terminated by `</script>` inside the
// JSON-LD payload. JSON.stringify by itself does not escape `<`.
export const safeJsonLdStringify = (value: unknown): string =>
  JSON.stringify(value).replace(/</g, "\\u003c");

// Personal blog → both `author` and `publisher` resolve to the same Person.
// Google rejects personal photos as Organization.logo (must be a square brand
// mark on white), so we don't model an Organization until a real logo exists.
export const buildSitePerson = (baseUrl: string) => ({
  "@type": "Person",
  name: SITE_NAME,
  url: baseUrl,
});
