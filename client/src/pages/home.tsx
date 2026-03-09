import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import {
  Shield, BookOpen, Banknote, Globe,
  ArrowRight, CheckCircle, AlertTriangle, Lock,
  Scale, FileText, Building, Users, Eye,
  ChevronRight, Landmark, CircleDot
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useCtaHref } from "@/hooks/useCtaHref";
import StaggerContainer, {
  staggerItemVariants,
  emphasisItemVariants,
} from "@/components/ui/stagger-container";
import sealImage from "@assets/EB_1772210493582.png";

export default function Home() {
  usePageTitle();
  const ctaHref = useCtaHref();
  const shouldReduceMotion = useReducedMotion();

  const heroInitial = shouldReduceMotion ? {} : { opacity: 0, y: 30 };
  const heroAnimate = { opacity: 1, y: 0 };
  const heroTransition = (delay: number) => ({
    duration: 0.8,
    delay: shouldReduceMotion ? 0 : delay,
    ease: [0.25, 0.1, 0.25, 1] as const,
  });

  return (
    <div className="pt-16">
      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: HERO
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy pt-4 pb-28 md:pt-6 md:pb-40 animate-hero-gradient overflow-hidden">
        <div className="absolute inset-0 bg-black/25"></div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.img
            src={sealImage}
            alt="Ecclesia Basilikos Seal"
            className="w-[18rem] h-[18rem] md:w-[24rem] md:h-[24rem] mx-auto -mb-20 -mt-20 object-contain drop-shadow-2xl"
            initial={heroInitial}
            animate={heroAnimate}
            transition={heroTransition(0)}
          />

          <motion.h1
            className="font-cinzel-decorative text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            initial={heroInitial}
            animate={heroAnimate}
            transition={heroTransition(0.15)}
          >
            Reclaim What Was Always Yours
          </motion.h1>

          <motion.h2
            className="font-cinzel text-xl md:text-2xl animate-gold-shimmer mb-8"
            initial={heroInitial}
            animate={heroAnimate}
            transition={heroTransition(0.25)}
          >
            Your Money · Your Assets · Your Status
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-10"
            initial={heroInitial}
            animate={heroAnimate}
            transition={heroTransition(0.4)}
          >
            You have been operating inside a system designed to hold everything in your name while giving you control over nothing. Three pillars. Three shifts. One foundation.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={heroInitial}
            animate={heroAnimate}
            transition={heroTransition(0.6)}
          >
            <div className="inline-block rounded-lg animate-glow-pulse">
              <Link href="/lawful-money">
                <Button
                  size="lg"
                  className="royal-button text-lg md:text-xl px-10 py-6 shadow-2xl hover:scale-105 transition-transform"
                >
                  <Banknote className="mr-3 h-6 w-6" />
                  Start with Pillar 1
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="text-lg md:text-xl px-10 py-6 bg-white/15 border-royal-gold/50 text-royal-gold hover:bg-white/25 transition-all"
              >
                <Users className="mr-3 h-6 w-6" />
                Get Guidance
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: THE PROBLEM
          ═══════════════════════════════════════════════════════════════ */}
      <div className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                The System Was Not Built for You
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Everything you think you own is held under a framework you never agreed to. Your money is debt. Your property is titled in a fiction. Your citizenship places you under a jurisdiction you never chose.
              </p>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.12} className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            {[
              {
                icon: Banknote,
                title: "Your Money Isn't Money",
                description:
                  "Federal Reserve Notes are debt obligations — not lawful money. Every transaction you make using them is conducted in private credit, creating legal presumptions and tax obligations you never understood.",
              },
              {
                icon: Building,
                title: "Your Assets Aren't Protected",
                description:
                  "Anything held in your personal name is exposed to liens, levies, lawsuits, and seizure. You don't truly own what can be taken from you by operation of law without your consent.",
              },
              {
                icon: FileText,
                title: "Your Status Isn't What You Think",
                description:
                  "The 14th Amendment created a federal citizenship that places you under congressional jurisdiction. Your original status — state citizen of the republic — has been obscured, not destroyed.",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={staggerItemVariants}>
                <Card className="royal-card h-full border-t-4 border-t-royal-burgundy">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-full bg-royal-burgundy/10 flex items-center justify-center mb-5">
                      <item.icon className="w-6 h-6 text-royal-burgundy" />
                    </div>
                    <h3 className="font-cinzel text-lg font-bold text-royal-navy mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </StaggerContainer>

          <RevealOnScroll>
            <div className="text-center">
              <p className="text-xl md:text-2xl font-semibold text-royal-navy max-w-3xl mx-auto">
                This is not conspiracy. This is how the system is structured.{" "}
                <span className="text-royal-burgundy">And it can be changed — lawfully.</span>
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: THE THREE PILLARS — MAIN FEATURE
          ═══════════════════════════════════════════════════════════════ */}
      <div className="py-28 marble-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 font-cinzel text-xs tracking-[0.3em] uppercase text-royal-burgundy bg-royal-burgundy/10 px-5 py-2 rounded-full mb-5">
                <Shield className="w-3.5 h-3.5" />
                The Foundation
              </span>
              <h2 className="font-cinzel-decorative text-3xl md:text-5xl font-bold text-royal-navy mb-6">
                Three Pillars of Alignment
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Each pillar addresses a critical area where you have been unknowingly
                operating under the wrong framework. Together, they form the
                foundation everything else is built upon.
              </p>
            </div>
          </RevealOnScroll>

          {/* Pillar 1 — Lawful Money */}
          <RevealOnScroll>
            <div className="max-w-5xl mx-auto mt-16">
              <Link href="/lawful-money">
                <Card className="royal-card hover:border-royal-gold transition-all cursor-pointer group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-5">
                      <div className="md:col-span-2 bg-gradient-to-br from-royal-navy to-royal-burgundy p-8 md:p-10 flex flex-col justify-center text-white">
                        <span className="inline-block self-start text-xs font-semibold text-royal-gold bg-royal-gold/15 px-3 py-1 rounded-full mb-4">
                          Pillar 1
                        </span>
                        <Banknote className="w-14 h-14 text-royal-gold mb-4" />
                        <h3 className="font-cinzel-decorative text-2xl md:text-3xl font-bold mb-2">
                          Lawful Money Redemption
                        </h3>
                        <p className="text-sm text-royal-gold font-cinzel font-semibold">
                          12 USC § 411
                        </p>
                      </div>
                      <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
                        <p className="text-gray-700 leading-relaxed mb-6">
                          Every Federal Reserve Note is a debt instrument issued by a private
                          banking system. Under 12 USC § 411, you have the statutory right to
                          demand redemption in lawful money — non-debt currency authorized under
                          the Constitution. This single act changes the legal character of every
                          transaction.
                        </p>
                        <ul className="space-y-3 mb-6">
                          {[
                            "Remove the presumption of private credit usage",
                            "Establish your financial standing under public law",
                            "Affect how income is characterized for tax purposes",
                            "Exercise a right — not file a petition",
                          ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center gap-2 text-royal-gold font-cinzel text-sm font-semibold group-hover:gap-3 transition-all">
                          Learn How Lawful Money Redemption Works
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </RevealOnScroll>

          {/* Pillar 2 — Trust */}
          <RevealOnScroll>
            <div className="max-w-5xl mx-auto mt-8">
              <Link href="/trust-assets">
                <Card className="royal-card hover:border-royal-gold transition-all cursor-pointer group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-5">
                      <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center order-2 md:order-1">
                        <p className="text-gray-700 leading-relaxed mb-6">
                          Anything held in your personal name is fully exposed — to creditors,
                          government claims, lawsuits, and probate. A properly structured trust
                          separates legal title from beneficial interest. The trust owns the
                          assets. You receive the benefits. That separation is your protection.
                        </p>
                        <ul className="space-y-3 mb-6">
                          {[
                            "Separate legal title from personal liability",
                            "Shield assets from judgments, liens, and creditor claims",
                            "Avoid probate — private, efficient, and immediate",
                            "Hold real property, accounts, vehicles, and business interests",
                          ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center gap-2 text-royal-gold font-cinzel text-sm font-semibold group-hover:gap-3 transition-all">
                          Learn How Trust Protection Works
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="md:col-span-2 bg-gradient-to-br from-royal-burgundy to-royal-navy p-8 md:p-10 flex flex-col justify-center text-white order-1 md:order-2">
                        <span className="inline-block self-start text-xs font-semibold text-royal-gold bg-royal-gold/15 px-3 py-1 rounded-full mb-4">
                          Pillar 2
                        </span>
                        <Shield className="w-14 h-14 text-royal-gold mb-4" />
                        <h3 className="font-cinzel-decorative text-2xl md:text-3xl font-bold mb-2">
                          Trust & Asset Protection
                        </h3>
                        <p className="text-sm text-royal-gold font-cinzel font-semibold">
                          Securing What Was Given
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </RevealOnScroll>

          {/* Pillar 3 — Passport */}
          <RevealOnScroll>
            <div className="max-w-5xl mx-auto mt-8">
              <Link href="/state-passport">
                <Card className="royal-card hover:border-royal-gold transition-all cursor-pointer group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-5">
                      <div className="md:col-span-2 bg-gradient-to-br from-royal-navy to-royal-burgundy p-8 md:p-10 flex flex-col justify-center text-white">
                        <span className="inline-block self-start text-xs font-semibold text-royal-gold bg-royal-gold/15 px-3 py-1 rounded-full mb-4">
                          Pillar 3
                        </span>
                        <Globe className="w-14 h-14 text-royal-gold mb-4" />
                        <h3 className="font-cinzel-decorative text-2xl md:text-3xl font-bold mb-2">
                          State-Citizen Passport
                        </h3>
                        <p className="text-sm text-royal-gold font-cinzel font-semibold">
                          Reclaiming Your Status
                        </p>
                      </div>
                      <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
                        <p className="text-gray-700 leading-relaxed mb-6">
                          There are two types of citizenship in America — and you have been
                          defaulted into one without your knowledge. State citizenship predates
                          the 14th Amendment and carries unalienable rights, not civil privileges.
                          Your passport can reflect your true political status in the republic.
                        </p>
                        <ul className="space-y-3 mb-6">
                          {[
                            "Establish your standing under original constitutional jurisdiction",
                            "Operate under unalienable rights — not legislative privileges",
                            "Declare your domicile in one of the several states",
                            "Document your status through the passport application process",
                          ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center gap-2 text-royal-gold font-cinzel text-sm font-semibold group-hover:gap-3 transition-all">
                          Learn How State-Citizen Status Works
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: THE SHIFT — BEFORE / AFTER
          ═══════════════════════════════════════════════════════════════ */}
      <RevealOnScroll>
        <div className="py-24 bg-gradient-to-r from-royal-burgundy via-royal-navy to-royal-burgundy">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-white mb-6">
                The Shift This Creates
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Each pillar moves you from the system's default position to your
                lawful standing. This is what alignment looks like in practice.
              </p>
            </div>

            <StaggerContainer staggerDelay={0.15} className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  before: "Using private credit (Federal Reserve Notes)",
                  after: "Redeeming in lawful money (12 USC § 411)",
                  icon: Banknote,
                },
                {
                  before: "Assets held in personal name — fully exposed",
                  after: "Assets held in trust — lawfully protected",
                  icon: Shield,
                },
                {
                  before: "Federal citizen — subject to congressional jurisdiction",
                  after: "State citizen — standing under original constitution",
                  icon: Globe,
                },
                {
                  before: "Operating by permission and privilege",
                  after: "Operating by right and standing",
                  icon: Scale,
                },
                {
                  before: "System controls your identity, property, and status",
                  after: "You hold your identity, property, and status in trust",
                  icon: Lock,
                },
              ].map((item, index) => (
                <motion.div key={index} variants={staggerItemVariants}>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5 md:p-6">
                    <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-1" />
                        <p className="text-gray-300 text-sm md:text-base">{item.before}</p>
                      </div>
                      <div className="hidden md:flex items-center justify-center">
                        <ChevronRight className="w-6 h-6 text-royal-gold" />
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" />
                        <p className="text-white font-medium text-sm md:text-base">{item.after}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </RevealOnScroll>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5: WHAT YOU GET — CONCRETE OUTCOMES
          ═══════════════════════════════════════════════════════════════ */}
      <div className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                What You Will Learn
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                This is not theory. Each pillar comes with specific knowledge,
                processes, and documentation you can act on.
              </p>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {[
              {
                icon: FileText,
                text: "The full text and meaning of 12 USC § 411",
              },
              {
                icon: Banknote,
                text: "How to write a proper restrictive endorsement on every deposit",
              },
              {
                icon: Scale,
                text: "The legal distinction between private credit and public money",
              },
              {
                icon: Shield,
                text: "How trust structures separate legal title from beneficial interest",
              },
              {
                icon: Building,
                text: "The difference between irrevocable, express, common law, and land trusts",
              },
              {
                icon: Lock,
                text: "How to transfer real property, accounts, and vehicles into trust",
              },
              {
                icon: Globe,
                text: "The constitutional basis for state citizenship vs. federal citizenship",
              },
              {
                icon: Landmark,
                text: "How to complete the DS-11 passport application with proper status language",
              },
              {
                icon: Eye,
                text: "Key case law: Slaughter-House Cases, United States v. Cruikshank",
              },
              {
                icon: Users,
                text: "Access to community support, guidance, and fellowship throughout the process",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={staggerItemVariants}>
                <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-royal-navy/5 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-royal-navy" />
                  </div>
                  <p className="text-gray-700 leading-relaxed pt-1.5">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6: PHASE ROADMAP
          ═══════════════════════════════════════════════════════════════ */}
      <div className="py-24 marble-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                The Journey Ahead
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                The foundation must be set first. What follows builds upon it — but nothing
                can be built without this ground being laid.
              </p>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.2} className="max-w-3xl mx-auto space-y-6">
            {/* Foundation — Active */}
            <motion.div variants={staggerItemVariants}>
              <Card className="border-2 border-royal-gold shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-full bg-royal-gold flex items-center justify-center flex-shrink-0">
                      <span className="font-cinzel text-lg font-bold text-royal-navy">01</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-cinzel text-xl font-bold text-royal-navy">
                          Foundation
                        </h3>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                          <CircleDot className="w-3 h-3" />
                          Start Here
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-3">
                        Lawful Money Redemption, Trust & Asset Protection, and State-Citizen Passport. These three pillars establish your financial standing, protect your assets, and confirm your political status.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Link href="/lawful-money" className="text-xs font-cinzel font-semibold text-royal-gold hover:text-royal-burgundy transition-colors">
                          Lawful Money →
                        </Link>
                        <Link href="/trust-assets" className="text-xs font-cinzel font-semibold text-royal-gold hover:text-royal-burgundy transition-colors">
                          Trust & Assets →
                        </Link>
                        <Link href="/state-passport" className="text-xs font-cinzel font-semibold text-royal-gold hover:text-royal-burgundy transition-colors">
                          State Passport →
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Phase 2 — Coming */}
            <motion.div variants={staggerItemVariants}>
              <Card className="border border-gray-200 opacity-75">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="font-cinzel text-lg font-bold text-gray-500">02</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-cinzel text-xl font-bold text-gray-500">
                          Phase 2 — Structure
                        </h3>
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-gray-400 leading-relaxed">
                        Covenant identity, ecclesia assembly, kingdom governance, and the divine mandate. Building the structure upon the foundation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Phase 3 — Coming */}
            <motion.div variants={staggerItemVariants}>
              <Card className="border border-gray-200 opacity-60">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="font-cinzel text-lg font-bold text-gray-400">03</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-cinzel text-xl font-bold text-gray-400">
                          Phase 3 — Operation
                        </h3>
                        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-gray-400 leading-relaxed">
                        Full stewardship operation, academy courses, covenant repository, embassy forum, and proof vault. Living and operating from the new estate.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerContainer>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7: COMMON QUESTIONS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                Common Questions
              </h2>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.12} className="space-y-6 max-w-3xl mx-auto">
            {[
              {
                q: "Is lawful money redemption legal?",
                a: "Yes. 12 USC § 411 is current, standing federal law. It expressly states that Federal Reserve Notes \"shall be redeemed in lawful money on demand.\" Redemption is the exercise of a statutory right — not a loophole, petition, or protest.",
              },
              {
                q: "Do I need a lawyer to set up a trust?",
                a: "We provide education on trust law, structure, and administration so you understand what you are doing and why. We encourage members to study diligently and seek qualified counsel when appropriate. Knowledge comes first — then action.",
              },
              {
                q: "Can the government refuse a state-citizen passport?",
                a: "The right to a passport is well established. The process involves completing the standard DS-11 application with the correct understanding of domicile, status, and language. We educate on what the law says and how the application works.",
              },
              {
                q: "Is this anti-government?",
                a: "No. This is about understanding the system as it is written — not as you were told it works. Every action here is grounded in existing statute, constitutional law, and legal precedent. This is alignment with the law, not resistance to it.",
              },
              {
                q: "How long does this take?",
                a: "The foundation is self-paced. Some members begin practicing lawful money redemption within days. Trust establishment takes more preparation. The passport process involves a formal application. We provide guidance and community support throughout.",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={staggerItemVariants}>
                <Card className="royal-card">
                  <CardContent className="p-6 md:p-8">
                    <h3 className="font-cinzel text-base font-bold text-royal-navy mb-3">
                      {item.q}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.a}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 8: FINAL CTA
          ═══════════════════════════════════════════════════════════════ */}
      <div className="py-32 bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy relative overflow-hidden">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <h2 className="font-cinzel-decorative text-4xl md:text-5xl font-bold text-white mb-6">
              The Foundation Starts Here
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-4">
              Three pillars. Three shifts. One foundation.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <StaggerContainer staggerDelay={0.15} className="flex flex-col md:flex-row gap-4 justify-center items-center my-12 max-w-3xl mx-auto">
              {[
                { icon: Banknote, label: "Lawful Money", href: "/lawful-money" },
                { icon: Shield, label: "Trust & Assets", href: "/trust-assets" },
                { icon: Globe, label: "State Passport", href: "/state-passport" },
              ].map((item, index) => (
                <motion.div key={index} variants={staggerItemVariants} className="flex-1 w-full md:w-auto">
                  <Link href={item.href}>
                    <div className="bg-white/10 backdrop-blur-sm border border-royal-gold/30 rounded-lg p-5 text-center hover:bg-white/15 transition-all cursor-pointer group">
                      <item.icon className="w-8 h-8 text-royal-gold mx-auto mb-2" />
                      <p className="font-cinzel text-sm font-semibold text-white group-hover:text-royal-gold transition-colors">
                        {item.label}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </StaggerContainer>
          </RevealOnScroll>

          <RevealOnScroll delay={0.5}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="inline-block rounded-lg animate-glow-pulse">
                <Link href="/lawful-money">
                  <Button
                    size="lg"
                    className="royal-button text-xl px-12 py-7 shadow-2xl hover:scale-105 transition-transform"
                  >
                    <Banknote className="mr-3 h-7 w-7" />
                    Begin with Pillar 1
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
              </div>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-xl px-12 py-7 bg-white/15 border-royal-gold/50 text-royal-gold hover:bg-white/25 transition-all"
                >
                  <Users className="mr-3 h-7 w-7" />
                  Get Guidance
                </Button>
              </Link>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.7}>
            <p className="text-gray-400 text-base max-w-xl mx-auto leading-relaxed mt-10">
              Ecclesia Basilikos provides education and community — not legal or tax advice.
              Your journey is your own, supported by knowledge and fellowship.
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
}
