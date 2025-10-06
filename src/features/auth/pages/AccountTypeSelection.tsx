import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  User, 
  Users, 
  Shield, 
  ArrowRight, 
  Check,
  Star,
  Zap,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PLAN_PRICING, PLAN_DESCRIPTIONS } from '@/features/billing/lib/plans';

const ACCOUNT_TYPES = [
  { 
    id: 'client', 
    name: 'Client', 
    plan: 'client_monthly_45',
    icon: Building,
    color: 'bg-blue-500',
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
    id: 'engineer', 
    name: 'Engineer', 
    plan: 'engineer_monthly_60',
    icon: User,
    color: 'bg-green-500',
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
    id: 'enterprise', 
    name: 'Enterprise', 
    plan: 'enterprise_monthly_120',
    icon: Users,
    color: 'bg-purple-500',
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
  },
  { 
    id: 'admin', 
    name: 'Admin', 
    plan: 'admin_free',
    icon: Shield,
    color: 'bg-red-500',
    features: [
      'All Platform Features',
      'User Management',
      'Billing Oversight',
      'System Administration',
      'Analytics Dashboard',
      'Security Controls'
    ],
    popular: false
  }
];

export default function AccountTypeSelection() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleContinue = async () => {
    if (!selectedType) return;
    
    setIsLoading(true);
    
    try {
      // Navigate to appropriate signup flow
      switch (selectedType) {
        case 'client':
          navigate('/signup/client');
          break;
        case 'engineer':
          navigate('/signup/engineer');
          break;
        case 'enterprise':
          navigate('/signup/enterprise');
          break;
        case 'admin':
          navigate('/signup/admin');
          break;
        default:
          navigate('/auth');
      }
    } catch (error) {
      console.error('Error selecting account type:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <Button
            variant="ghost"
            onClick={handleBackToHome}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            ← Back to Home
          </Button>
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Choose Your Account Type
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the plan that best fits your needs. You can upgrade or change plans anytime.
          </p>
        </div>

        {/* Account Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {ACCOUNT_TYPES.map((type) => {
            const Icon = type.icon;
            const pricing = PLAN_PRICING[type.plan];
            const description = PLAN_DESCRIPTIONS[type.plan];
            
            return (
              <Card 
                key={type.id}
                className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedType === type.id 
                    ? 'ring-2 ring-primary shadow-lg scale-105' 
                    : 'hover:shadow-md'
                } ${type.popular ? 'border-primary/20' : ''}`}
                onClick={() => handleSelectType(type.id)}
              >
                {type.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${type.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold">{type.name}</CardTitle>
                  
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-primary">
                      {pricing.amount === 0 ? 'Free' : `SAR ${pricing.amount}`}
                      {pricing.amount > 0 && <span className="text-lg font-normal text-muted-foreground">/{pricing.interval}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3 mb-6">
                    {type.features.slice(0, 6).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                    {type.features.length > 6 && (
                      <div className="text-xs text-muted-foreground">
                        +{type.features.length - 6} more features
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className={`w-full ${
                      selectedType === type.id 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectType(type.id);
                    }}
                  >
                    {selectedType === type.id ? (
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

        {/* Continue Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedType || isLoading}
            className="px-8 py-3 text-lg"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
          
          {selectedType && (
            <p className="text-sm text-muted-foreground mt-4">
              You selected the <strong>{ACCOUNT_TYPES.find(t => t.id === selectedType)?.name}</strong> plan
            </p>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Instant Activation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
