import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/ui/hero-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { FileText, Download, LogIn, UserPlus } from "lucide-react";
import DictionarySearch from "@/components/dictionary-search";
import type { Resource } from "@shared/schema";

export default function Resources() {
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

  const getFileTypeBadgeColor = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'audio': return 'bg-purple-100 text-purple-800';
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'image': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="pt-16">
      <HeroSection
        title="Freedom Resources"
        description="Search Black's Law Dictionary and access covenant freedom tools"
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
                <h2 className="font-playfair text-3xl font-bold text-covenant-blue mb-4">Your Freedom Resources</h2>
                <p className="text-lg text-covenant-gray max-w-3xl mx-auto">
                  Access exclusive templates, guides, and tools to help you walk in complete covenant freedom.
                </p>
              </div>

              {resourcesLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-covenant-gold mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading resources...</p>
                </div>
              ) : Object.keys(resourcesByCategory).length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Resources Coming Soon</h3>
                  <p className="text-gray-600">
                    We are preparing downloadable resources for members. Check back soon.
                  </p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                  {Object.entries(resourcesByCategory).map(([category, resources]) => (
                    <div key={category} className="bg-white p-8 rounded-xl shadow-lg">
                      <div className="text-covenant-gold mb-6 text-center">
                        <FileText className="h-10 w-10 mx-auto" />
                      </div>
                      <h3 className="font-playfair text-2xl font-bold text-covenant-blue mb-4 text-center">{category}</h3>
                      <div className="space-y-4">
                        {resources.map((resource) => (
                          <a
                            key={resource.id}
                            href={resource.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-covenant-light rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Download className="text-covenant-gold mr-3 flex-shrink-0" size={16} />
                            <div className="flex-1 min-w-0">
                              <span className="text-covenant-gray text-sm">{resource.title}</span>
                            </div>
                            <Badge className={`ml-2 ${getFileTypeBadgeColor(resource.fileType)} text-xs`}>
                              {resource.fileType.toUpperCase()}
                            </Badge>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
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
                    Freedom Resources are exclusively available to members.
                    Sign in or create an account to access your covenant freedom tools.
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
