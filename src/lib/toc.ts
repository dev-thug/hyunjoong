export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

const HEADING_REGEX = /^(#{2,3})\s+(.+?)\s*#*\s*$/;
const FENCE_START_REGEX = /^\s{0,3}(`{3,}|~{3,})/;

const stripMarkdownFromHeadingText = (value: string): string => {
  const withoutImageSyntax = value.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");
  const withoutLinkSyntax = withoutImageSyntax.replace(
    /\[([^\]]+)\]\([^)]+\)/g,
    "$1"
  );
  const withoutInlineCodeSyntax = withoutLinkSyntax.replace(/`([^`]*)`/g, "$1");
  const withoutEmphasisTokens = withoutInlineCodeSyntax.replace(
    /(\*\*|__|\*|_|~~)/g,
    ""
  );
  const withoutHtmlTags = withoutEmphasisTokens.replace(/<\/?[^>]+>/g, "");
  const withoutEscapes = withoutHtmlTags.replace(
    /\\([\\`*_{}\[\]()#+\-.!>~|])/g,
    "$1"
  );

  return withoutEscapes.trim().replace(/\s+/g, " ");
};

export const toHeadingId = (value: string): string => {
  const normalized = value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "section";
};

export const extractTocItems = (source: string): TocItem[] => {
  const lines = source.split(/\r?\n/);
  const tocItems: TocItem[] = [];
  const idCounts = new Map<string, number>();

  let activeFenceMarker: string | null = null;

  for (const line of lines) {
    const fenceMatch = line.match(FENCE_START_REGEX);
    if (fenceMatch) {
      const fenceToken = fenceMatch[1];
      const marker = fenceToken[0];

      if (!activeFenceMarker) {
        activeFenceMarker = marker;
        continue;
      }

      if (activeFenceMarker === marker) {
        activeFenceMarker = null;
        continue;
      }
    }

    if (activeFenceMarker) {
      continue;
    }

    const headingMatch = line.match(HEADING_REGEX);
    if (!headingMatch) {
      continue;
    }

    const level = headingMatch[1].length as 2 | 3;
    const text = stripMarkdownFromHeadingText(headingMatch[2]);
    if (!text) {
      continue;
    }

    const baseId = toHeadingId(text);
    const nextCount = (idCounts.get(baseId) ?? 0) + 1;
    idCounts.set(baseId, nextCount);

    const id = nextCount === 1 ? baseId : `${baseId}-${nextCount}`;
    tocItems.push({ id, text, level });
  }

  return tocItems;
};
