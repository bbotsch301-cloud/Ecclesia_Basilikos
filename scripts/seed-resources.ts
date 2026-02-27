/**
 * Seed the resources table with Trust & Stewardship PDFs.
 *
 * Usage: npx tsx scripts/seed-resources.ts
 */

import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq, like } from "drizzle-orm";
import ws from "ws";
import { resources, users } from "../shared/schema";

neonConfig.webSocketConstructor = ws;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: DATABASE_URL });
const db = drizzle({ client: pool });

// Three tiers of relevance. Within each tier, last-inserted = newest createdAt = appears first.
const resourceEntries = [
  // =============================================
  // TIER 3: Supplementary Reference
  // Supporting material, historical documents, dictionaries
  // =============================================
  {
    title: "United States Stamp Manual",
    description: "Historical reference on U.S. revenue stamps and their legal applications in commerce and trade.",
    category: "Supplementary Reference",
    fileName: "United-States-Stamp-Manual.pdf",
  },
  {
    title: "W-4 Process Guide",
    description: "Walkthrough of the W-4 form process and its implications for tax withholding and lawful exemptions.",
    category: "Supplementary Reference",
    fileName: "W4-Process-Guide.pdf",
  },
  {
    title: "Chambers Etymological Dictionary (1874)",
    description: "Classic 1874 etymological dictionary useful for understanding the original meanings of legal and commercial terms.",
    category: "Supplementary Reference",
    fileName: "Chambers-Etymological-Dictionary-1874.pdf",
  },
  {
    title: "Bouvier's Law Dictionary (1856)",
    description: "Foundational American law dictionary from 1856, essential for understanding legal terminology as originally defined.",
    category: "Supplementary Reference",
    fileName: "Bouviers-Law-Dictionary-1856.pdf",
  },
  {
    title: "Articles of Incorporation — U.S. Corp",
    description: "Template and reference for articles of incorporation, illustrating the corporate structure of the United States.",
    category: "Supplementary Reference",
    fileName: "Articles-of-Incorporation-US-Corp.pdf",
  },
  {
    title: "SEC Syllabus",
    description: "Securities and Exchange Commission syllabus covering regulatory frameworks and compliance topics.",
    category: "Supplementary Reference",
    fileName: "SEC-Syllabus.pdf",
  },
  {
    title: "Public Officials Fidelity Bonds",
    description: "Reference on fidelity bonds required of public officials and their role in accountability and surety.",
    category: "Supplementary Reference",
    fileName: "Public-Officials-Fidelity-Bonds.pdf",
  },
  {
    title: "Money, Wealth & Life Insurance",
    description: "Explores the intersection of wealth building, life insurance as a financial instrument, and asset protection.",
    category: "Supplementary Reference",
    fileName: "Money-Wealth-Life-Insurance.pdf",
  },
  {
    title: "Gold Standard Act of 1900",
    description: "Historical legislation establishing the gold standard as the basis for U.S. currency and monetary policy.",
    category: "Supplementary Reference",
    fileName: "Gold-Standard-Act-1900.pdf",
  },
  {
    title: "Supreme Court — 318 U.S. 363",
    description: "Key Supreme Court case at 318 U.S. 363 with implications for trust law and legal standing.",
    category: "Supplementary Reference",
    fileName: "Supreme-Court-318-US-363.pdf",
  },

  // =============================================
  // TIER 2: Core Trust & Legal Resources
  // Important working documents — trust admin, banking law,
  // legal identity, templates, and commercial law
  // =============================================
  {
    title: "Legal Name Addiction",
    description: "Explores the concept of the legal name as a construct and its implications for personal sovereignty and identity.",
    category: "Core Trust & Legal Resources",
    fileName: "Legal-Name-Addiction.pdf",
  },
  {
    title: "Person Has No Body",
    description: "Examination of the legal concept of 'person' versus the living man or woman, and the distinction in law.",
    category: "Core Trust & Legal Resources",
    fileName: "Person-Has-No-Body.pdf",
  },
  {
    title: "Citizen — Legal Fiction",
    description: "Analyzes the legal fiction of citizenship and the difference between a citizen and a sovereign individual.",
    category: "Core Trust & Legal Resources",
    fileName: "Citizen-Legal-Fiction.pdf",
  },
  {
    title: "A Reasonable Doubt — Part 1",
    description: "Detailed examination of reasonable doubt in legal proceedings and its application in defending rights.",
    category: "Core Trust & Legal Resources",
    fileName: "A-Reasonable-Doubt-Part-1.pdf",
  },
  {
    title: "Presumptions of Court",
    description: "Identifies the key presumptions courts operate under and how to rebut them in legal proceedings.",
    category: "Core Trust & Legal Resources",
    fileName: "Presumptions-of-Court.pdf",
  },
  {
    title: "Negotiable Instruments Act",
    description: "Full text of the Negotiable Instruments Act covering promissory notes, bills of exchange, and checks.",
    category: "Core Trust & Legal Resources",
    fileName: "Negotiable-Instruments-Act.pdf",
  },
  {
    title: "Bills of Exchange Act 1882",
    description: "Complete text of the Bills of Exchange Act 1882, governing negotiable instruments in common law jurisdictions.",
    category: "Core Trust & Legal Resources",
    fileName: "Bills-of-Exchange-Act-1882.pdf",
  },
  {
    title: "Banking Act of 1933",
    description: "Full text of the Banking Act of 1933 (Glass-Steagall), which separated commercial and investment banking.",
    category: "Core Trust & Legal Resources",
    fileName: "Banking-Act-of-1933.pdf",
  },
  {
    title: "Top Secret Banker's Manual",
    description: "Reveals the inner workings of banking operations, fractional reserve lending, and how banks create money.",
    category: "Core Trust & Legal Resources",
    fileName: "Top-Secret-Bankers-Manual.pdf",
  },
  {
    title: "The Legalized Crime of Banking",
    description: "Exposes the banking system's legal framework, examining how banks profit through debt creation and interest.",
    category: "Core Trust & Legal Resources",
    fileName: "The-Legalized-Crime-of-Banking.pdf",
  },
  {
    title: "Legal Aspects of Business",
    description: "Comprehensive overview of business law fundamentals including contracts, liability, and commercial transactions.",
    category: "Core Trust & Legal Resources",
    fileName: "Legal-Aspects-of-Business.pdf",
  },
  {
    title: "Essential Estate Planning Guide",
    description: "Practical guide to estate planning covering wills, trusts, powers of attorney, and asset protection strategies.",
    category: "Core Trust & Legal Resources",
    fileName: "Essential-Estate-Planning-Guide.pdf",
  },
  {
    title: "Sample Irrevocable Trust Declaration",
    description: "Sample irrevocable trust declaration template with full legal language for grantor, trustees, and trust estate provisions.",
    category: "Core Trust & Legal Resources",
    fileName: "Sample-Irrevocable-Trust-Declaration.pdf",
  },
  {
    title: "Living Trust — Joint Declaration (California)",
    description: "Joint declaration of living trust template for California, covering co-trustees and community property provisions.",
    category: "Core Trust & Legal Resources",
    fileName: "Living-Trust-Joint-Declaration-CA.pdf",
  },
  {
    title: "UCS Declaration of Trust",
    description: "Universal Community Service declaration of trust template for establishing and operating a lawful trust.",
    category: "Core Trust & Legal Resources",
    fileName: "UCS-Declaration-of-Trust.pdf",
  },
  {
    title: "Public Declaration of Trust",
    description: "Public declaration of trust template for recording and establishing a trust in the public record.",
    category: "Core Trust & Legal Resources",
    fileName: "Public-Declaration-of-Trust.pdf",
  },
  {
    title: "Trust Underwriting Manual",
    description: "Manual covering trust underwriting standards, title insurance, and due diligence requirements for trust transactions.",
    category: "Core Trust & Legal Resources",
    fileName: "Trust-Underwriting-Manual.pdf",
  },
  {
    title: "UBOT — Unincorporated Business Organization Trust",
    description: "Guide to establishing and operating an Unincorporated Business Organization Trust for asset protection and commerce.",
    category: "Core Trust & Legal Resources",
    fileName: "UBOT-Unincorporated-Business-Organization-Trust.pdf",
  },
  {
    title: "The Private Trust Company",
    description: "Guide to creating a private trust company structure for high-net-worth asset management and estate planning.",
    category: "Core Trust & Legal Resources",
    fileName: "The-Private-Trust-Company.pdf",
  },
  {
    title: "Trust Funding Instructions",
    description: "Step-by-step instructions for properly funding a trust, including transferring assets and titling property.",
    category: "Core Trust & Legal Resources",
    fileName: "Trust-Funding-Instructions.pdf",
  },
  {
    title: "Trust Accounting Fundamentals",
    description: "Covers the essentials of trust accounting: record-keeping, distributions, reporting, and fiduciary obligations.",
    category: "Core Trust & Legal Resources",
    fileName: "Trust-Accounting-Fundamentals.pdf",
  },

  // =============================================
  // TIER 1: Essential Reading
  // Must-read foundational documents — start here
  // =============================================
  {
    title: "Trusts — General Reference",
    description: "Broad reference guide covering trust types, creation, administration, and legal principles across jurisdictions.",
    category: "Essential Reading",
    fileName: "Trusts-General-Reference.pdf",
  },
  {
    title: "Lawfully Yours",
    description: "Practical guide to understanding your lawful rights, legal standing, and how to navigate the legal system.",
    category: "Essential Reading",
    fileName: "Lawfully-Yours.pdf",
  },
  {
    title: "Trusts and Duties of Trustees",
    description: "In-depth instruction paper on trust administration, fiduciary duties, and the legal responsibilities of trustees.",
    category: "Essential Reading",
    fileName: "Trusts-and-Duties-of-Trustees.pdf",
  },
  {
    title: "Ten Essential Maxims of Commercial Law",
    description: "The ten foundational maxims that govern commercial law, essential for understanding commerce and trust relationships.",
    category: "Essential Reading",
    fileName: "Ten-Essential-Maxims-of-Commercial-Law.pdf",
  },
  {
    title: "Fundamentals of Trusts",
    description: "Core principles of trust law including formation, types of trusts, trustee duties, and beneficiary rights.",
    category: "Essential Reading",
    fileName: "Fundamentals-of-Trusts.pdf",
  },
  {
    title: "Maxims of Law",
    description: "Collection of fundamental legal maxims that form the bedrock of common law and equity jurisprudence.",
    category: "Essential Reading",
    fileName: "Maxims-of-Law.pdf",
  },
  {
    title: "Express Trusts Under Common Law",
    description: "Comprehensive treatise on express trusts under common law, covering creation, operation, and legal standing.",
    category: "Essential Reading",
    fileName: "Express-Trusts-Under-Common-Law.pdf",
  },
  {
    title: "Essentials of a Trust",
    description: "Concise yet thorough guide to the essential elements required to create and maintain a valid trust.",
    category: "Essential Reading",
    fileName: "Essentials-of-a-Trust.pdf",
  },
  {
    title: "Weisse's Concise Trustee Handbook",
    description: "The definitive concise handbook for trustees covering duties, powers, liabilities, and best practices in trust administration.",
    category: "Essential Reading",
    fileName: "Weisses-Concise-Trustee-Handbook.pdf",
  },
  {
    title: "Common Law Handbook",
    description: "Essential handbook on common law principles, rights, and remedies — a foundational resource for understanding lawful governance.",
    category: "Essential Reading",
    fileName: "Common-Law-Handbook.pdf",
  },
];

async function main() {
  console.log("Finding admin user...");

  const [adminUser] = await db
    .select()
    .from(users)
    .where(eq(users.role, "admin"))
    .limit(1);

  if (!adminUser) {
    console.error("No admin user found. Please create an admin user first.");
    process.exit(1);
  }

  console.log(`Using admin user: ${adminUser.email} (${adminUser.id})`);

  // Clear all seeded resources (those with /resources/ file URLs)
  const deleted = await db
    .delete(resources)
    .where(like(resources.fileUrl, "/resources/%"))
    .returning();

  if (deleted.length > 0) {
    console.log(`Cleared ${deleted.length} existing seeded resources.`);
  }

  console.log(`Inserting ${resourceEntries.length} resources...`);

  for (let i = 0; i < resourceEntries.length; i++) {
    const entry = resourceEntries[i];
    const createdAt = new Date(Date.now() - (resourceEntries.length - i) * 1000);

    await db.insert(resources).values({
      title: entry.title,
      description: entry.description,
      category: entry.category,
      fileUrl: `/resources/${entry.fileName}`,
      fileType: "pdf",
      isPublished: true,
      createdById: adminUser.id,
      createdAt,
    });

    console.log(`  [${i + 1}/${resourceEntries.length}] [${entry.category}] ${entry.title}`);
  }

  console.log("\nDone! All resources seeded successfully.");
  await pool.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
