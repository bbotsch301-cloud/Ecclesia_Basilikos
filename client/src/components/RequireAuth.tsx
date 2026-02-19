import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { insertUserSchema, loginSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Lock, LogIn, Loader2 } from "lucide-react";

const registrationSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationData = z.infer<typeof registrationSchema>;

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, login, register: registerUser, isLoggingIn, isRegistering } = useAuth();
  const { toast } = useToast();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { email: "", password: "", confirmPassword: "", firstName: "", lastName: "" },
  });

  const onLogin = async (data: z.infer<typeof loginSchema>) => {
    try {
      await login(data);
      toast({ title: "Welcome back!", description: "You have successfully logged in." });
    } catch (error: any) {
      toast({ title: "Login Failed", description: error.message || "Invalid email or password", variant: "destructive" });
    }
  };

  const onRegister = async (data: RegistrationData) => {
    try {
      const { confirmPassword, ...userData } = data;
      await registerUser(userData);
      toast({ title: "Account Created", description: "Your account has been created successfully." });
    } catch (error: any) {
      toast({ title: "Registration Failed", description: error.message || "Failed to create account", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-royal-gold" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="pt-16">
        <div className="max-w-md mx-auto px-4 py-24">
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 text-royal-gold mx-auto mb-4" />
            <h2 className="font-cinzel text-2xl font-bold text-royal-navy dark:text-royal-gold mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please log in or create an account to access this feature.
            </p>
          </div>

          <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'login' | 'register')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-4">
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
                  <Button type="submit" className="w-full bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold" disabled={isLoggingIn}>
                    {isLoggingIn ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in...</>
                    ) : (
                      <><LogIn className="w-4 h-4 mr-2" />Sign In</>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-4">
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
                  <Button type="submit" className="w-full bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold" disabled={isRegistering}>
                    {isRegistering ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account...</>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
