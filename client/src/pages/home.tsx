import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Crown, Shield, ScrollText, CheckCircle, X, 
  AlertCircle, Users, BookOpen, Download, 
  TrendingUp, Heart, Lock, Unlock
} from "lucide-react";
import customImage from "@assets/IMG_9062_1755824052661.jpeg";

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero Section - Attention Grabber */}
      <div className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy py-20 md:py-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-royal-gold text-royal-navy font-bold px-6 py-2 text-lg" data-testid="badge-online">
            ONLINE LEARNING AVAILABLE NOW
          </Badge>
          
          <h1 className="font-cinzel-decorative text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight" data-testid="text-hero-title">
            You're Just One <span className="text-royal-gold">Trust</span> Away...
          </h1>
          
          <div className="text-5xl md:text-6xl font-cinzel-decorative font-bold mb-8">
            <span className="text-white">Kingdom </span>
            <span className="text-royal-gold">or</span>
            <span className="text-white"> Babylon?</span>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border-2 border-royal-gold rounded-lg p-8 mb-8">
            <p className="text-2xl md:text-3xl text-white font-semibold leading-relaxed">
              The <span className="text-royal-gold font-bold">Life & Freedom</span> You Want Is Going To Be Fueled By The <span className="text-royal-gold font-bold">Trust Knowledge You Learn</span>
            </p>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-12">
            Get The Knowledge Now!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/courses">
              <Button 
                size="lg" 
                className="royal-button text-xl px-12 py-6 shadow-xl hover:scale-105 transition-transform"
                data-testid="button-get-started"
              >
                <BookOpen className="mr-2 h-6 w-6" />
                Get The Knowledge Now!
              </Button>
            </Link>
            <p className="text-royal-gold font-bold text-lg">Limited Spots Available</p>
          </div>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AlertCircle className="w-20 h-20 text-royal-burgundy mx-auto mb-6" data-testid="icon-alert" />
            <h2 className="font-cinzel-decorative text-4xl md:text-5xl font-bold text-royal-navy mb-6" data-testid="text-attention-heading">
              <span className="text-royal-burgundy">Attention:</span> All those seeking true freedom, sovereignty, and biblical wealth transfer...
            </h2>
            <p className="text-2xl md:text-3xl text-gray-800 font-bold leading-relaxed max-w-4xl mx-auto">
              Are You Ready To Learn The Biblical Trust Structure That Creates Multi-Generational Wealth & Freedom Without Legal Bondage But Don't Know Where To Start?
            </p>
          </div>
          
          <div className="text-center py-12">
            <h3 className="font-cinzel text-3xl font-bold text-royal-navy mb-4" data-testid="text-all-you-need">
              All You Need Is <span className="text-royal-gold">Kingdom Trust Knowledge</span>
            </h3>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              This Knowledge Will Simplify All The Noise Online And Cut Right To The Chase Without Any Complicated Legal Paperwork Or Status Change Needed
            </p>
          </div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="bg-gradient-to-r from-royal-burgundy to-royal-navy py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-gold mb-4" data-testid="text-quote">
            "Those In Babylon Do NOT Want You To Know This"
          </h3>
        </div>
      </div>

      {/* Wrong Methods Section */}
      <div className="py-20 marble-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-cinzel-decorative text-4xl md:text-5xl font-bold text-center text-royal-navy mb-4" data-testid="text-influencers-heading">
            There are too many <span className="text-royal-burgundy">influencers</span> talking
          </h2>
          <h3 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-center text-royal-navy mb-16">
            about so many different "<span className="text-royal-burgundy">ways</span>"...
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              "You just need to file a Living Trust template!",
              "You just need a Revocable Trust!",
              "You just need to hire an expensive attorney!",
              "You just need a standard Estate Plan!",
              "You just need life insurance!",
              "You just need to avoid probate!",
              "You just need asset protection!",
              "You just need tax reduction strategies!",
              "You just need to put everything in an LLC!"
            ].map((myth, index) => (
              <Card key={index} className="border-2 border-royal-burgundy bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <X className="w-8 h-8 text-royal-burgundy flex-shrink-0 mt-1" data-testid={`icon-x-${index}`} />
                    <div>
                      <p className="text-xl text-gray-700 mb-2">{myth}</p>
                      <p className="text-2xl font-bold text-royal-burgundy" data-testid={`text-incorrect-${index}`}>incorrect!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mb-12">
            <p className="text-2xl text-gray-800 font-semibold mb-8">
              How many of you have heard any one of these confusing scenarios?
            </p>
            
            <Link href="/courses">
              <Button 
                size="lg" 
                className="royal-button text-xl px-12 py-6"
                data-testid="button-get-knowledge"
              >
                Get The Knowledge Now!
              </Button>
            </Link>
            <p className="text-royal-gold font-bold text-lg mt-4">Limited Spots Available</p>
          </div>
        </div>
      </div>

      {/* The Solution - Watch Now */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-cinzel-decorative text-4xl md:text-5xl font-bold text-royal-navy mb-6" data-testid="text-watch-heading">
              Learn Now! <span className="text-royal-gold">(Virtual Academy)</span>
            </h2>
            <h3 className="font-cinzel text-3xl font-bold text-royal-burgundy mb-8">
              COMPREHENSIVE TRUST KNOWLEDGE TRAINING
            </h3>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Imagine being in a small elite group full of like-minded believers learning the biblical structure of trust and covenant law, then going back and establishing multi-generational wealth for your family. No more legal bondage, No more probate theft, No more state control of your inheritance.
            </p>
          </div>
          
          <Card className="royal-card max-w-3xl mx-auto mb-12">
            <CardContent className="p-8">
              <img 
                src={customImage}
                alt="Trust covenant documents"
                className="rounded-lg w-full mb-6"
                data-testid="img-covenant"
              />
              <p className="text-lg text-gray-700 leading-relaxed">
                With so much knowledge packed into this comprehensive program, you will walk away stronger, bolder and armed with the covenant truth that has been hidden from your understanding, until now.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* The Benefits Section */}
      <div className="py-20 marble-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-cinzel-decorative text-4xl md:text-5xl font-bold text-royal-navy mb-6" data-testid="text-stand-heading">
              The one thing Babylon fears is the day we all stand together.
            </h2>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              But before that can happen, we all need to relearn how to stand on our own in covenant law as a man or woman under Christ's trust.
            </p>
          </div>
          
          <h3 className="font-cinzel text-3xl font-bold text-center text-royal-navy mb-12" data-testid="text-learning-heading">
            Learning this knowledge means:
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              "No more probate court theft",
              "No more estate taxes stealing your inheritance",
              "How to create generational wealth",
              "How to operate under covenant law not statutes",
              "How to transfer property without state control",
              "How to protect your children's inheritance",
              "How to avoid nursing home asset seizure",
              "Learn biblical stewardship principles",
              "How to leave a legacy that lasts",
              "How to walk in true financial freedom"
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 bg-white p-6 rounded-lg border-2 border-royal-gold hover:shadow-lg transition-shadow">
                <CheckCircle className="w-6 h-6 text-royal-gold flex-shrink-0 mt-1" data-testid={`icon-check-${index}`} />
                <p className="text-lg font-semibold text-gray-800">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What If Section */}
      <div className="py-20 bg-gradient-to-br from-royal-navy to-royal-burgundy">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-cinzel-decorative text-4xl md:text-5xl font-bold text-center text-royal-gold mb-16" data-testid="text-what-if">
            what if?
          </h2>
          
          <div className="space-y-8">
            {[
              {
                question: "What if there are covenant laws that shut down legal theft?",
                subtext: "~without lawyers"
              },
              {
                question: "What if biblical trust has been hidden and replaced with legal fictions?",
                subtext: "~without complicated paperwork"
              },
              {
                question: "What if every man, woman and family could establish their covenant trust?",
                subtext: "~without state permission"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3" data-testid={`text-question-${index}`}>
                  {item.question}
                </h3>
                <p className="text-xl text-royal-gold font-semibold">{item.subtext}</p>
              </div>
            ))}
            
            <div className="text-center pt-8">
              <p className="text-xl text-gray-300 mb-4">
                Or any of that <span className="text-royal-gold font-bold">confusing noise</span> that all the influencers are sharing in random videos…
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About the Teacher */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <img 
                src={customImage}
                alt="Kingdom trust educator"
                className="rounded-xl shadow-xl w-full"
                data-testid="img-teacher"
              />
            </div>
            <div>
              <h2 className="font-cinzel-decorative text-4xl font-bold text-royal-navy mb-6" data-testid="text-teacher-name">
                Kingdom Ventures Trust
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  After years of searching for truth beyond Babylon's legal fictions, we discovered the ancient covenant principles that Christ established as our eternal inheritance.
                </p>
                <p>
                  We realized that our whole lives had been built on a lie. We had been taught to operate under state control, legal fictions, and probate theft—thinking that was "just how it works."
                </p>
                <p className="font-semibold text-royal-navy">
                  Once the veil was fully lifted, everything changed.
                </p>
                <p>
                  Now we establish trusts under covenant law, not state permission; Now our property belongs to the trust, not the state; Now our inheritance passes to our children without probate; Now we operate in Kingdom economy, not Babylon's debt system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Process Section */}
      <div className="py-20 marble-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-cinzel-decorative text-4xl md:text-5xl font-bold text-royal-navy mb-6" data-testid="text-process-heading">
              So HOW do you establish a biblical trust?
            </h2>
            <p className="text-2xl text-gray-700 font-semibold">
              It is pretty simple actually… <span className="text-royal-gold">As simple as 1, 2, 3.</span>
            </p>
          </div>
          
          <div className="space-y-12">
            {[
              {
                number: 1,
                title: "Foundation: Understanding Trust",
                description: "Learn what a trust actually is in biblical terms—the relationship between Grantor, Trustee, and Beneficiary established by covenant law",
                icon: Shield
              },
              {
                number: 2,
                title: "Structure: Establishing Your Trust",
                description: "Discover how to properly structure your trust according to covenant principles, not state statutes",
                icon: ScrollText
              },
              {
                number: 3,
                title: "Transfer: Moving Assets Into Trust",
                description: "Master the process of transferring property into your trust and operating as trustee under divine authority",
                icon: Crown
              }
            ].map((step) => (
              <Card key={step.number} className="royal-card border-4 border-royal-gold">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="bg-royal-gold text-white rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl font-bold">{step.number}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <step.icon className="w-10 h-10 text-royal-navy" data-testid={`icon-step-${step.number}`} />
                        <h3 className="font-cinzel text-2xl font-bold text-royal-navy" data-testid={`text-step-title-${step.number}`}>
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-lg text-gray-700 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Big Secret Section */}
      <div className="py-20 bg-gradient-to-r from-royal-burgundy via-royal-navy to-royal-burgundy">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-cinzel-decorative text-4xl md:text-6xl font-bold text-royal-gold mb-12" data-testid="text-secret-heading">
            Here Is The Big Secret:
          </h2>
          
          <div className="space-y-6 mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white">
              "They" aren't the only ones that can create trusts…
            </h3>
            <h3 className="text-4xl md:text-5xl font-bold text-royal-gold">
              We can too!
            </h3>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-12">
            <ul className="text-left space-y-4 text-lg text-white">
              {[
                "We created covenant law, the foundation of all trust",
                "We are made in the image of the ultimate Grantor",
                "We have divine authority to establish trusts",
                "We hold the highest jurisdiction on earth",
                "We are co-heirs with Christ",
                "And that fact still stands today…"
              ].map((fact, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-royal-gold flex-shrink-0 mt-1" data-testid={`icon-fact-${index}`} />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Final Truth Section */}
      <div className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-cinzel-decorative text-4xl md:text-5xl font-bold text-royal-navy mb-12" data-testid="text-final-heading">
            Sooooooo....
          </h2>
          
          <div className="space-y-8 mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800">
              All you need to know is <span className="text-royal-gold">HOW</span> to establish your own trust by using the right covenant structure and the right biblical foundation.
            </h3>
            
            <div className="text-5xl md:text-6xl font-cinzel-decorative font-bold text-royal-burgundy">
              Whammo! Game Over!
            </div>
            
            <p className="text-2xl text-gray-700 font-semibold">
              And so it begins...
            </p>
            
            <p className="text-xl text-gray-600">
              Because the <span className="text-royal-gold font-bold">awakening</span> IS upon us...
            </p>
          </div>
          
          <div className="mb-12">
            <Link href="/courses">
              <Button 
                size="lg" 
                className="royal-button text-2xl px-16 py-8 shadow-2xl hover:scale-105 transition-transform"
                data-testid="button-final-cta"
              >
                <BookOpen className="mr-3 h-8 w-8" />
                Get The Knowledge Now!
              </Button>
            </Link>
            <p className="text-royal-gold font-bold text-xl mt-4">Limited Spots Available</p>
          </div>
        </div>
      </div>

      {/* Facts Section */}
      <div className="py-20 marble-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { label: "FACT:", text: "Covenant law beats legal statutes", variant: "primary" },
              { label: "FACT:", text: "Covenant law is perfect", variant: "primary" },
              { label: "FACT:", text: "Legal statutes are the undoing of covenant law", variant: "danger" },
              { label: "FACT:", text: "Legal fictions are the bastardization of covenant truth", variant: "danger" },
              { label: "FACT:", text: "Legal systems are counterfeit", variant: "danger" },
              { label: "FACT:", text: "Legal systems are designed to fleece men and women of Money, Freedom, Property, and the ability to THINK", variant: "danger" }
            ].map((fact, index) => (
              <Card key={index} className={`border-4 ${fact.variant === 'primary' ? 'border-royal-gold bg-royal-gold/5' : 'border-royal-burgundy bg-royal-burgundy/5'}`}>
                <CardContent className="p-6">
                  <p className="text-lg">
                    <span className={`font-bold ${fact.variant === 'primary' ? 'text-royal-gold' : 'text-royal-burgundy'}`}>
                      {fact.label}
                    </span>{' '}
                    <span className="text-gray-800 font-semibold">{fact.text}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="royal-card border-4 border-royal-gold">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <Users className="w-12 h-12 text-royal-gold flex-shrink-0" data-testid="icon-testimonial" />
                <div>
                  <p className="text-xl text-gray-700 leading-relaxed italic mb-4">
                    "When I learned 'covenant versus legal', I used my trust knowledge to protect our family inheritance from probate theft. They had no claim. Thank you for this life-changing truth!"
                  </p>
                  <p className="font-bold text-royal-navy">~A Grateful Student</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-32 bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Crown className="w-20 h-20 text-royal-gold mx-auto mb-8" data-testid="icon-final-crown" />
          <h2 className="font-cinzel-decorative text-4xl md:text-5xl font-bold text-white mb-8" data-testid="text-final-cta-heading">
            The Time Is NOW
          </h2>
          <p className="text-2xl text-gray-200 mb-12 leading-relaxed">
            Join the remnant who are learning to walk in covenant authority, establish generational wealth, and leave Babylon's legal bondage behind forever.
          </p>
          
          <Link href="/courses">
            <Button 
              size="lg" 
              className="royal-button text-2xl px-16 py-8 shadow-2xl hover:scale-105 transition-transform mb-6"
              data-testid="button-bottom-cta"
            >
              <BookOpen className="mr-3 h-8 w-8" />
              Enter The Academy Now
            </Button>
          </Link>
          
          <p className="text-royal-gold font-bold text-xl">Limited Spots Available</p>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center text-gray-300">
            <Link href="/mandate" className="hover:text-royal-gold transition-colors" data-testid="link-mandate">
              Read The Mandate
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/repository" className="hover:text-royal-gold transition-colors" data-testid="link-repository">
              View Knowledge Repository
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/contact" className="hover:text-royal-gold transition-colors" data-testid="link-contact">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
