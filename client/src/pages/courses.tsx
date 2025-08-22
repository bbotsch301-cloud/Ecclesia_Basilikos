import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/ui/hero-section";
import ScriptureQuote from "@/components/ui/scripture-quote";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BookOpen, Crown, Heart, Shield, CheckCircle, ArrowRight, Play, Video, LogIn, UserPlus, ChevronDown, ChevronRight, GraduationCap, Zap, Star } from "lucide-react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, loginSchema } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const registrationSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationData = z.infer<typeof registrationSchema>;

interface CourseData {
  id: string;
  title: string;
  description: string;
  level: 'foundation' | 'intermediate' | 'advanced' | 'master';
  duration: string;
  sectionCount: number;
  estimatedTime: string;
  thumbnail: string;
  completionBadge: string;
  sections: {
    id: string;
    title: string;
    duration: string;
    description: string;
    topics: string[];
  }[];
  learningOutcomes: string[];
  prerequisites?: string[];
}

const coursesData: CourseData[] = [
  {
    id: "new-covenant-foundation",
    title: "Introduction to the New Covenant Trust",
    description: "Understanding Christ as the Grantor and your role as beneficiary in God's eternal trust",
    level: "foundation",
    duration: "45 minutes",
    sectionCount: 6,
    estimatedTime: "1 week",
    thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    completionBadge: "Covenant Foundation",
    sections: [
      {
        id: "foundation",
        title: "The Foundation of Trust",
        duration: "5 min",
        description: "Understanding what a trust is and why Christ established one",
        topics: ["Trust Fundamentals", "Biblical Foundation", "Legal Framework"]
      },
      {
        id: "grantor",
        title: "Christ as Grantor",
        duration: "8 min", 
        description: "How Jesus established the New Covenant Trust through His sacrifice",
        topics: ["Grantor Authority", "Sacrifice & Inheritance", "Eternal Covenant"]
      },
      {
        id: "beneficiary",
        title: "Your Role as Beneficiary",
        duration: "7 min",
        description: "Understanding your inheritance and rights in the trust",
        topics: ["Inheritance Rights", "Co-heir Status", "Kingdom Benefits"]
      },
      {
        id: "authority",
        title: "Spiritual Authority",
        duration: "6 min",
        description: "Operating in Kingdom authority as a co-heir with Christ",
        topics: ["Delegated Authority", "Kingdom Power", "Spiritual Warfare"]
      },
      {
        id: "freedom",
        title: "True Freedom in Christ", 
        duration: "9 min",
        description: "How regeneration brings freedom from Babylon's systems",
        topics: ["Liberation Theology", "Breaking Bondage", "Spiritual Freedom"]
      },
      {
        id: "living",
        title: "Living as a Beneficiary",
        duration: "10 min",
        description: "Practical application of your covenant identity",
        topics: ["Daily Practice", "Identity in Christ", "Kingdom Lifestyle"]
      }
    ],
    learningOutcomes: [
      "Understand the biblical foundation of the New Covenant Trust",
      "Recognize your role as a joint-heir with Christ",
      "Operate in Kingdom spiritual authority",
      "Experience freedom from Babylon's legal fiction systems",
      "Apply covenant principles in daily life"
    ]
  },
  {
    id: "trust-administration",
    title: "Trust Administration Fundamentals", 
    description: "Essential knowledge for managing your New Covenant Trust including legal structure, documentation, and basic administrative duties",
    level: "intermediate",
    duration: "1.5 hours",
    sectionCount: 6,
    estimatedTime: "1-2 weeks",
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    completionBadge: "Trust Administrator",
    sections: [
      {
        id: "trust-structure",
        title: "Understanding Trust Structure",
        duration: "12 min",
        description: "Legal framework, roles, and responsibilities in trust administration",
        topics: ["Trust Formation", "Grantor vs Trustee", "Beneficiary Rights", "Legal Documentation"]
      },
      {
        id: "trust-documents",
        title: "Essential Trust Documents",
        duration: "15 min", 
        description: "Required paperwork, certificates, and legal instruments for trust operation",
        topics: ["Trust Indenture", "EIN Application", "Certification of Trust", "Operating Agreements"]
      },
      {
        id: "record-keeping",
        title: "Trust Record Keeping",
        duration: "18 min",
        description: "Maintaining proper records, bookkeeping, and documentation systems",
        topics: ["Financial Records", "Asset Documentation", "Transaction Logs", "Compliance Files"]
      },
      {
        id: "trust-banking",
        title: "Opening Trust Bank Accounts",
        duration: "20 min",
        description: "Step-by-step process for establishing banking relationships for your trust",
        topics: ["Bank Selection", "Required Documents", "Account Types", "Signatory Authority"]
      },
      {
        id: "initial-funding",
        title: "Initial Trust Funding", 
        duration: "14 min",
        description: "Moving assets into the trust and establishing initial capital",
        topics: ["Asset Transfer", "Funding Strategies", "Title Changes", "Initial Deposits"]
      },
      {
        id: "basic-operations",
        title: "Basic Trust Operations",
        duration: "16 min",
        description: "Day-to-day administrative tasks and operational procedures",
        topics: ["Regular Reporting", "Distribution Procedures", "Compliance Tasks", "Administrative Calendar"]
      }
    ],
    learningOutcomes: [
      "Understand the legal structure and roles within a trust",
      "Properly maintain trust records and documentation",
      "Successfully open and manage trust banking relationships",
      "Execute proper asset transfer and funding procedures",
      "Implement effective administrative systems and procedures"
    ],
    prerequisites: ["Introduction to the New Covenant Trust"]
  },
  {
    id: "asset-management",
    title: "Trust Asset Management & Investment Strategies",
    description: "Comprehensive training in managing trust assets, investment accounts, and building wealth through the trust structure",
    level: "intermediate",
    duration: "3 hours",
    sectionCount: 8,
    estimatedTime: "3-4 weeks",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    completionBadge: "Asset Manager",
    sections: [
      {
        id: "investment-accounts",
        title: "Opening Trust Investment Accounts",
        duration: "25 min",
        description: "Establishing brokerage and investment accounts in the trust name",
        topics: ["Brokerage Selection", "Account Documentation", "Trading Authorization", "Tax Considerations"]
      },
      {
        id: "crypto-integration",
        title: "Cryptocurrency Accounts for Trusts",
        duration: "22 min",
        description: "Setting up crypto exchanges and wallets for trust use",
        topics: ["Exchange Selection", "Wallet Security", "Private Key Management", "KYC Requirements"]
      },
      {
        id: "real-estate-titles",
        title: "Transferring Real Estate Titles",
        duration: "30 min",
        description: "Moving property titles into trust ownership and management",
        topics: ["Title Transfer Process", "Deed Preparation", "Recording Requirements", "Property Management"]
      },
      {
        id: "vehicle-assets",
        title: "Vehicles and Personal Property",
        duration: "18 min",
        description: "Transferring vehicles, boats, and personal assets to trust ownership",
        topics: ["Vehicle Title Transfer", "Registration Process", "Insurance Considerations", "Asset Documentation"]
      },
      {
        id: "business-interests",
        title: "Business Interests and Intellectual Property",
        duration: "27 min",
        description: "Moving business ownership and IP assets into the trust structure",
        topics: ["Business Entity Transfer", "Intellectual Property", "Operating Agreements", "Revenue Streams"]
      },
      {
        id: "precious-metals",
        title: "Precious Metals and Alternative Assets",
        duration: "20 min",
        description: "Acquiring and storing precious metals and alternative investments",
        topics: ["Gold & Silver Acquisition", "Storage Solutions", "Authentication", "Portfolio Diversification"]
      },
      {
        id: "offshore-considerations",
        title: "International Asset Protection",
        duration: "24 min",
        description: "Offshore banking and international asset protection strategies",
        topics: ["Offshore Banking", "International Compliance", "Asset Protection", "Privacy Strategies"]
      },
      {
        id: "portfolio-management",
        title: "Trust Portfolio Management",
        duration: "34 min",
        description: "Advanced strategies for managing and growing trust assets",
        topics: ["Asset Allocation", "Risk Management", "Growth Strategies", "Performance Monitoring"]
      }
    ],
    learningOutcomes: [
      "Successfully establish investment and crypto accounts for the trust",
      "Transfer real estate and personal property titles to trust ownership",
      "Manage business interests and intellectual property within the trust",
      "Implement precious metals and alternative asset strategies",
      "Navigate international asset protection and offshore considerations",
      "Build and maintain a diversified trust portfolio"
    ],
    prerequisites: ["Introduction to the New Covenant Trust", "Trust Administration Fundamentals"]
  },
  {
    id: "trust-taxation-compliance",
    title: "Trust Taxation, Compliance & Legal Protection",
    description: "Advanced training in trust tax strategies, regulatory compliance, and legal asset protection techniques",
    level: "advanced",
    duration: "4.5 hours",
    sectionCount: 10,
    estimatedTime: "5-6 weeks",
    thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    completionBadge: "Compliance Expert",
    sections: [
      {
        id: "trust-taxation",
        title: "Trust Tax Strategy & Planning",
        duration: "32 min",
        description: "Understanding trust taxation and implementing effective tax strategies",
        topics: ["Trust Tax Returns", "Income Distribution", "Tax Minimization", "Quarterly Filings"]
      },
      {
        id: "regulatory-compliance",
        title: "Regulatory Compliance Requirements",
        duration: "28 min",
        description: "Meeting federal and state compliance requirements for trust operations",
        topics: ["Reporting Requirements", "Due Diligence", "Anti-Money Laundering", "Record Retention"]
      },
      {
        id: "asset-protection",
        title: "Advanced Asset Protection Strategies",
        duration: "35 min",
        description: "Sophisticated techniques for protecting trust assets from creditors and litigation",
        topics: ["Creditor Protection", "Liability Shields", "Jurisdictional Strategies", "Legal Structures"]
      },
      {
        id: "banking-relationships",
        title: "Advanced Banking Relationships",
        duration: "24 min",
        description: "Building relationships with private banks and managing complex banking needs",
        topics: ["Private Banking", "Credit Facilities", "International Banking", "Relationship Management"]
      },
      {
        id: "estate-planning",
        title: "Estate Planning Integration",
        duration: "29 min",
        description: "Integrating trust structures with comprehensive estate planning strategies",
        topics: ["Succession Planning", "Generation-Skipping", "Charitable Giving", "Legacy Structures"]
      },
      {
        id: "business-operations",
        title: "Trust Business Operations",
        duration: "26 min",
        description: "Operating businesses through trust structures and managing commercial activities",
        topics: ["Business Operations", "Commercial Transactions", "Contract Management", "Liability Issues"]
      },
      {
        id: "international-structures",
        title: "International Trust Structures",
        duration: "31 min",
        description: "Understanding and implementing international trust and entity structures",
        topics: ["Offshore Trusts", "International Entities", "Cross-Border Compliance", "Tax Treaties"]
      },
      {
        id: "dispute-resolution",
        title: "Trust Disputes & Legal Issues",
        duration: "22 min",
        description: "Managing disputes, litigation, and legal challenges involving trust assets",
        topics: ["Dispute Resolution", "Legal Defense", "Court Procedures", "Settlement Strategies"]
      },
      {
        id: "succession-planning",
        title: "Trust Succession & Continuity",
        duration: "25 min",
        description: "Planning for trust continuity and successor trustee arrangements",
        topics: ["Successor Trustees", "Continuity Planning", "Documentation Updates", "Transition Management"]
      },
      {
        id: "advanced-strategies",
        title: "Advanced Trust Strategies",
        duration: "33 min",
        description: "Sophisticated trust strategies for complex financial and legal situations",
        topics: ["Complex Structures", "Multi-Generational Planning", "Special Situations", "Innovation Strategies"]
      }
    ],
    learningOutcomes: [
      "Master trust taxation and implement effective tax minimization strategies",
      "Ensure full compliance with all regulatory requirements",
      "Implement sophisticated asset protection techniques",
      "Manage complex banking relationships and credit facilities",
      "Integrate trust planning with comprehensive estate strategies",
      "Navigate international structures and cross-border compliance",
      "Handle trust disputes and legal challenges effectively"
    ],
    prerequisites: ["Introduction to the New Covenant Trust", "Trust Administration Fundamentals", "Trust Asset Management & Investment Strategies"]
  },
  {
    id: "trust-mastery-legacy",
    title: "Trust Mastery & Wealth Legacy Building",
    description: "Master-level training in sophisticated trust strategies, wealth preservation, and building generational legacy through trust structures",
    level: "master",
    duration: "6.5 hours",
    sectionCount: 12,
    estimatedTime: "8-10 weeks",
    thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    completionBadge: "Trust Master",
    sections: [
      {
        id: "family-office-setup",
        title: "Family Office & Trust Administration",
        duration: "38 min",
        description: "Establishing family office structures and professional trust administration",
        topics: ["Family Office Setup", "Professional Administration", "Governance Structures", "Advisory Boards"]
      },
      {
        id: "multi-generational",
        title: "Multi-Generational Wealth Planning",
        duration: "34 min",
        description: "Creating trust structures that preserve and grow wealth across generations",
        topics: ["Generational Planning", "Dynasty Trusts", "Education Funding", "Values Transmission"]
      },
      {
        id: "business-empire",
        title: "Building Business Empires Through Trusts",
        duration: "31 min",
        description: "Using trust structures to build, acquire, and manage business empires",
        topics: ["Business Acquisition", "Empire Building", "Corporate Structures", "Exit Strategies"]
      },
      {
        id: "alternative-investments",
        title: "Alternative Investment Strategies",
        duration: "29 min",
        description: "Advanced alternative investments including private equity, hedge funds, and exotic assets",
        topics: ["Private Equity", "Hedge Funds", "Art & Collectibles", "Exotic Investments"]
      },
      {
        id: "global-wealth",
        title: "Global Wealth Management",
        duration: "36 min",
        description: "International wealth management and global asset allocation strategies",
        topics: ["Global Diversification", "Currency Strategies", "International Markets", "Sovereign Risk"]
      },
      {
        id: "charitable-giving",
        title: "Charitable Giving & Philanthropic Strategies",
        duration: "27 min",
        description: "Tax-efficient charitable giving and establishing philanthropic legacy",
        topics: ["Charitable Trusts", "Foundation Setup", "Tax Benefits", "Impact Investing"]
      },
      {
        id: "trust-innovations",
        title: "Trust Innovation & Emerging Strategies",
        duration: "33 min",
        description: "Cutting-edge trust strategies and innovations in wealth management",
        topics: ["Blockchain Integration", "Digital Assets", "Innovation Strategies", "Future Trends"]
      },
      {
        id: "crisis-management",
        title: "Crisis Management & Wealth Preservation",
        duration: "30 min",
        description: "Protecting wealth during economic crises and market downturns",
        topics: ["Crisis Planning", "Economic Hedging", "Liquidity Management", "Emergency Strategies"]
      },
      {
        id: "exit-strategies",
        title: "Exit Strategies & Liquidity Events",
        duration: "28 min",
        description: "Managing major liquidity events and business exits through trust structures",
        topics: ["Business Sales", "IPO Strategies", "Liquidity Planning", "Tax Optimization"]
      },
      {
        id: "wealth-mentoring",
        title: "Wealth Mentoring & Family Education",
        duration: "25 min",
        description: "Educating family members and preparing next generation for wealth responsibility",
        topics: ["Financial Education", "Mentoring Programs", "Values Training", "Responsibility Development"]
      },
      {
        id: "legacy-structures",
        title: "Creating Permanent Legacy Structures",
        duration: "32 min",
        description: "Building permanent institutions and structures that outlast generations",
        topics: ["Perpetual Trusts", "Institutional Building", "Endowment Creation", "Legacy Preservation"]
      },
      {
        id: "mastery-integration",
        title: "Trust Mastery Integration",
        duration: "37 min",
        description: "Integrating all trust strategies into a comprehensive wealth management system",
        topics: ["System Integration", "Comprehensive Planning", "Ongoing Management", "Continuous Optimization"]
      }
    ],
    learningOutcomes: [
      "Establish sophisticated family office and professional administration structures",
      "Create multi-generational wealth preservation and growth strategies",
      "Build and manage business empires through advanced trust structures",
      "Implement cutting-edge alternative investment and global wealth strategies",
      "Develop comprehensive philanthropic and charitable giving programs",
      "Navigate crisis management and wealth preservation during market volatility",
      "Manage major liquidity events and business exits efficiently",
      "Build permanent legacy structures that transcend generations"
    ],
    prerequisites: ["Introduction to the New Covenant Trust", "Trust Administration Fundamentals", "Trust Asset Management & Investment Strategies", "Trust Taxation, Compliance & Legal Protection"]
  }
];

export default function Courses() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [openCourses, setOpenCourses] = useState<string[]>([]);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const toggleCourse = (courseId: string) => {
    setOpenCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'foundation': return <BookOpen className="h-5 w-5" />;
      case 'intermediate': return <GraduationCap className="h-5 w-5" />;
      case 'advanced': return <Zap className="h-5 w-5" />;
      case 'master': return <Crown className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'foundation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'intermediate': return 'bg-green-100 text-green-800 border-green-200';
      case 'advanced': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'master': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="pt-16">
      <HeroSection
        title="Kingdom College Courses"
        description="Comprehensive biblical education in covenant theology, spiritual authority, and Kingdom advancement"
        backgroundImage="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
      />

      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Course Overview */}
          <div className="mb-16 text-center">
            <h1 className="font-playfair text-3xl font-bold text-covenant-blue mb-4">
              Progressive Kingdom Education
            </h1>
            <p className="text-lg text-covenant-gray leading-relaxed max-w-3xl mx-auto mb-8">
              Our comprehensive curriculum takes you from foundational covenant understanding to mature apostolic ministry. 
              Each course builds upon the previous, creating a complete educational journey in Kingdom theology and practice.
            </p>
            
            {!isAuthenticated && (
              <div className="bg-covenant-light rounded-lg p-6 max-w-2xl mx-auto">
                <p className="text-covenant-blue font-semibold mb-4">Ready to begin your Kingdom education?</p>
                <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue">
                      <LogIn className="h-4 w-4 mr-2" />
                      Begin Learning Today
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {authMode === 'login' ? 'Student Login' : 'Create Student Account'}
                      </DialogTitle>
                      <DialogDescription>
                        {authMode === 'login' 
                          ? 'Sign in to access all course materials'
                          : 'Join Kingdom College to unlock your divine potential'
                        }
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'login' | 'register')}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="login" className="space-y-4">
                        <Form {...loginForm}>
                          <form className="space-y-4">
                            <FormField
                              control={loginForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your email" {...field} data-testid="input-email" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={loginForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Enter your password" {...field} data-testid="input-password" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue" data-testid="button-login">
                              Sign In
                            </Button>
                          </form>
                        </Form>
                      </TabsContent>
                      
                      <TabsContent value="register" className="space-y-4">
                        <Form {...registerForm}>
                          <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={registerForm.control}
                                name="firstName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="First name" {...field} data-testid="input-firstName" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={registerForm.control}
                                name="lastName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Last name" {...field} data-testid="input-lastName" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={registerForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your email" {...field} data-testid="input-register-email" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={registerForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Create password" {...field} data-testid="input-register-password" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={registerForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Confirm password" {...field} data-testid="input-confirmPassword" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue" data-testid="button-register">
                              Create Account
                            </Button>
                          </form>
                        </Form>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          {/* Courses List */}
          <div className="space-y-6">
            <h2 className="font-playfair text-2xl font-bold text-covenant-blue mb-8">Course Curriculum</h2>
            
            {coursesData.map((course, index) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Collapsible 
                  open={openCourses.includes(course.id)} 
                  onOpenChange={() => toggleCourse(course.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-covenant-light/50 transition-colors" data-testid={`course-header-${course.id}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <img 
                            src={course.thumbnail} 
                            alt={course.title}
                            className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className={`${getLevelColor(course.level)} border`}>
                                <span className="flex items-center gap-1">
                                  {getLevelIcon(course.level)}
                                  <span className="capitalize">{course.level}</span>
                                </span>
                              </Badge>
                              <span className="text-sm text-covenant-gray">{course.duration}</span>
                              <span className="text-sm text-covenant-gray">{course.sectionCount} sections</span>
                            </div>
                            <CardTitle className="text-xl text-covenant-blue mb-2">{course.title}</CardTitle>
                            <CardDescription className="text-covenant-gray">{course.description}</CardDescription>
                            
                            {course.prerequisites && course.prerequisites.length > 0 && (
                              <div className="mt-2">
                                <span className="text-xs text-covenant-gray">Prerequisites: {course.prerequisites.join(", ")}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 ml-4">
                          <Badge className="bg-covenant-gold/10 text-covenant-blue border-covenant-gold">
                            {course.completionBadge}
                          </Badge>
                          {openCourses.includes(course.id) ? (
                            <ChevronDown className="h-5 w-5 text-covenant-blue" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-covenant-blue" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                          {/* Learning Outcomes */}
                          <div className="mb-8">
                            <h4 className="font-semibold text-covenant-blue mb-4 flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              What You'll Learn
                            </h4>
                            <div className="grid md:grid-cols-2 gap-3">
                              {course.learningOutcomes.map((outcome, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-covenant-gray">{outcome}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Course Sections */}
                          <div>
                            <h4 className="font-semibold text-covenant-blue mb-4 flex items-center gap-2">
                              <BookOpen className="h-5 w-5 text-covenant-gold" />
                              Course Sections
                            </h4>
                            <div className="space-y-3">
                              {course.sections.map((section, sectionIdx) => (
                                <div key={section.id} className="border border-covenant-light rounded-lg overflow-hidden">
                                  <Collapsible 
                                    open={openSections.includes(section.id)} 
                                    onOpenChange={() => toggleSection(section.id)}
                                  >
                                    <CollapsibleTrigger asChild>
                                      <div className="p-4 cursor-pointer hover:bg-covenant-light/30 transition-colors" data-testid={`section-header-${section.id}`}>
                                        <div className="flex items-center gap-4">
                                          <div className="w-8 h-8 bg-covenant-light rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-bold text-covenant-blue">{sectionIdx + 1}</span>
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                              <h5 className="font-medium text-covenant-blue">{section.title}</h5>
                                              <Badge variant="outline" className="text-xs">
                                                {section.duration}
                                              </Badge>
                                            </div>
                                            <p className="text-sm text-covenant-gray">{section.description}</p>
                                          </div>
                                          <div className="flex-shrink-0">
                                            {openSections.includes(section.id) ? (
                                              <ChevronDown className="h-4 w-4 text-covenant-blue" />
                                            ) : (
                                              <ChevronRight className="h-4 w-4 text-covenant-blue" />
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </CollapsibleTrigger>
                                    
                                    <CollapsibleContent>
                                      <div className="px-4 pb-4 border-t border-covenant-light/50">
                                        {/* Section Topics */}
                                        <div className="mb-4 pt-4">
                                          <h6 className="text-sm font-medium text-covenant-blue mb-2">Topics Covered:</h6>
                                          <div className="flex flex-wrap gap-2">
                                            {section.topics.map((topic, topicIdx) => (
                                              <span key={topicIdx} className="text-xs bg-covenant-light text-covenant-blue px-2 py-1 rounded">
                                                {topic}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                        
                                        {/* Video Content */}
                                        <div className="bg-gradient-to-br from-covenant-light to-covenant-light/50 rounded-lg p-6 border-2 border-dashed border-covenant-gold/30">
                                          <div className="flex flex-col items-center justify-center text-center space-y-3">
                                            <div className="w-12 h-12 bg-covenant-gold/20 rounded-full flex items-center justify-center">
                                              <Video className="h-6 w-6 text-covenant-gold" />
                                            </div>
                                            <div>
                                              <h6 className="font-medium text-covenant-blue mb-1">
                                                Video: {section.title}
                                              </h6>
                                              <p className="text-xs text-covenant-gray mb-2">
                                                Coming Soon - {section.duration} teaching video
                                              </p>
                                              <Badge className="bg-covenant-gold/10 text-covenant-blue border-covenant-gold text-xs">
                                                Video Content Planned
                                              </Badge>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Text Content Placeholder */}
                                        <div className="mt-4 p-4 bg-white rounded-lg border border-covenant-light">
                                          <h6 className="font-medium text-covenant-blue mb-2">Lesson Content:</h6>
                                          <div className="text-sm text-covenant-gray space-y-2">
                                            <p className="italic">Detailed written content for "{section.title}" will be available here.</p>
                                            <p>This section will include:</p>
                                            <ul className="list-disc list-inside space-y-1 ml-4">
                                              {section.topics.map((topic, idx) => (
                                                <li key={idx}>Step-by-step guidance on {topic.toLowerCase()}</li>
                                              ))}
                                            </ul>
                                            <p className="text-xs text-covenant-gray/70 mt-3">
                                              Content duration: {section.duration} • Coming soon
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </CollapsibleContent>
                                  </Collapsible>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Course Sidebar */}
                        <div>
                          <Card className="sticky top-24">
                            <CardHeader>
                              <CardTitle className="text-lg">Course Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <p className="text-sm font-medium text-covenant-gray">Duration</p>
                                <p className="text-lg font-bold text-covenant-blue">{course.duration}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-covenant-gray">Estimated Time</p>
                                <p className="text-lg font-bold text-covenant-blue">{course.estimatedTime}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-covenant-gray">Sections</p>
                                <p className="text-lg font-bold text-covenant-blue">{course.sectionCount} lessons</p>
                              </div>

                              <div>
                                <p className="text-sm font-medium text-covenant-gray">Completion Badge</p>
                                <Badge className="bg-covenant-gold/10 text-covenant-blue border-covenant-gold">
                                  <Star className="h-3 w-3 mr-1" />
                                  {course.completionBadge}
                                </Badge>
                              </div>

                              {isAuthenticated ? (
                                <Button className="w-full bg-covenant-gold hover:bg-covenant-gold/80 text-covenant-blue" data-testid={`button-start-${course.id}`}>
                                  <Play className="h-4 w-4 mr-2" />
                                  Start Course
                                </Button>
                              ) : (
                                <div className="text-center">
                                  <p className="text-sm text-covenant-gray mb-3">Sign in to access course</p>
                                  <Button 
                                    onClick={() => setShowAuthDialog(true)}
                                    className="w-full bg-covenant-blue hover:bg-covenant-blue/80 text-white"
                                    data-testid={`button-access-${course.id}`}
                                  >
                                    <LogIn className="h-4 w-4 mr-2" />
                                    Get Access
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>

          {/* Scriptural Foundation */}
          <div className="mt-16">
            <ScriptureQuote
              quote="Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth."
              reference="2 Timothy 2:15 (KJV)"
              className="text-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}