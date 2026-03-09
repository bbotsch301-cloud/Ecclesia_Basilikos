import { db } from "../server/db";
import { downloads } from "../shared/schema";

const trustDocuments = [
  {
    title: "New Covenant Trust",
    shortTitle: "New Covenant Trust",
    description:
      "The New Covenant Trust is the foundational trust instrument establishing your private express trust under common law. This document declares your covenant relationship with the Creator, establishes the trust's purpose, identifies the Grantor, Trustee, and Beneficiaries, and sets forth the governing principles rooted in Biblical law. It is the master document from which all other trust instruments derive their authority.",
    fileUrl: "",
    fileType: "PDF",
    fileSize: "",
    category: "Legal Templates",
    iconType: "scroll",
    whenToUse: JSON.stringify([
      "When establishing your private express trust for the first time",
      "When declaring your covenant standing and sovereign capacity under common law",
      "When creating the foundational instrument that governs all trust operations",
      "When asserting your God-given rights to hold and manage private property in trust",
    ]),
    whyItMatters:
      "The New Covenant Trust is the cornerstone of your trust estate. Without this foundational document, no other trust instrument carries lawful authority. It establishes your standing as a private man or woman operating under common law and Biblical covenant, securing your property and rights outside of statutory jurisdiction.",
    contents: JSON.stringify([
      "Declaration of Trust Purpose and Intent",
      "Identification of Grantor, Trustee, and Beneficiaries",
      "Trust Powers and Authorities",
      "Governing Law and Jurisdiction Clause",
      "Covenant Principles and Biblical Foundation",
      "Revocation and Amendment Provisions",
      "Signature and Witness Pages",
    ]),
    scriptureText:
      "But now hath he obtained a more excellent ministry, by how much also he is the mediator of a better covenant, which was established upon better promises.",
    scriptureReference: "Hebrews 8:6",
    isPublic: true,
    isPublished: true,
  },
  {
    title: "Certificate of Trust",
    shortTitle: "Certificate of Trust",
    description:
      "The Certificate of Trust is a summary document that verifies the existence and key details of your New Covenant Trust without disclosing the full trust instrument. This certificate is presented to banks, financial institutions, government agencies, and other third parties who require proof that the trust exists and that the Trustee has authority to act on its behalf.",
    fileUrl: "",
    fileType: "PDF",
    fileSize: "",
    category: "Legal Templates",
    iconType: "shield",
    whenToUse: JSON.stringify([
      "When opening bank accounts or financial accounts in the trust's name",
      "When dealing with institutions that require proof of trust existence",
      "When a third party needs to verify Trustee authority without seeing the full trust",
      "When conducting real estate transactions or transferring titled property into trust",
    ]),
    whyItMatters:
      "The Certificate of Trust protects your privacy by allowing you to prove the trust's existence and the Trustee's authority without revealing the full trust terms, beneficiaries, or assets. Most institutions will accept a Certificate of Trust in lieu of the complete trust document, keeping your private affairs confidential.",
    contents: JSON.stringify([
      "Trust Name and Date of Establishment",
      "Trustee Name and Authority Confirmation",
      "Trust Powers Summary",
      "Trust Identification Number (if applicable)",
      "Certification of Trust Existence",
      "Notary Acknowledgment Section",
    ]),
    scriptureText:
      "The secret things belong unto the LORD our God: but those things which are revealed belong unto us and to our children for ever.",
    scriptureReference: "Deuteronomy 29:29",
    isPublic: true,
    isPublished: true,
  },
  {
    title: "Schedule A — Trust Property",
    shortTitle: "Schedule A",
    description:
      "Schedule A is the property schedule attached to your New Covenant Trust that itemizes all assets, property, and interests held within the trust estate. This living document is updated each time property is conveyed into or out of the trust, serving as the official record of trust holdings.",
    fileUrl: "",
    fileType: "PDF",
    fileSize: "",
    category: "Legal Templates",
    iconType: "scale",
    whenToUse: JSON.stringify([
      "When initially funding the trust with property, assets, or interests",
      "When adding new real or personal property to the trust estate",
      "When removing or distributing property from the trust",
      "When providing an inventory of trust holdings for administrative purposes",
    ]),
    whyItMatters:
      "Schedule A serves as the definitive record of what the trust owns. Properly maintaining this schedule ensures clear title to trust property, prevents disputes over ownership, and provides an organized inventory that the Trustee can reference when managing or distributing trust assets. Without a current Schedule A, the trust's property holdings lack formal documentation.",
    contents: JSON.stringify([
      "Real Property Listings and Descriptions",
      "Personal Property and Tangible Assets",
      "Financial Accounts and Instruments",
      "Intellectual Property and Intangible Rights",
      "Date of Conveyance for Each Entry",
      "Trustee Acknowledgment and Signature Line",
    ]),
    scriptureText:
      "The earth is the LORD's, and the fulness thereof; the world, and they that dwell therein.",
    scriptureReference: "Psalm 24:1",
    isPublic: true,
    isPublished: true,
  },
];

async function seedTrustDownloads() {
  console.log("Seeding trust document downloads...");

  for (const doc of trustDocuments) {
    const [created] = await db.insert(downloads).values(doc).returning();
    console.log(`  Created: ${created.title} (id: ${created.id})`);
  }

  console.log("Done! 3 trust documents seeded and published.");
  process.exit(0);
}

seedTrustDownloads().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
