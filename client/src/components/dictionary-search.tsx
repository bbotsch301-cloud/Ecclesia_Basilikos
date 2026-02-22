import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Scale, BookOpen, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface DictionaryEntry {
  id: string;
  term: string;
  termLower: string;
  definition: string;
  letter: string;
  subContext: string | null;
  pageNumber: number | null;
  createdAt: string;
}

interface DictionaryStats {
  totalEntries: number;
  letters: string[];
}

export default function DictionarySearch() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput);
      if (searchInput.length >= 2) {
        setSelectedLetter(null);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const activeQuery = selectedLetter || debouncedQuery;
  const shouldSearch = activeQuery.length >= 1;

  const { data: stats } = useQuery<DictionaryStats>({
    queryKey: ["/api/dictionary/stats"],
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const { data: results, isLoading, isFetching } = useQuery<DictionaryEntry[]>({
    queryKey: ["/api/dictionary/search", activeQuery],
    queryFn: async () => {
      const params = new URLSearchParams({ q: activeQuery, limit: "20" });
      const res = await fetch(`/api/dictionary/search?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: shouldSearch,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

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

  return (
    <section className="mb-16">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Scale className="h-8 w-8 text-royal-gold" />
          <h2 className="font-cinzel text-3xl font-bold text-royal-navy">
            Legal Dictionary
          </h2>
          <BookOpen className="h-8 w-8 text-royal-gold" />
        </div>
        <p className="font-georgia text-lg text-gray-600 max-w-2xl mx-auto">
          Search definitions from Black's Law Dictionary, 4th Edition
        </p>
        {stats && stats.totalEntries > 0 && (
          <p className="text-sm text-gray-400 mt-1">
            {stats.totalEntries.toLocaleString()} entries available
          </p>
        )}
      </div>

      {/* Search Input */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search a legal term (e.g., Trust, Habeas Corpus, Lien)..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-12 pr-4 py-6 text-lg border-2 border-gray-200 focus:border-royal-gold rounded-xl"
          />
          {isFetching && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-royal-gold animate-spin" />
          )}
        </div>
      </div>

      {/* Alphabet Grid */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-8 max-w-3xl mx-auto">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            className={`w-9 h-9 rounded-lg text-sm font-cinzel font-bold transition-all ${
              selectedLetter === letter
                ? "bg-royal-gold text-royal-navy shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-royal-navy"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto">
        {/* Loading State */}
        {isLoading && shouldSearch && (
          <div className="text-center py-12">
            <Loader2 className="h-10 w-10 text-royal-gold animate-spin mx-auto mb-3" />
            <p className="text-gray-500">Searching dictionary...</p>
          </div>
        )}

        {/* Empty State - no query */}
        {!shouldSearch && !selectedLetter && (
          <div className="text-center py-12 royal-card rounded-xl p-8">
            <Scale className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-georgia">
              Type at least 2 characters to search, or select a letter to browse
            </p>
          </div>
        )}

        {/* No Results */}
        {!isLoading && shouldSearch && results?.length === 0 && (
          <div className="text-center py-12 royal-card rounded-xl p-8">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-georgia">
              No definitions found for "{activeQuery}"
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Try a different term or browse by letter
            </p>
          </div>
        )}

        {/* Results List */}
        {results && results.length > 0 && (
          <div className="space-y-4">
            {results.map((entry) => (
              <div key={entry.id} className="royal-card rounded-xl p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-cinzel text-xl font-bold text-royal-navy">
                    {entry.term}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    {entry.subContext && (
                      <Badge variant="secondary" className="bg-royal-gold/10 text-royal-navy border-royal-gold/30 text-xs">
                        {entry.subContext}
                      </Badge>
                    )}
                    {entry.pageNumber && (
                      <span className="text-xs text-gray-400">
                        p. {entry.pageNumber}
                      </span>
                    )}
                  </div>
                </div>
                <p className="font-georgia text-gray-700 leading-relaxed whitespace-pre-line">
                  {entry.definition}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Attribution */}
      <p className="text-center text-xs text-gray-400 mt-8 font-georgia italic">
        Source: Black's Law Dictionary, 4th Edition
      </p>
    </section>
  );
}
