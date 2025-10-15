import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BillingDashboard } from '../components/BillingDashboard';
import { CheckoutFlow } from '../components/CheckoutFlow';
// TODO: These auth components don't exist yet - to be implemented
// import { AccountTypeSelection } from '../../../../2-auth/others/features/auth/pages/AccountTypeSelection';
// import { AuthGuard } from '../../../../2-auth/others/features/auth/guards/AuthGuard';

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
    <div className="min-h-screen bg-background">
      {currentStep === 'dashboard' && (
        <div className="container mx-auto px-4 py-8">
          <BillingDashboard />
        </div>
      )}

      {currentStep === 'plans' && (
        <div className="container mx-auto px-4 py-8">
          <p>Account Type Selection - to be implemented</p>
        </div>
      )}

      {currentStep === 'checkout' && selectedPlan && (
        <CheckoutFlow
          selectedPlan={selectedPlan}
          onBack={handleBackToPlans}
        />
      )}
    </div>
  );
}

