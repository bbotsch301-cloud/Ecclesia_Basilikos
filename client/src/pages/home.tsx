import HeroSection from "@/components/ui/hero-section";
import ScriptureQuote from "@/components/ui/scripture-quote";
import FeatureCard from "@/components/ui/feature-card";
import { Crown, Unlink, Scroll } from "lucide-react";

export default function Home() {
  return (
    <div className="pt-16">
      <HeroSection
        title="Come out of her,"
        subtitle="my people"
        description="Answer God's call to separate from Babylon and become partakers and builders of His everlasting Kingdom that shall never be destroyed"
        primaryButton={{
          text: "🔑 Enter the Trust",
          href: "/about"
        }}
        secondaryButton={{
          text: "⚡ Begin Building",
          href: "/courses"
        }}
        backgroundImage="https://images.unsplash.com/photo-1464822759844-d150baec0494?auto=format&fit=crop&w=1920&h=1080&q=80"
      />

      {/* Key Features Section */}
      <div className="py-20 bg-covenant-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-covenant-blue mb-4">
              Building the Everlasting Kingdom
            </h2>
            <p className="text-xl text-covenant-gray max-w-3xl mx-auto">
              "And in the days of these kings shall the God of heaven set up a kingdom, which shall never be destroyed: and the kingdom shall not be left to other people, but it shall break in pieces and consume all these kingdoms, and it shall stand for ever." (Daniel 2:44) You are called to be partakers and builders of this eternal Kingdom.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Crown />}
              title="Kingdom Builders"
              description="As partakers of the everlasting Kingdom, you are called to build and establish God's eternal dominion that shall consume all earthly kingdoms and stand forever."
            />
            <FeatureCard
              icon={<Unlink />}
              title="Come Out of Babylon"
              description="Heed the divine command to separate from Babylon's corrupt systems of commerce, government, and false worship that enslave God's people."
            />
            <FeatureCard
              icon={<Scroll />}
              title="Eternal Inheritance"
              description="Receive your portion in the Kingdom that shall never be destroyed, as co-heirs with Christ in His everlasting dominion over all creation."
            />
          </div>
        </div>
      </div>

      <ScriptureQuote
        quote="And I heard another voice from heaven, saying, Come out of her, my people, that ye be not partakers of her sins, and that ye receive not of her plagues."
        reference="Revelation 18:4"
      />
    </div>
  );
}
