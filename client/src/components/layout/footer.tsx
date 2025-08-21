import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scroll } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const newsletterMutation = useMutation({
    mutationFn: (email: string) => apiRequest("POST", "/api/newsletter", { email }),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      setEmail("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      newsletterMutation.mutate(email);
    }
  };

  return (
    <footer className="bg-covenant-blue text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <Scroll className="text-covenant-gold text-2xl mr-3" />
              <span className="font-playfair font-bold text-xl">The New Covenant Trust</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Walking in the freedom that Christ has provided through His New Covenant Trust.
            </p>
          </div>

          <div>
            <h4 className="font-playfair font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-covenant-gold transition-colors">
                  About the Trust
                </Link>
              </li>
              <li>
                <Link href="/education" className="text-gray-300 hover:text-covenant-gold transition-colors">
                  Educational Hub
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-300 hover:text-covenant-gold transition-colors">
                  Freedom Resources
                </Link>
              </li>
              <li>
                <Link href="/nation" className="text-gray-300 hover:text-covenant-gold transition-colors">
                  Nation of Christ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-playfair font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-covenant-gold transition-colors">
                  Freedom Handbook
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-covenant-gold transition-colors">
                  Legal Templates
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-covenant-gold transition-colors">
                  Prayer Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-covenant-gold transition-colors">
                  Study Materials
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-playfair font-semibold text-lg mb-4">Stay Connected</h4>
            <p className="text-gray-300 mb-4">Get updates on new teachings and resources</p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-r-none text-covenant-dark-gray"
                required
              />
              <Button
                type="submit"
                className="bg-covenant-gold hover:bg-yellow-500 text-covenant-blue rounded-l-none"
                disabled={newsletterMutation.isPending}
              >
                {newsletterMutation.isPending ? "..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 mb-4 md:mb-0">
              © 2024 The New Covenant Trust. All rights reserved.
            </div>
            <div className="text-center">
              <blockquote className="font-georgia italic text-covenant-gold text-sm mb-1">
                "But in fact the ministry Jesus has received is as superior to theirs as the covenant of which he is mediator is superior to the old one, since the new covenant is established on better promises."
              </blockquote>
              <cite className="text-gray-300 text-xs">Hebrews 8:6</cite>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
