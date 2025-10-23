import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Crown, Shield, ScrollText, CheckCircle, Book, 
  Heart, Users, BookOpen, Star, Cross,
  Key, Mountain, Lightbulb, Home as HomeIcon
} from "lucide-react";
import customImage from "@assets/IMG_9062_1755824052661.jpeg";

export default function Home() {
  return (
    <div className="pt-16">
      {/* Opening - The Identity Crisis */}
      <div className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy py-20 md:py-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-royal-gold/20 text-royal-gold border-2 border-royal-gold font-semibold px-6 py-2 text-lg backdrop-blur-sm" data-testid="badge-online">
            A Journey Home
          </Badge>
          
          <h1 className="font-cinzel-decorative text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight" data-testid="text-hero-title">
            The Day I Discovered<br />Who I Really Am
          </h1>
          
          <div className="bg-white/10 backdrop-blur-sm border border-royal-gold/30 rounded-lg p-8 mb-8">
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed italic">
              "For years, I lived as a stranger in my own life—carrying someone else's name, someone else's identity, answering to someone else's authority. Then I discovered I was never meant to be a subject of Babylon. I was born to be a child of God, a citizen of heaven, an ambassador of Christ."
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            This is the story of how God revealed our true identity—and how the ancient structure of covenant trust became the way we express that reality on earth.
          </p>
        </div>
      </div>

      {/* Chapter 1: Lost Identity */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Mountain className="w-16 h-16 text-royal-burgundy mx-auto mb-6" data-testid="icon-mountain" />
            <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6" data-testid="text-chapter-one">
              Chapter 1: The Identity They Gave Us
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              From the moment we were born, they told us who we were. They gave us a certificate, assigned us a number, registered us in their system. They said, "You are a citizen. You are a taxpayer. You are a legal entity subject to our jurisdiction."
            </p>
            <p>
              We grew up believing that's all we were—subjects of the state, bound by their laws, required to ask permission for everything. Want to travel? Get a license. Want to work? Pay your taxes. Want to leave an inheritance? We'll take half in probate.
            </p>
            <p className="font-semibold text-royal-navy text-xl">
              But something inside us always knew this wasn't right. We were meant for something more.
            </p>
            <p>
              We felt it when we read scripture. "You are a chosen generation, a royal priesthood, a holy nation." But how could that be true when we felt so powerless? When Babylon controlled everything?
            </p>
          </div>
        </div>
      </div>

      {/* The Struggle */}
      <div className="py-20 marble-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="font-cinzel text-3xl font-bold text-royal-navy mb-4" data-testid="text-struggle-heading">
              We Tried to Live Free Within Their System
            </h3>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              We kept asking Babylon for permission to live out our God-given identity. Every attempt led to the same dead end.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { attempt: "We declared we were children of God", reality: "But still carried their birth certificate name" },
              { attempt: "We said we were citizens of heaven", reality: "But still paid taxes to Caesar like subjects" },
              { attempt: "We called ourselves ambassadors", reality: "But operated under their jurisdiction" },
              { attempt: "We believed our security came from God", reality: "But watched the state seize our property" },
              { attempt: "We wanted to leave an inheritance", reality: "But probate court took it from our children" },
              { attempt: "We tried to operate in covenant", reality: "But lived under contract law" }
            ].map((item, index) => (
              <Card key={index} className="bg-white border-l-4 border-royal-burgundy hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <p className="text-lg font-semibold text-gray-800">{item.attempt}</p>
                    <p className="text-gray-600 italic">Reality: {item.reality}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-xl text-gray-700 italic max-w-3xl mx-auto">
              We had the right words, but we didn't know how to make them real. We proclaimed our identity in Christ, but still lived under Babylon's authority.
            </p>
          </div>
        </div>
      </div>

      {/* The Awakening */}
      <div className="py-20 bg-gradient-to-r from-royal-burgundy via-royal-navy to-royal-burgundy">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Cross className="w-20 h-20 text-royal-gold mx-auto mb-8" data-testid="icon-cross" />
          <h2 className="font-cinzel-decorative text-3xl md:text-5xl font-bold text-white mb-8" data-testid="text-awakening">
            Chapter 2: The Revelation
          </h2>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8 border border-royal-gold/30">
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-6">
              Then God opened our eyes to see what had been there all along:
            </p>
            <p className="text-2xl md:text-3xl text-royal-gold font-semibold leading-relaxed">
              We don't need Babylon's permission to live as God's children.<br />
              We already ARE who God says we are.<br />
              We just need to learn how to express that reality on earth.
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
                alt="Covenant relationship with God"
                className="rounded-xl shadow-xl w-full"
                data-testid="img-covenant"
              />
            </div>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <h3 className="font-cinzel text-3xl font-bold text-royal-navy mb-4">Living in Trust with God</h3>
              <p>
                That's when we discovered what covenant trust really means. Not a legal document. Not an estate planning tool. But <span className="font-semibold text-royal-navy">a way of living in trust relationship with God the Father through Jesus Christ</span>.
              </p>
              <p>
                God is the Grantor—He established the covenant. Christ is the Trustee—He administers everything the Father has given. We are the Beneficiaries—receiving identity, citizenship, ambassadorship, and security from our Father.
              </p>
              <p className="text-xl font-semibold text-royal-burgundy">
                This isn't theory. This is how we actually live.
              </p>
              <p>
                When we understand we're living in trust with God, everything changes. Our property? Held in trust for Kingdom purposes. Our inheritance? Passed through covenant, not probate. Our authority? Derived from heaven, not the state.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Four Revelations */}
      <div className="py-20 marble-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Star className="w-16 h-16 text-royal-gold mx-auto mb-6" data-testid="icon-star" />
            <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6" data-testid="text-revelations">
              Four Truths That Changed Everything
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              When we understood who we really are in Christ, these truths became the foundation of how we live.
            </p>
          </div>
          
          <div className="space-y-12">
            {[
              {
                number: 1,
                title: "Our Identity: Children of God",
                scripture: "\"Behold, what manner of love the Father hath bestowed upon us, that we should be called the sons of God\" - 1 John 3:1",
                revelation: "We're not legal entities created by the state. We're children of the Most High God, created in His image, born again by His Spirit. Our true identity comes from our Father, not from a birth certificate.",
                icon: Heart,
                color: "royal-gold"
              },
              {
                number: 2,
                title: "Our Citizenship: Heaven's Kingdom",
                scripture: "\"For our conversation is in heaven; from whence also we look for the Saviour\" - Philippians 3:20",
                revelation: "We're not primarily citizens of any earthly nation. Our citizenship is in heaven. We're ambassadors here, representing a foreign Kingdom. Babylon has no authority over citizens of heaven unless we consent to their jurisdiction.",
                icon: Crown,
                color: "royal-navy"
              },
              {
                number: 3,
                title: "Our Role: Ambassadors of Christ",
                scripture: "\"Now then we are ambassadors for Christ\" - 2 Corinthians 5:20",
                revelation: "As ambassadors, we operate under diplomatic immunity. We represent Christ's Kingdom on earth. We don't need the state's permission to fulfill our divine commission. We answer to a higher authority.",
                icon: Shield,
                color: "royal-burgundy"
              },
              {
                number: 4,
                title: "Our Security: In the Father's Hands",
                scripture: "\"My sheep hear my voice...and no man is able to pluck them out of my Father's hand\" - John 10:27-29",
                revelation: "Our security doesn't come from the state, from legal documents, or from our own efforts. We're held in the Father's hands. When we structure our lives around this trust relationship, Babylon's threats lose their power.",
                icon: HomeIcon,
                color: "royal-gold"
              }
            ].map((truth) => (
              <Card key={truth.number} className="royal-card border-l-8" style={{ borderLeftColor: `var(--${truth.color})` }}>
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="bg-gradient-to-br from-royal-navy to-royal-burgundy text-white rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-2xl font-bold">{truth.number}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <truth.icon className="w-10 h-10 text-royal-navy" data-testid={`icon-truth-${truth.number}`} />
                        <h3 className="font-cinzel text-2xl font-bold text-royal-navy" data-testid={`text-truth-title-${truth.number}`}>
                          {truth.title}
                        </h3>
                      </div>
                      <div className="bg-royal-gold/10 border-l-4 border-royal-gold p-4 mb-4 rounded">
                        <p className="font-georgia italic text-gray-700">{truth.scripture}</p>
                      </div>
                      <p className="text-lg text-gray-700 leading-relaxed">
                        {truth.revelation}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* The Practical Expression */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Lightbulb className="w-16 h-16 text-royal-burgundy mx-auto mb-6" data-testid="icon-lightbulb" />
            <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6" data-testid="text-expression">
              Chapter 3: How We Express This on Earth
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-12">
              Understanding our identity in Christ is one thing. Learning to express that reality in how we live, steward property, and pass inheritance is another. This is where covenant trust becomes practical.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                spiritual: "Identity: We are children of God",
                practical: "We operate as beneficiaries of the Father's trust, not legal entities of the state"
              },
              {
                spiritual: "Citizenship: Heaven is our home",
                practical: "We establish ecclesiastical jurisdiction, operating under divine authority not territorial law"
              },
              {
                spiritual: "Role: Ambassadors of Christ",
                practical: "We function as trustees of Kingdom resources, stewarding what God has entrusted to us"
              },
              {
                spiritual: "Security: In the Father's hands",
                practical: "Our property is held in covenant trust, protected from Babylon's probate theft"
              },
              {
                spiritual: "Authority: Under Christ as Head",
                practical: "We establish trust structures that recognize Christ as Grantor and ultimate authority"
              },
              {
                spiritual: "Inheritance: Co-heirs with Christ",
                practical: "We pass generational wealth through covenant succession, not state-controlled probate"
              }
            ].map((expression, index) => (
              <Card key={index} className="bg-gradient-to-br from-gray-50 to-white border-2 border-royal-gold/20 hover:border-royal-gold transition-all">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-royal-burgundy mb-2">Spiritual Reality:</p>
                      <p className="text-gray-800 font-semibold">{expression.spiritual}</p>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-12 h-0.5 bg-royal-gold"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-royal-navy mb-2">Earthly Expression:</p>
                      <p className="text-gray-700">{expression.practical}</p>
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
                    "For forty years I proclaimed I was a child of God, but I still lived like a subject of Babylon. I said I was a citizen of heaven, but I let the state control my property. When I finally understood that covenant trust isn't just spiritual metaphor—it's the actual structure God designed for His people to live in—everything shifted. Now I don't just believe I'm God's child. I live like it. My property is held in trust for Kingdom purposes. My inheritance flows through covenant. I operate as an ambassador under divine authority. This isn't just doctrine anymore. It's how I actually live."
                  </p>
                  <p className="font-bold text-royal-gold text-lg">— A Fellow Sojourner</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* The Learning Journey */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Book className="w-16 h-16 text-royal-navy mx-auto mb-6" data-testid="icon-book" />
            <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6" data-testid="text-learning">
              Learning to Walk in This Reality
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Understanding who you are in Christ is the revelation. Learning to express that identity through covenant trust is the journey we're walking together.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8 mb-12">
            <Card className="royal-card">
              <CardContent className="p-8">
                <h3 className="font-cinzel text-2xl font-bold text-royal-navy mb-4">The Journey We're Offering</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  We've gathered what God has revealed to us—and to many others walking this path—into a comprehensive learning experience. It starts with the spiritual reality of who you are in Christ, then shows you how to express that reality through covenant trust structures.
                </p>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-royal-gold flex-shrink-0 mt-1" />
                    <span>Discover your true identity as God's child, heaven's citizen, Christ's ambassador</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-royal-gold flex-shrink-0 mt-1" />
                    <span>Understand how covenant trust differs from Babylon's legal fictions</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-royal-gold flex-shrink-0 mt-1" />
                    <span>Learn to establish trust structures that express your heavenly jurisdiction</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-royal-gold flex-shrink-0 mt-1" />
                    <span>Steward property as a trustee under divine authority, not state control</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-royal-gold flex-shrink-0 mt-1" />
                    <span>Pass generational inheritance through covenant, protected from probate theft</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="royal-card border-4 border-royal-gold">
              <CardContent className="p-8">
                <h3 className="font-cinzel text-2xl font-bold text-royal-navy mb-4">This Is About Receiving Everything From the Father</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Identity. Citizenship. Ambassadorship. Security. Authority. Inheritance.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  None of these come from the state. All of them flow from God the Father, through Jesus Christ, to you as His child. Covenant trust is simply how we structure our lives to receive and steward what the Father has given us, operating under His authority rather than Babylon's control.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/courses">
              <Button 
                size="lg" 
                className="royal-button text-xl px-12 py-6 shadow-xl hover:scale-105 transition-transform"
                data-testid="button-begin-journey"
              >
                <BookOpen className="mr-2 h-6 w-6" />
                Begin This Journey
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* The Heart of It All */}
      <div className="py-20 marble-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6" data-testid="text-heart">
              This Is About Living in Trust with God
            </h2>
          </div>
          
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            <p>
              Yes, you'll learn about trust structures. Yes, you'll understand how to protect inheritance from probate. Yes, you'll discover how to operate under ecclesiastical jurisdiction.
            </p>
            <p>
              But none of that is the point.
            </p>
            <p className="text-xl font-semibold text-royal-navy">
              The point is learning to actually live in trust relationship with God the Father through Jesus Christ.
            </p>
            <p>
              To receive your identity from Him, not from a birth certificate.<br />
              To claim your citizenship in heaven, not subjection to the state.<br />
              To walk as His ambassador, not Babylon's subject.<br />
              To rest in His security, not their threats.
            </p>
            <p className="text-xl font-semibold text-royal-burgundy">
              When you understand you're living in trust with God, the practical structures follow naturally. Because you're not trying to escape Babylon—you're expressing the reality of who you already are in Christ.
            </p>
          </div>
        </div>
      </div>

      {/* The Invitation */}
      <div className="py-32 bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Key className="w-20 h-20 text-royal-gold mx-auto mb-8" data-testid="icon-key" />
          <h2 className="font-cinzel-decorative text-4xl md:text-5xl font-bold text-white mb-8" data-testid="text-invitation">
            You Are Who God Says You Are
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto">
            Child of God. Citizen of heaven. Ambassador of Christ. Secure in the Father's hands.
          </p>
          
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            If your spirit bears witness to this truth, come learn how to express that reality in every area of your life—including how you steward property, pass inheritance, and operate under divine authority.
          </p>
          
          <Link href="/courses">
            <Button 
              size="lg" 
              className="royal-button text-2xl px-16 py-8 shadow-2xl hover:scale-105 transition-transform mb-8"
              data-testid="button-final-cta"
            >
              <BookOpen className="mr-3 h-8 w-8" />
              Discover Your True Identity
            </Button>
          </Link>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center text-gray-300 text-lg">
            <Link href="/mandate" className="hover:text-royal-gold transition-colors" data-testid="link-mandate">
              Read the Mandate
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/repository" className="hover:text-royal-gold transition-colors" data-testid="link-repository">
              Explore the Teachings
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
