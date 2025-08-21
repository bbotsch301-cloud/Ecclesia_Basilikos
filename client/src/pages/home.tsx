import HeroSection from "@/components/ui/hero-section";
import ScriptureQuote from "@/components/ui/scripture-quote";
import FeatureCard from "@/components/ui/feature-card";
import { Crown, Unlink, Scroll } from "lucide-react";

export default function Home() {
  return (
    <div className="pt-16">
      <HeroSection
        title="Freedom Under the"
        subtitle="New Covenant Trust"
        description="Reclaim your inheritance in the Body of Christ, outside Babylon's counterfeit system"
        primaryButton={{
          text: "🔑 Enter the Trust",
          href: "/about"
        }}
        secondaryButton={{
          text: "🎓 Begin Learning",
          href: "/education"
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
              Discover the truth of your identity in Christ and step into the freedom He has provided
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Crown />}
              title="Kingdom Authority"
              description="Understand Christ as the cornerstone and grantor of the New Covenant Trust, establishing true spiritual authority."
            />
            <FeatureCard
              icon={<Unlink />}
              title="Break the Chains"
              description="Expose and escape Babylon's counterfeit systems of personhood, contracts, and debt slavery."
            />
            <FeatureCard
              icon={<Scroll />}
              title="Covenant Identity"
              description="Reclaim your true identity as a beneficiary of the New Covenant Trust in the Body of Christ."
            />
          </div>
        </div>
      </div>

      <ScriptureQuote
        quote="So if the Son sets you free, you will be free indeed."
        reference="John 8:36"
      />
    </div>
  );
}
