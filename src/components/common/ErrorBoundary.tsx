// src/components/common/ErrorBoundary.tsx
import React, { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    // 실제 서비스에서는 에러 로깅 서비스(Sentry 등)와 연동합니다.
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-red-700 bg-red-50 border border-red-300 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">오류가 발생했습니다!</h2>
          <p className="text-lg mb-4">페이지를 표시할 수 없습니다.</p>
          {this.state.error && (
            <details className="text-sm text-red-600 cursor-pointer">
              <summary>자세한 오류 정보 보기</summary>
              <pre className="mt-2 p-2 bg-red-100 rounded-md overflow-auto whitespace-pre-wrap break-words">
                {this.state.error.message}
                {this.state.error.stack}
              </pre>
            </details>
          )}
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            페이지 새로고침
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
