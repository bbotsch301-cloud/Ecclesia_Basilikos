import HeroSection from "@/components/ui/hero-section";
import { Badge } from "@/components/ui/badge";
import { Scale, UserX, Gavel, Eye, FileText, Download } from "lucide-react";

export default function Education() {
  const articles = [
    {
      icon: <Scale />,
      title: "What is a Trust?",
      description: "Understanding the fundamental principles of trust law and how the New Covenant operates as a divine trust.",
      category: "Foundation",
      type: "PDF Available"
    },
    {
      icon: <UserX />,
      title: "Legal Fiction vs Living Man",
      description: "Distinguishing between the artificial legal person and your true identity as a living soul created by God.",
      category: "Foundation",
      type: "Study Guide"
    },
    {
      icon: <Gavel />,
      title: "Freedom under Christ's Law",
      description: "Exploring the perfect law of liberty and how it supersedes man-made statutes and regulations.",
      category: "Advanced",
      type: "Advanced"
    },
    {
      icon: <Eye />,
      title: "Exposing Babylon's Counterfeit",
      description: "Revealing the deceptive systems of the world that keep God's people in spiritual and legal bondage.",
      category: "Essential",
      type: "Essential"
    }
  ];

  const resourceCategories = [
    {
      title: "Foundation Studies",
      resources: [
        "Introduction to Covenant Trust",
        "Biblical Foundations of Freedom",
        "Understanding Your Identity"
      ]
    },
    {
      title: "Advanced Topics",
      resources: [
        "Trust Law Fundamentals",
        "Spiritual Jurisdiction",
        "Babylon System Analysis"
      ]
    },
    {
      title: "Practical Guides",
      resources: [
        "Daily Covenant Living",
        "Freedom Declaration Template",
        "Study Group Leader's Guide"
      ]
    }
  ];

  return (
    <div className="pt-16">
      <HeroSection
        title="Educational Hub"
        description="Comprehensive resources to understand your covenant identity and freedom in Christ"
        backgroundImage="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
      />

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Articles */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
            {articles.map((article, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-covenant-gold text-3xl mb-4">
                  {article.icon}
                </div>
                <h3 className="font-playfair text-xl font-semibold text-covenant-blue mb-3">{article.title}</h3>
                <p className="text-covenant-gray mb-4 text-sm leading-relaxed">
                  {article.description}
                </p>
                <div className="flex items-center justify-between">
                  <button className="inline-flex items-center text-covenant-gold hover:text-yellow-600 font-semibold text-sm">
                    Read Article <FileText className="ml-2" size={16} />
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Badge variant="secondary" className="text-xs">
                    {article.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Resource Categories */}
          <div className="grid md:grid-cols-3 gap-8">
            {resourceCategories.map((category, index) => (
              <div key={index} className="bg-covenant-light p-8 rounded-xl">
                <h4 className="font-playfair text-2xl font-bold text-covenant-blue mb-4">{category.title}</h4>
                <ul className="space-y-3">
                  {category.resources.map((resource, resourceIndex) => (
                    <li key={resourceIndex} className="flex items-center">
                      <Download className="text-covenant-gold mr-3" size={16} />
                      <span className="text-covenant-gray">{resource}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
