import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardCheck,
  FileText,
  Users,
  Building2,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Calendar,
  Bell,
  LogOut,
  ShieldAlert,
  Package,
  Scissors,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const mainNavItems = [
  { title: "Inbox", url: "/inbox", icon: Bell },
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Styles", url: "/styles", icon: Package },
  { title: "Components", url: "/components", icon: Scissors },
  { title: "Inspections", url: "/inspections", icon: ClipboardCheck },
  { title: "Tests", url: "/tests", icon: FlaskConical },
  { title: "Risk Assessment", url: "/risk-assessment", icon: ShieldAlert },
  { title: "Insight", url: "/analytics", icon: BarChart3 },
];

const managementNavItems = [
  { title: "Suppliers", url: "/suppliers", icon: Building2 },
  { title: "Users", url: "/users", icon: Users },
];

const bottomNavItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help & Support", url: "/help", icon: HelpCircle },
];

interface SidebarNavItemProps {
  item: { title: string; url: string; icon: React.ElementType };
  collapsed: boolean;
}

const SidebarNavItem = ({ item, collapsed }: SidebarNavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === item.url;
  const Icon = item.icon;

  const linkContent = (
    <NavLink
      to={item.url}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
        "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive && "bg-sidebar-accent text-sidebar-primary font-medium",
        collapsed && "justify-center px-2"
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary")} />
      {!collapsed && <span className="truncate">{item.title}</span>}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {item.title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
};

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center h-16 px-4 border-b border-sidebar-border", collapsed && "justify-center px-2")}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold text-sm">SGS</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground text-sm">Testing Portal</span>
              <span className="text-xs text-sidebar-muted">Quality Assurance</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-1">
          {!collapsed && (
            <span className="px-3 text-xs font-medium text-sidebar-muted uppercase tracking-wider">
              Main
            </span>
          )}
          <div className="space-y-0.5 pt-2">
            {mainNavItems.map((item) => (
              <SidebarNavItem key={item.url} item={item} collapsed={collapsed} />
            ))}
          </div>
        </div>

        <Separator className="my-4 bg-sidebar-border" />

        <div className="space-y-1">
          {!collapsed && (
            <span className="px-3 text-xs font-medium text-sidebar-muted uppercase tracking-wider">
              Management
            </span>
          )}
          <div className="space-y-0.5 pt-2">
            {managementNavItems.map((item) => (
              <SidebarNavItem key={item.url} item={item} collapsed={collapsed} />
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        {bottomNavItems.map((item) => (
          <SidebarNavItem key={item.url} item={item} collapsed={collapsed} />
        ))}
        
        {/* Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full mt-2 text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "px-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
