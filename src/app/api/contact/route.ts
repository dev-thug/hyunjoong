import {
  getContactApiMessages,
  getContactPayloadLocale,
} from "@/lib/contact/api-messages";
import { sendContactEmail } from "@/lib/contact/email";
import { isAllowedContactOrigin } from "@/lib/contact/origin";
import {
  contactRateLimiter,
  getContactRequestIdentifier,
} from "@/lib/contact/rate-limit";
import { validateContactPayload } from "@/lib/contact/validation";
import type { ContactFieldErrors } from "@/lib/contact/validation";

export const runtime = "nodejs";

const MAX_CONTACT_REQUEST_BYTES = 8_192;

interface ContactApiSuccessResponse {
  readonly ok: true;
}

interface ContactApiErrorResponse {
  readonly ok: false;
  readonly message: string;
  readonly fieldErrors?: ContactFieldErrors;
}

type ContactApiResponse = ContactApiSuccessResponse | ContactApiErrorResponse;

const jsonResponse = (
  body: ContactApiResponse,
  init?: ResponseInit
): Response => {
  return Response.json(body, init);
};

const isRequestTooLarge = (request: Request): boolean => {
  const contentLength = request.headers.get("content-length");

  if (!contentLength) {
    return false;
  }

  const parsedContentLength = Number(contentLength);
  return (
    Number.isFinite(parsedContentLength) &&
    parsedContentLength > MAX_CONTACT_REQUEST_BYTES
  );
};

export const POST = async (request: Request): Promise<Response> => {
  if (
    !isAllowedContactOrigin(
      request.headers.get("origin"),
      request.headers.get("host")
    )
  ) {
    return jsonResponse(
      { ok: false, message: getContactApiMessages("ko").forbidden },
      { status: 403 }
    );
  }

  if (isRequestTooLarge(request)) {
    return jsonResponse(
      { ok: false, message: getContactApiMessages("ko").requestTooLarge },
      { status: 413 }
    );
  }

  try {
    const payload = await request.json();
    const locale = getContactPayloadLocale(payload);
    const messages = getContactApiMessages(locale);
    const requestIdentifier = getContactRequestIdentifier(request.headers);

    if (!contactRateLimiter.isAllowed(requestIdentifier)) {
      return jsonResponse(
        { ok: false, message: messages.rateLimited },
        { status: 429, headers: { "Retry-After": "3600" } }
      );
    }

    const validationResult = validateContactPayload(
      payload,
      messages.validation
    );

    if (!validationResult.ok) {
      return jsonResponse(
        {
          ok: false,
          message: messages.invalidInput,
          fieldErrors: validationResult.fieldErrors,
        },
        { status: 400 }
      );
    }

    if (validationResult.isSpam) {
      return jsonResponse({ ok: true });
    }

    await sendContactEmail(validationResult.data);

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error("[contact-form] Failed to process inquiry", error);

    return jsonResponse(
      { ok: false, message: getContactApiMessages("ko").genericError },
      { status: 500 }
    );
  }
};
