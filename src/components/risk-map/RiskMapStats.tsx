import { Factory } from "@/data/mockFactories";
import { motion } from "framer-motion";
import { Building2, AlertTriangle, Shield, TrendingUp, Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskMapStatsProps {
  factories: Factory[];
}

export function RiskMapStats({ factories }: RiskMapStatsProps) {
  const totalFactories = factories.length;
  const highRiskCount = factories.filter((f) => f.riskLevel === "high").length;
  const mediumRiskCount = factories.filter((f) => f.riskLevel === "medium").length;
  const lowRiskCount = factories.filter((f) => f.riskLevel === "low").length;
  const avgRiskScore = totalFactories > 0 
    ? Math.round(factories.reduce((sum, f) => sum + f.riskScore, 0) / totalFactories)
    : 0;
  const avgPassRate = totalFactories > 0
    ? Math.round(factories.reduce((sum, f) => sum + f.passRate, 0) / totalFactories)
    : 0;
  const criticalIssues = factories.reduce((sum, f) => sum + f.criticalIssues, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 }
    }
  };

  const stats = [
    {
      label: "Total Factories",
      value: totalFactories,
      icon: Building2,
      gradient: "from-primary/20 via-primary/10 to-transparent",
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
      valueColor: "text-foreground",
      trend: null,
    },
    {
      label: "High Risk",
      value: highRiskCount,
      icon: AlertTriangle,
      gradient: "from-destructive/20 via-destructive/10 to-transparent",
      iconBg: "bg-destructive/15",
      iconColor: "text-destructive",
      valueColor: "text-destructive",
      trend: highRiskCount > 0 ? "critical" : "good",
      pulse: highRiskCount > 0,
    },
    {
      label: "Avg Risk Score",
      value: avgRiskScore,
      icon: Shield,
      gradient: avgRiskScore < 40 
        ? "from-success/20 via-success/10 to-transparent" 
        : avgRiskScore < 60 
          ? "from-warning/20 via-warning/10 to-transparent" 
          : "from-destructive/20 via-destructive/10 to-transparent",
      iconBg: avgRiskScore < 40 ? "bg-success/15" : avgRiskScore < 60 ? "bg-warning/15" : "bg-destructive/15",
      iconColor: avgRiskScore < 40 ? "text-success" : avgRiskScore < 60 ? "text-warning" : "text-destructive",
      valueColor: avgRiskScore < 40 ? "text-success" : avgRiskScore < 60 ? "text-warning" : "text-destructive",
      suffix: "/100",
    },
    {
      label: "Pass Rate",
      value: avgPassRate,
      icon: TrendingUp,
      gradient: avgPassRate > 85 
        ? "from-success/20 via-success/10 to-transparent" 
        : avgPassRate > 70 
          ? "from-warning/20 via-warning/10 to-transparent" 
          : "from-destructive/20 via-destructive/10 to-transparent",
      iconBg: avgPassRate > 85 ? "bg-success/15" : avgPassRate > 70 ? "bg-warning/15" : "bg-destructive/15",
      iconColor: avgPassRate > 85 ? "text-success" : avgPassRate > 70 ? "text-warning" : "text-destructive",
      valueColor: avgPassRate > 85 ? "text-success" : avgPassRate > 70 ? "text-warning" : "text-destructive",
      suffix: "%",
    },
    {
      label: "Critical Issues",
      value: criticalIssues,
      icon: Zap,
      gradient: criticalIssues > 0 
        ? "from-destructive/20 via-destructive/10 to-transparent"
        : "from-success/20 via-success/10 to-transparent",
      iconBg: criticalIssues > 0 ? "bg-destructive/15" : "bg-success/15",
      iconColor: criticalIssues > 0 ? "text-destructive" : "text-success",
      valueColor: criticalIssues > 0 ? "text-destructive" : "text-success",
      pulse: criticalIssues > 0,
    },
    {
      label: "Low Risk",
      value: lowRiskCount,
      icon: Activity,
      gradient: "from-success/20 via-success/10 to-transparent",
      iconBg: "bg-success/15",
      iconColor: "text-success",
      valueColor: "text-success",
      description: `${Math.round((lowRiskCount / totalFactories) * 100) || 0}% of total`,
    },
  ];

  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          className={cn(
            "relative group overflow-hidden rounded-xl border border-border bg-card p-4",
            "transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5"
          )}
        >
          {/* Gradient background */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-60",
            stat.gradient
          )} />
          
          {/* Animated pulse for critical items */}
          {stat.pulse && (
            <motion.div
              className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <motion.div 
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  "backdrop-blur-sm border border-border/50",
                  stat.iconBg
                )}
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
              >
                <stat.icon className={cn("h-5 w-5", stat.iconColor)} />
              </motion.div>
            </div>
            
            <div className="space-y-1">
              <motion.p 
                className={cn("text-3xl font-bold tracking-tight", stat.valueColor)}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
              >
                {stat.value}
                {stat.suffix && (
                  <span className="text-lg font-medium text-muted-foreground">{stat.suffix}</span>
                )}
              </motion.p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </p>
              {stat.description && (
                <p className="text-[10px] text-muted-foreground/70">
                  {stat.description}
                </p>
              )}
            </div>
          </div>
          
          {/* Hover glow effect */}
          <motion.div
            className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
              "bg-gradient-to-t from-transparent via-transparent to-primary/5"
            )}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
