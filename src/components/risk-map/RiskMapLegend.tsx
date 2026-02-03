import { motion } from "framer-motion";
import { Shield, ShieldAlert, ShieldX, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function RiskMapLegend() {
  const legendItems = [
    { 
      level: "Low", 
      range: "0-30", 
      icon: Shield, 
      color: "bg-success", 
      textColor: "text-success",
      borderColor: "border-success/30"
    },
    { 
      level: "Medium", 
      range: "31-60", 
      icon: ShieldAlert, 
      color: "bg-warning", 
      textColor: "text-warning",
      borderColor: "border-warning/30"
    },
    { 
      level: "High", 
      range: "61-100", 
      icon: ShieldX, 
      color: "bg-destructive", 
      textColor: "text-destructive",
      borderColor: "border-destructive/30"
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
      className={cn(
        "absolute bottom-4 left-4 z-[1000]",
        "bg-card/95 backdrop-blur-md",
        "border border-border rounded-xl p-4 shadow-xl",
        "min-w-[180px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
        <Info className="h-3.5 w-3.5 text-muted-foreground" />
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
          Risk Level
        </h4>
      </div>
      
      {/* Legend Items */}
      <div className="space-y-2">
        {legendItems.map((item, index) => (
          <motion.div 
            key={item.level}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg",
              "bg-muted/30 border",
              item.borderColor,
              "hover:bg-muted/50 transition-colors cursor-default"
            )}
          >
            {/* Colored dot with glow */}
            <div className="relative">
              <div className={cn("w-3 h-3 rounded-full", item.color)} />
              <div className={cn(
                "absolute inset-0 w-3 h-3 rounded-full blur-sm opacity-50",
                item.color
              )} />
            </div>
            
            {/* Icon */}
            <item.icon className={cn("h-4 w-4", item.textColor)} />
            
            {/* Labels */}
            <div className="flex-1 flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-foreground">{item.level}</span>
              <span className={cn("text-[10px] font-mono", item.textColor)}>
                {item.range}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Footer hint */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-[10px] text-muted-foreground mt-3 pt-2 border-t border-border"
      >
        Click markers for details
      </motion.p>
    </motion.div>
  );
}
