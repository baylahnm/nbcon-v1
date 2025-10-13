"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../1-HomePage/others/components/ui/card";
import { Button } from "../1-HomePage/others/components/ui/button";
import { Badge } from "../1-HomePage/others/components/ui/badge";
import { Building, User, Users } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../1-HomePage/others/components/ui/chart';
import { Separator } from "../1-HomePage/others/components/ui/separator";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../1-HomePage/others/components/ui/table";
import { 
  Crown, 
  Check, 
  ArrowRight, 
  CreditCard, 
  Calendar,
  AlertCircle,
  ExternalLink,
  Zap,
  Star,
  Building,
  Download,
  Upload,
  RefreshCw,
  Settings
} from "lucide-react";

const formatCurrency = (amount: number, currency: string = 'SAR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

// Mock subscription data - in real app, this would come from your billing service
const mockSubscription = {
  id: 'sub_1234567890',
  status: 'active',
  currentPeriodStart: new Date('2024-01-01'),
  currentPeriodEnd: new Date('2024-02-01'),
  plan: {
    id: 'engineer_pro',
    name: 'Engineer Pro',
    price: 299,
    interval: 'monthly',
    features: [
      'Unlimited project applications',
      'Priority support',
      'Advanced analytics',
      'Custom portfolio',
      'Direct client messaging',
      'Premium job alerts',
      'Skill verification badges',
      'Portfolio showcase'
    ]
  },
  paymentMethod: {
    type: 'card',
    last4: '4242',
    brand: 'visa',
    expiryMonth: 12,
    expiryYear: 2025
  },
  nextBillingDate: new Date('2024-02-01'),
  billingHistory: [
    { date: new Date('2024-01-01'), amount: 299, status: 'paid', invoice: 'INV-001', description: 'Engineer Pro - January 2024' },
    { date: new Date('2023-12-01'), amount: 299, status: 'paid', invoice: 'INV-002', description: 'Engineer Pro - December 2023' },
    { date: new Date('2023-11-01'), amount: 299, status: 'paid', invoice: 'INV-003', description: 'Engineer Pro - November 2023' },
    { date: new Date('2023-10-01'), amount: 299, status: 'paid', invoice: 'INV-004', description: 'Engineer Pro - October 2023' },
    { date: new Date('2023-09-01'), amount: 299, status: 'paid', invoice: 'INV-005', description: 'Engineer Pro - September 2023' }
  ]
};

// Available plans
const availablePlans = [
  {
    id: 'engineer_basic',
    name: 'Engineer Basic',
    price: 99,
    interval: 'monthly',
    description: 'Perfect for new engineers starting their career',
    features: [
      'Up to 10 project applications per month',
      'Basic portfolio',
      'Email support',
      'Standard job alerts',
      'Basic analytics'
    ],
    popular: false
  },
  {
    id: 'engineer_pro',
    name: 'Engineer Pro',
    price: 299,
    interval: 'monthly',
    description: 'Most popular choice for experienced engineers',
    features: [
      'Unlimited project applications',
      'Priority support',
      'Advanced analytics',
      'Custom portfolio',
      'Direct client messaging',
      'Premium job alerts',
      'Skill verification badges',
      'Portfolio showcase'
    ],
    popular: true
  },
  {
    id: 'engineer_enterprise',
    name: 'Engineer Enterprise',
    price: 599,
    interval: 'monthly',
    description: 'For established engineering firms and consultants',
    features: [
      'Everything in Pro',
      'Team management',
      'White-label solutions',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced reporting',
      'Multi-user support'
    ],
    popular: false
  }
];

function PlanChart({ planName }: { planName: string }) {
  const chartData = [
    { month: 'Jan', interest: 120 },
    { month: 'Feb', interest: 180 },
    { month: 'Mar', interest: 150 },
    { month: 'Apr', interest: 210 },
    { month: 'May', interest: 250 },
    { month: 'Jun', interest: 300 },
    { month: 'Jul', interest: 280 },
    { month: 'Aug', interest: 320 },
    { month: 'Sep', interest: 340 },
    { month: 'Oct', interest: 390 },
    { month: 'Nov', interest: 420 },
    { month: 'Dec', interest: 500 },
  ];

  const chartConfig = {
    interest: {
      label: 'Plan Popularity',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig;

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-0 border-b p-2">
        <CardTitle className="text-xs">Plan Popularity</CardTitle>
        <p className="text-[10px] text-muted-foreground">
          Monthly growth trend
        </p>
      </CardHeader>
      <CardContent className="p-2">
        <ChartContainer config={chartConfig} className="h-24">
          <LineChart data={chartData} margin={{ left: 0, right: 0, top: 5, bottom: 5 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tick={{ fontSize: 10 }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="interest"
              type="monotone"
              stroke="var(--color-interest)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState(mockSubscription);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlanChange = async (planId: string) => {
    setIsLoading(true);
    // Mock plan change - in real app, this would call your billing API
    setTimeout(() => {
      const newPlan = availablePlans.find(p => p.id === planId);
      if (newPlan) {
        setSubscription(prev => ({
          ...prev,
          plan: newPlan
        }));
      }
      setIsLoading(false);
    }, 2000);
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    // Mock cancellation - in real app, this would call your billing API
    setTimeout(() => {
      setSubscription(prev => ({
        ...prev,
        status: 'cancelled'
      }));
      setIsLoading(false);
    }, 2000);
  };

  const handleResumeSubscription = async () => {
    setIsLoading(true);
    // Mock resumption - in real app, this would call your billing API
    setTimeout(() => {
      setSubscription(prev => ({
        ...prev,
        status: 'active'
      }));
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="flex-1 bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-border/40 mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Subscription
            </h1>
            <p className="text-xs text-muted-foreground">
              Manage your subscription and billing
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Current Subscription Status */}
      <Card 
        className="relative overflow-hidden transition-all duration-300 mb-6"
        style={{
          '--rotation': '4.2rad',
          border: '2px solid transparent',
          borderRadius: '0.5rem',
          backgroundImage: `
            linear-gradient(hsl(var(--card)), hsl(var(--card))),
            linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
          `,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        } as React.CSSProperties}
      >
        <CardHeader className="p-4 pb-3 border-b border-border/40">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
              <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                <Crown className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-base font-bold tracking-tight">Current Subscription</div>
                <p className="text-xs text-muted-foreground mt-0.5 font-normal">Your active plan details</p>
              </div>
            </CardTitle>
            <Badge 
              variant={subscription.status === 'active' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {subscription.status === 'active' ? 'Active' : 'Cancelled'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">{subscription.plan.name}</h3>
              <p className="text-3xl font-bold text-primary mb-1">
                {formatCurrency(subscription.plan.price)}
                <span className="text-sm font-normal text-muted-foreground">/{subscription.plan.interval}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Next billing: {formatDate(subscription.nextBillingDate)}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Payment Method</h4>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  •••• •••• •••• {subscription.paymentMethod.last4}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Expires {subscription.paymentMethod.expiryMonth}/{subscription.paymentMethod.expiryYear}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Billing Period</h4>
              <p className="text-sm">
                {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Subscription ID: {subscription.id}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-4">
            {subscription.status === 'active' ? (
              <Button 
                variant="outline" 
                onClick={handleCancelSubscription}
                disabled={isLoading}
                className="gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                Cancel Subscription
              </Button>
            ) : (
              <Button 
                onClick={handleResumeSubscription}
                disabled={isLoading}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                Resume Subscription
              </Button>
            )}
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Update Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card 
        className="relative overflow-hidden transition-all duration-300 mb-6"
        style={{
          '--rotation': '4.2rad',
          border: '2px solid transparent',
          borderRadius: '0.5rem',
          backgroundImage: `
            linear-gradient(hsl(var(--card)), hsl(var(--card))),
            linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
          `,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        } as React.CSSProperties}
      >
        <CardHeader className="p-4 pb-3 border-b border-border/40">
          <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
            <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
              <Check className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight">Current Plan Features</div>
              <p className="text-xs text-muted-foreground mt-0.5 font-normal">Included in your subscription</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subscription.plan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card 
        className="relative overflow-hidden transition-all duration-300 mb-6"
        style={{
          '--rotation': '4.2rad',
          border: '2px solid transparent',
          borderRadius: '0.5rem',
          backgroundImage: `
            linear-gradient(hsl(var(--card)), hsl(var(--card))),
            linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
          `,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        } as React.CSSProperties}
      >
        <CardHeader className="p-4 pb-3 border-b border-border/40">
          <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
            <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight">Available Plans</div>
              <p className="text-xs text-muted-foreground mt-0.5 font-normal">Choose your subscription tier</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid gap-6 md:col-span-4 lg:grid-cols-3">
            {availablePlans.map((plan) => {
              const planIcons = {
                'engineer-basic': User,
                'engineer-pro': User,
                'engineer-enterprise': Users
              };
              const Icon = planIcons[plan.id as keyof typeof planIcons] || User;
              const showChart = plan.id === 'engineer-pro' || plan.id === 'engineer-enterprise';
              
              return (
                <div 
                  key={plan.id}
                  className={`flex flex-col justify-between space-y-4 transition-all rounded-lg p-4 border bg-background ${
                    plan.id === subscription.plan.id ? 'ring-2 ring-primary bg-primary/5 border-primary' : 'border-border hover:bg-muted/30'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="relative">
                      {plan.popular && (
                        <Badge className="absolute -top-2 left-0 bg-primary text-primary-foreground text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold">{plan.name}</h2>
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <span className="block text-2xl font-bold text-primary">
                        {formatCurrency(plan.price)}
                        <span className="text-sm font-normal text-muted-foreground">/{plan.interval}</span>
                      </span>
                      <p className="text-muted-foreground text-xs mt-2">
                        {plan.description}
                      </p>
                    </div>

                    {showChart && (
                      <div className="bg-muted/30 h-fit w-full rounded-lg border p-2">
                        <PlanChart planName={plan.name} />
                      </div>
                    )}

                    <ul className="text-muted-foreground space-y-2 text-xs">
                      {plan.features.slice(0, 5).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {plan.features.length > 5 && (
                        <li className="text-xs text-muted-foreground/70">
                          +{plan.features.length - 5} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  {plan.id === subscription.plan.id ? (
                    <Button disabled className="w-full">
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => handlePlanChange(plan.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Upgrade Plan'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Billing History Table */}
      <Card 
        className="relative overflow-hidden transition-all duration-300"
        style={{
          '--rotation': '4.2rad',
          border: '2px solid transparent',
          borderRadius: '0.5rem',
          backgroundImage: `
            linear-gradient(hsl(var(--card)), hsl(var(--card))),
            linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
          `,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        } as React.CSSProperties}
      >
        <CardHeader className="p-4 pb-3 border-b border-border/40">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
              <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                <CreditCard className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-base font-bold tracking-tight">Billing History</div>
                <p className="text-xs text-muted-foreground mt-0.5 font-normal">Transaction records and invoices</p>
              </div>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscription.billingHistory.map((billing, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {formatDate(billing.date)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{billing.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">
                      {formatCurrency(billing.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={billing.status === 'paid' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {billing.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-mono">{billing.invoice}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <ExternalLink className="h-3 w-3" />
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}