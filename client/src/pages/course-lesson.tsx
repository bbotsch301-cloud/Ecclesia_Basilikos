import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useParams, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { apiRequest } from "@/lib/queryClient";
import RequireAuth from "@/components/RequireAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Play,
  Download,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Video
} from "lucide-react";
import ScriptureQuote from "@/components/ui/scripture-quote";

interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  content: string | null;
  videoUrl: string | null;
  order: number;
  duration: string | null;
  createdAt: string;
}

interface CourseWithLessons {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string | null;
  category: string;
  imageUrl: string | null;
  lessons: Lesson[];
}

interface CourseProgress {
  totalSections: number;
  completedSections: number;
}

interface CourseDownload {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileType: string | null;
  fileSize: string | null;
  downloadCount: number;
}

function getYouTubeEmbedId(url: string | null): string | null {
  if (!url) return null;
  // Handle various YouTube URL formats
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/);
  if (match) return match[1];
  // If it looks like just a video ID (11 chars alphanumeric)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  return null;
}

function CourseLessonContent() {
  const params = useParams<{ courseId: string; lessonId: string }>();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const courseId = params.courseId || "1";
  const lessonId = params.lessonId;

  // Fetch course with lessons
  const { data: courseData, isLoading: courseLoading, error: courseError } = useQuery<CourseWithLessons>({
    queryKey: ['/api/courses', courseId],
  });

  // Fetch progress
  const { data: progressData } = useQuery<CourseProgress>({
    queryKey: ['/api/courses', courseId, 'progress'],
    enabled: isAuthenticated,
  });

  // Fetch course downloads
  const { data: downloadsData } = useQuery<CourseDownload[]>({
    queryKey: ['/api/courses', courseId, 'downloads'],
  });

  usePageTitle(courseData?.title ? `${courseData.title}` : "Course");

  if (courseLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-b from-covenant-light via-white to-covenant-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-covenant-gold mx-auto mb-4"></div>
          <p className="text-gray-700">Loading course...</p>
        </div>
      </div>
    );
  }

  if (courseError || !courseData) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-b from-covenant-light via-white to-covenant-light flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-covenant-blue mb-4">Course Not Found</h1>
            <p className="text-covenant-gray mb-6">The requested course could not be found.</p>
            <Link href="/courses">
              <Button className="bg-covenant-blue hover:bg-covenant-blue/80 text-white">
                Back to Courses
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const lessons = [...courseData.lessons].sort((a, b) => a.order - b.order);

  // Find current lesson
  let currentLessonIndex: number;
  if (lessonId) {
    // Try to match by ID first
    currentLessonIndex = lessons.findIndex(l => l.id === lessonId);
    // Fall back to matching by order (for /lesson/1 style URLs)
    if (currentLessonIndex === -1) {
      const orderNum = parseInt(lessonId, 10);
      if (!isNaN(orderNum)) {
        currentLessonIndex = lessons.findIndex(l => l.order === orderNum);
      }
    }
    // If still not found, default to first
    if (currentLessonIndex === -1) currentLessonIndex = 0;
  } else {
    currentLessonIndex = 0;
  }

  const currentLesson = lessons[currentLessonIndex];
  const nextLesson = lessons[currentLessonIndex + 1];
  const prevLesson = lessons[currentLessonIndex - 1];

  const progressPercent = progressData && progressData.totalSections > 0
    ? Math.round((progressData.completedSections / progressData.totalSections) * 100)
    : 0;

  const youtubeId = getYouTubeEmbedId(currentLesson?.videoUrl ?? null);

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-covenant-light via-white to-covenant-light">
      {/* Course Header */}
      <section className="bg-covenant-blue text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/my-courses" className="inline-flex items-center text-blue-200 hover:text-white mb-2">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to My Courses
              </Link>
              <h1 className="text-3xl font-playfair font-bold">{courseData.title}</h1>
              <p className="text-blue-100 mt-2">{courseData.description}</p>
            </div>
            <Badge className="bg-covenant-gold text-covenant-blue">
              {courseData.level}
            </Badge>
          </div>

          {isAuthenticated && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-blue-200">Course Progress</span>
                <span className="text-white font-medium">{progressPercent}% Complete</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          )}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Lesson Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-covenant-blue">Course Lessons</CardTitle>
                <CardDescription>
                  {lessons.length} lessons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/course/${courseId}/lesson/${lesson.id}`}
                      className="w-full"
                    >
                      <Button
                        variant="ghost"
                        className={`w-full text-left p-3 rounded-lg transition-colors h-auto ${
                          currentLesson?.id === lesson.id
                            ? 'bg-covenant-blue text-white'
                            : 'hover:bg-covenant-light text-covenant-gray'
                        }`}
                      >
                        <div className="flex items-start justify-between w-full gap-2">
                          <div className="flex-1 min-w-0 max-w-full overflow-hidden">
                            <p className="font-medium text-xs leading-tight break-words">{lesson.title}</p>
                          </div>
                        </div>
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="mb-8">
              <CardHeader>
                <div>
                  <CardTitle className="text-covenant-blue text-2xl">
                    {currentLesson?.title}
                  </CardTitle>
                  {currentLesson?.description && (
                    <CardDescription className="mt-2">
                      {currentLesson.description}
                    </CardDescription>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Video Player */}
                <div className="mb-8">
                  <Card className="bg-black rounded-lg overflow-hidden">
                    <CardContent className="p-0">
                      {youtubeId ? (
                        <div className="relative aspect-video">
                          <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${youtubeId}`}
                            title={currentLesson?.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                          <div className="text-center">
                            <div className="bg-white/10 rounded-full p-6 mb-4">
                              <Video className="h-12 w-12 text-white mx-auto" />
                            </div>
                            <h3 className="text-white text-xl font-semibold mb-2">{currentLesson?.title}</h3>
                            <p className="text-gray-300 mb-6">Video will be available soon</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Lesson Content */}
                {currentLesson?.content && (
                  <div className="mb-8 prose prose-gray max-w-none">
                    <Card className="border-covenant-light">
                      <CardHeader>
                        <CardTitle className="text-covenant-blue flex items-center">
                          <BookOpen className="h-5 w-5 mr-2" />
                          Lesson Notes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="whitespace-pre-wrap">{currentLesson.content}</div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Scripture Reference */}
                <Card className="bg-covenant-light/30 border-covenant-gold mb-8">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <blockquote className="text-lg text-covenant-blue font-georgia italic mb-2">
                        "Moreover it is required in stewards, that a man be found faithful."
                      </blockquote>
                      <cite className="text-covenant-gray">- 1 Corinthians 4:2 (KJV)</cite>
                    </div>
                  </CardContent>
                </Card>

                {/* Course Downloads */}
                {downloadsData && downloadsData.length > 0 && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="text-covenant-blue flex items-center">
                        <Download className="h-5 w-5 mr-2" />
                        Course Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {downloadsData.map((dl) => (
                          <div key={dl.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm">{dl.title}</p>
                              {dl.description && (
                                <p className="text-xs text-gray-500 mt-1">{dl.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-4 shrink-0">
                              {dl.fileType && (
                                <Badge variant="secondary" className="text-xs uppercase">
                                  {dl.fileType}
                                </Badge>
                              )}
                              <a
                                href={dl.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => {
                                  apiRequest('POST', `/api/downloads/${dl.id}/track`).catch(() => {});
                                }}
                              >
                                <Button size="sm" variant="outline">
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t border-covenant-light">
                  <div>
                    {prevLesson && (
                      <Link href={`/course/${courseId}/lesson/${prevLesson.id}`}>
                        <Button
                          variant="outline"
                          className="border-covenant-blue text-covenant-blue hover:bg-covenant-blue hover:text-white"
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Previous Lesson
                        </Button>
                      </Link>
                    )}
                  </div>

                  <div>
                    {nextLesson ? (
                      <Link href={`/course/${courseId}/lesson/${nextLesson.id}`}>
                        <Button
                          className="bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue"
                        >
                          Next Lesson
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          toast({
                            title: "Course Complete!",
                            description: "Congratulations! You have completed this course. Continue your learning journey with more courses.",
                          });
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Course
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <ScriptureQuote
              quote="Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth."
              reference="2 Timothy 2:15 (KJV)"
              className="mb-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CourseLesson() {
  return (
    <RequireAuth>
      <CourseLessonContent />
    </RequireAuth>
  );
}
