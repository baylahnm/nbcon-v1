import React, { useState } from 'react';
import { useDraggable } from '@/hooks/useDraggable';
import { ToolbarButton } from './ToolbarButton';
import {
  GripHorizontal,
  MousePointer,
  Rows,
  Columns,
  PlusSquare,
  Trash2,
  MoveDiagonal,
  TextCursorInput,
  Square,
  Crosshair,
  RotateCw,
  ZoomIn,
  ZoomOut,
  X,
  ChevronLeft,
  ChevronRight,
  Brush,
  Undo2,
  Save
} from 'lucide-react';

interface ToolbarProps {
  onToolSelect?: (tool: string) => void;
  onClose?: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
  embedded?: boolean; // When true, toolbar is embedded in another container
  onUndo?: () => void;
  onSave?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onToolSelect,
  onClose,
  isOpen = true,
  onToggle,
  embedded = false,
  onUndo,
  onSave
}) => {
  const [activeTool, setActiveTool] = useState<string>('select');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { position, isDragging, dragRef, handleMouseDown } = useDraggable({
    initialPosition: { x: 50, y: 50 },
    bounds: 'window',
    disabled: embedded // Disable dragging when embedded
  });

  const handleToolClick = (tool: string) => {
    setActiveTool(tool);
    onToolSelect?.(tool);
  };

  const handleClose = () => {
    onClose?.();
  };

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    onToggle?.();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={embedded ? undefined : (dragRef as React.RefObject<HTMLDivElement>)}
      className={`
        ${embedded ? 'relative' : 'fixed z-50'} bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg
        transition-all duration-200 select-none
        ${!embedded && isDragging ? 'scale-105 shadow-xl' : 'hover:shadow-md'}
        ${isCollapsed ? 'w-12' : 'w-auto'}
        ${!embedded ? 'max-w-[calc(100vw-1rem)] md:max-w-none' : ''}
      `}
      style={embedded ? {} : {
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={embedded ? undefined : handleMouseDown}
    >
      {/* Drag Handle - Only show when not embedded */}
      {!embedded && (
        <div className="flex items-center justify-between p-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <GripHorizontal className="h-4 w-4 text-muted-foreground" />
            {!isCollapsed && (
              <span className="text-sm font-medium text-foreground">Toolbar</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <ToolbarButton
              icon={X}
              label="Close toolbar"
              onClick={handleClose}
              variant="default"
              size="xs"
            />
          </div>
        </div>
      )}

      {/* Toolbar Content */}
      {!isCollapsed && (
        <div className="p-2">
          {/* Desktop: Horizontal layout */}
          <div className="hidden md:flex items-center gap-1">
            {/* Left Group: Manipulate canvas content */}
            <div className="flex items-center gap-1">
              <ToolbarButton
                icon={MousePointer}
                label="Select"
                onClick={() => handleToolClick('select')}
                isActive={activeTool === 'select'}
              />
              <ToolbarButton
                icon={Rows}
                label="Add row"
                onClick={() => handleToolClick('add-row')}
                isActive={activeTool === 'add-row'}
              />
              <ToolbarButton
                icon={Columns}
                label="Add column"
                onClick={() => handleToolClick('add-column')}
                isActive={activeTool === 'add-column'}
              />
              <ToolbarButton
                icon={PlusSquare}
                label="Add new container"
                onClick={() => handleToolClick('add-component')}
                isActive={activeTool === 'add-component'}
              />
              <ToolbarButton
                icon={Trash2}
                label="Remove component"
                onClick={() => handleToolClick('remove-component')}
                isActive={activeTool === 'remove-component'}
              />
              <ToolbarButton
                icon={MoveDiagonal}
                label="Resize component"
                onClick={() => handleToolClick('resize-component')}
                isActive={activeTool === 'resize-component'}
              />
            </div>

            {/* Separator */}
            <div className="w-px h-8 bg-border mx-2" />

            {/* Middle Group: Undo/Save */}
            <div className="flex items-center gap-1">
              <ToolbarButton
                icon={Undo2}
                label="Undo"
                onClick={() => onUndo?.()}
                isActive={false}
              />
              <ToolbarButton
                icon={Save}
                label="Save"
                onClick={() => onSave?.()}
                isActive={false}
              />
            </div>

            {/* Separator */}
            <div className="w-px h-8 bg-border mx-2" />

            {/* Right Group: Tools on top of canvas */}
            <div className="flex items-center gap-1">
              <ToolbarButton
                icon={TextCursorInput}
                label="Add input"
                onClick={() => handleToolClick('add-input')}
                isActive={activeTool === 'add-input'}
              />
              <ToolbarButton
                icon={Square}
                label="Add button"
                onClick={() => handleToolClick('add-button')}
                isActive={activeTool === 'add-button'}
              />
              <ToolbarButton
                icon={Crosshair}
                label="Centre"
                onClick={() => handleToolClick('centre')}
                isActive={activeTool === 'centre'}
              />
              <ToolbarButton
                icon={RotateCw}
                label="Rotate 90°"
                onClick={() => handleToolClick('rotate-90')}
                isActive={activeTool === 'rotate-90'}
              />
              <ToolbarButton
                icon={ZoomIn}
                label="Zoom in"
                onClick={() => handleToolClick('zoom-in')}
                isActive={activeTool === 'zoom-in'}
              />
              <ToolbarButton
                icon={ZoomOut}
                label="Zoom out"
                onClick={() => handleToolClick('zoom-out')}
                isActive={activeTool === 'zoom-out'}
              />
            </div>
          </div>

          {/* Mobile: Vertical layout */}
          <div className="md:hidden flex flex-col gap-2">
            {/* Row 1: Basic tools */}
            <div className="flex items-center gap-1 flex-wrap">
              <ToolbarButton
                icon={MousePointer}
                label="Select"
                onClick={() => handleToolClick('select')}
                isActive={activeTool === 'select'}
              />
              <ToolbarButton
                icon={Rows}
                label="Add row"
                onClick={() => handleToolClick('add-row')}
                isActive={activeTool === 'add-row'}
              />
              <ToolbarButton
                icon={Columns}
                label="Add column"
                onClick={() => handleToolClick('add-column')}
                isActive={activeTool === 'add-column'}
              />
              <ToolbarButton
                icon={PlusSquare}
                label="Add new container"
                onClick={() => handleToolClick('add-component')}
                isActive={activeTool === 'add-component'}
              />
            </div>

            {/* Row 2: Action tools */}
            <div className="flex items-center gap-1 flex-wrap">
              <ToolbarButton
                icon={Trash2}
                label="Remove component"
                onClick={() => handleToolClick('remove-component')}
                isActive={activeTool === 'remove-component'}
              />
              <ToolbarButton
                icon={MoveDiagonal}
                label="Resize component"
                onClick={() => handleToolClick('resize-component')}
                isActive={activeTool === 'resize-component'}
              />
              <ToolbarButton
                icon={Undo2}
                label="Undo"
                onClick={() => onUndo?.()}
                isActive={false}
              />
              <ToolbarButton
                icon={Save}
                label="Save"
                onClick={() => onSave?.()}
                isActive={false}
              />
            </div>

            {/* Row 3: Input and UI tools */}
            <div className="flex items-center gap-1 flex-wrap">
              <ToolbarButton
                icon={TextCursorInput}
                label="Add input"
                onClick={() => handleToolClick('add-input')}
                isActive={activeTool === 'add-input'}
              />
              <ToolbarButton
                icon={Square}
                label="Add button"
                onClick={() => handleToolClick('add-button')}
                isActive={activeTool === 'add-button'}
              />
              <ToolbarButton
                icon={Crosshair}
                label="Centre"
                onClick={() => handleToolClick('centre')}
                isActive={activeTool === 'centre'}
              />
              <ToolbarButton
                icon={RotateCw}
                label="Rotate 90°"
                onClick={() => handleToolClick('rotate-90')}
                isActive={activeTool === 'rotate-90'}
              />
            </div>

            {/* Row 4: Zoom tools */}
            <div className="flex items-center gap-1 flex-wrap">
              <ToolbarButton
                icon={ZoomIn}
                label="Zoom in"
                onClick={() => handleToolClick('zoom-in')}
                isActive={activeTool === 'zoom-in'}
              />
              <ToolbarButton
                icon={ZoomOut}
                label="Zoom out"
                onClick={() => handleToolClick('zoom-out')}
                isActive={activeTool === 'zoom-out'}
              />
            </div>
          </div>
        </div>
      )}

      {/* Collapsed State */}
      {isCollapsed && (
        <div className="p-2">
          <div className="flex flex-col items-center gap-1">
            <ToolbarButton
              icon={Brush}
              label="Expand toolbar"
              onClick={handleToggle}
              isActive={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};
