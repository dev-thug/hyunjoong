'use client';

import { Check, Copy } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

interface CodeBlockProps {
  children: React.ReactNode;
}

/**
 * 커스텀 코드 블록 컴포넌트
 * 복사 기능, 언어 표시, 그리고 전문적인 엔지니어링 블로그 스타일 UI 포함
 */
const CodeBlock = ({ children }: CodeBlockProps) => {
  const params = useParams<{ lang?: string }>();
  const isKorean = params?.lang === "ko";
  const [copyError, setCopyError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    []
  );

  // 언어 정보 추출 (MDX에서 전달되는 className에서 language-xxx 추출)
  const getLanguage = () => {
    if (React.isValidElement(children)) {
      const props = children.props as { className?: string };
      const match = props.className?.match(/(?:^|\s)language-([\w-]+)/);
      if (match) return match[1];
    }
    return null;
  };

  const language = getLanguage();
  const isProse = ["text", "plaintext", "txt"].includes(language ?? "");
  const label = isProse ? (isKorean ? "프롬프트" : "Prompt") : language ?? (isKorean ? "코드" : "Code");

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
      if (typeof navigator.clipboard?.writeText === "function") {
        await navigator.clipboard.writeText(text);
      } else {
        const previousFocus = document.activeElement;
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.cssText = "position:fixed;left:-9999px;top:0";
        document.body.appendChild(textarea);
        try {
          textarea.select();
          if (!document.execCommand("copy")) throw new Error("Copy unavailable");
        } finally {
          textarea.remove();
          if (previousFocus instanceof HTMLElement) previousFocus.focus();
        }
      }
      setCopyError(false);
      setIsCopied(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setIsCopied(false);
        timerRef.current = null;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      setCopyError(true);
    }
  };

  return (
    <div className={`code-block${isProse ? " code-block--prose" : ""}`}>
      <div className="code-block-header">
        <span className="code-block-label">{label}</span>
        <button type="button" onClick={handleCopy} className="code-copy-button"
          aria-label={isKorean ? "내용 복사" : "Copy content"}>
          {isCopied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          <span>{isCopied ? (isKorean ? "복사 완료" : "Copied") : (isKorean ? "복사" : "Copy")}</span>
        </button>
      </div>
      <pre className="code-block-content" tabIndex={isProse ? undefined : 0}>
        {children}
      </pre>
      <span role="status" aria-live="polite" className={copyError ? "code-copy-error" : "sr-only"}>
        {copyError ? (isKorean ? "내용을 선택해서 직접 복사해 주세요." : "Select the text to copy manually.") : isCopied ? (isKorean ? "클립보드에 복사했습니다" : "Copied to clipboard") : ""}
      </span>
    </div>
  );
};

export default CodeBlock;
