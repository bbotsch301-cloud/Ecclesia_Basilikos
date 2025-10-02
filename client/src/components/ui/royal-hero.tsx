import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Crown } from "lucide-react";

interface RoyalHeroProps {
  title: string;
  subtitle?: string;
  description: string;
  primaryButton?: {
    text: string;
    href: string;
  };
  secondaryButton?: {
    text: string;
    href: string;
  };
  scriptureVerse?: {
    text: string;
    reference: string;
  };
}

export default function RoyalHero({
  title,
  subtitle,
  description,
  primaryButton,
  secondaryButton,
  scriptureVerse
}: RoyalHeroProps) {
  return (
    <div className="relative min-h-screen flex items-center royal-hero-bg">
      <div className="relative z-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="crest-frame inline-block mb-8">
            <Crown className="w-16 h-16 text-royal-gold text-royal-glow mx-auto" data-testid="icon-crown" />
          </div>
          
          {subtitle && (
            <p className="font-cinzel-decorative text-royal-gold text-lg md:text-xl mb-4 tracking-widest uppercase" data-testid="text-subtitle">
              {subtitle}
            </p>
          )}
          
          <h1 className="font-cinzel-decorative text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-wide" data-testid="text-title">
            {title}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed font-light" data-testid="text-description">
            {description}
          </p>
          
          {scriptureVerse && (
            <div className="scripture-banner max-w-3xl mx-auto py-6 px-8 mb-12 rounded-lg">
              <blockquote className="font-georgia italic text-royal-gold text-lg mb-2" data-testid="text-scripture">
                "{scriptureVerse.text}"
              </blockquote>
              <cite className="text-gray-300 text-sm font-cinzel tracking-wide" data-testid="text-scripture-ref">
                — {scriptureVerse.reference}
              </cite>
            </div>
          )}
          
          {(primaryButton || secondaryButton) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {primaryButton && (
                <Link href={primaryButton.href}>
                  <Button
                    size="lg"
                    className="royal-button text-lg px-8 py-6"
                    data-testid="button-primary"
                  >
                    {primaryButton.text}
                  </Button>
                </Link>
              )}
              {secondaryButton && (
                <Link href={secondaryButton.href}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-6 bg-transparent border-2 border-royal-gold text-white hover:bg-royal-gold/20 font-cinzel"
                    data-testid="button-secondary"
                  >
                    {secondaryButton.text}
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
