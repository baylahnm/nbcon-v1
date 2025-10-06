import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Calendar, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/stores/auth';
import { SubscriptionCard } from './SubscriptionCard';
import { PlanUpgrade } from './PlanUpgrade';
import { 
  getCustomerSubscriptions, 
  createBillingPortalSession,
  cancelSubscription,
  updateSubscription,
  getPaymentMethods,
  Subscription,
  PaymentMethod
} from '@/features/billing/services/stripe-service';
import { getPriceIdForPlan, isPaidPlan } from '@/features/billing/services/stripe-service';

export function BillingDashboard() {
  const { user } = useAuthStore();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isManaging, setIsManaging] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadBillingData();
    }
  }, [user?.id]);

  const loadBillingData = async () => {
    try {
      setIsLoading(true);
      const [subscriptionsData, paymentMethodsData] = await Promise.all([
        getCustomerSubscriptions(user!.id),
        getPaymentMethods(user!.id)
      ]);
      
      setSubscriptions(subscriptionsData);
      setPaymentMethods(paymentMethodsData);
    } catch (error) {
      console.error('Error loading billing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      setIsManaging(true);
      const portalUrl = await createBillingPortalSession(user!.id, window.location.href);
      window.location.href = portalUrl;
    } catch (error) {
      console.error('Error opening billing portal:', error);
    } finally {
      setIsManaging(false);
    }
  };

  const handleUpgrade = async (newPlan: string) => {
    try {
      const currentSubscription = subscriptions.find(s => s.status === 'active');
      if (!currentSubscription) return;

      const newPriceId = getPriceIdForPlan(newPlan);
      await updateSubscription(currentSubscription.id, newPriceId);
      
      // Reload data
      await loadBillingData();
    } catch (error) {
      console.error('Error upgrading subscription:', error);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const currentSubscription = subscriptions.find(s => s.status === 'active');
      if (!currentSubscription) return;

      await cancelSubscription(currentSubscription.id, true);
      await loadBillingData();
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

  const currentSubscription = subscriptions.find(s => s.status === 'active' || s.status === 'trialing');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading billing information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your subscription and payment methods</p>
        </div>
        
        <Button onClick={handleManageBilling} disabled={isManaging}>
          <CreditCard className="w-4 h-4 mr-2" />
          {isManaging ? 'Opening...' : 'Manage Billing'}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold">
                  {currentSubscription?.status === 'active' ? 'Active' : 
                   currentSubscription?.status === 'trialing' ? 'Trial' : 'Inactive'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Next Billing</p>
                <p className="font-semibold">
                  {currentSubscription ? 
                    new Date(currentSubscription.currentPeriodEnd).toLocaleDateString() : 
                    'N/A'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Payment Methods</p>
                <p className="font-semibold">{paymentMethods.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="font-semibold">
                  {currentSubscription?.plan ? 
                    currentSubscription.plan.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
                    'Free'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="subscription" className="space-y-6">
        <TabsList>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          {currentSubscription ? (
            <SubscriptionCard
              subscription={currentSubscription}
              onManageSubscription={handleManageBilling}
              onUpgrade={() => {/* Handled by PlanUpgrade component */}}
              onCancel={handleCancelSubscription}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Active Subscription</h3>
                <p className="text-muted-foreground mb-6">
                  You're currently on the free plan. Upgrade to unlock more features.
                </p>
                <PlanUpgrade
                  currentPlan="free"
                  onPlanSelect={handleUpgrade}
                  isLoading={isManaging}
                />
              </CardContent>
            </Card>
          )}
          
          {currentSubscription && (
            <Card>
              <CardHeader>
                <CardTitle>Upgrade Your Plan</CardTitle>
                <p className="text-muted-foreground">
                  Unlock more features by upgrading to a higher plan
                </p>
              </CardHeader>
              <CardContent>
                <PlanUpgrade
                  currentPlan={currentSubscription.plan}
                  onPlanSelect={handleUpgrade}
                  isLoading={isManaging}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payment-methods" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <p className="text-muted-foreground">
                Manage your saved payment methods
              </p>
            </CardHeader>
            <CardContent>
              {paymentMethods.length > 0 ? (
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {method.card?.brand.toUpperCase()} •••• {method.card?.last4}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expires {method.card?.expMonth}/{method.card?.expYear}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {method.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Payment Methods</h3>
                  <p className="text-muted-foreground mb-4">
                    Add a payment method to manage your subscription
                  </p>
                  <Button onClick={handleManageBilling}>
                    Add Payment Method
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <p className="text-muted-foreground">
                Download your past invoices and receipts
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Download className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Invoices Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Your invoice history will appear here once you have active subscriptions
                </p>
                <Button onClick={handleManageBilling} variant="outline">
                  View All Invoices
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage Tab */}
        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
                <p className="text-muted-foreground">
                  Track your usage across different features
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Jobs Posted</span>
                    <span>12 / Unlimited</span>
                  </div>
                  <Progress value={12} max={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Messages Sent</span>
                    <span>45 / Unlimited</span>
                  </div>
                  <Progress value={45} max={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Storage Used</span>
                    <span>2.1 GB / 10 GB</span>
                  </div>
                  <Progress value={21} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Summary</CardTitle>
                <p className="text-muted-foreground">
                  Your current billing cycle overview
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Plan</span>
                  <span className="font-medium">
                    {currentSubscription?.plan ? 
                      currentSubscription.plan.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
                      'Free Plan'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Billing Cycle</span>
                  <span className="font-medium">Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next Charge</span>
                  <span className="font-medium">
                    {currentSubscription ? 
                      new Date(currentSubscription.currentPeriodEnd).toLocaleDateString() : 
                      'N/A'
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
