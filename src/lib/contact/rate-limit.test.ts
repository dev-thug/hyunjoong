import assert from "node:assert/strict";
import test from "node:test";
import {
  CONTACT_RATE_LIMIT,
  createContactRateLimiter,
  getContactRequestIdentifier,
} from "./rate-limit";

test("allows requests until the rate limit is reached", () => {
  const rateLimiter = createContactRateLimiter();
  const now = 1000;

  for (let index = 0; index < CONTACT_RATE_LIMIT.maxRequests; index += 1) {
    assert.equal(rateLimiter.isAllowed("127.0.0.1", now), true);
  }

  assert.equal(rateLimiter.isAllowed("127.0.0.1", now), false);
});

test("resets request count after the rate limit window", () => {
  const rateLimiter = createContactRateLimiter();
  const now = 1000;

  for (let index = 0; index < CONTACT_RATE_LIMIT.maxRequests; index += 1) {
    rateLimiter.isAllowed("127.0.0.1", now);
  }

  assert.equal(
    rateLimiter.isAllowed(
      "127.0.0.1",
      now + CONTACT_RATE_LIMIT.windowMs + 1
    ),
    true
  );
});

test("uses forwarded ip before fallback host", () => {
  const headers = new Headers({
    "x-forwarded-for": "203.0.113.10, 70.41.3.18",
    host: "hyunjoong.kim",
  });

  assert.equal(getContactRequestIdentifier(headers), "203.0.113.10");
});

test("falls back to host when forwarded ip is unavailable", () => {
  const headers = new Headers({
    host: "hyunjoong.kim",
  });

  assert.equal(getContactRequestIdentifier(headers), "host:hyunjoong.kim");
});
