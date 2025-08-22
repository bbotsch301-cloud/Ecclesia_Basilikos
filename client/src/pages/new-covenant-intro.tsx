import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import HeroSection from "@/components/ui/hero-section";
import ScriptureQuote from "@/components/ui/scripture-quote";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Crown, Heart, Shield, CheckCircle, ArrowRight, Play } from "lucide-react";
import { Link } from "wouter";

export default function NewCovenantIntro() {
  const { user, isAuthenticated } = useAuth();
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  
  const markSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
    }
  };

  const progressPercentage = (completedSections.length / 6) * 100;

  const lessonSections = [
    {
      id: "foundation",
      title: "The Foundation of Trust",
      duration: "5 min",
      description: "Understanding what a trust is and why Christ established one"
    },
    {
      id: "grantor",
      title: "Christ as Grantor",
      duration: "8 min", 
      description: "How Jesus established the New Covenant Trust through His sacrifice"
    },
    {
      id: "beneficiary",
      title: "Your Role as Beneficiary",
      duration: "7 min",
      description: "Understanding your inheritance and rights in the trust"
    },
    {
      id: "authority",
      title: "Spiritual Authority",
      duration: "6 min",
      description: "Operating in Kingdom authority as a co-heir with Christ"
    },
    {
      id: "freedom",
      title: "True Freedom in Christ", 
      duration: "9 min",
      description: "How regeneration brings freedom from Babylon's systems"
    },
    {
      id: "living",
      title: "Living as a Beneficiary",
      duration: "10 min",
      description: "Practical application of your covenant identity"
    }
  ];

  return (
    <div className="pt-16">
      <HeroSection
        title="Introduction to the New Covenant Trust"
        description="A comprehensive overview of Christ as the Grantor and your role as beneficiary in God's eternal trust"
        backgroundImage="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
      />

      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Course Overview */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <Badge className="bg-covenant-gold text-covenant-blue">Foundational Course</Badge>
                  <span className="text-sm text-covenant-gray">45 minutes total</span>
                </div>
                <h1 className="font-playfair text-3xl font-bold text-covenant-blue mb-4">
                  Introduction to the New Covenant Trust
                </h1>
                <p className="text-lg text-covenant-gray leading-relaxed">
                  This foundational teaching establishes the biblical framework for understanding Christ as the Grantor of the New Covenant Trust and how believers step into their role as beneficiaries. You'll discover your true identity and freedom in Christ through the lens of this divine trust relationship.
                </p>
              </div>

              {/* What You'll Learn */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-covenant-gold" />
                    What You'll Learn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">The biblical foundation of the New Covenant Trust</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">How Christ's sacrifice established the trust</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Your inheritance as a joint-heir with Christ</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Operating in Kingdom spiritual authority</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Freedom from Babylon's legal fiction systems</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Practical steps for living as a beneficiary</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Sidebar */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Course Progress</CardTitle>
                  <CardDescription>Track your learning journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Sections Completed</p>
                      <p className="text-2xl font-bold text-covenant-blue">
                        {completedSections.length} / {lessonSections.length}
                      </p>
                    </div>

                    {isAuthenticated ? (
                      <Button className="w-full bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue">
                        <Play className="h-4 w-4 mr-2" />
                        Continue Learning
                      </Button>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-covenant-gray mb-3">Sign in to track progress</p>
                        <Link href="/education">
                          <Button className="w-full bg-covenant-blue hover:bg-covenant-blue/80 text-white">
                            Get Access
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Course Sections */}
          <div className="space-y-6 mb-16">
            <h2 className="font-playfair text-2xl font-bold text-covenant-blue mb-8">Course Sections</h2>
            
            {lessonSections.map((section, index) => (
              <Card key={section.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          completedSections.includes(section.id) 
                            ? 'bg-green-500 text-white' 
                            : 'bg-covenant-light text-covenant-blue'
                        }`}>
                          {completedSections.includes(section.id) ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <span className="font-bold">{index + 1}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-covenant-blue">{section.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {section.duration}
                          </Badge>
                        </div>
                        <p className="text-covenant-gray text-sm leading-relaxed">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markSectionComplete(section.id)}
                        disabled={!isAuthenticated}
                        className="border-covenant-blue text-covenant-blue hover:bg-covenant-blue hover:text-white"
                      >
                        {completedSections.includes(section.id) ? 'Completed' : 'Start'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Key Scriptures Foundation */}
          <div className="mb-16">
            <h2 className="font-playfair text-2xl font-bold text-covenant-blue mb-8 text-center">
              Scriptural Foundation
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-covenant-light">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-5 w-5 text-covenant-gold" />
                    <CardTitle className="text-lg">Christ as Grantor</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="font-georgia italic text-covenant-dark-gray mb-4 leading-relaxed">
                    "All power is given unto me in heaven and in earth. Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost:"
                  </blockquote>
                  <cite className="text-covenant-gold font-semibold">Matthew 28:18-19 (KJV)</cite>
                  <p className="text-sm text-covenant-gray mt-3">
                    Christ received all authority and power, making Him the ultimate Grantor of the New Covenant Trust.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-covenant-light">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-5 w-5 text-covenant-gold" />
                    <CardTitle className="text-lg">Your Inheritance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="font-georgia italic text-covenant-dark-gray mb-4 leading-relaxed">
                    "And if children, then heirs; heirs of God, and joint-heirs with Christ: if so be that we suffer with him, that we may be also glorified together."
                  </blockquote>
                  <cite className="text-covenant-gold font-semibold">Romans 8:17 (KJV)</cite>
                  <p className="text-sm text-covenant-gray mt-3">
                    As God's children, believers are joint-heirs with Christ in the divine inheritance.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-covenant-light">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-covenant-gold" />
                    <CardTitle className="text-lg">New Covenant Mediator</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="font-georgia italic text-covenant-dark-gray mb-4 leading-relaxed">
                    "And for this cause he is the mediator of the new testament, that by means of death, for the redemption of the transgressions that were under the first testament, they which are called might receive the promise of eternal inheritance."
                  </blockquote>
                  <cite className="text-covenant-gold font-semibold">Hebrews 9:15 (KJV)</cite>
                  <p className="text-sm text-covenant-gray mt-3">
                    Christ's death established the New Covenant, securing eternal inheritance for believers.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-covenant-light">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-covenant-gold" />
                    <CardTitle className="text-lg">Royal Priesthood</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="font-georgia italic text-covenant-dark-gray mb-4 leading-relaxed">
                    "But ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people; that ye should shew forth the praises of him who hath called you out of darkness into his marvellous light:"
                  </blockquote>
                  <cite className="text-covenant-gold font-semibold">1 Peter 2:9 (KJV)</cite>
                  <p className="text-sm text-covenant-gray mt-3">
                    Believers operate as royal priests with divine authority in the Kingdom of God.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <ScriptureQuote
            quote="But now hath he obtained a more excellent ministry, by how much also he is the mediator of a better covenant, which was established upon better promises."
            reference="Hebrews 8:6 (KJV)"
          />
        </div>
      </div>
    </div>
  );
}