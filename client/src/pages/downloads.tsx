import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, Scale, Shield, BookOpen, Scroll, Crown, ChevronRight, Clock, Users, CheckCircle, ArrowLeft } from "lucide-react";

interface DownloadItem {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  fileType: string;
  fileSize: string;
  icon: any;
  downloadUrl: string | null;
  description: string;
  whenToUse: string[];
  whyItMatters: string;
  contents: string[];
  scripture: { text: string; reference: string };
}

const downloadItems: DownloadItem[] = [
  {
    id: "covenant-trust",
    title: "New Covenant Trust Document",
    shortTitle: "Covenant Trust",
    category: "Foundation",
    fileType: "PDF",
    fileSize: "2.4 MB",
    icon: Scroll,
    downloadUrl: null,
    description: "The foundational document establishing your position within the New Covenant Trust. This comprehensive guide walks you through the biblical basis of trust law as established by Christ, the Grantor, and your role as a beneficiary under the Melchizedek order. It provides both the theological framework and practical application for understanding your covenant identity.",
    whenToUse: [
      "When you are first discovering your covenant identity and need a comprehensive overview",
      "When establishing your standing as a beneficiary of the New Covenant Trust",
      "When you need to reference the biblical foundations of trust law",
      "When sharing the truth of covenant freedom with others who are seeking understanding"
    ],
    whyItMatters: "Understanding the New Covenant Trust is the cornerstone of walking in spiritual sovereignty. Without this foundation, every other document and declaration lacks its proper context. Christ established a trust — He is the Grantor, the Holy Spirit is the Trustee, and the heirs of promise are the beneficiaries. This document connects those eternal truths to your daily walk.",
    contents: [
      "Biblical foundation of trust law",
      "The role of Christ as Grantor",
      "Understanding beneficiary status",
      "The Melchizedek priesthood connection",
      "Practical application guide",
      "Declaration of covenant identity"
    ],
    scripture: { text: "And for this cause he is the mediator of the new testament, that by means of death, for the redemption of the transgressions that were under the first testament, they which are called might receive the promise of eternal inheritance.", reference: "Hebrews 9:15" }
  },
  {
    id: "freedom-declaration",
    title: "Declaration of Covenant Freedom",
    shortTitle: "Freedom Declaration",
    category: "Legal Templates",
    fileType: "PDF",
    fileSize: "1.1 MB",
    icon: Shield,
    downloadUrl: null,
    description: "A formal declaration of your covenant freedom and spiritual sovereignty. This document articulates your standing under divine law and your separation from systems that operate outside of covenant authority. It is both a personal declaration and a formal notice to any who would challenge your position.",
    whenToUse: [
      "When you need to formally declare your covenant standing",
      "When establishing boundaries based on divine authority",
      "When responding to systems or institutions that do not recognize covenant law",
      "As a personal affirmation of your identity and freedom in Christ"
    ],
    whyItMatters: "Declarations carry weight in both the spiritual and natural realms. When you understand who you are in covenant, speaking and documenting that truth becomes an act of faith and authority. This declaration is not about rebellion — it is about alignment with the Kingdom you belong to.",
    contents: [
      "Preamble of covenant identity",
      "Declaration of spiritual jurisdiction",
      "Statement of divine law alignment",
      "Notice of covenant standing",
      "Scriptural foundations and references",
      "Signature and witness section"
    ],
    scripture: { text: "If the Son therefore shall make you free, ye shall be free indeed.", reference: "John 8:36" }
  },
  {
    id: "trust-law-study",
    title: "Trust Law Fundamentals Study Guide",
    shortTitle: "Trust Law Study",
    category: "Study Guides",
    fileType: "PDF",
    fileSize: "3.8 MB",
    icon: BookOpen,
    downloadUrl: null,
    description: "An in-depth study guide covering the fundamentals of trust law as they connect to biblical covenant. This guide bridges the gap between modern legal concepts and ancient biblical principles, showing how the trust structure has always been God's method for managing His creation and blessing His people.",
    whenToUse: [
      "When you want a deeper academic understanding of trust law principles",
      "During group study sessions or covenant education courses",
      "When preparing to teach others about the trust relationship with God",
      "As a reference companion alongside the Covenant Trust Document"
    ],
    whyItMatters: "Knowledge is power, but understanding is wisdom. Many believers live beneath their covenant privileges because they do not understand the legal framework God established. This study guide demystifies trust law and reveals it as the operating system of the Kingdom — not a man-made invention, but a divine pattern.",
    contents: [
      "Introduction to trust law concepts",
      "Grantor, Trustee, and Beneficiary roles",
      "Biblical parallels in trust structure",
      "The difference between legal and lawful",
      "Historical context of trust law",
      "Discussion questions for group study",
      "Self-assessment and reflection exercises"
    ],
    scripture: { text: "My people are destroyed for lack of knowledge: because thou hast rejected knowledge, I will also reject thee.", reference: "Hosea 4:6" }
  },
  {
    id: "identity-notice",
    title: "Covenant Identity Notice",
    shortTitle: "Identity Notice",
    category: "Legal Templates",
    fileType: "PDF",
    fileSize: "890 KB",
    icon: Scale,
    downloadUrl: null,
    description: "A formal notice establishing your identity under covenant law. This document serves as a written record of who you are in the sight of the Most High — not as defined by any earthly system, but as established by divine decree. It is a concise, authoritative statement of your covenant identity.",
    whenToUse: [
      "When establishing your identity for formal or official purposes under covenant law",
      "When you need a concise document that states your covenant standing clearly",
      "As a companion to the Freedom Declaration for comprehensive documentation",
      "When corresponding with institutions that require identification of your standing"
    ],
    whyItMatters: "Identity is everything. The enemy's primary strategy is to confuse who you are. When you know your identity — not as the world defines it, but as God has established it — you stand on unshakeable ground. This notice puts that truth in writing, serving as both a personal anchor and a formal record.",
    contents: [
      "Statement of covenant identity",
      "Authority and jurisdiction declaration",
      "Scriptural identity foundations",
      "Notice of divine citizenship",
      "Formal acknowledgment section"
    ],
    scripture: { text: "But ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people; that ye should shew forth the praises of him who hath called you out of darkness into his marvellous light.", reference: "1 Peter 2:9" }
  },
  {
    id: "beneficiary-statement",
    title: "Trust Beneficiary Statement",
    shortTitle: "Beneficiary Statement",
    category: "Foundation",
    fileType: "PDF",
    fileSize: "1.3 MB",
    icon: Crown,
    downloadUrl: null,
    description: "A detailed statement of your position as a beneficiary of the New Covenant Trust. This document outlines the rights, privileges, and responsibilities that come with being an heir of promise. It connects the theological truth of inheritance with practical understanding of what it means to operate as a trust beneficiary.",
    whenToUse: [
      "When you need to understand the full scope of your inheritance in Christ",
      "When claiming covenant rights and privileges in prayer or declaration",
      "As a teaching tool to help others understand their beneficiary status",
      "When you need encouragement about what belongs to you under the covenant"
    ],
    whyItMatters: "Many believers know they are 'saved' but do not understand they are also heirs — beneficiaries of an eternal trust with real, tangible provisions. This statement connects the dots between salvation and inheritance, showing that what Christ accomplished was not just forgiveness, but full restoration of everything Adam lost.",
    contents: [
      "Definition of trust beneficiary status",
      "Covenant rights and provisions",
      "Responsibilities of the beneficiary",
      "The inheritance of the saints",
      "Claiming your covenant position",
      "Prayer of beneficiary activation"
    ],
    scripture: { text: "The Spirit itself beareth witness with our spirit, that we are the children of God: And if children, then heirs; heirs of God, and joint-heirs with Christ.", reference: "Romans 8:16-17" }
  },
  {
    id: "daily-prayer-guide",
    title: "Daily Covenant Prayer & Declarations",
    shortTitle: "Daily Prayers",
    category: "Prayers & Declarations",
    fileType: "PDF",
    fileSize: "1.6 MB",
    icon: FileText,
    downloadUrl: null,
    description: "A comprehensive collection of daily prayers, declarations, and affirmations rooted in covenant truth. This guide provides structured morning and evening prayers, topical declarations for specific situations, and scripture-based affirmations designed to renew your mind and strengthen your covenant identity day by day.",
    whenToUse: [
      "As part of your daily devotional and prayer routine",
      "When facing specific challenges that require covenant declarations",
      "During spiritual warfare or when your identity is being challenged",
      "When teaching others how to pray from a position of covenant authority"
    ],
    whyItMatters: "Prayer is not begging — it is communication between a King and His royal family. When you pray from a position of covenant identity, your prayers carry authority. These declarations are not mantras or formulas; they are truth spoken in faith, aligning your words with what heaven has already established.",
    contents: [
      "Morning covenant activation prayer",
      "Evening reflection and gratitude",
      "Declarations of identity and authority",
      "Spiritual warfare prayers",
      "Prayers for wisdom and discernment",
      "Family and household blessing declarations",
      "Topical prayer index"
    ],
    scripture: { text: "Death and life are in the power of the tongue: and they that love it shall eat the fruit thereof.", reference: "Proverbs 18:21" }
  }
];

const categories = ["All", "Foundation", "Legal Templates", "Study Guides", "Prayers & Declarations"];

export default function Downloads() {
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<DownloadItem | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const handleDownload = (item: DownloadItem) => {
    if (item.downloadUrl) {
      window.open(item.downloadUrl, '_blank');
    } else {
      toast({
        title: "Coming Soon",
        description: `The "${item.title}" document is being prepared and will be available for download shortly.`,
      });
    }
  };

  const filteredItems = activeCategory === "All" 
    ? downloadItems 
    : downloadItems.filter(item => item.category === activeCategory);

  return (
    <div className="pt-16">
      <div className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy py-16 md:py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-royal-gold/20 text-royal-gold border-2 border-royal-gold font-semibold px-6 py-2 text-base backdrop-blur-sm">
            Covenant Resources
          </Badge>
          <h1 className="font-cinzel-decorative text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Kingdom Downloads
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Essential documents, study guides, and declarations for walking in covenant freedom. Select a resource to learn more before downloading.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setSelectedItem(null); }}
              className={`px-4 py-2 rounded-full text-sm font-cinzel font-medium transition-all ${
                activeCategory === cat
                  ? "bg-royal-gold text-royal-navy shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-royal-navy-light dark:text-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className={`${selectedItem ? 'hidden lg:block' : ''} lg:col-span-4`}>
            <div className="sticky top-24">
              <h2 className="font-cinzel text-lg font-bold text-royal-navy dark:text-royal-gold mb-4 px-1">
                Available Documents
              </h2>
              <div className="overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                <div className="space-y-2">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`w-full text-left p-4 rounded-xl transition-all group ${
                          isSelected
                            ? "bg-royal-navy text-white shadow-lg scale-[1.02]"
                            : "bg-white dark:bg-royal-navy-light hover:bg-gray-50 dark:hover:bg-royal-navy border border-gray-200 dark:border-gray-700 hover:border-royal-gold/50 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            isSelected ? "bg-royal-gold/20" : "bg-royal-gold/10 group-hover:bg-royal-gold/20"
                          }`}>
                            <Icon className={`w-5 h-5 ${isSelected ? "text-royal-gold" : "text-royal-gold"}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-cinzel font-semibold text-sm leading-tight ${
                              isSelected ? "text-white" : "text-royal-navy dark:text-gray-200"
                            }`}>
                              {item.shortTitle}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className={`text-xs ${
                                isSelected ? "bg-royal-gold/30 text-royal-gold border-0" : ""
                              }`}>
                                {item.category}
                              </Badge>
                              <span className={`text-xs ${isSelected ? "text-gray-300" : "text-gray-400"}`}>
                                {item.fileType}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${
                            isSelected ? "text-royal-gold translate-x-1" : "text-gray-400 group-hover:text-royal-gold group-hover:translate-x-1"
                          }`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            {selectedItem ? (
              <div className="space-y-6">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="lg:hidden flex items-center gap-2 text-royal-gold font-cinzel font-medium mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to documents
                </button>

                <div className="bg-white dark:bg-royal-navy-light rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                  <div className="bg-gradient-to-r from-royal-navy to-royal-burgundy p-8">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-royal-gold/20 rounded-xl">
                        {(() => { const Icon = selectedItem.icon; return <Icon className="w-8 h-8 text-royal-gold" />; })()}
                      </div>
                      <div className="flex-1">
                        <Badge className="mb-2 bg-royal-gold/20 text-royal-gold border-royal-gold/40">
                          {selectedItem.category}
                        </Badge>
                        <h2 className="font-cinzel-decorative text-2xl md:text-3xl font-bold text-white mb-2">
                          {selectedItem.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm">
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" /> {selectedItem.fileType}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-4 h-4" /> {selectedItem.fileSize}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    <div className="bg-royal-gold/5 border border-royal-gold/20 rounded-xl p-6">
                      <blockquote className="font-serif text-lg italic text-gray-700 dark:text-gray-300 mb-2">
                        "{selectedItem.scripture.text}"
                      </blockquote>
                      <cite className="text-royal-gold font-cinzel font-semibold text-sm">
                        — {selectedItem.scripture.reference}
                      </cite>
                    </div>

                    <div>
                      <h3 className="font-cinzel text-xl font-bold text-royal-navy dark:text-royal-gold mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-royal-gold" />
                        About This Document
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                        {selectedItem.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-cinzel text-xl font-bold text-royal-navy dark:text-royal-gold mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-royal-gold" />
                        When to Use This Document
                      </h3>
                      <ul className="space-y-3">
                        {selectedItem.whenToUse.map((use, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-royal-gold flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600 dark:text-gray-300">{use}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-royal-navy/5 to-royal-burgundy/5 dark:from-royal-navy dark:to-royal-burgundy/30 rounded-xl p-6 border border-royal-navy/10 dark:border-gray-600">
                      <h3 className="font-cinzel text-xl font-bold text-royal-navy dark:text-royal-gold mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-royal-gold" />
                        Why This Matters
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {selectedItem.whyItMatters}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-cinzel text-xl font-bold text-royal-navy dark:text-royal-gold mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-royal-gold" />
                        What's Inside
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {selectedItem.contents.map((content, i) => (
                          <div key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-royal-navy/50 rounded-lg p-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-royal-gold flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{content}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                      <Card className="bg-gradient-to-r from-royal-gold/10 to-royal-gold/5 border-royal-gold/30">
                        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
                          <div className="flex-1 text-center sm:text-left">
                            <h4 className="font-cinzel font-bold text-royal-navy dark:text-royal-gold text-lg mb-1">
                              Ready to Download?
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {selectedItem.fileType} document · {selectedItem.fileSize}
                            </p>
                          </div>
                          <Button 
                            size="lg"
                            onClick={() => handleDownload(selectedItem)}
                            className="bg-royal-gold hover:bg-royal-gold-bright text-royal-navy font-cinzel font-bold px-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                          >
                            <Download className="w-5 h-5 mr-2" />
                            {selectedItem.downloadUrl ? `Download ${selectedItem.fileType}` : "Coming Soon"}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center max-w-md">
                  <div className="p-6 bg-royal-gold/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <Scroll className="w-12 h-12 text-royal-gold" />
                  </div>
                  <h3 className="font-cinzel-decorative text-2xl font-bold text-royal-navy dark:text-royal-gold mb-3">
                    Select a Document
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Choose a document from the list to learn more about it, understand when and why to use it, and download it for your covenant journey.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
