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
  content: string;
  videoUrl?: string;
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
        description: "Understanding the scriptural foundation of trust relationships and stewardship",
        content: `
# Introduction to Biblical Trusts

## The Foundation of Trust

In the Kingdom of God, trust is not merely a legal concept but a spiritual principle that reflects our relationship with the Almighty. As believers, we are called to be faithful stewards of all that God has entrusted to us.

### Scripture Foundation

"Moreover it is required in stewards, that a man be found faithful." (1 Corinthians 4:2 KJV)

The concept of trusteeship is woven throughout Scripture, from Adam's dominion in the Garden to the parables of talents and pounds. Every believer operates as a trustee over God's resources.

### Key Principles

1. **Divine Ownership**: "The earth is the Lord's, and the fulness thereof; the world, and they that dwell therein." (Psalm 24:1 KJV)

2. **Human Stewardship**: We are managers, not owners, of God's resources

3. **Faithful Administration**: Our calling is to manage according to His will and purposes

4. **Eternal Perspective**: Our stewardship will be evaluated at the judgment seat of Christ

### Trust as Covenant Relationship

A biblical trust reflects the covenant relationship between God and His people. Just as God has established covenants with His people, a trust creates a covenant relationship between trustor, trustee, and beneficiary.

### Practical Application

Understanding these principles forms the foundation for all trust administration. Every decision, every investment, every distribution must align with biblical principles of stewardship and faithfulness.

## Next Steps

In the following lessons, we will explore how to practically implement these biblical principles in modern trust administration, including legal structures, financial management, and beneficiary relationships.
        `,
        duration: "15 minutes",
        order: 1,
        completed: true
      },
      {
        id: "2",
        title: "Legal Structures and Kingdom Authority",
        description: "How to establish trust structures that honor God's authority while operating effectively",
        content: `
# Legal Structures and Kingdom Authority

## Balancing God's Kingdom and Caesar's Requirements

As trustees operating in the Kingdom of God, we must navigate the requirements of earthly legal systems while maintaining our allegiance to divine authority.

### Biblical Framework for Authority

"Render therefore unto Caesar the things which are Caesar's; and unto God the things that are God's." (Matthew 22:21 KJV)

This principle guides how we structure trusts that honor both divine and civil authority.

### Trust Formation Principles

1. **Purpose Declaration**: Every trust should clearly state its Kingdom purpose
2. **Biblical Guidelines**: Operating procedures should reflect scriptural principles
3. **Stewardship Standards**: Decision-making processes based on biblical stewardship
4. **Beneficiary Focus**: Blessing recipients according to God's will

### Common Trust Structures

#### Revocable Living Trusts
- Maintains control during lifetime
- Provides for seamless transition
- Protects privacy of estate plans

#### Irrevocable Trusts  
- Permanent transfer of assets
- Potential tax benefits
- Demonstrates faith in God's provision

#### Charitable Remainder Trusts
- Combines income and charitable giving
- Reflects biblical generosity principles
- Creates lasting legacy for Kingdom work

### Kingdom-Centered Trust Provisions

When drafting trust documents, consider including:
- Regular prayer and seeking God's guidance
- Biblical principles for investment decisions
- Charitable giving requirements
- Discipleship opportunities for beneficiaries

## Practical Exercise

Review existing trust documents or draft provisions that clearly establish Kingdom authority while meeting legal requirements.
        `,
        duration: "20 minutes",
        order: 2,
        completed: false
      },
      {
        id: "3",
        title: "Trustee Responsibilities and Biblical Stewardship",
        description: "Understanding your duties and obligations as a faithful trustee",
        content: `
# Trustee Responsibilities and Biblical Stewardship

## The High Calling of Trusteeship

Being appointed as a trustee is more than a legal position—it's a sacred calling to stewardship that reflects our relationship with God.

### Core Trustee Duties

#### 1. Fiduciary Responsibility
"He that is faithful in that which is least is faithful also in much" (Luke 16:10 KJV)

- Duty of loyalty to beneficiaries
- Prudent investment standards
- Impartial administration
- Accurate record keeping

#### 2. Biblical Stewardship Standards
- Seek God's wisdom in all decisions
- Invest according to biblical principles
- Consider eternal impact of choices
- Maintain integrity in all dealings

#### 3. Administrative Excellence
- Regular communication with beneficiaries  
- Detailed financial reporting
- Tax compliance and filing
- Asset protection and growth

### Investment Philosophy for Trustees

Biblical trustees should consider:
- **Values-based investing**: Avoiding industries that contradict biblical values
- **Long-term perspective**: "A good man leaveth an inheritance to his children's children" (Proverbs 13:22 KJV)
- **Risk management**: Prudent diversification while trusting God's provision
- **Kingdom impact**: Seeking returns that advance God's purposes

### Common Trustee Challenges

1. **Balancing beneficiary requests with trust purposes**
2. **Making difficult investment decisions** 
3. **Managing family dynamics**
4. **Keeping accurate records and documentation**
5. **Staying current with legal requirements**

### Building a Support Team

Successful trustees surround themselves with:
- Godly financial advisors
- Experienced estate attorneys
- Qualified accountants
- Trusted investment managers
- Spiritual mentors for guidance

## Action Steps

1. Review your current trustee responsibilities
2. Assess your support team and resources
3. Establish regular prayer and planning routines
4. Create systems for documentation and reporting
        `,
        duration: "25 minutes", 
        order: 3,
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
                {currentLesson?.videoUrl && (
                  <div className="mb-6">
                    <Card className="bg-gray-100">
                      <CardContent className="flex items-center justify-center h-64">
                        <div className="text-center">
                          <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Video content would be embedded here</p>
                          <Button className="mt-4 bg-covenant-blue hover:bg-covenant-blue/80 text-white">
                            <Play className="h-4 w-4 mr-2" />
                            Play Lesson
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className="prose prose-lg max-w-none">
                  <div 
                    className="text-covenant-gray leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: currentLesson?.content?.replace(/\n/g, '<br />').replace(/### /g, '<h3 class="text-xl font-semibold text-covenant-blue mt-6 mb-3">').replace(/## /g, '<h2 class="text-2xl font-bold text-covenant-blue mt-8 mb-4">').replace(/# /g, '<h1 class="text-3xl font-bold text-covenant-blue mt-8 mb-6">') || ''
                    }} 
                  />
                </div>

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