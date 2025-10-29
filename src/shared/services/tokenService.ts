/**
 * Token Tracking & Monetization Service
 * Phase 3: Token Usage Analytics
 * 
 * Tracks AI token usage, enforces quotas, calculates costs
 * Includes mock data fallback for development
 */

import { supabase } from '../supabase/client';

// Mock data for development/testing
const MOCK_QUOTA_DATA = {
  used: 12500,
  limit: 50000,
  remaining: 37500,
  percentage: 25,
  resetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
  status: 'healthy' as const,
};

const MOCK_MONTHLY_USAGE = {
  total_tokens: 12500,
  total_requests: 45,
  total_cost_usd: 0.15,
  total_cost_sar: 0.56,
  period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  period_end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
};

// Development flag - set to true to use mock data
// Default: false (use real database)
// Enable for local dev: VITE_USE_MOCK_TOKENS=true in .env.local
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_TOKENS === 'true';

// Pricing constants (as of Jan 2025)
const PRICING = {
  'gpt-4o': {
    input: 2.50 / 1_000_000, // $2.50 per 1M input tokens
    output: 10.00 / 1_000_000, // $10.00 per 1M output tokens
  },
  'gpt-4o-mini': {
    input: 0.15 / 1_000_000, // $0.15 per 1M input tokens
    output: 0.60 / 1_000_000, // $0.60 per 1M output tokens
  },
} as const;

const SAR_TO_USD_RATE = 3.75;

export interface TokenUsageParams {
  agent_id: string;
  session_id: string;
  conversation_id?: string;
  discipline: string;
  workflow_id: string;
  deliverable_id?: string;
  tokens_prompt: number;
  tokens_completion: number;
  model_used: 'gpt-4o' | 'gpt-4o-mini';
  processing_time_ms?: number;
  response_quality_score?: number;
  user_satisfaction?: 1 | 2 | 3 | 4 | 5;
  metadata?: Record<string, any>;
}

export interface QuotaCheckResult {
  allowed: boolean;
  remaining_tokens: number;
  remaining_requests: number;
  quota_limit: number;
  request_limit: number;
  current_usage: number;
  reset_date: string;
  allow_overage: boolean;
}

export interface MonthlyUsageResult {
  total_tokens: number;
  total_requests: number;
  total_cost_usd: number;
  total_cost_sar: number;
  period_start: string;
  period_end: string;
}

/**
 * Log token usage for an AI interaction
 */
export async function logTokenUsage(params: TokenUsageParams): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn('[TokenService] No authenticated user - skipping log');
      return;
    }

    // Calculate cost
    const cost_usd = calculateCost(
      params.tokens_prompt,
      params.tokens_completion,
      params.model_used
    );

    // Insert usage record
    const { error } = await supabase
      .from('ai_agent_usage')
      .insert({
        user_id: user.id,
        agent_id: params.agent_id,
        session_id: params.session_id,
        conversation_id: params.conversation_id || null,
        discipline: params.discipline,
        workflow_id: params.workflow_id,
        deliverable_id: params.deliverable_id || null,
        tokens_prompt: params.tokens_prompt,
        tokens_completion: params.tokens_completion,
        model_used: params.model_used,
        cost_usd,
        processing_time_ms: params.processing_time_ms || null,
        response_quality_score: params.response_quality_score || null,
        user_satisfaction: params.user_satisfaction || null,
        metadata: params.metadata || {},
      });

    if (error) {
      console.error('[TokenService] Failed to log usage:', error);
      // Don't throw - telemetry failure shouldn't block user
    } else {
      console.log('[TokenService] Logged usage:', {
        tokens: params.tokens_prompt + params.tokens_completion,
        cost_usd,
        discipline: params.discipline,
      });
    }
  } catch (error) {
    console.error('[TokenService] Unexpected error:', error);
    // Non-critical - don't throw
  }
}

/**
 * Calculate cost from token usage
 */
export function calculateCost(
  promptTokens: number,
  completionTokens: number,
  model: 'gpt-4o' | 'gpt-4o-mini'
): number {
  const pricing = PRICING[model];
  if (!pricing) {
    console.warn(`[TokenService] Unknown model: ${model}, using gpt-4o-mini pricing`);
    return calculateCost(promptTokens, completionTokens, 'gpt-4o-mini');
  }

  const inputCost = promptTokens * pricing.input;
  const outputCost = completionTokens * pricing.output;
  
  return inputCost + outputCost;
}

/**
 * Check if user can proceed with estimated token usage
 */
export async function checkUserQuota(estimatedTokens: number): Promise<QuotaCheckResult> {
  try {
    // @ts-expect-error - check_user_quota RPC exists but not in generated types yet
    const { data, error } = await supabase.rpc('check_user_quota', {
      p_estimated_tokens: estimatedTokens,
    });

    if (error) {
      console.error('[TokenService] Quota check failed:', error);
      // Default to allowing if check fails (degraded gracefully)
      return {
        allowed: true,
        remaining_tokens: 0,
        remaining_requests: 0,
        quota_limit: 0,
        request_limit: 0,
        current_usage: 0,
        reset_date: new Date().toISOString(),
        allow_overage: false,
      };
    }

    // RPC now returns table result with all fields
    if (!data || data.length === 0) {
      return {
        allowed: true,
        remaining_tokens: 999999,
        remaining_requests: 999999,
        quota_limit: 999999,
        request_limit: 999999,
        current_usage: 0,
        reset_date: new Date().toISOString(),
        allow_overage: false,
      };
    }

    const result = data[0];
    return {
      allowed: result.allowed,
      remaining_tokens: result.remaining_tokens,
      remaining_requests: result.remaining_requests,
      quota_limit: result.quota_limit,
      request_limit: result.request_limit,
      current_usage: result.quota_limit - result.remaining_tokens,
      reset_date: result.reset_date,
      allow_overage: false, // Not included in RPC result
    };
  } catch (error) {
    console.error('[TokenService] Quota check error:', error);
    // Default to allowing (fail open for better UX)
    return {
      allowed: true,
      remaining_tokens: 0,
      remaining_requests: 0,
      quota_limit: 0,
      request_limit: 0,
      current_usage: 0,
      reset_date: new Date().toISOString(),
      allow_overage: false,
    };
  }
}

/**
 * Get user's monthly AI usage
 */
export async function getUserMonthlyUsage(year?: number, month?: number): Promise<MonthlyUsageResult | null> {
  // Use mock data in development
  if (USE_MOCK_DATA) {
    console.log('[TokenService] Using mock monthly usage data for development');
    return MOCK_MONTHLY_USAGE;
  }

  try {
    const params = year !== undefined && month !== undefined 
      ? { p_year: year, p_month: month }
      : {};

    // @ts-expect-error - get_user_monthly_usage RPC exists but not in generated types yet
    const { data, error } = await supabase.rpc('get_user_monthly_usage', params);

    if (error) {
      console.error('[TokenService] Monthly usage fetch failed:', error);
      // Handle 400 errors gracefully
      if (error.code === '40000' || error.message?.includes('400')) {
        console.warn('[TokenService] 400 error - likely empty result, returning defaults');
        return {
          total_tokens: 0,
          total_requests: 0,
          total_cost_usd: 0,
          total_cost_sar: 0,
          period_start: new Date().toISOString().split('T')[0],
          period_end: new Date().toISOString().split('T')[0],
        };
      }
      return null;
    }

    if (!data || data.length === 0) {
      return {
        total_tokens: 0,
        total_requests: 0,
        total_cost_usd: 0,
        total_cost_sar: 0,
        period_start: new Date().toISOString().split('T')[0],
        period_end: new Date().toISOString().split('T')[0],
      };
    }

    const firstRow = data[0];

    return {
      total_tokens: firstRow.total_tokens || 0,
      total_requests: firstRow.total_requests || 0,
      total_cost_usd: firstRow.total_cost_usd || 0,
      total_cost_sar: firstRow.total_cost_sar || 0,
      period_start: firstRow.period_start || new Date().toISOString().split('T')[0],
      period_end: firstRow.period_end || new Date().toISOString().split('T')[0],
    };
  } catch (error) {
    console.error('[TokenService] Unexpected error fetching usage:', error);
    return null;
  }
}

/**
 * Get quota status for display
 */
export async function getQuotaStatus(): Promise<{
  used: number;
  limit: number;
  remaining: number;
  percentage: number;
  resetDate: string;
  status: 'healthy' | 'warning' | 'critical' | 'exceeded';
} | null> {
  // Use mock data in development (if explicitly enabled)
  if (USE_MOCK_DATA) {
    console.log('[TokenService] 🎭 Using mock quota data (VITE_USE_MOCK_TOKENS=true)');
    return MOCK_QUOTA_DATA;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('[TokenService] ❌ No authenticated user');
      return null;
    }

    // Try to use the RPC function first (preferred for production)
    // @ts-expect-error - get_user_quota_status RPC exists but not in generated types yet
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_user_quota_status');

    if (!rpcError && rpcData && rpcData.length > 0) {
      const quota = rpcData[0] as any;
      console.log('[TokenService] ✅ Got quota from RPC:', { 
        used: quota.used, 
        limit: quota.limit,
        percentage: quota.percentage 
      });
      
      return {
        used: quota.used || 0,
        limit: quota.limit || 10000,
        remaining: quota.remaining || 10000,
        percentage: quota.percentage || 0,
        resetDate: quota.reset_date || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        status: quota.status || 'healthy',
      };
    }

    // Fallback: Direct table query
    console.log('[TokenService] ⚠️  RPC failed, using direct table query');
    // @ts-expect-error - user_ai_quotas table exists but not in generated types yet
    const { data, error } = await supabase
      .from('user_ai_quotas')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      console.log('[TokenService] ⚠️  No quota record found, returning default limits');
      // No quota record = return default free tier
      return {
        used: 0,
        limit: 10000, // Free tier default
        remaining: 10000,
        percentage: 0,
        resetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        status: 'healthy',
      };
    }

    const used = (data as any).current_month_tokens || 0;
    const limit = (data as any).monthly_token_quota || 10000;
    const remaining = Math.max(0, limit - used);
    const percentage = limit > 0 ? (used / limit) * 100 : 0;

    let status: 'healthy' | 'warning' | 'critical' | 'exceeded' = 'healthy';
    if (percentage >= 100) status = 'exceeded';
    else if (percentage >= 90) status = 'critical';
    else if (percentage >= 75) status = 'warning';

    console.log('[TokenService] ✅ Got quota from table:', { used, limit, percentage: percentage.toFixed(1) });

    return {
      used,
      limit,
      remaining,
      percentage,
      resetDate: (data as any).quota_reset_date || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
      status,
    };
  } catch (error) {
    console.error('[TokenService] ❌ Error fetching quota status:', error);
    return null;
  }
}

/**
 * Format cost for display
 */
export function formatCost(costUsd: number, currency: 'USD' | 'SAR' = 'USD'): string {
  if (currency === 'SAR') {
    const sar = costUsd * SAR_TO_USD_RATE;
    return `${sar.toFixed(2)} SAR`;
  }
  return `$${costUsd.toFixed(4)} USD`;
}

/**
 * Estimate cost before making request
 */
export function estimateRequestCost(
  messageLength: number,
  model: 'gpt-4o' | 'gpt-4o-mini' = 'gpt-4o-mini',
  includeContext: boolean = true
): {
  estimated_prompt_tokens: number;
  estimated_completion_tokens: number;
  estimated_total_tokens: number;
  estimated_cost_usd: number;
  estimated_cost_sar: number;
} {
  // Rough estimation: 1 token ≈ 4 characters
  const basePromptTokens = Math.ceil(messageLength / 4);
  const contextTokens = includeContext ? 500 : 0; // Last 10 messages avg
  const systemPromptTokens = 150; // Avg system prompt length
  
  const estimated_prompt_tokens = basePromptTokens + contextTokens + systemPromptTokens;
  const estimated_completion_tokens = Math.ceil(estimated_prompt_tokens * 0.6); // AI typically responds 60% of input length

  const estimated_total_tokens = estimated_prompt_tokens + estimated_completion_tokens;
  const estimated_cost_usd = calculateCost(estimated_prompt_tokens, estimated_completion_tokens, model);
  const estimated_cost_sar = estimated_cost_usd * SAR_TO_USD_RATE;

  return {
    estimated_prompt_tokens,
    estimated_completion_tokens,
    estimated_total_tokens,
    estimated_cost_usd,
    estimated_cost_sar,
  };
}

/**
 * Get cost breakdown by discipline
 */
export async function getCostByDiscipline(
  startDate?: string,
  endDate?: string
): Promise<Record<string, { tokens: number; cost_usd: number; interactions: number }>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {};

    let query = supabase
      .from('ai_agent_usage')
      .select('discipline, tokens_total, cost_usd')
      .eq('user_id', user.id);

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[TokenService] Error fetching cost by discipline:', error);
      return {};
    }

    const breakdown: Record<string, { tokens: number; cost_usd: number; interactions: number }> = {};

    (data || []).forEach((row: any) => {
      if (!breakdown[row.discipline]) {
        breakdown[row.discipline] = { tokens: 0, cost_usd: 0, interactions: 0 };
      }
      breakdown[row.discipline].tokens += row.tokens_total || 0;
      breakdown[row.discipline].cost_usd += parseFloat(row.cost_usd) || 0;
      breakdown[row.discipline].interactions += 1;
    });

    return breakdown;
  } catch (error) {
    console.error('[TokenService] Unexpected error:', error);
    return {};
  }
}


