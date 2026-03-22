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
  Layers,
  Shield,
  ArrowRight,
  Crown,
  Scale,
  Coins,
  Heart,
  Gem,
  FileText,
  Lock,
  Users,
  BookOpen,
  Building2,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════
// TRUST ARCHITECTURE SECTIONS
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
    id: "introduction",
    number: "I",
    title: "Introduction & Purpose",
    icon: ScrollText,
    content: `This document provides the comprehensive structural blueprint of the Ecclesia Basilikos Trust: a detailed architectural reference for the nine-layer hierarchy, fourteen relationship types, thirteen governance roles, and the operational mechanics that bind them into a unified system.

Where the White Paper presents the philosophical, theological, and economic vision of the covenant economy, this Trust Architecture document describes the concrete structural implementation: the layers, roles, relationships, and flows that make the vision operational.

This document serves as the authoritative internal reference for:

    • Understanding how the nine layers of the trust hierarchy relate to each other
    • Mapping the fourteen relationship types that connect entities across layers
    • Defining the thirteen roles that govern and steward the trust
    • Tracing authority, financial, pastoral, and beneficial flows through the system
    • Understanding the Beneficial Unit system and spendthrift protections
    • Documenting the trust document management and variable resolution system
    • Explaining the asset protection architecture and liability isolation model
    • Describing the entry process, generational transfer, and system integration

Every structural element described herein is implemented in the platform's data model and seeded with biblically-grounded descriptions drawn from scripture. The architecture is not theoretical; it is operational.`,
  },
  {
    id: "nine-layers",
    number: "II",
    title: "The Nine-Layer Hierarchy",
    icon: Layers,
    content: `The Ecclesia Basilikos Trust is organized into nine distinct layers, each serving a specific purpose in the covenant economy. The hierarchy flows from the individual's personal covenant with God through the collective Body and its organs, down to the individual member who benefits from the whole.`,
    subsections: [
      {
        title: "Layer 1: Covenant (Individual Covenant Gateway)",
        content: `The New Covenant Legacy Trust is the individual's personal covenant with God through Christ, the doorway into the Body.

    "But this shall be the covenant that I will make with the house of Israel; After those days, saith the LORD, I will put my law in their inward parts, and write it in their hearts"
    (Jeremiah 31:33)

    "For he is not a Jew, which is one outwardly; neither is that circumcision, which is outward in the flesh: But he is a Jew, which is one inwardly; and circumcision is that of the heart, in the spirit, and not in the letter"
    (Romans 2:28-29)

The NCLT is the individual's irrevocable covenant: a circumcision of heart establishing the singular relationship between man and God through Christ. It sits outside and above the Body as the gateway through which one enters. The covenant is irrevocable: "No man, having put his hand to the plough, and looking back, is fit for the kingdom of God" (Luke 9:62).

Legal basis: Divine law (2 Timothy 3:16), natural law (Creator-endowed rights), common law express trust (not organized under any state trust code), First Amendment (free exercise, assembly), Ninth and Tenth Amendments.`,
      },
      {
        title: "Layer 2: Body of Christ (The Collective Body)",
        content: `Ecclesia Basilikos is the Body of Christ: the collective assembly of all who have entered through the covenant gateway.

    "For as the body is one, and hath many members, and all the members of that one body, being many, are one body: so also is Christ. For by one Spirit are we all baptized into one body"
    (1 Corinthians 12:12-13)

    "And he is the head of the body, the church"
    (Colossians 1:18)

Everything exists within the Body: stewardship organs, the gathered assembly, regional churches, households, crafts, ministries, and all members. Christ is the Head; appointed trustees and the Protector Council steward the Body's operations. The Body commissions stewardship organs, gathers the assembly, establishes regional churches, and nurtures households.

Legal basis: Express trust under common law, First Amendment ecclesiastical governance, common law fiduciary duty.`,
      },
      {
        title: "Layer 3: Stewardship (Organs of the Body)",
        content: `Within the Body, five stewardship organs handle specific functions: Land, Housing, Treasury, Enterprise, and Education. Each organ is a separate trust holding and administering a specific category of community assets.

    "Well done, thou good and faithful servant: thou hast been faithful over a few things, I will make thee ruler over many things"
    (Matthew 25:21)

The stewardship layer implements the principle of faithful stewardship through specialized organs, each with its own trustees, protectors, and mandate. Like organs in a human body (the heart pumps blood, the lungs breathe, the hands work), each stewardship trust serves a vital function. If one organ faces trouble, the others are protected through liability isolation.

See Section III for a detailed examination of each stewardship organ.`,
      },
      {
        title: "Layer 4: Assembly (The Gathered Ecclesia)",
        content: `The Private Membership Association is the gathered ecclesia within the Body: the voluntary assembly of believers.

    "And I say also unto thee, That thou art Peter, and upon this rock I will build my church [ecclesia]; and the gates of hell shall not prevail against it"
    (Matthew 16:18)

    "For where two or three are gathered together in my name, there am I in the midst of them"
    (Matthew 18:20)

The assembly organizes the people; the stewardship organs hold the assets for their benefit. Membership is voluntary and requires signing the PMA agreement. The PMA is constitutionally protected under First Amendment free association (NAACP v. Alabama, 357 U.S. 449; Roberts v. U.S. Jaycees, 468 U.S. 609; Boy Scouts of America v. Dale, 530 U.S. 640).`,
      },
      {
        title: "Layer 5: Region (City-Churches)",
        content: `Regional assemblies organized geographically within the Body, following the pattern of the seven churches of Revelation as city-churches.

    "For this cause left I thee in Crete, that thou shouldest set in order the things that are wanting, and ordain elders in every city"
    (Titus 1:5)

Each region coordinates local members, worship, resource sharing, pastoral care, and ministry launches within its geographic area. Regions appoint local elders per the qualifications of 1 Timothy 3:1-7 and Titus 1:5-9.`,
      },
      {
        title: "Layer 6: Household (House-Churches, Oikos)",
        content: `House-churches and oikos groups are the intimate gatherings within the Body where daily fellowship, shared meals, common labor, and worship take place.

    "And they, continuing daily with one accord in the temple, and breaking bread from house to house, did eat their meat with gladness and singleness of heart"
    (Acts 2:46)

    "Greet the church that is in their house"
    (Romans 16:5)

Households organize shared living and resource-sharing groups within regions, following the koinonia model of Acts 2:42-47. "Behold, how good and how pleasant it is for brethren to dwell together in unity!" (Psalm 133:1).`,
      },
      {
        title: "Layer 7: Craft (Skilled Workers, Bezalel Pattern)",
        content: `Functional groups within the Body organized around skills, trades, and areas of expertise following the Bezalel pattern.

    "And I have filled him with the spirit of God, in wisdom, and in understanding, and in knowledge, and in all manner of workmanship"
    (Exodus 31:3)

Crafts cross regional boundaries, connecting skilled workers across the Body. They include farming, construction, education, technology, healing arts, and other vocational groups. Three-tier membership: Apprentice, Journeyman, Master. "Iron sharpeneth iron; so a man sharpeneth the countenance of his friend" (Proverbs 27:17).`,
      },
      {
        title: "Layer 8: Ministry (Service Initiatives, Diakonia)",
        content: `Service initiatives and focused ministries within the Body, following the Nehemiah pattern of organized building and the diakonia (service) of the early church.

    "Then I told them of the hand of my God which was good upon me... And they said, Let us rise up and build. So they strengthened their hands for this good work"
    (Nehemiah 2:18)

Each ministry has a defined scope and purpose, counting the cost before building (Luke 14:28). Ministries draw resources from stewardship organs and labor from craft and regional members.`,
      },
      {
        title: "Layer 9: Member (Joint Heirs with Christ)",
        content: `All who have entered the Body through the covenant are members, both recipients and participants.

    "And if children, then heirs; heirs of God, and joint-heirs with Christ"
    (Romans 8:17)

    "As every man hath received the gift, even so minister the same one to another, as good stewards of the manifold grace of God"
    (1 Peter 4:10)

Each member holds one Beneficial Unit: an equal, undivided interest (1/N) in the trust corpus. Beneficial interest is non-transferable, non-attachable, and contingent on active covenant participation. Members are not owners; they are beneficiaries with use rights and stewards with responsibilities.`,
      },
    ],
  },
  {
    id: "stewardship-organs",
    number: "III",
    title: "The Five Stewardship Organs",
    icon: Shield,
    content: `The stewardship layer consists of five specialized trusts, each holding and administering a specific category of community assets. Together, they encompass the full spectrum of economic life within the Body. Each organ operates as a separate trust for liability isolation; a problem in one never cascades to another.`,
    subsections: [
      {
        title: "A. Land Trust (Dominion Stewardship)",
        content: `"And the LORD God took the man, and put him into the garden of Eden to dress it and to keep it" (Genesis 2:15). "The earth is the LORD's, and the fulness thereof" (Psalm 24:1).

An organ of the Body responsible for dominion stewardship per Genesis 1:28. Holds and administers all real property, acreage, and land-based assets. Legal title is held by the trust; members receive beneficial use rights.

    "The land shall not be sold for ever: for the land is mine; for ye are strangers and sojourners with me"
    (Leviticus 25:23)

The Land Trust implements the Levitical model where land was allotted for use but belonged ultimately to God. Land is held in perpetuity for the community, never to be individually alienated, speculated upon, or encumbered. The Jubilee principle (Leviticus 25) governs long-term land allocation. All improvements to land belong to the trust, not to individual members.

Legal protections: Land trust doctrine under common law; beneficial interest separated from legal title; spendthrift protections (no creditor may reach trust-held land); not subject to partition or forced sale.`,
      },
      {
        title: "B. Housing Trust (Shelter & Buildings)",
        content: `"My people shall dwell in a peaceable habitation, and in sure dwellings, and in quiet resting places" (Isaiah 32:18). "In my Father's house are many mansions" (John 14:2).

An organ of the Body providing shelter. Administers housing structures, shelters, and buildings. Ensures members of the Body have access to covenant-aligned shelter.

Housing is allocated based on need, contribution, and family size. Members do not own dwellings; they have beneficial use rights as members of the Body. "By wisdom a house is built, and by understanding it is established" (Proverbs 24:3-4).

Key principles:
    • Members are assigned housing based on family size, need, and availability
    • Maintenance is a community responsibility funded by the treasury
    • Housing cannot be foreclosed, seized, or lost to debt
    • New construction is funded by the treasury and built by community labor
    • Members who leave the community vacate housing but are not displaced without process`,
      },
      {
        title: "C. Treasury Trust (Finances & Resources)",
        content: `"Bring ye all the tithes into the storehouse, that there may be meat in mine house" (Malachi 3:10). The treasury organ of the Body is the central storehouse.

Manages financial contributions, allocations, reserves, and the economic infrastructure of the Body. Distribution follows the Acts 2:45 model: "as every man had need."

Financial flows:
    • Receives: member tithes, enterprise revenue, regional tithes, household contributions, craft revenue share
    • Distributes: operational budgets, emergency reserves, expansion capital, benevolence
    • Funds: Land Trust (acquisition), Housing Trust (construction/maintenance), Enterprise Trust (seed capital), Education Trust (curriculum development)

"Honour the LORD with thy substance, and with the firstfruits of all thine increase" (Proverbs 3:9-10). All financial flows are private member contributions, not commercial transactions. The treasury operates under lawful money principles with complete financial transparency; quarterly reports are provided to all members.`,
      },
      {
        title: "D. Enterprise Trust (Commerce & Innovation)",
        content: `"She considereth a field, and buyeth it: with the fruit of her hands she planteth a vineyard" (Proverbs 31:16). The enterprise organ of the Body oversees revenue-generating activities for community sustenance.

Each enterprise operates as a separate activity under this trust for liability isolation. Revenue flows to the Treasury Trust as first-fruits. "Not slothful in business; fervent in spirit; serving the Lord" (Romans 12:11).

Enterprise operations include:
    • Agricultural operations and food processing
    • Workshops and skilled trades
    • Digital platforms and technology services
    • Professional services and consulting
    • Educational content and training

The Enterprise Trust also administers the digital platform and community coordination infrastructure. "Whatsoever thy hand findeth to do, do it with thy might" (Ecclesiastes 9:10). Profits flow to the treasury, not to individual "owners"; there are no private shareholders.`,
      },
      {
        title: "E. Education Trust (Knowledge & Training)",
        content: `"Train up a child in the way he should go: and when he is old, he will not depart from it" (Proverbs 22:6). "Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth" (2 Timothy 2:15).

The education organ of the Body administers educational programs, courses, curriculum development, and training infrastructure. "My people are destroyed for lack of knowledge" (Hosea 4:6).

Curriculum is developed by crafts and delivered through regions. Discipleship chains (2 Timothy 2:2) ensure knowledge passes from generation to generation: "And the things that thou hast heard of me among many witnesses, the same commit thou to faithful men, who shall be able to teach others also."

Educational scope:
    • Courses on trust law, covenant economics, and stewardship principles
    • Training materials for new members
    • Craft-specific professional development
    • Royal Academy curriculum for comprehensive formation
    • Children's education and generational discipleship`,
      },
    ],
  },
  {
    id: "relationship-types",
    number: "IV",
    title: "The Fourteen Relationship Types",
    icon: ArrowRight,
    content: `The trust architecture defines fourteen distinct relationship types that connect entities across layers. These relationships are grouped into five categories: authority & governance, entry & membership, financial, pastoral & discipleship, and beneficial. Each relationship type has a specific directional meaning and biblical basis.`,
    subsections: [
      {
        title: "A. Authority & Governance Relationships",
        content: `AUTHORITY: The primary authority chain flowing downward through the hierarchy. The Body exercises authority over its organs and assembly. The assembly exercises oversight of regions, crafts, and ministries. "Let every soul be subject unto the higher powers" (Romans 13:1).

GRANTS: The Body commissions stewardship organs, delegating specific stewardship mandates. "Well done, good and faithful servant: thou hast been faithful over a few things, I will make thee ruler over many things" (Matthew 25:21). Each grants relationship carries a specific stewardship mandate: Genesis 2:15 for land, Isaiah 32:18 for housing, Malachi 3:10 for treasury, Proverbs 31:16 for enterprise, Deuteronomy 6:7 for education.

ESTABLISHES PMA: The Body gathers the assembly. "Upon this rock I will build my ecclesia" (Matthew 16:18). This relationship creates the constitutional link between the trust structure and the voluntary assembly of members.

OVERSEES: The assembly exercises elder oversight of regions, crafts, ministries, and members. Regions oversee households. "Obey them that have the rule over you, and submit yourselves: for they watch for your souls" (Hebrews 13:17).

COORDINATES: Cross-layer coordination between entities that have functional relationships but not direct authority chains. Enables collaborative governance without hierarchical dominance.`,
      },
      {
        title: "B. Entry & Membership Relationships",
        content: `ENTERS: The covenant gateway relationship. An individual enters the Body through the covenant. "For by one Spirit are we all baptized into one body" (1 Corinthians 12:13). This is the foundational relationship; without it, no other relationship in the system exists.

The "enters" relationship is:
    • Irrevocable: the covenant cannot be undone
    • Individual: each person enters through their own covenant
    • Spiritual: representing the circumcision of heart (Romans 2:29)
    • Legal: establishing beneficial interest in the trust corpus
    • Transformational: the old man dies, the new creation enters (2 Corinthians 5:17)`,
      },
      {
        title: "C. Financial Relationships",
        content: `FUNDS: The Treasury Trust allocates funds to other stewardship organs: Treasury to Land Trust (acquisition), Treasury to Housing Trust (construction/maintenance), Treasury to Enterprise Trust (seed capital), Treasury to Education Trust (curriculum development). "Storehouse distribution" (Acts 4:34-35).

REMITS: Upward financial flow. Enterprise Trust remits revenue to Treasury Trust as first-fruits (Proverbs 3:9-10). Members contribute labor and resources to the assembly. "Each according to ability" (Acts 11:29).

TITHES: The storehouse principle. Members tithe to Treasury. Regions, households, and crafts contribute their portion. "Bring ye all the tithes into the storehouse" (Malachi 3:10). "Upon the first day of the week let every one of you lay by him in store" (1 Corinthians 16:2). "Honour the LORD with thy substance, and with the firstfruits of all thine increase" (Proverbs 3:9).`,
      },
      {
        title: "D. Pastoral & Discipleship Relationships",
        content: `SHEPHERDS: Pastoral care flowing through the hierarchy. Body to Assembly (pastoral oversight, 1 Peter 5:2). Assembly to Regions (shepherding, 1 Peter 5:1-2). Regions to Households ("He shall feed his flock like a shepherd," Isaiah 40:11). The shepherding chain ensures every member receives pastoral care through their household, region, and assembly leadership.

TEACHES: Discipleship and knowledge transfer. Education Trust to Assembly (equipping the ecclesia, Ephesians 4:12). Education Trust to Crafts (training craft members, 2 Timothy 2:2). Assembly to Regions (doctrinal teaching, Matthew 28:20). Crafts to Regions (skills training, Exodus 35:10). The teaching chain ensures knowledge flows from the education organ through every level of the Body.

SERVES: Diaconal service following the example of Christ. Assembly to Members ("the Son of man came not to be ministered unto, but to minister," Matthew 20:28). Crafts to Households ("By love serve one another," Galatians 5:13). Regions to Members ("As we have therefore opportunity, let us do good unto all men," Galatians 6:10).`,
      },
      {
        title: "E. Beneficial Relationships",
        content: `BENEFITS: The downward flow of beneficial interest from stewardship organs to members. Each of the five stewardship organs benefits members directly:

    • Land Trust → Members: "Blessed are the meek: for they shall inherit the earth" (Matthew 5:5)
    • Housing Trust → Members: "By wisdom a house is built" (Proverbs 24:3-4)
    • Treasury Trust → Members: "Distribution as every man had need" (Acts 4:35)
    • Enterprise Trust → Members: "The laborer is worthy of his reward" (1 Timothy 5:18)
    • Education Trust → Members: "Teaching all nations" (Matthew 28:19-20)

The benefits relationship is the fulfillment of the entire trust architecture: everything exists so that members, as joint heirs with Christ (Romans 8:17), receive the beneficial use of trust-held assets.`,
      },
    ],
  },
  {
    id: "thirteen-roles",
    number: "V",
    title: "The Thirteen Roles",
    icon: Crown,
    content: `The trust architecture defines thirteen distinct roles, organized into three categories: trust governance roles (the legal framework), ecclesial leadership roles (the organizational framework), and five-fold ministry gifts (the spiritual framework). Together these roles ensure faithful administration, accountability, and spiritual vitality across every layer.`,
    subsections: [
      {
        title: "A. Trust Governance Roles",
        content: `GRANTOR: The one who establishes the trust and sets its terms. In the covenant framework, the individual is the grantor of the NCLT (their personal covenant trust). The Body's grantor is the covenant community collectively operating under divine mandate. The grantor establishes the purpose, terms, and restrictions that bind all other parties.

TRUSTEE: The fiduciary who holds legal title and administers the trust. "A faithful and wise steward, whom his lord shall make ruler over his household" (Luke 12:42). Each layer has its own trustee designation: the Individual (covenant layer), Administrative Steward (body layer), Land/Housing/Treasury/Enterprise/Education Stewards (stewardship layer), PMA Administrator (assembly layer), Region Steward, Household Lead, Craft Master, Ministry Lead.

PROTECTOR: The oversight body that ensures the trustee acts faithfully. The Protector Council is a 3-member elder oversight body per 1 Timothy 5:17. "Where no counsel is, the people fall: but in the multitude of counsellors there is safety" (Proverbs 11:14). The Protector can remove an unfaithful trustee and appoint a successor.

STEWARD: The operational manager of a specific trust organ. While "trustee" is the legal role, "steward" emphasizes the biblical character of the service, managing another's property for their benefit. "As every man hath received the gift, even so minister the same one to another, as good stewards of the manifold grace of God" (1 Peter 4:10).

BENEFICIARY: The one who receives beneficial interest from the trust. Every member of the Body is a beneficiary. Beneficiaries hold equitable title (the right to benefit) while trustees hold legal title (the duty to administer). This separation is the foundation of trust law and mirrors the divine economy.

OFFICER: Administrative roles within the assembly structure. Officers handle day-to-day operations, record-keeping, communications, and coordination. They serve at the direction of trustees and under the oversight of protectors.`,
      },
      {
        title: "B. Ecclesial Leadership Roles",
        content: `ELDER: "If a man desire the office of a bishop, he desireth a good work" (1 Timothy 3:1-7). Elders provide governance oversight, spiritual leadership, and judicial authority within the assembly. They are appointed based on scriptural qualifications (1 Timothy 3:1-7, Titus 1:5-9) and serve on the Protector Council.

Elders are responsible for:
    • Oversight of the Body's spiritual health
    • Governance decisions and policy-setting
    • Resolution of disputes through the Matthew 18 Protocol
    • Appointment and removal of trustees and stewards
    • Protection of doctrinal integrity

DEACON: "Likewise must the deacons be grave, not doubletongued, not given to much wine, not greedy of filthy lucre" (1 Timothy 3:8-13). Deacons handle practical service: administration, resource distribution, care for the needy, and operational coordination. The diaconate ensures that the Body's physical needs are met while elders focus on spiritual governance.`,
      },
      {
        title: "C. Five-Fold Ministry Gifts",
        content: `"And he gave some, apostles; and some, prophets; and some, evangelists; and some, pastors and teachers; For the perfecting of the saints, for the work of the ministry, for the edifying of the body of Christ"
    (Ephesians 4:11-12)

APOSTLE: The sent one. Apostles establish new regions, plant new assemblies, and extend the Body's reach into new areas. They carry the authority to commission new work and set foundational structures.

PROPHET: The voice of accountability and direction. Prophets provide spiritual discernment, call the Body to faithfulness, and speak into governance decisions with insight beyond natural wisdom.

EVANGELIST: The one who brings the good news. Evangelists reach those outside the Body, explain the covenant, and guide individuals through the entry process from initial interest to covenant commitment.

PASTOR: The shepherd. Pastors provide direct care for members: counseling, encouragement, accountability, and the ongoing nurture of spiritual life. "Feed the flock of God which is among you, taking the oversight thereof" (1 Peter 5:2).

TEACHER: The one who equips. Teachers develop and deliver the educational content that forms members in covenant understanding, trust law, practical skills, and spiritual maturity. "The same commit thou to faithful men, who shall be able to teach others also" (2 Timothy 2:2).`,
      },
    ],
  },
  {
    id: "authority-governance",
    number: "VI",
    title: "Authority & Governance Flow",
    icon: Scale,
    content: `The trust architecture implements a separation-of-powers governance model drawn from both biblical ecclesiology and trust law. Authority flows downward through clearly defined channels, with accountability flowing upward through the Protector Council and elder oversight.`,
    subsections: [
      {
        title: "A. The Authority Chain",
        content: `Authority flows through the hierarchy in a defined chain:

    1. COVENANT establishes the foundational authority: God's law written on the heart
    2. BODY receives authority from the covenant and delegates it to:
       → Stewardship organs (through "grants" relationships)
       → Assembly (through "establishes_pma" relationship)
    3. ASSEMBLY exercises oversight of:
       → Regions, crafts, ministries (through "oversees" relationships)
       → Members (through "oversees" relationship)
    4. REGIONS exercise oversight of:
       → Households (through "oversees" relationship)

No entity in the hierarchy exercises authority beyond its delegated scope. Each layer governs within its mandate and is accountable to the layer above.`,
      },
      {
        title: "B. Separation of Powers",
        content: `The trust architecture implements a three-way separation of powers at every level:

    GRANTOR POWER: The power to establish terms and purposes
    • Sets the covenant principles and restrictions
    • Defines the trust's charitable purpose and mandate
    • Cannot be overridden by trustee or protector

    TRUSTEE POWER: The power to administer and manage
    • Holds legal title and makes operational decisions
    • Manages day-to-day affairs within the terms set by the grantor
    • Subject to fiduciary duty and protector oversight

    PROTECTOR POWER: The power to oversee and correct
    • Can remove and replace unfaithful trustees
    • Approves major transactions and structural changes
    • Ensures compliance with covenant principles

This separation prevents concentration of power in any single role. The grantor (covenant) sets the rules, the trustee (steward) executes them, and the protector (elder council) ensures faithful execution.`,
      },
      {
        title: "C. The Protector Council",
        content: `The Protector Council is the supreme oversight body: a 3-member elder panel operating under the principle of 2 Corinthians 13:1: "In the mouth of two or three witnesses shall every word be established."

Council functions:
    • Oversight of all trustees across every layer
    • Authority to remove unfaithful stewards and appoint successors
    • Final arbiter of covenant disputes (after Matthew 18 process)
    • Guardian of the trust's charitable purpose
    • Annual audit review and accountability

The 3-member structure prevents both autocracy (single ruler) and deadlock (even-numbered panels). Decisions require a majority. Council members are selected based on the elder qualifications of 1 Timothy 3:1-7 and serve rotating terms to prevent entrenchment.`,
      },
      {
        title: "D. The Matthew 18 Protocol",
        content: `All internal disputes are resolved through the Matthew 18 Protocol, never before civil courts.

    "Moreover if thy brother shall trespass against thee, go and tell him his fault between thee and him alone: if he shall hear thee, thou hast gained thy brother. But if he will not hear thee, then take with thee one or two more, that in the mouth of two or three witnesses every word may be established. And if he shall neglect to hear them, tell it unto the church."
    (Matthew 18:15-17)

    "Dare any of you, having a matter against another, go to law before the unjust, and not before the saints?"
    (1 Corinthians 6:1)

Resolution escalation:
    1. PRIVATE: The aggrieved party addresses the matter directly with the other party
    2. WITNESSES: If unresolved, 1-2 witnesses are brought to mediate
    3. ASSEMBLY: If still unresolved, the matter is brought before the elder body
    4. PROTECTOR COUNCIL: Final binding arbitration by the Protector Council

This internal dispute resolution protects the Body's privacy, preserves relationships, and keeps governance within the covenant jurisdiction.`,
      },
    ],
  },
  {
    id: "financial-flows",
    number: "VII",
    title: "Financial Flows",
    icon: Coins,
    content: `Financial flows in the trust architecture follow two primary patterns: tithes and contributions flow upward from members to the Treasury (the storehouse), and benefits flow downward from the Treasury through stewardship organs to members. The Treasury Trust serves as the central storehouse, receiving, holding, and distributing financial resources according to the covenant mandate.`,
    subsections: [
      {
        title: "A. Upward Flow: Tithes to the Storehouse",
        content: `"Bring ye all the tithes into the storehouse, that there may be meat in mine house" (Malachi 3:10)

Four sources of upward financial flow:

    1. MEMBER TITHES → Treasury Trust
       "Bring ye all the tithes into the storehouse" (Malachi 3:10)
       Individual members contribute tithes and offerings as covenant participants.

    2. REGIONAL TITHES → Treasury Trust
       "Upon the first day of the week let every one of you lay by him in store" (1 Corinthians 16:2)
       Regional assemblies forward their collected contributions.

    3. HOUSEHOLD CONTRIBUTIONS → Treasury Trust
       "Honour the LORD with thy substance, and with the firstfruits of all thine increase" (Proverbs 3:9)
       Households contribute from their shared resources.

    4. CRAFT REVENUE SHARE → Treasury Trust
       "The labourer is worthy of his reward" (1 Timothy 5:18)
       Crafts contribute a portion of their productive output.

Additionally, the Enterprise Trust remits revenue to the Treasury Trust as first-fruits: "Firstfruits to the storehouse" (Proverbs 3:9-10).`,
      },
      {
        title: "B. Downward Flow: Benefits to Members",
        content: `"And sold their possessions and goods, and parted them to all men, as every man had need" (Acts 2:45)

The Treasury distributes funds to other stewardship organs, which in turn deliver benefits to members:

    TREASURY → LAND TRUST
    Funds for land acquisition, development, and stewardship. "Storehouse distribution" (Acts 4:34-35).

    TREASURY → HOUSING TRUST
    Funds for construction, maintenance, and housing allocation. "Storehouse distribution" (Acts 4:34-35).

    TREASURY → ENTERPRISE TRUST
    Seed capital for new enterprises, operational funding. "Parable of talents" (Matthew 25:14-30).

    TREASURY → EDUCATION TRUST
    Curriculum development, training infrastructure. "Investment in wisdom" (Proverbs 4:7).

Each stewardship organ then delivers its specific benefit to members: land use rights, housing, financial support, enterprise opportunity, and education.`,
      },
      {
        title: "C. The Enterprise Revenue Cycle",
        content: `Enterprise Trust revenue follows a closed-loop cycle within the Body:

    1. Treasury funds Enterprise Trust with seed capital (Matthew 25:14-30)
    2. Enterprise Trust operates revenue-generating activities
    3. Enterprise Trust remits revenue to Treasury as first-fruits (Proverbs 3:9-10)
    4. Treasury redistributes to all stewardship organs as needed
    5. Stewardship organs deliver benefits to members
    6. Members contribute tithes back to Treasury (Malachi 3:10)

This creates a self-sustaining economic cycle where value circulates through stewardship rather than extraction. No external shareholders extract profit. No interest charges drain value. The entire cycle operates under lawful money principles within the private jurisdiction of the PMA.`,
      },
    ],
  },
  {
    id: "pastoral-flows",
    number: "VIII",
    title: "Pastoral & Discipleship Flows",
    icon: Heart,
    content: `Beyond authority and finance, the trust architecture defines three categories of relational flow: shepherding (pastoral care), teaching (discipleship), and service (diaconal ministry). These flows ensure that every member is spiritually nourished, equipped with knowledge, and practically served.`,
    subsections: [
      {
        title: "A. The Shepherding Chain",
        content: `"Feed the flock of God which is among you, taking the oversight thereof, not by constraint, but willingly" (1 Peter 5:2)

Pastoral care flows through a defined chain:

    BODY → ASSEMBLY
    "Feed the flock of God which is among you, taking the oversight thereof." The Body provides overall pastoral direction to the assembly.

    ASSEMBLY → REGIONS
    "The elders which are among you I exhort... Feed the flock of God." Assembly-level elders shepherd regional leadership.

    REGIONS → HOUSEHOLDS
    "He shall feed his flock like a shepherd" (Isaiah 40:11). Regional elders shepherd household leaders.

    HOUSEHOLDS → MEMBERS
    At the household level, pastoral care becomes daily and intimate: shared meals, prayer, mutual encouragement, and bearing one another's burdens (Galatians 6:2).

This chain ensures that no member is more than one relationship removed from a shepherd. Every household has a leader connected to a regional elder, connected to assembly-level oversight, connected to the Body's pastoral authority.`,
      },
      {
        title: "B. The Teaching Chain",
        content: `"And the things that thou hast heard of me among many witnesses, the same commit thou to faithful men, who shall be able to teach others also" (2 Timothy 2:2)

Teaching flows through multiple channels:

    EDUCATION TRUST → ASSEMBLY
    "For the perfecting of the saints, for the work of the ministry" (Ephesians 4:12). The Education Trust develops curriculum and equips the ecclesia with covenant understanding, trust law knowledge, and spiritual formation.

    EDUCATION TRUST → CRAFTS
    "The same commit thou to faithful men, who shall be able to teach others also" (2 Timothy 2:2). Craft-specific training and skill development: apprenticeship programs, professional certification, and technical knowledge transfer.

    ASSEMBLY → REGIONS
    "Teaching them to observe all things whatsoever I have commanded you" (Matthew 28:20). Doctrinal teaching and covenant principles flow from assembly to regional leadership.

    CRAFTS → REGIONS
    "Every wise hearted among you shall come, and make all that the LORD hath commanded" (Exodus 35:10). Skills training flows from crafts to regions, equipping local members with practical capabilities.`,
      },
      {
        title: "C. The Service Chain",
        content: `"Even as the Son of man came not to be ministered unto, but to minister, and to give his life a ransom for many" (Matthew 20:28)

Service flows downward and outward:

    ASSEMBLY → MEMBERS
    The assembly serves members through organized diaconal ministry: practical help, resource distribution, care for the vulnerable. "Even as the Son of man came not to be ministered unto, but to minister" (Matthew 20:28).

    CRAFTS → HOUSEHOLDS
    Crafts serve households with their specialized skills: construction, technology, education, healing arts. "By love serve one another" (Galatians 5:13).

    REGIONS → MEMBERS
    Regions serve local members through pastoral care, community events, resource coordination, and emergency response. "As we have therefore opportunity, let us do good unto all men" (Galatians 6:10).

The service chain ensures that the five-fold ministry gifts (Ephesians 4:11) are actively deployed throughout the Body, reaching every member at every level.`,
      },
    ],
  },
  {
    id: "beneficial-unit",
    number: "IX",
    title: "The Beneficial Unit System",
    icon: Gem,
    content: `The Beneficial Unit is the core mechanism for economic equity within the trust architecture: the instrument through which the biblical principle of "neither was there any among them that lacked" (Acts 4:34) is implemented structurally.`,
    subsections: [
      {
        title: "A. Structure & Mechanics",
        content: `Each member who enters the Body through the covenant and commits to active stewardship is issued exactly one (1) Beneficial Unit. This unit represents:

    • An equal, undivided beneficial interest in the entire trust corpus: all land, all housing, all treasury assets, all enterprise value
    • The right to beneficial use of trust assets (not ownership, but the equitable right to benefit from assets held in trust)
    • A voice in community governance: equal participation in assemblies and decisions
    • A share of distributed benefits: housing, food, services, education, emergency support

The Beneficial Unit is NOT:
    • A share of stock (no corporate entity exists)
    • A membership fee receipt (no purchase is involved)
    • A tradeable instrument (it cannot be sold or transferred)
    • A claim to specific assets (it represents an undivided interest in the whole)

The formula is simple: 1 Member = 1 Beneficial Unit = 1/N interest, where N is the total number of active members. If there are 100 members, each holds 1/100th undivided interest. If a new member joins, each interest adjusts to 1/101th automatically and without transaction.`,
      },
      {
        title: "B. Spendthrift Protections",
        content: `The Beneficial Unit is protected by comprehensive spendthrift provisions, the strongest asset protection mechanism in trust law:

    NON-TRANSFERABLE: A member cannot sell, assign, pledge, or give away their Beneficial Unit. It exists only within the covenant relationship.

    NON-ATTACHABLE: External creditors cannot seize, garnish, or levy against a member's Beneficial Unit. The interest is equitable, not legal; it cannot be reached by judgment creditors.

    NON-PARTITIONABLE: No member can demand that the trust corpus be divided into individual shares. The interest is undivided; each member benefits from the whole.

    CONTINGENT ON PARTICIPATION: The Beneficial Unit is not a passive entitlement. It is contingent on active covenant participation. "For even when we were with you, this we commanded you, that if any would not work, neither should he eat" (2 Thessalonians 3:10).

    REVOCABLE ONLY BY PROCESS: A Beneficial Unit can only be revoked through voluntary withdrawal by the member or through covenant discipline after the full Matthew 18 process. It cannot be arbitrarily removed.

These protections mean that a member's beneficial interest is shielded from external attack while remaining contingent on internal faithfulness, creating a system where the benefits flow to those who participate in the covenant and cannot be extracted by those outside it.`,
      },
    ],
  },
  {
    id: "document-management",
    number: "X",
    title: "Trust Document Management",
    icon: FileText,
    content: `The trust architecture includes a comprehensive document management system for generating, versioning, and managing trust documents across all layers. Each trust entity can have associated document templates that are customized through a variable resolution system.`,
    subsections: [
      {
        title: "A. Document Templates & Sections",
        content: `Trust documents are organized into templates, each containing ordered sections. Every layer of the trust hierarchy has its own document templates:

    COVENANT LAYER: Personal covenant declarations, irrevocable trust instruments
    BODY LAYER: Master trust declaration, governance charter, trust bylaws
    STEWARDSHIP LAYER: Stewardship trust instruments (one per organ), operational mandates
    ASSEMBLY LAYER: PMA constitution / articles of association, PMA bylaws, PMA agreement, membership covenant
    REGION LAYER: Regional charter, local governance documents
    HOUSEHOLD LAYER: Household agreement, resource-sharing covenants
    CRAFT LAYER: Craft charter, apprenticeship agreements, standards
    MINISTRY LAYER: Ministry charter, scope of work, resource allocation
    MEMBER LAYER: Beneficial Unit certificate, member covenant, participation agreement

Each template contains sections (preamble, recitals, operative clauses, schedules) that can be independently versioned and updated.`,
      },
      {
        title: "B. Variable Resolution System",
        content: `Trust documents use a variable resolution system that dynamically populates document fields based on context:

    ENTITY VARIABLES: {{entity.name}}, {{entity.subtitle}}, {{entity.layer}}
    ROLE VARIABLES: {{trustee.name}}, {{protector.name}}, {{grantor.name}}
    DATE VARIABLES: {{date.execution}}, {{date.effective}}, {{date.expiry}}
    MEMBER VARIABLES: {{member.name}}, {{member.unit_number}}, {{member.covenant_date}}
    TRUST VARIABLES: {{trust.name}}, {{trust.corpus_description}}, {{trust.purpose}}

Variables are resolved at document generation time, producing clean, legally precise documents with all relevant details populated from the trust data model. This ensures consistency across all trust documents while allowing each instance to be properly customized for its specific entity, role, and member context.`,
      },
      {
        title: "C. Version Control & Audit",
        content: `Every trust document maintains a complete version history:

    • Each section change creates a new version with timestamp and author
    • Previous versions are preserved and accessible for audit
    • Changes to operative clauses require Protector Council approval
    • All document generations are logged in the audit trail
    • The Proof Vault can cryptographically verify document authenticity

This version control system ensures that trust documents are always current, historically traceable, and tamper-evident: critical requirements for trust administration and legal compliance.`,
      },
    ],
  },
  {
    id: "asset-protection",
    number: "XI",
    title: "Asset Protection Architecture",
    icon: Lock,
    content: `The trust architecture implements multiple layers of asset protection, creating a structure where assets are held in trust, isolated by function, and protected by constitutional, common law, and equitable principles. No single point of failure can compromise the entire system.`,
    subsections: [
      {
        title: "A. Layered Trust Protection",
        content: `Assets are protected through multiple overlapping mechanisms:

    LAYER 1: COVENANT PROTECTION
    The individual's covenant declares all assets are held in trust; they are not "yours" to be seized personally. The covenant transfers beneficial ownership into the trust structure.

    LAYER 2: BODY PROTECTION
    The Body asserts collective authority over trust assets. No individual holds legal title; the trust holds title through its appointed trustees.

    LAYER 3: STEWARDSHIP ISOLATION
    Each stewardship organ is a separate trust with separate trustees. A claim against the Enterprise Trust cannot reach Land Trust assets. A liability of the Housing Trust cannot attach to Treasury reserves.

    LAYER 4: SPENDTHRIFT PROTECTION
    Beneficial Units are protected by spendthrift provisions; external creditors cannot attach, garnish, or levy against a member's beneficial interest.

    LAYER 5: PMA PROTECTION
    The Private Membership Association provides constitutional protection. Internal transactions are private contractual exchanges between PMA members, not commercial transactions subject to external regulation.`,
      },
      {
        title: "B. Liability Isolation Between Organs",
        content: `The five stewardship organs operate as separate trusts precisely to prevent contagion:

    • If the Enterprise Trust faces a business liability, the Land Trust's properties are completely untouched
    • If the Housing Trust has a maintenance claim, the Treasury's reserves are not exposed
    • If the Education Trust faces a dispute, enterprise operations continue unaffected

This is the "organs in a body" principle: if you break a finger, your heart keeps beating. Each organ has its own:
    • Trust instrument with separate terms
    • Appointed steward/trustee
    • Defined scope of assets
    • Separate legal standing
    • Independent operational authority within its mandate

The result is that a creditor seeking to reach trust assets must identify which specific organ holds the asset, pierce that specific trust's protections, overcome spendthrift provisions, and navigate the PMA's constitutional protections. This series of barriers makes successful attack extremely difficult.`,
      },
      {
        title: "C. Constitutional Protections",
        content: `The trust architecture operates under multiple constitutional protections:

    FIRST AMENDMENT: Free exercise of religion (the ecclesia's right to govern its own affairs), freedom of association (the right to form private membership associations), peaceable assembly.

    NINTH AMENDMENT: "The enumeration in the Constitution, of certain rights, shall not be construed to deny or disparage others retained by the people." The right to organize private economic life is retained by the people.

    TENTH AMENDMENT: Powers not delegated to the federal government are reserved to the states or to the people. Private trust arrangements between natural persons are exercises of retained rights.

    CASE LAW: NAACP v. Alabama (right of free association), Roberts v. U.S. Jaycees (expressive association), Boy Scouts v. Dale (private organization's right to set membership standards). The PMA operates as a constitutionally protected private association, not a public accommodation, statutory entity, or 501(c)(3) organization.`,
      },
    ],
  },
  {
    id: "entry-process",
    number: "XII",
    title: "The Entry Process",
    icon: Users,
    content: `Entry into the Body follows a defined pathway, from initial encounter through individual covenant to full membership with a Beneficial Unit. The process is designed to ensure that every member enters voluntarily, with understanding, and through genuine covenant commitment.`,
    subsections: [
      {
        title: "A. From Individual to Covenant",
        content: `The entry process begins with the individual, a living soul made in God's image, exercising their natural right to covenant with God and associate with others.

    STEP 1: ENCOUNTER
    The individual encounters the Body through evangelism, community witness, or personal invitation. They learn about the covenant economy, the trust structure, and the principles that govern community life.

    STEP 2: EDUCATION
    Before committing, the individual completes an educational process covering:
    • The theological foundations of the covenant
    • The practical structure of the trust hierarchy
    • The rights and responsibilities of membership
    • The Beneficial Unit system and what it represents
    • The Matthew 18 dispute resolution protocol
    • The expectations of active participation

    STEP 3: COVENANT DECLARATION
    The individual makes their personal covenant, establishing the New Covenant Legacy Trust as their irrevocable commitment. This is the circumcision of heart (Romans 2:29), the doorway into the Body. The covenant is personal, between the individual and God through Christ.`,
      },
      {
        title: "B. From Covenant to Body",
        content: `Once the individual covenant is established, the "enters" relationship is activated:

    STEP 4: BAPTISM INTO THE BODY
    "For by one Spirit are we all baptized into one body" (1 Corinthians 12:13). The individual enters the Body, the collective of all who have made the covenant. This is not merely organizational enrollment; it is spiritual incorporation into the living organism of the Body of Christ.

    STEP 5: PMA MEMBERSHIP
    The individual signs the PMA covenant agreement, becoming a member of the Private Membership Association. This establishes the legal relationship; the individual is now a voluntary member of a constitutionally protected private association.

    STEP 6: ASSIGNMENT & INTEGRATION
    The new member is assigned to a region and household, connected with relevant crafts based on their skills, and oriented to the community's operations, governance, and daily life.`,
      },
      {
        title: "C. Receiving the Beneficial Unit",
        content: `STEP 7: BENEFICIAL UNIT ISSUANCE
    Upon completing the entry process and committing to active participation, the member receives their Beneficial Unit: the certificate of their equal, undivided interest in the trust corpus.

The Beneficial Unit represents:
    • Full beneficial interest in all trust assets (1/N share)
    • The right to beneficial use of trust-held resources
    • A voice in community governance
    • Access to all stewardship organ benefits (land, housing, treasury, enterprise, education)
    • Protection under spendthrift provisions

The member is now a joint heir with Christ (Romans 8:17) within the trust architecture, both a beneficiary receiving from the Body and a steward contributing to it.`,
      },
    ],
  },
  {
    id: "generational-transfer",
    number: "XIII",
    title: "Generational Transfer",
    icon: BookOpen,
    content: `The trust architecture is designed for perpetual operation across generations. Assets pass through the Body, not through probate. Children enter through their own covenant and inherit as joint heirs, creating a generational legacy that avoids estate tax, probate, and the dissipation of family wealth.`,
    subsections: [
      {
        title: "A. The Perpetual Trust",
        content: `The covenant trust is irrevocable and perpetual, with no expiration date.

    "And his kingdom shall have no end"
    (Luke 1:33)

Because assets are held in trust rather than in individual names, there is no "estate" to probate when a member dies. The trust continues. The assets remain in the trust. The community continues to benefit from them. The member's beneficial interest was personal and non-transferable; it does not pass through their estate because it was never their property in the legal sense.

This avoids:
    • PROBATE: No court process to distribute assets, because the trust holds them
    • ESTATE TAX: No taxable estate, because the member held beneficial interest, not legal title
    • FAMILY DISPUTES: No inheritance to fight over, because the trust's terms govern distribution
    • ASSET DISSIPATION: No forced liquidation to pay taxes or settle claims
    • PUBLIC RECORDS: No public probate filings revealing family wealth`,
      },
      {
        title: "B. Children's Covenant Pathway",
        content: `Children of members follow a defined pathway into the Body:

    CHILDHOOD: Children grow up within the community, receiving education through the Education Trust, care through their household, and formation through the assembly's programs. They are raised in the covenant community but do not yet hold their own Beneficial Unit.

    COMING OF AGE: At an appropriate age (determined by the assembly's governance), children are presented with the opportunity to make their own covenant. This is not automatic; each individual must freely choose to enter.

    PERSONAL COVENANT: The child, now a young adult, makes their own covenant declaration, their own circumcision of heart. They establish their own NCLT as a personal, irrevocable commitment.

    ENTRY INTO THE BODY: Through their own covenant, they are baptized into the Body, sign the PMA agreement, and receive their own Beneficial Unit, becoming a joint heir in their own right.

This process ensures that membership is always voluntary and personal, never merely inherited. Each generation must choose the covenant for themselves. "I call heaven and earth to record this day against you, that I have set before you life and death, blessing and cursing: therefore choose life" (Deuteronomy 30:19).`,
      },
      {
        title: "C. Legacy & Continuity",
        content: `The generational transfer model ensures that:

    WEALTH GROWS: Because assets are held in trust perpetually, they compound across generations. Land acquired today benefits members a hundred years from now. Infrastructure built today serves generations yet unborn.

    KNOWLEDGE TRANSFERS: The Education Trust's discipleship chains (2 Timothy 2:2) ensure that covenant understanding, practical skills, and spiritual formation pass from generation to generation.

    GOVERNANCE MATURES: The elder succession model (Titus 1:5) ensures that experienced leadership trains and appoints the next generation of elders, protectors, and stewards.

    COMMUNITY DEEPENS: As families remain in covenant across generations, relationships deepen, trust increases, and the Body becomes more resilient and capable.

The trust architecture is designed not for a single generation but for perpetuity: "a good man leaveth an inheritance to his children's children" (Proverbs 13:22).`,
      },
    ],
  },
  {
    id: "system-integration",
    number: "XIV",
    title: "System Integration",
    icon: Building2,
    content: `The nine layers, fourteen relationship types, and thirteen roles do not operate in isolation; they form a unified, self-reinforcing system where every element connects to and depends on every other. This section describes how the complete architecture functions as an integrated whole.`,
    subsections: [
      {
        title: "A. The Unified Flow",
        content: `When all flows operate simultaneously, the system produces a complete economic and spiritual ecosystem:

    AUTHORITY flows downward: Covenant → Body → Stewardship Organs / Assembly → Regions → Households → Members

    FINANCE flows in a cycle: Members tithe → Treasury → Stewardship Organs → Benefits → Members

    PASTORAL CARE flows through the shepherding chain: Body → Assembly → Regions → Households → Members

    TEACHING flows through multiple channels: Education Trust → Assembly / Crafts → Regions → Households → Members

    SERVICE flows outward: Assembly / Crafts / Regions → Members and Households

    ACCOUNTABILITY flows upward: Members → Assembly → Body → Protector Council

Each flow reinforces the others. Financial stewardship enables pastoral care. Teaching strengthens governance. Service deepens trust. Accountability ensures faithfulness. The system is not a hierarchy of control but an organism of mutual dependence: "the whole body fitly joined together and compacted by that which every joint supplieth" (Ephesians 4:16).`,
      },
      {
        title: "B. Cross-Layer Relationships",
        content: `Several relationship types cross multiple layers, creating cohesion:

    BENEFITS: Stewardship organs (layer 3) benefit members (layer 9) directly, bridging six layers of the hierarchy. This ensures that organizational structure never becomes a barrier to member benefit.

    TITHES: Members (layer 9) tithe to Treasury (layer 3), creating a direct financial link that bypasses intermediate layers. This ensures financial contributions flow efficiently to where they are managed.

    TEACHES: Education Trust (layer 3) teaches crafts (layer 7) directly, enabling specialized knowledge transfer without routing through every intermediate layer.

    SERVES: Crafts (layer 7) serve households (layer 6) directly, enabling practical assistance between functionally-related entities.

These cross-layer relationships prevent the hierarchy from becoming rigid or bureaucratic. They ensure that the structure serves the Body's mission rather than constraining it.`,
      },
      {
        title: "C. The Complete Picture",
        content: `The Ecclesia Basilikos Trust Architecture, when fully operational, creates:

    A SOVEREIGN ECONOMIC ECOSYSTEM: Members produce, exchange, and benefit within a closed-loop economy that operates under covenant principles rather than commercial codes. The internal economy is legally distinct from the external commercial system.

    A SELF-GOVERNING COMMUNITY: Governance operates through defined authority chains, separation of powers, and the Matthew 18 protocol, with no external courts, no state-chartered corporate boards, and no regulatory compliance beyond constitutional protections.

    A PERPETUAL INHERITANCE: Assets held in trust grow across generations. Children enter through their own covenant. Wealth is never lost to probate, estate tax, or family disputes.

    A SPIRITUALLY VITAL BODY: Pastoral care, teaching, and service flow through defined chains that ensure every member is shepherded, equipped, and served. The five-fold ministry operates across all layers.

    A PROTECTED HAVEN: Multiple layers of asset protection, liability isolation, spendthrift provisions, and constitutional protections create a structure that is extremely difficult to attack from outside and resilient to internal failures.

This is the architectural blueprint of the covenant economy: not a utopian dream but a working structure built on established trust law, constitutional protections, and biblical principles that have operated for millennia.

    "Except the LORD build the house, they labour in vain that build it"
    (Psalm 127:1)

Soli Deo Gloria.`,
      },
    ],
  },
  {
    id: "legal-foundations",
    number: "XV",
    title: "Legal Foundations & Precedent",
    icon: Scale,
    content: `The trust architecture is built upon a robust foundation of constitutional protections, Supreme Court precedent, federal statutes, common law trust principles, and the ecclesiastical jurisdiction doctrine. These legal foundations do not create the rights of the ecclesia (those rights are antecedent to any government), but they provide the framework within which those rights are recognized and protected in the temporal realm.

Understanding these foundations is essential for every trustee, protector, and steward, because the strength of the trust architecture depends not only on its internal coherence but on the recognized legal principles that shield it from external interference.`,
    subsections: [
      {
        title: "Supreme Court Precedent",
        content: `The following Supreme Court decisions form the backbone of the legal protections enjoyed by the trust and its constituent entities:

WATSON v. JONES, 80 U.S. 679 (1871): Established the ecclesiastical abstention doctrine. Civil courts have no jurisdiction over matters of religious doctrine, discipline, or governance. "The law knows no heresy, and is committed to the support of no dogma, the establishment of no sect."

KEDROFF v. SAINT NICHOLAS CATHEDRAL, 344 U.S. 94 (1952): Extended Watson under the First Amendment, holding that the government may not interfere with the internal governance of religious organizations.

CHURCH OF THE HOLY TRINITY v. UNITED STATES, 143 U.S. 457 (1892): Recognized that the United States is a Christian nation in its history, traditions, and legal foundations, and that laws should not be construed to impede religious activity.

MURDOCK v. PENNSYLVANIA, 319 U.S. 105 (1943): Held that religious activities cannot be taxed or subjected to licensing requirements. "The state cannot and does not have the power to license or tax a right guaranteed to the people."

NAACP v. ALABAMA, 357 U.S. 449 (1958): Affirmed the right of private associations to maintain confidential membership lists, free from government compulsion.

BOY SCOUTS OF AMERICA v. DALE, 530 U.S. 640 (2000): Affirmed the right of private associations to determine their own membership criteria and internal standards.

HOSANNA-TABOR EVANGELICAL LUTHERAN CHURCH & SCHOOL v. EEOC, 565 U.S. 171 (2012): Established the ministerial exception, holding that religious organizations have absolute autonomy over the selection and dismissal of ministers.

OUR LADY OF GUADALUPE SCHOOL v. MORRISSEY-BERRU, 591 U.S. ___ (2020): Broadened the ministerial exception to cover anyone performing religious functions, not just ordained clergy.`,
      },
      {
        title: "Constitutional Protections",
        content: `FIRST AMENDMENT: "Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble, and to petition the Government for a redress of grievances."

This single amendment provides four distinct protections for the trust:
    1. FREE EXERCISE: The right to practice religion without government interference, including the right to organize as an ecclesia
    2. ESTABLISHMENT CLAUSE: Prevents government from defining or regulating what constitutes a valid religious organization
    3. FREEDOM OF ASSEMBLY: The right to gather as a private association without government approval
    4. FREEDOM OF SPEECH: The right to teach, preach, and publish without censorship

CONTRACT CLAUSE (Article I, Section 10): "No State shall pass any law impairing the obligation of contracts." The Declaration of Trust is a contract (trust instrument) between the Grantor, Trustee, and Beneficiaries. No state law may impair its terms.

NINTH AMENDMENT: "The enumeration in the Constitution of certain rights shall not be construed to deny or disparage others retained by the people." The rights exercised by the trust (free association, private contract, religious self-governance) are retained rights, not granted privileges.

TENTH AMENDMENT: "The powers not delegated to the United States by the Constitution, nor prohibited by it to the States, are reserved to the States respectively, or to the people." The power to regulate private ecclesiastical trusts is not delegated, and therefore is reserved to the people.`,
      },
      {
        title: "Federal Statutory References",
        content: `26 U.S.C. § 508(c)(1)(A): Churches, their integrated auxiliaries, and conventions or associations of churches are AUTOMATICALLY exempt from federal income tax. They are not required to apply for 501(c)(3) status, file Form 1023, or seek IRS approval. This automatic exemption recognizes the constitutional separation between church and state.

RELIGIOUS FREEDOM RESTORATION ACT (RFRA), 42 U.S.C. § 2000bb: "Government shall not substantially burden a person's exercise of religion even if the burden results from a rule of general applicability," unless it demonstrates a compelling governmental interest achieved through the least restrictive means. RFRA provides a statutory shield against government overreach.

PUBLIC LAW 97-280 (1982): Joint Resolution of Congress declaring the Bible to be "the Word of God" and designating 1983 as the "Year of the Bible." While not legally binding as a statute, this resolution evidences the nation's recognition of biblical authority.

RELIGIOUS LAND USE AND INSTITUTIONALIZED PERSONS ACT (RLUIPA), 42 U.S.C. § 2000cc: Prevents government from imposing land use regulations that substantially burden religious exercise, unless justified by a compelling interest. Protects trust-held real property used for religious purposes.`,
      },
      {
        title: "Common Law Trust Principles",
        content: `The trust architecture operates under the common law of trusts, which predates all statutory codes and provides the foundational legal framework:

ANTIQUITY OF TRUSTS: The trust concept has existed since Roman law (fideicommissum) and was developed extensively in English equity courts from the 13th century. Trusts are creatures of equity, not statute.

THE THREE CERTAINTIES: A valid express trust requires three elements. (1) Certainty of intention: the Grantor clearly intends to create a trust. (2) Certainty of subject matter: the trust property is identifiable. (3) Certainty of objects: the beneficiaries are identifiable. The Declaration of Trust satisfies all three.

SEPARATION OF LEGAL AND EQUITABLE TITLE: The Trustee holds legal title; the Beneficiaries hold equitable title. This separation is the fundamental feature of all trusts and provides the basis for asset protection.

SPENDTHRIFT DOCTRINE: A trust may include provisions preventing beneficiaries from transferring their interest and preventing creditors from reaching it. Recognized in virtually every jurisdiction.

IRREVOCABILITY: Once a trust is made irrevocable, the Grantor has no power to alter, amend, or revoke it. The trust property is permanently beyond the Grantor's personal creditors.

TRUSTEE'S FIDUCIARY DUTY: The Trustee owes the highest duty known to law to the Beneficiaries: loyalty, care, impartiality, prudence, and accounting.

THE RULE IN CLAFLIN v. CLAFLIN, 149 Mass. 19 (1889): Even if all beneficiaries consent, an irrevocable trust cannot be terminated if doing so would violate the Grantor's material purpose. The covenant purpose of the trust is a material purpose that prevents termination.`,
      },
      {
        title: "Ecclesiastical Jurisdiction Doctrine",
        content: `The ecclesiastical jurisdiction doctrine provides the most robust protection for the trust's internal governance and operations:

CHURCH AUTONOMY: Religious organizations have the inherent right to govern their own internal affairs without governmental interference. This right is grounded in the First Amendment and has been repeatedly affirmed by the Supreme Court.

MINISTERIAL EXCEPTION: Religious organizations have absolute discretion over the selection, appointment, and removal of ministers and those performing religious functions. Civil employment laws do not apply to these decisions.

ECCLESIASTICAL ABSTENTION: Civil courts must abstain from deciding questions that require interpretation of religious doctrine, polity, or practice. Courts cannot determine who is a valid minister, what constitutes orthodox doctrine, or how church property should be used for religious purposes.

DEFERENCE TO HIERARCHICAL AUTHORITY: In hierarchical religious organizations, civil courts defer to the decisions of the highest ecclesiastical authority on matters of internal governance.

INTRAECCLESIAL DISPUTES: Disputes among members of a religious organization regarding matters of faith, doctrine, or governance are resolved exclusively through internal ecclesiastical processes, not civil courts.

APPLICATION TO THE TRUST:
The trust architecture is designed as an ecclesiastical structure, an ecclesia operating under biblical governance. Every layer, role, and relationship has a scriptural basis. This positions the entire structure within the protection of the ecclesiastical jurisdiction doctrine:

    • Internal governance decisions (trustee appointments, protector actions, discipline) are ecclesiastical matters beyond civil court jurisdiction
    • Property held for religious purposes is protected by RLUIPA
    • The selection and oversight of ministers and leaders is protected by the ministerial exception
    • The Matthew 18 Protocol as exclusive dispute resolution is an ecclesiastical governance decision entitled to deference

"The right to organize voluntary religious associations to assist in the expression and dissemination of any religious doctrine, and to create tribunals for the decision of controverted questions of faith within the association, and to use these tribunals for all purposes is unquestioned." (Watson v. Jones, 80 U.S. 679, 1871)`,
      },
    ],
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

export default function AdminTrustArchitecture() {
  usePageTitle("Admin - Trust Architecture");

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const getTrustArchitectureHtml = () => {
    const allContent = sections
      .map((s) => {
        let html = `<div class="section-title">Section ${s.number}: ${s.title}</div>`;
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
  <title>Trust Architecture: Structural Blueprint of the Ecclesia Basilikos Trust</title>
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
  <h1>Trust Architecture</h1>
  <div class="doc-subtitle">Structural Blueprint of the Ecclesia Basilikos Trust</div>
  <div class="doc-subtitle" style="font-size: 10pt; color: #888;">Nine Layers \u2022 Fourteen Relationships \u2022 Thirteen Roles</div>
  <div class="doc-date">Published ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
  <hr class="separator" />
  ${allContent}
  <div style="text-align: center; margin-top: 30pt;">
    <div style="font-family: 'Cinzel', serif; font-size: 10pt; text-transform: uppercase; letter-spacing: 0.2em; color: #888;">
      Ecclesia Basilikos Trust
    </div>
    <div style="font-size: 9pt; color: #aaa; margin-top: 4pt;">
      Confidential &bull; For Internal Distribution Only
    </div>
  </div>
</body>
</html>`;
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(getTrustArchitectureHtml());
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  const handleDownload = () => {
    const html = getTrustArchitectureHtml();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Ecclesia_Basilikos_Trust_Architecture.html";
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
                <Layers className="w-3 h-3 mr-1" />
                Internal Document
              </Badge>
              <h1 className="font-cinzel text-2xl font-bold text-slate-800">
                Trust Architecture
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Structural Blueprint of the Ecclesia Basilikos Trust
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
          <Layers className="w-10 h-10 text-royal-gold mx-auto mb-4" />
          <h1 className="font-cinzel text-2xl tracking-[0.12em] text-slate-800 uppercase">
            Trust Architecture
          </h1>
          <p className="font-cinzel text-sm text-slate-500 mt-2 tracking-wide">
            Structural Blueprint of the Ecclesia Basilikos Trust
          </p>
          <div className="mt-4 mx-auto w-32 border-t-2 border-royal-navy/30" />
          <p className="text-xs text-slate-400 mt-4 tracking-widest uppercase">
            Version 1.0 &bull; {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}
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
            Confidential &bull; For Internal Distribution Only
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
