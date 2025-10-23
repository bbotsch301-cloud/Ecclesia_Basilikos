import RoyalHero from "@/components/ui/royal-hero";
import ScriptureBanner from "@/components/ui/scripture-banner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Crown, Scroll, Shield, Flame } from "lucide-react";

export default function Mandate() {
  return (
    <div className="pt-16">
      <RoyalHero
        title="The Mandate"
        subtitle="Our Divine Commission"
        description="Called out of Babylon to build the everlasting Kingdom that shall never be destroyed"
        primaryButton={{
          text: "Enter the Kingdom",
          href: "/courses"
        }}
        secondaryButton={{
          text: "View Repository",
          href: "/repository"
        }}
        scriptureVerse={{
          text: "Come out of her, my people, that ye be not partakers of her sins, and that ye receive not of her plagues",
          reference: "Revelation 18:4"
        }}
      />

      {/* The Call to Come Out */}
      <div className="py-20 marble-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Flame className="w-16 h-16 text-royal-burgundy mx-auto mb-6" data-testid="icon-flame" />
            <h2 className="font-cinzel-decorative text-4xl font-bold text-royal-navy mb-6" data-testid="text-call-heading">
              The Divine Call: Come Out of Her
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              God's urgent command echoes through the ages: separate from Babylon's counterfeit systems and become partakers of His everlasting Kingdom. This is not mere theological theory—it is the divine mandate for every believer who hears His voice.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="royal-card p-8">
              <h3 className="font-cinzel text-2xl font-bold text-royal-burgundy mb-4" data-testid="text-babylon-heading">
                What is Babylon?
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-royal-burgundy mr-2">•</span>
                  <span>The system of legal fictions, birth certificates, and ALL CAPS names that reduce living souls to state property</span>
                </li>
                <li className="flex items-start">
                  <span className="text-royal-burgundy mr-2">•</span>
                  <span>The endless cycle of debt, taxation, and interest payments that mirror the Levitical sacrificial system</span>
                </li>
                <li className="flex items-start">
                  <span className="text-royal-burgundy mr-2">•</span>
                  <span>The registry of man that assigns numbers, IDs, and marks of commerce to every soul from birth</span>
                </li>
                <li className="flex items-start">
                  <span className="text-royal-burgundy mr-2">•</span>
                  <span>The counterfeit priesthood of bankers, lawyers, and bureaucrats who demand perpetual sacrifice</span>
                </li>
                <li className="flex items-start">
                  <span className="text-royal-burgundy mr-2">•</span>
                  <span>The spiritual harlot whose merchants trade in "the souls of men" (Revelation 18:13)</span>
                </li>
              </ul>
            </div>

            <div className="royal-card p-8 bg-gradient-to-br from-royal-navy to-royal-burgundy text-white">
              <h3 className="font-cinzel text-2xl font-bold text-royal-gold mb-4" data-testid="text-kingdom-heading">
                What is the Kingdom?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-royal-gold mr-2">•</span>
                  <span>The everlasting Kingdom established by Daniel 2:44 that shall consume all earthly kingdoms</span>
                </li>
                <li className="flex items-start">
                  <span className="text-royal-gold mr-2">•</span>
                  <span>The New Covenant written on hearts, not stone; sealed by the Spirit, not by state registration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-royal-gold mr-2">•</span>
                  <span>The Melchizedek priesthood where Christ is eternal High Priest and believers are royal priests</span>
                </li>
                <li className="flex items-start">
                  <span className="text-royal-gold mr-2">•</span>
                  <span>The registry of heaven where names are written in the Lamb's Book of Life</span>
                </li>
                <li className="flex items-start">
                  <span className="text-royal-gold mr-2">•</span>
                  <span>The divine citizenship, incorruptible inheritance, and eternal covenant of God's ambassadors</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <ScriptureBanner
        quote="And in the days of these kings shall the God of heaven set up a kingdom, which shall never be destroyed: and the kingdom shall not be left to other people, but it shall break in pieces and consume all these kingdoms, and it shall stand for ever"
        reference="Daniel 2:44"
        theme="dark"
      />

      {/* The Daniel 2:44 Vision */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Crown className="w-16 h-16 text-royal-gold mx-auto mb-6" data-testid="icon-crown" />
            <h2 className="font-cinzel-decorative text-4xl font-bold text-royal-navy mb-6" data-testid="text-daniel-heading">
              The Stone Cut Without Hands
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8">
              Daniel 2:44 reveals God's ultimate plan: an everlasting Kingdom established by divine power—not by human hands, not by political revolution, not by earthly warfare. This Kingdom breaks in pieces every counterfeit system and stands forever.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="royal-card">
              <CardContent className="pt-8 text-center">
                <div className="mb-6 inline-block p-4 bg-royal-navy rounded-full">
                  <Scroll className="w-10 h-10 text-royal-gold" data-testid="icon-scroll-1" />
                </div>
                <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-3" data-testid="text-pillar-1">
                  Not Made By Hands
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  This Kingdom is established by God Himself—not through human legislation, contracts, or corporate structures. It cannot be registered, licensed, or taxed by Babylon.
                </p>
              </CardContent>
            </Card>

            <Card className="royal-card">
              <CardContent className="pt-8 text-center">
                <div className="mb-6 inline-block p-4 bg-royal-burgundy rounded-full">
                  <Shield className="w-10 h-10 text-royal-gold" data-testid="icon-shield" />
                </div>
                <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-3" data-testid="text-pillar-2">
                  Shall Never Be Destroyed
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  While every earthly kingdom rises and falls, God's Kingdom endures eternally. No government can dissolve it, no recession can bankrupt it, no beast system can mark it.
                </p>
              </CardContent>
            </Card>

            <Card className="royal-card">
              <CardContent className="pt-8 text-center">
                <div className="mb-6 inline-block p-4 bg-royal-purple rounded-full">
                  <Flame className="w-10 h-10 text-royal-gold" data-testid="icon-flame-2" />
                </div>
                <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-3" data-testid="text-pillar-3">
                  Shall Consume All Kingdoms
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  This Kingdom doesn't coexist with Babylon—it breaks in pieces and consumes every counterfeit system. Every false priesthood, every legal fiction, every mark of the beast.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Our Commission */}
      <div className="velvet-bg py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-cinzel-decorative text-4xl font-bold text-white mb-6" data-testid="text-commission-heading">
              Ecclesia Basilikos: Embassy of the Eternal Kingdom
            </h2>
            <p className="text-xl text-gray-200 leading-relaxed">
              We are the royal priesthood, the called-out assembly (ecclesia), operating under the authority of the King (basilikos). Our commission is threefold:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-royal-gold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-royal-navy font-cinzel-decorative text-2xl font-bold">1</span>
              </div>
              <h3 className="font-cinzel text-xl font-bold text-royal-gold mb-3" data-testid="text-mission-1">
                Proclaim the Truth
              </h3>
              <p className="text-gray-200">
                Expose Babylon's counterfeits and declare the reality of God's everlasting Kingdom through comprehensive teaching and biblical revelation.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-royal-gold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-royal-navy font-cinzel-decorative text-2xl font-bold">2</span>
              </div>
              <h3 className="font-cinzel text-xl font-bold text-royal-gold mb-3" data-testid="text-mission-2">
                Equip the Saints
              </h3>
              <p className="text-gray-200">
                Train believers to operate as royal priests, ambassadors, and trustees under divine covenant authority rather than Babylon's statutory control.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-royal-gold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-royal-navy font-cinzel-decorative text-2xl font-bold">3</span>
              </div>
              <h3 className="font-cinzel text-xl font-bold text-royal-gold mb-3" data-testid="text-mission-3">
                Build the Kingdom
              </h3>
              <p className="text-gray-200">
                Establish ecclesiastical communities, covenant relationships, and Kingdom infrastructure that manifest heaven's economy on earth.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/courses">
              <Button className="royal-button text-lg px-8 py-4" data-testid="button-answer-call">
                Answer the Call
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
