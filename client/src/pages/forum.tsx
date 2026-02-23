import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Users, Eye, Clock, Plus, Pin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ForumCategory, ForumThread, User } from "@shared/schema";
import { usePageTitle } from "@/hooks/usePageTitle";

const createThreadSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  categoryId: z.string().min(1, "Please select a category"),
});

type CreateThreadForm = z.infer<typeof createThreadSchema>;

export default function Forum() {
  usePageTitle("Forum");
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<ForumCategory[]>({
    queryKey: ['/api/forum/categories'],
  });

  // Fetch threads for selected category
  const { data: categoryThreads = [], isLoading: categoryThreadsLoading } = useQuery<Array<ForumThread & { author: User; category: ForumCategory; lastReplyUser?: User }>>({
    queryKey: ['/api/forum/categories', selectedCategory, 'threads'],
    enabled: !!selectedCategory,
  });

  // Fetch all recent threads when no category is selected
  const { data: allThreads = [], isLoading: allThreadsLoading } = useQuery<Array<ForumThread & { author: User; category: ForumCategory }>>({
    queryKey: ['/api/forum/threads'],
    enabled: !selectedCategory,
  });

  const threads = selectedCategory ? categoryThreads : allThreads;
  const threadsLoading = selectedCategory ? categoryThreadsLoading : allThreadsLoading;

  const form = useForm<CreateThreadForm>({
    resolver: zodResolver(createThreadSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
    },
  });

  const createThreadMutation = useMutation({
    mutationFn: async (data: CreateThreadForm) => {
      return await apiRequest('POST', '/api/forum/threads', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Thread created successfully!",
      });
      setIsCreateDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/forum/threads'] });
      queryClient.invalidateQueries({
        queryKey: ['/api/forum/categories', selectedCategory, 'threads'],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create thread",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateThreadForm) => {
    createThreadMutation.mutate(data);
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUserDisplayName = (user: User) => {
    return user.username || `${user.firstName} ${user.lastName}` || user.email;
  };

  if (categoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading forum...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 font-playfair mb-2">
              Community Forum
            </h1>
            <p className="text-lg text-gray-600">
              Connect with fellow believers and discuss covenant truths
            </p>
          </div>
          {isAuthenticated && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Thread
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Create New Thread</DialogTitle>
                  <DialogDescription>
                    Start a new discussion in the community forum.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                  {cat.name}
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
                            <Input placeholder="Thread title..." {...field} />
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
                            <Textarea
                              placeholder="Share your thoughts..."
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-700"
                      disabled={createThreadMutation.isPending}
                    >
                      {createThreadMutation.isPending ? "Creating..." : "Create Thread"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-4 py-3 transition-colors hover:bg-gray-50 ${
                    selectedCategory === null
                      ? 'bg-amber-50 border-l-4 border-amber-600'
                      : ''
                  }`}
                >
                  <div className="font-medium text-gray-900">All Categories</div>
                  <div className="text-sm text-gray-500">View all recent threads</div>
                </button>
                {categories.map((category: ForumCategory) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 transition-colors hover:bg-gray-50 ${
                      selectedCategory === category.id
                        ? 'bg-amber-50 border-l-4 border-amber-600'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color || '#3B82F6' }}
                      />
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                    {category.description && (
                      <div className="text-sm text-gray-500 mt-1">
                        {category.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Threads List */}
        <div className="lg:col-span-3">
          {threadsLoading ? (
            <div className="flex justify-center items-center min-h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading threads...</p>
              </div>
            </div>
          ) : threads.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No discussions yet</h3>
                <p className="text-gray-600 mb-4">
                  Be the first to start a conversation{selectedCategory ? ' in this category' : ''}.
                </p>
                {isAuthenticated && (
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    Create First Thread
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {threads.map((thread: any) => (
                <Card key={thread.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {thread.isPinned && (
                            <Pin className="h-4 w-4 text-amber-600" />
                          )}
                          <Badge
                            style={{ backgroundColor: thread.category.color || '#3B82F6' }}
                            className="text-white text-xs"
                          >
                            {thread.category.name}
                          </Badge>
                          {thread.isLocked && (
                            <Badge variant="secondary" className="text-xs">
                              Locked
                            </Badge>
                          )}
                        </div>
                        <Link href={`/forum/thread/${thread.id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-amber-600 transition-colors mb-2">
                            {thread.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {thread.content.substring(0, 150)}{thread.content.length > 150 ? '...' : ''}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>By {getUserDisplayName(thread.author)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatDate(thread.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{thread.viewCount} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{thread.replyCount} replies</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
