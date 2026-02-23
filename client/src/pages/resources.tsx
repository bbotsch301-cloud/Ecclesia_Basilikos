import { Link } from "wouter";
import HeroSection from "@/components/ui/hero-section";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { FileText, Heart, BookOpen, Download, CheckSquare, Calculator, Search, Phone, LogIn, UserPlus } from "lucide-react";
import DictionarySearch from "@/components/dictionary-search";

export default function Resources() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const resourceCategories = [
    {
      icon: <FileText className="text-4xl" />,
      title: "Legal Templates",
      resources: [
        "Freedom Declaration",
        "Covenant Identity Notice",
        "Trust Beneficiary Statement"
      ]
    },
    {
      icon: <Heart className="text-4xl" />,
      title: "Prayers & Declarations",
      resources: [
        "Daily Covenant Prayer",
        "Freedom Affirmations",
        "Scripture Declarations"
      ]
    },
    {
      icon: <BookOpen className="text-4xl" />,
      title: "Study Guides",
      resources: [
        "Trust Law Fundamentals",
        "Biblical Freedom Study",
        "Group Discussion Guide"
      ]
    }
  ];

  const quickTools = [
    { icon: <CheckSquare />, title: "Freedom Checklist" },
    { icon: <Calculator />, title: "Trust Calculator" },
    { icon: <Search />, title: "Law Reference" },
    { icon: <Phone />, title: "Support Line" }
  ];

  return (
    <div className="pt-16">
      <HeroSection
        title="Freedom Resources"
        description="Search Black's Law Dictionary and access covenant freedom tools"
        backgroundImage="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
      />

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Public Dictionary Section — visible to all visitors */}
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

              {/* Resource Categories */}
              <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {resourceCategories.map((category, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="text-covenant-gold mb-6 text-center">
                  {category.icon}
                </div>
                <h3 className="font-playfair text-2xl font-bold text-covenant-blue mb-4 text-center">{category.title}</h3>
                <div className="space-y-4">
                  {category.resources.map((resource, resourceIndex) => (
                    <div key={resourceIndex} className="flex items-center p-3 bg-covenant-light rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <Download className="text-covenant-gold mr-3" size={16} />
                      <span className="text-covenant-gray">{resource}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Featured Resource */}
          <div className="bg-covenant-blue p-12 rounded-2xl text-white mb-16">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-playfair text-3xl font-bold mb-4">
                  Complete Freedom Handbook
                </h3>
                <p className="text-lg leading-relaxed mb-6">
                  A comprehensive 150-page guide covering every aspect of covenant freedom, from basic principles to advanced applications. Includes templates, prayers, legal notices, and step-by-step instructions.
                </p>
                <Button className="bg-covenant-gold hover:bg-yellow-500 text-covenant-blue px-8 py-4 text-lg font-semibold">
                  <Download className="mr-2" size={20} />
                  Download Free eBook
                </Button>
              </div>
              <div className="text-center">
                <img
                  src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600"
                  alt="Freedom Handbook ebook cover"
                  className="rounded-xl shadow-lg mx-auto max-w-xs"
                />
              </div>
            </div>
          </div>

              {/* Quick Access Tools */}
              <div className="bg-covenant-light p-8 rounded-xl">
                <h3 className="font-playfair text-2xl font-bold text-covenant-blue mb-6 text-center">Quick Access Tools</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickTools.map((tool, index) => (
                    <button key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all text-center group">
                      <div className="text-covenant-gold text-2xl mb-2 group-hover:scale-110 transition-transform">
                        {tool.icon}
                      </div>
                      <div className="font-semibold text-covenant-blue">{tool.title}</div>
                    </button>
                  ))}
                </div>
              </div>
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
