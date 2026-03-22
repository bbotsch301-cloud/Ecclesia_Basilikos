import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Scale, BookOpen, Search, Loader2, ChevronDown, ChevronUp,
  Filter, X, ExternalLink, Clock,
  Gavel, Landmark, ScrollText, AlertCircle, Lightbulb,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  LegalSearchEngine,
  type EnrichedResult,
  type SearchFilters,
  type LegalCategory,
  type LegalStatus,
  type JurisdictionType,
  type LegalDomain,
  type DictionaryEntry,
  normalizeForSearch,
} from "@/lib/legal-search-engine";

// ─── Singleton search engine instance ────────────────────────────────

const engine = new LegalSearchEngine();

// ─── Helpers ─────────────────────────────────────────────────────────

function highlightText(
  text: string,
  queryTokens: string[],
  maxLen?: number
): React.ReactNode[] {
  if (!queryTokens.length || queryTokens.every(t => t.length < 2)) {
    const display = maxLen && text.length > maxLen
      ? text.slice(0, maxLen).trimEnd() + "..."
      : text;
    return [display];
  }

  const display = maxLen && text.length > maxLen
    ? text.slice(0, maxLen).trimEnd() + "..."
    : text;

  // Build regex from tokens, escape special chars
  const escaped = queryTokens
    .filter(t => t.length >= 2)
    .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!escaped.length) return [display];

  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = display.split(regex);

  return parts.map((part, i) => {
    if (regex.test(part)) {
      // Reset regex lastIndex since we're using global flag with test
      regex.lastIndex = 0;
      return (
        <mark key={i} className="dict-highlight">
          {part}
        </mark>
      );
    }
    // Also reset here
    regex.lastIndex = 0;
    return part;
  });
}

function statusColor(status: LegalStatus): string {
  switch (status) {
    case "Active": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    case "Historical": return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    case "Abolished": return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800";
  }
}

function statusIcon(status: LegalStatus) {
  switch (status) {
    case "Active": return <Gavel className="h-3 w-3" />;
    case "Historical": return <Clock className="h-3 w-3" />;
    case "Abolished": return <AlertCircle className="h-3 w-3" />;
  }
}

function categoryIcon(category: LegalCategory) {
  switch (category) {
    case "Writs & Remedies": return <ScrollText className="h-3.5 w-3.5" />;
    case "Equity": return <Scale className="h-3.5 w-3.5" />;
    case "Property & Land": return <Landmark className="h-3.5 w-3.5" />;
    default: return <BookOpen className="h-3.5 w-3.5" />;
  }
}

// ─── Featured Terms ──────────────────────────────────────────────────

const FEATURED_TERMS = [
  "Habeas Corpus", "Due Process", "Mandamus", "Fee Simple",
  "Laches", "Estoppel", "Certiorari", "Seisin",
  "Injunction", "Attainder", "Coverture", "Demurrer",
];

// ─── Filter Panel ────────────────────────────────────────────────────

interface FilterPanelProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  categories: LegalCategory[];
}

function FilterPanel({ filters, onChange, categories }: FilterPanelProps) {
  const statuses: LegalStatus[] = ["Active", "Historical", "Abolished"];
  const jurisdictions: JurisdictionType[] = ["Common Law", "Civil Law", "Equity", "Canon Law", "General"];
  const domains: LegalDomain[] = ["Law", "Equity", "Both"];

  const hasFilters = filters.category || filters.status || filters.jurisdiction || filters.domain;

  return (
    <div className="dict-filter-panel">
      <div className="flex items-center justify-between mb-3">
        <span className="font-cinzel text-sm font-semibold text-royal-navy dark:text-parchment flex items-center gap-1.5">
          <Filter className="h-4 w-4" />
          Filters
        </span>
        {hasFilters && (
          <button
            onClick={() => onChange({})}
            className="text-xs text-royal-gold hover:text-royal-gold-bright flex items-center gap-1 transition-colors"
          >
            <X className="h-3 w-3" /> Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div className="mb-3">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">Category</label>
        <div className="flex flex-wrap gap-1.5">
          {categories.filter(c => c !== "General").map(cat => (
            <button
              key={cat}
              onClick={() => onChange({ ...filters, category: filters.category === cat ? undefined : cat })}
              className={`dict-filter-chip ${filters.category === cat ? "active" : ""}`}
            >
              {categoryIcon(cat)}
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="mb-3">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">Status</label>
        <div className="flex flex-wrap gap-1.5">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => onChange({ ...filters, status: filters.status === s ? undefined : s })}
              className={`dict-filter-chip ${filters.status === s ? "active" : ""}`}
            >
              {statusIcon(s)}
              <span>{s}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Jurisdiction */}
      <div className="mb-3">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">Jurisdiction</label>
        <div className="flex flex-wrap gap-1.5">
          {jurisdictions.map(j => (
            <button
              key={j}
              onClick={() => onChange({ ...filters, jurisdiction: filters.jurisdiction === j ? undefined : j })}
              className={`dict-filter-chip ${filters.jurisdiction === j ? "active" : ""}`}
            >
              <span>{j}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Domain */}
      <div>
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">Law vs Equity</label>
        <div className="flex flex-wrap gap-1.5">
          {domains.map(d => (
            <button
              key={d}
              onClick={() => onChange({ ...filters, domain: filters.domain === d ? undefined : d })}
              className={`dict-filter-chip ${filters.domain === d ? "active" : ""}`}
            >
              <span>{d}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Result Card ─────────────────────────────────────────────────────

interface ResultCardProps {
  result: EnrichedResult;
  queryTokens: string[];
  onTermClick: (term: string) => void;
}

function ResultCard({ result, queryTokens, onTermClick }: ResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { entry, category, status, jurisdiction, preview, crossReferences, relatedTerms } = result;

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <div className="dict-result-card group">
        {/* Header */}
        <CollapsibleTrigger asChild>
          <button className="w-full text-left">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-cinzel text-lg font-bold text-royal-navy dark:text-parchment leading-tight">
                  {highlightText(entry.term, queryTokens)}
                </h3>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <span className={`dict-status-badge ${statusColor(status)}`}>
                    {statusIcon(status)}
                    <span>{status}</span>
                  </span>
                  <span className="dict-category-badge">
                    {categoryIcon(category)}
                    <span>{category}</span>
                  </span>
                  {entry.subContext && (
                    <Badge variant="secondary" className="text-[10px] bg-royal-gold/10 text-royal-navy dark:text-parchment border-royal-gold/30">
                      {entry.subContext}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                {entry.pageNumber && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                    p. {entry.pageNumber}
                  </span>
                )}
                <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                  {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>
            </div>

            {/* Preview */}
            {!expanded && (
              <p className="font-georgia text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-2 line-clamp-2">
                {highlightText(preview, queryTokens)}
              </p>
            )}
          </button>
        </CollapsibleTrigger>

        {/* Expanded Content */}
        <CollapsibleContent>
          <div className="mt-3 pt-3 border-t border-royal-gold/20 dark:border-royal-gold/10">
            {/* Full Definition */}
            <p className="font-georgia text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {highlightText(entry.definition, queryTokens)}
            </p>

            {/* Metadata bar */}
            <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                Jurisdiction: <strong>{jurisdiction}</strong>
              </span>
            </div>

            {/* Cross References */}
            {crossReferences.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1.5">
                  <ExternalLink className="h-3 w-3" /> Cross References
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {crossReferences.map((ref, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTermClick(ref.term);
                      }}
                      className="dict-xref-link"
                    >
                      {ref.term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Related Terms */}
            {relatedTerms.length === 0 && entry.subContext && (
              <div className="mt-2">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Context: {entry.subContext}
                </span>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

// ─── Suggestions Panel ───────────────────────────────────────────────

interface SuggestionsPanelProps {
  suggestions: string[];
  onSelect: (term: string) => void;
}

function SuggestionsPanel({ suggestions, onSelect }: SuggestionsPanelProps) {
  if (!suggestions.length) return null;
  return (
    <div className="dict-suggestions">
      <div className="flex items-center gap-1.5 mb-2">
        <Lightbulb className="h-4 w-4 text-royal-gold" />
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Did you mean?</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s)}
            className="dict-suggestion-chip"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Loading Progress ────────────────────────────────────────────────

function LoadingProgress({ loaded, total }: { loaded: number; total: number }) {
  const pct = total > 0 ? Math.round((loaded / total) * 100) : 0;
  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center gap-3 dict-loading-card px-6 py-4 rounded-xl">
        <Loader2 className="h-5 w-5 text-royal-gold animate-spin" />
        <div className="text-left">
          <p className="text-sm font-semibold text-royal-navy dark:text-parchment">
            Building Search Index
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {loaded.toLocaleString()} of {total.toLocaleString()} entries ({pct}%)
          </p>
        </div>
      </div>
      <div className="w-64 mx-auto mt-3 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-royal-gold rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

export default function DictionarySearch() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [indexLoaded, setIndexLoaded] = useState(0);
  const [indexTotal, setIndexTotal] = useState(0);
  const [indexReady, setIndexReady] = useState(engine.isReady);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce search input: 150ms for snappy feel
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput);
      if (searchInput.length >= 2) {
        setSelectedLetter(null);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Get stats for total count
  const { data: stats } = useQuery<{ totalEntries: number; letters: string[] }>({
    queryKey: ["/api/dictionary/stats"],
    staleTime: 1000 * 60 * 60,
  });

  // Load entries into client-side engine in batches
  useEffect(() => {
    if (engine.isReady || !stats?.totalEntries) return;

    let cancelled = false;
    const BATCH_SIZE = 500;
    const total = stats.totalEntries;
    setIndexTotal(total);

    async function loadAll() {
      const allEntries: DictionaryEntry[] = [];
      let offset = 0;

      while (offset < total && !cancelled) {
        try {
          const res = await fetch(`/api/dictionary/batch?offset=${offset}&limit=${BATCH_SIZE}`, {
            credentials: "include",
          });
          if (!res.ok) break;
          const batch: DictionaryEntry[] = await res.json();
          if (batch.length === 0) break;
          allEntries.push(...batch);
          offset += batch.length;
          if (!cancelled) setIndexLoaded(allEntries.length);
        } catch {
          break;
        }
      }

      if (!cancelled && allEntries.length > 0) {
        engine.loadEntries(allEntries);
        setIndexReady(true);
      }
    }

    loadAll();
    return () => { cancelled = true; };
  }, [stats?.totalEntries]);

  // Search computation
  const searchResults = useMemo(() => {
    if (!indexReady) return null;
    if (selectedLetter) {
      const results = engine.browseByLetter(selectedLetter, filters, 100);
      return { results, suggestions: [] as string[], totalMatched: results.length, queryTime: 0 };
    }
    if (debouncedQuery.length < 2) return null;
    return engine.search(debouncedQuery, filters, 100);
  }, [indexReady, debouncedQuery, selectedLetter, filters]);

  const queryTokens = useMemo(() => {
    return normalizeForSearch(debouncedQuery).split(/\s+/).filter(t => t.length >= 2);
  }, [debouncedQuery]);

  const alphabet = stats?.letters?.length
    ? stats.letters
    : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
    setSearchInput("");
    setDebouncedQuery("");
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (value.length >= 2) {
      setSelectedLetter(null);
    }
  };

  const handleTermClick = useCallback((term: string) => {
    setSearchInput(term);
    setDebouncedQuery(term);
    setSelectedLetter(null);
    searchInputRef.current?.focus();
    // Scroll to top of search
    searchInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleSuggestionSelect = useCallback((term: string) => {
    setSearchInput(term);
    setDebouncedQuery(term);
    setSelectedLetter(null);
  }, []);

  const hasActiveFilters = filters.category || filters.status || filters.jurisdiction || filters.domain;
  const activeQuery = selectedLetter || debouncedQuery;
  const shouldSearch = activeQuery.length >= 1;
  const isSearching = shouldSearch && !searchResults && indexReady;

  return (
    <section className="dict-engine-root mb-16">
      <div className="dict-container">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Scale className="h-7 w-7 text-royal-gold" />
            <h2 className="font-cinzel text-3xl font-bold text-royal-navy dark:text-parchment">
              Legal Dictionary
            </h2>
            <BookOpen className="h-7 w-7 text-royal-gold" />
          </div>
          <p className="font-georgia text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Search definitions from Black's Law Dictionary, 4th Edition, with intelligent full-text search,
            cross-reference detection, and writ classification.
          </p>
          {stats && stats.totalEntries > 0 && (
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {stats.totalEntries.toLocaleString()} entries indexed
              </span>
            </div>
          )}
        </div>

        {/* Controls Row */}
        <div className="max-w-3xl mx-auto mb-6">
          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 z-10" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search a legal term, writ, or remedy (e.g., Habeas Corpus, Mandamus, Seisin)..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="dict-search-input"
            />
            {searchInput && (
              <button
                onClick={() => { setSearchInput(""); setDebouncedQuery(""); }}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 z-10"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-royal-gold animate-spin z-10" />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`dict-toolbar-btn ${showFilters ? "active" : ""}`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-royal-gold" />
              )}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="max-w-3xl mx-auto mb-6">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              categories={engine.isReady ? engine.getCategories() : []}
            />
          </div>
        )}

        {/* Alphabet Grid */}
        <div className="flex flex-wrap justify-center gap-1 mb-6 max-w-3xl mx-auto">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              className={`dict-letter-btn ${selectedLetter === letter ? "active" : ""}`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Index Loading */}
        {!indexReady && stats && stats.totalEntries > 0 && (
          <LoadingProgress loaded={indexLoaded} total={indexTotal} />
        )}

        {/* Results Area */}
        <div className="max-w-3xl mx-auto">
          {/* Fallback: server search while index loads */}
          {!indexReady && shouldSearch && <ServerFallbackResults query={activeQuery} />}

          {/* Client-side results */}
          {indexReady && (
            <>
              {/* No query: show featured terms */}
              {!shouldSearch && !selectedLetter && (
                <div className="text-center py-10 dict-empty-state">
                  <Scale className="h-10 w-10 text-royal-gold/60 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 font-georgia mb-4">
                    Explore landmark legal terms, or search by name
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                    {FEATURED_TERMS.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleTermClick(term)}
                        className="dict-suggestion-chip"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {searchResults && searchResults.suggestions.length > 0 && searchResults.results.length === 0 && (
                <SuggestionsPanel
                  suggestions={searchResults.suggestions}
                  onSelect={handleSuggestionSelect}
                />
              )}

              {/* No results */}
              {searchResults && searchResults.results.length === 0 && searchResults.suggestions.length === 0 && shouldSearch && (
                <div className="text-center py-10 dict-empty-state">
                  <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-georgia">
                    No definitions found for "{activeQuery}"
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Try a different term, adjust filters, or browse by letter
                  </p>
                </div>
              )}

              {/* Results header */}
              {searchResults && searchResults.results.length > 0 && (
                <div className="flex items-center mb-3 px-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {searchResults.totalMatched} result{searchResults.totalMatched !== 1 ? "s" : ""}
                    {searchResults.totalMatched > searchResults.results.length && (
                      <> (showing {searchResults.results.length})</>
                    )}
                  </span>
                </div>
              )}

              {/* Suggestions when few results */}
              {searchResults && searchResults.suggestions.length > 0 && searchResults.results.length > 0 && (
                <SuggestionsPanel
                  suggestions={searchResults.suggestions}
                  onSelect={handleSuggestionSelect}
                />
              )}

              {/* Result cards */}
              {searchResults && searchResults.results.length > 0 && (
                <div className="space-y-3">
                  {searchResults.results.map((result) => (
                    <ResultCard
                      key={result.entry.id}
                      result={result}
                      queryTokens={queryTokens}
                      onTermClick={handleTermClick}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Attribution */}
        <div className="text-center mt-8">
          <div className="dict-attribution">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-georgia italic">
              Source: Black's Law Dictionary, 4th Edition
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Server Fallback (while index loads) ─────────────────────────────

function ServerFallbackResults({ query }: { query: string }) {
  const { data: results, isLoading } = useQuery<DictionaryEntry[]>({
    queryKey: ["/api/dictionary/search", query],
    queryFn: async () => {
      const params = new URLSearchParams({ q: query, limit: "20" });
      const res = await fetch(`/api/dictionary/search?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: query.length >= 1,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 text-royal-gold animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Searching...</p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8 dict-empty-state">
        <Search className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
        <p className="text-gray-500 dark:text-gray-400 font-georgia text-sm">
          No definitions found for "{query}"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
        Server results (full search engine loading...)
      </p>
      {results.map((entry) => (
        <div key={entry.id} className="dict-result-card">
          <h3 className="font-cinzel text-lg font-bold text-royal-navy dark:text-parchment">
            {entry.term}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {entry.subContext && (
              <Badge variant="secondary" className="text-[10px] bg-royal-gold/10 text-royal-navy dark:text-parchment border-royal-gold/30">
                {entry.subContext}
              </Badge>
            )}
            {entry.pageNumber && (
              <span className="text-xs text-gray-400 dark:text-gray-500">p. {entry.pageNumber}</span>
            )}
          </div>
          <p className="font-georgia text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-2 line-clamp-3">
            {entry.definition.length > 250 ? entry.definition.slice(0, 250) + "..." : entry.definition}
          </p>
        </div>
      ))}
    </div>
  );
}
