import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import HeroSection from "@/components/ui/hero-section";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FileText, Heart, BookOpen, Download, CheckSquare, Calculator, Search, Phone, LogIn, User } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters")
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function Resources() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: ""
    }
  });

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const onLogin = async (data: LoginForm) => {
    setIsLoggingIn(true);
    try {
      await apiRequest("POST", "/api/auth/login", data);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setShowAuthDialog(false);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const onRegister = async (data: RegisterForm) => {
    setIsRegistering(true);
    try {
      await apiRequest("POST", "/api/auth/register", data);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setShowAuthDialog(false);
      toast({
        title: "Welcome to Kingdom College!",
        description: "Your account has been created successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const resourceCategories = [
    {
      icon: <FileText className="text-4xl" />,
      title: "Legal Templates",
      resources: [
        "Freedom Declaration",
        "Covenant Identity Notice",
        "Trust Beneficiary Statement"
      ]
    },
    {
      icon: <Heart className="text-4xl" />,
      title: "Prayers & Declarations",
      resources: [
        "Daily Covenant Prayer",
        "Freedom Affirmations",
        "Scripture Declarations"
      ]
    },
    {
      icon: <BookOpen className="text-4xl" />,
      title: "Study Guides",
      resources: [
        "Trust Law Fundamentals",
        "Biblical Freedom Study",
        "Group Discussion Guide"
      ]
    }
  ];

  const quickTools = [
    { icon: <CheckSquare />, title: "Freedom Checklist" },
    { icon: <Calculator />, title: "Trust Calculator" },
    { icon: <Search />, title: "Law Reference" },
    { icon: <Phone />, title: "Support Line" }
  ];

  if (isLoading) {
    return (
      <div className="pt-16">
        <HeroSection
          title="Freedom Resources"
          description="Loading your covenant resources..."
          backgroundImage="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
        />
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-covenant-gold mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <HeroSection
        title="Freedom Resources"
        description={isAuthenticated 
          ? "Access your exclusive covenant freedom resources and tools"
          : "Members-only resources for walking in covenantal freedom"
        }
        backgroundImage="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
      />

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {isAuthenticated ? (
            <>
              {/* Welcome Section for Authenticated Users */}
              <div className="text-center mb-16">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2 bg-green-600/20 text-green-700 px-6 py-3 rounded-lg">
                    <User className="h-5 w-5" />
                    <span className="font-semibold">Welcome, {user?.firstName}!</span>
                  </div>
                  <Button 
                    onClick={handleLogout} 
                    variant="outline" 
                    className="border-covenant-blue text-covenant-blue hover:bg-covenant-blue hover:text-white"
                  >
                    Logout
                  </Button>
                </div>
                <h2 className="font-playfair text-3xl font-bold text-covenant-blue mb-4">Your Freedom Resources</h2>
                <p className="text-lg text-covenant-gray max-w-3xl mx-auto">
                  Access exclusive templates, guides, and tools to help you walk in complete covenant freedom.
                </p>
              </div>
              
              {/* Resource Categories */}
              <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {resourceCategories.map((category, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="text-covenant-gold mb-6 text-center">
                  {category.icon}
                </div>
                <h3 className="font-playfair text-2xl font-bold text-covenant-blue mb-4 text-center">{category.title}</h3>
                <div className="space-y-4">
                  {category.resources.map((resource, resourceIndex) => (
                    <div key={resourceIndex} className="flex items-center p-3 bg-covenant-light rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <Download className="text-covenant-gold mr-3" size={16} />
                      <span className="text-covenant-gray">{resource}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Featured Resource */}
          <div className="bg-covenant-blue p-12 rounded-2xl text-white mb-16">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-playfair text-3xl font-bold mb-4">
                  Complete Freedom Handbook
                </h3>
                <p className="text-lg leading-relaxed mb-6">
                  A comprehensive 150-page guide covering every aspect of covenant freedom, from basic principles to advanced applications. Includes templates, prayers, legal notices, and step-by-step instructions.
                </p>
                <Button className="bg-covenant-gold hover:bg-yellow-500 text-covenant-blue px-8 py-4 text-lg font-semibold">
                  <Download className="mr-2" size={20} />
                  Download Free eBook
                </Button>
              </div>
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600" 
                  alt="Freedom Handbook ebook cover" 
                  className="rounded-xl shadow-lg mx-auto max-w-xs"
                />
              </div>
            </div>
          </div>

              {/* Quick Access Tools */}
              <div className="bg-covenant-light p-8 rounded-xl">
                <h3 className="font-playfair text-2xl font-bold text-covenant-blue mb-6 text-center">Quick Access Tools</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickTools.map((tool, index) => (
                    <button key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all text-center group">
                      <div className="text-covenant-gold text-2xl mb-2 group-hover:scale-110 transition-transform">
                        {tool.icon}
                      </div>
                      <div className="font-semibold text-covenant-blue">{tool.title}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Authentication Required Section */
            <div className="text-center">
              <div className="max-w-md mx-auto">
                <div className="mb-8">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Members Only</h2>
                  <p className="text-gray-600">
                    Freedom Resources are exclusively available to Kingdom College members. 
                    Sign in or create an account to access your covenant freedom tools.
                  </p>
                </div>
                
                <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue px-8 py-3 font-semibold">
                      <LogIn className="h-5 w-5 mr-2" />
                      Access Resources
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {authMode === 'login' ? 'Member Login' : 'Create Member Account'}
                      </DialogTitle>
                      <DialogDescription>
                        {authMode === 'login' 
                          ? 'Sign in to access your freedom resources'
                          : 'Join Kingdom College to unlock exclusive covenant resources'
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
