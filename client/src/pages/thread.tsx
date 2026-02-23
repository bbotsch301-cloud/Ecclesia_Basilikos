import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare, ArrowLeft, Eye, Clock, Lock, Users, Pencil, Trash2 } from "lucide-react";
import type { ForumThread, ForumReply, ForumCategory, User } from "@shared/schema";

interface ThreadData {
  thread: ForumThread & { author: User; category: ForumCategory };
  replies: Array<ForumReply & { author: User }>;
}

export default function ThreadPage() {
  const params = useParams<{ threadId: string }>();
  const threadId = params.threadId;
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [replyContent, setReplyContent] = useState("");

  // Edit states
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyContent, setEditReplyContent] = useState("");
  const [editThreadTitle, setEditThreadTitle] = useState("");
  const [editThreadContent, setEditThreadContent] = useState("");
  const [editThreadOpen, setEditThreadOpen] = useState(false);

  const { data, isLoading, error } = useQuery<ThreadData>({
    queryKey: ['/api/forum/threads', threadId],
    enabled: !!threadId,
  });

  usePageTitle(data?.thread?.title);

  const canModerate = user && ['admin', 'moderator'].includes(user.role || '');

  const replyMutation = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest('POST', `/api/forum/threads/${threadId}/replies`, { content });
    },
    onSuccess: () => {
      toast({ title: "Reply posted", description: "Your reply has been added to the thread." });
      setReplyContent("");
      queryClient.invalidateQueries({ queryKey: ['/api/forum/threads', threadId] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to post reply", variant: "destructive" });
    },
  });

  const editThreadMutation = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      return await apiRequest('PUT', `/api/forum/threads/${threadId}`, { title, content });
    },
    onSuccess: () => {
      toast({ title: "Thread updated" });
      setEditThreadOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/forum/threads', threadId] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update thread", variant: "destructive" });
    },
  });

  const deleteThreadMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('DELETE', `/api/forum/threads/${threadId}`);
    },
    onSuccess: () => {
      toast({ title: "Thread deleted" });
      navigate("/forum");
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete thread", variant: "destructive" });
    },
  });

  const editReplyMutation = useMutation({
    mutationFn: async ({ replyId, content }: { replyId: string; content: string }) => {
      return await apiRequest('PUT', `/api/forum/replies/${replyId}`, { content });
    },
    onSuccess: () => {
      toast({ title: "Reply updated" });
      setEditingReplyId(null);
      queryClient.invalidateQueries({ queryKey: ['/api/forum/threads', threadId] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update reply", variant: "destructive" });
    },
  });

  const deleteReplyMutation = useMutation({
    mutationFn: async (replyId: string) => {
      return await apiRequest('DELETE', `/api/forum/replies/${replyId}`);
    },
    onSuccess: () => {
      toast({ title: "Reply deleted" });
      queryClient.invalidateQueries({ queryKey: ['/api/forum/threads', threadId] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete reply", variant: "destructive" });
    },
  });

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim().length < 3) {
      toast({ title: "Error", description: "Reply must be at least 3 characters", variant: "destructive" });
      return;
    }
    replyMutation.mutate(replyContent);
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

  const getUserDisplayName = (u: User) => {
    return u.username || `${u.firstName} ${u.lastName}` || u.email;
  };

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

  if (error || !data?.thread) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Thread Not Found</h1>
            <p className="text-gray-600 mb-4">
              The thread you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/forum">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Forum
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { thread, replies } = data;
  const isThreadOwner = user?.id === thread.authorId;
  const canEditThread = isThreadOwner || canModerate;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back link */}
      <Link href="/forum" className="inline-flex items-center text-gray-600 hover:text-amber-600 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Forum
      </Link>

      {/* Thread */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2 mb-3">
            <Badge
              style={{ backgroundColor: thread.category.color || '#3B82F6' }}
              className="text-white text-xs"
            >
              {thread.category.name}
            </Badge>
            {thread.isLocked && (
              <Badge variant="secondary" className="text-xs">
                <Lock className="h-3 w-3 mr-1" />
                Locked
              </Badge>
            )}
          </div>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-2xl text-gray-900">{thread.title}</CardTitle>
            {canEditThread && (
              <div className="flex items-center gap-1 shrink-0">
                <Dialog open={editThreadOpen} onOpenChange={(open) => {
                  setEditThreadOpen(open);
                  if (open) {
                    setEditThreadTitle(thread.title);
                    setEditThreadContent(thread.content);
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Thread</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        value={editThreadTitle}
                        onChange={(e) => setEditThreadTitle(e.target.value)}
                        placeholder="Thread title"
                      />
                      <Textarea
                        value={editThreadContent}
                        onChange={(e) => setEditThreadContent(e.target.value)}
                        rows={6}
                      />
                      <Button
                        className="bg-amber-600 hover:bg-amber-700"
                        disabled={editThreadMutation.isPending}
                        onClick={() => editThreadMutation.mutate({ title: editThreadTitle, content: editThreadContent })}
                      >
                        {editThreadMutation.isPending ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Thread</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the thread and all its replies. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => deleteThreadMutation.mutate()}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{getUserDisplayName(thread.author)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDate(thread.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{thread.viewCount} views</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none whitespace-pre-wrap">
            {thread.content}
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
        </h2>
        {replies.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No replies yet. Be the first to respond!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {replies.map((reply) => {
              const isReplyOwner = user?.id === reply.authorId;
              const canEditReply = isReplyOwner || canModerate;
              const isEditing = editingReplyId === reply.id;

              return (
                <Card key={reply.id}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-sm">
                          {getUserDisplayName(reply.author).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {getUserDisplayName(reply.author)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(reply.createdAt)}
                            {reply.isEdited && (
                              <span className="ml-2 text-gray-400 italic">(edited)</span>
                            )}
                          </p>
                        </div>
                      </div>
                      {canEditReply && !isEditing && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingReplyId(reply.id);
                              setEditReplyContent(reply.content);
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Reply</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this reply. This cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => deleteReplyMutation.mutate(reply.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="pl-11 space-y-2">
                        <Textarea
                          value={editReplyContent}
                          onChange={(e) => setEditReplyContent(e.target.value)}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700"
                            disabled={editReplyMutation.isPending}
                            onClick={() => editReplyMutation.mutate({ replyId: reply.id, content: editReplyContent })}
                          >
                            {editReplyMutation.isPending ? "Saving..." : "Save"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingReplyId(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="prose prose-sm prose-gray max-w-none whitespace-pre-wrap pl-11">
                        {reply.content}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Reply form */}
      {thread.isLocked ? (
        <Card>
          <CardContent className="py-6 text-center">
            <Lock className="h-6 w-6 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">This thread is locked. No new replies can be posted.</p>
          </CardContent>
        </Card>
      ) : isAuthenticated ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Post a Reply</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReply} className="space-y-4">
              <Textarea
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={4}
              />
              <Button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700"
                disabled={replyMutation.isPending || replyContent.trim().length < 3}
              >
                {replyMutation.isPending ? "Posting..." : "Post Reply"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-gray-500 mb-3">Sign in to reply to this thread.</p>
            <Link href="/login?redirect=/forum">
              <Button variant="outline">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
