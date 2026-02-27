import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Download, FileText, Scale, Shield, BookOpen, Scroll, Crown, ChevronRight, Clock, Users, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import type { Download as DownloadType } from "@shared/schema";
import { usePageTitle } from "@/hooks/usePageTitle";

const iconMap: Record<string, any> = {
  scroll: Scroll,
  shield: Shield,
  "book-open": BookOpen,
  scale: Scale,
  crown: Crown,
  "file-text": FileText,
};

function getIcon(iconType: string | null) {
  return iconMap[iconType || "file-text"] || FileText;
}

function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // If it's not valid JSON, it might be a raw string from an older record or manual entry
    return value.split("\n").map(s => s.trim()).filter(Boolean);
  }
  return [];
}

const categories = ["All", "Foundation", "Legal Templates", "Study Guides", "Prayers & Declarations"];

export default function Downloads() {
  usePageTitle("Downloads");
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<DownloadType | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: downloadItems = [], isLoading } = useQuery<DownloadType[]>({
    queryKey: ["/api/downloads/published"],
  });

  const handleDownload = async (item: DownloadType) => {
    if (item.fileUrl) {
      apiRequest("POST", `/api/downloads/${item.id}/track`).catch(console.error);
      import("@/lib/analytics").then(m => m.trackEvent("Download", { title: item.title }));
      window.open(item.fileUrl, '_blank');
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

  const whenToUseList = selectedItem ? parseJsonArray(selectedItem.whenToUse) : [];
  const contentsList = selectedItem ? parseJsonArray(selectedItem.contents) : [];

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

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-royal-gold" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <Scroll className="w-12 h-12 text-royal-gold mx-auto mb-4" />
              <h3 className="font-cinzel text-xl font-bold text-royal-navy dark:text-royal-gold mb-2">No Documents Available</h3>
              <p className="text-gray-500 dark:text-gray-400">Documents are being prepared for this category. Check back soon.</p>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            <div className={`${selectedItem ? 'hidden lg:block' : ''} lg:col-span-4`}>
              <div className="sticky top-24">
                <h2 className="font-cinzel text-lg font-bold text-royal-navy dark:text-royal-gold mb-4 px-1">
                  Available Documents
                </h2>
                <div className="overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                  <div className="space-y-2">
                    {filteredItems.map((item) => {
                      const Icon = getIcon(item.iconType);
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
                              <Icon className="w-5 h-5 text-royal-gold" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-cinzel font-semibold text-sm leading-tight ${
                                isSelected ? "text-white" : "text-royal-navy dark:text-gray-200"
                              }`}>
                                {item.shortTitle || item.title}
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
                          {(() => { const Icon = getIcon(selectedItem.iconType); return <Icon className="w-8 h-8 text-royal-gold" />; })()}
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
                            {selectedItem.fileSize && (
                              <span className="flex items-center gap-1">
                                <Download className="w-4 h-4" /> {selectedItem.fileSize}
                              </span>
                            )}
                            {(selectedItem.downloadCount ?? 0) > 0 && (
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" /> {selectedItem.downloadCount} downloads
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 space-y-8">
                      {selectedItem.scriptureText && selectedItem.scriptureReference && (
                        <div className="bg-royal-gold/5 border border-royal-gold/20 rounded-xl p-6">
                          <blockquote className="font-serif text-lg italic text-gray-700 dark:text-gray-300 mb-2">
                            "{selectedItem.scriptureText}"
                          </blockquote>
                          <cite className="text-royal-gold font-cinzel font-semibold text-sm">
                            — {selectedItem.scriptureReference}
                          </cite>
                        </div>
                      )}

                      {selectedItem.description && (
                        <div>
                          <h3 className="font-cinzel text-xl font-bold text-royal-navy dark:text-royal-gold mb-3 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-royal-gold" />
                            About This Document
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                            {selectedItem.description}
                          </p>
                        </div>
                      )}

                      {whenToUseList.length > 0 && (
                        <div>
                          <h3 className="font-cinzel text-xl font-bold text-royal-navy dark:text-royal-gold mb-3 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-royal-gold" />
                            When to Use This Document
                          </h3>
                          <ul className="space-y-3">
                            {whenToUseList.map((use, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-royal-gold flex-shrink-0 mt-0.5" />
                                <span className="text-gray-600 dark:text-gray-300">{use}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedItem.whyItMatters && (
                        <div className="bg-gradient-to-br from-royal-navy/5 to-royal-burgundy/5 dark:from-royal-navy dark:to-royal-burgundy/30 rounded-xl p-6 border border-royal-navy/10 dark:border-gray-600">
                          <h3 className="font-cinzel text-xl font-bold text-royal-navy dark:text-royal-gold mb-3 flex items-center gap-2">
                            <Users className="w-5 h-5 text-royal-gold" />
                            Why This Matters
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {selectedItem.whyItMatters}
                          </p>
                        </div>
                      )}

                      {contentsList.length > 0 && (
                        <div>
                          <h3 className="font-cinzel text-xl font-bold text-royal-navy dark:text-royal-gold mb-3 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-royal-gold" />
                            What's Inside
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {contentsList.map((content, i) => (
                              <div key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-royal-navy/50 rounded-lg p-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-royal-gold flex-shrink-0" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{content}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                        <Card className="bg-gradient-to-r from-royal-gold/10 to-royal-gold/5 border-royal-gold/30">
                          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex-1 text-center sm:text-left">
                              <h4 className="font-cinzel font-bold text-royal-navy dark:text-royal-gold text-lg mb-1">
                                Ready to Download?
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {selectedItem.fileType} document{selectedItem.fileSize ? ` · ${selectedItem.fileSize}` : ''}
                              </p>
                            </div>
                            <Button 
                              size="lg"
                              onClick={() => handleDownload(selectedItem)}
                              className="bg-royal-gold hover:bg-royal-gold-bright text-royal-navy font-cinzel font-bold px-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                            >
                              <Download className="w-5 h-5 mr-2" />
                              {selectedItem.fileUrl ? `Download ${selectedItem.fileType}` : "Coming Soon"}
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
        )}
      </div>
    </div>
  );
}
