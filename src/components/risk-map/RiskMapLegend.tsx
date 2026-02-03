import { Shield, ShieldAlert, ShieldX } from "lucide-react";

export function RiskMapLegend() {
  return (
    <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg z-10">
      <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Risk Level</h4>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <Shield className="h-3 w-3 text-success" />
          <span className="text-xs">Low Risk (0-30)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning" />
          <ShieldAlert className="h-3 w-3 text-warning" />
          <span className="text-xs">Medium Risk (31-60)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <ShieldX className="h-3 w-3 text-destructive" />
          <span className="text-xs">High Risk (61-100)</span>
        </div>
      </div>
    </div>
  );
}
