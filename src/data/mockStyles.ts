import { Style, Supplier, Factory, Technologist, CareSymbol, CareWording } from "@/types/style";

// Profile images
import karukaAvatar from "@/assets/profiles/karuka.jpg";
import alvaroAvatar from "@/assets/profiles/alvaro.jpg";
import ammAvatar from "@/assets/profiles/amm.jpg";
import saritaAvatar from "@/assets/profiles/sarita.jpg";
import markAvatar from "@/assets/profiles/mark.png";
import hajraAvatar from "@/assets/profiles/hajra.png";

// Mock Technologists
export const mockTechnologists: Technologist[] = [
  { id: "tech-1", name: "Sarah Chen", email: "sarah.chen@sgs.com", type: "fabric", avatar: karukaAvatar },
  { id: "tech-2", name: "James Wilson", email: "james.wilson@sgs.com", type: "fabric", avatar: alvaroAvatar },
  { id: "tech-3", name: "Maria Garcia", email: "maria.garcia@sgs.com", type: "garment", avatar: ammAvatar },
  { id: "tech-4", name: "David Kim", email: "david.kim@sgs.com", type: "garment", avatar: markAvatar },
  { id: "tech-5", name: "Emma Thompson", email: "emma.thompson@sgs.com", type: "fabric", avatar: hajraAvatar },
];

// Mock Factories
export const mockFactories: Factory[] = [
  { id: "fac-1", name: "Guangzhou Textiles Ltd", country: "CN", supplierId: "sup-1" },
  { id: "fac-2", name: "Shanghai Fashion Co", country: "CN", supplierId: "sup-1" },
  { id: "fac-3", name: "Dhaka Garments Inc", country: "BD", supplierId: "sup-2" },
  { id: "fac-4", name: "Chittagong Knits", country: "BD", supplierId: "sup-2" },
  { id: "fac-5", name: "Mumbai Apparel Ltd", country: "IN", supplierId: "sup-3" },
  { id: "fac-6", name: "Istanbul Fabrics", country: "TR", supplierId: "sup-4" },
  { id: "fac-7", name: "Ho Chi Minh Textiles", country: "VN", supplierId: "sup-5" },
];

// Mock Suppliers
export const mockSuppliers: Supplier[] = [
  { 
    id: "sup-1", 
    code: "GZT001", 
    name: "Guangzhou Textiles Group", 
    selfApprovalLevel: 3, // Gold
    testExpiryMonths: 6,
    factories: mockFactories.filter(f => f.supplierId === "sup-1"),
    logo: "/placeholder.svg"
  },
  { 
    id: "sup-2", 
    code: "DGI002", 
    name: "Dhaka Garments International", 
    selfApprovalLevel: 2, // Silver
    testExpiryMonths: 6,
    factories: mockFactories.filter(f => f.supplierId === "sup-2"),
    logo: "/placeholder.svg"
  },
  { 
    id: "sup-3", 
    code: "MAL003", 
    name: "Mumbai Apparel Ltd", 
    selfApprovalLevel: 1, // Bronze
    testExpiryMonths: 6,
    factories: mockFactories.filter(f => f.supplierId === "sup-3"),
    logo: "/placeholder.svg"
  },
  { 
    id: "sup-4", 
    code: "ISF004", 
    name: "Istanbul Fabrics Co", 
    selfApprovalLevel: 0, // None
    testExpiryMonths: 6,
    factories: mockFactories.filter(f => f.supplierId === "sup-4"),
    logo: "/placeholder.svg"
  },
  { 
    id: "sup-5", 
    code: "HCM005", 
    name: "Ho Chi Minh Textiles", 
    selfApprovalLevel: 2, // Silver
    testExpiryMonths: 6,
    factories: mockFactories.filter(f => f.supplierId === "sup-5"),
    logo: "/placeholder.svg"
  },
];

// Mock Care Symbols
export const mockCareSymbols: CareSymbol[] = [
  { id: "care-1", code: "W30", category: "wash", description: "Machine wash at 30°C", icon: "W30" },
  { id: "care-2", code: "W40", category: "wash", description: "Machine wash at 40°C", icon: "W40" },
  { id: "care-3", code: "W60", category: "wash", description: "Machine wash at 60°C", icon: "W60" },
  { id: "care-4", code: "HW", category: "wash", description: "Hand wash only", icon: "HW" },
  { id: "care-5", code: "DNW", category: "wash", description: "Do not wash", icon: "DNW" },
  { id: "care-6", code: "BL", category: "bleach", description: "Bleach allowed", icon: "BL" },
  { id: "care-7", code: "DNB", category: "bleach", description: "Do not bleach", icon: "DNB" },
  { id: "care-8", code: "TDL", category: "tumble_dry", description: "Tumble dry low", icon: "TDL" },
  { id: "care-9", code: "TDN", category: "tumble_dry", description: "Tumble dry normal", icon: "TDN" },
  { id: "care-10", code: "DNTD", category: "tumble_dry", description: "Do not tumble dry", icon: "DNTD" },
  { id: "care-11", code: "IL", category: "iron", description: "Iron low (110°C)", icon: "IL" },
  { id: "care-12", code: "IM", category: "iron", description: "Iron medium (150°C)", icon: "IM" },
  { id: "care-13", code: "IH", category: "iron", description: "Iron high (200°C)", icon: "IH" },
  { id: "care-14", code: "DNI", category: "iron", description: "Do not iron", icon: "DNI" },
  { id: "care-15", code: "DC", category: "dry_clean", description: "Dry clean", icon: "DC" },
  { id: "care-16", code: "DNDC", category: "dry_clean", description: "Do not dry clean", icon: "DNDC" },
];

// Mock Care Wording
export const mockCareWording: CareWording[] = [
  { id: "word-1", text: "Machine wash at 30°C on gentle cycle", symbolIds: ["care-1"] },
  { id: "word-2", text: "Machine wash at 40°C", symbolIds: ["care-2"] },
  { id: "word-3", text: "Hand wash only in lukewarm water", symbolIds: ["care-4"] },
  { id: "word-4", text: "Do not bleach", symbolIds: ["care-7"] },
  { id: "word-5", text: "Tumble dry on low heat", symbolIds: ["care-8"] },
  { id: "word-6", text: "Do not tumble dry, line dry only", symbolIds: ["care-10"] },
  { id: "word-7", text: "Iron on low setting, avoid printed areas", symbolIds: ["care-11"] },
  { id: "word-8", text: "Do not iron", symbolIds: ["care-14"] },
  { id: "word-9", text: "Dry clean only", symbolIds: ["care-15"] },
  { id: "word-10", text: "Do not dry clean", symbolIds: ["care-16"] },
];

// Mock Styles
export const mockStyles: Style[] = [
  {
    id: "style-1",
    supplierId: "sup-1",
    supplier: mockSuppliers[0],
    tuStyleNo: "123456789",
    designStyleRef: "SS25-CREW-001",
    description: "Men's Crew Neck T-Shirt",
    productColour: "Navy Blue",
    factoryId: "fac-1",
    factory: mockFactories[0],
    division: "mens",
    department: "Casual",
    season: "SS25",
    endUse: "Casual Wear",
    countryOfOrigin: "CN",
    status: "submitted",
    stage: "bulk",
    toRead: true,
    overallStyleSheetApproved: false,
    fabricCutDate: "2025-03-15",
    goldSealDate: "2025-04-30",
    baseApprovalRequired: "2025-02-28",
    fabricTechId: "tech-1",
    fabricTech: mockTechnologists[0],
    garmentTechId: "tech-3",
    garmentTech: mockTechnologists[2],
    singleOrMultipack: "single",
    orderQuantity: 5000,
    washedProduct: false,
    careSymbols: [mockCareSymbols[1], mockCareSymbols[6], mockCareSymbols[8], mockCareSymbols[11], mockCareSymbols[14]],
    careWording: [mockCareWording[1], mockCareWording[3], mockCareWording[4], mockCareWording[6]],
    componentIds: ["comp-1", "comp-2"],
    images: [
      { id: "img-1", url: "/placeholder.svg", type: "front", description: "Front View", uploadedAt: "2025-01-15" },
      { id: "img-2", url: "/placeholder.svg", type: "back", description: "Back View", uploadedAt: "2025-01-15" },
    ],
    createdAt: "2025-01-10",
    updatedAt: "2025-02-01",
    createdBy: "user-1",
  },
  {
    id: "style-2",
    supplierId: "sup-2",
    supplier: mockSuppliers[1],
    tuStyleNo: "234567890",
    designStyleRef: "AW25-HOOD-002",
    description: "Women's Zip Hoodie",
    productColour: "Heather Grey",
    factoryId: "fac-3",
    factory: mockFactories[2],
    division: "womens",
    department: "Casual",
    season: "AW25",
    endUse: "Outerwear",
    countryOfOrigin: "BD",
    status: "pending",
    stage: "base",
    toRead: true,
    overallStyleSheetApproved: false,
    fabricCutDate: "2025-05-01",
    goldSealDate: "2025-06-15",
    fabricTechId: "tech-2",
    fabricTech: mockTechnologists[1],
    garmentTechId: "tech-4",
    garmentTech: mockTechnologists[3],
    singleOrMultipack: "single",
    orderQuantity: 3000,
    washedProduct: true,
    eimScoreAvailable: true,
    eimForecastedScore: 85,
    careSymbols: [mockCareSymbols[0], mockCareSymbols[6], mockCareSymbols[9], mockCareSymbols[13], mockCareSymbols[15]],
    careWording: [mockCareWording[0], mockCareWording[3], mockCareWording[5], mockCareWording[7], mockCareWording[9]],
    componentIds: ["comp-3", "comp-4", "comp-5"],
    images: [
      { id: "img-3", url: "/placeholder.svg", type: "front", description: "Front View", uploadedAt: "2025-01-20" },
    ],
    createdAt: "2025-01-18",
    updatedAt: "2025-01-25",
    createdBy: "user-2",
  },
  {
    id: "style-3",
    supplierId: "sup-3",
    supplier: mockSuppliers[2],
    tuStyleNo: "345678901",
    designStyleRef: "SS25-KIDS-003",
    description: "Kids' Printed Joggers",
    productColour: "Forest Green",
    factoryId: "fac-5",
    factory: mockFactories[4],
    division: "childrens",
    department: "Kids 3-7",
    season: "SS25",
    endUse: "Bottoms",
    countryOfOrigin: "IN",
    status: "approved",
    stage: "bulk_approved",
    toRead: true,
    overallStyleSheetApproved: true,
    fabricCutDate: "2025-02-01",
    goldSealDate: "2025-03-15",
    fabricTechId: "tech-5",
    fabricTech: mockTechnologists[4],
    garmentTechId: "tech-3",
    garmentTech: mockTechnologists[2],
    singleOrMultipack: "single",
    orderQuantity: 8000,
    washedProduct: false,
    gswStatus: "submitted",
    gswSubmittedDate: "2025-02-10",
    careSymbols: [mockCareSymbols[2], mockCareSymbols[5], mockCareSymbols[8], mockCareSymbols[12]],
    careWording: [mockCareWording[1], mockCareWording[4]],
    componentIds: ["comp-6"],
    images: [
      { id: "img-4", url: "/placeholder.svg", type: "front", description: "Front View", uploadedAt: "2025-01-05" },
      { id: "img-5", url: "/placeholder.svg", type: "detail", description: "Print Detail", uploadedAt: "2025-01-05" },
    ],
    createdAt: "2025-01-02",
    updatedAt: "2025-02-10",
    createdBy: "user-3",
  },
  {
    id: "style-4",
    supplierId: "sup-1",
    supplier: mockSuppliers[0],
    tuStyleNo: "456789012",
    designStyleRef: "AW25-POLO-004",
    description: "Men's Organic Cotton Polo",
    productColour: "White",
    factoryId: "fac-2",
    factory: mockFactories[1],
    division: "mens",
    department: "Casual",
    season: "AW25",
    endUse: "Casual Wear",
    countryOfOrigin: "CN",
    status: "submitted",
    stage: "base_approved",
    toRead: true,
    overallStyleSheetApproved: false,
    fabricCutDate: "2025-04-15",
    goldSealDate: "2025-05-30",
    fabricTechId: "tech-1",
    fabricTech: mockTechnologists[0],
    garmentTechId: "tech-4",
    garmentTech: mockTechnologists[3],
    singleOrMultipack: "single",
    orderQuantity: 4000,
    washedProduct: false,
    promotionalClaims: "100% Organic Cotton",
    careSymbols: [mockCareSymbols[1], mockCareSymbols[6], mockCareSymbols[7], mockCareSymbols[10], mockCareSymbols[14]],
    careWording: [mockCareWording[1], mockCareWording[3], mockCareWording[4], mockCareWording[6], mockCareWording[8]],
    componentIds: ["comp-7", "comp-8"],
    images: [
      { id: "img-6", url: "/placeholder.svg", type: "front", description: "Front View", uploadedAt: "2025-01-22" },
    ],
    createdAt: "2025-01-20",
    updatedAt: "2025-02-02",
    createdBy: "user-1",
  },
  {
    id: "style-5",
    supplierId: "sup-4",
    supplier: mockSuppliers[3],
    tuStyleNo: "567890123",
    designStyleRef: "SS25-DRESS-005",
    description: "Women's Summer Dress",
    productColour: "Floral Print",
    factoryId: "fac-6",
    factory: mockFactories[5],
    division: "womens",
    department: "Casual",
    season: "SS25",
    endUse: "Dresses",
    countryOfOrigin: "TR",
    status: "pending",
    stage: "base",
    toRead: true,
    overallStyleSheetApproved: false,
    fabricCutDate: "2025-03-01",
    goldSealDate: "2025-04-15",
    fabricTechId: "tech-2",
    fabricTech: mockTechnologists[1],
    garmentTechId: "tech-3",
    garmentTech: mockTechnologists[2],
    singleOrMultipack: "single",
    orderQuantity: 2500,
    washedProduct: false,
    careSymbols: [mockCareSymbols[3], mockCareSymbols[6], mockCareSymbols[9], mockCareSymbols[10], mockCareSymbols[15]],
    careWording: [mockCareWording[2], mockCareWording[3], mockCareWording[5], mockCareWording[6], mockCareWording[9]],
    componentIds: ["comp-9"],
    images: [],
    createdAt: "2025-01-28",
    updatedAt: "2025-01-28",
    createdBy: "user-4",
  },
  {
    id: "style-6",
    supplierId: "sup-5",
    supplier: mockSuppliers[4],
    tuStyleNo: "678901234",
    designStyleRef: "SS25-2PK-006",
    description: "Kids' 2-Pack Pyjamas",
    productColour: "Blue/White Stripe",
    factoryId: "fac-7",
    factory: mockFactories[6],
    division: "childrens",
    department: "Nightwear",
    season: "SS25",
    endUse: "Nightwear",
    countryOfOrigin: "VN",
    status: "submitted",
    stage: "bulk",
    toRead: true,
    overallStyleSheetApproved: false,
    fabricCutDate: "2025-02-20",
    goldSealDate: "2025-04-01",
    fabricTechId: "tech-5",
    fabricTech: mockTechnologists[4],
    garmentTechId: "tech-4",
    garmentTech: mockTechnologists[3],
    singleOrMultipack: "multipack",
    orderQuantity: 6000,
    washedProduct: false,
    careSymbols: [mockCareSymbols[1], mockCareSymbols[6], mockCareSymbols[7], mockCareSymbols[13]],
    careWording: [mockCareWording[1], mockCareWording[3], mockCareWording[4], mockCareWording[7]],
    componentIds: ["comp-10", "comp-11"],
    images: [
      { id: "img-7", url: "/placeholder.svg", type: "front", description: "Set View", uploadedAt: "2025-01-25" },
    ],
    createdAt: "2025-01-22",
    updatedAt: "2025-02-01",
    createdBy: "user-5",
  },
];

// Helper functions
export const getStyleById = (id: string): Style | undefined => 
  mockStyles.find(s => s.id === id);

export const getStylesBySupplier = (supplierId: string): Style[] => 
  mockStyles.filter(s => s.supplierId === supplierId);

export const getStylesByStage = (stage: Style["stage"]): Style[] => 
  mockStyles.filter(s => s.stage === stage);

export const getStylesByTechnologist = (techId: string): Style[] => 
  mockStyles.filter(s => s.fabricTechId === techId || s.garmentTechId === techId);

export const getActiveStyles = (): Style[] => 
  mockStyles.filter(s => s.toRead);

export const getPendingGSWStyles = (): Style[] => 
  mockStyles.filter(s => s.status === "approved" && s.gswStatus !== "approved");
