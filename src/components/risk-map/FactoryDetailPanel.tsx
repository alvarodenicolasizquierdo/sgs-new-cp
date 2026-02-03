import { Factory } from "@/data/mockFactories";
import { RiskLevelBadge } from "@/components/inspection/RiskLevelBadge";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  MapPin,
  Calendar,
  ClipboardCheck,
  AlertTriangle,
  Package,
  ExternalLink,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FactoryDetailPanelProps {
  factory: Factory;
  onClose: () => void;
}

export function FactoryDetailPanel({ factory, onClose }: FactoryDetailPanelProps) {
  return (
    <div className="absolute top-4 right-4 w-80 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-muted/50 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{factory.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" />
              {factory.location}, {factory.country}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-1" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <RiskLevelBadge riskLevel={factory.riskLevel} />
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm font-medium">{factory.supplierName}</span>
        </div>
      </div>

      {/* Risk Score Visual */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Risk Score</span>
          <span className={cn(
            "text-2xl font-bold",
            factory.riskLevel === "low" && "text-success",
            factory.riskLevel === "medium" && "text-warning",
            factory.riskLevel === "high" && "text-destructive"
          )}>
            {factory.riskScore}
          </span>
        </div>
        <Progress 
          value={factory.riskScore} 
          className={cn(
            "h-2",
            factory.riskLevel === "low" && "[&>div]:bg-success",
            factory.riskLevel === "medium" && "[&>div]:bg-warning",
            factory.riskLevel === "high" && "[&>div]:bg-destructive"
          )}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {factory.riskLevel === "low" && "Excellent supplier performance"}
          {factory.riskLevel === "medium" && "Requires monitoring"}
          {factory.riskLevel === "high" && "Action required - high risk"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <ClipboardCheck className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-lg font-semibold">{factory.totalInspections}</p>
            <p className="text-xs text-muted-foreground">Inspections</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
            <Building2 className="h-4 w-4 text-success" />
          </div>
          <div>
            <p className="text-lg font-semibold">{factory.passRate}%</p>
            <p className="text-xs text-muted-foreground">Pass Rate</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
            <Package className="h-4 w-4 text-info" />
          </div>
          <div>
            <p className="text-lg font-semibold">{factory.activeOrders}</p>
            <p className="text-xs text-muted-foreground">Active Orders</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            factory.criticalIssues > 0 ? "bg-destructive/10" : "bg-muted"
          )}>
            <AlertTriangle className={cn(
              "h-4 w-4",
              factory.criticalIssues > 0 ? "text-destructive" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <p className="text-lg font-semibold">{factory.criticalIssues}</p>
            <p className="text-xs text-muted-foreground">Critical Issues</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Certifications */}
      <div className="p-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Certifications
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {factory.certifications.map((cert) => (
            <Badge key={cert} variant="secondary" className="text-xs">
              {cert}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Last Inspection */}
      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Last inspection: {new Date(factory.lastInspectionDate).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 pt-0">
        <Button className="w-full" size="sm">
          View Factory Details
          <ExternalLink className="h-3.5 w-3.5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
