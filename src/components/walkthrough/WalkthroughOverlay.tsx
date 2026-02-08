import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoWalkthrough } from '@/contexts/DemoWalkthroughContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, X, Play, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WalkthroughOverlay() {
  const { isActive, step, currentStep, totalSteps, next, prev, stop, progress } = useDemoWalkthrough();
  const navigate = useNavigate();
  const location = useLocation();

  // Navigate to the correct route when step changes
  useEffect(() => {
    if (isActive && step && location.pathname !== step.route) {
      navigate(step.route);
    }
  }, [isActive, step, navigate, location.pathname]);

  if (!isActive || !step) return null;

  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;
  const isCenter = step.position === 'center';

  // Determine tooltip position classes
  const positionClasses = {
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    top: 'top-24 left-1/2 -translate-x-1/2',
    bottom: 'bottom-24 left-1/2 -translate-x-1/2',
    left: 'top-1/2 left-72 -translate-y-1/2',
    right: 'top-1/2 right-8 -translate-y-1/2',
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999]"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/30" onClick={stop} />

        {/* Progress bar at top */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <Progress value={progress} className="h-1 rounded-none bg-black/30 [&>div]:bg-primary" />
        </div>

        {/* Step counter & chapter badge at top */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3"
        >
          <span className="bg-primary/90 text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md">
            {step.chapterIcon} {step.chapter}
          </span>
          <span className="text-white/60 text-xs font-medium">
            {currentStep + 1} / {totalSteps}
          </span>
        </motion.div>

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={stop}
          className="absolute top-4 right-4 z-10 text-white/70 hover:text-white hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Tooltip Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={cn(
              'absolute z-10',
              positionClasses[step.position]
            )}
          >
            <div className={cn(
              "bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl",
              isCenter ? "max-w-lg w-[90vw]" : "max-w-md w-[85vw]"
            )}>
              {/* Pointer arrow for non-center positions */}
              {!isCenter && (
                <div className={cn(
                  "absolute w-3 h-3 bg-card/95 border border-border/50 rotate-45",
                  step.position === 'top' && "-bottom-1.5 left-1/2 -translate-x-1/2 border-t-0 border-l-0",
                  step.position === 'bottom' && "-top-1.5 left-1/2 -translate-x-1/2 border-b-0 border-r-0",
                  step.position === 'left' && "-right-1.5 top-1/2 -translate-y-1/2 border-l-0 border-b-0",
                  step.position === 'right' && "-left-1.5 top-1/2 -translate-y-1/2 border-r-0 border-t-0",
                )} />
              )}

              <div className="p-6">
                {/* Title */}
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Footer with navigation */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-muted/30 rounded-b-2xl">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prev}
                    disabled={isFirst}
                    className="text-muted-foreground"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                </div>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        i === currentStep
                          ? "w-6 bg-primary"
                          : i < currentStep
                          ? "w-1.5 bg-primary/40"
                          : "w-1.5 bg-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {isLast ? (
                    <Button size="sm" onClick={stop} className="font-semibold">
                      Finish Tour
                    </Button>
                  ) : (
                    <Button size="sm" onClick={next} className="font-semibold">
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Keyboard hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-xs flex items-center gap-4"
        >
          <span>← → Arrow keys to navigate</span>
          <span>Esc to exit</span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
