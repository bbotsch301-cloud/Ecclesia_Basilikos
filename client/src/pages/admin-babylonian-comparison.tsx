import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Printer,
  Download,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ScrollText,
  Layers,
  Shield,
  Crown,
  Scale,
  Coins,
  Users,
  BookOpen,
  Landmark,
  Banknote,
  Gavel,
  GraduationCap,
  Handshake,
  Swords,
  Baby,
  FileText,
  Heart,
  ArrowDown,
  Building2,
  Briefcase,
  CircleDollarSign,
  ShoppingCart,
  X,
  Check,
  ChevronsUpDown,
  type LucideIcon,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════
// BABYLONIAN COMPARISON SECTIONS
// ═══════════════════════════════════════════════════════════

interface WhitePaperSection {
  id: string;
  number: string;
  title: string;
  icon: typeof Crown;
  content: string;
  subsections?: { title: string; content: string }[];
  keyTakeaway?: string;
  comparisonRows?: { covenant: string; babylonian: string }[];
  scriptureRefs?: string[];
}

const sections: WhitePaperSection[] = [
  {
    id: "introduction",
    number: "I",
    title: "Introduction — Purpose of This Comparison",
    icon: ScrollText,
    content: `This document presents a structured, educational comparison between two fundamentally different systems of social, economic, and legal organization:

    1. The Covenant Model — as implemented in the Ecclesia Basilikos Trust, a nine-layer common law trust governed by biblical principles, ecclesiastical jurisdiction, and voluntary covenant membership.

    2. The Babylonian Model — referring to the modern debt-based, corporate, commercial system that characterizes the dominant global economic and legal order.

The term "Babylonian" is used as a theological and historical reference, not as an insult. In biblical typology, Babylon represents the system of centralized human authority, debt-bondage, commercial control, and the substitution of man's law for God's law. From Nimrod's tower (Genesis 11) to the "mystery Babylon" of Revelation 18, the pattern repeats: centralized control, commerce as the basis of citizenship, and dependence on human institutions rather than divine covenant.

This comparison is educational in nature. Its purpose is to help covenant members understand:

    • Why the trust is structured the way it is
    • What the trust is designed to protect against
    • How the two systems differ in philosophy, structure, and legal foundation
    • Why the covenant model provides superior asset protection, generational transfer, and community governance

Each section compares the two models across a specific domain — hierarchy, property, finance, governance, membership, asset protection, labor, education, generational transfer, dispute resolution, and legal foundations. The goal is clarity, not antagonism — understanding the architecture of both systems so that informed choices can be made.`,
    keyTakeaway: "The Covenant Model flows from God's authority through voluntary covenant; the Babylonian Model flows from human institutions through compulsory jurisdiction. One liberates through relationship; the other controls through regulation.",
    comparisonRows: [
      { covenant: "Authority from God through Christ", babylonian: "Authority from human institutions" },
      { covenant: "Voluntary covenant membership", babylonian: "Compulsory citizenship from birth" },
      { covenant: "Biblical law as foundation", babylonian: "Statutory/commercial code as foundation" },
      { covenant: "Wealth preserved across generations", babylonian: "Wealth extracted at every transition" },
    ],
    scriptureRefs: ["Genesis 11 (Tower of Babel)", "Revelation 18:4 (Come out of her)", "Matthew 6:24 (Two masters)"],
  },
  {
    id: "hierarchical-structure",
    number: "II",
    title: "Hierarchical Structure",
    icon: Layers,
    content: `Every organized system has a hierarchy — a structure of authority, accountability, and flow. The two models differ fundamentally in how authority originates, flows, and is exercised.`,
    subsections: [
      {
        title: "Covenant Model — Nine-Layer Covenant Hierarchy",
        content: `The Ecclesia Basilikos Trust is organized into nine layers, each rooted in scripture and flowing from God's authority through Christ to His people:

    Layer 1: Covenant — The individual's irrevocable covenant with God through Christ (Jeremiah 31:33)
    Layer 2: Body of Christ — The collective assembly, with Christ as Head (1 Corinthians 12:12-13)
    Layer 3: Stewardship — Five organs of the Body: Land, Housing, Treasury, Enterprise, Education
    Layer 4: Ecclesia — The gathered assembly where authority is exercised (Matthew 18:20)
    Layer 5: Regional — Local churches and geographic congregations
    Layer 6: Household — The biblical family unit as a self-governing entity (Joshua 24:15)
    Layer 7: Craft & Vocation — Guilds and vocational callings (Exodus 31:1-6, the Bezalel pattern)
    Layer 8: Ministry — Specialized service functions within the Body
    Layer 9: Individual — The covenant member who benefits from the whole

Authority flows downward from God through Christ through appointed stewards. Accountability flows upward. The Protector Council provides checks and balances. No single human holds absolute authority — Christ is the Head.

Key characteristics:
    • Authority originates in God, not in human consent or majority vote
    • Every layer has a scriptural mandate and fiduciary duty
    • Separation of powers is built into the structure (Trustee, Protector, Beneficiary)
    • The hierarchy serves the members — the greatest shall be servant of all (Matthew 23:11)`,
      },
      {
        title: "Babylonian Model — Corporate Pyramid",
        content: `The modern corporate and governmental system is organized as a pyramid of legal fictions and delegated authority:

    Shareholders / Sovereign (theoretical top — owners or "the people")
    Board of Directors / Legislature (policy-making body)
    Officers / Executive (CEO, President — operational authority)
    Management / Bureaucracy (middle layer of administration)
    Employees / Citizens (labor and compliance layer)
    Consumers / Subjects (the base — those who consume and are consumed)

Authority theoretically flows from the shareholders or "the people," but in practice is concentrated at the top through:
    • Central banking systems that control money supply
    • Regulatory agencies that write rules with force of law
    • Corporate boards answerable primarily to profit and liability
    • Government officials insulated by sovereign immunity

Key characteristics:
    • Authority originates in human institutions — constitutions, charters, statutes
    • The hierarchy is maintained by economic dependence (wages, debt, benefits)
    • Separation of powers is nominal — regulatory capture, revolving doors, executive overreach
    • The pyramid extracts from the base to enrich the top
    • Individuals are classified as "human resources" — assets on a balance sheet

"And he causeth all, both small and great, rich and poor, free and bond, to receive a mark in their right hand, or in their foreheads: And that no man might buy or sell, save he that had the mark" — Revelation 13:16-17

The commercial system conditions participation on compliance: licensing, registration, taxation, and adherence to commercial codes. Those who do not comply are excluded from commerce.`,
      },
    ],
    keyTakeaway: "The Covenant Model derives authority from God downward through Christ to stewards; the Babylonian Model concentrates authority upward into human institutions that control through economic dependence.",
    comparisonRows: [
      { covenant: "Nine layers rooted in scripture", babylonian: "Corporate pyramid of legal fictions" },
      { covenant: "Christ is Head — no human holds absolute authority", babylonian: "Authority concentrated through central banking and regulation" },
      { covenant: "Accountability flows upward to God", babylonian: "Accountability flows upward to shareholders/profit" },
      { covenant: "Separation of powers (Trustee, Protector, Beneficiary)", babylonian: "Nominal separation — regulatory capture and revolving doors" },
      { covenant: "The greatest shall be servant of all", babylonian: "Individuals classified as 'human resources'" },
    ],
    scriptureRefs: ["Jeremiah 31:33 (Covenant)", "1 Corinthians 12:12-13 (Body of Christ)", "Revelation 13:16-17 (Mark of commerce)"],
  },
  {
    id: "property-ownership",
    number: "III",
    title: "Property & Ownership",
    icon: Landmark,
    content: `How property is held, transferred, and protected reveals the deepest assumptions of any legal system. The covenant and Babylonian models approach property from fundamentally different premises.`,
    subsections: [
      {
        title: "Covenant Model — Trust-Held Communal Stewardship",
        content: `In the covenant model, all property belongs to God. Humans are stewards, not absolute owners:

    "The earth is the LORD's, and the fulness thereof; the world, and they that dwell therein" — Psalm 24:1

    "The silver is mine, and the gold is mine, saith the LORD of hosts" — Haggai 2:8

Property within the trust is held in three ways:

    1. Trust Corpus — Real property, financial assets, and intellectual property held by the Trustee for the benefit of all covenant members. Legal title vests in the trust; equitable title vests in the beneficiaries.

    2. Stewardship Allocation — Specific assets assigned to stewardship organs (Land Trust, Housing Trust, etc.) for specific purposes. The steward manages but does not own.

    3. Beneficial Use — Individual members have the right to use and enjoy trust property according to their needs, governed by the Beneficial Unit system.

Key principles:
    • No individual "owns" trust property — they have beneficial interest
    • Property cannot be seized by individual creditors (spendthrift protection)
    • Property transfers within the trust avoid probate, estate tax, and inheritance litigation
    • The concept mirrors allodial title — land held free and clear of any superior landlord
    • Stewardship accountability replaces the profit motive

"And all that believed were together, and had all things common; And sold their possessions and goods, and parted them to all men, as every man had need" — Acts 2:44-45`,
      },
      {
        title: "Babylonian Model — Fee Simple & Corporate Ownership",
        content: `In the modern system, property is held under a feudal framework disguised by modern terminology:

    Fee Simple — The highest form of "ownership" available, yet still subject to:
        • Property taxes (fail to pay and the state seizes your land — you are renting from the state)
        • Eminent domain (the government can take your property for "public use")
        • Zoning and land use regulations (the government dictates what you can do with "your" property)
        • Environmental regulations and building codes
        • HOA covenants and deed restrictions

    Corporate Ownership — Corporations hold property as legal fictions:
        • Shareholders own shares, not the underlying assets
        • Corporate property is subject to lawsuits, judgments, and regulatory seizure
        • Piercing the corporate veil exposes personal assets
        • Beneficial ownership reporting (Corporate Transparency Act) subjects all owners to government surveillance

    Personal Property — Individually held assets are exposed to:
        • Creditor claims and judgments
        • Divorce proceedings
        • Probate proceedings upon death (average 6-18 months, 3-7% of estate value in fees)
        • Estate and inheritance taxes
        • Forfeiture laws (civil asset forfeiture requires no criminal conviction)

Key characteristics:
    • "Ownership" is conditional — failure to pay taxes or comply with regulations results in seizure
    • The feudal lord has been replaced by the state, but the relationship remains the same
    • Property is treated as a taxable commodity, not a stewardship responsibility
    • Death triggers a cascade of government and legal claims against the estate
    • The system incentivizes debt-financed acquisition (mortgage interest deductions, leveraged buyouts)

The word "mortgage" itself comes from the Old French "mort gage" — literally "death pledge."`,
      },
    ],
    keyTakeaway: "In the Covenant Model, all property belongs to God and is held in trust for communal stewardship. In the Babylonian Model, 'ownership' is conditional — the state can seize property for tax non-payment, eminent domain, or regulatory violation.",
    comparisonRows: [
      { covenant: "God owns all — humans are stewards", babylonian: "'Ownership' conditional on taxes and compliance" },
      { covenant: "Trust property protected from creditors (spendthrift)", babylonian: "Assets exposed to lawsuits, divorce, and forfeiture" },
      { covenant: "No probate — trust continues in perpetuity", babylonian: "Probate takes 6-18 months, costs 3-7% of estate" },
      { covenant: "Allodial-style title — free and clear", babylonian: "Fee simple — perpetual rent to the state via property tax" },
    ],
    scriptureRefs: ["Psalm 24:1 (The earth is the LORD's)", "Haggai 2:8 (Silver and gold are mine)", "Acts 2:44-45 (All things common)"],
  },
  {
    id: "financial-architecture",
    number: "IV",
    title: "Financial Architecture",
    icon: Banknote,
    content: `The financial architecture of a system determines how wealth is created, distributed, preserved, and transferred. The two models operate on fundamentally incompatible premises.`,
    subsections: [
      {
        title: "Covenant Model — Tithes, Storehouse & Redistribution",
        content: `The covenant economy operates on principles of stewardship, sufficiency, and generational wealth:

TITHES AND OFFERINGS:
    "Bring ye all the tithes into the storehouse, that there may be meat in mine house" — Malachi 3:10

Members contribute a tithe (tenth) of their increase to the common treasury. This is voluntary, covenantal, and based on increase — not on gross income before expenses. Additional offerings are given freely as the Spirit leads.

THE STOREHOUSE PRINCIPLE:
The Treasury Trust functions as the biblical storehouse — receiving tithes, managing resources, and distributing according to need:
    • Emergency reserves for members in crisis
    • Capital for enterprise development
    • Funding for education and training
    • Support for widows, orphans, and those in need
    • Infrastructure maintenance and development

NO USURY (INTEREST):
    "Thou shalt not lend upon usury to thy brother; usury of money, usury of victuals, usury of any thing that is lent upon usury" — Deuteronomy 23:19

The covenant economy prohibits charging interest to fellow covenant members. Capital is provided through:
    • Interest-free loans from the Treasury Trust
    • Equity partnerships where risk and reward are shared
    • Community investment in enterprise development
    • Benevolent grants for those in genuine need

WEALTH PRESERVATION:
    • Assets held in irrevocable trust are protected from creditors
    • No estate tax — trust property does not pass through probate
    • Generational wealth accumulates rather than dissipates
    • The Beneficial Unit system ensures equitable distribution without creating dependency`,
      },
      {
        title: "Babylonian Model — Fractional-Reserve Banking & Debt-Money",
        content: `The modern financial system is built on debt creation, interest extraction, and centralized monetary control:

FRACTIONAL-RESERVE BANKING:
Banks create money through lending. When a bank issues a $100,000 mortgage, it does not lend existing deposits — it creates new money as a ledger entry. The borrower must repay $100,000 plus interest, but only $100,000 was created. The interest must come from someone else's principal, creating a systemic shortage that requires ever-increasing debt to sustain.

    "The process by which banks create money is so simple that the mind is repelled" — John Kenneth Galbraith

USURY (INTEREST) AS THE ENGINE:
Interest is the fundamental mechanism of wealth transfer in the Babylonian system:
    • A 30-year mortgage at 7% costs approximately 2.4x the original loan amount
    • Credit card interest rates of 20-30% ensure perpetual debt for consumers
    • Student loan interest accrues during education, creating debt before earning begins
    • National debt compounds exponentially — the US national debt exceeds $34 trillion
    • Interest payments flow from borrowers (labor) to lenders (capital), concentrating wealth

FIAT CURRENCY:
    • Money is not backed by gold, silver, or any tangible commodity
    • The Federal Reserve (a private banking cartel) controls money supply
    • Inflation is a hidden tax — purchasing power declines as money is created
    • The dollar has lost approximately 97% of its purchasing power since 1913

TAXATION:
    • Income tax (16th Amendment, 1913 — same year as the Federal Reserve Act)
    • Property tax (perpetual rent paid to the state)
    • Sales tax, capital gains tax, estate tax, gift tax
    • Social Security and Medicare taxes (payroll deductions)
    • The average American works approximately 100+ days per year just to pay taxes

"The rich ruleth over the poor, and the borrower is servant to the lender" — Proverbs 22:7

The entire system is designed to create and maintain debt servitude. Participation requires borrowing, earning, spending, and being taxed at every stage.`,
      },
    ],
    keyTakeaway: "The Covenant economy runs on tithes, interest-free lending, and storehouse redistribution. The Babylonian economy runs on fractional-reserve banking, compounding interest, and fiat currency — extracting wealth through debt.",
    comparisonRows: [
      { covenant: "Tithes (10% of increase) — voluntary", babylonian: "Taxes at every stage — compulsory" },
      { covenant: "No usury — interest-free loans to members", babylonian: "Usury is the engine — 30-year mortgage costs 2.4x principal" },
      { covenant: "Storehouse principle — reserves for community need", babylonian: "Fractional-reserve banking — money created as debt" },
      { covenant: "Wealth preserved in irrevocable trust", babylonian: "Dollar lost ~97% purchasing power since 1913" },
    ],
    scriptureRefs: ["Malachi 3:10 (Bring tithes to the storehouse)", "Deuteronomy 23:19 (No usury)", "Proverbs 22:7 (Borrower is servant to lender)"],
  },
  {
    id: "governance-authority",
    number: "V",
    title: "Governance & Authority",
    icon: Crown,
    content: `Governance determines how decisions are made, authority is exercised, and disputes are resolved. The source and structure of authority differ radically between the two models.`,
    subsections: [
      {
        title: "Covenant Model — Protector Council & Biblical Governance",
        content: `The trust operates under a tripartite governance structure modeled on biblical principles:

THE PROTECTOR COUNCIL:
    • Composed of mature covenant members selected for wisdom, integrity, and spiritual maturity
    • Functions as the guardian of the trust's purpose and principles
    • Has veto power over trustee actions that violate the trust instrument
    • Cannot initiate action — only approve, deny, or direct investigation
    • Accountable to the covenant community and to scripture

TRUSTEE AUTHORITY:
    • The Trustee holds legal title and operational authority
    • Bound by fiduciary duty — the highest duty known to law
    • Subject to Protector Council oversight
    • Must act in the best interest of all beneficiaries, not personal interest
    • Can be removed for breach of fiduciary duty

SEPARATION OF POWERS:
    • Grantor (establishes the trust and its purpose — then steps back)
    • Trustee (manages and administers — legal title)
    • Protector (oversees and safeguards — veto and direction)
    • Beneficiary (receives and enjoys — equitable title)
    No single role combines all powers. This mirrors the biblical pattern:
    • Prophet (speaks truth) — Protector
    • Priest (serves and administers) — Trustee
    • King (governs and decides) — reserved for Christ

MATTHEW 18 GOVERNANCE:
All internal disputes follow the Matthew 18 Protocol:
    1. Private conversation between the parties
    2. Two or three witnesses brought in
    3. Matter brought before the ecclesia
    4. Final resolution by the governing body

This process is the exclusive dispute resolution mechanism, shielding internal matters from civil court jurisdiction.`,
      },
      {
        title: "Babylonian Model — Corporate Boards, State Courts & Regulatory Agencies",
        content: `The modern governance system operates through multiple overlapping jurisdictions:

CORPORATE GOVERNANCE:
    • Board of Directors elected by shareholders (typically institutional investors)
    • Fiduciary duty to shareholders, not stakeholders or community
    • Executive compensation often misaligned with organizational health
    • Short-term profit orientation driven by quarterly earnings pressure
    • Regulatory compliance as the ceiling of ethical behavior

GOVERNMENT AUTHORITY:
    • Legislative branch creates statutes (often thousands of pages, written by lobbyists)
    • Executive branch enforces through regulatory agencies (EPA, IRS, SEC, FDA, etc.)
    • Judicial branch interprets — but judges are political appointees
    • Administrative law: agencies write rules, enforce rules, and adjudicate violations (combining legislative, executive, and judicial functions in a single body)

REGULATORY STATE:
    • Estimated 180,000+ pages in the Code of Federal Regulations
    • State regulations add tens of thousands more
    • Compliance costs exceed $2 trillion annually for US businesses
    • Regulatory capture: industries influence the agencies that regulate them
    • Three felonies a day: the average person unknowingly violates federal law daily

COURT SYSTEM:
    • Civil litigation is adversarial, expensive, and slow
    • Average federal civil case takes 2-3 years
    • Legal costs create a two-tier system: justice for those who can afford it
    • Jury trials have declined to less than 2% of cases — most are settled or decided by judges
    • Qualified immunity shields government actors from accountability

"Woe unto you, lawyers! for ye have taken away the key of knowledge: ye entered not in yourselves, and them that were entering in ye hindered" — Luke 11:52

The system's complexity is a feature, not a bug — it creates dependence on licensed professionals and government-approved institutions for basic life functions.`,
      },
    ],
    keyTakeaway: "The Covenant Model uses a tripartite structure (Trustee, Protector, Beneficiary) mirroring the biblical pattern of Prophet, Priest, and King — with Christ as ultimate authority. The Babylonian Model concentrates power through regulatory agencies that combine legislative, executive, and judicial functions.",
    comparisonRows: [
      { covenant: "Protector Council — mature covenant members", babylonian: "Corporate boards answerable to shareholders" },
      { covenant: "Fiduciary duty — the highest duty in law", babylonian: "Fiduciary duty to profit, not community" },
      { covenant: "Matthew 18 Protocol for disputes", babylonian: "Civil litigation — adversarial, costly, slow" },
      { covenant: "No single role combines all powers", babylonian: "Administrative agencies: legislate, enforce, and judge" },
    ],
    scriptureRefs: ["Matthew 18:15-17 (Dispute resolution)", "Luke 11:52 (Woe unto lawyers)", "Matthew 23:11 (Greatest shall serve)"],
  },
  {
    id: "membership-citizenship",
    number: "VI",
    title: "Membership & Citizenship",
    icon: Users,
    content: `How individuals enter, participate in, and relate to a system reveals whether that system is based on consent or compulsion.`,
    subsections: [
      {
        title: "Covenant Model — Voluntary Covenant Membership (PMA)",
        content: `Membership in the Ecclesia Basilikos Trust is entirely voluntary, based on informed consent and covenant commitment:

ENTRY REQUIREMENTS:
    1. Profession of faith in Jesus Christ as Lord and Savior
    2. Understanding and acceptance of the Declaration of Trust
    3. Execution of the Private Membership Agreement (PMA)
    4. Commitment to abide by the covenant principles and governance structure
    5. Voluntary contribution to the community (tithes and service)

PRIVATE MEMBERSHIP ASSOCIATION:
The trust operates as a Private Membership Association (PMA), which enjoys specific legal protections:
    • First Amendment right of free association
    • NAACP v. Alabama: right to private membership lists
    • Boy Scouts v. Dale: right to determine membership criteria
    • No government licensing or registration required
    • Internal affairs governed by the membership agreement, not state statutes

KEY CHARACTERISTICS:
    • Entry is voluntary — no one is born into obligation
    • Exit is permitted — though the covenant is irrevocable, physical participation is not compelled
    • Rights and benefits flow from the covenant relationship, not from government grant
    • No Social Security number, driver's license, or government ID required for membership
    • Members are known by their covenant names and relationships, not by government-assigned numbers

"Choose you this day whom ye will serve... but as for me and my house, we will serve the LORD" — Joshua 24:15

The covenant model presupposes free will. God does not compel worship; the trust does not compel membership. Every participant has chosen to be there.`,
      },
      {
        title: "Babylonian Model — Statutory Citizenship & Compulsory Jurisdiction",
        content: `In the modern system, "citizenship" is assigned at birth and carries compulsory obligations:

BIRTH REGISTRATION:
    • Birth certificate creates a legal fiction (the "straw man" — the all-caps name)
    • Social Security number assigned shortly after birth
    • The individual is enrolled in the system before they can consent
    • Birth certificate is a financial instrument — registered with the state as a vital statistic

COMPULSORY OBLIGATIONS:
    • Taxation: failure to pay results in liens, levies, and imprisonment
    • Selective Service: males must register at 18 or face penalties
    • Compulsory education: state mandates education through age 16-18
    • Licensing: driving, marriage, business, profession — all require government permission
    • Jury duty: compelled service under threat of contempt
    • Compliance with all federal, state, and local regulations

JURISDICTION BY PRESUMPTION:
    • The system presumes jurisdiction over everyone within its borders
    • "Consent of the governed" is theoretical — there is no practical mechanism to withdraw
    • Renouncing citizenship requires government approval, an exit tax, and a fee
    • The 14th Amendment created "citizens of the United States" subject to federal jurisdiction
    • Commercial activity (banking, employment, commerce) creates nexus for regulation

KEY CHARACTERISTICS:
    • Participation is compulsory from birth
    • Rights are treated as government-granted privileges (subject to regulation)
    • Identity is defined by government-assigned numbers (SSN, TIN, DL#)
    • Non-compliance results in penalties ranging from fines to imprisonment
    • The system does not recognize a right to opt out

"Come out of her, my people, that ye be not partakers of her sins, and that ye receive not of her plagues" — Revelation 18:4

The call to "come out" presupposes that one is currently "in" — the Babylonian system encompasses by default, and exit requires deliberate, informed action.`,
      },
    ],
    keyTakeaway: "Covenant membership is voluntary — entered by informed consent and covenant commitment. Babylonian citizenship is assigned at birth and carries compulsory obligations enforced by penalties.",
    comparisonRows: [
      { covenant: "Voluntary entry by profession of faith", babylonian: "Assigned at birth via birth certificate" },
      { covenant: "Rights flow from covenant relationship", babylonian: "Rights treated as government-granted privileges" },
      { covenant: "Identity in covenant names and relationships", babylonian: "Identity by government-assigned numbers (SSN, TIN)" },
      { covenant: "Private Membership Association protections", babylonian: "Jurisdiction presumed — no practical mechanism to withdraw" },
      { covenant: "Exit permitted — participation not compelled", babylonian: "Renouncing requires approval, exit tax, and fees" },
    ],
    scriptureRefs: ["Joshua 24:15 (Choose this day whom ye will serve)", "Revelation 18:4 (Come out of her, my people)", "NAACP v. Alabama (Right to private association)"],
  },
  {
    id: "asset-protection",
    number: "VII",
    title: "Asset Protection",
    icon: Shield,
    content: `Asset protection is the practical test of any legal structure. How well does the system protect what has been entrusted to its care?`,
    subsections: [
      {
        title: "Covenant Model — Spendthrift Trust & Ecclesiastical Jurisdiction",
        content: `The trust architecture provides multiple layers of asset protection:

LAYER 1 — TRUST STRUCTURE:
    • Irrevocable trust: grantor has no power to alter, amend, or revoke
    • Spendthrift provisions: beneficiaries cannot transfer their interest; creditors cannot reach it
    • Separation of legal and equitable title: the Trustee holds legal title; beneficiaries hold equitable title
    • No single individual "owns" trust assets — they are held for the collective benefit

LAYER 2 — ECCLESIASTICAL JURISDICTION:
    • Watson v. Jones (1871): civil courts have no jurisdiction over ecclesiastical matters
    • Hosanna-Tabor (2012): religious organizations have absolute autonomy over internal affairs
    • The ministerial exception bars employment claims against religious leaders
    • Internal governance decisions are ecclesiastical matters beyond civil court reach

LAYER 3 — CONSTITUTIONAL PROTECTIONS:
    • First Amendment: free exercise, assembly, and religious self-governance
    • RFRA: government cannot substantially burden religious exercise
    • RLUIPA: protects religious land use from discriminatory regulation
    • Contract Clause: no state law may impair the Declaration of Trust

LAYER 4 — OPERATIONAL ISOLATION:
    • Each stewardship organ is a separate trust with independent liability
    • The Enterprise Trust operates businesses without exposing the parent trust
    • Individual member liability does not flow to the trust
    • Trust liability does not flow to individual members

LAYER 5 — PMA PROTECTIONS:
    • Private association — internal affairs are not subject to public regulation
    • No government registration or reporting required
    • Membership agreements supersede statutory default rules
    • Right to exclude government interference in internal operations

The result: multiple overlapping shields that an adversary must penetrate simultaneously — a task that is legally, constitutionally, and practically near-impossible.`,
      },
      {
        title: "Babylonian Model — Corporate Veil, Insurance & Statutory Compliance",
        content: `The modern system offers asset protection, but it is conditional, limited, and subject to government override:

CORPORATE VEIL:
    • LLCs and corporations provide liability protection — until pierced
    • Courts regularly pierce the veil for: commingling funds, undercapitalization, fraud, alter ego
    • Corporate Transparency Act requires beneficial ownership reporting to FinCEN
    • Single-member LLCs provide no charging order protection in many states

INSURANCE:
    • Liability insurance is the primary protection mechanism
    • Insurers control defense strategy and settlement decisions
    • Policy exclusions, limits, and deductibles create gaps
    • Insurance companies are profit-motivated and will deny claims when possible
    • Malpractice, E&O, D&O, umbrella — each covers a narrow slice

STATUTORY COMPLIANCE:
    • Protection is contingent on compliance with all regulations
    • Failure to file annual reports can dissolve an entity
    • Failure to maintain registered agent can result in default judgment
    • Tax non-compliance can result in entity disregard
    • The protection is a privilege granted by the state and can be revoked

ASSET PROTECTION TRUSTS:
    • Domestic Asset Protection Trusts (DAPTs) available in only some states
    • Offshore trusts face increasing regulation and disclosure requirements
    • FATCA and CRS require foreign financial institution reporting
    • Fraudulent transfer laws can claw back transfers made within 2-10 years
    • Self-settled trusts provide no protection in most jurisdictions

KEY VULNERABILITIES:
    • Government has unlimited resources and jurisdiction to pursue claims
    • Civil asset forfeiture requires no criminal conviction
    • IRS can assess taxes, impose liens, and levy accounts without a court order
    • Divorce courts can reach through most asset protection structures
    • Bankruptcy courts can void preferential transfers

The fundamental problem: the Babylonian system's asset protection mechanisms are creatures of the same system that threatens the assets. The fox is guarding the henhouse.`,
      },
    ],
    keyTakeaway: "The Covenant Model provides five overlapping layers of protection (trust structure, ecclesiastical jurisdiction, constitutional protections, operational isolation, PMA). The Babylonian Model's protections are granted by the same system that threatens the assets.",
    comparisonRows: [
      { covenant: "Irrevocable trust — spendthrift provisions", babylonian: "Corporate veil — regularly pierced by courts" },
      { covenant: "Ecclesiastical jurisdiction shields internal affairs", babylonian: "Insurance controlled by profit-motivated companies" },
      { covenant: "Constitutional protections (First Amendment, RFRA)", babylonian: "Protection contingent on regulatory compliance" },
      { covenant: "Separate trust organs isolate liability", babylonian: "Civil asset forfeiture requires no conviction" },
    ],
    scriptureRefs: ["Watson v. Jones, 1871 (Ecclesiastical jurisdiction)", "Hosanna-Tabor, 2012 (Religious autonomy)", "First Amendment (Free exercise)"],
  },
  {
    id: "labor-enterprise",
    number: "VIII",
    title: "Labor & Enterprise",
    icon: Handshake,
    content: `How work is organized, compensated, and valued reflects the deepest priorities of an economic system.`,
    subsections: [
      {
        title: "Covenant Model — Craft Guilds & the Bezalel Pattern",
        content: `The covenant economy organizes work around calling, craft, and community benefit:

THE BEZALEL PATTERN:
    "See, I have called by name Bezaleel... and I have filled him with the spirit of God, in wisdom, and in understanding, and in knowledge, and in all manner of workmanship" — Exodus 31:1-3

Work in the covenant model is:
    • A divine calling, not merely a means of income
    • Organized by craft and skill, not by corporate hierarchy
    • Compensated fairly, with no exploitation of labor
    • Directed toward building the community, not extracting from it

CRAFT GUILDS (LAYER 7):
The Enterprise Trust establishes and supports craft guilds — cooperative economic units organized by trade:
    • Master-apprentice relationships for skill transfer
    • Quality standards maintained by the guild, not by government regulators
    • Pricing that reflects true value, not market manipulation
    • Shared resources, tools, and knowledge within the guild
    • Profits distributed equitably among members

COOPERATIVE ECONOMY:
    • Enterprises are owned by the trust, not by outside investors
    • Workers are covenant members, not "human resources"
    • There is no distinction between "labor" and "management" — all are stewards
    • Enterprise profits flow to the Treasury Trust for community benefit
    • No member is exploited; no member is idle

"For even when we were with you, this we commanded you, that if any would not work, neither should he eat" — 2 Thessalonians 3:10

Work is both a privilege and a responsibility. The covenant economy provides meaningful work for every able member and dignified support for those who cannot work.`,
      },
      {
        title: "Babylonian Model — Employer-Employee & Labor Regulation",
        content: `The modern labor system is built on the employer-employee relationship — a legal construct that replaced master-servant:

THE EMPLOYMENT RELATIONSHIP:
    • Employees sell their time and labor for wages
    • Employers own the output of that labor
    • The relationship is inherently unequal — the employer holds the power
    • "At-will" employment: either party can terminate for any reason (or no reason)
    • Workers are classified as W-2 (employee) or 1099 (independent contractor)

LABOR REGULATION:
    • Federal: FLSA (minimum wage, overtime), OSHA, EEOC, NLRA, ERISA, ADA, FMLA
    • State: workers' compensation, unemployment insurance, state labor boards
    • Local: minimum wage ordinances, paid sick leave, scheduling regulations
    • Compliance creates enormous overhead — particularly for small businesses
    • Regulations are written by large corporations who can afford compliance, creating barriers to entry

THE WAGE SYSTEM:
    • Workers are paid a fraction of the value they create
    • The surplus is extracted as profit for shareholders
    • Wages have stagnated relative to productivity since the 1970s
    • Benefits (health insurance, retirement) tie workers to employers
    • The "gig economy" strips even basic protections while maintaining extraction

TAXATION OF LABOR:
    • Income tax withheld before the worker sees their earnings
    • Payroll taxes (FICA) take an additional 15.3% (split between employer and employee)
    • Self-employment tax penalizes independent workers
    • The tax code incentivizes corporate structures and penalizes individual labor
    • Workers are the most heavily taxed participants in the economy

"Behold, the hire of the labourers who have reaped down your fields, which is of you kept back by fraud, crieth: and the cries of them which have reaped are entered into the ears of the Lord of sabaoth" — James 5:4

The Babylonian system treats human labor as a commodity to be purchased at the lowest possible price and taxed at the highest possible rate.`,
      },
    ],
    keyTakeaway: "The Covenant Model organizes work around divine calling, craft guilds, and cooperative enterprise owned by the trust. The Babylonian Model treats labor as a commodity — purchased cheaply, taxed heavily, and controlled through economic dependence.",
    comparisonRows: [
      { covenant: "Work as divine calling (Bezalel pattern)", babylonian: "Work as commodity — 'human resources'" },
      { covenant: "Craft guilds with master-apprentice training", babylonian: "Employer-employee with at-will termination" },
      { covenant: "Enterprises owned by the trust for community benefit", babylonian: "Surplus extracted as profit for shareholders" },
      { covenant: "Fair compensation — no exploitation", babylonian: "Wages stagnant vs. productivity since 1970s" },
    ],
    scriptureRefs: ["Exodus 31:1-3 (Bezalel — filled with the Spirit)", "2 Thessalonians 3:10 (If any would not work)", "James 5:4 (Wages kept back by fraud)"],
  },
  {
    id: "education-knowledge",
    number: "IX",
    title: "Education & Knowledge",
    icon: GraduationCap,
    content: `How a society educates its members reveals what it values and who it serves. Education is either a tool of liberation or a mechanism of control.`,
    subsections: [
      {
        title: "Covenant Model — Discipleship Chain & Education Trust",
        content: `The covenant model follows the biblical pattern of knowledge transfer through relationship:

THE DISCIPLESHIP CHAIN:
    "And the things that thou hast heard of me among many witnesses, the same commit thou to faithful men, who shall be able to teach others also" — 2 Timothy 2:2

This verse describes a four-generation knowledge transfer:
    1. Paul → 2. Timothy → 3. Faithful men → 4. Others also

Education in the covenant model is:
    • Relational, not institutional — master teaches apprentice
    • Practical, not merely theoretical — knowledge is applied
    • Generational — each generation teaches the next
    • Free of debt — education is a community investment, not a profit center
    • Rooted in scripture as the foundation of all knowledge

THE EDUCATION TRUST (LAYER 3):
The Education Trust is one of the five stewardship organs, responsible for:
    • Curriculum development based on biblical principles
    • Training programs for every craft and vocation
    • Theological education for covenant members
    • Children's education from birth through maturity
    • Continuing education for adults

KEY PRINCIPLES:
    • "The fear of the LORD is the beginning of knowledge" — Proverbs 1:7
    • Education is a parental responsibility delegated to the community, not the state
    • No credentialism — competence is demonstrated, not certified
    • No student debt — the community invests in its members
    • No government curriculum standards — the trust sets its own educational goals
    • Education prepares members for covenant life, not for the corporate workforce`,
      },
      {
        title: "Babylonian Model — State Accreditation, Student Debt & Credentialism",
        content: `The modern education system is a government-regulated, debt-financed credential factory:

COMPULSORY EDUCATION:
    • State mandates education from ages 5-6 through 16-18
    • Public schools are funded by property taxes and controlled by government boards
    • Curriculum is set by state standards and federal mandates
    • Parents who homeschool face varying degrees of regulation and reporting
    • The system produces conformity, not independent thought

HIGHER EDUCATION:
    • University system controlled by accreditation bodies (government-approved gatekeepers)
    • Tuition has increased over 1,200% since 1980 (far exceeding inflation)
    • Total US student loan debt exceeds $1.7 trillion
    • Average graduate carries approximately $30,000+ in student debt
    • Degrees are required for jobs that don't require the knowledge the degree represents

CREDENTIALISM:
    • Professional licensing restricts entry to occupations
    • Continuing education requirements create ongoing costs
    • Credentials become barriers to entry rather than evidence of competence
    • The system rewards time spent in institutions, not skill demonstrated in practice
    • "Education" becomes a product to be purchased, not knowledge to be acquired

THE KNOWLEDGE MONOPOLY:
    • Peer review controls what is considered "legitimate" knowledge
    • Academic publishing is a multi-billion dollar industry built on free labor (researchers)
    • Government funding directs research toward politically favored outcomes
    • Dissent from consensus is punished with loss of funding, position, and reputation
    • The system produces experts who know more and more about less and less

"Ever learning, and never able to come to the knowledge of the truth" — 2 Timothy 3:7

The Babylonian education system is designed to produce compliant workers and consumers, not wise stewards and independent thinkers. Knowledge is commodified, and the price of admission creates a new form of debt bondage.`,
      },
    ],
    keyTakeaway: "The Covenant Model transfers knowledge through relational discipleship chains and a debt-free Education Trust. The Babylonian Model commodifies education through accreditation monopolies and $1.7 trillion in student debt.",
    comparisonRows: [
      { covenant: "Discipleship chain — relational knowledge transfer", babylonian: "Institutional — credentialism and accreditation" },
      { covenant: "Education is debt-free community investment", babylonian: "Average graduate carries $30,000+ in student debt" },
      { covenant: "Competence demonstrated, not certified", babylonian: "Credentials as barriers to entry" },
      { covenant: "Scripture as the foundation of knowledge", babylonian: "Government curriculum standards and mandates" },
    ],
    scriptureRefs: ["2 Timothy 2:2 (Four-generation transfer)", "Proverbs 1:7 (Fear of the LORD — beginning of knowledge)", "2 Timothy 3:7 (Ever learning, never able)"],
  },
  {
    id: "generational-transfer",
    number: "X",
    title: "Generational Transfer",
    icon: Baby,
    content: `How wealth, knowledge, and identity pass from one generation to the next determines whether a community grows stronger or weaker over time.`,
    subsections: [
      {
        title: "Covenant Model — Perpetual Trust & Children's Covenant Pathway",
        content: `The covenant model is designed for perpetual, uninterrupted generational transfer:

PERPETUAL TRUST:
    • The trust has no expiration date — it continues in perpetuity
    • Trust property does not pass through probate upon the death of any individual
    • No estate tax — trust assets are not part of any individual's taxable estate
    • Each generation inherits the accumulated wealth and wisdom of all previous generations
    • The Rule Against Perpetuities does not apply to common law ecclesiastical trusts

CHILDREN'S COVENANT PATHWAY:
Children born to covenant members are:
    1. Dedicated to God (presented before the ecclesia, similar to Samuel — 1 Samuel 1:28)
    2. Raised within the covenant community with access to all trust benefits
    3. Educated through the Education Trust
    4. Mentored through craft guilds and discipleship relationships
    5. At maturity, invited to make their own covenant commitment
    6. Upon profession, they become full covenant members with beneficial interest

"Train up a child in the way he should go: and when he is old, he will not depart from it" — Proverbs 22:6

KEY PRINCIPLES:
    • Every generation starts from a position of strength, not debt
    • Knowledge transfer is intentional and relational
    • Identity is rooted in covenant, not in government classification
    • Wealth accumulates across generations rather than being taxed and dissipated
    • The "thousand generations" principle: "Know therefore that the LORD thy God, he is God, the faithful God, which keepeth covenant and mercy with them that love him and keep his commandments to a thousand generations" — Deuteronomy 7:9`,
      },
      {
        title: "Babylonian Model — Probate, Estate Tax & Inheritance Litigation",
        content: `The modern system is designed to extract maximum value at each generational transition:

PROBATE:
    • Upon death, individually held assets enter the probate process
    • Probate is public — anyone can see what the deceased owned
    • Average probate takes 6-18 months; complex estates can take years
    • Attorney fees typically 3-7% of the estate value
    • Executor fees, court costs, and administrative expenses add more
    • During probate, assets are frozen — heirs cannot access them

ESTATE AND GIFT TAXES:
    • Federal estate tax applies to estates exceeding the exemption amount
    • State estate and inheritance taxes add additional layers
    • Gift tax limits lifetime transfers (with annual exclusions)
    • Generation-skipping transfer tax penalizes attempts to skip generational taxation
    • The tax code is designed to prevent dynastic wealth accumulation

INHERITANCE LITIGATION:
    • Will contests are common — family members dispute the deceased's wishes
    • Intestate succession (dying without a will) follows state statutory rules
    • Blended families create complex competing claims
    • Litigation can consume a significant portion of the estate
    • Family relationships are often destroyed in the process

THE GENERATIONAL RESET:
    • Each generation starts with less than the previous one (after taxes, fees, and litigation)
    • Student debt burdens the next generation before they begin earning
    • Housing costs require multi-decade mortgages
    • Retirement systems (Social Security, 401k) are designed for individual consumption, not generational transfer
    • The average inheritance is spent within 2-3 years

"A good man leaveth an inheritance to his children's children: and the wealth of the sinner is laid up for the just" — Proverbs 13:22

The Babylonian system ensures that wealth is recycled through the system at each generational transition — extracted by lawyers, taxed by the government, and dissipated by a consumer culture that teaches spending, not stewardship.`,
      },
    ],
    keyTakeaway: "The Covenant Model builds perpetual, tax-free generational wealth through irrevocable trust — each generation starts from strength. The Babylonian Model resets wealth at every death through probate, estate taxes, and inheritance litigation.",
    comparisonRows: [
      { covenant: "Perpetual trust — no expiration date", babylonian: "Probate — public, costly, 6-18 months" },
      { covenant: "No estate tax — assets not in any individual's estate", babylonian: "Estate tax, gift tax, generation-skipping tax" },
      { covenant: "Children's Covenant Pathway — mentored into membership", babylonian: "Student debt burdens the next generation before earning" },
      { covenant: "Wealth accumulates across generations", babylonian: "Average inheritance spent within 2-3 years" },
    ],
    scriptureRefs: ["Proverbs 13:22 (Inheritance to children's children)", "Proverbs 22:6 (Train up a child)", "Deuteronomy 7:9 (A thousand generations)"],
  },
  {
    id: "dispute-resolution",
    number: "XI",
    title: "Dispute Resolution",
    icon: Gavel,
    content: `How disputes are resolved reveals whether a system prioritizes reconciliation or adversarial victory.`,
    subsections: [
      {
        title: "Covenant Model — The Matthew 18 Protocol",
        content: `The trust's exclusive dispute resolution mechanism follows the process Jesus prescribed:

    "Moreover if thy brother shall trespass against thee, go and tell him his fault between thee and him alone: if he shall hear thee, thou hast gained thy brother. But if he will not hear thee, then take with thee one or two more, that in the mouth of two or three witnesses every word may be established. And if he shall neglect to hear them, tell it unto the church: but if he neglect to hear the church, let him be unto thee as an heathen man and a publican." — Matthew 18:15-17

THE FOUR STEPS:
    Step 1: PRIVATE CONVERSATION — The aggrieved party goes directly to the other party, privately. Most disputes are resolved here through honest dialogue and repentance.

    Step 2: WITNESSES — If private conversation fails, two or three witnesses are brought in. These are mature covenant members who can hear both sides and counsel wisely.

    Step 3: ECCLESIA — If the matter remains unresolved, it is brought before the gathered assembly. The community hears the matter and renders a collective judgment.

    Step 4: SEPARATION — If the offending party refuses to hear the ecclesia, they are treated as outside the covenant. This is not punishment but recognition that the person has chosen to leave the covenant relationship.

KEY CHARACTERISTICS:
    • The goal is reconciliation, not victory
    • The process is private until Step 3 — protecting the dignity of both parties
    • No attorneys, filing fees, or court costs
    • Resolution is typically swift — days or weeks, not months or years
    • The process is an ecclesiastical matter protected from civil court interference
    • By agreeing to the PMA, members waive the right to civil litigation for internal disputes

"Dare any of you, having a matter against another, go to law before the unjust, and not before the saints?" — 1 Corinthians 6:1`,
      },
      {
        title: "Babylonian Model — Civil Litigation & Regulatory Enforcement",
        content: `The modern dispute resolution system is adversarial, expensive, and often unjust:

CIVIL LITIGATION:
    • Parties hire attorneys who advocate zealously for their client's position
    • Discovery process: interrogatories, depositions, document production — costly and invasive
    • Motion practice: motions to dismiss, for summary judgment, in limine — each generating legal fees
    • Trial: if reached (less than 2% of cases), before a judge or jury of strangers
    • Appeal: the losing party can appeal, extending the process by years
    • Average cost of civil litigation: $50,000-$100,000+ for simple cases; millions for complex ones

REGULATORY ENFORCEMENT:
    • Government agencies investigate, prosecute, and adjudicate — often simultaneously
    • Administrative law judges work for the agency bringing the charges
    • The burden of proof is lower than in criminal court
    • Regulated entities often settle rather than fight, regardless of merit
    • Enforcement actions can destroy businesses and reputations before trial

ARBITRATION:
    • Increasingly mandatory in consumer and employment contracts
    • Arbitrators are often former industry insiders
    • Limited discovery and no appeal
    • Confidentiality provisions prevent public accountability
    • Arbitration clauses strip individuals of the right to a jury trial

KEY CHARACTERISTICS:
    • The system is adversarial — one party wins, one loses
    • Cost creates inequality — corporations can outspend individuals
    • Delay is a weapon — those with resources can outlast those without
    • The process is emotionally and financially devastating
    • Resolution often comes years after the dispute arose
    • The system enriches attorneys, not the parties

The average American cannot afford to vindicate their rights in court. The Babylonian dispute resolution system is, in practice, a system of justice for those who can afford it and endurance for those who cannot.`,
      },
    ],
    keyTakeaway: "The Covenant Model resolves disputes through the Matthew 18 Protocol — private, swift, restorative, and free. The Babylonian Model uses adversarial litigation — public, slow, destructive, and costing $50,000-$100,000+ for simple cases.",
    comparisonRows: [
      { covenant: "Goal is reconciliation", babylonian: "Goal is adversarial victory" },
      { covenant: "Four steps: private → witnesses → ecclesia → separation", babylonian: "Discovery, motions, trial, appeal — years of process" },
      { covenant: "No attorneys, filing fees, or court costs", babylonian: "$50,000-$100,000+ for simple civil cases" },
      { covenant: "Resolution in days or weeks", babylonian: "Average federal case takes 2-3 years" },
      { covenant: "Protected as ecclesiastical matter", babylonian: "Cost creates two-tier justice system" },
    ],
    scriptureRefs: ["Matthew 18:15-17 (The four steps)", "1 Corinthians 6:1 (Dare any go to law before the unjust)", "Matthew 5:25 (Agree with thine adversary quickly)"],
  },
  {
    id: "legal-foundations",
    number: "XII",
    title: "Legal Foundations",
    icon: Scale,
    content: `The legal foundation of a system determines what is legitimate, what is enforceable, and what rights exist. The two models rest on fundamentally different legal bases.`,
    subsections: [
      {
        title: "Covenant Model — Common Law Trust, First Amendment & Ecclesiastical Jurisdiction",
        content: `The covenant model operates under three interlocking legal frameworks:

1. COMMON LAW TRUST:
The trust is a creature of common law — not statutory law. Common law trusts:
    • Predate all statutory codes (rooted in English equity courts from the 13th century)
    • Require only the three certainties: intention, subject matter, objects
    • Are governed by the terms of the trust instrument, not by state trust codes
    • Provide the strongest asset protection available in law
    • Separation of legal and equitable title is the fundamental mechanism

2. FIRST AMENDMENT:
Four distinct protections:
    • Free Exercise — right to practice religion without government interference
    • Establishment Clause — government cannot define or regulate religious organizations
    • Freedom of Assembly — right to gather as a private association
    • Freedom of Speech — right to teach, preach, and publish

3. ECCLESIASTICAL JURISDICTION:
    • Watson v. Jones (1871): courts have no jurisdiction over religious governance
    • Kedroff v. St. Nicholas (1952): government may not interfere with internal church governance
    • Hosanna-Tabor (2012): absolute autonomy over selection of ministers
    • Our Lady of Guadalupe (2020): ministerial exception covers anyone performing religious functions

ADDITIONAL CONSTITUTIONAL PROTECTIONS:
    • Contract Clause (Art. I, §10): no state may impair the trust instrument
    • Ninth Amendment: rights not enumerated are retained by the people
    • Tenth Amendment: powers not delegated are reserved to the people
    • RFRA: government cannot substantially burden religious exercise

STATUTORY RECOGNITION:
    • 26 U.S.C. §508(c)(1)(A): churches are automatically tax-exempt
    • RLUIPA: protects religious land use
    • Public Law 97-280: Congress acknowledged the Bible as "the Word of God"

The covenant model does not operate outside the law — it operates under the highest law: divine law, natural law, and the common law of trusts, reinforced by constitutional protections that the government itself is bound to respect.`,
      },
      {
        title: "Babylonian Model — UCC, Commercial Code & Statutory Regulatory Framework",

        content: `The modern legal system operates under a layered framework of statutory, regulatory, and commercial law:

UNIFORM COMMERCIAL CODE (UCC):
    • Adopted in all 50 states — governs commercial transactions
    • Article 1: General Provisions (definitions, choice of law)
    • Article 2: Sales of goods
    • Article 3: Negotiable instruments (checks, notes, drafts)
    • Article 9: Secured transactions (liens, security interests)
    • The UCC treats all transactions as commercial — including many that individuals don't recognize as commercial

STATUTORY LAW:
    • Federal statutes: Title 26 (tax), Title 42 (civil rights), Title 18 (criminal), etc.
    • State statutes: trust codes, business entity acts, family law, property law
    • Local ordinances: zoning, building codes, licensing
    • The volume of law is so vast that no person can know all laws that apply to them
    • Ignorance of the law is not a defense — even when the law is unknowable

REGULATORY LAW:
    • Federal agencies: IRS, SEC, EPA, FDA, FTC, OSHA, CFPB, FinCEN, and hundreds more
    • Each agency writes rules (quasi-legislative), enforces them (quasi-executive), and adjudicates violations (quasi-judicial)
    • Administrative Procedure Act governs rulemaking — but agencies routinely circumvent it
    • Chevron deference (now limited): courts deferred to agency interpretations of ambiguous statutes

THE LEGAL FICTION:
    • The "person" in statutory law is a legal fiction — a creation of the state
    • Corporations are "persons" under the 14th Amendment (Santa Clara County v. Southern Pacific Railroad, 1886)
    • The individual is treated as a corporate entity for tax and regulatory purposes
    • Birth certificates, Social Security numbers, and taxpayer identification numbers create the legal identity
    • The living man or woman is distinct from the legal "person" — but the system does not acknowledge the distinction

KEY CHARACTERISTICS:
    • Law is created by human institutions and can be changed by them
    • Rights are statutory grants, subject to amendment and repeal
    • Jurisdiction is presumed — the burden is on the individual to prove otherwise
    • The system is self-referential: it validates itself by its own authority
    • Compliance is mandatory; non-compliance is punishable
    • The complexity of the system creates dependence on licensed professionals

"Where there is no vision, the people perish: but he that keepeth the law, happy is he" — Proverbs 29:18

The Babylonian legal system is comprehensive, all-encompassing, and inescapable by design. It treats every human activity as subject to regulation and every person as subject to its jurisdiction. The covenant model offers a lawful alternative grounded in higher authority.`,
      },
    ],
    keyTakeaway: "The Covenant Model rests on common law trust, First Amendment protections, and ecclesiastical jurisdiction — legal frameworks that predate and supersede statutory codes. The Babylonian Model operates under UCC commercial code and an ever-expanding regulatory state.",
    comparisonRows: [
      { covenant: "Common law trust — predates all statutory codes", babylonian: "UCC commercial code — treats all transactions as commercial" },
      { covenant: "First Amendment: free exercise, assembly, speech", babylonian: "180,000+ pages of federal regulations" },
      { covenant: "Ecclesiastical jurisdiction — courts cannot interfere", babylonian: "Agencies write, enforce, and adjudicate their own rules" },
      { covenant: "Churches automatically tax-exempt (§508(c)(1)(A))", babylonian: "Compliance mandatory — ignorance is no defense" },
    ],
    scriptureRefs: ["Proverbs 29:18 (Where there is no vision)", "Watson v. Jones, 1871 (Ecclesiastical jurisdiction)", "Public Law 97-280 (Bible as Word of God)"],
  },
];

// ═══════════════════════════════════════════════════════════
// VISUAL HIERARCHY DIAGRAMS
// ═══════════════════════════════════════════════════════════

interface DiagramNode {
  label: string;
  subtitle: string;
  icon: LucideIcon;
  bg: string;
  border: string;
  text: string;
  width: string;
}

const covenantLayers: DiagramNode[] = [
  { label: "God / Christ", subtitle: "Head of the Body", icon: Crown, bg: "bg-red-900", border: "border-red-800", text: "text-white", width: "max-w-[200px]" },
  { label: "New Covenant Legacy Trust", subtitle: "Individual Covenant Gateway", icon: Heart, bg: "bg-red-900", border: "border-red-700", text: "text-white", width: "max-w-[240px]" },
  { label: "Ecclesia Basilikos", subtitle: "Body of Christ — Collective Assembly", icon: Crown, bg: "bg-slate-800", border: "border-slate-500", text: "text-white", width: "max-w-[280px]" },
  { label: "Stewardship Organs", subtitle: "Land · Housing · Treasury · Enterprise · Education", icon: Shield, bg: "bg-teal-700", border: "border-teal-400", text: "text-white", width: "max-w-[320px]" },
  { label: "Ecclesia / Assembly", subtitle: "The Gathered Assembly (PMA)", icon: Users, bg: "bg-purple-700", border: "border-purple-400", text: "text-white", width: "max-w-[340px]" },
  { label: "Regions & Households", subtitle: "City-Churches · House-Churches", icon: Users, bg: "bg-white", border: "border-purple-400 border-dashed", text: "text-purple-800", width: "max-w-[360px]" },
  { label: "Crafts & Ministries", subtitle: "Bezalel Pattern · Diakonia", icon: Handshake, bg: "bg-white", border: "border-amber-500 border-dashed", text: "text-amber-800", width: "max-w-[380px]" },
  { label: "Members of the Body", subtitle: "Joint Heirs with Christ", icon: Users, bg: "bg-white", border: "border-gray-400 border-dashed", text: "text-gray-700", width: "max-w-[400px]" },
];

const babylonianLayers: DiagramNode[] = [
  { label: "Central Banks", subtitle: "Federal Reserve · BIS · IMF", icon: Landmark, bg: "bg-gray-900", border: "border-gray-700", text: "text-white", width: "max-w-[200px]" },
  { label: "Government / Sovereign", subtitle: "Legislative · Executive · Judicial", icon: Gavel, bg: "bg-gray-800", border: "border-gray-600", text: "text-white", width: "max-w-[240px]" },
  { label: "Regulatory Agencies", subtitle: "IRS · SEC · EPA · FDA · FinCEN", icon: FileText, bg: "bg-gray-700", border: "border-gray-500", text: "text-white", width: "max-w-[280px]" },
  { label: "Corporations & Banks", subtitle: "Shareholders · Board · Officers", icon: Building2, bg: "bg-gray-600", border: "border-gray-400", text: "text-white", width: "max-w-[320px]" },
  { label: "Management / Bureaucracy", subtitle: "Middle Administration Layer", icon: Briefcase, bg: "bg-gray-500", border: "border-gray-300", text: "text-white", width: "max-w-[340px]" },
  { label: "Employees / Citizens", subtitle: "W-2 · 1099 · Taxpayers · Licensees", icon: Users, bg: "bg-white", border: "border-gray-400 border-dashed", text: "text-gray-700", width: "max-w-[360px]" },
  { label: "Consumers / Debtors", subtitle: "Mortgages · Student Loans · Credit Cards", icon: CircleDollarSign, bg: "bg-white", border: "border-gray-400 border-dashed", text: "text-gray-500", width: "max-w-[380px]" },
  { label: "Dependents / Subjects", subtitle: "Benefits Recipients · Wards of the State", icon: ShoppingCart, bg: "bg-white", border: "border-gray-300 border-dashed", text: "text-gray-400", width: "max-w-[400px]" },
];

function HierarchyDiagram({ title, subtitle, layers, accentColor }: {
  title: string;
  subtitle: string;
  layers: DiagramNode[];
  accentColor: string;
}) {
  return (
    <div className="flex-1 min-w-[300px]">
      <div className="text-center mb-6">
        <h3 className={`font-cinzel text-sm font-semibold tracking-[0.1em] uppercase ${accentColor}`}>
          {title}
        </h3>
        <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>
      </div>
      <div className="flex flex-col items-center gap-1">
        {layers.map((node, idx) => (
          <div key={idx} className="flex flex-col items-center w-full">
            {idx > 0 && (
              <ArrowDown className="w-4 h-4 text-slate-300 my-0.5 shrink-0" />
            )}
            <div className={`
              w-full ${node.width} mx-auto
              rounded-xl border-2 ${node.border} ${node.bg} ${node.text}
              px-4 py-2.5 text-center shadow-sm transition-all hover:scale-[1.02] hover:shadow-md
            `}>
              <div className="flex items-center justify-center gap-2">
                <node.icon className="w-4 h-4 shrink-0 opacity-80" />
                <p className="font-cinzel font-bold text-sm leading-tight">{node.label}</p>
              </div>
              <p className="text-[10px] opacity-70 mt-0.5 leading-tight">{node.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonDiagram() {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
      <div className="text-center mb-6">
        <h3 className="font-cinzel text-lg font-semibold tracking-wide text-slate-700">
          Structural Comparison
        </h3>
        <p className="text-xs text-slate-400 mt-1">Authority flows from top to bottom in both systems — the source and nature differ</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <HierarchyDiagram
          title="Covenant Model"
          subtitle="Authority from God through Christ"
          layers={covenantLayers}
          accentColor="text-teal-700"
        />
        {/* Divider */}
        <div className="hidden lg:flex flex-col items-center justify-center">
          <div className="w-px h-full bg-slate-300 min-h-[200px]" />
        </div>
        <div className="lg:hidden mx-auto w-32 border-t border-slate-300" />
        <HierarchyDiagram
          title="Babylonian Model"
          subtitle="Authority from human institutions"
          layers={babylonianLayers}
          accentColor="text-gray-600"
        />
      </div>
      <div className="mt-6 text-center">
        <p className="text-[11px] text-slate-400 italic">
          "No man can serve two masters" — Matthew 6:24
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TABLE OF CONTENTS
// ═══════════════════════════════════════════════════════════

function TableOfContents({ onNavigate, activeSection }: { onNavigate: (id: string) => void; activeSection?: string }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
      <h3 className="font-cinzel text-sm font-semibold tracking-wide text-slate-600 uppercase mb-4">
        Table of Contents
      </h3>
      <div className="space-y-1.5">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className={`flex items-center gap-3 w-full text-left px-3 py-1.5 rounded-lg transition-colors group ${
                isActive ? "bg-royal-navy/10" : "hover:bg-slate-100"
              }`}
            >
              <span className={`text-xs font-mono w-6 ${isActive ? "text-royal-navy font-semibold" : "text-slate-400"}`}>{section.number}</span>
              <section.icon className={`w-4 h-4 transition-colors ${isActive ? "text-royal-navy" : "text-slate-400 group-hover:text-royal-navy"}`} />
              <span className={`text-sm transition-colors ${isActive ? "text-royal-navy font-semibold" : "text-slate-700 group-hover:text-royal-navy"}`}>
                {section.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION RENDERER
// ═══════════════════════════════════════════════════════════

function SectionBlock({ section, globalExpand, globalCollapse }: {
  section: WhitePaperSection;
  globalExpand: number;
  globalCollapse: number;
}) {
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (globalExpand > 0 && section.subsections) {
      const allOpen: Record<number, boolean> = {};
      section.subsections.forEach((_, idx) => { allOpen[idx] = false; });
      setCollapsed(allOpen);
    }
  }, [globalExpand, section.subsections]);

  useEffect(() => {
    if (globalCollapse > 0 && section.subsections) {
      const allClosed: Record<number, boolean> = {};
      section.subsections.forEach((_, idx) => { allClosed[idx] = true; });
      setCollapsed(allClosed);
    }
  }, [globalCollapse, section.subsections]);

  const toggleSubsection = (idx: number) => {
    setCollapsed((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div id={section.id} className="scroll-mt-24 mb-10">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-royal-navy/10 flex items-center justify-center">
          <section.icon className="w-5 h-5 text-royal-navy" />
        </div>
        <div>
          <span className="text-xs font-mono text-slate-400 block">Section {section.number}</span>
          <h2 className="font-cinzel text-xl font-semibold text-slate-800">{section.title}</h2>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-0 sm:pl-[52px]">
        <pre className="whitespace-pre-wrap font-serif text-[15px] leading-relaxed text-slate-700 mb-4">
          {section.content}
        </pre>

        {/* Key Takeaway Box */}
        {section.keyTakeaway && (
          <div className="bg-parchment p-4 rounded-lg mb-4 border-2 border-royal-gold/30">
            <p className="text-sm font-semibold text-royal-navy mb-2 font-cinzel">Key Distinction:</p>
            <p className="text-sm text-gray-700 leading-relaxed italic">{section.keyTakeaway}</p>
          </div>
        )}

        {/* Subsections */}
        {section.subsections && (
          <div className="space-y-2 mt-4">
            {section.subsections.map((sub, idx) => {
              const isCollapsed = collapsed[idx] === true;
              return (
                <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSubsection(idx)}
                    className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className="font-cinzel text-sm font-semibold text-slate-700">
                      {sub.title}
                    </span>
                  </button>
                  {!isCollapsed && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-100">
                      <pre className="whitespace-pre-wrap font-serif text-[15px] leading-relaxed text-slate-600">
                        {sub.content}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Quick-Reference Comparison Table */}
        {section.comparisonRows && section.comparisonRows.length > 0 && (
          <div className="mt-6 mb-4">
            <p className="text-sm font-semibold text-slate-600 mb-3 font-cinzel">At a Glance</p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                <p className="font-cinzel font-semibold text-green-900 mb-3 flex items-center text-sm">
                  <Check className="w-4 h-4 mr-2" /> Covenant Model
                </p>
                <ul className="space-y-2">
                  {section.comparisonRows.map((row, idx) => (
                    <li key={idx} className="text-gray-700 text-sm leading-relaxed flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" />
                      <span>{row.covenant}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                <p className="font-cinzel font-semibold text-red-900 mb-3 flex items-center text-sm">
                  <X className="w-4 h-4 mr-2" /> Babylonian Model
                </p>
                <ul className="space-y-2">
                  {section.comparisonRows.map((row, idx) => (
                    <li key={idx} className="text-gray-700 text-sm leading-relaxed flex items-start gap-2">
                      <X className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                      <span>{row.babylonian}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Scripture Reference Badges */}
        {section.scriptureRefs && section.scriptureRefs.length > 0 && (
          <div className="mt-4 mb-2 flex flex-wrap gap-2">
            {section.scriptureRefs.map((ref, idx) => (
              <Badge key={idx} className="bg-royal-gold text-royal-navy font-cinzel text-xs">
                {ref}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Section divider */}
      <div className="mt-8 mx-auto w-24 border-t border-slate-200" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════

export default function AdminBabylonianComparison() {
  usePageTitle("Admin - Babylonian System Comparison");
  const [activeSection, setActiveSection] = useState<string | undefined>();
  const [globalExpand, setGlobalExpand] = useState(0);
  const [globalCollapse, setGlobalCollapse] = useState(0);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  // IntersectionObserver for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0 }
    );

    // Observe all section elements
    const timer = setTimeout(() => {
      sections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el) {
          sectionRefs.current.set(s.id, el);
          observer.observe(el);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const getComparisonHtml = () => {
    const allContent = sections
      .map((s) => {
        let html = `<div class="section-title">Section ${s.number} — ${s.title}</div>`;
        html += `<div class="section-content">${s.content}</div>`;
        if (s.keyTakeaway) {
          html += `<div class="key-takeaway"><strong>Key Distinction:</strong> <em>${s.keyTakeaway}</em></div>`;
        }
        if (s.subsections) {
          s.subsections.forEach((sub) => {
            html += `<div class="subsection-title">${sub.title}</div>`;
            html += `<div class="section-content">${sub.content}</div>`;
          });
        }
        if (s.comparisonRows && s.comparisonRows.length > 0) {
          html += `<table class="comparison-table"><thead><tr><th class="covenant-col">Covenant Model</th><th class="babylonian-col">Babylonian Model</th></tr></thead><tbody>`;
          s.comparisonRows.forEach((row) => {
            html += `<tr><td class="covenant-col">\u2713 ${row.covenant}</td><td class="babylonian-col">\u2717 ${row.babylonian}</td></tr>`;
          });
          html += `</tbody></table>`;
        }
        if (s.scriptureRefs && s.scriptureRefs.length > 0) {
          html += `<div class="scripture-refs">${s.scriptureRefs.join(" \u00b7 ")}</div>`;
        }
        html += `<hr class="separator" />`;
        return html;
      })
      .join("\n");

    return `<!DOCTYPE html>
<html>
<head>
  <title>Babylonian System Comparison — Two Kingdoms, Two Architectures</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap');
    body {
      font-family: 'Crimson Pro', 'Georgia', serif;
      max-width: 8.5in;
      margin: 0.75in auto;
      padding: 0 0.5in;
      color: #1a1a1a;
      font-size: 11pt;
      line-height: 1.65;
    }
    h1 {
      font-family: 'Cinzel', serif;
      text-align: center;
      font-size: 20pt;
      letter-spacing: 0.15em;
      margin-bottom: 4pt;
      text-transform: uppercase;
    }
    .doc-subtitle {
      font-family: 'Cinzel', serif;
      text-align: center;
      font-size: 12pt;
      color: #555;
      margin-bottom: 8pt;
    }
    .doc-date {
      text-align: center;
      font-size: 10pt;
      color: #888;
      margin-bottom: 24pt;
    }
    .section-title {
      font-family: 'Cinzel', serif;
      font-size: 13pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      border-bottom: 1px solid #ccc;
      padding-bottom: 4pt;
      margin-top: 24pt;
      margin-bottom: 10pt;
    }
    .subsection-title {
      font-family: 'Cinzel', serif;
      font-size: 11pt;
      font-weight: 600;
      margin-top: 16pt;
      margin-bottom: 6pt;
      color: #333;
    }
    .section-content {
      white-space: pre-wrap;
      margin-bottom: 10pt;
    }
    .separator {
      border: none;
      border-top: 1px solid #ddd;
      margin: 20pt 35%;
    }
    .key-takeaway {
      background: #fdf6e3;
      border: 2px solid #d4a843;
      border-radius: 6px;
      padding: 10pt 14pt;
      margin: 10pt 0;
      font-size: 10.5pt;
    }
    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      margin: 12pt 0 8pt;
      font-size: 10pt;
    }
    .comparison-table th, .comparison-table td {
      border: 1px solid #ccc;
      padding: 6pt 10pt;
      text-align: left;
      width: 50%;
    }
    .comparison-table th.covenant-col, .comparison-table td.covenant-col {
      background: #f0fdf4;
    }
    .comparison-table th.babylonian-col, .comparison-table td.babylonian-col {
      background: #fef2f2;
    }
    .scripture-refs {
      font-family: 'Cinzel', serif;
      font-size: 9pt;
      color: #7c6a2e;
      margin: 8pt 0 4pt;
      letter-spacing: 0.03em;
    }
    @media print {
      body { margin: 0; padding: 0.5in; }
      .section-title { page-break-after: avoid; }
    }
  </style>
</head>
<body>
  <h1>Babylonian System Comparison</h1>
  <div class="doc-subtitle">Two Kingdoms, Two Architectures</div>
  <div class="doc-subtitle" style="font-size: 10pt; color: #888;">Covenant Model \u2022 Babylonian Model \u2022 Educational Reference</div>
  <div class="doc-date">Published ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
  <hr class="separator" />
  ${allContent}
  <div style="text-align: center; margin-top: 30pt;">
    <div style="font-family: 'Cinzel', serif; font-size: 10pt; text-transform: uppercase; letter-spacing: 0.2em; color: #888;">
      Ecclesia Basilikos Trust
    </div>
    <div style="font-size: 9pt; color: #aaa; margin-top: 4pt;">
      Educational Reference — For Covenant Members
    </div>
  </div>
</body>
</html>`;
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(getComparisonHtml());
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  const handleDownload = () => {
    const html = getComparisonHtml();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Babylonian_System_Comparison.html";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <Badge className="text-[10px] mb-2 bg-amber-700 text-white border-0">
                <BookOpen className="w-3 h-3 mr-1" />
                Educational Reference
              </Badge>
              <h1 className="font-cinzel text-2xl font-bold text-slate-800">
                Babylonian System Comparison
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Two Kingdoms, Two Architectures
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={() => setGlobalExpand((c) => c + 1)}>
                <ChevronsUpDown className="w-4 h-4 mr-1" /> Expand All
              </Button>
              <Button size="sm" variant="outline" onClick={() => setGlobalCollapse((c) => c + 1)}>
                <ChevronUp className="w-4 h-4 mr-1" /> Collapse All
              </Button>
              <Button size="sm" variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-1" /> Print
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-1" /> Download
              </Button>
            </div>
          </div>
        </div>

        {/* Title Block */}
        <div className="text-center mb-10 py-10 bg-gradient-to-b from-slate-50 to-white border border-slate-200 rounded-xl">
          <Scale className="w-10 h-10 text-royal-gold mx-auto mb-4" />
          <h1 className="font-cinzel text-2xl tracking-[0.12em] text-slate-800 uppercase">
            Babylonian System Comparison
          </h1>
          <p className="font-cinzel text-sm text-slate-500 mt-2 tracking-wide">
            Two Kingdoms, Two Architectures
          </p>
          <div className="mt-4 mx-auto w-32 border-t-2 border-royal-navy/30" />
          <p className="text-xs text-slate-400 mt-4 tracking-widest uppercase">
            Version 1.0 — {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}
          </p>
        </div>

        {/* Table of Contents */}
        <TableOfContents onNavigate={scrollToSection} activeSection={activeSection} />

        {/* Visual Comparison Diagram */}
        <ComparisonDiagram />

        {/* Sections */}
        <div>
          {sections.map((section) => (
            <SectionBlock key={section.id} section={section} globalExpand={globalExpand} globalCollapse={globalCollapse} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center pb-8">
          <div className="mx-auto w-32 border-t border-slate-300 mb-4" />
          <p className="text-[11px] text-slate-400 uppercase tracking-widest font-cinzel">
            Ecclesia Basilikos Trust
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Educational Reference — For Covenant Members
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
