import RoyalHero from "@/components/ui/royal-hero";
import ScriptureBanner from "@/components/ui/scripture-banner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Crown, Scale, Shield, Globe, Scroll, Book } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useCtaHref } from "@/hooks/useCtaHref";

export default function Nation() {
  usePageTitle("Ecclesia Nation");
  const ctaHref = useCtaHref();
  const citizenshipFeatures = [
    {
      icon: Crown,
      title: "Royal Priesthood",
      description: "A chosen generation, called out of darkness into marvelous light to serve as Christ's ambassadors"
    },
    {
      icon: Scale,
      title: "Divine Law",
      description: "Governed by covenant law written on hearts, not statutes imposed by men"
    },
    {
      icon: Shield,
      title: "Heavenly Jurisdiction",
      description: "Operating under ecclesiastical authority foreign to Babylon's territorial claims"
    },
    {
      icon: Globe,
      title: "Kingdom Without Borders",
      description: "A nation transcending all earthly boundaries, united by blood covenant not geography"
    }
  ];

  const babylonVsKingdomTimeline = [
    {
      stage: "Birth",
      babylon: "Birth certificate, ALL CAPS name, state registry, assigned SSN",
      kingdom: "Born again, sealed by the Spirit, name in Lamb's Book of Life"
    },
    {
      stage: "Identity",
      babylon: "Legal fiction, taxpayer, subject, consumer of the state",
      kingdom: "Living soul, priest, ambassador, co-heir with Christ"
    },
    {
      stage: "Governance",
      babylon: "Statutes, licenses, permits enforced by coercion and penalty",
      kingdom: "Covenant law on hearts, freedom in Christ, voluntary obedience"
    },
    {
      stage: "Economy",
      babylon: "Debt-based currency, perpetual taxation, endless sacrifice to Babylon",
      kingdom: "Incorruptible inheritance, Kingdom economy, Christ's finished work"
    },
    {
      stage: "Destiny",
      babylon: "Death certificate, probate, estate seized by the state",
      kingdom: "Resurrection, eternal life, glorification with Christ"
    }
  ];

  return (
    <div className="pt-16">
      <RoyalHero
        title="Ecclesia Nation"
        subtitle="The Royal Commonwealth"
        description="The Body of Christ is a real kingdom with heavenly law, divine authority, and eternal citizenship: a holy nation called out from Babylon"
        scriptureVerse={{
          text: "But ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people",
          reference: "1 Peter 2:9"
        }}
        primaryButton={{
          text: "Learn Kingdom Principles",
          href: ctaHref
        }}
        secondaryButton={{
          text: "Read the Mandate",
          href: "/mandate"
        }}
      />

      {/* Citizenship Features */}
      <div className="py-20 marble-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-cinzel-decorative text-4xl font-bold text-royal-navy mb-6" data-testid="text-citizenship-heading">
              Heavenly Citizenship & Divine Authority
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Ecclesia Nation operates as the earthly manifestation of heaven's eternal Kingdom. We are not mere religious adherents but ambassadors of a foreign jurisdiction, operating under divine covenant authority that supersedes all earthly claims.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {citizenshipFeatures.map((feature, index) => (
              <Card key={index} className="royal-card text-center">
                <CardContent className="pt-8">
                  <div className="mb-6 inline-block p-4 bg-gradient-to-br from-royal-navy to-royal-burgundy rounded-full">
                    <feature.icon className="w-10 h-10 text-royal-gold" data-testid={`icon-feature-${index}`} />
                  </div>
                  <h3 className="font-cinzel text-lg font-bold text-royal-navy mb-3" data-testid={`text-feature-title-${index}`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm" data-testid={`text-feature-desc-${index}`}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <ScriptureBanner
        quote="For our conversation [citizenship] is in heaven; from whence also we look for the Saviour, the Lord Jesus Christ"
        reference="Philippians 3:20"
        theme="dark"
      />

      {/* Kingdom Vision */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Book className="w-12 h-12 text-royal-gold mb-6" data-testid="icon-book" />
              <h2 className="font-cinzel-decorative text-4xl font-bold text-royal-navy mb-6" data-testid="text-kingdom-heading">
                A Kingdom Without Borders
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                The Nation of Christ transcends all earthly boundaries and jurisdictions. As citizens of heaven, we operate under divine law and spiritual authority that supersedes all human governments and institutions.
              </p>
              <div className="bg-parchment p-6 rounded-lg border-2 border-royal-gold/30 mb-6">
                <blockquote className="font-georgia text-lg italic text-royal-navy mb-3">
                  "And in the days of these kings shall the God of heaven set up a kingdom, which shall never be destroyed: and the kingdom shall not be left to other people, but it shall break in pieces and consume all these kingdoms, and it shall stand for ever."
                </blockquote>
                <cite className="text-royal-gold font-semibold font-cinzel">— Daniel 2:44</cite>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                This eternal Kingdom, established by the God of heaven, shall never be destroyed nor given to another people, but will consume all earthly kingdoms and stand forever. We are not building within Babylon; we are manifesting the Kingdom that consumes Babylon.
              </p>
            </div>
            <div className="bg-gradient-to-br from-royal-navy to-royal-burgundy p-8 rounded-xl text-white">
              <h3 className="font-cinzel text-2xl font-bold text-royal-gold mb-6" data-testid="text-nation-defined">
                What is Ecclesia Nation?
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-royal-gold mr-3 mt-1">◆</span>
                  <span>A <strong>holy nation</strong> called out from Babylon's corrupt systems</span>
                </li>
                <li className="flex items-start">
                  <span className="text-royal-gold mr-3 mt-1">◆</span>
                  <span>A <strong>royal priesthood</strong> operating under Melchizedek's eternal order</span>
                </li>
                <li className="flex items-start">
                  <span className="text-royal-gold mr-3 mt-1">◆</span>
                  <span>A <strong>peculiar people</strong> marked by the Spirit, not the state</span>
                </li>
                <li className="flex items-start">
                  <span className="text-royal-gold mr-3 mt-1">◆</span>
                  <span>An <strong>everlasting Kingdom</strong> that shall consume all earthly kingdoms</span>
                </li>
                <li className="flex items-start">
                  <span className="text-royal-gold mr-3 mt-1">◆</span>
                  <span>A <strong>divine embassy</strong> where heaven's law governs, not man's statutes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Babylon vs Kingdom Timeline */}
      <div className="py-20 marble-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Scroll className="w-12 h-12 text-royal-gold mx-auto mb-6" data-testid="icon-scroll" />
            <h2 className="font-cinzel-decorative text-4xl font-bold text-royal-navy mb-6" data-testid="text-timeline-heading">
              Two Paths: Babylon Registry vs Kingdom Citizenship
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              Every soul follows one of two trajectories from birth to eternity. See the stark contrast between Babylon's counterfeit and heaven's reality.
            </p>
          </div>

          <div className="space-y-6">
            {babylonVsKingdomTimeline.map((stage, index) => (
              <div key={index} className="royal-card p-6">
                <div className="flex items-center mb-4">
                  <Badge className="bg-royal-gold text-royal-navy font-cinzel font-bold text-lg px-4 py-1" data-testid={`badge-stage-${index}`}>
                    {stage.stage}
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                    <h4 className="font-cinzel font-bold text-red-900 mb-2 flex items-center" data-testid={`text-babylon-${index}`}>
                      <span className="text-red-600 mr-2">✗</span>
                      Babylon's Counterfeit
                    </h4>
                    <p className="text-gray-700 text-sm">{stage.babylon}</p>
                  </div>
                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                    <h4 className="font-cinzel font-bold text-green-900 mb-2 flex items-center" data-testid={`text-kingdom-${index}`}>
                      <span className="text-green-600 mr-2">✓</span>
                      Kingdom Reality
                    </h4>
                    <p className="text-gray-700 text-sm">{stage.kingdom}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-xl text-gray-700 mb-6 font-semibold">
              Which registry claims you? Which jurisdiction governs your life?
            </p>
            <Link href="/repository">
              <Button className="royal-button text-lg px-8 py-4" data-testid="button-learn-more">
                Explore the Full Comparisons
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="velvet-bg py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Crown className="w-16 h-16 text-royal-gold mx-auto mb-6" data-testid="icon-crown-cta" />
          <h2 className="font-cinzel-decorative text-3xl font-bold text-white mb-6" data-testid="text-cta-heading">
            You Are Citizens of Heaven
          </h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Your citizenship is not derived from birth certificates or state registration. You are born again, sealed by the Spirit, and your name is written in the Lamb's Book of Life. Walk in the authority of your heavenly citizenship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={ctaHref}>
              <Button className="royal-button text-lg px-8 py-4" data-testid="button-join">
                Begin Kingdom Training
              </Button>
            </Link>
            <Link href="/mandate">
              <Button className="bg-transparent border-2 border-royal-gold text-white hover:bg-royal-gold/20 font-cinzel text-lg px-8 py-4 rounded-lg transition-all" data-testid="button-mandate">
                Read the Full Mandate
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
