/**
 * Structured error tracking utility.
 * Logs errors in a structured JSON format that can be picked up by any
 * observability service (Sentry, Datadog, LogRocket, etc.).
 *
 * To integrate a provider, replace the `sendToProvider` function body.
 */

const isDevelopment = import.meta.env.DEV;

interface ErrorReport {
  message: string;
  stack?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  context?: Record<string, unknown>;
  type: "caught" | "unhandled-error" | "unhandled-rejection" | "component";
}

/**
 * Hook point for external error tracking providers.
 * Replace the body with e.g. `Sentry.captureException(error, { extra: report })`.
 */
function sendToProvider(_error: Error, _report: ErrorReport): void {
  // No-op by default. Implement when a provider is configured.
  // Example:
  //   Sentry.captureException(_error, { extra: _report });
  //   datadogRum.addError(_error, _report.context);
}

function buildReport(
  error: Error,
  type: ErrorReport["type"],
  context?: Record<string, unknown>,
): ErrorReport {
  return {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: typeof window !== "undefined" ? window.location.href : "",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    context,
    type,
  };
}

export function reportError(
  error: Error,
  context?: Record<string, unknown>,
  type: ErrorReport["type"] = "caught",
): void {
  const report = buildReport(error, type, context);

  if (isDevelopment) {
    console.error("[ErrorTracking]", report.message, report);
  } else {
    // Structured log for production log aggregators
    console.error(JSON.stringify(report));
  }

  sendToProvider(error, report);
}

/**
 * Install global handlers for uncaught errors and unhandled promise rejections.
 * Call once at application startup (e.g. in main.tsx).
 */
export function installGlobalErrorHandlers(): void {
  window.addEventListener("error", (event: ErrorEvent) => {
    const error = event.error instanceof Error
      ? event.error
      : new Error(event.message || "Unknown error");
    reportError(error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    }, "unhandled-error");
  });

  window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    const error = event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason ?? "Unhandled promise rejection"));
    reportError(error, undefined, "unhandled-rejection");
  });
}
