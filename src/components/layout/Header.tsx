import { useState } from "react";
import { Bell, Search, ChevronDown, Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import sgsLogo from "@/assets/sgs-logo.png";
import markAvatar from "@/assets/profiles/mark.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ContextualHelpTooltip } from "@/components/support/ContextualHelpTooltip";
import { HelpDrawer } from "@/components/support/HelpDrawer";
import { DemoModeToggle } from "@/components/DemoModeToggle";
import { InternalOnly } from "@/components/InternalOnly";

export function Header() {
  const [helpDrawerOpen, setHelpDrawerOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
        {/* Logo and Search */}
        <div className="flex items-center gap-6 flex-1 max-w-lg">
          <img 
            src={sgsLogo} 
            alt="SGS Logo" 
            width={65}
            height={32}
            className="h-8 w-auto object-contain flex-shrink-0"
          />
          <ContextualHelpTooltip helpKey="search-input" side="bottom">
            <div className="relative w-full" data-help="search-input">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tests, inspections, suppliers..."
                className="pl-10 bg-secondary/50 border-transparent focus:border-primary focus:bg-background"
              />
            </div>
          </ContextualHelpTooltip>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Demo Mode Toggle */}
          <DemoModeToggle />

          <InternalOnly>
          <ContextualHelpTooltip helpKey="new-test-btn" side="bottom">
            <Button 
              variant="default" 
              size="sm" 
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
              data-help="new-test-btn"
            >
              <Plus className="h-4 w-4" />
              New Test
            </Button>
          </ContextualHelpTooltip>
          </InternalOnly>

          {/* Help Center */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setHelpDrawerOpen(true)}
            className="relative"
          >
            <BookOpen className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <ContextualHelpTooltip helpKey="notifications" side="bottom">
            <Button variant="ghost" size="icon" className="relative" data-help="notifications">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive">
                3
              </Badge>
            </Button>
          </ContextualHelpTooltip>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2 pr-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={markAvatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">MT</AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium">Mark Thompson</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Team Management</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Help Drawer */}
      <HelpDrawer open={helpDrawerOpen} onOpenChange={setHelpDrawerOpen} />
    </>
  );
}
