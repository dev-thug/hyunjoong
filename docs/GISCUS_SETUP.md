# Giscus 댓글 기능 설정 가이드

## 개요

이 블로그는 **Giscus**를 사용하여 GitHub Discussions를 기반으로 한 댓글 시스템을 제공합니다.

### Giscus란?
- GitHub Discussions를 댓글 저장소로 사용하는 오픈소스 댓글 시스템
- 별도의 데이터베이스가 필요 없음
- 다국어 지원 (현재: 한국어, 영어)
- 반응(emoji) 지원

---

## 설정 단계

### 1. GitHub 저장소 준비

Giscus를 사용하려면 다음 조건이 필요합니다:

- ✅ **Public 저장소**: 저장소가 공개되어야 합니다
- ✅ **Discussions 활성화**: GitHub 저장소 설정에서 Discussions를 활성화해야 합니다

**단계:**
1. GitHub 저장소로 이동
2. Settings → Features → ☑️ Discussions 체크

### 2. Giscus 애플리케이션 설치

1. https://github.com/apps/giscus 접속
2. "Install" 버튼 클릭
3. 저장소 선택 및 설치

### 3. Giscus 설정 생성

1. https://giscus.app 접속
2. 다음 정보 입력:

   **Repository**
   - Username/Repository 형식으로 입력 (예: `hyunjoong/hyunjoong`)

   **Discussion Category**
   - "Announcements" 또는 원하는 카테고리 선택

   **Features**
   - ☑️ Enable reactions for the main post (권장)
   - ☑️ Place the comment box above the comments (권장)

   **Theme**
   - Dark (기본값 - 블로그 테마에 맞음)

3. 설정을 입력하면 하단에 스크립트가 생성됨

### 4. 환경변수 설정

생성된 스크립트에서 다음 정보를 추출합니다:

```html
<script
  src="https://giscus.app/client.js"
  data-repo="YOUR_USERNAME/YOUR_REPO"
  data-repo-id="R_kgDOxxx..."
  data-category-id="DIC_xxx..."
  ...
>
</script>
```

프로젝트 루트의 `.env.local` 파일을 생성하고 다음 값을 입력합니다:

```bash
NEXT_PUBLIC_GISCUS_REPO=YOUR_USERNAME/YOUR_REPO
NEXT_PUBLIC_GISCUS_REPO_ID=R_kgDOxxx...
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxx...
```

**예시:**
```bash
NEXT_PUBLIC_GISCUS_REPO=hyunjoong/hyunjoong
NEXT_PUBLIC_GISCUS_REPO_ID=R_kgDOEnZxxxx
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDOEnZxxxx
```

### 5. 로컬 테스트

```bash
npm run dev
```

블로그 포스트 페이지 하단에 댓글 섹션이 표시되는지 확인합니다.

---

## 구현 내용

### 파일 구조

```
src/
├── components/mdx/
│   └── Giscus.tsx          # Giscus 컴포넌트
└── app/[lang]/blog/[slug]/
    └── page.tsx             # BlogPostPage에 Giscus 통합
```

### Giscus 컴포넌트 (`src/components/mdx/Giscus.tsx`)

```typescript
'use client';

import { useEffect } from 'react';

interface GiscusProps {
  lang: 'ko' | 'en';
}

export default function Giscus({ lang }: GiscusProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.setAttribute('data-repo', process.env.NEXT_PUBLIC_GISCUS_REPO || '');
    script.setAttribute('data-repo-id', process.env.NEXT_PUBLIC_GISCUS_REPO_ID || '');
    script.setAttribute('data-category-id', process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || '');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-lang', lang === 'ko' ? 'ko' : 'en');
    // ... 기타 설정

    const giscusDiv = document.getElementById('giscus');
    if (giscusDiv) {
      giscusDiv.appendChild(script);
    }
  }, [lang]);

  return <div id="giscus" className="my-12 py-8 border-t border-gray-800" />;
}
```

### BlogPostPage 통합

`src/app/[lang]/blog/[slug]/page.tsx`에서:

```typescript
import Giscus from "@/components/mdx/Giscus";

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // ... 기존 코드

  return (
    <article>
      {/* ... 포스트 헤더 및 본문 */}
      <Giscus lang={lang as 'ko' | 'en'} />
      {/* ... 네비게이션 */}
    </article>
  );
}
```

---

## 주요 특징

### ✨ 다국어 지원
- 포스트 언어에 따라 댓글 시스템 언어 자동 변경
- 한국어 포스트 → 한국어 댓글
- 영어 포스트 → 영어 댓글

### 🎨 스타일 일관성
- 블로그 다크 테마에 맞는 Giscus 다크 테마 적용
- 포스트 하단에 자연스럽게 통합

### ⚡ 성능 최적화
- 클라이언트 사이드 로딩 (`'use client'`)
- 스크립트 Lazy Loading (`data-loading="lazy"`)
- 필요할 때만 로드됨

### 🔒 개인정보 보호
- GitHub 계정으로 로그인하여 댓글 작성
- 별도 데이터베이스에 개인정보 저장 안 함

---

## 트러블슈팅

### Q: 댓글이 보이지 않습니다.
**A:** 다음을 확인하세요:
1. `.env.local` 파일에 올바른 값이 설정되었는지 확인
2. GitHub 저장소가 Public인지 확인
3. Discussions가 활성화되었는지 확인
4. 개발 서버를 재시작했는지 확인

### Q: 다른 언어의 댓글을 보고 싶습니다.
**A:** Giscus는 포스트의 `data-mapping="pathname"`을 사용하여 댓글을 구분합니다.
- `/ko/blog/post-title` → 한국어 Discussions
- `/en/blog/post-title` → 영어 Discussions (또는 공용 스레드)

같은 포스트의 다국어 버전은 경로가 다르므로 댓글도 분리됩니다.

### Q: 댓글 스타일을 커스터마이징하고 싶습니다.
**A:** Giscus 공식 문서(https://giscus.app)에서 제공하는 설정 옵션을 참고하세요.
필요시 `src/components/mdx/Giscus.tsx`에서 추가 속성을 설정할 수 있습니다.

---

## 참고 자료

- [Giscus 공식 웹사이트](https://giscus.app)
- [Giscus GitHub 저장소](https://github.com/giscus/giscus)
- [GitHub Discussions 가이드](https://docs.github.com/en/discussions)
