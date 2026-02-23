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

// Dictionary content starts on page 79 — skip everything before
const DICTIONARY_START_PAGE = 79;

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
 * Column-aware text item used during rendering.
 */
interface TextItem {
  str: string;
  x: number;
  y: number;
}

/**
 * Column midpoint — items with x < this go to the left column, others to the right.
 */
const COLUMN_SPLIT_X = 150;

/**
 * Running headers appear at the very top of the page (high Y values in PDF coords).
 * Page numbers / footers appear at the very bottom (low Y values).
 */
const HEADER_Y_THRESHOLD = 655;
const FOOTER_Y_THRESHOLD = 50;

/**
 * Render a single column of text items into lines.
 * Items are already sorted top-to-bottom. We detect line breaks when
 * the Y coordinate changes by more than 2 units.
 */
function renderColumn(items: TextItem[]): string {
  if (items.length === 0) return "";

  // Sort by Y descending (top of page first in PDF coords), then X ascending
  items.sort((a, b) => {
    const dy = b.y - a.y;
    if (Math.abs(dy) > 2) return dy > 0 ? 1 : -1;
    return a.x - b.x;
  });

  let text = "";
  let lastY: number | null = null;

  for (const item of items) {
    if (lastY !== null && Math.abs(item.y - lastY) > 2) {
      text += "\n";
    }
    text += item.str;
    lastY = item.y;
  }

  return text;
}

/**
 * Parse the PDF page-by-page using a column-aware custom render callback.
 * Black's Law Dictionary 4th Ed uses a two-column layout. We split text items
 * into left and right columns by X coordinate, render each separately, then
 * concatenate left-column text before right-column text per page.
 */
async function parsePDF(): Promise<ParsedEntry[]> {
  console.log("Reading PDF from:", PDF_PATH);

  if (!fs.existsSync(PDF_PATH)) {
    throw new Error(`PDF file not found at ${PDF_PATH}`);
  }

  const buffer = fs.readFileSync(PDF_PATH);
  console.log("Parsing PDF page-by-page (this may take a while)...");

  // Collect text per page using a closure — pagerender return values
  // are concatenated by pdf-parse, but we also store them ourselves.
  const pageTexts: Map<number, string> = new Map();

  function renderPage(pageData: any) {
    const pageNum: number = pageData.pageIndex + 1; // pageIndex is 0-based

    return pageData.getTextContent().then((textContent: any) => {
      const leftItems: TextItem[] = [];
      const rightItems: TextItem[] = [];

      for (const item of textContent.items) {
        if (!item.str || item.str.trim() === "") continue;

        const x: number = item.transform[4];
        const y: number = item.transform[5];

        // Filter out running headers and page footers
        if (y > HEADER_Y_THRESHOLD) continue;
        if (y < FOOTER_Y_THRESHOLD) continue;

        const ti: TextItem = { str: item.str, x, y };

        if (x < COLUMN_SPLIT_X) {
          leftItems.push(ti);
        } else {
          rightItems.push(ti);
        }
      }

      const leftText = renderColumn(leftItems);
      const rightText = renderColumn(rightItems);

      // Combine left column first, then right column
      const parts: string[] = [];
      if (leftText) parts.push(leftText);
      if (rightText) parts.push(rightText);
      const combined = parts.join("\n");

      pageTexts.set(pageNum, combined);

      // Return something for pdf-parse (it concatenates return values)
      return combined;
    });
  }

  const data = await pdf(buffer, {
    max: 0,
    pagerender: renderPage,
  });

  console.log(`PDF parsed: ${data.numpages} pages, collected ${pageTexts.size} page texts`);

  // Helper: finalize an entry, handling hyphenated term names and word-break joins
  function finalizeEntry(
    term: string,
    definition: string[],
    page: number | null
  ): ParsedEntry | null {
    let fullDef = definition.join(" ").trim();
    let finalTerm = term;

    // If term ends with '-', the first word of the definition is a continuation
    if (finalTerm.endsWith("-") && fullDef.length > 0) {
      const m = fullDef.match(/^([A-Z]+)([.,]\s*)([\s\S]*)/);
      if (m) {
        finalTerm = finalTerm.slice(0, -1) + m[1]; // join hyphenated word
        fullDef = m[3].trim();
      }
    }

    // Fix hyphenated word breaks in definitions (e.g. "knowl- edge" → "knowledge")
    fullDef = fullDef.replace(/(\w)- (\w)/g, "$1$2").trim();

    if (fullDef.length <= 5) return null;

    const { context, text } = extractContext(fullDef);
    return {
      term: finalTerm,
      definition: text || fullDef,
      subContext: context,
      pageNumber: page,
    };
  }

  // Now iterate through pages sequentially starting from DICTIONARY_START_PAGE
  const entries: ParsedEntry[] = [];
  let currentTerm: string | null = null;
  let currentDefinition: string[] = [];
  let currentPage: number | null = null;

  for (let pageNum = DICTIONARY_START_PAGE; pageNum <= data.numpages; pageNum++) {
    const pageText = pageTexts.get(pageNum);
    if (!pageText) continue;

    const lines = pageText.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines and very short lines
      if (!trimmed || trimmed.length <= 1) continue;

      // Check if previous content ended with a hyphen (word break across lines)
      const lastDefLine =
        currentDefinition.length > 0
          ? currentDefinition[currentDefinition.length - 1]
          : null;
      const prevHyphen =
        (currentTerm?.endsWith("-") && currentDefinition.length === 0) ||
        (lastDefLine?.endsWith("-") ?? false);

      // Check if this line starts a new term
      const potentialTerm = isTermHeader(trimmed);

      if (potentialTerm && !prevHyphen) {
        const afterTerm = trimmed
          .slice(potentialTerm.length)
          .replace(/^[.,\s]+/, "")
          .trim();
        const lineIsAllCaps = !/[a-z]/.test(trimmed);

        if (currentTerm && currentDefinition.length === 0) {
          // Previous term has no definition yet — possible multi-line term
          if (lineIsAllCaps) {
            // Entire line is uppercase: merge into current term name
            currentTerm =
              currentTerm +
              " " +
              trimmed.replace(/[.,]+$/, "").trim();
          } else {
            // Uppercase prefix + lowercase definition: extend term, start definition
            currentTerm = currentTerm + " " + potentialTerm;
            if (afterTerm) {
              currentDefinition.push(afterTerm);
            }
          }
        } else {
          // Normal case: save previous entry and start a new term
          if (currentTerm && currentDefinition.length > 0) {
            const entry = finalizeEntry(
              currentTerm,
              currentDefinition,
              currentPage
            );
            if (entry) entries.push(entry);
          }

          currentTerm = potentialTerm;
          currentDefinition = [];
          currentPage = pageNum;

          if (afterTerm) {
            currentDefinition.push(afterTerm);
          }
        }
      } else if (currentTerm) {
        currentDefinition.push(trimmed);
      }
    }
  }

  // Don't forget the last entry
  if (currentTerm && currentDefinition.length > 0) {
    const entry = finalizeEntry(currentTerm, currentDefinition, currentPage);
    if (entry) entries.push(entry);
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
