export const analyticsClient = {
  overview: async (_filters:any) => ({ kpis:[], charts:{}, tables:{} }),
  download: async (_kind:"csv"|"pdf", _payload:any) => ({ url:"#"}),
  saveReport: async (_meta:any) => ({ id:"" }),
  loadReport: async (_id:string) => ({ layout:{}, filters:{} }),
  shareSnapshot: async (_id:string, _ttl:number) => ({ url:"#"})
};

