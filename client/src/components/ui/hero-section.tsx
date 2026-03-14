import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import mountainImage from "@assets/IMG_6832_1755822984953.png";

interface HeroSectionProps {
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
  backgroundImage?: string;
}

export default function HeroSection({
  title,
  subtitle,
  description,
  primaryButton,
  secondaryButton,
  backgroundImage = "https://picsum.photos/1920/1080?random=1"
}: HeroSectionProps) {
  return (
    <div className="relative min-h-screen flex items-center mountain-landscape">
      <div className="hero-overlay absolute inset-0 z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-cinzel-decorative text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {subtitle ? (
              <>
                {title}<br />
                <span className="text-royal-gold">{subtitle}</span>
              </>
            ) : (
              title
            )}
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>

          {(primaryButton || secondaryButton) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {primaryButton && (
                <Button
                  asChild
                  className="royal-button px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all"
                >
                  <Link href={primaryButton.href}>
                    {primaryButton.text}
                  </Link>
                </Button>
              )}
              {secondaryButton && (
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-royal-gold text-royal-gold hover:bg-royal-gold hover:text-royal-navy px-8 py-4 text-lg font-semibold transition-all shadow-lg"
                >
                  <Link href={secondaryButton.href}>
                    {secondaryButton.text}
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
