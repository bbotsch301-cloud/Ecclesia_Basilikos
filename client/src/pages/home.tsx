import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Crown, Shield, ScrollText, CheckCircle, Book, 
  AlertCircle, Users, BookOpen, Heart, Compass,
  Key, Mountain, Star, Lightbulb
} from "lucide-react";
import customImage from "@assets/IMG_9062_1755824052661.jpeg";

export default function Home() {
  return (
    <div className="pt-16">
      {/* Opening - The Discovery */}
      <div className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy py-20 md:py-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-royal-gold/20 text-royal-gold border-2 border-royal-gold font-semibold px-6 py-2 text-lg backdrop-blur-sm" data-testid="badge-online">
            A Journey of Discovery
          </Badge>
          
          <h1 className="font-cinzel-decorative text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight" data-testid="text-hero-title">
            The Day Everything Changed
          </h1>
          
          <div className="bg-white/10 backdrop-blur-sm border border-royal-gold/30 rounded-lg p-8 mb-8">
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed italic">
              "I thought I understood how the world worked—until I discovered what a trust really means. Not the legal fiction they sell you, but the ancient covenant truth that's been hidden in plain sight for generations."
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            This is the story of how ordinary people like you and me uncovered a truth so profound, it changed everything about how we understand freedom, inheritance, and God's design for His people.
          </p>
        </div>
      </div>

      {/* Chapter 1: The Problem We All Shared */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Mountain className="w-16 h-16 text-royal-burgundy mx-auto mb-6" data-testid="icon-mountain" />
            <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6" data-testid="text-chapter-one">
              Chapter 1: The Mountain We Couldn't Climb
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              For years, we watched our parents work their entire lives, only to see the government take half their estate in probate. We saw families torn apart over inheritance disputes. We watched nursing homes drain life savings, leaving nothing for the next generation.
            </p>
            <p>
              We were told this was just "how it works." Lawyers said we needed expensive estate plans. Financial advisors pushed complex legal structures. Everyone had a different answer, and none of them felt right.
            </p>
            <p className="font-semibold text-royal-navy">
              Deep down, we knew there had to be another way. We just didn't know what it was yet.
            </p>
          </div>
        </div>
      </div>

      {/* The Confusion Section */}
      <div className="py-20 marble-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Compass className="w-16 h-16 text-royal-burgundy mx-auto mb-6" data-testid="icon-compass" />
            <h3 className="font-cinzel text-3xl font-bold text-royal-navy mb-4" data-testid="text-confusion-heading">
              We Tried Everything They Told Us
            </h3>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Every expert had a different solution. Every guru promised the answer. We chased them all.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { path: "Living Trusts", result: "Still under state jurisdiction" },
              { path: "Revocable Trusts", result: "Subject to probate anyway" },
              { path: "Expensive Attorneys", result: "Thousands spent, same results" },
              { path: "Standard Estate Plans", result: "Taxes still drained everything" },
              { path: "Asset Protection LLCs", result: "More paperwork, same bondage" },
              { path: "Tax Reduction Strategies", result: "Just moving deck chairs on the Titanic" }
            ].map((item, index) => (
              <Card key={index} className="bg-white border-l-4 border-royal-burgundy hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-gray-800 mb-2">We tried: {item.path}</p>
                      <p className="text-gray-600 italic">{item.result}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-xl text-gray-700 italic max-w-3xl mx-auto">
              Every door we knocked on led to the same place: state control, legal bondage, and generational theft disguised as "proper estate planning."
            </p>
          </div>
        </div>
      </div>

      {/* The Turning Point */}
      <div className="py-20 bg-gradient-to-r from-royal-burgundy via-royal-navy to-royal-burgundy">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Lightbulb className="w-20 h-20 text-royal-gold mx-auto mb-8" data-testid="icon-lightbulb" />
          <h2 className="font-cinzel-decorative text-3xl md:text-5xl font-bold text-white mb-8" data-testid="text-turning-point">
            Chapter 2: The Awakening
          </h2>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8 border border-royal-gold/30">
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              Then someone asked us a simple question that changed everything: 
              <span className="block mt-4 text-royal-gold font-semibold text-2xl md:text-3xl">
                "What if you've been looking at trusts through Babylon's lens instead of through covenant?"
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* The Discovery */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img 
                src={customImage}
                alt="Ancient covenant documents"
                className="rounded-xl shadow-xl w-full"
                data-testid="img-discovery"
              />
            </div>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <h3 className="font-cinzel text-3xl font-bold text-royal-navy mb-4">What We Found</h3>
              <p>
                We started studying. Not legal codes or statute books, but something far older: the biblical foundation of covenant relationships. And there it was, hidden in plain sight for centuries.
              </p>
              <p>
                Trust isn't a legal document filed with the state. Trust is a <span className="font-semibold text-royal-navy">covenant relationship</span> established by a Grantor, administered by a Trustee, for the benefit of Beneficiaries.
              </p>
              <p className="font-semibold text-royal-burgundy">
                Just like God established with Abraham. Just like Christ established with His Church.
              </p>
              <p>
                The legal system had taken this ancient, sacred structure and turned it into a counterfeit—a cage disguised as protection.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The Three Revelations */}
      <div className="py-20 marble-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Star className="w-16 h-16 text-royal-gold mx-auto mb-6" data-testid="icon-star" />
            <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6" data-testid="text-revelations">
              Three Revelations That Changed Everything
            </h2>
          </div>
          
          <div className="space-y-12">
            {[
              {
                number: 1,
                title: "Trust Is Covenant, Not Contract",
                story: "We learned that when God established covenant with Abraham, He was the Grantor. Abraham became the trustee of God's promises. And all who believe are beneficiaries of that trust. This isn't legal theory—it's the pattern of creation itself.",
                icon: ScrollText,
                color: "royal-gold"
              },
              {
                number: 2,
                title: "The State Can't Touch What It Didn't Create",
                story: "Babylon's system only has authority over what it creates: legal fictions, birth certificates, corporate entities. But a covenant trust established under divine law exists in a different jurisdiction entirely. It's like trying to enforce California law in heaven.",
                icon: Shield,
                color: "royal-navy"
              },
              {
                number: 3,
                title: "This Knowledge Was Always Meant To Be Shared",
                story: "We realized the wealthy families have known this for generations. They pass down massive estates through private trusts that never see probate court. But they kept it hidden, thinking it was their secret advantage. God is bringing this knowledge back to His people.",
                icon: Crown,
                color: "royal-burgundy"
              }
            ].map((revelation) => (
              <Card key={revelation.number} className="royal-card border-l-8" style={{ borderLeftColor: `var(--${revelation.color})` }}>
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="bg-gradient-to-br from-royal-navy to-royal-burgundy text-white rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-2xl font-bold">{revelation.number}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <revelation.icon className="w-10 h-10 text-royal-navy" data-testid={`icon-revelation-${revelation.number}`} />
                        <h3 className="font-cinzel text-2xl font-bold text-royal-navy" data-testid={`text-revelation-title-${revelation.number}`}>
                          {revelation.title}
                        </h3>
                      </div>
                      <p className="text-lg text-gray-700 leading-relaxed italic">
                        {revelation.story}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* The Transformation */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heart className="w-16 h-16 text-royal-burgundy mx-auto mb-6" data-testid="icon-heart" />
            <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6" data-testid="text-transformation">
              Chapter 3: How Our Lives Changed
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-12">
              Once we understood covenant trust, everything shifted. Not overnight, but steadily. Here's what began to happen:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                before: "Living in fear of probate stealing our inheritance",
                after: "Understanding our property belongs to the covenant, not the state"
              },
              {
                before: "Paying lawyers thousands for documents that didn't work",
                after: "Learning to operate as trustees of what God has given us"
              },
              {
                before: "Watching nursing homes drain everything our parents built",
                after: "Protecting family assets through proper covenant structure"
              },
              {
                before: "Feeling helpless against the legal system",
                after: "Walking in the authority of our true jurisdiction"
              },
              {
                before: "Worried about leaving nothing to our children",
                after: "Building generational wealth that flows through covenant"
              },
              {
                before: "Trapped in Babylon's endless taxation",
                after: "Understanding the difference between Caesar's things and God's things"
              }
            ].map((transformation, index) => (
              <Card key={index} className="bg-gradient-to-br from-gray-50 to-white border-2 border-royal-gold/20 hover:border-royal-gold transition-all">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-2">Before:</p>
                      <p className="text-gray-700">{transformation.before}</p>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-12 h-0.5 bg-royal-gold"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-royal-gold mb-2">After:</p>
                      <p className="text-royal-navy font-semibold">{transformation.after}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* A Voice from the Journey */}
      <div className="py-20 bg-gradient-to-br from-royal-navy to-royal-burgundy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white/10 backdrop-blur-lg border-2 border-royal-gold">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <Users className="w-16 h-16 text-royal-gold flex-shrink-0" data-testid="icon-voice" />
                <div>
                  <p className="text-xl text-white leading-relaxed mb-6 italic">
                    "I spent thirty years thinking I had to play by their rules. Lawyers, accountants, estate planners—they all said the same thing: 'This is just how it is.' But when I learned about covenant trust, I realized I'd been asking permission from Babylon to live in Kingdom freedom. Once I understood the jurisdiction I actually operate in, everything changed. My family's inheritance is secure now, not in their system, but in God's."
                  </p>
                  <p className="font-bold text-royal-gold text-lg">— A Fellow Traveler on This Journey</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* The Path Forward */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Book className="w-16 h-16 text-royal-navy mx-auto mb-6" data-testid="icon-book" />
            <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6" data-testid="text-path-forward">
              The Path We're Walking Now
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              This isn't a sales pitch. It's an invitation to walk a path that many are discovering. We're learning together, growing together, and helping each other understand what it means to operate in covenant rather than contract.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8 mb-12">
            <Card className="royal-card">
              <CardContent className="p-8">
                <h3 className="font-cinzel text-2xl font-bold text-royal-navy mb-4">If You're Curious...</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  We've gathered what we've learned into a comprehensive learning journey. Not because we have all the answers, but because we believe this knowledge was never meant to be hidden. It's structured in a way that anyone can understand, starting from the very basics and building step by step.
                </p>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-royal-gold flex-shrink-0 mt-1" />
                    <span>We start with what trust actually means in biblical terms</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-royal-gold flex-shrink-0 mt-1" />
                    <span>We explore the difference between covenant and contract</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-royal-gold flex-shrink-0 mt-1" />
                    <span>We learn how families have protected generational wealth for centuries</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-royal-gold flex-shrink-0 mt-1" />
                    <span>We understand the jurisdiction we actually operate in as God's people</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="royal-card">
              <CardContent className="p-8">
                <h3 className="font-cinzel text-2xl font-bold text-royal-navy mb-4">What Others Are Discovering</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  People from all walks of life are having the same "aha" moment we did. Teachers, nurses, business owners, retirees—ordinary folks who realized that the system they'd been taught was the only way wasn't actually the way at all. They're learning to think differently about inheritance, stewardship, and what it means to leave a legacy.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/courses">
              <Button 
                size="lg" 
                className="royal-button text-xl px-12 py-6 shadow-xl hover:scale-105 transition-transform"
                data-testid="button-explore-journey"
              >
                <BookOpen className="mr-2 h-6 w-6" />
                Explore This Journey
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* The Bigger Picture */}
      <div className="py-20 marble-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6" data-testid="text-bigger-picture">
              This Is About More Than Money
            </h2>
          </div>
          
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            <p>
              Yes, understanding covenant trust can protect your family's inheritance. Yes, it can shield you from probate theft. Yes, it can help you build generational wealth.
            </p>
            <p>
              But that's not really what this is about.
            </p>
            <p className="text-xl font-semibold text-royal-navy">
              This is about understanding who you really are and what jurisdiction you actually operate in.
            </p>
            <p>
              It's about recognizing that Babylon has counterfeit everything—including the very concept of trust and stewardship. And it's about learning to see through their fog and walk in the clarity of covenant truth.
            </p>
            <p>
              When you understand trust the way God designed it, you're not just protecting assets. You're reclaiming your identity as a steward of His Kingdom, operating under His authority, for His purposes.
            </p>
          </div>
        </div>
      </div>

      {/* The Invitation */}
      <div className="py-32 bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Key className="w-20 h-20 text-royal-gold mx-auto mb-8" data-testid="icon-key" />
          <h2 className="font-cinzel-decorative text-4xl md:text-5xl font-bold text-white mb-8" data-testid="text-invitation">
            Your Journey Begins Here
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto">
            We're not trying to convince you of anything. We're simply sharing what we've discovered and inviting you to explore it for yourself. If this resonates with you—if something in your spirit says "there's truth here"—then come walk this path with us.
          </p>
          
          <Link href="/courses">
            <Button 
              size="lg" 
              className="royal-button text-2xl px-16 py-8 shadow-2xl hover:scale-105 transition-transform mb-8"
              data-testid="button-begin-journey"
            >
              <BookOpen className="mr-3 h-8 w-8" />
              Begin Your Journey
            </Button>
          </Link>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center text-gray-300 text-lg">
            <Link href="/mandate" className="hover:text-royal-gold transition-colors" data-testid="link-mandate">
              Read Our Story
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/repository" className="hover:text-royal-gold transition-colors" data-testid="link-repository">
              Explore the Knowledge
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/contact" className="hover:text-royal-gold transition-colors" data-testid="link-contact">
              Connect With Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
