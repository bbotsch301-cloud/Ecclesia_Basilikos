import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation, useSearch } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Crown, Loader2, LogIn } from "lucide-react";
import { useEffect } from "react";

export default function Login() {
  const { isAuthenticated, isLoading, login, isLoggingIn } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const redirectTo = params.get("redirect") || "/welcome";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      await login(data);
      toast({ title: "Welcome back!", description: "You have successfully logged in." });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2 pb-2">
          <div className="flex justify-center">
            <Crown className="w-10 h-10 text-royal-gold" />
          </div>
          <h1 className="font-cinzel-decorative text-2xl font-bold text-royal-navy">
            Ecclesia Basilikos
          </h1>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in...</>
                ) : (
                  <><LogIn className="w-4 h-4 mr-2" />Sign In</>
                )}
              </Button>
              <div className="text-center space-y-2">
                <Link href="/forgot-password" className="text-sm text-royal-gold hover:underline block">
                  Forgot your password?
                </Link>
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-royal-gold hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
