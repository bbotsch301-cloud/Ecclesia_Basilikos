import { useEffect } from "react";

const BASE = "Ecclesia Basilikos";
const DEFAULT_DESCRIPTION = "Reclaim your lawful standing with Ecclesia Basilikos. Courses, documents, and community for trust law, lawful money, and state citizenship.";

function setMetaTag(property: string, content: string, isName = false) {
  const attr = isName ? "name" : "property";
  let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function usePageTitle(title?: string, description?: string) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${BASE}` : BASE;
    document.title = fullTitle;

    const desc = description || DEFAULT_DESCRIPTION;
    const url = window.location.href;
    const ogType = "website";

    setMetaTag("description", desc, true);
    setMetaTag("og:title", fullTitle);
    setMetaTag("og:description", desc);
    setMetaTag("og:type", ogType);
    setMetaTag("og:url", url);

    return () => {
      document.title = BASE;
    };
  }, [title, description]);
}
