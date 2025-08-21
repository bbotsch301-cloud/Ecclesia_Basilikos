import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import HeroSection from "@/components/ui/hero-section";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Download, FileText, Shield, CheckCircle, Mail } from "lucide-react";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters")
});

type EmailForm = z.infer<typeof emailSchema>;

export default function TrustDownload() {
  const { toast } = useToast();
  const [downloadGranted, setDownloadGranted] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  
  const form = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: ""
    }
  });

  const signupMutation = useMutation({
    mutationFn: (data: EmailForm) => apiRequest("POST", "/api/trust-download-signup", data),
    onSuccess: (response: any) => {
      toast({
        title: "Access Granted!",
        description: "You can now download the New Covenant Trust document.",
      });
      setDownloadGranted(true);
      setDownloadUrl(response.downloadUrl);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process signup. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: EmailForm) => {
    signupMutation.mutate(data);
  };

  const handleDownload = () => {
    // Track download event
    apiRequest("POST", "/api/track-download", { documentType: "trust-document" })
      .catch(console.error);
    
    // Trigger download
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="pt-16">
      <HeroSection
        title="New Covenant Trust Document"
        description="Access your comprehensive guide to covenant freedom and spiritual sovereignty"
        backgroundImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
      />

      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Document Information */}
            <div>
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <FileText className="text-covenant-gold text-3xl mr-4" />
                    <div>
                      <CardTitle className="font-playfair text-2xl text-covenant-blue">
                        The New Covenant Trust
                      </CardTitle>
                      <CardDescription className="text-lg">
                        Complete Biblical Foundation & Implementation Guide
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-covenant-blue mb-3">What's Included:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <CheckCircle className="text-green-500 mr-3" size={16} />
                          <span className="text-covenant-gray">Biblical foundations with KJV references</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="text-green-500 mr-3" size={16} />
                          <span className="text-covenant-gray">Trust structure and covenant principles</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="text-green-500 mr-3" size={16} />
                          <span className="text-covenant-gray">Practical implementation steps</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="text-green-500 mr-3" size={16} />
                          <span className="text-covenant-gray">Freedom from Babylon's systems</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="text-green-500 mr-3" size={16} />
                          <span className="text-covenant-gray">Prayer templates and declarations</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-covenant-light p-6 rounded-lg">
                      <blockquote className="font-georgia text-lg italic text-covenant-dark-gray mb-3">
                        "If the Son therefore shall make you free, ye shall be free indeed."
                      </blockquote>
                      <cite className="text-covenant-gold font-semibold">John 8:36</cite>
                    </div>

                    <div className="flex items-center text-sm text-covenant-gray">
                      <Shield className="text-covenant-gold mr-2" size={16} />
                      <span>Your information is secure and will never be shared</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Signup Form or Download */}
            <div>
              {!downloadGranted ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-playfair text-2xl text-covenant-blue flex items-center">
                      <Mail className="text-covenant-gold mr-3" />
                      Get Your Free Document
                    </CardTitle>
                    <CardDescription>
                      Enter your information to receive immediate access to the New Covenant Trust document
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your first name" {...field} />
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
                                <Input placeholder="Enter your last name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="Enter your email address" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          className="w-full bg-covenant-blue hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                          disabled={signupMutation.isPending}
                        >
                          {signupMutation.isPending ? "Processing..." : "Get Free Access"}
                        </Button>
                      </form>
                    </Form>

                    <div className="mt-6 text-center text-sm text-covenant-gray">
                      <p>By providing your email, you agree to receive occasional updates about covenant freedom resources. You can unsubscribe at any time.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="font-playfair text-2xl text-green-700 flex items-center">
                      <CheckCircle className="text-green-500 mr-3" />
                      Access Granted!
                    </CardTitle>
                    <CardDescription className="text-green-600">
                      Your New Covenant Trust document is ready for download
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-6">
                      <p className="text-green-700">
                        Thank you for your interest in covenant freedom. Your comprehensive trust document is now available.
                      </p>
                      
                      <Button 
                        onClick={handleDownload}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
                      >
                        <Download className="mr-2" size={20} />
                        Download Document (PDF)
                      </Button>

                      <div className="text-sm text-green-600">
                        <p>The document will open in a new tab. Save it to your device for future reference.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}