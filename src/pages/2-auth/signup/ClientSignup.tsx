import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNamespace } from "@/pages/1-HomePage/others/lib/i18n/useNamespace";
import { Building, CreditCard, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/pages/1-HomePage/others/components/ui/button";
import { Input } from "@/pages/1-HomePage/others/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/pages/1-HomePage/others/components/ui/card";
import { Label } from "@/pages/1-HomePage/others/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/pages/1-HomePage/others/components/ui/select";
import { Checkbox } from "@/pages/1-HomePage/others/components/ui/checkbox";
import { Separator } from "@/pages/1-HomePage/others/components/ui/separator";
import { PhoneInput } from "./components/PhoneInput";
import { VATFields } from "./components/VATFields";
import { BillingAddressForm } from "./components/BillingAddressForm";
import { PaymentMethodSelector } from "./components/PaymentMethodSelector";
import { MultiEmailInput } from "./components/MultiEmailInput";
import { PLAN_PRICING } from "@/pages/4-client/others/features/billing/lib/plans";
import { LanguageSwitcher } from "@/pages/1-HomePage/others/components/i18n/LanguageSwitcher";

export default function ClientSignup() {
  const navigate = useNavigate();
  const ready = useNamespace(['registration', 'common']);
  const { t } = useTranslation(['registration', 'common']);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [companyLegalName, setCompanyLegalName] = useState("");
  const [tradeName, setTradeName] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [industry, setIndustry] = useState("");
  const [crNumber, setCrNumber] = useState("");
  const [isVatRegistered, setIsVatRegistered] = useState(false);
  const [taxId, setTaxId] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+966");
  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    region: "",
    postalCode: "",
    country: "SA"
  });
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [paymentMethod, setPaymentMethod] = useState({
    type: 'card' as const,
  });
  const [invoiceEmails, setInvoiceEmails] = useState<string[]>([]);
  const [acceptTerms, setAcceptTerms] = useState(false);

  if (!ready) return null;

  const pricing = PLAN_PRICING.client_monthly_45;

  const steps = [
    { id: 1, title: t('registration:steps.companyInformation'), icon: Building },
    { id: 2, title: t('registration:steps.taxContactDetails'), icon: Building },
    { id: 3, title: t('registration:steps.paymentTerms'), icon: CreditCard },
  ];

  const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];
  const industries = ['construction', 'oilGas', 'renewable', 'manufacturing', 'infrastructure', 'realEstate', 'technology', 'healthcare', 'education', 'transportation', 'waterUtilities', 'mining', 'other'];

  const validateStep1 = () => {
    return companyLegalName && companySize && industry && crNumber;
  };

  const validateStep2 = () => {
    return contactName && contactEmail && phone && 
           billingAddress.street && billingAddress.city && 
           billingAddress.region && billingAddress.postalCode;
  };

  const validateStep3 = () => {
    return acceptTerms;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    
    if (currentStep < 3) {
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
    if (!validateStep3()) return;

    setIsLoading(true);
    try {
      // TODO: Implement Supabase signup logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to client dashboard
      navigate('/client/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="company-legal-name">
          {t('registration:client.fields.companyLegalName')}
          <span className="text-destructive ml-1">{t('registration:common.required')}</span>
        </Label>
        <Input
          id="company-legal-name"
          value={companyLegalName}
          onChange={(e) => setCompanyLegalName(e.target.value)}
          placeholder={t('registration:client.fields.companyLegalNamePlaceholder')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="trade-name">
          {t('registration:client.fields.tradeName')}
          <span className="text-muted-foreground text-xs ml-2">{t('registration:common.optional')}</span>
        </Label>
        <Input
          id="trade-name"
          value={tradeName}
          onChange={(e) => setTradeName(e.target.value)}
          placeholder={t('registration:client.fields.tradeNamePlaceholder')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company-size">
            {t('registration:client.fields.companySize')}
            <span className="text-destructive ml-1">{t('registration:common.required')}</span>
          </Label>
          <Select value={companySize} onValueChange={setCompanySize}>
            <SelectTrigger id="company-size">
              <SelectValue placeholder={t('registration:client.fields.companySizePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {companySizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {t(`registration:client.companySizes.${size}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">
            {t('registration:client.fields.industry')}
            <span className="text-destructive ml-1">{t('registration:common.required')}</span>
          </Label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger id="industry">
              <SelectValue placeholder={t('registration:client.fields.industryPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {industries.map((ind) => (
                <SelectItem key={ind} value={ind}>
                  {t(`registration:client.industries.${ind}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cr-number">
          {t('registration:client.fields.crNumber')}
          <span className="text-destructive ml-1">{t('registration:common.required')}</span>
        </Label>
        <Input
          id="cr-number"
          value={crNumber}
          onChange={(e) => setCrNumber(e.target.value)}
          placeholder={t('registration:client.fields.crNumberPlaceholder')}
          maxLength={10}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <VATFields
        isRegistered={isVatRegistered}
        onRegisteredChange={setIsVatRegistered}
        taxId={taxId}
        onTaxIdChange={setTaxId}
      />

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">{t('registration:client.sections.primaryContact')}</h3>
        
        <div className="space-y-2">
          <Label htmlFor="contact-name">
            {t('registration:client.fields.contactName')}
            <span className="text-destructive ml-1">{t('registration:common.required')}</span>
          </Label>
          <Input
            id="contact-name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder={t('registration:client.fields.contactNamePlaceholder')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">
            {t('registration:client.fields.contactEmail')}
            <span className="text-destructive ml-1">{t('registration:common.required')}</span>
          </Label>
          <Input
            id="contact-email"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder={t('registration:client.fields.contactEmailPlaceholder')}
          />
        </div>

        <PhoneInput
          label={t('registration:client.fields.phone')}
          value={phone}
          onChange={setPhone}
          countryCode={countryCode}
          onCountryCodeChange={setCountryCode}
          required
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">{t('registration:client.fields.billingAddress')}</h3>
        <BillingAddressForm
          value={billingAddress}
          onChange={setBillingAddress}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">
          {t('registration:client.fields.preferredLanguage')}
          <span className="text-muted-foreground text-xs ml-2">{t('registration:common.optional')}</span>
        </Label>
        <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
          <SelectTrigger id="language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">{t('registration:shared.languages.en')}</SelectItem>
            <SelectItem value="ar">{t('registration:shared.languages.ar')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <PaymentMethodSelector
        value={paymentMethod}
        onChange={setPaymentMethod}
        amount={pricing.amount}
        currency={pricing.currency}
      />

      <Separator />

      <MultiEmailInput
        label={t('registration:client.fields.invoiceEmails')}
        value={invoiceEmails}
        onChange={setInvoiceEmails}
        placeholder={t('registration:client.fields.invoiceEmailsPlaceholder')}
      />

      <Separator />

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
          <span className="text-destructive ml-1">{t('registration:common.required')}</span>
        </Label>
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
                <div className={`w-16 h-0.5 mx-2 ${
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
                accountType: t('auth:accountType.client.name'),
                currency: pricing.currency, 
                amount: pricing.amount, 
                interval: pricing.interval 
              })}
            </p>
          </CardHeader>

          <CardContent>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

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
                disabled={isLoading || (currentStep === 1 && !validateStep1()) || (currentStep === 2 && !validateStep2()) || (currentStep === 3 && !validateStep3())}
                className="px-8"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {t('registration:common.processing')}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {currentStep === 3 ? t('registration:common.completeSignup') : t('registration:common.next')}
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

