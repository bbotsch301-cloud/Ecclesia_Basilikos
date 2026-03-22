import { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useSearch } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageSquare, Eye, Plus, Pin, Search, X, Crown, Heart,
  Lock, Loader2, MessageCircle, TrendingUp, Flag,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ForumCategory, ForumThread, User } from "@shared/schema";
import { usePageTitle } from "@/hooks/usePageTitle";
import UpgradePrompt from "@/components/UpgradePrompt";
import { Skeleton } from "@/components/ui/skeleton";

const RichTextEditor = lazy(() => import("@/components/RichTextEditor"));

const createThreadSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  categoryId: z.string().min(1, "Please select a category"),
});

type CreateThreadForm = z.infer<typeof createThreadSchema>;

interface CategoryWithCount extends ForumCategory {
  threadCount: number;
}

interface ThreadWithMeta extends ForumThread {
  author: User;
  category: ForumCategory;
  lastReplyUser?: User;
  likeCount: number;
  userLiked: boolean;
}

function timeAgo(date: string | Date | null): string {
  if (!date) return "Unknown";
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function getUserDisplayName(user: User): string {
  return user.username || `${user.firstName} ${user.lastName}`.trim() || user.email;
}

function getUserInitials(user: User): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }
  return (user.username || user.email || "?")[0].toUpperCase();
}

export default function Forum() {
  usePageTitle("Forum", "Community forum for discussing trust law, lawful money, and covenant principles.");
  const { user, isAuthenticated, isPremium } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const searchString = useSearch();
  const initialCategory = new URLSearchParams(searchString).get("category");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(value.trim());
    }, 300);
  }, []);

  const handleCategoryChange = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setSearchInput("");
    setDebouncedSearch("");
    setPage(1);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<CategoryWithCount[]>({
    queryKey: ["/api/forum/categories-with-counts"],
  });

  const { data: categoryThreads = [], isLoading: categoryThreadsLoading } = useQuery<ThreadWithMeta[]>({
    queryKey: ["/api/forum/categories", selectedCategory, "threads"],
    enabled: !!selectedCategory,
  });

  const { data: allThreadsData, isLoading: allThreadsLoading } = useQuery<{ threads: ThreadWithMeta[]; total: number; page: number; totalPages: number }>({
    queryKey: ["/api/forum/threads", page],
    queryFn: async () => {
      const res = await fetch(`/api/forum/threads?page=${page}`);
      if (!res.ok) throw new Error("Failed to fetch threads");
      return res.json();
    },
    enabled: !selectedCategory,
  });
  const allThreads = allThreadsData?.threads ?? [];
  const totalPages = allThreadsData?.totalPages ?? 1;

  const isSearching = debouncedSearch.length >= 2;

  const { data: searchResults = [], isLoading: searchLoading, isFetching: searchFetching } = useQuery<ThreadWithMeta[]>({
    queryKey: ["/api/forum/search", debouncedSearch],
    queryFn: async () => {
      const res = await fetch(`/api/forum/search?q=${encodeURIComponent(debouncedSearch)}`);
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: isSearching,
  });

  const threads = isSearching ? searchResults : selectedCategory ? categoryThreads : allThreads;
  const threadsLoading = isSearching ? searchLoading : selectedCategory ? categoryThreadsLoading : allThreadsLoading;

  const pinnedThreads = threads.filter((t) => t.isPinned);
  const regularThreads = threads.filter((t) => !t.isPinned);

  const totalThreadCount = categories.reduce((sum, c) => sum + c.threadCount, 0);

  const form = useForm<CreateThreadForm>({
    mode: "onBlur",
    resolver: zodResolver(createThreadSchema),
    defaultValues: { title: "", content: "", categoryId: "" },
  });

  const createThreadMutation = useMutation({
    mutationFn: async (data: CreateThreadForm) => {
      return await apiRequest("POST", "/api/forum/threads", data);
    },
    onSuccess: () => {
      toast({ title: "Thread created", description: "Your discussion has been posted." });
      setIsCreateDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/forum/threads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/forum/categories", selectedCategory, "threads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/forum/categories-with-counts"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create thread", variant: "destructive" });
    },
  });

  const likeMutation = useMutation({
    mutationFn: async ({ threadId, liked }: { threadId: string; liked: boolean }) => {
      if (liked) {
        return await apiRequest("DELETE", `/api/forum/threads/${threadId}/like`);
      }
      return await apiRequest("POST", `/api/forum/threads/${threadId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/threads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/forum/categories", selectedCategory, "threads"] });
    },
  });

  if (categoriesLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 dark:bg-royal-navy">
        {/* Skeleton hero */}
        <div className="bg-gradient-to-br from-royal-navy via-royal-navy/95 to-royal-burgundy/80">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <Skeleton className="h-9 w-64 bg-white/10 mb-3" />
            <Skeleton className="h-5 w-96 max-w-full bg-white/10" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white dark:bg-royal-navy-light rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 px-4 md:px-5 py-4">
                <Skeleton className="h-10 w-10 rounded-full shrink-0 hidden sm:block" />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const selectedCategoryData = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-royal-navy">
      {/* Hero */}
      <div className="bg-gradient-to-br from-royal-navy via-royal-navy/95 to-royal-burgundy/80">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-white mb-2">
                Community Forum
              </h1>
              <p className="text-gray-300 text-lg max-w-xl">
                Connect with fellow believers. Ask questions, share insights, and walk the covenant path together.
              </p>
            </div>
            <div className="flex items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-royal-gold" />
                <div>
                  <p className="text-white font-semibold">{totalThreadCount}</p>
                  <p className="text-xs text-gray-400">Threads</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-royal-gold" />
                <div>
                  <p className="text-white font-semibold">{categories.length}</p>
                  <p className="text-xs text-gray-400">Categories</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Premium upgrade banner */}
        {isAuthenticated && !isPremium && (
          <div className="mb-6">
            <UpgradePrompt
              title="Join the Discussion"
              description="Acquire PMA membership to create threads, reply to discussions, and engage with the community."
            />
          </div>
        )}

        {/* Sidebar + Content Layout */}
        <div className="flex gap-6">
          {/* Left Sidebar: Categories */}
          <aside className="hidden md:block w-60 shrink-0">
            <div className="sticky top-20">
              <h2 className="font-cinzel text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                Categories
              </h2>
              <nav className="space-y-1">
                <button
                  onClick={() => handleCategoryChange(null)}
                  aria-pressed={selectedCategory === null}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                    selectedCategory === null
                      ? "bg-royal-navy text-white shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-royal-navy-light"
                  }`}
                >
                  <span>All Threads</span>
                  <span className="text-xs opacity-70">{totalThreadCount}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    aria-pressed={selectedCategory === cat.id}
                    aria-label={`Filter by ${cat.name} category`}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedCategory === cat.id
                        ? "text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-royal-navy-light"
                    }`}
                    style={selectedCategory === cat.id ? { backgroundColor: cat.color || "#3B82F6" } : {}}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: selectedCategory === cat.id ? "rgba(255,255,255,0.7)" : (cat.color || "#3B82F6"),
                      }}
                    />
                    <span className="flex-1 truncate">{cat.name}</span>
                    <span className="text-xs opacity-70">{cat.threadCount}</span>
                  </button>
                ))}
              </nav>

              {/* New Thread button in sidebar */}
              <div className="mt-6">
                {isAuthenticated && isPremium ? (
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-semibold">
                        <Plus className="h-4 w-4 mr-2" />
                        New Thread
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle className="font-cinzel">Start a Discussion</DialogTitle>
                        <DialogDescription>
                          Share your thoughts with the community.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit((data) => createThreadMutation.mutate(data))} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {categories.map((cat) => (
                                      <SelectItem key={cat.id} value={cat.id}>
                                        <span className="flex items-center gap-2">
                                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color || "#3B82F6" }} />
                                          {cat.name}
                                        </span>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="What's on your mind?" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                  <Suspense
                                    fallback={
                                      <div className="border rounded-lg p-4 min-h-[120px] flex items-center justify-center">
                                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                                      </div>
                                    }
                                  >
                                    <RichTextEditor
                                      content={field.value}
                                      onChange={(val) => form.setValue("content", val, { shouldValidate: true })}
                                      placeholder="Share your thoughts..."
                                      minHeight="120px"
                                    />
                                  </Suspense>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="submit"
                            className="w-full bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-semibold"
                            disabled={createThreadMutation.isPending}
                          >
                            {createThreadMutation.isPending ? "Posting..." : "Post Thread"}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                ) : isAuthenticated ? (
                  <Link href="/pricing">
                    <Button variant="outline" className="w-full border-royal-gold/30 text-royal-gold hover:bg-royal-gold/5">
                      <Crown className="h-4 w-4 mr-2" />
                      Join to Post
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login?redirect=/forum">
                    <Button variant="outline" className="w-full">Sign in to Post</Button>
                  </Link>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile: category pills + actions */}
            <div className="md:hidden mb-4">
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  {isAuthenticated && isPremium ? (
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-semibold">
                          <Plus className="h-4 w-4 mr-2" />
                          New Thread
                        </Button>
                      </DialogTrigger>
                      {/* Dialog content reused from sidebar (same form) */}
                      <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                          <DialogTitle className="font-cinzel">Start a Discussion</DialogTitle>
                          <DialogDescription>Share your thoughts with the community.</DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit((data) => createThreadMutation.mutate(data))} className="space-y-4">
                            <FormField control={form.control} name="categoryId" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                                  <SelectContent>
                                    {categories.map((cat) => (
                                      <SelectItem key={cat.id} value={cat.id}>
                                        <span className="flex items-center gap-2">
                                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color || "#3B82F6" }} />
                                          {cat.name}
                                        </span>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="title" render={({ field }) => (
                              <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="What's on your mind?" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="content" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                  <Suspense
                                    fallback={
                                      <div className="border rounded-lg p-4 min-h-[120px] flex items-center justify-center">
                                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                                      </div>
                                    }
                                  >
                                    <RichTextEditor
                                      content={field.value}
                                      onChange={(val) => form.setValue("content", val, { shouldValidate: true })}
                                      placeholder="Share your thoughts..."
                                      minHeight="120px"
                                    />
                                  </Suspense>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <Button type="submit" className="w-full bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-semibold" disabled={createThreadMutation.isPending}>
                              {createThreadMutation.isPending ? "Posting..." : "Post Thread"}
                            </Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  ) : isAuthenticated ? (
                    <Link href="/pricing">
                      <Button variant="outline" className="w-full border-royal-gold/30 text-royal-gold hover:bg-royal-gold/5">
                        <Crown className="h-4 w-4 mr-2" /> Join to Post
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login?redirect=/forum">
                      <Button variant="outline" className="w-full">Sign in to Post</Button>
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === null
                      ? "bg-royal-navy text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  All <span className="ml-1 opacity-70">{totalThreadCount}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                      selectedCategory === cat.id
                        ? "text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                    style={selectedCategory === cat.id ? { backgroundColor: cat.color || "#3B82F6" } : {}}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: selectedCategory === cat.id ? "rgba(255,255,255,0.7)" : (cat.color || "#3B82F6") }}
                    />
                    {cat.name}
                    <span className="opacity-70">{cat.threadCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search threads..."
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-10 bg-white dark:bg-royal-navy-light"
                />
                {searchInput && (
                  <button
                    onClick={() => {
                      setSearchInput("");
                      setDebouncedSearch("");
                      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category header when filtered */}
            {selectedCategoryData && !isSearching && (
              <div className="flex items-center gap-2 mb-4 px-1">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedCategoryData.color || "#3B82F6" }}
                />
                <h2 className="font-cinzel font-bold text-royal-navy dark:text-royal-gold text-lg">
                  {selectedCategoryData.name}
                </h2>
                {selectedCategoryData.description && (
                  <span className="text-xs text-gray-400 hidden sm:inline">
                    {selectedCategoryData.description}
                  </span>
                )}
              </div>
            )}

            {isSearching && (
              <div className="mb-4 text-sm text-gray-500 px-1">
                {(searchLoading || searchFetching)
                  ? `Searching...`
                  : searchResults.length === 0
                    ? `No results for "${debouncedSearch}"`
                    : `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} for "${debouncedSearch}"`}
              </div>
            )}

            {/* Thread List */}
            {threadsLoading ? (
              <div className="bg-white dark:bg-royal-navy-light rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-3 px-4 md:px-5 py-4">
                    <Skeleton className="h-10 w-10 rounded-full shrink-0 hidden sm:block" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </div>
                ))}
              </div>
            ) : threads.length === 0 ? (
              <div className="bg-white dark:bg-royal-navy-light rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-1">
                  {isSearching ? "No results found" : "No discussions yet"}
                </h3>
                <p className="text-gray-500 mb-4 text-sm">
                  {isSearching
                    ? `Nothing matching "${debouncedSearch}".`
                    : `Be the first to start a conversation${selectedCategory ? " in this category" : ""}.`}
                </p>
                {!isSearching && isAuthenticated && isPremium && (
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-semibold"
                  >
                    Start First Thread
                  </Button>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-royal-navy-light rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
                {/* Pinned threads */}
                {pinnedThreads.length > 0 && (
                  <>
                    {pinnedThreads.map((thread) => (
                      <ThreadRow key={thread.id} thread={thread} isPinned onLike={likeMutation.mutate} isAuthenticated={isAuthenticated} />
                    ))}
                    {regularThreads.length > 0 && (
                      <div className="bg-gray-50 dark:bg-royal-navy/50 px-5 py-1.5">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Recent Threads</span>
                      </div>
                    )}
                  </>
                )}
                {regularThreads.map((thread) => (
                  <ThreadRow key={thread.id} thread={thread} onLike={likeMutation.mutate} isAuthenticated={isAuthenticated} />
                ))}
              </div>
            )}

            {/* Pagination (only for all-threads view, not search or category) */}
            {!isSearching && !selectedCategory && totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ThreadRow({
  thread,
  isPinned,
  onLike,
  isAuthenticated,
}: {
  thread: ThreadWithMeta;
  isPinned?: boolean;
  onLike: (args: { threadId: string; liked: boolean }) => void;
  isAuthenticated: boolean;
}) {
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const { toast } = useToast();

  const handleReport = async () => {
    if (reportReason.trim().length < 10) return;
    setReportLoading(true);
    try {
      const res = await apiRequest("POST", `/api/forum/threads/${thread.id}/report`, { reason: reportReason });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit report");
      }
      toast({ title: "Report submitted", description: "Thank you for helping keep the community safe." });
      setReportOpen(false);
      setReportReason("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to submit report", variant: "destructive" });
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div
      className={`flex items-start gap-3 px-4 md:px-5 py-4 hover:bg-gray-50/70 dark:hover:bg-royal-navy/30 transition-colors ${
        isPinned ? "bg-royal-gold/[0.03]" : ""
      }`}
    >
      {/* Avatar */}
      <Link href={`/user/${thread.author.id}`} className="shrink-0 hidden sm:block">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-royal-navy/10 text-royal-navy dark:text-royal-gold font-semibold text-sm">
            {getUserInitials(thread.author)}
          </AvatarFallback>
        </Avatar>
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          {isPinned && <Pin className="h-3.5 w-3.5 text-royal-gold shrink-0" />}
          <Badge
            className="text-white text-[10px] px-1.5 py-0 leading-4 shrink-0"
            style={{ backgroundColor: thread.category.color || "#3B82F6" }}
          >
            {thread.category.name}
          </Badge>
          {thread.isLocked && (
            <Lock className="h-3 w-3 text-gray-400 shrink-0" />
          )}
        </div>
        <Link href={`/forum/thread/${thread.id}`}>
          <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-200 hover:text-royal-gold transition-colors leading-snug truncate">
            {thread.title}
          </h3>
        </Link>
        <p className="text-gray-500 text-xs mt-0.5 truncate">
          <Link href={`/user/${thread.author.id}`} className="font-medium text-gray-600 dark:text-gray-400 hover:text-royal-gold transition-colors">{getUserDisplayName(thread.author)}</Link>
          <span className="mx-1.5 text-gray-300">&middot;</span>
          {timeAgo(thread.createdAt)}
          {thread.lastReplyAt && (thread.replyCount ?? 0) > 0 && (
            <>
              <span className="mx-1.5 text-gray-300">&middot;</span>
              <span>last reply {timeAgo(thread.lastReplyAt)}</span>
            </>
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 shrink-0 text-xs text-gray-400">
        <button
          onClick={(e) => {
            e.preventDefault();
            if (!isAuthenticated) return;
            onLike({ threadId: thread.id, liked: thread.userLiked });
          }}
          className={`flex items-center gap-1 transition-colors ${
            isAuthenticated ? "hover:text-red-500 cursor-pointer" : "cursor-default"
          } ${thread.userLiked ? "text-red-500" : ""}`}
          title={isAuthenticated ? (thread.userLiked ? "Unlike" : "Like") : "Sign in to like"}
          aria-label={isAuthenticated ? (thread.userLiked ? "Unlike this thread" : "Like this thread") : "Sign in to like"}
        >
          <Heart className={`h-3.5 w-3.5 ${thread.userLiked ? "fill-current" : ""}`} />
          {thread.likeCount > 0 && <span>{thread.likeCount}</span>}
        </button>
        <div className="flex items-center gap-1" title={`${thread.replyCount} replies`}>
          <MessageCircle className="h-3.5 w-3.5" />
          <span>{thread.replyCount}</span>
        </div>
        <div className="hidden md:flex items-center gap-1" title={`${thread.viewCount} views`}>
          <Eye className="h-3.5 w-3.5" />
          <span>{thread.viewCount}</span>
        </div>
        {isAuthenticated && (
          <Dialog open={reportOpen} onOpenChange={setReportOpen}>
            <DialogTrigger asChild>
              <button
                className="flex items-center gap-1 text-gray-400 hover:text-orange-500 transition-colors"
                title="Report thread"
                aria-label="Report this thread"
              >
                <Flag className="h-3.5 w-3.5" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report Thread</DialogTitle>
                <DialogDescription>
                  Describe why this thread should be reviewed by a moderator.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Reason for reporting (min 10 characters)..."
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  rows={4}
                />
                <Button
                  className="w-full"
                  disabled={reportLoading || reportReason.trim().length < 10}
                  onClick={handleReport}
                >
                  {reportLoading ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
