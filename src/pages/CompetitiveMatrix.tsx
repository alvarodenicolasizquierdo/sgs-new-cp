import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, MinusCircle, Sparkles, Shield, BarChart3, Globe, Bot, Microscope, FileText, Factory, Truck, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Status = "leader" | "parity" | "partial" | "gap" | "unique";

interface Feature {
  name: string;
  sgs: Status;
  inspectorio: Status;
  sgsNote?: string;
  inspectorioNote?: string;
}

interface Category {
  name: string;
  icon: React.ReactNode;
  features: Feature[];
}

const statusConfig: Record<Status, { label: string; color: string; icon: React.ReactNode }> = {
  leader:  { label: "Leader",  color: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30", icon: <CheckCircle2 className="w-4 h-4" /> },
  parity:  { label: "Parity",  color: "bg-blue-500/15 text-blue-700 border-blue-500/30",         icon: <CheckCircle2 className="w-4 h-4" /> },
  partial: { label: "Partial", color: "bg-amber-500/15 text-amber-700 border-amber-500/30",      icon: <MinusCircle className="w-4 h-4" /> },
  gap:     { label: "Gap",     color: "bg-red-500/15 text-red-700 border-red-500/30",            icon: <XCircle className="w-4 h-4" /> },
  unique:  { label: "Unique",  color: "bg-violet-500/15 text-violet-700 border-violet-500/30",   icon: <Sparkles className="w-4 h-4" /> },
};

const categories: Category[] = [
  {
    name: "Quality & Inspection",
    icon: <Microscope className="w-5 h-5" />,
    features: [
      { name: "Inspection Booking & Scheduling", sgs: "parity", inspectorio: "parity", sgsNote: "Calendar & Kanban views with status tracking", inspectorioNote: "Automated booking with inspector assignment, capacity management, multi-party coordination" },
      { name: "Digital Inspection Execution", sgs: "partial", inspectorio: "leader", sgsNote: "View-only detail pages; no mobile execution", inspectorioNote: "Mobile-first checklists with photo/video capture, annotation, digital measurement tools, wizard workflows" },
      { name: "AQL-Based Sampling", sgs: "partial", inspectorio: "leader", sgsNote: "Basic sampling support", inspectorioNote: "Native AQL engine with dynamic sampling plans and automated calculations" },
      { name: "Defect Classification & Tracking", sgs: "partial", inspectorio: "leader", sgsNote: "Status badges and result tracking only", inspectorioNote: "AI-powered defect image recognition and auto-classification; recurring defect detection with trend analysis" },
      { name: "CAPA Management", sgs: "gap", inspectorio: "leader", sgsNote: "No CAPA workflow implemented", inspectorioNote: "AI-generated corrective/preventive actions via dedicated microservice (caparecommender); root cause analysis, follow-up tracking, network benchmarking" },
      { name: "Vendor Self-Inspection Programs", sgs: "gap", inspectorio: "leader", sgsNote: "Not implemented", inspectorioNote: "Risk-algorithm-governed self-inspection for low-risk suppliers; reduces third-party inspection costs" },
      { name: "Supplier Scorecards (Quality)", sgs: "parity", inspectorio: "leader", sgsNote: "Dashboard scorecard widget with performance charts", inspectorioNote: "Multi-dimensional scoring with dynamic risk algorithms, peer benchmarking, competency scores, tiered ratings" },
      { name: "Inspection Reports & Analytics", sgs: "partial", inspectorio: "leader", sgsNote: "Basic reporting with export", inspectorioNote: "Auto-generated reports, configurable templates, PDF export, anomaly alerts, NL analytics assistant" },
    ],
  },
  {
    name: "Lab Testing",
    icon: <FileText className="w-5 h-5" />,
    features: [
      { name: "Test Request Form (TRF) Management", sgs: "leader", inspectorio: "partial", sgsNote: "Full TRF lifecycle with Kanban/table views, SLA tracking, priority tiers, multi-level testing (Base/Bulk/Product/Approved)", inspectorioNote: "Test request creation & routing with standardised formats; Kohl's rejected testing module at enterprise scale" },
      { name: "Multi-Level Testing Lifecycle", sgs: "unique", inspectorio: "gap", sgsNote: "Gold Seal Workbook (GSW) with sequential Base→Bulk→Garment testing stages linked to product approval", inspectorioNote: "No equivalent sequential testing lifecycle or GSW" },
      { name: "Multi-Lab Data Integration", sgs: "leader", inspectorio: "parity", sgsNote: "SGS operates 2,600+ accredited labs; lab-generated verified test data", inspectorioNote: "API-based integration with third-party labs; automated data ingestion and format normalisation" },
      { name: "Cross-PO Material Testing Optimisation", sgs: "gap", inspectorio: "unique", sgsNote: "Not implemented", inspectorioNote: "Algorithms identify duplicate testing across POs to enable test-once-at-source, eliminating redundant downstream testing" },
      { name: "Test Results & Compliance Dashboard", sgs: "parity", inspectorio: "parity", sgsNote: "Results tracking with status views and export", inspectorioNote: "Real-time dashboards with AI-surfaced compliance risks and over-testing identification" },
      { name: "CPSC eFiling Support", sgs: "unique", inspectorio: "gap", sgsNote: "US import compliance automation", inspectorioNote: "Not documented" },
      { name: "Chemical Management (ZDHC/RSL)", sgs: "unique", inspectorio: "gap", sgsNote: "SMART Cares with ZDHC Gateway integration, RSL screening, wastewater management", inspectorioNote: "No ZDHC Gateway, RSL screening, or dedicated chemical management" },
    ],
  },
  {
    name: "Product Lifecycle",
    icon: <Factory className="w-5 h-5" />,
    features: [
      { name: "Style/Product Management", sgs: "leader", inspectorio: "gap", sgsNote: "Full style lifecycle with stage progression (Development→Pre-production→Production→Approved)", inspectorioNote: "No dedicated style/product management module" },
      { name: "Component/Material Library", sgs: "leader", inspectorio: "gap", sgsNote: "5-step fabric/trim creation wizard with fiber composition, sustainability tracking, N:M style linking", inspectorioNote: "No material/component management equivalent" },
      { name: "Production Milestone Tracking", sgs: "gap", inspectorio: "leader", sgsNote: "No production tracking module", inspectorioNote: "Real-time milestone tracking (Milestone Pro) from factory floor to shipment; AI anomaly detection for bottlenecks" },
      { name: "Shipment Risk Management", sgs: "gap", inspectorio: "leader", sgsNote: "Not implemented", inspectorioNote: "Predictive delay risk algorithms with automated alerting and corrective action triggers" },
      { name: "Automated Production Reporting", sgs: "gap", inspectorio: "leader", sgsNote: "Not implemented", inspectorioNote: "AI-generated production reports highlighting anomalies and performance trends" },
    ],
  },
  {
    name: "Supplier Management",
    icon: <Network className="w-5 h-5" />,
    features: [
      { name: "Supplier Directory & Profiles", sgs: "parity", inspectorio: "parity", sgsNote: "Supplier list with performance charts and create flow", inspectorioNote: "Comprehensive profiles with enterprise profile building and competency scoring" },
      { name: "Supplier Onboarding & Due Diligence", sgs: "partial", inspectorio: "leader", sgsNote: "External link to questionnaire app", inspectorioNote: "Structured registration wizard with AI-validated certifications, risk questionnaires, approval workflows" },
      { name: "Supplier Discovery & Evaluation", sgs: "gap", inspectorio: "unique", sgsNote: "No network discovery", inspectorioNote: "Discover new sourcing options from 15,000+ supplier network; AI-powered matching and competency scoring" },
      { name: "Supplier Inbox / Communication", sgs: "unique", inspectorio: "gap", sgsNote: "Dedicated supplier messaging inbox with thread management", inspectorioNote: "No dedicated communication hub" },
      { name: "Network Performance Analytics", sgs: "gap", inspectorio: "leader", sgsNote: "Not implemented", inspectorioNote: "Industry-powered peer benchmarks; data-driven sourcing recommendations; corrective action sharing across network" },
      { name: "Supply Chain Network Intelligence (SCNI)", sgs: "gap", inspectorio: "unique", sgsNote: "Not implemented", inspectorioNote: "Strategic sourcing with AI Agents/Copilots for real-time network-based decision intelligence (launched Jan 2026)" },
    ],
  },
  {
    name: "Compliance & ESG",
    icon: <Shield className="w-5 h-5" />,
    features: [
      { name: "Audit Management (SMETA/BSCI/SA8000/SLCP)", sgs: "gap", inspectorio: "leader", sgsNote: "No audit lifecycle management", inspectorioNote: "Full audit lifecycle from scheduling through CAP; AI-driven risk prioritisation. Note: Kohl's stopped proceeding with audit modules" },
      { name: "ESG & Sustainability Monitoring", sgs: "gap", inspectorio: "leader", sgsNote: "Not implemented", inspectorioNote: "ESG data collection, scoring, benchmarking; SLCP Passive Accredited Host (April 2025). Gap: no ZDHC integration" },
      { name: "Regulatory Compliance Tracking", sgs: "gap", inspectorio: "leader", sgsNote: "Not implemented", inspectorioNote: "UFLPA, EUDR, CSDDD, CSRD, German Supply Chain Act, REACH, CPSIA, Prop 65; Regulation Agent for market-specific test requirements" },
      { name: "Certificate & Document Management", sgs: "gap", inspectorio: "leader", sgsNote: "Not implemented", inspectorioNote: "Centralised repository with expiration tracking; Paramo AI validates authenticity, extracts data, translates, checks, and summarises" },
      { name: "GB Standard Selection Tool", sgs: "unique", inspectorio: "gap", sgsNote: "Chinese GB product standard selection for market access", inspectorioNote: "Not documented" },
      { name: "Recall Case Analysis", sgs: "unique", inspectorio: "gap", sgsNote: "Product recall case analysis module", inspectorioNote: "Not documented" },
    ],
  },
  {
    name: "Traceability",
    icon: <Truck className="w-5 h-5" />,
    features: [
      { name: "Multi-Tier Supply Chain Mapping", sgs: "gap", inspectorio: "leader", sgsNote: "No multi-tier mapping", inspectorioNote: "Tier 4+ to Tier 1 interactive geographic visualisation with relationship tracking; Open Supply Hub data partnership" },
      { name: "Chain of Custody & Document Validation", sgs: "gap", inspectorio: "leader", sgsNote: "Not implemented", inspectorioNote: "Traceability Agent validates supplier data across tiers using NL cross-validation; PO-level tracking" },
      { name: "Material & Product Traceability", sgs: "gap", inspectorio: "leader", sgsNote: "No batch-level material tracking", inspectorioNote: "Raw material to finished goods with batch-level tracking, material flow diagrams, AI document validation" },
      { name: "Regulatory Traceability Reporting", sgs: "gap", inspectorio: "leader", sgsNote: "Not implemented", inspectorioNote: "UFLPA/EUDR compliance reports at scale; seizure risk alerts to prevent shipment holds" },
      { name: "Independent Physical Verification", sgs: "unique", inspectorio: "gap", sgsNote: "SGS accredited lab-generated data provides independent verification", inspectorioNote: "Relies on supplier self-reported data (Trust Gap)" },
    ],
  },
  {
    name: "Risk & Analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    features: [
      { name: "Risk Heat Map / Geographic View", sgs: "leader", inspectorio: "parity", sgsNote: "Interactive Leaflet map with factory markers, risk-level colour coding, detail panels", inspectorioNote: "Geographic supply chain visualisation with risk overlays" },
      { name: "Multi-Dashboard Analytics", sgs: "leader", inspectorio: "parity", sgsNote: "7 specialised dashboards (Risk, Compliance, Pipeline, Overview, Transactions, Balances, Custom)", inspectorioNote: "Quality, Supplier, Compliance, Lab, Production, Executive, Network Intelligence dashboards" },
      { name: "Custom Report Builder", sgs: "parity", inspectorio: "parity", sgsNote: "Drag-and-drop column editor with export", inspectorioNote: "Configurable reporting with automated distribution" },
      { name: "Predictive Quality Forecasting", sgs: "gap", inspectorio: "leader", sgsNote: "Not implemented", inspectorioNote: "ML models trained on ecosystem-wide data; dynamic risk scoring with confidence levels and factor breakdown" },
      { name: "Natural Language Analytics", sgs: "gap", inspectorio: "leader", sgsNote: "Not implemented", inspectorioNote: "Query data in everyday language; Paramo provides narrative summaries with anomaly highlights" },
    ],
  },
  {
    name: "AI & Automation",
    icon: <Bot className="w-5 h-5" />,
    features: [
      { name: "AI Copilots (Conversational)", sgs: "gap", inspectorio: "leader", sgsNote: "UI placeholder only, non-functional", inspectorioNote: "Compliance Copilot + Virtual Assistant with cited answers, source attribution, confidence scores. Note: AI reliability concerns reported (Nov 2025)" },
      { name: "Autonomous AI Agents", sgs: "gap", inspectorio: "leader", sgsNote: "Not implemented", inspectorioNote: "Traceability Agent and Regulation Agent; end-to-end document processing, regulation checks, sourcing optimisation. Maturity unverified beyond marketing" },
      { name: "AI Report Generation", sgs: "partial", inspectorio: "leader", sgsNote: "UI exists but no backend AI integration", inspectorioNote: "Paramo generates stakeholder-ready deliverables autonomously; natural language narratives from inspection/audit data" },
      { name: "AI Document Validation", sgs: "gap", inspectorio: "leader", sgsNote: "Not implemented", inspectorioNote: "Validates certifications, contracts, and regulatory documents at scale with automated risk assessments and audit trail" },
      { name: "Dynamic Risk Intelligence", sgs: "gap", inspectorio: "leader", sgsNote: "Not implemented", inspectorioNote: "Real-time risk scoring factoring product, shipment, and compliance data; ML models with anomaly flags and trend forecasts" },
    ],
  },
  {
    name: "Platform & UX",
    icon: <Globe className="w-5 h-5" />,
    features: [
      { name: "Native Mobile Apps", sgs: "gap", inspectorio: "leader", sgsNote: "Web-only, no mobile app", inspectorioNote: "Inspectorio QRM on iOS & Android with offline capability, photo/video capture, digital measurement tools" },
      { name: "Offline Capability", sgs: "gap", inspectorio: "leader", sgsNote: "Not supported", inspectorioNote: "Full offline mode with automatic sync when connectivity restored" },
      { name: "Support Center / Help Desk", sgs: "leader", inspectorio: "partial", sgsNote: "Full ticketing system, knowledge base, AI chat panel, escalation workflows", inspectorioNote: "Inspectorio Academy (LMS) + context-sensitive help portal; no full-featured ticketing" },
      { name: "White-Labeling", sgs: "gap", inspectorio: "leader", sgsNote: "Not available", inspectorioNote: "Full branding customisation for enterprise deployments" },
      { name: "User & Role Management", sgs: "partial", inspectorio: "leader", sgsNote: "UI page exists but no auth backend", inspectorioNote: "Full RBAC with SSO, granular access controls, multi-org support, role-based views per user type" },
      { name: "API & Integrations", sgs: "partial", inspectorio: "leader", sgsNote: "Basic integration points", inspectorioNote: "REST API with public docs, webhooks, secure file transfer, Integrations Center; SAP S/4HANA, ERP/PLM, CGS BlueCherry" },
      { name: "Multi-Language Support", sgs: "gap", inspectorio: "leader", sgsNote: "English only", inspectorioNote: "20+ languages; AI-powered document translation across supply chain" },
      { name: "Guided Wizard Workflows", sgs: "partial", inspectorio: "leader", sgsNote: "Form-based creation flows", inspectorioNote: "Wizard-like workflows with real-time validation, one-click approvals, and progress indicators" },
      { name: "Security Certifications", sgs: "parity", inspectorio: "parity", sgsNote: "Enterprise-grade security", inspectorioNote: "ISO/IEC 27001:2013, SOC 2 Type II; GCP infrastructure with role-based data governance" },
    ],
  },
];

function StatusBadgeCell({ status, note }: { status: Status; note?: string }) {
  const config = statusConfig[status];
  const badge = (
    <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.color}`}>
      {config.icon}
      {config.label}
    </div>
  );
  if (!note) return badge;
  return (
    <Tooltip>
      <TooltipTrigger asChild><span className="cursor-help">{badge}</span></TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-xs">{note}</TooltipContent>
    </Tooltip>
  );
}

function ScoreSummary() {
  const allFeatures = categories.flatMap(c => c.features);
  const count = (product: "sgs" | "inspectorio", status: Status) =>
    allFeatures.filter(f => f[product] === status).length;

  const products = [
    { key: "sgs" as const, label: "SGS SMART Advanced" },
    { key: "inspectorio" as const, label: "Inspectorio" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {products.map(p => {
        const total = allFeatures.length;
        const leaderCount = count(p.key, "leader") + count(p.key, "unique");
        const parityCount = count(p.key, "parity");
        const gapCount = count(p.key, "gap");
        const score = Math.round(((leaderCount * 1 + parityCount * 0.7 + count(p.key, "partial") * 0.3) / total) * 100);

        return (
          <Card key={p.key} className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">{p.label}</CardTitle>
                <span className="text-2xl font-bold text-foreground">{score}%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Weighted coverage score across {total} features
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(["leader", "unique", "parity", "partial", "gap"] as Status[]).map(s => (
                  <div key={s} className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusConfig[s].color}`}>
                    {statusConfig[s].icon}
                    {statusConfig[s].label}: {count(p.key, s)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function CompetitiveMatrix() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const filtered = activeTab === "all" ? categories : categories.filter(c => c.name === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Competitive Feature Matrix</h1>
            <p className="text-sm text-muted-foreground mt-1">
              SGS SMART Advanced vs Inspectorio — based on verified spec v2 (Feb 2026)
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-lg border border-border/60 bg-muted/30">
          <span className="text-xs font-medium text-muted-foreground mr-1">Legend:</span>
          {(["leader", "unique", "parity", "partial", "gap"] as Status[]).map(s => (
            <div key={s} className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusConfig[s].color}`}>
              {statusConfig[s].icon}
              {statusConfig[s].label}
            </div>
          ))}
        </div>

        <ScoreSummary />

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap h-auto gap-1 bg-transparent p-0 mb-6">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 text-xs">
              All Categories
            </TabsTrigger>
            {categories.map(c => (
              <TabsTrigger key={c.name} value={c.name} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 text-xs">
                {c.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="space-y-6">
              {filtered.map(cat => (
                <Card key={cat.name} className="overflow-hidden border-border/60">
                  <CardHeader className="bg-muted/40 py-4">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      {cat.icon}
                      {cat.name}
                      <Badge variant="secondary" className="ml-auto text-xs font-normal">
                        {cat.features.length} features
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/20">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground w-[40%]">Feature</th>
                            <th className="text-center py-3 px-4 font-medium text-muted-foreground w-[30%]">SGS SMART Advanced</th>
                            <th className="text-center py-3 px-4 font-medium text-muted-foreground w-[30%]">Inspectorio</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cat.features.map((f, i) => (
                            <tr key={f.name} className={`border-b last:border-0 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                              <td className="py-3 px-4 font-medium">{f.name}</td>
                              <td className="py-3 px-4 text-center">
                                <StatusBadgeCell status={f.sgs} note={f.sgsNote} />
                              </td>
                              <td className="py-3 px-4 text-center">
                                <StatusBadgeCell status={f.inspectorio} note={f.inspectorioNote} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Key Differentiator callout */}
        <Card className="mt-8 border-border/60 bg-muted/20">
          <CardContent className="py-5 px-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Key Differentiator</p>
            <p className="text-sm leading-relaxed">
              <strong>Inspectorio</strong> is an AI-native SaaS platform with deep workflow automation and a network data flywheel (15,000+ suppliers). 
              <strong> SGS SMART Advanced</strong> is a digitally-enabled service portal backed by 2,600+ accredited laboratories and physical inspection/testing services. 
              Inspectorio excels at software-driven orchestration and AI; SGS excels at verified, independent testing data and domain depth.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
