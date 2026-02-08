import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Style, divisionConfig } from "@/types/style";
import { StyleStatusBadge } from "./StyleStatusBadge";
import { StyleStageBadge } from "./StyleStageBadge";
import { StyleStageProgress } from "./StyleStageProgress";
import { 
  Calendar, 
  Factory, 
  Package, 
  Leaf,
  AlertCircle,
  FileCheck,
  Archive,
} from "lucide-react";
import { format, parseISO, isPast, differenceInDays } from "date-fns";
import { Link } from "react-router-dom";

interface StyleCardProps {
  style: Style;
  className?: string;
}

export function StyleCard({ style, className }: StyleCardProps) {
  const hasSustainableComponents = style.componentIds.length > 0;
  const isGoldSealOverdue = isPast(parseISO(style.goldSealDate));
  
  // Auto-archive countdown: 90-day threshold from updatedAt
  const AUTO_ARCHIVE_DAYS = 90;
  const daysSinceUpdate = differenceInDays(new Date(), parseISO(style.updatedAt));
  const daysUntilArchive = AUTO_ARCHIVE_DAYS - daysSinceUpdate;
  const showArchiveWarning = daysUntilArchive <= 30 && daysUntilArchive > 0 && style.status !== "cancelled";
  return (
    <Link to={`/styles/${style.id}`}>
      <Card 
        className={cn(
          "hover:shadow-card-hover transition-all duration-300 cursor-pointer group border-border/60",
          "border-l-4",
          style.status === "approved" && "border-l-success",
          style.status === "submitted" && "border-l-primary",
          style.status === "pending" && "border-l-warning",
          style.status === "cancelled" && "border-l-destructive",
          className
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-sm text-muted-foreground">
                  {style.tuStyleNo}
                </span>
                <StyleStatusBadge status={style.status} size="sm" />
                <StyleStageBadge stage={style.stage} size="sm" />
              </div>
              <h3 className="font-semibold text-base mt-1 truncate group-hover:text-primary transition-colors">
                {style.description}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {style.designStyleRef} • {style.productColour}
              </p>
            </div>
            
            {style.images[0] && (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img 
                  src={style.images[0].url} 
                  alt={style.description}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-3">
          {/* Stage Progress */}
          <StyleStageProgress currentStage={style.stage} />
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Factory className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{style.factory.name}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="h-4 w-4 flex-shrink-0" />
              <span>{divisionConfig[style.division].label} / {style.department}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span className={cn(isGoldSealOverdue && "text-destructive")}>
                GS: {format(parseISO(style.goldSealDate), "dd MMM yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {style.season}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {style.componentIds.length} components
              </Badge>
            </div>
          </div>
          
          {/* Auto-Archive Countdown [C-19] */}
          {showArchiveWarning && (
            <div className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium",
              daysUntilArchive <= 14 
                ? "bg-destructive/10 text-destructive" 
                : "bg-warning/10 text-warning"
            )}>
              <Archive className="h-3 w-3" />
              Auto-archive in {daysUntilArchive} days
            </div>
          )}

          {/* Technologists */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={style.fabricTech.avatar} />
                <AvatarFallback className="text-xs">
                  {style.fabricTech.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {style.fabricTech.name}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {hasSustainableComponents && (
                <Leaf className="h-4 w-4 text-success" />
              )}
              {isGoldSealOverdue && (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              {style.gswStatus === "submitted" && (
                <FileCheck className="h-4 w-4 text-info" />
              )}
              {style.gswStatus === "approved" && (
                <FileCheck className="h-4 w-4 text-success" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
