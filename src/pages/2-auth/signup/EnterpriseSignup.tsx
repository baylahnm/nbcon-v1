import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNamespace } from "@/pages/1-HomePage/others/lib/i18n/useNamespace";
import { Building2, Users, CreditCard, FileText, CheckCircle, ArrowRight, ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/pages/1-HomePage/others/components/ui/button";
import { Input } from "@/pages/1-HomePage/others/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/pages/1-HomePage/others/components/ui/card";
import { Label } from "@/pages/1-HomePage/others/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/pages/1-HomePage/others/components/ui/select";
import { Checkbox } from "@/pages/1-HomePage/others/components/ui/checkbox";
import { Separator } from "@/pages/1-HomePage/others/components/ui/separator";
import { Textarea } from "@/pages/1-HomePage/others/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/pages/1-HomePage/others/components/ui/radio-group";
import { PhoneInput } from "./components/PhoneInput";
import { BillingAddressForm } from "./components/BillingAddressForm";
import { PaymentMethodSelector } from "./components/PaymentMethodSelector";
import { MultiEmailInput } from "./components/MultiEmailInput";
import { PLAN_PRICING } from "@/pages/4-free/others/features/billing/lib/plans";
import { LanguageSwitcher } from "@/pages/1-HomePage/others/components/i18n/LanguageSwitcher";
import { useAuthStore } from "@/pages/2-auth/others/stores/auth";
import { createProfileOnly } from "@/pages/2-auth/others/utils/signup-helper";
import { useToast } from "@/pages/1-HomePage/others/components/ui/use-toast";
import { Mail } from "lucide-react";

const COMPANY_SIZES = [
  { value: '50-200', label: '50-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' },
];

const INDUSTRIES = [
  'Construction', 'Oil & Gas', 'Renewable Energy', 'Manufacturing',
  'Infrastructure', 'Real Estate', 'Technology', 'Healthcare',
  'Education', 'Transportation', 'Water & Utilities', 'Mining',
  'Government', 'Financial Services', 'Other'
];

export default function EnterpriseSignup() {
  const navigate = useNavigate();
  const ready = useNamespace(['registration', 'common']);
  const { t } = useTranslation(['registration', 'common']);
  const { user, isAuthenticated, login } = useAuthStore();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Password fields
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1: Company Info
  const [companyLegalName, setCompanyLegalName] = useState("");
  const [companyDomain, setCompanyDomain] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [industry, setIndustry] = useState("");
  const [crNumber, setCrNumber] = useState("");
  const [taxId, setTaxId] = useState("");

  // Step 2: Team & Contact - Pre-fill from authenticated user
  const [teamSeats, setTeamSeats] = useState("");
  const [pocName, setPocName] = useState(user?.name || "");
  const [pocTitle, setPocTitle] = useState("");
  const [pocEmail, setPocEmail] = useState(user?.email || "");
  const [pocPhone, setPocPhone] = useState(user?.phone?.replace(/^\+966/, "") || "");
  const [countryCode, setCountryCode] = useState("+966");

  // Step 3: Billing & Procurement
  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    region: "",
    postalCode: "",
    country: "SA"
  });
  const [poNumber, setPoNumber] = useState("");
  const [invoiceEmails, setInvoiceEmails] = useState<string[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // Step 4: Payment & Terms
  const [paymentMethod, setPaymentMethod] = useState<{
    type: 'card' | 'bank' | 'applepay';
    cardNumber?: string;
    cardExpiry?: string;
    cardCvv?: string;
    cardName?: string;
    bankName?: string;
    accountNumber?: string;
    iban?: string;
  }>({
    type: 'card',
  });
  const [ssoSamlDomain, setSsoSamlDomain] = useState("");
  const [customRequirements, setCustomRequirements] = useState("");
  const [acceptNda, setAcceptNda] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  if (!ready) return null;

  const pricing = PLAN_PRICING.enterprise_monthly_120;
  const calculatedAmount = billingCycle === 'annual' ? pricing.amount * 12 * 0.9 : pricing.amount; // 10% annual discount

  const steps = [
    { id: 1, title: t('registration:steps.companyInformation'), icon: Building2 },
    { id: 2, title: t('registration:steps.taxContactDetails'), icon: Users },
    { id: 3, title: t('registration:steps.businessDetails'), icon: FileText },
    { id: 4, title: t('registration:steps.paymentTerms'), icon: CreditCard },
  ];

  const validateStep1 = () => {
    return companyLegalName && companyDomain && companySize && industry && crNumber && taxId;
  };

  const validateStep2 = () => {
    return teamSeats && pocName && pocTitle && pocEmail && pocPhone;
  };

  const validateStep3 = () => {
    return billingAddress.street && billingAddress.city && 
           billingAddress.region && billingAddress.postalCode && 
           invoiceEmails.length > 0;
  };

  const validateStep4 = () => {
    return acceptNda && acceptTerms;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate('/auth/account-type');
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep4()) return;

    // Ensure user is authenticated
    if (!isAuthenticated || !user?.id) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in first to complete your profile.',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }

    setIsLoading(true);
    try {
      // Split POC name into first and last name
      const nameParts = pocName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Create profile only (user already authenticated)
      const result = await createProfileOnly({
        email: user.email,
        password: '', // Not used for profile-only creation
        role: 'enterprise',
        firstName: firstName,
        lastName: lastName,
        phone: countryCode + pocPhone,
        locationCity: billingAddress.city,
        locationRegion: billingAddress.region,
        preferredLanguage: 'en',
        company: companyLegalName,
      }, user.id);

      if (!result.success || !result.user) {
        toast({
          title: 'Profile Creation Failed',
          description: result.error || 'Failed to create profile. Please try again.',
          variant: 'destructive'
        });
        return;
      }

      // Update user in auth store with complete profile
      login(result.user);

      // Show success message
      toast({
        title: 'Account Created!',
        description: 'Welcome to nbcon. Redirecting to your dashboard...',
      });

      // Small delay to show success message, then navigate
      setTimeout(() => {
        navigate('/enterprise/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Signup failed:', error);
      toast({
        title: 'Signup Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">
            Password
            <span className="text-destructive ml-1">*</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="password"
              name="new-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="pl-10 pr-10"
              autoComplete="new-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0 h-auto text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">
            Confirm Password
            <span className="text-destructive ml-1">*</span>
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="confirm-password"
              name="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="pl-10 pr-10"
              autoComplete="new-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0 h-auto text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-sm text-destructive">Passwords do not match</p>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-2">
        <Label htmlFor="company-legal-name">
          {t('registration:enterprise.fields.companyLegalName')}
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="company-legal-name"
          name="organization"
          value={companyLegalName}
          onChange={(e) => setCompanyLegalName(e.target.value)}
          placeholder={t('registration:enterprise.fields.companyLegalNamePlaceholder')}
          autoComplete="organization"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company-domain">
          {t('registration:enterprise.fields.companyDomain')}
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="company-domain"
          name="company-domain"
          value={companyDomain}
          onChange={(e) => setCompanyDomain(e.target.value)}
          placeholder={t('registration:enterprise.fields.companyDomainPlaceholder')}
          autoComplete="url"
        />
        <p className="text-xs text-muted-foreground">
          {t('registration:enterprise.fields.companyDomainHint')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company-size">
            {t('registration:enterprise.fields.companySize')}
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Select value={companySize} onValueChange={setCompanySize}>
            <SelectTrigger id="company-size">
              <SelectValue placeholder={t('registration:enterprise.fields.companySizePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_SIZES.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">
            {t('registration:enterprise.fields.industry')}
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger id="industry">
              <SelectValue placeholder={t('registration:enterprise.fields.industryPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((ind) => (
                <SelectItem key={ind} value={ind}>
                  {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cr-number">
          {t('registration:enterprise.fields.crNumber')}
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="cr-number"
          name="cr-number"
          value={crNumber}
          onChange={(e) => setCrNumber(e.target.value)}
          placeholder={t('registration:enterprise.fields.crNumberPlaceholder')}
          maxLength={10}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tax-id">
          {t('registration:enterprise.fields.taxId')}
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="tax-id"
          name="tax-id"
          value={taxId}
          onChange={(e) => setTaxId(e.target.value)}
          placeholder={t('registration:enterprise.fields.taxIdPlaceholder')}
          maxLength={15}
        />
        <p className="text-xs text-muted-foreground">
          {t('registration:enterprise.fields.taxIdHint')}
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="team-seats">
          {t('registration:enterprise.fields.teamSeats')}
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="team-seats"
          name="team-seats"
          type="number"
          min="5"
          value={teamSeats}
          onChange={(e) => setTeamSeats(e.target.value)}
          placeholder={t('registration:enterprise.fields.teamSeatsPlaceholder')}
        />
        <p className="text-xs text-muted-foreground">
          {t('registration:enterprise.fields.teamSeatsHint')}
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">{t('registration:enterprise.fields.pocTitle')}</h3>
        
        <div className="space-y-2">
          <Label htmlFor="poc-name">
            {t('registration:enterprise.fields.pocName')}
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="poc-name"
            name="name"
            value={pocName}
            onChange={(e) => setPocName(e.target.value)}
            placeholder={t('registration:enterprise.fields.pocNamePlaceholder')}
            autoComplete="name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="poc-title">
            {t('registration:enterprise.fields.pocJobTitle')}
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="poc-title"
            name="organization-title"
            value={pocTitle}
            onChange={(e) => setPocTitle(e.target.value)}
            placeholder={t('registration:enterprise.fields.pocJobTitlePlaceholder')}
            autoComplete="organization-title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="poc-email">
            {t('registration:enterprise.fields.pocEmail')}
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="poc-email"
            name="email"
            type="email"
            value={pocEmail}
            onChange={(e) => setPocEmail(e.target.value)}
            placeholder={t('registration:enterprise.fields.pocEmailPlaceholder')}
            autoComplete="email"
          />
        </div>

        <PhoneInput
          label={t('registration:enterprise.fields.pocPhone')}
          value={pocPhone}
          onChange={setPocPhone}
          countryCode={countryCode}
          onCountryCodeChange={setCountryCode}
          required
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">{t('registration:enterprise.fields.billingAddressTitle')}</h3>
        <BillingAddressForm
          value={billingAddress}
          onChange={setBillingAddress}
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="po-number">
          {t('registration:enterprise.fields.poNumber')}
          <span className="text-muted-foreground text-xs ml-2">({t('common:optional')})</span>
        </Label>
        <Input
          id="po-number"
          name="po-number"
          value={poNumber}
          onChange={(e) => setPoNumber(e.target.value)}
          placeholder={t('registration:enterprise.fields.poNumberPlaceholder')}
        />
      </div>

      <MultiEmailInput
        label={t('registration:enterprise.fields.invoiceEmails')}
        value={invoiceEmails}
        onChange={setInvoiceEmails}
        required
        placeholder={t('registration:enterprise.fields.invoiceEmailsPlaceholder')}
      />

      <div className="space-y-3">
        <Label>
          {t('registration:enterprise.fields.billingCycle')}
          <span className="text-destructive ml-1">*</span>
        </Label>
        <RadioGroup value={billingCycle} onValueChange={(value) => setBillingCycle(value as 'monthly' | 'annual')}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="monthly" />
            <Label htmlFor="monthly" className="font-normal cursor-pointer">
              {t('registration:enterprise.fields.billingMonthly')} - SAR {pricing.amount}/month
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="annual" id="annual" />
            <Label htmlFor="annual" className="font-normal cursor-pointer">
              {t('registration:enterprise.fields.billingAnnual')} - SAR {(pricing.amount * 12 * 0.9).toFixed(0)}/year 
              <span className="text-green-600 ml-2">({t('registration:enterprise.fields.billingSave10')})</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <PaymentMethodSelector
        value={paymentMethod}
        onChange={setPaymentMethod}
        amount={billingCycle === 'annual' ? calculatedAmount : pricing.amount}
        currency={pricing.currency}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="sso-domain">
          {t('registration:enterprise.fields.ssoDomain')}
          <span className="text-muted-foreground text-xs ml-2">({t('common:optional')})</span>
        </Label>
        <Input
          id="sso-domain"
          name="sso-domain"
          value={ssoSamlDomain}
          onChange={(e) => setSsoSamlDomain(e.target.value)}
          placeholder={t('registration:enterprise.fields.ssoDomainPlaceholder')}
        />
        <p className="text-xs text-muted-foreground">
          {t('registration:enterprise.fields.ssoDomainHint')}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="custom-requirements">
          {t('registration:enterprise.fields.customRequirements')}
          <span className="text-muted-foreground text-xs ml-2">({t('common:optional')})</span>
        </Label>
        <Textarea
          id="custom-requirements"
          name="custom-requirements"
          value={customRequirements}
          onChange={(e) => setCustomRequirements(e.target.value)}
          placeholder={t('registration:enterprise.fields.customRequirementsPlaceholder')}
          className="min-h-[100px] resize-none"
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="nda"
            checked={acceptNda}
            onCheckedChange={(checked) => setAcceptNda(checked as boolean)}
          />
          <Label htmlFor="nda" className="text-sm font-normal leading-relaxed cursor-pointer">
            {t('registration:enterprise.fields.acceptNda')}{" "}
            <a href="/nda" target="_blank" className="text-primary hover:underline">
              {t('registration:enterprise.fields.ndaLink')}
            </a>
            <span className="text-destructive ml-1">*</span>
          </Label>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
          />
          <Label htmlFor="terms" className="text-sm font-normal leading-relaxed cursor-pointer">
            {t('registration:shared.terms.accept')}{" "}
            <a href="/terms" target="_blank" className="text-primary hover:underline">
              {t('registration:shared.terms.termsConditions')}
            </a>{" "}
            {t('registration:shared.terms.and')}{" "}
            <a href="/privacy" target="_blank" className="text-primary hover:underline">
              {t('registration:shared.terms.privacyPolicy')}
            </a>
            <span className="text-destructive ml-1">*</span>
          </Label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/auth/account-type')}
            className="text-muted-foreground hover:text-foreground"
          >
            ← {t('registration:common.backToAccountSelection')}
          </Button>
          <LanguageSwitcher />
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-border text-muted-foreground'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Main Card */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-xl flex items-center justify-center">
              {(() => {
                const StepIcon = steps[currentStep - 1]?.icon;
                return StepIcon ? <StepIcon className="w-8 h-8 text-primary-foreground" /> : null;
              })()}
            </div>
            <CardTitle className="text-2xl">
              {steps[currentStep - 1]?.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t('registration:common.subscription', { 
                accountType: t('auth:accountType.enterprise.name'),
                currency: pricing.currency, 
                amount: billingCycle === 'annual' ? calculatedAmount.toFixed(0) : pricing.amount, 
                interval: billingCycle === 'annual' ? 'year' : pricing.interval
              })}
            </p>
          </CardHeader>

          <CardContent>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            <Separator className="my-6" />

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="px-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('registration:common.back')}
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={isLoading || 
                  (currentStep === 1 && !validateStep1()) || 
                  (currentStep === 2 && !validateStep2()) ||
                  (currentStep === 3 && !validateStep3()) ||
                  (currentStep === 4 && !validateStep4())}
                className="px-8"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {t('registration:common.processing')}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {currentStep === 4 ? t('registration:common.completeSignup') : t('registration:common.next')}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

