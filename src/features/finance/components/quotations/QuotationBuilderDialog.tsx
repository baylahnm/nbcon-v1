import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuotations } from '../../hooks/useQuotations';
import { useQuotationBuilder } from '../../hooks/useQuotationBuilder';
import QuotationBuilder from './QuotationBuilder';
import QuotationPreview from './QuotationPreview';
import { toast } from 'sonner';

interface QuotationBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quotationId?: string;
}

const QuotationBuilderDialog: React.FC<QuotationBuilderDialogProps> = ({
  open,
  onOpenChange,
  quotationId
}) => {
  const { createQuotation, updateQuotation, getQuotationById, quotations } = useQuotations();
  const { formData, validateForm, validateFormForPreview, getPreviewQuotation, resetForm, loadQuotation, clearDraft } = useQuotationBuilder(quotations);
  const [activeTab, setActiveTab] = useState('builder');
  const [isLoading, setIsLoading] = useState(false);

  // Load existing quotation if editing or restore draft if creating new
  React.useEffect(() => {
    if (open && quotationId) {
      const quotation = getQuotationById(quotationId);
      if (quotation) {
        loadQuotation(quotation);
      }
    } else if (open && !quotationId) {
      // Check if there's a saved draft
      const saved = localStorage.getItem('quotation-builder-draft');
      if (saved) {
        try {
          const draftData = JSON.parse(saved);
          // Only restore if there's meaningful data
          if (draftData.company?.name || draftData.client?.name || draftData.items?.length > 0) {
            loadQuotation(draftData);
            toast.info('Draft quotation restored');
          } else {
            resetForm();
          }
        } catch {
          resetForm();
        }
      } else {
        resetForm();
      }
    }
  }, [open, quotationId, getQuotationById, loadQuotation, resetForm]);

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix all errors before saving');
      return;
    }

    setIsLoading(true);
    try {
      if (quotationId) {
        await updateQuotation(quotationId, formData as any);
        toast.success('Quotation updated successfully');
      } else {
        await createQuotation(formData);
        toast.success('Quotation created successfully');
        // Clear the draft after successful creation
        clearDraft();
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save quotation');
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    if (validateFormForPreview()) {
      setActiveTab('preview');
    } else {
      toast.error('Please fill in company name, client name, and add at least one item before previewing');
    }
  };

  const handleExport = () => {
    if (validateForm()) {
      // TODO: Implement PDF export
      toast.success('PDF export functionality coming soon');
    } else {
      toast.error('Please fix all errors before exporting');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setActiveTab('builder');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] w-full h-full overflow-hidden p-0">
        <DialogHeader className="px-4 pt-3">
          <DialogTitle className="text-base">
            {quotationId ? 'Edit Quotation' : 'Create Quotation'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="h-full overflow-hidden">
          <QuotationBuilder
            onSave={handleSave}
            onPreview={handlePreview}
            onExport={handleExport}
            existingQuotations={quotations}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuotationBuilderDialog;
