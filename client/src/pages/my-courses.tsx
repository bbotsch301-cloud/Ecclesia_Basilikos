import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { 
  BookOpen, 
  Play, 
  Clock, 
  CheckCircle,
  Users,
  Trophy,
  GraduationCap,
  Download,
  Lock,
  Unlock
} from "lucide-react";
import ScriptureQuote from "@/components/ui/scripture-quote";

// Sample course data
const courses = [
  {
    id: 1,
    title: "Trust Fundamentals",
    description: "Understanding the biblical foundation of trust relationships and your role as a trustee in God's kingdom economy.",
    progress: 75,
    lessons: 8,
    duration: "2.5 hours",
    level: "Foundational",
    status: "enrolled",
    nextLesson: "Creating Your Trust Declaration"
  },
  {
    id: 2,
    title: "Banking & Financial Management",
    description: "Learn practical trust banking, account management, and financial stewardship principles for kingdom wealth building.",
    progress: 45,
    lessons: 12,
    duration: "4 hours",
    level: "Intermediate",
    status: "enrolled",
    nextLesson: "Opening Trust Bank Accounts"
  },
  {
    id: 3,
    title: "Investment Strategy for Trustees",
    description: "Biblical investment principles, asset allocation, and growing trust assets through wise stewardship.",
    progress: 0,
    lessons: 15,
    duration: "5 hours",
    level: "Advanced",
    status: "locked",
    prerequisite: "Complete Banking & Financial Management"
  },
  {
    id: 4,
    title: "Cryptocurrency & Digital Assets",
    description: "Understanding digital currencies, blockchain technology, and incorporating crypto assets into trust portfolios.",
    progress: 0,
    lessons: 10,
    duration: "3.5 hours",
    level: "Advanced",
    status: "available"
  },
  {
    id: 5,
    title: "Legacy & Estate Planning",
    description: "Generational wealth transfer, inheritance planning, and building lasting kingdom legacies.",
    progress: 0,
    lessons: 14,
    duration: "4.5 hours",
    level: "Advanced",
    status: "available"
  },
  {
    id: 6,
    title: "Asset Protection Strategies",
    description: "Protecting trust assets, legal compliance, and maintaining proper trustee responsibilities.",
    progress: 20,
    lessons: 11,
    duration: "3.5 hours",
    level: "Intermediate",
    status: "enrolled",
    nextLesson: "Trust Asset Segregation"
  }
];

const achievements = [
  { title: "First Course Completed", description: "Completed Trust Fundamentals", icon: Trophy, earned: true },
  { title: "Banking Specialist", description: "Mastered trust banking principles", icon: GraduationCap, earned: false },
  { title: "Investment Scholar", description: "Completed advanced investment course", icon: BookOpen, earned: false },
];

export default function MyCourses() {
  const [activeTab, setActiveTab] = useState<'enrolled' | 'available' | 'completed'>('enrolled');

  const enrolledCourses = courses.filter(course => course.status === 'enrolled');
  const availableCourses = courses.filter(course => course.status === 'available');
  const completedCourses = courses.filter(course => course.progress === 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enrolled': return 'bg-blue-100 text-blue-800';
      case 'available': return 'bg-green-100 text-green-800';
      case 'locked': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Foundational': return 'bg-covenant-gold/10 text-covenant-blue';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-covenant-light via-white to-covenant-light">
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
                    <p className="text-2xl font-bold text-covenant-blue">{enrolledCourses.length}</p>
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
                    <p className="text-2xl font-bold text-covenant-blue">{completedCourses.length}</p>
                    <p className="text-covenant-gray">Courses Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mr-4">
                    <Trophy className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-covenant-blue">{achievements.filter(a => a.earned).length}</p>
                    <p className="text-covenant-gray">Achievements Earned</p>
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
                In Progress ({enrolledCourses.length})
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
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'completed' 
                    ? 'bg-covenant-blue text-white' 
                    : 'text-covenant-gray hover:text-covenant-blue'
                }`}
              >
                Completed ({completedCourses.length})
              </button>
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {(activeTab === 'enrolled' ? enrolledCourses : 
              activeTab === 'available' ? availableCourses : completedCourses).map((course) => (
              <Card key={course.id} className="border-covenant-light hover:border-covenant-gold transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                    {course.status === 'locked' ? (
                      <Lock className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Unlock className="h-5 w-5 text-covenant-gold" />
                    )}
                  </div>
                  <CardTitle className="text-covenant-blue text-lg">{course.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.status === 'enrolled' && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-covenant-gray">Progress</span>
                          <span className="text-covenant-blue font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-covenant-gray">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    {course.status === 'enrolled' && course.nextLesson && (
                      <div className="bg-covenant-light p-3 rounded-lg">
                        <p className="text-sm text-covenant-blue font-medium">Next Lesson:</p>
                        <p className="text-sm text-covenant-gray">{course.nextLesson}</p>
                      </div>
                    )}

                    {course.status === 'locked' && course.prerequisite && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <Lock className="h-4 w-4 inline mr-1" />
                          {course.prerequisite}
                        </p>
                      </div>
                    )}

                    {course.status === 'enrolled' ? (
                      <Link href={`/course/${course.id}`}>
                        <Button 
                          className="w-full bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Continue Learning
                        </Button>
                      </Link>
                    ) : course.status === 'available' ? (
                      <Button 
                        className="w-full bg-covenant-blue hover:bg-covenant-blue/80 text-white"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Enroll Now
                      </Button>
                    ) : (
                      <Button 
                        className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
                        disabled
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Locked
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Achievements Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-covenant-blue">Achievements</CardTitle>
              <CardDescription>Track your learning milestones and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      achievement.earned 
                        ? 'border-covenant-gold bg-covenant-gold/10' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <achievement.icon className={`h-6 w-6 mr-2 ${
                        achievement.earned ? 'text-covenant-gold' : 'text-gray-400'
                      }`} />
                      <p className={`font-medium ${
                        achievement.earned ? 'text-covenant-blue' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </p>
                    </div>
                    <p className={`text-sm ${
                      achievement.earned ? 'text-covenant-gray' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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