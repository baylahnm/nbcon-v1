/**
 * Token Usage Widget
 * Phase 3: Monetization Analytics
 * 
 * Displays user's monthly AI token usage, costs, and quota status
 * 
 * Features:
 * - Monthly token consumption gauge
 * - Cost breakdown (USD + SAR)
 * - Quota progress bar with alerts
 * - Usage by discipline breakdown
 * - Quota reset countdown
 */

import { useState, useEffect } from 'react';
import { Zap, TrendingUp, DollarSign, AlertCircle, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { supabase } from '@/shared/supabase/client';

interface MonthlyUsage {
  total_interactions: number;
  total_tokens: number;
  total_cost_usd: number;
  total_cost_sar: number;
  by_discipline: Record<
    string,
    {
      interactions: number;
      tokens: number;
      cost_usd: number;
      cost_sar: number;
    }
  >;
}

interface UserQuota {
  monthly_token_quota: number;
  monthly_cost_quota_usd: number;
  current_month_tokens: number;
  current_month_cost_usd: number;
  quota_reset_date: string;
  allow_overage: boolean;
}

export function TokenUsageWidget() {
  const [usage, setUsage] = useState<MonthlyUsage | null>(null);
  const [quota, setQuota] = useState<UserQuota | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsageData();
  }, []);

  const loadUsageData = async () => {
    try {
      // Get monthly usage
      const { data: usageData } = await supabase.rpc('get_user_monthly_usage');

      // Get quota
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: quotaData } = await supabase
          .from('user_ai_quotas')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setQuota(quotaData as UserQuota);
      }

      setUsage(usageData?.[0] as MonthlyUsage);
    } catch (error) {
      console.error('[TokenUsageWidget] Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-6 text-center">
          <Zap className="h-8 w-8 text-primary animate-pulse mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Loading usage data...</p>
        </CardContent>
      </Card>
    );
  }

  if (!usage) {
    return null; // No usage yet
  }

  // Calculate quota usage percentages
  const tokenUsagePercent = quota
    ? (quota.current_month_tokens / quota.monthly_token_quota) * 100
    : 0;
  const costUsagePercent = quota
    ? (quota.current_month_cost_usd / quota.monthly_cost_quota_usd) * 100
    : 0;
  const isNearQuota = tokenUsagePercent > 80;
  const isOverQuota = tokenUsagePercent > 100;

  return (
    <Card className="border-border/50">
      <CardHeader className="p-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-gradient h-10 w-10 rounded-xl shadow-md flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">AI Token Usage</CardTitle>
              <p className="text-xs text-muted-foreground">This month's consumption</p>
            </div>
          </div>
          {quota && (
            <Badge
              className={`${
                isOverQuota
                  ? 'bg-red-500/10 text-red-600 border-0'
                  : isNearQuota
                  ? 'bg-amber-500/10 text-amber-600 border-0'
                  : 'bg-green-500/10 text-green-600 border-0'
              }`}
            >
              {tokenUsagePercent.toFixed(0)}% Used
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Token Quota Progress */}
        {quota && (
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted-foreground">Token Quota</span>
              <span className="font-medium">
                {quota.current_month_tokens.toLocaleString()} /{' '}
                {quota.monthly_token_quota.toLocaleString()}
              </span>
            </div>
            <Progress
              value={Math.min(tokenUsagePercent, 100)}
              className={`h-2 ${
                isOverQuota
                  ? '[&>div]:bg-red-500'
                  : isNearQuota
                  ? '[&>div]:bg-amber-500'
                  : ''
              }`}
            />
          </div>
        )}

        {/* Cost Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/50 border border-border/40">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <p className="text-xs font-medium text-muted-foreground">Total Cost</p>
            </div>
            <p className="text-xl font-bold tracking-tight">
              {usage.total_cost_sar?.toFixed(2) || '0.00'}{' '}
              <span className="text-sm font-normal">SAR</span>
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              ${usage.total_cost_usd?.toFixed(2) || '0.00'} USD
            </p>
          </div>

          <div className="p-3 rounded-lg bg-muted/50 border border-border/40">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <p className="text-xs font-medium text-muted-foreground">Interactions</p>
            </div>
            <p className="text-xl font-bold tracking-tight">{usage.total_interactions || 0}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">This month</p>
          </div>
        </div>

        {/* Usage by Discipline */}
        {usage.by_discipline && Object.keys(usage.by_discipline).length > 0 && (
          <div className="pt-3 border-t border-border/40">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">Usage by Discipline</p>
            </div>
            <div className="space-y-1.5">
              {Object.entries(usage.by_discipline)
                .sort((a, b) => b[1].cost_usd - a[1].cost_usd)
                .slice(0, 4)
                .map(([discipline, data]) => (
                  <div key={discipline} className="flex items-center justify-between text-xs">
                    <span className="capitalize">{discipline.replace(/_/g, ' ')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{data.interactions} uses</span>
                      <Badge variant="outline" className="text-[9px] px-1.5 h-4">
                        {data.cost_sar.toFixed(1)} SAR
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Alert if near/over quota */}
        {quota && isNearQuota && !isOverQuota && (
          <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1 text-xs">
              <p className="font-medium text-amber-600">Approaching Quota Limit</p>
              <p className="text-amber-600/80 text-[10px] mt-0.5">
                {Math.round(quota.monthly_token_quota - quota.current_month_tokens).toLocaleString()}{' '}
                tokens remaining
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs border-amber-500/50 hover:bg-amber-500/10"
            >
              Upgrade
            </Button>
          </div>
        )}

        {quota && isOverQuota && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-medium text-red-600">Quota Exceeded</p>
              <p className="text-[10px] text-red-600/80 mt-0.5 mb-2">
                Upgrade your plan to continue using AI agents
              </p>
              <Button size="sm" className="h-7 text-xs w-full">
                Upgrade Now →
              </Button>
            </div>
          </div>
        )}

        {/* Reset date */}
        {quota && (
          <div className="text-center pt-2 border-t border-border/40">
            <p className="text-[10px] text-muted-foreground">
              Quota resets on {new Date(quota.quota_reset_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        )}

        {/* View Details Button */}
        <Button variant="outline" className="w-full h-8 text-xs" onClick={() => window.open('/free/usage-analytics', '_blank')}>
          <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
          View Detailed Analytics
        </Button>
      </CardContent>
    </Card>
  );
}

