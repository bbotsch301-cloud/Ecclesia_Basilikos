import HeroSection from "@/components/ui/hero-section";
import ScriptureQuote from "@/components/ui/scripture-quote";
import { Check, X } from "lucide-react";

export default function About() {
  return (
    <div className="pt-16">
      <HeroSection
        title="About the New Covenant Trust"
        description="Understanding Christ as Grantor and us as beneficiaries in the divine trust relationship"
        backgroundImage="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
      />

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Ancient scrolls representing covenant documents" 
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
            <div>
              <h2 className="font-playfair text-3xl font-bold text-covenant-blue mb-6">Christ as the Grantor</h2>
              <p className="text-lg text-covenant-gray leading-relaxed mb-6">
                The New Covenant Trust is established by Jesus Christ Himself as the Grantor, who has transferred all authority and blessing to His Body. Unlike Babylon's system of contracts and merchandise, this trust operates under divine law and spiritual authority.
              </p>
              <div className="bg-covenant-light p-6 rounded-lg">
                <blockquote className="font-georgia text-lg italic text-covenant-dark-gray mb-3">
                  "But now hath he obtained a more excellent ministry, by how much also he is the mediator of a better covenant, which was established upon better promises."
                </blockquote>
                <cite className="text-covenant-gold font-semibold">Hebrews 8:6</cite>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="lg:order-2">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Broken chains symbolizing freedom from bondage" 
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
            <div className="lg:order-1">
              <h2 className="font-playfair text-3xl font-bold text-covenant-blue mb-6">Contrast with Babylon's System</h2>
              <p className="text-lg text-covenant-gray leading-relaxed mb-6">
                Babylon operates through contracts, legal fictions, and the creation of artificial persons to bind mankind in debt slavery. The New Covenant Trust transcends these earthly systems, operating under the perfect law of liberty found in Christ.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <X className="text-red-500 mt-1 mr-3 flex-shrink-0" size={20} />
                  <span className="text-covenant-gray">Babylon: Legal fiction, artificial persons, debt slavery</span>
                </div>
                <div className="flex items-start">
                  <Check className="text-green-500 mt-1 mr-3 flex-shrink-0" size={20} />
                  <span className="text-covenant-gray">Covenant: Living souls, divine inheritance, spiritual freedom</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Scriptures */}
          <div className="bg-covenant-blue p-12 rounded-2xl text-center">
            <h3 className="font-playfair text-3xl font-bold text-white mb-8">Scriptural Foundation</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <blockquote className="font-georgia text-lg italic text-white mb-3">
                  "Stand fast therefore in the liberty wherewith Christ hath made us free, and be not entangled again with the yoke of bondage."
                </blockquote>
                <cite className="text-covenant-gold font-semibold">Galatians 5:1</cite>
              </div>
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <blockquote className="font-georgia text-lg italic text-white mb-3">
                  "If the Son therefore shall make you free, ye shall be free indeed."
                </blockquote>
                <cite className="text-covenant-gold font-semibold">John 8:36</cite>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
