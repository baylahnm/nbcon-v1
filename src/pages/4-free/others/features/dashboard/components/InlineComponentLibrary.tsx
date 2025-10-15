import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { 
  Bot, 
  Briefcase, 
  DollarSign, 
  CheckSquare, 
  Zap, 
  BarChart3,
  Plus
} from 'lucide-react';
import { useInlineDashboardEditStore } from "../../../stores/inlineDashboardEdit";

interface InlineComponentLibraryProps {
  onAddComponent: (type: string) => void;
  onClose: () => void;
}

const COMPONENT_TYPES = [
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    description: 'Chat with AI for help and guidance',
    icon: Bot,
    color: 'text-blue-600'
  },
  {
    id: 'job-list',
    name: 'Job List',
    description: 'Browse and manage available jobs',
    icon: Briefcase,
    color: 'text-green-600'
  },
  {
    id: 'financial',
    name: 'Financial Overview',
    description: 'View earnings and financial data',
    icon: DollarSign,
    color: 'text-emerald-600'
  },
  {
    id: 'task-list',
    name: 'Task List',
    description: 'Manage your tasks and to-dos',
    icon: CheckSquare,
    color: 'text-orange-600'
  },
  {
    id: 'quick-actions',
    name: 'Quick Actions',
    description: 'Common actions and shortcuts',
    icon: Zap,
    color: 'text-purple-600'
  },
  {
    id: 'chart',
    name: 'Chart',
    description: 'Visualize data with charts',
    icon: BarChart3,
    color: 'text-indigo-600'
  }
];

export const InlineComponentLibrary: React.FC<InlineComponentLibraryProps> = ({
  onAddComponent,
  onClose
}) => {
  const { isEditMode } = useInlineDashboardEditStore();

  if (!isEditMode) {
    return null;
  }

  const handleAddComponent = (type: string) => {
    onAddComponent(type);
    onClose();
  };

  return (
    <Card className="fixed top-4 right-4 w-80 z-50 shadow-xl border-2 border-primary/20 bg-background/95 backdrop-blur-sm">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Add Component</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-3">
          {COMPONENT_TYPES.map((component) => {
            const IconComponent = component.icon;
            return (
              <Button
                key={component.id}
                variant="outline"
                className="h-auto p-4 justify-start text-left hover:bg-muted/50"
                onClick={() => handleAddComponent(component.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className={`w-4 h-4 ${component.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{component.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {component.description}
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default InlineComponentLibrary;

