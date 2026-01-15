import type { MDXComponents } from 'mdx/types';

/**
 * MDX 컴포넌트 스타일링 정의
 * 마크다운 요소들을 커스텀 React 컴포넌트로 매핑
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 헤딩 스타일
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold font-montserrat mb-6 text-white">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold font-montserrat mt-10 mb-4 text-white">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-medium font-montserrat mt-8 mb-3 text-white">
        {children}
      </h3>
    ),
    // 본문 스타일
    p: ({ children }) => (
      <p className="text-gray-300 leading-relaxed mb-6 text-lg">
        {children}
      </p>
    ),
    // 링크 스타일
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-blue-400 hover:text-blue-300 underline transition-colors"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    // 리스트 스타일
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-gray-300 mb-6 space-y-2">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-gray-300">{children}</li>
    ),
    // 코드 스타일
    code: ({ children }) => (
      <code className="bg-gray-800 text-green-400 px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6 overflow-x-auto">
        {children}
      </pre>
    ),
    // 인용문 스타일
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-400 my-6">
        {children}
      </blockquote>
    ),
    // 가로선
    hr: () => <hr className="border-gray-700 my-8" />,
    // 강조 스타일
    strong: ({ children }) => (
      <strong className="font-bold text-white">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-gray-200">{children}</em>
    ),
    ...components,
  };
}
