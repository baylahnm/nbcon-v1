import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { 
  MoreHorizontal, 
  Settings, 
  Copy, 
  Trash2, 
  Move, 
  Maximize2,
  Minimize2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/pages/1-HomePage/others/components/ui/dropdown-menu';
import { Widget } from '../types/widget';

interface BaseWidgetProps {
  widget: Widget;
  children: React.ReactNode;
  className?: string;
  isEditMode?: boolean;
  onConfigClick?: () => void;
  onResize?: (size: { width: number; height: number }) => void;
}

export const BaseWidget: React.FC<BaseWidgetProps> = ({
  widget,
  children,
  className = '',
  isEditMode = false,
  onConfigClick,
  onResize
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  

  const isSelected = false; // TODO: Implement selection logic

  const handleConfigClick = () => {
    console.log('Config clicked for widget:', widget.id);
    onConfigClick?.();
  };

  const handleDuplicate = () => {
    console.log('Duplicate widget:', widget.id);
    // TODO: Implement duplication logic
  };

  const handleDelete = () => {
    console.log('Delete widget:', widget.id);
    // TODO: Implement deletion logic
  };

  const handleTitleChange = (newTitle: string) => {
    console.log('Update widget title:', widget.id, newTitle);
    // TODO: Implement title update logic
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = widget.position.w;
    const startHeight = widget.position.h;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const newWidth = Math.max(2, startWidth + Math.round(deltaX / 60)); // Assuming 60px per grid unit
      const newHeight = Math.max(1, startHeight + Math.round(deltaY / 60));
      
      onResize?.({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <Card
      className={`
        relative group transition-all duration-200
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
        ${isHovered && isEditMode ? 'shadow-lg' : ''}
        ${className}
      `}
      style={{
        backgroundColor: widget.config.backgroundColor || 'hsl(var(--background))',
        borderColor: widget.config.borderColor || 'hsl(var(--border))',
        borderRadius: widget.config.borderRadius || 8,
        padding: widget.config.padding || 16
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => isEditMode && console.log('Select widget:', widget.id)}
    >
      {/* Widget Header */}
      {widget.config.showTitle !== false && (
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-foreground">
              {widget.title}
            </CardTitle>
            
            {isEditMode && (
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="text-xs">
                  {widget.type}
                </Badge>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleConfigClick}>
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDuplicate}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </CardHeader>
      )}

      {/* Widget Content */}
      <CardContent className="flex-1 p-0">
        <div className="h-full">
          {children}
        </div>
      </CardContent>

      {/* Resize Handle */}
      {isEditMode && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
          onMouseDown={handleResizeStart}
        >
          <div className="w-full h-full bg-primary/20 rounded-tl-lg" />
        </div>
      )}

      {/* Move Handle */}
      {isEditMode && (
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity drag-handle">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 cursor-move"
          >
            <Move className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Selection Indicator */}
      {isSelected && isEditMode && (
        <div className="absolute -top-1 -left-1 -right-1 -bottom-1 border-2 border-primary rounded-lg pointer-events-none" />
      )}
    </Card>
  );
};

export default BaseWidget;

