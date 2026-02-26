# Blog TOC & Reading Progress Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 블로그 상세 페이지에 디자인 시스템과 일관된 TOC(목차) 점프 및 읽기 진행률 UI를 추가한다.

**Architecture:** 서버에서 MDX 원문 기반 TOC 데이터를 생성하고, 클라이언트에서는 `IntersectionObserver`로 active heading과 읽기 진행률만 계산한다. 기존 상세 페이지 구조(MDX 본문, Giscus, prev/next)는 유지하고, 데스크톱 sticky + 모바일 접이식 패턴을 컴포넌트로 분리한다.

**Tech Stack:** Next.js App Router, TypeScript, MDX, Tailwind CSS v4, React client components, IntersectionObserver API

---

### Task 1: TOC Parser Utility

**Files:**
- Create: `src/lib/toc.ts`
- Create: `src/lib/toc.test.ts`
- Modify: `package.json` (if needed, test script only when missing)

**Step 1: Write the failing test**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { extractTocItems } from "./toc";

test("extracts h2/h3 headings with stable unique ids", () => {
  const mdx = `
## Intro
### Setup
## Intro
`;
  const items = extractTocItems(mdx);
  assert.deepEqual(items.map((item) => item.id), ["intro", "setup", "intro-2"]);
  assert.deepEqual(items.map((item) => item.level), [2, 3, 2]);
});
```

**Step 2: Run test to verify it fails**

Run: `node --test src/lib/toc.test.ts`  
Expected: FAIL with module/function not found

**Step 3: Write minimal implementation**

```ts
export type TocItem = { id: string; text: string; level: 2 | 3 };

export const extractTocItems = (source: string): TocItem[] => {
  // parse ## / ### lines, normalize id, dedupe with numeric suffix
  return [];
};
```

**Step 4: Run test to verify it passes**

Run: `node --test src/lib/toc.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/toc.ts src/lib/toc.test.ts package.json
git commit -m "feat: add mdx toc extraction utility"
```

### Task 2: TOC UI Component (Desktop sticky + Mobile collapsible)

**Files:**
- Create: `src/components/blog/BlogToc.tsx`
- Create: `src/components/blog/blog-toc.types.ts`
- Modify: `src/components/blog/index.ts` (if directory barrel is introduced)

**Step 1: Write the failing test**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { getNextExpandedState } from "./blog-toc.types";

test("toggles toc expand state", () => {
  assert.equal(getNextExpandedState(false), true);
  assert.equal(getNextExpandedState(true), false);
});
```

**Step 2: Run test to verify it fails**

Run: `node --test src/components/blog/blog-toc.types.test.ts`  
Expected: FAIL because helper/file missing

**Step 3: Write minimal implementation**

```ts
export const getNextExpandedState = (prev: boolean): boolean => !prev;
```

Then implement `BlogToc.tsx` with:
- desktop: `lg:sticky lg:top-24`
- mobile: collapsible card with `aria-expanded`, `aria-controls`
- active item style and click-to-anchor links

**Step 4: Run test to verify it passes**

Run: `node --test src/components/blog/blog-toc.types.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/blog/BlogToc.tsx src/components/blog/blog-toc.types.ts src/components/blog/blog-toc.types.test.ts src/components/blog/index.ts
git commit -m "feat: add responsive blog toc component"
```

### Task 3: Reading Progress Component

**Files:**
- Create: `src/components/blog/ReadingProgress.tsx`
- Create: `src/components/blog/reading-progress.ts`
- Create: `src/components/blog/reading-progress.test.ts`

**Step 1: Write the failing test**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { calculateReadingProgress } from "./reading-progress";

test("calculates reading progress and remaining percent", () => {
  const result = calculateReadingProgress(250, 1000);
  assert.equal(result.readPercent, 25);
  assert.equal(result.remainingPercent, 75);
});
```

**Step 2: Run test to verify it fails**

Run: `node --test src/components/blog/reading-progress.test.ts`  
Expected: FAIL because helper missing

**Step 3: Write minimal implementation**

```ts
export const calculateReadingProgress = (current: number, total: number) => {
  // clamp 0-100 and return read/remaining percent
};
```

Then implement `ReadingProgress.tsx`:
- top progress bar
- inline `% read / % remaining` text
- scroll listener throttled with `requestAnimationFrame`

**Step 4: Run test to verify it passes**

Run: `node --test src/components/blog/reading-progress.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/blog/ReadingProgress.tsx src/components/blog/reading-progress.ts src/components/blog/reading-progress.test.ts
git commit -m "feat: add blog reading progress indicator"
```

### Task 4: Integrate TOC + Progress into Blog Detail Page

**Files:**
- Modify: `src/app/[lang]/blog/[slug]/page.tsx`
- Modify: `src/mdx-components.tsx` (heading id and scroll offset consistency)
- Modify: `src/app/globals.css` (only if tiny utility class is required)

**Step 1: Write the failing test**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { extractTocItems } from "@/lib/toc";

test("blog sample content returns non-empty toc", () => {
  const mdx = "## A\n### B";
  assert.ok(extractTocItems(mdx).length > 0);
});
```

**Step 2: Run test to verify it fails**

Run: `node --test src/lib/toc.integration.test.ts`  
Expected: FAIL before integration wiring

**Step 3: Write minimal implementation**

- Server side in blog detail page:
  - load MDX source text
  - create `tocItems` via `extractTocItems`
  - pass to `BlogToc` and `ReadingProgress`
- Layout:
  - desktop grid with content + right sidebar
  - mobile collapsible TOC above content
- Ensure heading anchors and `scroll-mt-*` alignment

**Step 4: Run test to verify it passes**

Run: `node --test src/lib/toc.integration.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/[lang]/blog/[slug]/page.tsx src/mdx-components.tsx src/app/globals.css src/lib/toc.integration.test.ts
git commit -m "feat: integrate toc and reading progress into blog detail"
```

### Task 5: Accessibility/Regression Verification

**Files:**
- Modify: `docs/plans/2026-02-26-blog-toc-reading-progress-design.md` (optional verification notes)

**Step 1: Write the failing test**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { hasAriaState } from "./a11y-check";

test("toc toggle has aria-expanded", () => {
  assert.equal(hasAriaState('<button aria-expanded="true"></button>'), true);
});
```

**Step 2: Run test to verify it fails**

Run: `node --test src/components/blog/a11y-check.test.ts`  
Expected: FAIL before helper exists

**Step 3: Write minimal implementation**

```ts
export const hasAriaState = (html: string): boolean =>
  html.includes("aria-expanded=");
```

Run full checks:
- `npm run lint`
- `npm run build`

Manual checks:
- Desktop sticky TOC
- Mobile collapsible TOC
- Active section tracking
- Progress bar/percent sync
- Keyboard navigation/aria attributes

**Step 4: Run test to verify it passes**

Run:
- `node --test src/components/blog/a11y-check.test.ts`
- `npm run lint`
- `npm run build`

Expected: PASS

**Step 5: Commit**

```bash
git add .
git commit -m "test: verify toc and reading-progress accessibility and regressions"
```

## Notes

- 이 프로젝트는 정식 테스트 러너가 없으므로, 본 계획은 `node:test` 기반의 최소 단위 검증을 제안한다.
- 기능 완성 후 테스트 인프라를 정식 도입할지(예: Vitest)는 별도 작업으로 분리한다(YAGNI).
- 각 Task 완료 후 커밋을 유지해 롤백/리뷰 단위를 작게 유지한다.
