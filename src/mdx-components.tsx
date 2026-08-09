import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import CodeBlock from "@/components/mdx/CodeBlock";
import BlogImage from "@/components/mdx/BlogImage";
import ImageGallery from "@/components/mdx/ImageGallery";
import { toHeadingId } from "@/lib/toc";

const extractTextContent = (value: unknown): string => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => extractTextContent(item)).join(" ");
  }
  if (
    value &&
    typeof value === "object" &&
    "props" in value &&
    (value as { props?: unknown }).props
  ) {
    const props = (value as { props?: { children?: unknown } }).props;
    return extractTextContent(props?.children);
  }
  return "";
};

/**
 * MDX 컴포넌트 스타일링 정의
 * 마크다운 요소들을 커스텀 React 컴포넌트로 매핑
 *
 * Heading-ID dedup counter is module-level. `useMDXComponents` is called
 * by the MDX runtime per render; allocating a fresh Map per call discards
 * earlier counts and re-runs allocation on every render. The counter is
 * reset at the start of each call so each document render starts clean.
 */
const headingIdCounts = new Map<string, number>();
const getHeadingId = (children: unknown): string => {
  const rawText = extractTextContent(children).trim();
  const baseId = toHeadingId(rawText);
  const nextCount = (headingIdCounts.get(baseId) ?? 0) + 1;
  headingIdCounts.set(baseId, nextCount);
  return nextCount === 1 ? baseId : `${baseId}-${nextCount}`;
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  headingIdCounts.clear();

  return {
    // 상세 route가 문서 제목 H1을 소유하므로 MDX 내부 H1은 중복 렌더링하지 않습니다.
    h1: () => null,
    h2: ({ children }) => (
      <h2
        id={getHeadingId(children)}
        className="text-2xl md:text-3xl font-semibold font-montserrat mt-16 mb-6 text-zinc-100 tracking-tight scroll-mt-20 text-balance"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        id={getHeadingId(children)}
        className="text-xl md:text-2xl font-medium font-montserrat mt-12 mb-4 text-zinc-200 tracking-tight scroll-mt-20 text-balance"
      >
        {children}
      </h3>
    ),
    // 본문 스타일
    p: ({ children }) => (
      <p className="text-zinc-300 leading-8 mb-6 text-[1.0625rem] md:text-[1.125rem] font-normal antialiased">
        {children}
      </p>
    ),
    // 링크 스타일
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-blue-400 hover:text-blue-300 focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:outline-none rounded-sm underline decoration-blue-400/30 underline-offset-4 transition-colors duration-200"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
    // 리스트 스타일
    ul: ({ children }) => (
      <ul className="list-disc pl-6 text-zinc-300 mb-6 space-y-3 leading-7">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-6 text-zinc-300 mb-6 space-y-3 leading-7">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="text-zinc-300 pl-1">{children}</li>,
    // 코드 스타일
    code: ({ children, className }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="bg-[#18181b] text-[#e4e4e7] px-1.5 py-0.5 rounded-md text-[0.85em] font-mono border border-zinc-800/50">
            {children}
          </code>
        );
      }
      return <code className={className}>{children}</code>;
    },
    pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
    // 인용문 스타일
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-zinc-700 pl-6 italic text-zinc-400 my-8 bg-zinc-900/30 py-4 rounded-r-lg">
        {children}
      </blockquote>
    ),
    // 가로선
    hr: () => <hr className="border-zinc-800 my-12" />,
    // 강조 스타일
    strong: ({ children }) => (
      <strong className="font-semibold text-zinc-100">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-zinc-200">{children}</em>,
    // 이미지 스타일 (기본 마크다운 이미지)
    // 크기/캡션이 필요하면 BlogImage 컴포넌트를 사용하세요.
    img: ({ src, alt }) => {
      if (typeof src !== "string" || src.length === 0) {
        return null;
      }
      return (
        <span className="block my-8">
          <Image
            src={src}
            alt={alt ?? ""}
            width={1200}
            height={675}
            className="mx-auto rounded-xl shadow-lg shadow-black/20 max-w-full h-auto"
            sizes="(max-width: 768px) 100vw, 768px"
            style={{ width: "100%", height: "auto" }}
          />
        </span>
      );
    },
    // 커스텀 이미지 컴포넌트 (크기 조절, 캡션 등 지원)
    BlogImage,
    // 이미지 갤러리 컴포넌트 (여러 이미지 그리드 표시)
    ImageGallery,
    // 테이블 스타일
    table: ({ children }) => (
      <div className="my-8 overflow-hidden rounded-xl border border-zinc-800/50 bg-[#09090b]/40 backdrop-blur-sm">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent touch-action-manipulation">
          <table className="w-full border-collapse text-left" role="table">{children}</table>
        </div>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-zinc-800/30 border-b border-zinc-800">
        {children}
      </thead>
    ),
    th: ({ children }) => (
      <th
        scope="col"
        className="px-4 py-3.5 text-sm font-semibold text-zinc-100 whitespace-nowrap"
      >
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-4 text-sm text-zinc-400 border-b border-zinc-800/30 leading-relaxed">
        {children}
      </td>
    ),
    tr: ({ children }) => (
      <tr className="transition-colors hover:bg-white/5 group">{children}</tr>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-zinc-800/30 [&_tr:last-child_td]:border-b-0">
        {children}
      </tbody>
    ),
    ...components,
  };
}
