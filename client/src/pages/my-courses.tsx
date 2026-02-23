import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { useQuery, useQueries, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import RequireAuth from "@/components/RequireAuth";
import {
  BookOpen,
  Play,
  Clock,
  CheckCircle,
  Users,
  GraduationCap,
} from "lucide-react";
import ScriptureQuote from "@/components/ui/scripture-quote";
import { usePageTitle } from "@/hooks/usePageTitle";

interface CourseData {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string | null;
  category: string;
  lessonCount?: number;
}

interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedAt: string | null;
  progress: number | null;
  course: CourseData;
}

interface CourseProgress {
  totalSections: number;
  completedSections: number;
}

function MyCourseContent() {
  usePageTitle("My Courses");
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'enrolled' | 'available' | 'completed'>('enrolled');

  // Fetch enrollments
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery<Enrollment[]>({
    queryKey: ['/api/my-enrollments'],
    enabled: isAuthenticated,
  });

  // Fetch all published courses for "Available" tab
  const { data: allCourses = [], isLoading: coursesLoading } = useQuery<CourseData[]>({
    queryKey: ['/api/courses'],
    enabled: isAuthenticated,
  });

  // Fetch progress for each enrolled course
  const enrolledCourseIds = enrollments.map(e => e.courseId);
  const progressQueries = useQueries({
    queries: enrollments.map(enrollment => ({
      queryKey: ['/api/courses', enrollment.courseId, 'progress'] as const,
      enabled: isAuthenticated && !!enrollment.courseId,
    })),
  });

  // Build progress map
  const progressMap: Record<string, number> = {};
  enrollments.forEach((enrollment, i) => {
    const progressData = progressQueries[i]?.data as CourseProgress | undefined;
    if (progressData && progressData.totalSections > 0) {
      progressMap[enrollment.courseId] = Math.round(
        (progressData.completedSections / progressData.totalSections) * 100
      );
    } else {
      progressMap[enrollment.courseId] = 0;
    }
  });

  const enrolledInProgress = enrollments.filter(e => (progressMap[e.courseId] ?? 0) < 100);
  const completedEnrollments = enrollments.filter(e => (progressMap[e.courseId] ?? 0) >= 100);
  const enrolledCourseIdSet = new Set(enrolledCourseIds);
  const availableCourses = allCourses.filter(c => !enrolledCourseIdSet.has(c.id));

  // Enrollment mutation for available courses
  const enrollMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const response = await apiRequest("POST", `/api/enrollments`, { courseId });
      return response.json();
    },
    onSuccess: (data, courseId) => {
      window.location.href = `/course/${courseId}/lesson/1`;
    },
    onError: (error: any) => {
      toast({
        title: "Unable to enroll",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const getLevelColor = (level: string) => {
    const lower = level.toLowerCase();
    if (lower === 'foundational' || lower === 'beginner') return 'bg-covenant-gold/10 text-covenant-blue';
    if (lower === 'intermediate') return 'bg-blue-100 text-blue-800';
    if (lower === 'advanced') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-600';
  };

  const isLoading = enrollmentsLoading || coursesLoading;

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-b from-covenant-light via-white to-covenant-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-covenant-gold mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-covenant-light via-white to-covenant-light">
      {/* Header */}
      <section className="bg-covenant-blue text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <GraduationCap className="h-16 w-16 text-covenant-gold" />
            </div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
              My Courses
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Continue your journey in trust administration and kingdom finance education
            </p>
          </div>
        </div>
      </section>

      {/* Progress Overview */}
      <section className="py-12 -mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-covenant-gold/20 rounded-full flex items-center justify-center mr-4">
                    <BookOpen className="h-6 w-6 text-covenant-gold" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-covenant-blue">{enrolledInProgress.length}</p>
                    <p className="text-covenant-gray">Courses In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-covenant-blue">{completedEnrollments.length}</p>
                    <p className="text-covenant-gray">Courses Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-covenant-blue">{availableCourses.length}</p>
                    <p className="text-covenant-gray">Available Courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => setActiveTab('enrolled')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'enrolled'
                    ? 'bg-covenant-blue text-white'
                    : 'text-covenant-gray hover:text-covenant-blue'
                }`}
              >
                In Progress ({enrolledInProgress.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'completed'
                    ? 'bg-covenant-blue text-white'
                    : 'text-covenant-gray hover:text-covenant-blue'
                }`}
              >
                Completed ({completedEnrollments.length})
              </button>
              <button
                onClick={() => setActiveTab('available')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'available'
                    ? 'bg-covenant-blue text-white'
                    : 'text-covenant-gray hover:text-covenant-blue'
                }`}
              >
                Available ({availableCourses.length})
              </button>
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {activeTab === 'enrolled' && enrolledInProgress.length === 0 && (
              <div className="col-span-full">
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses in progress</h3>
                    <p className="text-gray-600 mb-4">Browse available courses to start learning.</p>
                    <Button onClick={() => setActiveTab('available')} variant="outline">
                      View Available Courses
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'completed' && completedEnrollments.length === 0 && (
              <div className="col-span-full">
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed courses yet</h3>
                    <p className="text-gray-600">Keep learning to complete your first course!</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'available' && availableCourses.length === 0 && (
              <div className="col-span-full">
                <Card>
                  <CardContent className="py-12 text-center">
                    <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">You're enrolled in all courses!</h3>
                    <p className="text-gray-600">Great job! Check back later for new courses.</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'enrolled' && enrolledInProgress.map((enrollment) => {
              const course = enrollment.course;
              const progress = progressMap[enrollment.courseId] ?? 0;
              return (
                <Card key={enrollment.id} className="border-covenant-light hover:border-covenant-gold transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getLevelColor(course.level)}>
                        {course.level}
                      </Badge>
                    </div>
                    <CardTitle className="text-covenant-blue text-lg">{course.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-covenant-gray">Progress</span>
                          <span className="text-covenant-blue font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-sm text-covenant-gray">
                        {course.duration && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{course.duration}</span>
                          </div>
                        )}
                      </div>

                      <Link href={`/course/${enrollment.courseId}/lesson/1`}>
                        <Button
                          className="w-full bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Continue Learning
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {activeTab === 'completed' && completedEnrollments.map((enrollment) => {
              const course = enrollment.course;
              return (
                <Card key={enrollment.id} className="border-covenant-light hover:border-covenant-gold transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getLevelColor(course.level)}>
                        {course.level}
                      </Badge>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <CardTitle className="text-covenant-blue text-lg">{course.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-covenant-gray">Progress</span>
                          <span className="text-green-600 font-medium">100%</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>

                      <Link href={`/course/${enrollment.courseId}/lesson/1`}>
                        <Button
                          variant="outline"
                          className="w-full border-covenant-blue text-covenant-blue"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Review Course
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {activeTab === 'available' && availableCourses.map((course) => (
              <Card key={course.id} className="border-covenant-light hover:border-covenant-gold transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  </div>
                  <CardTitle className="text-covenant-blue text-lg">{course.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-covenant-gray">
                      {course.duration && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{course.duration}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      className="w-full bg-covenant-blue hover:bg-covenant-blue/80 text-white"
                      onClick={() => enrollMutation.mutate(course.id)}
                      disabled={enrollMutation.isPending}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <ScriptureQuote
            quote="Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth."
            reference="2 Timothy 2:15 (KJV)"
            className="mb-8"
          />
        </div>
      </section>
    </div>
  );
}

export default function MyCourses() {
  return (
    <RequireAuth>
      <MyCourseContent />
    </RequireAuth>
  );
}
