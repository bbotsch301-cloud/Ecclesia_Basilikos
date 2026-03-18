/**
 * Seed script for Phase 1 pillar content:
 * - 3 courses (one per pillar) with 6-8 lessons each
 * - Pillar-aligned forum categories
 * - Pillar-aligned download entries
 *
 * Run with: npx tsx scripts/seed-pillar-content.ts
 */

import { db } from "../server/db";
import { courses, lessons, forum_categories, downloads, users } from "../shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding pillar content...\n");

  // Find an admin user to use as createdById
  const [admin] = await db
    .select()
    .from(users)
    .where(eq(users.role, "admin"))
    .limit(1);

  if (!admin) {
    console.error("❌ No admin user found. Please create an admin user first.");
    process.exit(1);
  }

  console.log(`Using admin: ${admin.email}\n`);

  // ═══════════════════════════════════════════════════════
  // COURSES & LESSONS
  // ═══════════════════════════════════════════════════════

  const courseData = [
    {
      title: "Lawful Money Redemption",
      description:
        "A comprehensive course on understanding and exercising your statutory right to redeem Federal Reserve Notes in lawful money under 12 USC § 411. Learn the law, the process, and the implications.",
      category: "Lawful Money",
      level: "beginner",
      duration: "Self-paced",
      price: 0,
      isPublished: true,
      createdById: admin.id,
      lessons: [
        {
          title: "Introduction — What Is Lawful Money?",
          description: "Understanding the fundamental distinction between Federal Reserve Notes and lawful money of the United States.",
          content: `# What Is Lawful Money?

Lawful money is the constitutionally recognized currency of the United States — distinct from Federal Reserve Notes, which are debt instruments issued by a private banking system.

## The Core Distinction

**Federal Reserve Notes** are obligations (debts) of the United States, issued through the Federal Reserve System. They are not money in the constitutional sense — they are promises to pay.

**Lawful money** is non-debt currency authorized under the Constitution. It represents actual value, not a liability.

## Why This Matters

When you use Federal Reserve Notes without redemption, a legal presumption arises that you are voluntarily using private credit — the Federal Reserve's credit system. That presumption carries obligations you may not be aware of.

This course will teach you:
- The full text and meaning of 12 USC § 411
- How Federal Reserve Notes differ from lawful money
- What redemption means and how to exercise it
- The tax and legal implications of lawful money redemption
- How to maintain consistent practice

## Key Terms
- **Lawful Money**: Non-debt currency authorized by the Constitution
- **Federal Reserve Note (FRN)**: A debt instrument issued by the Federal Reserve
- **Redemption**: The act of demanding lawful money in exchange for FRNs
- **Private Credit**: The credit system of the Federal Reserve
- **Public Money**: Money operating under constitutional authority`,
          order: 1,
          duration: "15 min",
        },
        {
          title: "The Statute — 12 USC § 411 Explained",
          description: "A detailed examination of the statute that gives you the right to demand lawful money.",
          content: `# 12 USC § 411 — The Full Statute

## The Text

"Federal reserve notes, to be issued at the discretion of the Board of Governors of the Federal Reserve System for the purpose of making advances to Federal reserve banks… shall be obligations of the United States and shall be receivable by all national and member banks and Federal reserve banks and for all taxes, customs, and other public dues. They shall be redeemed in lawful money on demand at the Treasury Department of the United States, in the city of Washington, District of Columbia, or at any Federal Reserve bank."

## Breaking It Down

### "shall be obligations of the United States"
Federal Reserve Notes are debts — obligations. They are not assets. Every note in your wallet represents a liability of the United States government.

### "They shall be redeemed in lawful money on demand"
This is the critical language. "Shall" is mandatory — not permissive. "On demand" means when you ask for it. This is a statutory right.

### "at the Treasury Department... or at any Federal Reserve bank"
The statute specifies where redemption can be demanded. In practice, this is exercised through the banking system via endorsement.

## Historical Context

The Federal Reserve Act was passed in 1913. Section 16 (codified as 12 USC § 411) established that Federal Reserve Notes would be redeemable in lawful money. This provision has never been repealed.

## What This Means for You

You have a standing statutory right to demand that your Federal Reserve Notes be redeemed in lawful money. This right is exercised through a specific endorsement process on your deposits.`,
          order: 2,
          duration: "20 min",
        },
        {
          title: "Federal Reserve Notes vs. Lawful Money",
          description: "Understanding what makes Federal Reserve Notes debt instruments and how lawful money differs.",
          content: `# Federal Reserve Notes vs. Lawful Money

## The Nature of Federal Reserve Notes

Federal Reserve Notes are:
- **Debt instruments** — every note represents an obligation, not an asset
- **Issued by a private corporation** — the Federal Reserve System is not a government agency
- **Created from nothing** — issued through fractional reserve lending
- **Subject to inflation** — their value diminishes as more are created
- **Presumed private credit** — using them without redemption creates a legal presumption

## The Nature of Lawful Money

Lawful money is:
- **Non-debt currency** — represents actual value, not a liability
- **Authorized by Congress** — under constitutional authority (Article I, Section 8)
- **Not created through lending** — exists independent of the credit system
- **A statutory right** — 12 USC § 411 guarantees redemption

## The Legal Presumption

This is the critical concept. When you deposit Federal Reserve Notes into a bank without redemption:

1. You are presumed to be using **private credit**
2. Private credit usage creates **taxable events**
3. These taxable events fall under the **Internal Revenue Code**
4. You are treated as a participant in the **Federal Reserve system**

When you redeem in lawful money:

1. You are exercising a **statutory right**
2. The transaction character changes to **public money**
3. The presumption of private credit usage is **removed**
4. Your standing shifts to **public law** rather than private banking agreements

## The Difference in Practice

The physical notes in your hand don't change. What changes is the **legal character** of the transaction. Redemption is a declaration of how the money is being received — under public law, not private credit.`,
          order: 3,
          duration: "20 min",
        },
        {
          title: "The Restrictive Endorsement — How to Redeem",
          description: "Step-by-step instructions on writing a proper lawful money endorsement.",
          content: `# The Restrictive Endorsement

## What Is a Restrictive Endorsement?

A restrictive endorsement is a notation placed on a negotiable instrument (check, deposit slip) that restricts how the funds are to be handled. In the context of lawful money, it is a demand for redemption.

## The Endorsement Language

On the back of every check you deposit, above your signature, write:

**"Redeemed in Lawful Money Pursuant to Title 12 USC §411"**

Then sign your name below.

## Where to Place It

- **Checks received**: On the back, in the endorsement area, above your signature
- **Deposit slips**: Write or stamp the endorsement on the deposit slip
- **Direct deposits**: Provide a letter to your employer/payer with the endorsement language, requesting it be applied to all deposits

## Step-by-Step Process

### Step 1: Get a Stamp (Recommended)
Purchase a self-inking stamp with the endorsement language. This ensures consistency and legibility on every deposit.

### Step 2: Endorse Every Instrument
Every check, money order, or negotiable instrument you receive should be endorsed with the lawful money language before deposit.

### Step 3: Apply to Deposit Slips
Stamp or write the endorsement on your bank deposit slips as well.

### Step 4: Notify Your Bank (Optional but Recommended)
Some practitioners send a letter to their bank informing them that all deposits are being redeemed in lawful money pursuant to 12 USC § 411.

### Step 5: Direct Deposit Letter
If you receive direct deposits (payroll, etc.), draft a letter to the depositing entity with the endorsement language.

## Important Notes

- **Consistency is essential** — every deposit, every time
- **This is a demand, not a request** — the language of the statute uses "shall"
- **Keep copies of everything** — endorsed checks, deposit slips, letters
- **Banks may not understand** — this is normal. The endorsement is a legal instrument, not a banking instruction`,
          order: 4,
          duration: "25 min",
        },
        {
          title: "Tax Implications of Lawful Money Redemption",
          description: "How lawful money redemption may affect your tax position.",
          content: `# Tax Implications

## The Connection Between Money and Taxes

The Internal Revenue Code imposes taxes on income. But the definition of "income" and the nature of the money involved are directly related to the type of money being used.

## Private Credit and Taxable Income

When you use Federal Reserve Notes (private credit):
- A presumption arises that you are engaged in taxable activity
- Income received in private credit may be characterized as taxable gross income
- The tax obligation attaches to the use of the private credit system

## Lawful Money and the Tax Question

When you redeem in lawful money:
- The presumption of private credit usage is challenged
- The legal character of the income may change
- The relationship between the transaction and the Internal Revenue Code may be affected

## Key Considerations

### 26 USC § 61 — Gross Income
The Internal Revenue Code defines gross income broadly. However, the character of money received affects how it is classified.

### The Excludable Nature of Lawful Money
Some practitioners argue that income redeemed in lawful money is excluded from gross income because:
1. It is not received in private credit
2. The tax is on the use of the Federal Reserve system
3. Lawful money sits outside that system

### Due Diligence Required
- Study the relevant statutes independently
- Understand the relationship between 12 USC § 411 and 26 USC
- Document your lawful money practice meticulously
- Consider consulting with a tax professional who understands these distinctions

## This Is Education, Not Tax Advice

We teach the law as written. How you apply this knowledge to your own situation is your responsibility. We encourage thorough study and informed decision-making.`,
          order: 5,
          duration: "20 min",
        },
        {
          title: "Documentation & Record Keeping",
          description: "How to maintain proper records of your lawful money redemption practice.",
          content: `# Documentation & Record Keeping

## Why Documentation Matters

Your lawful money practice must be documented consistently and thoroughly. If your position is ever questioned, your records are your evidence. Sloppy documentation undermines your standing.

## What to Document

### 1. Endorsed Instruments
- Keep a photocopy or digital image of every endorsed check (front and back)
- Maintain copies of all deposit slips with the endorsement
- Store copies of any letters sent to banks or employers

### 2. Lawful Money Ledger
Create a ledger tracking:
- Date of deposit
- Amount
- Source (who paid you)
- Instrument type (check, money order, direct deposit)
- Endorsement confirmation (yes/no)
- Bank account deposited into

### 3. Correspondence
Keep copies of:
- Letters to your bank regarding lawful money
- Letters to employers regarding direct deposit endorsements
- Any responses received from banks or employers
- Any notices from the IRS or state tax authorities

### 4. Tax Records
- Maintain records of how you characterize income on tax filings
- Keep copies of all tax returns
- Document your reasoning and the statutes relied upon

## Storage Recommendations

- **Physical copies**: Store in a fireproof safe or safety deposit box
- **Digital copies**: Maintain encrypted backups in multiple locations
- **Organized by year**: Keep annual folders with all documentation
- **Accessible**: You should be able to produce any document within minutes

## How Long to Keep Records

Keep all lawful money records indefinitely. There is no statute of limitations on the maintenance of your standing. The longer and more consistent your record, the stronger your position.`,
          order: 6,
          duration: "15 min",
        },
        {
          title: "Common Questions & Misconceptions",
          description: "Addressing frequent questions and clearing up misunderstandings about lawful money.",
          content: `# Common Questions & Misconceptions

## Q: Is lawful money redemption legal?
**Yes.** 12 USC § 411 is current, standing federal law. It has never been repealed. The statute expressly states that Federal Reserve Notes "shall be redeemed in lawful money on demand."

## Q: Will my bank refuse my endorsed checks?
**No.** Banks process endorsed checks routinely. The endorsement does not prevent the check from being deposited or cleared. It is a legal notation on the instrument.

## Q: Do I get different physical money?
**No.** You receive the same deposits in your account. The difference is the legal character of the transaction, not the physical form of the money. Redemption changes how the deposit is characterized in law.

## Q: Is this a tax evasion scheme?
**No.** Tax evasion is the illegal failure to pay taxes owed. Lawful money redemption is the exercise of a statutory right that may affect how income is characterized. These are entirely different things.

## Q: Do I need to tell the IRS?
**You should document everything.** How you report income on your tax returns is your responsibility. Study the relationship between 12 USC § 411 and the Internal Revenue Code. Act from knowledge, not fear.

## Q: What if my employer won't accept the endorsement letter?
**The endorsement can still be applied.** You can endorse the deposit slip at the bank, or if direct deposit, you can maintain a standing letter with your bank.

## Common Misconceptions

### "Lawful money doesn't exist anymore"
False. The statute is still in effect. Congress has not repealed 12 USC § 411.

### "This is a sovereign citizen thing"
False. Lawful money redemption has nothing to do with sovereign citizen ideology. It is a straightforward exercise of a statutory right codified in federal law.

### "The banks will close your account"
Extremely unlikely. Banks process endorsed checks constantly. Your endorsement is a legal notation, not a disruption to banking operations.

### "You need a lawyer to do this"
No. You need knowledge. The endorsement is simple. Understanding why you're doing it is what this course teaches.`,
          order: 7,
          duration: "20 min",
        },
      ],
    },
    {
      title: "Trust & Asset Protection",
      description:
        "Learn how to structure and use trusts to protect your assets from personal liability. Covers trust law fundamentals, types of trusts, asset transfer, and ongoing administration.",
      category: "Trust & Assets",
      level: "beginner",
      duration: "Self-paced",
      price: 0,
      isFree: true,
      freePreviewLessons: 1,
      isPublished: true,
      createdById: admin.id,
      lessons: [
        {
          title: "Introduction — Why Assets Must Be Protected",
          description: "Understanding why holding assets in your personal name exposes you to risk.",
          content: `# Why Assets Must Be Protected

## The Problem with Personal Ownership

In the current legal system, anything held in your personal name is subject to:
- **Liens** — claims placed on your property by creditors
- **Levies** — government seizure of assets for unpaid obligations
- **Judgments** — court orders directing your assets to satisfy debts
- **Lawsuits** — anyone can sue you and target your personal property
- **Probate** — your estate goes through a public, costly legal process at death

## The Fundamental Issue

You do not truly own what can be taken from you by operation of law without your consent. If a creditor can place a lien on your home, you don't fully control that home. If a court can seize your bank account, you don't fully control that account.

## The Solution: Separation

A trust creates a legal separation between:
- **Legal title** (who "owns" the asset in the eyes of the law)
- **Beneficial interest** (who benefits from the asset)

When assets are held in trust:
- The **trust** holds legal title
- The **beneficiary** receives the benefits
- The beneficiary's personal creditors cannot reach the trust assets
- The assets are administered according to the trust instrument, not a court

## What You'll Learn in This Course

1. How trust structures work (Grantor, Trustee, Beneficiary)
2. The different types of trusts and when to use each
3. What assets can be placed in trust
4. How to draft the trust instrument
5. How to transfer assets into the trust
6. How to administer the trust properly

## The Principle

*If it can be owned, it can be held in trust. The trust becomes the legal owner. You become the protected beneficiary.*`,
          order: 1,
          duration: "15 min",
        },
        {
          title: "Trust Structure — Grantor, Trustee, Beneficiary",
          description: "Understanding the three essential roles in every trust arrangement.",
          content: `# Trust Structure: The Three Roles

Every trust has three essential roles. Understanding these roles is the foundation of using a trust effectively.

## The Grantor (Settlor/Trustor)

The grantor is the person who creates the trust. The grantor:
- Establishes the trust by executing the trust instrument
- Defines the terms, conditions, and purpose of the trust
- Transfers assets into the trust (funds it)
- Determines who the trustee and beneficiaries will be

**The grantor's intent governs the trust.** The trust instrument is the expression of that intent.

## The Trustee

The trustee is the person or entity that holds legal title to the trust assets and administers them. The trustee:
- Holds legal title to all trust property
- Manages the assets according to the trust instrument
- Has a **fiduciary duty** to the beneficiaries (the highest obligation in law)
- Must act in the beneficiaries' interest, not their own
- Keeps records, files necessary documents, and maintains the trust

**The trustee has power but not benefit.** They control the assets but do not personally profit from them.

## The Beneficiary

The beneficiary is the person who benefits from the trust. The beneficiary:
- Holds **equitable interest** (beneficial interest) in the trust assets
- Receives distributions or benefits as the trust instrument directs
- Does NOT hold legal title to the assets
- Is protected from personal creditors accessing the trust assets

**The beneficiary has benefit but not title.** This separation IS the protection.

## Why the Separation Matters

A creditor can only reach assets that belong to you. Trust assets do not belong to you — they belong to the trust. You hold beneficial interest, which is a different kind of ownership than legal title.

This is not a trick or loophole. It is the fundamental structure of trust law, recognized for centuries in common law and equity.`,
          order: 2,
          duration: "20 min",
        },
        {
          title: "Types of Trusts",
          description: "Irrevocable, express, common law, and land trusts — when to use each.",
          content: `# Types of Trusts

Not all trusts are the same. The type of trust you need depends on your goals, your assets, and the level of protection required.

## Irrevocable Trust

Once established, the grantor **relinquishes control** over the assets. This provides the strongest asset protection because:
- Assets are no longer part of the grantor's estate
- Creditors of the grantor cannot reach the assets
- The trust cannot be modified or revoked by the grantor
- Provides maximum separation between grantor and assets

**Best for:** Maximum asset protection, estate planning, high-value assets

## Express Trust

Created by the **express intention** of the grantor with clearly defined terms, beneficiaries, and purposes.
- The most common and versatile trust structure
- Terms are explicitly stated in the trust instrument
- Can be revocable or irrevocable
- Widely recognized in all jurisdictions

**Best for:** General asset protection, flexibility, multi-purpose use

## Common Law Trust

Established under **common law principles** rather than statutory code.
- Rooted in centuries of legal precedent
- Predates modern statutory trusts
- Recognized in equity
- Based on the law of contracts and property

**Best for:** Those seeking to operate under common law rather than statutory frameworks

## Land Trust

Specifically designed to hold **real property**.
- The trust holds title to the land
- The beneficiary maintains privacy
- Protects real property from liens attached to the beneficiary's personal name
- Used extensively in real estate for privacy and protection

**Best for:** Real property, privacy in land ownership, real estate investment

## Choosing the Right Trust

Consider:
1. **What assets are you protecting?** (Real property → Land Trust; General assets → Express Trust)
2. **How much control do you need?** (More control → Revocable; Maximum protection → Irrevocable)
3. **What jurisdiction are you in?** (State laws vary on trust recognition)
4. **What is your long-term goal?** (Estate planning, creditor protection, privacy)`,
          order: 3,
          duration: "25 min",
        },
        {
          title: "What Can Be Placed in Trust",
          description: "A comprehensive guide to the types of assets that can be held in trust.",
          content: `# What Can Be Placed in Trust

The principle is simple: **if it can be owned, it can be held in trust.**

## Real Property & Land
- Residential homes
- Commercial buildings
- Raw land
- Rental properties
- **Transfer method:** Deed from personal name to trust

## Bank Accounts & Financial Instruments
- Checking and savings accounts
- Certificates of deposit
- Brokerage accounts
- Stocks and bonds
- **Transfer method:** Re-title account in trust name, or open new account in trust name

## Vehicles & Personal Property
- Automobiles, boats, RVs
- Equipment and machinery
- Jewelry, art, collectibles
- **Transfer method:** Title transfer (vehicles) or Bill of Sale / Assignment (personal property)

## Intellectual Property & Copyrights
- Patents, trademarks, copyrights
- Royalty streams
- Digital assets
- **Transfer method:** Assignment document

## Business Interests
- LLC membership interests
- Partnership interests
- Sole proprietorship assets
- **Transfer method:** Assignment of interest or operating agreement amendment

## Life Insurance Policies
- Term life policies
- Whole life policies
- **Transfer method:** Change of ownership form with the insurance company

## Key Considerations

### Proper Documentation
Every asset transferred into the trust must have proper documentation:
- A deed for real property
- An assignment for personal property
- Re-titling for vehicles and financial accounts
- Formal transfer documents for business interests

### The Trust Must Be Funded
A trust without assets is just a piece of paper. The trust must actually hold the assets to provide protection. Transfer is not optional — it is essential.

### Maintain Trust Records
Every asset in the trust should be listed in the trust's schedule of assets. Update this schedule whenever assets are added or removed.`,
          order: 4,
          duration: "20 min",
        },
        {
          title: "The Trust Instrument — Drafting Essentials",
          description: "What goes into the trust document and why every word matters.",
          content: `# The Trust Instrument

The trust instrument (also called trust indenture, declaration of trust, or trust agreement) is the foundational document that creates and governs the trust.

## Essential Components

### 1. Declaration of Trust
A clear statement that the trust is being created, identifying the grantor and the date of creation.

### 2. Name of the Trust
Every trust should have a distinct name by which it will be known in all transactions.

### 3. Purpose of the Trust
A statement of why the trust exists and what it is intended to accomplish.

### 4. Identification of Parties
- **Grantor**: Full legal name
- **Trustee**: Full legal name or entity name
- **Beneficiaries**: Full legal names or class description

### 5. Trust Property (Corpus)
A description of the assets being placed in trust, or reference to an attached schedule.

### 6. Powers of the Trustee
What the trustee is authorized to do:
- Buy, sell, lease property
- Open bank accounts
- Enter contracts on behalf of the trust
- Manage investments
- Make distributions to beneficiaries

### 7. Duties of the Trustee
Fiduciary obligations:
- Act in the best interest of beneficiaries
- Maintain records
- Provide accountings
- Not self-deal or comingle funds

### 8. Distribution Terms
How and when beneficiaries receive benefits from the trust.

### 9. Successor Trustee
Who takes over if the original trustee dies, resigns, or becomes incapacitated.

### 10. Governing Law
Which jurisdiction's law governs the trust.

### 11. Amendment & Revocation (if applicable)
Whether and how the trust can be modified or terminated.

## Why Every Word Matters

The trust instrument is a legal document. Courts interpret it literally. Ambiguous language creates disputes. Clear, precise language prevents them.

**The trust instrument is the law of the trust.** What it says, goes. What it doesn't say, doesn't apply.`,
          order: 5,
          duration: "25 min",
        },
        {
          title: "Asset Transfer & Funding",
          description: "How to properly transfer assets from personal ownership into the trust.",
          content: `# Asset Transfer & Funding

A trust without assets is an empty vessel. Funding the trust — actually transferring assets into it — is what activates the protection.

## Real Property Transfer

### Process:
1. Prepare a new deed (Warranty Deed or Quitclaim Deed)
2. The grantor (current owner) conveys the property to the trust
3. The deed names the trustee as the grantee, acting in their capacity as trustee
4. Record the deed with the county recorder's office

### Example deed language:
"[Grantor Name] hereby conveys to [Trustee Name], Trustee of the [Trust Name], dated [date]..."

### Considerations:
- Check for due-on-sale clauses in mortgages
- Some jurisdictions exempt trust transfers from transfer taxes
- Title insurance may need to be updated

## Bank Accounts

### Process:
1. Visit your bank with a copy of the trust instrument (or a Certificate of Trust)
2. Request to re-title the account in the trust name, OR
3. Open a new account in the trust name and transfer funds

### Account title format:
"[Trustee Name], Trustee of the [Trust Name], dated [date]"

## Vehicles

### Process:
1. Complete a title transfer at your state DMV/BMV
2. Title the vehicle in the trust name
3. Update insurance to reflect the trust as the named insured

## Personal Property

### Process:
1. Draft a Bill of Sale or Assignment of Personal Property
2. List each item being transferred
3. Sign as grantor; accept as trustee
4. Attach to the trust's schedule of assets

## Business Interests

### Process:
1. Draft an Assignment of Membership Interest (LLC) or Partnership Interest
2. Update the operating agreement to reflect the trust as a member
3. File any required state amendments

## The Cardinal Rule

**If it's not in the trust, it's not protected.** Every asset must be formally, properly transferred with correct documentation. Verbal transfers don't count. Unsigned documents don't count. Only properly executed transfers provide protection.`,
          order: 6,
          duration: "25 min",
        },
        {
          title: "Ongoing Trust Administration",
          description: "How to properly administer a trust after it's established.",
          content: `# Ongoing Trust Administration

Establishing a trust is the beginning, not the end. A trust requires proper ongoing administration to maintain its validity and protection.

## Core Administrative Duties

### 1. Maintain Separate Records
- The trust must have its own records, separate from your personal records
- Keep a trust journal documenting all trust activities
- Maintain the schedule of assets (update when assets are added or removed)

### 2. Conduct Business in the Trust Name
- All trust transactions must be conducted in the trust's name
- Sign documents as: "[Your Name], Trustee of [Trust Name]"
- Never sign in your personal capacity for trust matters

### 3. Maintain Separate Accounts
- Trust bank accounts must be separate from personal accounts
- Never commingle trust funds with personal funds
- All trust income goes into trust accounts; all trust expenses come from trust accounts

### 4. Keep Accountings
- Track all income and expenses of the trust
- Maintain annual financial statements
- Be prepared to provide an accounting if requested by a beneficiary

### 5. File Required Documents
- Some trusts may have tax filing requirements (consult a tax professional)
- Update recorded documents if real property is involved
- Renew any registrations or licenses held by the trust

## Common Mistakes to Avoid

### Commingling Funds
**Never** mix personal and trust funds. This is the single fastest way to lose trust protection. If funds are commingled, a court can "pierce the trust" and treat the assets as personal property.

### Signing Incorrectly
Always identify yourself as trustee when acting for the trust. If you sign just your name without the trustee designation, the transaction may be treated as personal.

### Forgetting to Fund
Many people create a trust but never transfer their assets into it. An unfunded trust provides zero protection.

### Neglecting Updates
Life changes — new property, sold property, new beneficiaries, changed circumstances. The trust instrument and schedules must be updated to reflect reality.

### Ignoring Fiduciary Duties
The trustee has a legal obligation to act in the beneficiaries' interest. Self-dealing, negligence, or mismanagement can result in personal liability for the trustee.

## Annual Trust Review Checklist

- [ ] Review schedule of assets — is it current?
- [ ] Review trust bank account statements
- [ ] Verify all trust property is properly titled
- [ ] Check for any needed amendments to the trust instrument
- [ ] Ensure all trust business was conducted in the trust name
- [ ] Prepare annual accounting
- [ ] Review beneficiary designations
- [ ] Confirm successor trustee is still able and willing to serve`,
          order: 7,
          duration: "20 min",
        },
      ],
    },
    {
      title: "State-Citizen Passport",
      description:
        "Learn the constitutional distinction between state and federal citizenship, how to establish your domicile, and how to obtain a passport that reflects your true political status.",
      category: "State Passport",
      level: "beginner",
      duration: "Self-paced",
      price: 0,
      isPublished: true,
      createdById: admin.id,
      lessons: [
        {
          title: "Introduction — Two Types of Citizenship",
          description: "Understanding the fundamental distinction between state citizenship and federal citizenship.",
          content: `# Two Types of Citizenship

The United States has two distinct types of citizenship. Understanding this distinction is the foundation of everything that follows.

## State Citizenship (Original)

State citizenship is the **original** form of citizenship in America. It predates the Constitution itself.

- Citizens of the several states were the people who ratified the Constitution
- State citizens are sovereign members of the republic
- Their rights are **unalienable** — they precede government and cannot be taken away
- State citizens are protected by the Constitution, not created by it

## Federal Citizenship (14th Amendment)

The 14th Amendment, ratified in 1868, created a **second** class of citizenship:

"All persons born or naturalized in the United States, and **subject to the jurisdiction thereof**, are citizens of the United States and of the State wherein they reside."

Key observations:
- This citizenship is **subject to** federal jurisdiction
- The rights are **civil rights** — granted by legislation, not inherent
- This citizenship did not replace state citizenship — it created an additional category

## The Supreme Court Confirmed the Distinction

### Slaughter-House Cases, 83 U.S. 36 (1873)
"It is quite clear, then, that there is a citizenship of the United States, and a citizenship of a State, which are distinct from each other."

### United States v. Cruikshank, 92 U.S. 542 (1876)
"We have in our political system a government of the United States and a government of each of the several States. Each one of these governments is distinct from the others, and each has citizens of its own."

## Why This Matters

Your political status determines:
- Which laws apply to you
- Which courts have jurisdiction over you
- What obligations you are presumed to carry
- Whether your rights are inherent or granted

Most Americans have been **defaulted** into federal citizenship without understanding the alternative. This course teaches you the distinction and how to establish your true status.`,
          order: 1,
          duration: "20 min",
        },
        {
          title: "Constitutional Basis — Article IV & the 14th Amendment",
          description: "The constitutional text that establishes and distinguishes the two citizenships.",
          content: `# Constitutional Basis

## Article IV, Section 2 (Original Constitution)

"The Citizens of each State shall be entitled to all Privileges and Immunities of Citizens in the several States."

This clause:
- Recognizes **state citizens** as the primary political class
- Guarantees their privileges and immunities across all states
- Was written before the 14th Amendment existed
- Remains in full force and effect

## The 14th Amendment, Section 1 (1868)

"All persons born or naturalized in the United States, and subject to the jurisdiction thereof, are citizens of the United States and of the State wherein they reside. No State shall make or enforce any law which shall abridge the privileges or immunities of citizens of the United States."

### Critical Language: "subject to the jurisdiction thereof"

This phrase is the key. Not all persons born in the United States are automatically subject to federal jurisdiction. The clause requires **both**:
1. Birth or naturalization in the United States
2. Being subject to the jurisdiction thereof

### What "jurisdiction" means here

"Subject to the jurisdiction" means complete, political jurisdiction — not merely being physically present. It means being under the full authority and control of the federal government.

## The Two Classes Side by Side

| State Citizen | Federal (14th Amendment) Citizen |
|---|---|
| Sovereign member of the republic | Subject of federal jurisdiction |
| Unalienable rights | Civil rights (legislatively granted) |
| Domiciled in a state | Residing in a state |
| Protected by the Constitution | Created by the Constitution |
| Common law jurisdiction | Statutory/administrative jurisdiction |
| Privileges and immunities of Article IV | Privileges and immunities of the 14th Amendment |

## The Key Distinction: "Domicile" vs. "Residence"

- **Domicile**: Your permanent home; a state of the Union; a matter of intent and presence
- **Residence**: Where you currently live; can be a federal territory, district, or possession

This distinction matters enormously for your passport application and political status.`,
          order: 2,
          duration: "25 min",
        },
        {
          title: "Key Case Law",
          description: "Supreme Court cases that define and confirm the distinction between citizenships.",
          content: `# Key Case Law

These cases establish the legal foundation for the state/federal citizenship distinction.

## Slaughter-House Cases, 83 U.S. 36 (1873)

**The most important case on this topic.**

The Supreme Court, interpreting the newly ratified 14th Amendment for the first time, held:

"It is quite clear, then, that there is a citizenship of the United States, and a citizenship of a State, which are distinct from each other, and which depend upon different characteristics or circumstances in the individual."

The Court further stated that the 14th Amendment **did not** merge the two citizenships into one. They remain separate and distinct.

## United States v. Cruikshank, 92 U.S. 542 (1876)

"We have in our political system a government of the United States and a government of each of the several States. Each one of these governments is distinct from the others, and each has citizens of its own who owe it allegiance, and whose rights, within its jurisdiction, it must protect."

This confirms:
- Two governments (federal and state)
- Two citizenships
- Each with its own rights and protections

## Elk v. Wilkins, 112 U.S. 94 (1884)

The Court held that a Native American born within U.S. borders was NOT automatically a citizen under the 14th Amendment because he was not "subject to the jurisdiction" of the United States in the political sense.

This confirms that **physical presence alone** does not create 14th Amendment citizenship.

## Minor v. Happersett, 88 U.S. 162 (1875)

"The Constitution does not, in words, say who shall be natural-born citizens. Resort must be had elsewhere to ascertain that. At common-law, with the nomenclature of which the framers of the Constitution were familiar, it was never doubted that all children born in a country of parents who were its citizens became themselves, upon their birth, citizens also."

This confirms that citizenship existed **before** and **independent of** the 14th Amendment.

## How to Use This Case Law

These cases are not academic. They establish:
1. The legal basis for your claim to state citizenship
2. The distinction between state and federal jurisdiction
3. The separate nature of the two citizenships
4. The confirmation that the 14th Amendment did not abolish state citizenship`,
          order: 3,
          duration: "20 min",
        },
        {
          title: "Establishing Your Domicile",
          description: "How to formally establish your domicile in one of the several states.",
          content: `# Establishing Your Domicile

Domicile is the **cornerstone** of state citizenship. Without a properly established domicile, you cannot claim state-citizen status.

## Domicile vs. Residence

**Domicile** = your permanent, fixed home; where you intend to remain; requires both physical presence and intent to remain.

**Residence** = where you currently live; can be temporary; does not require intent to remain permanently.

For state citizenship, you need **domicile** — not just residence.

## How Domicile Is Established

Domicile requires two elements:
1. **Physical presence** in the state
2. **Intent** to make it your permanent home

## Evidence of Domicile

To establish your domicile, you should have:

### Physical Presence Evidence
- Real property owned in the state (strongest evidence)
- Rental agreement or lease in the state
- Utility bills in your name at the address
- Mail received at the address

### Intent Evidence
- A written Declaration of Domicile (notarized)
- Voter registration in the state
- Driver's license or state ID issued by the state
- Vehicle registration in the state
- State tax filings (if applicable)
- Bank accounts in the state
- Church membership or community ties
- Employment in the state

## Declaration of Domicile

A Declaration of Domicile is a written statement declaring:
- Your name
- Your address in the state
- Your intent to make this your permanent home
- The date you established domicile
- Your signature (notarized)

This document, combined with physical evidence, establishes your domicile for legal purposes.

## Why This Matters for the Passport

When you apply for a passport as a state citizen, your domicile is the foundation of your claim. You are a citizen of the **state** — not a resident of a federal territory. Your domicile establishes which state you belong to and which jurisdiction you are under.

## Common Domicile Mistakes

- Using a P.O. Box as your domicile (a P.O. Box is not a domicile)
- Having domicile evidence in multiple states (you can only have one domicile)
- Not declaring your domicile formally
- Confusing residence with domicile`,
          order: 4,
          duration: "20 min",
        },
        {
          title: "The DS-11 Passport Application",
          description: "How to complete the passport application with proper status language.",
          content: `# The DS-11 Passport Application

The DS-11 is the U.S. Department of State form used to apply for a new passport. Understanding how to complete it properly is essential.

## Overview

The DS-11 is a standard form. Every field has legal significance. How you complete it reflects your understanding of your status.

## Key Fields and Considerations

### Full Name
Use your full legal name as it appears on your birth certificate. Do not use nicknames or abbreviated names.

### Date and Place of Birth
Use the city and **state** where you were born. Your birth state is relevant to your state citizenship.

### Sex
As indicated on your birth certificate.

### Mailing Address
Your current mailing address.

### Permanent Address (if different)
This is your **domicile address**. It should be in one of the several states of the Union.

### Citizenship Evidence
You will provide your birth certificate as evidence of citizenship. A certified copy of your birth certificate establishes that you were born in one of the several states.

## Supporting Documents

### Birth Certificate
- Must be a certified copy from the issuing state
- Must show: your name, date of birth, place of birth, parent(s) names
- Must have the registrar's signature and seal

### Identification
- A valid, government-issued photo ID
- Driver's license, state ID, or previous passport

### Passport Photo
- Standard 2" x 2" photo
- White background
- Taken within the last 6 months

## Application Process

1. **Download or obtain Form DS-11** from the State Department
2. **Complete all fields** with accurate information
3. **Gather supporting documents** (birth certificate, ID, photo)
4. **Appear in person** at a passport acceptance facility
5. **Submit the application** with required fees

## Important Notes

- You must appear **in person** for a DS-11 (it is for new passports or those who cannot renew by mail)
- **Do not sign the form** until you are in front of the acceptance agent
- The acceptance agent will verify your identity and documents
- Processing times vary; standard is 6-8 weeks

## Study Before You Apply

The application process is straightforward when you understand what you are doing and why. Knowledge removes uncertainty. Study this material thoroughly before you submit.`,
          order: 5,
          duration: "25 min",
        },
        {
          title: "Supporting Documentation & Affidavits",
          description: "Additional documents that may support your state-citizen passport application.",
          content: `# Supporting Documentation & Affidavits

Beyond the basic DS-11 requirements, additional documentation can strengthen your position and clarify your status.

## Declaration of Domicile

A notarized declaration that formally establishes:
- Your name
- Your domicile state and address
- Your intent to maintain this as your permanent home
- The date domicile was established

This document supports your claim of state citizenship by establishing where you are domiciled.

## Affidavit of Citizenship Status

An affidavit is a sworn statement made under penalty of perjury. An affidavit of citizenship status may include:
- A statement that you are a citizen of [your state]
- A statement of your domicile
- A reference to the constitutional basis (Article IV, Section 2)
- Your oath or affirmation
- Notarization

## Affidavit of Identity

If you need to establish identity beyond standard government ID:
- A sworn statement of your identity
- Witnesses who can attest to your identity
- Supporting documents (birth certificate, etc.)

## Birth Certificate Considerations

Your birth certificate is your primary evidence of:
- Birth in one of the several states
- Parental citizenship
- Your original name

### Long-Form vs. Short-Form
The long-form (certificate of live birth) is generally preferred as it contains more information. Contact your birth state's vital records office to obtain a certified copy.

## Record of Documents

Maintain a file containing:
- Copy of your DS-11 application
- Copy of your birth certificate
- Copy of your Declaration of Domicile
- Any affidavits filed
- Receipts for fees paid
- Correspondence with the State Department
- A copy of your passport when received

## The Role of Documentation

Documentation serves two purposes:
1. **Evidence**: It proves your claims if challenged
2. **Clarity**: The act of preparing documents forces you to understand your position completely

Do not submit documents you do not understand. Study first, document second, submit third.

## The Explanatory Statement

Distinct from an affidavit, an **Explanatory Statement** is a written declaration that clarifies your political status for the reviewing officer. While an affidavit is a sworn factual statement, the Explanatory Statement is a broader narrative explaining *why* you are applying as a state citizen and *what that means*.

### What It Is

The Explanatory Statement is a document — typically one to two pages — that you prepare, sign, and optionally notarize. It preemptively addresses questions the passport agent may have about your application by clearly and respectfully explaining your political status.

Think of it this way:
- The **Affidavit** says: "I swear under penalty of perjury that I am a citizen of [state]."
- The **Explanatory Statement** says: "Here is why I am applying as a state citizen, what that means under the Constitution, and why this is the correct classification."

### Why It Matters

Passport acceptance agents process thousands of standard applications. A state-citizen application may be unfamiliar to them. The Explanatory Statement:
- **Preemptively answers questions** the agent may have about your status claims
- **Provides a paper trail** that shows you understand your own position
- **Demonstrates good faith** — you are not trying to evade or deceive; you are asserting a lawful status
- **Educates without confrontation** — the document speaks for you in a calm, factual tone

### What It Should Contain

A well-prepared Explanatory Statement includes:

1. **Your full legal name** as it appears on the application
2. **Your domicile** — the state in which you are domiciled and your physical address
3. **A clear statement of your political status**: that you are a citizen of [your state], one of the several states of the Union, and that you are *not* claiming citizenship under the 14th Amendment
4. **The constitutional basis** for your claim:
   - Article IV, Section 2 of the Constitution (privileges and immunities of citizens in the several states)
   - The distinction between state citizenship (original Constitution) and federal citizenship (14th Amendment)
5. **A brief explanation** of why these are different political statuses with different legal implications
6. **Your signature and date**
7. **Notarization** (recommended but not always required)

### How It Differs from the Affidavit of Citizenship Status

| Aspect | Affidavit | Explanatory Statement |
|--------|-----------|----------------------|
| Purpose | Sworn factual declaration | Narrative explanation |
| Tone | Formal, legal | Clear, educational |
| Content | Facts under oath | Context and reasoning |
| Legal weight | Sworn under penalty of perjury | Signed declaration |
| Length | Typically 1 page | 1–2 pages |
| Notarization | Required | Recommended |

Both documents work together: the Affidavit establishes the legal facts; the Explanatory Statement provides the context.

### Tips on Tone and Language

- **Be clear and factual.** Avoid emotional language, sovereign-citizen jargon, or combative phrasing.
- **Be respectful.** The reviewing officer is doing their job. Your goal is to help them understand, not to lecture.
- **Cite the law.** Reference specific constitutional provisions and statutes. Let the law speak.
- **Avoid overcomplication.** If you cannot explain your position simply, study more before submitting.
- **Do not claim to be "not a citizen."** You *are* a citizen — a state citizen. Make that distinction clear.
- **Use proper formatting.** Type it professionally, use formal language, and ensure there are no errors.

### When to Include It

Include the Explanatory Statement with your DS-11 application whenever:
- You are applying at a passport acceptance facility (not by mail for first-time applicants)
- You want to ensure the reviewing officer has context for any unusual aspects of your application
- You are including other supporting documents (affidavits, Declaration of Domicile) and want a cover document that ties them together`,
          order: 6,
          duration: "20 min",
        },
        {
          title: "Child Passport Without a Birth Certificate — Secondary Evidence",
          description: "How to apply for a child's passport when no birth certificate is available, using secondary evidence per travel.state.gov.",
          content: `# Child Passport Without a Birth Certificate — Secondary Evidence

There are situations where a parent needs to obtain a passport for a child but cannot produce a standard birth certificate. This lesson covers the lawful process for using secondary evidence to establish the child's citizenship and identity.

## When This Path Applies

This process applies when:
- The child has **no birth certificate on file** with the state's vital records office
- The child has a **delayed birth certificate** that lacks required elements (e.g., missing the filing date within one year of birth)
- The birth certificate is **unavailable** due to records loss, home birth without registration, or other circumstances

If you have a standard, certified birth certificate filed within one year of birth, use the normal DS-11 process covered in Lesson 5.

## Step 1: Obtain a Letter of No Record

Before submitting secondary evidence, you must first demonstrate that no primary record exists. Contact the vital records office in the **state where the child was born** and request a "Letter of No Record" (sometimes called a "No Record Found" letter).

This letter must include:
- The child's **full name**
- The child's **date of birth**
- The **years searched** by the vital records office
- A **confirmation that no birth record exists** for the child in their records

This letter establishes that you are not simply choosing to skip the birth certificate — there genuinely is no record available.

### How to Request
- Most states allow requests by mail or online through their vital records office
- There may be a small fee ($10–$30 depending on the state)
- Request a **certified** letter if available
- Processing times vary; allow 4–8 weeks

## Step 2: Gather Secondary Evidence from the First Five Years of Life

With the Letter of No Record in hand, you must provide **as much secondary evidence as possible** to establish the child's birth in the United States. The State Department accepts documents created within the **first five years of the child's life**.

### Acceptable Secondary Evidence

Any combination of the following:

**Baptism Certificate**
- Must show the date and place of birth
- Must show the date of baptism
- Must be an original or certified copy from the church

**Hospital Birth Record**
- A record from the hospital where the child was born
- This is different from the birth certificate — it is the hospital's own internal record
- Contact the hospital's medical records department

**Census Records**
- If the child appears in census records within the first five years
- Contact the U.S. Census Bureau for certified copies

**Early School Records**
- Enrollment or attendance records from the child's first school
- Must show the child's name, date of birth, place of birth, and parents' names

**Family Bible Record**
- A Bible record showing the child's birth date and parents
- The record must appear to have been made at or near the time of birth (not recently added)
- Submit the original or a clear photocopy of the relevant page(s)

**Doctor's Records of Early Treatment**
- Medical records from a physician who treated the child in the first five years
- Must include the child's name, date of birth, and place of birth

**Birth Affidavit (Form DS-10)**
- A notarized affidavit from a person who has **personal knowledge** of the child's birth
- The affiant must have been present at the birth or have direct knowledge of the circumstances
- Form DS-10 is available from the State Department
- The affiant must provide their own identification
- This is one of the strongest forms of secondary evidence

### Tips for Gathering Evidence
- **More is better.** Submit every piece of secondary evidence you can obtain.
- **Originals or certified copies** are preferred. Photocopies may not be accepted.
- **Consistency matters.** All documents should show the same name, date of birth, and place of birth.
- **Organize clearly.** Label and arrange documents logically for the reviewing officer.

## Step 3: Parental Consent Requirements

Passport applications for children under 16 have strict parental consent rules.

### Both Parents Present
The simplest path: both parents appear in person at the passport acceptance facility with the child, both sign the DS-11, and both present valid ID.

### One Parent Applying
If only one parent can appear:
- The absent parent must complete **Form DS-3053** (Statement of Consent: Issuance of a Passport to a Minor Under Age 16)
- DS-3053 must be **notarized**
- A **photocopy of the absent parent's ID** must accompany the form

### Sole Custody
If one parent has sole legal custody:
- Submit a **certified court order** granting sole legal custody
- Or submit a **certified death certificate** of the other parent
- Or submit a court order specifically authorizing passport issuance

### Special Circumstances
If consent from the other parent is truly impossible (e.g., parent is incarcerated, whereabouts unknown, or there was never an established legal father):
- Submit a **written statement** explaining the circumstances
- Provide any supporting documentation (court orders, police reports, etc.)
- The State Department will review on a case-by-case basis

## Step 4: Additional Documents

Beyond the Letter of No Record and secondary evidence, you will also need:

**Passport Photo**
- A compliant passport photo of the child (2x2 inches, white background, taken within last 6 months)
- For infants: the child must be photographed alone with eyes open

**Parental ID Copies**
- Photocopies of the front and back of each appearing parent's valid ID

**Citizenship Evidence Photocopies**
- If either parent is using a passport as evidence of their own citizenship, include a photocopy of the data page

**Form DS-11**
- Completed but **unsigned** — you will sign in the presence of the acceptance agent

## How to Combine with the Explanatory Statement

When a child's situation is unusual — no birth certificate, secondary evidence, unique family circumstances — an **Explanatory Statement from the parent** can accompany the application.

This parent's Explanatory Statement should:
- Explain **why** no birth certificate exists (home birth not registered, records lost, etc.)
- Describe the **secondary evidence** being submitted and how it establishes the child's birth
- State the **parent's own political status** if relevant to the application
- Be **signed and dated** by the applying parent
- Be **notarized** for additional weight

This is especially useful when:
- The combination of secondary evidence may raise questions
- The child's birth circumstances are uncommon
- The parent wants to ensure the reviewing officer has full context

The Explanatory Statement ties all the supporting documents together into a coherent narrative.

## Fees and Processing

**Application Fees (as of current State Department schedule):**
- Under 16: $100 application fee + $35 execution fee = **$135 total** (book only)
- Passport card: $15 application fee + $35 execution fee = **$50 total**
- Both book and card: $115 application fee + $35 execution fee = **$150 total**

**Processing Times:**
- Routine processing: 6–8 weeks
- Expedited processing: 2–3 weeks (additional $60 fee)

**Important Notes:**
- Fees are subject to change — verify at travel.state.gov before applying
- Pay by check or money order (two separate payments: one to "U.S. Department of State" for the application fee, one to the acceptance facility for the execution fee)
- Applications with secondary evidence may take longer to process as they require additional review
- You may receive a request for additional information — respond promptly

## Summary Checklist

Before visiting the passport acceptance facility, confirm you have:

- [ ] Letter of No Record from the birth state's vital records office
- [ ] Multiple pieces of secondary evidence from the child's first five years
- [ ] Form DS-11 completed but unsigned
- [ ] Passport photo meeting State Department requirements
- [ ] Both parents present (or DS-3053 notarized consent from absent parent)
- [ ] Valid parental ID (originals and photocopies)
- [ ] Citizenship evidence for parents (originals and photocopies)
- [ ] Explanatory Statement (if applicable)
- [ ] Payment (check or money order)`,
          order: 7,
          duration: "30 min",
        },
        {
          title: "After the Passport — Living from Your Status",
          description: "How to maintain and operate from your state-citizen standing going forward.",
          content: `# Living from Your Status

Obtaining the passport is not the end. It is the documentation of a status you then live from every day.

## Your Status Is Not Just a Document

A passport is documentation of your status — but the status itself exists independent of the document. You are a state citizen because of your domicile, your birth, and your standing. The passport confirms it.

## How to Operate Going Forward

### Identify Yourself Correctly
In legal contexts, identify yourself as a citizen of your state. Not a "US citizen" in the 14th Amendment sense, but a citizen of [your state], one of the several states of the Union.

### Maintain Your Domicile
Continue to maintain evidence of your domicile:
- Keep your address current
- Maintain property, utilities, and community ties
- File your Declaration of Domicile annually if needed

### Understand Jurisdictional Implications
Your status affects which laws apply to you:
- **Common law** governs state citizens in many matters
- **Statutory law** may apply differently depending on jurisdiction
- **Administrative law** (regulations) may not apply in the same way

### Document Ongoing

Keep records of:
- Your passport and its renewal dates
- Your domicile documentation
- Any interactions with government agencies regarding your status
- Correspondence that references your political status

## How the Three Pillars Connect

Your state-citizen status is the third pillar. Combined with the other two:

1. **Lawful Money** — your financial transactions are under public law
2. **Trust Protection** — your assets are separated from personal liability
3. **State Citizenship** — your political status is established under original jurisdiction

Together, these three pillars form a complete foundation:
- Your money is lawful
- Your assets are protected
- Your status is confirmed

## The Foundation Is Set

From this foundation, everything else can be built. The courses, the community, the deeper study — all of it rests on these three pillars being in place.

You are not escaping anything. You are not fighting anything. You are aligning with what was always available to you — the law as written, the rights as established, and the status as confirmed.`,
          order: 8,
          duration: "15 min",
        },
      ],
    },
  ];

  // Insert courses and lessons (skip if a course with same category already exists)
  for (const course of courseData) {
    const { lessons: courseLessons, ...courseFields } = course;

    const [existing] = await db
      .select()
      .from(courses)
      .where(eq(courses.category, courseFields.category))
      .limit(1);

    if (existing) {
      console.log(`⏭️  Course for "${courseFields.category}" already exists — skipping`);
      continue;
    }

    const [inserted] = await db
      .insert(courses)
      .values(courseFields)
      .returning();

    console.log(`✅ Course: "${inserted.title}" (${inserted.id})`);

    for (const lesson of courseLessons) {
      const [insertedLesson] = await db
        .insert(lessons)
        .values({ ...lesson, courseId: inserted.id })
        .returning();

      console.log(`   📖 Lesson ${lesson.order}: ${insertedLesson.title}`);
    }
  }

  // ═══════════════════════════════════════════════════════
  // FORUM CATEGORIES
  // ═══════════════════════════════════════════════════════

  console.log("\n🗂️  Seeding forum categories...\n");

  const forumCats = [
    { name: "Lawful Money", description: "Discussion about 12 USC § 411, endorsements, and lawful money practice", color: "#D4AF37", order: 1 },
    { name: "Trust & Assets", description: "Questions and discussion about trust structures, asset transfers, and administration", color: "#8B1538", order: 2 },
    { name: "State Passport", description: "Discussion about state citizenship, domicile, and the passport process", color: "#001a33", order: 3 },
    { name: "General Discussion", description: "Introductions, shared experiences, and open discussion about the foundation", color: "#6366f1", order: 4 },
  ];

  for (const cat of forumCats) {
    const [existing] = await db
      .select()
      .from(forum_categories)
      .where(eq(forum_categories.name, cat.name))
      .limit(1);

    if (existing) {
      console.log(`⏭️  Forum category "${cat.name}" already exists — skipping`);
      continue;
    }

    const [inserted] = await db
      .insert(forum_categories)
      .values(cat)
      .returning();
    console.log(`✅ Forum category: "${inserted.name}"`);
  }

  // ═══════════════════════════════════════════════════════
  // DOWNLOADS (Templates & Guides)
  // ═══════════════════════════════════════════════════════

  console.log("\n📄 Seeding download entries...\n");

  const downloadEntries = [
    {
      title: "Lawful Money Endorsement Guide",
      shortTitle: "Endorsement Guide",
      description: "Step-by-step guide to endorsing checks and deposit slips with the proper lawful money language under 12 USC § 411.",
      fileUrl: "#",
      fileType: "pdf",
      category: "Lawful Money",
      whenToUse: "Use this guide every time you endorse a check or deposit slip. Keep a copy for reference until the process becomes second nature.",
      whyItMatters: "Consistent, proper endorsement is the foundation of your lawful money practice. Incorrect or inconsistent endorsements weaken your position.",
      contents: "Endorsement language, placement instructions, deposit slip guidance, direct deposit letter template, bank notification letter template",
      isPublic: false,
      isPublished: true,
    },
    {
      title: "Lawful Money Redemption Ledger Template",
      shortTitle: "Redemption Ledger",
      description: "A printable ledger for tracking all lawful money redemption activity — deposits, endorsements, and correspondence.",
      fileUrl: "#",
      fileType: "pdf",
      category: "Lawful Money",
      whenToUse: "Use this ledger to document every deposit you make with a lawful money endorsement. Update it consistently.",
      whyItMatters: "Thorough documentation establishes the pattern and consistency of your lawful money practice over time.",
      contents: "Monthly tracking sheets, annual summary page, correspondence log, deposit record template",
      isPublic: false,
      isPublished: true,
    },
    {
      title: "Trust Establishment Checklist",
      shortTitle: "Trust Checklist",
      description: "A comprehensive checklist covering every step of establishing and funding a trust — from initial planning through asset transfer.",
      fileUrl: "#",
      fileType: "pdf",
      category: "Trust & Assets",
      whenToUse: "Use this checklist before, during, and after establishing your trust to ensure nothing is missed.",
      whyItMatters: "Missing a step in trust establishment can leave assets unprotected. This checklist ensures completeness.",
      contents: "Pre-establishment planning, trust instrument checklist, asset transfer checklist, post-establishment administration checklist",
      isPublic: false,
      isPublished: true,
    },
    {
      title: "Asset Schedule Template",
      shortTitle: "Asset Schedule",
      description: "A template for maintaining the trust's schedule of assets — a living document listing everything held in trust.",
      fileUrl: "#",
      fileType: "pdf",
      category: "Trust & Assets",
      whenToUse: "Attach to your trust instrument and update whenever assets are added to or removed from the trust.",
      whyItMatters: "The schedule of assets is the definitive record of what the trust holds. Without it, there is ambiguity about trust property.",
      contents: "Real property schedule, financial accounts schedule, personal property schedule, business interests schedule, update log",
      isPublic: false,
      isPublished: true,
    },
    {
      title: "Declaration of Domicile Template",
      shortTitle: "Domicile Declaration",
      description: "A template for formally declaring your domicile in one of the several states — the cornerstone of state citizenship.",
      fileUrl: "#",
      fileType: "pdf",
      category: "State Passport",
      whenToUse: "Complete and notarize this declaration to formally establish your domicile. Keep the original in a safe place.",
      whyItMatters: "Domicile is the legal foundation of state citizenship. A formal declaration provides written evidence of your intent and presence.",
      contents: "Declaration text, notary block, witness section, instructions, supporting evidence checklist",
      isPublic: false,
      isPublished: true,
    },
    {
      title: "DS-11 Application Walkthrough",
      shortTitle: "DS-11 Walkthrough",
      description: "A field-by-field walkthrough of the DS-11 passport application with guidance on proper completion.",
      fileUrl: "#",
      fileType: "pdf",
      category: "State Passport",
      whenToUse: "Study this guide before completing your DS-11 application. Reference it as you fill out each field.",
      whyItMatters: "Understanding what each field means and how to complete it correctly is essential. Every field carries legal significance.",
      contents: "Field-by-field instructions, supporting document checklist, common mistakes to avoid, submission checklist",
      isPublic: false,
      isPublished: true,
    },
  ];

  for (const dl of downloadEntries) {
    const [existing] = await db
      .select()
      .from(downloads)
      .where(eq(downloads.title, dl.title))
      .limit(1);

    if (existing) {
      console.log(`⏭️  Download "${dl.title}" already exists — skipping`);
      continue;
    }

    const [inserted] = await db
      .insert(downloads)
      .values(dl)
      .returning();
    console.log(`✅ Download: "${inserted.title}"`);
  }

  console.log("\n🎉 Seeding complete!\n");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
