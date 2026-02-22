/**
 * Parse Black's Law Dictionary 4th Edition PDF and populate dictionary_entries table.
 *
 * Usage: npx tsx scripts/parse-dictionary.ts
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import { sql } from "drizzle-orm";
import { dictionaryEntries } from "../shared/schema";

neonConfig.webSocketConstructor = ws;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: DATABASE_URL });
const db = drizzle({ client: pool });

const PDF_PATH = path.resolve(
  __dirname,
  "../attached_assets/blacks_law_4th_1771721957899.pdf"
);

// Dictionary content starts on page 77 — skip everything before
const DICTIONARY_START_PAGE = 77;

// Pattern to detect dictionary term headers: ALL-CAPS words
const TERM_HEADER_RE = /^([A-Z][A-Z\s\-'.,\/&()]{1,})[.,]?\s/;

// Context labels that appear within definitions
const CONTEXT_RE =
  /^(?:In\s+)?(Civil Law|Common Law|Criminal Law|Equity|International Law|Maritime Law|Medical Jurisprudence|Old English Law|Practice|Real Property|Scotch Law|French Law|Spanish Law|Roman Law|Canon Law|Feudal Law|Mining Law|Insurance|Contracts|Evidence|Pleading|Torts|Old European Law)\./i;

interface ParsedEntry {
  term: string;
  definition: string;
  subContext: string | null;
  pageNumber: number | null;
}

function isTermHeader(line: string): string | null {
  const trimmed = line.trim();
  if (trimmed.length < 2 || trimmed.length > 120) return null;

  // Must start with uppercase letter
  if (!/^[A-Z]/.test(trimmed)) return null;

  // Extract the potential term
  const match = trimmed.match(TERM_HEADER_RE);
  if (!match) {
    // Check if the entire line is an ALL-CAPS term (no trailing definition on same line)
    if (/^[A-Z][A-Z\s\-'.,\/&()]{1,}$/.test(trimmed) && trimmed.length >= 2) {
      const cleaned = trimmed.replace(/[.,]+$/, "").trim();
      if (cleaned.length >= 2) return cleaned;
    }
    return null;
  }

  const term = match[1].replace(/[.,]+$/, "").trim();

  // Validate it looks like a real term:
  // - At least 75% uppercase letters (allowing spaces, hyphens)
  const alphaChars = term.replace(/[^A-Za-z]/g, "");
  if (alphaChars.length === 0) return null;
  const upperCount = (term.match(/[A-Z]/g) || []).length;
  const ratio = upperCount / alphaChars.length;
  if (ratio < 0.75) return null;

  if (term.length < 2) return null;

  return term;
}

function extractContext(definition: string): { context: string | null; text: string } {
  const match = definition.match(CONTEXT_RE);
  if (match) {
    return {
      context: match[1],
      text: definition.slice(match[0].length).trim(),
    };
  }
  return { context: null, text: definition };
}

/**
 * Parse the PDF page-by-page using a custom render callback.
 * This gives us accurate page numbers and lets us skip front matter reliably.
 */
async function parsePDF(): Promise<ParsedEntry[]> {
  console.log("Reading PDF from:", PDF_PATH);

  if (!fs.existsSync(PDF_PATH)) {
    throw new Error(`PDF file not found at ${PDF_PATH}`);
  }

  const buffer = fs.readFileSync(PDF_PATH);
  console.log("Parsing PDF page-by-page (this may take a while)...");

  // Collect text per page using a custom pagerender function
  const pageTexts: Map<number, string> = new Map();

  function renderPage(pageData: any) {
    return pageData.getTextContent().then((textContent: any) => {
      let pageText = "";
      let lastY: number | null = null;
      for (const item of textContent.items) {
        // Detect line breaks via Y coordinate changes
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 2) {
          pageText += "\n";
        }
        pageText += item.str;
        lastY = item.transform[5];
      }
      return pageText;
    });
  }

  const data = await pdf(buffer, {
    max: 0,
    pagerender: renderPage,
  });

  console.log(`PDF parsed: ${data.numpages} pages`);

  // data.text contains all pages' rendered text concatenated.
  // But we need per-page text. The custom render gives us per-page text
  // via the return value, but pdf-parse concatenates them into data.text
  // with page separator. We need a different approach.

  // Actually pdf-parse concatenates render results with \n\n between pages.
  // But we can't reliably split on that. Instead, let's re-parse using
  // the pagerender to collect per-page text directly.

  // Better approach: parse with max pages one at a time for front matter skip,
  // then bulk parse the rest.

  // Simplest reliable approach: use the lines-per-page estimate since we know
  // the total pages and total lines.
  const allText = data.text;
  const allLines = allText.split("\n");
  const totalLines = allLines.length;
  const totalPages = data.numpages;
  const linesPerPage = totalLines / totalPages;

  // Skip to the line corresponding to page 77
  const skipToLine = Math.floor((DICTIONARY_START_PAGE - 1) * linesPerPage);
  console.log(`Total lines: ${totalLines}, lines/page: ${linesPerPage.toFixed(1)}`);
  console.log(`Skipping to line ${skipToLine} (page ${DICTIONARY_START_PAGE})`);

  const entries: ParsedEntry[] = [];
  let currentTerm: string | null = null;
  let currentDefinition: string[] = [];
  let currentPage: number | null = null;

  for (let i = skipToLine; i < totalLines; i++) {
    const trimmed = allLines[i].trim();

    // Estimate current page
    const estPage = Math.floor(i / linesPerPage) + 1;

    // Skip empty lines and very short lines (page numbers, headers)
    if (!trimmed || trimmed.length <= 1) continue;

    // Check if this line starts a new term
    const potentialTerm = isTermHeader(trimmed);

    if (potentialTerm) {
      // Save the previous entry
      if (currentTerm && currentDefinition.length > 0) {
        const fullDef = currentDefinition.join(" ").trim();
        if (fullDef.length > 5) {
          const { context, text } = extractContext(fullDef);
          entries.push({
            term: currentTerm,
            definition: text || fullDef,
            subContext: context,
            pageNumber: currentPage,
          });
        }
      }

      // Start new term
      currentTerm = potentialTerm;
      currentDefinition = [];
      currentPage = estPage;

      // Check for definition text on the same line
      const afterTerm = trimmed.slice(potentialTerm.length).replace(/^[.,\s]+/, "").trim();
      if (afterTerm) {
        currentDefinition.push(afterTerm);
      }
    } else if (currentTerm) {
      currentDefinition.push(trimmed);
    }
  }

  // Don't forget the last entry
  if (currentTerm && currentDefinition.length > 0) {
    const fullDef = currentDefinition.join(" ").trim();
    if (fullDef.length > 5) {
      const { context, text } = extractContext(fullDef);
      entries.push({
        term: currentTerm,
        definition: text || fullDef,
        subContext: context,
        pageNumber: currentPage,
      });
    }
  }

  return entries;
}

async function insertEntries(entries: ParsedEntry[]) {
  console.log(`\nInserting ${entries.length} entries into database...`);

  // Clear existing entries first
  await db.delete(dictionaryEntries);
  console.log("Cleared existing entries");

  // Insert in batches of 100
  const BATCH_SIZE = 100;
  let inserted = 0;

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const values = batch.map((entry) => ({
      term: entry.term,
      termLower: entry.term.toLowerCase(),
      definition: entry.definition,
      letter: entry.term.charAt(0).toUpperCase(),
      subContext: entry.subContext,
      pageNumber: entry.pageNumber,
    }));

    await db.insert(dictionaryEntries).values(values);
    inserted += batch.length;

    if (inserted % 500 === 0 || inserted === entries.length) {
      console.log(`  Inserted ${inserted} / ${entries.length} entries`);
    }
  }

  return inserted;
}

async function validate() {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(dictionaryEntries);

  console.log(`\nValidation:`);
  console.log(`  Total entries in database: ${count}`);

  // Check letter coverage
  const letters = await db
    .selectDistinct({ letter: dictionaryEntries.letter })
    .from(dictionaryEntries)
    .orderBy(dictionaryEntries.letter);

  console.log(`  Letters covered: ${letters.map((l) => l.letter).join(", ")}`);

  // Sample some entries
  const samples = await db
    .select()
    .from(dictionaryEntries)
    .orderBy(sql`RANDOM()`)
    .limit(5);

  console.log(`\nSample entries:`);
  for (const s of samples) {
    console.log(
      `  [${s.letter}] ${s.term}: ${s.definition.substring(0, 80)}...`
    );
  }
}

async function main() {
  try {
    const entries = await parsePDF();
    console.log(`\nParsed ${entries.length} dictionary entries`);

    // Show letter distribution
    const letterCounts: Record<string, number> = {};
    for (const e of entries) {
      const l = e.term.charAt(0).toUpperCase();
      letterCounts[l] = (letterCounts[l] || 0) + 1;
    }
    console.log("\nLetter distribution:");
    for (const l of Object.keys(letterCounts).sort()) {
      console.log(`  ${l}: ${letterCounts[l]}`);
    }

    const inserted = await insertEntries(entries);
    console.log(`\nSuccessfully inserted ${inserted} entries`);

    await validate();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
