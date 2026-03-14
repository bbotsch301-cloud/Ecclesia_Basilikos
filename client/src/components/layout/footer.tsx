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
    <footer className="bg-royal-navy text-white py-16 border-t-2 border-royal-gold" role="contentinfo" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <Scroll className="text-royal-gold text-2xl mr-3" />
              <span className="font-cinzel font-bold text-xl">Ecclesia Basilikos</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Embassy of the everlasting Kingdom. Royal priesthood operating under divine covenant authority.
            </p>
          </div>

          <div>
            <h4 className="font-cinzel font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/lawful-money" className="text-gray-300 hover:text-royal-gold transition-colors">
                  Lawful Money Redemption
                </Link>
              </li>
              <li>
                <Link href="/trust-assets" className="text-gray-300 hover:text-royal-gold transition-colors">
                  Trust & Asset Protection
                </Link>
              </li>
              <li>
                <Link href="/state-passport" className="text-gray-300 hover:text-royal-gold transition-colors">
                  State-Citizen Passport
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-cinzel font-semibold text-lg mb-4">Community</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/forum" className="text-gray-300 hover:text-royal-gold transition-colors">
                  Forum
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-gray-300 hover:text-royal-gold transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-gray-300 hover:text-royal-gold transition-colors">
                  Videos
                </Link>
              </li>
              <li>
                <Link href="/downloads" className="text-gray-300 hover:text-royal-gold transition-colors">
                  Downloads
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-royal-gold transition-colors">
                  PMA Membership
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-cinzel font-semibold text-lg mb-4">Stay Connected</h4>
            <p className="text-gray-300 mb-4">Get updates on new teachings and resources</p>
            <form onSubmit={handleNewsletterSubmit} className="flex" aria-label="Newsletter subscription">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-r-none text-royal-navy"
                required
                aria-label="Email address for newsletter"
              />
              <Button
                type="submit"
                className="bg-royal-gold hover:bg-royal-gold-bright text-royal-navy rounded-l-none font-cinzel"
                disabled={newsletterMutation.isPending}
              >
                {newsletterMutation.isPending ? "..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-300">
              © {new Date().getFullYear()} Ecclesia Basilikos. Embassy of the Eternal Kingdom.
            </div>
            <nav className="flex items-center gap-4 text-sm" aria-label="Footer navigation">
              <Link href="/about" className="text-gray-300 hover:text-royal-gold transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-royal-gold transition-colors">
                Contact
              </Link>
              <Link href="/pma-agreement" className="text-gray-300 hover:text-royal-gold transition-colors">
                PMA Agreement
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-royal-gold transition-colors">
                Platform Guidelines
              </Link>
              <Link href="/privacy" className="text-gray-300 hover:text-royal-gold transition-colors">
                Privacy Policy
              </Link>
            </nav>
            <div className="text-center">
              <blockquote className="font-georgia italic text-royal-gold text-sm mb-1">
                "And in the days of these kings shall the God of heaven set up a kingdom, which shall never be destroyed"
              </blockquote>
              <cite className="text-gray-300 text-xs">Daniel 2:44</cite>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
