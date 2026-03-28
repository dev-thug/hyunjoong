---
name: blog-autopublisher
description: OpenClaw skill for the Hyunjoong blog that automatically scouts AI topics, chooses a post aligned with the site's architecture-first tone, drafts bilingual MDX, validates it, and commits/pushes to the blog repo on the `develop` branch when publishing is requested or scheduled.
---

# Blog Autopublisher

## Goal

Turn daily AI-topic scouting into publish-ready blog posts for `hyunjoong.kim`.

## Working mode

Use this skill when the user wants the blog to run as an automated publishing pipeline:

- scout AI-related topics daily
- select a topic that fits the site's tone
- draft Korean and English posts
- validate the post against repo conventions
- commit and push to `develop`

## Required context

- Work in `/Users/mini/.openclaw/workspace/blog`
- Use the existing `CLAUDE.md` conventions as the source of truth for content structure
- Preserve the repo's MDX metadata format: `export const metadata = { ... }`
- Keep Korean and English versions aligned in meaning and section order

## Daily autopublish flow

1. Gather recent AI topics worth writing about.
2. Filter for topics that are:
   - relevant to developer productivity, architecture, tooling, infra, or agent workflows
   - actionable or opinionated rather than news-only
   - a fit for the site's direct, engineering-minded tone
3. Choose one topic with the strongest fit.
4. Draft the post in Korean first, then draft the English version.
5. Keep claims grounded in sources or clearly label opinion.
6. Validate the files.
7. If publish mode is enabled, commit on `develop` and push.

## Topic selection rules

Prefer topics that:

- explain a system, workflow, or tradeoff
- help developers make decisions
- connect AI to architecture, automation, or leverage
- can be supported with official docs or stable references

Avoid topics that are:

- pure product hype
- shallow announcement summaries
- overly speculative without operational value
- unrelated to the blog's existing focus

## Writing rules

- Lead with the bottom line.
- Use concise sections and concrete examples.
- Keep the tone sharp, practical, and calm.
- Do not pad with generic intros.
- Do not fabricate facts, metrics, or product behavior.
- Prefer architecture, operations, and decision-making over raw feature recaps.

## Draft structure

For each post, aim for:

- title
- excerpt
- clear category
- publish date
- read time estimate
- keywords
- short intro
- body sections with practical takeaways
- conclusion with an opinionated recommendation

## Validation checklist

Before publishing:

- confirm both `.ko.mdx` and `.en.mdx` exist when bilingual output is intended
- verify metadata fields are valid and consistent
- ensure the slug matches file names
- check formatting and internal links
- run repo checks if needed (`npm run lint`, `npm run build` when appropriate)

## Git workflow

- Use `develop` as the publish branch.
- Keep commits focused.
- Push only when the user explicitly asked for autopublish or scheduling.
- If the repo is dirty with unrelated changes, stop and report it.

## When to use references

Add `references/` files for reusable guidance such as:

- topic scoring rubric
- bilingual post template
- sources policy
- validation and publish checklist

