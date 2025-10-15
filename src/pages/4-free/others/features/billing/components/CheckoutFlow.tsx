import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Lock, 
  Shield, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { useAuthStore } from '../../../../../2-auth/others/stores/auth';
import { 
  redirectToCheckout, 
  getPriceIdForPlan, 
  getStripeErrorMessage,
  isPaidPlan 
} from '../services/stripe-service';
import { PLAN_PRICING, PLAN_DESCRIPTIONS } from '../lib/plans';

interface CheckoutFlowProps {
  selectedPlan: string;
  onBack: () => void;
}

export function CheckoutFlow({ selectedPlan, onBack }: CheckoutFlowProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'review' | 'processing' | 'success' | 'error'>('review');

  const pricing = PLAN_PRICING[selectedPlan as keyof typeof PLAN_PRICING];
  const description = PLAN_DESCRIPTIONS[selectedPlan as keyof typeof PLAN_DESCRIPTIONS];
  const priceId = getPriceIdForPlan(selectedPlan);
  const isPaid = isPaidPlan(selectedPlan);

  const handleCheckout = async () => {
    if (!user?.id || !priceId) {
      setError('Missing user information or plan details');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setStep('processing');

      const successUrl = `${window.location.origin}/billing?success=true&plan=${selectedPlan}`;
      const cancelUrl = `${window.location.origin}/billing?canceled=true`;

      await redirectToCheckout(priceId, user.id, successUrl, cancelUrl);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(getStripeErrorMessage(err));
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFreePlanActivation = async () => {
    try {
      setIsLoading(true);
      setStep('processing');
      
      // For free plans, we can activate immediately
      // This would typically involve updating the user's profile in the database
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setStep('success');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/billing?activated=true');
      }, 3000);
    } catch (err: any) {
      setError('Failed to activate free plan');
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepProgress = () => {
    switch (step) {
      case 'review': return 33;
      case 'processing': return 66;
      case 'success': return 100;
      case 'error': return 66;
      default: return 33;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'review': return 'Review Your Order';
      case 'processing': return 'Processing Payment';
      case 'success': return 'Success!';
      case 'error': return 'Payment Failed';
      default: return 'Review Your Order';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'review': return 'Review your plan selection and proceed to payment';
      case 'processing': return 'Please wait while we process your payment...';
      case 'success': return 'Your subscription has been activated successfully!';
      case 'error': return 'There was an issue processing your payment';
      default: return 'Review your plan selection and proceed to payment';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plans
          </Button>
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {getStepTitle()}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {getStepDescription()}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <Progress value={getStepProgress()} className="h-2" />
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2 text-green-500" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plan Details */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedPlan.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Plan
                  </h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {pricing.amount === 0 ? 'Free' : `SAR ${pricing.amount}`}
                  </p>
                  {pricing.amount > 0 && (
                    <p className="text-sm text-muted-foreground">/{pricing.interval}</p>
                  )}
                </div>
              </div>

              {/* Billing Details */}
              <div className="space-y-4">
                <h4 className="font-semibold">What's included:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Full access to all plan features</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">24/7 customer support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Cancel anytime</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">30-day money-back guarantee</span>
                  </li>
                </ul>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold">
                    {pricing.amount === 0 ? 'Free' : `SAR ${pricing.amount}`}
                  </span>
                </div>
                {pricing.amount > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Billed monthly • Cancel anytime
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Form or Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                {isPaid ? 'Payment Information' : 'Activation'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 'review' && (
                <>
                  {isPaid ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-800">Secure Payment</p>
                            <p className="text-sm text-blue-700">
                              You'll be redirected to Stripe for secure payment processing
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handleCheckout}
                        disabled={isLoading}
                        className="w-full py-3 text-lg"
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Continue to Payment
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium text-green-800">Free Plan</p>
                            <p className="text-sm text-green-700">
                              No payment required. Click below to activate your free plan.
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handleFreePlanActivation}
                        disabled={isLoading}
                        className="w-full py-3 text-lg"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Activate Free Plan
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  )}
                </>
              )}

              {step === 'processing' && (
                <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Processing...</h3>
                  <p className="text-muted-foreground">
                    {isPaid ? 'Please wait while we process your payment' : 'Activating your plan...'}
                  </p>
                </div>
              )}

              {step === 'success' && (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-semibold mb-2">Success!</h3>
                  <p className="text-muted-foreground mb-4">
                    Your subscription has been activated successfully.
                  </p>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Plan Active
                  </Badge>
                </div>
              )}

              {step === 'error' && (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                  <h3 className="text-lg font-semibold mb-2">Payment Failed</h3>
                  <p className="text-muted-foreground mb-4">
                    {error || 'There was an issue processing your payment'}
                  </p>
                  <Button onClick={() => setStep('review')} variant="outline">
                    Try Again
                  </Button>
                </div>
              )}

              {/* Security Notice */}
              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>30-Day Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

