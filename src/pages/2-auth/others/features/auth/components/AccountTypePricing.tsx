'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNamespace } from '@/pages/1-HomePage/others/lib/i18n/useNamespace';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { CheckCircle, Building, User, Users, Shield, ArrowRight, Star } from 'lucide-react';
import { LanguageSwitcher } from '@/pages/1-HomePage/others/components/i18n/LanguageSwitcher';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/pages/1-HomePage/others/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/pages/1-HomePage/others/components/ui/chart';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { PLAN_PRICING, PLAN_DESCRIPTIONS } from '@/pages/4-client/others/features/billing/lib/plans';

const ACCOUNT_TYPES = {
  admin: {
    id: 'admin',
    name: 'Admin',
    plan: 'admin_free',
    icon: Shield,
    color: 'bg-destructive',
    description: 'System administration with full platform access',
    features: [
      'All Platform Features',
      'User Management',
      'Billing Oversight',
      'System Administration',
      'Analytics Dashboard',
      'Security Controls'
    ]
  },
  client: {
    id: 'client',
    name: 'Client',
    plan: 'client_monthly_45',
    icon: Building,
    color: 'bg-primary',
    description: 'Perfect for owners, contractors, and SMBs',
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
    showChart: false
  },
  engineer: {
    id: 'engineer',
    name: 'Engineer',
    plan: 'engineer_monthly_60',
    icon: User,
    color: 'bg-primary',
    description: 'Perfect for certified engineers building pipeline',
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
    popular: true,
    showChart: true
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    plan: 'enterprise_monthly_120',
    icon: Users,
    color: 'bg-primary',
    description: 'For large developers and enterprises',
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
    showChart: true
  }
};

export function AccountTypePricing() {
  const navigate = useNavigate();
  const ready = useNamespace(['auth', 'common']);
  const { t } = useTranslation(['auth', 'common']);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!ready) return null;

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleContinue = async () => {
    if (!selectedType) return;
    
    setIsLoading(true);
    
    try {
      navigate(`/signup/${selectedType}`);
    } catch (error) {
      console.error('Error selecting account type:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  const adminType = ACCOUNT_TYPES.admin;
  const adminPricing = PLAN_PRICING[adminType.plan];
  const AdminIcon = adminType.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center px-4 py-10">
      <div className="mx-auto max-w-7xl w-full">
        {/* Language Switcher & Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBackToHome}
            className="text-muted-foreground hover:text-foreground"
          >
            ← {t('auth:accountType.backToHome')}
          </Button>
          <LanguageSwitcher />
        </div>

        {/* Heading */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t('auth:accountType.title')}
          </h1>
          <p className="text-muted-foreground mt-4 text-sm md:text-base">
            {t('auth:accountType.subtitle')}
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="bg-card grid rounded-xl border shadow-xl md:grid-cols-6">
          {/* Admin Plan (Free) */}
          <div className={`flex flex-col justify-between border-b p-6 md:col-span-2 md:border-r md:border-b-0 transition-all ${
            selectedType === adminType.id ? 'ring-2 ring-primary bg-primary/5' : ''
          }`}>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="inline rounded-[2px] p-1 text-xl font-semibold">
                    {t('auth:accountType.admin.name')}
                  </h2>
                  <div className={`w-10 h-10 ${adminType.color} rounded-lg flex items-center justify-center`}>
                    <AdminIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <span className="my-3 block text-3xl font-bold text-primary">
                  {t('auth:accountType.free')}
                </span>
                <p className="text-muted-foreground text-sm">
                  {t('auth:accountType.admin.description')}
                </p>
              </div>

              <Button 
                variant={selectedType === adminType.id ? 'default' : 'outline'}
                className="w-full"
                onClick={() => handleSelectType(adminType.id)}
              >
                {selectedType === adminType.id ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t('auth:accountType.selected')}
                  </>
                ) : (
                  t('auth:accountType.selectPlan')
                )}
              </Button>

              <div className="bg-border my-6 h-px w-full" />

              <ul className="text-muted-foreground space-y-3 text-sm">
                {['allPlatform', 'userManagement', 'billingOversight', 'systemAdmin', 'analytics', 'security'].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    {t(`auth:accountType.admin.features.${feature}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Paid Plans Grid */}
          <div className="grid gap-6 p-6 md:col-span-4 lg:grid-cols-3">
            {(['client', 'engineer', 'enterprise'] as const).map((typeId) => {
              const type = ACCOUNT_TYPES[typeId];
              const pricing = PLAN_PRICING[type.plan];
              const Icon = type.icon;
              const featureKeys = typeId === 'client' 
                ? ['unlimitedJobs', 'quoteManagement', 'escrow', 'zatca', 'projectTracking', 'communication', 'geoVerified', 'bilingual', 'analytics', 'support']
                : typeId === 'engineer'
                ? ['jobMatching', 'quoteManagement', 'geofenced', 'deliverables', 'instantPayouts', 'taxInvoice', 'portfolio', 'earnings', 'bilingual', 'support', 'mobileApp']
                : ['rfp', 'teamManagement', 'portfolioAnalytics', 'enterpriseSecurity', 'customIntegrations', 'prioritySupport', 'consolidatedBilling', 'advancedReporting', 'vendorManagement', 'whiteLabel', 'apiAccess'];
              
              return (
                <div 
                  key={type.id}
                  className={`flex flex-col justify-between space-y-4 transition-all rounded-lg p-4 border bg-background ${
                    selectedType === type.id ? 'ring-2 ring-primary bg-primary/5 border-primary' : 'border-border hover:bg-muted/30'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="relative">
                      {type.popular && (
                        <Badge className="absolute -top-2 right-0 bg-primary text-primary-foreground text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          {t('auth:accountType.engineer.popular')}
                        </Badge>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold">{t(`auth:accountType.${typeId}.name`)}</h2>
                        <div className={`w-10 h-10 ${type.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <span className="block text-2xl font-bold text-primary">
                        {pricing.currency} {pricing.amount}
                        <span className="text-sm font-normal text-muted-foreground">{t('auth:accountType.perMonth')}</span>
                      </span>
                      <p className="text-muted-foreground text-xs mt-2">
                        {t(`auth:accountType.${typeId}.description`)}
                      </p>
                    </div>

                    {type.showChart && (
                      <div className="bg-muted/30 h-fit w-full rounded-lg border p-2">
                        <PlanChart planName={t(`auth:accountType.${typeId}.name`)} />
                      </div>
                    )}

                    <ul className="text-muted-foreground space-y-2 text-xs">
                      {featureKeys.slice(0, 5).map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                          {t(`auth:accountType.${typeId}.features.${feature}`)}
                        </li>
                      ))}
                      {featureKeys.length > 5 && (
                        <li className="text-xs text-muted-foreground/70">
                          {t('auth:accountType.moreFeatures', { count: featureKeys.length - 5 })}
                        </li>
                      )}
                    </ul>
                  </div>

                  <Button
                    className="w-full"
                    variant={selectedType === type.id ? 'default' : 'outline'}
                    onClick={() => handleSelectType(type.id)}
                  >
                    {selectedType === type.id ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {t('auth:accountType.selected')}
                      </>
                    ) : (
                      t('auth:accountType.selectPlan')
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8 text-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedType || isLoading}
            className="px-12 py-6 text-lg"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {t('auth:accountType.processing')}
              </>
            ) : (
              <>
                {t('auth:accountType.continue')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
          
          {selectedType && (
            <p 
              className="text-sm text-muted-foreground mt-4"
              dangerouslySetInnerHTML={{
                __html: t('auth:accountType.youSelected', { 
                  accountType: t(`auth:accountType.${selectedType}.name`)
                })
              }}
            />
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>{t('auth:accountType.trustIndicators.securePayment')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>{t('auth:accountType.trustIndicators.instantActivation')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>{t('auth:accountType.trustIndicators.cancelAnytime')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanChart({ planName }: { planName: string }) {
  const { t } = useTranslation('auth');
  
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
      label: t('auth:accountType.chart.label'),
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig;

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-0 border-b p-2">
        <CardTitle className="text-xs">{t('auth:accountType.chart.title')}</CardTitle>
        <CardDescription className="text-[10px]">
          {t('auth:accountType.chart.description')}
        </CardDescription>
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

