import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../1-HomePage/others/components/ui/card";
import { Button } from "../1-HomePage/others/components/ui/button";
import { Badge } from "../1-HomePage/others/components/ui/badge";
import { Separator } from "../1-HomePage/others/components/ui/separator";
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
  Building
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
    { date: new Date('2024-01-01'), amount: 299, status: 'paid', invoice: 'INV-001' },
    { date: new Date('2023-12-01'), amount: 299, status: 'paid', invoice: 'INV-002' },
    { date: new Date('2023-11-01'), amount: 299, status: 'paid', invoice: 'INV-003' }
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl ring-1 ring-primary/20">
            <Crown className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Subscription</h1>
            <p className="text-xs text-muted-foreground">Manage your subscription and billing</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Billing History
          </Button>
        </div>
      </div>

      {/* Current Subscription Status */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Current Subscription
            </CardTitle>
            <Badge 
              variant={subscription.status === 'active' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {subscription.status === 'active' ? 'Active' : 'Cancelled'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Plan Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subscription.plan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availablePlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative ${plan.popular ? 'ring-2 ring-primary' : ''} ${plan.id === subscription.plan.id ? 'bg-primary/5' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                    <span className="text-sm text-muted-foreground">/{plan.interval}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.id === subscription.plan.id ? (
                    <Button disabled className="w-full">
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      className="w-full gap-2"
                      onClick={() => handlePlanChange(plan.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Upgrade Plan'}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscription.billingHistory.map((billing, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {formatCurrency(billing.amount)} - {formatDate(billing.date)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Invoice: {billing.invoice}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={billing.status === 'paid' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {billing.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
