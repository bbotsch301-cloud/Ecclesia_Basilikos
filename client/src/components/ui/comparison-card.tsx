import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Scale, Book, Download } from "lucide-react";
import type { Comparison } from "@shared/comparisonData";

interface ComparisonCardProps {
  comparison: Comparison;
  featured?: boolean;
}

export default function ComparisonCard({ comparison, featured = false }: ComparisonCardProps) {
  const categoryIcons = {
    identity: Scale,
    priesthood: Book,
    government: Scale,
    economy: Scale,
    legal: Book
  };
  
  const Icon = categoryIcons[comparison.category];
  
  const categoryColors = {
    identity: 'bg-royal-burgundy text-white',
    priesthood: 'bg-royal-gold text-royal-navy',
    government: 'bg-royal-purple text-white',
    economy: 'bg-royal-navy text-white',
    legal: 'bg-royal-gold-dark text-white'
  };

  return (
    <Card className={`royal-card overflow-hidden h-full flex flex-col ${featured ? 'ring-2 ring-royal-gold' : ''}`} data-testid={`card-comparison-${comparison.id}`}>
      <CardHeader className="bg-gradient-to-br from-royal-navy to-royal-navy-light text-white pb-4">
        <div className="flex items-start justify-between mb-3">
          <Icon className="w-8 h-8 text-royal-gold" data-testid={`icon-category-${comparison.category}`} />
          {featured && (
            <Badge className="bg-royal-gold text-royal-navy font-cinzel font-semibold" data-testid="badge-featured">
              Featured
            </Badge>
          )}
        </div>
        <CardTitle className="font-cinzel text-2xl mb-2" data-testid="text-comparison-title">
          {comparison.title}
        </CardTitle>
        <CardDescription className="text-royal-gold font-cinzel-decorative text-sm tracking-wide" data-testid="text-comparison-subtitle">
          {comparison.subtitle}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 flex-1 flex flex-col">
        <Badge className={`${categoryColors[comparison.category]} mb-4 w-fit font-cinzel text-xs`} data-testid={`badge-category-${comparison.category}`}>
          {comparison.category.charAt(0).toUpperCase() + comparison.category.slice(1)}
        </Badge>
        
        <p className="text-gray-700 mb-4 leading-relaxed flex-1" data-testid="text-comparison-summary">
          {comparison.summary}
        </p>
        
        <div className="royal-divider my-4"></div>
        
        <div className="bg-parchment p-4 rounded-lg mb-4 border border-royal-gold/30">
          <p className="text-sm font-semibold text-royal-navy mb-2 font-cinzel">Key Revelation:</p>
          <p className="text-sm text-gray-700 leading-relaxed italic" data-testid="text-key-revelation">
            {comparison.keyRevelation}
          </p>
        </div>
        
        <div className="flex gap-2 mt-auto">
          <Link href={`/repository/${comparison.slug}`} className="flex-1">
            <Button className="w-full royal-button" data-testid={`button-view-${comparison.id}`}>
              View Full Teaching
            </Button>
          </Link>
          {comparison.pdfPath && (
            <Button 
              variant="outline" 
              size="icon" 
              className="border-royal-gold text-royal-navy hover:bg-royal-gold/10"
              data-testid={`button-download-${comparison.id}`}
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
