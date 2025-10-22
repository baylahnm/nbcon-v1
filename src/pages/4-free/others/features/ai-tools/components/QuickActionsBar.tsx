import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Card, CardContent } from '@/pages/1-HomePage/others/components/ui/card';
import { LucideIcon, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  to?: string;
}

interface QuickActionsBarProps {
  actions: QuickAction[];
}

export function QuickActionsBar({ actions }: QuickActionsBarProps) {
  const navigate = useNavigate();

  const handleClick = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.to) {
      navigate(action.to);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-muted/50 to-muted/20 border-border/40">
      <CardContent className="p-4">
        <h3 className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Zap className="h-3.5 w-3.5" />
          QUICK ACTIONS
        </h3>
        <div className="flex flex-wrap gap-2">
          {actions.map((action, idx) => (
            <Button
              key={idx}
              size="sm"
              variant="outline"
              className="h-8 text-xs shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
              onClick={() => handleClick(action)}
            >
              <action.icon className="h-3.5 w-3.5 mr-1.5" />
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

