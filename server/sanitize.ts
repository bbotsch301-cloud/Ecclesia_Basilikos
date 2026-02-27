import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML content, allowing basic formatting tags.
 * Suitable for forum posts, rich text content, etc.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "b", "i", "em", "strong", "u", "s", "p", "br", "ul", "ol", "li",
      "blockquote", "code", "pre", "a", "h1", "h2", "h3", "h4", "h5", "h6",
    ],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}

/**
 * Strip all HTML tags, returning plain text only.
 * Suitable for titles, usernames, and other single-line fields.
 */
export function sanitizePlainText(dirty: string): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
}
