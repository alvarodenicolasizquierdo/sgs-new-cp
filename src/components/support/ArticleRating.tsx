import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, MessageCircle, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ArticleRatingProps {
  articleId: string;
  onSubmit?: (rating: 'helpful' | 'not_helpful', feedback?: string) => Promise<void>;
  className?: string;
}

type RatingStep = 'initial' | 'feedback' | 'submitted';

const EMOJI_OPTIONS = [
  { emoji: '😀', label: 'Very helpful' },
  { emoji: '🙂', label: 'Helpful' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😕', label: 'Confusing' },
  { emoji: '😞', label: 'Not helpful' },
];

const FEEDBACK_PROMPTS = {
  helpful: [
    'Clear and easy to understand',
    'Solved my problem',
    'Good examples provided',
    'Comprehensive coverage',
  ],
  not_helpful: [
    'Information was outdated',
    'Missing steps or details',
    'Too technical',
    'Didn\'t answer my question',
    'Hard to understand',
  ],
};

export function ArticleRating({ articleId, onSubmit, className }: ArticleRatingProps) {
  const [step, setStep] = useState<RatingStep>('initial');
  const [rating, setRating] = useState<'helpful' | 'not_helpful' | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRating = (type: 'helpful' | 'not_helpful') => {
    setRating(type);
    setStep('feedback');
  };

  const togglePrompt = (prompt: string) => {
    setSelectedPrompts(prev => 
      prev.includes(prompt) 
        ? prev.filter(p => p !== prompt)
        : [...prev, prompt]
    );
  };

  const handleSubmit = async () => {
    if (!rating) return;
    
    setIsSubmitting(true);
    try {
      const feedback = [
        selectedEmoji,
        ...selectedPrompts,
        additionalFeedback
      ].filter(Boolean).join(' | ');
      
      await onSubmit?.(rating, feedback || undefined);
      setStep('submitted');
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (!rating) return;
    onSubmit?.(rating);
    setStep('submitted');
  };

  return (
    <div className={cn("rounded-xl border border-border bg-muted/30 overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        {/* Initial Rating */}
        {step === 'initial' && (
          <motion.div
            key="initial"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Was this article helpful?</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-full hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/30"
                  onClick={() => handleRating('helpful')}
                >
                  <ThumbsUp className="h-4 w-4" />
                  Yes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-full hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/30"
                  onClick={() => handleRating('not_helpful')}
                >
                  <ThumbsDown className="h-4 w-4" />
                  No
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Feedback Form */}
        {step === 'feedback' && rating && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {rating === 'helpful' ? '🎉 Great! Tell us more' : '😔 Sorry to hear that'}
              </p>
              <Button variant="ghost" size="sm" onClick={handleSkip} className="text-xs">
                Skip
              </Button>
            </div>

            {/* Emoji Selection - Slack style */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">How would you rate this article?</p>
              <div className="flex justify-between">
                {EMOJI_OPTIONS.map((option) => (
                  <button
                    key={option.emoji}
                    onClick={() => setSelectedEmoji(option.emoji)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                      selectedEmoji === option.emoji
                        ? "bg-primary/10 scale-110"
                        : "hover:bg-muted"
                    )}
                    title={option.label}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="text-[10px] text-muted-foreground">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Feedback Prompts */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">What applied?</p>
              <div className="flex flex-wrap gap-2">
                {FEEDBACK_PROMPTS[rating].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => togglePrompt(prompt)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs transition-all border",
                      selectedPrompts.includes(prompt)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-primary/50"
                    )}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Feedback */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Anything else? (optional)</p>
              <Textarea
                value={additionalFeedback}
                onChange={(e) => setAdditionalFeedback(e.target.value)}
                placeholder="Tell us how we can improve this article..."
                rows={2}
                maxLength={500}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-2">
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Feedback
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Thank You */}
        {step === 'submitted' && (
          <motion.div
            key="submitted"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3"
            >
              <Check className="h-6 w-6 text-green-500" />
            </motion.div>
            <p className="font-medium">Thank you for your feedback!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your input helps us improve our help content.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
