/**
 * Course 2: Trust & Asset Protection — exhaustive legal content
 * Run with: npx tsx scripts/update-course2-content.ts
 */

import { db } from "../server/db";
import { courses, lessons } from "../shared/schema";
import { eq, and } from "drizzle-orm";

const trustLessons = [
  {
    order: 1,
    title: "Introduction — Why Assets Must Be Protected",
    duration: "25 min",
    content: `# Why Assets Must Be Protected

## The Legal Reality of Personal Ownership

Under the current legal system, assets held in your personal name — your "legal name" — are exposed to a wide range of risks. These are not hypothetical; they are ordinary legal mechanisms that operate every day in courts across the country.

### Risks to Personally Held Assets

**Judgment liens** — Under **Federal Rules of Civil Procedure, Rule 69** and corresponding state rules, a judgment creditor may execute against any property of the debtor. In most states, a recorded judgment becomes an automatic lien on all real property owned by the debtor in that county.

**Tax liens** — Under **26 USC §6321**, a federal tax lien attaches to "all property and rights to property" belonging to the taxpayer. State tax liens operate similarly under respective state codes.

**Garnishment** — Under **15 USC §1673** (Consumer Credit Protection Act), up to 25% of disposable earnings can be garnished for ordinary debts. For tax debts, the IRS can levy under **26 USC §6331** with different limitations under **26 USC §6334**.

**Civil asset forfeiture** — Under **18 USC §981** (civil forfeiture) and **21 USC §881** (drug-related forfeiture), the government can seize property without a criminal conviction. The burden of proof often falls on the property owner.

**Probate** — Assets held in a personal name must pass through probate court upon death. Probate is:
- **Public** — all records become part of the public record
- **Time-consuming** — typically 6 months to several years
- **Expensive** — attorney fees, executor fees, court costs (often 3-8% of estate value)
- **Subject to challenge** — will contests, creditor claims

**Lawsuits** — In a litigious society, any personally held asset is exposed to claims from slip-and-fall accidents, automobile collisions, contract disputes, professional malpractice, and more.

## The Trust Solution

A **trust** is a legal arrangement that separates **legal title** (ownership in law) from **equitable title** (beneficial interest). This separation is the fundamental mechanism of asset protection.

**Black's Law Dictionary (11th Edition)** defines "trust" as:

> *"The right, enforceable solely in equity, to the beneficial enjoyment of property to which another person holds the legal title; a property interest held by one person (the trustee) at the request of another (the settlor) for the benefit of a third party (the beneficiary)."*

When assets are properly held in trust:

- **The trustee holds legal title** — the trustee, not you personally, "owns" the assets in law
- **The beneficiary holds equitable interest** — you (or your designees) enjoy the benefits
- **Your personal name is not on the title** — creditors of you personally cannot reach trust assets (with important exceptions discussed in Lesson 3)

### The Historical Foundation

The trust is one of the oldest legal institutions in Anglo-American law. Its origins trace to the **English Court of Chancery** in the medieval period, where the concept of "uses" (predecessors to trusts) was developed.

The **Statute of Uses (1536), 27 Hen. VIII, c. 10** attempted to abolish uses but instead gave rise to the modern trust. The common law courts and courts of equity evolved the trust over centuries into the sophisticated instrument it is today.

**George Bogert, Trusts (6th Ed.):**

> *"The trust is one of the most flexible instruments in the entire range of Anglo-American law. Its adaptability is limited only by the ingenuity of the draftsman and the requirements of public policy."*

## Legal Framework

### Governing Law

Trusts are primarily governed by:

| Source | Description |
|--------|-------------|
| **Restatement (Third) of Trusts** | The authoritative statement of American trust law by the American Law Institute |
| **Uniform Trust Code (UTC)** | Model legislation adopted (in whole or part) by 35+ states |
| **State trust statutes** | Each state has its own trust code |
| **Common law** | Centuries of judicial precedent |
| **Internal Revenue Code** | Federal tax treatment of trusts (26 USC §§641-685) |

### Fundamental Principles

**Restatement (Third) of Trusts §2** — Definition:

> *"A trust... is a fiduciary relationship with respect to property, arising from a manifestation of intention to create that relationship and subjecting the person who holds title to the property to duties to deal with it for the benefit of charity or for one or more persons, at least one of whom is not the sole trustee."*

**Restatement (Third) of Trusts §5** — Creation:

A trust can be created by:
1. Transfer of property to a trustee
2. Declaration by the owner of property that the owner holds identifiable property as trustee
3. Exercise of a power of appointment in favor of a trustee

No particular words are required. No specific form is mandatory. The key elements are **intent**, **trust property**, and **a valid purpose**.

## What This Course Covers

1. **Trust structure** — the three essential roles and their legal definitions
2. **Types of trusts** — irrevocable, express, common law, land trusts, and their legal characteristics
3. **Trust property** — what can be placed in trust and how
4. **The trust instrument** — essential components of a legally sound trust document
5. **Asset transfer** — the mechanics of funding a trust
6. **Ongoing administration** — fiduciary duties, record-keeping, and compliance

Every principle is supported by the Restatement of Trusts, the Uniform Trust Code, case law, and statutory authority.

## The Legal Person vs. The Living Person

Before diving into trust mechanics, it is essential to understand a foundational distinction that shapes the entire landscape of asset protection: the difference between the **legal person** and the **living person**.

### The Legal Fiction

The **legal person** — the ALL CAPS NAME that appears on your birth certificate, Social Security card, and driver's license — is the entity that participates in commerce. This is the "person" that opens bank accounts, signs contracts, holds corporate titles, and interacts with government agencies. Your SSN, bank accounts, corporate entities, and credit profile all represent **commercial vessels** — they are instruments of the legal person, not the living individual.

> *"You are in the world but not of the world."* — This theological principle directly parallels the sovereignty framework. The living man or woman exists on the land, while the legal person operates in the commercial system.

### Commercial Vessels and Public Commerce

LLCs, S-corps, C-corps, along with the "straw man" (the ALL CAPS NAME) are all firmly anchored in the watery realms of **public commerce**, beholden to all obligations therein. These entities exist within the jurisdiction of commercial law, maritime law, and admiralty law — they are governed by statutes and codes, subject to regulation, taxation, and the full weight of the legal system.

Understanding this distinction is not merely academic — it is the foundation of effective asset protection:

- **The legal person** is a construct of the commercial system, subject to liens, levies, judgments, and statutory obligations
- **The living person** — the flesh-and-blood man or woman — exists outside this commercial matrix
- Every asset held in the name of the legal person is exposed to the risks outlined above
- Trusts, properly structured, create a bridge that allows the living person to benefit from assets without the legal person holding direct title

### Sovereignty and the Living Soil

On the path of sovereignty, it is important to remember that **we are living men and women of the living soil of Earth**. The commercial system is a layer built atop this reality — a necessary interface for modern life, but not the totality of our existence. Asset protection, at its deepest level, is about reclaiming stewardship of your property and your life from systems that treat the legal person as the only reality.

The trust structures taught in this course provide the lawful, time-tested mechanisms to accomplish exactly that.`,
  },
  {
    order: 2,
    title: "Trust Structure — Grantor, Trustee, Beneficiary",
    duration: "30 min",
    content: `# Trust Structure — The Three Essential Roles

Every trust has three essential parties. Understanding their legal definitions, duties, and relationships is the foundation of trust law.

## The Grantor (Settlor / Trustor)

**Black's Law Dictionary (11th Edition)** defines "settlor" as:

> *"A person who creates a trust; one who transfers property to a trustee to hold subject to the terms of the trust. Also termed grantor; trustor; donor; creator."*

**Restatement (Third) of Trusts §3:**

> *"A trust can be created by any person having capacity to transfer the trust property."*

### Legal Requirements

The grantor must have:

1. **Legal capacity** — be of lawful age and sound mind. Under **Restatement (Third) of Trusts §11**: *"The capacity required to create a trust is the capacity to make a transfer of the trust property... A natural person has capacity to create a trust if the person has the capacity to make a will or the capacity to make an inter vivos transfer."*

2. **Ownership of the property** — you cannot place into trust what you do not own. **Nemo dat quod non habet** — "no one gives what they do not have."

3. **Intent to create the trust** — the grantor must manifest an intention to create a trust. Under **Restatement (Third) of Trusts §13**: *"A trust is created only if the settlor properly manifests an intention to create a trust relationship."*

### Grantor's Powers

The grantor may:
- Define the terms of the trust (distributions, restrictions, duration)
- Name the trustee and successor trustees
- Name the beneficiaries
- Specify the governing law
- Retain or relinquish powers (amendment, revocation) depending on trust type
- Fund the trust with any property the grantor owns

### Tax Implications

Under **26 USC §671-679** (the "Grantor Trust Rules"), the IRS may treat the grantor as the owner of trust assets for tax purposes if the grantor retains certain powers. Key provisions:

- **§673** — Reversionary interests exceeding 5%
- **§674** — Power to control beneficial enjoyment
- **§675** — Administrative powers (e.g., power to deal with trust for less than adequate consideration)
- **§676** — Power to revoke
- **§677** — Income for benefit of grantor or grantor's spouse

A **grantor trust** is taxed to the grantor personally. A **non-grantor trust** is a separate taxpaying entity.

## The Trustee

**Black's Law Dictionary (11th Edition)** defines "trustee" as:

> *"One who holds the legal title to property for the benefit of another; the person appointed, or required by law, to execute a trust."*

**Restatement (Third) of Trusts §31:**

> *"A trustee is a person who holds property in a fiduciary capacity for the benefit of others."*

### Fiduciary Duty

The trustee's duty is the highest duty known to law — the **fiduciary duty**. This is not a mere contractual obligation; it is a status imposed by equity.

**Black's Law Dictionary** defines "fiduciary" as:

> *"A person who is required to act for the benefit of another person on all matters within the scope of their relationship; one who owes to another the duties of good faith, loyalty, due care, and disclosure."*

**Meinhard v. Salmon, 249 N.Y. 458 (1928)** (Chief Judge Cardozo):

> *"A trustee is held to something stricter than the morals of the market place. Not honesty alone, but the punctilio of an honor the most sensitive, is then the standard of behavior."*

### Specific Trustee Duties

Under the **Uniform Trust Code** and the **Restatement (Third) of Trusts**:

| Duty | Source | Description |
|------|--------|-------------|
| **Duty of Loyalty** | UTC §802; Restatement §78 | Act solely in the interest of beneficiaries; no self-dealing |
| **Duty of Prudence** | UTC §804; Restatement §77 | Administer with reasonable care, skill, and caution |
| **Duty of Impartiality** | UTC §803; Restatement §79 | Treat beneficiaries equitably (not necessarily equally) |
| **Duty to Inform** | UTC §813; Restatement §82 | Keep beneficiaries reasonably informed |
| **Duty to Account** | UTC §813(c); Restatement §83 | Provide regular accountings of trust activity |
| **Duty Not to Delegate** | UTC §807; Restatement §80 | Cannot delegate duties improperly (may delegate investment) |
| **Duty to Preserve Property** | UTC §809; Restatement §76 | Protect and maintain trust assets |
| **Duty to Earmark** | Restatement §84 | Keep trust property separate and identifiable |
| **Duty to Enforce Claims** | UTC §811; Restatement §76 | Pursue claims on behalf of the trust |

### Trustee Liability

A trustee who breaches fiduciary duty is personally liable for:
- Loss or depreciation in value of trust property caused by the breach — **UTC §1002(a)**
- Any profit made by the trustee through the breach — **UTC §1002(a)(3)**
- Restoration of trust property — **UTC §1002(a)(1)**

**Bogert, Trusts and Trustees §541:**

> *"The trustee who commits a breach of trust is personally liable for the consequences of the breach, whether or not the trustee acted in good faith."*

## The Beneficiary

**Black's Law Dictionary (11th Edition)** defines "beneficiary" as:

> *"A person for whose benefit property is held in trust."*

**Restatement (Third) of Trusts §48:**

> *"A person is a beneficiary of a trust if the settlor manifested an intention to give the person a beneficial interest in the trust property."*

### Beneficiary's Rights

Under the **Uniform Trust Code §813** and common law:

1. **Right to information** — beneficiaries may demand accountings and trust documents
2. **Right to distributions** — as specified in the trust instrument
3. **Right to enforce** — beneficiaries may petition the court to compel trustee compliance (**UTC §1001**)
4. **Right to remove trustee** — under certain circumstances (**UTC §706**)

### Types of Beneficial Interests

| Interest Type | Description | Legal Effect |
|--------------|-------------|--------------|
| **Mandatory interest** | Trustee must distribute income/principal | Enforceable by beneficiary |
| **Discretionary interest** | Trustee has discretion to distribute | Beneficiary cannot compel distribution |
| **Spendthrift interest** | Beneficiary cannot transfer or pledge interest | Creditors cannot reach trust assets |
| **Support interest** | Distributions limited to health, education, maintenance, support | Standard "HEMS" distribution language |

### Spendthrift Protection

**Restatement (Third) of Trusts §58:**

> *"A spendthrift provision is valid if it restrains both voluntary and involuntary transfer of a beneficiary's interest."*

**UTC §502(a):**

> *"A spendthrift provision is valid only if it restrains both voluntary and involuntary transfer of a beneficiary's interest."*

A spendthrift clause prevents creditors of the beneficiary from reaching trust assets. This is one of the most powerful asset protection features of a properly drafted trust. The clause typically reads:

> *"No interest in the income or principal of this trust shall be anticipated, assigned, encumbered, or subject to any creditor's claim or to legal process prior to its actual receipt by the beneficiary."*

**Exceptions to spendthrift protection** (creditors who CAN reach trust assets despite spendthrift clause):
- Child support and alimony obligations — **UTC §503(b)(1)**
- Government claims (tax liens, Medicaid) — **UTC §503(b)(2)**
- Self-settled trusts (where grantor is also beneficiary) — **UTC §505(a)(2)**

## The Separation Principle

The power of the trust lies in the **separation of legal and equitable title**:

- The **trustee** holds legal title — they appear on deeds, accounts, registrations
- The **beneficiary** holds equitable title — they enjoy the use and benefits
- If the beneficiary is sued, the creditor cannot reach trust assets because the beneficiary does not hold legal title
- If the trustee is sued personally, the creditor cannot reach trust assets because those assets belong to the trust, not the trustee personally

**Restatement (Third) of Trusts §42:**

> *"Trust property is not subject to the personal obligations of the trustee."*

This separation is the engine of asset protection.

## The Private Express Trust: Bridging Jurisdictions

Beyond the legal mechanics of trustee, grantor, and beneficiary lies a deeper framework — the **three jurisdictions** that govern all human activity. Understanding these jurisdictions reveals why the Private Express Trust is such a powerful instrument.

### The Three Jurisdictions

| Realm | Type | Law | Entities | Governed By |
|-------|------|-----|----------|-------------|
| **Water** | Public | Commerce, Commercial Law, Maritime Law, Admiralty Law | Corporation, dead entity, legal fiction, straw man, ALL CAPS NAME, person | Statutes and codes |
| **Air** | Ministry | Ecclesiastical, God's Law | Testament, Covenant, Trust | Faith |
| **Land** | Private | Natural Law, Common Law, Law of the Land | PMA, Express Trust, living man or woman, given name + family name, people | Equity |

### How the Jurisdictions Interact

Each jurisdiction governs a distinct sphere of exchange:

- **Water (Commerce):** Money & Banking — governed by statutes and codes
- **Air (Ministry):** Gifts — governed by Faith
- **Land (Private):** Exchange — governed by Equity

**Private Express Trusts** originate in **Ecclesiastical Law** jurisdiction — the realm of Air. This is significant because Ministry flies above the other vessels, spanning both land and water, making it an excellent intermediary between the public and the private.

### The Bridge Between Public and Private

The Private Express Trust provides an excellent bridge between the public and the private realms. Because trusts have their roots in ecclesiastical jurisdiction, they carry a unique status:

- **Ministries can serve the people of the public** without the usual obligations to the public realms incurred in commerce
- A trust operating under ecclesiastical principles can interface with commercial institutions while maintaining its private character
- The trust instrument itself functions as a covenant — a sacred agreement that predates and transcends statutory law

### Sovereign Alignment

A **Private Express Trust** brings you, your assets, and your sacred business into **sovereign alignment** — bridging God's Law with the Common Law of the Land. This is not merely a legal strategy; it is a philosophical and spiritual alignment of your commercial affairs with your deeper values.

The separation of legal and equitable title (discussed above) is the mechanical expression of this principle — the trustee navigates the waters of commerce while the beneficiary remains on the land, protected.`,
  },
  {
    order: 3,
    title: "Types of Trusts — Legal Characteristics",
    duration: "35 min",
    content: `# Types of Trusts — Legal Characteristics and Selection

## 1. Irrevocable Trust

### Definition

**Black's Law Dictionary (11th Edition):**
> *"Irrevocable trust: A trust that cannot be terminated by the settlor once it is created. In most states, a trust will be deemed irrevocable unless the settlor specifies otherwise."*

**UTC §602(a):**
> *"Unless the terms of a trust expressly provide that the trust is revocable, the settlor may not revoke or amend the trust."*

Note: Under the UTC (adopted by most states), **trusts are presumed irrevocable** unless the instrument says otherwise. This is the opposite of the common law rule in some jurisdictions.

### Legal Characteristics

| Feature | Detail |
|---------|--------|
| **Amendability** | Cannot be amended or revoked by grantor after creation |
| **Asset protection** | Strongest — assets are beyond grantor's creditors |
| **Tax treatment** | Non-grantor trust (separate tax entity under 26 USC §641) if grantor retains no prohibited powers |
| **Estate tax** | Assets generally excluded from grantor's taxable estate (26 USC §2036-2038) |
| **Control** | Grantor surrenders control; trustee manages per trust terms |
| **Creditor protection** | Maximum — grantor's creditors generally cannot reach trust assets |

### Case Law

**United States v. Estate of Grace, 395 U.S. 316 (1969):**
The Supreme Court held that reciprocal trusts created by spouses will be "uncrossed" for estate tax purposes — substance over form applies.

**Helvering v. Clifford, 309 U.S. 331 (1940):**
The grantor may be treated as owner for tax purposes if sufficient control is retained — this case gave rise to the grantor trust rules of IRC §§671-679.

### When to Use
- Maximum asset protection is the primary goal
- Estate tax reduction is desired
- Grantor is willing to permanently relinquish control
- Assets are significant enough to justify the irrevocability

## 2. Express Trust

### Definition

**Restatement (Third) of Trusts §2, Comment a:**
> *"An express trust is a trust created by the expressed intention of the owner of property... It is distinguished from trusts that arise by operation of law."*

**Black's Law Dictionary:**
> *"Express trust: A trust created with the settlor's express intent, usually declared in writing; a trust created by the direct and positive acts of the parties, by some writing, deed, or will, or oral declaration."*

### Legal Characteristics

An express trust must satisfy four elements (the "four certainties" in traditional trust law):

1. **Certainty of intention** — the settlor must intend to create a trust
   - **Restatement (Third) §13**: The intention must be manifested
   - Words like "I give to X in trust for Y" or "I declare that I hold this property for the benefit of Y"

2. **Certainty of subject matter** — the trust property must be identifiable
   - **Restatement (Third) §40**: Trust property must be specific and ascertainable
   - "All my property" is sufficient; "some of my stocks" may not be

3. **Certainty of objects** — the beneficiaries must be identifiable
   - **Restatement (Third) §44**: Beneficiaries must be ascertainable
   - "My children" is sufficient; "my friends" may be too vague

4. **Valid purpose** — the trust cannot be for an illegal purpose
   - **Restatement (Third) §27**: A trust is valid only if its purpose is lawful and not contrary to public policy

### Express Trust vs. Implied Trust

| Feature | Express Trust | Implied Trust |
|---------|--------------|---------------|
| **Creation** | Intentional act of the settlor | Arises by operation of law |
| **Documentation** | Written trust instrument (usually) | No written instrument |
| **Types** | Irrevocable, revocable, charitable | Resulting trust, constructive trust |
| **Control** | Settlor defines terms | Terms imposed by law or equity |

## 3. Common Law Trust (Pure Trust / Constitutional Trust)

### Definition

A common law trust is a trust that derives its authority not from statute but from centuries of common law precedent. It is sometimes called a "pure trust" or "unincorporated business organization."

**Bogert, Trusts and Trustees §1:**
> *"The common law trust is one of the most ancient institutions of English jurisprudence."*

### Legal Characteristics

| Feature | Detail |
|---------|--------|
| **Authority** | Common law, not statutory |
| **Formation** | Trust indenture (declaration/agreement) |
| **Duration** | May be perpetual (where not limited by Rule Against Perpetuities) |
| **Entity status** | Not a statutory entity; exists as a contractual arrangement |
| **Taxation** | IRS may classify as trust, association, or business trust (Treas. Reg. §301.7701-4) |
| **Asset protection** | Depends on structure and jurisdiction |

### IRS Classification Warning

**Treasury Regulation §301.7701-4(b):**
> *"There are other arrangements which are known as trusts because the legal title to property is conveyed to trustees for the benefit of beneficiaries, but which are not classified as trusts for purposes of the Internal Revenue Code because they are not simply arrangements to protect or conserve the property for the beneficiaries..."*

The IRS may classify a common law trust as a **"business trust"** — taxed as a corporation — if it conducts business or has transferable beneficial interests. Proper structuring is essential.

### Case Law

**Morrissey v. Commissioner, 296 U.S. 344 (1935):**
The Supreme Court established the test for when a trust arrangement will be classified as an association (taxable as a corporation). Factors include:
- Centralized management
- Continuity of life
- Transferability of interests
- Limited liability

This case is critical for anyone establishing a common law trust — the structure must avoid these corporate characteristics to maintain trust taxation.

## 4. Land Trust (Illinois Land Trust)

### Definition

**Black's Law Dictionary:**
> *"Land trust: A land-ownership arrangement by which a trustee holds both legal and equitable title to the land while the beneficiary retains the power of direction and the right to manage and receive income from the property."*

### Legal Basis

The land trust originated in Illinois and is recognized by statute in several states:
- **Illinois: 765 ILCS 405** (Land Trust Act)
- **Florida: Fla. Stat. §689.071**
- **Virginia, Indiana, Hawaii, North Dakota** — by statute or case law

### Legal Characteristics

| Feature | Detail |
|---------|--------|
| **Privacy** | Beneficiary's name does not appear on public records — only the trustee |
| **Probate avoidance** | Beneficial interest is personal property, passes outside probate |
| **Ease of transfer** | Transfer beneficial interest without recording a new deed |
| **Asset protection** | Limited — beneficial interest may be reachable by creditors |
| **Property tax** | Assessed to the trust/trustee |
| **Liability** | Trustee has no personal liability beyond trust assets (if properly structured) |

### Case Law

**Chicago Federal Savings & Loan Assn. v. Cacciatore, 25 Ill.2d 535 (1962):**
The Illinois Supreme Court recognized the validity of the land trust arrangement and held that the beneficial interest is personal property, not real property.

**Illiana Federal Savings & Loan Assn. v. Pahls, 49 Ill. App. 3d 350 (1977):**
Confirmed that a land trust conveys both legal and equitable title to the trustee.

## 5. Spendthrift Trust

### Definition

**Restatement (Third) of Trusts §58:**
> *"A spendthrift trust is a trust in which the settlor includes a provision that prevents the beneficiary from transferring his or her interest in the trust and also prevents creditors from attaching the trust assets to satisfy the beneficiary's debts."*

### Key Statute: UTC §502

> *"(a) A spendthrift provision is valid only if it restrains both voluntary and involuntary transfer of a beneficiary's interest.*
> *(b) A term of a trust providing that the interest of a beneficiary is held subject to a 'spendthrift trust,' or words of similar import, is sufficient to restrain both voluntary and involuntary transfer."*

### Exceptions (UTC §503)

Creditors who can reach spendthrift trust assets despite the provision:
- **Children or spouse** with support obligations — §503(b)(1)
- **State or federal government** — §503(b)(2)
- **Providers of services** to the trust — §503(b)(3)
- **Self-settled trusts** (where settlor is also beneficiary) — §505(a)(2)

### Case Law

**Scheffel v. Krueger, 146 N.H. 669 (2001):**
The court held that a spendthrift provision protected trust assets from a tort creditor — even where the beneficiary had committed an intentional tort — because the state had no exception for such claims.

**Broadway National Bank v. Adams, 133 Mass. 170 (1882):**
One of the earliest American cases recognizing the validity of spendthrift trusts, written by Justice Holmes.

## Choosing the Right Trust

| Need | Recommended Trust Type |
|------|----------------------|
| Maximum asset protection | Irrevocable trust with spendthrift clause |
| Real property privacy | Land trust |
| Business operations | Common law trust (carefully structured) |
| Family wealth transfer | Irrevocable express trust |
| Flexibility and control | Revocable express trust (weaker protection) |
| Creditor protection for beneficiaries | Spendthrift trust |
| Probate avoidance | Any trust (assets held in trust avoid probate) |

## Legal Authority Summary

| Authority | Citation | Key Point |
|-----------|----------|-----------|
| Restatement (Third) of Trusts | §§2, 5, 13, 27, 40, 44, 58 | Definitions, creation, requirements |
| Uniform Trust Code | §§502, 503, 505, 602 | Spendthrift rules, revocability |
| IRC §§641-685 | Trust taxation | Federal tax treatment |
| IRC §§671-679 | Grantor trust rules | When grantor is treated as owner |
| Treas. Reg. §301.7701-4 | Trust classification | IRS business trust classification |
| 765 ILCS 405 | Illinois Land Trust Act | Land trust statutory basis |
| Morrissey v. Commissioner | 296 U.S. 344 (1935) | Trust vs. association test |
| Helvering v. Clifford | 309 U.S. 331 (1940) | Grantor trust doctrine |
| Meinhard v. Salmon | 249 N.Y. 458 (1928) | Fiduciary duty standard |
| Scheffel v. Krueger | 146 N.H. 669 (2001) | Spendthrift protection upheld |

## Private Membership Associations (PMAs)

Beyond traditional trust types, **Private Membership Associations (PMAs)** represent a powerful structure rooted in Common Law that complements trust-based asset protection.

### What Is a PMA?

A Private Membership Association is a private organization in which members can **privately exchange goods, services, and compensation within the membership by mutual agreement**. PMAs create a clear container for delivering offerings based on Common Law — outside the regulatory reach of public commerce.

### The Foundation: Common Law and Natural Law

PMAs operate under two foundational principles:

> **Natural Law** = Do no harm & do not trespass.

According to Common Law, **you are responsible for making remedy if you directly cause harm**. This is the only true obligation — not the thousands of statutes and codes that govern public commerce, but the simple, ancient principle of accountability for harm.

### Agreements, Not Contracts

A critical distinction: within a PMA, we use the term **"agreement"** rather than **"contract"** — to stay **lawful** rather than **legal**. This is not mere semantics. Contracts are instruments of commercial law (the jurisdiction of Water), while agreements are instruments of Common Law (the jurisdiction of Land).

### Elements of an Agreement

PMAs are created with the elements of a contract (though we call it an "agreement"):

| Element | Description |
|---------|-------------|
| **Offer** | One party proposes terms |
| **Acceptance** | The other party agrees to those terms |
| **Consideration** | Something of value is exchanged |
| **Meeting of the minds** | Both parties understand and agree to the same terms |
| **Competency & capacity** | Both parties are of sound mind and legal age |
| **Identification of parties** | All parties are clearly identified |

### PMA Supporting Documents

A properly established PMA is supported by:

- **Agreement** — the foundational document establishing the PMA and its terms
- **Bylaws** — the internal rules governing the PMA's operations
- **Constitution or Articles of Association** — the overarching principles and structure

### Ideal Uses for PMAs

PMAs are excellent for:

- **Community supported agriculture** — private food exchange among members
- **Holistic wellness practices** — health and healing services outside regulatory frameworks
- **Retreats** — spiritual, educational, or wellness gatherings
- **Supper clubs** — private dining experiences
- **Educational communities** — private learning and mentorship
- **Creative cooperatives** — shared resources and collaborative work

### Limitation

A PMA **cannot offer anything that presents a clear and present danger of substantive evil**. This is the boundary set by Common Law — freedom of association is broad, but it does not extend to activities that cause genuine harm.

### PMAs and Trusts: A Powerful Combination

When combined with the trust structures discussed in this course, PMAs create a layered approach to sovereignty — the PMA provides the private container for exchange, while the trust provides the vessel for holding and protecting assets.`,
  },
  {
    order: 4,
    title: "What Can Be Placed in Trust — Assets & Transfer",
    duration: "25 min",
    content: `# What Can Be Placed in Trust

## The General Rule

**Restatement (Third) of Trusts §40:**

> *"Any interest in property that is transferable can be held in trust."*

**Black's Law Dictionary** defines "trust property" (corpus or res) as:

> *"Property that is held in trust; the body or principal of a trust."*

The principle is simple: **if it can be owned, it can be held in trust.** The trust property (also called the "corpus" or "res") can include any form of asset — real, personal, tangible, or intangible.

## Asset Categories and Transfer Methods

### 1. Real Property (Land and Buildings)

**Transfer method:** Execute a new **deed** (warranty deed, quitclaim deed, or grant deed depending on jurisdiction) conveying the property from the grantor to the trustee of the trust.

**Recording:** The deed must be recorded in the county recorder's office where the property is located.

**Example deed language:**
> *"[Grantor Name] hereby conveys and warrants to [Trustee Name], as Trustee of the [Trust Name] Trust, dated [Date], the following described real property..."*

**Legal considerations:**
- **Title insurance** — notify your title insurance company; some policies require it
- **Due-on-sale clause** — **12 USC §1701j-3** (the Garn-St. Germain Depository Institutions Act of 1982) provides that a transfer to a trust in which the borrower remains a beneficiary does **not** trigger the due-on-sale clause
- **Property taxes** — transfer to a trust generally does not trigger reassessment in most states (verify your state's laws)
- **Homestead exemption** — may need to verify eligibility is maintained after transfer

### 2. Bank Accounts and Financial Instruments

**Transfer method:** Open a new account in the trust's name or re-title an existing account.

**Account titling:**
> *"[Trust Name] Trust, dated [Date], [Trustee Name], Trustee"*

**Required documentation:** Banks typically require:
- A copy of the trust instrument (or a **certification of trust** under **UTC §1013**)
- Trustee identification
- Trust EIN (Employer Identification Number) if a non-grantor trust — obtain from IRS using **Form SS-4**

**Types of financial instruments that can be held in trust:**
- Checking and savings accounts
- Certificates of deposit
- Brokerage accounts
- Stocks, bonds, and mutual funds
- Money market accounts

### 3. Vehicles

**Transfer method:** Complete a title transfer through your state's DMV, changing the title to the trustee of the trust.

**New title should read:**
> *"[Trustee Name], Trustee of the [Trust Name] Trust"*

**Insurance:** Notify your insurance company of the change in ownership. The trust (or trustee in trust capacity) should be the named insured.

### 4. Personal Property (Tangible)

**Transfer method:** Execute a **Bill of Sale** or **Assignment of Personal Property** transferring ownership to the trust.

**Items include:** Furniture, art, jewelry, collectibles, equipment, tools, etc.

**Example language:**
> *"For good and valuable consideration, [Grantor] hereby transfers, assigns, and conveys to [Trustee], as Trustee of the [Trust Name] Trust, all right, title, and interest in the following personal property: [description]."*

### 5. Intellectual Property

**Transfer method:** Execute an **Assignment of Intellectual Property** to the trust.

**For patents:** File the assignment with the U.S. Patent and Trademark Office (**37 CFR §3.1**)
**For copyrights:** Record the assignment with the U.S. Copyright Office (**17 USC §205**)
**For trademarks:** File assignment with USPTO (**37 CFR §3.1**)

### 6. Business Interests

**Transfer method depends on entity type:**

| Entity | Transfer Document |
|--------|------------------|
| LLC membership interest | Assignment of membership interest + amend operating agreement |
| Partnership interest | Assignment of partnership interest + amend partnership agreement |
| Corporation stock | Stock transfer (endorse stock certificate + issue new certificate) |
| Sole proprietorship | Bill of sale for assets; may require new registrations |

**Important:** Review the operating agreement, partnership agreement, or corporate bylaws for any restrictions on transfer. Many agreements require consent of other members/partners.

### 7. Life Insurance Policies

**Transfer method:** Change the **owner** of the policy to the trust (or trustee as trustee). This is done by contacting the insurance company and completing an ownership change form.

**Irrevocable Life Insurance Trust (ILIT):**
Under **26 USC §2042**, life insurance proceeds are included in the insured's gross estate if the insured holds any "incidents of ownership" at death. By transferring the policy to an irrevocable trust (ILIT), the proceeds may be excluded from the taxable estate.

**Caution:** Under **26 USC §2035(a)**, if the insured transfers the policy within three years of death, the proceeds are still included in the estate (the "three-year rule").

## The Cardinal Rule

**"If it's not in the trust, it's not protected."**

A trust without funded assets is an empty legal shell. The trust instrument, no matter how well drafted, protects nothing until property is actually transferred.

**Restatement (Third) of Trusts §2, Comment f:**

> *"A trust cannot exist without trust property. A declaration of trust that does not identify specific property to be held in trust does not create a trust."*

**UTC §401:**

> *"A trust may be created only to the extent there is trust property."*

## Schedule of Trust Assets

Maintain a **Schedule of Trust Assets** — an exhibit to the trust instrument that lists all property held in trust. Update this schedule each time an asset is added or removed.

| Date Added | Asset Description | Transfer Document | Estimated Value |
|-----------|-------------------|-------------------|----------------|
| [Date] | 123 Main Street, City, State | Warranty Deed recorded [Book/Page] | $250,000 |
| [Date] | Chase Bank Account #XXXX | Account re-titled | $45,000 |
| [Date] | 2024 Toyota Camry, VIN: XXX | Title transfer | $28,000 |

## Legal Authority Summary

| Authority | Citation | Relevance |
|-----------|----------|-----------|
| Restatement (Third) of Trusts | §2, §40 | Trust property requirements |
| UTC §401 | Trust creation | Trust requires property |
| UTC §1013 | Certification of trust | Alternative to sharing full instrument |
| 12 USC §1701j-3 | Garn-St. Germain Act | Trust transfer doesn't trigger due-on-sale |
| 26 USC §2042 | Life insurance in estate | Incidents of ownership rule |
| 26 USC §2035(a) | Three-year rule | Transfer within 3 years of death |
| 37 CFR §3.1 | Patent/trademark assignment | Recording requirements |
| 17 USC §205 | Copyright assignment | Recording requirements |`,
  },
  {
    order: 5,
    title: "The Trust Instrument — Drafting Essentials",
    duration: "30 min",
    content: `# The Trust Instrument — Drafting Essentials

## What Is a Trust Instrument?

**Black's Law Dictionary (11th Edition):**
> *"Trust instrument: The document by which a trust is created; a document (such as a deed of trust or declaration of trust) that sets forth the terms under which the trust property is to be managed and distributed."*

The trust instrument is the governing document of the trust. It is the law of the trust — every right, duty, power, and limitation flows from this document.

**UTC §103(18):**
> *"'Terms of a trust' means the manifestation of the settlor's intent regarding a trust's provisions as expressed in the trust instrument or as may be established by other evidence that would be admissible in a judicial proceeding."*

## Essential Components

### 1. Declaration of Trust

The opening clause that manifests the settlor's intent to create the trust:

> *"I, [Grantor Name], hereby declare and establish this Trust, and do hereby transfer and assign to [Trustee Name], as Trustee, the property described in Schedule A attached hereto, to be held, administered, and distributed in accordance with the following terms and provisions."*

**Restatement (Third) of Trusts §13:**
> *"A trust is created only if the settlor properly manifests an intention to create a trust."*

### 2. Name of the Trust

The trust should have a clear, identifiable name:

> *"This trust shall be known as the [Name] Trust, established on [Date]."*

Avoid names that suggest the trust is a business entity, as this may affect IRS classification under **Treasury Regulation §301.7701-4**.

### 3. Statement of Purpose

> *"The purpose of this Trust is to hold, manage, invest, and distribute the trust property for the benefit of the Beneficiaries named herein, and for such other lawful purposes as may be consistent with this instrument."*

**Restatement (Third) of Trusts §27:**
> *"A trust is valid only if its purpose is lawful, is not contrary to public policy, and is possible to achieve."*

### 4. Identification of Parties

Clearly identify all parties:

**Grantor/Settlor:** Full legal name, address
**Trustee:** Full legal name, address (initial trustee and successor trustees)
**Beneficiaries:** Full legal names (or description of a class — "my children")

**Restatement (Third) of Trusts §44:**
> *"A trust is not created unless the beneficiaries are defined with reasonable certainty or the class of persons to benefit is described sufficiently to enable the court to identify them."*

### 5. Trust Property (Corpus/Res)

Reference to the trust property, typically via a Schedule:

> *"The initial trust property consists of the assets listed on Schedule A attached hereto and incorporated by reference."*

**UTC §401:**
> *"A trust may be created only to the extent there is trust property."*

### 6. Powers of the Trustee

Enumerate the trustee's powers specifically. Standard powers include:

- Power to buy, sell, exchange, and lease trust property
- Power to invest and reinvest
- Power to borrow and mortgage trust property
- Power to collect income and make distributions
- Power to employ agents, attorneys, and accountants
- Power to make elections for tax purposes
- Power to execute documents on behalf of the trust

**UTC §815:**
> *"A trustee, without authorization by the court, may exercise: (1) powers conferred by the terms of the trust; and (2) except as limited by the terms of the trust... all powers over the trust property which an unmarried competent owner has over individually owned property."*

**Caution under Grantor Trust Rules:**
Certain powers retained by the grantor may cause the trust to be classified as a grantor trust under **26 USC §§671-679**:

| Power | IRC Section | Effect |
|-------|-----------|--------|
| Power to revoke | §676 | Grantor treated as owner |
| Power to control distributions | §674 | Grantor treated as owner |
| Power to deal with trust for less than adequate consideration | §675(1) | Grantor treated as owner |
| Power to borrow without adequate security | §675(2) | Grantor treated as owner |
| Reversionary interest > 5% | §673 | Grantor treated as owner |

### 7. Duties of the Trustee

While duties arise by operation of law (see Lesson 2), explicitly stating them in the instrument provides clarity:

> *"The Trustee shall administer this Trust in accordance with its terms and in the interest of the Beneficiaries. The Trustee shall exercise the care, skill, and caution of a reasonably prudent person."*

### 8. Distribution Terms

The distribution provisions are the heart of the trust. Common standards include:

**Mandatory distributions:**
> *"The Trustee shall distribute all net income to the Beneficiary quarterly."*

**Discretionary distributions:**
> *"The Trustee may distribute principal as the Trustee deems advisable for the health, education, maintenance, and support of the Beneficiary."*

The "HEMS" standard (**Health, Education, Maintenance, Support**) is significant because under **26 USC §2041** and **§2514**, a power limited by an ascertainable standard does not constitute a general power of appointment — preserving estate tax benefits.

### 9. Successor Trustee

> *"In the event the Trustee is unable or unwilling to serve, [Successor Name] shall serve as Successor Trustee."*

**UTC §704(c):**
> *"If a vacancy occurs in a trusteeship, and the vacancy is not filled within a reasonable time, the court may appoint a successor trustee."*

Always name at least one successor. Consider naming a process for appointing additional successors:

> *"If no named successor trustee is able or willing to serve, the remaining beneficiaries, by majority vote, may appoint a successor trustee."*

### 10. Governing Law

> *"This Trust shall be governed by and construed in accordance with the laws of the State of [State], without regard to its conflict of laws principles."*

This clause determines which state's trust law applies. Choose a state with favorable trust laws (e.g., South Dakota, Delaware, Nevada, and Alaska have particularly favorable trust statutes).

### 11. Amendment and Revocation

**For a revocable trust:**
> *"The Grantor reserves the right to amend, modify, or revoke this Trust, in whole or in part, by written instrument delivered to the Trustee."*

**For an irrevocable trust:**
> *"This Trust is irrevocable and may not be amended, modified, or revoked by the Grantor."*

**UTC §602(a):** Unless expressly stated as revocable, a trust is irrevocable.

### 12. Spendthrift Provision

> *"No beneficiary shall have the power to anticipate, pledge, assign, or otherwise encumber his or her interest in the income or principal of this Trust. No interest of any beneficiary shall be subject to claims of creditors, or to attachment, execution, bankruptcy proceedings, or any other legal process."*

See Lesson 3 for full analysis of spendthrift protections under **UTC §502** and **Restatement (Third) §58**.

### 13. Severability

> *"If any provision of this Trust is held invalid or unenforceable, the remaining provisions shall continue in full force and effect."*

### 14. Signature and Execution

The trust instrument must be signed by the grantor and, in most jurisdictions, by the trustee (acknowledging acceptance). Notarization is recommended though not always required.

**Restatement (Third) of Trusts §15:**
> *"No particular form of words or conduct is necessary for the creation of a trust. A trust may be created by a writing, by an oral statement, or by conduct."*

However, for real property, the **Statute of Frauds** (present in every state) requires a written instrument.

## Legal Authority Summary

| Authority | Citation | Relevance |
|-----------|----------|-----------|
| Restatement (Third) of Trusts | §§2, 13, 15, 27, 40, 44, 58 | Creation, intent, property, beneficiaries |
| UTC §§103, 401, 502, 602, 704, 815 | Trust Code provisions | Terms, creation, spendthrift, powers |
| IRC §§671-679 | Grantor trust rules | Tax classification |
| IRC §2041 | General power of appointment | Estate tax implications |
| IRC §2514 | Power of appointment (gift tax) | Gift tax implications |
| Treas. Reg. §301.7701-4 | Trust classification | Business trust vs. trust |
| Statute of Frauds | State-specific | Written instrument for real property |

## The PMA and Private Express Trust: A Sovereign Combination

Operating within a **Private Membership Association** with a **Private Express Trust** as a vessel for interfacing with commercial institutions is a powerful combination. The PMA provides the private, Common Law container for your activities and exchanges, while the trust instrument provides the bridge to commercial institutions — banks, registrars, and government agencies — without surrendering your private standing.

### The Path to Sovereignty

The private container of a PMA, combined with **lawful money redemption**, sets you on the path to sovereignty while:

- **Reducing the national debt** — lawful money redemption under 12 USC \u00A7411 removes Federal Reserve Notes from circulation as debt instruments
- **Empowering others** — every person who steps into private standing creates a ripple effect
- **Contributing to the growing collective field of freedom** — as more people operate from private jurisdiction, the infrastructure of sovereignty strengthens for all

This combination — the trust instrument as the legal vessel, the PMA as the private container, and lawful money redemption as the financial mechanism — represents a comprehensive approach to conscious participation in commerce without unconscious obligation.`,
  },
  {
    order: 6,
    title: "Asset Transfer & Funding the Trust",
    duration: "25 min",
    content: `# Asset Transfer & Funding the Trust

## The Fundamental Rule

**"A trust without assets is an empty vessel."**

**UTC §401:**
> *"A trust may be created only to the extent there is trust property."*

**Restatement (Third) of Trusts §2, Comment f:**
> *"A declaration of trust that does not identify specific property to be held in trust does not create a trust."*

No matter how perfectly drafted the trust instrument, it protects nothing until assets are actually transferred into it. "Funding" the trust — the process of transferring assets from personal ownership to trust ownership — is the most critical step after creation.

## Transfer Methods by Asset Type

### Real Property

**Step 1: Prepare the deed**
Execute a deed (warranty deed, quitclaim deed, or grant deed) conveying the property from the grantor to the trustee.

**Deed language:**
> *"[Grantor], for good and valuable consideration, does hereby grant, bargain, sell, and convey to [Trustee Name], as Trustee of the [Trust Name] Trust dated [Date], the following described real property: [legal description]."*

**Step 2: Record the deed**
File the deed with the county recorder's office. Recording provides constructive notice to the world of the trust's ownership.

**Step 3: Update related documents**
- Notify mortgage servicer (transfer does NOT trigger due-on-sale under **12 USC §1701j-3** if grantor remains a beneficiary)
- Update property insurance to name the trust
- Verify homestead exemption eligibility
- Update any rental agreements to reflect trust ownership

**Transfer tax consideration:** Many states exempt transfers to a grantor's own trust from transfer taxes. Check your state's specific provisions.

### Bank and Financial Accounts

**Option A: Re-title existing account**
Contact the bank and request the account be re-titled to the trust. Provide:
- Certification of trust (**UTC §1013**) or copy of trust instrument
- Trustee identification (government-issued ID)
- Trust EIN (if non-grantor trust; obtain via **IRS Form SS-4**)

**Option B: Open new trust account**
Open a new account in the trust's name and transfer funds from the personal account.

**Account title format:**
> *"[Trust Name] Trust, dated [Date], [Trustee Name], Trustee"*

**EIN Requirements:**
- **Revocable/grantor trust:** May use grantor's SSN (no separate EIN required during grantor's lifetime)
- **Irrevocable/non-grantor trust:** Must obtain its own EIN from the IRS

### Investment and Brokerage Accounts

Contact the brokerage firm to:
1. Re-title the account to the trust
2. Provide trust documentation
3. Update beneficiary designations if applicable

**Caution:** Transferring retirement accounts (IRA, 401(k)) to a trust during the owner's lifetime can trigger immediate taxation as a deemed distribution under **26 USC §408(d)**. Retirement accounts should generally name the trust as **beneficiary**, not be transferred into the trust.

### Vehicles

1. Obtain a title transfer form from your state's DMV
2. Complete the form, transferring title from personal name to the trustee
3. New title reads: *"[Trustee Name], Trustee of the [Trust Name] Trust"*
4. Update vehicle insurance to reflect trust ownership

### Personal Property

Execute a **General Assignment of Personal Property:**

> *"For good and valuable consideration, [Grantor] hereby assigns, transfers, and conveys to [Trustee Name], as Trustee of the [Trust Name] Trust dated [Date], all of Grantor's right, title, and interest in and to the personal property described in Schedule B attached hereto."*

Attach a detailed schedule listing each item.

### Business Interests

**LLC Membership Interest:**
1. Execute an **Assignment of Membership Interest** to the trust
2. Amend the LLC's operating agreement to reflect the new member
3. Update the LLC's records (certificate of membership, membership register)

**Corporate Stock:**
1. Endorse the stock certificate to the trust
2. Have the corporation issue a new certificate in the trustee's name
3. Update the corporate stock ledger

**Note:** Review the operating agreement or bylaws for any consent requirements or restrictions on transfer.

## Post-Transfer Checklist

After transferring each asset, verify:

- [ ] Transfer document executed and (if applicable) recorded
- [ ] Schedule of Trust Assets updated
- [ ] Insurance updated to reflect trust ownership
- [ ] Third parties notified (bank, mortgage servicer, DMV, etc.)
- [ ] Tax records updated (property tax, income allocation)
- [ ] Original transfer documents filed in trust records

## Common Mistakes in Trust Funding

| Mistake | Consequence | Prevention |
|---------|-------------|------------|
| **Failing to fund the trust** | Trust protects nothing | Transfer assets immediately after creating the trust |
| **Incomplete transfers** | Asset remains in personal name, exposed | Verify title/ownership records after every transfer |
| **Forgetting newly acquired assets** | New purchases unprotected | Acquire new assets in the trust's name from the start |
| **Transferring retirement accounts** | Taxable distribution under §408(d) | Name trust as beneficiary, don't transfer ownership |
| **Ignoring due-on-sale concerns** | Unnecessary fear of mortgage acceleration | Cite 12 USC §1701j-3 — transfers to grantor's trust are exempt |
| **Not updating insurance** | Coverage gap; denied claims | Update policy to name trust as owner/insured |

## Legal Authority Summary

| Authority | Citation | Relevance |
|-----------|----------|-----------|
| UTC §401 | Trust creation | Trust requires property |
| UTC §1013 | Certification of trust | Alternative to sharing full instrument |
| Restatement (Third) §2 | Trust definition | Property requirement |
| 12 USC §1701j-3 | Garn-St. Germain Act | Due-on-sale exemption for trust transfers |
| 26 USC §408(d) | IRA distribution rules | Retirement account caution |
| IRS Form SS-4 | EIN application | Required for non-grantor trusts |`,
  },
  {
    order: 7,
    title: "Ongoing Trust Administration & Compliance",
    duration: "25 min",
    content: `# Ongoing Trust Administration & Compliance

## The Trustee's Ongoing Obligations

Creating and funding a trust is only the beginning. The trust must be **properly administered** on an ongoing basis, or its protections can be compromised — or worse, the trustee can face personal liability.

**UTC §801:**
> *"Upon acceptance of a trusteeship, the trustee shall administer the trust in good faith, in accordance with its terms and purposes and the interests of the beneficiaries, and in accordance with this [Code]."*

## Core Administrative Duties

### 1. Maintain Separate Records

Trust assets, income, and expenses must be **kept separate** from the trustee's personal assets.

**UTC §810(d):**
> *"A trustee shall keep adequate records of the administration of the trust."*

**Restatement (Third) of Trusts §83:**
> *"A trustee has a duty to maintain clear, complete, and accurate books and records regarding the trust and its administration."*

**Commingling prohibition:** If the trustee mixes trust funds with personal funds, the trust's legal protections may be pierced.

**National Academy of Sciences v. Cambridge Trust Co., 370 Mass. 303 (1976):**
> *"Commingling of trust and personal funds constitutes a breach of fiduciary duty."*

### 2. Conduct All Business in the Trust Name

When acting for the trust:
- Sign as: *"[Your Name], Trustee of the [Trust Name] Trust"*
- Never sign personally for trust obligations
- Use the trust's EIN (if applicable) on all tax documents
- Contracts, leases, and agreements should name the trust as the party

### 3. Maintain Separate Bank Accounts

The trust must have its own bank account(s). All trust income must be deposited into trust accounts, and all trust expenses paid from trust accounts.

### 4. Keep Accountings

**UTC §813(c):**
> *"A trustee shall send to the distributees or permissible distributees of trust income or principal, and to other qualified or nonqualified beneficiaries who request it, at least annually... a report of the trust property, liabilities, receipts, and disbursements."*

The accounting should include:
- Beginning balance of all trust assets
- All income received during the period
- All expenses paid during the period
- All distributions made
- Ending balance
- Schedule of all assets held

### 5. File Required Tax Returns

**Grantor trust (revocable during grantor's lifetime):**
- Income reported on grantor's personal return (Form 1040)
- No separate trust return required (or file informational Form 1041 with a grantor trust statement)

**Non-grantor trust (irrevocable):**
- File **IRS Form 1041** (U.S. Income Tax Return for Estates and Trusts) annually
- Trust is a separate taxpaying entity under **26 USC §641**
- Trust tax rates are compressed — the highest rate (37%) applies at just $14,450+ of income (2024)
- Distributions to beneficiaries generate a **K-1** (Schedule K-1, Form 1041) for each beneficiary

**State filings:** Many states also require trust income tax returns. Check your state's requirements.

### 6. Prudent Investment

**UTC §901 (Uniform Prudent Investor Act):**
> *"A trustee shall invest and manage trust assets as a prudent investor would, by considering the purposes, terms, distribution requirements, and other circumstances of the trust."*

**Key principles of the Prudent Investor Rule:**

- Diversification is required unless the trust terms say otherwise — **UTC §903**
- Risk and return must be balanced with the trust's purpose
- The trustee must consider the **entire portfolio**, not individual investments
- The trustee may delegate investment functions to qualified professionals — **UTC §807**

### 7. Duty to Inform Beneficiaries

**UTC §813(a):**
> *"A trustee shall keep the qualified beneficiaries of the trust reasonably informed about the administration of the trust and of the material facts necessary for them to protect their interests."*

**UTC §813(b):**
> *"Within 60 days after accepting a trusteeship, the trustee shall notify the qualified beneficiaries of the acceptance and of the trustee's name, address, and telephone number."*

## Annual Trust Review Checklist

Conduct a thorough annual review:

- [ ] **Asset inventory** — verify all trust assets are accounted for and properly titled
- [ ] **New asset review** — ensure any assets acquired during the year are in the trust's name
- [ ] **Insurance review** — verify all insurance policies name the trust as owner/insured
- [ ] **Beneficiary review** — confirm beneficiary designations are current
- [ ] **Distribution review** — verify all required distributions were made
- [ ] **Tax filing** — confirm all required returns were filed (Form 1041, state returns)
- [ ] **Accounting** — prepare and distribute annual accounting to beneficiaries
- [ ] **Trustee succession** — verify successor trustees are still able and willing to serve
- [ ] **Legal review** — assess any changes in trust law that may affect the trust
- [ ] **Schedule of Assets** — update the trust's asset schedule

## Common Administrative Mistakes

| Mistake | Risk | Legal Basis |
|---------|------|-------------|
| **Commingling funds** | Loss of trust protection; breach of duty | UTC §810; Restatement §84 |
| **Signing personally** (not as trustee) | Personal liability for trust obligations | Common law agency principles |
| **Unfunded trust** | Trust provides no protection | UTC §401; Restatement §2 |
| **Missing tax filings** | IRS penalties under 26 USC §6651 | IRC §641; Form 1041 |
| **Neglecting accountings** | Breach of duty; beneficiary claims | UTC §813(c) |
| **Self-dealing** | Breach of loyalty; personal liability | UTC §802; Restatement §78 |
| **Failing to diversify** | Breach of prudent investor duty | UTC §901, §903 |
| **Ignoring beneficiary requests** | Breach of duty to inform | UTC §813(a) |

## Trustee Liability Protection

A trustee who acts in good faith may limit personal exposure:

**UTC §1008:**
> *"A term of a trust relieving a trustee of liability for breach of trust is unenforceable to the extent that it: (1) relieves the trustee of liability for breach of trust committed in bad faith or with reckless indifference; or (2) was inserted as the result of an abuse by the trustee of a fiduciary or confidential relationship."*

This means **exculpation clauses** can protect against negligence but not against bad faith or reckless conduct.

**UTC §1010:**
> *"A trustee is personally liable for torts committed in the course of administering a trust, or for obligations arising from ownership or control of trust property, only if the trustee is personally at fault."*

## Comprehensive Legal Authority

| Authority | Citation | Relevance |
|-----------|----------|-----------|
| UTC §801 | Administration standard | Good faith, terms, beneficiary interests |
| UTC §802 | Duty of loyalty | No self-dealing |
| UTC §804 | Prudent administration | Reasonable care standard |
| UTC §807 | Delegation | Investment delegation allowed |
| UTC §810(d) | Record-keeping | Adequate records required |
| UTC §813(a)-(c) | Duty to inform and account | Notice and annual reporting |
| UTC §901-903 | Prudent Investor Act | Investment standards |
| UTC §1002 | Damages for breach | Personal liability |
| UTC §1008 | Exculpation limits | Cannot excuse bad faith |
| UTC §1010 | Tort liability | Personal fault standard |
| IRC §641 | Trust taxation | Separate entity for non-grantor trusts |
| IRC §§671-679 | Grantor trust rules | When grantor is treated as owner |
| IRS Form 1041 | Trust income tax return | Annual filing requirement |
| Restatement (Third) | §§76-84 | Trustee duties |
| Meinhard v. Salmon | 249 N.Y. 458 (1928) | "Punctilio of an honor" standard |

## The Sovereignty Framework: Conscious Participation

Trust administration is more than a set of legal duties — it is an invitation to **conscious stewardship** of your assets, your agreements, and your participation in the systems that shape modern life.

### Unconscious Participation

Most systems operate because people participate **unconsciously**. Money, law, culture, and institutions exist because people believe in them and use them — often without questioning the terms of their participation. Banks operate because people deposit. Governments tax because people comply. Debt grows because people borrow without examining the underlying agreements.

### The Moment of Awakening

Once someone becomes aware of the system, they begin asking fundamental questions:

- **What agreements am I making?** — Every bank account, every contract, every tax filing is an agreement
- **What structures am I participating in?** — Corporations, government programs, financial institutions all have terms
- **Where does my authority actually come from?** — Is it delegated by the state, or is it inherent in your nature as a living man or woman?

That awareness is described as **awakening** — the moment when unconscious obligation transforms into conscious choice.

### Debt Systems and Civilization

Debt systems shape civilization. Governments, households, students, and corporations all carry debt in a hierarchy of obligations. This is not new — it mirrors ancient debt empires:

- **Babylon** — temple debt systems that controlled agriculture and trade
- **Rome** — debt bondage (nexum) that enslaved debtors to creditors
- **Medieval Europe** — feudal obligations and church tithes that bound serfs to land and lords

The modern system is a **technological version of ancient debt empires**. The mechanisms are more sophisticated — credit scores, fractional reserve banking, securitized debt — but the underlying dynamic is the same: obligations created through agreements that most people never fully read or understand.

### The Biggest Insight

The biggest insight of the sovereignty framework is this: **systems of power operate through agreements, not force**. You are not compelled to open a bank account, sign a mortgage, or obtain a credit card. You agree to these things — often without understanding the full terms.

The corollary is equally powerful: **withdraw agreement, and systems change**. This does not mean withdrawing from society or refusing all participation. It means participating **consciously** — choosing which agreements to enter, understanding their terms, and structuring your affairs to reflect your values and protect your autonomy.

### Trust Administration as Conscious Stewardship

This is where trust administration transcends mere compliance. Every act of trust administration — maintaining records, making distributions, filing returns, reviewing assets — is an act of **conscious stewardship** rather than unconscious obligation.

When you administer a trust with awareness:

- **Record-keeping** becomes an exercise in clarity and sovereignty, not bureaucratic burden
- **Distributions** become intentional acts of generosity and purpose, not automatic payments
- **Tax compliance** becomes a conscious choice about how you interface with public systems, not blind obedience
- **Asset review** becomes stewardship of the resources entrusted to your care, not mere inventory

The trust is not just a legal structure — it is a **practice of conscious participation** in the systems that govern commerce, property, and exchange. Administered with awareness, it becomes one of the most powerful tools for aligning your financial life with your deepest values.`,
  },
];

async function updateCourse2() {
  console.log("\n📚 Updating Course 2: Trust & Asset Protection...\n");

  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.category, "Trust & Assets"))
    .limit(1);

  if (!course) {
    console.error("❌ Trust & Assets course not found");
    return;
  }

  await db.update(courses).set({
    description: "A comprehensive course on trust law, structure, and asset protection. Every principle is supported by the Restatement (Third) of Trusts, the Uniform Trust Code, Internal Revenue Code provisions, and case law. Learn to create, fund, and administer trusts that protect your assets.",
  }).where(eq(courses.id, course.id));

  for (const lesson of trustLessons) {
    const [existing] = await db
      .select()
      .from(lessons)
      .where(and(eq(lessons.courseId, course.id), eq(lessons.order, lesson.order)))
      .limit(1);

    if (existing) {
      await db.update(lessons).set({
        title: lesson.title,
        content: lesson.content,
        duration: lesson.duration,
      }).where(eq(lessons.id, existing.id));
      console.log(`  ✅ Updated lesson ${lesson.order}: ${lesson.title}`);
    } else {
      console.log(`  ⚠️  Lesson order ${lesson.order} not found — skipping`);
    }
  }
}

export { updateCourse2, trustLessons };

if (import.meta.url === `file://${process.argv[1]}`) {
  updateCourse2()
    .then(() => {
      console.log("\n✅ Course 2 updated successfully");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Error:", err);
      process.exit(1);
    });
}
