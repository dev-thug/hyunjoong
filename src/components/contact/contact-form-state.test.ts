import assert from "node:assert/strict";
import test from "node:test";
import {
  CONTACT_FORM_INITIAL_STATE,
  createContactFieldErrorId,
  getContactFieldAriaDescribedBy,
} from "./contact-form-state";

test("starts with an idle contact form state", () => {
  assert.deepEqual(CONTACT_FORM_INITIAL_STATE, {
    status: "idle",
    message: "",
    fieldErrors: {},
  });
});

test("builds stable field error ids", () => {
  assert.equal(createContactFieldErrorId("name"), "contact-name-error");
  assert.equal(createContactFieldErrorId("contact"), "contact-contact-error");
  assert.equal(createContactFieldErrorId("message"), "contact-message-error");
});

test("returns aria-describedby only when a field has an error", () => {
  assert.equal(
    getContactFieldAriaDescribedBy("name", { name: "Required" }),
    "contact-name-error"
  );
  assert.equal(getContactFieldAriaDescribedBy("name", {}), undefined);
});
