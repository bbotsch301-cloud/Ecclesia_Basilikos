import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  Banknote, Shield, Globe, ArrowRight, BookOpen,
  CheckCircle, Lock, Play, FileText, Users,
  ChevronRight, Download, MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";
import StaggerContainer, { staggerItemVariants } from "@/components/ui/stagger-container";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string | null;
  lessonCount?: number;
}

interface Enrollment {
  id: string;
  courseId: string;
  progress: number | null;
  completedAt: string | null;
  course: {
    id: string;
    title: string;
    description: string;
    level: string;
    duration: string | null;
    category: string;
  };
}

const pillars = [
  {
    number: 1,
    title: "Lawful Money Redemption",
    subtitle: "12 USC § 411",
    icon: Banknote,
    color: "royal-gold",
    bgGradient: "from-royal-navy to-royal-burgundy",
    category: "Lawful Money",
    pageHref: "/lawful-money",
    outcomes: [
      "Understand the full text and meaning of 12 USC § 411",
      "Write a proper restrictive endorsement on every deposit",
      "Know the distinction between private credit and public money",
      "Maintain consistent documentation of your practice",
    ],
    downloads: [
      "Lawful Money Endorsement Guide",
      "Redemption Ledger Template",
    ],
  },
  {
    number: 2,
    title: "Trust & Asset Protection",
    subtitle: "Securing What Was Given",
    icon: Shield,
    color: "royal-burgundy",
    bgGradient: "from-royal-burgundy to-royal-navy",
    category: "Trust & Assets",
    pageHref: "/trust-assets",
    outcomes: [
      "Understand trust structure — Grantor, Trustee, Beneficiary",
      "Know the difference between trust types and when to use each",
      "Transfer assets properly into the trust",
      "Administer the trust with correct ongoing procedures",
    ],
    downloads: [
      "Trust Establishment Checklist",
      "Asset Schedule Template",
    ],
  },
  {
    number: 3,
    title: "State-Citizen Passport",
    subtitle: "Reclaiming Your Status",
    icon: Globe,
    color: "royal-navy",
    bgGradient: "from-royal-navy to-royal-burgundy",
    category: "State Passport",
    pageHref: "/state-passport",
    outcomes: [
      "Understand the constitutional basis for state citizenship",
      "Know key case law (Slaughter-House, Cruikshank)",
      "Establish your domicile properly",
      "Complete the DS-11 passport application correctly",
    ],
    downloads: [
      "Declaration of Domicile Template",
      "DS-11 Application Walkthrough",
    ],
  },
];

export default function LearningPath() {
  usePageTitle("Learning Path");
  const { isAuthenticated } = useAuth();

  const { data: allCourses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const { data: enrollments = [] } = useQuery<Enrollment[]>({
    queryKey: ["/api/my-enrollments"],
    enabled: isAuthenticated,
  });

  function getCourseForPillar(category: string) {
    return allCourses.find(
      (c) => c.category === category
    );
  }

  function getEnrollmentForCourse(courseId: string) {
    return enrollments.find((e) => e.courseId === courseId);
  }

  function getPillarStatus(category: string) {
    const course = getCourseForPillar(category);
    if (!course) return "no-course";
    const enrollment = getEnrollmentForCourse(course.id);
    if (!enrollment) return "not-started";
    if (enrollment.completedAt) return "completed";
    return "in-progress";
  }

  const completedCount = pillars.filter(
    (p) => getPillarStatus(p.category) === "completed"
  ).length;

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <BookOpen className="w-16 h-16 text-royal-gold mx-auto mb-6" />
          </motion.div>

          <motion.h1
            className="font-cinzel-decorative text-4xl md:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            The Learning Path
          </motion.h1>

          <motion.p
            className="font-cinzel text-lg md:text-xl animate-gold-shimmer mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Three Pillars · Three Courses · One Foundation
          </motion.p>

          <motion.p
            className="text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Each pillar has a dedicated course, downloadable templates, and a
            community forum. Work through them in order — each builds on the
            one before it.
          </motion.p>

          {isAuthenticated && (
            <motion.div
              className="mt-8 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-white/10 backdrop-blur-sm border border-royal-gold/30 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-300">Overall Progress</span>
                  <span className="text-royal-gold font-semibold">
                    {completedCount} / 3 Pillars Complete
                  </span>
                </div>
                <Progress
                  value={(completedCount / 3) * 100}
                  className="h-2"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Pillar Sections */}
      <div className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {pillars.map((pillar, index) => {
            const course = getCourseForPillar(pillar.category);
            const enrollment = course
              ? getEnrollmentForCourse(course.id)
              : null;
            const status = getPillarStatus(pillar.category);

            return (
              <RevealOnScroll key={pillar.number}>
                <Card className="royal-card overflow-hidden">
                  <CardContent className="p-0">
                    {/* Pillar Header */}
                    <div
                      className={`bg-gradient-to-r ${pillar.bgGradient} p-6 md:p-8`}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
                            <pillar.icon className="w-7 h-7 text-royal-gold" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-royal-gold uppercase tracking-wider">
                              Pillar {pillar.number}
                            </p>
                            <h2 className="font-cinzel-decorative text-2xl md:text-3xl font-bold text-white">
                              {pillar.title}
                            </h2>
                            <p className="text-sm text-gray-300">
                              {pillar.subtitle}
                            </p>
                          </div>
                        </div>

                        {isAuthenticated && (
                          <div>
                            {status === "completed" && (
                              <Badge className="bg-green-500 text-white text-sm px-4 py-1">
                                <CheckCircle className="w-4 h-4 mr-1.5" />
                                Completed
                              </Badge>
                            )}
                            {status === "in-progress" && (
                              <Badge className="bg-royal-gold text-royal-navy text-sm px-4 py-1">
                                <Play className="w-4 h-4 mr-1.5" />
                                In Progress — {enrollment?.progress || 0}%
                              </Badge>
                            )}
                            {status === "not-started" && (
                              <Badge
                                variant="outline"
                                className="border-white/40 text-white text-sm px-4 py-1"
                              >
                                Not Started
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {isAuthenticated && enrollment && (
                        <div className="mt-4">
                          <Progress
                            value={enrollment.progress || 0}
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>

                    {/* Pillar Body */}
                    <div className="p-6 md:p-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Learning Outcomes */}
                        <div>
                          <h3 className="font-cinzel text-lg font-bold text-royal-navy mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-royal-burgundy" />
                            What You Will Learn
                          </h3>
                          <ul className="space-y-3">
                            {pillar.outcomes.map((outcome, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-3 text-sm text-gray-700"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                {outcome}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Resources */}
                        <div>
                          <h3 className="font-cinzel text-lg font-bold text-royal-navy mb-4 flex items-center gap-2">
                            <Download className="w-5 h-5 text-royal-burgundy" />
                            Templates & Guides
                          </h3>
                          <ul className="space-y-2 mb-6">
                            {pillar.downloads.map((dl, i) => (
                              <li
                                key={i}
                                className="flex items-center gap-3 text-sm text-gray-700"
                              >
                                <FileText className="w-4 h-4 text-royal-navy flex-shrink-0" />
                                {dl}
                              </li>
                            ))}
                          </ul>

                          <h3 className="font-cinzel text-lg font-bold text-royal-navy mb-3 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-royal-burgundy" />
                            Community
                          </h3>
                          <p className="text-sm text-gray-600">
                            Discuss this pillar with the community in the{" "}
                            <Link
                              href="/forum"
                              className="text-royal-gold hover:text-royal-burgundy font-semibold transition-colors"
                            >
                              {pillar.title} Forum →
                            </Link>
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
                        <Link href={pillar.pageHref}>
                          <Button
                            variant="outline"
                            className="border-royal-navy text-royal-navy hover:bg-royal-navy hover:text-white"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Read the Guide
                          </Button>
                        </Link>

                        {course && (
                          <Link href={`/course/${course.id}`}>
                            <Button className="royal-button">
                              {status === "in-progress" ? (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Continue Course
                                </>
                              ) : status === "completed" ? (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Review Course
                                </>
                              ) : (
                                <>
                                  <BookOpen className="w-4 h-4 mr-2" />
                                  Start Course
                                </>
                              )}
                            </Button>
                          </Link>
                        )}

                        <Link href="/downloads">
                          <Button
                            variant="ghost"
                            className="text-royal-burgundy hover:text-royal-navy"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Templates
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <h2 className="font-cinzel-decorative text-3xl md:text-4xl font-bold text-white mb-6">
              {isAuthenticated
                ? "Continue Building Your Foundation"
                : "Join the Community"}
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              {isAuthenticated
                ? "Work through each pillar at your own pace. The community is here to support you."
                : "Create a free account to enroll in courses, access templates, and join the community forum."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link href="/forum">
                    <Button
                      size="lg"
                      className="royal-button text-lg px-10 py-6"
                    >
                      <Users className="mr-3 h-6 w-6" />
                      Join the Forum
                    </Button>
                  </Link>
                  <Link href="/downloads">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-10 py-6 bg-white/15 border-royal-gold/50 text-royal-gold hover:bg-white/25"
                    >
                      <Download className="mr-3 h-6 w-6" />
                      Download Templates
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="royal-button text-lg px-10 py-6"
                    >
                      <Users className="mr-3 h-6 w-6" />
                      Create Free Account
                    </Button>
                  </Link>
                  <Link href="/lawful-money">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-10 py-6 bg-white/15 border-royal-gold/50 text-royal-gold hover:bg-white/25"
                    >
                      <Banknote className="mr-3 h-6 w-6" />
                      Start Reading
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
}
