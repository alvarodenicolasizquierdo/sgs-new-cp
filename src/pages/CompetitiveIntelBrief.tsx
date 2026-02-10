import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Printer, Shield, FlaskConical, Factory, Network, BarChart3, Bot, Globe, Truck, Microscope, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, Target, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { tagScreen } from "@/utils/clarityTracking";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const briefMeta = {
  title: "TIC Competitive Intelligence Brief",
  subtitle: "Testing, Inspection & Certification — Digital Platform Landscape",
  version: "Q1 2026",
  date: "February 2026",
  classification: "INTERNAL — SGS Digital Product Team",
  preparedFor: "CARLOS Programme Board",
};

const marketLandscape = {
  marketSize: "$67.2 B",
  cagr: "5.8%",
  forecastYear: "2030",
  digitalPenetration: "~18%",
  summary:
    "The global TIC market is undergoing rapid digital transformation. Traditional lab-backed incumbents (SGS, Bureau Veritas, Intertek) face pressure from AI-native SaaS challengers (Inspectorio, QIMA) that aggregate supply-chain data across brand networks. Regulatory complexity (EUDR, UFLPA, CSDDD) is accelerating demand for integrated compliance platforms.",
  drivers: [
    "Regulatory proliferation (EUDR, UFLPA, CSDDD, CSRD) forces multi-standard compliance",
    "Supply-chain transparency mandates (DPP, forced-labour screening)",
    "AI-powered quality prediction reduces reliance on physical inspection",
    "Brand consolidation of TIC vendors — fewer, deeper integrations preferred",
    "ESG reporting requirements elevating TIC from cost-centre to strategic asset",
  ],
};

const competitors = [
  {
    name: "Inspectorio",
    type: "AI-Native SaaS",
    hq: "Minneapolis, USA",
    coverage: "Global (15 000+ suppliers)",
    funding: "$100 M+ (Series B, 2022)",
    strengths: [
      "Network-effect data moat from 15 000+ supplier ecosystem",
      "Paramo AI platform (Agents, Copilots) across quality, compliance, traceability",
      "Full supply-chain traceability (Tier 4+ to Tier 1) with regulatory export",
      "Mobile-first inspection with offline capability",
      "Self-inspection programmes governed by risk algorithms",
    ],
    weaknesses: [
      "No owned laboratories — cannot independently verify test data (Trust Gap)",
      "AI reliability concerns reported (Nov 2025 incident)",
      "Kohl's rejected testing and audit modules — enterprise adoption uneven",
      "No ZDHC Gateway, RSL screening, or chemical management",
      "No Gold Seal / multi-level testing lifecycle equivalent",
    ],
    threat: "high" as const,
  },
  {
    name: "QIMA",
    type: "Platform + Service",
    hq: "Hong Kong",
    coverage: "100+ countries, 3 000+ auditors",
    funding: "PE-backed (Partners Group, 2019)",
    strengths: [
      "QIMAone digital platform with supplier management & analytics",
      "Marketplace model for on-demand inspections — fast scaling",
      "Lab testing via Eurofins-style partner network",
      "Strong Asia-Pacific presence",
    ],
    weaknesses: [
      "Smaller data ecosystem than Inspectorio",
      "Less advanced AI/ML capabilities",
      "Relies on third-party labs for testing",
      "Limited traceability offering",
    ],
    threat: "medium" as const,
  },
  {
    name: "Bureau Veritas",
    type: "TIC Incumbent",
    hq: "Paris, France",
    coverage: "140+ countries, 1 600+ labs",
    funding: "Public (CAC 40)",
    strengths: [
      "Massive lab footprint (1 600+ offices & labs)",
      "Broad accreditation portfolio across industries",
      "Strong food & industrial testing verticals",
      "Digital platform investments (Clarity, MyBV)",
    ],
    weaknesses: [
      "Digital platforms fragmented across divisions",
      "Slower innovation cycle vs pure-play SaaS",
      "Consumer products digital experience lags Inspectorio",
      "Limited AI-native capabilities in quality workflows",
    ],
    threat: "medium" as const,
  },
  {
    name: "Intertek",
    type: "TIC Incumbent",
    hq: "London, UK",
    coverage: "100+ countries, 1 000+ labs",
    funding: "Public (LSE FTSE 100)",
    strengths: [
      "Inlight platform for supplier management",
      "Total Quality Assurance approach — end-to-end positioning",
      "Strong electrical and building products verticals",
      "Alchemy suite for food safety",
    ],
    weaknesses: [
      "Inlight adoption remains narrow",
      "Consumer softlines digital tools less mature",
      "Limited supply-chain traceability vs Inspectorio",
      "AI capabilities trailing market leaders",
    ],
    threat: "low" as const,
  },
  {
    name: "Eurofins",
    type: "Lab-Led TIC",
    hq: "Luxembourg",
    coverage: "62 000+ staff, 900+ labs",
    funding: "Public (Euronext Paris)",
    strengths: [
      "Largest private lab network globally",
      "Deep specialisation in food, pharma, environment",
      "Strong M&A engine — 70+ acquisitions per year",
    ],
    weaknesses: [
      "Consumer products / softlines not a priority vertical",
      "Digital platform maturity low",
      "Limited supply-chain or compliance SaaS offerings",
    ],
    threat: "low" as const,
  },
];

const swot = {
  strengths: [
    "2 600+ accredited labs — only TIC provider with independent physical verification at scale",
    "Gold Seal Workbook (GSW) and multi-level testing lifecycle unique to SGS",
    "N:M component linking ('update once, comply everywhere') unmatched by any competitor",
    "Named routing for Fabric / Garment Technologist assignments",
    "ZDHC Gateway integration, RSL screening, CPSC eFiling — chemical management leadership",
    "7-dashboard analytics hub with methodology-transparent KPIs",
  ],
  weaknesses: [
    "Prototype stage — no live backend, authentication, or API integrations",
    "No mobile app or offline capability for field inspectors",
    "No CAPA workflow, multi-tier traceability, or autonomous AI agents",
    "English-only; no multi-language support",
    "Supplier self-inspection and discovery network not implemented",
  ],
  opportunities: [
    "Leverage lab-verified data as trust differentiator vs SaaS platforms' self-reported data",
    "Build Digital Product Passport (DPP) capability on existing component/style architecture",
    "Partner with or acquire supply-chain mapping capability (Open Supply Hub integration)",
    "Embed AI copilot powered by lab-grade training data — higher accuracy than generic models",
    "Position SMART Advanced as the compliance backbone for multi-brand retailers",
  ],
  threats: [
    "Inspectorio's network effect creates switching costs as more brands join ecosystem",
    "Regulatory mandates could favour platforms with built-in traceability (EUDR, UFLPA)",
    "Commoditisation of basic inspection services pressures margins",
    "Tech talent competition makes rapid platform development challenging",
    "Brand buyers increasingly preferring single-vendor platforms over point solutions",
  ],
};

const scoreSummary = {
  sgs: { score: 42, leaders: 10, unique: 5, parity: 8, partial: 8, gaps: 26 },
  inspectorio: { score: 71, leaders: 30, unique: 3, parity: 8, partial: 4, gaps: 12 },
};

const strategicRecommendations = [
  {
    priority: "P0 — Immediate",
    items: [
      "Implement backend with authentication to move from prototype to MVP",
      "Build CAPA workflow — table-stakes for quality management credibility",
      "Add mobile inspection execution with offline sync",
    ],
  },
  {
    priority: "P1 — Next Quarter",
    items: [
      "Integrate AI copilot ('Ask Carlos') with lab-trained models for compliance Q&A",
      "Build basic multi-tier supply chain mapping (Tier 1–2)",
      "Add regulatory compliance tracking (EUDR, UFLPA minimum)",
    ],
  },
  {
    priority: "P2 — Strategic",
    items: [
      "Develop Digital Product Passport (DPP) on existing component architecture",
      "Build supplier discovery network leveraging SGS' 15 000+ certified supplier database",
      "Launch predictive quality scoring trained on SGS lab data (data moat play)",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  COMPONENTS                                                         */
/* ------------------------------------------------------------------ */

function ThreatBadge({ level }: { level: "high" | "medium" | "low" }) {
  const config = {
    high: "bg-red-500/15 text-red-700 border-red-500/30",
    medium: "bg-amber-500/15 text-amber-700 border-amber-500/30",
    low: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  };
  return (
    <Badge variant="outline" className={config[level]}>
      {level === "high" ? <TrendingUp className="w-3 h-3 mr-1" /> : level === "medium" ? <Minus className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
      {level.charAt(0).toUpperCase() + level.slice(1)} Threat
    </Badge>
  );
}

function SectionHeading({ icon, title, id }: { icon: React.ReactNode; title: string; id: string }) {
  return (
    <div id={id} className="flex items-center gap-3 mt-12 mb-6 print:mt-8">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary print:bg-transparent print:border print:border-primary/30">
        {icon}
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function CompetitiveIntelBrief() {
  const navigate = useNavigate();

  useEffect(() => {
    tagScreen("smart-competitive-intel-brief");
  }, []);

  const handlePrint = () => window.print();

  const handleDownload = () => {
    // Trigger print dialog which allows "Save as PDF"
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Toolbar — hidden on print */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b print:hidden">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Save as PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Report Body */}
      <article className="max-w-5xl mx-auto px-6 py-10 print:px-0 print:py-0">
        {/* Cover / Header */}
        <header className="mb-12 print:mb-8">
          <Badge variant="outline" className="mb-4 text-xs tracking-widest uppercase text-muted-foreground">
            {briefMeta.classification}
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2 print:text-3xl">
            {briefMeta.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-4">{briefMeta.subtitle}</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>Version: {briefMeta.version}</span>
            <span>•</span>
            <span>{briefMeta.date}</span>
            <span>•</span>
            <span>Prepared for: {briefMeta.preparedFor}</span>
          </div>
        </header>

        <Separator className="mb-10 print:mb-6" />

        {/* Table of Contents */}
        <nav className="mb-12 print:mb-8">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Contents</h3>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {[
              { id: "market", label: "Market Landscape" },
              { id: "competitors", label: "Competitor Profiles" },
              { id: "coverage", label: "Coverage Score Comparison" },
              { id: "swot", label: "SWOT Analysis — SMART Advanced" },
              { id: "recommendations", label: "Strategic Recommendations" },
            ].map((item, i) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-primary hover:underline">
                  {i + 1}. {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* 1 — Market Landscape */}
        <SectionHeading icon={<Globe className="w-5 h-5" />} title="Market Landscape" id="market" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Market Size", value: marketLandscape.marketSize },
            { label: "CAGR to " + marketLandscape.forecastYear, value: marketLandscape.cagr },
            { label: "Digital Penetration", value: marketLandscape.digitalPenetration },
            { label: "Key Players", value: "5+" },
          ].map((m) => (
            <Card key={m.label} className="text-center">
              <CardContent className="pt-5 pb-4">
                <p className="text-2xl font-bold text-foreground">{m.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{marketLandscape.summary}</p>

        <Card className="mb-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Key Market Drivers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {marketLandscape.drivers.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 2 — Competitor Profiles */}
        <SectionHeading icon={<Target className="w-5 h-5" />} title="Competitor Profiles" id="competitors" />

        <div className="space-y-6">
          {competitors.map((c) => (
            <Card key={c.name} className="overflow-hidden print:break-inside-avoid">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-lg">{c.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {c.type} • {c.hq} • {c.coverage}
                    </p>
                  </div>
                  <ThreatBadge level={c.threat} />
                </div>
                {c.funding && (
                  <p className="text-xs text-muted-foreground">Funding: {c.funding}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                    </h4>
                    <ul className="space-y-1.5">
                      {c.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-red-600 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Weaknesses
                    </h4>
                    <ul className="space-y-1.5">
                      {c.weaknesses.map((w, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 3 — Coverage Score */}
        <SectionHeading icon={<BarChart3 className="w-5 h-5" />} title="Coverage Score Comparison" id="coverage" />

        <p className="text-sm text-muted-foreground mb-4">
          Weighted coverage across 57 features: <strong>Leader/Unique × 1.0</strong> + <strong>Parity × 0.7</strong> + <strong>Partial × 0.3</strong>.
          See the <a href="/competitive-matrix" className="text-primary underline">full feature matrix</a> for details.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            { label: "SGS SMART Advanced", data: scoreSummary.sgs, accent: "text-primary" },
            { label: "Inspectorio", data: scoreSummary.inspectorio, accent: "text-violet-600" },
          ].map((p) => (
            <Card key={p.label}>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm">{p.label}</span>
                  <span className={`text-3xl font-bold ${p.accent}`}>{p.data.score}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 mb-3">
                  <div className={`h-2.5 rounded-full ${p.label.includes("SGS") ? "bg-primary" : "bg-violet-500"}`} style={{ width: `${p.data.score}%` }} />
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>Leaders: {p.data.leaders}</span>
                  <span>•</span>
                  <span>Unique: {p.data.unique}</span>
                  <span>•</span>
                  <span>Parity: {p.data.parity}</span>
                  <span>•</span>
                  <span>Partial: {p.data.partial}</span>
                  <span>•</span>
                  <span>Gaps: {p.data.gaps}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-amber-500/30 bg-amber-500/5 mb-2">
          <CardContent className="pt-5 pb-4 text-sm text-muted-foreground">
            <strong className="text-amber-700">Gap Analysis:</strong> SGS leads in Lab Testing (GSW, ZDHC, CPSC) and Product Lifecycle management, but trails significantly in AI/Automation, Traceability, Compliance/ESG, and Mobile/Platform capabilities. The 29-point gap is primarily driven by implementation maturity — the architecture supports expansion but features remain stubbed or absent.
          </CardContent>
        </Card>

        {/* 4 — SWOT */}
        <SectionHeading icon={<Shield className="w-5 h-5" />} title="SWOT Analysis — SMART Advanced" id="swot" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-3">
          {([
            { title: "Strengths", items: swot.strengths, color: "border-emerald-500/30 bg-emerald-500/5", textColor: "text-emerald-700", dotColor: "bg-emerald-500" },
            { title: "Weaknesses", items: swot.weaknesses, color: "border-red-500/30 bg-red-500/5", textColor: "text-red-700", dotColor: "bg-red-500" },
            { title: "Opportunities", items: swot.opportunities, color: "border-blue-500/30 bg-blue-500/5", textColor: "text-blue-700", dotColor: "bg-blue-500" },
            { title: "Threats", items: swot.threats, color: "border-amber-500/30 bg-amber-500/5", textColor: "text-amber-700", dotColor: "bg-amber-500" },
          ] as const).map((q) => (
            <Card key={q.title} className={`${q.color} print:break-inside-avoid`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-semibold ${q.textColor}`}>{q.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {q.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${q.dotColor} flex-shrink-0`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 5 — Recommendations */}
        <SectionHeading icon={<Lightbulb className="w-5 h-5" />} title="Strategic Recommendations" id="recommendations" />

        <div className="space-y-4">
          {strategicRecommendations.map((r) => (
            <Card key={r.priority} className="print:break-inside-avoid">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">{r.priority}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {r.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <Separator className="mt-12 mb-6 print:mt-8" />
        <footer className="text-xs text-muted-foreground text-center pb-12 print:pb-4">
          <p>SGS SMART Advanced — TIC Competitive Intelligence Brief — {briefMeta.version}</p>
          <p className="mt-1">Generated from platform analysis data. For internal use only.</p>
        </footer>
      </article>
    </div>
  );
}
