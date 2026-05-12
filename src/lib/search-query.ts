// Hard cap on parsed search queries. Anything longer is unlikely to be a
// real query and bloats downstream cache keys / URL params. Truncated
// after trim+normalization.
const MAX_QUERY_LENGTH = 200;

export const parseSearchQuery = (
  value: string | string[] | undefined
): string | undefined => {
  if (Array.isArray(value)) {
    return parseSearchQuery(value[0]);
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim().slice(0, MAX_QUERY_LENGTH);
  return normalized.length > 0 ? normalized : undefined;
};
