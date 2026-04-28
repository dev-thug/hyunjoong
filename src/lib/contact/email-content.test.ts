import assert from "node:assert/strict";
import test from "node:test";
import { buildContactEmailContent } from "./email-content";

test("builds text and html email content from contact payload", () => {
  const result = buildContactEmailContent(
    {
      name: "Hyunjoong Kim",
      contact: "hello@example.com",
      message: "Let's build something useful.",
      company: "",
    },
    new Date("2026-04-28T13:00:00.000Z")
  );

  assert.equal(result.subject, "New contact inquiry from Hyunjoong Kim");
  assert.match(result.text, /Name: Hyunjoong Kim/);
  assert.match(result.text, /Contact: hello@example.com/);
  assert.match(result.text, /Let's build something useful\./);
  assert.match(result.html, /<h1>New contact inquiry<\/h1>/);
});

test("escapes html special characters in email content", () => {
  const result = buildContactEmailContent(
    {
      name: "<script>alert('x')</script>",
      contact: "hello&sales@example.com",
      message: "Can we discuss <b>work</b>?",
      company: "",
    },
    new Date("2026-04-28T13:00:00.000Z")
  );

  assert.equal(
    result.subject,
    "New contact inquiry from <script>alert('x')</script>"
  );
  assert.doesNotMatch(result.html, /<script>/);
  assert.match(result.html, /&lt;script&gt;alert\(&#39;x&#39;\)&lt;\/script&gt;/);
  assert.match(result.html, /hello&amp;sales@example.com/);
  assert.match(result.html, /Can we discuss &lt;b&gt;work&lt;\/b&gt;\?/);
});
