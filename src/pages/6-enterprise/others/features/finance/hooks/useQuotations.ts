import { useState, useEffect, useCallback } from 'react';
import { Quotation, QuotationFormData, QuotationFilters, QuotationStats } from '../types/quotation';
import { generateQuotationNumber, calculateValidUntil, isExpired } from '../utils/quotationHelpers';

// Mock data for development
const mockQuotations: Quotation[] = [
  {
    id: '1',
    quotationNumber: 'QUO-2025-0001',
    date: '2025-01-15',
    validUntil: '2025-02-14',
    status: 'sent',
    client: {
      name: 'Saudi Aramco',
      address: 'Dhahran, Saudi Arabia',
      email: 'procurement@aramco.com',
      phone: '+966 13 874 0000',
      vatNumber: '300000000000003',
      crNumber: '1010000001',
      placeOfSupply: 'Dhahran',
      countryOfSupply: 'Saudi Arabia'
    },
    company: {
      name: 'NBCon Engineering',
      address: 'Riyadh, Saudi Arabia',
      email: 'info@nbcon.com',
      phone: '+966 11 123 4567',
      vatNumber: '300000000000004',
      crNumber: '1010000002'
    },
    items: [
      {
        id: '1',
        description: 'Structural Engineering Services',
        quantity: 100,
        unit: 'hrs',
        unitPrice: 150,
        total: 15000
      },
      {
        id: '2',
        description: 'Project Management',
        quantity: 40,
        unit: 'hrs',
        unitPrice: 200,
        total: 8000
      }
    ],
    terms: {
      validity: 30,
      paymentTerms: '50% advance, 50% on completion',
      deliveryTerms: 'Delivery within 30 days',
      warranty: '1 year warranty',
      conditions: ['Prices valid for 30 days', 'Payment terms as specified']
    },
    notes: 'This quotation includes all engineering services as specified.',
    theme: {
      headerColor: '#2d5346',
      headerTextColor: '#ffffff',
      tableHeaderColor: '#eeebe8',
      tableTextColor: '#2d5346',
      signatureStampBgColor: '#f3f4f6'
    },
    totalAmount: 26450,
    subtotal: 23000,
    discount: 0,
    taxAmount: 3450,
    currency: 'SAR',
    preparedBy: 'Ahmed Al-Rashid',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    quotationNumber: 'QUO-2025-0002',
    date: '2025-01-20',
    validUntil: '2025-02-19',
    status: 'draft',
    client: {
      name: 'NEOM',
      address: 'Tabuk, Saudi Arabia',
      email: 'projects@neom.com',
      phone: '+966 14 123 4567',
      vatNumber: '300000000000005',
      crNumber: '1010000003'
    },
    company: {
      name: 'NBCon Engineering',
      address: 'Riyadh, Saudi Arabia',
      email: 'info@nbcon.com',
      phone: '+966 11 123 4567',
      vatNumber: '300000000000004',
      crNumber: '1010000002'
    },
    items: [
      {
        id: '1',
        description: 'HVAC Design Services',
        quantity: 80,
        unit: 'hrs',
        unitPrice: 120,
        total: 9600
      }
    ],
    terms: {
      validity: 30,
      paymentTerms: '30% advance, 70% on completion',
      deliveryTerms: 'Delivery within 45 days',
      warranty: '2 years warranty',
      conditions: ['Prices valid for 30 days', 'Payment terms as specified']
    },
    notes: 'HVAC design services for residential complex.',
    theme: {
      headerColor: '#2d5346',
      headerTextColor: '#ffffff',
      tableHeaderColor: '#eeebe8',
      tableTextColor: '#2d5346',
      signatureStampBgColor: '#f3f4f6'
    },
    totalAmount: 11040,
    subtotal: 9600,
    discount: 0,
    taxAmount: 1440,
    currency: 'SAR',
    preparedBy: 'Sarah Al-Zahra',
    createdAt: '2025-01-20T14:30:00Z',
    updatedAt: '2025-01-20T14:30:00Z'
  }
];

export const useQuotations = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize quotations on first load
  useEffect(() => {
    if (quotations.length === 0) {
      setQuotations(mockQuotations);
    }
  }, [quotations.length]);


  // Create new quotation
  const createQuotation = useCallback(async (quotationData: QuotationFormData): Promise<Quotation> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newQuotation: Quotation = {
        id: Date.now().toString(),
        quotationNumber: quotationData.quotationNumber || generateQuotationNumber(quotations.length),
        date: quotationData.date,
        validUntil: quotationData.validUntil,
        status: 'draft',
        client: quotationData.client as any,
        company: quotationData.company as any,
        items: quotationData.items,
        terms: quotationData.terms,
        notes: quotationData.notes,
        theme: quotationData.theme,
        totalAmount: quotationData.items.reduce((sum, item) => sum + item.total, 0),
        subtotal: quotationData.items.reduce((sum, item) => sum + item.total, 0) / 1.15,
        discount: 0,
        taxAmount: quotationData.items.reduce((sum, item) => sum + item.total, 0) * 0.15 / 1.15,
        currency: quotationData.currency,
        preparedBy: quotationData.preparedBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setQuotations(prev => [newQuotation, ...prev]);
      return newQuotation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quotation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [quotations.length]);

  // Update quotation
  const updateQuotation = useCallback(async (id: string, updates: Partial<Quotation>): Promise<Quotation> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedQuotation = quotations.find(q => q.id === id);
      if (!updatedQuotation) {
        throw new Error('Quotation not found');
      }
      
      const newQuotation = {
        ...updatedQuotation,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      setQuotations(prev => prev.map(q => q.id === id ? newQuotation : q));
      return newQuotation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quotation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [quotations]);

  // Delete quotation
  const deleteQuotation = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setQuotations(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete quotation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Duplicate quotation
  const duplicateQuotation = useCallback(async (id: string): Promise<Quotation> => {
    const originalQuotation = quotations.find(q => q.id === id);
    if (!originalQuotation) {
      throw new Error('Quotation not found');
    }
    
    const duplicatedQuotation = {
      ...originalQuotation,
      id: Date.now().toString(),
      quotationNumber: generateQuotationNumber(quotations.length),
      date: new Date().toISOString().split('T')[0],
      validUntil: calculateValidUntil(originalQuotation.terms.validity),
      status: 'draft' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setQuotations(prev => [duplicatedQuotation, ...prev]);
    return duplicatedQuotation;
  }, [quotations]);

  // Update quotation status
  const updateQuotationStatus = useCallback(async (id: string, status: Quotation['status']): Promise<Quotation> => {
    return updateQuotation(id, { status });
  }, [updateQuotation]);

  // Get quotation statistics
  const getQuotationStats = useCallback((): QuotationStats => {
    const total = quotations.length;
    const draft = quotations.filter(q => q.status === 'draft').length;
    const sent = quotations.filter(q => q.status === 'sent').length;
    const accepted = quotations.filter(q => q.status === 'accepted').length;
    const rejected = quotations.filter(q => q.status === 'rejected').length;
    const expired = quotations.filter(q => q.status === 'expired' || isExpired(q.validUntil)).length;
    
    const totalValue = quotations.reduce((sum, q) => sum + q.totalAmount, 0);
    const averageValue = total > 0 ? totalValue / total : 0;
    
    return {
      total,
      draft,
      sent,
      accepted,
      rejected,
      expired,
      totalValue,
      averageValue
    };
  }, [quotations]);

  // Get quotation by ID
  const getQuotationById = useCallback((id: string): Quotation | undefined => {
    return quotations.find(q => q.id === id);
  }, [quotations]);

  return {
    quotations,
    loading,
    error,
    createQuotation,
    updateQuotation,
    deleteQuotation,
    duplicateQuotation,
    updateQuotationStatus,
    getQuotationStats,
    getQuotationById
  };
};
