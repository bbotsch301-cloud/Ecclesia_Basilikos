import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Edit2, Trash2, Loader2 } from "lucide-react";
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

interface CommentAuthor {
  id: string;
  firstName: string;
  lastName: string;
  username: string | null;
  role: string | null;
}

interface Comment {
  id: string;
  targetType: string;
  targetId: string;
  content: string;
  authorId: string;
  isEdited: boolean | null;
  editedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthor;
}

interface CommentSectionProps {
  targetType: "video" | "lesson";
  targetId: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function CommentSection({ targetType, targetId }: CommentSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const queryKey = ["/api/comments", targetType, targetId];

  const { data: commentsList = [], isLoading } = useQuery<Comment[]>({
    queryKey,
    queryFn: async () => {
      const res = await fetch(`/api/comments?targetType=${targetType}&targetId=${targetId}`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/comments", { targetType, targetId, content });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setNewComment("");
      toast({ title: "Comment posted" });
    },
    onError: () => {
      toast({ title: "Failed to post comment", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const res = await apiRequest("PUT", `/api/comments/${id}`, { content });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setEditingId(null);
      setEditContent("");
      toast({ title: "Comment updated" });
    },
    onError: () => {
      toast({ title: "Failed to update comment", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/comments/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({ title: "Comment deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete comment", variant: "destructive" });
    },
  });

  const canModify = (comment: Comment) => {
    if (!user) return false;
    return comment.authorId === user.id || ['admin', 'moderator'].includes(user.role || '');
  };

  const getInitials = (author: CommentAuthor) => {
    return `${(author.firstName || "")[0] || ""}${(author.lastName || "")[0] || ""}`.toUpperCase();
  };

  const getDisplayName = (author: CommentAuthor) => {
    if (author.username) return author.username;
    return `${author.firstName} ${author.lastName}`.trim();
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5" />
        Comments ({commentsList.length})
      </h3>

      {/* Add comment form */}
      {isAuthenticated ? (
        <div className="mb-6">
          <Textarea
            placeholder="Share your thoughts or ask a question..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="mb-2"
          />
          <Button
            onClick={() => createMutation.mutate(newComment)}
            disabled={!newComment.trim() || createMutation.isPending}
            size="sm"
            className="bg-royal-navy hover:bg-royal-navy/90 text-white"
          >
            {createMutation.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            Post Comment
          </Button>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600 text-sm">
            <a href="/login" className="text-royal-navy hover:underline font-medium">Sign in</a> to leave a comment.
          </p>
        </div>
      )}

      {/* Comments list */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : commentsList.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-6">No comments yet. Be the first to share your thoughts!</p>
      ) : (
        <div className="space-y-4">
          {commentsList.map((comment) => (
            <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-royal-navy text-white text-xs">
                  {getInitials(comment.author)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-gray-900">
                    {getDisplayName(comment.author)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                  {comment.isEdited && (
                    <span className="text-xs text-gray-400">(edited)</span>
                  )}
                </div>

                {editingId === comment.id ? (
                  <div>
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="mb-2"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateMutation.mutate({ id: comment.id, content: editContent })}
                        disabled={!editContent.trim() || updateMutation.isPending}
                      >
                        {updateMutation.isPending && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setEditingId(null); setEditContent(""); }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-700 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: comment.content }} />
                )}

                {canModify(comment) && editingId !== comment.id && (
                  <div className="flex gap-1 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditContent(comment.content);
                      }}
                    >
                      <Edit2 className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete comment?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the comment.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => deleteMutation.mutate(comment.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
