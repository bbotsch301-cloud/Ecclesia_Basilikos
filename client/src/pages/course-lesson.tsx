import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
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
  youtubeVideoId?: string;
  duration: string;
  order: number;
  completed?: boolean;
  files?: Array<{
    id: string;
    name: string;
    size: string;
    type: string;
    downloadUrl: string;
  }>;
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
    title: "Understanding Trust and Dominion",
    description: "Discover God's original design for dominion, your dual identity in Christ, and how to operate as Heaven's ambassador on earth through 7 essential modules.",
    level: "Foundation",
    totalLessons: 7,
    progress: 14,
    lessons: [
      {
        id: "1",
        title: "Module 1: Understanding Trust and Dominion",
        description: "Genesis 1:26–28 – God gave man dominion (trusteeship) over creation. The Fall and breach of trust. Christ's Restoration as the Second Adam re-establishing trust.",
        youtubeVideoId: "IP4NzMFGKA8",
        duration: "25 minutes",
        order: 1,
        completed: true,
        files: [
          {
            id: "1",
            name: "Common Law Handbook",
            size: "2.1 MB",
            type: "PDF",
            downloadUrl: "/public-objects/common-law-handbook.pdf"
          },
          {
            id: "2", 
            name: "Creation & Essentials of a Valid Trust",
            size: "1.8 MB", 
            type: "PDF",
            downloadUrl: "/public-objects/essentials-of-trust.pdf"
          },
          {
            id: "3",
            name: "Maxims of Law",
            size: "3.2 MB",
            type: "PDF", 
            downloadUrl: "/public-objects/maxims-of-law.pdf"
          }
        ]
      },
      {
        id: "2",
        title: "Module 2: The Public vs. Private Identity",
        description: "Understanding dual identity: public citizen/legal person vs. private living man/woman in God's image. Christ's status correction making us 100% man + 100% divine.",
        youtubeVideoId: "JXeJANDKwDc",
        duration: "28 minutes",
        order: 2,
        completed: false,
        files: [
          {
            id: "4",
            name: "Public vs Private Identity Guide",
            size: "1.6 MB",
            type: "PDF",
            downloadUrl: "/public-objects/public-private-identity-guide.pdf"
          }
        ]
      },
      {
        id: "3",
        title: "Module 3: The Role of the Holy Spirit",
        description: "The Holy Spirit as bridge/transmitting utility between heaven and earth. Our seal, earnest, and divine letter of credit. Jesus as Surety guaranteeing all obligations.",
        youtubeVideoId: "3AtDnEC4zak",
        duration: "26 minutes", 
        order: 3,
        completed: false,
        files: [
          {
            id: "5",
            name: "Holy Spirit as Transmitting Utility",
            size: "1.8 MB", 
            type: "PDF",
            downloadUrl: "/public-objects/holy-spirit-transmitting-utility.pdf"
          }
        ]
      },
      {
        id: "4",
        title: "Module 4: Documents of Identity in the Trust",
        description: "Trust Declaration, Beneficiary Authorization, Ecclesiastical Heirship Claim, Divine Jurisdiction Notice, Spiritual Currency Ledger, and Debt Discharge Statements.",
        youtubeVideoId: "2Z4m4lnjxkY",
        duration: "32 minutes",
        order: 4,
        completed: false,
        files: [
          {
            id: "6",
            name: "Trust Documents Template Package",
            size: "3.4 MB",
            type: "PDF", 
            downloadUrl: "/public-objects/trust-documents-template-package.pdf"
          }
        ]
      },
      {
        id: "5",
        title: "Module 5: Operating 'In Christ'",
        description: "Ambassadors for Christ (2 Cor. 5:20). Living man as agent on earth, redeemed man as principal in heaven. Authority without liability through Jesus our Surety.",
        youtubeVideoId: "YQHsXMglC9A",
        duration: "24 minutes",
        order: 5,
        completed: false,
        files: [
          {
            id: "7",
            name: "Operating In Christ Handbook",
            size: "2.1 MB",
            type: "PDF",
            downloadUrl: "/public-objects/operating-in-christ-handbook.pdf"
          }
        ]
      },
      {
        id: "6",
        title: "Module 6: Contrast: Babylonian System vs. Kingdom System",
        description: "Babylon/Federal Reserve operates on debt and fiat trust. Kingdom operates on faith and divine promises. Spiritual currency backed by God's Word vs. debt-based currency.",
        youtubeVideoId: "oHg5SJYRHA0",
        duration: "29 minutes",
        order: 6,
        completed: false,
        files: [
          {
            id: "8",
            name: "Kingdom vs Babylon Comparison Chart",
            size: "2.3 MB",
            type: "PDF",
            downloadUrl: "/public-objects/kingdom-vs-babylon-chart.pdf"
          }
        ]
      },
      {
        id: "7",
        title: "Module 7: Status Correction: Living as Sons",
        description: "Galatians 4:7 – No longer slaves but sons and heirs. Romans 8:17 – Co-heirs with Christ. Operating with ambassadorial authority, free from worldly bondage.",
        youtubeVideoId: "SfOTTOF9fpA",
        duration: "27 minutes",
        order: 7,
        completed: false,
        files: [
          {
            id: "9",
            name: "Living as Sons Declaration & Prayer Guide",
            size: "1.9 MB",
            type: "PDF",
            downloadUrl: "/public-objects/living-as-sons-prayer-guide.pdf"
          }
        ]
      }
    ]
  }
};

export default function CourseLesson() {
  const params = useParams();
  const { toast } = useToast();
  const courseId = params.courseId || "1";
  const lessonId = params.lessonId;

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

  // Find current lesson index for navigation
  const currentLessonIndex = lessonId 
    ? courseData.lessons.findIndex(l => l.id === lessonId)
    : 0;

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
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm leading-tight break-words">{lesson.title}</p>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="text-xs">{lesson.duration}</span>
                          </div>
                        </div>
                        {lesson.completed && (
                          <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                        )}
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
                {/* YouTube Video Player */}
                <div className="mb-8">
                  <Card className="bg-black rounded-lg overflow-hidden">
                    <CardContent className="p-0">
                      {currentLesson?.youtubeVideoId ? (
                        <div className="relative aspect-video">
                          <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${currentLesson.youtubeVideoId}`}
                            title={currentLesson.title}
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

                {/* Lesson Files */}
                <div className="mb-8">
                  <Card className="border-covenant-light">
                    <CardHeader>
                      <CardTitle className="text-covenant-blue flex items-center">
                        <Download className="h-5 w-5 mr-2" />
                        Lesson Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {currentLesson?.files && currentLesson.files.length > 0 ? (
                        <div className="space-y-3">
                          {currentLesson.files.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-3 border border-covenant-light rounded-lg">
                              <div className="flex items-center">
                                <BookOpen className="h-5 w-5 text-covenant-blue mr-3" />
                                <div>
                                  <p className="font-medium text-covenant-blue">{file.name}</p>
                                  <p className="text-sm text-covenant-gray">{file.type} • {file.size}</p>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-covenant-blue text-covenant-blue"
                                onClick={() => window.open(file.downloadUrl, '_blank')}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-covenant-gray text-center py-4">No files available for this lesson</p>
                      )}
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