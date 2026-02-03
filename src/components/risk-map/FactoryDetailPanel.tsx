import { Factory } from "@/data/mockFactories";
import { motion, AnimatePresence } from "framer-motion";
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
  ShieldCheck,
  TrendingUp,
  Factory as FactoryIcon,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FactoryDetailPanelProps {
  factory: Factory;
  onClose: () => void;
}

export function FactoryDetailPanel({ factory, onClose }: FactoryDetailPanelProps) {
  const getRiskGradient = () => {
    switch (factory.riskLevel) {
      case "low": return "from-success/20 to-success/5";
      case "medium": return "from-warning/20 to-warning/5";
      case "high": return "from-destructive/20 to-destructive/5";
    }
  };

  const stats = [
    {
      label: "Inspections",
      value: factory.totalInspections,
      icon: ClipboardCheck,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Pass Rate",
      value: `${factory.passRate}%`,
      icon: TrendingUp,
      color: factory.passRate > 85 ? "text-success" : factory.passRate > 70 ? "text-warning" : "text-destructive",
      bg: factory.passRate > 85 ? "bg-success/10" : factory.passRate > 70 ? "bg-warning/10" : "bg-destructive/10",
    },
    {
      label: "Active Orders",
      value: factory.activeOrders,
      icon: Package,
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      label: "Critical Issues",
      value: factory.criticalIssues,
      icon: AlertTriangle,
      color: factory.criticalIssues > 0 ? "text-destructive" : "text-success",
      bg: factory.criticalIssues > 0 ? "bg-destructive/10" : "bg-success/10",
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={cn(
          "absolute top-4 right-4 w-[340px] z-[1000]",
          "bg-card/95 backdrop-blur-xl",
          "border border-border rounded-2xl shadow-2xl overflow-hidden"
        )}
      >
        {/* Gradient header background */}
        <div className={cn(
          "absolute top-0 inset-x-0 h-32 bg-gradient-to-b pointer-events-none",
          getRiskGradient()
        )} />
        
        {/* Header */}
        <div className="relative p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-2">
              <motion.div 
                className="flex items-center gap-2 mb-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FactoryIcon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground truncate">{factory.name}</h3>
              </motion.div>
              
              <motion.p 
                className="text-sm text-muted-foreground flex items-center gap-1.5 ml-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <MapPin className="h-3 w-3" />
                {factory.location}, {factory.country}
              </motion.p>
            </div>
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-muted/50 hover:bg-muted" 
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
          
          <motion.div 
            className="flex items-center gap-2 mt-4 ml-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <RiskLevelBadge riskLevel={factory.riskLevel} />
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-medium text-muted-foreground">{factory.supplierName}</span>
          </motion.div>
        </div>

        {/* Risk Score Visual - Immersive gauge */}
        <motion.div 
          className="px-5 pb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
        >
          <div className={cn(
            "relative p-4 rounded-xl border",
            "bg-gradient-to-br",
            getRiskGradient(),
            factory.riskLevel === "low" && "border-success/20",
            factory.riskLevel === "medium" && "border-warning/20",
            factory.riskLevel === "high" && "border-destructive/20"
          )}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className={cn(
                  "h-4 w-4",
                  factory.riskLevel === "low" && "text-success",
                  factory.riskLevel === "medium" && "text-warning",
                  factory.riskLevel === "high" && "text-destructive"
                )} />
                <span className="text-sm font-medium text-foreground">Risk Assessment</span>
              </div>
              <motion.span 
                className={cn(
                  "text-3xl font-bold",
                  factory.riskLevel === "low" && "text-success",
                  factory.riskLevel === "medium" && "text-warning",
                  factory.riskLevel === "high" && "text-destructive"
                )}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                {factory.riskScore}
              </motion.span>
            </div>
            
            <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full",
                  factory.riskLevel === "low" && "bg-success",
                  factory.riskLevel === "medium" && "bg-warning",
                  factory.riskLevel === "high" && "bg-destructive"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${factory.riskScore}%` }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              />
              {/* Animated glow effect */}
              <motion.div
                className={cn(
                  "absolute inset-y-0 right-0 w-8 rounded-full blur-md opacity-50",
                  factory.riskLevel === "low" && "bg-success",
                  factory.riskLevel === "medium" && "bg-warning",
                  factory.riskLevel === "high" && "bg-destructive"
                )}
                initial={{ x: -100 }}
                animate={{ x: factory.riskScore - 100 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              />
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">
              {factory.riskLevel === "low" && "✓ Excellent supplier performance - low monitoring required"}
              {factory.riskLevel === "medium" && "⚠ Moderate risk - regular monitoring recommended"}
              {factory.riskLevel === "high" && "⚠ High risk - immediate action required"}
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="px-5 pb-4">
          <motion.div 
            className="grid grid-cols-2 gap-2"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
            }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "flex items-center gap-2.5 p-3 rounded-xl",
                  "bg-muted/50 border border-border/50",
                  "hover:bg-muted/70 transition-colors"
                )}
              >
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", stat.bg)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="px-5">
          <Separator />
        </div>

        {/* Certifications */}
        <motion.div 
          className="px-5 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Certifications
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {factory.certifications.map((cert, index) => (
              <motion.div
                key={cert}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + index * 0.05 }}
              >
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-0">
                  {cert}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Last Inspection */}
        <motion.div 
          className="px-5 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>Last inspection: <span className="font-medium text-foreground">{new Date(factory.lastInspectionDate).toLocaleDateString()}</span></span>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="p-5 pt-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <Button className="w-full group" size="sm">
            <span>View Factory Details</span>
            <ExternalLink className="h-3.5 w-3.5 ml-2 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
