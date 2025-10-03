import { useState, useCallback, useEffect } from 'react';
import { QuotationFormData, QuotationItem, QuotationTerms, Quotation } from '../types/quotation';
import { calculateQuotationTotals, getDefaultQuotationTerms, getDefaultQuotationTheme, generateQuotationNumber } from '../utils/quotationHelpers';

// Local storage key for quotation builder memory
const QUOTATION_BUILDER_MEMORY_KEY = 'quotation-builder-draft';

// Get default form data
const getDefaultFormData = (): QuotationFormData => {
  const today = new Date();
  const validUntil = new Date(today);
  validUntil.setDate(today.getDate() + 30); // Default 30 days validity
  
  return {
    quotationNumber: '',
    date: today.toISOString().split('T')[0],
    validUntil: validUntil.toISOString().split('T')[0],
    preparedBy: '',
    currency: 'SAR',
    company: {
      name: '',
      address: '',
      email: '',
      phone: '',
      vatNumber: '',
      crNumber: ''
    },
    client: {
      name: '',
      address: '',
      email: '',
      phone: '',
      vatNumber: '',
      crNumber: ''
    },
    items: [],
    terms: getDefaultQuotationTerms(),
    notes: '',
    theme: getDefaultQuotationTheme()
  };
};

// Load saved form data from localStorage
const loadSavedFormData = (): QuotationFormData => {
  try {
    const saved = localStorage.getItem(QUOTATION_BUILDER_MEMORY_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults to ensure all fields exist
      return { ...getDefaultFormData(), ...parsed };
    }
  } catch (error) {
    console.error('Failed to load saved quotation data:', error);
  }
  return getDefaultFormData();
};

// Save form data to localStorage
const saveFormData = (data: QuotationFormData) => {
  try {
    localStorage.setItem(QUOTATION_BUILDER_MEMORY_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save quotation data:', error);
  }
};

export const useQuotationBuilder = () => {
  const [formData, setFormData] = useState<QuotationFormData>(loadSavedFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-save form data to localStorage whenever it changes
  useEffect(() => {
    saveFormData(formData);
  }, [formData]);

  // Update form field
  const updateField = useCallback((field: keyof QuotationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [errors]);

  // Update nested field
  const updateNestedField = useCallback((parent: keyof QuotationFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
    
    // Clear error when nested field is updated
    const errorKey = `${parent}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  }, [errors]);

  // Add new item
  const addItem = useCallback(() => {
    const newItem: QuotationItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unit: 'pcs',
      unitPrice: 0,
      total: 0
    };
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  }, []);

  // Update item
  const updateItem = useCallback((itemId: string, field: keyof QuotationItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          
          // Recalculate total when quantity, unitPrice, or discount changes
          if (field === 'quantity' || field === 'unitPrice' || field === 'discount') {
            const subtotal = updatedItem.quantity * updatedItem.unitPrice;
            const discount = updatedItem.discount || 0;
            updatedItem.total = subtotal - (subtotal * discount / 100);
          }
          
          return updatedItem;
        }
        return item;
      })
    }));
  }, []);

  // Remove item
  const removeItem = useCallback((itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  }, []);

  // Update terms
  const updateTerms = useCallback((field: keyof QuotationTerms, value: any) => {
    setFormData(prev => ({
      ...prev,
      terms: {
        ...prev.terms,
        [field]: value
      }
    }));
  }, []);

  // Add condition
  const addCondition = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      terms: {
        ...prev.terms,
        conditions: [...prev.terms.conditions, '']
      }
    }));
  }, []);

  // Update condition
  const updateCondition = useCallback((index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      terms: {
        ...prev.terms,
        conditions: prev.terms.conditions.map((condition, i) => i === index ? value : condition)
      }
    }));
  }, []);

  // Remove condition
  const removeCondition = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      terms: {
        ...prev.terms,
        conditions: prev.terms.conditions.filter((_, i) => i !== index)
      }
    }));
  }, []);

  // Calculate totals
  const calculatedTotals = calculateQuotationTotals(formData.items, 0, formData.terms.vatRate || 15);
  const totals = {
    subtotal: calculatedTotals.subtotal,
    discount: calculatedTotals.discount,
    tax: calculatedTotals.taxAmount,
    total: calculatedTotals.totalAmount
  };

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.validUntil) {
      newErrors.validUntil = 'Valid until date is required';
    }
    
    if (!formData.preparedBy) {
      newErrors.preparedBy = 'Prepared by is required';
    }
    
    if (!formData.company.name) {
      newErrors['company.name'] = 'Company name is required';
    }
    
    if (!formData.client.name) {
      newErrors['client.name'] = 'Client name is required';
    }
    
    if (formData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    }
    
    formData.items.forEach((item, index) => {
      if (!item.description) {
        newErrors[`items.${index}.description`] = 'Item description is required';
      }
      if (item.quantity <= 0) {
        newErrors[`items.${index}.quantity`] = 'Quantity must be greater than 0';
      }
      if (item.unitPrice < 0) {
        newErrors[`items.${index}.unitPrice`] = 'Unit price cannot be negative';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Validate form for preview (less strict)
  const validateFormForPreview = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.company.name) {
      newErrors['company.name'] = 'Company name is required';
    }
    
    if (!formData.client.name) {
      newErrors['client.name'] = 'Client name is required';
    }
    
    if (formData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    }
    
    formData.items.forEach((item, index) => {
      if (!item.description) {
        newErrors[`items.${index}.description`] = 'Item description is required';
      }
      if (item.quantity <= 0) {
        newErrors[`items.${index}.quantity`] = 'Quantity must be greater than 0';
      }
      if (item.unitPrice < 0) {
        newErrors[`items.${index}.unitPrice`] = 'Unit price cannot be negative';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(getDefaultFormData());
    setErrors({});
    // Clear saved data from localStorage
    localStorage.removeItem(QUOTATION_BUILDER_MEMORY_KEY);
  }, []);

  // Clear saved draft
  const clearDraft = useCallback(() => {
    localStorage.removeItem(QUOTATION_BUILDER_MEMORY_KEY);
  }, []);

  // Load quotation data
  const loadQuotation = useCallback((quotation: QuotationFormData) => {
    setFormData(quotation);
    setErrors({});
  }, []);

  // Transform form data to quotation for preview
  const getPreviewQuotation = useCallback((): Quotation => {
    const quotationNumber = formData.quotationNumber || generateQuotationNumber();
    const now = new Date().toISOString();
    
    return {
      id: 'preview',
      quotationNumber,
      date: formData.date || new Date().toISOString().split('T')[0],
      validUntil: formData.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      client: formData.client as any,
      company: formData.company as any,
      items: formData.items,
      terms: formData.terms,
      notes: formData.notes,
      theme: formData.theme,
      totalAmount: totals.total,
      subtotal: totals.subtotal,
      discount: totals.discount,
      taxAmount: totals.tax,
      currency: formData.currency,
      preparedBy: formData.preparedBy || 'User',
      createdAt: now,
      updatedAt: now
    };
  }, [formData, totals]);

  return {
    formData,
    errors,
    totals,
    updateField,
    updateNestedField,
    addItem,
    updateItem,
    removeItem,
    updateTerms,
    addCondition,
    updateCondition,
    removeCondition,
    validateForm,
    validateFormForPreview,
    getPreviewQuotation,
    resetForm,
    loadQuotation,
    clearDraft
  };
};
