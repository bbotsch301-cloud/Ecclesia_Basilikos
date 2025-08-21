import { Button } from "@/components/ui/button";
import { Link } from "wouter";

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
  backgroundImage = "https://images.unsplash.com/photo-1475776408506-9a5371e7a068?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
}: HeroSectionProps) {
  return (
    <div className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 bg-covenant-blue">
        <div
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          className="absolute inset-0"
        />
        <div className="hero-overlay absolute inset-0" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {subtitle ? (
              <>
                {title}<br />
                <span className="text-covenant-gold">{subtitle}</span>
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
                  className="bg-covenant-gold hover:bg-yellow-500 text-covenant-blue px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all"
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
                  className="border-2 border-white text-white hover:bg-white hover:text-covenant-blue px-8 py-4 text-lg font-semibold transition-all"
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
