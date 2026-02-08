import { useDemoMode } from '@/contexts/DemoModeContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const DemoModeToggle = () => {
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Switch
          checked={isDemoMode}
          onCheckedChange={toggleDemoMode}
          id="demo-mode"
        />
        <Label htmlFor="demo-mode" className="text-sm font-medium cursor-pointer">
          Demo
        </Label>
      </div>
      {isDemoMode && (
        <>
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/30 text-xs font-semibold tracking-wide"
          >
            CLIENT VIEW
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              navigate('/');
              toast({ title: 'Demo reset', description: 'Ready for next presentation' });
            }}
            className="text-xs text-muted-foreground h-7 px-2"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </>
      )}
    </div>
  );
};
