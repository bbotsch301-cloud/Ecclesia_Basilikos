import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BookOpen, Download, Video, Users, Award, Clock, Lock, CheckCircle, User, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, loginSchema, type Course, type Download as DownloadType } from "@shared/schema";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const registrationSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationData = z.infer<typeof registrationSchema>;

export default function Education() {
  const { user, isAuthenticated, login, register, logout, isLoggingIn, isRegistering } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const { data: courses = [], isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  const { data: downloads = [], isLoading: downloadsLoading } = useQuery<DownloadType[]>({
    queryKey: ['/api/downloads'],
  });

  const { data: enrollments = [] } = useQuery<any[]>({
    queryKey: ['/api/my-enrollments'],
    enabled: isAuthenticated,
  });

  const enrollMutation = useMutation({
    mutationFn: async (courseId: string) => {
      return apiRequest('/api/enrollments', 'POST', { courseId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/my-enrollments'] });
      toast({
        title: "Enrolled Successfully",
        description: "You have been enrolled in the course!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Enrollment Failed", 
        description: error.message || "Failed to enroll in course",
        variant: "destructive",
      });
    },
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
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
      await register(userData);
      setShowAuthDialog(false);
      toast({
        title: "Welcome to The New Covenant Trust!",
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

  const handleEnroll = (courseId: string) => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    enrollMutation.mutate(courseId);
  };

  const isEnrolled = (courseId: string) => {
    return enrollments.some((enrollment: any) => enrollment.courseId === courseId);
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

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif">
              Student Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your understanding of God's covenant and walk in the freedom Christ has provided through comprehensive biblical education.
            </p>
            
            {isAuthenticated ? (
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2 bg-green-600/20 text-green-200 px-4 py-2 rounded-lg">
                  <User className="h-5 w-5" />
                  <span>Welcome, {user?.firstName}!</span>
                </div>
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-slate-900"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex justify-center space-x-4">
                <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8">
                      <LogIn className="h-5 w-5 mr-2" />
                      Student Login
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {authMode === 'login' ? 'Student Login' : 'Create Student Account'}
                      </DialogTitle>
                      <DialogDescription>
                        {authMode === 'login' 
                          ? 'Sign in to access your courses and materials'
                          : 'Create an account to enroll in courses and access resources'
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
                            <Button type="submit" className="w-full" disabled={isLoggingIn}>
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
                                    <Input type="password" placeholder="Create a password" {...field} />
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
                                    <Input type="password" placeholder="Confirm your password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full" disabled={isRegistering}>
                              {isRegistering ? "Creating account..." : "Create Account"}
                            </Button>
                          </form>
                        </Form>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900 px-8">
                  View Free Resources
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="courses">
                <BookOpen className="h-4 w-4 mr-2" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="my-learning" disabled={!isAuthenticated}>
                <Award className="h-4 w-4 mr-2" />
                My Learning
              </TabsTrigger>
              <TabsTrigger value="resources">
                <Download className="h-4 w-4 mr-2" />
                Resources
              </TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">
                  Available Courses
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  "Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth." - 2 Timothy 2:15 (KJV)
                </p>
              </div>

              {coursesLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded"></div>
                          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : courses.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Available</h3>
                    <p className="text-gray-600">Courses will be available soon. Check back later!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course: Course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-bold">{course.title}</CardTitle>
                            <div className="flex space-x-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {course.level}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {course.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="mt-2">
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {course.duration || "Self-paced"}
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            {course.price === 0 ? "Free" : `$${((course.price || 0) / 100).toFixed(2)}`}
                          </div>
                        </div>
                        
                        {isAuthenticated ? (
                          isEnrolled(course.id) ? (
                            <Button className="w-full" disabled>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Enrolled
                            </Button>
                          ) : (
                            <Button 
                              className="w-full" 
                              onClick={() => handleEnroll(course.id)}
                              disabled={enrollMutation.isPending}
                            >
                              {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                            </Button>
                          )
                        ) : (
                          <Button 
                            className="w-full" 
                            onClick={() => setShowAuthDialog(true)}
                          >
                            <Lock className="h-4 w-4 mr-2" />
                            Sign In to Enroll
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* My Learning Tab */}
            <TabsContent value="my-learning" className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">
                  My Learning Journey
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Continue your covenant education and track your progress in understanding God's truth.
                </p>
              </div>

              {enrollments.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Enrollments Yet</h3>
                    <p className="text-gray-600 mb-4">Start your learning journey by enrolling in a course.</p>
                    <Button onClick={() => {
                      const coursesTab = document.querySelector('[value="courses"]') as HTMLElement;
                      coursesTab?.click();
                    }}>
                      Browse Courses
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrollments.map((enrollment: any) => (
                    <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{enrollment.course.title}</CardTitle>
                        <CardDescription>{enrollment.course.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Progress</span>
                            <span>{enrollment.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${enrollment.progress || 0}%` }}
                            ></div>
                          </div>
                          <Button className="w-full">
                            Continue Learning
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">
                  Study Resources
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  "All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness." - 2 Timothy 3:16 (KJV)
                </p>
              </div>

              {downloadsLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : downloads.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Resources Available</h3>
                    <p className="text-gray-600">Study resources will be available soon. Check back later!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {downloads.map((download: DownloadType) => (
                    <Card key={download.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{download.title}</CardTitle>
                        <div className="flex space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {download.fileType.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {download.category}
                          </Badge>
                          {download.isPublic && (
                            <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                              Free
                            </Badge>
                          )}
                        </div>
                        {download.description && (
                          <CardDescription>{download.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}