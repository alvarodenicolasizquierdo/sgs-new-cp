import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  ChevronRight, 
  Clock, 
  TrendingUp,
  FileText,
  Sparkles
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { helpDatabase, HelpItem, searchHelp } from '@/data/helpContent';
import { cn } from '@/lib/utils';

interface InstantSearchDropdownProps {
  onSelectArticle: (article: HelpItem) => void;
  onAskAI?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

// Recent searches (would be persisted in localStorage in production)
const recentSearches = ['TRF status', 'supplier approval', 'inspection types'];

// Trending topics
const trendingTopics = ['Testing workflow', 'New supplier setup', 'Generate reports'];

export function InstantSearchDropdown({ 
  onSelectArticle, 
  onAskAI,
  placeholder = "Search for help...",
  className 
}: InstantSearchDropdownProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Instant search results
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return searchHelp(query).slice(0, 5);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    setIsOpen(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay closing to allow click on dropdown items
    setTimeout(() => {
      if (!isFocused) setIsOpen(false);
    }, 200);
  };

  const handleSelect = (article: HelpItem) => {
    setQuery('');
    setIsOpen(false);
    onSelectArticle(article);
  };

  const handleRecentSearch = (search: string) => {
    setQuery(search);
  };

  const handleAskAI = () => {
    if (onAskAI && query.trim()) {
      onAskAI(query);
      setQuery('');
      setIsOpen(false);
    }
  };

  const showSuggestions = isOpen && !query.trim();
  const showResults = isOpen && query.trim() && searchResults.length > 0;
  const showNoResults = isOpen && query.trim() && searchResults.length === 0;

  return (
    <div className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={e => {
            if (e.key === 'Enter' && query.trim() && onAskAI) {
              handleAskAI();
            }
            if (e.key === 'Escape') {
              setIsOpen(false);
              inputRef.current?.blur();
            }
          }}
          placeholder={placeholder}
          className="pl-10 pr-10 rounded-xl h-11"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {(showSuggestions || showResults || showNoResults) && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {/* Suggestions (when no query) */}
            {showSuggestions && (
              <div className="p-3 space-y-4">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">Recent</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, i) => (
                        <button
                          key={i}
                          onClick={() => handleRecentSearch(search)}
                          className="px-3 py-1.5 text-xs rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending */}
                <div>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">Trending</span>
                  </div>
                  <div className="space-y-1">
                    {trendingTopics.map((topic, i) => (
                      <button
                        key={i}
                        onClick={() => handleRecentSearch(topic)}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors flex items-center justify-between group"
                      >
                        <span>{topic}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {showResults && (
              <div className="divide-y divide-border">
                {searchResults.map((article, i) => (
                  <motion.button
                    key={article.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleSelect(article)}
                    className="w-full text-left p-3 hover:bg-secondary/50 transition-colors group flex items-start gap-3"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{article.question}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {article.answer.replace(/\*\*/g, '').substring(0, 80)}...
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                  </motion.button>
                ))}

                {/* Ask AI option */}
                {onAskAI && (
                  <button
                    onClick={handleAskAI}
                    className="w-full text-left p-3 hover:bg-primary/5 transition-colors group flex items-center gap-3 bg-primary/5"
                  >
                    <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary">
                        Ask Carlos: "{query}"
                      </p>
                      <p className="text-xs text-muted-foreground">Get AI-powered help</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      AI
                    </Badge>
                  </button>
                )}
              </div>
            )}

            {/* No Results */}
            {showNoResults && (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  No articles found for "{query}"
                </p>
                {onAskAI && (
                  <Button onClick={handleAskAI} size="sm" className="rounded-full">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Ask Carlos instead
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
