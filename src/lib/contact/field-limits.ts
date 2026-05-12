/**
 * Field-length constraints for the contact form.
 * Imported by both the client form (HTML attributes) and the server validator.
 */
export const CONTACT_FIELD_LIMITS = {
  nameMinLength: 2,
  nameMaxLength: 80,
  contactMinLength: 3,
  contactMaxLength: 120,
  messageMinLength: 10,
  messageMaxLength: 2000,
} as const;
