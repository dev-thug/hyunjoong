import type { Metadata } from "next";
import { NOT_FOUND_METADATA_TITLE } from "@/lib/site-config";

export const buildNotFoundMetadata = (): Metadata => ({
  title: NOT_FOUND_METADATA_TITLE,
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: null,
    languages: {},
  },
});
