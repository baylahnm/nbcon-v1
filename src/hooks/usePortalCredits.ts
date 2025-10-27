/**
 * Portal Credits Hook
 * Fetches and manages AI token usage and quota information
 */

import { useEffect, useState } from 'react';
import { getUserMonthlyUsage, getQuotaStatus } from '@/shared/services/tokenService';

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
  status: 'healthy' | 'warning' | 'critical' | 'exceeded';
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

export function usePortalCredits(): PortalCreditsData {
  const [data, setData] = useState<PortalCreditsData>({
    tokensUsed: 0,
    tokensLimit: 100000,
    tokensRemaining: 100000,
    requestsUsed: 0,
    costUSD: 0,
    costSAR: 0,
    usagePercentage: 0,
    status: 'healthy',
    statusColor: 'text-green-600',
    statusBadge: '🟢',
    periodStart: '',
    periodEnd: '',
    resetDate: '',
    isPro: false,
    canUpgrade: true,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    async function fetchCreditsData() {
      try {
        // Fetch both monthly usage and quota status
        const [monthlyUsage, quotaStatus] = await Promise.all([
          getUserMonthlyUsage(),
          getQuotaStatus(),
        ]);

        if (!mounted) return;

        if (monthlyUsage && quotaStatus) {
          const percentage = quotaStatus.percentage;
          
          // Determine status based on usage percentage
          let status: 'healthy' | 'warning' | 'critical' | 'exceeded' = 'healthy';
          let statusColor = 'text-green-600';
          let statusBadge = '🟢';
          
          if (percentage >= 100) {
            status = 'exceeded';
            statusColor = 'text-red-600';
            statusBadge = '🔴';
          } else if (percentage >= 80) {
            status = 'critical';
            statusColor = 'text-red-600';
            statusBadge = '🔴';
          } else if (percentage >= 50) {
            status = 'warning';
            statusColor = 'text-yellow-600';
            statusBadge = '🟡';
          }

          setData({
            tokensUsed: quotaStatus.used,
            tokensLimit: quotaStatus.limit,
            tokensRemaining: quotaStatus.remaining,
            requestsUsed: monthlyUsage.total_requests,
            costUSD: monthlyUsage.total_cost_usd,
            costSAR: monthlyUsage.total_cost_sar,
            usagePercentage: percentage,
            status,
            statusColor,
            statusBadge,
            periodStart: monthlyUsage.period_start,
            periodEnd: monthlyUsage.period_end,
            resetDate: quotaStatus.resetDate,
            isPro: quotaStatus.limit > 100000, // Pro has higher limits
            canUpgrade: quotaStatus.limit <= 100000,
            isLoading: false,
            error: null,
          });
        } else {
          // Defaults if no data
          setData(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        if (!mounted) return;
        
        console.error('[usePortalCredits] Error fetching data:', error);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load credits',
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
