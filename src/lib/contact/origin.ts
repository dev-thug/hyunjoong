export const isAllowedContactOrigin = (
  origin: string | null,
  host: string | null
): boolean => {
  if (!origin || !host) {
    return false;
  }

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
};
