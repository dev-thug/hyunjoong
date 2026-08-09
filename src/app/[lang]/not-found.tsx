import LocalizedNotFound from "@/components/layout/LocalizedNotFound";

/**
 * Static 404 boundary. Locale-specific copy is selected from the pathname in
 * the client boundary so this route never opts the localized homepage into
 * request-time rendering.
 */
export default function NotFound() {
  return <LocalizedNotFound />;
}
