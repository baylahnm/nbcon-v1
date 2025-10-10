// Financial Types for Engineer Portal
// Phase 1: Financial Command Center

export interface Invoice {
  id: string;
  invoice_number: string;
  engineer_id: string;
  client_id: string;
  client_name: string;
  client_email: string;
  client_address?: string;
  issue_date: string;
  due_date: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  currency: 'SAR' | 'USD' | 'EUR';
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
  payment_terms: string;
  notes?: string;
  items: InvoiceItem[];
  created_at: string;
  updated_at: string;
  paid_at?: string;
  sent_at?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  tax_rate?: number;
}

export interface Expense {
  id: string;
  engineer_id: string;
  amount: number;
  currency: 'SAR' | 'USD' | 'EUR';
  category: ExpenseCategory;
  vendor: string;
  description: string;
  date: string;
  receipt_url?: string;
  is_deductible: boolean;
  is_billable: boolean;
  project_id?: string;
  payment_method: PaymentMethod;
  created_at: string;
}

export type ExpenseCategory = 
  | 'office_supplies'
  | 'software'
  | 'equipment'
  | 'travel'
  | 'meals'
  | 'marketing'
  | 'education'
  | 'insurance'
  | 'taxes'
  | 'utilities'
  | 'rent'
  | 'other';

export type PaymentMethod = 
  | 'bank_transfer'
  | 'credit_card'
  | 'debit_card'
  | 'cash'
  | 'mada'
  | 'stc_pay'
  | 'other';

export interface PaymentRecord {
  id: string;
  invoice_id: string;
  amount: number;
  currency: 'SAR' | 'USD' | 'EUR';
  payment_method: PaymentMethod;
  payment_date: string;
  transaction_id?: string;
  notes?: string;
  created_at: string;
}

export interface TaxReport {
  period_start: string;
  period_end: string;
  total_revenue: number;
  total_expenses: number;
  deductible_expenses: number;
  taxable_income: number;
  vat_collected: number;
  vat_paid: number;
  vat_due: number;
  generated_at: string;
}

export interface FinancialSummary {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  profit_margin: number;
  outstanding_invoices: number;
  overdue_invoices: number;
  paid_invoices: number;
  total_outstanding_amount: number;
  average_payment_time: number; // in days
  period: 'month' | 'quarter' | 'year';
}

export interface RevenueByMonth {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface ExpenseByCategory {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
}

export interface InvoiceStats {
  total: number;
  draft: number;
  sent: number;
  paid: number;
  overdue: number;
  total_amount: number;
  paid_amount: number;
  overdue_amount: number;
}

