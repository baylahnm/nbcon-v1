export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount?: number;
  total: number;
}

export interface QuotationTerms {
  validity: number; // days
  paymentTerms: string;
  deliveryTerms: string;
  warranty: string;
  conditions: string[];
  vatRate?: number; // percentage
}

export interface QuotationTheme {
  headerColor: string;
  headerTextColor: string;
  tableHeaderColor: string;
  tableTextColor: string;
  signatureStampBgColor: string;
}

export interface ClientInfo {
  name: string;
  address: string;
  email: string;
  phone: string;
  vatNumber?: string;
  crNumber?: string;
  placeOfSupply?: string;
  countryOfSupply?: string;
}

export interface CompanyInfo {
  name: string;
  address: string;
  email: string;
  phone: string;
  vatNumber?: string;
  crNumber?: string;
  logo?: string;
  signature?: string;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  date: string;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  client: ClientInfo;
  company: CompanyInfo;
  items: QuotationItem[];
  terms: QuotationTerms;
  notes: string;
  theme: QuotationTheme;
  totalAmount: number;
  subtotal: number;
  discount: number;
  taxAmount: number;
  currency: string;
  preparedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuotationFormData {
  quotationNumber: string;
  date: string;
  validUntil: string;
  preparedBy: string;
  currency: string;
  company: Partial<CompanyInfo>;
  client: Partial<ClientInfo>;
  items: QuotationItem[];
  terms: QuotationTerms;
  notes: string;
  theme: QuotationTheme;
}

export interface QuotationFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  client?: string;
  amountMin?: number;
  amountMax?: number;
}

export interface QuotationStats {
  total: number;
  draft: number;
  sent: number;
  accepted: number;
  rejected: number;
  expired: number;
  totalValue: number;
  averageValue: number;
}

export type QuotationStatus = Quotation['status'];

export interface QuotationAction {
  type: 'create' | 'update' | 'delete' | 'send' | 'accept' | 'reject';
  quotationId: string;
  data?: Partial<Quotation>;
}
