import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BillingDashboard } from '@/components/billing/BillingDashboard';
import { CheckoutFlow } from '@/components/billing/CheckoutFlow';
import { AccountTypeSelection } from '@/pages/AccountTypeSelection';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function BillingPage() {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState<'dashboard' | 'plans' | 'checkout'>('dashboard');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Check URL parameters for checkout flow
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');
  const activated = searchParams.get('activated');

  useEffect(() => {
    if (success) {
      // Payment was successful, show success message
      setCurrentStep('dashboard');
      // You might want to show a toast notification here
    } else if (canceled) {
      // Payment was canceled, return to plans
      setCurrentStep('plans');
    } else if (activated) {
      // Free plan was activated
      setCurrentStep('dashboard');
    }
  }, [success, canceled, activated]);

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    setCurrentStep('checkout');
  };

  const handleBackToPlans = () => {
    setCurrentStep('plans');
  };

  const handleBackToDashboard = () => {
    setCurrentStep('dashboard');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {currentStep === 'dashboard' && (
          <div className="container mx-auto px-4 py-8">
            <BillingDashboard />
          </div>
        )}

        {currentStep === 'plans' && (
          <div className="container mx-auto px-4 py-8">
            <AccountTypeSelection />
          </div>
        )}

        {currentStep === 'checkout' && selectedPlan && (
          <CheckoutFlow
            selectedPlan={selectedPlan}
            onBack={handleBackToPlans}
          />
        )}
      </div>
    </AuthGuard>
  );
}
