// Context-aware help content mapped to screens, objects, and roles
export interface HelpItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  category: 'getting-started' | 'testing' | 'suppliers' | 'inspections' | 'reports' | 'general';
}

export interface ContextualHelp {
  route: string;
  title: string;
  description: string;
  commonQuestions: HelpItem[];
  tips: string[];
}

export interface ElementHelp {
  selector: string;
  title: string;
  description: string;
  learnMoreId?: string;
}

// General help content database (simulating training on emails, webinars, guides)
export const helpDatabase: HelpItem[] = [
  // Getting Started
  {
    id: 'gs-1',
    question: 'How do I create a new test request?',
    answer: 'Navigate to the Tests page and click the "New Test" button in the header. Fill out the required fields including style, supplier, and testing level. You can also create tests directly from the Style or Supplier detail pages.',
    keywords: ['create', 'new', 'test', 'request', 'trf'],
    category: 'getting-started'
  },
  {
    id: 'gs-2',
    question: 'What are the different testing levels?',
    answer: 'There are three testing levels: **Base** (initial material testing), **Bulk** (production batch testing), and **Garment** (finished product testing). Each level has specific test requirements and SLA timelines.',
    keywords: ['testing', 'level', 'base', 'bulk', 'garment'],
    category: 'testing'
  },
  {
    id: 'gs-3',
    question: 'How do I add a new supplier?',
    answer: 'Go to the Suppliers page and click "Add Supplier". Enter the supplier details including name, location, contact information, and compliance certifications. You can also import suppliers in bulk via CSV.',
    keywords: ['add', 'supplier', 'new', 'create'],
    category: 'suppliers'
  },
  
  // Testing
  {
    id: 't-1',
    question: 'What does each TRF status mean?',
    answer: '**Draft**: Initial creation, not yet submitted. **Submitted**: Sent to lab for processing. **Sample Received**: Lab confirmed sample arrival. **In Testing**: Active testing in progress. **Pending Review**: Results ready for review. **Completed**: All tests finished and approved.',
    keywords: ['status', 'trf', 'workflow', 'draft', 'submitted', 'testing'],
    category: 'testing'
  },
  {
    id: 't-2',
    question: 'How are SLA deadlines calculated?',
    answer: 'SLA deadlines are calculated from the sample received date. Base testing: 5 business days. Bulk testing: 7 business days. Garment testing: 10 business days. Rush orders reduce these by 50%.',
    keywords: ['sla', 'deadline', 'timeline', 'days', 'rush'],
    category: 'testing'
  },
  {
    id: 't-3',
    question: 'How do I request a rush test?',
    answer: 'When creating a TRF, check the "Rush" priority option. Rush tests have expedited SLAs but may incur additional fees. You can also upgrade an existing test to rush from the TRF detail page.',
    keywords: ['rush', 'urgent', 'expedite', 'priority', 'fast'],
    category: 'testing'
  },
  
  // Inspections
  {
    id: 'i-1',
    question: 'What inspection types are available?',
    answer: '**Pre-Production**: Before manufacturing starts. **During Production**: While goods are being made. **Final Random**: Before shipment. **Full Inspection**: 100% product check. Each type has specific AQL standards.',
    keywords: ['inspection', 'type', 'pre-production', 'final', 'random'],
    category: 'inspections'
  },
  {
    id: 'i-2',
    question: 'How do I schedule an inspection?',
    answer: 'Navigate to Inspections and click "Schedule Inspection". Select the factory, date, inspection type, and assign an inspector. The system will check inspector availability and send confirmation emails.',
    keywords: ['schedule', 'inspection', 'book', 'inspector'],
    category: 'inspections'
  },
  
  // Suppliers
  {
    id: 's-1',
    question: 'How is supplier risk calculated?',
    answer: 'Supplier risk scores combine: test failure rate (40%), inspection results (30%), delivery performance (20%), and compliance status (10%). Scores update weekly. View details on the Risk Assessment page.',
    keywords: ['risk', 'score', 'supplier', 'calculate', 'rating'],
    category: 'suppliers'
  },
  {
    id: 's-2',
    question: 'What do the supplier compliance badges mean?',
    answer: '**Green (Compliant)**: All certifications current. **Yellow (Expiring)**: Certifications expire within 30 days. **Red (Non-Compliant)**: Expired or missing required certifications.',
    keywords: ['compliance', 'badge', 'certification', 'green', 'red'],
    category: 'suppliers'
  },
  
  // Reports
  {
    id: 'r-1',
    question: 'How do I export report data?',
    answer: 'On any report page, click the "Export" button to download data as CSV or PDF. You can customize columns before export using the column editor. Scheduled exports can be set up in Settings.',
    keywords: ['export', 'report', 'csv', 'pdf', 'download'],
    category: 'reports'
  },
  {
    id: 'r-2',
    question: 'Can I create custom reports?',
    answer: 'Yes! Go to Insight > Custom Reports to build reports with your own filters and columns. Save reports as templates to reuse them. Share reports with team members via the share button.',
    keywords: ['custom', 'report', 'create', 'template', 'insight'],
    category: 'reports'
  },
  
  // General
  {
    id: 'g-1',
    question: 'How do I change notification settings?',
    answer: 'Go to Settings > Notifications to customize which alerts you receive. You can set preferences for email, in-app notifications, and mobile push notifications separately.',
    keywords: ['notification', 'settings', 'email', 'alert'],
    category: 'general'
  },
  {
    id: 'g-2',
    question: 'How do I add team members?',
    answer: 'Navigate to Settings > Users to invite new team members. Enter their email and assign a role (Admin, Manager, Viewer). They will receive an invitation email to join.',
    keywords: ['team', 'member', 'invite', 'user', 'add'],
    category: 'general'
  }
];

// Context-specific help per route
export const contextualHelp: Record<string, ContextualHelp> = {
  '/': {
    route: '/',
    title: 'Dashboard',
    description: 'Your central hub for monitoring testing activity and key metrics.',
    commonQuestions: helpDatabase.filter(h => ['gs-1', 't-1', 's-1'].includes(h.id)),
    tips: [
      'Click on any metric card to see detailed breakdowns',
      'Use Quick Actions for common tasks',
      'The schedule widget shows upcoming deadlines'
    ]
  },
  '/tests': {
    route: '/tests',
    title: 'Test Requests (TRFs)',
    description: 'Manage all your testing requests from creation to completion.',
    commonQuestions: helpDatabase.filter(h => h.category === 'testing'),
    tips: [
      'Use filters to quickly find specific TRFs',
      'Toggle between Table and Kanban views',
      'Bulk actions available when selecting multiple items'
    ]
  },
  '/inspections': {
    route: '/inspections',
    title: 'Inspections',
    description: 'Schedule and track factory inspections across your supply chain.',
    commonQuestions: helpDatabase.filter(h => h.category === 'inspections'),
    tips: [
      'Drag cards between columns in Kanban view',
      'Click a factory name to see all its inspections',
      'Risk levels are color-coded for quick scanning'
    ]
  },
  '/suppliers': {
    route: '/suppliers',
    title: 'Supplier Management',
    description: 'View and manage your supplier network and performance.',
    commonQuestions: helpDatabase.filter(h => h.category === 'suppliers'),
    tips: [
      'Star suppliers to add them to favorites',
      'Performance charts update in real-time',
      'Export supplier data for offline analysis'
    ]
  },
  '/styles': {
    route: '/styles',
    title: 'Styles & Products',
    description: 'Manage your product catalog and track development stages.',
    commonQuestions: helpDatabase.filter(h => ['gs-1', 't-2'].includes(h.id)),
    tips: [
      'Each style card shows current development stage',
      'Link components to styles for bill of materials',
      'Filter by season or category'
    ]
  },
  '/components': {
    route: '/components',
    title: 'Components',
    description: 'Manage materials and components used across your products.',
    commonQuestions: helpDatabase.filter(h => ['gs-1', 't-2', 's-2'].includes(h.id)),
    tips: [
      'Components can be linked to multiple styles',
      'Track supplier source for each component',
      'View test history in component details'
    ]
  },
  '/insight': {
    route: '/insight',
    title: 'Insights & Analytics',
    description: 'Analyze trends and generate reports from your quality data.',
    commonQuestions: helpDatabase.filter(h => h.category === 'reports'),
    tips: [
      'Use date range filters for trend analysis',
      'Compare performance across suppliers',
      'Export charts as images for presentations'
    ]
  },
  '/risk-assessment': {
    route: '/risk-assessment',
    title: 'Risk Assessment',
    description: 'Visualize supply chain risks on an interactive global map.',
    commonQuestions: helpDatabase.filter(h => ['s-1', 's-2'].includes(h.id)),
    tips: [
      'Click map markers to see factory details',
      'Color indicates risk level',
      'Toggle between map styles for different views'
    ]
  },
  '/settings': {
    route: '/settings',
    title: 'Settings',
    description: 'Configure your account and application preferences.',
    commonQuestions: helpDatabase.filter(h => h.category === 'general'),
    tips: [
      'Changes are saved automatically',
      'Contact support for enterprise features',
      'Export your data anytime'
    ]
  }
};

// Element-specific help for hover/focus triggers
export const elementHelp: ElementHelp[] = [
  // Header elements
  {
    selector: '[data-help="new-test-btn"]',
    title: 'Create New Test Request',
    description: 'Start a new TRF to request testing for a style or component. You\'ll need to specify the testing level and priority.',
    learnMoreId: 'gs-1'
  },
  {
    selector: '[data-help="search-input"]',
    title: 'Global Search',
    description: 'Search across tests, inspections, suppliers, and styles. Use keywords like "TRF-2026" or supplier names.',
  },
  {
    selector: '[data-help="notifications"]',
    title: 'Notifications',
    description: 'View alerts for test completions, inspection results, and SLA warnings. Click to see all notifications.',
    learnMoreId: 'g-1'
  },
  
  // TRF elements
  {
    selector: '[data-help="trf-status"]',
    title: 'TRF Status',
    description: 'Current workflow stage of this test request. Hover over the badge to see status history.',
    learnMoreId: 't-1'
  },
  {
    selector: '[data-help="testing-level"]',
    title: 'Testing Level',
    description: 'Determines which tests are performed and the SLA timeline. Base → Bulk → Garment is the typical flow.',
    learnMoreId: 'gs-2'
  },
  {
    selector: '[data-help="sla-indicator"]',
    title: 'SLA Status',
    description: 'Shows time remaining until the deadline. Green = on track, Yellow = at risk, Red = overdue.',
    learnMoreId: 't-2'
  },
  {
    selector: '[data-help="priority-badge"]',
    title: 'Priority Level',
    description: 'Standard requests follow normal SLAs. Rush orders have expedited timelines.',
    learnMoreId: 't-3'
  },
  
  // Supplier elements
  {
    selector: '[data-help="supplier-score"]',
    title: 'Supplier Score',
    description: 'Overall performance rating based on test results, inspections, and delivery. Higher is better.',
    learnMoreId: 's-1'
  },
  {
    selector: '[data-help="compliance-badge"]',
    title: 'Compliance Status',
    description: 'Shows if the supplier\'s certifications are current and valid.',
    learnMoreId: 's-2'
  },
  {
    selector: '[data-help="risk-level"]',
    title: 'Risk Level',
    description: 'Calculated risk score based on historical performance and compliance data.',
    learnMoreId: 's-1'
  },
  
  // Inspection elements
  {
    selector: '[data-help="inspection-type"]',
    title: 'Inspection Type',
    description: 'The stage of production being inspected. Each type has specific checkpoints and AQL standards.',
    learnMoreId: 'i-1'
  },
  {
    selector: '[data-help="inspection-result"]',
    title: 'Inspection Result',
    description: 'Pass/Fail/Pending status based on defect findings against AQL criteria.',
    learnMoreId: 'i-1'
  }
];

// AI response simulation (would be replaced by actual AI backend)
export function searchHelp(query: string): HelpItem[] {
  const queryLower = query.toLowerCase();
  const words = queryLower.split(/\s+/);
  
  return helpDatabase
    .map(item => {
      // Calculate relevance score
      let score = 0;
      
      // Check keywords
      for (const keyword of item.keywords) {
        if (words.some(w => keyword.includes(w) || w.includes(keyword))) {
          score += 3;
        }
      }
      
      // Check question text
      if (item.question.toLowerCase().includes(queryLower)) {
        score += 5;
      }
      
      // Check answer text
      if (item.answer.toLowerCase().includes(queryLower)) {
        score += 2;
      }
      
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ item }) => item);
}

// Get contextual help for current route
export function getContextHelp(pathname: string): ContextualHelp | null {
  // Try exact match first
  if (contextualHelp[pathname]) {
    return contextualHelp[pathname];
  }
  
  // Try base route match (e.g., /tests/TRF-123 → /tests)
  const baseRoute = '/' + pathname.split('/')[1];
  return contextualHelp[baseRoute] || contextualHelp['/'];
}

// Get help for a specific element
export function getElementHelp(selector: string): ElementHelp | null {
  return elementHelp.find(h => h.selector === selector) || null;
}

// Get a specific help item by ID
export function getHelpById(id: string): HelpItem | null {
  return helpDatabase.find(h => h.id === id) || null;
}
