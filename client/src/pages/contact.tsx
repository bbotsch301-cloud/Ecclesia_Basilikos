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
        title="Contact Us"
        description="We're here to support you on your journey to covenant freedom"
        backgroundImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
      />

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    <span className="text-covenant-gray">info@newcovenanttrust.org</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="text-covenant-gold text-xl mr-4" />
                    <span className="text-covenant-gray">1-800-COVENANT</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="text-covenant-gold text-xl mr-4" />
                    <span className="text-covenant-gray">Monday - Friday, 9 AM - 6 PM EST</span>
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
