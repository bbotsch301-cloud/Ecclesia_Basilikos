import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { insertUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Crown, Loader2, BookOpen, FileText, Shield, Users, Download, GraduationCap } from "lucide-react";
import { useEffect } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";

const registrationSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationData = z.infer<typeof registrationSchema>;

export default function Signup() {
  usePageTitle("Join");
  const { isAuthenticated, isLoading, register: registerUser, isRegistering } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/welcome");
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<RegistrationData>({
    mode: "onBlur",
    resolver: zodResolver(registrationSchema),
    defaultValues: { email: "", password: "", confirmPassword: "", firstName: "", lastName: "" },
  });

  const onSubmit = async (data: RegistrationData) => {
    try {
      const { confirmPassword, ...userData } = data;
      await registerUser(userData);
      (await import("@/lib/analytics")).trackEvent("Signup");
      toast({ title: "Welcome!", description: "Your account has been created successfully." });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 animate-spin text-royal-gold" />
      </div>
    );
  }

  if (isAuthenticated) return null;

  const benefits = [
    { icon: BookOpen, text: "Royal Academy courses" },
    { icon: FileText, text: "Educational resources & templates" },
    { icon: Shield, text: "Proof Vault document timestamping" },
    { icon: Users, text: "Embassy Forum community" },
    { icon: Download, text: "Exclusive downloads" },
    { icon: GraduationCap, text: "Track your learning progress" },
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-4rem)]">
        {/* Left — Value Proposition */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy p-12 xl:p-16 text-white">
          <Crown className="w-12 h-12 text-royal-gold mb-6" />
          <h2 className="font-cinzel-decorative text-3xl xl:text-4xl font-bold mb-4">
            Join the Covenant Path
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Step into your identity as a royal priest. Access the tools, education,
            and community to walk in covenant authority.
          </p>
          <ul className="space-y-4 mb-10">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-center gap-3">
                <b.icon className="w-5 h-5 text-royal-gold flex-shrink-0" />
                <span className="text-gray-200">{b.text}</span>
              </li>
            ))}
          </ul>
          <div className="bg-white/10 backdrop-blur-sm border border-royal-gold/30 rounded-lg p-5">
            <p className="font-georgia italic text-gray-200">
              "But ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people."
            </p>
            <p className="text-royal-gold mt-2 font-semibold text-sm">— 1 Peter 2:9</p>
          </div>
        </div>

        {/* Right — Registration Form */}
        <div className="flex items-center justify-center bg-gray-50 px-4 py-12">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center space-y-2 pb-2">
              <div className="flex justify-center lg:hidden">
                <Crown className="w-10 h-10 text-royal-gold" />
              </div>
              <h1 className="font-cinzel-decorative text-2xl font-bold text-royal-navy">
                Create Your Account
              </h1>
              <p className="text-gray-500 text-sm">Begin your covenant journey</p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
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
                      control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                  <Button
                    type="submit"
                    className="w-full bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold"
                    disabled={isRegistering}
                  >
                    {isRegistering ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account...</>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                  <p className="text-sm text-gray-600 text-center">
                    Already have an account?{" "}
                    <Link href="/login" className="text-royal-gold hover:underline font-medium">
                      Sign in
                    </Link>
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
