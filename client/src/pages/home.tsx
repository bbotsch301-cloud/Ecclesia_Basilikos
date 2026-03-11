import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import {
  Shield, BookOpen, Banknote, Globe,
  ArrowRight, CheckCircle, AlertTriangle, Lock,
  Scale, FileText, Building, Users, Eye,
  ChevronRight, Landmark, CircleDot, Crown, Scroll, Key
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
  usePageTitle(undefined, "Ecclesia Basilikos — A Private Membership Association operating under divine covenant authority. Acquire beneficial interest in the trust.");
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
          SECTION 1: HERO — PMA IDENTITY
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
            Embassy of the Eternal Kingdom
          </motion.h1>

          <motion.h2
            className="font-cinzel text-xl md:text-2xl animate-gold-shimmer mb-8"
            initial={heroInitial}
            animate={heroAnimate}
            transition={heroTransition(0.25)}
          >
            A Private Membership Association Under Divine Covenant Authority
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-10"
            initial={heroInitial}
            animate={heroAnimate}
            transition={heroTransition(0.4)}
          >
            Ecclesia Basilikos is a trust-governed assembly established to educate, equip, and restore
            those called to operate outside Babylon's commercial systems — under private jurisdiction,
            divine authority, and covenant law.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={heroInitial}
            animate={heroAnimate}
            transition={heroTransition(0.6)}
          >
            <div className="inline-block rounded-lg animate-glow-pulse">
              <Link href={ctaHref}>
                <Button
                  size="lg"
                  className="royal-button text-lg md:text-xl px-10 py-6 shadow-2xl hover:scale-105 transition-transform"
                >
                  <Crown className="mr-3 h-6 w-6" />
                  {ctaHref === "/signup" ? "Enter the Assembly" : "Go to Dashboard"}
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <Link href="/pma-agreement">
              <Button
                size="lg"
                variant="outline"
                className="text-lg md:text-xl px-10 py-6 bg-white/15 border-royal-gold/50 text-royal-gold hover:bg-white/25 transition-all"
              >
                <Scroll className="mr-3 h-6 w-6" />
                Read the PMA Agreement
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: WHAT IS THE PMA
          ═══════════════════════════════════════════════════════════════ */}
      <div className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                What Is a Private Membership Association?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                A PMA operates under the First Amendment right to freely assemble. It is a private,
                non-commercial body — not a business. Its members are not customers. Its offerings are
                not products. Everything exchanged within the association is governed by private agreement,
                not commercial regulation.
              </p>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.12} className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            {[
              {
                icon: Shield,
                title: "Private Jurisdiction",
                description:
                  "The PMA operates outside the commercial public sphere. Members enter by private agreement, not by public contract. This places the association — and its activities — under private, not statutory, jurisdiction.",
              },
              {
                icon: Scale,
                title: "Trust-Governed Structure",
                description:
                  "Ecclesia Basilikos is organized as a trust. Christ is the Grantor. The Trustee administers the corpus. Beneficiaries receive their share of the trust's educational, spiritual, and material resources.",
              },
              {
                icon: Crown,
                title: "Divine Covenant Authority",
                description:
                  "This assembly does not derive its authority from the state. It operates under the New Covenant — a higher jurisdiction. Members are recognized as royal priests, ambassadors, and stewards of an eternal kingdom.",
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
                This is not a church. Not a corporation. Not a club.{" "}
                <span className="text-royal-burgundy">It is a covenant assembly operating under trust law.</span>
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: THE TRUST STRUCTURE
          ═══════════════════════════════════════════════════════════════ */}
      <div className="py-28 marble-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 font-cinzel text-xs tracking-[0.3em] uppercase text-royal-burgundy bg-royal-burgundy/10 px-5 py-2 rounded-full mb-5">
                <Landmark className="w-3.5 h-3.5" />
                Trust Architecture
              </span>
              <h2 className="font-cinzel-decorative text-3xl md:text-5xl font-bold text-royal-navy mb-6">
                How the Trust Is Structured
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Ecclesia Basilikos operates through a layered trust framework. Each layer serves
                a distinct purpose — from divine authority down to individual stewardship.
              </p>
            </div>
          </RevealOnScroll>

          {/* Layer 1 — Covenant Charter */}
          <RevealOnScroll>
            <div className="max-w-5xl mx-auto mt-16">
              <Card className="royal-card hover:border-royal-gold transition-all group overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-5">
                    <div className="md:col-span-2 bg-gradient-to-br from-royal-navy to-royal-burgundy p-8 md:p-10 flex flex-col justify-center text-white">
                      <span className="inline-block self-start text-xs font-semibold text-royal-gold bg-royal-gold/15 px-3 py-1 rounded-full mb-4">
                        Layer 1
                      </span>
                      <Crown className="w-14 h-14 text-royal-gold mb-4" />
                      <h3 className="font-cinzel-decorative text-2xl md:text-3xl font-bold mb-2">
                        Covenant Charter
                      </h3>
                      <p className="text-sm text-royal-gold font-cinzel font-semibold">
                        Philosophy & Divine Authority
                      </p>
                    </div>
                    <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
                      <p className="text-gray-700 leading-relaxed mb-6">
                        The charter establishes the source of authority — the New Covenant — and the
                        mission of the assembly. It defines the Grantor (Christ), the purpose of the trust,
                        and the mandate under which all operations proceed. Nothing exists in this framework
                        without this foundation.
                      </p>
                      <ul className="space-y-3 mb-6">
                        {[
                          "Establishes divine covenant as the source of authority",
                          "Defines the Grantor, mission, and purpose of the trust",
                          "Anchors all activity in scriptural mandate",
                          "Supersedes all lower layers in governance",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </RevealOnScroll>

          {/* Layer 2 — Ecclesia Basilikos Trust */}
          <RevealOnScroll>
            <div className="max-w-5xl mx-auto mt-8">
              <Card className="royal-card hover:border-royal-gold transition-all group overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-5">
                    <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center order-2 md:order-1">
                      <p className="text-gray-700 leading-relaxed mb-6">
                        The central trust holds the corpus — all educational content, courses, downloads,
                        community resources, and financial contributions. The Trustee administers this corpus
                        with fiduciary duty to the beneficiaries. Every member who acquires beneficial interest
                        receives a Beneficial Unit — a 1/N share of the trust corpus.
                      </p>
                      <ul className="space-y-3 mb-6">
                        {[
                          "Holds and governs the trust corpus (all assets and content)",
                          "Trustee administers with fiduciary duty to beneficiaries",
                          "Each beneficiary receives a Beneficial Unit (1/N share)",
                          "Protected from external claims under trust law",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="md:col-span-2 bg-gradient-to-br from-royal-burgundy to-royal-navy p-8 md:p-10 flex flex-col justify-center text-white order-1 md:order-2">
                      <span className="inline-block self-start text-xs font-semibold text-royal-gold bg-royal-gold/15 px-3 py-1 rounded-full mb-4">
                        Layer 2
                      </span>
                      <Landmark className="w-14 h-14 text-royal-gold mb-4" />
                      <h3 className="font-cinzel-decorative text-2xl md:text-3xl font-bold mb-2">
                        Ecclesia Basilikos Trust
                      </h3>
                      <p className="text-sm text-royal-gold font-cinzel font-semibold">
                        Mission Anchor & Stewardship
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </RevealOnScroll>

          {/* Layer 3 — Private Membership Association */}
          <RevealOnScroll>
            <div className="max-w-5xl mx-auto mt-8">
              <Card className="royal-card hover:border-royal-gold transition-all group overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-5">
                    <div className="md:col-span-2 bg-gradient-to-br from-royal-navy to-royal-burgundy p-8 md:p-10 flex flex-col justify-center text-white">
                      <span className="inline-block self-start text-xs font-semibold text-royal-gold bg-royal-gold/15 px-3 py-1 rounded-full mb-4">
                        Layer 3
                      </span>
                      <Users className="w-14 h-14 text-royal-gold mb-4" />
                      <h3 className="font-cinzel-decorative text-2xl md:text-3xl font-bold mb-2">
                        The PMA
                      </h3>
                      <p className="text-sm text-royal-gold font-cinzel font-semibold">
                        The People Layer
                      </p>
                    </div>
                    <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
                      <p className="text-gray-700 leading-relaxed mb-6">
                        The Private Membership Association is where you enter. By accepting the PMA agreement,
                        you step into private jurisdiction. You are not a customer — you are a member of a
                        covenant body. Your rights within this assembly are governed by private agreement,
                        not commercial statute.
                      </p>
                      <ul className="space-y-3 mb-6">
                        {[
                          "Enter by private agreement — not public contract",
                          "First Amendment right to freely assemble",
                          "Members are beneficiaries — not customers or subscribers",
                          "All exchange governed by covenant, not commerce",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Link href="/pma-agreement">
                        <div className="flex items-center gap-2 text-royal-gold font-cinzel text-sm font-semibold group-hover:gap-3 transition-all">
                          Read the Full PMA Agreement
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: KINGDOM vs BABYLON
          ═══════════════════════════════════════════════════════════════ */}
      <RevealOnScroll>
        <div className="py-24 bg-gradient-to-r from-royal-burgundy via-royal-navy to-royal-burgundy">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-white mb-6">
                Babylon's System vs. The Kingdom Model
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                The world operates under one framework. This assembly operates under another.
                The PMA exists to formalize that separation — lawfully.
              </p>
            </div>

            <StaggerContainer staggerDelay={0.15} className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  before: "Commercial jurisdiction — regulated by statute",
                  after: "Private jurisdiction — governed by covenant agreement",
                  icon: Scale,
                },
                {
                  before: "Customers purchasing products and services",
                  after: "Beneficiaries receiving their share of the trust corpus",
                  icon: Users,
                },
                {
                  before: "Corporate structure — owned by shareholders",
                  after: "Trust structure — administered for beneficiaries",
                  icon: Building,
                },
                {
                  before: "Authority derived from the state",
                  after: "Authority derived from the Grantor under divine covenant",
                  icon: Crown,
                },
                {
                  before: "Identity defined by federal citizenship",
                  after: "Identity defined by covenant standing and royal priesthood",
                  icon: Globe,
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
          SECTION 5: WHAT THE TRUST PROVIDES
          ═══════════════════════════════════════════════════════════════ */}
      <div className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                What the Trust Provides
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                The trust corpus contains everything the assembly has built — education,
                resources, community, and tools. Beneficiaries access these according to
                their level of interest.
              </p>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {[
              {
                icon: Banknote,
                text: "Lawful money redemption education — how to exercise 12 USC § 411",
              },
              {
                icon: Shield,
                text: "Trust law education — separating legal title from beneficial interest",
              },
              {
                icon: Globe,
                text: "State-citizen passport guidance — reclaiming your political status",
              },
              {
                icon: FileText,
                text: "Trust documents, templates, and administrative tools",
              },
              {
                icon: BookOpen,
                text: "Full course library — structured lessons across all pillars",
              },
              {
                icon: Lock,
                text: "Proof Vault — secure document storage and verification",
              },
              {
                icon: Users,
                text: "Community forum — fellowship, guidance, and shared learning",
              },
              {
                icon: Key,
                text: "Beneficial Unit certificate — your 1/N share of the trust corpus",
              },
              {
                icon: Landmark,
                text: "Trust structure education — charter, operational trusts, and governance",
              },
              {
                icon: Eye,
                text: "Case law references — Slaughter-House Cases, Cruikshank, and more",
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
          SECTION 6: PATH TO BENEFICIAL INTEREST
          ═══════════════════════════════════════════════════════════════ */}
      <div className="py-24 marble-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                The Path to Beneficial Interest
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Entry into the assembly is open to all. Acquiring full beneficial interest
                is a deliberate step — a covenant commitment, not a commercial transaction.
              </p>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.2} className="max-w-3xl mx-auto space-y-6">
            {/* Step 1 — Trust User */}
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
                          Enter as Trust User
                        </h3>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                          <CircleDot className="w-3 h-3" />
                          Free
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-3">
                        Create an account and begin learning. Access the trust pillar courses,
                        download foundational documents, read the forum, and track your progress.
                        No contribution required. No obligation.
                      </p>
                      <Link href="/signup" className="text-xs font-cinzel font-semibold text-royal-gold hover:text-royal-burgundy transition-colors">
                        Create Free Account →
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 2 — Read the Agreement */}
            <motion.div variants={staggerItemVariants}>
              <Card className="border border-gray-200 hover:border-royal-gold/30 transition-all">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-full bg-royal-burgundy/20 flex items-center justify-center flex-shrink-0">
                      <span className="font-cinzel text-lg font-bold text-royal-burgundy">02</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-cinzel text-xl font-bold text-royal-navy">
                          Study the PMA Agreement
                        </h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-3">
                        Read and understand the Private Membership Association agreement.
                        It defines the trust, the roles (Grantor, Trustee, Beneficiary),
                        the trust corpus, and the terms of beneficial interest. Know what
                        you are entering before you enter.
                      </p>
                      <Link href="/pma-agreement" className="text-xs font-cinzel font-semibold text-royal-gold hover:text-royal-burgundy transition-colors">
                        Read PMA Agreement →
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 3 — Acquire Beneficial Interest */}
            <motion.div variants={staggerItemVariants}>
              <Card className="border border-gray-200 hover:border-royal-gold/30 transition-all">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-full bg-royal-burgundy/20 flex items-center justify-center flex-shrink-0">
                      <span className="font-cinzel text-lg font-bold text-royal-burgundy">03</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-cinzel text-xl font-bold text-royal-navy">
                          Acquire Beneficial Interest
                        </h3>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-royal-burgundy bg-royal-burgundy/10 px-3 py-1 rounded-full">
                          PMA Beneficiary
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-3">
                        Make a one-time trust contribution of $500 (or $50 × 10 months).
                        Accept the PMA agreement and receive your Beneficial Unit — a 1/N share
                        of the entire trust corpus. Your interest is permanent. It never downgrades.
                      </p>
                      <Link href="/pricing" className="text-xs font-cinzel font-semibold text-royal-gold hover:text-royal-burgundy transition-colors">
                        View Contribution Options →
                      </Link>
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
                q: "Is a Private Membership Association legal?",
                a: "Yes. The right to freely assemble is protected under the First Amendment. PMAs have been upheld in numerous court decisions. The key is proper structure, genuine private agreement, and non-commercial purpose — all of which Ecclesia Basilikos maintains.",
              },
              {
                q: "What is a Beneficial Unit?",
                a: "A Beneficial Unit is your share of the trust corpus. When you acquire beneficial interest, you receive one unit. Its value is calculated as 1/N, where N is the total number of active beneficiaries. As the trust corpus grows, so does the value underlying each unit.",
              },
              {
                q: "Is the $500 contribution a payment for services?",
                a: "No. It is a trust contribution — not a purchase. You are contributing to the trust corpus and in return acquiring beneficial interest in that corpus. This is a trust relationship, not a commercial transaction. The distinction is fundamental to the PMA structure.",
              },
              {
                q: "Can my beneficial interest be revoked?",
                a: "Your beneficial interest is permanent. Even if you chose the $50 × 10 installment plan and stop contributing early, your membership never downgrades. Once established, your standing within the trust is irrevocable.",
              },
              {
                q: "What is the three-pillar foundation?",
                a: "The three pillars — Lawful Money Redemption, Trust & Asset Protection, and State-Citizen Passport — are the core educational tracks. They address the three areas where most people are unknowingly operating under the wrong legal framework: money, property, and political status.",
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
          SECTION 8: MEMBERSHIP TIERS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="py-24 marble-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-4">
                Two Tiers of Interest
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                General access is free. Full beneficial interest requires a trust contribution.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <RevealOnScroll>
              <Card className="royal-card h-full">
                <CardContent className="p-8">
                  <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-2">General Interest — Trust User</h3>
                  <p className="text-3xl font-bold text-royal-navy mb-4">$0</p>
                  <ul className="space-y-2 mb-6">
                    {["Trust pillar course access", "Foundational downloads", "Forum reading", "Progress tracking"].map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup">
                    <Button variant="outline" className="w-full font-cinzel">Enter the Assembly</Button>
                  </Link>
                </CardContent>
              </Card>
            </RevealOnScroll>

            <RevealOnScroll delay={0.15}>
              <Card className="royal-card h-full border-2 border-royal-gold/30">
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-cinzel text-xl font-bold text-royal-navy">PMA Beneficiary</h3>
                  </div>
                  <p className="text-3xl font-bold text-royal-navy mb-1">$500</p>
                  <p className="text-sm text-gray-500 mb-4">one-time contribution · or $50 × 10</p>
                  <ul className="space-y-2 mb-6">
                    {["All courses & lessons across every pillar", "All downloads, templates & trust documents", "Forum posting & community participation", "Proof Vault — secure document storage", "Beneficial Unit certificate (1/N share)"].map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-royal-gold flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/pricing">
                    <Button className="w-full bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold">
                      Acquire Beneficial Interest <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </RevealOnScroll>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 9: FINAL CTA
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
              The Assembly Is Open
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-4">
              A covenant body. A trust-governed assembly. A kingdom embassy.
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
                <Link href={ctaHref}>
                  <Button
                    size="lg"
                    className="royal-button text-xl px-12 py-7 shadow-2xl hover:scale-105 transition-transform"
                  >
                    <Crown className="mr-3 h-7 w-7" />
                    {ctaHref === "/signup" ? "Enter the Assembly" : "Go to Dashboard"}
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
              </div>
              <Link href="/pma-agreement">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-xl px-12 py-7 bg-white/15 border-royal-gold/50 text-royal-gold hover:bg-white/25 transition-all"
                >
                  <Scroll className="mr-3 h-7 w-7" />
                  PMA Agreement
                </Button>
              </Link>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.7}>
            <p className="text-gray-400 text-base max-w-xl mx-auto leading-relaxed mt-10">
              Ecclesia Basilikos is a Private Membership Association providing education and community
              under divine covenant authority — not legal, financial, or tax advice.
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
}
