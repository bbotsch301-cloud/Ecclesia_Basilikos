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



          {/* Join the Covenant Community */}
          <div className="text-center bg-white p-12 rounded-2xl shadow-lg">
            <h3 className="font-playfair text-3xl font-bold text-covenant-blue mb-6">
              Join the Covenant Community
            </h3>
            <p className="text-lg text-covenant-gray max-w-4xl mx-auto leading-relaxed mb-8">
              The Kingdom of God operates as a nation without borders, transcending all earthly jurisdictions and political boundaries. Under ecclesiastical jurisdiction, God's people form a divine commonwealth where Christ reigns as King and we serve as His ambassadors. This spiritual nation exists wherever covenant believers gather, bound not by geography but by the blood covenant of Jesus Christ. As citizens of heaven, we operate under divine law and Kingdom principles that supersede all human institutions, forming an eternal nation that cannot be shaken by worldly powers or temporal governments.
            </p>
            <div className="bg-covenant-light p-6 rounded-lg max-w-3xl mx-auto">
              <blockquote className="font-georgia text-lg italic text-covenant-dark-gray mb-3">
                "But ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people; that ye should shew forth the praises of him who hath called you out of darkness into his marvellous light."
              </blockquote>
              <cite className="text-covenant-gold font-semibold">1 Peter 2:9</cite>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
