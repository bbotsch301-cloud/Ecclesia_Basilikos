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

export default function Courses() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showAuthDialog, setShowAuthDialog] = useState(false);

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

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-covenant-light via-white to-covenant-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-covenant-gold mx-auto mb-4"></div>
          <p className="text-covenant-gray">Loading Kingdom College...</p>
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
              Kingdom College
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
                      Access Kingdom College
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {authMode === 'login' ? 'Student Login' : 'Create Student Account'}
                      </DialogTitle>
                      <DialogDescription>
                        {authMode === 'login' 
                          ? 'Sign in to access your Kingdom College dashboard'
                          : 'Join Kingdom College to begin your trust education'
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
                              {isRegistering ? "Joining..." : "Join Kingdom College"}
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

      {/* Dashboard Content - Temporarily allow access without login */}
      {true && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-covenant-blue mb-4">
                Student Dashboard
              </h2>
              <p className="text-lg text-covenant-gray max-w-3xl mx-auto">
                Access your trust education resources and track your progress
              </p>
            </div>

            {/* Dashboard Sections */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Courses Section */}
              <Link href="/my-courses">
                <Card className="border-covenant-light hover:border-covenant-gold transition-all hover:shadow-lg cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <BookOpen className="h-8 w-8 text-covenant-blue mr-3" />
                      <CardTitle className="text-covenant-blue">My Courses</CardTitle>
                    </div>
                    <CardDescription>
                      Access your enrolled courses and track progress through trust administration curriculum
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-covenant-blue/10 text-covenant-blue">
                        4 Available Courses
                      </Badge>
                      <ChevronRight className="h-5 w-5 text-covenant-gray" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Downloads Section */}
              <Link href="/resources">
                <Card className="border-covenant-light hover:border-covenant-gold transition-all hover:shadow-lg cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <Download className="h-8 w-8 text-covenant-blue mr-3" />
                      <CardTitle className="text-covenant-blue">Downloads</CardTitle>
                    </div>
                    <CardDescription>
                      Access trust documents, forms, and educational resources for download
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-covenant-gold/10 text-covenant-blue">
                        Resource Library
                      </Badge>
                      <ChevronRight className="h-5 w-5 text-covenant-gray" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Progress Tracking */}
              <Card className="border-covenant-light hover:border-covenant-gold transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <TrendingUp className="h-8 w-8 text-covenant-blue mr-3" />
                    <CardTitle className="text-covenant-blue">Progress</CardTitle>
                  </div>
                  <CardDescription>
                    Track your advancement through the trust administration curriculum
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-covenant-gray">Overall Progress</span>
                      <span className="text-covenant-blue font-medium">25%</span>
                    </div>
                    <div className="w-full bg-covenant-light rounded-full h-2">
                      <div className="bg-covenant-gold h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Forum Access */}
              <Link href="/forum">
                <Card className="border-covenant-light hover:border-covenant-gold transition-all hover:shadow-lg cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <Users className="h-8 w-8 text-covenant-blue mr-3" />
                      <CardTitle className="text-covenant-blue">Community Forum</CardTitle>
                    </div>
                    <CardDescription>
                      Connect with fellow students and discuss trust administration topics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-green-100 text-green-800">
                        Active Community
                      </Badge>
                      <ChevronRight className="h-5 w-5 text-covenant-gray" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Profile Settings */}
              <Card className="border-covenant-light hover:border-covenant-gold transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <User className="h-8 w-8 text-covenant-blue mr-3" />
                    <CardTitle className="text-covenant-blue">Profile</CardTitle>
                  </div>
                  <CardDescription>
                    Manage your account settings and educational preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-covenant-light text-covenant-blue">
                      {user?.firstName || "Student"} {user?.lastName || "User"}
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-covenant-gray" />
                  </div>
                </CardContent>
              </Card>

              {/* Educational Hub Link */}
              <Link href="/education">
                <Card className="border-covenant-light hover:border-covenant-gold transition-all hover:shadow-lg cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <GraduationCap className="h-8 w-8 text-covenant-blue mr-3" />
                      <CardTitle className="text-covenant-blue">Educational Hub</CardTitle>
                    </div>
                    <CardDescription>
                      Browse covenant principles and kingdom teachings to enhance your understanding
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-covenant-gold/10 text-covenant-blue">
                        Browse Teachings
                      </Badge>
                      <ChevronRight className="h-5 w-5 text-covenant-gray" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}