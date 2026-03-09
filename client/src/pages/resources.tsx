import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { FileText, Download, LogIn, UserPlus, Banknote, Shield, Globe, BookOpen, Loader2, ExternalLink } from "lucide-react";
import DictionarySearch from "@/components/dictionary-search";
import type { Resource } from "@shared/schema";
import { usePageTitle } from "@/hooks/usePageTitle";

const pillarConfig = [
  {
    category: "Lawful Money",
    icon: Banknote,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200 hover:border-yellow-400",
    subtitle: "Banking law, Federal Reserve Notes, 12 USC §411, and redemption procedures.",
    href: "/lawful-money",
  },
  {
    category: "Trust & Assets",
    icon: Shield,
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200 hover:border-red-400",
    subtitle: "Trust formation, asset protection structures, and administration guides.",
    href: "/trust-assets",
  },
  {
    category: "State Passport",
    icon: Globe,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200 hover:border-blue-400",
    subtitle: "State-citizen status, domicile declarations, passport applications, and supporting case law.",
    href: "/state-passport",
  },
];

export default function Resources() {
  usePageTitle("Resources");
  const { isAuthenticated, isLoading } = useAuth();

  const { data: publishedResources = [], isLoading: resourcesLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources/published"],
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

  // Separate pillar resources from others
  const pillarResources = pillarConfig
    .map((p) => ({ ...p, resources: resourcesByCategory[p.category] || [] }))
    .filter((p) => p.resources.length > 0);

  const otherCategories = Object.entries(resourcesByCategory)
    .filter(([cat]) => !pillarConfig.some((p) => p.category === cat))
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy py-16 md:py-24">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-royal-gold/20 text-royal-gold border-2 border-royal-gold font-semibold px-6 py-2 text-base backdrop-blur-sm">
            Reference Materials
          </Badge>
          <h1 className="font-cinzel-decorative text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Resources
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Educational materials, legal references, and Black's Law Dictionary — organized by pillar to support your foundation work.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Dictionary */}
        <DictionarySearch />

        <div className="border-t border-gray-200 dark:border-gray-700 my-12" />

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-royal-gold" />
          </div>
        ) : isAuthenticated ? (
          <>
            <div className="text-center mb-12">
              <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-royal-navy dark:text-royal-gold mb-3">
                Educational Resources
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                Access reference materials organized by each pillar of your foundation.
              </p>
            </div>

            {resourcesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-royal-gold" />
              </div>
            ) : publishedResources.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-2">Resources Coming Soon</h3>
                <p className="text-gray-500">We are preparing educational resources. Check back soon.</p>
              </div>
            ) : (
              <div className="space-y-12 mb-12">
                {/* Pillar-organized resources */}
                {pillarResources.map(({ category, icon: Icon, color, bgColor, borderColor, subtitle, href, resources }) => (
                  <div key={category}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-cinzel text-xl font-bold text-royal-navy dark:text-royal-gold">{category}</h3>
                          <Badge variant="outline" className="text-xs">{resources.length} docs</Badge>
                        </div>
                        <p className="text-sm text-gray-500">{subtitle}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {resources.map((resource) => (
                        <a
                          key={resource.id}
                          href={resource.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className={`block p-4 rounded-xl border-2 hover:shadow-md transition-all bg-white dark:bg-royal-navy-light ${borderColor}`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="font-cinzel font-semibold text-royal-navy dark:text-gray-200 text-sm leading-tight">
                              {resource.title}
                            </span>
                            <Badge className="flex-shrink-0 bg-red-100 text-red-800 text-xs">
                              {resource.fileType.toUpperCase()}
                            </Badge>
                          </div>
                          {resource.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                              {resource.description}
                            </p>
                          )}
                          <div className={`flex items-center text-xs font-medium ${color}`}>
                            <Download className="mr-1.5 flex-shrink-0" size={12} />
                            Download {resource.fileType.toUpperCase()}
                          </div>
                        </a>
                      ))}
                    </div>

                    <Link href={href}>
                      <Button variant="ghost" size="sm" className="mt-3 text-royal-gold font-cinzel text-xs">
                        Learn about this pillar <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                ))}

                {/* Other resources */}
                {otherCategories.map(([category, resources]) => (
                  <div key={category}>
                    <div className="flex items-center gap-3 mb-4">
                      <BookOpen className="w-5 h-5 text-gray-500" />
                      <h3 className="font-cinzel text-xl font-bold text-royal-navy dark:text-royal-gold">{category}</h3>
                      <Badge variant="outline" className="text-xs">{resources.length} docs</Badge>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {resources.map((resource) => (
                        <a
                          key={resource.id}
                          href={resource.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-royal-gold/50 hover:shadow-md transition-all bg-white dark:bg-royal-navy-light"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="font-cinzel font-semibold text-royal-navy dark:text-gray-200 text-sm leading-tight">
                              {resource.title}
                            </span>
                            <Badge className="flex-shrink-0 bg-red-100 text-red-800 text-xs">
                              {resource.fileType.toUpperCase()}
                            </Badge>
                          </div>
                          {resource.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                              {resource.description}
                            </p>
                          )}
                          <div className="flex items-center text-xs font-medium text-gray-500">
                            <Download className="mr-1.5 flex-shrink-0" size={12} />
                            Download {resource.fileType.toUpperCase()}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick links */}
            <Card className="bg-gradient-to-r from-royal-navy to-royal-burgundy border-0">
              <CardContent className="p-8 text-center">
                <h3 className="font-cinzel-decorative text-2xl font-bold text-white mb-3">
                  Need Practical Templates?
                </h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Visit Downloads for step-by-step templates and forms for each pillar.
                </p>
                <Link href="/downloads">
                  <Button size="lg" className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold px-8">
                    <Download className="w-5 h-5 mr-2" /> View Downloads
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Members Only CTA */
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="font-cinzel text-2xl font-bold text-royal-navy dark:text-royal-gold mb-2">Members Only</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Educational resources are exclusively available to members. Sign in or create an account to access materials.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/login?redirect=/resources">
                  <Button size="lg" variant="outline" className="font-cinzel px-8">
                    <LogIn className="h-5 w-5 mr-2" /> Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold px-8">
                    <UserPlus className="h-5 w-5 mr-2" /> Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
