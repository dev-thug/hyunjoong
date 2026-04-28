import type { ContactFieldErrors } from "./validation";

export type ContactApiLocale = "ko" | "en";

export interface ContactApiMessages {
  readonly genericError: string;
  readonly forbidden: string;
  readonly invalidInput: string;
  readonly requestTooLarge: string;
  readonly rateLimited: string;
  readonly validation: Required<ContactFieldErrors> & {
    readonly nameTooShort: string;
    readonly nameTooLong: string;
    readonly contactTooShort: string;
    readonly contactTooLong: string;
    readonly messageTooShort: string;
    readonly messageTooLong: string;
  };
}

const CONTACT_API_MESSAGES: Record<ContactApiLocale, ContactApiMessages> = {
  ko: {
    genericError: "문의 전송 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    forbidden: "허용되지 않은 요청입니다.",
    invalidInput: "입력 값을 다시 확인해 주세요.",
    requestTooLarge: "문의 내용이 너무 큽니다.",
    rateLimited: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
    validation: {
      name: "이름을 입력해 주세요.",
      nameTooShort: "이름은 2자 이상 입력해 주세요.",
      nameTooLong: "이름은 80자 이하로 입력해 주세요.",
      contact: "연락처를 입력해 주세요.",
      contactTooShort: "연락처는 3자 이상 입력해 주세요.",
      contactTooLong: "연락처는 120자 이하로 입력해 주세요.",
      message: "문의 내용을 입력해 주세요.",
      messageTooShort: "문의 내용은 10자 이상 입력해 주세요.",
      messageTooLong: "문의 내용은 2000자 이하로 입력해 주세요.",
    },
  },
  en: {
    genericError:
      "Something went wrong while sending your inquiry. Please try again soon.",
    forbidden: "This request is not allowed.",
    invalidInput: "Please check your input and try again.",
    requestTooLarge: "Your inquiry is too large.",
    rateLimited: "Too many requests. Please try again later.",
    validation: {
      name: "Please enter your name.",
      nameTooShort: "Please enter at least 2 characters for your name.",
      nameTooLong: "Please enter 80 characters or fewer for your name.",
      contact: "Please enter your contact details.",
      contactTooShort: "Please enter at least 3 characters for contact details.",
      contactTooLong: "Please enter 120 characters or fewer for contact details.",
      message: "Please enter your message.",
      messageTooShort: "Please enter at least 10 characters for your message.",
      messageTooLong: "Please enter 2000 characters or fewer for your message.",
    },
  },
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

export const getContactApiMessages = (
  locale: ContactApiLocale
): ContactApiMessages => {
  return CONTACT_API_MESSAGES[locale];
};

export const getContactPayloadLocale = (payload: unknown): ContactApiLocale => {
  if (!isRecord(payload)) {
    return "ko";
  }

  return payload.locale === "en" ? "en" : "ko";
};
