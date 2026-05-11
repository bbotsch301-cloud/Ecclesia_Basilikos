import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import HeroSection from "@/components/ui/hero-section";
import ScriptureQuote from "@/components/ui/scripture-quote";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BookOpen, Crown, Heart, Shield, CheckCircle, ArrowRight, Play, Video, LogIn, UserPlus } from "lucide-react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, loginSchema } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/usePageTitle";

const registrationSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationData = z.infer<typeof registrationSchema>;

export default function NewCovenantIntro() {
  usePageTitle("New Covenant");
  const { user, isAuthenticated, login, register, isLoggingIn, isRegistering } = useAuth();
  const { toast } = useToast();
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  const markSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
    }
  };

  const progressPercentage = (completedSections.length / 6) * 100;

  const loginForm = useForm({
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm({
    mode: "onBlur",
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      privacyAccepted: undefined as unknown as true,
    },
  });

  const onLogin = async (data: z.infer<typeof loginSchema>) => {
    try {
      await login(data);
      setShowAuthDialog(false);
      toast({
        title: "Welcome back!",
        description: "You can now access all course materials.",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const onRegister = async (data: RegistrationData) => {
    try {
      const { confirmPassword, ...registerData } = data;
      await register(registerData);
      setShowAuthDialog(false);
      toast({
        title: "Account created!",
        description: "Welcome to Ecclesia Basilikos. You can now access all course materials.",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const lessonSections = [
    {
      id: "foundation",
      title: "The New Covenant as Trust Instrument",
      duration: "5 min",
      description: "Understanding the New Covenant itself as the pre-existing trust instrument authored by God (Jer 31:31-34, Heb 8:8-12)"
    },
    {
      id: "grantor",
      title: "You as Grantor: Acceptance as the Granting Act",
      duration: "8 min",
      description: "How your acceptance of the New Covenant — through faith, confession, and baptism — is the granting act that makes you the Grantor"
    },
    {
      id: "beneficiary",
      title: "Grantor and Beneficiary: Your Dual Role",
      duration: "7 min",
      description: "How the Grantor simultaneously becomes Beneficiary — heir of God and joint-heir with Christ (Rom 8:17)"
    },
    {
      id: "authority",
      title: "Spiritual Authority",
      duration: "6 min",
      description: "Operating in Kingdom authority as a co-heir with Christ"
    },
    {
      id: "freedom",
      title: "True Freedom in Christ",
      duration: "9 min",
      description: "How regeneration brings freedom from Babylon's systems"
    },
    {
      id: "living",
      title: "Living as Grantor-Beneficiary",
      duration: "10 min",
      description: "Practical application of your covenant identity as one who has granted all into the trust and receives all back as inheritance"
    }
  ];

  return (
    <div className="pt-16">
      <HeroSection
        title="Introduction to the New Covenant Trust"
        description="The New Covenant is the Trust Instrument. Your acceptance is the Granting Act. Discover your dual role as Grantor and Beneficiary."
        backgroundImage="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
      />

      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Course Overview */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <Badge className="bg-royal-gold text-royal-navy">Foundational Course</Badge>
                  <span className="text-sm text-gray-600">45 minutes total</span>
                </div>
                <h1 className="font-cinzel text-3xl font-bold text-royal-navy mb-4">
                  Introduction to the New Covenant Trust
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  This foundational teaching establishes the biblical framework for understanding the New Covenant as the pre-existing trust instrument authored by God. Christ, as Testator and Mediator, activated the testament through His death (Heb 9:16-17). But it is YOUR acceptance of that covenant — through faith, confession, and baptism — that constitutes the granting act, making you the Grantor who deposits the old man, body, and property into the trust. As Grantor, you simultaneously become Beneficiary: heir of God and joint-heir with Christ (Rom 8:17).
                </p>
              </div>

              {/* What You'll Learn */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-royal-gold" />
                    What You'll Learn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">The New Covenant as the pre-existing trust instrument authored by God</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Your acceptance (faith, confession, baptism) as the granting act</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Your dual role as Grantor AND Beneficiary — joint-heir with Christ</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Christ as Testator (Heb 9:16-17), Mediator (Heb 9:15), and High Priest (Heb 7:24-25)</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">The Holy Spirit as Executor, Seal, and Guarantor (Eph 1:13-14)</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Practical steps for living as a Grantor-Beneficiary in Kingdom authority</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Sidebar */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Course Progress</CardTitle>
                  <CardDescription>Track your learning journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Sections Completed</p>
                      <p className="text-2xl font-bold text-royal-navy">
                        {completedSections.length} / {lessonSections.length}
                      </p>
                    </div>

                    {isAuthenticated ? (
                      <Button
                        className="w-full bg-royal-gold hover:bg-royal-gold/80 text-royal-navy"
                        onClick={() => {
                          const nextSection = lessonSections.find((_s: any, i: number) => !completedSections.includes(String(i)));
                          const target = nextSection ? document.getElementById(`section-${lessonSections.indexOf(nextSection)}`) : null;
                          target?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Continue Learning
                      </Button>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-3">Sign in to track progress</p>
                        <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-royal-navy hover:bg-royal-navy/80 text-white">
                              <LogIn className="h-4 w-4 mr-2" />
                              Get Access
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>
                                {authMode === 'login' ? 'Sign In' : 'Create Account'}
                              </DialogTitle>
                              <DialogDescription>
                                {authMode === 'login' 
                                  ? 'Sign in to continue your covenant education'
                                  : 'Join Ecclesia Basilikos to understand your divine inheritance'
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
                                    <Button type="submit" className="w-full bg-royal-gold hover:bg-royal-gold/80 text-royal-navy" disabled={isLoggingIn}>
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
                                    <FormField
                                      control={registerForm.control}
                                      name="privacyAccepted"
                                      render={({ field }) => (
                                        <FormItem>
                                          <div className="border border-gray-200 rounded-lg p-3">
                                            <div className="flex items-start gap-3">
                                              <FormControl>
                                                <Checkbox
                                                  checked={field.value === true}
                                                  onCheckedChange={(checked) => field.onChange(checked === true ? true : undefined)}
                                                />
                                              </FormControl>
                                              <Label className="text-sm text-gray-700 leading-relaxed cursor-pointer font-normal" onClick={() => field.onChange(field.value === true ? undefined : true)}>
                                                I acknowledge the{" "}
                                                <Link href="/privacy" className="text-royal-gold hover:underline font-medium">
                                                  Privacy Policy
                                                </Link>{" "}
                                                and{" "}
                                                <Link href="/terms" className="text-royal-gold hover:underline font-medium">
                                                  Platform Guidelines
                                                </Link>
                                              </Label>
                                            </div>
                                            <FormMessage className="mt-2 ml-7" />
                                          </div>
                                        </FormItem>
                                      )}
                                    />
                                    <Button type="submit" className="w-full bg-royal-gold hover:bg-royal-gold/80 text-royal-navy" disabled={isRegistering}>
                                      {isRegistering ? "Creating account..." : "Create Account"}
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
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Course Sections */}
          <div className="space-y-6 mb-16">
            <h2 className="font-cinzel text-2xl font-bold text-royal-navy mb-8">Course Sections</h2>
            
            {lessonSections.map((section, index) => (
              <Card key={section.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Section Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            completedSections.includes(section.id) 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-50 text-royal-navy'
                          }`}>
                            {completedSections.includes(section.id) ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <span className="font-bold">{index + 1}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-royal-navy">{section.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {section.duration}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {section.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markSectionComplete(section.id)}
                          disabled={!isAuthenticated}
                          className="border-royal-navy text-royal-navy hover:bg-royal-navy hover:text-white"
                        >
                          {completedSections.includes(section.id) ? 'Completed' : 'Start'}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>

                    {/* Video Placeholder */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-50/50 rounded-lg p-8 border-2 border-dashed border-royal-gold/30">
                      <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 bg-royal-gold/20 rounded-full flex items-center justify-center">
                          <Video className="h-8 w-8 text-royal-gold" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-royal-navy mb-2">
                            Video: {section.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            In Preparation - {section.duration} teaching video
                          </p>
                          <Badge className="bg-royal-gold/10 text-royal-navy border-royal-gold">
                            Video Content Planned
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Key Scriptures Foundation */}
          <div className="mb-16">
            <h2 className="font-cinzel text-2xl font-bold text-royal-navy mb-8 text-center">
              Scriptural Foundation
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-gray-50">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-5 w-5 text-royal-gold" />
                    <CardTitle className="text-lg">Christ as Testator</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="font-georgia italic text-gray-700 mb-4 leading-relaxed">
                    "For where a testament is, there must also of necessity be the death of the testator. For a testament is of force after men are dead: otherwise it is of no strength at all while the testator liveth."
                  </blockquote>
                  <cite className="text-royal-gold font-semibold">Hebrews 9:16-17 (KJV)</cite>
                  <p className="text-sm text-gray-600 mt-3">
                    Christ is the Testator whose death activated the New Covenant testament, and the Mediator who administers it (Heb 9:15). He established the framework; your acceptance makes you the Grantor.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-50">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-5 w-5 text-royal-gold" />
                    <CardTitle className="text-lg">Acceptance as the Granting Act</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="font-georgia italic text-gray-700 mb-4 leading-relaxed">
                    "Know ye not, that so many of us as were baptized into Jesus Christ were baptized into his death? Therefore we are buried with him by baptism into death: that like as Christ was raised up from the dead by the glory of the Father, even so we also should walk in newness of life."
                  </blockquote>
                  <cite className="text-royal-gold font-semibold">Romans 6:3-4 (KJV)</cite>
                  <p className="text-sm text-gray-600 mt-3">
                    Your acceptance of the New Covenant — through faith, confession, and baptism — is the granting act. You deposit the old man into death and become the Grantor of your trust.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-50">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-royal-gold" />
                    <CardTitle className="text-lg">Your Inheritance as Grantor-Beneficiary</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="font-georgia italic text-gray-700 mb-4 leading-relaxed">
                    "And if children, then heirs; heirs of God, and joint-heirs with Christ: if so be that we suffer with him, that we may be also glorified together."
                  </blockquote>
                  <cite className="text-royal-gold font-semibold">Romans 8:17 (KJV)</cite>
                  <p className="text-sm text-gray-600 mt-3">
                    As Grantor, you deposited everything into the trust. As Beneficiary, you receive it all back — and more — as heir of God and joint-heir with Christ.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-50">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-royal-gold" />
                    <CardTitle className="text-lg">New Covenant Mediator</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="font-georgia italic text-gray-700 mb-4 leading-relaxed">
                    "And for this cause he is the mediator of the new testament, that by means of death, for the redemption of the transgressions that were under the first testament, they which are called might receive the promise of eternal inheritance."
                  </blockquote>
                  <cite className="text-royal-gold font-semibold">Hebrews 9:15 (KJV)</cite>
                  <p className="text-sm text-gray-600 mt-3">
                    Christ as Mediator stands between the trust instrument (the New Covenant) and those called to accept it, ensuring that each Grantor receives the promise of eternal inheritance.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-50">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-5 w-5 text-royal-gold" />
                    <CardTitle className="text-lg">The Grantor's New Identity</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="font-georgia italic text-gray-700 mb-4 leading-relaxed">
                    "Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new."
                  </blockquote>
                  <cite className="text-royal-gold font-semibold">2 Corinthians 5:17 (KJV)</cite>
                  <p className="text-sm text-gray-600 mt-3">
                    The granting act transforms you. The old man is deposited into death; you emerge as a new creature — a royal priest operating in Kingdom authority (1 Pet 2:9).
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-50">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-royal-gold" />
                    <CardTitle className="text-lg">The Holy Spirit as Executor</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="font-georgia italic text-gray-700 mb-4 leading-relaxed">
                    "In whom ye also trusted, after that ye heard the word of truth, the gospel of your salvation: in whom also after that ye believed, ye were sealed with that holy Spirit of promise, Which is the earnest of our inheritance until the redemption of the purchased possession, unto the praise of his glory."
                  </blockquote>
                  <cite className="text-royal-gold font-semibold">Ephesians 1:13-14 (KJV)</cite>
                  <p className="text-sm text-gray-600 mt-3">
                    The Holy Spirit executes the trust: sealing the Grantor-Beneficiary, guaranteeing the inheritance, and administering the promises of the New Covenant.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <ScriptureQuote
            quote="But now hath he obtained a more excellent ministry, by how much also he is the mediator of a better covenant, which was established upon better promises."
            reference="Hebrews 8:6 (KJV)"
          />
        </div>
      </div>
    </div>
  );
}