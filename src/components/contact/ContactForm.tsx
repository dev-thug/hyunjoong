"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CONTACT_FIELD_LIMITS } from "@/lib/contact/field-limits";
import {
  CONTACT_FORM_INITIAL_STATE,
  createContactFieldErrorId,
  getContactFieldAriaDescribedBy,
  type ContactFormField,
  type ContactFormFieldErrors,
  type ContactFormState,
} from "./contact-form-state";

interface ContactDictionary {
  readonly fields: {
    readonly name: string;
    readonly name_placeholder: string;
    readonly contact: string;
    readonly contact_placeholder: string;
    readonly message: string;
    readonly message_placeholder: string;
  };
  readonly validation: {
    readonly name_required: string;
    readonly contact_required: string;
    readonly message_required: string;
  };
  readonly submit: string;
  readonly submitting: string;
  readonly success: string;
  readonly error: string;
  readonly timeout_error: string;
}

interface ContactFormProps {
  readonly dict: ContactDictionary;
  readonly lang: string;
}

interface ContactApiResponse {
  readonly ok: boolean;
  readonly message?: string;
  readonly fieldErrors?: ContactFormFieldErrors;
}

interface ContactFormValues {
  readonly name: string;
  readonly contact: string;
  readonly message: string;
  readonly company: string;
}

const INPUT_CLASS_NAME =
  "min-h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus-visible:border-white/30 focus-visible:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

const TEXTAREA_CLASS_NAME =
  "min-h-40 w-full resize-y rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus-visible:border-white/30 focus-visible:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

const createFieldErrorClassName = (hasError: boolean): string => {
  return hasError ? "mt-2 text-xs text-red-300" : "sr-only";
};

const getTrimmedFormValue = (
  formData: FormData,
  key: keyof ContactFormValues
): string => {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

const getContactFormValues = (form: HTMLFormElement): ContactFormValues => {
  const formData = new FormData(form);

  return {
    name: getTrimmedFormValue(formData, "name"),
    contact: getTrimmedFormValue(formData, "contact"),
    message: getTrimmedFormValue(formData, "message"),
    company: getTrimmedFormValue(formData, "company"),
  };
};

const getRequiredFieldErrors = (
  values: ContactFormValues,
  dict: ContactDictionary
): ContactFormFieldErrors => {
  return {
    name: values.name ? undefined : dict.validation.name_required,
    contact: values.contact ? undefined : dict.validation.contact_required,
    message: values.message ? undefined : dict.validation.message_required,
  };
};

const getActiveFieldErrors = (
  fieldErrors: ContactFormFieldErrors
): ContactFormFieldErrors => {
  return Object.fromEntries(
    Object.entries(fieldErrors).filter(([, error]) => error)
  ) as ContactFormFieldErrors;
};

const ContactForm = ({ dict, lang }: ContactFormProps) => {
  const [formState, setFormState] = useState<ContactFormState>(
    CONTACT_FORM_INITIAL_STATE
  );
  const isSubmitting = formState.status === "submitting";
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const values = getContactFormValues(form);
    const fieldErrors = getActiveFieldErrors(
      getRequiredFieldErrors(values, dict)
    );

    if (Object.keys(fieldErrors).length > 0) {
      setFormState({
        status: "error",
        message: dict.error,
        fieldErrors,
      });
      return;
    }

    setFormState({
      status: "submitting",
      message: "",
      fieldErrors: {},
    });

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, locale: lang }),
        signal: controller.signal,
      });
      const result = (await response.json()) as ContactApiResponse;

      if (!response.ok || !result.ok) {
        setFormState({
          status: "error",
          message: result.message ?? dict.error,
          fieldErrors: result.fieldErrors ?? {},
        });
        return;
      }

      form.reset();
      setFormState({
        status: "success",
        message: dict.success,
        fieldErrors: {},
      });
    } catch (error) {
      const isTimeoutError =
        error instanceof DOMException && error.name === "AbortError";

      setFormState({
        status: "error",
        message: isTimeoutError ? dict.timeout_error : dict.error,
        fieldErrors: {},
      });
    } finally {
      window.clearTimeout(timeoutId);
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  };

  const renderFieldError = (field: ContactFormField) => {
    const error = formState.fieldErrors[field];

    return (
      <p
        id={createContactFieldErrorId(field)}
        className={createFieldErrorClassName(Boolean(error))}
      >
        {error}
      </p>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel bg-noise rounded-3xl border border-white/10 p-4 shadow-2xl shadow-black/20 sm:p-6 lg:p-8"
      noValidate
    >
      <div className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-xs font-mono uppercase tracking-[0.18em] text-gray-400"
          >
            {dict.fields.name}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            minLength={CONTACT_FIELD_LIMITS.nameMinLength}
            maxLength={CONTACT_FIELD_LIMITS.nameMaxLength}
            placeholder={dict.fields.name_placeholder}
            className={INPUT_CLASS_NAME}
            aria-invalid={formState.fieldErrors.name ? "true" : undefined}
            aria-describedby={getContactFieldAriaDescribedBy(
              "name",
              formState.fieldErrors
            )}
            disabled={isSubmitting}
            required
          />
          {renderFieldError("name")}
        </div>

        <div>
          <label
            htmlFor="contact"
            className="mb-2 block text-xs font-mono uppercase tracking-[0.18em] text-gray-400"
          >
            {dict.fields.contact}
          </label>
          <input
            id="contact"
            name="contact"
            type="text"
            autoComplete="on"
            minLength={CONTACT_FIELD_LIMITS.contactMinLength}
            maxLength={CONTACT_FIELD_LIMITS.contactMaxLength}
            placeholder={dict.fields.contact_placeholder}
            className={INPUT_CLASS_NAME}
            aria-invalid={formState.fieldErrors.contact ? "true" : undefined}
            aria-describedby={getContactFieldAriaDescribedBy(
              "contact",
              formState.fieldErrors
            )}
            disabled={isSubmitting}
            required
          />
          {renderFieldError("contact")}
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-xs font-mono uppercase tracking-[0.18em] text-gray-400"
          >
            {dict.fields.message}
          </label>
          <textarea
            id="message"
            name="message"
            minLength={CONTACT_FIELD_LIMITS.messageMinLength}
            maxLength={CONTACT_FIELD_LIMITS.messageMaxLength}
            placeholder={dict.fields.message_placeholder}
            className={TEXTAREA_CLASS_NAME}
            aria-invalid={formState.fieldErrors.message ? "true" : undefined}
            aria-describedby={getContactFieldAriaDescribedBy(
              "message",
              formState.fieldErrors
            )}
            disabled={isSubmitting}
            required
          />
          {renderFieldError("message")}
        </div>

        <div className="hidden">
          <label htmlFor="company" aria-hidden="true">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={`text-sm ${
            formState.status === "success" ? "text-green-300" : "text-gray-400"
          }`}
          aria-live="polite"
        >
          {formState.message}
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-12 rounded-full bg-white px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-900"
        >
          {isSubmitting ? dict.submitting : dict.submit}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
