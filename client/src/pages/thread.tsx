import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MessageSquare, Users, Eye, Clock, Send, Pin, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ForumCategory, ForumThread, ForumReply, User } from "@shared/schema";

const createReplySchema = z.object({
  content: z.string().min(10, "Reply must be at least 10 characters"),
});

type CreateReplyForm = z.infer<typeof createReplySchema>;

export default function ThreadPage() {
  const [match, params] = useRoute("/forum/thread/:threadId");
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const threadId = params?.threadId;

  const { data, isLoading } = useQuery<{
    thread: ForumThread & { author: User; category: ForumCategory };
    replies: Array<ForumReply & { author: User }>;
  }>({
    queryKey: ['/api/forum/threads', threadId],
    enabled: !!threadId,
  });

  const form = useForm<CreateReplyForm>({
    resolver: zodResolver(createReplySchema),
    defaultValues: {
      content: "",
    },
  });

  const createReplyMutation = useMutation({
    mutationFn: async (data: CreateReplyForm) => {
      return await apiRequest(`/api/forum/threads/${threadId}/replies`, 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Reply posted successfully!",
      });
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ['/api/forum/threads', threadId],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post reply",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateReplyForm) => {
    createReplyMutation.mutate(data);
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

  if (!match || !threadId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Thread Not Found</h1>
          <Link href="/forum">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forum
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading thread...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Thread Not Found</h1>
          <Link href="/forum">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forum
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { thread, replies } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/forum">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forum
          </Button>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          {thread.isPinned && (
            <Pin className="h-5 w-5 text-amber-600" />
          )}
          <Badge
            style={{ backgroundColor: thread.category.color || '#3B82F6' }}
            className="text-white"
          >
            {thread.category.name}
          </Badge>
          {thread.isLocked && (
            <Badge variant="secondary">
              <Lock className="h-3 w-3 mr-1" />
              Locked
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 font-playfair">
          {thread.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
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

      {/* Original Thread Content */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {getUserDisplayName(thread.author)}
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(thread.createdAt)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none">
            <p className="whitespace-pre-wrap">{thread.content}</p>
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <div className="space-y-4 mb-8">
        {replies.map((reply) => (
          <Card key={reply.id} className="ml-4 border-l-4 border-amber-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {getUserDisplayName(reply.author)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(reply.createdAt)}
                    {reply.isEdited && <span className="ml-2">(edited)</span>}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <p className="whitespace-pre-wrap">{reply.content}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reply Form */}
      {isAuthenticated && !thread.isLocked ? (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Post a Reply</h3>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Reply</FormLabel>
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
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={createReplyMutation.isPending}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {createReplyMutation.isPending ? "Posting..." : "Post Reply"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : thread.isLocked ? (
        <Card className="border-gray-300">
          <CardContent className="py-8 text-center">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Thread Locked</h3>
            <p className="text-gray-600">
              This discussion thread has been locked and no longer accepts new replies.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-8 text-center">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Join the Discussion</h3>
            <p className="text-amber-700 mb-4">
              You need to be logged in to participate in this discussion.
            </p>
            <Link href="/education">
              <Button className="bg-amber-600 hover:bg-amber-700">
                Register or Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}