import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RiskMap } from "@/components/risk-map/RiskMap";

export default function RiskAssessment() {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Risk Assessment</h1>
        <p className="text-muted-foreground mt-1">
          Monitor factory locations, risk scores, and supplier performance across your supply chain.
        </p>
      </div>

      {/* Risk Map */}
      <RiskMap />
    </DashboardLayout>
  );
}
