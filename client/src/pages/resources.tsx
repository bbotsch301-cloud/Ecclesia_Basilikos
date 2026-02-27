import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/ui/hero-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { FileText, Download, LogIn, UserPlus, Star, BookOpen, Archive } from "lucide-react";
import DictionarySearch from "@/components/dictionary-search";
import type { Resource } from "@shared/schema";
import { usePageTitle } from "@/hooks/usePageTitle";

// Display order and metadata for each tier
const tierConfig: Record<string, { order: number; icon: typeof Star; subtitle: string; accent: string; cardBorder: string; cardBg: string }> = {
  "Essential Reading": {
    order: 1,
    icon: Star,
    subtitle: "Start here — foundational documents for understanding trusts, common law, and your lawful standing.",
    accent: "text-yellow-600",
    cardBorder: "border-yellow-200 hover:border-yellow-400",
    cardBg: "bg-yellow-50/50",
  },
  "Core Trust & Legal Resources": {
    order: 2,
    icon: BookOpen,
    subtitle: "Working documents — trust templates, banking law, legal identity, and administration guides.",
    accent: "text-covenant-gold",
    cardBorder: "border-gray-100 hover:border-covenant-gold/30",
    cardBg: "bg-white",
  },
  "Supplementary Reference": {
    order: 3,
    icon: Archive,
    subtitle: "Supporting material — dictionaries, historical legislation, and additional reference documents.",
    accent: "text-gray-500",
    cardBorder: "border-gray-100 hover:border-gray-300",
    cardBg: "bg-white",
  },
};

export default function Resources() {
  usePageTitle("Resources");
  const { user, isAuthenticated, isLoading } = useAuth();

  const { data: publishedResources = [], isLoading: resourcesLoading } = useQuery<Resource[]>({
    queryKey: ['/api/resources/published'],
    enabled: isAuthenticated,
  });

  // Group resources by category
  const resourcesByCategory: Record<string, Resource[]> = {};
  publishedResources.forEach((resource) => {
    if (!resourcesByCategory[resource.category]) {
      resourcesByCategory[resource.category] = [];
    }
    resourcesByCategory[resource.category].push(resource);
  });

  // Sort tiers by configured order
  const sortedTiers = Object.entries(resourcesByCategory).sort(([a], [b]) => {
    return (tierConfig[a]?.order ?? 99) - (tierConfig[b]?.order ?? 99);
  });

  return (
    <div className="pt-16">
      <HeroSection
        title="Additional Educational Resources"
        description="Search Black's Law Dictionary and access educational materials"
        backgroundImage="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
      />

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Public Dictionary Section */}
          <DictionarySearch />

          <div className="royal-divider my-16 relative" />

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-royal-gold mx-auto"></div>
            </div>
          ) : isAuthenticated ? (
            <>
              {/* Welcome Section for Authenticated Users */}
              <div className="text-center mb-16">
                <h2 className="font-playfair text-3xl font-bold text-covenant-blue mb-4">Your Educational Resources</h2>
                <p className="text-lg text-covenant-gray max-w-3xl mx-auto">
                  Access exclusive templates, guides, and educational materials to deepen your understanding.
                </p>
              </div>

              {resourcesLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-covenant-gold mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading resources...</p>
                </div>
              ) : sortedTiers.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Resources Coming Soon</h3>
                  <p className="text-gray-600">
                    We are preparing downloadable resources for members. Check back soon.
                  </p>
                </div>
              ) : (
                <div className="space-y-16 mb-16">
                  {sortedTiers.map(([category, resources]) => {
                    const config = tierConfig[category] || tierConfig["Supplementary Reference"];
                    const TierIcon = config.icon;

                    return (
                      <div key={category}>
                        {/* Tier header */}
                        <div className="mb-6">
                          <div className="flex items-center gap-3 mb-2">
                            <TierIcon className={`h-6 w-6 ${config.accent}`} />
                            <h3 className="font-playfair text-2xl font-bold text-covenant-blue">{category}</h3>
                            <Badge variant="outline" className="text-xs font-normal">{resources.length} documents</Badge>
                          </div>
                          <p className="text-sm text-gray-500 ml-9">{config.subtitle}</p>
                        </div>

                        {/* Resource cards */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {resources.map((resource) => (
                            <a
                              key={resource.id}
                              href={resource.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className={`block p-4 rounded-lg shadow-sm border hover:shadow-md transition-all ${config.cardBg} ${config.cardBorder}`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <span className="font-semibold text-covenant-blue text-sm leading-tight">{resource.title}</span>
                                <Badge className="flex-shrink-0 bg-red-100 text-red-800 text-xs">
                                  {resource.fileType.toUpperCase()}
                                </Badge>
                              </div>
                              {resource.description && (
                                <p className="text-xs text-gray-500 leading-relaxed mb-3">{resource.description}</p>
                              )}
                              <div className={`flex items-center text-xs font-medium ${config.accent}`}>
                                <Download className="mr-1.5 flex-shrink-0" size={12} />
                                Download PDF
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            /* Members Only CTA */
            <div className="text-center">
              <div className="max-w-md mx-auto">
                <div className="mb-8">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Members Only</h2>
                  <p className="text-gray-600">
                    Educational resources are exclusively available to members.
                    Sign in or create an account to access additional materials.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/login?redirect=/resources">
                    <Button size="lg" variant="outline" className="font-semibold px-8">
                      <LogIn className="h-5 w-5 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="lg" className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy px-8 font-semibold">
                      <UserPlus className="h-5 w-5 mr-2" />
                      Create Account
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
