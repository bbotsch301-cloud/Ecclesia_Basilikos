import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Reply, Calendar, Shield } from "lucide-react";
import { format } from "date-fns";

interface PublicProfile {
  user: {
    id: string;
    username: string | null;
    firstName: string;
    lastName: string;
    role: string | null;
    createdAt: string;
  };
  threadCount: number;
  replyCount: number;
}

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  moderator: "Moderator",
  instructor: "Instructor",
  student: "Member",
};

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-800",
  moderator: "bg-purple-100 text-purple-800",
  instructor: "bg-blue-100 text-blue-800",
  student: "bg-gray-100 text-gray-800",
};

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  usePageTitle("Member Profile");

  const { data: profile, isLoading, error } = useQuery<PublicProfile>({
    queryKey: [`/api/users/${userId}/profile`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Loading profile...
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              User not found.
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { user, threadCount, replyCount } = profile;
  const displayName = user.username || `${user.firstName} ${user.lastName}`;
  const initials = `${(user.firstName || "")[0] || ""}${(user.lastName || "")[0] || ""}`.toUpperCase();
  const role = user.role || "student";

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-royal-navy text-white text-xl font-cinzel">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-xl font-cinzel">{displayName}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className={roleColors[role]}>
                  <Shield className="w-3 h-3 mr-1" />
                  {roleLabels[role] || role}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="py-6 text-center">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 text-royal-gold" />
              <p className="text-2xl font-bold">{threadCount}</p>
              <p className="text-xs text-muted-foreground">Threads</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 text-center">
              <Reply className="w-6 h-6 mx-auto mb-2 text-royal-gold" />
              <p className="text-2xl font-bold">{replyCount}</p>
              <p className="text-xs text-muted-foreground">Replies</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-royal-gold" />
              <p className="text-sm font-medium">
                {user.createdAt ? format(new Date(user.createdAt), "MMM yyyy") : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">Joined</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
