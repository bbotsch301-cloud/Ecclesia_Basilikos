import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import {
  Shield, Lock, FileText, BookOpen, ArrowRight,
  Building, Key, CheckCircle, AlertTriangle, Landmark,
  Users, Info, Scale
} from "lucide-react";
import { motion } from "framer-motion";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";
import { usePageTitle } from "@/hooks/usePageTitle";
import StaggerContainer, {
  staggerItemVariants,
} from "@/components/ui/stagger-container";

export default function TrustAssets() {
  usePageTitle("Trust & Asset Protection");

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
            <Shield className="w-16 h-16 md:w-20 md:h-20 text-royal-gold mx-auto mb-6 animate-gentle-float" />
          </motion.div>

          <motion.p
            className="font-cinzel text-xs md:text-sm tracking-[0.3em] uppercase text-white/80 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Pillar Two
          </motion.p>

          <motion.h1
            className="font-cinzel-decorative text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Securing Assets Through Trust
          </motion.h1>

          <motion.h2
            className="font-cinzel text-xl md:text-2xl animate-gold-shimmer mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            What Was Given in Love Is Now Held in Trust
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            A properly structured trust is not a scheme or loophole. It is one
            of the oldest and most recognized legal instruments in the common
            law — and it is how assets are lawfully protected, managed, and
            transferred outside of direct personal liability.
          </motion.p>
        </div>
      </div>

      {/* Why a Trust */}
      <div className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                Why Assets Must Be Held in Trust
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                In the current system, anything held in your personal name is
                subject to liens, levies, judgments, and claims. You do not
                truly own what can be taken from you by operation of law. A
                trust separates legal title from beneficial interest — placing
                assets beyond the reach of personal liability.
              </p>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div variants={staggerItemVariants}>
              <Card className="royal-card h-full border-l-4 border-l-royal-burgundy">
                <CardContent className="p-8">
                  <h3 className="font-cinzel text-lg font-bold text-royal-burgundy mb-4">
                    Without Trust Protection
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-royal-burgundy flex-shrink-0 mt-0.5" />
                      <span>Assets held in personal name — fully exposed to creditors</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-royal-burgundy flex-shrink-0 mt-0.5" />
                      <span>Subject to probate — public, costly, and time-consuming</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-royal-burgundy flex-shrink-0 mt-0.5" />
                      <span>Vulnerable to lawsuits, liens, and government claims</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-royal-burgundy flex-shrink-0 mt-0.5" />
                      <span>No separation between you and your property in the eyes of the law</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={staggerItemVariants}>
              <Card className="royal-card h-full border-l-4 border-l-royal-navy">
                <CardContent className="p-8">
                  <h3 className="font-cinzel text-lg font-bold text-royal-navy mb-4">
                    With Trust Protection
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Assets held by the trust — separate legal entity</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Avoids probate — private, efficient, and immediate</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Shielded from personal judgments and creditor claims</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Clear separation of legal title and beneficial interest</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerContainer>
        </div>
      </div>

      {/* Trust Structure */}
      <div className="py-24 marble-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                Understanding Trust Structure
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                A trust is a fiduciary arrangement with three essential roles.
                Understanding these roles is the foundation of using a trust
                effectively.
              </p>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.2} className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            {[
              {
                icon: Key,
                title: "The Grantor",
                subtitle: "Creator of the Trust",
                description:
                  "The grantor establishes the trust, defines its terms, and transfers assets into it. The grantor's intent governs the trust's purpose and operation. In the covenant framework, Christ is the ultimate Grantor of the New Covenant trust.",
              },
              {
                icon: Building,
                title: "The Trustee",
                subtitle: "Administrator of the Trust",
                description:
                  "The trustee holds legal title to the trust assets and administers them according to the trust instrument. The trustee has a fiduciary duty — the highest obligation known in law — to act in the beneficiary's interest.",
              },
              {
                icon: Users,
                title: "The Beneficiary",
                subtitle: "Recipient of the Benefits",
                description:
                  "The beneficiary holds equitable (beneficial) interest in the trust assets. They receive the benefits of the trust without holding legal title — which is precisely what provides the protection.",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={staggerItemVariants}>
                <Card className="royal-card h-full">
                  <CardContent className="p-8 text-center">
                    <item.icon className="w-14 h-14 text-royal-burgundy mx-auto mb-4" />
                    <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-royal-burgundy font-semibold mb-4">
                      {item.subtitle}
                    </p>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </StaggerContainer>

          <RevealOnScroll>
            <div className="bg-white/80 backdrop-blur-sm border border-royal-gold/30 rounded-lg p-8 max-w-3xl mx-auto text-center">
              <p className="font-georgia italic text-gray-700 text-lg leading-relaxed">
                "In whom also we have obtained an inheritance, being predestinated
                according to the purpose of him who worketh all things after the
                counsel of his own will."
              </p>
              <p className="text-royal-burgundy mt-3 font-semibold">— Ephesians 1:11</p>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* Types of Trusts */}
      <RevealOnScroll>
        <div className="py-24 bg-gradient-to-r from-royal-burgundy via-royal-navy to-royal-burgundy">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Landmark className="w-16 h-16 text-royal-gold mx-auto mb-6" />
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-white mb-6">
                Types of Trusts We Educate On
              </h2>
              <p className="text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Not all trusts are equal. The type of trust you need depends on
                your goals, your assets, and the level of protection required.
              </p>
            </div>

            <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  title: "Irrevocable Trust",
                  description:
                    "Once established, the grantor relinquishes control over the assets. This provides the strongest asset protection because the assets are no longer part of the grantor's estate.",
                  highlight: "Strongest protection",
                },
                {
                  title: "Express Trust",
                  description:
                    "Created by the express intention of the grantor with clearly defined terms, beneficiaries, and purposes. This is the most common and versatile trust structure.",
                  highlight: "Most versatile",
                },
                {
                  title: "Common Law Trust",
                  description:
                    "Established under common law principles rather than statutory code. Recognized in equity and rooted in centuries of legal precedent, predating modern statutory trusts.",
                  highlight: "Deepest legal roots",
                },
                {
                  title: "Land Trust",
                  description:
                    "Specifically designed to hold real property. The trust holds title to the land while the beneficiary maintains privacy and protection from liens attached to their personal name.",
                  highlight: "Real property protection",
                },
              ].map((item, index) => (
                <motion.div key={index} variants={staggerItemVariants}>
                  <Card className="bg-white/10 backdrop-blur-sm border border-royal-gold/30 h-full">
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-cinzel text-lg font-bold text-white">
                          {item.title}
                        </h3>
                        <span className="text-xs font-semibold text-royal-gold bg-royal-gold/10 px-3 py-1 rounded-full">
                          {item.highlight}
                        </span>
                      </div>
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

      {/* What to Place in Trust */}
      <div className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                What Can Be Placed in Trust
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Nearly any asset can be transferred into a trust. The key is
                proper documentation and correct procedure for each asset type.
              </p>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.1} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
            {[
              { icon: Building, label: "Real Property & Land" },
              { icon: FileText, label: "Bank Accounts & Financial Instruments" },
              { icon: Scale, label: "Vehicles & Personal Property" },
              { icon: Lock, label: "Intellectual Property & Copyrights" },
              { icon: Landmark, label: "Business Interests & LLCs" },
              { icon: Shield, label: "Life Insurance Policies" },
            ].map((item, index) => (
              <motion.div key={index} variants={staggerItemVariants}>
                <Card className="royal-card">
                  <CardContent className="p-5 flex items-center gap-4">
                    <item.icon className="w-8 h-8 text-royal-burgundy flex-shrink-0" />
                    <p className="font-semibold text-royal-navy text-sm">
                      {item.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </StaggerContainer>

          <RevealOnScroll>
            <div className="text-center">
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                The principle is simple:{" "}
                <span className="font-bold text-royal-navy">
                  if it can be owned, it can be held in trust.
                </span>{" "}
                The trust becomes the legal owner. You become the protected
                beneficiary.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* Process */}
      <div className="py-24 marble-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                The Trust Establishment Process
              </h2>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.2} className="max-w-4xl mx-auto space-y-6">
            {[
              {
                step: "01",
                title: "Education & Orientation",
                description:
                  "Before any documents are prepared, you must understand what a trust is, how it operates, and what your role will be. We provide comprehensive education on trust law, structure, and administration.",
              },
              {
                step: "02",
                title: "Trust Instrument Drafting",
                description:
                  "The trust document (indenture) is prepared with precise language defining the grantor, trustee, beneficiaries, trust property, and the terms of administration. Every word carries legal weight.",
              },
              {
                step: "03",
                title: "Asset Transfer & Funding",
                description:
                  "Assets are formally transferred into the trust through proper conveyance documents — deeds for real property, assignment documents for personal property, and re-titling for financial accounts.",
              },
              {
                step: "04",
                title: "Ongoing Administration",
                description:
                  "A trust is a living instrument that requires proper administration — maintaining records, filing necessary documents, conducting trust business in the trust's name, and ensuring fiduciary duties are met.",
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
                      Trust education provided by Ecclesia Basilikos is for
                      informational and educational purposes. We teach the
                      principles of trust law, asset protection, and proper
                      administration so that you can make informed decisions about
                      structuring your affairs.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Every situation is unique. We encourage members to study
                      diligently, ask questions within our community, and seek
                      qualified counsel when establishing formal trust instruments.
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
              Protect What Has Been Entrusted to You
            </h2>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed mb-10">
              A trust is not about hiding assets. It is about stewarding them
              properly — placing them under lawful protection so they can
              serve their intended purpose.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/state-passport">
                <Button
                  size="lg"
                  className="royal-button text-lg px-10 py-6 shadow-2xl hover:scale-105 transition-transform"
                >
                  <FileText className="mr-3 h-6 w-6" />
                  Next: State-Citizen Passport
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
