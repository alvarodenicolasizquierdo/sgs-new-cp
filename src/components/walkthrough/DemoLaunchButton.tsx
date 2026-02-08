import { motion } from 'framer-motion';
import { useDemoWalkthrough } from '@/contexts/DemoWalkthroughContext';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

export function DemoLaunchButton() {
  const { isActive, start } = useDemoWalkthrough();

  if (isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 left-6 z-50"
    >
      <Button
        onClick={start}
        size="lg"
        className="rounded-full shadow-lg gap-2 bg-primary hover:bg-primary/90 font-semibold"
      >
        <Play className="h-4 w-4" />
        Guided Demo
      </Button>
    </motion.div>
  );
}
