/**
 * Simple error tracking utility.
 * Logs errors in development; can be extended to send to Sentry, Datadog, etc. in production.
 */

const isDevelopment = import.meta.env.DEV;

export function reportError(error: Error, context?: Record<string, any>): void {
  if (isDevelopment) {
    console.error("[ErrorTracking]", error.message, {
      error,
      ...(context ? { context } : {}),
    });
    return;
  }

  // Production: log a condensed message.
  // Replace the block below with a real provider (e.g. Sentry.captureException)
  // when one is configured.
  console.error("[ErrorTracking]", error.message);

  // Example Sentry integration:
  // Sentry.captureException(error, { extra: context });
}
