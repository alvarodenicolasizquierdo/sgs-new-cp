import React, { createContext, useContext, ReactNode } from 'react';
import { useAISupport } from '@/hooks/useAISupport';

type AISupportContextType = ReturnType<typeof useAISupport>;

const AISupportContext = createContext<AISupportContextType | null>(null);

export function AISupportProvider({ children }: { children: ReactNode }) {
  const aiSupport = useAISupport();
  
  return (
    <AISupportContext.Provider value={aiSupport}>
      {children}
    </AISupportContext.Provider>
  );
}

export function useAISupportContext() {
  const context = useContext(AISupportContext);
  if (!context) {
    throw new Error('useAISupportContext must be used within AISupportProvider');
  }
  return context;
}
