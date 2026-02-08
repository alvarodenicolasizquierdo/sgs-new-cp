import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface WalkthroughStep {
  id: string;
  route: string;
  title: string;
  description: string;
  highlight?: string; // CSS selector or data-tour attribute
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  chapter: string;
  chapterIcon: string;
}

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  // Chapter 1: Component Library
  {
    id: 'intro',
    route: '/',
    title: 'Welcome to the Fabric-to-Gold-Seal Journey',
    description: 'This guided tour walks you through the complete product lifecycle — from raw material components through to final Gold Seal approval. Let\'s begin.',
    position: 'center',
    chapter: 'Introduction',
    chapterIcon: '🎯',
  },
  {
    id: 'components-list',
    route: '/components',
    title: 'Step 1: The Component Library',
    description: 'Every product starts with materials. The Component Library holds your N:M fabric and trim catalogue. One component can be shared across many styles — update once, comply everywhere.',
    position: 'top',
    chapter: 'Components',
    chapterIcon: '🧵',
  },
  {
    id: 'components-reuse',
    route: '/components',
    title: 'N:M Linking in Action',
    description: 'Notice the "Linked Styles" count on each component. When a fabric test result updates here, every style using that component automatically inherits the new compliance status — eliminating redundant testing.',
    position: 'bottom',
    chapter: 'Components',
    chapterIcon: '🧵',
  },
  // Chapter 2: Style Creation & Progression
  {
    id: 'styles-list',
    route: '/styles',
    title: 'Step 2: The Style Pipeline',
    description: 'Styles represent finished products. Each style progresses through 6 sequential stages: Base → Base Approved → Bulk → Bulk Approved → Product → Product Approved (Gold Seal).',
    position: 'top',
    chapter: 'Style Lifecycle',
    chapterIcon: '👗',
  },
  {
    id: 'style-detail',
    route: '/styles/style-1',
    title: 'Style Detail: The 6-Stage Progression',
    description: 'The stage progress bar at the top shows exactly where this style sits in its lifecycle. Each stage requires specific test results and approvals before advancing — no shortcuts.',
    position: 'top',
    chapter: 'Style Lifecycle',
    chapterIcon: '👗',
  },
  {
    id: 'style-components-tab',
    route: '/styles/style-1',
    title: 'Linked Components',
    description: 'The Components tab shows all fabrics and trims attached to this style. Test results flow upward from component-level testing into the style\'s overall compliance status.',
    position: 'bottom',
    chapter: 'Style Lifecycle',
    chapterIcon: '👗',
  },
  {
    id: 'style-care-tab',
    route: '/styles/style-1',
    title: 'ISO Care Labels',
    description: 'Each style carries ISO 3758-compliant care symbols — professional vector icons for wash, bleach, dry, iron, and dry clean instructions. These are assigned per product type.',
    position: 'bottom',
    chapter: 'Style Lifecycle',
    chapterIcon: '👗',
  },
  // Chapter 3: Named Routing
  {
    id: 'named-routing',
    route: '/styles/style-1',
    title: 'Step 3: Named Routing',
    description: 'Every style has two named technologist assignments: a Fabric Technologist (responsible for Base-level material testing) and a Garment Technologist (who approves the final Gold Seal Workbook). This ensures clear accountability.',
    position: 'right',
    chapter: 'Named Routing',
    chapterIcon: '👤',
  },
  // Chapter 4: TRF Testing
  {
    id: 'tests-list',
    route: '/tests',
    title: 'Step 4: Test Request Forms',
    description: 'TRFs are the formal test requests that drive the lifecycle forward. Each TRF maps to one of three canonical testing levels: Base (material), Bulk (production), or Garment (final product).',
    position: 'top',
    chapter: 'Testing',
    chapterIcon: '🧪',
  },
  {
    id: 'tests-kanban',
    route: '/tests',
    title: 'Workflow Visibility',
    description: 'Toggle between Table and Kanban views to track TRFs across their workflow stages. SLA indicators show time pressure, and natural-language filters help you find what matters.',
    position: 'bottom',
    chapter: 'Testing',
    chapterIcon: '🧪',
  },
  // Chapter 5: Inspections
  {
    id: 'inspections',
    route: '/inspections',
    title: 'Step 5: AQL Inspections',
    description: 'Inspections follow strict AQL (Acceptable Quality Level) methodology. Final outcomes are binary — Pass or Fail. Workflow states like "Pending Review" track processing stages, not results.',
    position: 'top',
    chapter: 'Inspections',
    chapterIcon: '✅',
  },
  // Chapter 6: Risk & Gold Seal
  {
    id: 'risk',
    route: '/risk-assessment',
    title: 'Step 6: Supplier Risk Assessment',
    description: 'The risk map aggregates inspection pass rates, corrective action response times, and non-conformance history into a weighted composite score per factory. Methodology is fully disclosed.',
    position: 'top',
    chapter: 'Risk & Compliance',
    chapterIcon: '🛡️',
  },
  {
    id: 'gold-seal',
    route: '/',
    title: '🏆 Gold Seal: Journey Complete',
    description: 'From raw fabric through Base, Bulk, and Product testing — with named technologist accountability at every gate — the style earns its Gold Seal approval. That\'s the Fabric-to-Gold-Seal story.',
    position: 'center',
    chapter: 'Gold Seal',
    chapterIcon: '🏆',
  },
];

interface DemoWalkthroughContextType {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  step: WalkthroughStep | null;
  start: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  goToStep: (index: number) => void;
  progress: number;
}

const DemoWalkthroughContext = createContext<DemoWalkthroughContextType | null>(null);

export function useDemoWalkthrough() {
  const ctx = useContext(DemoWalkthroughContext);
  if (!ctx) throw new Error('useDemoWalkthrough must be used within DemoWalkthroughProvider');
  return ctx;
}

export function DemoWalkthroughProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const step = isActive ? WALKTHROUGH_STEPS[currentStep] ?? null : null;
  const totalSteps = WALKTHROUGH_STEPS.length;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  const start = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
  }, []);

  const next = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      stop();
    }
  }, [currentStep, totalSteps, stop]);

  const prev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < totalSteps) {
      setCurrentStep(index);
    }
  }, [totalSteps]);

  return (
    <DemoWalkthroughContext.Provider value={{ isActive, currentStep, totalSteps, step, start, stop, next, prev, goToStep, progress }}>
      {children}
    </DemoWalkthroughContext.Provider>
  );
}
