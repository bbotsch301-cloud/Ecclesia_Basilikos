import { useEffect } from "react";

const BASE = "Ecclesia Basilikos";

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE}` : BASE;
    return () => { document.title = BASE; };
  }, [title]);
}
