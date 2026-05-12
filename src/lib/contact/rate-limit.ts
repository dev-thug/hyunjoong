// NOTE: This in-process rate limiter is reset on every serverless cold start.
// On Vercel, replace with Vercel KV / Upstash Redis for an effective distributed counter.
// Tracked as a known-limitation; current implementation provides best-effort throttling
// against bursts within a single warm instance.

export const CONTACT_RATE_LIMIT = {
  maxRequests: 5,
  windowMs: 60 * 60 * 1000,
} as const;

interface RateLimitEntry {
  readonly count: number;
  readonly resetAt: number;
}

export interface ContactRateLimiter {
  readonly isAllowed: (identifier: string, now?: number) => boolean;
}

export const createContactRateLimiter = (): ContactRateLimiter => {
  const entries = new Map<string, RateLimitEntry>();

  const isAllowed = (identifier: string, now = Date.now()): boolean => {
    const entry = entries.get(identifier);

    if (!entry || entry.resetAt <= now) {
      entries.set(identifier, {
        count: 1,
        resetAt: now + CONTACT_RATE_LIMIT.windowMs,
      });
      return true;
    }

    if (entry.count >= CONTACT_RATE_LIMIT.maxRequests) {
      return false;
    }

    entries.set(identifier, {
      count: entry.count + 1,
      resetAt: entry.resetAt,
    });
    return true;
  };

  return { isAllowed };
};

export const getContactRequestIdentifier = (headers: Headers): string => {
  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  if (forwardedFor) {
    return forwardedFor;
  }

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  return `host:${headers.get("host") ?? "unknown"}`;
};

export const contactRateLimiter = createContactRateLimiter();
