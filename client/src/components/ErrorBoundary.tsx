import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from "react-error-boundary";
import type { ReactNode } from "react";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-lg border border-[var(--royal-gold)]/30 bg-[var(--royal-navy)]/50">
        <div className="text-4xl">&#9888;</div>
        <h2 className="text-xl font-semibold text-[var(--royal-gold)]">
          Something went wrong
        </h2>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="inline-flex items-center px-6 py-2.5 rounded-md text-sm font-medium bg-[var(--royal-gold)] text-[var(--royal-navy)] hover:bg-[var(--royal-gold-bright)] transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export function AppErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
}

export function SectionErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
}
