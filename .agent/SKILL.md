---
name: blog-autopublisher
description: OpenClaw skill for scheduled autopublishing of the Hyunjoong blog. Use when OpenClaw cron should research AI-related topics, infer the user's current interests from prior conversation context, choose a topic that fits the site's architecture-first tone, draft bilingual MDX, validate the result, and commit/push to `develop` automatically.
---

# Blog Autopublisher

## Goal

Run a scheduled research-to-publish pipeline for `hyunjoong.kim`.

## Trigger

Use this skill from OpenClaw cron when a scheduled job should:

- research AI-related topics
- infer the user's interests from conversation context and recent blog history
- pick one topic that fits the blog's tone
- draft Korean and English MDX posts
- validate the content
- commit and push to `develop`

## Required context

- Work in `/Users/mini/.openclaw/workspace/blog`
- Follow `CLAUDE.md` for repo conventions
- Preserve `export const metadata = { ... }` exactly
- Keep ko/en versions aligned in meaning and section order
- Use recent conversation context as a signal for topic selection

## Cron flow

1. Research current AI topics and practical issues.
2. Read recent conversation context and blog history to infer user interests.
3. Score each candidate against the site's tone and the user's current interests.
4. Select the strongest topic.
5. Draft `.ko.mdx` and `.en.mdx`.
6. Validate metadata, links, and formatting.
7. Commit on `develop` and push.

## Topic rules

Prefer topics that:

- connect AI to developer leverage, architecture, tooling, infra, or automation
- match recurring themes from recent conversation context
- are actionable or opinionated
- can be supported with stable sources or clearly labeled opinion

Avoid topics that are:

- pure hype
- shallow announcement summaries
- speculative without operational value
- outside the blog's scope

## Writing rules

- Start with the bottom line.
- Keep the tone sharp, practical, and calm.
- Avoid generic intros and filler.
- Do not invent facts, metrics, or product behavior.
- Prefer architecture, operations, and decision-making over feature recaps.

## Output shape

For each run, produce:

- one chosen topic
- bilingual MDX drafts
- validation result
- commit/push status
- short summary for the user

## Validation checklist

- both locales exist when needed
- metadata fields are valid and consistent
- slug matches file names
- formatting and internal links are correct
- repo checks pass when available

## Git workflow

- Use `develop`.
- Keep commits focused.
- Push automatically after successful validation.
- If unrelated changes exist, report and stop.

## References

- `references/topic-scorer.md`
- `references/publish-checklist.md`
- `references/user-context.md`
- `references/topic-selection-playbook.md`
