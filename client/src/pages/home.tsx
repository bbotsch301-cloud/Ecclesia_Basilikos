import RoyalHero from "@/components/ui/royal-hero";
import PillarGrid, { Pillar } from "@/components/ui/pillar-grid";
import ScriptureBanner from "@/components/ui/scripture-banner";
import ComparisonCard from "@/components/ui/comparison-card";
import { BookOpen, Crown, GraduationCap, Library, Users } from "lucide-react";
import { getFeaturedComparisons } from "@shared/comparisonData";

const pillars: Pillar[] = [
  {
    id: "mandate",
    title: "The Mandate",
    description: "Understand the divine call to come out of Babylon and build Christ's everlasting Kingdom that shall never be destroyed",
    icon: Crown,
    href: "/mandate",
    buttonText: "Read the Mandate"
  },
  {
    id: "nation",
    title: "Ecclesia Nation",
    description: "The Body of Christ as a real kingdom with heavenly law, divine authority, and eternal citizenship under royal priesthood",
    icon: Users,
    href: "/nation",
    buttonText: "Explore the Nation"
  },
  {
    id: "academy",
    title: "Royal Academy",
    description: "Comprehensive Kingdom education teaching the distinction between Babylon's counterfeits and heaven's realities",
    icon: GraduationCap,
    href: "/courses",
    buttonText: "Enter the Academy"
  },
  {
    id: "repository",
    title: "Covenant Repository",
    description: "Treasury of comparative teachings revealing the contrast between earthly systems and eternal covenant truth",
    icon: Library,
    href: "/repository",
    buttonText: "Access Repository"
  }
];

export default function Home() {
  const featuredComparisons = getFeaturedComparisons().slice(0, 3);

  return (
    <div className="pt-16">
      <RoyalHero
        title="Ecclesia Basilikos"
        subtitle="Embassy of the Eternal Kingdom"
        description="Come out of her, my people. Answer the divine call to separate from Babylon and become partakers of the everlasting Kingdom that shall consume all earthly kingdoms and stand forever"
        primaryButton={{
          text: "Discover the Mandate",
          href: "/mandate"
        }}
        secondaryButton={{
          text: "Enter the Academy",
          href: "/courses"
        }}
        scriptureVerse={{
          text: "Come out of her, my people, that ye be not partakers of her sins, and that ye receive not of her plagues",
          reference: "Revelation 18:4"
        }}
      />

      {/* Four Pillars Section */}
      <div className="py-20 marble-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-cinzel-decorative text-4xl md:text-5xl font-bold text-royal-navy mb-6" data-testid="text-pillars-heading">
              The Four Pillars of Embassy
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Ecclesia Basilikos operates as heaven's embassy on earth, established on four foundational pillars that equip believers to walk as royal priests, ambassadors, and co-heirs with Christ
            </p>
          </div>

          <PillarGrid pillars={pillars} columns={4} />
        </div>
      </div>

      <ScriptureBanner
        quote="And in the days of these kings shall the God of heaven set up a kingdom, which shall never be destroyed: and the kingdom shall not be left to other people, but it shall break in pieces and consume all these kingdoms, and it shall stand for ever"
        reference="Daniel 2:44"
        theme="dark"
      />

      {/* Featured Teachings Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <BookOpen className="w-16 h-16 text-royal-gold mx-auto mb-6" data-testid="icon-book" />
            <h2 className="font-cinzel-decorative text-4xl font-bold text-royal-navy mb-6" data-testid="text-teachings-heading">
              Featured Kingdom Teachings
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Foundational comparisons revealing the distinction between Babylon's counterfeit systems and the eternal realities of Christ's Kingdom
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredComparisons.map((comparison) => (
              <ComparisonCard key={comparison.id} comparison={comparison} featured />
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="/repository">
              <button className="royal-button text-lg px-8 py-4" data-testid="button-view-all">
                View Complete Repository
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="velvet-bg py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Crown className="w-16 h-16 text-royal-gold mx-auto mb-6" data-testid="icon-crown-cta" />
          <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-white mb-6" data-testid="text-cta-heading">
            You Are Called to Royal Priesthood
          </h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            As ambassadors of the everlasting Kingdom, you are no longer subjects of Babylon but co-heirs with Christ, operating under divine covenant authority. The time has come to walk in your true identity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/mandate">
              <button className="royal-button text-lg px-8 py-4" data-testid="button-read-mandate">
                Read the Full Mandate
              </button>
            </a>
            <a href="/courses">
              <button className="bg-transparent border-2 border-royal-gold text-white hover:bg-royal-gold/20 font-cinzel text-lg px-8 py-4 rounded-lg transition-all" data-testid="button-begin-training">
                Begin Your Training
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
