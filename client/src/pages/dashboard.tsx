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
  Banknote,
  Shield,
  Globe,
  Map,
  GraduationCap,
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
    category: string;
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

const pillarConfig = [
  {
    category: "Lawful Money",
    icon: Banknote,
    label: "Lawful Money Redemption",
    shortLabel: "Lawful Money",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    gradient: "from-yellow-600 to-amber-700",
    href: "/lawful-money",
    forumHref: "/forum",
    downloadHref: "/downloads",
    description: "Redeem Federal Reserve Notes for lawful money under 12 USC §411",
  },
  {
    category: "Trust & Assets",
    icon: Shield,
    label: "Trust & Asset Protection",
    shortLabel: "Trust & Assets",
    color: "text-red-700",
    bgColor: "bg-red-50",
    gradient: "from-red-700 to-red-900",
    href: "/trust-assets",
    forumHref: "/forum",
    downloadHref: "/downloads",
    description: "Protect assets using proper trust structures and administration",
  },
  {
    category: "State Passport",
    icon: Globe,
    label: "State-Citizen Passport",
    shortLabel: "State Passport",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    gradient: "from-blue-700 to-blue-900",
    href: "/state-passport",
    forumHref: "/forum",
    downloadHref: "/downloads",
    description: "Establish state-citizen status and obtain a passport reflecting it",
  },
];

interface CourseBasic {
  id: string;
  title: string;
  category: string;
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

  const { data: allCourses = [] } = useQuery<CourseBasic[]>({
    queryKey: ["/api/courses"],
  });

  function getEnrollmentForCategory(category: string) {
    return enrollments.find((e) => e.course?.category === category);
  }

  function getCourseForCategory(category: string) {
    return allCourses.find((c) => c.category === category);
  }

  const completedPillars = pillarConfig.filter(
    (p) => getEnrollmentForCategory(p.category)?.completedAt
  ).length;

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-royal-navy dark:via-royal-navy dark:to-royal-navy">
      {/* Header */}
      <section className="bg-gradient-to-r from-royal-navy to-royal-burgundy text-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-cinzel-decorative font-bold">
                Welcome back, {user?.firstName}
              </h1>
              <p className="text-gray-300 mt-2 font-cinzel">
                Track your progress across the three pillars
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Badge className="bg-royal-gold/20 text-royal-gold border-royal-gold/40 font-cinzel">
                {completedPillars}/3 Pillars Complete
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Progress */}
        <Card className="mb-8">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-500 font-cinzel flex items-center gap-2">
                <Map className="w-4 h-4" /> Overall Foundation Progress
              </span>
              <span className="font-semibold text-royal-navy dark:text-royal-gold">{completedPillars} / 3 Pillars</span>
            </div>
            <Progress value={(completedPillars / 3) * 100} className="h-2" />
          </CardContent>
        </Card>

        {/* Pillar Progress Cards */}
        <div className="space-y-4 mb-8">
          {pillarConfig.map((pillar) => {
            const enrollment = getEnrollmentForCategory(pillar.category);
            const course = getCourseForCategory(pillar.category);
            const progress = enrollment?.progress || 0;
            const isCompleted = !!enrollment?.completedAt;
            const isStarted = !!enrollment;
            const Icon = pillar.icon;

            // Resolve the course link: enrolled → course page, not enrolled but course exists → course page, fallback → courses list
            const courseHref = isStarted && enrollment
              ? `/course/${enrollment.courseId}`
              : course
                ? `/course/${course.id}`
                : "/courses";

            return (
              <Card key={pillar.category} className={`overflow-hidden border-2 ${isCompleted ? "border-green-300" : isStarted ? "border-royal-gold/50" : "border-gray-200 dark:border-gray-700"}`}>
                <div className="grid md:grid-cols-6">
                  {/* Pillar indicator */}
                  <div className={`bg-gradient-to-br ${pillar.gradient} p-6 flex items-center justify-center`}>
                    <div className="text-center text-white">
                      <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-2">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-cinzel font-bold text-xs uppercase tracking-wider">{pillar.shortLabel}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-5 p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-cinzel font-bold text-royal-navy dark:text-royal-gold text-lg">
                          {pillar.label}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{pillar.description}</p>
                      </div>
                      {isCompleted ? (
                        <Badge className="bg-green-500 text-white shrink-0">
                          <CheckCircle className="w-3 h-3 mr-1" /> Complete
                        </Badge>
                      ) : isStarted ? (
                        <Badge className="bg-royal-gold text-royal-navy shrink-0">{progress}%</Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-400 shrink-0">Not Started</Badge>
                      )}
                    </div>

                    {isStarted && !isCompleted && (
                      <div className="mb-3">
                        <Progress value={progress} className="h-1.5" />
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Link href={courseHref}>
                        <Button size="sm" className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold text-xs">
                          {isCompleted ? (
                            <><CheckCircle className="w-3 h-3 mr-1" /> Review</>
                          ) : isStarted ? (
                            <><Play className="w-3 h-3 mr-1" /> Continue Course</>
                          ) : (
                            <><GraduationCap className="w-3 h-3 mr-1" /> Begin Course</>
                          )}
                        </Button>
                      </Link>
                      <Link href={pillar.href}>
                        <Button variant="ghost" size="sm" className="text-royal-gold font-cinzel text-xs">
                          <BookOpen className="w-3 h-3 mr-1" /> Pillar Info
                        </Button>
                      </Link>
                      <Link href={pillar.downloadHref}>
                        <Button variant="ghost" size="sm" className="text-gray-500 font-cinzel text-xs">
                          <Download className="w-3 h-3 mr-1" /> Templates
                        </Button>
                      </Link>
                      <Link href={pillar.forumHref}>
                        <Button variant="ghost" size="sm" className="text-gray-500 font-cinzel text-xs">
                          <MessageSquare className="w-3 h-3 mr-1" /> Discuss
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-3xl font-bold text-royal-navy dark:text-royal-gold">
                    {statsLoading ? "..." : stats?.coursesInProgress || 0}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-royal-gold" />
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
                <CardTitle className="text-royal-navy dark:text-royal-gold flex items-center gap-2 font-cinzel">
                  <BookOpen className="h-5 w-5" />
                  Continue Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                {enrollments.filter(e => !e.completedAt).length === 0 ? (
                  <div className="text-center py-8">
                    <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">You haven't started any courses yet.</p>
                    <Link href="/courses">
                      <Button className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold">
                        Browse Courses
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrollments.filter(e => !e.completedAt).slice(0, 3).map((enrollment) => (
                      <div key={enrollment.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-royal-navy/50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-gray-200 truncate">
                            {enrollment.course.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {enrollment.course.category}
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
                          <Button size="sm" className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold shrink-0">
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
                    <Users className="h-8 w-8 text-royal-navy dark:text-royal-gold mx-auto mb-2" />
                    <p className="text-sm font-medium font-cinzel">Forum</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/learning-path">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="pt-6 text-center">
                    <Map className="h-8 w-8 text-royal-navy dark:text-royal-gold mx-auto mb-2" />
                    <p className="text-sm font-medium font-cinzel">Learning Path</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/downloads">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="pt-6 text-center">
                    <Download className="h-8 w-8 text-royal-navy dark:text-royal-gold mx-auto mb-2" />
                    <p className="text-sm font-medium font-cinzel">Downloads</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/courses">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="pt-6 text-center">
                    <FileText className="h-8 w-8 text-royal-navy dark:text-royal-gold mx-auto mb-2" />
                    <p className="text-sm font-medium font-cinzel">All Courses</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-royal-navy dark:text-royal-gold flex items-center gap-2 font-cinzel">
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
                          <p className="text-sm text-gray-700 dark:text-gray-300">
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
