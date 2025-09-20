import { create } from "zustand";

export type PaymentType = "invoice" | "milestone" | "escrow" | "payout" | "refund";
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "cancelled" | "disputed";
export type PaymentMethod = "bank_transfer" | "digital_wallet" | "credit_card" | "stc_pay" | "apple_pay";

export interface Payment {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  type: PaymentType;
  status: PaymentStatus;
  method: PaymentMethod;
  createdDate: Date;
  dueDate?: Date;
  escrowReleaseDate?: Date;
  invoiceNumber?: string;
  client: {
    name: string;
    company: string;
    avatar?: string;
  };
  engineer?: {
    name: string;
    sceNumber: string;
    avatar?: string;
  };
  project: {
    id: string;
    title: string;
    location: string;
    phase?: string;
  };
  fees?: {
    platform: number;
    processing: number;
    total: number;
  };
  attachments?: string[];
  notes?: string;
}

export interface PaymentStats {
  total: { amount: number; count: number };
  pending: { amount: number; count: number };
  completed: { amount: number; count: number };
  escrow: { amount: number; count: number };
  thisMonth: { amount: number; count: number };
  lastMonth: { amount: number; count: number };
}

export interface PaymentFilters {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  company: string | undefined;
  types: PaymentType[];
  status: PaymentStatus | undefined;
  amountRange: {
    min: number | null;
    max: number | null;
  };
  searchQuery: string;
}

export interface PaymentsState {
  payments: Payment[];
  paymentStats: PaymentStats;
  filters: PaymentFilters;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<PaymentFilters>) => void;
  loadPayments: () => Promise<void>;
  createInvoice: (payment: Omit<Payment, 'id' | 'createdDate'>) => Promise<void>;
  updatePaymentStatus: (id: string, status: PaymentStatus) => Promise<void>;
  requestPayout: (amount: number) => Promise<void>;
  processRefund: (id: string, amount: number) => Promise<void>;
  exportPayments: (format: 'csv' | 'pdf') => Promise<void>;
}

// Mock data for Saudi engineering projects
const mockPayments: Payment[] = [
  {
    id: "pay_001",
    title: "NEOM Smart City Infrastructure - Phase 1",
    description: "Structural engineering consultation for residential complex",
    amount: 125000,
    currency: "SAR",
    type: "milestone",
    status: "completed",
    method: "bank_transfer",
    createdDate: new Date("2025-01-15"),
    dueDate: new Date("2025-01-30"),
    invoiceNumber: "INV-NEOM-001",
    client: {
      name: "Ahmed Al-Rashid",
      company: "NEOM Development Company",
      avatar: "/avatars/neom.jpg"
    },
    engineer: {
      name: "Dr. Sarah Al-Mansouri",
      sceNumber: "SCE-2019-0456",
      avatar: "/avatars/sarah.jpg"
    },
    project: {
      id: "proj_001",
      title: "NEOM Smart City Infrastructure",
      location: "NEOM, Tabuk Province",
      phase: "Phase 1 - Foundation"
    },
    fees: {
      platform: 6250,
      processing: 500,
      total: 6750
    }
  },
  {
    id: "pay_002",
    title: "Aramco Refinery Safety Audit",
    description: "Comprehensive safety inspection and compliance report",
    amount: 85000,
    currency: "SAR",
    type: "invoice",
    status: "pending",
    method: "bank_transfer",
    createdDate: new Date("2025-01-20"),
    dueDate: new Date("2025-02-05"),
    invoiceNumber: "INV-ARAMCO-002",
    client: {
      name: "Mohammed Al-Sheikh",
      company: "Saudi Aramco",
      avatar: "/avatars/aramco.jpg"
    },
    engineer: {
      name: "Eng. Khalid Al-Zahrani",
      sceNumber: "SCE-2020-1234",
      avatar: "/avatars/khalid.jpg"
    },
    project: {
      id: "proj_002",
      title: "Aramco Refinery Safety Audit",
      location: "Ras Tanura, Eastern Province",
      phase: "Safety Assessment"
    },
    fees: {
      platform: 4250,
      processing: 350,
      total: 4600
    }
  },
  {
    id: "pay_003",
    title: "SABIC Chemical Plant Design",
    description: "Process engineering for new chemical facility",
    amount: 200000,
    currency: "SAR",
    type: "escrow",
    status: "processing",
    method: "bank_transfer",
    createdDate: new Date("2025-01-10"),
    escrowReleaseDate: new Date("2025-02-15"),
    client: {
      name: "Fatima Al-Qahtani",
      company: "SABIC",
      avatar: "/avatars/sabic.jpg"
    },
    engineer: {
      name: "Dr. Omar Al-Mutairi",
      sceNumber: "SCE-2018-0789",
      avatar: "/avatars/omar.jpg"
    },
    project: {
      id: "proj_003",
      title: "SABIC Chemical Plant Design",
      location: "Jubail Industrial City",
      phase: "Design Phase"
    },
    fees: {
      platform: 10000,
      processing: 800,
      total: 10800
    }
  },
  {
    id: "pay_004",
    title: "King Salman Park Landscape Design",
    description: "Environmental engineering for urban park project",
    amount: 75000,
    currency: "SAR",
    type: "milestone",
    status: "completed",
    method: "stc_pay",
    createdDate: new Date("2025-01-05"),
    dueDate: new Date("2025-01-20"),
    invoiceNumber: "INV-KSP-003",
    client: {
      name: "Noura Al-Sudairi",
      company: "Riyadh Development Authority",
      avatar: "/avatars/riyadh.jpg"
    },
    engineer: {
      name: "Eng. Lina Al-Harbi",
      sceNumber: "SCE-2021-0567",
      avatar: "/avatars/lina.jpg"
    },
    project: {
      id: "proj_004",
      title: "King Salman Park",
      location: "Riyadh, Central Province",
      phase: "Landscape Design"
    },
    fees: {
      platform: 3750,
      processing: 300,
      total: 4050
    }
  },
  {
    id: "pay_005",
    title: "Qiddiya Entertainment Complex",
    description: "MEP engineering for theme park infrastructure",
    amount: 150000,
    currency: "SAR",
    type: "escrow",
    status: "held",
    method: "bank_transfer",
    createdDate: new Date("2025-01-12"),
    escrowReleaseDate: new Date("2025-02-28"),
    client: {
      name: "Abdulrahman Al-Rashid",
      company: "Qiddiya Investment Company",
      avatar: "/avatars/qiddiya.jpg"
    },
    engineer: {
      name: "Dr. Majed Al-Ghamdi",
      sceNumber: "SCE-2017-0234",
      avatar: "/avatars/majed.jpg"
    },
    project: {
      id: "proj_005",
      title: "Qiddiya Entertainment Complex",
      location: "Qiddiya, Riyadh Province",
      phase: "Infrastructure Design"
    },
    fees: {
      platform: 7500,
      processing: 600,
      total: 8100
    }
  },
  {
    id: "pay_006",
    title: "Red Sea Project Marine Engineering",
    description: "Coastal engineering for luxury resort development",
    amount: 180000,
    currency: "SAR",
    type: "invoice",
    status: "overdue",
    method: "bank_transfer",
    createdDate: new Date("2024-12-15"),
    dueDate: new Date("2025-01-10"),
    invoiceNumber: "INV-REDSEA-004",
    client: {
      name: "Sultan Al-Sheikh",
      company: "Red Sea Global",
      avatar: "/avatars/redsea.jpg"
    },
    engineer: {
      name: "Eng. Hala Al-Mutlaq",
      sceNumber: "SCE-2019-0890",
      avatar: "/avatars/hala.jpg"
    },
    project: {
      id: "proj_006",
      title: "Red Sea Project",
      location: "Red Sea Coast, Tabuk Province",
      phase: "Marine Infrastructure"
    },
    fees: {
      platform: 9000,
      processing: 720,
      total: 9720
    }
  },
  {
    id: "pay_007",
    title: "PIF Headquarters Building",
    description: "Architectural engineering for corporate headquarters",
    amount: 300000,
    currency: "SAR",
    type: "milestone",
    status: "completed",
    method: "bank_transfer",
    createdDate: new Date("2025-01-08"),
    dueDate: new Date("2025-01-25"),
    invoiceNumber: "INV-PIF-005",
    client: {
      name: "Yasir Al-Rumayyan",
      company: "Public Investment Fund",
      avatar: "/avatars/pif.jpg"
    },
    engineer: {
      name: "Dr. Nasser Al-Dosari",
      sceNumber: "SCE-2016-0123",
      avatar: "/avatars/nasser.jpg"
    },
    project: {
      id: "proj_007",
      title: "PIF Headquarters",
      location: "King Abdullah Financial District, Riyadh",
      phase: "Design & Planning"
    },
    fees: {
      platform: 15000,
      processing: 1200,
      total: 16200
    }
  },
  {
    id: "pay_008",
    title: "Saudi Electric Company Grid Upgrade",
    description: "Electrical engineering for power grid modernization",
    amount: 95000,
    currency: "SAR",
    type: "escrow",
    status: "processing",
    method: "bank_transfer",
    createdDate: new Date("2025-01-18"),
    escrowReleaseDate: new Date("2025-02-20"),
    client: {
      name: "Ibrahim Al-Sheikh",
      company: "Saudi Electricity Company",
      avatar: "/avatars/sec.jpg"
    },
    engineer: {
      name: "Eng. Rana Al-Shehri",
      sceNumber: "SCE-2020-0456",
      avatar: "/avatars/rana.jpg"
    },
    project: {
      id: "proj_008",
      title: "SEC Grid Modernization",
      location: "Multiple Locations, Saudi Arabia",
      phase: "System Upgrade"
    },
    fees: {
      platform: 4750,
      processing: 380,
      total: 5130
    }
  }
];

export const usePaymentsStore = create<PaymentsState>((set, get) => ({
  payments: mockPayments,
  searchQuery: "",
  filters: {
    dateRange: { start: null, end: null },
    company: undefined,
    types: [],
    status: undefined,
    amountRange: { min: null, max: null },
    searchQuery: ""
  },
  paymentStats: {
    total: { amount: 0, count: 0 },
    pending: { amount: 0, count: 0 },
    completed: { amount: 0, count: 0 },
    escrow: { amount: 0, count: 0 },
    thisMonth: { amount: 0, count: 0 },
    lastMonth: { amount: 0, count: 0 }
  },
  loading: false,
  error: null,

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setFilters: (newFilters: Partial<PaymentFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  loadPayments: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const payments = get().payments;
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      
      const stats: PaymentStats = {
        total: {
          amount: payments.reduce((sum, p) => sum + p.amount, 0),
          count: payments.length
        },
        pending: {
          amount: payments
            .filter(p => p.status === "pending")
            .reduce((sum, p) => sum + p.amount, 0),
          count: payments.filter(p => p.status === "pending").length
        },
        completed: {
          amount: payments
            .filter(p => p.status === "completed")
            .reduce((sum, p) => sum + p.amount, 0),
          count: payments.filter(p => p.status === "completed").length
        },
        escrow: {
          amount: payments
            .filter(p => p.type === "escrow")
            .reduce((sum, p) => sum + p.amount, 0),
          count: payments.filter(p => p.type === "escrow").length
        },
        thisMonth: {
          amount: payments
            .filter(p => p.createdDate >= thisMonth)
            .reduce((sum, p) => sum + p.amount, 0),
          count: payments.filter(p => p.createdDate >= thisMonth).length
        },
        lastMonth: {
          amount: payments
            .filter(p => p.createdDate >= lastMonth && p.createdDate < thisMonth)
            .reduce((sum, p) => sum + p.amount, 0),
          count: payments.filter(p => p.createdDate >= lastMonth && p.createdDate < thisMonth).length
        }
      };

      set({ paymentStats: stats, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to load payments" 
      });
    }
  },

  createInvoice: async (paymentData: Omit<Payment, 'id' | 'createdDate'>) => {
    set({ loading: true });
    try {
      const newPayment: Payment = {
        ...paymentData,
        id: `pay_${Date.now()}`,
        createdDate: new Date()
      };
      
      set(state => ({
        payments: [newPayment, ...state.payments],
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to create invoice" 
      });
    }
  },

  updatePaymentStatus: async (id: string, status: PaymentStatus) => {
    set({ loading: true });
    try {
      set(state => ({
        payments: state.payments.map(p => 
          p.id === id ? { ...p, status } : p
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to update payment status" 
      });
    }
  },

  requestPayout: async (amount: number) => {
    set({ loading: true });
    try {
      // Simulate payout request
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to request payout" 
      });
    }
  },

  processRefund: async (id: string, amount: number) => {
    set({ loading: true });
    try {
      // Simulate refund processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to process refund" 
      });
    }
  },

  exportPayments: async (format: 'csv' | 'pdf') => {
    set({ loading: true });
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to export payments" 
      });
    }
  }
}));
