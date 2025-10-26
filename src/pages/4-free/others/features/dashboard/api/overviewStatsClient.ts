import { supabase } from '@/shared/supabase/client';

// Helper to bypass TypeScript types for tables not yet in types.ts
// These tables exist in database but may not be in generated types
const supabaseAny = supabase as any;

export interface OverviewMetrics {
  activeProjects: {
    count: number;
    trend: number; // Percentage change from previous period
    chartData: { month: string; value: number }[];
    breakdown: {
      inProgress: number;
      planning: number;
      avgDuration: number;
      successRate: number;
    };
  };
  totalEngineers: {
    count: number;
    trend: number;
    chartData: { month: string; value: number }[];
    breakdown: {
      structural: number;
      civil: number;
      mechanical: number;
      electrical: number;
      avgRating: number;
      avgHourlyRate: number;
    };
  };
  pendingQuotes: {
    count: number;
    trend: number; // Absolute change from previous period
    chartData: { month: string; value: number }[];
    breakdown: {
      awaitingReview: number;
      underNegotiation: number;
      avgResponseDays: number;
      avgQuoteAmount: number;
    };
  };
  totalSpent: {
    amount: number;
    trend: number;
    chartData: { month: string; value: number }[];
    breakdown: {
      q1: number;
      q2: number;
      q3: number;
      q4Projected: number;
    };
  };
}

/**
 * Fetch overview statistics for client dashboard
 * Aggregates data from multiple tables and calculates trends
 */
export async function fetchOverviewMetrics(userId: string): Promise<OverviewMetrics> {
  try {
    // Parallel fetch all data
    const [
      projectsData,
      engineersData,
      quotesData,
      paymentsData,
    ] = await Promise.all([
      fetchProjectMetrics(userId),
      fetchEngineerMetrics(),
      fetchQuoteMetrics(userId),
      fetchSpendingMetrics(userId),
    ]);

    return {
      activeProjects: projectsData,
      totalEngineers: engineersData,
      pendingQuotes: quotesData,
      totalSpent: paymentsData,
    };
  } catch (error) {
    console.error('Error fetching overview metrics:', error);
    throw error;
  }
}

/**
 * Fetch active projects count and trends
 */
async function fetchProjectMetrics(userId: string) {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session) throw new Error('Not authenticated');

  // Get current active projects
  const { count: activeCount, error: activeError } = await supabaseAny
    .from('client_projects')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', userId)
    .in('project_status', ['active', 'planning']);

  if (activeError) throw activeError;

  // Get monthly project counts for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: monthlyData, error: monthlyError } = await supabaseAny
    .from('client_projects')
    .select('created_at, project_status')
    .eq('client_id', userId)
    .gte('created_at', sixMonthsAgo.toISOString());

  if (monthlyError) throw monthlyError;

  // Aggregate by month
  const chartData = generateMonthlyChartData(monthlyData || [], 'created_at');

  // Calculate trend (compare current month to previous month)
  const currentMonth = chartData[chartData.length - 1]?.value || 0;
  const previousMonth = chartData[chartData.length - 2]?.value || 1;
  const trend = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0;

  // Get breakdown by status
  const { data: statusBreakdown } = await supabaseAny
    .from('client_projects')
    .select('project_status')
    .eq('client_id', userId);

  const inProgress = statusBreakdown?.filter(p => p.project_status === 'active').length || 0;
  const planning = statusBreakdown?.filter(p => p.project_status === 'planning').length || 0;

  return {
    count: activeCount || 0,
    trend: Math.round(trend),
    chartData,
    breakdown: {
      inProgress,
      planning,
      avgDuration: 8, // TODO: Calculate from actual project durations
      successRate: 94, // TODO: Calculate from completed projects
    },
  };
}

/**
 * Fetch engineer metrics
 */
async function fetchEngineerMetrics() {
  // Get total engineers count
  const { count: engineerCount, error: engineerError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'engineer');

  if (engineerError) throw engineerError;

  // Get monthly engineer sign-ups for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: monthlyData, error: monthlyError } = await supabase
    .from('profiles')
    .select('created_at')
    .eq('role', 'engineer')
    .gte('created_at', sixMonthsAgo.toISOString());

  if (monthlyError) throw monthlyError;

  const chartData = generateCumulativeChartData(monthlyData || [], 'created_at', engineerCount || 0);

  const currentMonth = chartData[chartData.length - 1]?.value || 0;
  const previousMonth = chartData[chartData.length - 2]?.value || 1;
  const trend = ((currentMonth - previousMonth) / previousMonth) * 100;

  // Get engineers by specialization
  const { data: engineers } = await supabase
    .from('engineer_profiles')
    .select('specializations');

  const specializationCounts = countSpecializations(engineers || []);

  return {
    count: engineerCount || 0,
    trend: Math.round(trend),
    chartData,
    breakdown: {
      structural: specializationCounts.structural || 0,
      civil: specializationCounts.civil || 0,
      mechanical: specializationCounts.mechanical || 0,
      electrical: specializationCounts.electrical || 0,
      avgRating: 4.8, // TODO: Calculate from ratings table
      avgHourlyRate: 125, // TODO: Calculate from engineer_profiles
    },
  };
}

/**
 * Fetch pending quotes metrics
 * Using open jobs as proxy for pending quotes since job_bids table doesn't exist
 */
async function fetchQuoteMetrics(userId: string) {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session) throw new Error('Not authenticated');

  // Get open jobs (proxy for pending quotes)
  const { data: openJobs, error: jobsError } = await supabaseAny
    .from('jobs')
    .select('*')
    .eq('client_id', userId)
    .eq('job_status', 'open');

  if (jobsError) throw jobsError;

  const pendingCount = openJobs?.length || 0;

  // Get monthly job counts for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: monthlyJobs, error: monthlyError } = await supabaseAny
    .from('jobs')
    .select('created_at, job_status')
    .eq('client_id', userId)
    .gte('created_at', sixMonthsAgo.toISOString());

  if (monthlyError) throw monthlyError;

  const chartData = generateMonthlyChartData(
    (monthlyJobs || []).filter(j => j.job_status === 'open'),
    'created_at'
  );

  // Calculate trend as percentage (compare current month to previous month)
  const currentMonth = chartData[chartData.length - 1]?.value || 0;
  const previousMonth = chartData[chartData.length - 2]?.value || 0;
  const trend = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0;

  // Breakdown (simplified since we don't have bids table)
  const awaitingReview = Math.ceil(pendingCount * 0.6); // Estimate 60% awaiting
  const underNegotiation = pendingCount - awaitingReview;

  return {
    count: pendingCount,
    trend,
    chartData,
    breakdown: {
      awaitingReview,
      underNegotiation,
      avgResponseDays: 2.3, // TODO: Calculate from actual response times
      avgQuoteAmount: 45000, // TODO: Calculate from job budgets
    },
  };
}

/**
 * Fetch spending metrics (YTD)
 */
async function fetchSpendingMetrics(userId: string) {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session) throw new Error('Not authenticated');

  // Get YTD payments
  const currentYear = new Date().getFullYear();
  const yearStart = new Date(currentYear, 0, 1);

  const { data: payments, error: paymentsError } = await supabaseAny
    .from('payments')
    .select('amount, created_at')
    .eq('user_id', userId)
    .eq('payment_status', 'succeeded')
    .gte('created_at', yearStart.toISOString());

  if (paymentsError) throw paymentsError;

  const totalSpent = (payments || []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  // Get last year's total for trend calculation
  const lastYearStart = new Date(currentYear - 1, 0, 1);
  const lastYearEnd = new Date(currentYear - 1, 11, 31);

  const { data: lastYearPayments } = await supabaseAny
    .from('payments')
    .select('amount')
    .eq('user_id', userId)
    .eq('payment_status', 'succeeded')
    .gte('created_at', lastYearStart.toISOString())
    .lte('created_at', lastYearEnd.toISOString());

  const lastYearTotal = (lastYearPayments || []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const trend = lastYearTotal > 0 ? ((totalSpent - lastYearTotal) / lastYearTotal) * 100 : 0;

  // Get monthly spending for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: monthlyPayments, error: monthlyError } = await supabaseAny
    .from('payments')
    .select('amount, created_at')
    .eq('user_id', userId)
    .eq('payment_status', 'succeeded')
    .gte('created_at', sixMonthsAgo.toISOString());

  if (monthlyError) throw monthlyError;

  const chartData = generateMonthlySumChartData(monthlyPayments || []);

  // Calculate quarterly breakdown
  const q1Payments = (payments || []).filter(p => {
    const month = new Date(p.created_at).getMonth();
    return month >= 0 && month <= 2;
  });
  const q2Payments = (payments || []).filter(p => {
    const month = new Date(p.created_at).getMonth();
    return month >= 3 && month <= 5;
  });
  const q3Payments = (payments || []).filter(p => {
    const month = new Date(p.created_at).getMonth();
    return month >= 6 && month <= 8;
  });

  const q1 = q1Payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const q2 = q2Payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const q3 = q3Payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const q4Projected = totalSpent > 0 ? (totalSpent / 3) * 1.15 : 0; // Simple projection

  return {
    amount: totalSpent,
    trend: Math.round(trend),
    chartData,
    breakdown: {
      q1: Math.round(q1 / 1000), // Convert to thousands
      q2: Math.round(q2 / 1000),
      q3: Math.round(q3 / 1000),
      q4Projected: Math.round(q4Projected / 1000),
    },
  };
}

/**
 * Helper: Generate monthly chart data from records
 */
function generateMonthlyChartData(
  records: Array<{ created_at: string }>,
  dateField: string
): Array<{ month: string; value: number }> {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const now = new Date();
  const result: Array<{ month: string; value: number }> = [];

  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(now);
    targetDate.setMonth(now.getMonth() - i);
    const monthName = months[targetDate.getMonth()];
    
    const count = records.filter(r => {
      const recordDate = new Date(r.created_at);
      return recordDate.getMonth() === targetDate.getMonth() &&
             recordDate.getFullYear() === targetDate.getFullYear();
    }).length;

    result.push({ month: monthName, value: count });
  }

  return result;
}

/**
 * Helper: Generate cumulative chart data (for engineer growth)
 */
function generateCumulativeChartData(
  records: Array<{ created_at: string }>,
  dateField: string,
  currentTotal: number
): Array<{ month: string; value: number }> {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const now = new Date();
  const result: Array<{ month: string; value: number }> = [];

  // Calculate base (6 months ago)
  const signupsPerMonth = generateMonthlyChartData(records, dateField);
  
  let cumulative = currentTotal - signupsPerMonth.reduce((sum, m) => sum + m.value, 0);

  for (const monthData of signupsPerMonth) {
    cumulative += monthData.value;
    result.push({ month: monthData.month, value: cumulative });
  }

  return result;
}

/**
 * Helper: Generate monthly sum chart data (for spending)
 */
function generateMonthlySumChartData(
  payments: Array<{ amount: any; created_at: string }>
): Array<{ month: string; value: number }> {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const now = new Date();
  const result: Array<{ month: string; value: number }> = [];

  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(now);
    targetDate.setMonth(now.getMonth() - i);
    const monthName = months[targetDate.getMonth()];
    
    const sum = payments
      .filter(p => {
        const paymentDate = new Date(p.created_at);
        return paymentDate.getMonth() === targetDate.getMonth() &&
               paymentDate.getFullYear() === targetDate.getFullYear();
      })
      .reduce((total, p) => total + (Number(p.amount) || 0), 0);

    result.push({ month: monthName, value: Math.round(sum) });
  }

  return result;
}

/**
 * Helper: Count engineers by specialization
 */
function countSpecializations(engineers: Array<{ specializations?: string[] }>) {
  const counts: Record<string, number> = {
    structural: 0,
    civil: 0,
    mechanical: 0,
    electrical: 0,
  };

  engineers.forEach(eng => {
    if (!eng.specializations) return;
    
    eng.specializations.forEach(spec => {
      const normalized = spec.toLowerCase();
      if (normalized.includes('structural')) counts.structural++;
      else if (normalized.includes('civil')) counts.civil++;
      else if (normalized.includes('mechanical')) counts.mechanical++;
      else if (normalized.includes('electrical')) counts.electrical++;
    });
  });

  return counts;
}

