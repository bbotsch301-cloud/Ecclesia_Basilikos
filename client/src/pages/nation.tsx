import HeroSection from "@/components/ui/hero-section";
import ScriptureQuote from "@/components/ui/scripture-quote";
import { Button } from "@/components/ui/button";
import { Crown, Gavel, Users, MessageCircle, Calendar, Church, Handshake, GraduationCap } from "lucide-react";

export default function Nation() {
  const kingdomFeatures = [
    {
      icon: <Crown />,
      title: "Divine Citizenship",
      description: "Our primary allegiance is to Christ and His kingdom"
    },
    {
      icon: <Gavel />,
      title: "Higher Law",
      description: "We operate under God's perfect law of liberty"
    },
    {
      icon: <Users />,
      title: "Covenant Community",
      description: "United as one body with shared inheritance"
    }
  ];

  const communityStructure = [
    {
      icon: <Church />,
      title: "Local Assemblies",
      description: "Covenant communities gathering to study, worship, and support one another in walking out kingdom principles."
    },
    {
      icon: <Handshake />,
      title: "Mutual Support",
      description: "A network of believers committed to helping each other practically apply covenant principles in daily life."
    },
    {
      icon: <GraduationCap />,
      title: "Ongoing Education",
      description: "Continuous learning opportunities to deepen understanding of our covenant identity and freedom."
    }
  ];

  return (
    <div className="pt-16">
      <HeroSection
        title="Nation of Christ"
        description="Understanding the Body of Christ as a real nation and kingdom with divine authority"
        backgroundImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
      />

      <div className="py-20 bg-covenant-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Kingdom Vision */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="font-playfair text-4xl font-bold text-covenant-blue mb-6">
                A Kingdom Without Borders
              </h2>
              <p className="text-lg text-covenant-gray leading-relaxed mb-6">
                The Nation of Christ transcends all earthly boundaries and jurisdictions. As citizens of heaven, we operate under divine law and spiritual authority that supersedes all human governments and institutions.
              </p>
              <div className="space-y-4">
                {kingdomFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="text-covenant-gold mt-1 mr-4">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-covenant-blue mb-1">{feature.title}</h4>
                      <p className="text-covenant-gray">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Heavenly kingdom with golden light and divine authority" 
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
          </div>

          <ScriptureQuote
            quote="For our conversation is in heaven; from whence also we look for the Saviour, the Lord Jesus Christ."
            reference="Philippians 3:20"
            className="mb-16"
          />

          {/* Community Structure */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {communityStructure.map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="text-covenant-gold text-4xl mb-4">
                  {item.icon}
                </div>
                <h4 className="font-playfair text-xl font-bold text-covenant-blue mb-3">{item.title}</h4>
                <p className="text-covenant-gray leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Join the Community */}
          <div className="text-center bg-white p-12 rounded-2xl shadow-lg">
            <h3 className="font-playfair text-3xl font-bold text-covenant-blue mb-6">
              Join the Covenant Community
            </h3>
            <p className="text-lg text-covenant-gray max-w-3xl mx-auto leading-relaxed mb-8">
              Connect with like-minded believers who are walking in covenant freedom. Share experiences, ask questions, and grow together in understanding of our identity in Christ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-covenant-blue hover:bg-opacity-90 text-white px-8 py-4 text-lg font-semibold">
                <MessageCircle className="mr-2" size={20} />
                Join Discussion Forum
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-covenant-blue text-covenant-blue hover:bg-covenant-blue hover:text-white px-8 py-4 text-lg font-semibold"
              >
                <Calendar className="mr-2" size={20} />
                Find Local Group
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
