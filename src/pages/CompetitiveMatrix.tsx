import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, MinusCircle, AlertTriangle, Sparkles, Shield, BarChart3, Globe, Users, FileText, Microscope, Factory, Bot } from "lucide-react";
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
  leader:  { label: "Leader",     color: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",  icon: <CheckCircle2 className="w-4 h-4" /> },
  parity:  { label: "Parity",     color: "bg-blue-500/15 text-blue-700 border-blue-500/30",          icon: <CheckCircle2 className="w-4 h-4" /> },
  partial: { label: "Partial",    color: "bg-amber-500/15 text-amber-700 border-amber-500/30",       icon: <MinusCircle className="w-4 h-4" /> },
  gap:     { label: "Gap",        color: "bg-red-500/15 text-red-700 border-red-500/30",             icon: <XCircle className="w-4 h-4" /> },
  unique:  { label: "Unique",     color: "bg-violet-500/15 text-violet-700 border-violet-500/30",    icon: <Sparkles className="w-4 h-4" /> },
};

const categories: Category[] = [
  {
    name: "Quality & Testing",
    icon: <Microscope className="w-5 h-5" />,
    features: [
      { name: "Test Request Form (TRF) Management", sgs: "leader", inspectorio: "gap", sgsNote: "Full lifecycle with Kanban/table, SLA tracking, priority tiers", inspectorioNote: "No dedicated TRF module" },
      { name: "Lab Test Tracking", sgs: "leader", inspectorio: "partial", sgsNote: "Multi-level testing (Base/Bulk/Product/Approved)", inspectorioNote: "Basic test result recording" },
      { name: "Inspection Booking & Scheduling", sgs: "parity", inspectorio: "parity", sgsNote: "Calendar & Kanban views", inspectorioNote: "Booking with capacity management" },
      { name: "AQL-Based Sampling", sgs: "partial", inspectorio: "leader", sgsNote: "Basic sampling support", inspectorioNote: "Native AQL engine with dynamic sampling plans" },
      { name: "Digital Inspection Execution", sgs: "partial", inspectorio: "leader", sgsNote: "View-only detail pages", inspectorioNote: "Mobile-first with offline sync, photo capture" },
      { name: "Defect Classification & Tracking", sgs: "partial", inspectorio: "leader", sgsNote: "Status badges and result tracking", inspectorioNote: "AI-powered defect categorisation with image recognition" },
    ],
  },
  {
    name: "Product Lifecycle",
    icon: <FileText className="w-5 h-5" />,
    features: [
      { name: "Style/Product Management", sgs: "leader", inspectorio: "gap", sgsNote: "Full style lifecycle with stage progression", inspectorioNote: "No dedicated style module" },
      { name: "Component/Material Management", sgs: "leader", inspectorio: "gap", sgsNote: "Fabric/material component library with test linking", inspectorioNote: "No equivalent" },
      { name: "Gold Seal Workbook (GSW)", sgs: "unique", inspectorio: "gap", sgsNote: "Industry-specific approval workflow", inspectorioNote: "Not applicable" },
      { name: "Product Traceability", sgs: "gap", inspectorio: "leader", sgsNote: "No multi-tier tracing", inspectorioNote: "Full supply chain traceability with material flow" },
    ],
  },
  {
    name: "Supplier Management",
    icon: <Factory className="w-5 h-5" />,
    features: [
      { name: "Supplier Directory & Profiles", sgs: "parity", inspectorio: "parity", sgsNote: "Supplier list with performance charts", inspectorioNote: "Comprehensive supplier profiles" },
      { name: "Supplier Scorecard", sgs: "parity", inspectorio: "leader", sgsNote: "Dashboard scorecard widget", inspectorioNote: "Multi-dimensional scoring with benchmarks" },
      { name: "Supplier Questionnaire Portal", sgs: "partial", inspectorio: "leader", sgsNote: "External link to questionnaire app", inspectorioNote: "Embedded self-assessment portal" },
      { name: "Supplier Inbox / Communication", sgs: "unique", inspectorio: "gap", sgsNote: "Dedicated supplier messaging inbox", inspectorioNote: "No dedicated communication hub" },
      { name: "CAPA Management", sgs: "gap", inspectorio: "leader", sgsNote: "No CAPA workflow", inspectorioNote: "AI-recommended corrective actions with tracking" },
    ],
  },
  {
    name: "Compliance & ESG",
    icon: <Shield className="w-5 h-5" />,
    features: [
      { name: "Audit Management", sgs: "gap", inspectorio: "leader", sgsNote: "Not implemented", inspectorioNote: "SMETA, BSCI, custom audit frameworks" },
      { name: "ESG / Sustainability Monitoring", sgs: "gap", inspectorio: "leader", sgsNote: "Not implemented", inspectorioNote: "Carbon tracking, sustainability dashboards" },
      { name: "Regulatory Tracking (CSDDD, etc.)", sgs: "gap", inspectorio: "leader", sgsNote: "Not implemented", inspectorioNote: "Automated regulatory change monitoring" },
      { name: "Document & Certificate Validation", sgs: "gap", inspectorio: "leader", sgsNote: "Not implemented", inspectorioNote: "Expiry tracking and verification workflows" },
    ],
  },
  {
    name: "Risk & Analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    features: [
      { name: "Risk Heat Map", sgs: "leader", inspectorio: "parity", sgsNote: "Interactive Leaflet map with factory markers", inspectorioNote: "Risk visualisation available" },
      { name: "Multi-Dashboard Analytics", sgs: "leader", inspectorio: "parity", sgsNote: "7 dashboard tabs (Risk, Compliance, Pipeline, etc.)", inspectorioNote: "Standard analytics dashboards" },
      { name: "Custom Report Builder", sgs: "parity", inspectorio: "parity", sgsNote: "Drag-and-drop column editor, export options", inspectorioNote: "Configurable reporting" },
      { name: "Predictive Quality Forecasting", sgs: "gap", inspectorio: "leader", sgsNote: "Not implemented", inspectorioNote: "ML-based failure prediction" },
    ],
  },
  {
    name: "AI & Automation",
    icon: <Bot className="w-5 h-5" />,
    features: [
      { name: "AI Copilot / Assistant", sgs: "gap", inspectorio: "leader", sgsNote: "UI placeholder only, non-functional", inspectorioNote: "Paramo AI copilot across all modules" },
      { name: "Autonomous AI Agents", sgs: "gap", inspectorio: "leader", sgsNote: "Not implemented", inspectorioNote: "Task-specific agents for inspection, compliance" },
      { name: "AI Report Generation", sgs: "partial", inspectorio: "leader", sgsNote: "UI exists but no backend", inspectorioNote: "Functional AI-generated reports" },
      { name: "Natural Language Querying", sgs: "gap", inspectorio: "leader", sgsNote: "Not implemented", inspectorioNote: "Query data using natural language" },
    ],
  },
  {
    name: "Platform & UX",
    icon: <Globe className="w-5 h-5" />,
    features: [
      { name: "Mobile App (Native)", sgs: "gap", inspectorio: "leader", sgsNote: "Web-only, no mobile app", inspectorioNote: "iOS & Android with offline support" },
      { name: "Offline Capability", sgs: "gap", inspectorio: "leader", sgsNote: "Not supported", inspectorioNote: "Full offline mode with sync" },
      { name: "Support Center / Help Desk", sgs: "leader", inspectorio: "partial", sgsNote: "Full ticketing, knowledge base, chat UI", inspectorioNote: "Standard help documentation" },
      { name: "User & Role Management", sgs: "partial", inspectorio: "leader", sgsNote: "UI page exists, no auth backend", inspectorioNote: "Full RBAC with SSO integration" },
      { name: "Multi-Language Support", sgs: "gap", inspectorio: "leader", sgsNote: "English only", inspectorioNote: "20+ languages supported" },
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
      {products.map(p => (
        <Card key={p.key} className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{p.label}</CardTitle>
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
      ))}
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
              SGS SMART Advanced vs Inspectorio — side-by-side capability comparison
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
      </div>
    </div>
  );
}
