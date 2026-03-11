import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Users, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import PremiumBadge from "@/components/PremiumBadge";
import { apiRequest } from "@/lib/queryClient";

const freeTierFeatures = [
  "Trust document downloads",
  "Trust pillar course access",
  "Forum reading & browsing",
  "Public educational resources",
  "Progress tracking",
  "Email notifications",
];

const premiumFeatures = [
  "Everything in Free, plus:",
  "All courses & lesson content",
  "All downloadable templates & guides",
  "Forum posting & community discussion",
  "Proof Vault document timestamping",
  "Comments on lessons & videos",
  "Priority community support",
];

export default function Pricing() {
  usePageTitle("Pricing", "Free and Premium plans for accessing courses, downloads, and community features.");
  const { isAuthenticated, isPremium } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: stripeStatus } = useQuery<{ enabled: boolean; priceId: string | null }>({
    queryKey: ["/api/stripe/status"],
    staleTime: 60_000,
  });

  const stripeEnabled = stripeStatus?.enabled ?? false;

  async function handleSubscribe() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiRequest("POST", "/api/stripe/create-checkout-session", {
        priceId: stripeStatus?.priceId || undefined,
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Failed to start checkout. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to start checkout. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Crown className="w-12 h-12 text-royal-gold mx-auto mb-4" />
          <h1 className="font-cinzel-decorative text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5">
            Choose Your Path
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Begin your journey with free Trust content, or elevate to Royal Beneficial Interest for complete access to all courses, templates, and community features.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-10 mb-20">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <Card className="border-2 border-gray-200 relative overflow-hidden">
            <CardContent className="p-8 md:p-10">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-gray-100 text-gray-700 border-gray-300 font-cinzel">
                  <Users className="w-3 h-3 mr-1" /> General Beneficiary
                </Badge>
                <h2 className="font-cinzel-decorative text-2xl font-bold text-royal-navy mb-2">Free</h2>
                <p className="text-4xl font-bold text-royal-navy">$0<span className="text-lg text-gray-400 font-normal">/forever</span></p>
                <p className="text-sm text-gray-500 mt-2">No credit card required</p>
              </div>
              <ul className="space-y-3 mb-8">
                {freeTierFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              {isAuthenticated && !isPremium ? (
                <Button variant="outline" className="w-full font-cinzel" disabled>
                  Current Plan
                </Button>
              ) : (
                <Link href="/signup">
                  <Button variant="outline" className="w-full font-cinzel font-bold">
                    Get Started Free
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Premium Tier */}
          <Card className="border-2 border-royal-gold relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-royal-gold via-yellow-400 to-royal-gold" />
            <CardContent className="p-8 md:p-10">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-royal-gold/10 text-royal-gold border-royal-gold font-cinzel">
                  <Crown className="w-3 h-3 mr-1" /> Royal Beneficiary
                </Badge>
                <h2 className="font-cinzel-decorative text-2xl font-bold text-royal-navy mb-2">Premium</h2>
                <p className="text-4xl font-bold text-royal-navy">$9.99<span className="text-lg text-gray-400 font-normal">/month</span></p>
                <p className="text-sm text-gray-500 mt-2">Cancel anytime</p>
              </div>
              <ul className="space-y-3 mb-8">
                {premiumFeatures.map((feature, i) => (
                  <li key={i} className={`flex items-start gap-3 text-sm ${i === 0 ? "text-royal-gold font-semibold font-cinzel" : "text-gray-700"}`}>
                    {i === 0 ? (
                      <Crown className="w-4 h-4 text-royal-gold flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-royal-gold flex-shrink-0 mt-0.5" />
                    )}
                    {feature}
                  </li>
                ))}
              </ul>
              {isPremium ? (
                <div className="space-y-2">
                  <Button className="w-full bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold" disabled>
                    <Crown className="w-4 h-4 mr-2" /> You're a Royal Beneficiary
                  </Button>
                  <Link href="/billing">
                    <Button variant="ghost" className="w-full text-sm text-gray-500">
                      Manage Stewardship
                    </Button>
                  </Link>
                </div>
              ) : stripeEnabled && isAuthenticated ? (
                <div className="space-y-2">
                  <Button
                    className="w-full bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold"
                    onClick={handleSubscribe}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                    ) : (
                      <><Crown className="w-4 h-4 mr-2" /> Elevate Interest</>
                    )}
                  </Button>
                  {error && (
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  )}
                </div>
              ) : stripeEnabled && !isAuthenticated ? (
                <Link href="/signup">
                  <Button className="w-full bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold">
                    Sign Up to Join
                  </Button>
                </Link>
              ) : (
                <Button className="w-full bg-royal-gold/50 text-royal-navy font-cinzel font-bold cursor-not-allowed" disabled>
                  Coming Soon
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="font-cinzel text-2xl font-bold text-royal-navy text-center mb-10">Common Questions</h2>
        <div className="space-y-6">
          {[
            {
              q: "What's included in the free plan?",
              a: "You get full access to Trust pillar content, including the Trust course, related downloads, and the ability to read all forum discussions. Progress tracking is also included.",
            },
            {
              q: "Can I cancel anytime?",
              a: "Yes. You can cancel at any time from your billing page. Your access continues until the end of your billing period.",
            },
            {
              q: "How does billing work?",
              a: "Subscriptions are billed monthly at $9.99/month through Stripe, a secure payment processor. You can manage your payment method and billing from the billing page.",
            },
            {
              q: "Will free content ever be locked?",
              a: "No. Trust content marked as free will remain free forever. We believe this foundational knowledge should be accessible to everyone.",
            },
          ].map((faq, i) => (
            <div key={i} className="p-5 rounded-xl bg-white border border-gray-200">
              <h4 className="font-cinzel font-bold text-sm text-royal-navy mb-2">{faq.q}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        {!isAuthenticated && (
          <div className="text-center mt-16">
            <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-3">Ready to Begin?</h3>
            <p className="text-gray-600 mb-6">Start with a free account and explore Trust content today.</p>
            <Link href="/signup">
              <Button size="lg" className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold px-10">
                Create Free Account <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
