import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import RequireAuth from "@/components/RequireAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  BookOpen,
  CheckCircle,
  MessageSquare,
  Play,
  ArrowRight,
  Clock,
  FileText,
  Download,
  Users,
  Video,
} from "lucide-react";

interface DashboardStats {
  coursesInProgress: number;
  coursesCompleted: number;
  forumPosts: number;
  videosWatched: number;
  recentActivity: ActivityItem[];
}

interface ActivityItem {
  id: string;
  type: "enrollment" | "forum_thread" | "forum_reply" | "video_watch";
  title: string;
  date: string;
}

interface Enrollment {
  id: string;
  courseId: string;
  progress: number | null;
  completedAt: string | null;
  course: {
    id: string;
    title: string;
    description: string;
    level: string;
    duration: string | null;
  };
}

function getActivityIcon(type: string) {
  switch (type) {
    case "enrollment": return <BookOpen className="h-4 w-4 text-blue-500" />;
    case "forum_thread": return <MessageSquare className="h-4 w-4 text-green-500" />;
    case "forum_reply": return <MessageSquare className="h-4 w-4 text-teal-500" />;
    case "video_watch": return <Play className="h-4 w-4 text-purple-500" />;
    default: return <Clock className="h-4 w-4 text-gray-500" />;
  }
}

function getActivityLabel(type: string) {
  switch (type) {
    case "enrollment": return "Enrolled in";
    case "forum_thread": return "Started thread";
    case "forum_reply": return "Replied to";
    case "video_watch": return "Watched";
    default: return "";
  }
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

function DashboardContent() {
  usePageTitle("Dashboard");
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: enrollments = [] } = useQuery<Enrollment[]>({
    queryKey: ["/api/my-enrollments"],
  });

  const inProgressCourses = enrollments.filter(e => !e.completedAt);

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-covenant-light via-white to-covenant-light">
      {/* Header */}
      <section className="bg-covenant-blue text-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-playfair font-bold">
            Welcome back, {user?.firstName}
          </h1>
          <p className="text-blue-200 mt-2">
            Track your learning progress and stay connected with the community.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-3xl font-bold text-covenant-blue">
                    {statsLoading ? "..." : stats?.coursesInProgress || 0}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {statsLoading ? "..." : stats?.coursesCompleted || 0}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Forum Posts</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {statsLoading ? "..." : stats?.forumPosts || 0}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Videos Watched</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {statsLoading ? "..." : stats?.videosWatched || 0}
                  </p>
                </div>
                <Video className="h-8 w-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-covenant-blue flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Continue Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                {inProgressCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">You haven't started any courses yet.</p>
                    <Link href="/courses">
                      <Button className="bg-covenant-gold hover:bg-covenant-gold/90 text-covenant-blue">
                        Browse Courses
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inProgressCourses.slice(0, 3).map((enrollment) => (
                      <div key={enrollment.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {enrollment.course.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {enrollment.course.level}
                            </Badge>
                            {enrollment.course.duration && (
                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {enrollment.course.duration}
                              </span>
                            )}
                          </div>
                          <div className="mt-2">
                            <Progress value={enrollment.progress || 0} className="h-2" />
                            <p className="text-xs text-gray-500 mt-1">
                              {enrollment.progress || 0}% complete
                            </p>
                          </div>
                        </div>
                        <Link href={`/course/${enrollment.courseId}`}>
                          <Button size="sm" className="bg-covenant-blue hover:bg-covenant-blue/90 text-white shrink-0">
                            Continue <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <Link href="/forum">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="pt-6 text-center">
                    <Users className="h-8 w-8 text-covenant-blue mx-auto mb-2" />
                    <p className="text-sm font-medium">Forum</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/videos">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="pt-6 text-center">
                    <Video className="h-8 w-8 text-covenant-blue mx-auto mb-2" />
                    <p className="text-sm font-medium">Videos</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/downloads">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="pt-6 text-center">
                    <Download className="h-8 w-8 text-covenant-blue mx-auto mb-2" />
                    <p className="text-sm font-medium">Downloads</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/courses">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="pt-6 text-center">
                    <FileText className="h-8 w-8 text-covenant-blue mx-auto mb-2" />
                    <p className="text-sm font-medium">Courses</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-covenant-blue flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!stats?.recentActivity || stats.recentActivity.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-6">
                    No recent activity yet. Start by enrolling in a course or joining the forum!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentActivity.map((item, idx) => (
                      <div key={`${item.id}-${idx}`} className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getActivityIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700">
                            <span className="text-gray-500">{getActivityLabel(item.type)}</span>{" "}
                            <span className="font-medium truncate block">{item.title}</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {item.date ? formatDate(item.date) : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
