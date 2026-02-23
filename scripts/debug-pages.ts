/**
 * Debug script to inspect raw text items on specific PDF pages.
 * Usage: npx tsx scripts/debug-pages.ts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDF_PATH = path.resolve(
  __dirname,
  "../attached_assets/blacks_law_4th_1771721957899.pdf"
);

const buffer = fs.readFileSync(PDF_PATH);

const debugPages = [1069, 489];
const pageItems: Map<number, any[]> = new Map();

function renderPage(pageData: any) {
  const pageNum = pageData.pageIndex + 1;
  return pageData.getTextContent().then((tc: any) => {
    if (debugPages.includes(pageNum)) {
      const items = tc.items
        .filter((i: any) => i.str && i.str.trim())
        .map((i: any) => ({
          str: i.str,
          x: Math.round(i.transform[4] * 10) / 10,
          y: Math.round(i.transform[5] * 10) / 10,
        }));
      pageItems.set(pageNum, items);
    }
    return "";
  });
}

pdf(buffer, { max: 0, pagerender: renderPage }).then(() => {
  for (const pg of debugPages) {
    const items = pageItems.get(pg) || [];
    console.log(`\n=== PAGE ${pg} (${items.length} items) ===`);

    // Find items containing relevant terms
    const relevant = items.filter((i: any) =>
      /HUMAN|CORPUS|NOTITIA|JUST|ATQUE|IESTIMA|RECIPIT/i.test(i.str)
    );
    console.log("Relevant items:");
    for (const item of relevant) {
      console.log(`  x=${item.x} y=${item.y} str="${item.str}"`);
    }

    // Show all items sorted by Y desc then X asc
    const sorted = [...items].sort((a: any, b: any) => {
      const dy = b.y - a.y;
      if (Math.abs(dy) > 2) return dy > 0 ? 1 : -1;
      return a.x - b.x;
    });
    console.log(`\nAll ${sorted.length} items (sorted Y desc, X asc):`);
    for (let i = 0; i < sorted.length; i++) {
      const s = sorted[i];
      const col = s.x < 150 ? "L" : "R";
      console.log(`  [${col}] x=${s.x} y=${s.y} str="${s.str}"`);
    }
  }
});
