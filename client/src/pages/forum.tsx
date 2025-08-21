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

const createThreadSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  categoryId: z.string().min(1, "Please select a category"),
});

type CreateThreadForm = z.infer<typeof createThreadSchema>;

export default function Forum() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<ForumCategory[]>({
    queryKey: ['/api/forum/categories'],
  });

  const { data: threads = [], isLoading: threadsLoading } = useQuery<Array<ForumThread & { author: User; category: ForumCategory; lastReplyUser?: User }>>({
    queryKey: ['/api/forum/categories', selectedCategory, 'threads'],
    enabled: !!selectedCategory,
  });

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
      return await apiRequest('/api/forum/threads', 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Thread created successfully!",
      });
      setIsCreateDialogOpen(false);
      form.reset();
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
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Discussion Thread</DialogTitle>
                  <DialogDescription>
                    Share your thoughts and start a conversation with the community
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
                              {categories.map((category: ForumCategory) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
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
                          <FormLabel>Thread Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter thread title..." {...field} />
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
                              className="min-h-32"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createThreadMutation.isPending}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        {createThreadMutation.isPending ? "Creating..." : "Create Thread"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {!isAuthenticated && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="py-4">
              <p className="text-amber-800">
                <Link href="/education" className="text-amber-600 hover:text-amber-800 font-semibold">
                  Register or login
                </Link>{" "}
                to participate in discussions and create new threads.
              </p>
            </CardContent>
          </Card>
        )}
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
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                    selectedCategory === null ? 'bg-amber-50 border-r-2 border-amber-600' : ''
                  }`}
                >
                  <div className="font-medium">All Categories</div>
                  <div className="text-sm text-gray-500">View all discussions</div>
                </button>
                {categories.map((category: ForumCategory) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                      selectedCategory === category.id ? 'bg-amber-50 border-r-2 border-amber-600' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color || '#3B82F6' }}
                      />
                      <span className="font-medium">{category.name}</span>
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
          {selectedCategory ? (
            <div>
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
                      Be the first to start a conversation in this category.
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
                  {threads.map((thread: ForumThread & { author: User; category: ForumCategory; lastReplyUser?: User }) => (
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
                              {thread.content.substring(0, 150)}...
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
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to the Forum</h3>
                <p className="text-gray-600 mb-4">
                  Select a category from the sidebar to view discussions, or create a new thread to start a conversation.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}