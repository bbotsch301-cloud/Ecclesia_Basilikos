import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Telescope,
  Landmark,
  Home,
  Network,
  Globe,
  ShieldCheck,
  HeartHandshake,
  Hammer,
  ArrowRight,
} from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useCtaHref } from "@/hooks/useCtaHref";

const phases = [
  {
    number: 1,
    title: "Foundation",
    status: "Current Stage",
    icon: Landmark,
    color: "yellow",
    highlights: [
      "Legal foundations — charter, PMA, trust instruments filed and operational",
      "Digital platform — courses, forum, proof vault, and internal ledger live",
      "Community formation — member enrollment, assemblies, Royal Academy curriculum",
      "Governance establishment — trustees seated, protector council constituted",
    ],
  },
  {
    number: 2,
    title: "First Chapter — Proof of Concept",
    icon: Home,
    color: "green",
    highlights: [
      "Land acquisition through the community land trust",
      "First resident members establishing covenant community life",
      "Agricultural operations and first cooperative enterprises launched",
      "Labor credit system piloted; communes and guilds begin forming",
    ],
  },
  {
    number: 3,
    title: "Network Growth — Multiple Chapters",
    icon: Network,
    color: "blue",
    highlights: [
      "Expand to strategic locations with climate and economic diversity",
      "Guilds coordinate specialized labor and knowledge across chapters",
      "Inter-chapter trade routes and internal supply chains established",
      "Treasury reserves built toward multi-year operational independence",
    ],
  },
  {
    number: 4,
    title: "Maturity — Fully Functioning Covenant Economy",
    icon: Globe,
    color: "purple",
    highlights: [
      "Comprehensive internal production — food, housing, education, healthcare",
      "Proven governance with tested succession and conflict-resolution procedures",
      "Replicable model documented and available for chapters worldwide",
      "Generational vision realized — children formed in covenant from birth, trust corpus growing across generations",
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; ring: string; dot: string }> = {
  yellow: { bg: "bg-yellow-100", text: "text-yellow-700", ring: "ring-yellow-400", dot: "bg-yellow-400" },
  green: { bg: "bg-green-100", text: "text-green-700", ring: "ring-green-400", dot: "bg-green-400" },
  blue: { bg: "bg-blue-100", text: "text-blue-700", ring: "ring-blue-400", dot: "bg-blue-400" },
  purple: { bg: "bg-purple-100", text: "text-purple-700", ring: "ring-purple-400", dot: "bg-purple-400" },
};

const fullnessPoints = [
  "No member is dependent on external employment for survival",
  "No external creditor holds leverage over community assets",
  "No child grows up without access to covenant education and formation",
  "No family faces housing insecurity within the community",
  "No member lacks access to healthcare, food, or essential goods",
  "No enterprise extracts profit for outside shareholders",
  "No generation inherits less than the one before it",
];

const differentiators = [
  {
    icon: ShieldCheck,
    title: "Not Utopian",
    description:
      "Legally grounded in 600 years of trust law and constitutionally protected religious assembly. Every structure has a proven legal basis.",
  },
  {
    icon: HeartHandshake,
    title: "Not Extraction",
    description:
      "No shareholders, no profit extraction. Every dollar contributed circulates for the collective benefit of members and their families.",
  },
  {
    icon: Hammer,
    title: "Not Theoretical",
    description:
      "Being built now — platform live, members enrolled, governance seated, Phase 1 underway. This is not a whiteboard exercise.",
  },
];

export default function Vision() {
  usePageTitle("The Vision");
  const ctaHref = useCtaHref();

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-royal-navy via-royal-burgundy to-royal-navy py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, white 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <Telescope className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h1 className="font-cinzel-decorative text-4xl md:text-5xl font-bold text-white mb-3">
            The Vision
          </h1>
          <p className="font-cinzel text-lg text-yellow-300 mb-4">
            From Foundation to Fullness
          </p>
          <p className="text-gray-200 max-w-xl mx-auto">
            A phased journey from covenant foundation to a fully self-sustaining
            Kingdom economy — built one chapter, one enterprise, one faithful
            steward at a time.
          </p>
        </div>
      </section>

      {/* Where We Stand */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-royal-navy mb-6">
            Where We Stand
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            We are in <span className="font-semibold text-royal-navy">Phase 1 — Foundation</span>.
            The legal instruments are filed, the digital platform is live, and the first
            members are enrolled. What follows is a generational vision — not a sprint,
            but a patient, faithful buildout of the infrastructure that will sustain
            covenant communities for decades to come.
          </p>
        </div>
      </section>

      {/* Phase Timeline */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-royal-navy text-center mb-12">
            The Four Phases
          </h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-royal-navy/15 hidden md:block" />

            <div className="space-y-8">
              {phases.map((phase) => {
                const Icon = phase.icon;
                const colors = colorMap[phase.color];
                return (
                  <div key={phase.number} className="relative md:pl-16">
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-4 top-6 w-5 h-5 rounded-full ${colors.dot} ring-4 ring-white hidden md:block`}
                    />
                    <Card className="shadow-md">
                      <CardContent className="pt-6 pb-6">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <div
                            className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}
                          >
                            <Icon className={`h-5 w-5 ${colors.text}`} />
                          </div>
                          <h3 className="font-cinzel text-lg font-bold text-royal-navy">
                            Phase {phase.number}: {phase.title}
                          </h3>
                          {phase.status && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                              {phase.status}
                            </Badge>
                          )}
                        </div>
                        <ul className="space-y-2 ml-1">
                          {phase.highlights.map((item, i) => (
                            <li key={i} className="flex items-start text-gray-700 text-sm">
                              <span className={`${colors.text} mr-2 mt-0.5`}>•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* The Fullness */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-royal-navy mb-4">
              The Fullness
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              When the covenant economy reaches maturity, the community will
              function as a self-sustaining ecosystem where every member is
              provided for and every generation inherits more than the last.
            </p>
          </div>

          <Card className="border-royal-navy/20 bg-gradient-to-br from-royal-navy to-royal-burgundy text-white">
            <CardContent className="pt-8 pb-8">
              <ul className="space-y-3 max-w-2xl mx-auto">
                {fullnessPoints.map((point, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-yellow-400 mr-3 mt-0.5 font-bold">✦</span>
                    <span className="text-gray-100">{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-white/20 text-center">
                <p className="text-yellow-300 italic text-sm max-w-xl mx-auto">
                  "And all that believed were together, and had all things common;
                  and sold their possessions and goods, and parted them to all men,
                  as every man had need."
                </p>
                <p className="text-yellow-400 font-cinzel text-xs mt-2">
                  — Acts 2:44–45
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What Makes This Different */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-royal-navy text-center mb-10">
            What Makes This Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {differentiators.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="text-center shadow-md">
                <CardContent className="pt-8 pb-6">
                  <div className="w-14 h-14 rounded-full bg-royal-navy/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-royal-navy" />
                  </div>
                  <h3 className="font-cinzel text-lg font-bold text-royal-navy mb-2">
                    {title}
                  </h3>
                  <p className="text-gray-600 text-sm">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-royal-navy mb-4">
            Build With Us
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            The foundation is laid. The first members are enrolled. Now we build —
            together, faithfully, one phase at a time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={ctaHref}>
              <Button className="bg-royal-gold hover:bg-royal-gold/90 text-royal-navy font-cinzel font-bold px-8 py-3">
                Join the Covenant <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="font-cinzel px-8 py-3 border-royal-navy/30 text-royal-navy">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
