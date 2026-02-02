'use client';

import { Check, Copy } from 'lucide-react';
import React, { useState } from 'react';

interface CodeBlockProps {
  children: React.ReactNode;
}

/**
 * 커스텀 코드 블록 컴포넌트
 * 복사 기능, 언어 표시, 그리고 전문적인 엔지니어링 블로그 스타일 UI 포함
 */
const CodeBlock = ({ children }: CodeBlockProps) => {
  const [isCopied, setIsCopied] = useState(false);

  // 언어 정보 추출 (MDX에서 전달되는 className에서 language-xxx 추출)
  const getLanguage = () => {
    if (React.isValidElement(children)) {
      const props = children.props as { className?: string };
      if (props.className && props.className.startsWith('language-')) {
        return props.className.replace('language-', '').toUpperCase();
      }
    }
    return null;
  };

  const language = getLanguage();

  // 컴포넌트 트리에서 텍스트만 추출하는 헬퍼 함수
  const extractText = (node: React.ReactNode): string => {
    if (typeof node === 'string') {
      return node;
    }
    if (typeof node === 'number') {
      return String(node);
    }
    if (Array.isArray(node)) {
      return node.map(extractText).join('');
    }
    if (React.isValidElement(node)) {
      const props = node.props as { children?: React.ReactNode };
      if (props.children) {
        return extractText(props.children);
      }
    }
    return '';
  };

  const handleCopy = async () => {
    const text = extractText(children);
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="group relative mb-8 rounded-xl bg-[#09090b] border border-zinc-800/50 shadow-2xl overflow-hidden">
      {/* Code Block Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#09090b]/80 border-b border-zinc-800/50 backdrop-blur-md">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700/50" />
          {language && (
            <span className="ml-2 text-[10px] font-bold tracking-widest text-zinc-500 font-mono">
              {language}
            </span>
          )}
        </div>
        
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400/50 focus-visible:outline-none transition-all duration-200"
          aria-label={isCopied ? 'Copied' : 'Copy code'}
        >
          {isCopied ? (
            <>
              <Check size={12} className="text-emerald-400" aria-hidden="true" />
              <span className="text-[10px] font-medium text-emerald-400">COPIED</span>
            </>
          ) : (
            <>
              <Copy size={12} aria-hidden="true" />
              <span className="text-[10px] font-medium">COPY</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="p-5 overflow-x-auto font-mono text-[13.5px] leading-[1.6] text-zinc-300 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {children}
      </pre>
    </div>
  );
};

export default CodeBlock;
