/**
 * Legal Dictionary Search Engine
 *
 * Client-side search engine with weighted scoring, fuzzy matching,
 * Latin normalization, cross-reference detection, auto-classification,
 * and semantic keyword expansion.
 */

// ─── Types ───────────────────────────────────────────────────────────

export interface DictionaryEntry {
  id: string;
  term: string;
  termLower: string;
  definition: string;
  letter: string;
  subContext: string | null;
  pageNumber: number | null;
  createdAt: string;
}

export type LegalCategory =
  | "Writs & Remedies"
  | "Property & Land"
  | "Criminal Law"
  | "Civil Procedure"
  | "Equity"
  | "Common Law"
  | "Contract Law"
  | "Constitutional Law"
  | "Ecclesiastical Law"
  | "Maritime & Admiralty"
  | "Trust & Estate"
  | "Evidence"
  | "Persons & Status"
  | "Commercial Law"
  | "General";

export type LegalStatus = "Active" | "Historical" | "Abolished";
export type JurisdictionType = "Common Law" | "Civil Law" | "Equity" | "Canon Law" | "General";
export type LegalDomain = "Law" | "Equity" | "Both";

export interface EnrichedResult {
  entry: DictionaryEntry;
  score: number;
  category: LegalCategory;
  status: LegalStatus;
  jurisdiction: JurisdictionType;
  domain: LegalDomain;
  preview: string;
  crossReferences: CrossReference[];
  relatedTerms: string[];
  matchType: "exact" | "prefix" | "contains" | "fuzzy" | "semantic" | "definition";
  highlightRanges: HighlightRange[];
}

export interface CrossReference {
  term: string;
  raw: string;
}

export interface HighlightRange {
  field: "term" | "definition";
  start: number;
  end: number;
}

export interface SearchFilters {
  category?: LegalCategory;
  status?: LegalStatus;
  jurisdiction?: JurisdictionType;
  domain?: LegalDomain;
}

export interface SearchResult {
  results: EnrichedResult[];
  suggestions: string[];
  totalMatched: number;
  queryTime: number;
}

// ─── Latin Normalization ─────────────────────────────────────────────

const LATIN_MAP: Record<string, string> = {
  "æ": "ae", "Æ": "Ae",
  "œ": "oe", "Œ": "Oe",
  "ë": "e", "ï": "i", "ü": "u", "ö": "o", "ä": "a",
  "é": "e", "è": "e", "ê": "e",
  "á": "a", "à": "a", "â": "a",
  "í": "i", "ì": "i", "î": "i",
  "ó": "o", "ò": "o", "ô": "o",
  "ú": "u", "ù": "u", "û": "u",
  "ñ": "n", "ç": "c",
};

function normalizeLatinChars(text: string): string {
  return text.replace(/[æÆœŒëïüöäéèêáàâíìîóòôúùûñç]/g, (ch) => LATIN_MAP[ch] || ch);
}

export function normalizeForSearch(text: string): string {
  return normalizeLatinChars(text).toLowerCase().trim();
}

// ─── Levenshtein Distance ────────────────────────────────────────────

function levenshteinDistance(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  // Use two rows instead of full matrix for memory efficiency
  let prev = new Array(n + 1);
  let curr = new Array(n + 1);

  for (let j = 0; j <= n; j++) prev[j] = j;

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,       // deletion
        curr[j - 1] + 1,   // insertion
        prev[j - 1] + cost  // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

// ─── Cross-Reference Detection ───────────────────────────────────────

const CROSS_REF_PATTERNS = [
  /\bSee\s+([A-Z][A-Za-z\s,;]+?)(?:\.|$)/g,
  /\bSee also\s+([A-Z][A-Za-z\s,;]+?)(?:\.|$)/g,
  /\bCf\.\s+([A-Z][A-Za-z\s,;]+?)(?:\.|$)/g,
  /\bCompare\s+([A-Z][A-Za-z\s,;]+?)(?:\.|$)/g,
  /\bSyn\.\s+([A-Z][A-Za-z\s,;]+?)(?:\.|$)/g,
];

function extractCrossReferences(definition: string): CrossReference[] {
  const refs: CrossReference[] = [];
  const seen = new Set<string>();

  for (const pattern of CROSS_REF_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match: RegExpExecArray | null;
    while ((match = regex.exec(definition)) !== null) {
      const raw = match[0];
      const termsStr = match[1];
      // Split on ; or , to get individual terms
      const terms = termsStr.split(/[;,]/).map(t => t.trim()).filter(t => t.length > 1);
      for (const term of terms) {
        const clean = term.replace(/\.$/, "").trim();
        if (clean.length > 1 && !seen.has(clean.toLowerCase())) {
          seen.add(clean.toLowerCase());
          refs.push({ term: clean, raw });
        }
      }
    }
  }
  return refs;
}

// ─── Category Classification ─────────────────────────────────────────

const CATEGORY_RULES: [RegExp, LegalCategory][] = [
  [/\bwrit\b|\bmandamus\b|\bcertiorari\b|\bhabeas\s+corpus\b|\binjunction\b|\bremedy\b|\bprohibition\b|\bquo\s+warranto\b|\bscire\s+facias\b|\breplevin\b|\bdetinue\b|\btrover\b|\btrespass\b|\bejectment\b/i, "Writs & Remedies"],
  [/\bproperty\b|\bland\b|\btenure\b|\bfee\s+simple\b|\bfreehold\b|\bestate\b|\bseisin\b|\bconveyance\b|\bmortgage\b|\blease\b|\beasement\b|\bcovenant\b.*\bland\b/i, "Property & Land"],
  [/\bfelony\b|\bmisdemeanor\b|\bcriminal\b|\boffence\b|\boffense\b|\bindictment\b|\barraignment\b|\bplea\b.*\bguilty\b|\bsentence\b|\bpunishment\b|\blarceny\b|\bmurder\b|\bmanslaughter\b|\barson\b|\bburglary\b|\brobbery\b/i, "Criminal Law"],
  [/\bequity\b|\bchancery\b|\binjunctive\b|\bspecific\s+performance\b|\btrust\b|\bfiduciary\b|\bconscience\b|\bclean\s+hands\b|\blaches\b|\bestoppel\b/i, "Equity"],
  [/\bpleading\b|\bdemurrer\b|\bmotion\b|\bjudgment\b|\bverdict\b|\bjury\b|\btrial\b|\bsummons\b|\bcomplaint\b|\banswer\b|\bdiscovery\b|\bdeposition\b|\bsubpoena\b|\bcontinuance\b/i, "Civil Procedure"],
  [/\bcommon\s+law\b|\bprecedent\b|\bstare\s+decisis\b|\bcustom\b|\bimmemorial\b/i, "Common Law"],
  [/\bcontract\b|\bagreement\b|\bconsideration\b|\boffer\b|\bacceptance\b|\bbreach\b|\bperformance\b|\bwarranty\b|\bindemnity\b|\bstipulation\b/i, "Contract Law"],
  [/\bconstitution\b|\bamendment\b|\bdue\s+process\b|\bsovereign\b|\blegislat\b|\bstatute\b|\bparliament\b/i, "Constitutional Law"],
  [/\becclesiastical\b|\bcanon\b|\bchurch\b|\breligious\b|\bclerical\b|\bbishop\b|\bparish\b|\btithe\b/i, "Ecclesiastical Law"],
  [/\bmaritime\b|\badmiralty\b|\bnaval\b|\bship\b|\bvessel\b|\bcargo\b|\bsalvage\b|\bbottomry\b|\bbarratry\b|\bpilotage\b|\bflotsam\b|\bjetsam\b/i, "Maritime & Admiralty"],
  [/\btrust\b|\bestate\b|\bwill\b|\btestament\b|\bprobate\b|\bexecutor\b|\badministrator\b|\bbeneficiary\b|\btrustee\b|\bdevise\b|\bbequest\b|\binheritance\b|\btestate\b|\bintestate\b/i, "Trust & Estate"],
  [/\bevidence\b|\bwitness\b|\btestimony\b|\bhearsay\b|\bpresumption\b|\bburden\s+of\s+proof\b|\badmissible\b|\bcompetent\b/i, "Evidence"],
  [/\bperson\b|\bstatus\b|\bcitizen\b|\balien\b|\binfant\b|\bminor\b|\bguardian\b|\bward\b|\bmarriage\b|\bdivorce\b|\bdomicile\b/i, "Persons & Status"],
  [/\bcommerce\b|\bmerchant\b|\btrade\b|\bbill\s+of\s+exchange\b|\bnegotiable\b|\binsurance\b|\bpartnership\b|\bcorporation\b|\bbankruptcy\b|\binsolvency\b/i, "Commercial Law"],
];

function classifyCategory(term: string, definition: string, subContext: string | null): LegalCategory {
  // First check subContext for a direct match
  if (subContext) {
    const ctx = subContext.toLowerCase();
    if (ctx.includes("criminal")) return "Criminal Law";
    if (ctx.includes("equity") || ctx.includes("chancery")) return "Equity";
    if (ctx.includes("maritime") || ctx.includes("admiralty")) return "Maritime & Admiralty";
    if (ctx.includes("ecclesiastical") || ctx.includes("canon")) return "Ecclesiastical Law";
    if (ctx.includes("property") || ctx.includes("real")) return "Property & Land";
    if (ctx.includes("contract")) return "Contract Law";
    if (ctx.includes("evidence")) return "Evidence";
    if (ctx.includes("common law")) return "Common Law";
    if (ctx.includes("civil law")) return "Civil Procedure";
    if (ctx.includes("commercial") || ctx.includes("mercantile")) return "Commercial Law";
  }

  const combined = `${term} ${definition}`;
  for (const [pattern, category] of CATEGORY_RULES) {
    if (pattern.test(combined)) return category;
  }
  return "General";
}

// ─── Status Detection ────────────────────────────────────────────────

const ABOLISHED_PATTERNS = [
  /\babolished\b/i, /\bno\s+longer\s+in\s+use\b/i, /\bobsolete\b/i,
  /\bsuperseded\b/i, /\brepeal(?:ed)?\b/i, /\bdefunct\b/i,
  /\bformerly\b/i, /\bhistorical(?:ly)?\b/i, /\barchaic\b/i,
];

const HISTORICAL_PATTERNS = [
  /\bold\s+english\b/i, /\banglo[\s-]saxon\b/i, /\bmedieval\b/i,
  /\bfeudal\b/i, /\bancient\b/i, /\bRoman\s+law\b/i,
  /\bwas\s+(?:formerly|once|originally)\b/i, /\bin\s+early\s+law\b/i,
  /\bunder\s+the\s+old\b/i, /\bcommon[\s-]law\s+writ\b/i,
];

function detectStatus(definition: string): LegalStatus {
  for (const pattern of ABOLISHED_PATTERNS) {
    if (pattern.test(definition)) return "Abolished";
  }
  for (const pattern of HISTORICAL_PATTERNS) {
    if (pattern.test(definition)) return "Historical";
  }
  return "Active";
}

// ─── Jurisdiction & Domain Detection ─────────────────────────────────

function detectJurisdiction(term: string, definition: string, subContext: string | null): JurisdictionType {
  const combined = `${subContext || ""} ${term} ${definition}`;
  if (/\bcivil\s+law\b|\bRoman\s+law\b|\bcode\s+civil\b/i.test(combined)) return "Civil Law";
  if (/\bequity\b|\bchancery\b/i.test(combined)) return "Equity";
  if (/\bcanon\s+law\b|\becclesiastical\b/i.test(combined)) return "Canon Law";
  if (/\bcommon\s+law\b/i.test(combined)) return "Common Law";
  return "General";
}

function detectDomain(definition: string, category: LegalCategory): LegalDomain {
  if (category === "Equity") return "Equity";
  if (/\bequity\b|\bchancery\b|\bequitable\b/i.test(definition)) {
    if (/\blaw\b|\blegal\b|\bcommon\s+law\b/i.test(definition)) return "Both";
    return "Equity";
  }
  return "Law";
}

// ─── Semantic Keyword Index ──────────────────────────────────────────

const SEMANTIC_EXPANSIONS: Record<string, string[]> = {
  "possession": ["seisin", "seizin", "occupancy", "holding", "tenure", "detinue", "trover", "replevin", "bailment", "custody", "adverse possession"],
  "ownership": ["title", "fee simple", "freehold", "estate", "seisin", "dominion", "proprietary"],
  "remedy": ["writ", "relief", "damages", "injunction", "mandamus", "replevin", "habeas corpus", "certiorari", "prohibition", "restitution"],
  "contract": ["agreement", "covenant", "obligation", "consideration", "promise", "stipulation", "indenture", "bond"],
  "court": ["tribunal", "bench", "bar", "judicature", "chancery", "exchequer", "assize"],
  "crime": ["felony", "misdemeanor", "offense", "indictment", "larceny", "murder", "manslaughter", "arson", "burglary"],
  "property": ["estate", "land", "tenement", "hereditament", "chattel", "realty", "personalty", "fee"],
  "trust": ["fiduciary", "trustee", "beneficiary", "cestui que trust", "settler", "corpus", "res"],
  "evidence": ["proof", "testimony", "witness", "hearsay", "presumption", "admissible"],
  "marriage": ["matrimony", "coverture", "dower", "curtesy", "divorce", "alimony", "consortium"],
  "death": ["decedent", "probate", "intestate", "testate", "executor", "administrator", "inheritance", "devise", "bequest"],
  "fraud": ["deceit", "misrepresentation", "fraudulent", "conveyance", "duress", "undue influence"],
  "debt": ["obligation", "creditor", "debtor", "attachment", "garnishment", "execution", "levy"],
  "negligence": ["tort", "duty", "breach", "causation", "damages", "reasonable care", "proximate cause"],
  "liberty": ["freedom", "habeas corpus", "due process", "rights", "immunity", "privilege"],
  "king": ["sovereign", "crown", "royal", "prerogative", "rex", "regina"],
  "church": ["ecclesiastical", "canon", "bishop", "parish", "tithe", "benefice"],
  "ship": ["vessel", "maritime", "admiralty", "cargo", "salvage", "bottomry", "charter party"],
  "land": ["real property", "estate", "tenement", "freehold", "leasehold", "seisin", "conveyance", "deed"],
  "money": ["currency", "coin", "tender", "payment", "debt", "usury", "interest"],
  "judge": ["justice", "magistrate", "bench", "jurist", "chancellor", "recorder"],
  "lawyer": ["attorney", "counsel", "advocate", "barrister", "solicitor", "proctor"],
  "punishment": ["penalty", "sentence", "fine", "imprisonment", "forfeiture", "attainder"],
  "tax": ["duty", "impost", "excise", "levy", "assessment", "tribute", "toll"],
  "will": ["testament", "codicil", "devise", "bequest", "legacy", "probate", "testate"],
  "agreement": ["contract", "covenant", "compact", "stipulation", "accord"],
  "plaintiff": ["complainant", "petitioner", "claimant", "demandant", "appellant"],
  "defendant": ["respondent", "appellee", "accused", "prisoner"],
};

function getSemanticExpansions(query: string): string[] {
  const normalized = normalizeForSearch(query);
  const expansions: string[] = [];

  for (const [key, related] of Object.entries(SEMANTIC_EXPANSIONS)) {
    if (normalized === key || normalized.includes(key)) {
      expansions.push(...related);
    }
    // Also check if query matches any of the related terms
    for (const rel of related) {
      if (normalizeForSearch(rel) === normalized || normalizeForSearch(rel).includes(normalized)) {
        expansions.push(key);
        expansions.push(...related.filter(r => normalizeForSearch(r) !== normalized));
        break;
      }
    }
  }

  return Array.from(new Set(expansions));
}

// ─── Highlight Computation ───────────────────────────────────────────

function computeHighlights(text: string, queryTokens: string[], field: "term" | "definition"): HighlightRange[] {
  const ranges: HighlightRange[] = [];
  const lower = text.toLowerCase();

  for (const token of queryTokens) {
    if (token.length < 2) continue;
    let idx = 0;
    while (idx < lower.length) {
      const pos = lower.indexOf(token, idx);
      if (pos === -1) break;
      ranges.push({ field, start: pos, end: pos + token.length });
      idx = pos + 1;
    }
  }

  // Merge overlapping ranges
  ranges.sort((a, b) => a.start - b.start);
  const merged: HighlightRange[] = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && last.field === r.field && r.start <= last.end) {
      last.end = Math.max(last.end, r.end);
    } else {
      merged.push({ ...r });
    }
  }
  return merged;
}

// ─── Preview Generation ──────────────────────────────────────────────

function generatePreview(definition: string, maxLen: number = 250): string {
  if (definition.length <= maxLen) return definition;

  // Try to find the first clean definitional sentence
  // Skip leading citations, page numbers, and case references
  const sentences = definition.split(/(?<=\.)\s+/);
  let startIdx = 0;

  for (let i = 0; i < Math.min(sentences.length, 4); i++) {
    const s = sentences[i].trim();
    // Skip fragments that look like citations or page refs
    if (/^\d/.test(s) || /^[A-Z][a-z]+\s+v\.\s/.test(s) || /^\(\d/.test(s) || s.length < 10) {
      startIdx = i + 1;
      continue;
    }
    // Found a sentence starting with a capital letter; use from here
    if (/^[A-Z]/.test(s)) break;
    startIdx = i + 1;
  }

  const cleanDef = sentences.slice(startIdx).join(" ");
  const textToUse = cleanDef.length >= 30 ? cleanDef : definition;

  if (textToUse.length <= maxLen) return textToUse;

  const truncated = textToUse.substring(0, maxLen);
  const lastPeriod = truncated.lastIndexOf(".");
  if (lastPeriod > maxLen * 0.5) {
    return truncated.substring(0, lastPeriod + 1);
  }
  return truncated.trimEnd() + "...";
}

// ─── Scoring ─────────────────────────────────────────────────────────

const SCORE_WEIGHTS = {
  exactTitle: 100,
  prefixTitle: 70,
  containsTitle: 40,
  definitionMatch: 15,
  fuzzyTitle: 15,
  semanticMatch: 10,
  crossRefBonus: 5,
  lengthPenalty: 0.1,
};

function definitionQualityBonus(definition: string): number {
  const len = definition.length;
  if (len >= 500) return 5;
  if (len >= 300) return 4;
  if (len >= 150) return 3;
  if (len >= 80) return 2;
  if (len >= 40) return 1;
  return 0;
}

function scoreEntry(
  entry: DictionaryEntry,
  normalizedQuery: string,
  queryTokens: string[],
  semanticTerms: string[]
): { score: number; matchType: EnrichedResult["matchType"] } {
  const termNorm = normalizeForSearch(entry.term);
  const defNorm = normalizeForSearch(entry.definition);
  const qualityBonus = definitionQualityBonus(entry.definition);

  // Exact title match
  if (termNorm === normalizedQuery) {
    return { score: SCORE_WEIGHTS.exactTitle + qualityBonus, matchType: "exact" };
  }

  // Prefix title match
  if (termNorm.startsWith(normalizedQuery)) {
    const lengthRatio = normalizedQuery.length / termNorm.length;
    return { score: SCORE_WEIGHTS.prefixTitle * (0.5 + 0.5 * lengthRatio) + qualityBonus, matchType: "prefix" };
  }

  // Contains in title
  if (termNorm.includes(normalizedQuery)) {
    return { score: SCORE_WEIGHTS.containsTitle + qualityBonus, matchType: "contains" };
  }

  // Multi-token title matching
  if (queryTokens.length > 1) {
    const matchCount = queryTokens.filter(t => termNorm.includes(t)).length;
    if (matchCount === queryTokens.length) {
      return { score: SCORE_WEIGHTS.containsTitle + 5 + qualityBonus, matchType: "contains" };
    }
    if (matchCount > 0) {
      return { score: SCORE_WEIGHTS.containsTitle * (matchCount / queryTokens.length) + qualityBonus, matchType: "contains" };
    }
  }

  // Definition match: only if query appears in first 300 chars
  const defEarly = defNorm.substring(0, 300);
  const earlyMatchCount = queryTokens.filter(t => defEarly.includes(t)).length;
  if (earlyMatchCount > 0) {
    const tokenRatio = earlyMatchCount / queryTokens.length;
    // For multi-word queries, require at least 50% of tokens to match
    if (queryTokens.length > 1 && tokenRatio < 0.5) {
      // Skip: not enough tokens matched
    } else {
      return { score: SCORE_WEIGHTS.definitionMatch * tokenRatio, matchType: "definition" };
    }
  }

  // Semantic expansion match
  for (const st of semanticTerms) {
    const stNorm = normalizeForSearch(st);
    if (termNorm.includes(stNorm) || stNorm.includes(termNorm)) {
      return { score: SCORE_WEIGHTS.semanticMatch, matchType: "semantic" };
    }
  }

  // Fuzzy title match (Levenshtein)
  if (normalizedQuery.length >= 3) {
    const dist = levenshteinDistance(termNorm, normalizedQuery);
    const maxDist = Math.max(1, Math.floor(normalizedQuery.length * 0.35));
    if (dist <= maxDist) {
      const fuzzyScore = SCORE_WEIGHTS.fuzzyTitle * (1 - dist / (maxDist + 1));
      return { score: fuzzyScore, matchType: "fuzzy" };
    }

    // Also check individual words in multi-word terms
    const termWords = termNorm.split(/\s+/);
    for (const word of termWords) {
      if (word.length >= 3) {
        const wordDist = levenshteinDistance(word, normalizedQuery);
        if (wordDist <= maxDist) {
          return { score: SCORE_WEIGHTS.fuzzyTitle * 0.7 * (1 - wordDist / (maxDist + 1)), matchType: "fuzzy" };
        }
      }
    }
  }

  return { score: 0, matchType: "exact" };
}

// ─── Entry Repair & Validation ───────────────────────────────────────

/**
 * Repair common PDF parsing artifacts where the first word of the definition
 * gets merged into the term (e.g., "INJUNCTION. A" → term "INJUNCTION", def "A prohibitive writ...")
 */
function repairEntry(entry: DictionaryEntry): DictionaryEntry {
  const trailingArticleMatch = entry.term.match(/^(.+?)\.\s+(A|An|The|In|To|Of)\s*$/i);
  if (trailingArticleMatch) {
    const cleanTerm = trailingArticleMatch[1].trim();
    // Only repair if cleaned term contains a real word (3+ consecutive letters)
    if (/[A-Za-z]{3}/.test(cleanTerm)) {
      const article = trailingArticleMatch[2];
      const repairedDef = article.charAt(0).toUpperCase() + article.slice(1).toLowerCase() + " " + entry.definition;
      return {
        ...entry,
        term: cleanTerm,
        termLower: cleanTerm.toLowerCase(),
        definition: repairedDef,
      };
    }
  }
  return entry;
}

function isValidEntry(entry: DictionaryEntry): boolean {
  const term = entry.term.trim();
  const def = entry.definition.trim();

  // Term must be 3+ characters
  if (term.length < 3) return false;

  // Term must be only letters, spaces, hyphens
  if (!/^[A-Za-z][A-Za-z\s\-]*[A-Za-z]$/.test(term) && !/^[A-Za-z]{3,}$/.test(term)) return false;

  // Reject terms ending with trailing articles/prepositions
  if (/\s+(A|AN|THE|OF|TO|IN|AT|BY|FOR|ON|AND)$/i.test(term)) return false;

  // Definition must start with a letter (not "433, 434;...")
  if (!/^[A-Za-z]/.test(def)) return false;

  // Definition must be 10+ characters (allow short cross-reference entries like "See Injunction.")
  if (def.length < 10) return false;

  return true;
}

// ─── Main Search Engine ──────────────────────────────────────────────

export class LegalSearchEngine {
  private entries: DictionaryEntry[] = [];
  private termIndex: Map<string, DictionaryEntry[]> = new Map();
  private keywordIndex: Map<string, Set<string>> = new Map(); // keyword -> entry IDs
  private initialized = false;

  loadEntries(entries: DictionaryEntry[]) {
    this.entries = entries.map(repairEntry).filter(isValidEntry);
    this.buildIndices();
    this.initialized = true;
  }

  get isReady(): boolean {
    return this.initialized;
  }

  get entryCount(): number {
    return this.entries.length;
  }

  private buildIndices() {
    this.termIndex.clear();
    this.keywordIndex.clear();

    for (const entry of this.entries) {
      // Term index by first letter
      const letter = entry.letter.toUpperCase();
      const existing = this.termIndex.get(letter) || [];
      existing.push(entry);
      this.termIndex.set(letter, existing);

      // Keyword index: extract significant words from term and definition
      const termWords = normalizeForSearch(entry.term).split(/\s+/);
      const defWords = normalizeForSearch(entry.definition).split(/\s+/).slice(0, 50); // first 50 words

      for (const word of [...termWords, ...defWords]) {
        if (word.length < 3) continue;
        const set = this.keywordIndex.get(word) || new Set();
        set.add(entry.id);
        this.keywordIndex.set(word, set);
      }
    }
  }

  search(query: string, filters?: SearchFilters, limit: number = 50): SearchResult {
    const startTime = performance.now();

    if (!this.initialized || !query.trim()) {
      return { results: [], suggestions: [], totalMatched: 0, queryTime: 0 };
    }

    const normalizedQuery = normalizeForSearch(query);
    const queryTokens = normalizedQuery.split(/\s+/).filter(t => t.length >= 2);
    const semanticTerms = getSemanticExpansions(query);

    if (queryTokens.length === 0) {
      return { results: [], suggestions: [], totalMatched: 0, queryTime: 0 };
    }

    // Gather candidate entries using index
    const candidateIds = new Set<string>();

    // Add entries matching any query token via keyword index
    for (const token of queryTokens) {
      // Exact keyword
      const exact = this.keywordIndex.get(token);
      if (exact) exact.forEach(id => candidateIds.add(id));

      // Prefix keywords
      this.keywordIndex.forEach((ids, keyword) => {
        if (keyword.startsWith(token) || token.startsWith(keyword)) {
          ids.forEach((id: string) => candidateIds.add(id));
        }
      });
    }

    // Count direct term matches before deciding on semantic expansion
    const entryMapForGating = new Map(this.entries.map(e => [e.id, e]));
    let directTermMatchCount = 0;
    candidateIds.forEach((id) => {
      const entry = entryMapForGating.get(id);
      if (!entry) return;
      const termNorm = normalizeForSearch(entry.term);
      if (termNorm === normalizedQuery || termNorm.startsWith(normalizedQuery) || termNorm.includes(normalizedQuery)) {
        directTermMatchCount++;
      }
    });

    // Only add semantic expansion candidates when direct term matches are few
    if (directTermMatchCount < 5) {
      for (const st of semanticTerms) {
        const stNorm = normalizeForSearch(st);
        const stTokens = stNorm.split(/\s+/);
        for (const sToken of stTokens) {
          const ids = this.keywordIndex.get(sToken);
          if (ids) ids.forEach(id => candidateIds.add(id));
        }
      }
    }

    // If very few candidates from index, also do a brute-force scan for fuzzy
    if (candidateIds.size < 20 && normalizedQuery.length >= 3) {
      for (const entry of this.entries) {
        if (candidateIds.has(entry.id)) continue;
        const termNorm = normalizeForSearch(entry.term);
        const dist = levenshteinDistance(termNorm, normalizedQuery);
        if (dist <= Math.max(1, Math.floor(normalizedQuery.length * 0.35))) {
          candidateIds.add(entry.id);
        }
        // Also check word-level fuzzy for multi-word terms
        const termWords = termNorm.split(/\s+/);
        for (const w of termWords) {
          if (w.length >= 3 && levenshteinDistance(w, normalizedQuery) <= 2) {
            candidateIds.add(entry.id);
          }
        }
      }
    }

    // Score candidates
    const entryMap = new Map(this.entries.map(e => [e.id, e]));
    let scoredResults: EnrichedResult[] = [];

    candidateIds.forEach((id) => {
      const entry = entryMap.get(id);
      if (!entry) return;

      const { score, matchType } = scoreEntry(entry, normalizedQuery, queryTokens, semanticTerms);
      if (score <= 0) return;

      const category = classifyCategory(entry.term, entry.definition, entry.subContext);
      const status = detectStatus(entry.definition);
      const jurisdiction = detectJurisdiction(entry.term, entry.definition, entry.subContext);
      const domain = detectDomain(entry.definition, category);
      const crossReferences = extractCrossReferences(entry.definition);
      const preview = generatePreview(entry.definition);
      const highlightRanges = [
        ...computeHighlights(entry.term, queryTokens, "term"),
        ...computeHighlights(entry.definition, queryTokens, "definition"),
      ];

      // Extract related terms from cross-references
      const relatedTerms = crossReferences.map(cr => cr.term);

      // Apply filters
      if (filters) {
        if (filters.category && category !== filters.category) return;
        if (filters.status && status !== filters.status) return;
        if (filters.jurisdiction && jurisdiction !== filters.jurisdiction) return;
        if (filters.domain && domain !== filters.domain) return;
      }

      // Cross-reference bonus
      const finalScore = score + (crossReferences.length > 0 ? SCORE_WEIGHTS.crossRefBonus : 0);

      scoredResults.push({
        entry,
        score: finalScore,
        category,
        status,
        jurisdiction,
        domain,
        preview,
        crossReferences,
        relatedTerms,
        matchType,
        highlightRanges,
      });
    });

    // Sort by score descending, then alphabetically
    scoredResults.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.entry.term.localeCompare(b.entry.term);
    });

    // Deduplicate: keep only highest-scoring entry per normalized term
    const seenTerms = new Set<string>();
    scoredResults = scoredResults.filter((r) => {
      const key = normalizeForSearch(r.entry.term);
      if (seenTerms.has(key)) return false;
      seenTerms.add(key);
      return true;
    });

    const totalMatched = scoredResults.length;
    scoredResults = scoredResults.slice(0, limit);

    // Generate suggestions if no/few results
    let suggestions: string[] = [];
    if (scoredResults.length < 3 && normalizedQuery.length >= 3) {
      suggestions = this.generateSuggestions(normalizedQuery, 8);
    }

    const queryTime = performance.now() - startTime;

    return {
      results: scoredResults,
      suggestions,
      totalMatched,
      queryTime,
    };
  }

  browseByLetter(letter: string, filters?: SearchFilters, limit: number = 50): EnrichedResult[] {
    const entries = this.termIndex.get(letter.toUpperCase()) || [];

    const results = entries.map(entry => {
      const category = classifyCategory(entry.term, entry.definition, entry.subContext);
      const status = detectStatus(entry.definition);
      const jurisdiction = detectJurisdiction(entry.term, entry.definition, entry.subContext);
      const domain = detectDomain(entry.definition, category);
      const crossReferences = extractCrossReferences(entry.definition);
      const preview = generatePreview(entry.definition);

      const result: EnrichedResult = {
        entry,
        score: 0,
        category,
        status,
        jurisdiction,
        domain,
        preview,
        crossReferences,
        relatedTerms: crossReferences.map(cr => cr.term),
        matchType: "exact",
        highlightRanges: [],
      };

      // Apply filters
      if (filters) {
        if (filters.category && category !== filters.category) return null;
        if (filters.status && status !== filters.status) return null;
        if (filters.jurisdiction && jurisdiction !== filters.jurisdiction) return null;
        if (filters.domain && domain !== filters.domain) return null;
      }

      return result;
    }).filter((r): r is EnrichedResult => r !== null);

    // Deduplicate: keep only first entry per normalized term
    const seenTerms = new Set<string>();
    return results.filter((r) => {
      const key = normalizeForSearch(r.entry.term);
      if (seenTerms.has(key)) return false;
      seenTerms.add(key);
      return true;
    }).slice(0, limit);
  }

  private generateSuggestions(normalizedQuery: string, count: number): string[] {
    const candidates: { term: string; distance: number }[] = [];

    for (const entry of this.entries) {
      const termNorm = normalizeForSearch(entry.term);
      const dist = levenshteinDistance(termNorm, normalizedQuery);
      const maxDist = Math.max(2, Math.floor(normalizedQuery.length * 0.5));

      if (dist <= maxDist && dist > 0) {
        candidates.push({ term: entry.term, distance: dist });
      }

      // Break early if we have enough suggestions
      if (candidates.length > count * 5) break;
    }

    candidates.sort((a, b) => a.distance - b.distance);
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const c of candidates) {
      const lower = c.term.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        unique.push(c.term);
        if (unique.length >= count) break;
      }
    }
    return unique;
  }

  getAvailableLetters(): string[] {
    return Array.from(this.termIndex.keys()).sort();
  }

  getCategories(): LegalCategory[] {
    return [
      "Writs & Remedies", "Property & Land", "Criminal Law", "Civil Procedure",
      "Equity", "Common Law", "Contract Law", "Constitutional Law",
      "Ecclesiastical Law", "Maritime & Admiralty", "Trust & Estate",
      "Evidence", "Persons & Status", "Commercial Law", "General",
    ];
  }
}
