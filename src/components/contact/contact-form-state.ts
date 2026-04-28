export type ContactFormField = "name" | "contact" | "message";

export interface ContactFormFieldErrors {
  readonly name?: string;
  readonly contact?: string;
  readonly message?: string;
}

export type ContactFormStatus = "idle" | "submitting" | "success" | "error";

export interface ContactFormState {
  readonly status: ContactFormStatus;
  readonly message: string;
  readonly fieldErrors: ContactFormFieldErrors;
}

export const CONTACT_FORM_INITIAL_STATE: ContactFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

export const createContactFieldErrorId = (
  field: ContactFormField
): string => {
  return `contact-${field}-error`;
};

export const getContactFieldAriaDescribedBy = (
  field: ContactFormField,
  fieldErrors: ContactFormFieldErrors
): string | undefined => {
  if (!fieldErrors[field]) {
    return undefined;
  }

  return createContactFieldErrorId(field);
};
