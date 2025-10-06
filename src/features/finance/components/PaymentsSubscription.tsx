import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { useAuthStore } from '@/stores/auth';
import { BillingDashboard } from '@/features/billing/components/BillingDashboard';
import { PlanUpgrade } from '@/features/billing/components/PlanUpgrade';
import { SubscriptionCard } from '@/features/billing/components/SubscriptionCard';

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
    interval: 'month',
    features: [
      'Unlimited job applications',
      'Priority support',
      'Advanced analytics',
      'Custom portfolio',
      'Direct client messaging'
    ]
  },
  nextBillingDate: new Date('2024-02-01'),
  amount: 299,
  currency: 'SAR'
};

const planFeatures = {
  free: [
    'Up to 5 job applications/month',
    'Basic profile',
    'Community support'
  ],
  engineer_pro: [
    'Unlimited job applications',
    'Priority support',
    'Advanced analytics',
    'Custom portfolio',
    'Direct client messaging',
    'Featured profile listing'
  ],
  engineer_premium: [
    'Everything in Pro',
    'Personal project manager',
    'Exclusive job opportunities',
    'Priority verification',
    'Custom domain',
    'API access'
  ]
};

export function PaymentsSubscription() {
  const { profile } = useAuthStore();
  const [subscription, setSubscription] = useState(mockSubscription);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock function to handle plan changes
  const handlePlanChange = async (newPlan: string) => {
    setLoading(true);
    try {
      // In a real app, this would call your billing API
      console.log(`Upgrading to plan: ${newPlan}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update subscription
      setSubscription(prev => ({
        ...prev,
        plan: {
          ...prev.plan,
          id: newPlan,
          name: newPlan === 'engineer_pro' ? 'Engineer Pro' : 'Engineer Premium',
          price: newPlan === 'engineer_pro' ? 299 : 599
        }
      }));
      
      setShowUpgrade(false);
    } catch (error) {
      console.error('Failed to change plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = () => {
    // In a real app, this would redirect to Stripe Customer Portal
    window.open('https://billing.stripe.com/p/login/test_customer_portal', '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'past_due':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'canceled':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Zap className="w-5 h-5" />;
      case 'engineer_pro':
        return <Star className="w-5 h-5" />;
      case 'engineer_premium':
        return <Crown className="w-5 h-5" />;
      default:
        return <Building className="w-5 h-5" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free':
        return 'bg-muted text-muted-foreground';
      case 'engineer_pro':
        return 'bg-primary/10 text-primary';
      case 'engineer_premium':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPlanColor(subscription.plan.id)}`}>
                  {getPlanIcon(subscription.plan.id)}
                </div>
                <div>
                  <CardTitle className="text-xl">{subscription.plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(subscription.plan.price)}/{subscription.plan.interval}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(subscription.status)}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Plan Features */}
            <div>
              <h4 className="font-medium mb-2">Current Plan Features</h4>
              <ul className="space-y-2">
                {subscription.plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Billing Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Next billing date</p>
                <p className="font-medium">{formatDate(subscription.nextBillingDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">{formatCurrency(subscription.amount, subscription.currency)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => setShowUpgrade(true)}
                className="flex-1"
              >
                <Crown className="w-4 h-4 mr-2" />
                Change Plan
              </Button>
              <Button 
                variant="outline" 
                onClick={handleManageBilling}
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Manage Billing
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setShowUpgrade(true)}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleManageBilling}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Payment Methods
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Billing History
              </Button>
            </CardContent>
          </Card>

          {/* Billing Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Billing Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Your subscription will renew on {formatDate(subscription.nextBillingDate)}
                </p>
                <p className="text-muted-foreground">
                  You'll be charged {formatCurrency(subscription.amount, subscription.currency)} 
                  on the next billing cycle.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Available Plans (when upgrade is shown) */}
      {showUpgrade && (
        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose the plan that best fits your needs
            </p>
          </CardHeader>
          <CardContent>
            <PlanUpgrade 
              currentPlan={subscription.plan.id}
              onPlanSelect={handlePlanChange}
              loading={loading}
            />
          </CardContent>
        </Card>
      )}

      {/* Subscription Details */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Subscription ID</p>
              <p className="font-mono text-sm">{subscription.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{subscription.status}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Period</p>
              <p className="font-medium">
                {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Plan Type</p>
              <p className="font-medium">{subscription.plan.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
