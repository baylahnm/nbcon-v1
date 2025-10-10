import React, { useEffect, useState } from 'react';
import { useInlineDashboardEditStore } from "../../../stores/inlineDashboardEdit";
import { InlineDashboardToolbar } from './InlineDashboardToolbar';
import { Toolbar } from '../../../../../1-HomePage/others/components/toolbar/Toolbar';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Move, X, Save, RotateCcw, Plus } from 'lucide-react';

interface DashboardEditModeProps {
  children: React.ReactNode;
  onSave?: () => void;
  onCancel?: () => void;
}

export const DashboardEditMode: React.FC<DashboardEditModeProps> = ({
  children,
  onSave,
  onCancel
}) => {
  const {
    isEditMode,
    selectedComponent,
    showToolbar,
    toolbarPosition,
    hideToolbar,
    selectComponent,
    setEditMode
  } = useInlineDashboardEditStore();

  // Toolbar state
  const [isToolbarOpen, setIsToolbarOpen] = useState(true);
  const [activeTool, setActiveTool] = useState<string>('select');


  // Handle escape key to exit edit mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isEditMode) {
        handleCancel();
      }
    };

    if (isEditMode) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isEditMode]);

  // Handle click outside to deselect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isEditMode && !(event.target as Element).closest('[data-editable-component]')) {
        selectComponent(null);
        hideToolbar();
      }
    };

    if (isEditMode) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isEditMode, selectComponent, hideToolbar]);

  const handleSave = async () => {
    try {
        onSave?.();
        setEditMode(false);
    } catch (error) {
      console.error('Failed to save dashboard:', error);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    onCancel?.();
  };

  const handleToolSelect = (tool: string) => {
    setActiveTool(tool);
    console.log(`Selected tool: ${tool}`);
    // TODO: Implement tool-specific logic
  };

  const handleAddComponent = (type: string) => {
    console.log(`Adding component: ${type}`);
    // TODO: Implement component addition logic
  };

  const handleEditComponent = (componentId: string) => {
    console.log(`Edit component: ${componentId}`);
    // TODO: Implement component editing logic
  };

  const handleDeleteComponent = (componentId: string) => {
    console.log(`Delete component: ${componentId}`);
    // TODO: Implement component deletion logic
  };

  const handleDuplicateComponent = (componentId: string) => {
    console.log(`Duplicate component: ${componentId}`);
    // TODO: Implement component duplication logic
  };


  return (
    <div className="relative">
      {/* Main Dashboard Content */}
      <div className={isEditMode ? 'select-none' : ''}>
        {children}
      </div>

      {/* Edit Mode Overlay */}
      {isEditMode && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {/* Grid Overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
        </div>
      )}

      {/* Production-Ready Draggable Toolbar */}
      {isEditMode && (
        <Toolbar
          onToolSelect={handleToolSelect}
          onClose={handleCancel}
          isOpen={isToolbarOpen}
          onToggle={() => setIsToolbarOpen(!isToolbarOpen)}
        />
      )}

      {/* Floating Toolbar - Hidden when modal is open */}
      {isEditMode && (
      <InlineDashboardToolbar
        onSave={handleSave}
        onCancel={handleCancel}
        onAddComponent={handleAddComponent}
        onEditComponent={handleEditComponent}
        onDeleteComponent={handleDeleteComponent}
        onDuplicateComponent={handleDuplicateComponent}
      />
      )}
    </div>
  );
};

export default DashboardEditMode;

