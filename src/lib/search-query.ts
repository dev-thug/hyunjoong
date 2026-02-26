export const parseSearchQuery = (
  value: string | string[] | undefined
): string | undefined => {
  if (Array.isArray(value)) {
    return parseSearchQuery(value[0]);
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
};
