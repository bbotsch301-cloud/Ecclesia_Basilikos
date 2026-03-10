import { useState, lazy, Suspense } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  MessageSquare, ArrowLeft, Eye, Lock, Pencil, Trash2,
  Heart, Bell, BellOff, Loader2, Crown, CornerDownRight,
} from "lucide-react";
import type { ForumThread, ForumReply, ForumCategory, User } from "@shared/schema";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

const RichTextEditor = lazy(() => import("@/components/RichTextEditor"));

interface ThreadWithLikes extends ForumThread {
  author: User;
  category: ForumCategory;
  likeCount: number;
  userLiked: boolean;
}

interface ReplyWithLikes extends ForumReply {
  author: User;
  likeCount: number;
  userLiked: boolean;
}

interface ThreadData {
  thread: ThreadWithLikes;
  replies: ReplyWithLikes[];
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
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatFullDate(date: string | Date | null): string {
  if (!date) return "Unknown";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getUserDisplayName(u: User): string {
  return u.username || `${u.firstName} ${u.lastName}`.trim() || u.email;
}

function getUserInitials(u: User): string {
  if (u.firstName && u.lastName) return `${u.firstName[0]}${u.lastName[0]}`.toUpperCase();
  return (u.username || u.email || "?")[0].toUpperCase();
}

export default function ThreadPage() {
  const params = useParams<{ threadId: string }>();
  const threadId = params.threadId;
  const { user, isAuthenticated, isPremium } = useAuth();
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
    queryKey: ["/api/forum/threads", threadId],
    enabled: !!threadId,
  });

  const { data: subscription } = useQuery<{ subscribed: boolean }>({
    queryKey: ["/api/forum/threads", threadId, "subscription"],
    enabled: !!threadId && isAuthenticated,
  });

  usePageTitle(data?.thread?.title);

  const canModerate = user && ["admin", "moderator"].includes(user.role || "");

  // Mutations
  const replyMutation = useMutation({
    mutationFn: async (content: string) => await apiRequest("POST", `/api/forum/threads/${threadId}/replies`, { content }),
    onSuccess: () => {
      toast({ title: "Reply posted" });
      setReplyContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/forum/threads", threadId] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to post reply", variant: "destructive" });
    },
  });

  const editThreadMutation = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) =>
      await apiRequest("PUT", `/api/forum/threads/${threadId}`, { title, content }),
    onSuccess: () => {
      toast({ title: "Thread updated" });
      setEditThreadOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/forum/threads", threadId] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteThreadMutation = useMutation({
    mutationFn: async () => await apiRequest("DELETE", `/api/forum/threads/${threadId}`),
    onSuccess: () => {
      toast({ title: "Thread deleted" });
      navigate("/forum");
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const editReplyMutation = useMutation({
    mutationFn: async ({ replyId, content }: { replyId: string; content: string }) =>
      await apiRequest("PUT", `/api/forum/replies/${replyId}`, { content }),
    onSuccess: () => {
      toast({ title: "Reply updated" });
      setEditingReplyId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/forum/threads", threadId] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteReplyMutation = useMutation({
    mutationFn: async (replyId: string) => await apiRequest("DELETE", `/api/forum/replies/${replyId}`),
    onSuccess: () => {
      toast({ title: "Reply deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/forum/threads", threadId] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const likeThreadMutation = useMutation({
    mutationFn: async (liked: boolean) => {
      if (liked) return await apiRequest("DELETE", `/api/forum/threads/${threadId}/like`);
      return await apiRequest("POST", `/api/forum/threads/${threadId}/like`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/forum/threads", threadId] }),
  });

  const likeReplyMutation = useMutation({
    mutationFn: async ({ replyId, liked }: { replyId: string; liked: boolean }) => {
      if (liked) return await apiRequest("DELETE", `/api/forum/replies/${replyId}/like`);
      return await apiRequest("POST", `/api/forum/replies/${replyId}/like`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/forum/threads", threadId] }),
  });

  const subscribeMutation = useMutation({
    mutationFn: async (subscribed: boolean) => {
      if (subscribed) return await apiRequest("DELETE", `/api/forum/threads/${threadId}/subscribe`);
      return await apiRequest("POST", `/api/forum/threads/${threadId}/subscribe`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/threads", threadId, "subscription"] });
      toast({ title: subscription?.subscribed ? "Unsubscribed" : "Subscribed to thread" });
    },
  });

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.replace(/<[^>]*>/g, "").trim().length < 3) {
      toast({ title: "Error", description: "Reply must be at least 3 characters", variant: "destructive" });
      return;
    }
    replyMutation.mutate(replyContent);
  };

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-royal-gold mx-auto mb-3" />
          <p className="text-gray-500">Loading thread...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.thread) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-md">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Thread Not Found</h1>
          <p className="text-gray-500 mb-6">This thread doesn't exist or has been removed.</p>
          <Link href="/forum">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forum
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { thread, replies } = data;
  const isThreadOwner = user?.id === thread.authorId;
  const canEditThread = isThreadOwner || canModerate;

  return (
    <TooltipProvider>
      <div className="pt-16 min-h-screen bg-gray-50">
        {/* Breadcrumb bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3 max-w-4xl">
            <Breadcrumbs
              items={[
                { label: "Forum", href: "/forum" },
                { label: thread.category.name, href: `/forum?category=${thread.category.id}` },
                { label: thread.title },
              ]}
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Thread Card */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
            {/* Thread header */}
            <div className="px-5 md:px-6 pt-5 md:pt-6 pb-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-11 w-11 shrink-0 hidden sm:flex">
                  <AvatarFallback className="bg-royal-navy text-white font-semibold">
                    {getUserInitials(thread.author)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-1.5">
                        {thread.title}
                      </h1>
                      <div className="flex items-center gap-2 flex-wrap text-sm text-gray-500">
                        <span className="font-medium text-gray-700">{getUserDisplayName(thread.author)}</span>
                        <span className="text-gray-300">&middot;</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-default">{timeAgo(thread.createdAt)}</span>
                          </TooltipTrigger>
                          <TooltipContent>{formatFullDate(thread.createdAt)}</TooltipContent>
                        </Tooltip>
                        {thread.isLocked && (
                          <>
                            <span className="text-gray-300">&middot;</span>
                            <span className="flex items-center gap-1 text-amber-600">
                              <Lock className="h-3 w-3" /> Locked
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    {canEditThread && (
                      <div className="flex items-center gap-0.5 shrink-0">
                        <Dialog
                          open={editThreadOpen}
                          onOpenChange={(open) => {
                            setEditThreadOpen(open);
                            if (open) {
                              setEditThreadTitle(thread.title);
                              setEditThreadContent(thread.content);
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                              <Pencil className="h-3.5 w-3.5" />
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
                                className="w-full bg-royal-gold hover:bg-royal-gold/90 text-royal-navy"
                                disabled={editThreadMutation.isPending}
                                onClick={() => editThreadMutation.mutate({ title: editThreadTitle, content: editThreadContent })}
                              >
                                {editThreadMutation.isPending ? "Saving..." : "Save Changes"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Thread</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the thread and all its replies.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteThreadMutation.mutate()}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Thread content */}
            <div className="px-5 md:px-6 pb-4">
              <div
                className="prose prose-gray max-w-none text-[15px] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: thread.content }}
              />
            </div>

            {/* Thread actions bar */}
            <div className="px-5 md:px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center gap-1">
              <button
                onClick={() => isAuthenticated && likeThreadMutation.mutate(thread.userLiked)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  thread.userLiked
                    ? "text-red-500 bg-red-50 hover:bg-red-100"
                    : isAuthenticated
                    ? "text-gray-500 hover:bg-gray-100 hover:text-red-500"
                    : "text-gray-400 cursor-default"
                }`}
              >
                <Heart className={`h-4 w-4 ${thread.userLiked ? "fill-current" : ""}`} />
                <span>{thread.likeCount > 0 ? thread.likeCount : "Like"}</span>
              </button>
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500">
                <MessageSquare className="h-4 w-4" />
                <span>{replies.length}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500">
                <Eye className="h-4 w-4" />
                <span>{thread.viewCount}</span>
              </div>
              <div className="flex-1" />
              {isAuthenticated && (
                <button
                  onClick={() => subscribeMutation.mutate(!!subscription?.subscribed)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    subscription?.subscribed
                      ? "text-royal-gold bg-royal-gold/10 hover:bg-royal-gold/20"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {subscription?.subscribed ? (
                    <>
                      <Bell className="h-4 w-4" />
                      <span className="hidden sm:inline">Subscribed</span>
                    </>
                  ) : (
                    <>
                      <BellOff className="h-4 w-4" />
                      <span className="hidden sm:inline">Subscribe</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Replies Section */}
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CornerDownRight className="h-4 w-4 text-gray-400" />
              {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
            </h2>

            {replies.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No replies yet. Be the first to respond!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {replies.map((reply, index) => {
                  const isReplyOwner = user?.id === reply.authorId;
                  const canEditReply = isReplyOwner || canModerate;
                  const isEditing = editingReplyId === reply.id;

                  return (
                    <div key={reply.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="px-5 py-4">
                        {/* Reply header */}
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-royal-navy/10 text-royal-navy font-semibold text-xs">
                                {getUserInitials(reply.author)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {getUserDisplayName(reply.author)}
                              </p>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <p className="text-xs text-gray-400 cursor-default">
                                    {timeAgo(reply.createdAt)}
                                    {reply.isEdited && <span className="ml-1 italic">(edited)</span>}
                                  </p>
                                </TooltipTrigger>
                                <TooltipContent>{formatFullDate(reply.createdAt)}</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                          {canEditReply && !isEditing && (
                            <div className="flex items-center gap-0.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-gray-400 hover:text-gray-600"
                                onClick={() => {
                                  setEditingReplyId(reply.id);
                                  setEditReplyContent(reply.content);
                                }}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Reply</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete this reply.
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

                        {/* Reply content */}
                        {isEditing ? (
                          <div className="space-y-3">
                            <Textarea
                              value={editReplyContent}
                              onChange={(e) => setEditReplyContent(e.target.value)}
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy"
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
                          <div
                            className="prose prose-sm prose-gray max-w-none text-[14px] leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: reply.content }}
                          />
                        )}
                      </div>

                      {/* Reply action bar */}
                      {!isEditing && (
                        <div className="px-5 py-2 border-t border-gray-50 bg-gray-50/30 flex items-center">
                          <button
                            onClick={() => isAuthenticated && likeReplyMutation.mutate({ replyId: reply.id, liked: reply.userLiked })}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                              reply.userLiked
                                ? "text-red-500"
                                : isAuthenticated
                                ? "text-gray-400 hover:text-red-500"
                                : "text-gray-300 cursor-default"
                            }`}
                          >
                            <Heart className={`h-3.5 w-3.5 ${reply.userLiked ? "fill-current" : ""}`} />
                            {reply.likeCount > 0 && <span>{reply.likeCount}</span>}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reply Form */}
          {thread.isLocked ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <Lock className="h-6 w-6 text-amber-500 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">This thread is locked. No new replies can be posted.</p>
            </div>
          ) : isAuthenticated && isPremium ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm">Post a Reply</h3>
              </div>
              <div className="p-5">
                <form onSubmit={handleSubmitReply} className="space-y-4">
                  <Suspense
                    fallback={
                      <div className="border rounded-lg p-4 min-h-[120px] flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                      </div>
                    }
                  >
                    <RichTextEditor
                      content={replyContent}
                      onChange={setReplyContent}
                      placeholder="Write your reply..."
                      minHeight="120px"
                    />
                  </Suspense>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-semibold"
                      disabled={replyMutation.isPending || replyContent.replace(/<[^>]*>/g, "").trim().length < 3}
                    >
                      {replyMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        "Post Reply"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          ) : isAuthenticated ? (
            <div className="bg-white rounded-xl border border-royal-gold/20 p-6 text-center">
              <Crown className="h-8 w-8 text-royal-gold mx-auto mb-2" />
              <p className="text-gray-700 font-medium mb-1">Premium members can reply</p>
              <p className="text-gray-500 text-sm mb-4">Upgrade to join the discussion.</p>
              <Link href="/pricing">
                <Button className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-semibold">
                  View Plans
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-gray-500 mb-3">Sign in to reply to this thread.</p>
              <Link href={`/login?redirect=/forum/thread/${threadId}`}>
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
