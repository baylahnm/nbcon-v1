import { create } from 'zustand';
import { supabase } from '@/shared/supabase/client';

// Types matching database schema
interface Payment {
  id: string;
  user_id: string;
  subscription_id?: string;
  amount: number;
  currency: string;
  payment_status: string;
  payment_method?: string;
  description?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

interface Invoice {
  id: string;
  user_id: string;
  subscription_id?: string;
  invoice_number: string;
  amount: number;
  currency: string;
  tax_amount: number;
  total_amount: number;
  invoice_status: string;
  due_date?: string;
  paid_at?: string;
  invoice_url?: string;
  pdf_url?: string;
  created_at: string;
  updated_at: string;
}

interface FinanceStore {
  // State
  payments: Payment[];
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadPayments: () => Promise<void>;
  loadInvoices: () => Promise<void>;
  loadAll: () => Promise<void>;
  clearError: () => void;
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  // Initial state
  payments: [],
  invoices: [],
  isLoading: false,
  error: null,

  // Load payments from database
  loadPayments: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('[Finance] No authenticated user, skipping payment load');
        set({ isLoading: false, payments: [] });
        return;
      }

      // TODO: Regenerate Supabase types to include payments table
      // For now, cast to any to bypass type checking
      const { data, error } = await (supabase as any)
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('[Finance] Error loading payments:', error);
        throw new Error(`Failed to load payments: ${error.message}`);
      }
      
      set({ 
        payments: (data || []) as Payment[], 
        isLoading: false 
      });
      
      console.log(`[Finance] Loaded ${data?.length || 0} payments`);
    } catch (error: any) {
      console.error('[Finance] Exception loading payments:', error);
      set({ 
        error: error.message || 'Failed to load payments', 
        isLoading: false, 
        payments: [] 
      });
    }
  },

  // Load invoices from database
  loadInvoices: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('[Finance] No authenticated user, skipping invoice load');
        return;
      }

      // TODO: Regenerate Supabase types to include invoices table
      const { data, error } = await (supabase as any)
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('[Finance] Error loading invoices:', error);
        throw new Error(`Failed to load invoices: ${error.message}`);
      }
      
      set({ invoices: (data || []) as Invoice[] });
      console.log(`[Finance] Loaded ${data?.length || 0} invoices`);
    } catch (error: any) {
      console.error('[Finance] Exception loading invoices:', error);
      // Don't override main error state, just log
    }
  },

  // Load all financial data
  loadAll: async () => {
    set({ isLoading: true, error: null });
    
    try {
      await Promise.all([
        get().loadPayments(),
        get().loadInvoices()
      ]);
    } catch (error) {
      // Errors already handled in individual loaders
    } finally {
      set({ isLoading: false });
    }
  },

  // Clear error state
  clearError: () => set({ error: null }),
}));

