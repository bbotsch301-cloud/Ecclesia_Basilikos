import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LucideIcon } from "lucide-react";

export interface Pillar {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  buttonText: string;
}

interface PillarGridProps {
  pillars: Pillar[];
  columns?: 2 | 3 | 4;
}

export default function PillarGrid({ pillars, columns = 4 }: PillarGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-8`}>
      {pillars.map((pillar) => (
        <Card 
          key={pillar.id} 
          className="royal-card group hover:scale-105 transition-all duration-300"
          data-testid={`card-pillar-${pillar.id}`}
        >
          <CardContent className="pt-8 text-center">
            <div className="mb-6 inline-block p-4 bg-gradient-to-br from-royal-navy to-royal-burgundy rounded-full">
              <pillar.icon className="w-10 h-10 text-royal-gold" data-testid={`icon-pillar-${pillar.id}`} />
            </div>
            
            <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-3" data-testid={`text-pillar-title-${pillar.id}`}>
              {pillar.title}
            </h3>
            
            <p className="text-gray-700 mb-6 leading-relaxed" data-testid={`text-pillar-desc-${pillar.id}`}>
              {pillar.description}
            </p>
            
            <Link href={pillar.href}>
              <Button className="royal-button w-full" data-testid={`button-pillar-${pillar.id}`}>
                {pillar.buttonText}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
