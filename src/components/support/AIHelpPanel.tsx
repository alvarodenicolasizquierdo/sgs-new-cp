import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  X, 
  Send, 
  MessageCircle, 
  Lightbulb,
  Mail,
  FileText,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAISupportContext } from '@/contexts/AISupportContext';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { EscalationPanel } from './EscalationPanel';

export function AIHelpPanel() {
  const {
    isOpen,
    close,
    messages,
    isTyping,
    sendMessage,
    contextHelp
  } = useAISupportContext();
  
  const [inputValue, setInputValue] = useState('');
  const [showEscalation, setShowEscalation] = useState(false);
  const [escalationType, setEscalationType] = useState<'email' | 'form' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const message = inputValue;
    setInputValue('');
    await sendMessage(message);
  };
  
  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };
  
  const handleEscalate = (type: 'email' | 'form') => {
    setEscalationType(type);
    setShowEscalation(true);
  };
  
  // Check if last message has low confidence
  const lastMessage = messages[messages.length - 1];
  const showEscalationOptions = lastMessage?.role === 'assistant' && lastMessage?.confidence === 'low';
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 right-6 w-96 h-[32rem] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">SMART Support</h3>
                <p className="text-xs text-muted-foreground">AI-powered help</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={close} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Content */}
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              /* Welcome screen with context-aware suggestions */
              <div className="space-y-4">
                {contextHelp && (
                  <>
                    <div className="text-center py-2">
                      <Badge variant="secondary" className="mb-2">
                        {contextHelp.title}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {contextHelp.description}
                      </p>
                    </div>
                    
                    {/* Tips */}
                    {contextHelp.tips.length > 0 && (
                      <div className="bg-accent/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="h-4 w-4 text-amber-500" />
                          <span className="text-xs font-medium">Quick Tips</span>
                        </div>
                        <ul className="space-y-1">
                          {contextHelp.tips.map((tip, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-primary">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <Separator />
                    
                    {/* Common questions */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Common questions for this page:
                      </p>
                      <div className="space-y-2">
                        {contextHelp.commonQuestions.slice(0, 4).map(q => (
                          <button
                            key={q.id}
                            onClick={() => handleQuickQuestion(q.question)}
                            className="w-full text-left p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-sm flex items-center justify-between group transition-colors"
                          >
                            <span className="line-clamp-1">{q.question}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Chat messages */
              <div className="space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-lg p-3 text-sm",
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary'
                      )}
                    >
                      {message.role === 'assistant' ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                          
                          {/* Confidence indicator */}
                          {message.confidence && (
                            <div className={cn(
                              "flex items-center gap-1 mt-2 text-xs",
                              message.confidence === 'high' && 'text-green-600',
                              message.confidence === 'medium' && 'text-amber-600',
                              message.confidence === 'low' && 'text-red-600'
                            )}>
                              {message.confidence === 'high' && <CheckCircle className="h-3 w-3" />}
                              {message.confidence === 'medium' && <Lightbulb className="h-3 w-3" />}
                              {message.confidence === 'low' && <AlertTriangle className="h-3 w-3" />}
                              <span>
                                {message.confidence === 'high' && 'High confidence'}
                                {message.confidence === 'medium' && 'Moderate confidence'}
                                {message.confidence === 'low' && 'I may need more context'}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-secondary rounded-lg p-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Escalation options when confidence is low */}
                {showEscalationOptions && !isTyping && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                    <p className="text-xs text-amber-700 dark:text-amber-400 mb-2">
                      Need more help? Connect with our support team:
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={() => handleEscalate('email')}
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        Email Ticket
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={() => handleEscalate('form')}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Support Form
                      </Button>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
          
          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-border">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button type="submit" size="icon" disabled={!inputValue.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
          
          {/* Escalation Panel */}
          <EscalationPanel
            isOpen={showEscalation}
            onClose={() => {
              setShowEscalation(false);
              setEscalationType(null);
            }}
            type={escalationType}
            context={{
              currentPage: contextHelp?.title || 'Unknown',
              recentMessages: messages.slice(-3).map(m => m.content)
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
