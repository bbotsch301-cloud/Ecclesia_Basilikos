import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scale, Book, X } from "lucide-react";
import type { Comparison } from "@shared/comparisonData";

interface ComparisonCardProps {
  comparison: Comparison;
  featured?: boolean;
}

export default function ComparisonCard({ comparison, featured = false }: ComparisonCardProps) {
  const [isOpen, setIsOpen] = useState(false);

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
    <>
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
          
          <div className="mt-auto">
            <Button 
              onClick={() => setIsOpen(true)}
              className="w-full royal-button" 
              data-testid={`button-view-${comparison.id}`}
            >
              View Full Comparison
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <DialogHeader className="bg-gradient-to-br from-royal-navy to-royal-burgundy text-white p-6 border-b-2 border-royal-gold">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="font-cinzel-decorative text-3xl mb-2">
                  {comparison.title}
                </DialogTitle>
                <p className="text-royal-gold font-cinzel text-sm tracking-wide">
                  {comparison.subtitle}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/10"
                data-testid="button-close-modal"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-180px)]">
            <div className="p-6 space-y-6">
              {/* Key Revelation */}
              <div className="bg-parchment p-6 rounded-lg border-2 border-royal-gold/30">
                <h3 className="font-cinzel text-lg font-bold text-royal-navy mb-3">Key Revelation</h3>
                <p className="text-gray-700 leading-relaxed italic">
                  {comparison.keyRevelation}
                </p>
              </div>

              {/* Comparison Table */}
              <div>
                <h3 className="font-cinzel text-2xl font-bold text-royal-navy mb-4 text-center">
                  Babylon vs Kingdom
                </h3>
                <div className="space-y-4">
                  {comparison.comparisonTable.map((row, index) => (
                    <div key={index} className="royal-card p-4">
                      <h4 className="font-cinzel font-bold text-royal-burgundy mb-3 text-lg">
                        {row.dimension}
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                          <h5 className="font-cinzel font-semibold text-red-900 mb-2 flex items-center text-sm">
                            <X className="w-4 h-4 mr-2" />
                            Babylon's Counterfeit
                          </h5>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {row.babylon}
                          </p>
                        </div>
                        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                          <h5 className="font-cinzel font-semibold text-green-900 mb-2 flex items-center text-sm">
                            <span className="text-green-600 mr-2">✓</span>
                            Kingdom Reality
                          </h5>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {row.kingdom}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scripture References */}
              {comparison.scriptureReferences.length > 0 && (
                <div className="bg-gradient-to-br from-royal-navy to-royal-burgundy text-white p-6 rounded-lg">
                  <h3 className="font-cinzel text-lg font-bold text-royal-gold mb-3">
                    Key Scripture References
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {comparison.scriptureReferences.map((ref, index) => (
                      <Badge
                        key={index}
                        className="bg-royal-gold text-royal-navy font-cinzel"
                      >
                        {ref}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
