import { NextRequest, NextResponse } from "next/server";

/**
 * CSP Violation Report Endpoint (Report-Only)
 *
 * Minimal, production-safe handler replacing the old non-functional example.com placeholder.
 *
 * Security & safety properties:
 * - Only processes POST (CSP reports); other methods return 204 (no information leakage)
 * - Enforces body size limit (8KB) to mitigate DoS/abuse
 * - Strict structural validation before any logging
 * - Logs ONLY sanitized metadata: never full URIs (query strings stripped), no script-sample,
 *   no cookies, no headers, no user-identifiable data, no original-policy blob
 * - Returns 204 No Content immediately (standard per CSP spec; no response body)
 * - No external logging, no dashboards, no PII ever persisted in logs
 * - Works for both legacy report-uri (application/csp-report) and modern report-to (application/reports+json)
 *
 * Usage in next.config.ts:
 *   - Add "report-uri /api/csp-report" and "report-to csp-violation" to the policy
 *   - Add Reporting-Endpoints header for modern clients
 */

function sanitizeUri(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) {
    return "[invalid]";
  }
  try {
    // Preserve only origin + pathname. Strip credentials, query, hash, and any potential PII/tokens.
    const url = new URL(value);
    return `${url.origin}${url.pathname}`;
  } catch {
    // Defensive fallback for non-URL values or malformed input
    const withoutQuery = value.split(/[?#]/)[0];
    return withoutQuery.length > 0 ? withoutQuery : "[invalid]";
  }
}

function isPlausibleCspReport(data: unknown): data is Record<string, unknown> {
  if (!data || typeof data !== "object") {
    return false;
  }
  // Legacy format: { "csp-report": { ... } }
  // Modern format: flat object with report fields
  const report = (data as Record<string, unknown>)["csp-report"] ?? data;

  if (!report || typeof report !== "object") {
    return false;
  }

  const r = report as Record<string, unknown>;

  // Require at least one of the core directive fields to be present and string-ish
  const hasDirective =
    typeof r["violated-directive"] === "string" ||
    typeof r["effective-directive"] === "string";

  const hasBlocked =
    typeof r["blocked-uri"] === "string" ||
    typeof r["document-uri"] === "string";

  return hasDirective || hasBlocked;
}

export async function POST(request: NextRequest) {
  try {
    const text = await request.text();

    // Guard against empty or oversized payloads (8KB is generous for CSP reports)
    if (!text || text.length > 8192) {
      return new NextResponse(null, { status: 204 });
    }

    let payload: unknown;
    try {
      payload = JSON.parse(text);
    } catch {
      // Malformed JSON — ignore silently (common with some bots/probes)
      return new NextResponse(null, { status: 204 });
    }

    if (!isPlausibleCspReport(payload)) {
      return new NextResponse(null, { status: 204 });
    }

    const raw = (payload as Record<string, unknown>)["csp-report"] ?? payload;
    const r = raw as Record<string, unknown>;

    // Highly sanitized view — safe for production logs
    const safe = {
      violated: r["violated-directive"] ?? r["effective-directive"],
      blocked: sanitizeUri(r["blocked-uri"]),
      document: sanitizeUri(r["document-uri"]),
      source: sanitizeUri(r["source-file"]),
      line: r["line-number"],
      status: r["status-code"],
      // Deliberately omitted for safety:
      // - "original-policy" (very long, contains full CSP)
      // - "script-sample" (can contain arbitrary code snippets / user input)
      // - any other fields
    };

    // Structured single-line log. Hosting platforms (Vercel, etc.) will surface this.
    // Use warn level so it stands out without being "error".
    console.warn("[CSP-VIOLATION]", JSON.stringify(safe));

    return new NextResponse(null, { status: 204 });
  } catch {
    // Swallow all errors — this endpoint must never surface stack traces or details
    // to clients. Logging here is internal-only.
    return new NextResponse(null, { status: 204 });
  }
}

// Non-POST methods: return 204 to avoid leaking method support information
// (Next.js will auto-405 if these are not defined, but explicit 204 is quieter for probes)
export async function GET() {
  return new NextResponse(null, { status: 204 });
}

export async function HEAD() {
  return new NextResponse(null, { status: 204 });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
