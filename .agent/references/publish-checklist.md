# Publish Checklist

- [ ] Started from a clean, up-to-date `develop` branch
- [ ] Created an `automation/blog-*` branch; no direct production-branch edits
- [ ] Confirmed the slug and thesis do not duplicate existing posts
- [ ] Created both `.ko.mdx` and `.en.mdx`
- [ ] Pair has matching date, category, and visibility
- [ ] Keywords are non-empty arrays
- [ ] MDX sections start at `##`; the route owns the only visible H1
- [ ] Every local `/images/...` reference exists under `public/`
- [ ] Current external claims cite primary sources
- [ ] No fabricated metrics, traction, testimonials, or private operations data
- [ ] `npm run verify` passed locally
- [ ] `git diff --check` passed and the exact diff was reviewed
- [ ] `scripts/assert-pr-ready.sh` returned the current immutable PR head SHA
- [ ] Final PR diff was reviewed before merge
- [ ] Korean and English production URLs returned 200 after Vercel deployment
- [ ] Canonical, hreflang, OG metadata, JSON-LD, sitemap, and visible content were verified live
