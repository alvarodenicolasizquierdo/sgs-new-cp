import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  ChevronRight,
  MessageCircle,
  Mail,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAISupportContext } from '@/contexts/AISupportContext';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface SupportCenterChatProps {
  onEscalate?: (type: 'email' | 'form') => void;
}

export function SupportCenterChat({ onEscalate }: SupportCenterChatProps) {
  const {
    messages,
    isTyping,
    sendMessage,
    contextHelp
  } = useAISupportContext();
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);
  
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
  
  // Check if last message has low confidence
  const lastMessage = messages[messages.length - 1];
  const showEscalationOptions = lastMessage?.role === 'assistant' && lastMessage?.confidence === 'low';
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">Ask Carlos</h3>
          <p className="text-xs text-muted-foreground">AI-powered assistant • Typically replies instantly</p>
        </div>
        <Badge variant="secondary" className="ml-auto text-xs">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5 animate-pulse" />
          Online
        </Badge>
      </div>
      
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          /* Welcome screen with context-aware suggestions */
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-6"
            >
              <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Hi there! 👋</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                I'm Carlos, your AI assistant. I can help you with testing, inspections, 
                suppliers, and navigating SMART Advanced.
              </p>
            </motion.div>
            
            {contextHelp && (
              <>
                {/* Context Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-center"
                >
                  <Badge variant="outline" className="px-3 py-1">
                    📍 You're on: {contextHelp.title}
                  </Badge>
                </motion.div>
                
                {/* Tips */}
                {contextHelp.tips.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">Quick Tips</span>
                    </div>
                    <ul className="space-y-2">
                      {contextHelp.tips.map((tip, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-amber-500 mt-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
                
                <Separator />
                
                {/* Common questions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    Popular questions for this page:
                  </p>
                  <div className="grid gap-2">
                    {contextHelp.commonQuestions.slice(0, 4).map(q => (
                      <button
                        key={q.id}
                        onClick={() => handleQuickQuestion(q.question)}
                        className="w-full text-left p-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-transparent hover:border-primary/20 text-sm flex items-center justify-between group transition-all duration-200"
                      >
                        <span className="line-clamp-1">{q.question}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </div>
        ) : (
          /* Chat messages */
          <div className="space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl p-4 text-sm",
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-secondary rounded-bl-md'
                  )}
                >
                  {message.role === 'assistant' ? (
                    <div className="space-y-2">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                      
                      {/* Confidence indicator */}
                      {message.confidence && (
                        <div className={cn(
                          "flex items-center gap-1.5 pt-2 text-xs",
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
              </motion.div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-secondary rounded-2xl rounded-bl-md p-4">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Escalation options when confidence is low */}
            {showEscalationOptions && !isTyping && onEscalate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4"
              >
                <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
                  Need more help? Connect with our support team:
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => onEscalate('email')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Ticket
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => onEscalate('form')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Support Form
                  </Button>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
      
      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 rounded-xl"
            disabled={isTyping}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!inputValue.trim() || isTyping}
            className="rounded-xl h-10 w-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
