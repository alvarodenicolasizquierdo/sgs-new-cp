import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RiskMap } from "@/components/risk-map/RiskMap";
import { Globe, Activity, Sparkles } from "lucide-react";

export default function RiskAssessment() {
  return (
    <DashboardLayout>
      {/* Premium Page Header */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Globe className="h-6 w-6 text-primary" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">Risk Assessment</h1>
                <motion.div 
                  className="flex items-center gap-1 px-2 py-0.5 bg-success/10 text-success text-xs font-medium rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                >
                  <Activity className="h-3 w-3" />
                  Live
                </motion.div>
              </div>
              <p className="text-muted-foreground mt-1 max-w-xl">
                Real-time visibility into factory locations, risk scores, and supplier performance across your global supply chain.
              </p>
            </div>
          </div>
          
          <motion.div 
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent text-xs font-medium rounded-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Insights
          </motion.div>
        </div>
      </motion.div>

      {/* Risk Map */}
      <RiskMap />
    </DashboardLayout>
  );
}
