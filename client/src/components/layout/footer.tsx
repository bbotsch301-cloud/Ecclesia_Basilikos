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
    <footer className="bg-royal-navy text-white py-16 border-t-2 border-royal-gold">
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
            <h4 className="font-playfair font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/mandate" className="text-gray-300 hover:text-royal-gold transition-colors">
                  The Mandate
                </Link>
              </li>
              <li>
                <Link href="/nation" className="text-gray-300 hover:text-royal-gold transition-colors">
                  Ecclesia Nation
                </Link>
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
                className="flex-1 rounded-r-none text-royal-navy"
                required
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
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 mb-4 md:mb-0">
              © {new Date().getFullYear()} Ecclesia Basilikos. Embassy of the Eternal Kingdom.
            </div>
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
