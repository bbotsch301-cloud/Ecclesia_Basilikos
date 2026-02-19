# Full-Stack Audit Report

**Generated:** 2026-02-19
**Scope:** client/, server/, shared/schema.ts, DB schema
**Stack:** Express 4 + Drizzle ORM + Neon Postgres | React 18 + Wouter + TanStack Query | shadcn/ui

---

## A) Repo Map

| Component | Entry Point | Notes |
|-----------|-------------|-------|
| Server boot | `server/index.ts` | Express app, JSON body parser, logging middleware |
| Route registration | `server/routes.ts:34` (`registerRoutes`) | Mounts session, all public routes, sub-routers |
| Admin sub-router | `server/adminRoutes.ts:16` → mounted at `/api/admin` (`routes.ts:795`) | `loadUser` middleware on all admin routes |
| Proof Vault sub-router | `server/proofVaultRoutes.ts` → mounted at `/api/proof-vault` (`routes.ts:798`) | `requireAuth` on all routes |
| Auth middleware | `server/auth.ts` (`requireAuth`, `optionalAuth`) | Session-based, loads user from DB |
| Admin middleware | `server/adminMiddleware.ts` (`requireAdmin`, `requireModerator`, `requireInstructor`, `loadUser`, `auditLog`) | Role checks, audit logging |
| DB connection | `server/db.ts` | Neon serverless + Drizzle |
| DB schema | `shared/schema.ts` | 22 tables, Drizzle pgTable definitions |
| Storage layer | `server/storage.ts` | `DatabaseStorage` class, ~150 methods |
| Client entry | `client/src/App.tsx` | Wouter router, 29 page routes |
| API layer | `client/src/lib/queryClient.ts` | `apiRequest()` fetch wrapper, `getQueryFn()` |
| Auth hook | `client/src/hooks/useAuth.ts` | `useQuery` for `/api/auth/me`, login/register/logout mutations |

---

## B) Endpoint Inventory

### routes.ts (public + semi-protected)

| # | Method | Path | File:Line | Auth? | Frontend calls? | Meaningful? | Notes |
|---|--------|------|-----------|-------|-----------------|-------------|-------|
| 1 | POST | `/api/auth/register` | routes.ts:39 | No | Yes (useAuth) | Yes | Creates user, sends verification email |
| 2 | POST | `/api/auth/login` | routes.ts:100 | No | Yes (useAuth) | Yes | Validates creds, sets session |
| 3 | POST | `/api/auth/logout` | routes.ts:132 | No | Yes (useAuth) | Yes | Destroys session |
| 4 | GET | `/api/auth/me` | routes.ts:142 | requireAuth | Yes (useAuth) | Yes | Returns current user |
| 5 | GET | `/api/auth/verify-email` | routes.ts:148 | No | Yes (verify-email.tsx) | Yes | Token-based email verification |
| 6 | GET | `/api/courses` | routes.ts:180 | optionalAuth | Unknown | Yes | Published courses list |
| 7 | GET | `/api/courses/:id` | routes.ts:190 | optionalAuth | Unknown | Yes | Course + lessons |
| 8 | POST | `/api/enrollments` | routes.ts:206 | optionalAuth | Yes (courses.tsx) | Yes | Creates enrollment, auto-creates temp user |
| 9 | GET | `/api/my-enrollments` | routes.ts:308 | requireAuth | Unknown | Yes | User's enrollments |
| 10 | GET | `/api/downloads` | routes.ts:320 | optionalAuth | Unknown | Yes | User or public downloads |
| 11 | GET | `/api/downloads/published` | routes.ts:520 | No | Unknown | Yes | Published downloads |
| 12 | POST | `/api/downloads/:id/track` | routes.ts:530 | No | Yes (downloads.tsx) | Yes | Increments download count |
| 13 | POST | `/api/trust-download-signup` | routes.ts:541 | No | Yes (trust-download.tsx) | Yes | Trust doc email signup |
| 14 | **POST** | **`/api/track-download`** | **routes.ts:577** | **No** | **Yes (trust-download.tsx)** | **NO — console.log only** | **Stub: logs to console, no DB write** |
| 15 | **GET** | **`/api/trust-document-pdf`** | **routes.ts:590** | **No** | **Yes (trust-download.tsx)** | **NO — placeholder PDF** | **Returns hardcoded PDF skeleton** |
| 16 | GET | `/api/admin/trust-downloads` | routes.ts:676 | requireAuth + inline admin check | Yes (admin-trust-downloads.tsx) | Yes | All trust downloads |
| 17 | POST | `/api/contact` | routes.ts:338 | No | Yes (contact.tsx) | Yes | Contact form |
| 18 | POST | `/api/newsletter` | routes.ts:353 | No | Yes (footer.tsx) | Yes | Newsletter subscribe |
| 19 | GET | `/api/admin/contacts` | routes.ts:376 | requireAuth + inline admin check | Yes (admin-contact-messages.tsx) | Yes | All contacts |
| 20 | GET | `/api/forum/categories` | routes.ts:393 | No | Yes (forum.tsx) | Yes | Active categories |
| 21 | **POST** | **`/api/forum/categories`** | **routes.ts:404** | **requireAuth (NO role check)** | **Yes (forum.tsx)** | **Yes** | **SECURITY: Any auth'd user can create categories** |
| 22 | GET | `/api/forum/categories/:categoryId/threads` | routes.ts:420 | No | Yes (forum.tsx) | Yes | Threads by category |
| 23 | POST | `/api/forum/threads` | routes.ts:432 | requireAuth | Yes (forum.tsx) | Yes | Create thread |
| 24 | GET | `/api/forum/threads/:threadId` | routes.ts:454 | No | Yes (thread.tsx) | Yes | Thread + replies + view increment |
| 25 | POST | `/api/forum/threads/:threadId/replies` | routes.ts:478 | requireAuth | Unknown | Yes | Create reply |
| 26 | POST | `/api/objects/upload` | routes.ts:504 | requireAuth + inline role | Yes (admin-videos.tsx, admin-downloads.tsx) | Yes | GCS upload URL |
| 27 | GET | `/api/courses/:courseId/sections` | routes.ts:694 | No | Unknown | Yes | Course sections |
| 28 | POST | `/api/courses/:courseId/sections` | routes.ts:705 | requireAuth (no role) | Unknown | Yes | Create section — missing role check |
| 29 | PUT | `/api/sections/:id` | routes.ts:725 | requireAuth (no role) | Unknown | Yes | Update section — missing role check |
| 30 | GET | `/api/courses/:courseId/progress` | routes.ts:741 | requireAuth | Unknown | Yes | User course progress |
| 31 | POST | `/api/sections/:sectionId/complete` | routes.ts:753 | requireAuth | Unknown | Yes | Mark section complete |
| 32 | POST | `/api/videos/:videoId/progress` | routes.ts:765 | requireAuth | Unknown | Yes | Update video progress |
| 33 | GET | `/api/videos/:videoId/progress` | routes.ts:783 | requireAuth | Unknown | Yes | Get video progress |

### adminRoutes.ts (all mounted at `/api/admin`, all behind `loadUser`)

| # | Method | Path (relative) | File:Line | Role Gate | Frontend calls? | Notes |
|---|--------|-----------------|-----------|-----------|-----------------|-------|
| 1 | GET | `/users` | adminRoutes.ts:26 | requireAdmin | Yes | |
| 2 | PATCH | `/users/:id/role` | adminRoutes.ts:37 | requireAdmin | Yes | |
| 3 | PATCH | `/users/:id/toggle-active` | adminRoutes.ts:64 | requireAdmin | Yes | |
| 4 | DELETE | `/users/:id` | adminRoutes.ts:90 | requireAdmin | Yes | Hard delete! |
| 5 | GET | `/videos` | adminRoutes.ts:120 | requireInstructor | Yes | |
| 6 | POST | `/videos` | adminRoutes.ts:131 | requireInstructor | Yes | |
| 7 | PATCH | `/videos/:id` | adminRoutes.ts:158 | requireInstructor | Yes | |
| 8 | PATCH | `/videos/:id/toggle-published` | adminRoutes.ts:185 | requireInstructor | Yes | |
| 9 | DELETE | `/videos/:id` | adminRoutes.ts:211 | requireAdmin | Yes | |
| 10 | GET | `/resources` | adminRoutes.ts:241 | requireInstructor | Yes | |
| 11 | POST | `/resources` | adminRoutes.ts:252 | requireInstructor | Yes | |
| 12 | PATCH | `/resources/:id` | adminRoutes.ts:279 | requireInstructor | Yes | |
| 13 | PATCH | `/resources/:id/toggle-published` | adminRoutes.ts:306 | requireInstructor | Yes | |
| 14 | DELETE | `/resources/:id` | adminRoutes.ts:332 | requireAdmin | Yes | |
| 15 | PATCH | `/courses/:id` | adminRoutes.ts:362 | requireInstructor | Unknown | |
| 16 | PATCH | `/courses/:id/toggle-published` | adminRoutes.ts:389 | requireInstructor | Unknown | |
| 17 | DELETE | `/courses/:id` | adminRoutes.ts:415 | requireAdmin | Unknown | |
| 18 | POST | `/courses/:courseId/lessons` | adminRoutes.ts:441 | requireInstructor | Unknown | |
| 19 | PATCH | `/lessons/:id` | adminRoutes.ts:467 | requireInstructor | Unknown | |
| 20 | DELETE | `/lessons/:id` | adminRoutes.ts:494 | requireAdmin | Unknown | |
| 21 | POST | `/forum/categories` | adminRoutes.ts:524 | requireModerator | Unknown | **Duplicate** of `POST /api/forum/categories` in routes.ts |
| 22 | PATCH | `/forum/categories/:id` | adminRoutes.ts:548 | requireModerator | Unknown | |
| 23 | DELETE | `/forum/categories/:id` | adminRoutes.ts:575 | requireAdmin | Unknown | |
| 24 | PATCH | `/forum/threads/:id/toggle-pinned` | adminRoutes.ts:601 | requireModerator | Unknown | |
| 25 | PATCH | `/forum/threads/:id/toggle-locked` | adminRoutes.ts:627 | requireModerator | Unknown | |
| 26 | DELETE | `/forum/threads/:id` | adminRoutes.ts:653 | requireModerator | Unknown | |
| 27 | DELETE | `/forum/replies/:id` | adminRoutes.ts:679 | requireModerator | Unknown | |
| 28 | GET | `/stats` | adminRoutes.ts:708 | requireAdmin | Yes | |
| 29 | GET | `/activity` | adminRoutes.ts:719 | requireAdmin | Yes | |
| 30 | GET | `/page-content` | adminRoutes.ts:734 | requireAdmin | Yes | |
| 31 | GET | `/page-content/:pageName` | adminRoutes.ts:745 | requireAdmin | Unknown | |
| 32 | POST | `/page-content` | adminRoutes.ts:757 | requireAdmin | Yes | |
| 33 | PATCH | `/page-content/:id` | adminRoutes.ts:785 | requireAdmin | Yes | |
| 34 | DELETE | `/page-content/:id` | adminRoutes.ts:815 | requireAdmin | Yes | |
| 35 | GET | `/downloads` | adminRoutes.ts:845 | requireAdmin | Yes | |
| 36 | GET | `/downloads/:id` | adminRoutes.ts:855 | requireAdmin | Unknown | |
| 37 | POST | `/downloads` | adminRoutes.ts:868 | requireAdmin | Yes | |
| 38 | PUT | `/downloads/:id` | adminRoutes.ts:891 | requireAdmin | Yes | |
| 39 | PATCH | `/downloads/:id/toggle-published` | adminRoutes.ts:916 | requireAdmin | Yes | |
| 40 | DELETE | `/downloads/:id` | adminRoutes.ts:940 | requireAdmin | Yes | |

### proofVaultRoutes.ts (all mounted at `/api/proof-vault`, all require auth)

| # | Method | Path (relative) | File:Line | Auth | Frontend calls? | Notes |
|---|--------|-----------------|-----------|------|-----------------|-------|
| 1 | POST | `/proofs` | proofVaultRoutes.ts:97 | requireAuth | Yes | File + hash mode, rate limited |
| 2 | GET | `/proofs` | proofVaultRoutes.ts:167 | requireAuth | Yes | List w/ filter |
| 3 | GET | `/proofs/:id` | proofVaultRoutes.ts:205 | requireAuth | Yes | Detail w/ OTS info |
| 4 | POST | `/proofs/:id/upgrade` | proofVaultRoutes.ts:232 | requireAuth | Yes | Upgrade pending proof |
| 5 | POST | `/proofs/upgrade-all` | proofVaultRoutes.ts:292 | requireAuth | Yes | Bulk upgrade |
| 6 | POST | `/verify` | proofVaultRoutes.ts:351 | requireAuth | Yes | Verify file/hash |
| 7 | GET | `/proofs/:id/bundle` | proofVaultRoutes.ts:448 | requireAuth | Yes | Download ZIP bundle |

**Total: 80 endpoints** (33 public/routes.ts + 40 admin + 7 proof vault)

---

## C) Dead / No-Op Endpoints (Ranked)

### 1. `POST /api/track-download` — NO-OP STUB
- **File:** `server/routes.ts:577-587`
- **Why:** Handler only does `console.log()` — no DB write, no analytics storage, no side effects.
- **Evidence:** Body `{ documentType }` is logged but discarded. Returns `{ success: true }` unconditionally.
- **Frontend caller:** `client/src/pages/trust-download.tsx` calls this endpoint.
- **Fix:** Either implement real download tracking by writing to a table, or **delete the endpoint and remove the client call**.

### 2. `GET /api/trust-document-pdf` — PLACEHOLDER
- **File:** `server/routes.ts:590-673`
- **Why:** Returns a hardcoded, hand-written PDF string that is a minimal valid PDF skeleton with no real content. Comment says "For now, redirect to a sample PDF or serve a placeholder."
- **Evidence:** 80 lines of inline PDF construction with static text.
- **Fix:** Replace with actual document serving from storage, or gate behind a feature flag. If trust documents are real, serve from S3/GCS.

### 3. `POST /api/forum/categories` (routes.ts) — DUPLICATE + INSECURE
- **File:** `server/routes.ts:404-417`
- **Why:** Duplicate of `POST /api/admin/forum/categories` (adminRoutes.ts:524). The admin version has `requireModerator`; this one only has `requireAuth` — any student can create forum categories.
- **Fix:** **Delete this route.** Category creation should only go through the admin router.

---

## D) Duplicate Data Audit (DB)

### Critical Missing Unique Constraints

These tables allow duplicate records due to missing composite unique constraints. Each is a data corruption risk in production:

| Table | Missing UNIQUE on | Risk | Severity |
|-------|-------------------|------|----------|
| `enrollments` | `(user_id, course_id)` | User enrolled in same course multiple times | **CRITICAL** |
| `video_progress` | `(user_id, video_id)` | Multiple progress rows per user/video | **CRITICAL** |
| `section_progress` | `(user_id, section_id)` | Multiple completion records per user/section | **CRITICAL** |
| `lesson_progress` | `(user_id, lesson_id)` | Multiple completion records per user/lesson | **CRITICAL** |
| `forum_likes` | `(user_id, thread_id)` and `(user_id, reply_id)` | User can like same post multiple times | **HIGH** |
| `page_content` | `(page_name, content_key)` | Duplicate CMS entries for same page/key | **HIGH** |

### Duplicate Detection Queries

```sql
-- 1. Duplicate enrollments (same user, same course)
SELECT user_id, course_id, COUNT(*) as cnt
FROM enrollments
GROUP BY user_id, course_id
HAVING COUNT(*) > 1;

-- 2. Duplicate video progress
SELECT user_id, video_id, COUNT(*) as cnt
FROM video_progress
GROUP BY user_id, video_id
HAVING COUNT(*) > 1;

-- 3. Duplicate section progress
SELECT user_id, section_id, COUNT(*) as cnt
FROM section_progress
GROUP BY user_id, section_id
HAVING COUNT(*) > 1;

-- 4. Duplicate lesson progress
SELECT user_id, lesson_id, COUNT(*) as cnt
FROM lesson_progress
GROUP BY user_id, lesson_id
HAVING COUNT(*) > 1;

-- 5. Duplicate forum likes
SELECT user_id, thread_id, COUNT(*) as cnt
FROM forum_likes
WHERE thread_id IS NOT NULL
GROUP BY user_id, thread_id
HAVING COUNT(*) > 1;

SELECT user_id, reply_id, COUNT(*) as cnt
FROM forum_likes
WHERE reply_id IS NOT NULL
GROUP BY user_id, reply_id
HAVING COUNT(*) > 1;

-- 6. Duplicate page content
SELECT page_name, content_key, COUNT(*) as cnt
FROM page_content
GROUP BY page_name, content_key
HAVING COUNT(*) > 1;

-- 7. Duplicate newsletter subscribers (already has UNIQUE, safe)
SELECT LOWER(email), COUNT(*) as cnt
FROM newsletter_subscribers
GROUP BY LOWER(email)
HAVING COUNT(*) > 1;

-- 8. Duplicate users by normalized email
SELECT LOWER(email), COUNT(*) as cnt
FROM users
GROUP BY LOWER(email)
HAVING COUNT(*) > 1;

-- 9. Trust downloads — duplicate email entries (intentional, probably OK)
SELECT email, COUNT(*) as cnt
FROM trust_downloads
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY cnt DESC LIMIT 20;
```

### Dedupe Strategy (for each table above)

**Winner row rule:** Keep the row with the earliest `created_at` (or `enrolled_at` for enrollments). For progress tables, keep the row with the most progress (highest `watched_duration` or `is_completed = true`).

```sql
-- Example: Dedupe enrollments (keep earliest per user+course)
DELETE FROM enrollments
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id, course_id) id
  FROM enrollments
  ORDER BY user_id, course_id, enrolled_at ASC
);

-- Example: Dedupe video_progress (keep most-progressed)
DELETE FROM video_progress
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id, video_id) id
  FROM video_progress
  ORDER BY user_id, video_id, is_completed DESC, watched_duration DESC
);
```

---

## E) Schema & Integrity Audit

### Missing Foreign Keys
- `forum_replies.parent_reply_id` — declared as `varchar` with comment "self-reference added separately" but **no `.references()` call**. (`shared/schema.ts:242`)
- `forum_likes` — no CHECK constraint ensuring exactly one of `thread_id` or `reply_id` is non-null (XOR).

### Columns Never Read or Written by App Code

| Table | Column | Evidence |
|-------|--------|---------|
| `video_attachments` (entire table) | All columns | Storage methods exist (`storage.ts:912-925`) but **zero routes** expose attachment CRUD. No admin or public endpoint touches this table. |
| `lesson_progress` (entire table) | All columns | Only referenced for **cascade deletes** (`storage.ts:671,693`). No endpoint creates or reads lesson progress. |
| `forum_likes` (entire table) | All columns | Only referenced for **cascade deletes** (`storage.ts:714,745,755`). No endpoint creates, reads, or counts likes. |
| `downloads.courseId` | `course_id` | Column exists but `getCourseDownloads()` storage method is defined — unclear if any route calls it |
| `videos.tags` | `tags` | Stored as comma-separated text. Never queried, never filtered, never displayed prominently. |
| `users.username` | `username` | Schema defines it as UNIQUE/nullable, but no route sets or displays usernames. |

### Tables Never Queried by App (Functionally Dead)

1. **`video_attachments`** — Storage methods exist but are orphaned (no route calls them).
2. **`lesson_progress`** — Only used for cleanup on delete. No CRUD endpoints.
3. **`forum_likes`** — Only used for cleanup on delete. No CRUD endpoints. No like/unlike feature.

### Type / Nullability Issues

| Issue | Location | Detail |
|-------|----------|--------|
| `downloads.fileSize` is `text` | `schema.ts:182` | Should be `integer`. Every other table uses `integer` for sizes. |
| `audit_log.oldData/newData` are `text` | `schema.ts:264-265` | Should be `jsonb` for queryability. Currently `JSON.stringify()`'d on write. |
| `videos.tags` is `text` | `schema.ts:70` | Should be `text[]` or `jsonb` for queryability. |
| `users.username` is UNIQUE + nullable | `schema.ts:20` | Multiple NULL usernames are allowed in Postgres, but this is a confusing design. |

### Proposed Indexes

```sql
-- FK lookups (most impactful for N+1 patterns)
CREATE INDEX idx_courses_created_by ON courses(created_by_id);
CREATE INDEX idx_videos_created_by ON videos(created_by_id);
CREATE INDEX idx_resources_created_by ON resources(created_by_id);
CREATE INDEX idx_course_sections_course ON course_sections(course_id);
CREATE INDEX idx_course_sections_video ON course_sections(video_id);
CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_forum_threads_category ON forum_threads(category_id);
CREATE INDEX idx_forum_threads_author ON forum_threads(author_id);
CREATE INDEX idx_forum_replies_thread ON forum_replies(thread_id);
CREATE INDEX idx_forum_replies_author ON forum_replies(author_id);

-- Composite unique constraints (data integrity)
CREATE UNIQUE INDEX uq_enrollments ON enrollments(user_id, course_id);
CREATE UNIQUE INDEX uq_video_progress ON video_progress(user_id, video_id);
CREATE UNIQUE INDEX uq_section_progress ON section_progress(user_id, section_id);
CREATE UNIQUE INDEX uq_lesson_progress ON lesson_progress(user_id, lesson_id);
CREATE UNIQUE INDEX uq_page_content ON page_content(page_name, content_key);
CREATE UNIQUE INDEX uq_forum_likes_thread ON forum_likes(user_id, thread_id) WHERE thread_id IS NOT NULL;
CREATE UNIQUE INDEX uq_forum_likes_reply ON forum_likes(user_id, reply_id) WHERE reply_id IS NOT NULL;

-- Query performance
CREATE INDEX idx_videos_published ON videos(is_published) WHERE is_published = true;
CREATE INDEX idx_courses_published ON courses(is_published) WHERE is_published = true;
CREATE INDEX idx_resources_published ON resources(is_published) WHERE is_published = true;
CREATE INDEX idx_downloads_published ON downloads(is_published) WHERE is_published = true;
CREATE INDEX idx_forum_categories_active ON forum_categories(is_active) WHERE is_active = true;
CREATE INDEX idx_audit_log_created ON admin_audit_log(created_at DESC);
CREATE INDEX idx_users_email_verification ON users(email_verification_token) WHERE email_verification_token IS NOT NULL;
```

---

## F) Frontend ↔ Backend Wiring Audit

### Server Routes With ZERO Frontend References

| Method | Path | File | Notes |
|--------|------|------|-------|
| GET | `/api/my-enrollments` | routes.ts:308 | No client page queries this. `/my-courses` page exists but unclear if it calls this. |
| GET | `/api/downloads` | routes.ts:320 | `downloads.tsx` calls `/api/downloads/published` instead. |
| GET | `/api/courses/:courseId/sections` | routes.ts:694 | No frontend reference found. |
| POST | `/api/courses/:courseId/sections` | routes.ts:705 | No frontend reference found. |
| PUT | `/api/sections/:id` | routes.ts:725 | No frontend reference found. |
| POST | `/api/sections/:sectionId/complete` | routes.ts:753 | No frontend reference found. |
| POST | `/api/videos/:videoId/progress` | routes.ts:765 | No frontend reference found. |
| GET | `/api/videos/:videoId/progress` | routes.ts:783 | No frontend reference found. |
| GET | `/api/admin/page-content/:pageName` | adminRoutes.ts:745 | No explicit client call to this parameterized variant. |
| GET | `/api/admin/downloads/:id` | adminRoutes.ts:855 | No individual download GET from frontend. |
| PATCH | `/api/admin/courses/:id` | adminRoutes.ts:362 | No frontend page for admin course editing. |
| PATCH | `/api/admin/courses/:id/toggle-published` | adminRoutes.ts:389 | No frontend page. |
| DELETE | `/api/admin/courses/:id` | adminRoutes.ts:415 | No frontend page. |
| POST | `/api/admin/courses/:courseId/lessons` | adminRoutes.ts:441 | No frontend page. |
| PATCH | `/api/admin/lessons/:id` | adminRoutes.ts:467 | No frontend page. |
| DELETE | `/api/admin/lessons/:id` | adminRoutes.ts:494 | No frontend page. |
| POST | `/api/admin/forum/categories` | adminRoutes.ts:524 | Duplicate of public route; no dedicated admin forum UI. |
| PATCH | `/api/admin/forum/categories/:id` | adminRoutes.ts:548 | No admin forum management page. |
| DELETE | `/api/admin/forum/categories/:id` | adminRoutes.ts:575 | No admin forum management page. |
| PATCH | `/api/admin/forum/threads/:id/toggle-pinned` | adminRoutes.ts:601 | No admin forum management page. |
| PATCH | `/api/admin/forum/threads/:id/toggle-locked` | adminRoutes.ts:627 | No admin forum management page. |
| DELETE | `/api/admin/forum/threads/:id` | adminRoutes.ts:653 | No admin forum management page. |
| DELETE | `/api/admin/forum/replies/:id` | adminRoutes.ts:679 | No admin forum management page. |

**22 server routes with no known frontend caller** — many are admin CRUD for courses, lessons, and forum moderation that have no corresponding admin UI page.

### Unused Client Components

| Component | File | Issue |
|-----------|------|-------|
| `RequireAdmin` | `client/src/components/RequireAdmin.tsx` | **Never imported or used anywhere.** Admin pages have no client-side route guard. |

### Inconsistent API Call Patterns

1. **Direct `fetch()` vs `apiRequest()`** — `proof-vault-new.tsx`, `proof-vault-detail.tsx`, `proof-vault-verify.tsx`, `admin-downloads.tsx:1068`, and `EmailTemplateEditor.tsx` use raw `fetch()` instead of `apiRequest()`. This bypasses the shared error-handling path in `throwIfResNotOk()`.
2. **Duplicate `/api/admin/page-content` queries** — Both `admin-content.tsx:82` and `EmailTemplateEditor.tsx` independently query the same endpoint.

---

## G) Risk List (Top 15)

| # | Severity | Category | Issue | Evidence | Fix |
|---|----------|----------|-------|----------|-----|
| 1 | **CRITICAL** | Security | **Hardcoded session secret fallback** | `server/auth.ts:12` — `SESSION_SECRET \|\| "your-secret-key-change-in-production"` | Remove fallback; crash if env var missing. |
| 2 | **CRITICAL** | Security | **Session cookie `secure: false`** | `server/auth.ts:16` — Comment says "Set to true in production" but value is hardcoded false. | Set `secure: process.env.NODE_ENV === 'production'`. |
| 3 | **CRITICAL** | Security | **Any authenticated user can create forum categories** | `routes.ts:404` — `requireAuth` without role check. Admin route duplicate exists at `adminRoutes.ts:524` with proper `requireModerator`. | Delete the route in routes.ts. |
| 4 | **CRITICAL** | Data Integrity | **Missing UNIQUE on enrollments(user_id, course_id)** | `schema.ts:158-165` — No composite unique. `enrollUser()` can create duplicates. | Add unique constraint + dedupe migration. |
| 5 | **CRITICAL** | Data Integrity | **Missing UNIQUE on video_progress(user_id, video_id)** | `schema.ts:109-118` — Race condition in `updateVideoProgress()`. | Add unique constraint + use upsert. |
| 6 | **CRITICAL** | Data Integrity | **Missing UNIQUE on section_progress(user_id, section_id)** | `schema.ts:121-128` — `completeSectionForUser()` can duplicate. | Add unique constraint + use upsert. |
| 7 | **HIGH** | Security | **Course section endpoints missing role check** | `routes.ts:705` (`POST sections`) and `routes.ts:725` (`PUT sections`) only check `requireAuth` — any student can create/modify course sections. | Add `requireInstructor` or similar role check. |
| 8 | **HIGH** | Security | **User deletion is hard delete** | `adminRoutes.ts:90-113` — `DELETE /users/:id` permanently deletes user. Orphans FK references in enrollments, forum posts, videos, etc. | Implement soft delete (set `is_active = false`) or cascade properly. |
| 9 | **HIGH** | Security | **No CORS configuration** | `server/index.ts` — No `cors()` middleware. Currently safe only because API and client are served from same origin. If frontend is ever separated, all endpoints are open. | Add explicit CORS with origin whitelist. |
| 10 | **HIGH** | Data Integrity | **page_content upsert race condition** | `storage.ts` — `upsertPageContent()` does SELECT then INSERT/UPDATE without transaction. Two concurrent requests for the same (page, key) can both insert. | Wrap in transaction, or use Postgres `ON CONFLICT`. |
| 11 | **HIGH** | Dead Code | **3 entire tables are functionally dead** | `video_attachments`, `lesson_progress`, `forum_likes` — have schema + storage methods but zero route exposure. | Either implement the features or drop the tables/code. |
| 12 | **MEDIUM** | Security | **Admin routes in routes.ts use inline role checks** | `routes.ts:376-388` and `routes.ts:676-689` — Duplicate auth pattern: `requireAuth` + manual `if (user.role !== 'admin')`. Fragile; easy to forget the inline check. | Move these endpoints to adminRoutes.ts where `loadUser` + `requireAdmin` middleware handles it uniformly. |
| 13 | **MEDIUM** | Performance | **No indexes on any FK columns** | All 22 tables lack FK indexes except `proofs` (has user_id + sha256 indexes). Every JOIN or filtered query does a sequential scan. | Add indexes per Section E. |
| 14 | **MEDIUM** | Data Integrity | **downloads.fileSize is type text** | `schema.ts:182` — Every other size column is integer. Text prevents numeric comparisons/sorting. | Migration to change column type to integer. |
| 15 | **LOW** | Maintainability | **RequireAdmin component exists but is never used** | `client/src/components/RequireAdmin.tsx` — Admin pages render without client-side route protection; rely solely on API 401/403. | Either use it to wrap admin routes in `App.tsx`, or delete it. |

---

## H) Patch Plan (Minimal Diffs)

### Commit 1: Fix critical session security

```typescript
// server/auth.ts — lines 11-20
export const sessionMiddleware = session({
  secret: (() => {
    const secret = process.env.SESSION_SECRET;
    if (!secret) throw new Error("SESSION_SECRET env var is required");
    return secret;
  })(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
});
```

### Commit 2: Remove insecure duplicate forum category route

```diff
--- a/server/routes.ts
+++ b/server/routes.ts
@@ -402,16 +402,7 @@
   });

-  // Create a new forum category (admin only for now)
-  app.post("/api/forum/categories", requireAuth, async (req, res) => {
-    try {
-      const categoryData = insertForumCategorySchema.parse(req.body);
-      const category = await storage.createForumCategory(categoryData);
-      res.json({ success: true, category });
-    } catch (error) {
-      if (error instanceof z.ZodError) {
-        res.status(400).json({ errors: error.errors });
-      } else {
-        console.error("Error creating forum category:", error);
-        res.status(500).json({ error: "Failed to create category" });
-      }
-    }
-  });
+  // Forum category creation is handled via POST /api/admin/forum/categories
+  // (adminRoutes.ts) with requireModerator middleware.
```

### Commit 3: Add role checks to course section endpoints

```diff
--- a/server/routes.ts
+++ b/server/routes.ts
@@ -704,6 +704,10 @@
   // Create a new course section (admin only)
   app.post("/api/courses/:courseId/sections", requireAuth, async (req, res) => {
     try {
+      const user = req.user as User;
+      if (!['admin', 'moderator', 'instructor'].includes(user.role || '')) {
+        return res.status(403).json({ error: "Instructor access required" });
+      }
       const sectionData = insertCourseSectionSchema.parse({

@@ -724,6 +728,10 @@
   // Update course section (admin only)
   app.put("/api/sections/:id", requireAuth, async (req, res) => {
     try {
+      const user = req.user as User;
+      if (!['admin', 'moderator', 'instructor'].includes(user.role || '')) {
+        return res.status(403).json({ error: "Instructor access required" });
+      }
       const updates = insertCourseSectionSchema.partial().parse(req.body);
```

### Commit 4: Add unique constraints migration

```sql
-- Migration: add_unique_constraints.sql

-- Step 1: Dedupe existing data (run in transaction)
BEGIN;

-- Enrollments: keep earliest
DELETE FROM enrollments a
USING enrollments b
WHERE a.user_id = b.user_id
  AND a.course_id = b.course_id
  AND a.enrolled_at > b.enrolled_at;

-- Video progress: keep most progressed
DELETE FROM video_progress a
USING video_progress b
WHERE a.user_id = b.user_id
  AND a.video_id = b.video_id
  AND a.id != b.id
  AND (b.is_completed = true OR b.watched_duration > a.watched_duration);

-- Section progress: keep completed
DELETE FROM section_progress a
USING section_progress b
WHERE a.user_id = b.user_id
  AND a.section_id = b.section_id
  AND a.id != b.id
  AND (b.is_completed = true OR b.created_at < a.created_at);

-- Lesson progress: keep completed
DELETE FROM lesson_progress a
USING lesson_progress b
WHERE a.user_id = b.user_id
  AND a.lesson_id = b.lesson_id
  AND a.id != b.id
  AND (b.completed = true OR b.id < a.id);

-- Page content: keep newest
DELETE FROM page_content a
USING page_content b
WHERE a.page_name = b.page_name
  AND a.content_key = b.content_key
  AND a.id != b.id
  AND a.updated_at < b.updated_at;

COMMIT;

-- Step 2: Add constraints
ALTER TABLE enrollments ADD CONSTRAINT uq_enrollments_user_course
  UNIQUE (user_id, course_id);

ALTER TABLE video_progress ADD CONSTRAINT uq_video_progress_user_video
  UNIQUE (user_id, video_id);

ALTER TABLE section_progress ADD CONSTRAINT uq_section_progress_user_section
  UNIQUE (user_id, section_id);

ALTER TABLE lesson_progress ADD CONSTRAINT uq_lesson_progress_user_lesson
  UNIQUE (user_id, lesson_id);

ALTER TABLE page_content ADD CONSTRAINT uq_page_content_page_key
  UNIQUE (page_name, content_key);

-- Partial unique indexes for forum likes (allow NULL)
CREATE UNIQUE INDEX uq_forum_likes_thread
  ON forum_likes(user_id, thread_id) WHERE thread_id IS NOT NULL;

CREATE UNIQUE INDEX uq_forum_likes_reply
  ON forum_likes(user_id, reply_id) WHERE reply_id IS NOT NULL;
```

### Commit 5: Add FK indexes for performance

```sql
-- Migration: add_fk_indexes.sql
CREATE INDEX IF NOT EXISTS idx_courses_created_by ON courses(created_by_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_by ON videos(created_by_id);
CREATE INDEX IF NOT EXISTS idx_resources_created_by ON resources(created_by_id);
CREATE INDEX IF NOT EXISTS idx_course_sections_course ON course_sections(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_forum_threads_category ON forum_threads(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_threads_author ON forum_threads(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_thread ON forum_replies(thread_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON admin_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_downloads_published ON downloads(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(email_verification_token) WHERE email_verification_token IS NOT NULL;
```

### Commit 6: Delete no-op endpoint and placeholder

```diff
--- a/server/routes.ts
+++ b/server/routes.ts
@@ -576,13 +576,1 @@
-  app.post("/api/track-download", async (req, res) => {
-    try {
-      const { documentType } = req.body;
-      // Track download analytics if needed
-      console.log(`Document downloaded: ${documentType} from IP: ${req.ip}`);
-      res.json({ success: true });
-    } catch (error) {
-      console.error("Error tracking download:", error);
-      res.status(500).json({ error: "Failed to track download" });
-    }
-  });
+  // POST /api/track-download removed — was a no-op (console.log only).
+  // TODO: Implement real download analytics if needed.
```

Also remove the `apiRequest("POST", "/api/track-download", ...)` call in `client/src/pages/trust-download.tsx`.

### Commit 7: Delete unused RequireAdmin component or wire it up

Option A (delete):
```bash
rm client/src/components/RequireAdmin.tsx
```

Option B (wire up — recommended):
```tsx
// client/src/App.tsx — wrap admin routes
import RequireAdmin from "@/components/RequireAdmin";

// Replace:
<Route path="/admin" component={AdminDashboard} />
// With:
<Route path="/admin">
  {() => <RequireAdmin><AdminDashboard /></RequireAdmin>}
</Route>
// (repeat for all /admin/* routes)
```

### Commit 8: Fix downloads.fileSize type

```diff
--- a/shared/schema.ts
+++ b/shared/schema.ts
@@ -182 +182 @@
-  fileSize: text("file_size"),
+  fileSize: integer("file_size"),
```

```sql
-- Migration
ALTER TABLE downloads ALTER COLUMN file_size TYPE integer USING file_size::integer;
```

---

## Quick Wins (30 Minutes)

1. **Fix session secret** (Commit 1) — 2 lines, prevents session hijacking in prod. ~2 min.
2. **Delete insecure `POST /api/forum/categories`** (Commit 2) — Remove 14 lines from routes.ts. ~3 min.
3. **Add role checks to section endpoints** (Commit 3) — Add 8 lines. ~3 min.
4. **Delete `POST /api/track-download` no-op** (Commit 6) — Remove endpoint + client call. ~5 min.
5. **Delete or wire `RequireAdmin`** (Commit 7) — Either `rm` the file or wrap admin routes. ~5 min.
6. **Run dedupe queries** (from Section D) against prod to assess scope of duplicates. ~5 min.
7. **Add unique constraints** (Commit 4) — After confirming no existing duplicates, apply the migration. ~10 min.

**What NOT to touch in 30 minutes:** Index migration (Commit 5) requires load testing validation. The `trust-document-pdf` placeholder needs a real document. Dead tables (`video_attachments`, `lesson_progress`, `forum_likes`) need a product decision on whether to build the features or drop them.
