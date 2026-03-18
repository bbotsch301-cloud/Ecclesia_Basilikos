/**
 * Cleanup script: removes duplicate courses, downloads, and forum categories.
 *
 * For each group of duplicates (same category/title/name), keeps the OLDEST
 * record and deletes the rest along with their child rows.
 *
 * Run with: npx tsx scripts/cleanup-duplicates.ts
 */

import { db } from "../server/db";
import {
  courses,
  lessons,
  enrollments,
  courseSections,
  downloads,
  forum_categories,
  forum_threads,
  forum_replies,
  forum_likes,
} from "../shared/schema";
import { eq, inArray, sql } from "drizzle-orm";

async function cleanup() {
  console.log("🧹 Starting duplicate cleanup...\n");

  // ── COURSES ──────────────────────────────────────────────
  console.log("═══ COURSES ═══");

  const allCourses = await db
    .select({ id: courses.id, title: courses.title, category: courses.category, createdAt: courses.createdAt })
    .from(courses)
    .orderBy(courses.createdAt);

  // Group by category, keep oldest
  const coursesByCategory = new Map<string, typeof allCourses>();
  for (const c of allCourses) {
    const key = c.category ?? c.title;
    if (!coursesByCategory.has(key)) coursesByCategory.set(key, []);
    coursesByCategory.get(key)!.push(c);
  }

  let coursesDeleted = 0;
  for (const [category, group] of coursesByCategory) {
    if (group.length <= 1) continue;

    const [keep, ...dupes] = group; // oldest first (ordered by createdAt)
    const dupeIds = dupes.map((d) => d.id);

    console.log(`\n  "${category}": keeping "${keep.title}" (${keep.id}), removing ${dupes.length} duplicate(s)`);

    // Delete child rows first (no cascade on these FKs)
    const deletedEnrollments = await db.delete(enrollments).where(inArray(enrollments.courseId, dupeIds)).returning();
    const deletedSections = await db.delete(courseSections).where(inArray(courseSections.courseId, dupeIds)).returning();
    const deletedLessons = await db.delete(lessons).where(inArray(lessons.courseId, dupeIds)).returning();

    // Unlink downloads (set courseId to null rather than deleting)
    await db
      .update(downloads)
      .set({ courseId: null })
      .where(inArray(downloads.courseId, dupeIds));

    // Delete the duplicate courses
    await db.delete(courses).where(inArray(courses.id, dupeIds));

    console.log(`    Removed: ${deletedEnrollments.length} enrollments, ${deletedSections.length} sections, ${deletedLessons.length} lessons`);
    coursesDeleted += dupes.length;
  }

  console.log(`\n  Total courses removed: ${coursesDeleted}`);

  // ── DOWNLOADS ────────────────────────────────────────────
  console.log("\n═══ DOWNLOADS ═══");

  const allDownloads = await db
    .select({ id: downloads.id, title: downloads.title, createdAt: downloads.createdAt })
    .from(downloads)
    .orderBy(downloads.createdAt);

  const dlByTitle = new Map<string, typeof allDownloads>();
  for (const d of allDownloads) {
    const key = d.title;
    if (!dlByTitle.has(key)) dlByTitle.set(key, []);
    dlByTitle.get(key)!.push(d);
  }

  let downloadsDeleted = 0;
  for (const [title, group] of dlByTitle) {
    if (group.length <= 1) continue;

    const [keep, ...dupes] = group;
    const dupeIds = dupes.map((d) => d.id);

    console.log(`  "${title}": keeping ${keep.id}, removing ${dupes.length} duplicate(s)`);
    await db.delete(downloads).where(inArray(downloads.id, dupeIds));
    downloadsDeleted += dupes.length;
  }

  console.log(`  Total downloads removed: ${downloadsDeleted}`);

  // ── FORUM CATEGORIES ─────────────────────────────────────
  console.log("\n═══ FORUM CATEGORIES ═══");

  const allCats = await db
    .select({ id: forum_categories.id, name: forum_categories.name, createdAt: forum_categories.createdAt })
    .from(forum_categories)
    .orderBy(forum_categories.createdAt);

  const catsByName = new Map<string, typeof allCats>();
  for (const c of allCats) {
    const key = c.name;
    if (!catsByName.has(key)) catsByName.set(key, []);
    catsByName.get(key)!.push(c);
  }

  let catsDeleted = 0;
  for (const [name, group] of catsByName) {
    if (group.length <= 1) continue;

    const [keep, ...dupes] = group;
    const dupeIds = dupes.map((d) => d.id);

    console.log(`  "${name}": keeping ${keep.id}, removing ${dupes.length} duplicate(s)`);

    // Forum categories DO have cascade, but let's be explicit
    // Move threads from dupe categories to the kept one
    await db
      .update(forum_threads)
      .set({ categoryId: keep.id })
      .where(inArray(forum_threads.categoryId, dupeIds));

    await db.delete(forum_categories).where(inArray(forum_categories.id, dupeIds));
    catsDeleted += dupes.length;
  }

  console.log(`  Total forum categories removed: ${catsDeleted}`);

  // ── SET isFree ON TRUST COURSE ───────────────────────────
  console.log("\n═══ FIXING isFree FLAGS ═══");

  const updated = await db
    .update(courses)
    .set({ isFree: true, freePreviewLessons: 1 })
    .where(eq(courses.category, "Trust & Assets"))
    .returning({ id: courses.id, title: courses.title });

  for (const c of updated) {
    console.log(`  Set isFree=true on "${c.title}" (${c.id})`);
  }

  console.log("\n🎉 Cleanup complete!\n");
  process.exit(0);
}

cleanup().catch((err) => {
  console.error("❌ Cleanup failed:", err);
  process.exit(1);
});
