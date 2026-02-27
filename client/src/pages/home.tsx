import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import {
  Crown, Shield, Heart, Users, BookOpen, Cross,
  Key, Home as HomeIcon, ScrollText
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useCtaHref } from "@/hooks/useCtaHref";
import StaggerContainer, {
  staggerItemVariants,
  emphasisItemVariants,
} from "@/components/ui/stagger-container";

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
      {/* Section 1: Hero */}
      <div className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy py-24 md:py-36 animate-hero-gradient">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            className="font-cinzel text-xs md:text-sm tracking-[0.3em] uppercase text-white mb-4"
            initial={heroInitial}
            animate={heroAnimate}
            transition={heroTransition(0)}
          >
            The New Covenant · Identity · Stewardship
          </motion.p>
          <motion.h1
            className="font-cinzel-decorative text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            initial={heroInitial}
            animate={heroAnimate}
            transition={heroTransition(0)}
          >
            Sonship Was Restored So Stewardship Could Begin
          </motion.h1>

          <motion.h2
            className="font-cinzel text-2xl md:text-3xl animate-gold-shimmer mb-10"
            initial={heroInitial}
            animate={heroAnimate}
            transition={heroTransition(0.2)}
          >
            You Were Meant to Live From Sonship
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-8"
            initial={heroInitial}
            animate={heroAnimate}
            transition={heroTransition(0.4)}
          >
            The New Covenant was not established to reform how you function within the old creation. It was established to inaugurate a new estate of life — one where identity, authority, provision, and security are received, not requested.
          </motion.p>

          <motion.div
            className="bg-white/10 backdrop-blur-sm border border-royal-gold/30 rounded-lg p-6 mb-10 max-w-2xl mx-auto"
            initial={heroInitial}
            animate={heroAnimate}
            transition={heroTransition(0.7)}
          >
            <p className="font-georgia italic text-gray-200 text-lg">
              "But as many as received him, to them gave he power to become the sons of God, even to them that believe on his name."
            </p>
            <p className="text-royal-gold mt-2 font-semibold">— John 1:12</p>
          </motion.div>

          <motion.div
            className="inline-block rounded-lg animate-glow-pulse"
            initial={heroInitial}
            animate={heroAnimate}
            transition={heroTransition(1.0)}
          >
            <Link href={ctaHref}>
              <Button
                size="lg"
                className="royal-button text-xl px-12 py-6 shadow-2xl hover:scale-105 transition-transform"
              >
                <BookOpen className="mr-3 h-7 w-7" />
                Join the Covenant Path
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Section 2: Why Something Always Felt Off */}
      <div className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                Why Something Always Felt Off
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                You were told you were sons and daughters. You were called heirs. You were named ambassadors. But the life you were given to live never matched the identity you were given to carry.
              </p>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.12} className="space-y-6 max-w-3xl mx-auto mb-12">
            {[
              { called: "Called sons", lived: "but lived as dependents" },
              { called: "Called heirs", lived: "but operated as applicants" },
              { called: "Called ambassadors", lived: "but moved by permission" },
              { called: "Called free", lived: "but structured lives around control" },
            ].map((item, index) => (
              <motion.div key={index} variants={staggerItemVariants} className="border-l-4 border-royal-burgundy pl-6 py-3">
                <p className="text-lg text-gray-800">
                  <span className="font-semibold text-royal-navy">{item.called}</span> — {item.lived}.
                </p>
              </motion.div>
            ))}
          </StaggerContainer>

          <RevealOnScroll delay={0.3}>
            <div className="text-center">
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                The issue was never faith. It was never sincerity.{" "}
                <span className="font-bold text-royal-navy">It was alignment.</span>
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* Section 3: Two Ways of Existing */}
      <div className="py-24 marble-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                Two Ways of Existing
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Scripture speaks of two estates — one born of the flesh, one born of the Spirit. These are not preferences. They are foundations. Everything built on them follows their nature.
              </p>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.2} className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <motion.div variants={staggerItemVariants}>
              <Card className="royal-card h-full">
                <CardContent className="p-8">
                  <h3 className="font-cinzel text-xl font-bold text-royal-burgundy mb-6">The Former Estate</h3>
                  <ul className="space-y-3 text-gray-700 text-lg">
                    <li>Representation by proxy</li>
                    <li>Administration by institution</li>
                    <li>Security by contract</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={staggerItemVariants}>
              <Card className="royal-card h-full">
                <CardContent className="p-8">
                  <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-6">The New Estate</h3>
                  <ul className="space-y-3 text-gray-700 text-lg">
                    <li>Sonship by the Spirit</li>
                    <li>Inheritance by covenant</li>
                    <li>Security by trust</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerContainer>

          <RevealOnScroll>
            <div className="bg-white/60 backdrop-blur-sm border border-royal-gold/30 rounded-lg p-6 max-w-2xl mx-auto mb-8">
              <p className="font-georgia italic text-gray-700 text-lg">
                "That which is born of the flesh is flesh; and that which is born of the Spirit is spirit."
              </p>
              <p className="text-royal-burgundy mt-2 font-semibold">— John 3:6</p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <div className="text-center">
              <p className="text-xl font-semibold text-royal-navy max-w-3xl mx-auto">
                The New Covenant does not improve the former. It establishes the latter.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* Section 4: How the Father Restored Sonship */}
      <RevealOnScroll>
        <div className="py-24 bg-gradient-to-r from-royal-burgundy via-royal-navy to-royal-burgundy">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Cross className="w-20 h-20 text-royal-gold mx-auto mb-8 animate-gentle-float" />
            <h2 className="font-cinzel-decorative text-3xl md:text-5xl font-bold text-white mb-8">
              How the Father Restored Sonship
            </h2>

            <div className="space-y-8 max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                Christ did not come to negotiate with the former estate. He came to bear its full liability — every debt, every claim, every bond — and to exhaust it entirely in His body on the cross.
              </p>

              <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                In doing so, He did not reform the old creation. He closed it. And He rose to establish a new estate — one rooted in sonship, sealed by the Spirit, and administered by covenant.
              </p>

              <div className="bg-white/10 backdrop-blur-sm border border-royal-gold/30 rounded-lg p-6 max-w-2xl mx-auto">
                <p className="font-georgia italic text-gray-200 text-lg">
                  "Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new."
                </p>
                <p className="text-royal-gold mt-2 font-semibold">— 2 Corinthians 5:17</p>
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>

      {/* Section 5: This Is Not a Movement */}
      <div className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <div className="royal-divider mb-12"></div>
          </RevealOnScroll>

          <RevealOnScroll>
            <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-10">
              This Is Not a Movement
            </h2>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.25} initialDelay={0.2} className="space-y-6 text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            <motion.p variants={staggerItemVariants}>This is not a protest.</motion.p>
            <motion.p variants={staggerItemVariants}>This is not a workaround.</motion.p>
            <motion.p variants={staggerItemVariants}>This is not a strategy.</motion.p>
            <motion.p variants={emphasisItemVariants} className="text-2xl font-semibold text-royal-navy pt-4">
              This is not resistance. It is <span className="text-royal-burgundy">alignment</span>.
            </motion.p>
          </StaggerContainer>

          <RevealOnScroll delay={1.2}>
            <div className="royal-divider mt-12"></div>
          </RevealOnScroll>
        </div>
      </div>

      {/* Section 6: Life Ordered by Trust */}
      <div className="py-24 marble-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                Life Ordered by Trust
              </h2>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {[
              {
                icon: Heart,
                title: "Identity is received, not asserted",
              },
              {
                icon: Shield,
                title: "Authority is exercised, not demanded",
              },
              {
                icon: Crown,
                title: "Provision is stewarded, not owned",
              },
              {
                icon: HomeIcon,
                title: "Security is rested in, not defended",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={staggerItemVariants}>
                <Card className="royal-card h-full">
                  <CardContent className="p-8 flex items-start gap-5">
                    <item.icon className="w-10 h-10 text-royal-burgundy flex-shrink-0 mt-1" />
                    <p className="text-lg text-gray-800 font-semibold leading-relaxed">
                      {item.title}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </StaggerContainer>

          <RevealOnScroll delay={0.3}>
            <div className="text-center">
              <p className="text-xl font-semibold text-royal-navy max-w-3xl mx-auto">
                Structure follows identity. It never precedes it.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* Section 7: How You Know You're Living From the Right Estate */}
      <div className="py-24 bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-white mb-10">
              How You Know You're Living From the Right Estate
            </h2>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.3} className="space-y-8 text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
            <motion.p variants={staggerItemVariants}>
              When you no longer feel the need to defend what God has given you — you are resting.
            </motion.p>
            <motion.p variants={staggerItemVariants}>
              When provision does not produce anxiety, and authority does not produce arrogance — you are aligned.
            </motion.p>
            <motion.p variants={staggerItemVariants}>
              When your response to pressure is not fear, but peace — you are living from the new estate.
            </motion.p>
          </StaggerContainer>

          <RevealOnScroll delay={1.2}>
            <p className="text-2xl md:text-3xl text-royal-gold font-semibold mt-12 max-w-3xl mx-auto">
              The fruit of sonship is not urgency — it is peace.
            </p>
          </RevealOnScroll>
        </div>
      </div>

      {/* Section 8: Life Ordered by Covenant — Pathway Cards */}
      <div className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                Life Ordered by Covenant
              </h2>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div variants={staggerItemVariants}>
              <Link href="/mandate">
                <Card className="royal-card hover:border-royal-gold transition-all cursor-pointer h-full">
                  <CardContent className="p-8">
                    <ScrollText className="w-12 h-12 text-royal-burgundy mb-4" />
                    <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-3">The Mandate</h3>
                    <p className="text-gray-700">
                      Understanding the divine commission of sonship.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={staggerItemVariants}>
              <Link href="/nation">
                <Card className="royal-card hover:border-royal-gold transition-all cursor-pointer h-full">
                  <CardContent className="p-8">
                    <Crown className="w-12 h-12 text-royal-burgundy mb-4" />
                    <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-3">Ecclesia</h3>
                    <p className="text-gray-700">
                      Life as the called-out assembly, not isolated believers.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={staggerItemVariants}>
              <Link href="/courses">
                <Card className="royal-card hover:border-royal-gold transition-all cursor-pointer h-full">
                  <CardContent className="p-8">
                    <BookOpen className="w-12 h-12 text-royal-burgundy mb-4" />
                    <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-3">Royal Academy</h3>
                    <p className="text-gray-700">
                      Formation in identity, authority, and stewardship.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={staggerItemVariants}>
              <Link href="/repository">
                <Card className="royal-card hover:border-royal-gold transition-all cursor-pointer h-full">
                  <CardContent className="p-8">
                    <Shield className="w-12 h-12 text-royal-burgundy mb-4" />
                    <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-3">Covenant Repository</h3>
                    <p className="text-gray-700">
                      Records, declarations, and biblical comparisons.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={staggerItemVariants}>
              <Link href="/forum">
                <Card className="royal-card hover:border-royal-gold transition-all cursor-pointer h-full">
                  <CardContent className="p-8">
                    <Users className="w-12 h-12 text-royal-burgundy mb-4" />
                    <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-3">Embassy Forum</h3>
                    <p className="text-gray-700">
                      Fellowship among those walking this path.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div variants={staggerItemVariants}>
              <Link href="/contact">
                <Card className="royal-card hover:border-royal-gold transition-all cursor-pointer h-full">
                  <CardContent className="p-8">
                    <Key className="w-12 h-12 text-royal-burgundy mb-4" />
                    <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-3">Stewardship Onboarding</h3>
                    <p className="text-gray-700">
                      Guided alignment of life, role, and responsibility.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </StaggerContainer>
        </div>
      </div>

      {/* Section 9: The Invitation */}
      <div className="py-32 bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <h2 className="font-cinzel-decorative text-4xl md:text-5xl font-bold text-white mb-10">
              The Invitation
            </h2>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.2} className="space-y-6 text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto mb-12">
            <motion.p variants={staggerItemVariants}>You are not escaping anything.</motion.p>
            <motion.p variants={staggerItemVariants}>You are not fighting anything.</motion.p>
            <motion.p variants={staggerItemVariants}>You are not fixing anything.</motion.p>
            <motion.p variants={emphasisItemVariants} className="text-2xl md:text-3xl text-royal-gold font-semibold pt-4">
              You are aligning with what the Father has already established.
            </motion.p>
          </StaggerContainer>

          <RevealOnScroll delay={0.8}>
            <div className="inline-block rounded-lg animate-glow-pulse">
              <Link href={ctaHref}>
                <Button
                  size="lg"
                  className="royal-button text-2xl px-16 py-8 shadow-2xl hover:scale-105 transition-transform"
                >
                  <BookOpen className="mr-3 h-8 w-8" />
                  Join the Covenant Path
                </Button>
              </Link>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={1.0}>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mt-10">
              The covenant was established before you arrived. Alignment simply allows you to live from it.
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
}
