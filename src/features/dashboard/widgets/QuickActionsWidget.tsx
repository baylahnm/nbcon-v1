import React from 'react';
import { 
  Briefcase, 
  MapPin, 
  Upload, 
  MessageSquare, 
  Calendar, 
  User, 
  Settings,
  Plus,
  FileText,
  DollarSign,
  Target
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Widget } from '../types/widget';
import BaseWidget from './BaseWidget';

interface QuickActionsWidgetProps {
  widget: Widget;
  isEditMode?: boolean;
  onConfigClick?: () => void;
}

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({
  widget,
  isEditMode = false,
  onConfigClick
}) => {
  const config = widget.config;
  const actions = config.actions || [
    { label: 'Browse Jobs', icon: 'Briefcase', link: '/engineer/jobs', color: 'text-blue-600' },
    { label: 'Check In', icon: 'MapPin', link: '/engineer/checkin', color: 'text-green-600' },
    { label: 'Upload', icon: 'Upload', link: '/engineer/upload', color: 'text-purple-600' },
    { label: 'Messages', icon: 'MessageSquare', link: '/engineer/messages', color: 'text-orange-600' },
    { label: 'Calendar', icon: 'Calendar', link: '/engineer/calendar', color: 'text-pink-600' },
    { label: 'Profile', icon: 'User', link: '/engineer/profile', color: 'text-indigo-600' }
  ];

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Briefcase,
      MapPin,
      Upload,
      MessageSquare,
      Calendar,
      User,
      Settings,
      Plus,
      FileText,
      DollarSign,
      Target
    };
    return iconMap[iconName] || Plus;
  };

  const getGridCols = (actionCount: number) => {
    if (actionCount <= 2) return 'grid-cols-2';
    if (actionCount <= 4) return 'grid-cols-2';
    if (actionCount <= 6) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  return (
    <BaseWidget
      widget={widget}
      isEditMode={isEditMode}
      onConfigClick={onConfigClick}
      className="h-full"
    >
      <div className="h-full flex flex-col">
        {/* Actions Grid */}
        <div className={`grid ${getGridCols(actions.length)} gap-3 flex-1`}>
          {actions.map((action, index) => {
            const IconComponent = getIconComponent(action.icon);
            return (
              <Button
                key={index}
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-2 p-2 hover:shadow-md transition-all"
                asChild
              >
                <a href={action.link} className="w-full h-full">
                  <IconComponent className={`w-5 h-5 ${action.color || 'text-primary'}`} />
                  <span className="text-xs font-medium text-center leading-tight">
                    {action.label}
                  </span>
                </a>
              </Button>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-4 pt-3 border-t border-sidebar-border">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-primary">5</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div>
              <div className="text-lg font-bold text-success">12</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-warning">3</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
          </div>
        </div>
      </div>
    </BaseWidget>
  );
};

export default QuickActionsWidget;
