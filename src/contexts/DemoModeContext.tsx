import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface DemoModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  resetDemo: () => void;
}

const DemoModeContext = createContext<DemoModeContextType | null>(null);

export function useDemoMode() {
  const ctx = useContext(DemoModeContext);
  if (!ctx) throw new Error('useDemoMode must be used within DemoModeProvider');
  return ctx;
}

// Routes visible in Demo Mode — these are the "product" screens
const DEMO_ALLOWED_ROUTES = [
  '/',
  '/inbox',
  '/styles',
  '/components',
  '/inspections',
  '/tests',
  '/risk-assessment',
  '/analytics',
  '/suppliers',
  '/support',
];

// Routes blocked in Demo Mode — admin/dev/internal
const DEMO_BLOCKED_ROUTES = [
  '/settings',
  '/users',
  '/support-admin',
  '/competitive-matrix',
  '/feature-spec',
  '/help',
];

export function isDemoAllowedRoute(pathname: string): boolean {
  return DEMO_ALLOWED_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));
}

export function isDemoBlockedRoute(pathname: string): boolean {
  return DEMO_BLOCKED_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));
}

export { DEMO_ALLOWED_ROUTES, DEMO_BLOCKED_ROUTES };

function DemoRouteGuard({ children }: { children: ReactNode }) {
  const { isDemoMode } = useDemoMode();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDemoMode && isDemoBlockedRoute(location.pathname)) {
      navigate('/', { replace: true });
    }
  }, [isDemoMode, location.pathname, navigate]);

  return <>{children}</>;
}

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(
    () => sessionStorage.getItem('carlos_demo_mode') === 'true'
  );

  const toggleDemoMode = useCallback(() => {
    setIsDemoMode(prev => {
      const next = !prev;
      if (next) {
        sessionStorage.setItem('carlos_demo_mode', 'true');
      } else {
        sessionStorage.removeItem('carlos_demo_mode');
      }
      return next;
    });
  }, []);

  const resetDemo = useCallback(() => {
    window.location.href = '/';
  }, []);

  // Block internal keyboard shortcuts in demo mode
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isDemoMode) return;
      const combo = [
        e.ctrlKey && 'ctrl',
        e.shiftKey && 'shift',
        e.altKey && 'alt',
        e.key.toLowerCase(),
      ].filter(Boolean).join('+');
      const BLOCKED = ['ctrl+shift+d', 'ctrl+shift+i', 'ctrl+shift+a'];
      if (BLOCKED.includes(combo)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isDemoMode]);

  return (
    <DemoModeContext.Provider value={{ isDemoMode, toggleDemoMode, resetDemo }}>
      <DemoRouteGuard>
        {children}
      </DemoRouteGuard>
    </DemoModeContext.Provider>
  );
}
