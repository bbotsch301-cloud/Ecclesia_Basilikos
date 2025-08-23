import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { insertUserSchema, loginSchema } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  BookOpen, 
  Download, 
  TrendingUp, 
  Users, 
  User, 
  LogIn, 
  GraduationCap,
  ChevronRight,
  Building,
  Shield
} from "lucide-react";
import ScriptureQuote from "@/components/ui/scripture-quote";

const registrationSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationData = z.infer<typeof registrationSchema>;

// Sample course data for the Learn to Steward program
const availableCourses = [
  {
    id: 1,
    title: "Trust Fundamentals",
    description: "Learn what a trust actually is, why people use them, and how they work in simple terms. Perfect for complete beginners who have never heard of trusts before.",
    lessons: 8,
    duration: "2.5 hours",
    level: "Foundational", 
    featured: true
  },
  {
    id: 2,
    title: "Banking & Financial Management", 
    description: "Learn practical trust banking, account management, and financial stewardship principles for kingdom wealth building.",
    lessons: 12,
    duration: "4 hours",
    level: "Intermediate",
    featured: false
  },
  {
    id: 3,
    title: "Investment Strategy for Trustees",
    description: "Biblical investment principles, asset allocation, and growing trust assets through wise stewardship.",
    lessons: 15,
    duration: "5 hours",
    level: "Advanced",
    featured: false
  },
  {
    id: 4,
    title: "Cryptocurrency & Digital Assets",
    description: "Understanding digital currencies, blockchain technology, and incorporating crypto assets into trust portfolios.",
    lessons: 10,
    duration: "3.5 hours",
    level: "Advanced",
    featured: false
  },
  {
    id: 5,
    title: "Legacy & Estate Planning",
    description: "Generational wealth transfer, inheritance planning, and building lasting kingdom legacies for your children's children.",
    lessons: 14,
    duration: "4.5 hours",
    level: "Advanced",
    featured: true
  },
  {
    id: 6,
    title: "Asset Protection Strategies",
    description: "Protecting trust assets, legal compliance, and maintaining proper trustee responsibilities in all circumstances.",
    lessons: 11,
    duration: "3.5 hours",
    level: "Intermediate",
    featured: false
  }
];

export default function Courses() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'foundational' | 'intermediate' | 'advanced'>('all');

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  const { login, register: registerUser, logout, isLoggingIn, isRegistering } = useAuth();

  // Fetch user enrollments
  const { data: enrollments = [] } = useQuery({
    queryKey: ["/api/my-enrollments"],
    enabled: isAuthenticated,
  });

  // Check if user is enrolled in a course
  const isEnrolledInCourse = (courseId: string) => {
    return enrollments.some((enrollment: any) => enrollment.courseId === courseId);
  };

  // Get enrollment status for button text
  const getEnrollmentStatus = (courseId: string) => {
    if (!isAuthenticated) return "login";
    if (isEnrolledInCourse(courseId)) return "enrolled";
    return "enroll";
  };

  // Get button text based on enrollment status
  const getButtonText = (courseId: string, isPending: boolean = false) => {
    if (isPending) return "Processing...";
    
    const status = getEnrollmentStatus(courseId);
    switch (status) {
      case "login": return "Login to Enroll";
      case "enrolled": return "Continue Course";
      case "enroll": return "Begin Course";
      default: return "Enroll Now";
    }
  };

  // Course enrollment mutation
  const enrollMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const response = await apiRequest("POST", `/api/enrollments`, { courseId });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Enrollment Successful!",
        description: "You have been enrolled in the course. Access it from My Courses.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-enrollments"] });
    },
    onError: (error: any) => {
      toast({
        title: "Enrollment Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onLogin = async (data: z.infer<typeof loginSchema>) => {
    try {
      await login(data);
      setShowAuthDialog(false);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  const onRegister = async (data: RegistrationData) => {
    try {
      const { confirmPassword, ...userData } = data;
      await registerUser(userData);
      setShowAuthDialog(false);
      toast({
        title: "Welcome to Learn to Steward!",
        description: "Your account has been created successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleEnroll = async (courseId: string, courseTitle: string) => {
    const status = getEnrollmentStatus(courseId);
    
    if (status === "login") {
      setShowAuthDialog(true);
      return;
    }
    
    if (status === "enrolled") {
      // Navigate to course or first lesson
      window.location.href = `/course-lesson/${courseId}/1`;
      return;
    }
    
    // Proceed with enrollment
    try {
      await enrollMutation.mutateAsync(courseId.toString());
    } catch (error) {
      console.error("Enrollment error:", error);
    }
  };

  const filteredCourses = selectedLevel === 'all' 
    ? availableCourses 
    : availableCourses.filter(course => 
        course.level.toLowerCase() === selectedLevel.replace('foundational', 'foundational')
      );

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Foundational': return 'bg-covenant-gold/10 text-covenant-blue';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-covenant-light via-white to-covenant-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-covenant-gold mx-auto mb-4"></div>
          <p className="text-covenant-gray">Loading Learn to Steward...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-covenant-light via-white to-covenant-light">
      {/* Hero Section */}
      <section className="bg-covenant-blue text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <GraduationCap className="h-16 w-16 text-covenant-gold" />
            </div>
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">
              Learn to Steward
            </h1>
            <p className="text-xl md:text-2xl font-inter max-w-4xl mx-auto leading-relaxed mb-8">
              Your personal dashboard for trust administration education and resources
            </p>

            {isAuthenticated ? (
              <div className="flex items-center justify-center space-x-4 mt-8">
                <div className="flex items-center space-x-2 bg-green-600/20 text-green-200 px-4 py-2 rounded-lg">
                  <User className="h-5 w-5" />
                  <span>Welcome back, {user?.firstName}!</span>
                </div>
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-covenant-blue"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="mt-8">
                <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue px-8 py-3 font-semibold">
                      <LogIn className="h-5 w-5 mr-2" />
                      Access Learn to Steward
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {authMode === 'login' ? 'Student Login' : 'Create Student Account'}
                      </DialogTitle>
                      <DialogDescription>
                        {authMode === 'login' 
                          ? 'Sign in to access your Learn to Steward dashboard'
                          : 'Join Learn to Steward to begin your trust education'
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
                          <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                            <FormField
                              control={loginForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your email" {...field} />
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
                                    <Input type="password" placeholder="Enter your password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue" disabled={isLoggingIn}>
                              {isLoggingIn ? "Signing in..." : "Sign In"}
                            </Button>
                          </form>
                        </Form>
                      </TabsContent>
                      
                      <TabsContent value="register" className="space-y-4">
                        <Form {...registerForm}>
                          <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={registerForm.control}
                                name="firstName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="First name" {...field} />
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
                                      <Input placeholder="Last name" {...field} />
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
                                    <Input placeholder="Enter your email" {...field} />
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
                                    <Input type="password" placeholder="Create password" {...field} />
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
                                    <Input type="password" placeholder="Confirm password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue" disabled={isRegistering}>
                              {isRegistering ? "Joining..." : "Join Learn to Steward"}
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
        </div>
      </section>

      {/* Course Catalog */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Course */}
          <div className="mb-16">
            {availableCourses.filter(course => course.featured).slice(0, 1).map(course => (
              <Card key={course.id} className="bg-gradient-to-r from-covenant-blue to-covenant-dark-blue border-0 overflow-hidden">
                <CardContent className="p-8 text-white">
                  <div className="flex items-center mb-4">
                    <Badge className="bg-covenant-gold text-covenant-blue mr-4">Featured Course</Badge>
                    <Badge className={`${getLevelColor(course.level)} ml-2`}>
                      {course.level}
                    </Badge>
                  </div>
                  
                  <h3 className="text-3xl font-playfair font-bold mb-4">{course.title}</h3>
                  <p className="text-lg text-blue-100 mb-6 max-w-3xl">{course.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-6 mb-8">
                    <div className="flex items-center text-blue-200">
                      <BookOpen className="h-5 w-5 mr-2" />
                      <span>{course.lessons} lessons</span>
                    </div>
                    <div className="flex items-center text-blue-200">
                      <User className="h-5 w-5 mr-2" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue px-8 py-3 font-semibold"
                    onClick={() => handleEnroll(course.id.toString(), course.title)}
                    disabled={enrollMutation.isPending}
                  >
                    <GraduationCap className="h-5 w-5 mr-2" />
                    {getButtonText(course.id.toString(), enrollMutation.isPending)}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Course Filter */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-covenant-blue mb-4">
              All Courses
            </h2>
            <p className="text-lg text-covenant-gray max-w-3xl mx-auto mb-8">
              Choose from our comprehensive curriculum designed to equip you as a faithful trustee
            </p>
            
            <div className="flex justify-center">
              <div className="bg-white rounded-lg p-1 shadow-md">
                <button
                  onClick={() => setSelectedLevel('all')}
                  className={`px-6 py-3 rounded-md font-medium transition-colors ${
                    selectedLevel === 'all' 
                      ? 'bg-covenant-blue text-white' 
                      : 'text-covenant-gray hover:text-covenant-blue'
                  }`}
                >
                  All Courses
                </button>
                <button
                  onClick={() => setSelectedLevel('foundational')}
                  className={`px-6 py-3 rounded-md font-medium transition-colors ${
                    selectedLevel === 'foundational' 
                      ? 'bg-covenant-blue text-white' 
                      : 'text-covenant-gray hover:text-covenant-blue'
                  }`}
                >
                  Foundational
                </button>
                <button
                  onClick={() => setSelectedLevel('intermediate')}
                  className={`px-6 py-3 rounded-md font-medium transition-colors ${
                    selectedLevel === 'intermediate' 
                      ? 'bg-covenant-blue text-white' 
                      : 'text-covenant-gray hover:text-covenant-blue'
                  }`}
                >
                  Intermediate
                </button>
                <button
                  onClick={() => setSelectedLevel('advanced')}
                  className={`px-6 py-3 rounded-md font-medium transition-colors ${
                    selectedLevel === 'advanced' 
                      ? 'bg-covenant-blue text-white' 
                      : 'text-covenant-gray hover:text-covenant-blue'
                  }`}
                >
                  Advanced
                </button>
              </div>
            </div>
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
                    {course.featured && (
                      <Badge variant="outline" className="border-covenant-gold text-covenant-gold">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-covenant-blue">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-covenant-gray">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-covenant-blue hover:bg-covenant-blue/80 text-white"
                      onClick={() => handleEnroll(course.id.toString(), course.title)}
                      disabled={enrollMutation.isPending}
                    >
                      <GraduationCap className="h-4 w-4 mr-2" />
                      {getButtonText(course.id.toString(), enrollMutation.isPending)}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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