import assert from "node:assert/strict";
import test from "node:test";
import {
  CONTACT_FIELD_LIMITS,
  validateContactPayload,
} from "./validation";

test("accepts valid contact form payloads", () => {
  const result = validateContactPayload({
    name: "김현중",
    contact: "hello@example.com",
    message: "프로젝트 협업 문의를 드리고 싶습니다.",
    company: "",
  });

  assert.equal(result.ok, true);
  if (!result.ok) {
    return;
  }

  assert.deepEqual(result.data, {
    name: "김현중",
    contact: "hello@example.com",
    message: "프로젝트 협업 문의를 드리고 싶습니다.",
    company: "",
  });
});

test("trims input values before returning validated data", () => {
  const result = validateContactPayload({
    name: "  Hyunjoong Kim  ",
    contact: "  +82 10-0000-0000  ",
    message: "  I would like to discuss a new project opportunity.  ",
    company: "",
  });

  assert.equal(result.ok, true);
  if (!result.ok) {
    return;
  }

  assert.equal(result.data.name, "Hyunjoong Kim");
  assert.equal(result.data.contact, "+82 10-0000-0000");
  assert.equal(
    result.data.message,
    "I would like to discuss a new project opportunity."
  );
});

test("returns field errors for missing and too short values", () => {
  const result = validateContactPayload({
    name: "A",
    contact: "",
    message: "short",
    company: "",
  });

  assert.equal(result.ok, false);
  if (result.ok) {
    return;
  }

  assert.deepEqual(result.fieldErrors, {
    name: "이름은 2자 이상 입력해 주세요.",
    contact: "연락처를 입력해 주세요.",
    message: "문의 내용은 10자 이상 입력해 주세요.",
  });
});

test("returns field errors for values over length limits", () => {
  const result = validateContactPayload({
    name: "A".repeat(CONTACT_FIELD_LIMITS.nameMaxLength + 1),
    contact: "a".repeat(CONTACT_FIELD_LIMITS.contactMaxLength + 1),
    message: "a".repeat(CONTACT_FIELD_LIMITS.messageMaxLength + 1),
    company: "",
  });

  assert.equal(result.ok, false);
  if (result.ok) {
    return;
  }

  assert.deepEqual(result.fieldErrors, {
    name: "이름은 80자 이하로 입력해 주세요.",
    contact: "연락처는 120자 이하로 입력해 주세요.",
    message: "문의 내용은 2000자 이하로 입력해 주세요.",
  });
});

test("marks honeypot submissions without treating them as valid messages", () => {
  const result = validateContactPayload({
    name: "Hyunjoong Kim",
    contact: "hello@example.com",
    message: "This message is long enough to pass validation.",
    company: "bot company",
  });

  assert.equal(result.ok, true);
  if (!result.ok) {
    return;
  }

  assert.equal(result.isSpam, true);
});

test("rejects non-object payloads", () => {
  const result = validateContactPayload(null);

  assert.equal(result.ok, false);
  if (result.ok) {
    return;
  }

  assert.deepEqual(result.fieldErrors, {
    name: "이름을 입력해 주세요.",
    contact: "연락처를 입력해 주세요.",
    message: "문의 내용을 입력해 주세요.",
  });
});
