import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BookOpen, Download, Video, Users, Award, Clock, Lock, CheckCircle, User, LogIn, UserPlus, GraduationCap, Crown, Shield, Scroll, Heart, Key, Play } from "lucide-react";
import { Link } from "wouter";
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
        title: "Welcome to Kingdom College!",
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
    <div className="min-h-screen bg-gradient-to-b from-covenant-light via-white to-covenant-light">
      {/* Hero Section */}
      <section className="bg-covenant-blue text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <GraduationCap className="h-16 w-16 text-covenant-gold" />
            </div>
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">
              Kingdom College
            </h1>
            <p className="text-xl md:text-2xl font-inter max-w-4xl mx-auto leading-relaxed mb-8">
              Understanding your divine identity as co-heirs with Christ and trustees of the New Covenant Legacy Trust
            </p>
            
            <div className="space-y-6">
              <div className="flex flex-wrap justify-center gap-4">
                <div className="inline-flex items-center bg-covenant-gold/20 px-6 py-3 rounded-full">
                  <Crown className="h-5 w-5 mr-2 text-covenant-gold" />
                  <span className="font-medium">Royal Priesthood</span>
                </div>
                <div className="inline-flex items-center bg-covenant-gold/20 px-6 py-3 rounded-full">
                  <Shield className="h-5 w-5 mr-2 text-covenant-gold" />
                  <span className="font-medium">Holy Nation</span>
                </div>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <blockquote className="font-georgia text-lg italic mb-3">
                  "But ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people; that ye should shew forth the praises of him who hath called you out of darkness into his marvellous light."
                </blockquote>
                <cite className="text-covenant-gold font-medium">1 Peter 2:9 (KJV)</cite>
              </div>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center justify-center space-x-4 mt-8">
                <div className="flex items-center space-x-2 bg-green-600/20 text-green-200 px-4 py-2 rounded-lg">
                  <User className="h-5 w-5" />
                  <span>Welcome, {user?.firstName}!</span>
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
                      Begin Your Journey
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {authMode === 'login' ? 'Student Login' : 'Create Student Account'}
                      </DialogTitle>
                      <DialogDescription>
                        {authMode === 'login' 
                          ? 'Sign in to continue your covenant education'
                          : 'Join Kingdom College to understand your divine inheritance'
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
                              {isRegistering ? "Joining..." : "Join"}
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

      {/* Featured Course */}
      <section className="py-16 bg-gradient-to-r from-covenant-blue to-covenant-dark-blue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white">
            <Badge className="bg-covenant-gold text-covenant-blue mb-4">Featured Course</Badge>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              Introduction to the New Covenant Trust
            </h2>
            <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
              A comprehensive overview of Christ as the Grantor of the New Covenant Trust and how you can step into your role as a beneficiary. This foundational teaching sets the stage for understanding your true identity and freedom in Christ.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center text-blue-200">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">45 minutes</span>
              </div>
              <div className="flex items-center text-blue-200">
                <Users className="h-4 w-4 mr-2" />
                <span className="text-sm">Foundational Level</span>
              </div>
              <div className="flex items-center text-blue-200">
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="text-sm">6 Sections</span>
              </div>
            </div>
            <Link href="/new-covenant-intro">
              <Button size="lg" className="bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue px-8 py-3 font-semibold">
                <Play className="h-5 w-5 mr-2" />
                Start Learning
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Teachings Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-covenant-blue mb-4">
              Core Kingdom Principles
            </h2>
            <p className="text-lg text-covenant-gray max-w-3xl mx-auto">
              Learn the fundamental truths of your identity in Christ and your inheritance as a co-heir with Christ
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-covenant-light hover:border-covenant-gold transition-colors">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Scroll className="h-8 w-8 text-covenant-blue mr-3" />
                  <CardTitle className="text-covenant-blue">The New Covenant</CardTitle>
                </div>
                <CardDescription>
                  Understanding Christ's testament as both covenant and will
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <blockquote className="font-georgia italic text-sm border-l-4 border-covenant-gold pl-4">
                    "For where a testament is, there must also of necessity be the death of the testator."
                  </blockquote>
                  <cite className="text-xs text-covenant-gold">Hebrews 9:16 (KJV)</cite>
                  <p className="text-sm text-covenant-gray">
                    Jesus' death ratified the New Covenant, making us beneficiaries of His will and co-heirs to His Kingdom.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-covenant-light hover:border-covenant-gold transition-colors">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Crown className="h-8 w-8 text-covenant-blue mr-3" />
                  <CardTitle className="text-covenant-blue">Royal Identity</CardTitle>
                </div>
                <CardDescription>
                  Your divine inheritance and authority in Christ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <blockquote className="font-georgia italic text-sm border-l-4 border-covenant-gold pl-4">
                    "And if children, then heirs; heirs of God, and joint-heirs with Christ"
                  </blockquote>
                  <cite className="text-xs text-covenant-gold">Romans 8:17 (KJV)</cite>
                  <p className="text-sm text-covenant-gray">
                    In Christ, you are sealed with the Holy Spirit as the down payment of your inheritance and divine authority.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-covenant-light hover:border-covenant-gold transition-colors">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Shield className="h-8 w-8 text-covenant-blue mr-3" />
                  <CardTitle className="text-covenant-blue">Kingdom Freedom</CardTitle>
                </div>
                <CardDescription>
                  Liberation from Babylonian systems and worldly bondage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <blockquote className="font-georgia italic text-sm border-l-4 border-covenant-gold pl-4">
                    "If the Son therefore shall make you free, ye shall be free indeed."
                  </blockquote>
                  <cite className="text-xs text-covenant-gold">John 8:36 (KJV)</cite>
                  <p className="text-sm text-covenant-gray">
                    Christ has freed you from the counterfeit kingdom's merchandise system where souls are traded.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Structure Section */}
      <section className="py-16 bg-covenant-light/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-covenant-blue mb-4">
              The New Covenant Trust Structure
            </h2>
            <p className="text-lg text-covenant-gray max-w-3xl mx-auto">
              Understanding your role as trustee in God's divine legacy trust
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Card className="border-covenant-blue">
                <CardHeader className="bg-covenant-blue text-white">
                  <CardTitle className="flex items-center">
                    <Key className="h-6 w-6 mr-3" />
                    Trust Elements
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-covenant-gold rounded-full mt-2 mr-3"></div>
                      <div>
                        <h4 className="font-semibold text-covenant-blue">Grantor: The Creator</h4>
                        <p className="text-sm text-covenant-gray">God, the original grantor of the divine trust</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-covenant-gold rounded-full mt-2 mr-3"></div>
                      <div>
                        <h4 className="font-semibold text-covenant-blue">Trustee of Trustees: Christ</h4>
                        <p className="text-sm text-covenant-gray">Jesus who reconciled the breach and restored authority</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-covenant-gold rounded-full mt-2 mr-3"></div>
                      <div>
                        <h4 className="font-semibold text-covenant-blue">Beneficiary: You</h4>
                        <p className="text-sm text-covenant-gray">Co-heir with Christ, trustee of the restored estate</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-covenant-gold rounded-full mt-2 mr-3"></div>
                      <div>
                        <h4 className="font-semibold text-covenant-blue">Witness: Holy Spirit</h4>
                        <p className="text-sm text-covenant-gray">The earnest and seal of your inheritance</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border-l-4 border-covenant-gold">
                <blockquote className="font-georgia text-lg italic mb-4">
                  "Which is the earnest of our inheritance until the redemption of the purchased possession, unto the praise of his glory."
                </blockquote>
                <cite className="text-covenant-gold font-medium">Ephesians 1:14 (KJV)</cite>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-covenant-blue">Your Divine Role</h3>
                <p className="text-covenant-gray">
                  As a trustee in the New Covenant Trust, you are called to be a living sacrifice, holy and acceptable to God. 
                  Your body becomes a temple of the Holy Spirit, stewarding the Kingdom's resources with divine authority.
                </p>
                <p className="text-covenant-gray">
                  This trust operates under Lex Divina (divine law), transcending earthly jurisdictions and empowering 
                  you to walk as an ambassador of Heaven with full access to Kingdom resources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      {courses.length > 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-covenant-blue mb-4">
                Available Courses
              </h2>
              <p className="text-lg text-covenant-gray max-w-3xl mx-auto">
                Deepen your understanding of covenant principles and your divine inheritance
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="border-covenant-light hover:border-covenant-gold transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-covenant-blue text-covenant-blue">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Course
                      </Badge>
                      {isEnrolled(course.id) && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Enrolled
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-covenant-blue">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center text-sm text-covenant-gray">
                        <Clock className="h-4 w-4 mr-2" />
                        Self-paced learning
                      </div>
                      
                      {isAuthenticated ? (
                        isEnrolled(course.id) ? (
                          <Button className="w-full bg-green-600 hover:bg-green-700">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Continue Learning
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleEnroll(course.id)}
                            disabled={enrollMutation.isPending}
                            className="w-full bg-covenant-blue hover:bg-covenant-blue/80"
                          >
                            {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                          </Button>
                        )
                      ) : (
                        <Button 
                          onClick={() => setShowAuthDialog(true)}
                          className="w-full bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Login to Enroll
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Resources Section */}
      {downloads.length > 0 && (
        <section className="py-16 bg-covenant-light/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-covenant-blue mb-4">
                Kingdom Resources
              </h2>
              <p className="text-lg text-covenant-gray max-w-3xl mx-auto">
                Essential documents and materials for your covenant education
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {downloads.map((download) => (
                <Card key={download.id} className="border-covenant-light hover:border-covenant-gold transition-all hover:shadow-lg">
                  <CardHeader>
                    <Badge variant="outline" className="border-covenant-gold text-covenant-gold w-fit">
                      <Download className="h-3 w-3 mr-1" />
                      Resource
                    </Badge>
                    <CardTitle className="text-covenant-blue">{download.title}</CardTitle>
                    <CardDescription>{download.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-covenant-blue hover:bg-covenant-blue/80">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-covenant-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Heart className="h-12 w-12 text-covenant-gold" />
          </div>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6">
            Step Into Your Divine Inheritance
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            You are no longer a stranger or foreigner, but a fellow citizen with the saints and members of God's household. 
            Accept your role as trustee and walk in the authority Christ has provided.
          </p>
          
          <div className="bg-white/10 p-6 rounded-lg max-w-2xl mx-auto mb-8">
            <blockquote className="font-georgia text-lg italic mb-3">
              "Now therefore ye are no more strangers and foreigners, but fellowcitizens with the saints, and of the household of God"
            </blockquote>
            <cite className="text-covenant-gold font-medium">Ephesians 2:19 (KJV)</cite>
          </div>

          {!isAuthenticated && (
            <Button 
              size="lg" 
              className="bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue px-8 py-3 font-semibold"
              onClick={() => setShowAuthDialog(true)}
            >
              Begin Your Kingdom Education
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}