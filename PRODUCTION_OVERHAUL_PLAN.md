# Ecclesia Basilikos - Full Production Overhaul Plan

## Context
Ecclesia Basilikos is a full-stack educational platform (React 18/Express/PostgreSQL/Drizzle ORM) teaching Kingdom citizenship and biblical covenant truth. It has rich features (courses, forum, proof vault, admin dashboard, downloads) but critical gaps in security, performance, testing, SEO, and polish prevent it from being a professional, production-ready application. This plan addresses all 22 identified gaps across 8 phases.

---

## Phase 1: Security & Stability

### 1A. Fix Role Check Gaps
- **`server/routes.ts`** ~line 705, 725: Add `requireInstructor` middleware to `POST /api/courses/:courseId/sections` and `PUT /api/sections/:id` (currently only `requireAuth`, any user can create/edit course sections)
- **`server/auth.ts`**: Create a standalone `requireInstructor` middleware that checks `['admin','moderator','instructor'].includes(user.role)` — avoids depending on `loadUser` from adminMiddleware

### 1B. Enable Content Security Policy
- **`server/index.ts:14`**: Replace `contentSecurityPolicy: false` with a real CSP allowing `'self'`, Google Fonts, Font Awesome CDN, YouTube/Vimeo embeds, `data:` and `blob:` for images

### 1C. XSS Sanitization
- **Install:** `isomorphic-dompurify`
- **Create:** `server/sanitize.ts` — `sanitizeHtml()` (allows basic formatting tags) and `sanitizePlainText()` (strips all tags)
- **Modify:** `server/routes.ts` — sanitize forum thread titles/content, replies, and edits before DB write

### 1D. Remove Placeholder Endpoint
- **`server/routes.ts`** ~line 590: `GET /api/trust-document-pdf` returns a hardcoded PDF skeleton — replace with real file serving from `/resources/` or return a proper 404 JSON response

### 1E. Global Error Boundary
- **Install:** `react-error-boundary`
- **Create:** `client/src/components/ErrorBoundary.tsx` — fallback UI with "Something went wrong" + retry button styled in royal theme
- **Modify:** `client/src/App.tsx` — wrap `<Router />` in `<ErrorBoundary>`, add per-section boundaries for admin/forum/courses/proof-vault
- **Modify:** `client/src/lib/queryClient.ts` — add global `onError` to mutation defaults

---

## Phase 2: Performance & SEO

### 2A. Compression & Caching
- **Install:** `compression`
- **`server/index.ts`**: Add `app.use(compression())` before `express.json()`
- **`server/vite.ts`**: Add `maxAge: '1y', immutable: true` to `express.static()` for built assets (Vite hashes filenames), `no-cache` for HTML

### 2B. Route-Based Code Splitting
- **`client/src/App.tsx`**: Convert all page imports to `React.lazy()` + wrap `<Switch>` in `<Suspense fallback={<PageLoader />}>`. Keep only Home/Login/Signup eagerly loaded (above-the-fold)

### 2C. Remove Dev Scripts
- **`client/index.html:24`**: Remove Replit dev banner `<script>` tag (loads in production)

### 2D. SEO Assets
- **Create:** `client/public/robots.txt` — Allow /, Disallow /admin and /api
- **Create:** `client/public/sitemap.xml` — Static sitemap for all public routes (home, about, courses, forum, videos, downloads, etc.)
- **`client/index.html`**: Add Twitter Card meta tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)

### 2E. Favicon & Branding
- **Create:** `client/public/` — favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png (generated from existing brand imagery in `attached_assets/`)
- **Create:** `client/public/covenant-og-image.jpg` (currently referenced in HTML but missing)
- **`client/index.html`**: Add `<link rel="icon">` and `<link rel="apple-touch-icon">` tags

---

## Phase 3: Error Handling & UX

### 3A. Structured Logging
- **Install:** `pino`, `pino-pretty` (dev)
- **Create:** `server/logger.ts` — Pino logger with pretty-print in dev, JSON in prod
- **Create:** `server/requestId.ts` — middleware that assigns `req.id` (UUID) and sets `X-Request-Id` header
- **Modify:** `server/index.ts` — replace custom logging middleware with Pino-based request logging
- **Modify all server files**: Replace ~113 `console.log/error` calls with `logger.info/error` in: `routes.ts`, `adminRoutes.ts`, `adminMiddleware.ts`, `email.ts`, `proofVaultRoutes.ts`, `initializeEmailTemplates.ts`, `objectStorage.ts`

### 3B. Loading & Empty States
- **Create:** `client/src/components/PageSkeleton.tsx` — reusable skeleton variants (CourseListSkeleton, ForumThreadsSkeleton, DownloadsListSkeleton, AdminTableSkeleton)
- **Create:** `client/src/components/EmptyState.tsx` — icon + title + description + optional CTA button
- **Modify pages**: Add skeletons on `isLoading` and `<EmptyState>` on empty arrays for: `courses.tsx`, `forum.tsx`, `downloads.tsx`, `videos.tsx`, `my-courses.tsx`, and all admin list pages
- **Modify forms**: Add `isPending` → `<Loader2 className="animate-spin">` to submit buttons

### 3C. Form UX
- **Create:** `client/src/hooks/useUnsavedChanges.ts` — `beforeunload` warning hook
- **Modify forms**: Set `mode: 'onBlur'` on `useForm()` calls for inline validation (login, signup, contact, profile, forgot-password, reset-password)
- **Modify mutation handlers**: Add success `toast()` calls after successful form submissions where missing

---

## Phase 4: Legal & Compliance

### 4A. Legal Pages
- **Create:** `client/src/pages/terms.tsx` — Terms of Service page
- **Create:** `client/src/pages/privacy.tsx` — Privacy Policy page
- **Modify:** `client/src/App.tsx` — add `/terms` and `/privacy` routes
- **Modify:** `client/src/components/layout/footer.tsx` — add Terms/Privacy links

### 4B. Cookie Consent
- **Create:** `client/src/components/CookieConsent.tsx` — fixed bottom banner with "Accept" button, stores consent in localStorage
- **Modify:** `client/src/App.tsx` — render `<CookieConsent />`

### 4C. Accessibility
- **Modify:** `client/src/App.tsx` (or layout) — add skip link: `<a href="#main-content" className="sr-only focus:not-sr-only ...">Skip to main content</a>` + `id="main-content"` on `<main>`
- **Modify:** `client/src/index.css` — add `a:focus-visible, button:focus-visible { outline: 2px solid hsl(var(--royal-gold)); outline-offset: 2px; }`
- **Audit all page components**: Ensure images have `alt` text, interactive elements have visible focus indicators

---

## Phase 5: Testing

### 5A. Test Infrastructure
- **Install (dev):** `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`, `msw`
- **Create:** `vitest.config.ts` — separate config with jsdom environment, path aliases, setup file
- **Create:** `client/src/test/setup.ts` — imports `@testing-library/jest-dom`
- **Modify:** `package.json` — add `"test": "vitest run"`, `"test:watch": "vitest"`, `"test:coverage": "vitest run --coverage"`

### 5B. Priority Tests
- **Create:** `server/__tests__/auth.test.ts` — test requireAuth, requireAdmin, requireInstructor with mock req/res/next
- **Create:** `server/__tests__/routes.test.ts` — test route security guards (verify 401/403 responses)
- **Create:** `client/src/hooks/__tests__/useAuth.test.tsx` — test useAuth hook with mocked API
- **Create:** `client/src/pages/__tests__/home.test.tsx` — smoke test (renders without crashing)
- **Create:** `shared/__tests__/schema.test.ts` — test Zod validation schemas with valid/invalid inputs

---

## Phase 6: Polish

### 6A. Email Retry Logic
- **Modify:** `server/email.ts` — add retry loop (3 attempts with exponential backoff), replace console calls with logger, return boolean success

### 6B. Notification System
- **Modify:** `shared/schema.ts` — add `notifications` table (userId, type, title, message, linkUrl, isRead, createdAt) + `notification_preferences` table
- **Modify:** `server/storage.ts` — add CRUD: createNotification, getUserNotifications, markRead, markAllRead, getUnreadCount
- **Modify:** `server/routes.ts` — add endpoints: `GET /api/notifications`, `PATCH /api/notifications/:id/read`, `POST /api/notifications/mark-all-read`, `GET /api/notifications/unread-count`
- **Modify:** `server/routes.ts` — in forum reply handler, create notification for thread author when someone replies
- **Create:** `client/src/components/NotificationBell.tsx` — bell icon with badge count, dropdown of recent notifications
- **Modify:** `client/src/components/layout/navbar.tsx` — add `<NotificationBell />` for authenticated users

### 6C. Global Search
- **Modify:** `server/storage.ts` — add `searchGlobal(query)` method using PostgreSQL `to_tsvector`/`to_tsquery` across courses, forum_threads, downloads
- **Modify:** `server/routes.ts` — add `GET /api/search?q=` endpoint
- **Create:** `client/src/components/SearchDialog.tsx` — command palette (Cmd+K) using existing `cmdk` dependency, groups results by type
- **Modify:** `client/src/components/layout/navbar.tsx` — add search icon that opens SearchDialog

---

## Phase 7: Infrastructure

### 7A. Rate Limiting Expansion
- **Modify:** `server/routes.ts` — add rate limiters to: forum thread/reply creation (10/min), file uploads (5/min), newsletter signup, trust-download-signup using existing `rateLimit()` pattern from `server/rateLimit.ts`

### 7B. Database Indexes
- **Modify:** `shared/schema.ts` — add indexes to all tables:
  - `courses`: isPublished
  - `lessons`: courseId
  - `enrollments`: userId, courseId (individual)
  - `forum_threads`: categoryId, authorId, createdAt
  - `forum_replies`: threadId, authorId
  - `downloads`: isPublished, category
  - `videoProgress`: userId, videoId (individual)
- Run `npm run db:push` after changes

### 7C. CI/CD Pipeline
- **Install (dev):** `eslint`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `eslint-plugin-react-hooks`
- **Create:** `eslint.config.js` — flat config with TS + React Hooks rules
- **Create:** `.github/workflows/ci.yml` — typecheck + lint + test + build on push/PR to main
- **Modify:** `package.json` — add `"lint"` script

### 7D. Analytics
- **`client/index.html`**: Add Plausible analytics script (lightweight, privacy-respecting)
- Track custom events: signups, enrollments, downloads via `window.plausible()` calls in relevant handlers

---

## Phase 8: Advanced Features

### 8A. PWA
- **Install (dev):** `vite-plugin-pwa`
- **Create:** `client/public/manifest.json` — app name, icons, theme colors (navy/gold)
- **Create:** `client/public/offline.html` — simple offline fallback
- **Create:** 192x192 and 512x512 icon PNGs
- **Modify:** `vite.config.ts` — add VitePWA plugin with Workbox config (cache fonts, assets, navigate fallback)
- **Modify:** `client/index.html` — add `<link rel="manifest">` and `<meta name="theme-color">`

### 8B. Rich Text Editor
- **Install:** `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-image`, `@tiptap/extension-placeholder`, `@tiptap/extension-underline`
- **Create:** `client/src/components/RichTextEditor.tsx` — Tiptap editor with toolbar (bold, italic, headings, lists, links, images, blockquotes)
- **Modify:** `client/src/pages/admin-content.tsx` — replace textarea with RichTextEditor
- **Modify:** `client/src/pages/thread.tsx` — replace reply textarea with RichTextEditor for richer forum posts
- **Optional:** Add `content_versions` table for content versioning in admin editor

### 8C. Social Features
- **Create:** `client/src/pages/user-profile.tsx` — public profile showing username, join date, thread/reply counts
- **Modify:** `shared/schema.ts` — add `thread_subscriptions` table (userId + threadId unique)
- **Modify:** `server/routes.ts` — add subscribe/unsubscribe endpoints, public profile endpoint
- **Modify:** `server/storage.ts` — add subscription + profile query methods
- **Modify:** `client/src/App.tsx` — add `/user/:userId` route

---

## NPM Installs Summary

```bash
# Production
npm install compression isomorphic-dompurify pino @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-placeholder @tiptap/extension-underline

# Dev
npm install -D react-error-boundary vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom msw pino-pretty vite-plugin-pwa eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react-hooks
```

## New Files (35 total)
| File | Purpose |
|------|---------|
| `server/sanitize.ts` | XSS sanitization utility |
| `server/logger.ts` | Pino structured logger |
| `server/requestId.ts` | Request ID middleware |
| `client/public/robots.txt` | Search engine directives |
| `client/public/sitemap.xml` | Static sitemap |
| `client/public/manifest.json` | PWA manifest |
| `client/public/offline.html` | PWA offline fallback |
| `client/public/favicon.*` | Favicon set (5 files) |
| `client/public/covenant-og-image.jpg` | OG social image |
| `client/src/components/ErrorBoundary.tsx` | Error boundary + fallback |
| `client/src/components/PageSkeleton.tsx` | Skeleton loaders |
| `client/src/components/EmptyState.tsx` | Empty state component |
| `client/src/components/CookieConsent.tsx` | Cookie consent banner |
| `client/src/components/NotificationBell.tsx` | Notification UI |
| `client/src/components/SearchDialog.tsx` | Global search dialog |
| `client/src/components/RichTextEditor.tsx` | Tiptap rich text editor |
| `client/src/hooks/useUnsavedChanges.ts` | Beforeunload warning |
| `client/src/pages/terms.tsx` | Terms of Service |
| `client/src/pages/privacy.tsx` | Privacy Policy |
| `client/src/pages/user-profile.tsx` | Public user profile |
| `client/src/test/setup.ts` | Vitest setup |
| `server/__tests__/auth.test.ts` | Auth middleware tests |
| `server/__tests__/routes.test.ts` | Route security tests |
| `client/src/hooks/__tests__/useAuth.test.tsx` | Auth hook tests |
| `client/src/pages/__tests__/home.test.tsx` | Smoke tests |
| `shared/__tests__/schema.test.ts` | Schema validation tests |
| `vitest.config.ts` | Test configuration |
| `eslint.config.js` | Lint configuration |
| `.github/workflows/ci.yml` | CI pipeline |

## Critical Files to Modify
| File | Changes |
|------|---------|
| `server/routes.ts` | Security fixes, sanitization, rate limiting, search, notifications, subscriptions |
| `server/index.ts` | CSP, compression, request ID, structured logging |
| `shared/schema.ts` | Indexes on all tables, notifications + subscriptions + content_versions tables |
| `client/src/App.tsx` | Error boundary, lazy loading, new routes, skip link, cookie consent |
| `server/storage.ts` | Notification CRUD, search, subscriptions, public profile |
| `client/src/components/layout/navbar.tsx` | NotificationBell, SearchDialog trigger |
| `client/src/components/layout/footer.tsx` | Terms/Privacy links |
| `client/index.html` | Favicons, Twitter cards, manifest, remove dev scripts |
| `server/email.ts` | Retry logic, structured logging |
| All server files | Replace console.log/error with logger |

## Verification
- `npx tsc --noEmit` — no type errors
- `npm run test` — all tests pass
- `npm run build` — production build succeeds
- Lighthouse audit on home page — target 90+ on Performance, Accessibility, SEO, Best Practices
- Manual test: auth flows, course enrollment, forum CRUD, admin panel, proof vault
- Test role guards: confirm unauthenticated and unauthorized requests get 401/403
- Mobile test: responsive layout at 375px width
- Verify email sending: registration + password reset
- Verify CSP doesn't break fonts, videos, or CDN assets
