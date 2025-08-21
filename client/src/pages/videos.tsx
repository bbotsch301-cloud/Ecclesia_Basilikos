import HeroSection from "@/components/ui/hero-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock } from "lucide-react";

export default function Videos() {
  const categories = [
    { name: "All Videos", active: true },
    { name: "Covenant Basics", active: false },
    { name: "Law & Freedom", active: false },
    { name: "Babylon Exposed", active: false }
  ];

  const videos = [
    {
      title: "Trust Law Fundamentals",
      description: "Understanding the basic principles of trust law as they apply to the covenant relationship.",
      duration: "28 minutes",
      category: "Covenant",
      thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=338"
    },
    {
      title: "Breaking Free from Legal Fiction",
      description: "Discover how to distinguish between your true identity and the artificial legal person.",
      duration: "35 minutes",
      category: "Law & Freedom",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=338"
    },
    {
      title: "Exposing Babylon's Deception",
      description: "Unveiling the counterfeit systems that keep God's people in spiritual and legal bondage.",
      duration: "42 minutes",
      category: "Babylon Exposed",
      thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=338"
    },
    {
      title: "Your Covenant Identity",
      description: "Understanding who you are as a beneficiary of the New Covenant Trust in Christ.",
      duration: "31 minutes",
      category: "Covenant",
      thumbnail: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=338"
    },
    {
      title: "Practical Steps to Freedom",
      description: "Actionable guidance for walking in the freedom Christ has provided.",
      duration: "39 minutes",
      category: "Law & Freedom",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=338"
    },
    {
      title: "Spiritual Authority in Christ",
      description: "Understanding the authority you have been given as part of the Body of Christ.",
      duration: "33 minutes",
      category: "Covenant",
      thumbnail: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=338"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Covenant": return "bg-blue-100 text-blue-800";
      case "Law & Freedom": return "bg-green-100 text-green-800";
      case "Babylon Exposed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="pt-16">
      <HeroSection
        title="Videos & Teachings"
        description="In-depth video teachings to guide you on your journey to covenant freedom"
        backgroundImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
      />

      <div className="py-20 bg-covenant-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Video Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={category.active ? "default" : "outline"}
                className={category.active ? "bg-covenant-blue text-white" : "bg-white text-covenant-blue"}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Featured Video */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
            <div className="aspect-video bg-gray-200 relative">
              <img 
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675" 
                alt="Featured teaching video thumbnail" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button className="bg-covenant-gold hover:bg-yellow-500 text-covenant-blue rounded-full p-6 shadow-lg transform hover:scale-110 transition-all">
                  <Play size={32} />
                </Button>
              </div>
            </div>
            <div className="p-8">
              <h3 className="font-playfair text-2xl font-bold text-covenant-blue mb-4">
                Introduction to the New Covenant Trust
              </h3>
              <p className="text-covenant-gray leading-relaxed mb-4">
                A comprehensive overview of Christ as the Grantor of the New Covenant Trust and how you can step into your role as a beneficiary. This foundational teaching sets the stage for understanding your true identity and freedom in Christ.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-covenant-gray">
                  <Clock size={16} className="mr-2" />
                  Duration: 45 minutes
                </div>
                <Badge className="bg-covenant-light text-covenant-blue">Featured</Badge>
              </div>
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  <img 
                    src={video.thumbnail} 
                    alt={`${video.title} teaching video`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button className="bg-covenant-gold text-covenant-blue rounded-full p-4 shadow-lg">
                      <Play size={20} />
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-playfair text-lg font-semibold text-covenant-blue mb-2">{video.title}</h4>
                  <p className="text-covenant-gray text-sm mb-3">{video.description}</p>
                  <div className="flex justify-between items-center text-xs text-covenant-gray">
                    <div className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      {video.duration}
                    </div>
                    <Badge className={getCategoryColor(video.category)}>
                      {video.category}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
