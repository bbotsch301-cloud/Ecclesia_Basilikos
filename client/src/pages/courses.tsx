import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  BookOpen,
  Users,
  User,
  GraduationCap,
  Shield
} from "lucide-react";
import ScriptureQuote from "@/components/ui/scripture-quote";
import { usePageTitle } from "@/hooks/usePageTitle";

interface CourseWithLessonCount {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string | null;
  price: number | null;
  imageUrl: string | null;
  isPublished: boolean;
  lessonCount: number;
  createdAt: string;
}

export default function Courses() {
  usePageTitle("Courses");
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Fetch courses from API
  const { data: courses = [], isLoading: coursesLoading } = useQuery<CourseWithLessonCount[]>({
    queryKey: ['/api/courses'],
  });

  // Fetch user enrollments
  const { data: enrollments = [] } = useQuery<Array<{ courseId: string; enrolledAt: string }>>({
    queryKey: ["/api/my-enrollments"],
    enabled: isAuthenticated,
  });

  // Check if user is enrolled in a course
  const isEnrolledInCourse = (courseId: string) => {
    return enrollments.some((enrollment) => enrollment.courseId === courseId);
  };

  // Get enrollment status for button text
  const getEnrollmentStatus = (courseId: string) => {
    if (!isAuthenticated) return "login";
    if (isEnrolledInCourse(courseId)) return "enrolled";
    return "enroll";
  };

  // Get button text based on enrollment status
  const getButtonText = (courseId: string, isPending: boolean = false) => {
    if (isPending) return "Starting Course...";

    const status = getEnrollmentStatus(courseId);
    switch (status) {
      case "login": return "Begin Learning";
      case "enrolled": return "Continue Learning";
      case "enroll": return "Begin Learning";
      default: return "Begin Learning";
    }
  };

  // Course auto-enrollment mutation
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
        title: "Unable to Start Course",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleBeginLearning = async (courseId: string) => {
    const status = getEnrollmentStatus(courseId);

    if (status === "login") {
      navigate("/login?redirect=/courses");
      return;
    }

    if (status === "enrolled") {
      window.location.href = `/course/${courseId}/lesson/1`;
      return;
    }

    try {
      await enrollMutation.mutateAsync(courseId);
    } catch (error) {
      console.error("Auto-enrollment error:", error);
    }
  };

  // Extract unique levels from courses
  const levels = Array.from(new Set(courses.map(c => c.level))).sort();

  const filteredCourses = selectedLevel === 'all'
    ? courses
    : courses.filter(course =>
        course.level.toLowerCase() === selectedLevel.toLowerCase()
      );

  const featuredCourse = courses.length > 0 ? courses[0] : null;

  const getLevelColor = (level: string) => {
    const lower = level.toLowerCase();
    if (lower === 'foundational' || lower === 'beginner') return 'bg-covenant-gold/10 text-covenant-blue';
    if (lower === 'intermediate') return 'bg-blue-100 text-blue-800';
    if (lower === 'advanced') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-600';
  };

  if (isLoading || coursesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-covenant-light via-white to-covenant-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-covenant-gold mx-auto mb-4"></div>
          <p className="text-gray-700">Loading Royal Academy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen marble-bg">
      {/* Hero Section */}
      <section className="bg-royal-navy text-white py-20 border-b-2 border-royal-gold">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <GraduationCap className="h-16 w-16 text-royal-gold" />
            </div>
            <h1 className="text-4xl md:text-6xl font-cinzel-decorative font-bold mb-6">
              Royal Academy
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed mb-8">
              Comprehensive Kingdom education equipping royal priests to operate under divine covenant authority
            </p>
            <div className="bg-royal-burgundy/30 border border-royal-gold/30 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-gray-200 text-sm">
                <strong>Foundation:</strong> Before beginning course instruction, explore the <a href="/repository" className="text-royal-gold hover:underline">Covenant Repository</a> to understand the critical distinctions between Babylon's counterfeits and Kingdom realities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Catalog */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {courses.length === 0 ? (
            <Card className="max-w-lg mx-auto">
              <CardContent className="py-12 text-center">
                <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Courses Coming Soon</h3>
                <p className="text-gray-600">
                  We are preparing our curriculum. Check back soon for new courses.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Featured Course */}
              {featuredCourse && (
                <div className="mb-16">
                  <Card className="bg-gradient-to-r from-covenant-blue to-covenant-dark-blue border-0 overflow-hidden">
                    <CardContent className="p-8 text-white">
                      <div className="flex items-center mb-4">
                        <Badge className="bg-covenant-gold text-covenant-blue mr-4">Featured Course</Badge>
                        <Badge className={`${getLevelColor(featuredCourse.level)} ml-2`}>
                          {featuredCourse.level}
                        </Badge>
                      </div>

                      <h3 className="text-3xl font-playfair font-bold mb-4">{featuredCourse.title}</h3>
                      <p className="text-lg text-blue-100 mb-6 max-w-3xl">{featuredCourse.description}</p>

                      <div className="flex flex-wrap items-center gap-6 mb-8">
                        <div className="flex items-center text-blue-200">
                          <BookOpen className="h-5 w-5 mr-2" />
                          <span>{featuredCourse.lessonCount} lessons</span>
                        </div>
                        {featuredCourse.duration && (
                          <div className="flex items-center text-blue-200">
                            <User className="h-5 w-5 mr-2" />
                            <span>{featuredCourse.duration}</span>
                          </div>
                        )}
                      </div>

                      <Button
                        size="lg"
                        className="bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue px-8 py-3 font-semibold"
                        onClick={() => handleBeginLearning(featuredCourse.id)}
                        disabled={enrollMutation.isPending}
                      >
                        <GraduationCap className="h-5 w-5 mr-2" />
                        {getButtonText(featuredCourse.id, enrollMutation.isPending)}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Course Filter */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-covenant-blue mb-4">
                  All Courses
                </h2>
                <p className="text-lg text-covenant-gray max-w-3xl mx-auto mb-8">
                  Choose from our comprehensive curriculum designed to equip you as a faithful trustee
                </p>

                {levels.length > 1 && (
                  <div className="flex justify-center">
                    <div className="bg-white rounded-lg p-1 shadow-md">
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedLevel('all')}
                        className={`px-6 py-3 rounded-md font-medium transition-colors ${
                          selectedLevel === 'all'
                            ? 'bg-covenant-blue text-white'
                            : 'text-covenant-gray hover:text-covenant-blue'
                        }`}
                      >
                        All Courses
                      </Button>
                      {levels.map((level) => (
                        <Button
                          key={level}
                          variant="ghost"
                          onClick={() => setSelectedLevel(level.toLowerCase())}
                          className={`px-6 py-3 rounded-md font-medium transition-colors ${
                            selectedLevel === level.toLowerCase()
                              ? 'bg-covenant-blue text-white'
                              : 'text-covenant-gray hover:text-covenant-blue'
                          }`}
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Course Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {filteredCourses.map(course => (
                  <Card key={course.id} className="border-covenant-light hover:border-covenant-gold transition-all hover:shadow-lg">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={getLevelColor(course.level)}>
                          {course.level}
                        </Badge>
                      </div>
                      <CardTitle className="text-covenant-blue">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-covenant-gray">
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            <span>{course.lessonCount} lessons</span>
                          </div>
                          {course.duration && (
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              <span>{course.duration}</span>
                            </div>
                          )}
                        </div>

                        <Button
                          className="w-full bg-covenant-blue hover:bg-covenant-blue/80 text-white"
                          onClick={() => handleBeginLearning(course.id)}
                          disabled={enrollMutation.isPending}
                        >
                          <GraduationCap className="h-4 w-4 mr-2" />
                          {getButtonText(course.id, enrollMutation.isPending)}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Student Dashboard Link */}
          <div className="text-center mb-12">
            <Card className="bg-covenant-light border-covenant-gold">
              <CardContent className="p-8">
                <div className="flex justify-center mb-4">
                  <Users className="h-12 w-12 text-covenant-gold" />
                </div>
                <h3 className="text-2xl font-playfair font-bold text-covenant-blue mb-4">
                  Already Enrolled?
                </h3>
                <p className="text-covenant-gray mb-6">
                  Access your enrolled courses, track your progress, and continue your learning journey.
                </p>
                <Link href="/my-courses">
                  <Button size="lg" className="bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue px-8 py-3 font-semibold">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Go to My Courses
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <ScriptureQuote
            quote="A good man leaveth an inheritance to his children's children: and the wealth of the sinner is laid up for the just."
            reference="Proverbs 13:22 (KJV)"
            className="mb-8"
          />
        </div>
      </section>
    </div>
  );
}
