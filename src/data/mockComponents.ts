import { 
  Component, 
  FabricComponent, 
  TrimComponent, 
  StyleComponentLink, 
  ComponentTest,
  FibreComposition 
} from "@/types/component";

// Helper to create fibre compositions
const createComposition = (fibres: Array<{ type: string; label: string; percentage: number; sustainable?: boolean }>): FibreComposition[] => {
  return fibres.map((f, i) => ({
    id: `fibre-${i}`,
    fibreType: f.type as FibreComposition["fibreType"],
    fibreLabel: f.label,
    percentage: f.percentage,
    isSustainable: f.sustainable || false,
    isRecycled: f.type.includes("recycled"),
  }));
};

// Mock Fabric Components
export const mockFabricComponents: FabricComponent[] = [
  {
    id: "comp-1",
    componentType: "fabric",
    mill: "Jiangsu Textiles Co",
    tuReference: "TU-FAB-001",
    countryOfOrigin: "CN",
    isSustainable: false,
    isRegenerative: false,
    reachCompliant: true,
    status: "approved",
    composition: createComposition([
      { type: "cotton", label: "Cotton", percentage: 95 },
      { type: "elastane", label: "Elastane", percentage: 5 },
    ]),
    construction: "jersey",
    weight: 180,
    width: 150,
    dyeMethod: "piece_dyed",
    colour: "Navy Blue",
    createdAt: "2025-01-10",
    updatedAt: "2025-01-15",
    createdBy: "user-1",
  },
  {
    id: "comp-2",
    componentType: "fabric",
    mill: "Shanghai Knits Ltd",
    tuReference: "TU-FAB-002",
    countryOfOrigin: "CN",
    isSustainable: false,
    isRegenerative: false,
    reachCompliant: true,
    status: "approved",
    composition: createComposition([
      { type: "cotton", label: "Cotton", percentage: 100 },
    ]),
    construction: "rib",
    weight: 220,
    width: 120,
    dyeMethod: "piece_dyed",
    colour: "Navy Blue",
    createdAt: "2025-01-10",
    updatedAt: "2025-01-15",
    createdBy: "user-1",
  },
  {
    id: "comp-3",
    componentType: "fabric",
    mill: "Dhaka Premium Mills",
    tuReference: "TU-FAB-003",
    countryOfOrigin: "BD",
    isSustainable: true,
    isRegenerative: false,
    reachCompliant: true,
    status: "pending",
    composition: createComposition([
      { type: "organic_cotton", label: "Organic Cotton", percentage: 60, sustainable: true },
      { type: "recycled_polyester", label: "Recycled Polyester", percentage: 35, sustainable: true },
      { type: "elastane", label: "Elastane", percentage: 5 },
    ]),
    construction: "french_terry",
    weight: 280,
    width: 160,
    dyeMethod: "piece_dyed",
    colour: "Heather Grey",
    createdAt: "2025-01-18",
    updatedAt: "2025-01-20",
    createdBy: "user-2",
  },
  {
    id: "comp-4",
    componentType: "fabric",
    mill: "Dhaka Premium Mills",
    tuReference: "TU-FAB-004",
    countryOfOrigin: "BD",
    isSustainable: false,
    isRegenerative: false,
    reachCompliant: true,
    status: "pending",
    composition: createComposition([
      { type: "polyester", label: "Polyester", percentage: 100 },
    ]),
    construction: "jersey",
    weight: 150,
    width: 140,
    dyeMethod: "piece_dyed",
    colour: "Heather Grey",
    createdAt: "2025-01-18",
    updatedAt: "2025-01-20",
    createdBy: "user-2",
  },
  {
    id: "comp-6",
    componentType: "fabric",
    mill: "Mumbai Fabrics Pvt",
    tuReference: "TU-FAB-006",
    countryOfOrigin: "IN",
    isSustainable: true,
    isRegenerative: false,
    reachCompliant: true,
    status: "approved",
    composition: createComposition([
      { type: "bci_cotton", label: "BCI Cotton", percentage: 80, sustainable: true },
      { type: "polyester", label: "Polyester", percentage: 15 },
      { type: "elastane", label: "Elastane", percentage: 5 },
    ]),
    construction: "french_terry",
    weight: 240,
    width: 155,
    dyeMethod: "garment_dyed",
    colour: "Forest Green",
    createdAt: "2025-01-02",
    updatedAt: "2025-01-28",
    createdBy: "user-3",
  },
  {
    id: "comp-7",
    componentType: "fabric",
    mill: "Shanghai Organics",
    tuReference: "TU-FAB-007",
    countryOfOrigin: "CN",
    isSustainable: true,
    isRegenerative: false,
    reachCompliant: true,
    status: "approved",
    composition: createComposition([
      { type: "organic_cotton", label: "Organic Cotton", percentage: 100, sustainable: true },
    ]),
    construction: "jersey",
    weight: 200,
    width: 160,
    dyeMethod: "piece_dyed",
    colour: "White",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-25",
    createdBy: "user-1",
  },
  {
    id: "comp-9",
    componentType: "fabric",
    mill: "Istanbul Wovens",
    tuReference: "TU-FAB-009",
    countryOfOrigin: "TR",
    isSustainable: false,
    isRegenerative: false,
    reachCompliant: true,
    status: "pending",
    composition: createComposition([
      { type: "viscose", label: "Viscose", percentage: 100 },
    ]),
    construction: "voile",
    weight: 90,
    width: 140,
    dyeMethod: "printed",
    colour: "Floral Print",
    createdAt: "2025-01-28",
    updatedAt: "2025-01-28",
    createdBy: "user-4",
  },
  {
    id: "comp-10",
    componentType: "fabric",
    mill: "Vietnam Knits Co",
    tuReference: "TU-FAB-010",
    countryOfOrigin: "VN",
    isSustainable: false,
    isRegenerative: false,
    reachCompliant: true,
    status: "approved",
    composition: createComposition([
      { type: "cotton", label: "Cotton", percentage: 100 },
    ]),
    construction: "interlock",
    weight: 170,
    width: 150,
    dyeMethod: "yarn_dyed",
    colour: "Blue/White Stripe",
    createdAt: "2025-01-22",
    updatedAt: "2025-01-28",
    createdBy: "user-5",
  },
];

// Mock Trim Components
export const mockTrimComponents: TrimComponent[] = [
  {
    id: "comp-5",
    componentType: "trim",
    mill: "YKK Bangladesh",
    tuReference: "TU-TRM-001",
    countryOfOrigin: "BD",
    isSustainable: false,
    isRegenerative: false,
    reachCompliant: true,
    status: "pending",
    trimType: "Zipper",
    colour: "Silver",
    size: "60cm",
    material: "Metal",
    createdAt: "2025-01-18",
    updatedAt: "2025-01-20",
    createdBy: "user-2",
  },
  {
    id: "comp-8",
    componentType: "trim",
    mill: "Button World Ltd",
    tuReference: "TU-TRM-002",
    countryOfOrigin: "CN",
    isSustainable: false,
    isRegenerative: false,
    reachCompliant: true,
    status: "approved",
    trimType: "Button",
    colour: "White",
    size: "12mm",
    material: "Corozo",
    createdAt: "2025-01-20",
    updatedAt: "2025-01-25",
    createdBy: "user-1",
  },
  {
    id: "comp-11",
    componentType: "trim",
    mill: "Label Masters VN",
    tuReference: "TU-TRM-003",
    countryOfOrigin: "VN",
    isSustainable: false,
    isRegenerative: false,
    reachCompliant: true,
    status: "approved",
    trimType: "Woven Label",
    colour: "White/Blue",
    material: "Polyester",
    createdAt: "2025-01-22",
    updatedAt: "2025-01-28",
    createdBy: "user-5",
  },
];

// All components
export const mockComponents: Component[] = [...mockFabricComponents, ...mockTrimComponents];

// Mock Style-Component Links (N:M relationship)
export const mockStyleComponentLinks: StyleComponentLink[] = [
  // Style 1 components
  { id: "link-1", styleId: "style-1", componentId: "comp-1", tuStatus: "approved", linkedAt: "2025-01-10", linkedBy: "user-1" },
  { id: "link-2", styleId: "style-1", componentId: "comp-2", tuStatus: "approved", linkedAt: "2025-01-10", linkedBy: "user-1" },
  // Style 2 components
  { id: "link-3", styleId: "style-2", componentId: "comp-3", tuStatus: "pending", linkedAt: "2025-01-18", linkedBy: "user-2" },
  { id: "link-4", styleId: "style-2", componentId: "comp-4", tuStatus: "pending", linkedAt: "2025-01-18", linkedBy: "user-2" },
  { id: "link-5", styleId: "style-2", componentId: "comp-5", tuStatus: "pending", linkedAt: "2025-01-18", linkedBy: "user-2" },
  // Style 3 components
  { id: "link-6", styleId: "style-3", componentId: "comp-6", tuStatus: "approved", linkedAt: "2025-01-02", linkedBy: "user-3" },
  // Style 4 components
  { id: "link-7", styleId: "style-4", componentId: "comp-7", tuStatus: "approved", linkedAt: "2025-01-20", linkedBy: "user-1" },
  { id: "link-8", styleId: "style-4", componentId: "comp-8", tuStatus: "approved", linkedAt: "2025-01-20", linkedBy: "user-1" },
  // Style 5 components
  { id: "link-9", styleId: "style-5", componentId: "comp-9", tuStatus: "pending", linkedAt: "2025-01-28", linkedBy: "user-4" },
  // Style 6 components
  { id: "link-10", styleId: "style-6", componentId: "comp-10", tuStatus: "approved", linkedAt: "2025-01-22", linkedBy: "user-5" },
  { id: "link-11", styleId: "style-6", componentId: "comp-11", tuStatus: "approved", linkedAt: "2025-01-22", linkedBy: "user-5" },
  
  // Example of component reuse - comp-1 is also used in style-4 (demonstrating N:M)
  { 
    id: "link-12", 
    styleId: "style-4", 
    componentId: "comp-1", 
    tuStatus: "approved", 
    linkedAt: "2025-01-22", 
    linkedBy: "user-1",
    baseTestCopiedFrom: "style-1",
    baseTestCopiedAt: "2025-01-22",
    baseTestExpiresAt: "2025-07-10", // 6 months from original test
  },
];

// Mock Component Tests
export const mockComponentTests: ComponentTest[] = [
  {
    id: "test-1",
    componentId: "comp-1",
    styleId: "style-1",
    level: "base",
    uploadMethod: "lab",
    status: "tested",
    labId: "lab-1",
    labName: "SGS Hong Kong",
    testDate: "2025-01-12",
    dueDate: "2025-01-20",
    reportCode: "SGS-2025-001234",
    colourCode: "SGS-COL-5678",
    parameters: [
      { id: "p1", name: "Tensile Strength", specification: ">200N", result: "245N", status: "pass" },
      { id: "p2", name: "Pilling Resistance", specification: "Grade 4+", result: "Grade 4-5", status: "pass" },
      { id: "p3", name: "Colour Fastness to Washing", specification: "Grade 4+", result: "Grade 4", status: "pass" },
      { id: "p4", name: "Dimensional Stability", specification: "±5%", result: "-3%", status: "pass" },
    ],
    attachments: [
      { id: "att-1", fileName: "SGS-2025-001234-report.pdf", fileType: "application/pdf", fileUrl: "/attachments/report1.pdf", uploadedAt: "2025-01-14", uploadedBy: "lab-user-1" },
    ],
    createdAt: "2025-01-10",
    updatedAt: "2025-01-14",
  },
  {
    id: "test-2",
    componentId: "comp-1",
    styleId: "style-1",
    level: "bulk",
    uploadMethod: "lab",
    status: "submitted",
    labId: "lab-1",
    labName: "SGS Hong Kong",
    dueDate: "2025-02-15",
    parameters: [],
    attachments: [],
    createdAt: "2025-02-01",
    updatedAt: "2025-02-01",
  },
  {
    id: "test-3",
    componentId: "comp-6",
    styleId: "style-3",
    level: "base",
    uploadMethod: "lab",
    status: "tested",
    labId: "lab-2",
    labName: "ITS Mumbai",
    testDate: "2025-01-08",
    dueDate: "2025-01-15",
    reportCode: "ITS-2025-005678",
    parameters: [
      { id: "p5", name: "Tensile Strength", specification: ">180N", result: "210N", status: "pass" },
      { id: "p6", name: "Pilling Resistance", specification: "Grade 3+", result: "Grade 4", status: "pass" },
      { id: "p7", name: "Colour Fastness to Washing", specification: "Grade 3+", result: "Grade 4-5", status: "pass" },
    ],
    attachments: [
      { id: "att-2", fileName: "ITS-2025-005678-report.pdf", fileType: "application/pdf", fileUrl: "/attachments/report2.pdf", uploadedAt: "2025-01-10", uploadedBy: "lab-user-2" },
    ],
    createdAt: "2025-01-05",
    updatedAt: "2025-01-10",
  },
  {
    id: "test-4",
    componentId: "comp-6",
    styleId: "style-3",
    level: "bulk",
    uploadMethod: "lab",
    status: "tested",
    labId: "lab-2",
    labName: "ITS Mumbai",
    testDate: "2025-01-25",
    dueDate: "2025-01-28",
    reportCode: "ITS-2025-005899",
    parameters: [
      { id: "p8", name: "Batch Consistency", specification: "Within Tolerance", result: "Pass", status: "pass" },
      { id: "p9", name: "Production Weight", specification: "240±10 g/m²", result: "238 g/m²", status: "pass" },
    ],
    attachments: [
      { id: "att-3", fileName: "ITS-2025-005899-report.pdf", fileType: "application/pdf", fileUrl: "/attachments/report3.pdf", uploadedAt: "2025-01-26", uploadedBy: "lab-user-2" },
    ],
    createdAt: "2025-01-20",
    updatedAt: "2025-01-26",
  },
];

// Helper functions
export const getComponentById = (id: string): Component | undefined => 
  mockComponents.find(c => c.id === id);

export const getComponentsByStyle = (styleId: string): Component[] => {
  const links = mockStyleComponentLinks.filter(l => l.styleId === styleId);
  return links.map(l => getComponentById(l.componentId)).filter(Boolean) as Component[];
};

export const getStylesUsingComponent = (componentId: string): string[] => {
  return mockStyleComponentLinks.filter(l => l.componentId === componentId).map(l => l.styleId);
};

export const getFabricComponents = (): FabricComponent[] => 
  mockFabricComponents;

export const getTrimComponents = (): TrimComponent[] => 
  mockTrimComponents;

export const getComponentTestsByComponent = (componentId: string): ComponentTest[] =>
  mockComponentTests.filter(t => t.componentId === componentId);

export const getComponentTestsByStyle = (styleId: string): ComponentTest[] =>
  mockComponentTests.filter(t => t.styleId === styleId);

export const getComponentLink = (styleId: string, componentId: string): StyleComponentLink | undefined =>
  mockStyleComponentLinks.find(l => l.styleId === styleId && l.componentId === componentId);

export const getSustainableComponents = (): Component[] =>
  mockComponents.filter(c => c.isSustainable);
