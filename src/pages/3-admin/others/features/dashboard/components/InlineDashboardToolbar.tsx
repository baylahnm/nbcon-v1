import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Card } from '@/pages/1-HomePage/others/components/ui/card';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Move, 
  Maximize2, 
  Save, 
  X, 
  Settings,
  Copy,
  RotateCcw
} from 'lucide-react';
import { InlineComponentLibrary } from './InlineComponentLibrary';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/pages/1-HomePage/others/components/ui/dropdown-menu';
import { useInlineDashboardEditStore } from '../../../stores/inlineDashboardEdit';
import { Toolbar } from "../../../../../1-HomePage/others/components/toolbar/Toolbar";

interface InlineDashboardToolbarProps {
  onSave?: () => void;
  onCancel?: () => void;
  onAddComponent?: (type: string) => void;
  onEditComponent?: (componentId: string) => void;
  onDeleteComponent?: (componentId: string) => void;
  onDuplicateComponent?: (componentId: string) => void;
}

export const InlineDashboardToolbar: React.FC<InlineDashboardToolbarProps> = ({
  onSave,
  onCancel,
  onAddComponent,
  onEditComponent,
  onDeleteComponent,
  onDuplicateComponent
}) => {
  const {
    isEditMode,
    selectedComponent,
    showToolbar,
    toolbarPosition,
    hideToolbar,
    selectComponent
  } = useInlineDashboardEditStore();

  const [showComponentLibrary, setShowComponentLibrary] = useState(false);
  const [activeTool, setActiveTool] = useState<string>('select');

  const toolbarRef = useRef<HTMLDivElement>(null);

  // Position toolbar
  useEffect(() => {
    if (showToolbar && toolbarRef.current) {
      const toolbar = toolbarRef.current;
      const { x, y } = toolbarPosition;
      
      // Ensure toolbar stays within viewport
      const rect = toolbar.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let adjustedX = x;
      let adjustedY = y;
      
      // Adjust horizontal position
      if (x + rect.width > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 10;
      }
      if (adjustedX < 10) {
        adjustedX = 10;
      }
      
      // Adjust vertical position
      if (y + rect.height > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 10;
      }
      if (adjustedY < 10) {
        adjustedY = 10;
      }
      
      toolbar.style.left = `${adjustedX}px`;
      toolbar.style.top = `${adjustedY}px`;
    }
  }, [showToolbar, toolbarPosition]);

  // Hide toolbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        hideToolbar();
      }
    };

    if (showToolbar) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showToolbar, hideToolbar]);

  if (!isEditMode || !showToolbar) {
    return null;
  }

  const handleAddComponent = (type: string) => {
    onAddComponent?.(type);
    hideToolbar();
  };

  const handleEditComponent = () => {
    if (selectedComponent) {
      onEditComponent?.(selectedComponent);
    }
    hideToolbar();
  };

  const handleDeleteComponent = () => {
    if (selectedComponent) {
      onDeleteComponent?.(selectedComponent);
    }
    hideToolbar();
  };

  const handleDuplicateComponent = () => {
    if (selectedComponent) {
      onDuplicateComponent?.(selectedComponent);
    }
    hideToolbar();
  };

  const handleToolSelect = (tool: string) => {
    setActiveTool(tool);
    console.log(`Selected tool: ${tool}`);
    
    // Handle specific tool actions
    switch (tool) {
      case 'add-component':
        setShowComponentLibrary(true);
        break;
      case 'remove-component':
        if (selectedComponent) {
          handleDeleteComponent();
        }
        break;
      case 'resize-component':
        // TODO: Implement resize mode
        break;
      case 'centre':
        // TODO: Implement center alignment
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Card
        ref={toolbarRef}
        className="fixed z-50 shadow-lg border-2 border-primary/20 bg-background/95 backdrop-blur-sm"
        style={{
          left: toolbarPosition.x,
          top: toolbarPosition.y,
          transform: 'translate(-50%, -100%)',
        }}
      >
        <Toolbar
          onToolSelect={handleToolSelect}
          onClose={onCancel}
          isOpen={true}
          embedded={true}
        />
      </Card>

      {/* Component Library */}
      {showComponentLibrary && (
        <InlineComponentLibrary
          onAddComponent={handleAddComponent}
          onClose={() => setShowComponentLibrary(false)}
        />
      )}
    </>
  );
};

export default InlineDashboardToolbar;

