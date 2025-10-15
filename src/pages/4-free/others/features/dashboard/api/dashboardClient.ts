// Swap these mocks with real Supabase RPCs later.
type OverviewInput = { role:"engineer"|"client"|"enterprise"|"admin"; [k:string]:unknown };
type OverviewOutput = {
  kpis: any[];
  widgets: any;
};

export async function dashboardOverview(input:OverviewInput): Promise<OverviewOutput> {
  const today = new Date().toISOString().slice(0,10);
  const common = { activity:[{ id:"a1", text:"Checked in at Al Olaya", ts:"1h" }], status:{ state:"ok", message:"All systems operational" } };

  if (input.role==="engineer") {
    return {
      kpis: [
        { key:"nearbyJobs", label:"Nearby Jobs", value:6 },
        { key:"pendingQuotes", label:"Pending Quotes", value:2 },
        { key:"inProgress", label:"In Progress", value:3 },
        { key:"earningsMtd", label:"Earnings (MTD)", value:"SAR 4,350" },
      ],
      widgets: {
        jobsNear:[{ id:"j1", title:"Site inspection (Riyadh)", distanceKm:3.2 }],
        nextMilestones:[{ id:"m1", title:"Phase 1 handover", due:today, amount:2500 }],
        escrow:{ planned:0, in_escrow:12000, in_review:3000, released:9000, disputed:0 },
        earnings:{ pending:1800, available:2200, nextPayout:"2025-02-02" },
        ...common
      }
    };
  }

  if (input.role==="client") {
    return {
      kpis: [
        { key:"activeJobs", label:"Active Jobs", value:4 },
        { key:"awaitingQuotes", label:"Awaiting Quotes", value:5 },
        { key:"inReview", label:"In Review", value:2 },
        { key:"spendMtd", label:"Spend (MTD)", value:"SAR 18,200" },
      ],
      widgets: {
        awaitingQuotes:[{ id:"q1", jobTitle:"Electrical panel upgrade", amount:3200 }],
        nextMilestones:[{ id:"m5", title:"Site visit report", due:today, amount:900 }],
        escrow:{ planned:0, in_escrow:20000, in_review:2000, released:15000, disputed:0 },
        finance:{ invoicesDue:2, overdue:1, paidMtd:42000 },
        compliance:{ sceStatus:"OK", zatcaStatus:"OK", kycStatus:"Pending" },
        ...common
      }
    };
  }

  if (input.role==="enterprise") {
    return {
      kpis: [
        { key:"gmv", label:"GMV", value:"SAR 2.4M", delta:5 },
        { key:"takeRate", label:"Take Rate", value:"12.0%" },
        { key:"onTime", label:"On-time", value:"96%" },
        { key:"utilization", label:"Utilization", value:"78%" },
      ],
      widgets: {
        portfolio:{ projects:[{id:"p1", title:"Metro extension", status:"green"}], statusCounts:{ green:6, amber:1, red:0 } },
        finance:{ invoicesDue:8, overdue:2, paidMtd:320000 },
        workforce:{ teams:[{ name:"Riyadh", utilization:82 }, { name:"Jeddah", utilization:71 }] },
        compliance:{ sceStatus:"OK", zatcaStatus:"OK", kycStatus:"OK" },
        ...common
      }
    };
  }

  return {
    kpis: [
      { key:"dau", label:"DAU", value:"1,842" },
      { key:"tenants", label:"New Tenants", value:12 },
      { key:"revenue", label:"Revenue", value:"SAR 87k" },
      { key:"uptime", label:"Uptime", value:"99.98%" },
    ],
    widgets: { status:{ state:"ok", message:"Healthy" }, activity:[{ id:"a2", text:"Deployed v1.3.2", ts:"10m" }] }
  };
}

// Stubs — replace with Supabase RPCs
export async function quoteAccept(id:string){ console.log("rpc_quote_accept", id); }
export async function escrowRelease(id:string){ console.log("rpc_escrow_release", id); }
export async function recommendEngineers(jobId:string, ids:string[]){ console.log("rpc_recommend_engineers", jobId, ids); }
