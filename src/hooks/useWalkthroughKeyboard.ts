import { useEffect } from 'react';
import { useDemoWalkthrough } from '@/contexts/DemoWalkthroughContext';

export function useWalkthroughKeyboard() {
  const { isActive, next, prev, stop } = useDemoWalkthrough();

  useEffect(() => {
    if (!isActive) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        stop();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isActive, next, prev, stop]);
}
