import HeroSection from "@/components/ui/hero-section";
import ScriptureQuote from "@/components/ui/scripture-quote";
import FeatureCard from "@/components/ui/feature-card";
import { Crown, Unlink, Scroll } from "lucide-react";

export default function Home() {
  return (
    <div className="pt-16">
      <HeroSection
        title="Freedom Under the"
        subtitle="New Covenant"
        description="Reclaim your inheritance in the Body of Christ, outside Babylon's counterfeit system"
        primaryButton={{
          text: "🔑 Enter the Trust",
          href: "/about"
        }}
        secondaryButton={{
          text: "🎓 Kingdom College",
          href: "/courses"
        }}
      />

      {/* Key Features Section */}
      <div className="py-20 bg-covenant-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-covenant-blue mb-4">
              Your Path to Covenant Freedom
            </h2>
            <p className="text-xl text-covenant-gray max-w-3xl mx-auto">
              True freedom is found in regeneration through Christ's saving grace. The New Covenant Trust is a lawful expression of what happens when you are Born Again into Christ, discovering your divine identity as a co-heir and learning to operate in Kingdom authority.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Crown />}
              title="Kingdom Authority"
              description="Understand Christ as the cornerstone and grantor of the New Covenant Trust. Through regeneration in Him, you receive true spiritual authority as your birthright."
            />
            <FeatureCard
              icon={<Unlink />}
              title="Break the Chains"
              description="Expose and escape Babylon's counterfeit systems of personhood, contracts, and debt slavery."
            />
            <FeatureCard
              icon={<Scroll />}
              title="Covenant Identity"
              description="The trust simply recognizes what God has already done - you are Born Again into Christ and made a beneficiary of His eternal inheritance."
            />
          </div>
        </div>
      </div>

      <ScriptureQuote
        quote="If the Son therefore shall make you free, ye shall be free indeed."
        reference="John 8:36"
      />
    </div>
  );
}
