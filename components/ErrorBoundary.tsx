"use client";

import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | null;
}

/**
 * Global Error Boundary for the portfolio.
 * Catches JavaScript errors anywhere in the child component tree,
 * logs them, and displays a user-friendly bilingual fallback UI.
 *
 * - No external dependencies beyond React (lightweight).
 * - Logs to console (ready for future error reporting service).
 * - Korean + English messages for accessibility.
 * - Simple reload / home navigation actions.
 */
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error — in production you could forward to Sentry, Vercel, etc.
    console.error(
      "[ErrorBoundary] Uncaught error in component tree:",
      error,
      errorInfo
    );
    // TODO(phase-3-2+): Integrate with error monitoring service when available.
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.assign("/");
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black dark:bg-black p-6 text-white">
          <div className="w-full max-w-md text-center">
            {/* Subtle error icon / visual */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-4xl">
              ⚠️
            </div>

            {/* Bilingual headline */}
            <h1 className="mb-2 text-2xl font-semibold tracking-tight md:text-3xl">
              문제가 발생했습니다
            </h1>
            <p className="mb-6 text-sm text-white/60 md:text-base">
              Something went wrong
            </p>

            {/* Friendly bilingual description */}
            <div className="mb-8 space-y-2 text-sm leading-relaxed text-white/70 md:text-[15px]">
              <p>죄송합니다. 예상치 못한 오류가 발생했습니다.</p>
              <p>
                Please try one of the options below to recover. If the issue
                persists, feel free to reach out.
              </p>
            </div>

            {/* Action buttons — match portfolio visual language */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={this.handleReload}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-all active:scale-[0.985] hover:bg-white/90 sm:flex-none"
              >
                다시 로드 / Reload
              </button>

              <button
                onClick={this.handleGoHome}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-white/30 bg-white/5 px-8 py-3 text-sm font-semibold text-white transition-all active:scale-[0.985] hover:bg-white/10 sm:flex-none"
              >
                홈으로 / Go Home
              </button>
            </div>

            {/* Dev-only error hint (non-intrusive) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-8 text-left text-[10px] opacity-50">
                <summary className="cursor-pointer select-none text-white/50 hover:text-white/70">
                  개발자 정보 (Error details)
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-white/5 p-3 text-[10px] leading-tight text-white/60">
                  {this.state.error.toString()}
                  {this.state.error.stack ? "\n\n" + this.state.error.stack : ""}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
