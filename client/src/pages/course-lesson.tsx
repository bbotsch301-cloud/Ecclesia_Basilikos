import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useParams, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { apiRequest } from "@/lib/queryClient";
import RequireAuth from "@/components/RequireAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Download,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Video,
  Loader2,
} from "lucide-react";
import CommentSection from "@/components/CommentSection";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

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
  completedSectionIds: string[];
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
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  return null;
}

function CourseLessonContent() {
  const params = useParams<{ courseId: string; lessonId: string }>();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const courseId = params.courseId || "1";
  const lessonId = params.lessonId;

  const { data: courseData, isLoading: courseLoading, error: courseError } = useQuery<CourseWithLessons>({
    queryKey: ['/api/courses', courseId],
  });

  const { data: progressData } = useQuery<CourseProgress>({
    queryKey: ['/api/courses', courseId, 'progress'],
    enabled: isAuthenticated,
  });

  const { data: downloadsData } = useQuery<CourseDownload[]>({
    queryKey: ['/api/courses', courseId, 'downloads'],
  });

  const completeCourse = useMutation({
    mutationFn: async (sectionId: string) => {
      await apiRequest('POST', `/api/sections/${sectionId}/complete`);
      await apiRequest('POST', `/api/enrollments/${courseId}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses', courseId, 'progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/my-enrollments'] });
      toast({
        title: "Course Complete!",
        description: "Congratulations! You have completed this course.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark course as complete. Please try again.",
        variant: "destructive",
      });
    },
  });

  const markLessonComplete = useMutation({
    mutationFn: async (sectionId: string) => {
      await apiRequest('POST', `/api/sections/${sectionId}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses', courseId, 'progress'] });
      toast({
        title: "Lesson Complete",
        description: "Your progress has been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark lesson as complete. Please try again.",
        variant: "destructive",
      });
    },
  });

  usePageTitle(courseData?.title ? `${courseData.title}` : "Course");

  if (courseLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-royal-gold" />
      </div>
    );
  }

  if (courseError || !courseData) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-cinzel font-bold text-royal-navy dark:text-royal-gold mb-4">Course Not Found</h1>
            <p className="text-gray-500 mb-6">The requested course could not be found.</p>
            <Link href="/courses">
              <Button className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold">
                Back to Courses
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const lessons = [...courseData.lessons].sort((a, b) => a.order - b.order);

  let currentLessonIndex: number;
  if (lessonId) {
    currentLessonIndex = lessons.findIndex(l => l.id === lessonId);
    if (currentLessonIndex === -1) {
      const orderNum = parseInt(lessonId, 10);
      if (!isNaN(orderNum)) {
        currentLessonIndex = lessons.findIndex(l => l.order === orderNum);
      }
    }
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

  const currentLessonAlreadyCompleted = isAuthenticated && currentLesson && progressData
    ? (progressData.completedSectionIds ?? []).includes(currentLesson.id)
    : false;

  const youtubeId = getYouTubeEmbedId(currentLesson?.videoUrl ?? null);

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Course Header */}
      <section className="bg-gradient-to-r from-royal-navy to-royal-burgundy text-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="mb-2 [&_a]:text-gray-300 [&_span.text-gray-500]:text-gray-300 [&_span.text-gray-700]:text-white">
                <Breadcrumbs
                  items={[
                    { label: "Courses", href: "/courses" },
                    { label: courseData.title, href: `/course/${courseId}` },
                    ...(currentLesson ? [{ label: currentLesson.title }] : []),
                  ]}
                />
              </div>
              <h1 className="text-2xl md:text-3xl font-cinzel font-bold">{courseData.title}</h1>
              <p className="text-gray-300 mt-1 text-sm max-w-2xl">{courseData.description}</p>
            </div>
            <Badge className="bg-royal-gold/20 text-royal-gold border-royal-gold/40 font-cinzel shrink-0">
              {courseData.level}
            </Badge>
          </div>

          {isAuthenticated && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-400">Course Progress</span>
                <span className="text-royal-gold font-semibold">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-1.5" />
            </div>
          )}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Lesson Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="font-cinzel font-bold text-sm text-royal-navy dark:text-royal-gold mb-3 px-1">
                Lessons ({lessons.length})
              </h3>
              <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
                {lessons.map((lesson, i) => {
                  const isActive = currentLesson?.id === lesson.id;
                  const isCompleted = isAuthenticated && progressData
                    ? (progressData.completedSectionIds ?? []).includes(lesson.id)
                    : false;
                  return (
                    <Link
                      key={lesson.id}
                      href={`/course/${courseId}/lesson/${lesson.id}`}
                    >
                      <button
                        className={`w-full text-left p-3 rounded-lg transition-all text-sm ${
                          isActive
                            ? "bg-royal-navy text-white shadow-md"
                            : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {isCompleted ? (
                            <CheckCircle className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${isActive ? "text-royal-gold" : "text-green-500"}`} />
                          ) : (
                            <span className={`text-xs font-bold mt-0.5 ${
                              isActive ? "text-royal-gold" : "text-gray-400"
                            }`}>
                              {i + 1}.
                            </span>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs leading-snug">{lesson.title}</p>
                            {lesson.duration && (
                              <p className={`text-[10px] mt-0.5 ${isActive ? "text-gray-300" : "text-gray-400"}`}>
                                {lesson.duration}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Lesson Title Bar */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-xs text-royal-gold font-cinzel font-semibold uppercase tracking-wider">
                  Lesson {currentLessonIndex + 1} of {lessons.length}
                </p>
                <h2 className="text-xl md:text-2xl font-cinzel font-bold text-royal-navy dark:text-white">
                  {currentLesson?.title}
                </h2>
                {currentLesson?.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{currentLesson.description}</p>
                )}
              </div>
              {currentLesson?.duration && (
                <Badge variant="outline" className="text-xs text-gray-500 shrink-0">
                  {currentLesson.duration}
                </Badge>
              )}
            </div>

            {/* Video Player */}
            {youtubeId ? (
              <Card className="overflow-hidden border-0 shadow-lg">
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
              </Card>
            ) : (
              <Card className="overflow-hidden border-0 shadow-lg">
                <div className="relative aspect-video bg-gradient-to-br from-royal-navy to-royal-burgundy flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-white/10 rounded-full p-5 mb-3 mx-auto w-fit">
                      <Video className="h-10 w-10 text-royal-gold" />
                    </div>
                    <p className="text-gray-300 text-sm">Video coming soon</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Lesson Content — Markdown */}
            {currentLesson?.content && (
              <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                  <CardTitle className="text-royal-navy dark:text-royal-gold flex items-center font-cinzel text-lg">
                    <BookOpen className="h-5 w-5 mr-2 text-royal-gold" />
                    Lesson Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <article className="
                    prose prose-base max-w-none
                    prose-headings:font-cinzel prose-headings:font-bold
                    prose-h1:text-2xl prose-h1:text-royal-navy prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-3 prose-h1:mb-6
                    prose-h2:text-xl prose-h2:text-royal-navy prose-h2:mt-10 prose-h2:mb-4
                    prose-h3:text-lg prose-h3:text-royal-navy prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                    prose-strong:text-gray-900 prose-strong:font-semibold
                    prose-em:text-gray-600
                    prose-a:text-royal-gold prose-a:no-underline hover:prose-a:underline
                    prose-blockquote:border-l-4 prose-blockquote:border-royal-gold prose-blockquote:bg-amber-50 prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-700 prose-blockquote:my-6 prose-blockquote:before:content-none prose-blockquote:after:content-none
                    prose-code:bg-gray-100 prose-code:text-red-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:shadow-md
                    prose-ul:my-4 prose-ul:space-y-1
                    prose-ol:my-4 prose-ol:space-y-1
                    prose-li:text-gray-700 prose-li:leading-relaxed
                    prose-table:border-collapse prose-table:w-full prose-table:my-6 prose-table:text-sm
                    prose-thead:bg-royal-navy prose-thead:text-white
                    prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-cinzel prose-th:font-semibold prose-th:text-sm
                    prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-gray-200 prose-td:text-gray-700
                    prose-tr:even:bg-gray-50
                    prose-hr:border-gray-200 prose-hr:my-8
                    prose-img:rounded-xl prose-img:shadow-md
                    dark:prose-headings:text-royal-gold
                    dark:prose-p:text-gray-300
                    dark:prose-strong:text-gray-100
                    dark:prose-em:text-gray-400
                    dark:prose-blockquote:bg-royal-navy/30 dark:prose-blockquote:text-gray-300
                    dark:prose-code:bg-gray-800 dark:prose-code:text-amber-400
                    dark:prose-li:text-gray-300
                    dark:prose-td:text-gray-300 dark:prose-td:border-gray-700
                    dark:prose-tr:even:bg-gray-800/50
                    dark:prose-thead:bg-gray-800
                    dark:prose-hr:border-gray-700
                  ">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({ children }) => (
                          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 my-6 shadow-sm">
                            <table className="min-w-full border-collapse">{children}</table>
                          </div>
                        ),
                        thead: ({ children }) => (
                          <thead className="bg-royal-navy dark:bg-gray-800">{children}</thead>
                        ),
                        tbody: ({ children }) => (
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">{children}</tbody>
                        ),
                        tr: ({ children }) => (
                          <tr className="even:bg-gray-50 dark:even:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                            {children}
                          </tr>
                        ),
                        th: ({ children }) => (
                          <th className="px-4 py-3 text-left text-sm font-cinzel font-semibold text-white whitespace-nowrap">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                            {children}
                          </td>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-royal-gold bg-amber-50/70 dark:bg-royal-navy/30 py-3 px-5 rounded-r-lg my-6 not-italic text-gray-700 dark:text-gray-300">
                            {children}
                          </blockquote>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-2xl font-cinzel font-bold text-royal-navy dark:text-royal-gold border-b border-gray-200 dark:border-gray-700 pb-3 mb-6 mt-2">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-xl font-cinzel font-bold text-royal-navy dark:text-royal-gold mt-10 mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-royal-gold rounded-full inline-block" />
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-lg font-cinzel font-bold text-royal-navy dark:text-gray-200 mt-8 mb-3">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            {children}
                          </p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-gray-900 dark:text-white">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-gray-600 dark:text-gray-400">
                            {children}
                          </em>
                        ),
                        ul: ({ children }) => (
                          <ul className="my-4 space-y-2 list-disc pl-6 marker:text-royal-gold">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="my-4 space-y-2 list-decimal pl-6 marker:text-royal-gold marker:font-semibold">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-gray-700 dark:text-gray-300 leading-relaxed pl-1">
                            {children}
                          </li>
                        ),
                        a: ({ href, children }) => (
                          <a href={href} className="text-royal-gold hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                            {children}
                          </a>
                        ),
                        hr: () => (
                          <hr className="border-gray-200 dark:border-gray-700 my-8" />
                        ),
                        code: ({ children, className }) => {
                          const isBlock = className?.includes('language-');
                          if (isBlock) {
                            return (
                              <code className={`${className} text-sm`}>{children}</code>
                            );
                          }
                          return (
                            <code className="bg-gray-100 dark:bg-gray-800 text-red-700 dark:text-amber-400 px-1.5 py-0.5 rounded text-sm font-mono">
                              {children}
                            </code>
                          );
                        },
                        pre: ({ children }) => (
                          <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 overflow-x-auto shadow-md text-sm">
                            {children}
                          </pre>
                        ),
                      }}
                    >
                      {currentLesson.content}
                    </ReactMarkdown>
                  </article>
                </CardContent>
              </Card>
            )}

            {/* Course Downloads */}
            {downloadsData && downloadsData.length > 0 && (
              <Card className="border border-gray-200 dark:border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-royal-navy dark:text-royal-gold flex items-center font-cinzel text-lg">
                    <Download className="h-5 w-5 mr-2 text-royal-gold" />
                    Course Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {downloadsData.map((dl) => (
                      <div key={dl.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-gray-200 text-sm">{dl.title}</p>
                          {dl.description && (
                            <p className="text-xs text-gray-500 mt-0.5">{dl.description}</p>
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
                            <Button size="sm" className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold text-xs">
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

            {/* Comments */}
            {currentLesson && (
              <CommentSection targetType="lesson" targetId={currentLesson.id} />
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
              <div>
                {prevLesson ? (
                  <Link href={`/course/${courseId}/lesson/${prevLesson.id}`}>
                    <Button variant="outline" className="font-cinzel text-sm">
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                  </Link>
                ) : (
                  <div />
                )}
              </div>

              <div className="flex items-center gap-3">
                {nextLesson ? (
                  <>
                    {isAuthenticated && currentLesson && (
                      <Button
                        variant="outline"
                        className="font-cinzel text-sm border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 disabled:opacity-50"
                        disabled={currentLessonAlreadyCompleted || markLessonComplete.isPending}
                        onClick={() => {
                          if (currentLesson) {
                            markLessonComplete.mutate(currentLesson.id);
                          }
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {currentLessonAlreadyCompleted ? "Completed" : markLessonComplete.isPending ? "Saving..." : "Mark Lesson Complete"}
                      </Button>
                    )}
                    <Link href={`/course/${courseId}/lesson/${nextLesson.id}`}>
                      <Button className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold">
                        Next Lesson
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white font-cinzel font-bold"
                    disabled={completeCourse.isPending}
                    onClick={() => {
                      if (currentLesson) {
                        completeCourse.mutate(currentLesson.id);
                      }
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {completeCourse.isPending ? "Completing..." : "Complete Course"}
                  </Button>
                )}
              </div>
            </div>
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
