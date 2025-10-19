import React, { useState, useEffect, useRef, useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "../1-HomePage/others/components/ui/card";
import { Button } from "../1-HomePage/others/components/ui/button";
import { Badge } from "../1-HomePage/others/components/ui/badge";
import { useOutsideClick } from '../1-HomePage/others/hooks/use-outside-click';
import { Building, User, Users, X } from "lucide-react";
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
  Download,
  Upload,
  RefreshCw,
  Settings,
  ChevronRight,
  ChevronDown,
  History
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
  id: 'sub_CLI_1234567890',
  status: 'active',
  currentPeriodStart: new Date('2024-01-01'),
  currentPeriodEnd: new Date('2024-02-01'),
  plan: {
    id: 'client_free',
    name: 'Client Free',
    price: 0,
    interval: 'monthly',
    features: [
      'Post up to 5 jobs per month',
      'Browse verified engineers',
      'Basic messaging',
      'Standard support',
      'Access to job board'
    ]
  },
  paymentMethod: {
    type: 'none',
    last4: '',
    brand: '',
    expiryMonth: 0,
    expiryYear: 0
  },
  nextBillingDate: new Date('2024-02-01'),
  billingHistory: [
    { date: new Date('2024-01-01'), amount: 0, status: 'free', invoice: 'INV-CLI-001', description: 'Client Free - January 2024' },
    { date: new Date('2023-12-01'), amount: 0, status: 'free', invoice: 'INV-CLI-002', description: 'Client Free - December 2023' },
    { date: new Date('2023-11-01'), amount: 0, status: 'free', invoice: 'INV-CLI-003', description: 'Client Free - November 2023' }
  ]
};

// Available plans for clients
const availablePlans = [
  {
    id: 'client_free',
    name: 'Client Free',
    price: 0,
    yearlyPrice: 0,
    interval: 'monthly',
    description: 'Perfect for occasional hiring needs',
    features: [
      'Post up to 5 jobs per month',
      'Browse verified engineers',
      'Basic messaging',
      'Standard support',
      'Access to job board'
    ],
    popular: false
  },
  {
    id: 'client_professional',
    name: 'Client Professional',
    price: 45,
    yearlyPrice: 450,
    interval: 'monthly',
    description: 'Most popular for growing businesses',
    features: [
      'Unlimited job postings',
      'Priority engineer matching',
      'Advanced messaging & video calls',
      'Priority support (24/7)',
      'Project management dashboard',
      'Team collaboration tools',
      'Custom contracts',
      'Analytics & reporting'
    ],
    popular: true
  },
  {
    id: 'client_enterprise',
    name: 'Client Enterprise',
    price: 120,
    yearlyPrice: 1200,
    interval: 'monthly',
    description: 'For large organizations with extensive needs',
    features: [
      'Everything in Professional',
      'Dedicated account manager',
      'Custom SLA agreements',
      'API access',
      'White-label solutions',
      'Multi-location support',
      'Advanced security & compliance',
      'Custom integrations',
      'Volume discounts'
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
  const [expandedCard, setExpandedCard] = useState<'features' | null>(null);
  const [expandedBillingRow, setExpandedBillingRow] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const expandedRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // Handle Escape key and body overflow
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpandedCard(null);
      }
    };

    if (expandedCard) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [expandedCard]);

  useOutsideClick(expandedRef, () => {
    setExpandedCard(null);
  });

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
          <div className="bg-primary/10 p-2.5 rounded-xl ring-1 ring-primary/20">
            <Crown className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Subscription</h1>
            <p className="text-xs text-muted-foreground">
              Manage your subscription and billing
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
            <Settings className="h-3.5 w-3.5" />
            Settings
          </Button>
        </div>
      </div>

      {/* Current Subscription Status */}
      <Card 
        className="relative overflow-hidden transition-all duration-300 mb-6 hover:shadow-xl hover:-translate-y-0.5 border-border/50 hover:border-primary/30"
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
        <CardHeader className="p-4 border-b border-border/40">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
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
              className="text-xs bg-success/10 text-success border-0"
            >
              {subscription.status === 'active' ? 'Active' : 'Cancelled'}
            </Badge>
          </div>
        </CardHeader>
         <CardContent className="p-4 space-y-6 bg-background rounded-b-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-base font-semibold mb-2">{subscription.plan.name}</h3>
              <p className="text-3xl font-bold text-primary mb-1">
                {subscription.plan.price === 0 ? 'Free' : formatCurrency(subscription.plan.price)}
                {subscription.plan.price > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">/{subscription.plan.interval}</span>
                )}
              </p>
              {subscription.plan.price > 0 && (
                <p className="text-sm text-muted-foreground">
                  Next billing: {formatDate(subscription.nextBillingDate)}
                </p>
              )}
            </div>
            
            <div>
              <h4 className="font-medium mb-2 text-sm">Payment Method</h4>
              {subscription.plan.price === 0 ? (
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm">No payment required</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      •••• •••• •••• {subscription.paymentMethod.last4}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Expires {subscription.paymentMethod.expiryMonth}/{subscription.paymentMethod.expiryYear}
                  </p>
                </>
              )}
            </div>
            
            <div>
              <h4 className="font-medium mb-2 text-sm">Billing Period</h4>
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
            {subscription.status === 'active' && subscription.plan.price > 0 ? (
              <Button 
                variant="outline" 
                onClick={handleCancelSubscription}
                disabled={isLoading}
                className="h-8 text-xs gap-2"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                Cancel Subscription
              </Button>
            ) : subscription.status === 'cancelled' ? (
              <Button 
                onClick={handleResumeSubscription}
                disabled={isLoading}
                className="h-8 text-xs gap-2"
              >
                <Check className="h-3.5 w-3.5" />
                Resume Subscription
              </Button>
            ) : null}
            {subscription.plan.price > 0 && (
              <Button variant="outline" className="h-8 text-xs gap-2">
                <ExternalLink className="h-3.5 w-3.5" />
                Update Payment Method
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan Features */}
      <motion.div layoutId={`card-features-${id}`}>
        <Card 
          onClick={() => setExpandedCard('features')}
          className="relative overflow-hidden transition-all duration-300 mb-6 hover:shadow-xl hover:-translate-y-0.5 border-border/50 hover:border-primary/30 cursor-pointer"
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
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="flex items-center gap-3">
              <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                <Check className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-base font-bold tracking-tight">Current Plan Features</div>
                <p className="text-xs text-muted-foreground mt-0.5 font-normal">Included in your subscription</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 bg-background rounded-b-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subscription.plan.features.slice(0, 4).map((feature, index) => (
                <div key={`${subscription.plan.id}-feature-preview-${index}-${feature.substring(0, 20)}`} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                  <Check className="h-4 w-4 text-success flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">Click to view all features</p>
          </CardContent>
        </Card>
      </motion.div>

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
        <CardHeader className="p-5 pb-3 border-b border-border/40">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-base font-bold tracking-tight">Available Plans</div>
                <p className="text-xs text-muted-foreground mt-0.5 font-normal">Choose your subscription tier</p>
              </div>
            </CardTitle>
            
            {/* Monthly/Yearly Toggle */}
            <div className="relative z-10 flex w-fit rounded-full bg-card border border-border p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`relative z-10 w-fit h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors ${
                  billingCycle === 'monthly' ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                {billingCycle === 'monthly' && (
                  <motion.span
                    layoutId="billing-indicator"
                    className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-primary/50 border-primary bg-gradient-to-t from-primary to-primary-dark"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative text-xs">Monthly</span>
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`relative z-10 w-fit h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors ${
                  billingCycle === 'yearly' ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                {billingCycle === 'yearly' && (
                  <motion.span
                    layoutId="billing-indicator"
                    className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-primary/50 border-primary bg-gradient-to-t from-primary to-primary-dark"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative flex items-center gap-2 text-xs">Yearly</span>
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid gap-4 md:col-span-4 lg:grid-cols-3">
            {availablePlans.map((plan) => {
              const planIcons = {
                'client_free': User,
                'client_professional': Building,
                'client_enterprise': Users
              };
              const Icon = planIcons[plan.id as keyof typeof planIcons] || User;
              const showChart = plan.id === 'client_professional' || plan.id === 'client_enterprise';
              
              return (
                <div 
                  key={plan.id}
                  className={`flex flex-col justify-between space-y-4 transition-all rounded-lg p-5 border bg-background hover:shadow-lg hover:-translate-y-0.5 duration-300 ${
                    plan.id === subscription.plan.id ? 'ring-2 ring-primary bg-primary/5 border-primary' : 'border-border/50 hover:border-primary/30'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="relative">
                      {plan.popular && (
                        <Badge className="absolute -top-3 -left-[2px] bg-primary text-primary-foreground text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base font-bold">{plan.name}</h2>
                        <div className="bg-primary/10 p-2.5 rounded-xl ring-1 ring-primary/20">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      <span className="block text-3xl font-bold text-primary tracking-tight">
                        {plan.price === 0 ? 'Free' : formatCurrency(billingCycle === 'yearly' ? plan.yearlyPrice : plan.price)}
                        {plan.price > 0 && (
                          <span className="text-sm font-normal text-muted-foreground">/{billingCycle === 'yearly' ? 'year' : plan.interval}</span>
                        )}
                      </span>
                      {billingCycle === 'yearly' && plan.price > 0 && (
                        <Badge className="mt-2 bg-success/10 text-success border-0 text-[10px]">
                          Save 2 months
                        </Badge>
                      )}
                      <p className="text-muted-foreground text-xs mt-2">
                        {plan.description}
                      </p>
                    </div>

                    {showChart && (
                      <div className="bg-muted/30 h-fit w-full rounded-lg border border-border/50 p-2">
                        <PlanChart planName={plan.name} />
                      </div>
                    )}

                    <ul className="text-muted-foreground space-y-2 text-xs">
                      {plan.features.slice(0, 5).map((feature, index) => (
                        <li key={`${plan.id}-feature-${index}-${feature.substring(0, 15)}`} className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {plan.features.length > 5 && (
                        <li className="text-xs text-primary font-medium ml-5">
                          +{plan.features.length - 5} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  {plan.id === subscription.plan.id ? (
                    <Button 
                      disabled 
                      variant="outline"
                      className="w-full h-9 text-xs bg-success/10 text-success border-success/30 hover:bg-success/10 cursor-default"
                    >
                      <Check className="h-3.5 w-3.5 mr-1.5" />
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full h-9 text-xs shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
                      onClick={() => handlePlanChange(plan.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : plan.price > subscription.plan.price ? 'Upgrade Plan' : 'Switch Plan'}
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
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
        className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 border-border/50 hover:border-primary/30"
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
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                  <CreditCard className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-base font-bold tracking-tight">Billing History</div>
                  <p className="text-xs text-muted-foreground mt-0.5 font-normal">Transaction records and invoices</p>
                </div>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 bg-background rounded-b-xl">
            <div className="overflow-hidden rounded-lg border border-border/50">
              <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-semibold w-8"></TableHead>
                  <TableHead className="text-xs font-semibold">Date</TableHead>
                  <TableHead className="text-xs font-semibold">Description</TableHead>
                  <TableHead className="text-xs font-semibold">Amount</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-xs font-semibold">Invoice</TableHead>
                  <TableHead className="text-xs font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscription.billingHistory.map((billing, index) => (
                  <React.Fragment key={`billing-${billing.date}-${billing.amount}-${index}`}>
                    <TableRow 
                      className="hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setExpandedBillingRow(expandedBillingRow === index ? null : index)}
                    >
                      <TableCell className="w-8">
                        {expandedBillingRow === index ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {formatDate(billing.date)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{billing.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-sm">
                        {billing.amount === 0 ? 'Free' : formatCurrency(billing.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={`text-xs ${
                            billing.status === 'paid' 
                              ? 'bg-success/10 text-success border-0' 
                              : 'bg-info/10 text-info border-0'
                          }`}
                        >
                          {billing.status === 'paid' ? 'Paid' : 'Free'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-mono">{billing.invoice}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                            <Download className="h-3 w-3" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                            <ExternalLink className="h-3 w-3" />
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Row Content */}
                    <AnimatePresence>
                      {expandedBillingRow === index && (
                        <TableRow>
                          <TableCell colSpan={7} className="p-0 border-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="p-6 bg-muted/20 space-y-4">
                                {/* Invoice Details */}
                                <div>
                                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <History className="h-4 w-4 text-primary" />
                                    Invoice Details
                                  </h4>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Invoice Number</p>
                                      <p className="text-sm font-mono font-medium">{billing.invoice}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Billing Period</p>
                                      <p className="text-sm font-medium">{billing.description}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
                                      <p className="text-sm font-medium">
                                        {billing.status === 'paid' ? 'Credit Card ••••4242' : 'N/A'}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Issue Date</p>
                                      <p className="text-sm font-medium">{formatDate(billing.date)}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                                      <p className="text-sm font-medium">{formatDate(billing.date)}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                                      <p className="text-sm font-bold text-primary">
                                        {billing.amount === 0 ? 'Free' : formatCurrency(billing.amount)}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Payment Details */}
                                {billing.status === 'paid' && (
                                  <div className="pt-4 border-t border-border/50">
                                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                      <CreditCard className="h-4 w-4 text-success" />
                                      Payment Information
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-xs text-muted-foreground mb-1">Transaction ID</p>
                                        <p className="text-sm font-mono">TXN-{billing.invoice.split('-')[2]}-ABC123</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground mb-1">Payment Date</p>
                                        <p className="text-sm font-medium">{formatDate(billing.date)}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Quick Actions */}
                                <div className="pt-4 border-t border-border/50 flex gap-2">
                                  <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
                                    <Download className="h-3.5 w-3.5" />
                                    Download PDF
                                  </Button>
                                  <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    View Full Invoice
                                  </Button>
                                  {billing.status === 'paid' && (
                                    <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
                                      <History className="h-3.5 w-3.5" />
                                      View Receipt
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">Click any row to view detailed invoice information</p>
        </CardContent>
      </Card>

      {/* Expanded Modals */}
      <AnimatePresence>
      {expandedCard && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 md:p-8">
            <motion.div
              ref={expandedRef}
              layoutId={`card-${expandedCard}-${id}`}
              className="w-full max-w-4xl bg-card rounded-xl shadow-2xl my-8"
            >
              {/* Features Modal */}
              {expandedCard === 'features' && (
                <div>
                  {/* Modal Header */}
                  <div className="sticky top-0 z-10 bg-gradient-to-r from-success to-success-foreground text-white p-6 rounded-t-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                          <Check className="h-8 w-8" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">Plan Features</h2>
                          <p className="text-white/80 mt-1">All features included in {subscription.plan.name}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedCard(null)}
                        className="text-white hover:bg-white/20"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 space-y-6">
                    {/* All Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {subscription.plan.features.map((feature, index) => (
                        <div key={`${subscription.plan.id}-modal-feature-${index}-${feature.substring(0, 20)}`} className="flex items-start gap-3 p-4 bg-success/5 rounded-lg border border-success/20">
                          <div className="bg-success/10 p-2 rounded-lg shrink-0">
                            <Check className="h-5 w-5 text-success" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{feature}</p>
                            <p className="text-xs text-muted-foreground mt-1">Included in your plan</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end pt-4 border-t">
                      <Button onClick={() => setExpandedCard(null)}>
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
    </div>
  );
}

