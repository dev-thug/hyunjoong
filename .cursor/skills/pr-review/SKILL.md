---
name: pr-review
description: Reviews pull requests for correctness, security, and alignment with project rules (Next.js, TypeScript, Tailwind, clean code). Use when the user asks for a PR review, code review, or when reviewing pull request changes.
---

# PR 리뷰

PR 요청 시 이 스킬을 적용한다. 변경된 파일을 기준으로 정확성·보안·프로젝트 컨벤션을 검토한다.

## 리뷰 순서

1. **범위 파악**: 변경된 파일 목록과 diff 확인
2. **체크리스트 적용**: 아래 항목별로 통과 여부 검사
3. **피드백 정리**: 심각도별로 구분해 제안 작성 (한국어로 응답, 기술 용어는 영어 유지)

## 체크리스트

### 정확성·버그

- [ ] 로직이 올바른지, 엣지 케이스를 처리하는지
- [ ] 타입 정의가 적절한지 (TypeScript)
- [ ] 에러 처리·예외 상황이 고려되었는지
- [ ] Next.js Hydration 이슈 가능성은 없는지 (HTML 중첩, 서버/클라이언트 불일치)

### 보안

- [ ] 사용자 입력 검증·이스케이프 (XSS 등)
- [ ] API 키·비밀값이 코드/커밋에 포함되지 않았는지
- [ ] 환경 변수·시크릿 사용 방식이 적절한지

### 프로젝트 컨벤션 (Next.js / React / Tailwind)

- [ ] **스타일**: Tailwind 클래스 사용, 인라인 CSS/`<style>` 지양
- [ ] **클래스**: `clsx` 또는 `tailwind-merge`로 조건부 클래스 관리, 가능하면 `class:` 사용
- [ ] **네이밍**: 설명 가능한 변수/함수명, 이벤트 핸들러는 `handle` 접두사 (예: `handleClick`, `handleKeyDown`)
- [ ] **함수 형태**: `const fn = () => {}` 형태 선호, 필요한 경우 타입 정의
- [ ] **접근성**: 의미 있는 HTML, `aria-label`, `tabIndex` 등 적절히 사용
- [ ] **컴포넌트**: Server Component 기본, `use client`는 필요한 경우만
- [ ] **Early return**: 분기 처리는 가능한 한 early return으로 가독성 확보

### 코드 품질 (Clean Code / Code Quality)

- [ ] 매직 넘버 대신 named constant 사용
- [ ] 단일 책임: 함수/컴포넌트가 한 가지 역할만 수행
- [ ] DRY: 반복 로직은 함수/공통 모듈로 추출
- [ ] 기존 코드/기능 보존: 불필요한 삭제·수정 없음
- [ ] 불필요한 변경 제안 금지: 요청된 범위 밖의 리팩터링 지양
- [ ] 화이트스페이스만 바꾼 제안 금지
- [ ] TODO/플레이스홀더 없이 구현이 완결되었는지

### 테스트·배포

- [ ] 변경 사항에 맞는 테스트 존재 여부 (Vitest, React Testing Library, Playwright)
- [ ] 빌드/CI 실패 가능성은 없는지
- [ ] `next.config`, `package.json` 등 설정 변경 시 부작용 여부

## 피드백 형식

아래 템플릿으로 정리한다. 해당 없으면 섹션 생략 가능.

```markdown
## PR 리뷰 요약

[1–2문장으로 변경 목적과 전반적 인상]

---

### 🔴 필수 수정 (머지 전 해결)

- **파일:줄** – [문제] [수정 제안]
- …

### 🟡 권장 수정

- **파일:줄** – [개선점] [제안]
- …

### 🟢 참고 (선택)

- [참고할 만한 포인트나 대안]
```

## Sub-Agent 관점 (선택)

변경 성격에 따라 project-owner의 Sub-Agent 관점을 참고해 집중 검토할 수 있다.

| 변경 유형                | 집중 검토                                                    |
| ------------------------ | ------------------------------------------------------------ |
| 새 기능·리팩터·상태/로직 | Component Architect – 모듈성, 상태 배치, Server/Client 구분  |
| 성능·번들·로딩           | Performance – 워터폴, lazy loading, `next/image`·`next/font` |
| 스타일·레이아웃·a11y     | UI/UX Auditor – 시맨틱 HTML, 반응형, 다크모드                |
| 테스트 추가/수정         | QA – AAA 패턴, 엣지 케이스                                   |
| 버그·에러·hydration      | Troubleshooter – 로그·원인 분석                              |
| 배포·CI/CD·설정          | DevOps – Vercel, 시크릿, 설정 파일                           |

## 주의

- 근거 없이 추측하지 말고, 코드/diff 기준으로만 피드백한다.
- 리뷰어 의견은 “제안”으로 두고, 최종 결정은 PR 작성자에게 맡긴다.
