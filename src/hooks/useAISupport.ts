import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  getContextHelp, 
  searchHelp, 
  getHelpById,
  HelpItem, 
  ContextualHelp 
} from '@/data/helpContent';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  relatedItems?: HelpItem[];
  confidence?: 'high' | 'medium' | 'low';
}

export function useAISupport() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [contextHelp, setContextHelp] = useState<ContextualHelp | null>(null);
  
  // Update context when route changes
  useEffect(() => {
    const help = getContextHelp(location.pathname);
    setContextHelp(help);
  }, [location.pathname]);
  
  // Toggle panel
  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);
  
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  // Send message to AI
  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
    
    // Search for relevant help content
    const results = searchHelp(content);
    
    let responseContent: string;
    let confidence: 'high' | 'medium' | 'low';
    
    if (results.length > 0) {
      // Found relevant content
      const topResult = results[0];
      responseContent = topResult.answer;
      
      // Determine confidence based on match quality
      if (results.length >= 3) {
        confidence = 'high';
      } else if (results.length >= 1) {
        confidence = 'medium';
      } else {
        confidence = 'low';
      }
      
      // Add related questions if available
      if (results.length > 1) {
        responseContent += '\n\n**Related topics:**';
        results.slice(1, 3).forEach(item => {
          responseContent += `\n• ${item.question}`;
        });
      }
    } else {
      // No matching content - low confidence
      confidence = 'low';
      responseContent = "I couldn't find a specific answer to your question in my knowledge base. This might be a specialized topic that requires human assistance.\n\nWould you like to:\n• Rephrase your question\n• Contact our support team";
    }
    
    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}-reply`,
      role: 'assistant',
      content: responseContent,
      timestamp: new Date(),
      relatedItems: results,
      confidence
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
    
    return assistantMessage;
  }, []);
  
  // Ask a predefined question
  const askQuestion = useCallback((helpItemId: string) => {
    const item = getHelpById(helpItemId);
    if (item) {
      sendMessage(item.question);
    }
  }, [sendMessage]);
  
  // Clear chat history
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  return {
    isOpen,
    toggle,
    open,
    close,
    messages,
    isTyping,
    sendMessage,
    askQuestion,
    clearMessages,
    contextHelp,
    currentPath: location.pathname
  };
}
