import { useState } from "react";
import RoyalHero from "@/components/ui/royal-hero";
import ComparisonCard from "@/components/ui/comparison-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { comparisons, getFeaturedComparisons, getComparisonsByCategory } from "@shared/comparisonData";
import { Link } from "wouter";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useCtaHref } from "@/hooks/useCtaHref";

export default function Repository() {
  usePageTitle("Repository");
  const ctaHref = useCtaHref();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'identity' | 'priesthood' | 'government' | 'economy' | 'legal'>('all');
  
  const featuredComparisons = getFeaturedComparisons();
  
  const filteredComparisons = selectedCategory === 'all' 
    ? comparisons 
    : getComparisonsByCategory(selectedCategory);

  return (
    <div className="pt-16 marble-bg">
      <RoyalHero
        title="Covenant Repository"
        subtitle="The Treasury of Kingdom Truth"
        description="Comprehensive teachings on the distinction between Babylon's counterfeit systems and Christ's eternal Kingdom"
        scriptureVerse={{
          text: "Come out of her, my people, that ye be not partakers of her sins, and that ye receive not of her plagues",
          reference: "Revelation 18:4"
        }}
      />

      {/* Featured Comparisons Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-cinzel-decorative text-4xl font-bold text-royal-navy mb-4" data-testid="text-featured-heading">
              Featured Teachings
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Essential comparisons revealing the fundamental distinctions between Babylon and the Kingdom
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredComparisons.map((comparison) => (
              <ComparisonCard key={comparison.id} comparison={comparison} featured />
            ))}
          </div>
        </div>
      </div>

      {/* All Comparisons with Category Filter */}
      <div className="py-20 marble-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-cinzel-decorative text-4xl font-bold text-royal-navy mb-4" data-testid="text-all-comparisons-heading">
              Complete Compendium
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Explore all eleven foundational comparisons organized by theme
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setSelectedCategory(value as any)}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-12 bg-parchment border border-royal-gold/30">
              <TabsTrigger value="all" className="font-cinzel data-[state=active]:bg-royal-gold data-[state=active]:text-royal-navy" data-testid="tab-all">
                All
              </TabsTrigger>
              <TabsTrigger value="identity" className="font-cinzel data-[state=active]:bg-royal-gold data-[state=active]:text-royal-navy" data-testid="tab-identity">
                Identity
              </TabsTrigger>
              <TabsTrigger value="priesthood" className="font-cinzel data-[state=active]:bg-royal-gold data-[state=active]:text-royal-navy" data-testid="tab-priesthood">
                Priesthood
              </TabsTrigger>
              <TabsTrigger value="government" className="font-cinzel data-[state=active]:bg-royal-gold data-[state=active]:text-royal-navy" data-testid="tab-government">
                Government
              </TabsTrigger>
              <TabsTrigger value="economy" className="font-cinzel data-[state=active]:bg-royal-gold data-[state=active]:text-royal-navy" data-testid="tab-economy">
                Economy
              </TabsTrigger>
              <TabsTrigger value="legal" className="font-cinzel data-[state=active]:bg-royal-gold data-[state=active]:text-royal-navy" data-testid="tab-legal">
                Legal
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredComparisons.map((comparison) => (
                  <ComparisonCard key={comparison.id} comparison={comparison} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Call to Action */}
      <div className="velvet-bg py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-cinzel-decorative text-3xl font-bold text-white mb-6" data-testid="text-cta-heading">
            Ready to Begin Your Kingdom Education?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Enroll in the Royal Academy to receive structured teaching on these foundational truths
          </p>
          <Link href={ctaHref}>
            <button className="royal-button text-lg px-8 py-4" data-testid="button-enroll">
              Enter the Royal Academy
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
