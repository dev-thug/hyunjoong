import { CONTACT_FIELD_LIMITS } from "./field-limits";

export { CONTACT_FIELD_LIMITS };

export interface ContactPayload {
  readonly name: string;
  readonly contact: string;
  readonly message: string;
  readonly company: string;
}

export interface ContactFieldErrors {
  readonly name?: string;
  readonly contact?: string;
  readonly message?: string;
}

export interface ContactValidationMessages {
  readonly name: string;
  readonly nameTooShort: string;
  readonly nameTooLong: string;
  readonly contact: string;
  readonly contactTooShort: string;
  readonly contactTooLong: string;
  readonly message: string;
  readonly messageTooShort: string;
  readonly messageTooLong: string;
}

export type ContactValidationResult =
  | {
      readonly ok: true;
      readonly data: ContactPayload;
      readonly isSpam: boolean;
    }
  | {
      readonly ok: false;
      readonly fieldErrors: ContactFieldErrors;
    };

const DEFAULT_VALIDATION_MESSAGES: ContactValidationMessages = {
  name: "이름을 입력해 주세요.",
  nameTooShort: "이름은 2자 이상 입력해 주세요.",
  nameTooLong: "이름은 80자 이하로 입력해 주세요.",
  contact: "연락처를 입력해 주세요.",
  contactTooShort: "연락처는 3자 이상 입력해 주세요.",
  contactTooLong: "연락처는 120자 이하로 입력해 주세요.",
  message: "문의 내용을 입력해 주세요.",
  messageTooShort: "문의 내용은 10자 이상 입력해 주세요.",
  messageTooLong: "문의 내용은 2000자 이하로 입력해 주세요.",
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const getTrimmedString = (
  payload: Record<string, unknown>,
  key: keyof ContactPayload
): string => {
  const value = payload[key];

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

const validateName = (
  name: string,
  messages: ContactValidationMessages
): string | undefined => {
  if (!name) {
    return messages.name;
  }

  if (name.length < CONTACT_FIELD_LIMITS.nameMinLength) {
    return messages.nameTooShort;
  }

  if (name.length > CONTACT_FIELD_LIMITS.nameMaxLength) {
    return messages.nameTooLong;
  }

  return undefined;
};

const validateContact = (
  contact: string,
  messages: ContactValidationMessages
): string | undefined => {
  if (!contact) {
    return messages.contact;
  }

  if (contact.length < CONTACT_FIELD_LIMITS.contactMinLength) {
    return messages.contactTooShort;
  }

  if (contact.length > CONTACT_FIELD_LIMITS.contactMaxLength) {
    return messages.contactTooLong;
  }

  return undefined;
};

const validateMessage = (
  message: string,
  messages: ContactValidationMessages
): string | undefined => {
  if (!message) {
    return messages.message;
  }

  if (message.length < CONTACT_FIELD_LIMITS.messageMinLength) {
    return messages.messageTooShort;
  }

  if (message.length > CONTACT_FIELD_LIMITS.messageMaxLength) {
    return messages.messageTooLong;
  }

  return undefined;
};

export const validateContactPayload = (
  payload: unknown,
  messages: ContactValidationMessages = DEFAULT_VALIDATION_MESSAGES
): ContactValidationResult => {
  if (!isRecord(payload)) {
    return {
      ok: false,
      fieldErrors: {
        name: messages.name,
        contact: messages.contact,
        message: messages.message,
      },
    };
  }

  const data: ContactPayload = {
    name: getTrimmedString(payload, "name"),
    contact: getTrimmedString(payload, "contact"),
    message: getTrimmedString(payload, "message"),
    company: getTrimmedString(payload, "company"),
  };

  const fieldErrors: ContactFieldErrors = {
    name: validateName(data.name, messages),
    contact: validateContact(data.contact, messages),
    message: validateMessage(data.message, messages),
  };

  const activeFieldErrors = Object.fromEntries(
    Object.entries(fieldErrors).filter(([, error]) => error)
  ) as ContactFieldErrors;

  if (Object.keys(activeFieldErrors).length > 0) {
    return {
      ok: false,
      fieldErrors: activeFieldErrors,
    };
  }

  return {
    ok: true,
    data,
    isSpam: data.company.length > 0,
  };
};
