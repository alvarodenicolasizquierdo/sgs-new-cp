// Auto-generated canonical feature spec for SGS SMART Advanced
// Extraction date: 2026-02-07

export const canonicalFeatureSpec = {
  canonical_feature_spec: {
    meta: {
      app_name: "SGS SMART Advanced",
      full_name: "SMART Advanced Customer Testing Portal",
      vendor: "SGS SA",
      platform: "Lovable (AI-accelerated development)",
      tech_stack: [
        "React 18.3.1",
        "TypeScript",
        "Vite",
        "Tailwind CSS",
        "shadcn/ui",
        "Recharts 2.15.4",
        "Framer Motion 12.31.0",
        "Leaflet 1.9.4 / React-Leaflet 4.2.1",
        "React Router DOM 6.30.1",
        "TanStack React Query 5.83.0",
        "React Hook Form 7.61.1",
        "Zod 3.25.76",
        "date-fns 3.6.0",
        "Sonner 1.7.4",
        "React Markdown 10.1.0",
        "Radix UI Primitives",
        "Lucide React Icons",
        "cmdk (command palette)",
        "Vaul (drawer)",
        "Embla Carousel"
      ],
      version_observed: "2.0",
      extraction_date: "2026-02-07T00:00:00Z",
      extraction_method: "automated_codebase_introspection",
      total_screens: 20,
      total_components: 95,
      total_routes: 18,
      total_zustand_stores: 0,
      total_api_endpoints_or_mock_services: 0,
      build_status: "prototype",
      notes: "Auto-extracted from full codebase scan. All data is mock. No backend, no auth. State is React local state + context. Includes all implemented, stubbed, and planned features."
    },

    design_principles: {
      core_pillars: [
        "AI-First Compliance",
        "Scheme-Agnostic Architecture",
        "DPP-Ready by Design"
      ],
      architecture_pattern: "Component-based SPA with React Router for client-side routing. No centralised state management (no Zustand/Redux) — each page manages local state with useState/useMemo. AI support delivered via React Context (AISupportProvider). Layout via DashboardLayout wrapper with collapsible sidebar.",
      ai_philosophy: "AI is embedded as a contextual assistant ('Ask Carlos') providing route-mapped help, proactive tooltips via data-help attributes, and in-product support with escalation to human agents. AI reasoning is simulated (rule-based knowledge DB from TU-Online docs) but presented as transparent conversational responses.",
      extensibility_model: "Component and style types use config objects (e.g. fibreTypeConfig, constructionConfig) that can be extended without code changes. Testing levels (Base → Bulk → Garment) are config-driven. Sustainability certifications are flag-based on component entities.",
      role_adaptive_design: "Not yet implemented. Single hardcoded user persona (Mark Thompson, QA Manager). Support Center has admin/user role toggle (hardcoded). No role-based route guards."
    },

    platform_architecture: {
      deployment: "Lovable Cloud hosting (Vite SPA). Published at sgs-smart-adv.lovable.app",
      frontend_framework: "React 18.3.1 with TypeScript, Vite bundler, Tailwind CSS utility-first styling",
      state_management: "No centralised stores. Each page uses React useState/useMemo for local state. AISupportContext provides global AI panel state. React Query is installed but unused (no backend).",
      routing: {
        router_type: "react-router-dom v6 (BrowserRouter)",
        total_routes: 18,
        route_map: [
          { path: "/", component: "Index", auth_required: false, role_restrictions: [], description: "Main dashboard with KPI metrics, quality trends, supplier scorecard, recent activity" },
          { path: "/inbox", component: "SupplierInbox", auth_required: false, role_restrictions: [], description: "Task inbox with priority-sorted pending approvals and actions" },
          { path: "/tests", component: "Tests", auth_required: false, role_restrictions: [], description: "TRF list with table/kanban views, filtering, bulk actions" },
          { path: "/tests/new", component: "TRFCreate", auth_required: false, role_restrictions: [], description: "New Test Request Form creation wizard" },
          { path: "/tests/:id", component: "TRFDetail", auth_required: false, role_restrictions: [], description: "TRF detail view with testing workflow" },
          { path: "/inspections", component: "Inspections", auth_required: false, role_restrictions: [], description: "Inspection management with table/kanban, AQL-based quality metrics" },
          { path: "/inspections/:id", component: "InspectionDetail", auth_required: false, role_restrictions: [], description: "Inspection detail with defect breakdown" },
          { path: "/styles", component: "Styles", auth_required: false, role_restrictions: [], description: "Style management with card/table views, stage progression tracking" },
          { path: "/styles/new", component: "StyleCreate", auth_required: false, role_restrictions: [], description: "New style creation form" },
          { path: "/styles/:id", component: "StyleDetail", auth_required: false, role_restrictions: [], description: "Style detail with component linking, GSW tracking, care labels" },
          { path: "/components", component: "Components", auth_required: false, role_restrictions: [], description: "Material/fabric component library with N:M style linking" },
          { path: "/components/new", component: "ComponentCreate", auth_required: false, role_restrictions: [], description: "New component (fabric/trim) creation" },
          { path: "/suppliers", component: "Suppliers", auth_required: false, role_restrictions: [], description: "Supplier directory with performance scoring, compliance tracking" },
          { path: "/suppliers/new", component: "SupplierCreate", auth_required: false, role_restrictions: [], description: "New supplier registration" },
          { path: "/risk-assessment", component: "RiskAssessment", auth_required: false, role_restrictions: [], description: "Interactive Leaflet map with factory risk markers and detail panels" },
          { path: "/analytics", component: "Insight", auth_required: false, role_restrictions: [], description: "7-tab reporting hub: Risk, Compliance, Pipeline, Overview, Transactions, Balances, Custom Reports" },
          { path: "/users", component: "Users", auth_required: false, role_restrictions: [], description: "User management with RBAC, invite dialog, bulk selection" },
          { path: "/settings", component: "Settings", auth_required: false, role_restrictions: [], description: "6-tab settings: Profile, Notifications, Security, Appearance, Organization, Integrations" },
          { path: "/help", component: "KnowledgeHub", auth_required: false, role_restrictions: [], description: "Notion-style knowledge base with search, categories, featured articles, AI escalation" },
          { path: "/support", component: "SupportCenter", auth_required: false, role_restrictions: [], description: "4-tab support: Ask Carlos AI chat, Knowledge Base, Tickets, Admin dashboard" },
          { path: "/support-admin", component: "SupportAdmin", auth_required: false, role_restrictions: [], description: "Support administration panel" },
          { path: "/competitive-matrix", component: "CompetitiveMatrix", auth_required: false, role_restrictions: [], description: "SGS vs Inspectorio feature comparison matrix with weighted scoring" }
        ]
      },
      data_layer: {
        persistence: "All data is mock/static. No backend, no localStorage persistence, no API calls. Data defined in TypeScript files under src/data/.",
        mock_data_files: [
          "src/data/mockTRFs.ts",
          "src/data/mockInspections.ts",
          "src/data/mockStyles.ts",
          "src/data/mockComponents.ts",
          "src/data/mockSuppliers.ts",
          "src/data/mockTasks.ts",
          "src/data/mockReports.ts",
          "src/data/mockFactories.ts",
          "src/data/mockSupportAnalytics.ts",
          "src/data/helpContent.ts"
        ],
        api_integration_points: [],
        data_models: [
          {
            entity: "TRF (Test Request Form)",
            fields: ["id", "trfNumber", "styleName", "styleNumber", "designStyleRef", "linkedStyleId", "supplier{id,name}", "lab{id,name,location}", "status(8 states)", "priority(4 levels)", "testingLevel(base|bulk|garment)", "testTypes[]", "submittedDate", "dueDate", "assignedTo{id,name,avatar}", "progress", "slaStatus", "isArchived", "isAmendment", "parentTrfId", "linkedReportId"],
            relationships: ["TRF → Style (N:1 via linkedStyleId)", "TRF → Supplier (N:1)", "TRF → Lab (N:1)", "TRF → Parent TRF (self-ref for amendments)"]
          },
          {
            entity: "Style",
            fields: ["id", "tuStyleNo(9-digit)", "designStyleRef", "description", "productColour", "supplier", "factory", "division", "department", "season", "endUse", "countryOfOrigin", "status(5 states)", "stage(6 stages)", "fabricCutDate", "goldSealDate", "fabricTech", "garmentTech", "singleOrMultipack", "orderQuantity", "washedProduct", "eimScores", "bciCottonFields", "careSymbols[]", "careWording[]", "componentIds[]", "gswStatus", "images[]"],
            relationships: ["Style → Components (N:M via StyleComponentLink)", "Style → Supplier (N:1)", "Style → Factory (N:1)", "Style → TRFs (1:N)", "Style → FabricTech (N:1)", "Style → GarmentTech (N:1)"]
          },
          {
            entity: "Component (Fabric | Trim)",
            fields: ["id", "componentType", "mill", "tuReference", "countryOfOrigin", "isSustainable", "isRegenerative", "reachCompliant", "status(6 states)", "composition[]{fibreType,percentage,isSustainable}", "construction", "weight", "width", "dyeMethod", "colour", "trimType", "size", "material"],
            relationships: ["Component → Styles (N:M via StyleComponentLink)", "Component → ComponentTests (1:N)"]
          },
          {
            entity: "Inspection",
            fields: ["id", "inspectionNumber", "purchaseOrder", "productName", "productCode", "supplier{id,name}", "factory{id,name,location,country}", "inspector{id,name,avatar}", "status(6 states)", "inspectionType(5 types)", "result(4 outcomes)", "riskLevel(3 levels)", "scheduledDate", "completedDate", "sampleSize", "defectsFound", "criticalDefects", "majorDefects", "minorDefects", "aqlLevel", "score"],
            relationships: ["Inspection → Supplier (N:1)", "Inspection → Factory (N:1)", "Inspection → Inspector (N:1)"]
          },
          {
            entity: "Supplier",
            fields: ["id", "code", "name", "selfApprovalLevel(0-3)", "testExpiryMonths", "factories[]", "performanceScore", "complianceStatus", "tier", "contactName", "contactEmail", "passRate", "activeStylesCount", "certifications[]"],
            relationships: ["Supplier → Factories (1:N)", "Supplier → Styles (1:N)", "Supplier → TRFs (1:N)", "Supplier → Inspections (1:N)"]
          },
          {
            entity: "SupplierTask",
            fields: ["id", "type(8 task types)", "title", "description", "priority", "status", "styleId", "styleTuNo", "componentId", "assignedTo", "assignedBy", "dueDate", "slaStatus", "queryMessage"],
            relationships: ["Task → Style (N:1)", "Task → Component (N:1)", "Task → User (N:1)"]
          }
        ]
      },
      authentication: {
        method: "Not implemented. No auth system. Hardcoded user 'Mark Thompson' displayed in header/settings.",
        roles_defined: ["admin", "manager", "inspector", "viewer"],
        role_switching: "Not implemented. Role constants exist in type definitions but no role-switching UI."
      },
      mobile_support: {
        responsive: "yes — Tailwind responsive breakpoints used throughout (sm, md, lg, xl). use-mobile hook detects mobile viewport.",
        pwa: "no",
        native_apps: "no"
      },
      accessibility: {
        aria_labels: "Partial — shadcn/ui components include built-in ARIA attributes. Custom components have limited aria-label usage.",
        keyboard_navigation: "yes — via Radix UI primitives (all dialogs, dropdowns, selects, tabs are keyboard-accessible)",
        screen_reader_support: "partial — via semantic HTML and Radix primitives"
      }
    },

    product_modules: [
      {
        module_name: "Dashboard & KPI Overview",
        category: "ai_operations",
        route: "/",
        description: "Central dashboard with 7 KPI metric cards, quality trends line chart, recent tests table, test type distribution pie chart, supplier scorecard, quick actions panel, upcoming schedule, and recent activity feed.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 8,
        demo_talk_track: "This is your command centre — real-time visibility into testing operations, pass rates, SLA compliance, and supplier performance all in one view.",
        features: [
          { name: "KPI Metric Cards", description: "7 cards showing Total Tests, Passed, Failed, Pending, Active Inspections, Pass Rate, Avg Turnaround with trend indicators", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["MetricCard with icon, value, trend arrow, percentage"], interactions: ["hover"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity with Inspectorio dashboard" },
          { name: "Quality Trends Chart", description: "Multi-line Recharts area chart showing pass/fail/conditional trends over 12 months", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Recharts AreaChart with tooltips"], interactions: ["hover tooltips"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Supplier Scorecard", description: "Top suppliers with performance scores, pass rates, progress bars", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Card with avatar, score, progress bar"], interactions: ["view"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Test Type Distribution", description: "Recharts pie/donut chart showing test type breakdown", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["PieChart with labels"], interactions: ["hover"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Quick Actions", description: "Shortcut buttons for common actions (new TRF, new inspection, etc.)", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Action cards with icons"], interactions: ["click → navigate"], data_source: "static", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Recent Activity Feed", description: "Timeline of latest actions by team members with avatars", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Activity list with avatars, timestamps, status dots"], interactions: ["view"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Upcoming Schedule", description: "Calendar-style list of upcoming inspections and test deadlines", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Schedule cards"], interactions: ["view"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" }
        ],
        screens: [
          { route: "/", screen_name: "Dashboard", layout: "sidebar + main (DashboardLayout)", widgets: ["MetricCards x7", "QualityTrendsChart", "RecentTestsTable", "QuickActions", "UpcomingSchedule", "TestTypeDistribution", "SupplierScorecard", "RecentActivity"], conditional_sections: [], animations: [] }
        ]
      },
      {
        module_name: "Inbox & Task Management",
        category: "ai_operations",
        route: "/inbox",
        description: "Priority-sorted task inbox showing pending approvals, test reviews, GSW submissions, and queries. Groups tasks by urgency (Urgent/High/Normal).",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 7,
        demo_talk_track: "The inbox is where action happens — every pending approval, every query, every overdue task — all prioritised and one click away from the style sheet it relates to.",
        features: [
          { name: "Priority-grouped task list", description: "Tasks grouped into Urgent/High/Normal sections with colour-coded borders", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["TaskCard with priority border, type emoji, badges, SLA indicator"], interactions: ["click", "filter", "search"], data_source: "mock", unique_to_carlos: true, competitive_notes: "Inspectorio has task lists but not this priority-grouped inbox model" },
          { name: "8 task types", description: "style_approval, component_approval, test_review, gsw_review, fabric_hangar, query_response, bulk_approval, care_label_approval", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Type emoji, type filter dropdown"], interactions: ["filter"], data_source: "mock", unique_to_carlos: true, competitive_notes: "TIC-specific task types unique to SGS workflow" },
          { name: "SLA tracking", description: "On-track/At-risk/Overdue indicators on each task", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["SLA badges"], interactions: ["view"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Deep-link to style", description: "Each task links directly to its related style sheet", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Style link with external icon"], interactions: ["click → navigate"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" }
        ],
        screens: [
          { route: "/inbox", screen_name: "My Inbox", layout: "sidebar + main", widgets: ["Stats cards x5", "Priority filters", "Task list grouped by urgency"], conditional_sections: ["Urgent section (if urgent tasks exist)", "Completed view toggle"], animations: [] }
        ]
      },
      {
        module_name: "Test Request Forms (TRF)",
        category: "compliance_management",
        route: "/tests",
        description: "Full TRF lifecycle management: create, submit, track, review test requests. Table and Kanban views. Multi-level testing workflow (Base → Bulk → Garment).",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 8,
        demo_talk_track: "This is the heart of the testing lifecycle — from request to results. See every TRF's status, SLA health, and testing level at a glance. Switch to Kanban for visual workflow tracking.",
        features: [
          { name: "Dual-view (Table/Kanban)", description: "Toggle between sortable/filterable table and Kanban board grouped by status", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["TRFTable", "TRFKanban", "ViewMode toggle tabs"], interactions: ["toggle view", "sort", "filter", "click row"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity — Inspectorio also has table/board views" },
          { name: "Multi-filter system", description: "Filter by status, priority, testing level, SLA, search. Active filter count badges.", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["TRFFilters component with dropdowns and search"], interactions: ["multi-select filters", "search", "clear"], data_source: "computed from mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Bulk actions", description: "Select multiple TRFs for bulk operations", implementation_status: "partial", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["TRFBulkActions bar with selection count"], interactions: ["select all", "bulk action buttons"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "SLA tracking with indicators", description: "Traffic-light SLA status (on_track/at_risk/overdue) on every TRF", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["SLAIndicator component"], interactions: ["view", "filter by SLA"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Testing level workflow", description: "Sequential Base → Bulk → Garment testing levels with config-driven progression", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["TestingLevelBadge", "Stage progress"], interactions: ["view"], data_source: "mock", unique_to_carlos: true, competitive_notes: "Unique — Inspectorio doesn't model multi-level testing workflows for TIC labs" },
          { name: "TRF Creation", description: "Multi-step form for creating new test requests", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Form with validation (Zod + React Hook Form)"], interactions: ["form fill", "submit", "validation"], data_source: "form submission", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "TRF Detail View", description: "Full detail page with test results, timeline, documents", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Detail layout with tabs/sections"], interactions: ["view", "navigate"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Link-and-amend workflow", description: "TRFs can be linked to reports and amended, creating parent-child chains", implementation_status: "stubbed", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["linkedReportId fields in data model"], interactions: [], data_source: "mock", unique_to_carlos: true, competitive_notes: "Unique to TIC workflow — amendments are a lab-specific process" },
          { name: "Archive functionality", description: "TRFs can be archived with reason tracking", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Archive filter toggle", "isArchived flag"], interactions: ["toggle archive view"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" }
        ],
        screens: [
          { route: "/tests", screen_name: "Test Requests", layout: "sidebar + main", widgets: ["Quick stats x4", "TRFFilters", "ViewMode toggle", "TRFTable or TRFKanban", "BulkActions bar", "Results summary"], conditional_sections: ["Kanban vs Table based on viewMode"], animations: [] },
          { route: "/tests/new", screen_name: "New TRF", layout: "sidebar + main (form)", widgets: ["Multi-step creation form"], conditional_sections: [], animations: [] },
          { route: "/tests/:id", screen_name: "TRF Detail", layout: "sidebar + main (detail)", widgets: ["TRF header", "Status timeline", "Test results", "Documents"], conditional_sections: [], animations: [] }
        ]
      },
      {
        module_name: "Inspection Management",
        category: "compliance_management",
        route: "/inspections",
        description: "AQL-based quality inspection tracking with 5 inspection types (PPI, DPI, FRI, CLI, Factory Audit). Table/Kanban views with defect breakdown.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 7,
        demo_talk_track: "From pre-production through container loading — every inspection type your buyers need, with AQL-level defect tracking and risk scoring.",
        features: [
          { name: "5 Inspection Types", description: "Pre-Production, During Production, Final Random, Container Loading, Factory Audit", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["InspectionTypeBadge"], interactions: ["filter"], data_source: "mock", unique_to_carlos: true, competitive_notes: "Leader — more granular than Inspectorio QRM types" },
          { name: "AQL Defect Tracking", description: "Critical/Major/Minor defect counts with AQL level compliance", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Defect columns in table", "InspectionStats"], interactions: ["view", "sort"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity with Inspectorio QRM" },
          { name: "Risk Level Assessment", description: "Low/Medium/High risk indicators per inspection", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["RiskLevelBadge"], interactions: ["filter by risk"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Dual-view (Table/Kanban)", description: "Switch between data table and visual Kanban board", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["InspectionTable", "InspectionKanban"], interactions: ["toggle", "filter", "sort"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" }
        ],
        screens: [
          { route: "/inspections", screen_name: "Inspections", layout: "sidebar + main", widgets: ["InspectionStats", "InspectionFilters", "Table/Kanban toggle", "BulkActions", "Results count"], conditional_sections: ["Kanban vs Table"], animations: [] },
          { route: "/inspections/:id", screen_name: "Inspection Detail", layout: "sidebar + main (detail)", widgets: ["Inspection header", "Defect breakdown", "Inspector details"], conditional_sections: [], animations: [] }
        ]
      },
      {
        module_name: "Product Style Management",
        category: "compliance_management",
        route: "/styles",
        description: "Full product style lifecycle from creation through Gold Seal approval. Card and table views. 6-stage progression (Base → Base Approved → Bulk → Bulk Approved → Product → Product Approved). GSW workflow tracking.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 9,
        demo_talk_track: "This is the product lifecycle engine — every style tracked from initial fabric testing through Gold Seal sign-off. The stage progression bar shows exactly where each product sits in the approval chain.",
        features: [
          { name: "6-Stage Progression", description: "Base → Base Approved → Bulk → Bulk Approved → Product → Product Approved with visual progress bar", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["StyleStageBadge", "StyleStageProgress"], interactions: ["view"], data_source: "mock", unique_to_carlos: true, competitive_notes: "Unique — Inspectorio doesn't model multi-stage TIC testing progression" },
          { name: "Gold Seal Workbook (GSW)", description: "GSW submission status tracking with approval workflow", implementation_status: "partial", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["GSW status fields in style model"], interactions: ["view"], data_source: "mock", unique_to_carlos: true, competitive_notes: "Unique — GSW is a TIC-specific concept" },
          { name: "Dual-view (Cards/Table)", description: "Rich style cards or dense data table", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["StyleCard", "Table with sortable columns"], interactions: ["toggle view", "filter", "search", "click → detail"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Multi-filter system", description: "Filter by status, stage, division, season with active filter indicators", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["DropdownMenu filters", "Select for season", "Clear button"], interactions: ["multi-select", "clear"], data_source: "computed", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Care Label Management", description: "Care symbols and care wording linked to styles", implementation_status: "partial", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["CareSymbol and CareWording types in model"], interactions: ["view"], data_source: "mock", unique_to_carlos: true, competitive_notes: "Unique to textile TIC — care label compliance" },
          { name: "EIM & Sustainability Scoring", description: "Environmental Impact Measurement scores (forecasted vs achieved)", implementation_status: "stubbed", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["EIM fields in style model"], interactions: [], data_source: "mock", unique_to_carlos: true, competitive_notes: "Unique — EIM scoring specific to textile sustainability" },
          { name: "Named Routing (Fabric/Garment Tech)", description: "Each style assigned to both a Fabric Technologist and Garment Technologist", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Avatar with name in table/cards"], interactions: ["view", "filter"], data_source: "mock", unique_to_carlos: true, competitive_notes: "Unique to TIC workflow" }
        ],
        screens: [
          { route: "/styles", screen_name: "Styles", layout: "sidebar + main", widgets: ["Stats cards x5", "Search + filters", "View toggle", "StyleCards or Table", "Empty state"], conditional_sections: ["Card vs Table view"], animations: [] },
          { route: "/styles/new", screen_name: "New Style", layout: "sidebar + main (form)", widgets: ["Style creation form"], conditional_sections: [], animations: [] },
          { route: "/styles/:id", screen_name: "Style Detail", layout: "sidebar + main (detail)", widgets: ["Style header", "Stage progress", "Component links", "GSW status", "Care labels", "Images"], conditional_sections: [], animations: [] }
        ]
      },
      {
        module_name: "Component Library",
        category: "compliance_management",
        route: "/components",
        description: "Material and fabric component management with N:M style linking. Tracks fibre composition, sustainability flags, REACH compliance, and construction details.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 8,
        demo_talk_track: "This is where material DNA lives — every fabric and trim tracked with full composition, sustainability certification, and automatic linking to every style that uses it. Change a component, and every linked style updates.",
        features: [
          { name: "N:M Style-Component Linking", description: "Components linked to multiple styles via StyleComponentLink junction entity. Shows linked styles count and allows cross-reference.", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Linked styles count badge", "Detail dialog with linked styles list"], interactions: ["click to view linked styles", "navigate to style"], data_source: "mock", unique_to_carlos: true, competitive_notes: "Unique — Inspectorio doesn't model component-level material libraries" },
          { name: "Fibre Composition Tracking", description: "Detailed fibre breakdown with percentages, sustainability flags per fibre", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Composition badges with percentages and leaf icons"], interactions: ["view in detail dialog"], data_source: "mock", unique_to_carlos: true, competitive_notes: "Unique to TIC textile testing" },
          { name: "Sustainability Flags", description: "Sustainable, Regenerative, REACH Compliant flags on each component", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Leaf/Recycle/CheckCircle badges"], interactions: ["filter by sustainable"], data_source: "mock", unique_to_carlos: true, competitive_notes: "Leader — Inspectorio ESG is audit-focused, not material-level" },
          { name: "Fabric/Trim Tabs", description: "Tabbed interface separating fabric and trim components with counts", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Tabs with badge counts"], interactions: ["tab switch", "filter"], data_source: "mock", unique_to_carlos: false, competitive_notes: "N/A" },
          { name: "Component Detail Dialog", description: "Rich dialog showing construction, weight, width, dye method, composition, linked styles", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Dialog with grid layout"], interactions: ["click row → open dialog"], data_source: "mock", unique_to_carlos: false, competitive_notes: "N/A" }
        ],
        screens: [
          { route: "/components", screen_name: "Components", layout: "sidebar + main", widgets: ["Stats cards x6", "Search + filters", "Sustainable toggle", "Fabric/Trim/All tabs", "Component table", "Detail dialog"], conditional_sections: ["Tab-filtered content"], animations: [] }
        ]
      },
      {
        module_name: "Supplier Management",
        category: "compliance_management",
        route: "/suppliers",
        description: "Supplier directory with performance scoring, compliance status tracking, tier classification, and performance trend charts.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 7,
        demo_talk_track: "Every supplier scored, tiered, and tracked — from strategic partners to those on probation. One-click questionnaire sending and full performance history.",
        features: [
          { name: "Performance Scoring", description: "0-100 performance score per supplier with colour coding", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Score display with colour gradient"], interactions: ["sort by score"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity with Inspectorio SCNI" },
          { name: "Compliance Status", description: "Compliant/At Risk/Non-Compliant/Pending Audit status tracking", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Compliance badge with icon"], interactions: ["filter by compliance"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Tier Classification", description: "Strategic/Preferred/Approved/Probation supplier tiers", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Tier badge"], interactions: ["filter by tier"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Performance Trends View", description: "Multi-supplier Recharts line chart showing performance over time", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["SupplierPerformanceChart", "MultiSupplierPerformanceChart"], interactions: ["toggle list/trends view"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Bulk Questionnaire Send", description: "Select suppliers and send questionnaires via external link", implementation_status: "partial", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Checkbox selection", "Bulk action bar", "External link button"], interactions: ["select", "click → external URL"], data_source: "mock", unique_to_carlos: true, competitive_notes: "Unique — links to SGS-specific questionnaire system" },
          { name: "Supplier Detail Dialog", description: "Rich dialog with supplier info, certifications, contact details, performance chart", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Dialog with tabs and charts"], interactions: ["click row → open"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" }
        ],
        screens: [
          { route: "/suppliers", screen_name: "Suppliers", layout: "sidebar + main", widgets: ["Stats cards x7", "Search + filters", "List/Trends toggle", "Supplier table with bulk select", "Bulk action bar", "Supplier detail dialog"], conditional_sections: ["List vs Trends view"], animations: [] }
        ]
      },
      {
        module_name: "Risk Assessment Map",
        category: "ai_operations",
        route: "/risk-assessment",
        description: "Interactive Leaflet world map with factory location markers, risk-scored colour coding, and factory detail panels. AI-Powered Insights badge.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 9,
        demo_talk_track: "Your entire supply chain on one map — every factory, every risk score, every compliance status. Click any marker to drill into factory performance. This is the view that makes supply chain risk tangible.",
        features: [
          { name: "Interactive Leaflet Map", description: "Full-screen zoomable world map with factory markers", implementation_status: "complete", ai_presence: "light", ai_details: "AI-Powered Insights badge shown — no actual AI computation, but positioned as AI-scored risk", reasoning_visible: false, ui_elements: ["LeafletMap", "FactoryMarker", "WorldMapSVG (fallback)"], interactions: ["zoom", "pan", "click marker"], data_source: "mockFactories + GeoJSON", unique_to_carlos: false, competitive_notes: "Parity with Inspectorio Tracking map" },
          { name: "Risk-scored Factory Markers", description: "Colour-coded markers (green/yellow/red) based on factory risk score", implementation_status: "complete", ai_presence: "light", ai_details: "Risk scores are mock data — positioned as AI-computed", reasoning_visible: false, ui_elements: ["Coloured circle markers"], interactions: ["click → detail panel"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Factory Detail Panel", description: "Slide-out panel with factory info, risk breakdown, compliance status", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["FactoryDetailPanel"], interactions: ["click marker → open panel"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Map Style Toggle", description: "Switch between map tile styles", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["MapStyleToggle"], interactions: ["toggle"], data_source: "static", unique_to_carlos: false, competitive_notes: "N/A" },
          { name: "Risk Map Statistics", description: "Aggregate risk statistics panel", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["RiskMapStats", "RiskMapLegend"], interactions: ["view"], data_source: "computed from mock", unique_to_carlos: false, competitive_notes: "Parity" }
        ],
        screens: [
          { route: "/risk-assessment", screen_name: "Risk Assessment", layout: "sidebar + main (map-focused)", widgets: ["Animated header with Live badge + AI-Powered Insights badge", "RiskMap (contains LeafletMap, markers, stats, legend, detail panel)"], conditional_sections: ["FactoryDetailPanel shows on marker click"], animations: ["Framer Motion header entrance", "Live badge pulse", "AI badge entrance"] }
        ]
      },
      {
        module_name: "Insight & Analytics",
        category: "reporting",
        route: "/analytics",
        description: "7-tab reporting hub: Risk Summary, Compliance Health, Pipeline Flow, Overview, Transactions, Balances, Custom Reports. Advanced transaction table with drag-drop column management.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 9,
        demo_talk_track: "Decision-grade analytics — Risk summary shows your exposure by factory and region. Compliance health tracks certification status. Pipeline flow visualises your testing throughput. And the transaction table? Full column customisation with drag-and-drop reordering.",
        features: [
          { name: "Risk Summary Dashboard", description: "Risk heatmaps and breakdown by region/factory", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["RiskSummaryDashboard with charts"], interactions: ["view", "filter"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Compliance Health View", description: "Certification status and compliance scoring across suppliers", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["ComplianceHealthView"], interactions: ["view"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Pipeline Flow Dashboard", description: "Testing pipeline throughput and bottleneck visualisation", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["PipelineFlowDashboard"], interactions: ["view"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Transaction Table", description: "Full-featured data table with sorting, filtering, pagination, row selection, column visibility, and drag-drop column reordering", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["TransactionTable", "TransactionFilters", "ColumnEditor", "Pagination controls"], interactions: ["sort", "filter", "paginate", "select rows", "toggle columns", "drag-drop reorder columns", "export CSV"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Custom Reports", description: "Interface for creating custom reports with AI-driven generation", implementation_status: "partial", ai_presence: "light", ai_details: "AI report generation UI exists but is non-functional (UI only)", reasoning_visible: false, ui_elements: ["CustomReports component"], interactions: ["view", "interact with AI prompt"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Inspectorio has basic report builder" },
          { name: "Balances View", description: "Financial/credit balance tracking", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["BalancesView"], interactions: ["view"], data_source: "mock", unique_to_carlos: false, competitive_notes: "N/A" },
          { name: "Report Overview", description: "Summary dashboard of reporting metrics", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["ReportOverview"], interactions: ["view"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" }
        ],
        screens: [
          { route: "/analytics", screen_name: "Insight", layout: "sidebar + main with 7-tab interface", widgets: ["Animated header", "7 TabsTriggers", "Risk/Compliance/Pipeline/Overview/Transactions/Balances/Custom tabs"], conditional_sections: ["Tab-switched content"], animations: ["Framer Motion header entrance"] }
        ]
      },
      {
        module_name: "Support Center & AI Assistant",
        category: "ai_operations",
        route: "/support",
        description: "Integrated support system with AI chatbot ('Ask Carlos'), knowledge base, ticket management, and admin dashboard. Floating help button available on all pages.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 8,
        demo_talk_track: "Built-in AI support that knows your platform — Ask Carlos any question and get instant answers from the knowledge base. If AI can't help, escalate to a ticket in one click. Support admins see analytics and queue management.",
        features: [
          { name: "Ask Carlos AI Chat", description: "Conversational AI chatbot with knowledge-base-backed responses", implementation_status: "complete", ai_presence: "heavy", ai_details: "Rule-based knowledge matching against static helpContent database. No real AI model — pattern matching with relevance scoring. Appears as AI conversation.", reasoning_visible: false, ui_elements: ["SupportCenterChat", "Chat messages", "Input field"], interactions: ["type query", "send message", "escalate"], data_source: "helpContent knowledge DB", unique_to_carlos: true, competitive_notes: "Unique — Inspectorio doesn't have embedded AI support assistant" },
          { name: "Knowledge Base", description: "Searchable article library with category browsing", implementation_status: "complete", ai_presence: "light", ai_details: "Search with AI escalation option", reasoning_visible: false, ui_elements: ["SupportCenterKnowledge", "Article cards", "Category tabs"], interactions: ["search", "browse categories", "read articles", "ask AI"], data_source: "helpContent", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Ticket Management", description: "Create and track support tickets with Zendesk-style wizard", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["SupportCenterTickets", "TicketCreateWizard", "TicketDetailView", "TicketDashboard"], interactions: ["create ticket", "view tickets", "track status"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Admin Dashboard", description: "Support analytics for admins — ticket volumes, response times, satisfaction scores", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["SupportCenterAdmin"], interactions: ["view analytics"], data_source: "mockSupportAnalytics", unique_to_carlos: false, competitive_notes: "N/A" },
          { name: "Floating Help Button", description: "Persistent floating button on all pages to open AI help panel", implementation_status: "complete", ai_presence: "moderate", ai_details: "Opens contextual AI help panel with route-aware suggestions", reasoning_visible: false, ui_elements: ["FloatingHelpButton", "AIHelpPanel"], interactions: ["click to open/close"], data_source: "AISupportContext", unique_to_carlos: true, competitive_notes: "Unique — always-available contextual AI assistant" },
          { name: "Email Escalation", description: "Pre-filled email escalation with context from current page", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Escalation dialog with mailto link"], interactions: ["click escalate → email client"], data_source: "contextHelp", unique_to_carlos: false, competitive_notes: "N/A" }
        ],
        screens: [
          { route: "/support", screen_name: "Support Center", layout: "sidebar + centered max-width card with tabs", widgets: ["Tab navigation (Chat/Knowledge/Tickets/Admin)", "Content area per tab"], conditional_sections: ["Admin tab visible only for admin role"], animations: ["Framer Motion tab transitions, header entrance"] },
          { route: "/help", screen_name: "Knowledge Hub", layout: "sidebar + centered max-width", widgets: ["Search bar with AI button", "Category grid", "Featured articles", "What's New feed", "Article detail view"], conditional_sections: ["Search results vs categories vs article detail"], animations: ["Framer Motion staggered card entrance"] }
        ]
      },
      {
        module_name: "User Management",
        category: "administration",
        route: "/users",
        description: "User directory with RBAC roles, bulk selection, invite dialog, and per-user action menus.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 5,
        demo_talk_track: "Role-based access control — admins, managers, inspectors, viewers. Invite new team members, manage permissions, and track login activity.",
        features: [
          { name: "User Table with RBAC", description: "Sortable table with role/status badges, avatars, last login", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Table with checkboxes, avatars, role badges, status badges"], interactions: ["search", "filter by role/status", "select", "action menu"], data_source: "mock (6 users)", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Invite User Dialog", description: "Form to invite new users with email, role, department selection", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Dialog with form fields"], interactions: ["open dialog", "fill form", "send invite"], data_source: "form", unique_to_carlos: false, competitive_notes: "Parity" }
        ],
        screens: [
          { route: "/users", screen_name: "User Management", layout: "sidebar + main", widgets: ["Stats cards x4", "Search + filters", "User table", "Invite dialog"], conditional_sections: [], animations: [] }
        ]
      },
      {
        module_name: "Settings",
        category: "administration",
        route: "/settings",
        description: "6-tab settings panel: Profile, Notifications, Security (2FA, sessions), Appearance (theme), Organization, Integrations (webhook config).",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 4,
        demo_talk_track: "Enterprise-grade settings — profile management, granular notification controls, 2FA security, theme customisation, and webhook integrations.",
        features: [
          { name: "Profile Management", description: "Edit name, email, phone, job title, bio, avatar upload", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Form with avatar upload, text inputs, textarea"], interactions: ["edit", "save"], data_source: "hardcoded defaults", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Notification Preferences", description: "Toggle email/push notifications and specific alert types", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Switch toggles for 6 notification types"], interactions: ["toggle"], data_source: "local state", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Security (2FA, Sessions)", description: "Password change, 2FA toggle with QR code placeholder, active session management", implementation_status: "partial", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Password form", "2FA toggle with QR placeholder", "Session list with revoke"], interactions: ["toggle 2FA", "view sessions", "revoke session"], data_source: "mock", unique_to_carlos: false, competitive_notes: "Parity" },
          { name: "Appearance/Theme", description: "Light/Dark/System theme selector", implementation_status: "ui_only", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["3 theme option cards with icons"], interactions: ["click to select"], data_source: "local state (not persisted)", unique_to_carlos: false, competitive_notes: "Parity" }
        ],
        screens: [
          { route: "/settings", screen_name: "Settings", layout: "sidebar + main with 6 tabs", widgets: ["Profile form", "Notification toggles", "Security cards", "Theme selector", "Organization form", "Integration cards"], conditional_sections: ["2FA QR code shown when enabled"], animations: [] }
        ]
      },
      {
        module_name: "Competitive Feature Matrix",
        category: "reporting",
        route: "/competitive-matrix",
        description: "Side-by-side comparison of SGS SMART Advanced vs Inspectorio across 9 categories and 57 features with weighted scoring.",
        maturity: "implemented",
        demo_readiness: "demo_ready",
        demo_wow_factor: 7,
        demo_talk_track: "Here's how we stack up — feature by feature, category by category. The weighted scoring shows our true competitive position. Hover any feature for detailed context.",
        features: [
          { name: "57-Feature Comparison", description: "Detailed feature parity analysis across 9 categories", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["Tabbed category view", "Feature rows with status badges", "Tooltips with notes"], interactions: ["tab switch", "hover tooltips"], data_source: "static data from Inspectorio spec", unique_to_carlos: true, competitive_notes: "Meta — this IS the competitive comparison" },
          { name: "Weighted Scoring Engine", description: "Coverage percentage calculated as (Leader/Unique*1.0) + (Parity*0.7) + (Partial*0.3)", implementation_status: "complete", ai_presence: "none", ai_details: null, reasoning_visible: false, ui_elements: ["ScoreSummary component with progress bars"], interactions: ["view"], data_source: "computed", unique_to_carlos: true, competitive_notes: "N/A" }
        ],
        screens: [
          { route: "/competitive-matrix", screen_name: "Competitive Matrix", layout: "sidebar + main", widgets: ["Score summary cards", "Category tabs", "Feature comparison table", "Key differentiator card"], conditional_sections: ["Category-filtered feature list"], animations: [] }
        ]
      }
    ],

    ai_capabilities: {
      summary: "AI is present as a contextual support assistant ('Ask Carlos') using a static knowledge database. No real ML/AI models are deployed. All 'AI' features are rule-based pattern matching or simulated. The system is designed to be AI-ready with clear integration points for future model deployment.",
      capabilities: [
        {
          name: "Ask Carlos AI Assistant",
          type: "recommendation",
          description: "Conversational AI assistant that answers user questions using a curated knowledge database. Provides contextual help based on current page route.",
          where_used: ["/support (chat tab)", "FloatingHelpButton (all pages)", "AIHelpPanel (all pages)"],
          user_facing: true,
          reasoning_transparency: "No — responses appear as direct answers without showing reasoning process",
          confidence_display: "No — no confidence scores shown",
          implementation: "simulated",
          technical_details: "Pattern matching against helpContent.ts knowledge database. Uses keyword matching and relevance scoring. No LLM or ML model. AISupportContext provides state management."
        },
        {
          name: "Contextual Help Tooltips",
          type: "recommendation",
          description: "Route-mapped help suggestions that appear based on the user's current page",
          where_used: ["All pages via AISupportProvider"],
          user_facing: true,
          reasoning_transparency: "No",
          confidence_display: "No",
          implementation: "rule_based",
          technical_details: "Route matching in useAISupport hook maps current pathname to relevant help content"
        },
        {
          name: "AI-Powered Risk Assessment (Label Only)",
          type: "risk_scoring",
          description: "Risk Assessment page displays 'AI-Powered Insights' badge but risk scores are mock data",
          where_used: ["/risk-assessment"],
          user_facing: true,
          reasoning_transparency: "No",
          confidence_display: "No",
          implementation: "simulated",
          technical_details: "Static mock data in mockFactories.ts. Badge is decorative."
        },
        {
          name: "AI Custom Report Generation (Stubbed)",
          type: "generation",
          description: "Custom Reports tab in Insight has AI report generation UI but no functional AI",
          where_used: ["/analytics (Custom Reports tab)"],
          user_facing: true,
          reasoning_transparency: "No",
          confidence_display: "No",
          implementation: "planned",
          technical_details: "UI exists in CustomReports component. No backend AI service connected."
        }
      ],
      ai_vs_inspectorio: {
        carlos_advantages: [
          "Embedded contextual AI assistant available on every page (Ask Carlos)",
          "Route-aware help that adapts to user's current context",
          "In-product escalation from AI to human support",
          "Knowledge base integrated with AI search",
          "AI positioned as transparent reasoning engine (architecture ready, not yet implemented)"
        ],
        inspectorio_advantages: [
          "Paramo AI: Real ML model for defect classification and root cause analysis",
          "AI-powered predictive quality scoring with actual model training",
          "Automated data extraction from inspection photos",
          "AI-driven factory audit scheduling optimisation",
          "Production AI agents with autonomous decision-making"
        ],
        parity: [
          "Both have AI-branded features in risk assessment views",
          "Both position AI as core differentiator in marketing"
        ]
      }
    },

    sustainability_module: {
      description: "Sustainability tracking at the component/material level — fibre-level sustainability flags, EIM scoring on styles, BCI cotton tracking, REACH compliance. Architecture is scheme-agnostic with flag-based certification.",
      evidence_graph: {
        description: "Not implemented as a formal evidence graph. Sustainability data exists as boolean flags on component entities (isSustainable, isRegenerative, reachCompliant) and fibre-level flags (isSustainable, isRecycled).",
        scheme_agnostic: true,
        supported_schemes: ["BCI Cotton", "REACH", "OEKO-TEX (implied)", "Organic Cotton", "Recycled Polyester", "Recycled Nylon", "TENCEL™"],
        scheme_extensibility: "Add new fibre types to fibreTypeConfig with isSustainable flag. No code changes needed for new fibre classifications.",
        evidence_types: ["Component sustainability flags", "Fibre composition percentages", "EIM scores (forecast/actual)", "BCI ODF numbers"],
        claim_validation: "Not implemented — flags are self-declared",
        overclaim_prevention: "Not implemented"
      },
      dpp_readiness: {
        description: "Data model captures material composition at fibre level with traceability to supplier/factory/country. Architecture supports DPP data requirements but no DPP export format implemented.",
        data_model_alignment: "Partial — fibre composition, country of origin, sustainability flags map to DPP material passport requirements",
        export_capability: "Not implemented",
        audit_trail: "createdAt/updatedAt timestamps on all entities. No change-log or event sourcing."
      },
      competitive_advantage: "Material-level sustainability tracking (fibre composition with sustainability flags) is more granular than Inspectorio's audit-focused ESG approach. Inspectorio tracks factory-level audit compliance; CARLOS tracks material-level sustainability down to individual fibres."
    },

    demo_focus_system: {
      present: false,
      description: "Not implemented. No demo mode, persona switching, or guided tour.",
      personas: [],
      focus_levels: [],
      keyboard_shortcuts: [],
      demo_routes: [],
      visibility_map: "N/A"
    },

    insights_and_reporting: {
      dashboards: [
        { name: "Risk Summary", route: "/analytics (risk tab)", widgets: ["Risk heatmap", "Region breakdown", "Factory risk scores"], ai_presence: "none", ai_details: null, export_options: ["CSV (via Export button)"] },
        { name: "Compliance Health", route: "/analytics (compliance tab)", widgets: ["Compliance scores", "Certification status", "Supplier compliance grid"], ai_presence: "none", ai_details: null, export_options: ["CSV"] },
        { name: "Pipeline Flow", route: "/analytics (pipeline tab)", widgets: ["Pipeline throughput", "Bottleneck analysis", "Stage distribution"], ai_presence: "none", ai_details: null, export_options: ["CSV"] },
        { name: "Overview", route: "/analytics (overview tab)", widgets: ["Summary metrics", "Trend charts"], ai_presence: "none", ai_details: null, export_options: ["CSV"] },
        { name: "Transactions", route: "/analytics (transactions tab)", widgets: ["TransactionTable with filters, sorting, pagination, column editor"], ai_presence: "none", ai_details: null, export_options: ["CSV export button"] },
        { name: "Balances", route: "/analytics (balances tab)", widgets: ["Balance cards", "Financial summary"], ai_presence: "none", ai_details: null, export_options: ["CSV"] },
        { name: "Custom Reports", route: "/analytics (reports tab)", widgets: ["Report builder", "AI generation prompt"], ai_presence: "light", ai_details: "AI report generation UI (non-functional)", export_options: [] }
      ],
      charts_and_visualisations: [
        { type: "area", library: "recharts", location: "Dashboard - QualityTrendsChart", data_source: "Mock monthly pass/fail/conditional data" },
        { type: "pie", library: "recharts", location: "Dashboard - TestTypeDistribution", data_source: "Mock test type counts" },
        { type: "line", library: "recharts", location: "Suppliers - SupplierPerformanceChart", data_source: "Mock supplier trend data" },
        { type: "bar", library: "recharts", location: "Insight - various dashboards", data_source: "Mock report data" },
        { type: "interactive map", library: "leaflet", location: "Risk Assessment - RiskMap", data_source: "mockFactories + GeoJSON" }
      ],
      regulatory_tracking: {
        tracked_regulations: [],
        alert_system: "Not implemented"
      }
    },

    administration: {
      user_management: {
        role_based_access: "4 roles defined (admin, manager, inspector, viewer) but not enforced — no auth system",
        roles_defined: ["admin", "manager", "inspector", "viewer"],
        role_switching_for_demo: "Not implemented"
      },
      configuration: {
        custom_workflows: "no",
        template_management: "no",
        notification_rules: "UI toggles exist but non-functional (no backend)",
        branding_customization: "SGS branding hardcoded (logo, colors)"
      },
      audit_trail: "createdAt/updatedAt fields on all entities. No event log or change tracking.",
      data_export: "Export CSV buttons exist on Tests, Inspections, Analytics pages — toast notification only, no actual file download."
    },

    cross_cutting_capabilities: {
      search: {
        type: "per-page",
        description: "Each list page (Tests, Inspections, Styles, Components, Suppliers, Users, Inbox) has a local search input filtering on key text fields. Knowledge Hub has global article search. No application-wide search."
      },
      notifications: {
        type: "in-app",
        description: "Toast notifications via Sonner for user actions (export, refresh, ticket submit). No real-time notifications, no push, no email."
      },
      file_management: {
        upload: "Avatar upload UI exists in Settings but non-functional. No file upload system.",
        preview: "N/A",
        supported_formats: []
      },
      i18n: {
        multi_language: "no",
        languages: ["en"]
      },
      theming: {
        dark_mode: "Theme selector exists in Settings (Light/Dark/System) but not wired to actual theme switching",
        custom_themes: "no",
        sgs_branding: "SGS logo in sidebar, SGS brand colours in CSS custom properties, 'SMART Advanced v2.0' branding"
      }
    },

    ui_component_inventory: {
      total_custom_components: 95,
      design_system: "shadcn/ui (Radix UI primitives + Tailwind CSS)",
      components: [
        { name: "DashboardLayout", type: "layout", file_path: "src/components/layout/DashboardLayout.tsx", props: ["children"], used_in: ["All pages"], demo_relevant: true },
        { name: "AppSidebar", type: "navigation", file_path: "src/components/layout/AppSidebar.tsx", props: [], used_in: ["DashboardLayout"], demo_relevant: true },
        { name: "Header", type: "navigation", file_path: "src/components/layout/Header.tsx", props: [], used_in: ["DashboardLayout"], demo_relevant: true },
        { name: "MetricCard", type: "data_display", file_path: "src/components/dashboard/MetricCard.tsx", props: ["title", "value", "icon", "trend", "variant"], used_in: ["/"], demo_relevant: true },
        { name: "QualityTrendsChart", type: "chart", file_path: "src/components/dashboard/QualityTrendsChart.tsx", props: [], used_in: ["/"], demo_relevant: true },
        { name: "SupplierScorecard", type: "data_display", file_path: "src/components/dashboard/SupplierScorecard.tsx", props: [], used_in: ["/"], demo_relevant: true },
        { name: "RiskMap", type: "chart", file_path: "src/components/risk-map/RiskMap.tsx", props: [], used_in: ["/risk-assessment"], demo_relevant: true },
        { name: "LeafletMap", type: "chart", file_path: "src/components/risk-map/LeafletMap.tsx", props: [], used_in: ["/risk-assessment"], demo_relevant: true },
        { name: "FactoryMarker", type: "data_display", file_path: "src/components/risk-map/FactoryMarker.tsx", props: ["factory"], used_in: ["/risk-assessment"], demo_relevant: true },
        { name: "FactoryDetailPanel", type: "data_display", file_path: "src/components/risk-map/FactoryDetailPanel.tsx", props: ["factory"], used_in: ["/risk-assessment"], demo_relevant: true },
        { name: "TRFTable", type: "data_display", file_path: "src/components/trf/TRFTable.tsx", props: ["data", "selectedIds", "onSelectionChange"], used_in: ["/tests"], demo_relevant: true },
        { name: "TRFKanban", type: "data_display", file_path: "src/components/trf/TRFKanban.tsx", props: ["data"], used_in: ["/tests"], demo_relevant: true },
        { name: "StyleCard", type: "data_display", file_path: "src/components/styles/StyleCard.tsx", props: ["style"], used_in: ["/styles"], demo_relevant: true },
        { name: "StyleStageProgress", type: "data_display", file_path: "src/components/styles/StyleStageProgress.tsx", props: [], used_in: ["/styles/:id"], demo_relevant: true },
        { name: "FloatingHelpButton", type: "ai_widget", file_path: "src/components/support/FloatingHelpButton.tsx", props: [], used_in: ["All pages (global)"], demo_relevant: true },
        { name: "AIHelpPanel", type: "ai_widget", file_path: "src/components/support/AIHelpPanel.tsx", props: [], used_in: ["All pages (global)"], demo_relevant: true },
        { name: "SupportCenterChat", type: "ai_widget", file_path: "src/components/support/SupportCenterChat.tsx", props: ["onEscalate"], used_in: ["/support"], demo_relevant: true },
        { name: "TicketCreateWizard", type: "form", file_path: "src/components/support/TicketCreateWizard.tsx", props: ["onSubmit", "onCancel"], used_in: ["/support"], demo_relevant: true },
        { name: "TransactionTable", type: "data_display", file_path: "src/components/reports/TransactionTable.tsx", props: ["transactions", "visibleColumns", "selectedRows", "onSelectedRowsChange"], used_in: ["/analytics"], demo_relevant: true },
        { name: "ColumnEditor", type: "form", file_path: "src/components/reports/ColumnEditor.tsx", props: ["visibleColumns", "columnOrder", "onVisibleColumnsChange", "onColumnOrderChange"], used_in: ["/analytics"], demo_relevant: true }
      ]
    },

    demo_highlights: {
      top_10_wow_moments: [
        { rank: 1, feature: "Risk Assessment Map", route: "/risk-assessment", what_to_show: "Open the map, zoom to Asia, click a factory marker, show the risk breakdown panel", why_it_wows: "Supply chain risk visualised on a live map — makes abstract risk tangible and actionable", talk_track: "Your entire supply chain on one map. Every factory, every risk score, every compliance status. Click any marker to drill into performance.", vs_inspectorio: "Parity — Inspectorio also has a map view, but ours has the AI-Powered Insights badge positioning", vs_current_uki: "Replaces spreadsheet-based factory tracking with visual, interactive mapping" },
        { rank: 2, feature: "Style Stage Progression", route: "/styles", what_to_show: "Open a style card, show the Base → Bulk → Product progression bar", why_it_wows: "Visual lifecycle tracking that shows exactly where each product sits in the testing chain", talk_track: "Every product tracked from first fabric test to Gold Seal sign-off. This 6-stage progression is the testing lifecycle you rely on — now visualised.", vs_inspectorio: "Unique — Inspectorio doesn't model multi-stage TIC testing", vs_current_uki: "Replaces manual stage tracking in NIS with automated visual progression" },
        { rank: 3, feature: "Component N:M Linking", route: "/components", what_to_show: "Click a fabric component, show linked styles, highlight the sustainability badges", why_it_wows: "Material DNA linked to every product that uses it — change once, update everywhere", talk_track: "One fabric, used across 5 styles. Change the composition and every linked style updates. This is how you eliminate re-testing.", vs_inspectorio: "Unique — Inspectorio has no component-level material library", vs_current_uki: "Replaces manual component tracking spreadsheets" },
        { rank: 4, feature: "Insight Analytics Hub", route: "/analytics", what_to_show: "Walk through Risk → Compliance → Pipeline tabs, then show the Transaction table column drag-drop", why_it_wows: "7 specialised dashboards with decision-grade analytics — not just data, but insight", talk_track: "Risk exposure by region. Compliance health by supplier. Pipeline throughput bottlenecks. And a transaction table you can customise with drag-and-drop columns.", vs_inspectorio: "Parity — Inspectorio has similar analytics but our 7-tab organisation is cleaner", vs_current_uki: "Replaces manual Excel reporting with interactive dashboards" },
        { rank: 5, feature: "Ask Carlos AI Support", route: "/support", what_to_show: "Open Support Center, type a question, get instant response, show escalation to ticket", why_it_wows: "AI assistant that knows your platform — instant answers, seamless escalation", talk_track: "Ask Carlos anything. Get instant answers from the knowledge base. If AI can't help, one click to create a ticket. Support built into the product.", vs_inspectorio: "Unique — Inspectorio has no embedded AI support assistant", vs_current_uki: "Replaces email-based support with in-product AI assistance" },
        { rank: 6, feature: "Dashboard KPI Overview", route: "/", what_to_show: "Walk through the 7 metric cards, quality trends chart, supplier scorecard", why_it_wows: "Command centre view — everything at a glance, real-time operational visibility", talk_track: "Your command centre. Total tests, pass rates, SLA compliance, supplier performance — all in one view. Spot issues before they become problems.", vs_inspectorio: "Parity — standard dashboard features", vs_current_uki: "Replaces logging into 7 different systems to get this information" },
        { rank: 7, feature: "TRF Kanban Board", route: "/tests", what_to_show: "Switch from Table to Kanban view, show the status columns", why_it_wows: "Visual workflow — see your testing pipeline at a glance", talk_track: "Switch to Kanban and see your entire testing pipeline. Draft to completed — every TRF, every status, every SLA indicator.", vs_inspectorio: "Parity — both have board views", vs_current_uki: "Replaces email-based TRF tracking with visual workflow" },
        { rank: 8, feature: "Supplier Performance Trends", route: "/suppliers", what_to_show: "Switch to Trends view, show multi-supplier comparison chart", why_it_wows: "Track supplier improvement or decline over time — data-driven decisions", talk_track: "Are your suppliers getting better or worse? Performance trends over time, compared side by side. Data-driven supplier management.", vs_inspectorio: "Parity", vs_current_uki: "New capability — no supplier trending in current system" },
        { rank: 9, feature: "Priority Inbox", route: "/inbox", what_to_show: "Show the urgent/high/normal grouping, click through to a style", why_it_wows: "Action-oriented inbox — never miss a critical approval again", talk_track: "Urgent tasks first. Every pending approval, every query, every overdue item — prioritised and linked directly to the style it relates to.", vs_inspectorio: "Unique — Inspectorio has task lists but not this priority-inbox model", vs_current_uki: "Replaces email-based task tracking" },
        { rank: 10, feature: "Knowledge Hub", route: "/help", what_to_show: "Browse categories, search, open an article, click Ask AI", why_it_wows: "Self-service help with AI fallback — reduces support tickets", talk_track: "Search our knowledge base, browse by topic, read detailed guides. Can't find what you need? Ask AI and get an instant answer.", vs_inspectorio: "Unique design — Notion-style knowledge base", vs_current_uki: "Replaces PDF user guides with interactive knowledge base" }
      ],
      demo_flow_recommended: [
        { order: 1, screen: "Dashboard", route: "/", duration_minutes: 2, transition_to_next: "Point to the KPI cards and say 'Let me show you where these numbers come from'" },
        { order: 2, screen: "Styles", route: "/styles", duration_minutes: 3, transition_to_next: "Click a style card and say 'Let's look at the components that make up this product'" },
        { order: 3, screen: "Components", route: "/components", duration_minutes: 2, transition_to_next: "Show a linked style and say 'Now let's look at the testing lifecycle'" },
        { order: 4, screen: "Tests", route: "/tests", duration_minutes: 3, transition_to_next: "Switch to Kanban and say 'And here's the pipeline view'" },
        { order: 5, screen: "Inspections", route: "/inspections", duration_minutes: 2, transition_to_next: "Say 'Let's see where these factories are on the map'" },
        { order: 6, screen: "Risk Assessment", route: "/risk-assessment", duration_minutes: 3, transition_to_next: "Say 'Now let me show you the analytics behind all of this'" },
        { order: 7, screen: "Insight", route: "/analytics", duration_minutes: 3, transition_to_next: "Say 'And if you need help at any point...'" },
        { order: 8, screen: "Support Center", route: "/support", duration_minutes: 2, transition_to_next: "Say 'That's SMART Advanced — any questions?'" }
      ],
      audience_adaptations: {
        steering_committee: "Lead with Risk Assessment Map and Insight dashboards. Emphasise competitive positioning vs Inspectorio. Show weighted scoring on Competitive Matrix. Focus on investment ROI and migration from 7 legacy systems.",
        technical_team: "Lead with data model walkthrough — Style/Component/TRF relationships. Show N:M component linking. Discuss state management architecture. Highlight extensibility of config-driven types.",
        client_buyers: "Lead with Inbox and Style stage progression. Show the testing lifecycle from their perspective. Emphasise SLA tracking and supplier performance. Compare to their current NIS/UKI experience.",
        sustainability_teams: "Lead with Components page — show fibre-level sustainability tracking. Discuss EIM scoring on styles. Show BCI cotton fields. Position DPP-readiness architecture."
      }
    },

    comparison_positioning: {
      vs_inspectorio: {
        carlos_strengths: [
          "Multi-level testing workflow (Base → Bulk → Garment) — TIC-native, not generic SaaS",
          "N:M Component-Style linking with material-level sustainability tracking",
          "Gold Seal Workbook (GSW) workflow — industry-specific approval process",
          "Care label management at style level",
          "Embedded AI support assistant (Ask Carlos) on every page",
          "EIM scoring and BCI cotton tracking at product level",
          "Priority-grouped task inbox with 8 TIC-specific task types",
          "Named routing to Fabric and Garment Technologists"
        ],
        inspectorio_strengths: [
          "Real AI models (Paramo) for defect classification and root cause analysis",
          "Production AI agents with autonomous decision-making",
          "Mobile-native field inspection app",
          "Factory audit scheduling with AI optimisation",
          "Chemical compliance module (ZDHC gateway integration)",
          "Multi-language support (12+ languages)",
          "Real-time collaboration and messaging",
          "Established customer base with proven scale"
        ],
        parity: [
          "Dashboard KPI overview",
          "Supplier performance scoring",
          "Table/Kanban dual-view for work items",
          "Risk assessment with map visualisation",
          "Analytics dashboards with charts",
          "User management with RBAC"
        ],
        key_differentiator: "CARLOS is built by SGS — the world's largest TIC company — with deep domain knowledge of laboratory testing workflows, multi-stage approval processes, and material-level traceability that generic SaaS platforms like Inspectorio cannot replicate."
      },
      vs_current_uki_nis: {
        capabilities_replaced: [
          "Manual TRF submission via email/forms",
          "Spreadsheet-based style and component tracking",
          "PDF-based test report management",
          "Email-driven supplier communication",
          "Manual factory risk tracking",
          "Paper-based inspection workflows",
          "Standalone Excel reporting"
        ],
        capabilities_added: [
          "Interactive risk assessment map",
          "AI-powered support assistant",
          "Kanban workflow visualisation",
          "Component N:M linking with sustainability tracking",
          "Real-time KPI dashboards",
          "Stage progression tracking",
          "Priority-based task inbox"
        ],
        user_experience_delta: "From 7 disconnected legacy systems with email-based workflows to a unified modern SPA with instant search, visual workflows, and AI-assisted support. Estimated 60-70% reduction in manual tracking overhead."
      },
      vs_sgs_smart: {
        capabilities_beyond_smart: [
          "Material-level component library with N:M linking",
          "Multi-stage testing lifecycle (Base → Bulk → Garment)",
          "AI support assistant (Ask Carlos)",
          "Interactive risk assessment map",
          "7-dashboard analytics hub",
          "Knowledge base with AI search",
          "Competitive benchmarking module"
        ],
        smart_migration_relevance: "SMART Advanced demonstrates the next-generation UX and architecture that could inform the SMART platform migration. Key architectural decisions (config-driven types, component-based UI, contextual AI) are immediately applicable to SMART's modernisation roadmap."
      }
    },

    technical_debt_and_gaps: {
      stubbed_features: [
        "Link-and-amend TRF workflow (data model exists, no UI)",
        "EIM scoring display on styles (fields exist, no visualisation)",
        "BCI cotton tracking (fields exist, no dedicated UI)",
        "Theme switching (selector exists, not wired to CSS variables)",
        "Export functionality (buttons exist, toast only — no file download)",
        "Demo focus mode (not implemented)",
        "Role-based access control (roles defined but not enforced)",
        "AI Custom Report generation (UI exists, no backend)"
      ],
      mock_data_dependencies: [
        "All TRF data (mockTRFs.ts)",
        "All inspection data (mockInspections.ts)",
        "All style data (mockStyles.ts)",
        "All component data (mockComponents.ts)",
        "All supplier data (mockSuppliers.ts)",
        "All task data (mockTasks.ts)",
        "All report/transaction data (mockReports.ts)",
        "All factory/risk data (mockFactories.ts)",
        "All support analytics (mockSupportAnalytics.ts)",
        "All help content (helpContent.ts)",
        "User data (hardcoded in Users.tsx)"
      ],
      known_bugs: [],
      performance_concerns: [
        "GeoJSON world map file may be large for initial load",
        "Leaflet map tile loading depends on external tile server"
      ],
      production_readiness_gaps: [
        "No backend/database — all data is mock",
        "No authentication system",
        "No real-time data updates",
        "No file upload/download",
        "No email/notification delivery",
        "No role-based access enforcement",
        "No API integration with SGS lab systems",
        "No data validation beyond form-level Zod schemas",
        "No audit logging or change tracking",
        "No multi-tenancy",
        "No automated testing (single example test file)"
      ]
    },

    file_manifest: {
      total_files: 135,
      total_lines_of_code: "~15,000",
      key_directories: [
        { path: "src/components/", file_count: 75, purpose: "UI components organised by domain (dashboard, trf, inspection, styles, suppliers, risk-map, reports, support, ui, layout)" },
        { path: "src/pages/", file_count: 20, purpose: "Route-level page components" },
        { path: "src/data/", file_count: 10, purpose: "Mock data files providing all application data" },
        { path: "src/types/", file_count: 5, purpose: "TypeScript type definitions for domain entities" },
        { path: "src/components/ui/", file_count: 42, purpose: "shadcn/ui base components (Button, Card, Dialog, Table, etc.)" },
        { path: "src/hooks/", file_count: 3, purpose: "Custom React hooks (use-mobile, use-toast, useAISupport)" },
        { path: "src/contexts/", file_count: 1, purpose: "React contexts (AISupportContext)" }
      ],
      largest_files: [
        "src/pages/Suppliers.tsx (~720 lines)",
        "src/pages/Settings.tsx (~649 lines)",
        "src/pages/Components.tsx (~558 lines)",
        "src/pages/Styles.tsx (~437 lines)",
        "src/pages/CompetitiveMatrix.tsx (~400+ lines)",
        "src/pages/SupplierInbox.tsx (~435 lines)",
        "src/pages/Users.tsx (~461 lines)",
        "src/pages/KnowledgeHub.tsx (~404 lines)",
        "src/data/helpContent.ts (knowledge database)",
        "src/types/component.ts (~279 lines)"
      ],
      entry_points: [
        "src/main.tsx",
        "src/App.tsx",
        "index.html"
      ]
    }
  }
};
