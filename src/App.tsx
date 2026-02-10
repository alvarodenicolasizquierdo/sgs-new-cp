import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initClarityTracking } from "@/utils/clarityTracking";
import { AISupportProvider } from "@/contexts/AISupportContext";
import { DemoWalkthroughProvider } from "@/contexts/DemoWalkthroughContext";
import { DemoModeProvider } from "@/contexts/DemoModeContext";
import { FloatingHelpButton, AIHelpPanel } from "@/components/support";
import { WalkthroughLayer } from "@/components/walkthrough/WalkthroughLayer";
import Index from "./pages/Index";
import Tests from "./pages/Tests";
import TRFDetail from "./pages/TRFDetail";
import TRFCreate from "./pages/TRFCreate";
import Inspections from "./pages/Inspections";
import InspectionDetail from "./pages/InspectionDetail";
import RiskAssessment from "./pages/RiskAssessment";
import Styles from "./pages/Styles";
import StyleDetail from "./pages/StyleDetail";
import StyleCreate from "./pages/StyleCreate";
import Components from "./pages/Components";
import ComponentCreate from "./pages/ComponentCreate";
import SupplierInbox from "./pages/SupplierInbox";
import Suppliers from "./pages/Suppliers";
import SupplierCreate from "./pages/SupplierCreate";
import Insight from "./pages/Insight";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import KnowledgeHub from "./pages/KnowledgeHub";
import SupportAdmin from "./pages/SupportAdmin";
import SupportCenter from "./pages/SupportCenter";


import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initClarityTracking();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AISupportProvider>
          <DemoModeProvider>
          <DemoWalkthroughProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tests" element={<Tests />} />
              <Route path="/tests/new" element={<TRFCreate />} />
              <Route path="/tests/:id" element={<TRFDetail />} />
              <Route path="/inspections" element={<Inspections />} />
              <Route path="/inspections/:id" element={<InspectionDetail />} />
              <Route path="/styles" element={<Styles />} />
              <Route path="/styles/new" element={<StyleCreate />} />
              <Route path="/styles/:id" element={<StyleDetail />} />
              <Route path="/components" element={<Components />} />
              <Route path="/components/new" element={<ComponentCreate />} />
              <Route path="/inbox" element={<SupplierInbox />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/suppliers/new" element={<SupplierCreate />} />
              <Route path="/risk-assessment" element={<RiskAssessment />} />
              <Route path="/analytics" element={<Insight />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<KnowledgeHub />} />
              <Route path="/support" element={<SupportCenter />} />
              <Route path="/support-admin" element={<SupportAdmin />} />
              
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* Walkthrough Layer */}
            <WalkthroughLayer />
            {/* AI Support Layer */}
            <FloatingHelpButton />
            <AIHelpPanel />
          </DemoWalkthroughProvider>
          </DemoModeProvider>
        </AISupportProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
