import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RiskMap } from "@/components/risk-map/RiskMap";
import { Globe, Activity, Sparkles, ChevronDown, ChevronUp, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RiskAssessment() {
  const [methodologyOpen, setMethodologyOpen] = useState(false);

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
                <h1 className="text-2xl font-semibold text-foreground">Risk Assessment</h1>
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
              <p className="text-muted-foreground/80 mt-1 max-w-xl">
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

      {/* Methodology Disclosure [C-10] */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-dashed border-border/60 rounded-xl">
          <CardContent className="p-4">
            <button
              onClick={() => setMethodologyOpen(!methodologyOpen)}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Risk Scoring Methodology</span>
              </div>
              {methodologyOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            
            <AnimatePresence>
              {methodologyOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3 text-sm text-muted-foreground/80 border-t border-border/60 pt-4">
                    <div>
                      <p className="font-medium text-foreground mb-1">Calculation Method</p>
                      <p>Weighted composite of inspection pass rate (40%), corrective action response time (25%), historical non-conformance trends (20%), and supplier self-assessment compliance (15%).</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-xs font-medium text-foreground">Data Period</p>
                        <p className="text-xs">Rolling 12 months</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-xs font-medium text-foreground">Sample Size</p>
                        <p className="text-xs">847 inspections</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-xs font-medium text-foreground">Deterministic Data</p>
                        <p className="text-xs">85% of score</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-xs font-medium text-foreground">AI-Estimated Factors</p>
                        <p className="text-xs">15% of score</p>
                      </div>
                    </div>
                    <p className="text-xs italic text-muted-foreground/60">Risk thresholds: Low (0–39), Medium (40–64), High (65–100). Scores update daily at 00:00 UTC.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Risk Map */}
      <RiskMap />
    </DashboardLayout>
  );
}
