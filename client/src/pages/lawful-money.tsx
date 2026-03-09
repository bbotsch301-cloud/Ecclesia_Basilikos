import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import {
  Banknote, Scale, FileText, BookOpen, AlertTriangle,
  CheckCircle, ArrowRight, ScrollText, Shield, Info
} from "lucide-react";
import { motion } from "framer-motion";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";
import { usePageTitle } from "@/hooks/usePageTitle";
import StaggerContainer, {
  staggerItemVariants,
  emphasisItemVariants,
} from "@/components/ui/stagger-container";

export default function LawfulMoney() {
  usePageTitle("Lawful Money Redemption");

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy pt-20 pb-24 md:pt-28 md:pb-36 animate-hero-gradient">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Banknote className="w-16 h-16 md:w-20 md:h-20 text-royal-gold mx-auto mb-6 animate-gentle-float" />
          </motion.div>

          <motion.p
            className="font-cinzel text-xs md:text-sm tracking-[0.3em] uppercase text-white/80 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Pillar One
          </motion.p>

          <motion.h1
            className="font-cinzel-decorative text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Lawful Money Redemption
          </motion.h1>

          <motion.h2
            className="font-cinzel text-xl md:text-2xl animate-gold-shimmer mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Title 12, United States Code, Section 411
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Every Federal Reserve Note carries a lawful obligation. You have the
            statutory right to redeem those notes for lawful money of the United
            States. This is not theory — it is codified law.
          </motion.p>
        </div>
      </div>

      {/* What Is Lawful Money? */}
      <div className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                What Is Lawful Money?
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Lawful money is the constitutionally recognized currency of the
                United States — distinct from Federal Reserve Notes, which are
                debt instruments issued by a private banking system. The
                distinction is not academic. It carries legal, tax, and
                jurisdictional implications.
              </p>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div variants={staggerItemVariants}>
              <Card className="royal-card h-full border-l-4 border-l-royal-burgundy">
                <CardContent className="p-8">
                  <h3 className="font-cinzel text-lg font-bold text-royal-burgundy mb-4">
                    Federal Reserve Notes
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-royal-burgundy flex-shrink-0 mt-0.5" />
                      <span>Debt-based instruments — every note is a liability</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-royal-burgundy flex-shrink-0 mt-0.5" />
                      <span>Issued by the Federal Reserve, a private corporation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-royal-burgundy flex-shrink-0 mt-0.5" />
                      <span>Subject to inflation, devaluation, and monetary policy</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-royal-burgundy flex-shrink-0 mt-0.5" />
                      <span>Creates taxable events under presumption of private credit use</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={staggerItemVariants}>
              <Card className="royal-card h-full border-l-4 border-l-royal-navy">
                <CardContent className="p-8">
                  <h3 className="font-cinzel text-lg font-bold text-royal-navy mb-4">
                    Lawful Money (12 USC 411)
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Non-debt currency — represents actual value, not liability</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Authorized by Congress under constitutional authority</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Redemption is a statutory right — not a request or petition</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>May remove the presumption of private credit usage</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerContainer>
        </div>
      </div>

      {/* The Statute */}
      <div className="py-24 marble-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                The Statute: 12 USC § 411
              </h2>
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <Card className="royal-card max-w-4xl mx-auto mb-12">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start gap-4 mb-6">
                  <ScrollText className="w-8 h-8 text-royal-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-royal-navy mb-2">
                      Federal Reserve Act — Section 16
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      Title 12, United States Code, Section 411
                    </p>
                  </div>
                </div>
                <blockquote className="border-l-4 border-royal-gold pl-6 py-2">
                  <p className="font-georgia italic text-gray-800 text-lg leading-relaxed">
                    "Federal reserve notes, to be issued at the discretion of the
                    Board of Governors of the Federal Reserve System for the
                    purpose of making advances to Federal reserve banks… shall be
                    obligations of the United States and shall be receivable by
                    all national and member banks and Federal reserve banks and
                    for all taxes, customs, and other public dues. They shall be
                    redeemed in lawful money on demand at the Treasury Department
                    of the United States, in the city of Washington, District of
                    Columbia, or at any Federal Reserve bank."
                  </p>
                </blockquote>
              </CardContent>
            </Card>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed">
                The statute is clear:{" "}
                <span className="font-bold text-royal-navy">
                  Federal Reserve Notes shall be redeemed in lawful money on demand.
                </span>{" "}
                This is not an interpretation. It is the express language of the law.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* Why It Matters */}
      <RevealOnScroll>
        <div className="py-24 bg-gradient-to-r from-royal-burgundy via-royal-navy to-royal-burgundy">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Scale className="w-16 h-16 text-royal-gold mx-auto mb-6" />
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-white mb-6">
                Why Lawful Money Redemption Matters
              </h2>
              <p className="text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed">
                When you use Federal Reserve Notes without redemption, a legal
                presumption arises that you are voluntarily using private credit.
                That presumption carries obligations. Redemption changes the
                character of the transaction.
              </p>
            </div>

            <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: FileText,
                  title: "Legal Standing",
                  description:
                    "Redemption establishes your position under public law rather than private banking agreements. It places you within the constitutional framework of money.",
                },
                {
                  icon: Shield,
                  title: "Tax Implications",
                  description:
                    "The use of private credit creates specific tax obligations. Lawful money redemption may affect how income is characterized under the Internal Revenue Code.",
                },
                {
                  icon: Scale,
                  title: "Jurisdictional Clarity",
                  description:
                    "Operating in lawful money clarifies which jurisdiction governs your transactions — public constitutional law versus private commercial agreements.",
                },
              ].map((item, index) => (
                <motion.div key={index} variants={staggerItemVariants}>
                  <Card className="bg-white/10 backdrop-blur-sm border border-royal-gold/30 h-full">
                    <CardContent className="p-8 text-center">
                      <item.icon className="w-12 h-12 text-royal-gold mx-auto mb-4" />
                      <h3 className="font-cinzel text-lg font-bold text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-200 leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </RevealOnScroll>

      {/* How to Redeem */}
      <div className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                How Lawful Money Redemption Works
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Redemption is exercised through a demand — a non-negotiable
                restrictive endorsement on the instrument of deposit. It is not
                a petition. It is the exercise of a statutory right.
              </p>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.2} className="max-w-4xl mx-auto space-y-6">
            {[
              {
                step: "01",
                title: "Understand the Endorsement",
                description:
                  "The restrictive endorsement is placed on the back of checks, deposit slips, or other negotiable instruments. It invokes 12 USC 411 and demands redemption in lawful money.",
              },
              {
                step: "02",
                title: "The Endorsement Language",
                description:
                  "A proper endorsement reads: \"Redeemed in Lawful Money Pursuant to Title 12 USC §411\" — written above your signature on all deposits. This is a demand, not a request.",
              },
              {
                step: "03",
                title: "Maintain Consistent Practice",
                description:
                  "Every deposit, every paycheck, every transaction — consistency establishes the pattern and reinforces your standing. This is not a one-time event but a continuous practice.",
              },
              {
                step: "04",
                title: "Document Everything",
                description:
                  "Keep copies of all endorsed instruments. Maintain a ledger of redemption activity. Documentation is essential for establishing your lawful money position over time.",
              },
              {
                step: "05",
                title: "Understand the Tax Implications",
                description:
                  "Lawful money redemption may affect your tax reporting obligations. Research the relationship between 12 USC 411, 26 USC (Internal Revenue Code), and the definition of gross income.",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={staggerItemVariants}>
                <Card className="royal-card">
                  <CardContent className="p-6 md:p-8 flex items-start gap-6">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-royal-navy flex items-center justify-center">
                      <span className="font-cinzel text-lg font-bold text-royal-gold">
                        {item.step}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-cinzel text-lg font-bold text-royal-navy mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* Key Distinctions */}
      <div className="py-24 marble-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                Key Distinctions to Understand
              </h2>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.12} className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                term: "Federal Reserve Notes vs. Lawful Money",
                explanation:
                  "FRNs are obligations (debts) of the United States issued through the Federal Reserve. Lawful money is non-debt currency authorized under the Constitution. They are not the same thing.",
              },
              {
                term: "Private Credit vs. Public Money",
                explanation:
                  "When you deposit FRNs without redemption, you are presumed to be using private credit — the Federal Reserve's credit system. Redemption shifts the transaction to public money.",
              },
              {
                term: "Voluntary vs. Mandatory",
                explanation:
                  "The Federal Reserve system operates on voluntary participation. Using private credit is a choice. Demanding lawful money is exercising the alternative that Congress provided.",
              },
              {
                term: "Endorsement vs. Protest",
                explanation:
                  "Lawful money redemption is not a protest against the system. It is the lawful exercise of a statutory right within the system — using the law as written.",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={staggerItemVariants}>
                <Card className="royal-card h-full">
                  <CardContent className="p-6">
                    <h3 className="font-cinzel text-base font-bold text-royal-navy mb-3">
                      {item.term}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {item.explanation}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* Important Notice */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <Card className="border-2 border-royal-gold/50">
              <CardContent className="p-8 md:p-10">
                <div className="flex items-start gap-4">
                  <Info className="w-8 h-8 text-royal-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-royal-navy mb-3">
                      Important Notice
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      The information presented here is for educational purposes.
                      Lawful money redemption under 12 USC 411 is a matter of
                      statutory law. We encourage all members to study the statute
                      independently, consult qualified counsel where appropriate,
                      and make informed decisions based on their own understanding
                      of the law.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Ecclesia Basilikos provides education and community — not
                      legal or tax advice. Your journey in lawful money
                      redemption is your own, supported by knowledge and fellowship.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RevealOnScroll>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-white mb-6">
              Begin Your Redemption Journey
            </h2>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed mb-10">
              Lawful money redemption is the first step in realigning your
              financial standing. Combined with trust protection and proper
              status documentation, it forms the complete foundation.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/trust-assets">
                <Button
                  size="lg"
                  className="royal-button text-lg px-10 py-6 shadow-2xl hover:scale-105 transition-transform"
                >
                  <Shield className="mr-3 h-6 w-6" />
                  Next: Trust & Asset Protection
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-6 border-royal-gold/50 text-white hover:bg-white/10 transition-all"
                >
                  <BookOpen className="mr-3 h-6 w-6" />
                  Get Guidance
                </Button>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
}
