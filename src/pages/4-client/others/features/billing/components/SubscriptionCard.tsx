import { useState } from 'react';
import { 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Crown,
  Zap,
  Users,
  Building
} from 'lucide-react';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { PLAN_PRICING, PLAN_DESCRIPTIONS } from '@/features/billing/lib/plans';
import { Subscription } from '@/features/billing/services/stripe-service';

interface SubscriptionCardProps {
  subscription: Subscription;
  onManageSubscription: () => void;
  onUpgrade: () => void;
  onCancel: () => void;
}

const PLAN_ICONS = {
  client_monthly_45: Building,
  engineer_monthly_60: Zap,
  enterprise_monthly_120: Users,
  admin_free: Crown,
};

const STATUS_CONFIG = {
  active: {
    color: 'bg-green-500',
    icon: CheckCircle,
    label: 'Active',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
  },
  trialing: {
    color: 'bg-blue-500',
    icon: Clock,
    label: 'Trial',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
  },
  past_due: {
    color: 'bg-red-500',
    icon: AlertTriangle,
    label: 'Past Due',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
  },
  canceled: {
    color: 'bg-gray-500',
    icon: Clock,
    label: 'Canceled',
    textColor: 'text-gray-700',
    bgColor: 'bg-gray-50',
  },
};

export function SubscriptionCard({ 
  subscription, 
  onManageSubscription, 
  onUpgrade, 
  onCancel 
}: SubscriptionCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const planName = subscription.plan.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const pricing = PLAN_PRICING[subscription.plan as keyof typeof PLAN_PRICING];
  const description = PLAN_DESCRIPTIONS[subscription.plan as keyof typeof PLAN_DESCRIPTIONS];
  const statusConfig = STATUS_CONFIG[subscription.status];
  const Icon = PLAN_ICONS[subscription.plan as keyof typeof PLAN_ICONS] || Building;
  
  // Calculate days remaining in current period
  const currentPeriodEnd = new Date(subscription.currentPeriodEnd);
  const now = new Date();
  const daysRemaining = Math.ceil((currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const daysInPeriod = Math.ceil((currentPeriodEnd.getTime() - new Date(subscription.currentPeriodStart).getTime()) / (1000 * 60 * 60 * 24));
  const progressPercentage = Math.max(0, Math.min(100, ((daysInPeriod - daysRemaining) / daysInPeriod) * 100));

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      await onManageSubscription();
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">{planName}</CardTitle>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          
          <Badge 
            className={`${statusConfig.bgColor} ${statusConfig.textColor} border-0`}
          >
            <statusConfig.icon className="w-3 h-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Pricing and Billing Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Current Price</p>
            <p className="text-2xl font-bold">
              {pricing.amount === 0 ? 'Free' : `SAR ${pricing.amount}`}
              {pricing.amount > 0 && <span className="text-sm font-normal text-muted-foreground">/{pricing.interval}</span>}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Next Billing</p>
            <p className="font-semibold">
              {subscription.status === 'canceled' ? 'No renewal' : formatDate(subscription.currentPeriodEnd)}
            </p>
          </div>
        </div>

        {/* Billing Progress */}
        {subscription.status === 'active' && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Billing Cycle Progress</span>
              <span className="font-medium">{daysRemaining} days remaining</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {/* Cancellation Notice */}
        {subscription.cancelAtPeriodEnd && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">Subscription Canceled</p>
                <p className="text-sm text-orange-700">
                  Your subscription will end on {formatDate(subscription.currentPeriodEnd)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status-specific messages */}
        {subscription.status === 'past_due' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Payment Required</p>
                <p className="text-sm text-red-700">
                  Please update your payment method to continue your subscription
                </p>
              </div>
            </div>
          </div>
        )}

        {subscription.status === 'trialing' && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Trial Period</p>
                <p className="text-sm text-blue-700">
                  You're currently in your free trial period
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleManageSubscription}
            disabled={isLoading}
            className="flex-1"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {isLoading ? 'Loading...' : 'Manage Billing'}
          </Button>
          
          {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
            <>
              <Button
                variant="outline"
                onClick={onUpgrade}
                className="flex-1"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
              
              <Button
                variant="outline"
                onClick={onCancel}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Cancel
              </Button>
            </>
          )}
        </div>

        {/* Subscription Details */}
        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subscription ID:</span>
            <span className="font-mono text-xs">{subscription.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Started:</span>
            <span>{formatDate(subscription.createdAt)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Period:</span>
            <span>
              {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

