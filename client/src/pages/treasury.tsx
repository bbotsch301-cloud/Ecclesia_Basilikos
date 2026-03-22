import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Coins,
  TrendingUp,
  Clock,
  Loader2,
  ArrowDownToLine,
  ShieldCheck,
  Share2,
  Building2,
  HeartHandshake,
  MapPin,
  BarChart3,
  RefreshCcw,
  ChevronDown,
} from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useState } from "react";

interface PublicTreasuryData {
  balance: number;
  totalInflow: number;
  transactionCount: number;
  breakdownByType: Record<string, number>;
}

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatType(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Treasury() {
  usePageTitle("Treasury");

  const { data, isLoading, error } = useQuery<PublicTreasuryData>({
    queryKey: ["/api/treasury/public"],
    queryFn: async () => {
      const res = await fetch("/api/treasury/public");
      if (res.status === 404) throw new Error("not_available");
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen pt-16">
        <section className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <Coins className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h1 className="font-cinzel-decorative text-4xl md:text-5xl font-bold text-white mb-4">
              Treasury
            </h1>
            <p className="text-lg text-gray-200">This feature is being prepared</p>
            <p className="text-gray-300 mt-4 max-w-xl mx-auto">
              The Treasury Trust transparency page is under development. You will be able to see how contributions are stewarded for the benefit of all members.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <Coins className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h1 className="font-cinzel-decorative text-4xl md:text-5xl font-bold text-white mb-4">
            Treasury Trust
          </h1>
          <p className="text-lg text-gray-200 max-w-xl mx-auto">
            Transparent stewardship of member contributions. 50% of every contribution flows to the Treasury Trust for community benefit. The other 50% flows to Operations, administered by the Trustee, to sustain and grow the ministry.
          </p>
        </div>
      </section>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Treasury Balance</CardTitle>
              <Coins className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-700">{formatCents(data.balance)}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Contributions</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-700">{formatCents(data.totalInflow)}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Transactions</CardTitle>
              <Clock className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-700">{data.transactionCount}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Breakdown */}
      {Object.keys(data.breakdownByType).length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="font-cinzel text-lg">Allocation Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(data.breakdownByType).map(([type, total]) => (
                  <div key={type} className="flex items-center justify-between py-2 border-b last:border-0">
                    <Badge variant="outline">{formatType(type)}</Badge>
                    <span className="font-medium">{formatCents(total)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Purpose of the Treasury */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <div className="text-center mb-8">
          <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-royal-navy mb-4">
            The Storehouse Principle
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The Treasury Trust implements the biblical storehouse principle (Malachi 3:10): a centralized
            repository that receives contributions and distributes according to community need. It is the
            financial heart of the community, ensuring every member's contribution is stewarded with purpose.
          </p>
        </div>
        <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50/50 to-white">
          <CardContent className="pt-6">
            <p className="text-gray-700 text-center">
              <span className="font-semibold text-royal-navy">50% of every contribution</span>{" "}
              flows to the Treasury Trust for community benefit. The other 50% flows to Operations,
              administered by the Trustee, to sustain and grow the ministry.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16 mb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-royal-navy text-center mb-10">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center shadow-md">
              <CardContent className="pt-8 pb-6">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <ArrowDownToLine className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="font-cinzel text-lg font-bold text-royal-navy mb-2">Receive</h3>
                <p className="text-gray-600 text-sm">
                  Member contributions, enterprise profits, and asset appreciation flow into the Treasury Trust.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-md">
              <CardContent className="pt-8 pb-6">
                <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-7 w-7 text-yellow-600" />
                </div>
                <h3 className="font-cinzel text-lg font-bold text-royal-navy mb-2">Steward</h3>
                <p className="text-gray-600 text-sm">
                  The Financial Trustee manages funds and invests in assets such as crypto, precious metals, and
                  productive enterprises to grow community wealth.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-md">
              <CardContent className="pt-8 pb-6">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Share2 className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="font-cinzel text-lg font-bold text-royal-navy mb-2">Distribute</h3>
                <p className="text-gray-600 text-sm">
                  Funds are allocated to operational trusts, emergency reserves, community expansion, and
                  benevolence for members in need.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Where Funds Go */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-royal-navy text-center mb-8">
          Where Funds Go
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Building2, label: "Operational Budgets", desc: "Land, housing, enterprise, and education trusts" },
            { icon: ShieldCheck, label: "Emergency Reserves", desc: "Community projects and crisis response funds" },
            { icon: MapPin, label: "Chapter Expansion", desc: "Establishing new chapters and communities" },
            { icon: HeartHandshake, label: "Benevolence", desc: "Support for members facing hardship" },
            { icon: BarChart3, label: "Asset Growth & Investment", desc: "Crypto, precious metals, and productive assets" },
          ].map(({ icon: Icon, label, desc }) => (
            <Card key={label} className="flex items-start gap-4 p-4 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-royal-navy/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="h-5 w-5 text-royal-navy" />
              </div>
              <div>
                <h3 className="font-semibold text-royal-navy">{label}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Governance & Oversight */}
      <section className="bg-gray-50 py-16 mb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-royal-navy text-center mb-8">
            Governance & Oversight
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Financial Trustee", text: "A delegable fiduciary role responsible for day-to-day treasury management and investment decisions." },
              { title: "Protector Council", text: "Provides oversight and can veto any allocation that violates the community charter or trust principles." },
              { title: "Annual Review", text: "Budgets and treasury reports are reviewed by governance bodies to ensure alignment with community goals." },
              { title: "Transparent Ledger", text: "All allocations are recorded on an internal ledger, with future plans for on-chain transparency." },
            ].map(({ title, text }) => (
              <Card key={title} className="shadow-sm">
                <CardContent className="pt-6">
                  <h3 className="font-cinzel font-bold text-royal-navy mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The Circular Flow */}
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-royal-navy text-center mb-6">
          The Circular Flow
        </h2>
        <Card className="border-royal-navy/20 bg-gradient-to-br from-royal-navy/5 to-transparent">
          <CardContent className="pt-8 pb-8">
            <div className="flex items-center justify-center mb-6">
              <RefreshCcw className="h-10 w-10 text-royal-navy/60" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm md:text-base text-royal-navy font-medium mb-6">
              {["Member Contributes", "Enterprise Produces", "Profits Flow to Treasury", "Treasury Allocates to Trusts", "Trusts Provide Benefits", "Members Sustained"].map((step, i, arr) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="bg-royal-navy/10 px-3 py-1.5 rounded-full text-center">{step}</span>
                  {i < arr.length - 1 && <span className="text-yellow-500 font-bold">→</span>}
                </span>
              ))}
            </div>
            <p className="text-gray-600 text-center text-sm max-w-2xl mx-auto">
              No private shareholders. No profit extraction. Funds circulate for the collective benefit of every
              member: a self-sustaining ecosystem where contribution fuels growth and growth fuels contribution.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-royal-navy text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          <FAQItem
            question="Where does my contribution go?"
            answer="50% of every contribution flows to the Treasury Trust for community benefit. The other 50% flows to Operations, administered by the Trustee, to sustain and grow the ministry."
          />
          <FAQItem
            question="Who controls the treasury?"
            answer="The Financial Trustee manages day-to-day treasury operations under governance oversight. The Protector Council can veto any allocation that violates the community charter."
          />
          <FAQItem
            question="Can funds be invested?"
            answer="Yes. Per governance policy, treasury funds may be invested in cryptocurrency, precious metals, and productive enterprises to grow community wealth over time."
          />
          <FAQItem
            question="How is transparency ensured?"
            answer="All allocations are recorded on an internal ledger visible to governance bodies. Future plans include on-chain transparency so every member can verify treasury activity."
          />
        </div>
      </section>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Card
      className="cursor-pointer shadow-sm hover:shadow-md transition-shadow"
      role="button"
      tabIndex={0}
      onClick={() => setOpen(!open)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(!open); } }}
    >
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-royal-navy pr-4">{question}</h3>
          <ChevronDown
            className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
        {open && <p className="text-gray-600 text-sm mt-3">{answer}</p>}
      </CardContent>
    </Card>
  );
}
