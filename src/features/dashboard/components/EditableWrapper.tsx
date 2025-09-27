import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  GripVertical, 
  Maximize2, 
  Edit, 
  Trash2, 
  Settings,
  Move
} from 'lucide-react';
import { useInlineDashboardEditStore } from '@/stores/inlineDashboardEdit';
import { cn } from '@/lib/utils';

interface EditableWrapperProps {
  children: React.ReactNode;
  componentId: string;
  componentType: string;
  className?: string;
  onEdit?: (componentId: string) => void;
  onDelete?: (componentId: string) => void;
  onDuplicate?: (componentId: string) => void;
  onMove?: (componentId: string) => void;
  onResize?: (componentId: string) => void;
}

export const EditableWrapper: React.FC<EditableWrapperProps> = ({
  children,
  componentId,
  componentType,
  className,
  onEdit,
  onDelete,
  onDuplicate,
  onMove,
  onResize
}) => {
  const {
    isEditMode,
    selectedComponent,
    isDragging,
    selectComponent,
    showToolbarAt,
    setDragging
  } = useInlineDashboardEditStore();

  const [isHovered, setIsHovered] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isSelected = selectedComponent === componentId;
  const showControls = isEditMode && (isSelected || isHovered);

  const handleMouseEnter = () => {
    if (isEditMode) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (isEditMode) {
      setIsHovered(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.stopPropagation();
      selectComponent(componentId);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.preventDefault();
      e.stopPropagation();
      
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (rect) {
        showToolbarAt(
          rect.left + rect.width / 2,
          rect.top
        );
      }
    }
  };

  const handleDragStart = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStartPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      
      setDragging(true, {
        componentId,
        componentType,
        width: rect.width,
        height: rect.height,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top
      });
    }
  };

  const handleDragEnd = () => {
    setDragging(false);
    setDragStartPos(null);
  };

  const handleEdit = () => {
    onEdit?.(componentId);
  };

  const handleDelete = () => {
    onDelete?.(componentId);
  };

  const handleDuplicate = () => {
    onDuplicate?.(componentId);
  };

  const handleMove = () => {
    onMove?.(componentId);
  };

  const handleResize = () => {
    onResize?.(componentId);
  };

  return (
    <div
      ref={wrapperRef}
      className={cn(
        'relative group',
        isEditMode && 'cursor-pointer',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {/* Main Content */}
      <div className={cn(
        'transition-all duration-200',
        isEditMode && isHovered && 'shadow-lg',
        isEditMode && isSelected && 'shadow-xl'
      )}>
        {children}
      </div>

      {/* Edit Mode Overlay */}
      {isEditMode && (
        <div className={cn(
          'absolute inset-0 pointer-events-none transition-opacity duration-200',
          showControls ? 'opacity-100' : 'opacity-0'
        )}>
          {/* Selection Border */}
          {isSelected && (
            <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none" />
          )}

          {/* Control Buttons */}
          <div className="absolute -top-2 -right-2 flex gap-1 pointer-events-auto">
            {/* Drag Handle */}
            <Button
              variant="secondary"
              size="sm"
              className="h-6 w-6 p-0 shadow-md"
              onMouseDown={handleDragStart}
              onMouseUp={handleDragEnd}
              title="Drag to move"
            >
              <GripVertical className="w-3 h-3" />
            </Button>

            {/* Edit Button */}
            <Button
              variant="secondary"
              size="sm"
              className="h-6 w-6 p-0 shadow-md"
              onClick={handleEdit}
              title="Edit component"
            >
              <Edit className="w-3 h-3" />
            </Button>

            {/* Settings Button */}
            <Button
              variant="secondary"
              size="sm"
              className="h-6 w-6 p-0 shadow-md"
              onClick={handleContextMenu}
              title="More options"
            >
              <Settings className="w-3 h-3" />
            </Button>
          </div>

          {/* Resize Handle */}
          {isSelected && (
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize pointer-events-auto"
              onMouseDown={handleResize}
              title="Resize component"
            >
              <div className="absolute bottom-1 right-1 w-2 h-2 bg-primary rounded-sm" />
            </div>
          )}

          {/* Component Type Label */}
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded shadow-md pointer-events-none">
            {componentType}
          </div>
        </div>
      )}

      {/* Drag Preview */}
      {isDragging && dragStartPos && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: dragStartPos.x,
            top: dragStartPos.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Card className="p-4 shadow-xl border-2 border-primary bg-background/95 backdrop-blur-sm">
            <div className="text-sm font-medium text-primary">
              {componentType}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EditableWrapper;
