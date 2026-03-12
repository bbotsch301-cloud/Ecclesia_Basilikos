import { useState } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Printer,
  Download,
  ChevronDown,
  ChevronRight,
  ScrollText,
  Crown,
  Shield,
  Building2,
  Coins,
  Scale,
  Heart,
  Layers,
  ArrowRight,
  Gem,
  BookOpen,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════
// WHITE PAPER SECTIONS
// ═══════════════════════════════════════════════════════════

interface WhitePaperSection {
  id: string;
  number: string;
  title: string;
  icon: typeof Crown;
  content: string;
  subsections?: { title: string; content: string }[];
}

const sections: WhitePaperSection[] = [
  {
    id: "abstract",
    number: "I",
    title: "Abstract",
    icon: ScrollText,
    content: `This white paper presents the economic architecture of the Ecclesia Basilikos Trust — a covenant-based economic ecosystem designed to restore the principles of divine stewardship, lawful money, and beneficial ownership to community life.

Unlike conventional economic systems built on debt-based currency, fractional reserve banking, and perpetual taxation, this model is grounded in trust law, private membership association (PMA) principles, and the theological concept of the ecclesia as a self-governing body operating under heavenly jurisdiction.

The system creates a closed-loop economy where labor, land, housing, enterprise, and treasury are held in trust for the benefit of all members. No member "owns" assets in the Babylonian sense — instead, each holds a Beneficial Unit representing an equal, undivided interest (1/N) in the trust corpus. Value flows through stewardship, not speculation. Governance is by covenant, not coercion.

This document describes every layer of the economic model, from the constitutional charter to the individual beneficial unit, explaining how value is created, circulated, preserved, and distributed within the trust ecosystem.`,
  },
  {
    id: "foundations",
    number: "II",
    title: "Philosophical & Legal Foundations",
    icon: Scale,
    content: `The economic model rests on three interlocking pillars that distinguish it from both conventional capitalism and collectivist alternatives.`,
    subsections: [
      {
        title: "A. Divine Stewardship vs. Ownership",
        content: `The foundational premise is that God is the ultimate owner of all creation. Humans are stewards, not owners. This is not merely theological rhetoric — it has direct legal and economic implications:

    - Assets are held in trust, not in personal name
    - The trustee administers; the protector oversees; the beneficiary enjoys
    - No individual can alienate trust property to external creditors
    - Wealth accumulation is replaced by wealth stewardship
    - "The earth is the LORD's, and the fulness thereof" (Psalm 24:1)

This principle eliminates the predatory dynamics of individual ownership — foreclosure, asset seizure, speculative bubbles — while preserving individual agency through the beneficial interest structure.`,
      },
      {
        title: "B. Lawful Money & the Rejection of Debt Currency",
        content: `The current global financial system operates on fiat currency created through debt issuance. Every dollar in circulation represents a debt owed to a central bank, creating a system where:

    - The total debt always exceeds the money supply (interest can never be fully repaid)
    - Perpetual inflation erodes purchasing power
    - The money supply is controlled by private banking cartels
    - Citizens are reduced to "taxpayers" — revenue units for servicing sovereign debt

The trust economy operates on lawful money principles:

    - Value is measured in labor-hours, tangible assets, and productive output
    - Internal accounting uses a unit-of-account tied to real value (land, labor, goods)
    - No fractional reserve lending — every unit of internal credit is backed by real assets or labor commitments
    - Members exchange value directly through the trust ledger, bypassing the debt-money system
    - External transactions (with the outside economy) use conventional currency but are minimized through internal self-sufficiency`,
      },
      {
        title: "C. Constitutional Authority & Private Jurisdiction",
        content: `The trust operates under constitutional and ecclesiastical authority, not commercial statutory law:

    - The First Amendment protects the right of free assembly (ecclesia)
    - Trust law predates and supersedes most statutory regulation
    - The PMA structure creates a private jurisdiction for member-to-member transactions
    - All internal economic activity is private, voluntary, and contractual
    - The covenant charter serves as the "constitution" of the economic body

This is not tax evasion or lawlessness — it is the lawful exercise of constitutionally protected rights to organize economic life according to covenant principles rather than commercial codes.`,
      },
    ],
  },
  {
    id: "architecture",
    number: "III",
    title: "Trust Architecture — The Nine Layers",
    icon: Layers,
    content: `The economy is structured as a hierarchical trust ecosystem with nine distinct layers. Each layer serves a specific function, and together they form a complete economic body capable of sustaining a community.`,
    subsections: [
      {
        title: "Layer 1: Covenant Charter (Constitutional Root)",
        content: `The Charter is the foundational declaration — the "constitution" of the entire trust ecosystem. It establishes:

    - The covenant purpose and mission
    - The divine and constitutional legal basis
    - The irrevocable nature of the trust
    - The authority from which all sub-trusts derive their legitimacy

All economic authority flows downward from this charter. No entity in the ecosystem can operate in contradiction to the charter's principles. This provides constitutional stability — the economic rules cannot be changed by temporary administrators or market pressures.

Economic function: Establishes the "rule of law" for the internal economy. All contracts, agreements, and transactions within the ecosystem must conform to charter principles.`,
      },
      {
        title: "Layer 2: Governance Trust (Ecclesia Basilikos Trust)",
        content: `The governance trust is the administrative anchor. It serves as the central coordinating body that:

    - Appoints trustees for operational sub-trusts
    - Establishes the protector council for oversight and accountability
    - Authorizes the creation of new sub-trusts and entities
    - Sets economic policy (contribution rates, distribution formulas, investment priorities)
    - Resolves disputes through covenant mediation, not litigation

The governance trust has two arms:
    1. Asset Stewardship Arm — manages the operational trusts (land, housing, treasury, enterprise)
    2. Community Governance Arm — manages the PMA and member relations

Neither arm controls the other. This separation of powers prevents the concentration of both economic and social authority in one body.

Economic function: Central economic policy, authorization of entities, dispute resolution, strategic planning.`,
      },
      {
        title: "Layer 3: Operational Trusts (Asset Stewardship)",
        content: `The operational layer consists of specialized sub-trusts, each holding and administering a specific category of assets:

    Land Trust
    - Holds all real property (agricultural land, homesteads, community facilities)
    - Land can never be sold or mortgaged — it is held in perpetuity
    - Members receive beneficial use rights, not ownership deeds
    - Stewardship assignments are based on productive use and community need
    - Prevents land speculation, gentrification, and displacement

    Housing Trust
    - Manages all residential structures built on trust land
    - Members are assigned housing based on family size and contribution
    - Maintenance is a community responsibility funded by the treasury
    - No rent in the conventional sense — members contribute labor or value in exchange
    - Housing cannot be foreclosed, seized, or lost to debt

    Treasury Trust
    - Manages the financial assets of the ecosystem
    - Receives contributions from enterprise profits, member tithes, and external income
    - Distributes funds according to governance policy
    - Maintains reserves for emergencies, expansion, and community projects
    - Operates the internal ledger system for member-to-member transactions
    - May hold precious metals, productive assets, or other stores of value

    Enterprise Trust
    - Holds and operates community businesses and productive enterprises
    - Profits flow to the treasury trust, not to individual "owners"
    - Members working in enterprises receive fair compensation through the internal system
    - Enterprises are authorized by the governance trust and must align with charter principles
    - Examples: agricultural operations, workshops, educational services, digital platforms

Economic function: Each operational trust is a specialized economic organ. Together, they hold and manage the full spectrum of community assets — land, shelter, money, and productive capacity.`,
      },
      {
        title: "Layer 4: Private Membership Association (PMA)",
        content: `The PMA is the "people layer" of the economy. It organizes the human element:

    - Every member voluntarily signs the PMA agreement
    - Membership grants beneficial interest in all trust assets
    - Members are simultaneously beneficiaries AND stewards (not passive consumers)
    - The PMA provides the constitutional basis for private jurisdiction
    - All member-to-member transactions are private contracts, not commercial exchanges

Economic function: Defines who participates in the economy, what rights and obligations they hold, and how human capital (labor, skills, knowledge) is organized and deployed.

The PMA structure means the internal economy is legally distinct from the external commercial system. Member contributions are not "income" in the statutory sense — they are fulfillment of covenant obligations within a private association.`,
      },
      {
        title: "Layer 5: Digital Platform (Community OS)",
        content: `The digital platform serves as the technological infrastructure for the economy:

    - Internal ledger and accounting system
    - Member profiles, beneficial unit tracking, and contribution records
    - Communication, coordination, and project management tools
    - Educational resources and training materials
    - Proof Vault — timestamped, cryptographically verifiable records of all transactions and agreements
    - Forum and community governance tools

Economic function: The nervous system of the economy. Without transparent, accessible record-keeping, trust-based economics cannot function. The platform ensures every member can verify their beneficial interest, track value flows, and participate in governance.`,
      },
      {
        title: "Layer 6: Geographic Chapters",
        content: `Chapters are the physical manifestation of the economy in specific locations:

    - Each chapter operates in a specific city or region
    - Chapters coordinate local land use, housing, enterprise, and community life
    - They are authorized by the governance trust and operate under charter principles
    - Each chapter has a steward (local trustee) and reports to the governance trust
    - Chapters can adapt to local conditions while maintaining ecosystem-wide standards

Economic function: Localization of the economy. While the trust structure provides universal principles, chapters handle the practical realities of specific places — local agriculture, regional enterprises, housing stock, and community services.`,
      },
      {
        title: "Layer 7: Functional Communities (Communes)",
        content: `Communes are organized around specific functions or callings:

    - Farming communes manage agricultural production
    - Discipleship communes focus on spiritual formation and education
    - Trade communes organize skilled labor and craft production
    - Service communes provide healthcare, childcare, elder care

Each commune operates within a chapter but may collaborate across chapters. Communes are the primary unit of productive labor in the economy.

Economic function: Division of labor and specialization. Communes allow the community to organize complex productive activities while maintaining the relational, covenant-based character of the economy.`,
      },
      {
        title: "Layer 8: Guilds (Cross-Chapter Functional Groups)",
        content: `Guilds operate across all chapters and geographic boundaries:

    - Organized by skill, trade, or professional expertise
    - A carpenter's guild, a medical guild, a technology guild, etc.
    - Guilds set quality standards, training requirements, and best practices
    - Members from any chapter may participate based on relevant skills
    - Guilds facilitate knowledge transfer and skill development across the ecosystem

Economic function: Quality assurance, professional development, and cross-chapter economic coordination. Guilds ensure that the community's productive capacity is maintained at high standards regardless of geographic location.`,
      },
      {
        title: "Layer 9: Beneficiaries & Stewards (All Members)",
        content: `Every member of the trust ecosystem is both a beneficiary and a steward:

    - As a beneficiary: entitled to beneficial use of trust assets (housing, land, community services, share of enterprise output)
    - As a steward: obligated to contribute labor, skills, or resources back to the community
    - The relationship is reciprocal, not extractive
    - No "free riders" — beneficial interest is contingent on active stewardship participation

This dual role is the fundamental economic innovation of the model. In conventional capitalism, owners extract value from workers. In conventional socialism, the state distributes value to citizens. In the trust economy, every participant is simultaneously a contributor and a recipient, creating a self-reinforcing cycle of value creation and distribution.

Economic function: The atomic unit of the economy — the individual member, holding a Beneficial Unit that represents their equal share in the whole.`,
      },
    ],
  },
  {
    id: "beneficial-unit",
    number: "IV",
    title: "The Beneficial Unit — Equal Share Economics",
    icon: Gem,
    content: `The Beneficial Unit is the core mechanism for economic equity within the trust ecosystem.`,
    subsections: [
      {
        title: "A. Structure",
        content: `Each member who signs the PMA agreement and commits to active stewardship is issued one (1) Beneficial Unit. This unit represents:

    - An equal, undivided beneficial interest in the entire trust corpus
    - The right to beneficial use of trust assets (not ownership)
    - A voice in community governance
    - A share of distributed benefits (housing, food, services, etc.)

The value of each unit is 1/N, where N is the total number of active beneficiaries. As the community grows, each unit's fractional share decreases, but the total trust corpus also grows through new member contributions and productive enterprise.`,
      },
      {
        title: "B. How Value Is Distributed",
        content: `Benefits are distributed not as cash dividends, but as access to the trust's real assets and services:

    - Housing: assigned based on family need and availability
    - Food: produced by agricultural communes, distributed through community systems
    - Education: courses, mentorship, and training provided by the platform and guilds
    - Healthcare: coordinated through service communes
    - Enterprise participation: members work in community enterprises and receive fair internal compensation
    - Emergency support: funded by the treasury trust

This is not communism — members retain personal property, can earn additional compensation through enterprise work, and can voluntarily withdraw from the association. The trust merely provides a floor of dignity and security, not a ceiling on individual achievement.`,
      },
      {
        title: "C. Non-Transferability & Protection",
        content: `Beneficial Units are:

    - Non-transferable (cannot be sold, traded, or speculated upon)
    - Non-attachable (cannot be seized by external creditors)
    - Revocable only by voluntary withdrawal or covenant violation adjudicated by the protector council
    - Not "shares" in a corporation — they are equitable interests in a trust

This structure prevents the concentration of wealth that plagues conventional economies. No member can accumulate multiple units, and no external party can acquire units. The economic playing field remains permanently level.`,
      },
    ],
  },
  {
    id: "value-flows",
    number: "V",
    title: "Value Flows — How the Economy Circulates",
    icon: Coins,
    content: `Understanding how value moves through the ecosystem is essential to understanding why the model works.`,
    subsections: [
      {
        title: "A. Inflows (Value Entering the System)",
        content: `Value enters the trust ecosystem through several channels:

    1. Member Contributions
       - Initial commitment (labor pledge, asset transfer, or financial contribution)
       - Ongoing tithes (10% of external income, or equivalent labor hours)
       - Skills and professional expertise contributed to guilds and communes

    2. Enterprise Revenue
       - Community businesses selling goods/services to the external market
       - Digital platform services (courses, resources, consulting)
       - Agricultural products sold externally

    3. Asset Appreciation
       - Land value increasing through stewardship and development
       - Enterprise growth and increased productive capacity
       - Skill development increasing the community's human capital

    4. Donations & Grants
       - External supporters contributing to the mission
       - Grants for community development, agriculture, or education`,
      },
      {
        title: "B. Internal Circulation",
        content: `Within the ecosystem, value circulates through the internal ledger:

    1. Labor Credits
       - Members earn internal credits for work performed in communes, guilds, or enterprises
       - Credits can be used for goods and services within the community
       - Credits are not "money" — they are accounting entries reflecting value contributed

    2. Resource Allocation
       - The treasury trust allocates funds to operational trusts based on governance policy
       - Chapters receive allocations based on size, need, and productive output
       - Communes and guilds receive project funding through the treasury

    3. Inter-Chapter Trade
       - Chapters with agricultural surplus trade with chapters that produce manufactured goods
       - Guilds facilitate cross-chapter service delivery
       - The internal ledger tracks all flows transparently

    4. Service Exchange
       - Members in service communes (healthcare, education, childcare) provide services
       - These services are "funded" by the treasury and available to all members
       - No member pays for essential services — they are trust benefits`,
      },
      {
        title: "C. Outflows (Value Leaving the System)",
        content: `The model minimizes outflows to the external economy:

    1. Essential Purchases
       - Goods and services not yet produced internally (fuel, technology, medical supplies)
       - As the community becomes more self-sufficient, external purchases decrease

    2. Tax Obligations
       - Any legally required external obligations are met honestly
       - The trust structure minimizes taxable events through lawful means
       - Internal transactions between PMA members are private contractual exchanges

    3. Expansion Capital
       - Acquiring new land for chapters
       - Building infrastructure
       - Launching new enterprises

The goal is an increasing ratio of internal circulation to external leakage, approaching (but never requiring) full self-sufficiency.`,
      },
    ],
  },
  {
    id: "governance",
    number: "VI",
    title: "Economic Governance — How Decisions Are Made",
    icon: Shield,
    content: `Economic governance follows the trust hierarchy, with checks and balances at every level.`,
    subsections: [
      {
        title: "A. The Protector Council",
        content: `The protector council is the supreme economic oversight body:

    - Cannot make day-to-day decisions (that's the trustee's role)
    - CAN veto any decision that violates the charter
    - Reviews annual budgets and treasury reports
    - Approves creation of new sub-trusts and major capital expenditures
    - Adjudicates disputes that cannot be resolved at lower levels
    - Members are selected for wisdom, integrity, and covenant commitment — not wealth or political influence`,
      },
      {
        title: "B. The Trustee",
        content: `The trustee (administrative authority) handles operational economic decisions:

    - Manages treasury allocations and budget execution
    - Authorizes routine expenditures within approved budgets
    - Appoints stewards for chapters and commune leaders
    - Reports to the protector council with full transparency
    - Can be replaced by the protector council for breach of fiduciary duty`,
      },
      {
        title: "C. Chapter & Commune Governance",
        content: `Local economic decisions are made at the chapter and commune level:

    - Chapter stewards manage local budgets within allocations from the treasury
    - Commune leaders organize productive labor and resource distribution
    - Members participate in local governance through regular assemblies
    - Decisions are made by covenant consensus where possible, with the steward having final authority for operational matters
    - All local decisions must align with charter principles and governance trust policies`,
      },
      {
        title: "D. Transparency & Accountability",
        content: `The internal economy requires radical transparency:

    - All treasury flows are recorded on the internal ledger and visible to all members
    - The Proof Vault provides timestamped, cryptographically verifiable records
    - Annual reports detail income, expenditure, asset values, and distribution
    - Any member can audit any trust account
    - The audit log tracks all administrative actions

This transparency is not optional — it is a structural requirement. Trust-based economics only works if trust is justified by verifiable records.`,
      },
    ],
  },
  {
    id: "comparison",
    number: "VII",
    title: "Comparison — Babylon vs. Kingdom Economics",
    icon: Crown,
    content: `The following comparison illustrates the fundamental differences between the conventional economic system and the trust economy model.`,
    subsections: [
      {
        title: "A. Money & Currency",
        content: `CONVENTIONAL (BABYLON):
    - Fiat currency created through debt issuance
    - Fractional reserve banking multiplies money supply without backing
    - Perpetual inflation erodes savings and purchasing power
    - Central banks control monetary policy for banking interests
    - Interest payments flow from productive economy to financial sector

TRUST ECONOMY (KINGDOM):
    - Internal accounting backed by real assets and labor
    - No fractional reserve — every credit represents real value
    - No inflation — the unit of account is tied to productive output
    - Monetary policy is set by covenant governance, not banking interests
    - No interest — value flows circularly through stewardship, not linearly through debt`,
      },
      {
        title: "B. Property & Ownership",
        content: `CONVENTIONAL (BABYLON):
    - Fee simple ownership creates illusion of absolute ownership
    - Property subject to taxation, liens, eminent domain, and creditor seizure
    - Real estate speculation inflates housing costs beyond productive value
    - Ownership concentration creates landlord class extracting rent from non-owners
    - Property as commodity — bought, sold, and leveraged for financial gain

TRUST ECONOMY (KINGDOM):
    - All property held in trust — no individual "owns" assets
    - Trust property exempt from most attachment and creditor claims
    - No speculation — property valued for productive use, not market price
    - No landlord class — all members have equal beneficial interest
    - Property as stewardship — held for the benefit of the community in perpetuity`,
      },
      {
        title: "C. Labor & Compensation",
        content: `CONVENTIONAL (BABYLON):
    - Workers sell labor to employers for wages
    - Employer extracts surplus value (profit) from worker productivity
    - Unemployment creates desperation that suppresses wages
    - "Benefits" (healthcare, retirement) tied to employment, creating dependency
    - Labor is a commodity traded in markets

TRUST ECONOMY (KINGDOM):
    - Members contribute labor as stewardship obligation
    - No surplus extraction — all value flows to the trust corpus for community benefit
    - Full employment — every member has productive work in communes, guilds, or enterprises
    - All benefits provided through trust, independent of specific work assignment
    - Labor is a calling and contribution, not a commodity`,
      },
      {
        title: "D. Social Safety Net",
        content: `CONVENTIONAL (BABYLON):
    - Government welfare programs funded by taxation
    - Means-tested benefits create poverty traps and bureaucratic humiliation
    - Charity is voluntary and insufficient — depends on donor generosity
    - Economic crises leave millions without support
    - "Safety net" is reactive — catches people after they fall

TRUST ECONOMY (KINGDOM):
    - Universal beneficial interest provides floor of dignity for all members
    - Housing, food, education, healthcare provided through trust structure
    - No means-testing — all members receive benefits as of right
    - Self-insurance through treasury reserves and community mutual aid
    - "Safety net" is structural — members cannot fall because the floor is built into the system`,
      },
    ],
  },
  {
    id: "implementation",
    number: "VIII",
    title: "Implementation Roadmap",
    icon: ArrowRight,
    content: `The transition from theory to practice follows a phased approach.`,
    subsections: [
      {
        title: "Phase 1: Foundation (Current)",
        content: `    - Establish the covenant charter and governance trust
    - Build the digital platform (courses, community, proof vault)
    - Begin PMA enrollment and beneficial unit issuance
    - Develop educational content explaining the model
    - Build the first community of committed stewards
    - Establish legal documentation for all trust entities`,
      },
      {
        title: "Phase 2: First Chapter",
        content: `    - Acquire first land holdings through the land trust
    - Establish first geographic chapter with resident members
    - Launch first community enterprises
    - Begin agricultural production on trust land
    - Implement the internal ledger and labor credit system
    - Establish first functional communes (farming, education, service)`,
      },
      {
        title: "Phase 3: Network Growth",
        content: `    - Establish additional chapters in strategic locations
    - Launch guilds for cross-chapter coordination
    - Expand enterprise portfolio for economic self-sufficiency
    - Develop inter-chapter trade and resource sharing systems
    - Achieve critical mass for internal economic viability
    - Begin reducing dependency on external economy`,
      },
      {
        title: "Phase 4: Maturity",
        content: `    - Fully functional multi-chapter trust economy
    - Comprehensive internal production covering most member needs
    - Robust treasury with reserves for expansion and emergencies
    - Proven governance model with established protector council
    - Replicable model documented for other communities worldwide
    - Complete ecosystem from charter to beneficial unit operating at scale`,
      },
    ],
  },
  {
    id: "risks",
    number: "IX",
    title: "Risks, Challenges & Mitigations",
    icon: Building2,
    content: `Honesty about challenges is essential. This model is ambitious, and several risks must be acknowledged and addressed.`,
    subsections: [
      {
        title: "A. Legal & Regulatory Risk",
        content: `Challenge: Government agencies may challenge the trust structure, PMA status, or tax treatment.

Mitigation:
    - All structures are grounded in well-established trust law principles
    - PMA rights are constitutionally protected under freedom of association
    - The model does not evade taxes — it lawfully structures activity to minimize taxable events
    - Legal documentation is comprehensive and professionally reviewed
    - Full transparency and good-faith compliance with applicable law`,
      },
      {
        title: "B. Governance Failure",
        content: `Challenge: Trustees or stewards could abuse their authority for personal gain.

Mitigation:
    - Protector council provides independent oversight with veto power
    - Full transparency of all financial records via the digital platform
    - Audit log tracks all administrative actions
    - Trustees can be replaced by the protector council
    - The charter is irrevocable — even corrupt administrators cannot change the fundamental rules`,
      },
      {
        title: "C. Economic Viability",
        content: `Challenge: The internal economy may not produce sufficient value to sustain the community.

Mitigation:
    - Phased implementation allows gradual reduction of external dependency
    - Diversified enterprise portfolio reduces risk of single-point failure
    - Treasury reserves provide buffer during transition periods
    - Members maintain ability to earn externally while the internal economy develops
    - The model does not require complete self-sufficiency — it aims for maximum practical independence`,
      },
      {
        title: "D. Free Rider Problem",
        content: `Challenge: Some members may consume benefits without contributing proportionally.

Mitigation:
    - Beneficial interest is contingent on active stewardship participation
    - Transparent contribution tracking via the platform
    - Commune and guild structures create social accountability
    - The protector council can address persistent non-contribution
    - Cultural emphasis on stewardship as calling, not burden`,
      },
    ],
  },
  {
    id: "biblical-foundations",
    number: "X",
    title: "Biblical & Early Church Foundations",
    icon: BookOpen,
    content: `The trust economy is not an invention of modern legal theory — it is a recovery of the economic model practiced by the earliest ecclesia. The book of Acts records a community that operated on precisely the principles this trust structure implements: shared assets, mutual stewardship, elder governance, and distribution according to need.`,
    subsections: [
      {
        title: "A. The Original Economic Model — Acts 2:42-47 / Acts 4:32-35",
        content: `The earliest church operated as a functioning economic community:

    "And they continued stedfastly in the apostles' doctrine and fellowship, and in breaking of bread, and in prayers... And all that believed were together, and had all things common; And sold their possessions and goods, and parted them to all men, as every man had need... And they, continuing daily with one accord in the temple, and breaking bread from house to house, did eat their meat with gladness and singleness of heart."
    — Acts 2:42, 44-46

    "And the multitude of them that believed were of one heart and of one soul: neither said any of them that ought of the things which he possessed was his own; but they had all things common... Neither was there any among them that lacked: for as many as were possessors of lands or houses sold them, and brought the prices of the things that were sold, And laid them down at the apostles' feet: and distribution was made unto every man according as he had need."
    — Acts 4:32, 34-35

This was not primitive communism — it was voluntary covenant community organized under apostolic governance. Assets were held in common trust. Distribution was according to need. Governance was by appointed elders. This is precisely what the Ecclesia Basilikos Trust structure implements through modern trust law.`,
      },
      {
        title: "B. Koinonia (κοινωνία) — Fellowship as Economic Participation",
        content: `The Greek word koinonia, typically translated "fellowship," carries a far richer meaning than modern churchgoers realize. It denotes:

    - Partnership and sharing in common — a joint participation in resources
    - Economic solidarity — not merely spiritual friendship
    - Mutual contribution and mutual benefit — the same reciprocal relationship encoded in the Beneficial Unit structure

    "And they continued stedfastly in the apostles' doctrine and koinonia..." — Acts 2:42

In the early church, koinonia was not a Wednesday night potluck — it was the economic operating system. Members contributed assets, labor, and skills into a common pool administered by the apostles and later by appointed elders and deacons. The trust ecosystem's commune structure directly mirrors this koinonia household model.`,
      },
      {
        title: "C. Five-Fold Ministry Governance vs. Corporate Hierarchy",
        content: `The early church did not organize itself as a corporation with a CEO, board of directors, and shareholders. It was governed by a five-fold ministry structure:

    "And he gave some, apostles; and some, prophets; and some, evangelists; and some, pastors and teachers; For the perfecting of the saints, for the work of the ministry, for the edifying of the body of Christ."
    — Ephesians 4:11-12

Each role serves a distinct function in the governance ecosystem:

    Apostle — Foundational authority and new territory (maps to Grantor/Trustee)
    Prophet — Discernment and direction (maps to Protector Council)
    Evangelist — Outreach and growth (maps to Enterprise/Expansion)
    Pastor — Shepherding and care (maps to Chapter/Commune Steward)
    Teacher — Education and training (maps to Guild/Education Trust)

This is complemented by the elder/deacon structure:

    "Let the elders that rule well be counted worthy of double honour, especially they who labour in the word and doctrine." — 1 Timothy 5:17

    "Likewise must the deacons be grave... Holding the mystery of the faith in a pure conscience." — 1 Timothy 3:8-9

Elders govern. Deacons serve. The five-fold ministry equips. Together, they form a governance structure that is both authoritative and servant-hearted — precisely the model the trust ecosystem implements through its layered governance.`,
      },
      {
        title: "D. The Storehouse Principle — Malachi 3:10 / Acts 4:34-35",
        content: `The Treasury Trust implements the biblical storehouse principle:

    "Bring ye all the tithes into the storehouse, that there may be meat in mine house, and prove me now herewith, saith the LORD of hosts, if I will not open you the windows of heaven, and pour you out a blessing, that there shall not be room enough to receive it."
    — Malachi 3:10

In the early church, the apostles' feet served as the storehouse:

    "And laid them down at the apostles' feet: and distribution was made unto every man according as he had need." — Acts 4:35

The Treasury Trust functions as the modern storehouse — receiving contributions, holding reserves, and distributing according to community need. The tithes relationship type in the trust structure directly implements this scriptural pattern.`,
      },
      {
        title: "E. Jubilee Economics — Debt Release & Land Return (Leviticus 25)",
        content: `The most radical economic provision in scripture is the Year of Jubilee:

    "And ye shall hallow the fiftieth year, and proclaim liberty throughout all the land unto all the inhabitants thereof: it shall be a jubile unto you; and ye shall return every man unto his possession, and ye shall return every man unto his family."
    — Leviticus 25:10

    "The land shall not be sold for ever: for the land is mine; for ye are strangers and sojourners with me."
    — Leviticus 25:23

The trust structure implements jubilee economics structurally:

    - Land is held in trust perpetually — it can never be sold or alienated (Leviticus 25:23)
    - The sabbatical cycle provides periodic rest and debt review (Exodus 23:10-11)
    - The jubilee principle ensures no generational wealth concentration
    - Beneficial Units are non-transferable — preventing the accumulation that jubilee was designed to reset

Where ancient Israel needed a periodic jubilee to correct drift toward inequality, the trust structure prevents that drift from occurring in the first place.`,
      },
      {
        title: "F. Widow, Orphan & Stranger Provisions",
        content: `Scripture mandates economic provision for the vulnerable:

    "At the end of three years thou shalt bring forth all the tithe of thine increase the same year, and shalt lay it up within thy gates: And the Levite, (because he hath no part nor inheritance with thee,) and the stranger, and the fatherless, and the widow, which are within thy gates, shall come, and shall eat and be satisfied."
    — Deuteronomy 14:28-29

    "Pure religion and undefiled before God and the Father is this, To visit the fatherless and widows in their affliction, and to keep himself unspotted from the world."
    — James 1:27

The trust ecosystem builds this care into its structure through:

    - The Housing Trust ensuring no member is without shelter
    - The Treasury Trust providing for those unable to fully contribute
    - The Beneficial Unit guaranteeing equal interest regardless of economic productivity
    - The PMA's covenant obligation of mutual care and support
    - The Benevolence provisions embedded in each operational trust`,
      },
      {
        title: "G. How Each Trust Layer Maps to Early Church Structure",
        content: `The nine-layer trust architecture directly mirrors the organizational pattern of the early church:

    Charter Trust → Apostolic foundation (Ephesians 2:20 — "Built upon the foundation of the apostles and prophets")
    Governance Trust → Apostolic administration (Acts 6:2-4 — "It is not reason that we should leave the word of God, and serve tables")
    Operational Trusts → Diaconal service arms (Acts 6:3 — "Look ye out among you seven men... whom we may appoint over this business")
    PMA → The ecclesia assembly (Matthew 16:18 — "I will build my ecclesia")
    Chapters → Local churches (Acts 14:23 — "They ordained elders in every church")
    Communes → House churches (Romans 16:5 — "The church that is in their house")
    Guilds → Gift-based working groups (1 Corinthians 12:28 — "God hath set some in the church")
    Projects → Kingdom works (Nehemiah 2:17-18 — "Let us build up the wall")
    Beneficiaries → Joint heirs (Romans 8:17 — "Heirs of God, and joint-heirs with Christ")

The trust structure is not an imposition of modern legal concepts onto ancient faith — it is the recovery of ancient faith through modern legal instruments. The early church already operated this way. The trust ecosystem simply provides the legal protection to do it again.`,
      },
    ],
  },
  {
    id: "conclusion",
    number: "XI",
    title: "Conclusion — A More Excellent Way",
    icon: Heart,
    content: `The Ecclesia Basilikos Trust economy is not utopian idealism — it is a practical, legally grounded alternative to the debt-based, extractive economic system that dominates the modern world.

By returning to the ancient principles of trust law, stewardship, and covenant community, this model creates an economic system where:

    - No member is homeless, hungry, or without access to healthcare and education
    - No external creditor can seize community assets
    - No speculator can inflate the cost of land and housing beyond reach
    - No banking cartel controls the money supply or extracts interest from productive labor
    - Every member has an equal beneficial interest and an equal voice in governance
    - Wealth is measured in community well-being, not individual accumulation
    - The economy serves the people, not the other way around

This is not a rejection of economic activity — it is a reformation of economic relationships. Members still work, create, trade, and build. They simply do so within a structure that ensures the fruits of their labor benefit the community rather than enriching distant shareholders and creditors.

The model is ambitious. It requires committed people willing to covenant together and build something genuinely new. But the legal tools exist. The trust law is established. The constitutional protections are real. The technology for transparent governance is available.

What remains is the will to build it — and the faith to believe that a more excellent way is possible.

"And all that believed were together, and had all things common; and sold their possessions and goods, and parted them to all men, as every man had need."
— Acts 2:44-45

This is not a prescription to replicate first-century economics literally, but a recognition that the earliest ecclesia understood something modern Christianity has forgotten: that genuine community requires genuine economic solidarity. The trust structure provides the legal and organizational framework to make that solidarity real, sustainable, and protected under law.

The Ecclesia Basilikos Trust economy is an invitation — to step out of Babylon's debt machine and into a covenant community where stewardship replaces ownership, where mutual benefit replaces extraction, and where every member matters equally.

The Kingdom economy is not coming. It is being built — one beneficial unit at a time.`,
  },
];

// ═══════════════════════════════════════════════════════════
// TABLE OF CONTENTS
// ═══════════════════════════════════════════════════════════

function TableOfContents({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
      <h3 className="font-cinzel text-sm font-semibold tracking-wide text-slate-600 uppercase mb-4">
        Table of Contents
      </h3>
      <div className="space-y-1.5">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onNavigate(section.id)}
            className="flex items-center gap-3 w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors group"
          >
            <span className="text-xs font-mono text-slate-400 w-6">{section.number}</span>
            <section.icon className="w-4 h-4 text-slate-400 group-hover:text-royal-navy transition-colors" />
            <span className="text-sm text-slate-700 group-hover:text-royal-navy transition-colors">
              {section.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION RENDERER
// ═══════════════════════════════════════════════════════════

function SectionBlock({ section }: { section: WhitePaperSection }) {
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

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
      </div>

      {/* Section divider */}
      <div className="mt-8 mx-auto w-24 border-t border-slate-200" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════

export default function AdminWhitePaper() {
  usePageTitle("Admin - White Paper");

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const getWhitePaperHtml = () => {
    const allContent = sections
      .map((s) => {
        let html = `<div class="section-title">Section ${s.number} — ${s.title}</div>`;
        html += `<div class="section-content">${s.content}</div>`;
        if (s.subsections) {
          s.subsections.forEach((sub) => {
            html += `<div class="subsection-title">${sub.title}</div>`;
            html += `<div class="section-content">${sub.content}</div>`;
          });
        }
        html += `<hr class="separator" />`;
        return html;
      })
      .join("\n");

    return `<!DOCTYPE html>
<html>
<head>
  <title>Ecclesia Basilikos Trust Economy — White Paper</title>
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
    @media print {
      body { margin: 0; padding: 0.5in; }
      .section-title { page-break-after: avoid; }
    }
  </style>
</head>
<body>
  <h1>White Paper</h1>
  <div class="doc-subtitle">The Ecclesia Basilikos Trust Economy</div>
  <div class="doc-subtitle" style="font-size: 10pt; color: #888;">A Covenant-Based Economic Architecture for Community Self-Governance</div>
  <div class="doc-date">Published ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
  <hr class="separator" />
  ${allContent}
  <div style="text-align: center; margin-top: 30pt;">
    <div style="font-family: 'Cinzel', serif; font-size: 10pt; text-transform: uppercase; letter-spacing: 0.2em; color: #888;">
      Ecclesia Basilikos Trust
    </div>
    <div style="font-size: 9pt; color: #aaa; margin-top: 4pt;">
      Confidential — For Internal Distribution Only
    </div>
  </div>
</body>
</html>`;
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(getWhitePaperHtml());
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  const handleDownload = () => {
    const html = getWhitePaperHtml();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Ecclesia_Basilikos_Trust_Economy_White_Paper.html";
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
              <Badge className="text-[10px] mb-2 bg-royal-navy text-white border-0">
                <ScrollText className="w-3 h-3 mr-1" />
                Internal Document
              </Badge>
              <h1 className="font-cinzel text-2xl font-bold text-slate-800">
                White Paper
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                The Ecclesia Basilikos Trust Economy — A Covenant-Based Economic Architecture
              </p>
            </div>
            <div className="flex items-center gap-2">
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
          <Crown className="w-10 h-10 text-royal-gold mx-auto mb-4" />
          <h1 className="font-cinzel text-2xl tracking-[0.12em] text-slate-800 uppercase">
            The Ecclesia Basilikos Trust Economy
          </h1>
          <p className="font-cinzel text-sm text-slate-500 mt-2 tracking-wide">
            A Covenant-Based Economic Architecture for Community Self-Governance
          </p>
          <div className="mt-4 mx-auto w-32 border-t-2 border-royal-navy/30" />
          <p className="text-xs text-slate-400 mt-4 tracking-widest uppercase">
            Version 1.0 — {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}
          </p>
        </div>

        {/* Table of Contents */}
        <TableOfContents onNavigate={scrollToSection} />

        {/* Sections */}
        <div>
          {sections.map((section) => (
            <SectionBlock key={section.id} section={section} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center pb-8">
          <div className="mx-auto w-32 border-t border-slate-300 mb-4" />
          <p className="text-[11px] text-slate-400 uppercase tracking-widest font-cinzel">
            Ecclesia Basilikos Trust
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Confidential — For Internal Distribution Only
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
