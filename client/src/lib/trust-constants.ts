import {
  Crown,
  Shield,
  Building2,
  Users,
  MapPin,
  Sprout,
  FolderOpen,
  Lightbulb,
  BookOpen,
  Home,
  Briefcase,
  ShieldAlert,
  Scale,
  Handshake,
  HeartHandshake,
  Heart,
  Hammer,
  type LucideIcon,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════
// SHARED TRUST HIERARCHY CONSTANTS
// Biblical ecclesiology: Individual → Covenant Gateway → Body of Christ → Internal Organs → Members
// ═══════════════════════════════════════════════════════════

export const LAYER_CONFIG: Record<string, {
  label: string;
  subtitle: string;
  nodeColor: string;
  nodeBorder: string;
  nodeText: string;
  nodeBg: string;
  icon: typeof Crown;
  defaultEntityType: string;
}> = {
  covenant: {
    label: "Covenant",
    subtitle: "Individual Covenant Gateway",
    nodeColor: "bg-red-900",
    nodeBorder: "border-red-800",
    nodeText: "text-white",
    nodeBg: "bg-red-900",
    icon: Heart,
    defaultEntityType: "covenant",
  },
  body: {
    label: "Body of Christ",
    subtitle: "The Collective Body",
    nodeColor: "bg-slate-700",
    nodeBorder: "border-slate-500",
    nodeText: "text-white",
    nodeBg: "bg-slate-800",
    icon: Crown,
    defaultEntityType: "body",
  },
  stewardship: {
    label: "Stewardship",
    subtitle: "Organs of the Body",
    nodeColor: "bg-teal-600",
    nodeBorder: "border-teal-400",
    nodeText: "text-white",
    nodeBg: "bg-teal-700",
    icon: Shield,
    defaultEntityType: "stewardship",
  },
  assembly: {
    label: "Assembly",
    subtitle: "The Gathered Ecclesia",
    nodeColor: "bg-purple-600",
    nodeBorder: "border-purple-400",
    nodeText: "text-white",
    nodeBg: "bg-purple-700",
    icon: Users,
    defaultEntityType: "assembly",
  },
  region: {
    label: "Region",
    subtitle: "City-Churches",
    nodeColor: "bg-purple-100",
    nodeBorder: "border-purple-400 border-dashed",
    nodeText: "text-purple-800",
    nodeBg: "bg-white",
    icon: MapPin,
    defaultEntityType: "region",
  },
  household: {
    label: "Household",
    subtitle: "House-Churches",
    nodeColor: "bg-purple-100",
    nodeBorder: "border-purple-400 border-dashed",
    nodeText: "text-purple-800",
    nodeBg: "bg-white",
    icon: Sprout,
    defaultEntityType: "household",
  },
  craft: {
    label: "Craft",
    subtitle: "Skilled Workers — Bezalel Pattern",
    nodeColor: "bg-amber-100",
    nodeBorder: "border-amber-500 border-dashed",
    nodeText: "text-amber-800",
    nodeBg: "bg-white",
    icon: Hammer,
    defaultEntityType: "craft",
  },
  ministry: {
    label: "Ministry",
    subtitle: "Service Initiatives — Diakonia",
    nodeColor: "bg-gray-100",
    nodeBorder: "border-gray-400 border-dashed",
    nodeText: "text-gray-700",
    nodeBg: "bg-white",
    icon: FolderOpen,
    defaultEntityType: "ministry",
  },
  member: {
    label: "Member",
    subtitle: "Joint Heirs with Christ",
    nodeColor: "bg-gray-100",
    nodeBorder: "border-gray-400 border-dashed",
    nodeText: "text-gray-700",
    nodeBg: "bg-white",
    icon: Users,
    defaultEntityType: "member",
  },
};

export const RELATIONSHIP_CONFIG: Record<string, {
  label: string;
  color: string;
  strokeColor: string;
  dashed: boolean;
}> = {
  authority:       { label: "Authority",       color: "bg-red-500",     strokeColor: "#dc2626", dashed: false },
  enters:          { label: "Enters",          color: "bg-rose-600",    strokeColor: "#e11d48", dashed: false },
  grants:          { label: "Grants",          color: "bg-gray-800",    strokeColor: "#1f2937", dashed: false },
  funds:           { label: "Funds",           color: "bg-blue-500",    strokeColor: "#2563eb", dashed: false },
  land:            { label: "Land",            color: "bg-green-600",   strokeColor: "#16a34a", dashed: false },
  remits:          { label: "Remits",          color: "bg-purple-500",  strokeColor: "#9333ea", dashed: false },
  establishes_pma: { label: "Gathers Assembly", color: "bg-purple-400", strokeColor: "#a855f7", dashed: true },
  oversees:        { label: "Oversees",        color: "bg-orange-500",  strokeColor: "#ea580c", dashed: true },
  coordinates:     { label: "Coordinates",     color: "bg-gray-500",    strokeColor: "#6b7280", dashed: true },
  benefits:        { label: "Benefits",        color: "bg-teal-500",    strokeColor: "#0d9488", dashed: true },
  shepherds:       { label: "Shepherds",       color: "bg-emerald-600", strokeColor: "#059669", dashed: false },
  teaches:         { label: "Teaches",         color: "bg-sky-600",     strokeColor: "#0284c7", dashed: false },
  serves:          { label: "Serves",          color: "bg-rose-500",    strokeColor: "#f43f5e", dashed: true },
  tithes:          { label: "Tithes",          color: "bg-amber-600",   strokeColor: "#d97706", dashed: false },
};

export const BIBLICAL_LABELS: Record<string, string> = {
  covenant: "Circumcision of Heart (Romans 2:29)",
  body: "Body of Christ (1 Corinthians 12:12-27)",
  stewardship: "Faithful Stewardship (Matthew 25:21)",
  assembly: "Ecclesia (Matthew 16:18)",
  region: "City-Church (Titus 1:5)",
  household: "Oikos — House-Church (Acts 2:46)",
  craft: "Bezalel Pattern (Exodus 35:10)",
  ministry: "Diakonia — Service (Nehemiah 2:18)",
  member: "Joint Heir (Romans 8:17)",
};

export const BIBLICAL_ROLE_LABELS: Record<string, string> = {
  grantor: "Grantor",
  trustee: "Trustee",
  protector: "Protector",
  steward: "Steward",
  beneficiary: "Beneficiary",
  officer: "Officer",
  elder: "Elder (1 Timothy 3:1-7)",
  deacon: "Deacon (1 Timothy 3:8-13)",
  apostle: "Apostle (Ephesians 4:11)",
  prophet: "Prophet (Ephesians 4:11)",
  evangelist: "Evangelist (Ephesians 4:11)",
  pastor: "Pastor (Ephesians 4:11)",
  teacher: "Teacher (Ephesians 4:11)",
};

export const BIBLICAL_RELATIONSHIP_LABELS: Record<string, string> = {
  enters: "Baptized Into (1 Corinthians 12:13)",
  shepherds: "Shepherds (1 Peter 5:2)",
  teaches: "Teaches (Matthew 28:20)",
  serves: "Serves (Mark 10:45)",
  tithes: "Tithes (Malachi 3:10)",
};

export const LAYERS_ORDER = ['covenant', 'body', 'stewardship', 'assembly', 'region', 'household', 'craft', 'ministry', 'member'];

// Plain-English explanations for each layer (public diagram)
export const LAYER_PLAIN_ENGLISH: Record<string, {
  oneLineSummary: string;
  tooltipExplanation: string;
}> = {
  covenant: {
    oneLineSummary: "Your personal covenant with God — the doorway into the Body",
    tooltipExplanation: "Like a baptism or circumcision of heart. This is your individual, irrevocable covenant — the gateway through which you enter the Body of Christ. It's personal, between you and God through Christ.",
  },
  body: {
    oneLineSummary: "The Body of Christ — the collective you willfully enter as a new creation",
    tooltipExplanation: "Once you establish your personal covenant, you enter the Body. Everything else exists within this living organism — stewardship organs, the gathered assembly, regional churches, households, and all members.",
  },
  stewardship: {
    oneLineSummary: "The organs of the Body — each stewarding a specific function",
    tooltipExplanation: "Just as a body has organs with specialized functions (heart, lungs, hands), the Body has stewardship organs: Land, Housing, Treasury, Enterprise, and Education — each faithfully managing one area.",
  },
  assembly: {
    oneLineSummary: "The gathered ecclesia — where the Body comes together",
    tooltipExplanation: "The private assembly where members of the Body gather, govern themselves, make decisions, and participate in community life. The ecclesia — the 'called out' ones.",
  },
  member: {
    oneLineSummary: "You — a member of the Body, a joint heir with Christ",
    tooltipExplanation: "As a member of the Body, you hold beneficial interest in the whole structure. All the organs and assemblies exist to serve you. You entered through the covenant; now you participate as a living member.",
  },
};

// Labels for connectors between adjacent layers
export const CONNECTOR_LABELS: Record<string, string> = {
  "covenant→body": "Baptized into the Body",
  "body→stewardship": "Commissions stewardship",
  "stewardship→assembly": "Serves the assembly",
  "assembly→member": "Benefits flow to members",
};

// Primary structural relationships shown in the public hierarchy diagram
export const PRIMARY_RELATIONSHIPS = ['enters', 'authority', 'grants', 'establishes_pma', 'benefits'];

// Royal-themed layer colors for the public hierarchy diagram
export const LAYER_ROYAL_COLORS: Record<string, {
  bg: string;
  border: string;
  text: string;
  accent: string;
  gradient: string;
}> = {
  covenant: {
    bg: "bg-gradient-to-r from-royal-navy to-royal-burgundy",
    border: "border-royal-gold",
    text: "text-white",
    accent: "text-royal-gold",
    gradient: "from-royal-navy to-royal-burgundy",
  },
  body: {
    bg: "bg-gradient-to-r from-royal-burgundy to-royal-navy",
    border: "border-royal-gold/60",
    text: "text-white",
    accent: "text-royal-gold",
    gradient: "from-royal-burgundy to-royal-navy",
  },
  stewardship: {
    bg: "bg-gradient-to-r from-teal-800 to-teal-900",
    border: "border-teal-400/40",
    text: "text-white",
    accent: "text-teal-300",
    gradient: "from-teal-800 to-teal-900",
  },
  assembly: {
    bg: "bg-gradient-to-r from-purple-800 to-purple-900",
    border: "border-purple-400/40",
    text: "text-white",
    accent: "text-purple-300",
    gradient: "from-purple-800 to-purple-900",
  },
  region: {
    bg: "bg-white",
    border: "border-purple-300",
    text: "text-purple-900",
    accent: "text-purple-600",
    gradient: "from-purple-50 to-white",
  },
  household: {
    bg: "bg-white",
    border: "border-purple-300",
    text: "text-purple-900",
    accent: "text-purple-600",
    gradient: "from-purple-50 to-white",
  },
  craft: {
    bg: "bg-white",
    border: "border-amber-400",
    text: "text-amber-900",
    accent: "text-amber-600",
    gradient: "from-amber-50 to-white",
  },
  ministry: {
    bg: "bg-white",
    border: "border-gray-300",
    text: "text-gray-800",
    accent: "text-gray-500",
    gradient: "from-gray-50 to-white",
  },
  member: {
    bg: "bg-gradient-to-r from-royal-gold/20 to-amber-100",
    border: "border-royal-gold",
    text: "text-royal-navy",
    accent: "text-royal-gold",
    gradient: "from-royal-gold/20 to-amber-100",
  },
};

// Static fallback hierarchy for when no API data is available
export interface FallbackEntity {
  id: string;
  name: string;
  subtitle: string;
  layer: string;
  entityType: string;
}

export const FALLBACK_ENTITIES: FallbackEntity[] = [
  { id: "f-covenant", name: "New Covenant Legacy Trust", subtitle: "Individual Covenant Gateway", layer: "covenant", entityType: "covenant" },
  { id: "f-body", name: "Ecclesia Basilikos", subtitle: "Body of Christ", layer: "body", entityType: "body" },
  { id: "f-land", name: "Land Trust", subtitle: "Stewardship of Land", layer: "stewardship", entityType: "stewardship" },
  { id: "f-housing", name: "Housing Trust", subtitle: "Shelter & Buildings", layer: "stewardship", entityType: "stewardship" },
  { id: "f-treasury", name: "Treasury Trust", subtitle: "Finances & Resources — Managed by Financial Trustee", layer: "stewardship", entityType: "stewardship" },
  { id: "f-enterprise", name: "Enterprise Trust", subtitle: "Commerce & Innovation", layer: "stewardship", entityType: "stewardship" },
  { id: "f-education", name: "Education Trust", subtitle: "Knowledge & Training", layer: "stewardship", entityType: "stewardship" },
  { id: "f-assembly", name: "Private Membership Association", subtitle: "The Gathered Ecclesia", layer: "assembly", entityType: "assembly" },
  { id: "f-member", name: "Members of the Body", subtitle: "Joint Heirs with Christ (Romans 8:17)", layer: "member", entityType: "member" },
];

// ═══════════════════════════════════════════════════════════
// PERSPECTIVE TOGGLE DATA
// ═══════════════════════════════════════════════════════════

export type PerspectiveId = "howItWorks" | "realWorld" | "biblical";

export interface PerspectiveConfig {
  id: PerspectiveId;
  label: string;
  icon: typeof Crown;
  introHint: string;
  layers: Record<string, { oneLineSummary: string; tooltipExplanation: string }>;
  connectors: Record<string, string>;
}

export const PERSPECTIVES: PerspectiveConfig[] = [
  {
    id: "howItWorks",
    label: "How It Works",
    icon: Lightbulb,
    introHint: "You start with a personal covenant, then enter the Body. Everything operates within.",
    layers: { ...LAYER_PLAIN_ENGLISH },
    connectors: { ...CONNECTOR_LABELS },
  },
  {
    id: "realWorld",
    label: "Real-World Analogy",
    icon: Building2,
    introHint: "Think of it like an oath of allegiance, citizenship, and the nation's institutions.",
    layers: {
      covenant: {
        oneLineSummary: "Like an oath of allegiance — your personal commitment that makes you eligible to enter",
        tooltipExplanation: "Before you become a citizen, you take an oath. The covenant is your personal declaration — your commitment to the principles and purpose of the community.",
      },
      body: {
        oneLineSummary: "The nation itself — the collective body you enter through your oath",
        tooltipExplanation: "Once you take the oath, you become part of the nation. All institutions, services, and protections exist within this body. You are now a member.",
      },
      stewardship: {
        oneLineSummary: "The nation's departments — housing authority, treasury, land office",
        tooltipExplanation: "Just like a nation has separate departments for housing, finance, and land management, the Body has stewardship organs that each handle one area with dedicated focus.",
      },
      assembly: {
        oneLineSummary: "The town hall — where citizens gather, vote, and govern",
        tooltipExplanation: "The assembly is the civic gathering place where members come together to participate in governance, much like a town hall meeting.",
      },
      member: {
        oneLineSummary: "You, the citizen — every institution exists to serve you",
        tooltipExplanation: "As a citizen of this nation, every department and institution exists to protect and benefit you. You entered through your oath; now you participate fully.",
      },
    },
    connectors: {
      "covenant→body": "Oath grants citizenship →",
      "body→stewardship": "Nation establishes departments →",
      "stewardship→assembly": "Departments serve the assembly →",
      "assembly→member": "Assembly represents citizens →",
    },
  },
  {
    id: "biblical",
    label: "Biblical Foundation",
    icon: BookOpen,
    introHint: "Circumcision of heart → Baptized into the Body → Body with many members.",
    layers: {
      covenant: {
        oneLineSummary: "Circumcision of heart — 'I will put my law in their inward parts' (Jer 31:33)",
        tooltipExplanation: "The covenant is the circumcision of heart (Romans 2:29) — your personal transformation through Christ. The old man dies, the new man is born. This is the doorway into the Body.",
      },
      body: {
        oneLineSummary: "The Body of Christ — 'by one Spirit are we all baptized into one body' (1 Cor 12:13)",
        tooltipExplanation: "Through the covenant, you are baptized into one Body. Christ is the Head; we are the members. Everything exists within this living organism — stewardship, assembly, and all ministry.",
      },
      stewardship: {
        oneLineSummary: "Faithful stewardship — 'well done, good and faithful servant' (Matt 25:21)",
        tooltipExplanation: "Each stewardship organ is like a member of the Body with a specific function — the hand, the eye, the foot. Each entrusted with specific resources to manage faithfully for the whole Body.",
      },
      assembly: {
        oneLineSummary: "The ecclesia — 'upon this rock I will build my ecclesia' (Matt 16:18)",
        tooltipExplanation: "The assembly is the gathered ecclesia — the called-out ones within the Body, governing themselves according to scriptural principles.",
      },
      member: {
        oneLineSummary: "Joint heir with Christ — 'heirs of God and co-heirs with Christ' (Rom 8:17)",
        tooltipExplanation: "As a member of the Body, you are a joint heir. You entered through the covenant; now you are a living member — receiving and giving, served and serving.",
      },
    },
    connectors: {
      "covenant→body": "Circumcision of heart → Baptized into →",
      "body→stewardship": "Body commissions organs →",
      "stewardship→assembly": "Stewards serve the ecclesia →",
      "assembly→member": "Ecclesia nurtures members →",
    },
  },
];

export const FALLBACK_RELATIONSHIPS = [
  { fromId: "f-covenant", toId: "f-body", type: "enters" },
  { fromId: "f-body", toId: "f-land", type: "grants" },
  { fromId: "f-body", toId: "f-housing", type: "grants" },
  { fromId: "f-body", toId: "f-treasury", type: "grants" },
  { fromId: "f-body", toId: "f-enterprise", type: "grants" },
  { fromId: "f-body", toId: "f-education", type: "grants" },
  { fromId: "f-body", toId: "f-assembly", type: "establishes_pma" },
  { fromId: "f-assembly", toId: "f-member", type: "benefits" },
];

// ═══════════════════════════════════════════════════════════
// GUIDED WALKTHROUGH STEPS
// Step-by-step tour starting from the individual's covenant
// ═══════════════════════════════════════════════════════════

export interface WalkthroughStep {
  layer: string;
  title: string;
  eli5: string;
  detail: string;
  analogy: string;
}

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    layer: "covenant",
    title: "Your Personal Covenant",
    eli5: "This is where it all begins — just you and God. You make a personal commitment, like a vow or a baptism.",
    detail: "The New Covenant Legacy Trust is your individual covenant gateway — an irrevocable declaration of faith and commitment. Like the circumcision of heart described in Romans 2:29, this is a personal transformation. The old man dies; the new man is born. Through this covenant, you become eligible to enter the Body.",
    analogy: "Think of it like taking an oath of allegiance before becoming a citizen. You can't participate in the nation until you've made your personal commitment.",
  },
  {
    layer: "body",
    title: "Entering the Body",
    eli5: "Once you've made your covenant, you enter a living community — the Body of Christ. Everything else exists inside here.",
    detail: "Ecclesia Basilikos is the Body of Christ — the collective assembly of all who have entered through the covenant. 'By one Spirit are we all baptized into one body' (1 Corinthians 12:13). The Body commissions stewardship organs, gathers the assembly, establishes regional churches, and nurtures households. Christ is the Head; you are a member.",
    analogy: "Like becoming a citizen of a nation. Once you're in, all the nation's institutions, protections, and services are available to you.",
  },
  {
    layer: "stewardship",
    title: "The Body's Organs",
    eli5: "Just like your body has a heart, lungs, and hands — each doing a specific job — the Body of Christ has organs too. Each one manages a different type of resource.",
    detail: "Within the Body, five stewardship organs handle specific functions: Land Trust stewards property, Housing Trust provides shelter, Treasury Trust manages finances under the Financial Trustee who can invest in assets including crypto, Enterprise Trust handles business and digital infrastructure, and Education Trust handles knowledge. If one organ faces trouble, the others are protected. 50% of all member contributions flow into the Treasury Trust.",
    analogy: "Like organs in your body — your heart pumps blood, your lungs breathe, your hands work. If you break a finger, your heart keeps beating. Isolation protects the whole.",
  },
  {
    layer: "assembly",
    title: "The Gathered Ecclesia",
    eli5: "This is where everyone in the Body comes together — to worship, to govern, to decide things as a community.",
    detail: "The Private Membership Association is the gathered ecclesia within the Body — a constitutionally-protected private assembly where members govern themselves, make decisions, and participate in community life. 'Upon this rock I will build my ecclesia' (Matthew 16:18). It organizes regions, households, crafts, and ministries.",
    analogy: "Like the town hall of a nation — where citizens gather, vote, and make their voices heard. Your assembly is where the Body comes alive in community.",
  },
  {
    layer: "member",
    title: "You — A Living Member",
    eli5: "This is you again, but now you're inside. You're not just looking at the structure from outside — you're a living part of it.",
    detail: "As a member of the Body, you hold a Beneficial Unit — an equal, undivided interest in the trust corpus. You entered through the covenant; now you participate fully as a joint heir with Christ (Romans 8:17). Every stewardship organ, every assembly, every ministry exists to serve you — and you serve them in return.",
    analogy: "Like a cell in a body — you receive nutrients from the whole organism, and you contribute your unique function back. The Body needs you, and you need the Body.",
  },
];

// ═══════════════════════════════════════════════════════════
// SCENARIO EXPLORER
// "What happens when..." interactive scenarios
// ═══════════════════════════════════════════════════════════

export interface TrustScenario {
  id: string;
  icon: LucideIcon;
  question: string;
  shortLabel: string;
  highlightLayers: string[];
  flowDirection: "down" | "up";
  steps: Array<{
    layer: string;
    action: string;
  }>;
  outcome: string;
}

export const TRUST_SCENARIOS: TrustScenario[] = [
  {
    id: "property-attack",
    icon: ShieldAlert,
    question: "Someone tries to seize your property",
    shortLabel: "Asset Protection",
    highlightLayers: ["covenant", "body", "stewardship"],
    flowDirection: "down",
    steps: [
      { layer: "covenant", action: "Your covenant declares all assets are held in trust — they're not \"yours\" to be seized personally" },
      { layer: "body", action: "The Body asserts its authority — it's the legal steward, not any individual" },
      { layer: "stewardship", action: "The Land Trust or Housing Trust holds the specific asset as an organ of the Body with its own protections" },
      { layer: "member", action: "You still benefit from the asset, but there's nothing in your name for a creditor to grab" },
    ],
    outcome: "Your assets are shielded by multiple layers of trust law within the Body. A creditor would have to pierce through every layer — which is nearly impossible when the structure is properly maintained.",
  },
  {
    id: "start-business",
    icon: Briefcase,
    question: "You want to start a business",
    shortLabel: "New Business",
    highlightLayers: ["assembly", "stewardship", "body"],
    flowDirection: "up",
    steps: [
      { layer: "member", action: "You propose a business idea to the Body" },
      { layer: "assembly", action: "The assembly reviews and approves the venture through member governance" },
      { layer: "stewardship", action: "The Enterprise Trust provides the structure, funding, and liability protection" },
      { layer: "body", action: "The Body ensures the business aligns with the covenant's mission" },
    ],
    outcome: "Your business operates under the Enterprise Trust's umbrella — giving you liability protection, shared resources, and community support without the overhead of forming your own corporation.",
  },
  {
    id: "need-housing",
    icon: Home,
    question: "You need a place to live",
    shortLabel: "Housing",
    highlightLayers: ["stewardship", "assembly", "member"],
    flowDirection: "down",
    steps: [
      { layer: "body", action: "The Body has already established housing as a core mission" },
      { layer: "stewardship", action: "The Housing Trust manages available properties and builds new ones" },
      { layer: "assembly", action: "The assembly coordinates community needs and allocation priorities" },
      { layer: "member", action: "You receive housing as a beneficial right — not as a tenant, but as a member of the Body" },
    ],
    outcome: "You don't rent and you don't have a mortgage. You occupy housing as a member of the Body — your right to housing is protected by the covenant itself.",
  },
  {
    id: "dispute",
    icon: Scale,
    question: "Two members have a disagreement",
    shortLabel: "Disputes",
    highlightLayers: ["assembly", "body", "covenant"],
    flowDirection: "up",
    steps: [
      { layer: "assembly", action: "The dispute is first handled within the assembly through internal mediation and community governance" },
      { layer: "body", action: "If unresolved, the Body can intervene with binding arbitration through the elder council" },
      { layer: "covenant", action: "The covenant provides the ultimate principles that guide any decision" },
    ],
    outcome: "Disputes stay private and are resolved internally — no courts, no lawyers, no public records. The covenant principles ensure fair, consistent outcomes.",
  },
  {
    id: "new-member",
    icon: Handshake,
    question: "Someone new wants to join",
    shortLabel: "New Members",
    highlightLayers: ["covenant", "body", "member"],
    flowDirection: "down",
    steps: [
      { layer: "covenant", action: "The individual establishes their personal covenant — their commitment and circumcision of heart" },
      { layer: "body", action: "Through the covenant, they are baptized into the Body" },
      { layer: "assembly", action: "The assembly welcomes them and processes their membership" },
      { layer: "member", action: "They receive their beneficial unit and full access to the Body's benefits" },
    ],
    outcome: "New members enter through a personal covenant with God, not just an organizational application. They are baptized into the Body and gain protected rights as joint heirs from day one.",
  },
  {
    id: "generational",
    icon: HeartHandshake,
    question: "You want to pass wealth to your children",
    shortLabel: "Inheritance",
    highlightLayers: ["covenant", "body", "member"],
    flowDirection: "down",
    steps: [
      { layer: "covenant", action: "The covenant establishes perpetual trust provisions — no expiration date" },
      { layer: "body", action: "The Body manages succession planning and beneficiary designation" },
      { layer: "member", action: "Your children establish their own covenant, enter the Body, and inherit beneficial interest — not taxable assets" },
    ],
    outcome: "Wealth passes through the Body, not through probate. No estate tax, no public records, no court involvement. Your children enter through their own covenant and inherit as joint heirs.",
  },
];

// ═══════════════════════════════════════════════════════════
// DEEP DIVE CONTENT
// Click-to-expand detailed explanations per layer
// ═══════════════════════════════════════════════════════════

export interface DeepDiveContent {
  eli5: string;
  realExamples: string[];
  faq: Array<{ q: string; a: string }>;
  keyTakeaway: string;
}

export const LAYER_DEEP_DIVE: Record<string, DeepDiveContent> = {
  covenant: {
    eli5: "Imagine you want to join a special treehouse club. Before you can go inside, you have to make a pinky promise — a real, serious promise — that you'll follow the rules and take care of the treehouse. That promise is your covenant. It's just between you and the club founders. Once you make it, the door opens.",
    realExamples: [
      "An oath of allegiance before becoming a citizen of a new country",
      "Baptism — a public declaration of personal faith and transformation",
      "A marriage vow — an irrevocable personal commitment between two parties",
    ],
    faq: [
      { q: "Is this covenant just paperwork?", a: "No. It represents a genuine spiritual and legal commitment — a circumcision of heart (Romans 2:29). It's the doorway through which you enter the Body, not just a form to fill out." },
      { q: "Can I revoke my covenant?", a: "The covenant is irrevocable — like baptism, you can't un-do it. However, you can voluntarily withdraw from active participation in the Body." },
      { q: "Why does entry start here and not at the community?", a: "Because the relationship with God comes first. You don't join an organization — you make a personal covenant, and through that covenant you enter a living Body. The individual comes before the collective." },
    ],
    keyTakeaway: "The covenant is your personal gateway. It's not about joining a club — it's about a transformation. Through this covenant, you die to the old and enter the Body as a new creation.",
  },
  body: {
    eli5: "Once you've made your promise, you step inside the treehouse. And wow — it's not just a treehouse, it's a whole little city in there! There's a kitchen, a workshop, a library, a meeting room, and lots of friends. Everything you need is inside.",
    realExamples: [
      "A nation — once you're a citizen, all the nation's institutions serve you",
      "The human body — a living organism where every organ works together for the whole",
      "The early church in Acts — 'all that believed were together and had all things common' (Acts 2:44)",
    ],
    faq: [
      { q: "What's the difference between the covenant and the Body?", a: "The covenant is your personal gateway — it's between you and God. The Body is the collective you enter through that gateway. The covenant sits outside/above the Body; everything else exists within it." },
      { q: "Who leads the Body?", a: "Christ is the Head (Colossians 1:18). Appointed trustees and the Protector Council steward the Body's operations, accountable to the covenant's principles." },
      { q: "Can the Body exist without the covenant?", a: "No. The covenant is the foundation. Without it, the Body has no authority, no members, and no purpose. Every member enters through the covenant." },
    ],
    keyTakeaway: "The Body of Christ is a living organism, not an organization chart. Everything exists within it — stewardship, assembly, regions, households, crafts, ministries, and all members. You entered through the covenant; now you're a living part of the whole.",
  },
  stewardship: {
    eli5: "Inside the treehouse city, there are different people in charge of different things. One person takes care of the garden (land), another manages the kitchen (food/finances), another builds and fixes rooms (housing), another runs the shop (business), and another teaches everyone new skills. Each has their own job so nothing gets forgotten.",
    realExamples: [
      "Organs in a body — the heart pumps blood, the lungs breathe, the hands work",
      "A university with separate endowments for scholarships, research, and buildings",
      "A government with separate departments for defense, education, and health",
    ],
    faq: [
      { q: "Why separate stewardship organs instead of one big trust?", a: "Liability isolation. If the Enterprise Trust gets sued, the Land Trust's properties are completely untouched. Like organs in a body — if you break a finger, your heart keeps beating." },
      { q: "How many stewardship organs are there?", a: "Currently five: Land, Housing, Treasury, Enterprise, and Education. More can be created as the Body grows." },
      { q: "Who runs each stewardship organ?", a: "Each has its own appointed stewards, but they all serve the Body. Specialized expertise with collective accountability." },
    ],
    keyTakeaway: "Separating stewardship into specialized organs isn't just organization — it's protection. Like a body with many members, each organ serves a vital function, and a problem in one never cascades to another.",
  },
  assembly: {
    eli5: "Inside the treehouse city, there's a big meeting room where everyone gathers. This is where you talk about what to build next, who needs help, and how to make things better. Everyone gets a voice.",
    realExamples: [
      "A town hall where citizens gather to govern and make decisions",
      "The early church in Acts — 'they continued steadfastly in the apostles' doctrine and fellowship' (Acts 2:42)",
      "A private club with its own constitution and membership rules",
    ],
    faq: [
      { q: "Is the assembly the same as a PMA?", a: "Yes — the assembly is structured as a Private Membership Association, a constitutionally-protected private gathering. It's the legal form the gathered ecclesia takes." },
      { q: "Can the government regulate the assembly?", a: "Internal governance of a PMA is largely beyond government regulation, as long as members joined voluntarily. The right of private association is protected by the 1st and 14th Amendments." },
      { q: "How is this different from a corporation?", a: "A corporation is a creature of the state. The assembly is a creature of the people — it exists by the members' natural right to associate, within the Body." },
    ],
    keyTakeaway: "The assembly is where the Body comes alive in community. It's where your voice matters, where decisions are made collectively, and where your right to private association provides a constitutional shield.",
  },
  member: {
    eli5: "You're in the treehouse city now. You get to use the garden, eat in the kitchen, live in a room, learn in the library, and help in the workshop. And everyone else does the same for you. You're not just visiting — you belong here.",
    realExamples: [
      "A citizen of a nation — benefiting from and contributing to the whole",
      "A cell in a body — receiving nutrients and performing its unique function",
      "Joint heirs in a family trust — each sharing equally in the inheritance",
    ],
    faq: [
      { q: "What does 'beneficial interest' actually mean?", a: "It means you have the right to benefit from the Body's resources — to use the housing, access the land, participate in enterprise — even though you don't hold legal title." },
      { q: "Can my beneficial interest be taken?", a: "Beneficial interest in a properly structured trust is extremely difficult to seize. It's not property in the traditional sense — it's a right held within the Body." },
      { q: "What's a beneficial unit?", a: "It's your certificate of membership in the Body — proof that you're a recognized member with an equal, undivided interest (1/N) in the trust corpus." },
    ],
    keyTakeaway: "Being a member of the Body is both receiving and giving. You entered through the covenant; now every organ, every assembly, every ministry exists to serve you — and you serve them in return. The entire Body exists for its members.",
  },
};
