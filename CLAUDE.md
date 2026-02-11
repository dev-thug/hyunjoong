# CLAUDE.md

This file provides guidance for AI assistants working with the **hyunjoong.kim** codebase — a personal portfolio and tech blog built with Next.js.

## Project Overview

A bilingual (Korean/English) personal portfolio site and tech blog for Hyunjoong Kim. Content is authored in MDX, deployed on Vercel, and uses route-based i18n with Korean as the default locale.

- **Live site:** https://hyunjoong.kim
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (dark theme only)
- **Content:** MDX files with inline metadata exports
- **Deployment:** Vercel (automatic from git)

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build (static generation + ISR)
npm run start    # Start production server
npm run lint     # ESLint with next/core-web-vitals + next/typescript
```

There is no test framework configured. No `npm test` command exists.

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── [lang]/                 # Dynamic i18n routing (ko, en)
│   │   ├── layout.tsx          # Root layout with fonts, metadata, nav
│   │   ├── page.tsx            # Home page
│   │   ├── blog/               # Blog listing + [slug] detail pages
│   │   ├── projects/           # Project listing + [slug] detail pages
│   │   └── profile/            # Profile/about page
│   ├── globals.css             # Global styles, animations, highlight.js theme
│   ├── robots.ts               # Dynamic robots.txt generation
│   └── sitemap.ts              # Dynamic XML sitemap generation
├── components/
│   ├── layout/                 # Navigation, Footer, LanguageSwitcher
│   ├── sections/               # HeroSection, AboutSection, BlogSection, ProjectsSection
│   └── mdx/                    # CodeBlock, BlogImage, ImageGallery, Giscus
├── content/
│   ├── posts/                  # Blog posts as MDX ({slug}.{lang}.mdx)
│   └── projects/               # Project pages as MDX ({slug}.{lang}.mdx)
├── constants/                  # Navigation links, social links, brand info
├── dictionaries/               # i18n translations (ko.json, en.json)
├── lib/                        # Utility functions (posts.ts, projects.ts)
├── types/                      # TypeScript type definitions
├── i18n-config.ts              # Locale config: { defaultLocale: 'ko', locales: ['ko', 'en'] }
├── get-dictionary.ts           # Server-side dictionary loader
└── mdx-components.tsx          # Custom MDX component mappings
```

## Key Architecture Decisions

### i18n (Internationalization)

All routes are nested under `[lang]/` (e.g., `/ko/blog/...`, `/en/blog/...`). The default locale is Korean (`ko`). Supported locales are defined in `src/i18n-config.ts`. UI strings live in `src/dictionaries/ko.json` and `en.json`, loaded via `getDictionary(locale)` in server components.

### Content System

Blog posts and projects are MDX files stored in `src/content/posts/` and `src/content/projects/`. File naming convention:

```
{slug}.{lang}.mdx
```

Examples: `nextjs-architecture.ko.mdx`, `nextjs-architecture.en.mdx`

Metadata is defined as an inline export at the top of each MDX file (not YAML frontmatter):

```tsx
export const metadata = {
  title: "Post Title",
  excerpt: "Short description",
  category: "Engineering",    // "Engineering" | "Business" | "Insight"
  date: "2025-01-15",
  readTime: "8 min",
  lang: "ko",                 // "ko" | "en"
  keywords: "next.js, react", // Optional, comma-separated
  hidden: false,              // Optional, excludes from listings
};
```

Metadata is parsed via regex in `src/lib/posts.ts` — not via `gray-matter` frontmatter. This means the `export const metadata = { ... };` block format must be preserved exactly.

### MDX Components

Custom MDX components are mapped in `src/mdx-components.tsx`. Available custom components in MDX files:

- `<BlogImage>` — Enhanced image with caption and sizing
- `<ImageGallery>` — Multi-image grid gallery
- `<CodeBlock>` — Code blocks with copy button and language badge (auto-applied to `<pre>`)

### Path Alias

TypeScript path alias `@/*` maps to `./src/*`. Always use `@/` imports.

### Fonts

- **Inter** (300/400/600) — Body text, via CSS variable `--font-inter`
- **Montserrat** (300/400/500/700/900) — Headings and brand, via `--font-montserrat`

### Styling Conventions

- Dark theme only (`<html class="dark">`)
- Tailwind CSS v4 with PostCSS plugin (`@tailwindcss/postcss`)
- No separate Tailwind config file — uses Tailwind v4's CSS-first configuration in `globals.css`
- Color palette: zinc-based neutrals with blue, green, purple, amber accents
- Glassmorphism effects via `.glass-panel` class

## Development Conventions

### TypeScript

- Strict mode enabled
- Types defined in `src/types/` (blog.ts, navigation.ts, index.ts)
- Use `type` imports where possible
- Target: ES2017, Module resolution: bundler

### ESLint

- Flat config format (`eslint.config.mjs`)
- Extends `next/core-web-vitals` and `next/typescript`
- Run `npm run lint` before committing

### Component Organization

- Layout components go in `src/components/layout/`
- Section components (home page sections) go in `src/components/sections/`
- MDX-specific components go in `src/components/mdx/`
- Each subdirectory has a barrel `index.ts` for exports

### Static Generation

Pages use `generateStaticParams()` for static generation at build time. Blog and project pages are statically generated for all locale + slug combinations.

### Caching

Library functions in `src/lib/` use React's `cache()` for request-level deduplication during server rendering.

## Environment Variables

Required for full functionality (set in `.env.local`):

```
NEXT_PUBLIC_BASE_URL=https://hyunjoong.kim
NEXT_PUBLIC_GISCUS_REPO=<github-username/repo>
NEXT_PUBLIC_GISCUS_REPO_ID=<repo-id>
NEXT_PUBLIC_GISCUS_CATEGORY_ID=<category-id>
```

## Adding Content

### New Blog Post

1. Create `src/content/posts/{slug}.{lang}.mdx`
2. Add the `export const metadata = { ... }` block with all required fields
3. Write MDX content below the metadata export
4. For bilingual posts, create both `.ko.mdx` and `.en.mdx` files with the same slug

### New Project

1. Create `src/content/projects/{slug}.{lang}.mdx`
2. Follow the same metadata pattern as blog posts (title, description, tags, metrics)
3. Create both language variants for bilingual support

## External Integrations

- **Giscus** — GitHub Discussions-backed comment system (setup docs in `docs/GISCUS_SETUP.md`)
- **Vercel Speed Insights** — Performance analytics (`@vercel/speed-insights`)
- **highlight.js** — Code syntax highlighting via `rehype-highlight` with custom rainbow theme in `globals.css`

## Common Pitfalls

- MDX metadata uses `export const metadata = { ... };` format — not YAML frontmatter. The regex parser in `posts.ts` expects this exact format.
- All values in the metadata export must use double quotes (the regex matches `"([^"]+)"`).
- The `keywords` field is a comma-separated string, not an array.
- `hidden: true` is a boolean (not a string) in the metadata export.
- Tailwind v4 does not use a `tailwind.config.js` — configuration is CSS-first via `globals.css`.
- No Prettier is configured. Code formatting relies on ESLint rules.
