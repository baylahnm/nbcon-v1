import type { RangeKey } from "../store/useFinanceStore";

export const financeClient = {
  // Wire these to Supabase RPCs / Edge later
  overview: async (_args:{ role:"client"|"engineer"; range:RangeKey; filters:any }) => ({ balances:{}, series:[] }),
  listInvoices: async (_args:any) => ({ items:[], total:0, nextPage:false }),
  listEscrows: async (_args:any) => ({ items:[] }),
  payInvoice: async (_id:string) => ({ ok:true }),
  fund: async (_milestoneId:string) => ({ ok:true }),
  release: async (_milestoneId:string) => ({ ok:true }),
  requestPayout: async (_amount?:number) => ({ ok:true }),
  exportCSV: async (_args:any) => ({ url:"#"}),
  exportPDF: async (_args:any) => ({ url:"#"}),
};

