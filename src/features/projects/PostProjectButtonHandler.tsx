import React from 'react';
import { Button } from '@/components/ui/button';
import { usePostProjectRouting } from '@/hooks/usePostProjectRouting';
import { ProjectTemplate, MarketplaceTemplate } from '@/types/project';
import { 
  Save, 
  Send, 
  Eye, 
  CheckCircle, 
  ShoppingCart, 
  Plus, 
  X, 
  Grid, 
  List,
  Filter,
  Download
} from 'lucide-react';

interface ButtonHandlerProps {
  type: 'save-draft' | 'submit-project' | 'use-template' | 'preview-template' | 'purchase-template' | 
        'create-from-current' | 'create-new-template' | 'clear-filters' | 'view-mode' | 'quick-filter' |
        'add-item' | 'remove-item' | 'toggle-state' | 'close-modal';
  template?: ProjectTemplate | MarketplaceTemplate;
  aliasId?: string;
  viewMode?: 'grid' | 'list';
  itemId?: string;
  field?: string;
  value?: any;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const PostProjectButtonHandler: React.FC<ButtonHandlerProps> = ({
  type,
  template,
  aliasId,
  viewMode,
  itemId,
  field,
  value,
  disabled,
  className,
  children,
  onClick,
  ...props
}) => {
  const {
    handleSaveDraft,
    handleSubmitProject,
    handleUseTemplate,
    handlePreviewTemplate,
    handlePurchaseTemplate,
    handleCreateFromCurrent,
    handleCreateNewTemplate,
    clearFilters,
    setViewMode,
    handleQuickFilter,
    closeModal,
  } = usePostProjectRouting();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    switch (type) {
      case 'save-draft':
        handleSaveDraft();
        break;
      case 'submit-project':
        handleSubmitProject();
        break;
      case 'use-template':
        if (template) handleUseTemplate(template);
        break;
      case 'preview-template':
        if (template) handlePreviewTemplate(template);
        break;
      case 'purchase-template':
        if (template && 'isFree' in template) handlePurchaseTemplate(template);
        break;
      case 'create-from-current':
        handleCreateFromCurrent();
        break;
      case 'create-new-template':
        handleCreateNewTemplate();
        break;
      case 'clear-filters':
        clearFilters();
        break;
      case 'view-mode':
        if (viewMode) setViewMode(viewMode);
        break;
      case 'quick-filter':
        if (aliasId) handleQuickFilter(aliasId);
        break;
      case 'close-modal':
        closeModal();
        break;
      default:
        console.warn(`Unknown button type: ${type}`);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'save-draft':
        return <Save className="h-4 w-4" />;
      case 'submit-project':
        return <Send className="h-4 w-4" />;
      case 'use-template':
        return <CheckCircle className="h-4 w-4" />;
      case 'preview-template':
        return <Eye className="h-4 w-4" />;
      case 'purchase-template':
        return <ShoppingCart className="h-4 w-4" />;
      case 'create-from-current':
      case 'create-new-template':
        return <Plus className="h-4 w-4" />;
      case 'clear-filters':
        return <X className="h-4 w-4" />;
      case 'view-mode':
        return viewMode === 'grid' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />;
      case 'close-modal':
        return <X className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {getIcon()}
      {children}
    </Button>
  );
};

// Specialized button components for common use cases
export const SaveDraftButton: React.FC<{ disabled?: boolean }> = ({ disabled }) => (
  <PostProjectButtonHandler type="save-draft" disabled={disabled}>
    Save Draft
  </PostProjectButtonHandler>
);

export const SubmitProjectButton: React.FC<{ disabled?: boolean }> = ({ disabled }) => (
  <PostProjectButtonHandler type="submit-project" disabled={disabled}>
    Submit Project
  </PostProjectButtonHandler>
);

export const UseTemplateButton: React.FC<{ 
  template: ProjectTemplate | MarketplaceTemplate;
  disabled?: boolean;
}> = ({ template, disabled }) => (
  <PostProjectButtonHandler type="use-template" template={template} disabled={disabled}>
    Use Template
  </PostProjectButtonHandler>
);

export const PreviewTemplateButton: React.FC<{ 
  template: ProjectTemplate | MarketplaceTemplate;
  disabled?: boolean;
}> = ({ template, disabled }) => (
  <PostProjectButtonHandler type="preview-template" template={template} disabled={disabled}>
    Preview
  </PostProjectButtonHandler>
);

export const PurchaseTemplateButton: React.FC<{ 
  template: MarketplaceTemplate;
  disabled?: boolean;
}> = ({ template, disabled }) => (
  <PostProjectButtonHandler type="purchase-template" template={template} disabled={disabled}>
    {template.isFree ? 'Get Free' : 'Purchase'}
  </PostProjectButtonHandler>
);

export const ViewModeButton: React.FC<{ 
  mode: 'grid' | 'list';
  active?: boolean;
}> = ({ mode, active }) => (
  <PostProjectButtonHandler 
    type="view-mode" 
    viewMode={mode}
    variant={active ? 'default' : 'outline'}
  >
    {mode === 'grid' ? 'Grid' : 'List'}
  </PostProjectButtonHandler>
);

export const ClearFiltersButton: React.FC<{ show?: boolean }> = ({ show = true }) => {
  if (!show) return null;
  
  return (
    <PostProjectButtonHandler type="clear-filters" variant="ghost" size="sm">
      <X className="h-4 w-4 mr-1" />
      Clear Filters
    </PostProjectButtonHandler>
  );
};
