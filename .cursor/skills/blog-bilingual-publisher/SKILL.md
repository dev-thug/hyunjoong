---
name: blog-bilingual-publisher
description: Publish one Korean/English blog pair through the tested develop-branch PR workflow.
---

# Bilingual Blog Publisher

Follow `.agent/SKILL.md` as the canonical end-to-end publishing and deployment procedure.

## Authoring Contract

For a slug `<slug>`, always create both:

- `src/content/posts/<slug>.ko.mdx`
- `src/content/posts/<slug>.en.mdx`

Use this metadata shape:

```ts
export const metadata = {
  title: "...",
  excerpt: "...",
  category: "Engineering", // Engineering | Business | Insight
  date: "YYYY-MM-DD",
  readTime: "N min",
  lang: "ko", // en in the English file
  keywords: ["keyword one", "keyword two"],
  hidden: false,
};
```

The pair must use the same `date`, `category`, and `hidden` value. Keywords must be a non-empty array. Titles and excerpts should be written naturally for each locale.

## Content Quality

- Keep the title specific and under 60 characters when practical.
- Keep the excerpt concise and useful in search results.
- Structure the article with descriptive H2/H3 headings.
- Include concrete trade-offs, failure modes, and an actionable checklist.
- Cite primary sources for current external claims.
- Never invent product traction, customer outcomes, benchmarks, or personal achievements.
- Avoid duplicating the title, slug, or main thesis of an existing post.

## Required Gate

Run this exact command before committing:

```bash
npm run verify
```

Do not push directly to `develop` or `main`. Use the branch, pull request, required-check, merge, and live-verification flow in `.agent/SKILL.md`.
