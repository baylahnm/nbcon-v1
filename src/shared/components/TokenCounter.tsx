/**
 * Token Counter Component
 * Displays user's monthly AI token usage in header or profile
 * 
 * Features:
 * - Lightweight display (just total tokens)
 * - RTL/i18n support
 * - Defensive null handling
 * - Real-time updates
 */

import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { getUserMonthlyUsage, getQuotaStatus } from '../services/tokenService';

interface TokenCounterProps {
  /**
   * Display variant
   * - 'badge': Compact badge (for header)
   * - 'full': Full stats (for dropdown)
   */
  variant?: 'badge' | 'full';
  
  /**
   * Custom className
   */
  className?: string;
}

export function TokenCounter({ variant = 'badge', className = '' }: TokenCounterProps) {
  const [tokenCount, setTokenCount] = useState<number>(0);
  const [quotaStatus, setQuotaStatus] = useState<'healthy' | 'warning' | 'critical' | 'exceeded'>('healthy');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTokenData();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadTokenData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadTokenData = async () => {
    try {
      const [usage, quota] = await Promise.all([
        getUserMonthlyUsage(),
        getQuotaStatus(),
      ]);

      setTokenCount(usage?.total_tokens || 0);
      setQuotaStatus(quota?.status || 'healthy');
    } catch (error) {
      console.error('[TokenCounter] Error loading token data:', error);
      setTokenCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Don't show while loading
  }

  // Don't show if no usage yet
  if (tokenCount === 0) {
    return null;
  }

  // Badge variant (compact for header)
  if (variant === 'badge') {
    return (
      <Badge
        variant="outline"
        className={`flex items-center gap-1.5 px-2 py-1 text-xs font-medium ${
          quotaStatus === 'exceeded'
            ? 'bg-red-500/10 text-red-600 border-red-500/30'
            : quotaStatus === 'critical'
            ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
            : quotaStatus === 'warning'
            ? 'bg-blue-500/10 text-blue-600 border-blue-500/30'
            : 'bg-primary/10 text-primary border-primary/20'
        } ${className}`}
        title={`AI Tokens used this month: ${tokenCount.toLocaleString()}`}
      >
        <Zap className="h-3.5 w-3.5" />
        <span className="font-mono tabular-nums">
          {tokenCount >= 1000 ? `${(tokenCount / 1000).toFixed(1)}K` : tokenCount}
        </span>
      </Badge>
    );
  }

  // Full variant (for dropdown/profile)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Zap className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">AI Tokens (Month)</p>
          <p className="text-sm font-bold tabular-nums">
            {tokenCount.toLocaleString()}
          </p>
        </div>
      </div>
      {quotaStatus !== 'healthy' && (
        <Badge
          variant="outline"
          className={`text-[10px] px-1.5 py-0 ${
            quotaStatus === 'exceeded'
              ? 'bg-red-500/10 text-red-600 border-0'
              : quotaStatus === 'critical'
              ? 'bg-amber-500/10 text-amber-600 border-0'
              : 'bg-blue-500/10 text-blue-600 border-0'
          }`}
        >
          {quotaStatus === 'exceeded' ? '⚠️ Over Limit' : quotaStatus === 'critical' ? 'Near Limit' : 'Monitor'}
        </Badge>
      )}
    </div>
  );
}

