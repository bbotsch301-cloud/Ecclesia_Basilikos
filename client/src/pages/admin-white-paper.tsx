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
  Landmark,
  Users,
  Lock,
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
    content: `This white paper presents a comprehensive exposition of the Ecclesia Basilikos Trust Economy — a covenant-based economic architecture designed to restore the ancient principles of divine stewardship, lawful money, equitable beneficial ownership, and self-governing community life within a modern legal framework.

The global economic order operates on a foundation of debt-based fiat currency, fractional reserve banking, perpetual taxation of labor, and the legal fiction of corporate personhood. These mechanisms — whatever their historical justifications — produce systemic outcomes that are antithetical to biblical economic principles: wealth concentration, generational debt bondage, displacement of productive communities, and the subordination of human dignity to financial metrics.

The Ecclesia Basilikos Trust Economy proposes a lawful, constitutionally protected alternative. Drawing upon trust law (the oldest and most resilient legal framework in the common law tradition), Private Membership Association (PMA) rights (protected under the First and Fourteenth Amendments), and the theological concept of the ecclesia as a sovereign, self-governing assembly operating under heavenly jurisdiction, this model constructs a closed-loop economic ecosystem in which:

    • All productive assets — land, housing, enterprise, treasury — are held in irrevocable trust for the perpetual benefit of covenant members
    • Every member holds a single, equal, non-transferable Beneficial Unit representing an undivided 1/N interest in the entire trust corpus
    • Value circulates through stewardship rather than speculation, through contribution rather than extraction
    • Governance operates by covenant consensus under a separation-of-powers structure modeled on biblical ecclesial governance
    • The internal economy is legally distinct from the external commercial system, operating as private contractual exchange within a constitutionally protected association

This document exhaustively describes every layer of the economic architecture — from its philosophical and scriptural foundations to its trust law mechanics, from the nine-layer organizational structure to the practical implementation roadmap — providing a complete blueprint for building a functioning covenant economy in the modern world.

This is not utopian speculation. Every legal instrument described herein exists in established law. Every constitutional protection cited herein has been affirmed by the courts. Every economic mechanism described herein has historical precedent. What is new is the integration of these elements into a coherent, self-reinforcing system — a recovery of the economic model practiced by the earliest ecclesia, implemented through the legal instruments available to free people in the twenty-first century.`,
  },
  {
    id: "foundations",
    number: "II",
    title: "Philosophical & Theological Foundations",
    icon: Scale,
    content: `The Ecclesia Basilikos Trust Economy is not an economic theory in the conventional sense — it is the application of unchanging theological principles to the organization of material life. Before examining the legal structures and economic mechanics, we must establish the foundational premises from which the entire architecture derives its legitimacy and coherence.`,
    subsections: [
      {
        title: "A. Divine Ownership & Human Stewardship",
        content: `The foundational premise of the entire system is that God is the absolute owner of all creation, and human beings are appointed stewards — never owners — of the resources entrusted to them.

    "The earth is the LORD's, and the fulness thereof; the world, and they that dwell therein."
    — Psalm 24:1

    "The silver is mine, and the gold is mine, saith the LORD of hosts."
    — Haggai 2:8

    "For every beast of the forest is mine, and the cattle upon a thousand hills."
    — Psalm 50:10

    "Behold, all souls are mine; as the soul of the father, so also the soul of the son is mine."
    — Ezekiel 18:4

This is not merely theological rhetoric — it has direct, practical, and legally operative implications:

    1. Assets are held in trust, not in personal name — because a steward does not hold title; he administers for the benefit of the owner's purposes
    2. The trustee administers; the protector oversees; the beneficiary enjoys — mirroring the divine order where God owns, Christ mediates, and the Body receives
    3. No individual can alienate trust property to external creditors — because the steward cannot sell what he does not own
    4. Wealth accumulation for its own sake is a breach of fiduciary duty — the steward who hoards violates his mandate
    5. Economic activity is worship — the faithful steward renders an account (Luke 16:2)

The legal structure of a trust perfectly encodes this theological reality. In trust law, the trustee holds legal title but has no beneficial interest. The beneficiary holds equitable title but has no administrative control. The grantor establishes the terms and purposes that bind both. This tripartite structure mirrors the divine economy: the Father grants, the Son administers, and the Body benefits.

The practical consequence is the elimination of the predatory dynamics inherent in absolute ownership — foreclosure, speculative asset inflation, creditor seizure, and the concentration of productive resources in the hands of those who neither labor nor steward. When all assets are held in trust, the question changes from "Who owns this?" to "For whose benefit is this held, and is the steward faithful?"`,
      },
      {
        title: "B. The Two Creations — Legal Fiction vs. Living Soul",
        content: `A critical theological and legal distinction undergirds the entire model: the difference between the natural man created by God and the legal person created by the state.

Scripture describes the creation of man as a direct act of God:

    "And the LORD God formed man of the dust of the ground, and breathed into his nostrils the breath of life; and man became a living soul."
    — Genesis 2:7

    "So God created man in his own image, in the image of God created he him; male and female created he them."
    — Genesis 1:27

The living soul — the man or woman made in God's image — is the bearer of inherent, unalienable rights that derive from the Creator, not from any state or government. These rights exist prior to, and independent of, any civil authority.

By contrast, the modern legal system operates primarily upon legal persons — artificial entities created by state registration (birth certificates, corporate charters, social security numbers). These legal fictions are subject to statutory regulation, taxation, and the jurisdiction of administrative courts precisely because they are creatures of the state.

    "A person is such, not because he is human, but because rights and duties are ascribed to him."
    — Kelsen, Pure Theory of Law

The trust economy operates on behalf of living men and women exercising their constitutionally protected right to associate privately and organize their economic lives according to covenant principles. The PMA structure ensures that internal economic activity occurs between natural persons in their private capacity — not between legal fictions in the commercial jurisdiction.

This distinction is not merely theoretical. It determines:
    • Which body of law governs internal transactions (private contract law, not commercial regulation)
    • Whether internal exchanges create taxable events (private exchanges between PMA members under specific conditions differ from commercial transactions)
    • Whether external authorities have jurisdiction over internal governance (constitutional protections limit state intrusion into private associations)
    • Whether members relate to each other as consumers and vendors (commercial) or as covenant partners (private)`,
      },
      {
        title: "C. Covenant vs. Contract — Two Paradigms of Agreement",
        content: `The modern commercial world operates on contracts — agreements enforced by the state, governed by the Uniform Commercial Code, and ultimately backed by the threat of state-imposed penalties. Contracts are transactional: each party seeks to maximize individual advantage within the terms.

The trust economy operates on covenant — a binding agreement rooted in mutual commitment, honor, and shared purpose, entered into before God and the community. Covenants are relational: each party commits to the other's welfare as their own.

Scripture distinguishes clearly between these paradigms:

    "And I will make an everlasting covenant with them, that I will not turn away from them, to do them good; but I will put my fear in their hearts, that they shall not depart from me."
    — Jeremiah 32:40

    "Now the God of peace, that brought again from the dead our Lord Jesus, that great shepherd of the sheep, through the blood of the everlasting covenant..."
    — Hebrews 13:20

The covenant model produces fundamentally different economic behavior:

    CONTRACTUAL ECONOMY:
    • Parties seek personal advantage within legal limits
    • Enforcement depends on courts and state power
    • Relationships are disposable — breach triggers litigation
    • Trust is optional and verified by external audit
    • The goal is individual profit maximization

    COVENANT ECONOMY:
    • Parties seek mutual flourishing and community benefit
    • Enforcement depends on honor, accountability, and covenant discipline
    • Relationships are enduring — conflict triggers reconciliation
    • Trust is structural and verified by transparent records
    • The goal is faithful stewardship and equitable distribution

The PMA covenant agreement is the gateway to the trust economy. By signing it, each member voluntarily enters a private jurisdiction where covenant principles — not commercial codes — govern economic relationships. This is not lawlessness; it is the exercise of a higher law within a constitutionally protected private association.`,
      },
      {
        title: "D. The Rejection of Usury — Lawful Money & Debt-Free Economics",
        content: `Scripture categorically prohibits usury — the charging of interest on loans — and describes it as an abomination:

    "He that hath not given forth upon usury, neither hath taken any increase... he is just, he shall surely live, saith the Lord GOD."
    — Ezekiel 18:8-9

    "Thou shalt not lend upon usury to thy brother; usury of money, usury of victuals, usury of any thing that is lent upon usury."
    — Deuteronomy 23:19

    "He that by usury and unjust gain increaseth his substance, he shall gather it for him that will pity the poor."
    — Proverbs 28:8

The modern financial system is built entirely on usury — and not merely personal lending, but systemic, institutional, compounding usury:

    1. Every unit of fiat currency enters circulation as debt — a loan from the central bank to the government or commercial bank, bearing interest
    2. The total debt therefore always exceeds the total money supply — the interest owed can never be fully repaid in aggregate
    3. Fractional reserve banking multiplies this debt by lending money that does not exist — creating purchasing power from ledger entries
    4. Compound interest ensures that debt grows exponentially while productive output grows arithmetically
    5. The result is a mathematical certainty: wealth concentrates to creditors, and the productive economy is gradually consumed by debt service

The trust economy operates on fundamentally different monetary principles:

    • Internal accounting is backed by real assets and labor — every credit represents demonstrated value
    • No fractional reserve lending — every unit of internal credit is fully backed
    • No interest charges — value circulates through stewardship, not through debt
    • The unit of account is tied to productive output (labor-hours, tangible goods, measurable services)
    • External currency is used for necessary transactions with the outside economy, but the internal economy is insulated from its inflationary and extractive dynamics
    • Members exchange value directly through the trust ledger, creating a parallel economic circulatory system that does not depend on or enrich the debt-money system

This is not merely an alternative preference — it is obedience to explicit scriptural command and the structural prerequisite for an economy that serves people rather than consuming them.`,
      },
    ],
  },
  {
    id: "biblical-foundations",
    number: "III",
    title: "Biblical & Early Church Economic Foundations",
    icon: BookOpen,
    content: `The trust economy is not a modern invention imposed upon ancient faith — it is a recovery of the economic model practiced by the earliest ecclesia, documented in scripture, and attested in the historical record. This section establishes that every structural element of the Ecclesia Basilikos Trust has direct scriptural precedent and was operative in the first-century church.`,
    subsections: [
      {
        title: "A. The Original Economic Model — Acts 2 & 4",
        content: `The book of Acts records the formation of the first ecclesia as a functioning economic community — not merely a worship assembly, but a comprehensive system for organizing productive life:

    "And they continued stedfastly in the apostles' doctrine and fellowship, and in breaking of bread, and in prayers. And fear came upon every soul: and many wonders and signs were done by the apostles. And all that believed were together, and had all things common; And sold their possessions and goods, and parted them to all men, as every man had need. And they, continuing daily with one accord in the temple, and breaking bread from house to house, did eat their meat with gladness and singleness of heart, Praising God, and having favour with all the people."
    — Acts 2:42-47

    "And the multitude of them that believed were of one heart and of one soul: neither said any of them that ought of the things which he possessed was his own; but they had all things common. And with great power gave the apostles witness of the resurrection of the Lord Jesus: and great grace was upon them all. Neither was there any among them that lacked: for as many as were possessors of lands or houses sold them, and brought the prices of the things that were sold, And laid them down at the apostles' feet: and distribution was made unto every man according as he had need."
    — Acts 4:32-35

Observe the structural elements:
    1. Voluntary commitment — "all that believed" chose to participate
    2. Common trust holding — "neither said any that ought of the things which he possessed was his own"
    3. Asset contribution — "sold their possessions and goods"
    4. Centralized administration — "laid them down at the apostles' feet"
    5. Need-based distribution — "distribution was made unto every man according as he had need"
    6. Zero poverty — "neither was there any among them that lacked"

This was not primitive communism — participation was voluntary (Acts 5:4 — "Whiles it remained, was it not thine own?"), governance was by appointed authority (not mob rule), and the motivation was covenant love, not state coercion. It was, in every structural sense, a trust — with the apostles as trustees, the believers as beneficiaries, and the teaching of Christ as the charter.

The Ecclesia Basilikos Trust implements this same model through modern legal instruments, providing the constitutional and legal protections necessary to operate such a community in the twenty-first century.`,
      },
      {
        title: "B. Koinonia (κοινωνία) — Fellowship as Economic Partnership",
        content: `The Greek word koinonia, routinely translated as "fellowship" in English Bibles, carries a meaning far richer and more economically substantial than the modern church typically recognizes.

In classical and koine Greek, koinonia denotes:

    • Joint participation — a sharing in common resources and responsibilities
    • Partnership — a business or economic relationship of mutual investment and mutual benefit
    • Community of goods — the holding of property in common trust
    • Contribution — active participation in a shared enterprise

    "And they continued stedfastly in the apostles' doctrine and koinonia..."
    — Acts 2:42

    "God is faithful, by whom ye were called unto the koinonia of his Son Jesus Christ our Lord."
    — 1 Corinthians 1:9

    "The grace of the Lord Jesus Christ, and the love of God, and the koinonia of the Holy Ghost, be with you all."
    — 2 Corinthians 13:14

When Paul uses the term in economic contexts, the meaning is unmistakable:

    "For it hath pleased them of Macedonia and Achaia to make a certain koinonia for the poor saints which are at Jerusalem."
    — Romans 15:26 (where "contribution" translates koinonia)

    "Distributing to the necessity of saints; given to hospitality."
    — Romans 12:13 (where "distributing" translates koinoneo — the verb form)

In the early church, koinonia was not a Wednesday night potluck or a Sunday greeting — it was the economic operating system. Members contributed assets, labor, skills, and financial resources into a common pool administered by the apostles and later by appointed elders and deacons. The trust ecosystem's Beneficial Unit structure, commune organization, and shared treasury directly implement this koinonia pattern.

The modern church has spiritualized koinonia into a feeling of togetherness while emptying it of its economic substance. The trust economy restores its full meaning: genuine spiritual fellowship expressed through genuine economic solidarity.`,
      },
      {
        title: "C. The Storehouse Principle — Centralized Treasury",
        content: `The Treasury Trust implements the biblical storehouse principle — the concept of a centralized repository that receives contributions and distributes according to community need:

    "Bring ye all the tithes into the storehouse, that there may be meat in mine house, and prove me now herewith, saith the LORD of hosts, if I will not open you the windows of heaven, and pour you out a blessing, that there shall not be room enough to receive it."
    — Malachi 3:10

In the early church, the apostles' governance served as the storehouse:

    "And laid them down at the apostles' feet: and distribution was made unto every man according as he had need."
    — Acts 4:35

As the community grew, this function was formalized through the appointment of deacons:

    "Wherefore, brethren, look ye out among you seven men of honest report, full of the Holy Ghost and wisdom, whom we may appoint over this business. But we will give ourselves continually to prayer, and to the ministry of the word."
    — Acts 6:3-4

The Treasury Trust mirrors this structure precisely:
    • 50% of every member contribution flows into the centralized treasury
    • The Financial Trustee manages allocation, distribution, and investment into productive assets
    • The protector council provides oversight (equivalent to apostolic accountability)
    • Distribution is made according to community need and governance policy
    • The treasury maintains reserves for emergencies, expansion, and benevolence

The phrase "that there may be meat in mine house" indicates that the storehouse is not merely a savings account — it is the provisioning system for the entire community. The Treasury Trust functions identically: receiving, holding, and distributing the resources necessary to sustain the community's life and mission.`,
      },
      {
        title: "D. Jubilee Economics — Structural Prevention of Inequality",
        content: `The most radical economic provision in all of scripture is the Year of Jubilee:

    "And ye shall hallow the fiftieth year, and proclaim liberty throughout all the land unto all the inhabitants thereof: it shall be a jubile unto you; and ye shall return every man unto his possession, and ye shall return every man unto his family."
    — Leviticus 25:10

    "The land shall not be sold for ever: for the land is mine; for ye are strangers and sojourners with me."
    — Leviticus 25:23

    "And if thy brother be waxen poor, and fallen in decay with thee; then thou shalt relieve him: yea, though he be a stranger, or a sojourner; that he may live with thee. Take thou no usury of him, or increase: but fear thy God; that thy brother may live with thee."
    — Leviticus 25:35-36

The Jubilee system incorporated three structural mechanisms:
    1. Land return — every fifty years, land reverted to its original family allocation, preventing permanent dispossession
    2. Debt release — all debts were cancelled, preventing generational debt bondage
    3. Servant liberation — indentured servants were freed and restored to their families and property

These mechanisms were designed to prevent the very dynamics that define modern capitalism: permanent land concentration, compounding debt, and the creation of a permanent underclass.

The trust structure implements jubilee economics structurally — not as a periodic correction, but as a permanent condition:

    • Land is held in trust perpetually and can never be sold, mortgaged, or alienated (implementing Leviticus 25:23 permanently)
    • No usury means no compounding debt, eliminating the need for periodic debt release
    • Beneficial Units are non-transferable, preventing the accumulation of economic interest that jubilee was designed to reset
    • Housing cannot be foreclosed, seized, or lost to debt — members cannot be dispossessed
    • The equal beneficial interest structure ensures that no member's economic standing drifts permanently above or below others

Where ancient Israel needed a periodic jubilee to correct the drift toward inequality, the trust structure prevents that drift from ever occurring. The jubilee is not an event — it is the permanent condition of the covenant economy.`,
      },
      {
        title: "E. Five-Fold Ministry Governance & the Elder-Deacon Structure",
        content: `The early church did not organize itself as a corporation with a CEO and board of directors. It was governed by a complementary structure of apostolic ministry and local administration:

    "And he gave some, apostles; and some, prophets; and some, evangelists; and some, pastors and teachers; For the perfecting of the saints, for the work of the ministry, for the edifying of the body of Christ."
    — Ephesians 4:11-12

Each role serves a distinct function in the governance ecosystem, and each maps directly to a trust structure role:

    Apostle — Foundational authority and strategic direction
    → Maps to: Grantor/Settlor — establishes the charter and foundational purpose

    Prophet — Discernment, correction, and protection of covenant integrity
    → Maps to: Protector Council — veto power over charter violations, oversight

    Evangelist — Outreach, growth, and new territory
    → Maps to: Enterprise Trust — expansion, external engagement, revenue generation

    Pastor — Shepherding, care, and relational stewardship
    → Maps to: Chapter/Commune Steward — local community leadership and pastoral care

    Teacher — Education, training, and the transmission of knowledge
    → Maps to: Guild/Education systems — skill development, discipleship, formation

This is complemented by the elder-deacon administrative structure:

    "Let the elders that rule well be counted worthy of double honour, especially they who labour in the word and doctrine."
    — 1 Timothy 5:17

    "Likewise must the deacons be grave, not doubletongued, not given to much wine, not greedy of filthy lucre; Holding the mystery of the faith in a pure conscience."
    — 1 Timothy 3:8-9

Elders govern — setting policy, resolving disputes, and providing spiritual oversight. Deacons serve — managing practical operations, financial administration, and community logistics. The trust ecosystem mirrors this with the separation between the governance trust (elder function) and the operational trusts (diaconal function).

The mapping of the nine-layer trust architecture to early church structure:

    Charter Trust → Apostolic foundation (Ephesians 2:20)
    Governance Trust → Apostolic-elder administration (Acts 6:2-4)
    Operational Trusts → Diaconal service arms (Acts 6:3)
    PMA → The ecclesia assembly (Matthew 16:18)
    Digital Platform → The community record and testimony (Revelation 20:12)
    Chapters → Local churches (Acts 14:23 — "ordained elders in every church")
    Communes → House churches (Romans 16:5 — "the church that is in their house")
    Guilds → Gift-based working groups (1 Corinthians 12:28)
    Beneficiaries → Joint heirs (Romans 8:17 — "heirs of God, and joint-heirs with Christ")`,
      },
      {
        title: "F. Provisions for the Vulnerable — Widow, Orphan & Stranger",
        content: `Scripture mandates comprehensive economic provision for the vulnerable — not as optional charity, but as structural obligation:

    "At the end of three years thou shalt bring forth all the tithe of thine increase the same year, and shalt lay it up within thy gates: And the Levite, (because he hath no part nor inheritance with thee,) and the stranger, and the fatherless, and the widow, which are within thy gates, shall come, and shall eat and be satisfied."
    — Deuteronomy 14:28-29

    "Pure religion and undefiled before God and the Father is this, To visit the fatherless and widows in their affliction, and to keep himself unspotted from the world."
    — James 1:27

    "When thou cuttest down thine harvest in thy field, and hast forgot a sheaf in the field, thou shalt not go again to fetch it: it shall be for the stranger, for the fatherless, and for the widow."
    — Deuteronomy 24:19

    "Ye shall not afflict any widow, or fatherless child. If thou afflict them in any wise, and they cry at all unto me, I will surely hear their cry."
    — Exodus 22:22-23

The trust economy builds care for the vulnerable into its very structure — not as a charitable afterthought, but as a foundational design principle:

    • The Housing Trust ensures no member is without shelter, regardless of their economic productivity
    • The Treasury Trust provides for those unable to fully contribute due to age, disability, or circumstance
    • The Beneficial Unit guarantees equal interest to every covenant member — the widow's unit carries the same weight as the laborer's
    • The PMA's covenant obligation of mutual care creates social accountability for the welfare of every member
    • Agricultural operations include gleaning provisions — surplus is distributed to those in need before it enters the general treasury
    • Benevolence provisions are embedded in each operational trust, not dependent on discretionary generosity

The modern welfare state attempts to accomplish through taxation and bureaucratic redistribution what the covenant community accomplishes through structural design. The difference: the trust structure provides dignity, relationship, and mutual accountability; the welfare state provides checks, case numbers, and means-tested humiliation.`,
      },
    ],
  },
  {
    id: "melchizedek",
    number: "IV",
    title: "The Melchizedek Order — Priesthood, Kingship & Economic Authority",
    icon: Crown,
    content: `The theological and jurisdictional foundation of the Ecclesia Basilikos Trust rests upon one of the most profound and least understood doctrines in scripture: the Order of Melchizedek. This section establishes why this ancient priesthood is the authoritative basis for the trust economy and how it distinguishes the covenant community from both the Babylonian commercial system and the Levitical religious system.`,
    subsections: [
      {
        title: "A. Melchizedek — The Original Priest-King",
        content: `Melchizedek appears in scripture with startling abruptness and profundity:

    "And Melchizedek king of Salem brought forth bread and wine: and he was the priest of the most high God. And he blessed him, and said, Blessed be Abram of the most high God, possessor of heaven and earth: And blessed be the most high God, which hath delivered thine enemies into thy hand. And he gave him tithes of all."
    — Genesis 14:18-20

Note the extraordinary characteristics:
    1. He is simultaneously king and priest — a combination explicitly forbidden under the Levitical system (the tribe of Judah rules, Levi serves the temple)
    2. He is king of Salem (peace) and his name means "king of righteousness" — his authority is inherent, not granted by any state
    3. He has no recorded genealogy, beginning, or end — "Without father, without mother, without descent, having neither beginning of days, nor end of life; but made like unto the Son of God; abideth a priest continually" (Hebrews 7:3)
    4. Abraham — the father of the covenant people — paid tithes to him, establishing Melchizedek's superior authority
    5. He is priest of "the most high God, possessor of heaven and earth" — his jurisdiction is universal, not tribal or national

The book of Hebrews devotes three chapters (5-7) to establishing that Christ's priesthood is "after the order of Melchizedek" — not after the order of Aaron/Levi. This distinction is not incidental; it is the theological hinge upon which the entire new covenant economy turns.`,
      },
      {
        title: "B. Three Orders — Shadow, Counterfeit & Fulfillment",
        content: `Scripture presents three distinct economic-priestly orders, and understanding the relationship between them is essential to grasping the trust economy's foundation:

    THE LEVITICAL ORDER (SHADOW)
    • Established at Sinai as a temporary, pedagogical system
    • Animal sacrifices pointing forward to Christ's atoning work
    • Tithes supported the temple service and the Levitical tribe
    • Territorial — limited to Israel and the land covenant
    • Genealogical — only descendants of Aaron could serve as priests
    • Impermanent — "For the priesthood being changed, there is made of necessity a change also of the law" (Hebrews 7:12)

    THE BABYLONIAN ORDER (COUNTERFEIT)
    • Emerged from Nimrod's rebellion (Genesis 10:8-10) and the Tower of Babel
    • Substitutes debt-money for honest weights and measures
    • Replaces tithes to God's storehouse with taxes to the state treasury
    • Creates legal fictions (corporate persons) to extract from living souls
    • Fractional reserve banking mirrors the fractional authority of the counterfeit priesthood
    • Centralizes power in banking cartels that function as a priesthood of money
    • Produces bondage — "The borrower is servant to the lender" (Proverbs 22:7)

    THE MELCHIZEDEK ORDER (FULFILLMENT)
    • Christ is the eternal high priest "after the order of Melchizedek" (Hebrews 6:20)
    • Believers are "a royal priesthood, an holy nation, a peculiar people" (1 Peter 2:9)
    • Combines priestly (spiritual) and kingly (governmental/economic) authority
    • Universal jurisdiction — not limited to any tribe, nation, or territory
    • Eternal — "Thou art a priest for ever after the order of Melchizedek" (Hebrews 7:17)
    • Produces liberty — "If the Son therefore shall make you free, ye shall be free indeed" (John 8:36)

The trust economy operates under the Melchizedek order — the only priesthood that legitimately combines spiritual authority with economic governance, that is not limited by genealogy or geography, and that derives its legitimacy not from human institution but from divine appointment.

The Babylonian system counterfeits every element of divine order: where God establishes covenant, Babylon substitutes contract; where God establishes stewardship, Babylon substitutes ownership; where God establishes the storehouse, Babylon substitutes the central bank; where God establishes lawful money (honest weights and measures), Babylon substitutes debt-based fiat currency created from nothing.`,
      },
      {
        title: "C. Royal Priesthood — The Economic Implications of 1 Peter 2:9",
        content: `The declaration that believers are "a royal priesthood" is not merely a devotional affirmation — it is a jurisdictional claim with direct economic consequences:

    "But ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people; that ye should shew forth the praises of him who hath called you out of darkness into his marvellous light."
    — 1 Peter 2:9

    "And hath made us kings and priests unto God and his Father; to him be glory and dominion for ever and ever."
    — Revelation 1:6

    "And hast made us unto our God kings and priests: and we shall reign on the earth."
    — Revelation 5:10

If believers are indeed kings and priests after the order of Melchizedek — the order that predates and supersedes both the Levitical system and the Babylonian counterfeit — then they possess inherent authority to:

    1. Govern their own affairs — "we shall reign on the earth" implies governmental authority, not mere spiritual sentiment
    2. Organize their own economy — the priestly function includes the administration of tithes, offerings, and the storehouse
    3. Establish their own jurisdiction — "a holy nation" implies sovereignty, laws, and boundaries
    4. Issue their own instruments of value — the Melchizedek priesthood's authority over "bread and wine" (the elements of communion and sustenance) implies authority over the material provisions of the community

The trust economy is the exercise of this royal priestly authority in the economic sphere. The PMA is the legal vehicle through which the "holy nation" organizes itself. The trust structure is the governance framework through which "kings and priests" administer the resources entrusted to them. The internal ledger is the mechanism through which value is exchanged within the jurisdiction of the royal priesthood.

This is not a claim to exemption from civil law — it is the affirmative exercise of constitutionally protected rights to religious assembly, private association, and self-governance within a covenant community.`,
      },
    ],
  },
  {
    id: "trust-law",
    number: "V",
    title: "Trust Law — Historical Origins & Modern Application",
    icon: Landmark,
    content: `Trust law is the oldest, most resilient, and most protective legal framework in the common law tradition. Understanding its origins and principles is essential to understanding why the trust structure — rather than corporate, partnership, or cooperative forms — is the appropriate legal vehicle for the covenant economy.`,
    subsections: [
      {
        title: "A. Historical Origins — The Use & the Crusades",
        content: `The trust (originally called the "use") emerged in medieval England as a mechanism for landowners departing on the Crusades to place their estates in the care of a trusted friend or associate for the benefit of their families. The landowner (grantor/settlor) would convey legal title to a trusted holder (trustee) with instructions to manage the land for the benefit of the landowner's wife, children, or other specified persons (beneficiaries).

This arrangement proved so useful that it was rapidly adopted for a wide variety of purposes:
    • Protection of family wealth from creditors and political enemies
    • Provision for minor children and widows
    • Charitable endowments for churches, hospitals, and schools
    • Circumvention of feudal inheritance restrictions (primogeniture)
    • Protection of assets during times of political instability

The trust proved remarkably resistant to legislative attack. When Henry VIII attempted to abolish uses through the Statute of Uses (1536), lawyers immediately developed the "use upon a use" (trust upon a trust), which the courts of equity recognized and enforced. The trust has survived every subsequent attempt to limit or abolish it because it rests on the most fundamental principles of equity: that a person who holds property for the benefit of another is bound in conscience to honor that obligation.

Key legal principles established over centuries:
    1. The trust is not a legal entity — it is a relationship. It has no separate legal personality, which means it cannot be "regulated" the way a corporation can
    2. Trust property is separate from the trustee's personal property — creditors of the trustee cannot reach trust assets
    3. Trust property is separate from the beneficiary's personal property — creditors of the beneficiary generally cannot reach trust assets either
    4. The trust's terms are set by the grantor and cannot be altered by either the trustee or the beneficiaries unless the trust instrument specifically allows it
    5. The trustee has a fiduciary duty — the highest duty recognized in law — to act solely in the interest of the beneficiaries`,
      },
      {
        title: "B. The Express Trust — Structure & Legal Protections",
        content: `The Ecclesia Basilikos Trust is structured as an express trust — a trust deliberately created by a grantor through a written trust instrument (declaration of trust), as distinguished from trusts that arise by operation of law (constructive and resulting trusts).

The express trust provides several critical legal protections:

    1. ASSET PROTECTION
    Trust property is held in the name of the trustee, not in the names of the beneficiaries. This means:
    • Personal creditors of individual members cannot attach trust assets
    • Divorce proceedings of individual members do not divide trust property
    • Bankruptcy of individual members does not affect trust holdings
    • Judgments against individual members do not create liens on trust property

    2. PERPETUAL EXISTENCE
    Unlike corporations or partnerships, trusts can be structured for perpetual existence:
    • The trust survives the death, incapacity, or withdrawal of any individual trustee or beneficiary
    • Successor trustees are appointed according to the trust instrument
    • The trust corpus remains intact across generations
    • The community's assets are never "distributed" through estate probate

    3. PRIVACY
    Trust agreements are private documents. Unlike corporate articles of incorporation or partnership agreements:
    • The trust instrument is not filed with any government agency (in most jurisdictions)
    • Beneficiary identities are not public record
    • Internal financial records are not subject to public disclosure requirements
    • The terms of the trust are known only to the parties

    4. FLEXIBILITY
    The trust instrument can specify virtually any arrangement the grantor desires:
    • Governance structure (appointment and removal of trustees)
    • Distribution policies (how, when, and to whom benefits are distributed)
    • Investment policies (what assets the trust may hold)
    • Amendment provisions (how the trust terms may be modified)
    • Dispute resolution procedures (private mediation rather than litigation)

    5. CONSTITUTIONAL PROTECTIONS
    When combined with PMA structure and ecclesiastical authority:
    • First Amendment protection of religious assembly and practice
    • Fourteenth Amendment due process protections for private property
    • Freedom of contract protections for voluntary private agreements
    • State constitutional protections for freedom of association`,
      },
      {
        title: "C. The Irrevocable Trust — Permanence & Protection",
        content: `The Ecclesia Basilikos Trust is structured as irrevocable — meaning that once established, its fundamental terms, purposes, and charter principles cannot be unilaterally changed by any party:

    • The grantor cannot reclaim the assets or change the foundational purpose
    • The trustee cannot modify the charter principles, only administer within them
    • The beneficiaries cannot vote to dissolve the trust and divide the assets
    • No temporary administrator, no economic pressure, and no political influence can alter the charter's core commitments

This irrevocability is a feature, not a limitation. It provides:

    1. CONSTITUTIONAL STABILITY — The economic "rules of the game" are fixed by covenant, not subject to the shifting preferences of majorities or the pressures of market conditions. Members can plan their lives within a stable framework.

    2. CREDITOR PROTECTION — Irrevocable trusts provide the strongest asset protection available in law. Assets properly transferred to an irrevocable trust are generally beyond the reach of the grantor's creditors and, in many cases, the beneficiaries' creditors as well.

    3. GENERATIONAL CONTINUITY — The trust's purpose endures across generations. The community being built is not a temporary arrangement dependent on the charisma or commitment of its founders — it is a permanent institution designed to serve future generations who will inherit the covenant.

    4. PROTECTION FROM INTERNAL CORRUPTION — Even if a trustee or group of members becomes unfaithful to the covenant's principles, they cannot alter the charter. The protector council has authority to remove and replace trustees, but neither the protector council nor the trustee can change the foundational terms. This prevents the gradual institutional drift that destroys most organizations over time.`,
      },
      {
        title: "D. The Unincorporated Business Organization Trust (UBOT)",
        content: `The operational entities within the trust ecosystem may be structured as Unincorporated Business Organization Trusts (UBOTs) — a specialized trust form that combines the asset protection and privacy of a trust with the operational flexibility of a business entity.

The UBOT structure offers specific advantages for community enterprises:

    1. OPERATIONAL FLEXIBILITY — UBOTs can conduct business, hold bank accounts, enter contracts, and engage in commerce while maintaining the trust's legal protections
    2. PASS-THROUGH TREATMENT — Unlike corporations, UBOTs do not create a separate taxable entity; income passes through to the trust level
    3. NO STATE REGISTRATION — UBOTs are created by private trust instrument, not by filing with a state agency
    4. MULTIPLE CLASSES OF INTEREST — UBOTs can issue different types of beneficial interests for different purposes (operational participation, profit sharing, etc.)
    5. MANAGMENT FLEXIBILITY — The trust instrument can specify virtually any management structure appropriate to the enterprise

Within the trust ecosystem, each operational trust (Land Trust, Housing Trust, Treasury Trust, Enterprise Trust) may utilize UBOT structures for specific activities that require commercial engagement with the external economy while maintaining the overall trust framework's protections.`,
      },
    ],
  },
  {
    id: "pma",
    number: "VI",
    title: "The Private Membership Association — Constitutional Foundations",
    icon: Users,
    content: `The Private Membership Association (PMA) is the constitutional vehicle through which the trust economy's participants organize their private affairs, exercise their rights of association, and establish the jurisdictional boundary between internal covenant governance and external statutory regulation.`,
    subsections: [
      {
        title: "A. Constitutional Basis — First & Fourteenth Amendments",
        content: `The right to form private associations is among the most firmly established constitutional protections in American jurisprudence:

    FIRST AMENDMENT:
    "Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble, and to petition the Government for a redress of grievances."

    FOURTEENTH AMENDMENT:
    "No State shall make or enforce any law which shall abridge the privileges or immunities of citizens of the United States; nor shall any State deprive any person of life, liberty, or property, without due process of law."

The Supreme Court has consistently recognized the right of private associations to govern their own internal affairs:

    • The freedom to associate for purposes of engaging in activities protected by the First Amendment is an "indispensable" liberty (NAACP v. Alabama, 357 U.S. 449, 1958)
    • Private associations have the right to determine their own membership criteria, internal rules, and governance structures
    • The state's power to regulate is at its lowest ebb when it seeks to intrude into the internal affairs of voluntary associations exercising First Amendment freedoms

The PMA structure for the trust economy is not a legal "trick" or loophole — it is the direct exercise of constitutionally protected rights by free people choosing to organize their economic lives according to covenant principles within a voluntary private association.`,
      },
      {
        title: "B. The PMA Covenant Agreement — Gateway to the Trust Economy",
        content: `Every member of the trust economy enters through the PMA covenant agreement — a comprehensive private contract that establishes the terms of membership, the rights and obligations of participation, and the jurisdictional framework for internal economic activity.

The covenant agreement addresses:

    1. VOLUNTARY ENTRY — Membership is entirely voluntary. No one is compelled to join, and members may withdraw according to specified procedures. Voluntariness is the constitutional prerequisite for private jurisdiction.

    2. COVENANT COMMITMENTS — Members commit to:
        • Active stewardship participation (contribution of labor, skills, or resources)
        • Adherence to charter principles in all internal transactions
        • Good faith participation in community governance
        • Mutual care and accountability with fellow covenant members
        • Honest dealing and transparent record-keeping
        • Covenant mediation (not litigation) for dispute resolution

    3. BENEFICIAL INTEREST — Upon signing, each member is issued one Beneficial Unit representing their equal, undivided interest in the trust corpus

    4. PRIVATE JURISDICTION — All member-to-member transactions within the PMA are private contractual exchanges, governed by the covenant agreement and trust instruments rather than commercial statutory codes

    5. WITHDRAWAL PROVISIONS — Members who choose to leave forfeit their Beneficial Unit (which returns to the trust corpus) but retain any personal property they brought into the association

    6. COVENANT DISCIPLINE — The agreement specifies procedures for addressing breaches of covenant, including mediation, restoration, and — in extreme cases — termination of membership by the protector council`,
      },
      {
        title: "C. 508(c)(1)(A) vs. 501(c)(3) — Tax-Exempt Status & Sovereignty",
        content: `A critical distinction in the trust economy's legal structure concerns the source and nature of its tax-exempt status:

    501(c)(3) ORGANIZATION:
    • Tax exemption is granted by the IRS — a privilege that can be revoked
    • The organization must apply for and receive IRS determination
    • The IRS has authority to audit, regulate, and define the organization's "charitable" activities
    • Political speech and advocacy are restricted
    • The organization is effectively a creature of the tax code — its freedom is bounded by IRS interpretation
    • This represents a covenant with Caesar — trading sovereignty for tax benefits

    508(c)(1)(A) ORGANIZATION:
    • Tax exemption is recognized by law as inherent — not granted by the IRS
    • Churches, their integrated auxiliaries, and conventions or associations of churches are automatically exempt under IRC §508(c)(1)(A)
    • No application to the IRS is required
    • No IRS determination letter is necessary
    • The organization is not subject to the same regulatory constraints as 501(c)(3) entities
    • This preserves the ecclesia's inherent sovereignty under the First Amendment

The Ecclesia Basilikos Trust operates under the 508(c)(1)(A) framework — recognizing that the ecclesia's right to organize and conduct its affairs (including economic affairs) is inherent in its nature as a religious assembly, not a privilege granted by the taxing authority. This is not tax evasion — it is the exercise of a recognized legal status that predates the income tax and is rooted in the constitutional separation of church and state.

The difference is not merely technical — it is jurisdictional. A 501(c)(3) organization has voluntarily submitted to IRS oversight in exchange for tax benefits. A 508(c)(1)(A) assembly retains its inherent sovereignty and simply operates within the recognition that the law itself provides.`,
      },
    ],
  },
  {
    id: "architecture",
    number: "VII",
    title: "Trust Architecture — The Nine Layers",
    icon: Layers,
    content: `The trust economy is structured as a hierarchical ecosystem with nine distinct layers. Each layer serves a specific, irreplaceable function, and together they form a complete economic body capable of sustaining a community across generations. The architecture is designed so that no single layer holds both economic and governance power — separation of powers is structural, not merely policy.`,
    subsections: [
      {
        title: "Layer 1: Covenant Charter (Constitutional Root)",
        content: `The Charter is the foundational declaration — the "constitution" of the entire trust ecosystem. It is the document from which all authority, all sub-trusts, and all economic activity derive their legitimacy.

The Charter establishes:
    • The covenant purpose and mission of the trust ecosystem
    • The divine and constitutional legal basis for the community's existence
    • The irrevocable nature of the trust — its terms cannot be changed by any party
    • The authority structure from which all sub-trusts derive their legitimacy
    • The foundational economic principles (no usury, stewardship not ownership, equal beneficial interest)
    • The rights and protections guaranteed to all covenant members
    • The purposes for which trust assets may be used
    • The procedures for creating new sub-trusts and organizational entities

All economic authority flows downward from this charter. No entity in the ecosystem — not the trustee, not the protector council, not the membership assembly — can operate in contradiction to the charter's principles. This provides constitutional stability: the economic rules cannot be changed by temporary administrators, market pressures, or even a majority vote of members.

The Charter functions as the supreme law of the internal economy. All contracts, agreements, transactions, governance decisions, and administrative actions within the ecosystem must conform to charter principles. Any action that violates the charter is void — not merely voidable, but void from inception.

This permanence is modeled on the covenant faithfulness of God: "My covenant will I not break, nor alter the thing that is gone out of my lips" (Psalm 89:34).`,
      },
      {
        title: "Layer 2: Governance Trust (Ecclesia Basilikos Trust)",
        content: `The governance trust is the administrative anchor of the entire ecosystem. It serves as the central coordinating body that translates the charter's principles into operational policy and practice.

The governance trust has two functionally separated arms:

    ASSET STEWARDSHIP ARM
    • Manages and oversees the operational trusts (land, housing, treasury, enterprise)
    • Sets economic policy (contribution rates, distribution formulas, investment priorities)
    • Authorizes the creation of new sub-trusts and operational entities
    • Appoints trustees for each operational sub-trust (e.g., the Financial Trustee for the Treasury Trust)
    • Conducts strategic economic planning for the ecosystem

    COMMUNITY GOVERNANCE ARM
    • Manages the PMA and member relations
    • Oversees membership enrollment and covenant administration
    • Coordinates community governance assemblies
    • Manages the protector council process
    • Handles covenant discipline and restoration procedures

Neither arm controls the other. This separation of powers prevents the concentration of both economic and social authority in one body — a structural safeguard against the corruption that inevitably accompanies unchecked power.

Oversight is provided by the Protector Council:
    • Cannot make day-to-day operational decisions
    • CAN veto any decision that violates the charter
    • Reviews annual budgets, treasury reports, and major expenditures
    • Approves creation of new sub-trusts and strategic initiatives
    • Adjudicates disputes that cannot be resolved at lower levels
    • Members are selected for wisdom, integrity, and covenant commitment — not wealth or political influence
    • Has authority to remove and replace trustees for breach of fiduciary duty`,
      },
      {
        title: "Layer 3: Operational Trusts (Asset Stewardship)",
        content: `The operational layer consists of four specialized sub-trusts, each holding and administering a specific category of community assets. Together, they encompass the full spectrum of economic life:

    ═══ LAND TRUST ═══
    • Holds all real property: agricultural land, homesteads, community facilities, undeveloped parcels
    • Land can never be sold, mortgaged, or alienated — it is held in perpetuity for the community
    • Members receive beneficial use rights, not ownership deeds — stewardship assignments based on productive use and community need
    • Prevents land speculation, gentrification, displacement, and the concentration of real property
    • Implements Leviticus 25:23: "The land shall not be sold for ever: for the land is mine"
    • All improvements to land belong to the trust, not to individual members

    ═══ HOUSING TRUST ═══
    • Manages all residential structures built on trust land
    • Members are assigned housing based on family size, need, and availability
    • Maintenance is a community responsibility funded by the treasury
    • No rent in the conventional sense — members contribute labor or value in exchange for beneficial use
    • Housing cannot be foreclosed, seized, or lost to debt — members cannot be made homeless
    • New construction is funded by the treasury and built by community labor (guild coordination)
    • Members who leave the community vacate housing but are not displaced without process

    ═══ TREASURY TRUST ═══
    • Managed by the Financial Trustee — a delegable fiduciary role responsible for all treasury operations
    • The Financial Trustee has authority to invest treasury funds into assets including cryptocurrency, precious metals, productive enterprises, and other stores of value
    • 50% of every member contribution is allocated to the Treasury Trust for long-term stewardship
    • Manages all financial assets, liquid reserves, and the internal accounting system
    • Receives contributions from: enterprise profits, member contributions (50% allocation), external donations, asset appreciation
    • Distributes funds according to governance policy: operational budgets, emergency reserves, expansion capital, benevolence
    • Operates the internal ledger system for member-to-member value exchange
    • Maintains reserves for emergencies, community projects, and expansion into new chapters
    • May hold precious metals, cryptocurrency, productive assets, or other stores of value as directed by the Financial Trustee under governance policy
    • Provides financial reporting and transparency to all members through the digital platform
    • The Financial Trustee role may be delegated to a qualified successor appointed by governance

    ═══ ENTERPRISE TRUST ═══
    • Holds and operates all community businesses, productive enterprises, and revenue-generating activities
    • Profits flow to the treasury trust, not to individual "owners" — there are no private shareholders
    • Members working in enterprises receive fair compensation through the internal credit system
    • Enterprises are authorized by the governance trust and must align with charter principles
    • Examples: agricultural operations, food processing, workshops, educational services, digital platforms, professional services, skilled trades
    • New enterprises are proposed by guilds or communes and approved by governance based on community need and viability`,
      },
      {
        title: "Layer 4: Private Membership Association (PMA)",
        content: `The PMA is the "people layer" of the economy — the organizational structure through which individual men and women enter into covenant relationship and gain their beneficial interest in the trust ecosystem.

    • Every member voluntarily signs the PMA covenant agreement
    • Membership grants one Beneficial Unit — an equal, undivided interest in all trust assets
    • Members are simultaneously beneficiaries AND stewards (not passive consumers)
    • The PMA provides the constitutional basis for private jurisdiction over internal economic activity
    • All member-to-member transactions are private contractual exchanges within the PMA, not commercial transactions subject to statutory commercial codes

The PMA structure means the internal economy is legally distinct from the external commercial system. Member contributions within the PMA framework differ from "income" in the statutory sense — they are fulfillment of covenant obligations within a constitutionally protected private association.

Membership categories:
    • Active Members — full beneficial interest, full stewardship obligations, full governance participation
    • Associate Members — partial participation (e.g., remote members who contribute but don't reside in a chapter)
    • Covenant Families — household memberships where one Beneficial Unit covers the family unit
    • Elders & Stewards — members who hold governance or administrative responsibilities in addition to their beneficial interest`,
      },
      {
        title: "Layer 5: Digital Platform (Community OS)",
        content: `The digital platform serves as the technological infrastructure — the nervous system — of the covenant economy. Without transparent, accessible, and tamper-evident record-keeping, trust-based economics cannot function at scale.

The platform provides:

    1. INTERNAL LEDGER & ACCOUNTING
    • Real-time tracking of all value flows within the ecosystem
    • Member contribution records and labor credit balances
    • Treasury receipts, allocations, and distributions
    • Enterprise revenue and expense tracking
    • Inter-chapter trade and resource transfer records

    2. MEMBER MANAGEMENT
    • Member profiles, covenant status, and beneficial unit tracking
    • Contribution history and stewardship records
    • Skills inventory and guild memberships
    • Communication, coordination, and project management

    3. PROOF VAULT — CRYPTOGRAPHIC VERIFICATION
    • Timestamped, cryptographically verifiable records of all significant transactions and agreements
    • Digital signatures for covenant documents and administrative actions
    • Immutable audit trail for all trust operations
    • Certificate generation for proof of membership, contribution, and beneficial interest

    4. EDUCATIONAL RESOURCES
    • Courses on trust law, covenant economics, stewardship principles, and practical skills
    • Training materials for new members
    • Guild-specific professional development content
    • Royal Academy curriculum for comprehensive formation

    5. GOVERNANCE TOOLS
    • Community forum for discussion and deliberation
    • Proposal and voting systems for governance decisions
    • Transparency dashboards for treasury and operational reporting
    • Audit log tracking all administrative actions

The platform ensures that every member can verify their beneficial interest, track value flows, participate in governance, and hold administrators accountable — at any time, from any location. Transparency is not optional; it is a structural requirement of the covenant economy.`,
      },
      {
        title: "Layer 6: Geographic Chapters",
        content: `Chapters are the physical manifestation of the covenant economy in specific locations — the places where theory becomes daily life.

    • Each chapter operates in a specific city, region, or rural area
    • Chapters coordinate local land use, housing assignments, enterprise operations, and community services
    • They are authorized by the governance trust and operate under charter principles
    • Each chapter has a steward (local trustee) appointed by the governance trust and accountable to the protector council
    • Chapters can adapt to local conditions (climate, culture, available resources, local law) while maintaining ecosystem-wide standards

A mature chapter includes:
    • Residential housing on trust land
    • Agricultural operations producing food for the community
    • One or more community enterprises generating revenue
    • Educational and formation programs
    • Community worship and governance assemblies
    • Local guilds and functional communes
    • A chapter steward with administrative authority delegated by the governance trust

Chapters are connected through the digital platform, inter-chapter trade, and guild networks — ensuring that the covenant economy operates as a unified ecosystem rather than isolated experiments.`,
      },
      {
        title: "Layer 7: Functional Communities (Communes)",
        content: `Communes are organized around specific productive functions or vocational callings:

    • Farming communes manage agricultural production — crops, livestock, orchting, food preservation
    • Discipleship communes focus on spiritual formation, education, and mentoring
    • Trade communes organize skilled labor — construction, woodworking, metalwork, textiles
    • Service communes provide healthcare, childcare, elder care, counseling
    • Technology communes manage the digital platform, communications, and technical infrastructure
    • Arts communes cultivate music, visual arts, writing, and cultural production

Each commune operates within a chapter but may collaborate across chapters through guild networks. Communes are the primary unit of productive labor in the economy — the places where members actually work together to create the goods and services the community needs.

Commune governance:
    • Each commune has a leader appointed in consultation with the chapter steward
    • Internal organization is flexible — communes adapt their structures to the nature of their work
    • Resource requests go through the chapter steward to the treasury trust
    • Communes report on productivity, resource needs, and member well-being
    • Members may participate in multiple communes based on their skills and the community's needs`,
      },
      {
        title: "Layer 8: Guilds (Cross-Chapter Functional Networks)",
        content: `Guilds operate across all chapters and geographic boundaries, providing professional organization, quality standards, and knowledge transfer for specific trades, skills, or areas of expertise:

    • A carpenter's guild, a medical guild, a technology guild, an agricultural guild, an education guild, etc.
    • Guilds set quality standards, training requirements, certification criteria, and best practices for their domain
    • Members from any chapter may participate based on relevant skills and commitment
    • Guilds facilitate knowledge transfer and skill development across the entire ecosystem
    • Guild masters provide mentorship and apprenticeship programs for developing members

Guilds serve critical economic functions:
    1. QUALITY ASSURANCE — Ensuring that community products and services meet consistent standards regardless of which chapter produces them
    2. PROFESSIONAL DEVELOPMENT — Training new members and developing the skills of existing ones
    3. CROSS-CHAPTER COORDINATION — Enabling chapters to share specialized expertise and collaborate on projects
    4. INNOVATION — Identifying better methods, tools, and approaches and disseminating them across the ecosystem
    5. LABOR MOBILITY — Enabling skilled members to contribute where their expertise is most needed, regardless of their home chapter

The guild system draws directly from medieval craft guilds, which historically provided exactly these functions within their communities — and from the scriptural principle of "every joint supplying" (Ephesians 4:16) within the body.`,
      },
      {
        title: "Layer 9: Beneficiaries & Stewards (Every Member)",
        content: `Every member of the trust ecosystem is both a beneficiary and a steward — this dual role is the fundamental economic innovation of the model.

    AS A BENEFICIARY, each member is entitled to:
    • Beneficial use of trust assets (housing, land access, community services)
    • An equal share of distributed benefits (food, education, healthcare, enterprise output)
    • A voice in community governance
    • Access to the digital platform, educational resources, and community tools
    • Emergency support from the treasury trust
    • The protections of the trust structure (asset protection, privacy, covenant justice)

    AS A STEWARD, each member is obligated to:
    • Contribute labor, skills, or resources to the community through communes, guilds, or enterprises
    • Participate in community governance in good faith
    • Adhere to covenant principles in all internal dealings
    • Support fellow members in need
    • Maintain transparency and honest dealing
    • Submit to covenant discipline when necessary

The relationship is reciprocal, not extractive. No "free riders" — beneficial interest is contingent on active stewardship participation. But this is not wage labor for an employer; it is the joyful contribution of a co-heir to a shared inheritance.

In conventional capitalism, owners extract value from workers. In conventional socialism, the state distributes value to citizens. In the trust economy, every participant is simultaneously a contributor and a recipient — creating a self-reinforcing cycle of value creation and distribution where giving and receiving are the same act viewed from different angles.

This is the atomic unit of the covenant economy: the individual member, made in God's image, holding a Beneficial Unit that represents their equal share in the common inheritance, and contributing their unique gifts to the flourishing of the whole body.`,
      },
    ],
  },
  {
    id: "beneficial-unit",
    number: "VIII",
    title: "The Beneficial Unit — Equal Share Economics",
    icon: Gem,
    content: `The Beneficial Unit is the core mechanism for economic equity within the trust ecosystem — the instrument through which the biblical principle of "neither was there any among them that lacked" (Acts 4:34) is implemented structurally.`,
    subsections: [
      {
        title: "A. Structure & Mechanics",
        content: `Each member who signs the PMA covenant agreement and commits to active stewardship is issued exactly one (1) Beneficial Unit. This unit represents:

    • An equal, undivided beneficial interest in the entire trust corpus — all land, all housing, all treasury assets, all enterprise value
    • The right to beneficial use of trust assets — not ownership, but the equitable right to benefit from assets held in trust
    • A voice in community governance — equal participation in assemblies and decisions
    • A share of distributed benefits — housing, food, services, education, healthcare, emergency support

The mathematical value of each unit is 1/N, where N is the total number of active beneficiaries. As the community grows:
    • Each unit's fractional share of existing assets decreases
    • But the total trust corpus also grows through new member contributions, enterprise productivity, and asset appreciation
    • The net effect is that each member's material provision improves as the community grows — because a larger community produces more, serves more efficiently, and builds greater economic resilience

This is the inverse of the corporate shareholder model, where dilution reduces value. In the trust model, growth increases value for all because the "return" is not financial — it is the abundance of community life.`,
      },
      {
        title: "B. Distribution of Benefits — Access, Not Dividends",
        content: `Benefits are distributed not as cash dividends, but as access to the trust's real assets and services:

    HOUSING
    • Assigned based on family size, need, and availability
    • Members do not "buy" or "rent" housing — they receive it as a trust benefit
    • Assignment changes are managed through governance, not market transactions
    • Maintenance and improvement are community responsibilities

    FOOD & AGRICULTURE
    • Produced by agricultural communes on trust land
    • Distributed through community systems (community kitchens, distribution points, household allotments)
    • Members participate in production according to ability and commune assignment
    • Surplus is stored, preserved, or traded with other chapters

    EDUCATION & FORMATION
    • Courses, mentorship, and training provided through the platform, guilds, and communes
    • All educational resources are available to all members without charge
    • Apprenticeship and professional development through guild programs
    • Children's education organized through education communes

    HEALTHCARE
    • Coordinated through service communes with medical guild members
    • Preventive care, community health, and wellness programs
    • Emergency medical funds maintained by the treasury trust
    • Mutual aid for members facing medical crises

    ENTERPRISE PARTICIPATION
    • Members work in community enterprises and receive fair internal compensation through labor credits
    • Enterprise assignments consider member skills, interests, community need, and guild qualifications
    • Internal compensation is supplementary to the baseline of trust benefits — it rewards additional contribution, not basic survival

    EMERGENCY SUPPORT
    • Treasury reserves provide for members facing unexpected hardship
    • Community mutual aid is a covenant obligation, not discretionary charity
    • No member's beneficial interest is reduced or suspended during periods of genuine inability to contribute

This is not communism — members retain personal property (clothing, personal effects, tools, savings from external income). They can earn additional compensation through enterprise work. They can voluntarily withdraw from the association at any time. The trust provides a floor of dignity and security — not a ceiling on individual development.`,
      },
      {
        title: "C. Non-Transferability, Protection & Permanence",
        content: `Beneficial Units are designed with structural protections that prevent the concentration of economic power:

    NON-TRANSFERABLE — Units cannot be sold, traded, gifted, or speculated upon. No member can accumulate multiple units. No external party can acquire units. The economic playing field remains permanently level.

    NON-ATTACHABLE — Units cannot be seized by external creditors. A judgment against a member in the external legal system cannot reach their beneficial interest in the trust. This protection arises from the fundamental nature of trust law: the beneficial interest is equitable, not legal, and is subject to the trust's terms.

    NON-DIVISIBLE — The unit represents an undivided interest in the whole corpus, not a claim on specific assets. A member cannot demand "their share" of a particular property or asset — their interest is in the aggregate, administered according to governance policy.

    REVOCABLE ONLY BY COVENANT PROCESS — Beneficial interest can be terminated only through:
        1. Voluntary withdrawal by the member
        2. Covenant violation adjudicated by the protector council after due process
        3. Death (with provisions for family transition and continuity)
    No administrative action can unilaterally strip a member of their beneficial interest without covenant process.

    EQUAL — Every unit carries exactly the same weight. There are no "preferred" units, no senior classes, no weighted voting. The member who has been in the community for twenty years holds the same beneficial interest as the member who joined yesterday. This is not merely fairness — it is the structural implementation of Galatians 3:28: "There is neither Jew nor Greek, there is neither bond nor free... for ye are all one in Christ Jesus."`,
      },
    ],
  },
  {
    id: "value-flows",
    number: "IX",
    title: "Value Flows — How the Economy Circulates",
    icon: Coins,
    content: `Understanding how value moves through the ecosystem is essential to understanding why the model works — and why it resists the extractive dynamics of the conventional economy. The trust economy is designed as a closed-loop system that maximizes internal circulation and minimizes value leakage to external parties.`,
    subsections: [
      {
        title: "A. Inflows — Value Entering the System",
        content: `Value enters the trust ecosystem through several channels, each contributing to the growth of the trust corpus and the material provision of the community:

    1. MEMBER CONTRIBUTIONS
    • Initial commitment — upon joining, members may contribute assets, financial resources, labor pledges, or professional expertise
    • Ongoing tithes — members contributing a percentage (traditionally 10%) of any external income to the treasury trust
    • Skills and professional expertise contributed to guilds, communes, and enterprises
    • Time and labor invested in community operations and governance
    • Members who earn income externally during the transitional period bring external value into the internal economy

    2. ENTERPRISE REVENUE
    • Community businesses selling goods and services to the external market
    • Agricultural products sold externally when they exceed internal need
    • Digital platform services — courses, resources, consulting, professional services
    • Skilled trade services provided to external clients by guild members
    • Intellectual property and creative works generated by community members

    3. ASSET APPRECIATION
    • Land value increasing through responsible stewardship and productive development
    • Enterprise growth and increased productive capacity
    • Skill development increasing the community's human capital
    • Infrastructure improvement increasing the utility and value of trust property

    4. DONATIONS & GRANTS
    • External supporters contributing to the community's mission
    • Grants for community development, sustainable agriculture, or education
    • Charitable contributions from individuals or organizations aligned with the trust's purposes
    • In-kind donations of equipment, materials, or supplies

Each inflow channel strengthens the trust corpus and increases the real value backing each Beneficial Unit — unlike the conventional economy where growth often means inflation that erodes individual purchasing power.`,
      },
      {
        title: "B. Internal Circulation — The Covenant Economy in Motion",
        content: `Within the ecosystem, value circulates through the internal ledger — a transparent accounting system that tracks every exchange without requiring external currency:

    1. LABOR CREDITS
    • Members earn internal credits for productive work performed in communes, guilds, or enterprises
    • Credits reflect the real value contributed — measured in labor-hours, output, or service delivery
    • Credits can be used for goods and services within the community that exceed baseline trust benefits
    • Credits are accounting entries reflecting value contributed — they are not "money" in the fiat currency sense
    • The credit system incentivizes contribution without creating the extractive dynamics of wage labor

    2. RESOURCE ALLOCATION
    • The treasury trust allocates funds to operational trusts based on governance policy and community priorities
    • Chapters receive allocations based on population, need, productive capacity, and approved projects
    • Communes and guilds receive project funding through the treasury based on proposals and governance approval
    • Emergency allocations are authorized by the trustee for unexpected needs

    3. INTER-CHAPTER TRADE
    • Chapters with agricultural surplus trade with chapters that produce manufactured goods or provide specialized services
    • Guilds facilitate cross-chapter service delivery and knowledge transfer
    • The internal ledger tracks all inter-chapter flows transparently
    • Trade terms are set by governance policy, not by market negotiation — eliminating the possibility of exploitative pricing between chapters

    4. SERVICE EXCHANGE
    • Members in service communes (healthcare, education, childcare, elder care) provide services to all community members
    • These services are "funded" by the treasury and available to all members as trust benefits
    • No member pays for essential services — they are structural benefits of the covenant community
    • Service quality is maintained through guild standards and accountability

    5. MUTUAL AID
    • Members support each other through informal exchange, neighborly help, and shared resources
    • This informal economy is an essential complement to the formal trust structures
    • It builds relational bonds and reinforces the covenant character of the community`,
      },
      {
        title: "C. Outflows — Minimizing External Leakage",
        content: `The model is designed to minimize the outflow of value to the external economy — not out of isolationism, but because every dollar that leaves the ecosystem is a dollar extracted from the community's common wealth:

    1. ESSENTIAL PURCHASES
    • Goods and services not yet produced internally: fuel, technology hardware, medical supplies, raw materials
    • As the community develops productive capacity, external purchases decrease progressively
    • Bulk purchasing through the treasury reduces per-unit cost
    • Priority is given to sourcing from other covenant communities or aligned suppliers

    2. LAWFUL OBLIGATIONS
    • Any legally required external obligations (property taxes on trust land, licensing fees, etc.) are met honestly and promptly
    • The trust structure lawfully minimizes taxable events through legitimate legal means
    • Internal transactions between PMA members are private contractual exchanges with specific legal characteristics distinct from commercial transactions
    • Full compliance with applicable law — this is not tax evasion, but lawful tax minimization through established legal structures

    3. EXPANSION CAPITAL
    • Acquiring new land for additional chapters
    • Building infrastructure on trust property
    • Launching new enterprises
    • Equipment and tooling for productive capacity
    • These are investments in the trust corpus — outflows that create future inflows

    4. EXTERNAL ENGAGEMENT
    • Community members participating in external education or training
    • Travel for inter-chapter coordination or guild activities
    • Legal and professional services from external providers when internal expertise is insufficient

The goal is an increasing ratio of internal circulation to external leakage — approaching practical self-sufficiency over time. The model does not require or demand complete autarky; it aims for maximum practical independence, reducing the community's vulnerability to external economic disruptions, inflation, and the extractive dynamics of the debt-money system.`,
      },
      {
        title: "D. The Circular Flow — Why the Model Is Self-Reinforcing",
        content: `In the conventional economy, value flows linearly: from worker to employer (labor), from employer to worker (wages, minus profit extracted), from worker to landlord (rent), from worker to bank (interest), from worker to government (taxes). At each step, value is extracted by parties who did not produce it. The worker retains a diminishing fraction of the value they create.

In the trust economy, value flows circularly:

    Member contributes labor → Enterprise produces goods/services
    Enterprise profits flow to → Treasury Trust
    Treasury allocates to → Operational Trusts (land, housing, community services)
    Operational Trusts provide → Benefits to Members
    Members receive benefits → Members are sustained to contribute more labor

At no point in this cycle is value extracted by a non-contributing party. There are no landlords extracting rent, no shareholders extracting profit, no banks extracting interest, no speculators extracting arbitrage. The full value of productive labor circulates within the community, creating a positive feedback loop where greater contribution produces greater community wealth which produces greater member provision which enables greater contribution.

This circularity is the key to the model's sustainability. Conventional economies lose value at every transfer point (rent, interest, taxes, profit extraction, transaction fees). The trust economy retains value at every transfer point because every transfer is internal — from trust to member, from member to trust, from trust to trust. The only value lost is what must be spent externally for goods and services the community cannot yet produce internally — and this loss decreases over time as internal productive capacity grows.`,
      },
    ],
  },
  {
    id: "governance",
    number: "X",
    title: "Economic Governance — Covenant Authority & Accountability",
    icon: Shield,
    content: `Economic governance in the trust ecosystem follows the trust hierarchy — with checks, balances, and separation of powers at every level. The system is designed to prevent the concentration of power that corrupts both conventional corporations and conventional governments.`,
    subsections: [
      {
        title: "A. The Protector Council — Supreme Oversight",
        content: `The Protector Council is the supreme oversight body of the trust ecosystem — analogous to a constitutional court that ensures all actions conform to the charter:

    AUTHORITY:
    • Veto any decision that violates the charter principles
    • Review and approve annual budgets and treasury reports
    • Approve creation of new sub-trusts, chapters, and major capital expenditures
    • Adjudicate disputes that cannot be resolved at lower levels
    • Remove and replace trustees for breach of fiduciary duty
    • Interpret ambiguous charter provisions

    LIMITATIONS:
    • Cannot make day-to-day operational decisions — that authority belongs to the trustee
    • Cannot initiate projects or spending — only approve or deny proposals from the governance trust
    • Cannot change the charter — the charter is irrevocable
    • Cannot act unilaterally — council decisions require supermajority consensus

    COMPOSITION:
    • Members selected for demonstrated wisdom, integrity, and covenant commitment
    • Selection is not by popular vote (which produces political dynamics) but by elder nomination and community affirmation
    • Members serve defined terms with staggered rotation to prevent bloc formation
    • No protector council member may simultaneously hold trustee or steward roles — separation of oversight from operations
    • Not selected for wealth, social status, or political influence — the protector council is a council of sages, not a board of directors`,
      },
      {
        title: "B. The Trustee — Administrative Authority",
        content: `The trustee (whether individual or administrative body) handles the operational management of the trust ecosystem:

    AUTHORITY:
    • Manage treasury allocations and execute approved budgets
    • Authorize routine expenditures within governance-approved parameters
    • Appoint stewards for chapters and approve commune leaders
    • Negotiate external contracts and business relationships
    • Manage the day-to-day operations of the trust ecosystem
    • Report to the protector council with full transparency and regular accounting

    LIMITATIONS:
    • Cannot violate charter principles — all actions must conform to the charter
    • Cannot make major capital expenditures without protector council approval
    • Cannot create new sub-trusts or chapters without governance process
    • Cannot alter distribution policies without governance approval
    • Can be removed by the protector council for breach of fiduciary duty

    ACCOUNTABILITY:
    • Full financial transparency — all transactions recorded on the internal ledger and visible to all members
    • Regular reporting to the protector council on all aspects of trust operations
    • Annual comprehensive audit of all trust accounts
    • Open to member inquiry — any member can request an accounting
    • Subject to the highest fiduciary standard in law: the duty to act solely in the interest of the beneficiaries`,
      },
      {
        title: "C. Local Governance — Chapters, Communes & Guilds",
        content: `Local economic decisions are made at the chapter and commune level, within the framework established by governance policy:

    CHAPTER GOVERNANCE:
    • Chapter stewards manage local budgets within allocations from the treasury
    • Local decisions about housing assignments, land use, and enterprise operations
    • Regular community assemblies for input, discussion, and local consensus-building
    • Stewards are accountable to the governance trust and can be replaced for poor performance

    COMMUNE GOVERNANCE:
    • Commune leaders organize productive labor, resource requests, and internal operations
    • Members participate in commune decisions about work schedules, methods, and priorities
    • Communes operate with significant autonomy within their functional domain
    • Resource requests and budget proposals flow through the chapter steward to the treasury

    GUILD GOVERNANCE:
    • Guild masters set professional standards, training requirements, and quality benchmarks
    • Guilds operate across chapters, providing ecosystem-wide coordination
    • Guild decisions about professional standards are binding on all guild members in all chapters
    • Guilds advise governance on matters within their expertise (e.g., the agricultural guild advises on farming policy)

    DISPUTE RESOLUTION:
    • Disputes are resolved at the lowest possible level — between parties, then commune/guild, then chapter, then governance
    • Covenant mediation is the primary mechanism — not litigation in external courts
    • The protector council serves as the court of last resort for matters that cannot be resolved at lower levels
    • Matthew 18 principles guide the process: private conversation, witnesses, community authority`,
      },
      {
        title: "D. Radical Transparency — The Structural Requirement",
        content: `The covenant economy requires radical transparency — not as a policy preference, but as a structural necessity. Trust-based economics cannot function if trust is not justified by verifiable records:

    ALL FINANCIAL FLOWS ARE RECORDED
    • Every transaction on the internal ledger is recorded with timestamp, parties, amount, and purpose
    • Treasury receipts and distributions are itemized and categorized
    • Enterprise revenue and expenses are tracked in detail
    • Inter-chapter transfers and trade are documented

    ALL RECORDS ARE ACCESSIBLE
    • Any member can view the internal ledger and treasury reports through the digital platform
    • Audit logs track all administrative actions — who did what, when, and why
    • Annual comprehensive reports detail income, expenditure, asset values, distribution, and reserve levels
    • The Proof Vault provides timestamped, cryptographically verifiable records that cannot be altered retroactively

    ACCOUNTABILITY IS STRUCTURAL
    • The protector council reviews all financial records regularly
    • External audit may be conducted periodically for additional assurance
    • Whistle-blower protections ensure that members can raise concerns without retaliation
    • The charter mandates transparency — it cannot be waived by any administrator

This level of transparency is unprecedented in most economic organizations — but it is the norm for the covenant community. "For there is nothing covered, that shall not be revealed; neither hid, that shall not be known" (Luke 12:2). The trust economy operates in the light because it has nothing to hide and everything to prove.`,
      },
    ],
  },
  {
    id: "comparison",
    number: "XI",
    title: "The Two Economies — Babylon vs. Kingdom",
    icon: Building2,
    content: `The following comprehensive comparison illustrates the fundamental, irreconcilable differences between the conventional economic system (operating under what scripture calls "Babylon") and the trust economy (operating under Kingdom principles). These are not merely different policy preferences — they are entirely different operating systems built on incompatible foundations.`,
    subsections: [
      {
        title: "A. Money & Currency",
        content: `    BABYLON — DEBT-BASED FIAT CURRENCY:
    • Every unit of currency enters circulation as debt — a loan from the central bank bearing interest
    • Fractional reserve banking multiplies the money supply by lending money that does not exist
    • Perpetual inflation erodes savings and purchasing power, punishing prudence and rewarding speculation
    • Central banks (private institutions) control monetary policy for banking interests, not public welfare
    • Interest payments flow upward from the productive economy to the financial sector — a perpetual wealth transfer
    • The total debt always exceeds the money supply — mathematical certainty of systemic insolvency
    • "The borrower is servant to the lender" (Proverbs 22:7) — debt-money creates a system of universal financial servitude

    KINGDOM — ASSET-BACKED STEWARDSHIP ACCOUNTING:
    • Internal accounting is backed by real assets, productive output, and demonstrable labor
    • No fractional reserve — every credit represents value that has been created or contributed
    • No inflation — the unit of account is tied to productive output, not to central bank policy
    • Monetary policy is set by covenant governance — the community decides, not distant bankers
    • No interest — value flows circularly through stewardship, not linearly through debt
    • The internal economy is structurally solvent — no debt overhang, no systemic risk
    • "Owe no man any thing, but to love one another" (Romans 13:8) — the covenant economy is debt-free`,
      },
      {
        title: "B. Property & Land",
        content: `    BABYLON — FEE SIMPLE OWNERSHIP:
    • Fee simple "ownership" creates the illusion of absolute ownership, but property remains subject to taxation (perpetual rent to the state), liens, eminent domain, and creditor seizure
    • Real estate speculation inflates housing and land costs far beyond their productive value
    • Ownership concentration creates a landlord class that extracts rent from the productive economy
    • Property is a commodity — bought, sold, leveraged, and speculated upon
    • Foreclosure and eviction are routine mechanisms for transferring wealth from the productive class to the creditor class
    • "The land shall not be sold for ever: for the land is mine" (Leviticus 25:23) — fee simple violates this principle

    KINGDOM — TRUST STEWARDSHIP:
    • All property is held in irrevocable trust — no individual "owns" assets in the conventional sense
    • Trust property is protected from most attachment, creditor claims, and external seizure
    • No speculation — property is valued for its productive use and community benefit, not its market price
    • No landlord class — all members have equal beneficial interest in all trust property
    • Property is stewardship — held for the benefit of the community in perpetuity, never sold or alienated
    • No foreclosure — members cannot lose their housing to debt, creditors, or economic misfortune
    • Implements the permanent jubilee: land can never be concentrated, alienated, or exploited`,
      },
      {
        title: "C. Labor & Compensation",
        content: `    BABYLON — WAGE LABOR:
    • Workers sell their labor to employers for wages — the employer extracts surplus value (profit) from worker productivity
    • The employment relationship is inherently extractive: the worker must produce more value than they receive, or the employer has no reason to hire them
    • Unemployment is a structural feature (not a bug) — it creates desperation that suppresses wages and disciplines the labor force
    • "Benefits" (healthcare, retirement, paid leave) are tied to employment, creating dependency on the employer
    • Labor is treated as a commodity traded in markets — subject to the same dynamics of supply, demand, and price manipulation as any other commodity
    • Automation and outsourcing are used to reduce labor costs, displacing workers without providing alternative livelihoods

    KINGDOM — COVENANT STEWARDSHIP:
    • Members contribute labor as a stewardship obligation — part of their covenant commitment to the community
    • No surplus extraction — all value produced flows to the trust corpus for community benefit, and all members share equally in the benefits
    • Full employment — every member has productive work in communes, guilds, or enterprises. Unemployment is structurally impossible because the community always has work to be done and members to do it
    • All benefits are provided through the trust structure, independent of specific work assignment — housing, food, healthcare, and education are trust benefits, not employer benefits
    • Labor is a calling and contribution — the expression of gifts and skills in service to the community, not a commodity to be bought and sold
    • Automation and efficiency gains benefit the entire community — reducing labor requirements allows more time for formation, rest, creativity, and relationship`,
      },
      {
        title: "D. Governance & Authority",
        content: `    BABYLON — CORPORATE HIERARCHY / STATE BUREAUCRACY:
    • Corporations are governed by boards serving shareholder interests — fiduciary duty is to maximize profit, not human welfare
    • Governments are captured by corporate lobbying and financial influence — policy serves donor interests
    • Centralized authority concentrates power in distant institutions unaccountable to the communities they affect
    • Democratic participation is limited to periodic voting among pre-selected candidates
    • Regulatory capture means the agencies designed to protect the public are controlled by the industries they regulate
    • The legal system serves those who can afford representation — justice is a commodity

    KINGDOM — COVENANT GOVERNANCE:
    • The trust is governed by charter principles — fiduciary duty is to the covenant purpose and the beneficiaries
    • Governance is by appointed stewards selected for wisdom, integrity, and covenant commitment — not wealth or political connection
    • Separation of powers (protector council / trustee / stewards) prevents the concentration of authority
    • All members participate in governance through assemblies, with direct access to stewards and accountability structures
    • Radical transparency ensures that every member can see how resources are managed and hold administrators accountable
    • Covenant mediation provides accessible, relational justice — not adversarial litigation`,
      },
      {
        title: "E. Social Safety & Human Dignity",
        content: `    BABYLON — WELFARE STATE / CHARITABLE DEPENDENCE:
    • Government welfare programs funded by taxation — means-tested, bureaucratic, and humiliating
    • Benefits are minimal — designed to prevent social unrest, not to provide genuine human flourishing
    • Charity is voluntary, inconsistent, and insufficient — dependent on donor generosity and economic conditions
    • Economic crises (recessions, pandemics, market crashes) leave millions without support
    • The "safety net" is reactive — it catches people after they fall, often too late and with lasting damage
    • Poverty is perpetuated by the system that claims to alleviate it — means-testing creates poverty traps, and the stigma of receiving aid discourages participation

    KINGDOM — STRUCTURAL DIGNITY:
    • Universal beneficial interest provides a permanent floor of dignity for all covenant members
    • Housing, food, education, healthcare, and community provided through the trust structure — not as charity, but as right
    • No means-testing — all members receive benefits as co-equal beneficiaries of the trust
    • Self-insurance through treasury reserves, community mutual aid, and diversified enterprise — resilient against external economic shocks
    • The "safety net" is structural — members cannot fall because the floor is built into the system's foundation
    • Dignity is permanent — no member is reduced to begging, applying, or proving their poverty to receive the covenant community's care`,
      },
      {
        title: "F. Identity & Jurisdiction",
        content: `    BABYLON — LEGAL FICTION / STATUTORY JURISDICTION:
    • Citizens are identified by state-issued numbers (SSN, birth certificate) — legal fictions created by and subject to state authority
    • Jurisdiction is determined by domicile, registration, and statutory membership — the state claims authority over those within its borders
    • Rights are "civil rights" — privileges granted by the state, which can be redefined, limited, or revoked by legislation
    • The individual is a "taxpayer" — a revenue unit whose primary legal relationship to the state is the obligation to fund it
    • Privacy is eroding — financial surveillance, data collection, and reporting requirements make private economic activity increasingly difficult

    KINGDOM — LIVING SOUL / COVENANT JURISDICTION:
    • Members are recognized as living men and women made in God's image — their identity and rights are inherent, not state-granted
    • Jurisdiction within the PMA is private and covenant-based — governed by the trust instrument and the PMA agreement
    • Rights are inherent ("endowed by their Creator with certain unalienable Rights") — they exist prior to and independent of any government
    • The individual is a "beneficiary and steward" — their primary relationship is to the covenant community and its divine purpose
    • Privacy is structural — trust law, PMA protections, and constitutional rights provide robust privacy for internal economic activity`,
      },
    ],
  },
  {
    id: "implementation",
    number: "XII",
    title: "Implementation Roadmap",
    icon: ArrowRight,
    content: `The transition from theory to practice follows a disciplined, phased approach — building capacity incrementally while maintaining legal integrity and covenant faithfulness at every stage.`,
    subsections: [
      {
        title: "Phase 1: Foundation (Current Stage)",
        content: `The foundational phase establishes the legal, organizational, and technological infrastructure upon which everything else is built:

    LEGAL FOUNDATIONS:
    • Establish and execute the covenant charter — the constitutional document of the trust ecosystem
    • Create the governance trust with properly appointed trustees and protector council
    • Execute the PMA covenant agreement template for member enrollment
    • Prepare trust instruments for each operational sub-trust (land, housing, treasury, enterprise)
    • Ensure comprehensive legal documentation reviewed by qualified counsel
    • Establish 508(c)(1)(A) recognition and proper ecclesiastical authority

    DIGITAL PLATFORM:
    • Build and deploy the community operating system (courses, forum, proof vault, member management)
    • Implement the internal ledger and accounting system
    • Create the Beneficial Unit tracking and issuance system
    • Establish the Proof Vault for cryptographic record verification
    • Deploy educational content explaining the trust model, covenant principles, and member obligations

    COMMUNITY FORMATION:
    • Begin PMA enrollment and Beneficial Unit issuance for founding members
    • Establish regular community assemblies (virtual and in-person)
    • Launch the Royal Academy curriculum for comprehensive member formation
    • Build covenant relationships through shared study, worship, and mutual commitment
    • Identify potential chapter locations and enterprise opportunities

    GOVERNANCE ESTABLISHMENT:
    • Appoint initial trustees with clear mandate and accountability
    • Establish the protector council with founding members of demonstrated wisdom
    • Create governance procedures for decision-making, reporting, and dispute resolution
    • Implement the audit log and transparency systems`,
      },
      {
        title: "Phase 2: First Chapter — Proof of Concept",
        content: `The second phase establishes the first geographic chapter — demonstrating that the model works in practice, not just in theory:

    LAND ACQUISITION:
    • Acquire first land holdings through the land trust — agricultural land, residential parcels, and community space
    • Ensure all acquisitions are properly titled in the trust's name with clear documentation
    • Conduct due diligence on environmental, zoning, and access considerations

    COMMUNITY ESTABLISHMENT:
    • First resident members move onto trust land and begin community life
    • Establish initial housing (may begin with existing structures, temporary housing, or new construction)
    • Implement daily rhythms of work, worship, and community life
    • Activate the PMA covenant in daily practice — not just on paper

    PRODUCTIVE CAPACITY:
    • Launch first agricultural operations on trust land (garden scale, scaling to farm scale)
    • Establish first community enterprises aligned with member skills and local market opportunities
    • Begin producing food, goods, or services for internal consumption and external revenue
    • Implement the labor credit system for internal compensation

    ORGANIZATIONAL DEVELOPMENT:
    • Establish first functional communes (farming, education, service)
    • Launch guild formation for skill areas represented in the membership
    • Begin inter-member trade and service exchange through the internal ledger
    • Refine governance procedures through practical experience`,
      },
      {
        title: "Phase 3: Network Growth — Multiple Chapters",
        content: `The third phase expands the model beyond a single location into a network of interconnected chapters:

    EXPANSION:
    • Establish additional chapters in strategic locations — considering climate diversity, economic opportunity, and member concentration
    • Each new chapter follows the Phase 2 template adapted to local conditions
    • New chapters are connected to the existing ecosystem through the digital platform, guild networks, and inter-chapter trade

    ECONOMIC MATURATION:
    • Launch guilds for cross-chapter coordination and professional development
    • Expand the enterprise portfolio for broader economic self-sufficiency
    • Develop inter-chapter trade and resource sharing systems
    • Achieve critical mass for internal economic viability — the point at which the internal economy produces a significant share of member needs
    • Begin systematic reduction of dependency on the external economy

    GOVERNANCE SCALING:
    • Refine governance structures for multi-chapter operation
    • Strengthen the protector council with representatives familiar with different chapters
    • Establish regional coordination for groups of nearby chapters
    • Document and codify best practices from early chapters for replication

    RESILIENCE BUILDING:
    • Diversify productive capacity across chapters (agriculture, manufacturing, services, technology)
    • Build treasury reserves sufficient for multi-year operational independence
    • Develop supply chains between chapters for essential goods
    • Establish emergency protocols and mutual aid networks across the ecosystem`,
      },
      {
        title: "Phase 4: Maturity — A Fully Functioning Covenant Economy",
        content: `The fourth phase represents the mature state of the trust economy — a self-sustaining, self-governing, multi-generational community:

    ECONOMIC INDEPENDENCE:
    • Comprehensive internal production covering the majority of member needs — food, housing, education, healthcare, basic manufacturing
    • Robust treasury with reserves for expansion, emergencies, and generational continuity
    • Diversified enterprise portfolio generating sufficient revenue to fund all external purchases and expansion
    • Internal economy that is resilient against external economic disruptions

    GOVERNANCE MATURITY:
    • Proven, time-tested governance model with established succession procedures
    • Multiple generations of protector council and trustee leadership
    • Robust covenant discipline and restoration processes
    • Effective dispute resolution without recourse to external courts

    REPLICATION:
    • Documented, replicable model available for other communities worldwide
    • Training and mentorship programs for communities establishing their own trust economies
    • Network effects: inter-community trade and mutual aid among covenant communities globally
    • The model serves as a living demonstration that covenant economics works

    GENERATIONAL VISION:
    • Children born into the community are formed in covenant principles from birth
    • Young adults choose to affirm the covenant and receive their own Beneficial Units
    • The trust corpus grows across generations — each generation inherits a stronger foundation
    • The community's institutional memory, productive capacity, and covenant culture deepen with time
    • Complete ecosystem from charter to beneficial unit operating at scale — the fully realized vision of Acts 2:42-47 in the modern world`,
      },
    ],
  },
  {
    id: "risks",
    number: "XIII",
    title: "Risks, Challenges & Mitigations",
    icon: Lock,
    content: `Intellectual honesty requires a thorough accounting of the risks and challenges this model faces. The trust economy is ambitious, and the path from vision to reality is fraught with genuine difficulties. This section addresses each major risk category with clear-eyed analysis and specific mitigation strategies.`,
    subsections: [
      {
        title: "A. Legal & Regulatory Risk",
        content: `CHALLENGE: Government agencies may challenge the trust structure, PMA status, tax treatment, or the characterization of internal transactions.

REALITY: The legal landscape for trusts, PMAs, and religious organizations is well-established but not without ambiguity. Aggressive regulatory action, while unlikely against a well-structured organization operating in good faith, is possible — particularly as the community grows and attracts attention.

MITIGATION:
    • All structures are grounded in well-established trust law principles with centuries of precedent
    • PMA rights are constitutionally protected under the First and Fourteenth Amendments — these protections are not theoretical; they have been affirmed repeatedly by the courts
    • The model does not evade taxes — it lawfully structures activity to utilize established legal frameworks (trust law, PMA law, 508(c)(1)(A) recognition)
    • Legal documentation is comprehensive, professionally reviewed, and maintained by qualified counsel
    • Full transparency and good-faith compliance with applicable law — no intent to deceive or defraud
    • The community maintains cooperative relationships with local authorities and demonstrates good citizenship
    • Legal defense reserves are maintained in the treasury for the defense of the trust's legal position if challenged
    • Members are educated about the legal basis for the trust structure so they can articulate it accurately`,
      },
      {
        title: "B. Governance Failure & Internal Corruption",
        content: `CHALLENGE: Trustees, stewards, or influential members could abuse their authority for personal gain, mismanage resources, or gradually subvert the covenant's principles.

REALITY: Every human institution is vulnerable to corruption. History is filled with examples of idealistic communities destroyed by internal power dynamics. This risk must be addressed structurally, not merely through good intentions.

MITIGATION:
    • The protector council provides independent oversight with veto power and the authority to remove and replace trustees — a structural check on administrative abuse
    • Full transparency of all financial records via the digital platform — corruption requires secrecy, and secrecy is structurally impossible in this system
    • The Proof Vault provides timestamped, cryptographically verifiable records that cannot be altered retroactively — creating an immutable audit trail
    • The charter is irrevocable — even corrupt administrators cannot change the fundamental rules. They can be removed, but the system's principles endure
    • Separation of powers between the asset stewardship arm and the community governance arm prevents the concentration of both economic and social authority
    • Term limits and staggered rotation for governance positions prevent entrenchment
    • Covenant culture emphasizes servant leadership, accountability, and the subordination of personal ambition to community purpose
    • Whistle-blower protections ensure members can raise concerns without fear of retaliation`,
      },
      {
        title: "C. Economic Viability & Sustainability",
        content: `CHALLENGE: The internal economy may not produce sufficient value to sustain the community, particularly in the early stages when productive capacity is limited and the community is small.

REALITY: Building a self-sustaining economy from scratch is extremely difficult. Most intentional communities fail within the first few years, often due to economic unsustainability rather than ideological disagreement.

MITIGATION:
    • Phased implementation allows gradual development of productive capacity — the model does not require immediate self-sufficiency
    • Members maintain the ability to earn income externally during the transitional period, bridging the gap between current capacity and future independence
    • Diversified enterprise portfolio reduces the risk of single-point economic failure
    • Treasury reserves provide a financial buffer during development and transition periods
    • The model explicitly does not require complete self-sufficiency — it aims for maximum practical independence while maintaining necessary economic connections with the external world
    • Rigorous financial planning, budgeting, and reporting ensure that resources are allocated efficiently
    • Enterprise decisions are based on market analysis and feasibility assessment, not wishful thinking
    • The guild system ensures professional-quality output that can compete in external markets when revenue generation is needed`,
      },
      {
        title: "D. Free Rider Problem & Social Dynamics",
        content: `CHALLENGE: Some members may consume community benefits without contributing proportionally. Social dynamics — personality conflicts, cliques, power struggles, burnout — may undermine community cohesion.

REALITY: The free rider problem is real in any communal arrangement. And the intensity of community life — living, working, worshiping, and governing together — amplifies interpersonal friction.

MITIGATION:
    • Beneficial interest is contingent on active stewardship participation — the covenant agreement is explicit about this requirement
    • Transparent contribution tracking via the platform provides objective data about member participation
    • Commune and guild structures create natural social accountability — teammates notice when someone isn't pulling their weight
    • The protector council has authority to address persistent non-contribution through covenant discipline
    • Cultural emphasis on stewardship as calling and privilege, not burden — the goal is a community where contribution is joyful, not grudging
    • Regular community assemblies provide forums for addressing grievances before they fester
    • Covenant mediation processes provide structured resolution for interpersonal conflicts
    • The community recognizes that contribution capacity varies — illness, disability, age, and circumstance are accounted for with grace
    • Sabbath rest and rhythms of renewal prevent burnout and maintain long-term sustainability`,
      },
      {
        title: "E. Scalability & Complexity",
        content: `CHALLENGE: The model may work for a small community but become unwieldy as it scales to multiple chapters, hundreds or thousands of members, and diverse geographic contexts.

REALITY: Scaling any organization while maintaining its culture and principles is one of the hardest challenges in institutional life.

MITIGATION:
    • The chapter structure provides natural organizational units that maintain human-scale community (Dunbar's number suggests groups of ~150 maintain strong social bonds)
    • The guild system provides cross-chapter coordination without requiring centralized management of every activity
    • The digital platform enables transparent governance and communication at any scale
    • The charter provides fixed principles that don't change with scale — only operational details adapt
    • The phased roadmap builds organizational capacity incrementally rather than attempting to scale prematurely
    • Each chapter retains significant local autonomy within charter principles — preventing the bureaucratic ossification that plagues large centralized organizations
    • The model is designed to be replicated, not just expanded — new communities can adopt the framework independently while connecting to the broader network`,
      },
      {
        title: "F. External Opposition & Cultural Resistance",
        content: `CHALLENGE: The model challenges powerful economic interests and deeply held cultural assumptions about ownership, money, and individual autonomy. Opposition from regulatory agencies, media, cultural commentators, or even family members of participating individuals is likely.

REALITY: Any community that attempts to build an alternative to the dominant economic system will face scrutiny, skepticism, and potentially active opposition.

MITIGATION:
    • The community operates in full legal compliance — providing no legitimate basis for regulatory action
    • Transparency and openness to inquiry demonstrate good faith and prevent the perception of secrecy or cultic behavior
    • The model is voluntary — no one is coerced, and members can leave freely. This distinguishes it from organizations that use isolation or control to retain members
    • Educational content (the Royal Academy, this white paper, public resources) articulates the model clearly and invites examination
    • The community demonstrates its values through tangible outcomes: members are housed, fed, educated, cared for, and thriving. Results speak louder than criticism
    • Strong legal foundations and qualified counsel provide defense against unjustified legal challenges
    • The community maintains positive relationships with neighbors, local authorities, and the broader society — demonstrating that covenant living enriches rather than threatens the surrounding community`,
      },
    ],
  },
  {
    id: "conclusion",
    number: "XIV",
    title: "Conclusion — A More Excellent Way",
    icon: Heart,
    content: `The Ecclesia Basilikos Trust Economy is not utopian idealism. It is not escapism. It is not a reaction against modernity. It is a practical, legally grounded, scripturally mandated alternative to the debt-based, extractive economic system that dominates the modern world — built on legal instruments that exist, constitutional protections that have been affirmed, and scriptural principles that have not changed.

By returning to the ancient principles of trust law (the oldest protective legal framework in the common law tradition), divine stewardship (the foundational economic principle of scripture), and covenant community (the organizational pattern of the earliest ecclesia), this model creates an economic system where:

    • No member is homeless, hungry, or without access to education and community care — because the trust structure provides these as permanent benefits, not conditional privileges
    • No external creditor can seize community assets — because trust law protects the corpus from external claims
    • No speculator can inflate the cost of land and housing beyond reach — because trust property cannot be bought, sold, or traded
    • No banking cartel controls the community's medium of exchange or extracts interest from productive labor — because the internal economy operates on asset-backed credits, not debt-money
    • Every member has an equal beneficial interest and an equal voice in governance — because the Beneficial Unit structure permanently levels the economic field
    • Wealth is measured in community well-being, not individual accumulation — because the covenant redefines prosperity as the flourishing of the whole body
    • The economy serves the people, not the other way around — because the trust's fiduciary duty is to the beneficiaries, not to shareholders, not to creditors, not to distant institutions

This is not a rejection of economic activity — it is a reformation of economic relationships. Members still work, create, trade, build, innovate, and produce. They still exercise their unique gifts and develop their individual capacities. They still experience the satisfaction of productive labor and the reward of skillful service. They simply do so within a structure that ensures the fruits of their labor benefit the covenant community rather than enriching distant shareholders, faceless creditors, and extractive institutions that contribute nothing.

The model is ambitious. It requires committed people willing to covenant together, sacrifice convenience, and build something genuinely new — something that will outlast them and serve their children's children. It requires patience, because the internal economy will not be self-sustaining on day one. It requires humility, because community life is harder than individual life in almost every way. It requires faith, because the world will say it cannot work.

But the legal tools exist. Trust law is six centuries old and has survived every attempt to abolish it. Constitutional protections for private association and religious assembly are among the most firmly established rights in American jurisprudence. The technology for transparent governance, cryptographic verification, and distributed community management is available today. The scriptural pattern is clear, documented, and has been practiced before.

What remains is the will to build — and the faith to believe that a more excellent way is not only possible, but commanded.

    "And all that believed were together, and had all things common; and sold their possessions and goods, and parted them to all men, as every man had need."
    — Acts 2:44-45

    "And the multitude of them that believed were of one heart and of one soul: neither said any of them that ought of the things which he possessed was his own; but they had all things common... Neither was there any among them that lacked."
    — Acts 4:32, 34

This is not a prescription to replicate first-century economics literally. It is a recognition that the earliest ecclesia understood something that modern Christianity has largely forgotten: that genuine community requires genuine economic solidarity. That faith without works is dead. That the Kingdom of God is not merely a spiritual concept to be believed, but a material reality to be built.

The trust structure provides the legal and organizational framework to make that solidarity real, sustainable, protected under law, and enduring across generations.

The Ecclesia Basilikos Trust Economy is an invitation — to step out of Babylon's debt machine and into a covenant community where stewardship replaces ownership, where mutual benefit replaces extraction, where dignity replaces desperation, and where every member matters equally.

    "And his kingdom shall have no end."
    — Luke 1:33

The Kingdom economy is not coming. It is being built — one beneficial unit, one covenant, one chapter, one faithful steward at a time.

Soli Deo Gloria.`,
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
            Version 2.0 — {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}
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
