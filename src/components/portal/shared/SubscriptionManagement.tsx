/**
 * Subscription Management Component
 * 
 * Centralized subscription management UI for all user roles
 * Displays current plan, usage analytics, billing history, and upgrade flows
 * 
 * @version 1.0.0
 * @created January 28, 2025
 */

import React, { useEffect, useState } from 'react';
import { 
  Crown, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Check, 
  X,
  CreditCard,
  FileText,
  Zap,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/1-HomePage/others/components/ui/tabs';
import { getUserSubscription, getUserSubscriptionTier } from '@/shared/services/subscriptionService';
import { getUserMonthlyUsage, type MonthlyUsageResult } from '@/shared/services/tokenService';
import { useAuthStore } from '@/pages/2-auth/others/stores/auth';
import { cn } from '@/pages/1-HomePage/others/lib/utils';
import type { SubscriptionTier } from '@/shared/types/subscription';

// Define SubscriptionDetails locally (not exported from service)
interface SubscriptionDetails {
  tier: SubscriptionTier;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'unpaid';
  periodStart: Date;
  periodEnd: Date;
  trialEnd?: Date;
  features: string[];
  limits: Record<string, number>;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}

// ============================================================================
// TYPES
// ============================================================================

interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

interface PlanTier {
  tier: SubscriptionTier;
  name: string;
  price: string;
  billingCycle: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  cta: string;
}

interface BillingHistoryItem {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl?: string;
}

// ============================================================================
// SUBSCRIPTION MANAGEMENT COMPONENT
// ============================================================================

export function SubscriptionManagement() {
  const { user } = useAuthStore();
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [monthlyUsage, setMonthlyUsage] = useState<MonthlyUsageResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier | null>(null);

  useEffect(() => {
    loadSubscriptionData();
  }, [user?.id]);

  const loadSubscriptionData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const [subData, usageData] = await Promise.all([
        getUserSubscription(user.id),
        getUserMonthlyUsage()
      ]);

      setSubscription(subData);
      setMonthlyUsage(usageData);
    } catch (error) {
      console.error('[SubscriptionManagement] Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate usage percentage
  const usagePercentage = monthlyUsage && subscription
    ? ((monthlyUsage.total_tokens || 0) / (subscription.limits?.ai_tokens || 100000)) * 100
    : 0;

  // Mock billing history (replace with actual Stripe data)
  const billingHistory: BillingHistoryItem[] = [
    {
      id: 'inv_001',
      date: '2025-01-01',
      amount: 'SAR 375.00',
      status: 'paid',
      invoiceUrl: '#'
    },
    {
      id: 'inv_002',
      date: '2024-12-01',
      amount: 'SAR 375.00',
      status: 'paid',
      invoiceUrl: '#'
    },
    {
      id: 'inv_003',
      date: '2024-11-01',
      amount: 'SAR 375.00',
      status: 'paid',
      invoiceUrl: '#'
    }
  ];

  // Plan tiers configuration
  const planTiers: PlanTier[] = [
    {
      tier: 'free',
      name: 'Free',
      price: 'SAR 0',
      billingCycle: 'forever',
      description: 'Perfect for getting started',
      cta: 'Current Plan',
      features: [
        { name: 'Basic project management', included: true },
        { name: 'Up to 3 active projects', included: true, limit: '3' },
        { name: 'AI tokens', included: true, limit: '100K/month' },
        { name: 'Email support', included: true },
        { name: 'Advanced analytics', included: false },
        { name: 'Priority support', included: false },
        { name: 'Custom integrations', included: false }
      ]
    },
    {
      tier: 'basic',
      name: 'Basic',
      price: 'SAR 150',
      billingCycle: 'per month',
      description: 'For growing teams',
      cta: 'Upgrade to Basic',
      features: [
        { name: 'Full project management', included: true },
        { name: 'Unlimited projects', included: true },
        { name: 'AI tokens', included: true, limit: '500K/month' },
        { name: 'Priority email support', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Team collaboration', included: true, limit: '5 members' },
        { name: 'Custom integrations', included: false }
      ]
    },
    {
      tier: 'pro',
      name: 'Pro',
      price: 'SAR 375',
      billingCycle: 'per month',
      description: 'For professional teams',
      popular: true,
      cta: 'Upgrade to Pro',
      features: [
        { name: 'Advanced project management', included: true },
        { name: 'Unlimited projects', included: true },
        { name: 'AI tokens', included: true, limit: '1M/month' },
        { name: '24/7 priority support', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Team collaboration', included: true, limit: '20 members' },
        { name: 'API access', included: true },
        { name: 'Custom branding', included: false }
      ]
    },
    {
      tier: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      billingCycle: 'contact us',
      description: 'For large organizations',
      cta: 'Contact Sales',
      features: [
        { name: 'Enterprise project management', included: true },
        { name: 'Unlimited projects', included: true },
        { name: 'Unlimited AI tokens', included: true },
        { name: 'Dedicated support manager', included: true },
        { name: 'Custom analytics & reporting', included: true },
        { name: 'Unlimited team members', included: true },
        { name: 'Full API access', included: true },
        { name: 'Custom branding & white-label', included: true },
        { name: 'SLA guarantee', included: true }
      ]
    }
  ];

  const currentTier = subscription?.tier || 'free';

  return (
    <div className="p-6 space-y-6" data-testid="subscription-management">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary-gradient h-10 w-10 rounded-xl shadow-md flex items-center justify-center">
            <Crown className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Subscription & Billing</h1>
            <p className="text-sm text-muted-foreground">Manage your plan and usage</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="current-plan" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current-plan">Current Plan</TabsTrigger>
          <TabsTrigger value="upgrade">Plans & Pricing</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
        </TabsList>

        {/* ============================================================================ */}
        {/* TAB 1: CURRENT PLAN */}
        {/* ============================================================================ */}

        <TabsContent value="current-plan" className="space-y-6 mt-6">
          {/* Current Plan Card */}
          <Card>
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <Crown className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Current Plan</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Loading subscription...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Plan Info */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold capitalize">{currentTier}</h3>
                        {currentTier === 'pro' && (
                          <Badge className="bg-primary-gradient text-white border-0">Most Popular</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {planTiers.find(p => p.tier === currentTier)?.description}
                      </p>
                      {subscription && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {subscription.status === 'active' ? '✅' : '⚠️'} Status: <span className="capitalize">{subscription.status}</span>
                        </p>
                      )}
                    </div>
                    {currentTier !== 'enterprise' && (
                      <Button 
                        className="bg-primary-gradient text-white hover:opacity-90"
                        onClick={() => {
                          const tabsList = document.querySelector('[value="upgrade"]') as HTMLElement;
                          tabsList?.click();
                        }}
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade Plan
                      </Button>
                    )}
                  </div>

                  {/* Subscription Period */}
                  {subscription && (
                    <div className="flex items-center gap-6 p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Current Period</p>
                          <p className="text-sm font-medium">
                            {new Date(subscription.periodStart).toLocaleDateString()} - {new Date(subscription.periodEnd).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {subscription.trialEnd && new Date(subscription.trialEnd) > new Date() && (
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-600" />
                          <div>
                            <p className="text-xs text-muted-foreground">Trial Ends</p>
                            <p className="text-sm font-medium text-yellow-600">
                              {new Date(subscription.trialEnd).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Plan Features */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Your Plan Includes:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {planTiers.find(p => p.tier === currentTier)?.features.filter(f => f.included).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm">{feature.name}</p>
                            {feature.limit && (
                              <p className="text-xs text-muted-foreground">{feature.limit}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Analytics Card */}
          <Card>
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Usage This Month</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* AI Token Usage */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">AI Tokens</span>
                      <span className="text-sm font-bold">
                        {monthlyUsage?.total_tokens?.toLocaleString() || 0} / {subscription?.limits?.ai_tokens?.toLocaleString() || '100K'}
                      </span>
                    </div>
                    <Progress value={usagePercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {usagePercentage >= 80 && usagePercentage < 100 && (
                        <span className="text-yellow-600">⚠️ Approaching limit - Consider upgrading</span>
                      )}
                      {usagePercentage >= 100 && (
                        <span className="text-red-600">❌ Quota exceeded - Upgrade to continue</span>
                      )}
                      {usagePercentage < 80 && (
                        <span className="text-green-600">✅ Healthy usage</span>
                      )}
                    </p>
                  </div>

                  {/* Cost Summary */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Cost (USD)</p>
                      <p className="text-xl font-bold mt-1">${monthlyUsage?.total_cost_usd?.toFixed(4) || '0.0000'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Cost (SAR)</p>
                      <p className="text-xl font-bold mt-1">SAR {monthlyUsage?.total_cost_sar?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Requests</p>
                      <p className="text-lg font-semibold mt-1">{monthlyUsage?.total_requests || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Reset Date</p>
                      <p className="text-sm font-medium mt-1">
                        {monthlyUsage?.period_end ? new Date(monthlyUsage.period_end).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Usage Breakdown */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Usage Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded hover:bg-accent">
                        <span className="text-sm">AI Chat Messages</span>
                        <span className="text-sm font-medium">{monthlyUsage?.total_requests || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded hover:bg-accent">
                        <span className="text-sm">Total Tokens Used</span>
                        <span className="text-sm font-medium">{monthlyUsage?.total_tokens?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded hover:bg-accent">
                        <span className="text-sm">Average per Request</span>
                        <span className="text-sm font-medium">
                          {monthlyUsage && monthlyUsage.total_requests > 0 
                            ? Math.round((monthlyUsage.total_tokens || 0) / monthlyUsage.total_requests).toLocaleString() 
                            : 0} tokens
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================================ */}
        {/* TAB 2: PLANS & PRICING */}
        {/* ============================================================================ */}

        <TabsContent value="upgrade" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {planTiers.map((plan) => {
              const isCurrent = plan.tier === currentTier;
              const isEnterprise = plan.tier === 'enterprise';

              return (
                <Card 
                  key={plan.tier}
                  className={cn(
                    "relative overflow-hidden transition-all",
                    plan.popular && "border-2 border-primary shadow-lg scale-105",
                    isCurrent && "border-2 border-green-500"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary-gradient text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                      Most Popular
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute top-0 left-0 bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-br-lg">
                      Current Plan
                    </div>
                  )}

                  <CardHeader className="p-4 border-b border-border/40">
                    <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-sm">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.billingCycle !== 'forever' && plan.billingCycle !== 'contact us' && (
                        <span className="text-sm text-muted-foreground ml-2">{plan.billingCycle}</span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          {feature.included ? (
                            <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className={cn(
                              "text-sm",
                              !feature.included && "text-muted-foreground line-through"
                            )}>
                              {feature.name}
                            </p>
                            {feature.limit && feature.included && (
                              <p className="text-xs text-muted-foreground">{feature.limit}</p>
                            )}
                          </div>
                        </div>
                      ))}

                      <Button 
                        className={cn(
                          "w-full mt-4",
                          plan.popular && "bg-primary-gradient text-white hover:opacity-90",
                          isCurrent && "bg-green-500 hover:bg-green-600 text-white"
                        )}
                        disabled={isCurrent}
                        onClick={() => {
                          if (isEnterprise) {
                            window.open('mailto:sales@nbcon.org?subject=Enterprise Plan Inquiry', '_blank');
                          } else {
                            setSelectedPlan(plan.tier);
                            // TODO: Integrate with Stripe checkout
                            alert(`Upgrade to ${plan.name} plan - Stripe integration pending`);
                          }
                        }}
                      >
                        {isCurrent ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Current Plan
                          </>
                        ) : (
                          <>
                            {plan.cta}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Upgrade Benefits */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary-gradient h-12 w-12 rounded-xl shadow-md flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Why Upgrade?</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Unlock advanced AI tools and higher token limits</li>
                    <li>• Get priority 24/7 support from our team</li>
                    <li>• Access detailed analytics and custom reports</li>
                    <li>• Collaborate with unlimited team members</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================================ */}
        {/* TAB 3: BILLING HISTORY */}
        {/* ============================================================================ */}

        <TabsContent value="billing" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold tracking-tight">Billing History</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {currentTier === 'free' ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No billing history</p>
                  <p className="text-xs text-muted-foreground mt-1">You're on the Free plan</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {billingHistory.map((invoice) => (
                    <div 
                      key={invoice.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Invoice {invoice.id}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(invoice.date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-bold">{invoice.amount}</p>
                          <Badge 
                            variant="secondary"
                            className={cn(
                              invoice.status === 'paid' && "bg-green-500/10 text-green-700 border-green-500/20",
                              invoice.status === 'pending' && "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
                              invoice.status === 'failed' && "bg-red-500/10 text-red-700 border-red-500/20"
                            )}
                          >
                            {invoice.status}
                          </Badge>
                        </div>
                        {invoice.invoiceUrl && invoice.status === 'paid' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(invoice.invoiceUrl, '_blank')}
                          >
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {billingHistory.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No invoices yet</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method Card */}
          <Card>
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl ring-1 ring-primary/20 shadow-md">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight">Payment Method</CardTitle>
                </div>
                {currentTier !== 'free' && (
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {currentTier === 'free' ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No payment method required</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 12/2025</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cancel Subscription */}
          {currentTier !== 'free' && (
            <Card className="border-red-500/20 bg-red-500/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-red-600 mb-1">Cancel Subscription</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Canceling will downgrade you to the Free plan at the end of your current billing period.
                      You'll lose access to premium features and higher token limits.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => {
                        if (confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
                          // TODO: Implement cancellation via Stripe
                          alert('Cancellation flow - Stripe integration pending');
                        }
                      }}
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SubscriptionManagement;

