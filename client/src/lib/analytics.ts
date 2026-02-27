declare global {
  interface Window {
    plausible?: (...args: any[]) => void;
  }
}

export function trackEvent(name: string, props?: Record<string, string | number>) {
  window.plausible?.(name, props ? { props } : undefined);
}
