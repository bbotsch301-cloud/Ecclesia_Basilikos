import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
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
  Users,
  Video
} from "lucide-react";
import ScriptureQuote from "@/components/ui/scripture-quote";

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
  completed?: boolean;
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  level: string;
  totalLessons: number;
  progress: number;
  lessons: Lesson[];
}

// Sample course data - this would normally come from the API
const sampleCourseData: { [key: string]: CourseData } = {
  "1": {
    id: "1",
    title: "Trust Fundamentals",
    description: "Understanding the biblical foundation of trust relationships and your role as a trustee in God's kingdom economy.",
    level: "Foundational",
    totalLessons: 8,
    progress: 25,
    lessons: [
      {
        id: "1",
        title: "Introduction to Biblical Trusts",
        description: "Understanding the scriptural foundation of trust relationships and your role as a trustee in God's kingdom economy.",
        videoUrl: "https://example.com/video1",
        duration: "15 minutes",
        order: 1,
        completed: true
      },
      {
        id: "2",
        title: "Legal Structures and Kingdom Authority",
        description: "How to establish trust structures that honor God's authority while operating effectively in the modern legal system.",
        videoUrl: "https://example.com/video2",
        duration: "20 minutes",
        order: 2,
        completed: false
      },
      {
        id: "3",
        title: "Trustee Responsibilities and Biblical Stewardship",
        description: "Understanding your duties and obligations as a faithful trustee managing God's resources.",
        videoUrl: "https://example.com/video3",
        duration: "25 minutes", 
        order: 3,
        completed: false
      },
      {
        id: "4",
        title: "Asset Management and Investment Principles",
        description: "Biblical principles for managing trust assets, investments, and growing wealth according to Kingdom values.",
        videoUrl: "https://example.com/video4",
        duration: "30 minutes",
        order: 4,
        completed: false
      },
      {
        id: "5",
        title: "Banking and Financial Institutions",
        description: "Working with banks, managing accounts, and establishing proper financial relationships as a trustee.",
        videoUrl: "https://example.com/video5",
        duration: "22 minutes",
        order: 5,
        completed: false
      },
      {
        id: "6",
        title: "Cryptocurrency and Digital Assets",
        description: "Understanding and managing digital assets, cryptocurrency, and modern investment vehicles within a trust.",
        videoUrl: "https://example.com/video6",
        duration: "28 minutes",
        order: 6,
        completed: false
      },
      {
        id: "7",
        title: "Wealth Legacy Building",
        description: "Creating lasting financial legacies that honor God and bless future generations through proper trust management.",
        videoUrl: "https://example.com/video7",
        duration: "35 minutes",
        order: 7,
        completed: false
      },
      {
        id: "8",
        title: "Practical Trust Administration",
        description: "Daily operations, record keeping, beneficiary communication, and practical aspects of trust management.",
        videoUrl: "https://example.com/video8",
        duration: "32 minutes",
        order: 8,
        completed: false
      }
    ]
  }
};

export default function CourseLesson() {
  const params = useParams();
  const courseId = params.courseId || "1";
  const lessonId = params.lessonId;
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const courseData = sampleCourseData[courseId];
  
  if (!courseData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-covenant-light via-white to-covenant-light flex items-center justify-center">
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

  const currentLesson = lessonId 
    ? courseData.lessons.find(l => l.id === lessonId)
    : courseData.lessons[currentLessonIndex];

  const nextLesson = courseData.lessons[currentLessonIndex + 1];
  const prevLesson = courseData.lessons[currentLessonIndex - 1];

  return (
    <div className="min-h-screen bg-gradient-to-b from-covenant-light via-white to-covenant-light">
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
          
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-blue-200">Course Progress</span>
              <span className="text-white font-medium">{courseData.progress}% Complete</span>
            </div>
            <Progress value={courseData.progress} className="h-2" />
          </div>
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
                  {courseData.lessons.length} lessons • {courseData.totalLessons} total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {courseData.lessons.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLessonIndex(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentLessonIndex === index 
                          ? 'bg-covenant-blue text-white' 
                          : 'hover:bg-covenant-light text-covenant-gray'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{lesson.title}</p>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span className="text-xs">{lesson.duration}</span>
                          </div>
                        </div>
                        {lesson.completed && (
                          <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-covenant-blue text-2xl">
                      {currentLesson?.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {currentLesson?.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center text-covenant-gray">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{currentLesson?.duration}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Video Player */}
                <div className="mb-8">
                  <Card className="bg-black rounded-lg overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                        <div className="text-center">
                          <div className="bg-white/10 rounded-full p-6 mb-4">
                            <Play className="h-12 w-12 text-white mx-auto" />
                          </div>
                          <h3 className="text-white text-xl font-semibold mb-2">{currentLesson?.title}</h3>
                          <p className="text-gray-300 mb-6">{currentLesson?.description}</p>
                          <Button 
                            size="lg"
                            className="bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue font-semibold"
                          >
                            <Play className="h-5 w-5 mr-2" />
                            Play Video ({currentLesson?.duration})
                          </Button>
                        </div>
                        
                        {/* Video Controls Overlay */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-black/50 rounded-lg p-3">
                            <div className="flex items-center justify-between text-white text-sm mb-2">
                              <span>0:00</span>
                              <span>{currentLesson?.duration}</span>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-1">
                              <div className="bg-covenant-gold h-1 rounded-full w-1/4"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Lesson Resources */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card className="border-covenant-light">
                    <CardHeader>
                      <CardTitle className="text-covenant-blue flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Lesson Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-covenant-gray mb-4">
                        Download comprehensive lesson notes and biblical references for this lesson.
                      </p>
                      <Button variant="outline" className="border-covenant-blue text-covenant-blue">
                        <Download className="h-4 w-4 mr-2" />
                        Download Notes
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-covenant-light">
                    <CardHeader>
                      <CardTitle className="text-covenant-blue flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Discussion
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-covenant-gray mb-4">
                        Join the community discussion about this lesson and share insights.
                      </p>
                      <Button variant="outline" className="border-covenant-blue text-covenant-blue">
                        Join Discussion
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Scripture Reference */}
                <Card className="bg-covenant-light/30 border-covenant-gold mb-8">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <blockquote className="text-lg text-covenant-blue font-georgia italic mb-2">
                        "Moreover it is required in stewards, that a man be found faithful."
                      </blockquote>
                      <cite className="text-covenant-gray">— 1 Corinthians 4:2 (KJV)</cite>
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t border-covenant-light">
                  <div>
                    {prevLesson && (
                      <Button 
                        variant="outline"
                        onClick={() => setCurrentLessonIndex(currentLessonIndex - 1)}
                        className="border-covenant-blue text-covenant-blue hover:bg-covenant-blue hover:text-white"
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous Lesson
                      </Button>
                    )}
                  </div>
                  
                  <div>
                    {nextLesson ? (
                      <Button 
                        onClick={() => setCurrentLessonIndex(currentLessonIndex + 1)}
                        className="bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue"
                      >
                        Next Lesson
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button 
                        className="bg-green-600 hover:bg-green-700 text-white"
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