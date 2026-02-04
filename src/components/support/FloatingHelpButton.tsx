import { motion } from 'framer-motion';
import { HelpCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAISupportContext } from '@/contexts/AISupportContext';
import { cn } from '@/lib/utils';

export function FloatingHelpButton() {
  const { isOpen, toggle, messages } = useAISupportContext();
  
  const hasMessages = messages.length > 0;
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        onClick={toggle}
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-300",
          "bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90",
          "hover:shadow-xl hover:scale-105",
          isOpen && "rotate-90"
        )}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <span className="text-xl">×</span>
          ) : hasMessages ? (
            <MessageCircle className="h-6 w-6" />
          ) : (
            <HelpCircle className="h-6 w-6" />
          )}
        </motion.div>
      </Button>
      
      {/* Pulse animation when no messages */}
      {!isOpen && !hasMessages && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-accent"></span>
        </span>
      )}
    </motion.div>
  );
}
