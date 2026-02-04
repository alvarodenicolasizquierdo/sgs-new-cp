import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileCheck,
  Building2,
  TrendingUp,
  TrendingDown,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { mockFactories } from "@/data/mockFactories";
import { format, addDays, subDays, differenceInDays } from "date-fns";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface Certificate {
  id: string;
  name: string;
  type: string;
  supplier: string;
  factory: string;
  status: "valid" | "expiring" | "expired" | "pending";
  issueDate: Date;
  expiryDate: Date;
  coverage: number;
}

const generateCertificates = (): Certificate[] => {
  const certTypes = ["ISO 9001", "OEKO-TEX", "GOTS", "BSCI", "GRS", "LWG", "WRAP", "SA8000"];
  const certificates: Certificate[] = [];

  mockFactories.forEach((factory) => {
    factory.certifications.forEach((certName, index) => {
      const daysUntilExpiry = Math.floor(Math.random() * 400) - 50;
      const expiryDate = addDays(new Date(), daysUntilExpiry);
      const issueDate = subDays(expiryDate, 365);

      let status: Certificate["status"];
      if (daysUntilExpiry < 0) status = "expired";
      else if (daysUntilExpiry < 30) status = "expiring";
      else if (Math.random() > 0.9) status = "pending";
      else status = "valid";

      certificates.push({
        id: `${factory.id}-${index}`,
        name: certName,
        type: certName.split(" ")[0],
        supplier: factory.supplierName,
        factory: factory.name,
        status,
        issueDate,
        expiryDate,
        coverage: Math.floor(Math.random() * 30) + 70,
      });
    });
  });

  return certificates;
};

const certificates = generateCertificates();

const COLORS = {
  valid: "hsl(var(--success))",
  expiring: "hsl(var(--warning))",
  expired: "hsl(var(--destructive))",
  pending: "hsl(var(--info))",
};

export function ComplianceHealthView() {
  const navigate = useNavigate();
  const [expandedSupplier, setExpandedSupplier] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Certificate["status"] | "all">("all");

  const handleViewSupplierCertificates = (supplierName: string) => {
    // Navigate to risk assessment with supplier filter
    navigate("/risk-assessment");
  };

  // Calculate compliance metrics
  const metrics = useMemo(() => {
    const valid = certificates.filter((c) => c.status === "valid").length;
    const expiring = certificates.filter((c) => c.status === "expiring").length;
    const expired = certificates.filter((c) => c.status === "expired").length;
    const pending = certificates.filter((c) => c.status === "pending").length;
    const total = certificates.length;

    const avgCoverage = Math.round(
      certificates.reduce((sum, c) => sum + c.coverage, 0) / total
    );

    const complianceRate = Math.round(((valid + expiring) / total) * 100);

    return { valid, expiring, expired, pending, total, avgCoverage, complianceRate };
  }, []);

  // Supplier compliance summary
  const supplierCompliance = useMemo(() => {
    const suppliers = [...new Set(certificates.map((c) => c.supplier))];

    return suppliers.map((supplier) => {
      const supplierCerts = certificates.filter((c) => c.supplier === supplier);
      const valid = supplierCerts.filter((c) => c.status === "valid").length;
      const expiring = supplierCerts.filter((c) => c.status === "expiring").length;
      const expired = supplierCerts.filter((c) => c.status === "expired").length;
      const complianceScore = Math.round(((valid + expiring) / supplierCerts.length) * 100);

      return {
        supplier,
        total: supplierCerts.length,
        valid,
        expiring,
        expired,
        complianceScore,
        certificates: supplierCerts,
      };
    }).sort((a, b) => b.expired - a.expired || a.complianceScore - b.complianceScore);
  }, []);

  // Status distribution for pie chart
  const statusData = [
    { name: "Valid", value: metrics.valid, color: COLORS.valid },
    { name: "Expiring Soon", value: metrics.expiring, color: COLORS.expiring },
    { name: "Expired", value: metrics.expired, color: COLORS.expired },
    { name: "Pending", value: metrics.pending, color: COLORS.pending },
  ];

  // Monthly compliance trend (mock data)
  const trendData = [
    { month: "Sep", rate: 88 },
    { month: "Oct", rate: 90 },
    { month: "Nov", rate: 87 },
    { month: "Dec", rate: 91 },
    { month: "Jan", rate: 93 },
    { month: "Feb", rate: metrics.complianceRate },
  ];

  const filteredSuppliers = selectedStatus === "all"
    ? supplierCompliance
    : supplierCompliance.filter((s) => {
        if (selectedStatus === "expired") return s.expired > 0;
        if (selectedStatus === "expiring") return s.expiring > 0;
        return true;
      });

  return (
    <div className="space-y-6">
      {/* Compliance Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Compliance Rate
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                <Award className="h-4 w-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.complianceRate}%</div>
              <div className="flex items-center gap-1 text-sm text-success mt-1">
                <TrendingUp className="h-4 w-4" />
                <span>+2% from last month</span>
              </div>
              <Progress value={metrics.complianceRate} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="card-hover border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valid Certificates
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{metrics.valid}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((metrics.valid / metrics.total) * 100)}% of total
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="card-hover border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Expiring Soon
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{metrics.expiring}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Within next 30 days
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="card-hover border-l-4 border-l-destructive">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Expired
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{metrics.expired}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Requires immediate renewal
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Compliance Rate Trend</CardTitle>
                <Badge variant="secondary">6 months</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="complianceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, "Compliance"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="rate"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                      fill="url(#complianceGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Certificate Status Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Certificate Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Supplier Compliance Drill-down */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Supplier Compliance Status</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Click on a supplier to view certificate details
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={selectedStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus("all")}
                >
                  All
                </Button>
                <Button
                  variant={selectedStatus === "expired" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus("expired")}
                >
                  Expired
                </Button>
                <Button
                  variant={selectedStatus === "expiring" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus("expiring")}
                  className={selectedStatus === "expiring" ? "bg-warning text-warning-foreground hover:bg-warning/90" : ""}
                >
                  Expiring
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <AnimatePresence>
                {filteredSuppliers.map((supplier, index) => (
                  <motion.div
                    key={supplier.supplier}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedSupplier(
                          expandedSupplier === supplier.supplier ? null : supplier.supplier
                        )
                      }
                      className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{supplier.supplier}</p>
                          <p className="text-sm text-muted-foreground">
                            {supplier.total} certificates
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {supplier.expired > 0 && (
                            <Badge variant="destructive" className="h-6">
                              {supplier.expired} expired
                            </Badge>
                          )}
                          {supplier.expiring > 0 && (
                            <Badge variant="outline" className="h-6 border-warning text-warning">
                              {supplier.expiring} expiring
                            </Badge>
                          )}
                          <Badge variant="outline" className="h-6">
                            {supplier.complianceScore}% compliant
                          </Badge>
                        </div>
                        {expandedSupplier === supplier.supplier ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedSupplier === supplier.supplier && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t"
                        >
                          <div className="p-4 space-y-3 bg-muted/30">
                            {supplier.certificates.map((cert) => (
                              <div
                                key={cert.id}
                                className="flex items-center justify-between p-3 bg-background rounded-lg border"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={cn(
                                      "h-8 w-8 rounded-full flex items-center justify-center",
                                      cert.status === "valid" && "bg-success/10",
                                      cert.status === "expiring" && "bg-warning/10",
                                      cert.status === "expired" && "bg-destructive/10",
                                      cert.status === "pending" && "bg-info/10"
                                    )}
                                  >
                                    <FileCheck
                                      className={cn(
                                        "h-4 w-4",
                                        cert.status === "valid" && "text-success",
                                        cert.status === "expiring" && "text-warning",
                                        cert.status === "expired" && "text-destructive",
                                        cert.status === "pending" && "text-info"
                                      )}
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{cert.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {cert.factory}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <p className="text-sm">
                                      {cert.status === "expired" ? "Expired" : "Expires"}{" "}
                                      {format(cert.expiryDate, "MMM d, yyyy")}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {cert.status === "expired"
                                        ? `${Math.abs(differenceInDays(cert.expiryDate, new Date()))} days ago`
                                        : `${differenceInDays(cert.expiryDate, new Date())} days left`}
                                    </p>
                                  </div>
                                  <Badge
                                    variant={
                                      cert.status === "valid"
                                        ? "default"
                                        : cert.status === "expiring"
                                        ? "secondary"
                                        : cert.status === "expired"
                                        ? "destructive"
                                        : "outline"
                                    }
                                    className={cn(
                                      cert.status === "valid" && "bg-success hover:bg-success/90",
                                      cert.status === "expiring" && "bg-warning hover:bg-warning/90"
                                    )}
                                  >
                                    {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full gap-2"
                              onClick={() => handleViewSupplierCertificates(supplier.supplier)}
                            >
                              View All Supplier Certificates
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
