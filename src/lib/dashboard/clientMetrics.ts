/**
 * Client Dashboard Metrics API
 * 
 * Fetches live overview statistics from Supabase for client dashboard
 * Includes caching, error handling, and zod validation
 * 
 * @module lib/dashboard/clientMetrics
 * @version 1.0.0
 * @created January 28, 2025
 */

import { supabase } from '@/shared/supabase/client';
import { z } from 'zod';

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

/**
 * Chart data point schema
 */
const ChartDataPointSchema = z.object({
  month: z.string(),
  value: z.number(),
});

/**
 * Overview metrics schema for validation
 */
const OverviewMetricsSchema = z.object({
  activeProjects: z.object({
    count: z.number(),
    trend: z.number(),
    chartData: z.array(ChartDataPointSchema),
    breakdown: z.object({
      inProgress: z.number(),
      planning: z.number(),
      avgDuration: z.number(),
      successRate: z.number(),
    }),
  }),
  totalEngineers: z.object({
    count: z.number(),
    trend: z.number(),
    chartData: z.array(ChartDataPointSchema),
    breakdown: z.object({
      structural: z.number(),
      civil: z.number(),
      mechanical: z.number(),
      electrical: z.number(),
      avgRating: z.number(),
      avgHourlyRate: z.number(),
    }),
  }),
  pendingQuotes: z.object({
    count: z.number(),
    trend: z.number(),
    chartData: z.array(ChartDataPointSchema),
    breakdown: z.object({
      awaitingReview: z.number(),
      underNegotiation: z.number(),
      avgResponseDays: z.number(),
      avgQuoteAmount: z.number(),
    }),
  }),
  totalSpent: z.object({
    amount: z.number(),
    trend: z.number(),
    chartData: z.array(ChartDataPointSchema),
    breakdown: z.object({
      q1: z.number(),
      q2: z.number(),
      q3: z.number(),
      q4Projected: z.number(),
    }),
  }),
});

// ============================================================================
// TYPES
// ============================================================================

export type OverviewMetrics = z.infer<typeof OverviewMetricsSchema>;
export type ChartDataPoint = z.infer<typeof ChartDataPointSchema>;

// Helper to bypass TypeScript types for tables not yet in types.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabaseAny = supabase as any;

// ============================================================================
// CACHING
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

const metricsCache = new Map<string, CacheEntry<OverviewMetrics>>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached metrics if still valid
 */
function getCachedMetrics(userId: string): OverviewMetrics | null {
  const cached = metricsCache.get(userId);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > cached.ttl) {
    metricsCache.delete(userId);
    return null;
  }
  
  return cached.data;
}

/**
 * Cache metrics
 */
function cacheMetrics(userId: string, metrics: OverviewMetrics): void {
  metricsCache.set(userId, {
    data: metrics,
    timestamp: Date.now(),
    ttl: CACHE_TTL,
  });
}

// ============================================================================
// MAIN API FUNCTION
// ============================================================================

/**
 * Fetch overview statistics for client dashboard
 * 
 * Aggregates data from multiple tables and calculates trends.
 * Results are cached for 5 minutes to reduce database load.
 * 
 * @param userId - User ID to fetch metrics for
 * @returns Overview metrics with trends and breakdowns
 * @throws Error if not authenticated or database query fails
 * 
 * @example
 * ```typescript
 * const metrics = await fetchOverviewMetrics('user-123');
 * console.log(`Active projects: ${metrics.activeProjects.count}`);
 * ```
 */
export async function fetchOverviewMetrics(userId: string): Promise<OverviewMetrics> {
  try {
    // Check cache first
    const cached = getCachedMetrics(userId);
    if (cached) {
      console.log('[ClientMetrics] Returning cached metrics');
      return cached;
    }

    console.log('[ClientMetrics] Fetching fresh metrics from Supabase');

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

    const metrics: OverviewMetrics = {
      activeProjects: projectsData,
      totalEngineers: engineersData,
      pendingQuotes: quotesData,
      totalSpent: paymentsData,
    };

    // Validate with zod
    const validated = OverviewMetricsSchema.parse(metrics);

    // Cache for future requests
    cacheMetrics(userId, validated);

    return validated;
  } catch (error) {
    console.error('[ClientMetrics] Error fetching overview metrics:', error);
    throw error;
  }
}

// ============================================================================
// METRIC FETCHERS
// ============================================================================

/**
 * Fetch active projects count and trends
 */
async function fetchProjectMetrics(userId: string) {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session) throw new Error('Not authenticated');

  // Try both client_projects and gantt_projects (use gantt_projects as primary source)
  const { count: activeCount, error: activeError } = await supabaseAny
    .from('gantt_projects')
    .select('*', { count: 'exact', head: true })
    .eq('created_by', userId)
    .in('status', ['active', 'planning']);

  if (activeError) {
    console.warn('[ClientMetrics] gantt_projects query failed, trying client_projects', activeError);
    // Fallback to client_projects
    const { count: fallbackCount } = await supabaseAny
      .from('client_projects')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', userId)
      .in('project_status', ['active', 'planning']);
    
    return {
      count: fallbackCount || 0,
      trend: 0,
      chartData: generateEmptyChartData(),
      breakdown: {
        inProgress: 0,
        planning: 0,
        avgDuration: 8,
        successRate: 94,
      },
    };
  }

  // Get monthly project counts for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: monthlyData, error: monthlyError } = await supabaseAny
    .from('gantt_projects')
    .select('created_at, status')
    .eq('created_by', userId)
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
    .from('gantt_projects')
    .select('status')
    .eq('created_by', userId);

  const inProgress = statusBreakdown?.filter((p: { status: string }) => p.status === 'active').length || 0;
  const planning = statusBreakdown?.filter((p: { status: string }) => p.status === 'planning').length || 0;

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
 * Using open jobs as proxy for pending quotes
 */
async function fetchQuoteMetrics(userId: string) {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session) throw new Error('Not authenticated');

  // Get open jobs (proxy for pending quotes)
  const { data: openJobs, error: jobsError } = await supabaseAny
    .from('jobs')
    .select('*')
    .eq('client_id', userId)
    .eq('status', 'open'); // Updated from job_status to status

  if (jobsError) {
    console.warn('[ClientMetrics] jobs query failed:', jobsError);
    return {
      count: 0,
      trend: 0,
      chartData: generateEmptyChartData(),
      breakdown: {
        awaitingReview: 0,
        underNegotiation: 0,
        avgResponseDays: 2.3,
        avgQuoteAmount: 45000,
      },
    };
  }

  const pendingCount = openJobs?.length || 0;

  // Get monthly job counts for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: monthlyJobs, error: monthlyError } = await supabaseAny
    .from('jobs')
    .select('created_at, status')
    .eq('client_id', userId)
    .gte('created_at', sixMonthsAgo.toISOString());

  if (monthlyError) throw monthlyError;

  type JobRecord = { status: string; created_at: string };
  const chartData = generateMonthlyChartData(
    (monthlyJobs || []).filter((j: JobRecord) => j.status === 'open'),
    'created_at'
  );

  // Calculate trend
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
    .eq('status', 'succeeded') // Updated from payment_status to status
    .gte('created_at', yearStart.toISOString());

  if (paymentsError) {
    console.warn('[ClientMetrics] payments query failed:', paymentsError);
    return {
      amount: 0,
      trend: 0,
      chartData: generateEmptyChartData(),
      breakdown: {
        q1: 0,
        q2: 0,
        q3: 0,
        q4Projected: 0,
      },
    };
  }

  const totalSpent = (payments || []).reduce((sum: number, p: { amount: number | string }) => sum + (Number(p.amount) || 0), 0);

  // Get last year's total for trend calculation
  const lastYearStart = new Date(currentYear - 1, 0, 1);
  const lastYearEnd = new Date(currentYear - 1, 11, 31);

  const { data: lastYearPayments } = await supabaseAny
    .from('payments')
    .select('amount')
    .eq('user_id', userId)
    .eq('status', 'succeeded')
    .gte('created_at', lastYearStart.toISOString())
    .lte('created_at', lastYearEnd.toISOString());

  const lastYearTotal = (lastYearPayments || []).reduce((sum: number, p: { amount: number | string }) => sum + (Number(p.amount) || 0), 0);
  const trend = lastYearTotal > 0 ? ((totalSpent - lastYearTotal) / lastYearTotal) * 100 : 0;

  // Get monthly spending for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: monthlyPayments, error: monthlyError } = await supabaseAny
    .from('payments')
    .select('amount, created_at')
    .eq('user_id', userId)
    .eq('status', 'succeeded')
    .gte('created_at', sixMonthsAgo.toISOString());

  if (monthlyError) throw monthlyError;

  const chartData = generateMonthlySumChartData(monthlyPayments || []);

  // Calculate quarterly breakdown
  type PaymentRecord = { amount: number | string; created_at: string };
  
  const q1Payments = (payments || []).filter((p: PaymentRecord) => {
    const month = new Date(p.created_at).getMonth();
    return month >= 0 && month <= 2;
  });
  const q2Payments = (payments || []).filter((p: PaymentRecord) => {
    const month = new Date(p.created_at).getMonth();
    return month >= 3 && month <= 5;
  });
  const q3Payments = (payments || []).filter((p: PaymentRecord) => {
    const month = new Date(p.created_at).getMonth();
    return month >= 6 && month <= 8;
  });

  const q1 = q1Payments.reduce((sum: number, p: PaymentRecord) => sum + (Number(p.amount) || 0), 0);
  const q2 = q2Payments.reduce((sum: number, p: PaymentRecord) => sum + (Number(p.amount) || 0), 0);
  const q3 = q3Payments.reduce((sum: number, p: PaymentRecord) => sum + (Number(p.amount) || 0), 0);
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

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate empty chart data (6 months of zeros)
 */
function generateEmptyChartData(): ChartDataPoint[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const result: ChartDataPoint[] = [];

  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(now);
    targetDate.setMonth(now.getMonth() - i);
    const monthName = months[targetDate.getMonth()];
    result.push({ month: monthName, value: 0 });
  }

  return result;
}

/**
 * Generate monthly chart data from records
 * 
 * @param records - Array of database records with timestamps
 * @param dateField - Field name containing timestamp
 * @returns Array of {month, value} for last 6 months
 */
function generateMonthlyChartData(
  records: Array<{ created_at: string }>,
  dateField: string
): ChartDataPoint[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const result: ChartDataPoint[] = [];

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
 * Generate cumulative chart data (for engineer growth)
 * 
 * @param records - Array of database records
 * @param dateField - Field name containing timestamp
 * @param currentTotal - Current total count
 * @returns Cumulative growth chart data
 */
function generateCumulativeChartData(
  records: Array<{ created_at: string }>,
  dateField: string,
  currentTotal: number
): ChartDataPoint[] {
  const signupsPerMonth = generateMonthlyChartData(records, dateField);
  
  // Calculate starting point (6 months ago)
  let cumulative = currentTotal - signupsPerMonth.reduce((sum, m) => sum + m.value, 0);

  const result: ChartDataPoint[] = [];
  for (const monthData of signupsPerMonth) {
    cumulative += monthData.value;
    result.push({ month: monthData.month, value: cumulative });
  }

  return result;
}

/**
 * Generate monthly sum chart data (for spending)
 * 
 * @param payments - Array of payment records
 * @returns Monthly spending totals
 */
function generateMonthlySumChartData(
  payments: Array<{ amount: number | string; created_at: string }>
): ChartDataPoint[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const result: ChartDataPoint[] = [];

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
 * Count engineers by specialization
 * 
 * @param engineers - Array of engineer profiles
 * @returns Counts by specialization category
 */
function countSpecializations(engineers: Array<{ specializations?: string[] }>): {
  structural: number;
  civil: number;
  mechanical: number;
  electrical: number;
} {
  const counts = {
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

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

/**
 * Clear metrics cache for specific user
 */
export function clearMetricsCache(userId: string): void {
  metricsCache.delete(userId);
  console.log(`[ClientMetrics] Cache cleared for user: ${userId}`);
}

/**
 * Clear all metrics cache
 */
export function clearAllMetricsCache(): void {
  metricsCache.clear();
  console.log('[ClientMetrics] All cache cleared');
}

