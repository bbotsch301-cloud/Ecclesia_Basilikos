import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, MessageSquare, FileDown } from "lucide-react";

interface SearchResults {
  courses: { id: string; title: string; description: string; category: string }[];
  threads: { id: string; title: string; categoryId: string; createdAt: string }[];
  downloads: { id: string; title: string; description: string; category: string }[];
}

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [, navigate] = useLocation();

  // Cmd+K shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const debouncedQuery = useDebounce(query, 300);

  const { data: results, isLoading } = useQuery<SearchResults>({
    queryKey: ["/api/search", `?q=${encodeURIComponent(debouncedQuery)}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: debouncedQuery.length >= 2,
  });

  const handleSelect = useCallback(
    (url: string) => {
      setOpen(false);
      setQuery("");
      navigate(url);
    },
    [navigate]
  );

  const hasResults =
    results &&
    (results.courses.length > 0 || results.threads.length > 0 || results.downloads.length > 0);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="relative"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search courses, forum, downloads..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {debouncedQuery.length < 2 ? (
            <CommandEmpty>Type at least 2 characters to search</CommandEmpty>
          ) : isLoading ? (
            <CommandEmpty>Searching...</CommandEmpty>
          ) : !hasResults ? (
            <CommandEmpty>No results found</CommandEmpty>
          ) : (
            <>
              {results!.courses.length > 0 && (
                <CommandGroup heading="Courses">
                  {results!.courses.map((c) => (
                    <CommandItem
                      key={`course-${c.id}`}
                      value={c.title}
                      onSelect={() => handleSelect(`/courses`)}
                    >
                      <BookOpen className="w-4 h-4 mr-2 shrink-0 text-royal-gold" />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{c.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{c.category}</p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {results!.threads.length > 0 && (
                <CommandGroup heading="Forum Threads">
                  {results!.threads.map((t) => (
                    <CommandItem
                      key={`thread-${t.id}`}
                      value={t.title}
                      onSelect={() => handleSelect(`/forum/thread/${t.id}`)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2 shrink-0 text-royal-gold" />
                      <p className="truncate">{t.title}</p>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {results!.downloads.length > 0 && (
                <CommandGroup heading="Downloads">
                  {results!.downloads.map((d) => (
                    <CommandItem
                      key={`dl-${d.id}`}
                      value={d.title}
                      onSelect={() => handleSelect(`/downloads`)}
                    >
                      <FileDown className="w-4 h-4 mr-2 shrink-0 text-royal-gold" />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{d.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{d.category}</p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
