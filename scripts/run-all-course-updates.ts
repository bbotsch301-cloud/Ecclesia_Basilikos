/**
 * Runs all three course content updates.
 * npx tsx scripts/run-all-course-updates.ts
 */

import { updateCourse1 } from "./update-course-content";
import { updateCourse2 } from "./update-course2-content";
import { updateCourse3 } from "./update-course3-content";

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  Updating All Course Content");
  console.log("  Exhaustive Legal Citations Edition");
  console.log("═══════════════════════════════════════════\n");

  await updateCourse1();
  await updateCourse2();
  await updateCourse3();

  console.log("\n═══════════════════════════════════════════");
  console.log("  ✅ All courses updated successfully!");
  console.log("═══════════════════════════════════════════");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
