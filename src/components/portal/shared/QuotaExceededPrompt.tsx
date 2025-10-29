/**
 * Quota Exceeded Prompt Component
 * 
 * Displays when user has exhausted their monthly token quota
 * Shows usage details and upgrade options
 * 
 * @version 1.0.0
 * @created January 28, 2025
 */

import React from 'react';
import { Crown, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';

interface QuotaExceededPromptProps {
  used: number;
  limit: number;
  resetDate: Date | string;
  className?: string;
}

export function QuotaExceededPrompt({ 
  used, 
  limit, 
  resetDate,
  className 
}: QuotaExceededPromptProps) {
  const navigate = useNavigate();
  const percentage = (used / limit) * 100;
  const resetDateObj = typeof resetDate === 'string' ? new Date(resetDate) : resetDate;

  return (
    <Card className={cn("border-2 border-red-500/20 bg-red-500/5", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="bg-red-500 h-12 w-12 rounded-xl shadow-md flex items-center justify-center flex-shrink-0">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-red-600">
              Monthly Quota Exceeded
            </CardTitle>
            <CardDescription className="mt-1">
              You've reached your AI token limit for this month
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Usage Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Token Usage</span>
            <span className="text-sm font-bold text-red-600">
              {used.toLocaleString()} / {limit.toLocaleString()}
            </span>
          </div>
          <Progress value={Math.min(percentage, 100)} className="h-2 bg-red-100" />
          <p className="text-xs text-muted-foreground mt-2">
            {percentage.toFixed(0)}% of your monthly quota used
          </p>
        </div>

        {/* Reset Info */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Your quota resets on:</span>
          </div>
          <p className="text-base font-bold pl-6">
            {resetDateObj.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
        </div>

        {/* Upgrade Options */}
        <div className="pt-3 border-t border-border/40 space-y-3">
          <div>
            <h4 className="text-sm font-semibold mb-2">Continue Using AI</h4>
            <p className="text-xs text-muted-foreground">
              Upgrade your plan to get higher token limits and continue using AI features without interruption.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Pro Plan Option */}
            <div className="p-3 border-2 border-primary/20 rounded-lg bg-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">Pro Plan</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                1M tokens/month
              </p>
              <p className="text-lg font-bold text-primary">SAR 375<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
            </div>

            {/* Enterprise Plan Option */}
            <div className="p-3 border-2 border-purple-500/20 rounded-lg bg-purple-500/5">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-sm">Enterprise</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Unlimited tokens
              </p>
              <p className="text-lg font-bold text-purple-600">Custom</p>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            className="w-full bg-primary-gradient text-white hover:opacity-90"
            onClick={() => navigate('/subscription')}
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade Plan
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>

          {/* Alternative: Wait for Reset */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Or wait {Math.ceil((resetDateObj.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days for your quota to reset
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default QuotaExceededPrompt;

