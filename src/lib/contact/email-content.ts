import type { ContactPayload } from "./validation";

export interface ContactEmailContent {
  readonly subject: string;
  readonly text: string;
  readonly html: string;
}

const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

export const buildContactEmailContent = (
  payload: ContactPayload,
  submittedAt: Date = new Date()
): ContactEmailContent => {
  const submittedAtIso = submittedAt.toISOString();

  return {
    subject: `New contact inquiry from ${payload.name}`,
    text: [
      "New contact inquiry",
      "",
      `Name: ${payload.name}`,
      `Contact: ${payload.contact}`,
      `Submitted at: ${submittedAtIso}`,
      "",
      "Message:",
      payload.message,
    ].join("\n"),
    html: [
      "<h1>New contact inquiry</h1>",
      "<dl>",
      `<dt>Name</dt><dd>${escapeHtml(payload.name)}</dd>`,
      `<dt>Contact</dt><dd>${escapeHtml(payload.contact)}</dd>`,
      `<dt>Submitted at</dt><dd>${escapeHtml(submittedAtIso)}</dd>`,
      "</dl>",
      "<h2>Message</h2>",
      `<p>${escapeHtml(payload.message).replace(/\n/g, "<br />")}</p>`,
    ].join(""),
  };
};
