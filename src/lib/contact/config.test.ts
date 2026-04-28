import assert from "node:assert/strict";
import test from "node:test";
import { getContactEmailConfig } from "./config";

test("reads contact email configuration from environment values", () => {
  const result = getContactEmailConfig({
    RESEND_API_KEY: "re_test",
    CONTACT_TO_EMAIL: "to@example.com",
    CONTACT_FROM_EMAIL: "Portfolio <contact@example.com>",
  });

  assert.deepEqual(result, {
    resendApiKey: "re_test",
    toEmail: "to@example.com",
    fromEmail: "Portfolio <contact@example.com>",
  });
});

test("throws a generic configuration error when values are missing", () => {
  assert.throws(
    () => getContactEmailConfig({ RESEND_API_KEY: "re_test" }),
    /Missing contact email configuration/
  );
});
