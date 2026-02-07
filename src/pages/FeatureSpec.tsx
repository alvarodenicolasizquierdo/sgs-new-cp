import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { canonicalFeatureSpec } from "@/data/canonicalFeatureSpec";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  FileJson, 
  Star, 
  Package, 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Sparkles,
  Trophy,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const spec = canonicalFeatureSpec.canonical_feature_spec;

// Calculate maturity stats
const allFeatures = spec.product_modules.flatMap(m => m.features);
const maturityBreakdown = {
  complete: allFeatures.filter(f => f.implementation_status === "complete").length,
  partial: allFeatures.filter(f => f.implementation_status === "partial").length,
  stubbed: allFeatures.filter(f => f.implementation_status === "stubbed" || f.implementation_status === "ui_only").length,
  planned: allFeatures.filter(f => f.implementation_status === "planned").length,
};
const totalFeatures = allFeatures.length;
const implementedPct = Math.round(((maturityBreakdown.complete + maturityBreakdown.partial) / totalFeatures) * 100);

export default function FeatureSpec() {
  const [showTop10, setShowTop10] = useState(true);

  const handleDownload = () => {
    const json = JSON.stringify(canonicalFeatureSpec, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sgs-smart-adv_canonical_feature_spec.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
              <FileJson className="h-4 w-4" />
              Canonical Feature Spec
            </div>
            <h1 className="text-2xl font-bold">
              {spec.meta.app_name} — Feature Extraction
            </h1>
            <p className="text-muted-foreground">
              Exhaustive codebase audit · {spec.meta.extraction_date.split("T")[0]} · {spec.meta.build_status}
            </p>
          </div>
          <Button onClick={handleDownload} className="gap-2" size="lg">
            <Download className="h-5 w-5" />
            Download JSON
          </Button>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold">{totalFeatures}</div>
              <div className="text-sm text-muted-foreground">Total Features</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold">{spec.product_modules.length}</div>
              <div className="text-sm text-muted-foreground">Modules</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold">{spec.meta.total_routes}</div>
              <div className="text-sm text-muted-foreground">Routes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold">{spec.meta.total_components}</div>
              <div className="text-sm text-muted-foreground">Components</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{implementedPct}%</div>
              <div className="text-sm text-muted-foreground">Implemented</div>
            </CardContent>
          </Card>
        </div>

        {/* Maturity Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Implementation Maturity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <div>
                  <div className="text-xl font-bold text-success">{maturityBreakdown.complete}</div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg">
                <Clock className="h-5 w-5 text-warning" />
                <div>
                  <div className="text-xl font-bold text-warning">{maturityBreakdown.partial}</div>
                  <div className="text-xs text-muted-foreground">Partial</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-xl font-bold">{maturityBreakdown.stubbed}</div>
                  <div className="text-xs text-muted-foreground">Stubbed / UI Only</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-info/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-info" />
                <div>
                  <div className="text-xl font-bold text-info">{maturityBreakdown.planned}</div>
                  <div className="text-xs text-muted-foreground">Planned</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Module Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Module Breakdown</CardTitle>
            <CardDescription>Feature count and demo readiness per module</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {spec.product_modules.map((module, i) => (
                <motion.div
                  key={module.route}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{module.module_name}</div>
                      <div className="text-xs text-muted-foreground">{module.route}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant="secondary" className="text-xs">
                      {module.features.length} features
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        module.demo_readiness === "demo_ready" && "border-success text-success",
                        module.demo_readiness === "needs_polish" && "border-warning text-warning"
                      )}
                    >
                      {module.demo_readiness === "demo_ready" ? "✓ Demo Ready" : "Needs Polish"}
                    </Badge>
                    <div className="flex items-center gap-1 min-w-[60px] justify-end">
                      <Star className="h-3 w-3 text-amber-500" />
                      <span className="text-sm font-medium">{module.demo_wow_factor}/10</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top 10 Wow Moments */}
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => setShowTop10(!showTop10)}>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Top 10 Wow Moments
              <Badge variant="secondary">{showTop10 ? "▼" : "▶"}</Badge>
            </CardTitle>
            <CardDescription>Features that will impress clients in demos</CardDescription>
          </CardHeader>
          {showTop10 && (
            <CardContent className="space-y-4">
              {spec.demo_highlights.top_10_wow_moments.map((wow, i) => (
                <motion.div
                  key={wow.rank}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                      {wow.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{wow.feature}</h3>
                        <Badge variant="outline" className="text-xs font-mono">{wow.route}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{wow.why_it_wows}</p>
                      <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                        <span className="font-medium">Talk track:</span> "{wow.talk_track}"
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          )}
        </Card>

        {/* AI Capabilities Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{spec.ai_capabilities.summary}</p>
            <div className="space-y-2">
              {spec.ai_capabilities.capabilities.map((cap) => (
                <div key={cap.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <div className="font-medium text-sm">{cap.name}</div>
                    <div className="text-xs text-muted-foreground">{cap.type} · {cap.implementation}</div>
                  </div>
                  <Badge variant="outline" className={cn(
                    "text-xs",
                    cap.implementation === "simulated" && "border-warning text-warning",
                    cap.implementation === "rule_based" && "border-info text-info",
                    cap.implementation === "planned" && "border-muted-foreground text-muted-foreground"
                  )}>
                    {cap.implementation}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Download Footer */}
        <div className="text-center pb-8">
          <Button onClick={handleDownload} variant="outline" size="lg" className="gap-2">
            <Download className="h-5 w-5" />
            Download sgs-smart-adv_canonical_feature_spec.json
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Full JSON spec with {totalFeatures} features across {spec.product_modules.length} modules
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
