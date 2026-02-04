export interface Supplier {
  id: string;
  name: string;
  code: string;
  country: string;
  city: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  performanceScore: number;
  complianceStatus: "compliant" | "at_risk" | "non_compliant" | "pending_audit";
  activeStylesCount: number;
  totalTestsCount: number;
  passRate: number;
  lastAuditDate: string;
  nextAuditDate?: string;
  certifications: string[];
  specializations: string[];
  tier: "strategic" | "preferred" | "approved" | "probation";
  createdAt: string;
}

export const mockSuppliers: Supplier[] = [
  {
    id: "sup-1",
    name: "Textile Excellence Ltd",
    code: "TEX-001",
    country: "Bangladesh",
    city: "Dhaka",
    contactName: "Mohammed Rahman",
    contactEmail: "m.rahman@textileexcellence.com",
    contactPhone: "+880 1711 234567",
    performanceScore: 92,
    complianceStatus: "compliant",
    activeStylesCount: 24,
    totalTestsCount: 156,
    passRate: 94.2,
    lastAuditDate: "2025-01-15",
    nextAuditDate: "2025-07-15",
    certifications: ["GOTS", "OEKO-TEX", "ISO 9001"],
    specializations: ["Cotton", "Jersey", "Fleece"],
    tier: "strategic",
    createdAt: "2022-03-10",
  },
  {
    id: "sup-2",
    name: "Dragon Fabrics Co",
    code: "DRG-002",
    country: "China",
    city: "Shanghai",
    contactName: "Li Wei",
    contactEmail: "l.wei@dragonfabrics.cn",
    contactPhone: "+86 21 5858 9999",
    performanceScore: 88,
    complianceStatus: "compliant",
    activeStylesCount: 18,
    totalTestsCount: 203,
    passRate: 91.5,
    lastAuditDate: "2024-11-20",
    nextAuditDate: "2025-05-20",
    certifications: ["ISO 9001", "ISO 14001"],
    specializations: ["Synthetic", "Technical Fabrics", "Outerwear"],
    tier: "preferred",
    createdAt: "2021-08-15",
  },
  {
    id: "sup-3",
    name: "Anatolian Textiles",
    code: "ANA-003",
    country: "Turkey",
    city: "Istanbul",
    contactName: "Ahmet Yilmaz",
    contactEmail: "a.yilmaz@anatoliantex.com",
    contactPhone: "+90 212 555 4433",
    performanceScore: 85,
    complianceStatus: "at_risk",
    activeStylesCount: 12,
    totalTestsCount: 89,
    passRate: 86.5,
    lastAuditDate: "2024-09-10",
    nextAuditDate: "2025-03-10",
    certifications: ["OEKO-TEX"],
    specializations: ["Denim", "Woven"],
    tier: "approved",
    createdAt: "2023-01-22",
  },
  {
    id: "sup-4",
    name: "Viet Garment Solutions",
    code: "VGS-004",
    country: "Vietnam",
    city: "Ho Chi Minh City",
    contactName: "Nguyen Thi Mai",
    contactEmail: "mai.nguyen@vietgarment.vn",
    contactPhone: "+84 28 3823 5566",
    performanceScore: 91,
    complianceStatus: "compliant",
    activeStylesCount: 31,
    totalTestsCount: 178,
    passRate: 93.8,
    lastAuditDate: "2025-01-05",
    nextAuditDate: "2025-07-05",
    certifications: ["WRAP", "BSCI", "ISO 9001"],
    specializations: ["Knitwear", "Activewear", "Intimates"],
    tier: "strategic",
    createdAt: "2020-11-30",
  },
  {
    id: "sup-5",
    name: "Mumbai Textile Mills",
    code: "MTM-005",
    country: "India",
    city: "Mumbai",
    contactName: "Priya Sharma",
    contactEmail: "p.sharma@mumbaitextile.in",
    contactPhone: "+91 22 2345 6789",
    performanceScore: 78,
    complianceStatus: "at_risk",
    activeStylesCount: 8,
    totalTestsCount: 45,
    passRate: 82.2,
    lastAuditDate: "2024-08-18",
    nextAuditDate: "2025-02-18",
    certifications: ["ISO 9001"],
    specializations: ["Cotton", "Linen", "Silk"],
    tier: "approved",
    createdAt: "2023-06-14",
  },
  {
    id: "sup-6",
    name: "Pacific Trim Co",
    code: "PTC-006",
    country: "Indonesia",
    city: "Jakarta",
    contactName: "Budi Santoso",
    contactEmail: "b.santoso@pacifictrim.id",
    contactPhone: "+62 21 789 4561",
    performanceScore: 65,
    complianceStatus: "non_compliant",
    activeStylesCount: 3,
    totalTestsCount: 28,
    passRate: 71.4,
    lastAuditDate: "2024-06-22",
    nextAuditDate: "2025-01-22",
    certifications: [],
    specializations: ["Buttons", "Zippers", "Labels"],
    tier: "probation",
    createdAt: "2024-02-08",
  },
  {
    id: "sup-7",
    name: "Euro Fashion Fabrics",
    code: "EFF-007",
    country: "Portugal",
    city: "Porto",
    contactName: "Maria Santos",
    contactEmail: "m.santos@eurofashion.pt",
    contactPhone: "+351 22 333 4455",
    performanceScore: 96,
    complianceStatus: "compliant",
    activeStylesCount: 15,
    totalTestsCount: 112,
    passRate: 97.3,
    lastAuditDate: "2024-12-01",
    nextAuditDate: "2025-06-01",
    certifications: ["GOTS", "OEKO-TEX", "ISO 14001", "GRS"],
    specializations: ["Premium Cotton", "Sustainable Fabrics"],
    tier: "strategic",
    createdAt: "2019-05-20",
  },
  {
    id: "sup-8",
    name: "Karachi Knits",
    code: "KRK-008",
    country: "Pakistan",
    city: "Karachi",
    contactName: "Ali Hassan",
    contactEmail: "a.hassan@karachiknits.pk",
    contactPhone: "+92 21 3456 7890",
    performanceScore: 82,
    complianceStatus: "pending_audit",
    activeStylesCount: 6,
    totalTestsCount: 34,
    passRate: 85.3,
    lastAuditDate: "2024-07-30",
    nextAuditDate: "2025-01-30",
    certifications: ["ISO 9001", "WRAP"],
    specializations: ["Hosiery", "Socks", "Knitwear"],
    tier: "approved",
    createdAt: "2023-09-05",
  },
];

export const getSupplierStats = () => {
  const total = mockSuppliers.length;
  const compliant = mockSuppliers.filter(s => s.complianceStatus === "compliant").length;
  const atRisk = mockSuppliers.filter(s => s.complianceStatus === "at_risk").length;
  const nonCompliant = mockSuppliers.filter(s => s.complianceStatus === "non_compliant").length;
  const pendingAudit = mockSuppliers.filter(s => s.complianceStatus === "pending_audit").length;
  const avgScore = Math.round(mockSuppliers.reduce((acc, s) => acc + s.performanceScore, 0) / total);
  const totalStyles = mockSuppliers.reduce((acc, s) => acc + s.activeStylesCount, 0);
  
  return { total, compliant, atRisk, nonCompliant, pendingAudit, avgScore, totalStyles };
};

export const complianceStatusConfig = {
  compliant: { label: "Compliant", color: "text-success", bgColor: "bg-success/10", borderColor: "border-success" },
  at_risk: { label: "At Risk", color: "text-warning", bgColor: "bg-warning/10", borderColor: "border-warning" },
  non_compliant: { label: "Non-Compliant", color: "text-destructive", bgColor: "bg-destructive/10", borderColor: "border-destructive" },
  pending_audit: { label: "Pending Audit", color: "text-muted-foreground", bgColor: "bg-muted", borderColor: "border-muted-foreground" },
};

export const tierConfig = {
  strategic: { label: "Strategic", color: "text-primary", bgColor: "bg-primary/10" },
  preferred: { label: "Preferred", color: "text-info", bgColor: "bg-info/10" },
  approved: { label: "Approved", color: "text-muted-foreground", bgColor: "bg-muted" },
  probation: { label: "Probation", color: "text-destructive", bgColor: "bg-destructive/10" },
};
