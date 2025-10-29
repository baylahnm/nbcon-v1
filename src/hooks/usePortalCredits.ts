/**
 * Portal Credits Hook
 * Fetches and manages AI token usage and quota information
 */

import { useEffect, useState } from 'react';
import { getUserMonthlyUsage, getQuotaStatus } from '@/shared/services/tokenService';

export type CreditStatus = 'healthy' | 'warning' | 'critical' | 'exceeded';

export interface PortalCreditsData {
  // Usage
  tokensUsed: number;
  tokensLimit: number;
  tokensRemaining: number;
  requestsUsed: number;

  // Cost
  costUSD: number;
  costSAR: number;

  // Status
  usagePercentage: number;
  status: CreditStatus;
  statusColor: string;
  statusBadge: string;

  // Dates
  periodStart: string;
  periodEnd: string;
  resetDate: string;

  // Account
  isPro: boolean;
  canUpgrade: boolean;

  // Loading
  isLoading: boolean;
  error: string | null;
}

const DEFAULT_STATE: PortalCreditsData = {
  tokensUsed: 0,
  tokensLimit: 0,
  tokensRemaining: 0,
  requestsUsed: 0,
  costUSD: 0,
  costSAR: 0,
  usagePercentage: 0,
  status: 'healthy',
  statusColor: 'text-emerald-500',
  statusBadge: '🟢',
  periodStart: '',
  periodEnd: '',
  resetDate: '',
  isPro: false,
  canUpgrade: true,
  isLoading: true,
  error: null,
};

function getStatusStyles(percent: number): Pick<PortalCreditsData, 'status' | 'statusColor' | 'statusBadge'> {
  if (percent >= 100) {
    return { status: 'exceeded', statusColor: 'text-rose-500', statusBadge: '🔴' };
  }
  if (percent >= 80) {
    return { status: 'critical', statusColor: 'text-rose-500', statusBadge: '🔴' };
  }
  if (percent >= 50) {
    return { status: 'warning', statusColor: 'text-amber-500', statusBadge: '🟡' };
  }
  return { status: 'healthy', statusColor: 'text-emerald-500', statusBadge: '🟢' };
}

export function usePortalCredits(): PortalCreditsData {
  const [data, setData] = useState<PortalCreditsData>(DEFAULT_STATE);

  useEffect(() => {
    let mounted = true;

    async function fetchCreditsData() {
      try {
        console.log('[usePortalCredits] Fetching credits data...');
        const [monthlyUsage, quotaStatus] = await Promise.all([
          getUserMonthlyUsage(),
          getQuotaStatus(),
        ]);

        console.log('[usePortalCredits] Data received:', { monthlyUsage, quotaStatus });

        if (!mounted) return;

        if (!monthlyUsage || !quotaStatus) {
          console.log('[usePortalCredits] Missing data, setting loading false');
          setData((prev) => ({ ...prev, isLoading: false }));
          return;
        }

        const percentage = quotaStatus.percentage ?? 0;
        const { status, statusBadge, statusColor } = getStatusStyles(percentage);

        const newData = {
          tokensUsed: quotaStatus.used ?? 0,
          tokensLimit: quotaStatus.limit ?? 0,
          tokensRemaining: quotaStatus.remaining ?? 0,
          requestsUsed: monthlyUsage.total_requests ?? 0,
          costUSD: monthlyUsage.total_cost_usd ?? 0,
          costSAR: monthlyUsage.total_cost_sar ?? 0,
          usagePercentage: percentage,
          status,
          statusColor,
          statusBadge,
          periodStart: monthlyUsage.period_start ?? '',
          periodEnd: monthlyUsage.period_end ?? '',
          resetDate: quotaStatus.resetDate ?? '',
          isPro: (quotaStatus.limit ?? 0) > 100000,
          canUpgrade: (quotaStatus.limit ?? 0) <= 100000,
          isLoading: false,
          error: null,
        };

        console.log('[usePortalCredits] Setting data:', newData);
        setData(newData);
      } catch (error) {
        if (!mounted) return;
        console.error('[usePortalCredits] Error fetching data:', error);
        setData((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load usage data',
        }));
      }
    }

    fetchCreditsData();

    return () => {
      mounted = false;
    };
  }, []);

  return data;
}
