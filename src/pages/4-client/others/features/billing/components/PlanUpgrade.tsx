import { useState } from 'react';
import { 
  Check, 
  Crown, 
  Zap, 
  Users, 
  Building,
  ArrowRight,
  Star,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/pages/1-HomePage/others/components/ui/dialog';
import { PLAN_PRICING, PLAN_DESCRIPTIONS, PLAN_FEATURES } from '../lib/plans';

interface PlanUpgradeProps {
  currentPlan: string;
  onPlanSelect: (plan: string) => void;
  isLoading?: boolean;
}

const PLANS = [
  {
    id: 'client_monthly_45',
    name: 'Client',
    icon: Building,
    color: 'bg-primary',
    features: [
      'Unlimited Job Posting',
      'Smart Quote Management',
      'Secure Escrow System',
      'ZATCA Compliance',
      'Project Tracking',
      'Rich Communication',
      'Geo-Verified Check-ins',
      'Bilingual Support',
      'Performance Analytics',
      '24/7 Support'
    ],
    popular: false
  },
  {
    id: 'engineer_monthly_60',
    name: 'Engineer',
    icon: Zap,
    color: 'bg-primary',
    features: [
      'Smart Job Matching',
      'Quote Management',
      'Geofenced Check-ins',
      'Deliverables Hub',
      'Instant Payouts',
      'Tax Invoice Generation',
      'Portfolio & Reviews',
      'Earnings Dashboard',
      'Bilingual Communication',
      '24/7 Support',
      'Mobile App Access'
    ],
    popular: true
  },
  {
    id: 'enterprise_monthly_120',
    name: 'Enterprise',
    icon: Users,
    color: 'bg-primary',
    features: [
      'Advanced RFP Management',
      'Team Management',
      'Portfolio Analytics',
      'Enterprise Security',
      'Custom Integrations',
      'Priority Support',
      'Consolidated Billing',
      'Advanced Reporting',
      'Vendor Management',
      'White-Label Solutions',
      'API Access'
    ],
    popular: false
  }
];

export function PlanUpgrade({ currentPlan, onPlanSelect, isLoading = false }: PlanUpgradeProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleUpgrade = () => {
    if (selectedPlan) {
      onPlanSelect(selectedPlan);
      setIsOpen(false);
    }
  };

  const getPlanComparison = () => {
    const currentPlanFeatures = PLAN_FEATURES[currentPlan as keyof typeof PLAN_FEATURES] || [];
    
    return PLANS.map(plan => {
      const planFeatures = PLAN_FEATURES[plan.id as keyof typeof PLAN_FEATURES] || [];
      const newFeatures = planFeatures.filter(feature => !currentPlanFeatures.includes(feature));
      const sharedFeatures = planFeatures.filter(feature => currentPlanFeatures.includes(feature));
      
      return {
        ...plan,
        newFeatures,
        sharedFeatures,
        hasUpgrade: plan.id !== currentPlan && newFeatures.length > 0
      };
    });
  };

  const planComparison = getPlanComparison();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Crown className="w-4 h-4 mr-2" />
          Upgrade Plan
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Choose Your New Plan
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            Upgrade to unlock more features and capabilities
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planComparison.map((plan) => {
              const Icon = plan.icon;
              const pricing = PLAN_PRICING[plan.id as keyof typeof PLAN_PRICING];
              const description = PLAN_DESCRIPTIONS[plan.id as keyof typeof PLAN_DESCRIPTIONS];
              const isCurrentPlan = plan.id === currentPlan;
              const isSelected = selectedPlan === plan.id;
              
              return (
                <Card 
                  key={plan.id}
                  className={`relative cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'ring-2 ring-primary shadow-lg scale-105' 
                      : 'hover:shadow-md'
                  } ${plan.popular ? 'border-primary/20' : ''} ${
                    isCurrentPlan ? 'opacity-75 bg-muted/50' : ''
                  }`}
                  onClick={() => !isCurrentPlan && handlePlanSelect(plan.id)}
                >
                  {plan.popular && !isCurrentPlan && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  
                  {isCurrentPlan && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white">
                      <Check className="w-3 h-3 mr-1" />
                      Current Plan
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-primary">
                        SAR {pricing.amount}
                        <span className="text-lg font-normal text-muted-foreground">/{pricing.interval}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* New Features */}
                    {plan.newFeatures.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                          <Zap className="w-4 h-4 mr-1" />
                          New Features
                        </h4>
                        <div className="space-y-2">
                          {plan.newFeatures.slice(0, 4).map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm">{feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                            </div>
                          ))}
                          {plan.newFeatures.length > 4 && (
                            <div className="text-xs text-muted-foreground">
                              +{plan.newFeatures.length - 4} more features
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Shared Features */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-muted-foreground mb-2">
                        Included Features
                      </h4>
                      <div className="space-y-2">
                        {plan.sharedFeatures.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                          </div>
                        ))}
                        {plan.sharedFeatures.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{plan.sharedFeatures.length - 3} more features
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      className={`w-full ${
                        isCurrentPlan 
                          ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                          : isSelected 
                            ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                            : 'bg-background hover:bg-background/80 text-foreground'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isCurrentPlan) {
                          handlePlanSelect(plan.id);
                        }
                      }}
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan ? (
                        'Current Plan'
                      ) : isSelected ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Selected
                        </>
                      ) : (
                        'Select Plan'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Upgrade Button */}
          {selectedPlan && selectedPlan !== currentPlan && (
            <div className="text-center pt-6 border-t">
              <Button
                size="lg"
                onClick={handleUpgrade}
                disabled={isLoading}
                className="px-8 py-3 text-lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Upgrade to {planComparison.find(p => p.id === selectedPlan)?.name}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
              
              <p className="text-sm text-muted-foreground mt-2">
                You'll be charged immediately with proration for the remaining billing period
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

