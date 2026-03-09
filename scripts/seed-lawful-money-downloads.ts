/**
 * Seeds downloadable documents for Course 1: Lawful Money Redemption.
 * Run with: npx tsx scripts/seed-lawful-money-downloads.ts
 */

import { db } from "../server/db";
import { downloads, courses } from "../shared/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Seeding Lawful Money course downloads...\n");

  // Find the Lawful Money course
  const [course] = await db
    .select({ id: courses.id })
    .from(courses)
    .where(eq(courses.category, "Lawful Money"))
    .limit(1);

  if (!course) {
    console.error("Lawful Money course not found!");
    process.exit(1);
  }

  const courseId = course.id;
  console.log(`Found course ID: ${courseId}\n`);

  const docs = [
    {
      title: "Lawful Money Redemption Ledger",
      shortTitle: "Redemption Ledger",
      description:
        "Printable ledger template for tracking all deposits redeemed in lawful money. Includes columns for date, source, instrument type, amount, endorsement confirmation, bank, and running total. Designed as a contemporaneous business record under FRE 803(6).",
      fileUrl: "/documents/lawful-money-ledger.html",
      fileType: "HTML",
      fileSize: "Printable",
      category: "Lawful Money",
      iconType: "file-spreadsheet",
      whenToUse:
        "Use this ledger to record every single deposit you redeem in lawful money. Begin a new ledger each calendar year. Reconcile monthly against bank statements.",
      whyItMatters:
        "A contemporaneous ledger is your primary evidence that you consistently demanded lawful money under 12 U.S.C. § 411. Without it, you have no proof of your ongoing demand.",
      isPublic: false,
      isPublished: true,
      courseId,
    },
    {
      title: "Endorsement Stamp Template",
      shortTitle: "Stamp Template",
      description:
        "Complete guide to the lawful money endorsement: exact stamp language, red ink specifications, placement on checks, ordering a custom stamp, handling electronic deposits, and responding to bank teller objections with specific legal citations.",
      fileUrl: "/documents/endorsement-stamp-template.html",
      fileType: "HTML",
      fileSize: "Printable",
      category: "Lawful Money",
      iconType: "stamp",
      whenToUse:
        "Reference this before ordering your endorsement stamp. Use the objection responses table whenever a bank teller questions your endorsement.",
      whyItMatters:
        "The endorsement is the mechanism by which you exercise your statutory right under 12 U.S.C. § 411. The exact language matters. Silence is acquiescence — your endorsement breaks that silence.",
      isPublic: false,
      isPublished: true,
      courseId,
    },
    {
      title: "Annual Affidavit of Lawful Money Demand",
      shortTitle: "Annual Affidavit",
      description:
        "Formal affidavit template declaring your year-long demand for lawful money under 12 U.S.C. § 411. Includes numbered declarations, perjury statement under 28 U.S.C. § 1746, signature block, and optional notary block. Ready to sign and file.",
      fileUrl: "/documents/annual-affidavit-lawful-money.html",
      fileType: "HTML",
      fileSize: "Printable",
      category: "Lawful Money",
      iconType: "file-check",
      whenToUse:
        "Complete and sign at the end of each calendar year. Notarize if possible. File with your annual tax records and retain indefinitely.",
      whyItMatters:
        "This affidavit creates a sworn, dated record of your consistent lawful money demand for the entire year. Under 28 U.S.C. § 1746, it carries the weight of sworn testimony.",
      isPublic: false,
      isPublished: true,
      courseId,
    },
    {
      title: "Tax Documentation Checklist",
      shortTitle: "Tax Checklist",
      description:
        "Comprehensive checklist for organizing your lawful money tax records: core documentation, bank correspondence, tax filing documents, and year-end summary items. Includes annual timeline and retention guidance.",
      fileUrl: "/documents/tax-documentation-checklist.html",
      fileType: "HTML",
      fileSize: "Printable",
      category: "Lawful Money",
      iconType: "clipboard-check",
      whenToUse:
        "Use monthly to verify you're maintaining proper records. Complete the full checklist at year-end before filing taxes. Review with your tax professional.",
      whyItMatters:
        "Complete documentation is the difference between a defensible position and a vulnerable one. This checklist ensures nothing falls through the cracks.",
      isPublic: false,
      isPublished: true,
      courseId,
    },
    {
      title: "Quick Reference Citation Card",
      shortTitle: "Citation Card",
      description:
        "Two-column reference card with all essential legal citations: federal statutes, constitutional provisions, UCC sections, Supreme Court cases, circuit court rulings, key definitions, and the endorsement language. Designed to print on a single page for quick reference.",
      fileUrl: "/documents/citation-reference-card.html",
      fileType: "HTML",
      fileSize: "Printable",
      category: "Lawful Money",
      iconType: "bookmark",
      whenToUse:
        "Keep a printed copy with your endorsement stamp and ledger. Reference when speaking with bank staff, tax professionals, or anyone who questions the legal basis.",
      whyItMatters:
        "Having the exact citations at your fingertips gives you confidence and credibility. Every claim in this course is backed by statute, case law, or constitutional provision.",
      isPublic: false,
      isPublished: true,
      courseId,
    },
  ];

  // Also update existing lawful money downloads to link them to the course
  const existingIds = [
    "6f2b73bc-1d10-483c-b099-0f47d92a66f9", // Lawful Money Endorsement Guide
    "9bd99fdb-1614-4faa-a486-f04263f73a3b", // Lawful Money Redemption Ledger Template
  ];

  for (const id of existingIds) {
    await db
      .update(downloads)
      .set({ courseId, isPublished: true })
      .where(eq(downloads.id, id));
    console.log(`  Linked existing download ${id} to course`);
  }

  // Insert new documents
  for (const doc of docs) {
    // Check if one with same title already exists for this course
    const [existing] = await db
      .select({ id: downloads.id })
      .from(downloads)
      .where(eq(downloads.title, doc.title))
      .limit(1);

    if (existing) {
      await db.update(downloads).set(doc).where(eq(downloads.id, existing.id));
      console.log(`  Updated: ${doc.title}`);
    } else {
      await db.insert(downloads).values(doc);
      console.log(`  Created: ${doc.title}`);
    }
  }

  console.log("\n✅ All Lawful Money downloads seeded!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
