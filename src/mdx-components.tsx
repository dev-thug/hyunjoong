import type { MDXComponents } from 'mdx/types';
import CodeBlock from '@/components/mdx/CodeBlock';

/**
 * MDX 컴포넌트 스타일링 정의
 * 마크다운 요소들을 커스텀 React 컴포넌트로 매핑
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 헤딩 스타일
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold font-montserrat mt-12 mb-6 text-zinc-100 tracking-tight leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold font-montserrat mt-16 mb-6 text-zinc-100 tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-medium font-montserrat mt-12 mb-4 text-zinc-200 tracking-tight">
        {children}
      </h3>
    ),
    // 본문 스타일
    p: ({ children }) => (
      <p className="text-zinc-300 leading-8 mb-6 text-[1.125rem] font-normal antialiased">
        {children}
      </p>
    ),
    // 링크 스타일
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/30 underline-offset-4 transition-colors"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
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
    li: ({ children }) => (
      <li className="text-zinc-300 pl-1">{children}</li>
    ),
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
    pre: ({ children }) => (
      <CodeBlock>
        {children}
      </CodeBlock>
    ),
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
    em: ({ children }) => (
      <em className="italic text-zinc-200">{children}</em>
    ),
    // 테이블 스타일
    table: ({ children }) => (
      <div className="my-8 overflow-hidden rounded-xl border border-zinc-800/50 bg-[#09090b]/40 backdrop-blur-sm">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          <table className="w-full border-collapse text-left">
            {children}
          </table>
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
      <tr className="transition-colors hover:bg-white/5 group">
        {children}
      </tr>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-zinc-800/30 [&_tr:last-child_td]:border-b-0">
        {children}
      </tbody>
    ),
    ...components,
  };
}
