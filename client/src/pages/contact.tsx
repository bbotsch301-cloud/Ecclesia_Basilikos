import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import HeroSection from "@/components/ui/hero-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Send, Shield, ScrollText, Users, BookOpen, CheckCircle, Crown } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  usePageTitle("Contact");
  const { toast } = useToast();
  
  const form = useForm<ContactForm>({
    mode: "onBlur",
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const contactMutation = useMutation({
    mutationFn: (data: ContactForm) => apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error sending message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: ContactForm) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="pt-16">
      <HeroSection
        title="Contact & Stewardship"
        description="Real-world onboarding for trustees and ambassadors of the eternal Kingdom"
        backgroundImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
      />

      {/* Introduction */}
      <div className="py-20 marble-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Crown className="w-16 h-16 text-royal-burgundy mx-auto mb-6" data-testid="icon-crown" />
            <h2 className="font-cinzel-decorative text-4xl font-bold text-royal-navy mb-6">
              From Revelation to Reality
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Understanding your identity in Christ is the revelation. Expressing that identity through covenant trust structures is the journey. We're here to guide you every step of the way.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="royal-card">
              <CardContent className="pt-8 text-center">
                <div className="mb-6 inline-block p-4 bg-royal-navy rounded-full">
                  <BookOpen className="w-10 h-10 text-royal-gold" data-testid="icon-education" />
                </div>
                <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-3">
                  Education First
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Begin with comprehensive training in Kingdom principles, covenant truth, and trust structures through our Royal Academy.
                </p>
              </CardContent>
            </Card>

            <Card className="royal-card">
              <CardContent className="pt-8 text-center">
                <div className="mb-6 inline-block p-4 bg-royal-burgundy rounded-full">
                  <Users className="w-10 h-10 text-royal-gold" data-testid="icon-guidance" />
                </div>
                <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-3">
                  Personal Guidance
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Work one-on-one with experienced trustees who have walked this path and can guide your specific situation.
                </p>
              </CardContent>
            </Card>

            <Card className="royal-card">
              <CardContent className="pt-8 text-center">
                <div className="mb-6 inline-block p-4 bg-royal-purple rounded-full">
                  <Shield className="w-10 h-10 text-royal-gold" data-testid="icon-implementation" />
                </div>
                <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-3">
                  Practical Implementation
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Receive hands-on support as you establish trust structures and begin operating under divine authority.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Stewardship Services */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <ScrollText className="w-16 h-16 text-royal-gold mx-auto mb-6" data-testid="icon-scroll" />
            <h2 className="font-cinzel-decorative text-4xl font-bold text-royal-navy mb-6">
              Stewardship & Onboarding Services
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              We offer comprehensive support for those ready to express their identity in Christ through covenant trust structures.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <Card className="royal-card border-4 border-royal-gold">
              <CardContent className="p-8">
                <h3 className="font-cinzel text-2xl font-bold text-royal-navy mb-6">Trust Structure Guidance</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-royal-gold flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-royal-navy mb-1">Understanding Trust Roles</h4>
                      <p className="text-gray-700 text-sm">Learn how you function as trustee of what God has given you to steward, with Christ as ultimate Trustee and the Father as Grantor.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-royal-gold flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-royal-navy mb-1">Covenant Trust Documentation</h4>
                      <p className="text-gray-700 text-sm">Guidance on establishing covenant trust documents that recognize divine authority, not state jurisdiction.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-royal-gold flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-royal-navy mb-1">Property Transfer Strategy</h4>
                      <p className="text-gray-700 text-sm">How to move property from personal ownership (Babylon's jurisdiction) into covenant trust (Kingdom stewardship).</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-royal-gold flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-royal-navy mb-1">Succession Planning</h4>
                      <p className="text-gray-700 text-sm">Establish covenant succession that bypasses probate and passes inheritance directly to beneficiaries.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-royal-gold flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-royal-navy mb-1">Ecclesiastical Jurisdiction</h4>
                      <p className="text-gray-700 text-sm">Understanding how to operate under divine authority while fulfilling natural law obligations.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="royal-card border-4 border-royal-burgundy">
              <CardContent className="p-8">
                <h3 className="font-cinzel text-2xl font-bold text-royal-navy mb-6">Ambassadorial Support</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-royal-burgundy flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-royal-navy mb-1">Identity Declaration</h4>
                      <p className="text-gray-700 text-sm">Declaring your identity as a child of God, citizen of heaven, and ambassador of Christ in practical, legal contexts.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-royal-burgundy flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-royal-navy mb-1">Walking Outside the System</h4>
                      <p className="text-gray-700 text-sm">Practical guidance on operating as an ambassador under ecclesiastical jurisdiction, not territorial control.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-royal-burgundy flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-royal-navy mb-1">Navigating Challenges</h4>
                      <p className="text-gray-700 text-sm">Support when you face resistance from Babylon's systems as you walk in Kingdom authority.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-royal-burgundy flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-royal-navy mb-1">Community Connection</h4>
                      <p className="text-gray-700 text-sm">Access to the Embassy Forum—a private community of fellow trustees and ambassadors walking this path.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-royal-burgundy flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-royal-navy mb-1">Ongoing Mentorship</h4>
                      <p className="text-gray-700 text-sm">Continued guidance as you grow in your role as a trustee and ambassador of the eternal Kingdom.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-br from-royal-navy to-royal-burgundy p-8 rounded-xl text-white">
            <h3 className="font-cinzel text-2xl font-bold text-royal-gold mb-4 text-center">Important Note</h3>
            <p className="text-lg leading-relaxed text-center max-w-4xl mx-auto">
              We are not attorneys and do not provide legal advice. We are trustees and ambassadors teaching Kingdom principles and covenant truth. Our guidance focuses on spiritual identity and biblical covenant structures, not compliance with Babylon's legal systems. We encourage you to seek the Father's wisdom and leading as you walk this path.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-20 marble-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-cinzel-decorative text-3xl font-bold text-royal-navy mb-4">
              Ready to Begin This Journey?
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Contact us to discuss your specific situation and how we can support you in expressing your identity in Christ through covenant trust.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="font-cinzel text-2xl font-bold text-royal-navy mb-6">Send us a Message</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-royal-navy">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your name" 
                            {...field} 
                            className="border-gray-300 focus:ring-royal-gold focus:border-transparent"
                            data-testid="input-name"
                          />
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
                        <FormLabel className="text-sm font-semibold text-royal-navy">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="your@email.com" 
                            {...field} 
                            className="border-gray-300 focus:ring-royal-gold focus:border-transparent"
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-royal-navy">Subject</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-gray-300 focus:ring-royal-gold focus:border-transparent" data-testid="select-subject">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="lawful-money">Lawful Money Redemption</SelectItem>
                            <SelectItem value="trust-setup">Trust & Asset Protection</SelectItem>
                            <SelectItem value="state-passport">State-Citizen Passport</SelectItem>
                            <SelectItem value="property-transfer">Property Transfer Strategy</SelectItem>
                            <SelectItem value="mentorship">Ongoing Mentorship</SelectItem>
                            <SelectItem value="general">General Inquiry</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-royal-navy">Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={6} 
                            placeholder="Tell us about your situation and how we can help guide you..." 
                            {...field} 
                            className="border-gray-300 focus:ring-royal-gold focus:border-transparent"
                            data-testid="textarea-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full royal-button text-lg px-8 py-4"
                    disabled={contactMutation.isPending}
                    data-testid="button-submit"
                  >
                    <Send className="mr-2" size={20} />
                    {contactMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-royal-gold">
                <h4 className="font-cinzel text-xl font-bold text-royal-navy mb-4">Embassy Contact</h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="text-royal-gold text-xl mr-4" />
                    <span className="text-gray-700">KingdomVenturesTrust@gmail.com</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-4">
                    We typically respond within 24-48 hours. For urgent matters, please note that in your message subject.
                  </p>
                </div>
              </div>

              <div className="bg-royal-navy p-8 rounded-xl text-white">
                <h4 className="font-cinzel text-xl font-bold text-royal-gold mb-4">The Onboarding Process</h4>
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <span className="bg-royal-gold text-royal-navy rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">1</span>
                    <div>
                      <p className="font-semibold mb-1">Initial Consultation</p>
                      <p className="text-sm opacity-90">We discuss your current situation and understanding of Kingdom principles</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-royal-gold text-royal-navy rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">2</span>
                    <div>
                      <p className="font-semibold mb-1">Foundation Training</p>
                      <p className="text-sm opacity-90">Complete core courses in the Royal Academy to establish biblical foundation</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-royal-gold text-royal-navy rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">3</span>
                    <div>
                      <p className="font-semibold mb-1">Personalized Guidance</p>
                      <p className="text-sm opacity-90">Work with a mentor to apply Kingdom principles to your specific circumstances</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-royal-gold text-royal-navy rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">4</span>
                    <div>
                      <p className="font-semibold mb-1">Implementation Support</p>
                      <p className="text-sm opacity-90">Ongoing guidance as you establish trust structures and walk as an ambassador</p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h4 className="font-cinzel text-xl font-bold text-royal-navy mb-4">Before You Contact Us</h4>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We recommend starting with our foundational content:
                </p>
                <div className="space-y-2">
                  <a href="/lawful-money" className="block text-royal-burgundy hover:text-royal-gold transition-colors font-semibold">
                    → Pillar 1: Lawful Money Redemption
                  </a>
                  <a href="/trust-assets" className="block text-royal-burgundy hover:text-royal-gold transition-colors font-semibold">
                    → Pillar 2: Trust & Asset Protection
                  </a>
                  <a href="/state-passport" className="block text-royal-burgundy hover:text-royal-gold transition-colors font-semibold">
                    → Pillar 3: State-Citizen Passport
                  </a>
                  <a href="/learning-path" className="block text-royal-burgundy hover:text-royal-gold transition-colors font-semibold">
                    → View the Full Learning Path
                  </a>
                </div>
                <p className="text-gray-600 text-sm mt-4">
                  This will help you understand the foundation and come to our conversation with informed questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
