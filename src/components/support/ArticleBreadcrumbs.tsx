import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  emoji?: string;
  onClick?: () => void;
}

interface ArticleBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function ArticleBreadcrumbs({ items, className }: ArticleBreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center gap-1 text-sm", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          {index > 0 && (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          )}
          {index === 0 && !item.emoji && (
            <Home className="h-3.5 w-3.5 mr-0.5" />
          )}
          {item.emoji && (
            <span className="text-sm mr-0.5">{item.emoji}</span>
          )}
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className={cn(
                "hover:text-primary transition-colors",
                index === items.length - 1 
                  ? "text-foreground font-medium" 
                  : "text-muted-foreground hover:underline"
              )}
            >
              {item.label}
            </button>
          ) : (
            <span
              className={cn(
                index === items.length - 1 
                  ? "text-foreground font-medium" 
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
