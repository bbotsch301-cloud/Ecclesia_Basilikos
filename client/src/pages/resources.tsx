import { Badge } from "@/components/ui/badge";
import DictionarySearch from "@/components/dictionary-search";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Resources() {
  usePageTitle("Resources");

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy py-16 md:py-24">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-royal-gold/20 text-royal-gold border-2 border-royal-gold font-semibold px-6 py-2 text-base backdrop-blur-sm">
            Reference Materials
          </Badge>
          <h1 className="font-cinzel-decorative text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Resources
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Black's Law Dictionary — look up legal terms and definitions to support your foundation work.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DictionarySearch />
      </div>
    </div>
  );
}
