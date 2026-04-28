import assert from "node:assert/strict";
import test from "node:test";
import { getContactApiMessages, getContactPayloadLocale } from "./api-messages";

test("returns Korean API messages by default", () => {
  assert.equal(
    getContactApiMessages("ko").genericError,
    "문의 전송 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
  );
});

test("returns English API messages for English payload locale", () => {
  assert.equal(
    getContactApiMessages("en").genericError,
    "Something went wrong while sending your inquiry. Please try again soon."
  );
});

test("extracts supported locale from payloads", () => {
  assert.equal(getContactPayloadLocale({ locale: "en" }), "en");
  assert.equal(getContactPayloadLocale({ locale: "ko" }), "ko");
  assert.equal(getContactPayloadLocale({ locale: "ja" }), "ko");
  assert.equal(getContactPayloadLocale(null), "ko");
});
