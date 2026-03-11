import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, CheckCircle, ArrowRight } from "lucide-react";

interface UpgradePromptProps {
  variant?: "inline" | "overlay";
  title?: string;
  description?: string;
}

const features = [
  "All courses and lessons",
  "All downloadable templates",
  "Forum posting and replies",
  "Proof Vault timestamping",
  "Priority community support",
];

export default function UpgradePrompt({
  variant = "inline",
  title = "Unlock Full Access",
  description = "Elevate to Royal Beneficial Interest to access all courses, downloads, forum posting, and more.",
}: UpgradePromptProps) {
  if (variant === "overlay") {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-2 border-royal-gold/30 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-royal-gold/10 flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-royal-gold" />
            </div>
            <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{description}</p>
            <ul className="space-y-2 text-left mb-6">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-royal-gold flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/pricing">
              <Button className="w-full bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold">
                <Crown className="w-4 h-4 mr-2" />
                View Plans
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="border-2 border-royal-gold/20 bg-gradient-to-r from-royal-gold/5 to-transparent">
      <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-royal-gold/10 flex items-center justify-center flex-shrink-0">
          <Crown className="w-6 h-6 text-royal-gold" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h4 className="font-cinzel font-bold text-royal-navy mb-1">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <Link href="/pricing">
          <Button className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold whitespace-nowrap">
            <Crown className="w-4 h-4 mr-2" />
            Elevate Interest
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
