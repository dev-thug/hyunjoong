import "server-only";

import { Resend } from "resend";
import { getContactEmailConfig } from "./config";
import { buildContactEmailContent } from "./email-content";
import type { ContactPayload } from "./validation";

export const sendContactEmail = async (
  payload: ContactPayload
): Promise<void> => {
  const config = getContactEmailConfig();
  const resend = new Resend(config.resendApiKey);
  const emailContent = buildContactEmailContent(payload);

  const { error } = await resend.emails.send({
    from: config.fromEmail,
    to: [config.toEmail],
    subject: emailContent.subject,
    text: emailContent.text,
    html: emailContent.html,
  });

  if (error) {
    throw new Error("Failed to send contact email");
  }
};
