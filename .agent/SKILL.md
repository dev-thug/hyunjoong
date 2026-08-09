---
name: portfolio-blog-autopublisher
description: Research, publish, test, and deploy one evidence-led bilingual portfolio blog post.
---

# Portfolio Blog Autopublisher

Use this workflow when autonomously maintaining the blog in this repository.

## Safety Boundary

- `develop` is the Vercel production branch.
- Never commit or push unverified changes directly to `develop`.
- Work on `automation/blog-YYYY-MM-DD-<slug>`, open a pull request, and merge only after all required checks pass and the final diff is reviewed.
- If sources are weak, a topic duplicates existing content, or any gate fails, stop without publishing.
- Never fabricate customers, revenue, conversion, performance, testimonials, or product status.

## Inputs

Read these files before selecting a topic:

1. `CLAUDE.md`
2. `USER.md`
3. `.agent/references/topic-selection-playbook.md`
4. `.agent/references/publish-checklist.md`
5. `src/content/posts/`

Treat `USER.md` as the public-profile source of truth. Verify time-sensitive external claims against current primary sources.

## Workflow

### 1. Start from production

```bash
git switch develop
git pull --ff-only origin develop
git status --short
git switch -c automation/blog-YYYY-MM-DD-<slug>
```

Stop if the working tree was not clean before creating the branch.

### 2. Select a topic

- Compare the candidate against every existing post title and slug.
- Prefer a concrete operational lesson connected to AI agents, SDLC documentation, product validation, serverless architecture, or test automation.
- Use the rubric in `.agent/references/topic-selection-playbook.md`.
- Require one first-party or primary source for every current external claim.
- A valid maintenance run may publish nothing.

### 3. Create one bilingual pair

Create both files with the same slug:

- `src/content/posts/<slug>.ko.mdx`
- `src/content/posts/<slug>.en.mdx`

Both metadata objects must have the same:

- `date`
- `category`
- `hidden`

`keywords` must be an array. The Korean and English articles must be natural localized writing, not literal machine translation. Do not add claims that are unsupported by a cited source or `USER.md`.

### 4. Validate locally

```bash
npm ci
npm run verify
```

`npm run verify` must pass all unit tests, strict content validation, bilingual automation policy, lint, production dependency audit, and the production build.

### 5. Review the exact diff

```bash
git diff --check
git diff --stat
git diff -- src/content/posts package.json .github
```

Confirm that the change contains no secrets, private operations data, unrelated files, or unsupported metrics.

### 6. Publish through a PR

```bash
git add -- src/content/posts/<slug>.ko.mdx src/content/posts/<slug>.en.mdx
git commit -m "content: publish <topic>"
git push -u origin HEAD
gh pr create --base develop --fill
```

Review the final PR diff, then let the repository script bind the checks to the
exact immutable PR head SHA. Never use `--admin` or merge on a plain watch exit.

```bash
PR_NUMBER="$(gh pr view --json number --jq '.number')"
gh pr diff --color=never
HEAD_SHA="$(scripts/assert-pr-ready.sh "$PR_NUMBER")"
gh pr merge "$PR_NUMBER" --squash --delete-branch --match-head-commit "$HEAD_SHA"
```

If branch protection is unavailable, this script remains mandatory and an
empty or missing `Verify production build` check fails closed.

### 7. Verify production

Wait for the Vercel deployment associated with the merged commit, then verify:

- `https://hyunjoong.kim/ko/blog/<slug>` returns 200
- `https://hyunjoong.kim/en/blog/<slug>` returns 200
- canonical and hreflang values are correct
- title, description, OG image, `BlogPosting` JSON-LD, and visible article content match
- `robots.txt` and `sitemap.xml` remain valid

Report the PR URL, merged commit, production URLs, and real verification results. Do not claim publication if the live pages were not fetched successfully.
