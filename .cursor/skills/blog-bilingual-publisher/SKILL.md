---
name: blog-bilingual-publisher
description: Primary trigger is blog-writing intent. Use when asked to write a blog post and publish Korean/English versions in one flow. Typical triggers: "블로그 글 작성해줘", "블로그 포스트 써줘", "한글/영문 버전으로 블로그 올려줘", "블로그 글 작성해서 배포해줘", "write a blog post in Korean and English".
---

# Blog Bilingual Publisher

Create two language versions of one blog post, validate content quality, push to remote, and confirm deployment.

## Required Inputs

Collect only what is necessary:

- Topic and key takeaway
- Target audience (optional)
- Preferred slug (optional; generate if absent)
- Branch preference (default: current branch)

If the user gives sparse input, infer a practical angle and proceed.

## Output Contract

Produce exactly one Korean and one English post with the same slug:

- `src/content/posts/<slug>.ko.mdx`
- `src/content/posts/<slug>.en.mdx`

Each file must include:

- `export const metadata = { ... }`
- `title`, `excerpt`, `category`, `date`, `readTime`, `lang`, `keywords`, `hidden`
- Body content with matching structure and intent across both languages

## Writing Rules

1. Keep meaning parity between Korean and English versions.
2. Localize tone naturally; do not do literal translation.
3. Keep examples and command blocks functionally identical.
4. Use realistic reading time and concise keyword sets.
5. Ensure slug-level consistency for bilingual routing.

## Execution Workflow

1. Inspect existing posts in `src/content/posts/` for style and metadata conventions.
2. Draft Korean post first (`.ko.mdx`), then create English counterpart (`.en.mdx`).
3. Validate content and lint:
   - `npm run content:validate`
   - `npm run lint`
4. If checks fail, fix files and rerun until both pass.
5. Stage all files changed by this task (including skill/config updates if touched).
6. Commit with a why-focused message.
7. Push to the target branch.
8. Confirm deployment/check status and share final URLs.

## Git and Deployment Checks

Use this sequence after writing:

```bash
git status --short
git add src/content/posts/<slug>.ko.mdx src/content/posts/<slug>.en.mdx
# If this task changed skill/config/automation files, stage those too.
# Example:
# git add .agents/skills/blog-bilingual-publisher/SKILL.md .cursor/skills/blog-bilingual-publisher/SKILL.md
git commit -m "publish bilingual post on <topic>"
git push
```

Then verify the latest commit status:

```bash
SHA=$(git rev-parse HEAD)
REMOTE=$(git remote get-url origin)
OWNER_REPO=$(echo "$REMOTE" | sed -E 's#(git@github.com:|https://github.com/)##; s#\.git$##')
gh api "repos/$OWNER_REPO/commits/$SHA/status" --jq '.statuses[] | {context,state,target_url}'
```

If Vercel or CI is pending, wait and re-check once before reporting.

## Final Report Format

Return:

- Created file paths
- Additional changed paths included in commit (if any)
- Validation/lint results
- Commit SHA and branch
- Deployment status
- Live URLs for both locales:
  - `https://hyunjoong.kim/ko/blog/<slug>`
  - `https://hyunjoong.kim/en/blog/<slug>`
