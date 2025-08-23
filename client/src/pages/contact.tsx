import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import HeroSection from "@/components/ui/hero-section";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Phone, Clock, Send, Heart, BookOpen } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  
  const form = useForm<ContactForm>({
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
        title="About & Contact Kingdom Ventures Trust"
        description="The ministry called to administer The New Covenant Legacy Trust here on earth"
        backgroundImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
      />

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* About Kingdom Ventures Trust Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-3xl font-bold text-covenant-blue mb-4">
                Our Ministry Role
              </h2>
              <p className="text-lg text-covenant-gray max-w-3xl mx-auto">
                Understanding Kingdom Ventures Trust's calling to serve believers in The New Covenant Legacy Trust
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
              <div>
                <h3 className="font-playfair text-2xl font-bold text-covenant-blue mb-6">The Ministry Calling</h3>
                <p className="text-lg text-covenant-gray leading-relaxed mb-6">
                  Kingdom Ventures Trust is the ministry called to administer The New Covenant Legacy Trust here on earth. As Christ's appointed trustees, we help believers understand their divine inheritance and learn to operate as royal priests in God's kingdom economy.
                </p>
                <p className="text-lg text-covenant-gray leading-relaxed">
                  Our mission is to teach believers how The New Covenant Legacy Trust operates differently from Babylon's system of contracts and legal fictions, helping God's people understand their true identity as trustees and beneficiaries of Christ's inheritance.
                </p>
              </div>
              <div className="bg-covenant-blue p-8 rounded-xl text-white">
                <h4 className="font-playfair text-xl font-bold mb-6">Ministry Services</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-covenant-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h5 className="font-semibold mb-1">Trust Administration Education</h5>
                      <p className="text-sm opacity-90">Learn practical steps to establish and operate your trust</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-covenant-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h5 className="font-semibold mb-1">Biblical Mentorship</h5>
                      <p className="text-sm opacity-90">One-on-one guidance in covenant principles and trust operation</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-covenant-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h5 className="font-semibold mb-1">Course Instruction</h5>
                      <p className="text-sm opacity-90">Comprehensive training from basics to bank account opening</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-covenant-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <h5 className="font-semibold mb-1">Prayer Support</h5>
                      <p className="text-sm opacity-90">Spiritual covering as you walk in covenant freedom</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-covenant-light p-8 rounded-xl">
              <div className="text-center">
                <h4 className="font-playfair text-xl font-bold text-covenant-blue mb-4">Our Foundation</h4>
                <blockquote className="font-georgia text-lg italic text-covenant-dark-gray mb-3">
                  "But now hath he obtained a more excellent ministry, by how much also he is the mediator of a better covenant, which was established upon better promises."
                </blockquote>
                <cite className="text-covenant-gold font-semibold">Hebrews 8:6 (KJV)</cite>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl font-bold text-covenant-blue mb-4">
              Connect with Our Ministry
            </h2>
            <p className="text-lg text-covenant-gray max-w-3xl mx-auto">
              Ready to learn more about your divine inheritance and trust administration? We're here to guide you on this journey.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="font-playfair text-2xl font-bold text-covenant-blue mb-6">Send us a Message</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-covenant-dark-gray">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your name" 
                            {...field} 
                            className="border-gray-300 focus:ring-covenant-gold focus:border-transparent"
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
                        <FormLabel className="text-sm font-semibold text-covenant-dark-gray">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="your@email.com" 
                            {...field} 
                            className="border-gray-300 focus:ring-covenant-gold focus:border-transparent"
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
                        <FormLabel className="text-sm font-semibold text-covenant-dark-gray">Subject</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-gray-300 focus:ring-covenant-gold focus:border-transparent">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="mentorship">Mentorship Request</SelectItem>
                            <SelectItem value="study-group">Study Group</SelectItem>
                            <SelectItem value="resource">Resource Question</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
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
                        <FormLabel className="text-sm font-semibold text-covenant-dark-gray">Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={6} 
                            placeholder="How can we help you on your covenant journey?" 
                            {...field} 
                            className="border-gray-300 focus:ring-covenant-gold focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-covenant-blue hover:bg-opacity-90 text-white px-8 py-4 text-lg font-semibold"
                    disabled={contactMutation.isPending}
                  >
                    <Send className="mr-2" size={20} />
                    {contactMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-covenant-light p-8 rounded-xl">
                <h4 className="font-playfair text-xl font-bold text-covenant-blue mb-4">Get in Touch</h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="text-covenant-gold text-xl mr-4" />
                    <span className="text-covenant-gray">KingdomVenturesTrust@gmail.com</span>
                  </div>
                </div>
              </div>

              <div className="bg-covenant-blue p-8 rounded-xl text-white">
                <h4 className="font-playfair text-xl font-bold mb-4">Prayer Support</h4>
                <p className="leading-relaxed mb-4">
                  Our prayer team is available to stand with you in prayer as you walk in covenant freedom.
                </p>
                <Button className="bg-covenant-gold hover:bg-yellow-500 text-covenant-blue">
                  <Heart className="mr-2" size={16} />
                  Request Prayer
                </Button>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h4 className="font-playfair text-xl font-bold text-covenant-blue mb-4">Mentorship Program</h4>
                <p className="text-covenant-gray leading-relaxed mb-4">
                  Connect with experienced mentors who can guide you through your covenant freedom journey.
                </p>
                <Button className="bg-covenant-blue hover:bg-opacity-90 text-white">
                  <BookOpen className="mr-2" size={16} />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
