import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/ui/hero-section";
import ScriptureQuote from "@/components/ui/scripture-quote";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BookOpen, Crown, Heart, Shield, CheckCircle, ArrowRight, Play, Video, LogIn, UserPlus, ChevronDown, ChevronRight, GraduationCap, Zap, Star } from "lucide-react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, loginSchema } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const registrationSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationData = z.infer<typeof registrationSchema>;

interface CourseData {
  id: string;
  title: string;
  description: string;
  level: 'foundation' | 'intermediate' | 'advanced' | 'master';
  duration: string;
  sectionCount: number;
  estimatedTime: string;
  thumbnail: string;
  completionBadge: string;
  sections: {
    id: string;
    title: string;
    duration: string;
    description: string;
    topics: string[];
  }[];
  learningOutcomes: string[];
  prerequisites?: string[];
}

const coursesData: CourseData[] = [
  {
    id: "new-covenant-foundation",
    title: "Introduction to the New Covenant Trust",
    description: "Understanding Christ as the Grantor and your role as beneficiary in God's eternal trust",
    level: "foundation",
    duration: "45 minutes",
    sectionCount: 6,
    estimatedTime: "1 week",
    thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    completionBadge: "Covenant Foundation",
    sections: [
      {
        id: "foundation",
        title: "The Foundation of Trust",
        duration: "5 min",
        description: "Understanding what a trust is and why Christ established one",
        topics: ["Trust Fundamentals", "Biblical Foundation", "Legal Framework"]
      },
      {
        id: "grantor",
        title: "Christ as Grantor",
        duration: "8 min", 
        description: "How Jesus established the New Covenant Trust through His sacrifice",
        topics: ["Grantor Authority", "Sacrifice & Inheritance", "Eternal Covenant"]
      },
      {
        id: "beneficiary",
        title: "Your Role as Beneficiary",
        duration: "7 min",
        description: "Understanding your inheritance and rights in the trust",
        topics: ["Inheritance Rights", "Co-heir Status", "Kingdom Benefits"]
      },
      {
        id: "authority",
        title: "Spiritual Authority",
        duration: "6 min",
        description: "Operating in Kingdom authority as a co-heir with Christ",
        topics: ["Delegated Authority", "Kingdom Power", "Spiritual Warfare"]
      },
      {
        id: "freedom",
        title: "True Freedom in Christ", 
        duration: "9 min",
        description: "How regeneration brings freedom from Babylon's systems",
        topics: ["Liberation Theology", "Breaking Bondage", "Spiritual Freedom"]
      },
      {
        id: "living",
        title: "Living as a Beneficiary",
        duration: "10 min",
        description: "Practical application of your covenant identity",
        topics: ["Daily Practice", "Identity in Christ", "Kingdom Lifestyle"]
      }
    ],
    learningOutcomes: [
      "Understand the biblical foundation of the New Covenant Trust",
      "Recognize your role as a joint-heir with Christ",
      "Operate in Kingdom spiritual authority",
      "Experience freedom from Babylon's legal fiction systems",
      "Apply covenant principles in daily life"
    ]
  },
  {
    id: "covenant-authority",
    title: "Advanced Covenant Authority",
    description: "Deep dive into spiritual authority, dominion, and the believer's governmental role in the Kingdom",
    level: "intermediate",
    duration: "2.5 hours",
    sectionCount: 8,
    estimatedTime: "2-3 weeks",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    completionBadge: "Authority Walker",
    sections: [
      {
        id: "delegated-authority",
        title: "Understanding Delegated Authority",
        duration: "20 min",
        description: "The biblical basis for spiritual authority and how it flows from the throne",
        topics: ["Divine Hierarchy", "Authority Structure", "Commissioning"]
      },
      {
        id: "dominion-mandate",
        title: "The Dominion Mandate",
        duration: "18 min",
        description: "Restoring mankind's original commission to rule and reign",
        topics: ["Genesis Commission", "Cultural Mandate", "Kingdom Dominion"]
      },
      {
        id: "governmental-authority",
        title: "Governmental Authority in the Kingdom",
        duration: "22 min",
        description: "How believers function as governmental agents of the Kingdom",
        topics: ["Governmental Intercession", "Legislative Authority", "Judicial Authority"]
      },
      {
        id: "binding-loosing",
        title: "Binding and Loosing",
        duration: "25 min",
        description: "Understanding the keys of the Kingdom and their practical application",
        topics: ["Keys of the Kingdom", "Binding Principles", "Loosing Principles"]
      },
      {
        id: "territorial-authority",
        title: "Territorial Authority",
        duration: "19 min",
        description: "Operating in authority over regions, cities, and territories",
        topics: ["Geographic Authority", "Territorial Spirits", "Regional Transformation"]
      },
      {
        id: "marketplace-authority",
        title: "Authority in the Marketplace",
        duration: "17 min",
        description: "Exercising Kingdom authority in business and commerce",
        topics: ["Business as Ministry", "Economic Authority", "Marketplace Transformation"]
      },
      {
        id: "family-authority",
        title: "Family and Household Authority",
        duration: "15 min",
        description: "Establishing godly authority structures in family and household",
        topics: ["Family Hierarchy", "Household Governance", "Generational Authority"]
      },
      {
        id: "advanced-intercession",
        title: "Advanced Intercession & Warfare",
        duration: "24 min",
        description: "High-level intercession and strategic spiritual warfare",
        topics: ["Strategic Intercession", "Governmental Warfare", "Prophetic Intercession"]
      }
    ],
    learningOutcomes: [
      "Exercise delegated authority with confidence and biblical foundation",
      "Understand and implement the dominion mandate",
      "Function governmentally in the Kingdom of God",
      "Use the keys of the Kingdom effectively",
      "Transform territories through spiritual authority",
      "Exercise Kingdom authority in marketplace and family"
    ],
    prerequisites: ["Introduction to the New Covenant Trust"]
  },
  {
    id: "prophetic-ministry",
    title: "Prophetic Ministry & Divine Communication",
    description: "Advanced training in prophetic ministry, hearing God's voice, and functioning in the prophetic office",
    level: "advanced",
    duration: "4 hours",
    sectionCount: 10,
    estimatedTime: "4-6 weeks",
    thumbnail: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    completionBadge: "Prophetic Voice",
    sections: [
      {
        id: "prophetic-foundation",
        title: "Foundations of Prophetic Ministry",
        duration: "28 min",
        description: "Biblical foundations and principles of prophetic ministry",
        topics: ["Old Testament Prophets", "New Testament Prophecy", "Prophetic Office"]
      },
      {
        id: "hearing-god",
        title: "Hearing the Voice of God",
        duration: "25 min",
        description: "Developing sensitivity to God's voice and various forms of divine communication",
        topics: ["Divine Communication", "Spiritual Discernment", "Testing the Spirits"]
      },
      {
        id: "prophetic-protocols",
        title: "Prophetic Protocols & Ethics",
        duration: "22 min",
        description: "Proper protocols, ethics, and accountability in prophetic ministry",
        topics: ["Prophetic Ethics", "Accountability", "Submission to Authority"]
      },
      {
        id: "prophetic-intercession",
        title: "Prophetic Intercession",
        duration: "26 min",
        description: "Intercession guided by prophetic insight and divine strategy",
        topics: ["Strategic Intercession", "Prophetic Prayer", "Divine Strategy"]
      },
      {
        id: "dreams-visions",
        title: "Dreams, Visions & Supernatural Encounters",
        duration: "30 min",
        description: "Understanding and interpreting dreams, visions, and supernatural experiences",
        topics: ["Dream Interpretation", "Visions & Trances", "Angelic Encounters"]
      },
      {
        id: "prophetic-worship",
        title: "Prophetic Worship & Expression",
        duration: "20 min",
        description: "Expressing prophetic revelation through worship and creative arts",
        topics: ["Prophetic Worship", "Creative Expression", "Spontaneous Song"]
      },
      {
        id: "national-prophecy",
        title: "National & Regional Prophecy",
        duration: "27 min",
        description: "Prophetic ministry to nations, regions, and governmental spheres",
        topics: ["National Prophecy", "Regional Transformation", "Governmental Prophets"]
      },
      {
        id: "prophetic-evangelism",
        title: "Prophetic Evangelism",
        duration: "18 min",
        description: "Using prophetic gifts in evangelism and ministry to the lost",
        topics: ["Prophetic Evangelism", "Words of Knowledge", "Supernatural Encounters"]
      },
      {
        id: "prophetic-teams",
        title: "Building Prophetic Teams",
        duration: "21 min",
        description: "Developing and leading prophetic teams and communities",
        topics: ["Team Building", "Prophetic Community", "Leadership Development"]
      },
      {
        id: "mature-prophetic",
        title: "Mature Prophetic Ministry",
        duration: "23 min",
        description: "Operating in mature prophetic ministry with wisdom and authority",
        topics: ["Prophetic Maturity", "Wisdom & Timing", "Prophetic Authority"]
      }
    ],
    learningOutcomes: [
      "Establish strong biblical foundations for prophetic ministry",
      "Develop clear communication with God through various channels",
      "Operate with proper protocols and ethical standards",
      "Function in prophetic intercession and strategic prayer",
      "Interpret dreams, visions, and supernatural encounters",
      "Lead and develop prophetic teams and communities",
      "Minister prophetically to nations and regions"
    ],
    prerequisites: ["Introduction to the New Covenant Trust", "Advanced Covenant Authority"]
  },
  {
    id: "apostolic-government",
    title: "Apostolic Government & Kingdom Administration",
    description: "Master-level training in apostolic ministry, church government, and Kingdom administration",
    level: "master",
    duration: "6 hours",
    sectionCount: 12,
    estimatedTime: "8-10 weeks",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    completionBadge: "Apostolic Leader",
    sections: [
      {
        id: "apostolic-foundation",
        title: "Foundations of Apostolic Ministry",
        duration: "35 min",
        description: "Biblical foundations and characteristics of apostolic ministry",
        topics: ["Apostolic Office", "New Testament Apostles", "Modern Apostolic Movement"]
      },
      {
        id: "church-government",
        title: "Divine Government in the Church",
        duration: "32 min",
        description: "Establishing proper governmental structure in local church",
        topics: ["Fivefold Ministry", "Elder Government", "Theocratic Structure"]
      },
      {
        id: "kingdom-administration",
        title: "Kingdom Administration",
        duration: "28 min",
        description: "Administrative principles for Kingdom expansion and church growth",
        topics: ["Administrative Gifts", "Kingdom Systems", "Organizational Structure"]
      },
      {
        id: "apostolic-teams",
        title: "Building Apostolic Teams",
        duration: "30 min",
        description: "Developing and deploying apostolic teams for ministry and missions",
        topics: ["Team Dynamics", "Apostolic Deployment", "Team Leadership"]
      },
      {
        id: "church-planting",
        title: "Apostolic Church Planting",
        duration: "33 min",
        description: "Strategic church planting and establishing healthy church communities",
        topics: ["Church Planting Strategy", "Community Building", "Church Health"]
      },
      {
        id: "regional-oversight",
        title: "Regional & Network Oversight",
        duration: "29 min",
        description: "Providing apostolic oversight to regions and church networks",
        topics: ["Regional Oversight", "Church Networks", "Apostolic Covering"]
      },
      {
        id: "marketplace-transformation",
        title: "Marketplace Transformation",
        duration: "26 min",
        description: "Transforming businesses and economic systems through apostolic ministry",
        topics: ["Business Transformation", "Economic Reformation", "Marketplace Ministry"]
      },
      {
        id: "cultural-reformation",
        title: "Cultural Reformation",
        duration: "31 min",
        description: "Bringing Kingdom influence to culture and societal institutions",
        topics: ["Cultural Mandate", "Societal Transformation", "Kingdom Influence"]
      },
      {
        id: "apostolic-signs",
        title: "Signs, Wonders & Miracles",
        duration: "27 min",
        description: "Operating in the supernatural signs that accompany apostolic ministry",
        topics: ["Apostolic Signs", "Miraculous Ministry", "Supernatural Validation"]
      },
      {
        id: "international-ministry",
        title: "International Apostolic Ministry",
        duration: "34 min",
        description: "Cross-cultural apostolic ministry and international church development",
        topics: ["Cross-Cultural Ministry", "International Networks", "Global Strategy"]
      },
      {
        id: "succession-legacy",
        title: "Succession & Legacy Building",
        duration: "25 min",
        description: "Building sustainable ministry legacy and preparing successors",
        topics: ["Legacy Building", "Succession Planning", "Generational Ministry"]
      },
      {
        id: "mature-apostolic",
        title: "Mature Apostolic Leadership",
        duration: "30 min",
        description: "Operating in mature apostolic authority with wisdom and humility",
        topics: ["Apostolic Maturity", "Servant Leadership", "Kingdom Wisdom"]
      }
    ],
    learningOutcomes: [
      "Understand and operate in apostolic ministry with biblical foundation",
      "Establish divine government structures in church and ministry",
      "Administer Kingdom principles in complex organizational settings",
      "Build and deploy effective apostolic teams",
      "Plant and oversee healthy, growing church communities",
      "Transform marketplace and cultural institutions",
      "Operate in supernatural signs, wonders, and miracles",
      "Build sustainable ministry legacy for future generations"
    ],
    prerequisites: ["Introduction to the New Covenant Trust", "Advanced Covenant Authority", "Prophetic Ministry & Divine Communication"]
  }
];

export default function Courses() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [openCourses, setOpenCourses] = useState<string[]>([]);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const toggleCourse = (courseId: string) => {
    setOpenCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'foundation': return <BookOpen className="h-5 w-5" />;
      case 'intermediate': return <GraduationCap className="h-5 w-5" />;
      case 'advanced': return <Zap className="h-5 w-5" />;
      case 'master': return <Crown className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'foundation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'intermediate': return 'bg-green-100 text-green-800 border-green-200';
      case 'advanced': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'master': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="pt-16">
      <HeroSection
        title="Kingdom College Courses"
        description="Comprehensive biblical education in covenant theology, spiritual authority, and Kingdom advancement"
        backgroundImage="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
      />

      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Course Overview */}
          <div className="mb-16 text-center">
            <h1 className="font-playfair text-3xl font-bold text-covenant-blue mb-4">
              Progressive Kingdom Education
            </h1>
            <p className="text-lg text-covenant-gray leading-relaxed max-w-3xl mx-auto mb-8">
              Our comprehensive curriculum takes you from foundational covenant understanding to mature apostolic ministry. 
              Each course builds upon the previous, creating a complete educational journey in Kingdom theology and practice.
            </p>
            
            {!isAuthenticated && (
              <div className="bg-covenant-light rounded-lg p-6 max-w-2xl mx-auto">
                <p className="text-covenant-blue font-semibold mb-4">Ready to begin your Kingdom education?</p>
                <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue">
                      <LogIn className="h-4 w-4 mr-2" />
                      Begin Learning Today
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {authMode === 'login' ? 'Student Login' : 'Create Student Account'}
                      </DialogTitle>
                      <DialogDescription>
                        {authMode === 'login' 
                          ? 'Sign in to access all course materials'
                          : 'Join Kingdom College to unlock your divine potential'
                        }
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'login' | 'register')}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="login" className="space-y-4">
                        <Form {...loginForm}>
                          <form className="space-y-4">
                            <FormField
                              control={loginForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your email" {...field} data-testid="input-email" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={loginForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Enter your password" {...field} data-testid="input-password" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue" data-testid="button-login">
                              Sign In
                            </Button>
                          </form>
                        </Form>
                      </TabsContent>
                      
                      <TabsContent value="register" className="space-y-4">
                        <Form {...registerForm}>
                          <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={registerForm.control}
                                name="firstName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="First name" {...field} data-testid="input-firstName" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={registerForm.control}
                                name="lastName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Last name" {...field} data-testid="input-lastName" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={registerForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your email" {...field} data-testid="input-register-email" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={registerForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Create password" {...field} data-testid="input-register-password" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={registerForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Confirm password" {...field} data-testid="input-confirmPassword" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue" data-testid="button-register">
                              Create Account
                            </Button>
                          </form>
                        </Form>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          {/* Courses List */}
          <div className="space-y-6">
            <h2 className="font-playfair text-2xl font-bold text-covenant-blue mb-8">Course Curriculum</h2>
            
            {coursesData.map((course, index) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Collapsible 
                  open={openCourses.includes(course.id)} 
                  onOpenChange={() => toggleCourse(course.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-covenant-light/50 transition-colors" data-testid={`course-header-${course.id}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <img 
                            src={course.thumbnail} 
                            alt={course.title}
                            className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className={`${getLevelColor(course.level)} border`}>
                                <span className="flex items-center gap-1">
                                  {getLevelIcon(course.level)}
                                  <span className="capitalize">{course.level}</span>
                                </span>
                              </Badge>
                              <span className="text-sm text-covenant-gray">{course.duration}</span>
                              <span className="text-sm text-covenant-gray">{course.sectionCount} sections</span>
                            </div>
                            <CardTitle className="text-xl text-covenant-blue mb-2">{course.title}</CardTitle>
                            <CardDescription className="text-covenant-gray">{course.description}</CardDescription>
                            
                            {course.prerequisites && course.prerequisites.length > 0 && (
                              <div className="mt-2">
                                <span className="text-xs text-covenant-gray">Prerequisites: {course.prerequisites.join(", ")}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 ml-4">
                          <Badge className="bg-covenant-gold/10 text-covenant-blue border-covenant-gold">
                            {course.completionBadge}
                          </Badge>
                          {openCourses.includes(course.id) ? (
                            <ChevronDown className="h-5 w-5 text-covenant-blue" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-covenant-blue" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                          {/* Learning Outcomes */}
                          <div className="mb-8">
                            <h4 className="font-semibold text-covenant-blue mb-4 flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              What You'll Learn
                            </h4>
                            <div className="grid md:grid-cols-2 gap-3">
                              {course.learningOutcomes.map((outcome, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-covenant-gray">{outcome}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Course Sections */}
                          <div>
                            <h4 className="font-semibold text-covenant-blue mb-4 flex items-center gap-2">
                              <BookOpen className="h-5 w-5 text-covenant-gold" />
                              Course Sections
                            </h4>
                            <div className="space-y-4">
                              {course.sections.map((section, sectionIdx) => (
                                <div key={section.id} className="border border-covenant-light rounded-lg p-4">
                                  <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-covenant-light rounded-full flex items-center justify-center flex-shrink-0">
                                      <span className="text-sm font-bold text-covenant-blue">{sectionIdx + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <h5 className="font-medium text-covenant-blue">{section.title}</h5>
                                        <Badge variant="outline" className="text-xs">
                                          {section.duration}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-covenant-gray mb-3">{section.description}</p>
                                      <div className="flex flex-wrap gap-2">
                                        {section.topics.map((topic, topicIdx) => (
                                          <span key={topicIdx} className="text-xs bg-covenant-light text-covenant-blue px-2 py-1 rounded">
                                            {topic}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Video Placeholder */}
                                  <div className="mt-4 bg-gradient-to-br from-covenant-light to-covenant-light/50 rounded-lg p-6 border-2 border-dashed border-covenant-gold/30">
                                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                                      <div className="w-12 h-12 bg-covenant-gold/20 rounded-full flex items-center justify-center">
                                        <Video className="h-6 w-6 text-covenant-gold" />
                                      </div>
                                      <div>
                                        <h6 className="font-medium text-covenant-blue mb-1">
                                          Video: {section.title}
                                        </h6>
                                        <p className="text-xs text-covenant-gray mb-2">
                                          Coming Soon - {section.duration} teaching video
                                        </p>
                                        <Badge className="bg-covenant-gold/10 text-covenant-blue border-covenant-gold text-xs">
                                          Video Content Planned
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Course Sidebar */}
                        <div>
                          <Card className="sticky top-24">
                            <CardHeader>
                              <CardTitle className="text-lg">Course Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <p className="text-sm font-medium text-covenant-gray">Duration</p>
                                <p className="text-lg font-bold text-covenant-blue">{course.duration}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-covenant-gray">Estimated Time</p>
                                <p className="text-lg font-bold text-covenant-blue">{course.estimatedTime}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-covenant-gray">Sections</p>
                                <p className="text-lg font-bold text-covenant-blue">{course.sectionCount} lessons</p>
                              </div>

                              <div>
                                <p className="text-sm font-medium text-covenant-gray">Completion Badge</p>
                                <Badge className="bg-covenant-gold/10 text-covenant-blue border-covenant-gold">
                                  <Star className="h-3 w-3 mr-1" />
                                  {course.completionBadge}
                                </Badge>
                              </div>

                              {isAuthenticated ? (
                                <Button className="w-full bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue" data-testid={`button-start-${course.id}`}>
                                  <Play className="h-4 w-4 mr-2" />
                                  Start Course
                                </Button>
                              ) : (
                                <div className="text-center">
                                  <p className="text-sm text-covenant-gray mb-3">Sign in to access course</p>
                                  <Button 
                                    onClick={() => setShowAuthDialog(true)}
                                    className="w-full bg-covenant-blue hover:bg-covenant-blue/80 text-white"
                                    data-testid={`button-access-${course.id}`}
                                  >
                                    <LogIn className="h-4 w-4 mr-2" />
                                    Get Access
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>

          {/* Scriptural Foundation */}
          <div className="mt-16">
            <ScriptureQuote
              quote="Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth."
              reference="2 Timothy 2:15 (KJV)"
              className="text-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}