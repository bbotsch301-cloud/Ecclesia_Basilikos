import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import {
  FileText, Globe, BookOpen, Shield, CheckCircle,
  AlertTriangle, ArrowRight, Scale, Landmark, Flag,
  Info, Users, Banknote
} from "lucide-react";
import { motion } from "framer-motion";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuth } from "@/hooks/useAuth";
import StaggerContainer, {
  staggerItemVariants,
  emphasisItemVariants,
} from "@/components/ui/stagger-container";

export default function StatePassport() {
  usePageTitle("State-Citizen Passport");
  const { isAuthenticated } = useAuth();

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
            <Globe className="w-16 h-16 md:w-20 md:h-20 text-royal-gold mx-auto mb-6 animate-gentle-float" />
          </motion.div>

          <motion.p
            className="font-cinzel text-xs md:text-sm tracking-[0.3em] uppercase text-white/80 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Pillar Three
          </motion.p>

          <motion.h1
            className="font-cinzel-decorative text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            State-Citizen Passport
          </motion.h1>

          <motion.h2
            className="font-cinzel text-xl md:text-2xl animate-gold-shimmer mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Reclaiming Your Proper Political Status
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            The distinction between a state citizen and a federal citizen is not
            trivial. It is the difference between standing as a sovereign
            member of the republic and being classified as a subject of federal
            jurisdiction. Your passport can reflect your true status.
          </motion.p>
        </div>
      </div>

      {/* Two Types of Citizenship */}
      <div className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                Two Types of Citizenship
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                The Constitution recognizes a fundamental distinction between
                state citizenship and federal citizenship. The 14th Amendment
                created a secondary class of federal citizenship — but it did
                not abolish the original. Understanding this distinction is
                critical.
              </p>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <motion.div variants={staggerItemVariants}>
              <Card className="royal-card h-full border-l-4 border-l-royal-burgundy">
                <CardContent className="p-8">
                  <h3 className="font-cinzel text-lg font-bold text-royal-burgundy mb-4">
                    14th Amendment Federal Citizen
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-royal-burgundy flex-shrink-0 mt-0.5" />
                      <span>Subject to congressional jurisdiction under the 14th Amendment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-royal-burgundy flex-shrink-0 mt-0.5" />
                      <span>Civil rights granted by legislation — can be amended or revoked</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-royal-burgundy flex-shrink-0 mt-0.5" />
                      <span>Presumed to be engaged in federally regulated activities</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-royal-burgundy flex-shrink-0 mt-0.5" />
                      <span>Passport issued under federal jurisdiction without state domicile designation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={staggerItemVariants}>
              <Card className="royal-card h-full border-l-4 border-l-royal-navy">
                <CardContent className="p-8">
                  <h3 className="font-cinzel text-lg font-bold text-royal-navy mb-4">
                    State Citizen (Original Jurisdiction)
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Sovereign political status — a member of the republic, not a subject of it</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Unalienable rights secured by the Constitution — not granted by government</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Domiciled in one of the several states — not a federal territory</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Passport can reflect state-citizen status with proper application</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerContainer>

          <RevealOnScroll>
            <Card className="max-w-3xl mx-auto bg-white/80 border border-royal-gold/30">
              <CardContent className="p-6">
                <blockquote className="border-l-4 border-royal-gold pl-4">
                  <p className="font-georgia italic text-gray-700 text-lg leading-relaxed">
                    "The Citizens of each State shall be entitled to all
                    Privileges and Immunities of Citizens in the several States."
                  </p>
                  <p className="text-royal-burgundy mt-2 font-semibold">
                    — Article IV, Section 2, United States Constitution
                  </p>
                </blockquote>
              </CardContent>
            </Card>
          </RevealOnScroll>
        </div>
      </div>

      {/* Why It Matters */}
      <RevealOnScroll>
        <div className="py-24 bg-gradient-to-r from-royal-burgundy via-royal-navy to-royal-burgundy">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Flag className="w-16 h-16 text-royal-gold mx-auto mb-6" />
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-white mb-6">
                Why Your Political Status Matters
              </h2>
              <p className="text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Your political status determines which laws apply to you, which
                courts have jurisdiction over you, and what obligations you are
                presumed to have. It is the foundation upon which everything
                else is built.
              </p>
            </div>

            <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Scale,
                  title: "Jurisdictional Standing",
                  description:
                    "State citizens operate under common law and the Constitution. Federal citizens are subject to statutory and administrative law. The jurisdiction determines the rules of engagement.",
                },
                {
                  icon: Shield,
                  title: "Rights vs. Privileges",
                  description:
                    "State citizens hold unalienable rights that precede government. Federal citizens hold civil rights granted by the 14th Amendment — rights that exist by legislative permission.",
                },
                {
                  icon: Landmark,
                  title: "Tax & Regulatory Implications",
                  description:
                    "Your political status affects how you are classified for tax purposes, which regulations apply to your activities, and what reporting obligations you are presumed to carry.",
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

      {/* The Passport Process */}
      <div className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                The State-Citizen Passport Process
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Obtaining a passport that reflects your state-citizen status
                requires understanding the proper application process, the
                correct language, and the legal framework that supports it.
              </p>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.2} className="max-w-4xl mx-auto space-y-6">
            {[
              {
                step: "01",
                title: "Establish Your Domicile",
                description:
                  "Domicile is the cornerstone of state citizenship. You must establish and declare your domicile in one of the several states of the Union — not a federal territory, district, or possession. Domicile is a matter of intent and physical presence.",
              },
              {
                step: "02",
                title: "Study the Application Process",
                description:
                  "The DS-11 passport application contains specific fields that, when completed with the correct language and understanding, can reflect your state-citizen status. Every line on the form carries legal significance.",
              },
              {
                step: "03",
                title: "Prepare Supporting Documentation",
                description:
                  "Gather your supporting documents — birth certificate, identification, and any affidavits or declarations that establish your political status and domicile. Proper documentation is essential.",
              },
              {
                step: "04",
                title: "Understand the Restriction Codes",
                description:
                  "Passport restriction and endorsement codes can reflect specific statuses. Understanding which codes apply and how they are noted on the passport is part of the education process.",
              },
              {
                step: "05",
                title: "Submit with Knowledge and Confidence",
                description:
                  "When you understand the law, the process, and your rights, you submit your application not as a petitioner — but as a citizen of the republic exercising a right. Knowledge removes fear and uncertainty.",
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

      {/* Key Legal References */}
      <div className="py-24 marble-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                Key Legal References
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                The distinction between state and federal citizenship is well
                established in constitutional law and case precedent.
              </p>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.12} className="max-w-4xl mx-auto space-y-4">
            {[
              {
                title: "Slaughter-House Cases, 83 U.S. 36 (1873)",
                text: "\"It is quite clear, then, that there is a citizenship of the United States, and a citizenship of a State, which are distinct from each other.\"",
              },
              {
                title: "United States v. Cruikshank, 92 U.S. 542 (1876)",
                text: "\"We have in our political system a government of the United States and a government of each of the several States. Each one of these governments is distinct from the others, and each has citizens of its own.\"",
              },
              {
                title: "Article IV, Section 2, U.S. Constitution",
                text: "\"The Citizens of each State shall be entitled to all Privileges and Immunities of Citizens in the several States.\"",
              },
              {
                title: "14th Amendment, Section 1",
                text: "\"All persons born or naturalized in the United States, and subject to the jurisdiction thereof, are citizens of the United States and of the State wherein they reside.\"",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={staggerItemVariants}>
                <Card className="royal-card">
                  <CardContent className="p-6">
                    <h3 className="font-cinzel text-sm font-bold text-royal-navy mb-2">
                      {item.title}
                    </h3>
                    <p className="font-georgia italic text-gray-700 leading-relaxed">
                      {item.text}
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
                      The information provided here is educational. The
                      state-citizen passport process involves interaction with
                      government agencies and requires precise understanding of
                      the law. We educate our members on the constitutional and
                      legal foundations so they can proceed with knowledge and
                      confidence.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Ecclesia Basilikos does not file documents on your behalf.
                      We equip you with the knowledge to act on your own standing,
                      with the support of a community walking the same path.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RevealOnScroll>
        </div>
      </div>

      {/* The Three Pillars Summary */}
      <div className="py-24 marble-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-royal-navy mb-6">
                The Three Pillars
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                These three pillars work together to form a complete foundation.
                Each one reinforces the others.
              </p>
            </div>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.2} className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Banknote,
                title: "Lawful Money",
                description: "Redeem from private credit. Establish your financial standing under public law.",
                href: "/lawful-money",
                status: "Pillar 1",
              },
              {
                icon: Shield,
                title: "Trust & Assets",
                description: "Protect what has been entrusted to you. Separate legal title from personal liability.",
                href: "/trust-assets",
                status: "Pillar 2",
              },
              {
                icon: Globe,
                title: "State Passport",
                description: "Reclaim your political status. Document your standing as a state citizen.",
                href: "/state-passport",
                status: "Pillar 3",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={staggerItemVariants}>
                <Link href={item.href}>
                  <Card className="royal-card hover:border-royal-gold transition-all cursor-pointer h-full">
                    <CardContent className="p-8 text-center">
                      <span className="text-xs font-semibold text-royal-burgundy bg-royal-burgundy/10 px-3 py-1 rounded-full">
                        {item.status}
                      </span>
                      <item.icon className="w-14 h-14 text-royal-burgundy mx-auto mt-4 mb-4" />
                      <h3 className="font-cinzel text-xl font-bold text-royal-navy mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-white mb-6">
              The Foundation Is Set
            </h2>

            <StaggerContainer staggerDelay={0.2} className="space-y-4 text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto mb-12">
              <motion.p variants={staggerItemVariants}>
                Lawful money redemption restores your financial standing.
              </motion.p>
              <motion.p variants={staggerItemVariants}>
                Trust protection secures what has been given to you.
              </motion.p>
              <motion.p variants={staggerItemVariants}>
                State-citizen status confirms who you are in the republic.
              </motion.p>
              <motion.p variants={emphasisItemVariants} className="text-2xl md:text-3xl text-royal-gold font-semibold pt-4">
                Together, they form the foundation of alignment.
              </motion.p>
            </StaggerContainer>
          </RevealOnScroll>

          <RevealOnScroll delay={0.5}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="inline-block rounded-lg animate-glow-pulse">
                <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
                  <Button
                    size="lg"
                    className="royal-button text-lg px-10 py-6 shadow-2xl hover:scale-105 transition-transform"
                  >
                    <Users className="mr-3 h-6 w-6" />
                    {isAuthenticated ? "Go to Dashboard" : "Join Free"}
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <Link href="/lawful-money">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-6 border-royal-gold/50 text-white hover:bg-white/10 transition-all"
                >
                  <ArrowRight className="mr-3 h-6 w-6" />
                  Start from Pillar 1
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-6 border-white/30 text-white/70 hover:bg-white/10 transition-all"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
}
