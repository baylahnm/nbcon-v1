import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '500+', label: '500+ employees' },
];

const INDUSTRIES = [
  'Construction', 'Oil & Gas', 'Renewable Energy', 'Manufacturing',
  'Infrastructure', 'Real Estate', 'Technology', 'Healthcare',
  'Education', 'Transportation', 'Water & Utilities', 'Mining', 'Other'
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية (Arabic)' },
];

export default function ClientSignup() {
  const navigate = useNavigate();
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

  const pricing = PLAN_PRICING.client_monthly_45;

  const steps = [
    { id: 1, title: "Company Information", icon: Building },
    { id: 2, title: "Tax & Contact Details", icon: Building },
    { id: 3, title: "Payment & Terms", icon: CreditCard },
  ];

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
          Company Legal Name
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="company-legal-name"
          value={companyLegalName}
          onChange={(e) => setCompanyLegalName(e.target.value)}
          placeholder="Enter official company name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="trade-name">
          Trade/Brand Name
          <span className="text-muted-foreground text-xs ml-2">(Optional)</span>
        </Label>
        <Input
          id="trade-name"
          value={tradeName}
          onChange={(e) => setTradeName(e.target.value)}
          placeholder="Enter brand or trading name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company-size">
            Company Size
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Select value={companySize} onValueChange={setCompanySize}>
            <SelectTrigger id="company-size">
              <SelectValue placeholder="Select size" />
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
            Industry / Sector
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger id="industry">
              <SelectValue placeholder="Select industry" />
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
          Commercial Registration (CR) Number
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="cr-number"
          value={crNumber}
          onChange={(e) => setCrNumber(e.target.value)}
          placeholder="Enter CR number"
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
        <h3 className="text-sm font-semibold">Primary Contact Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="contact-name">
            Full Name
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="contact-name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Enter full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">
            Work Email
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="contact-email"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="email@company.com"
          />
        </div>

        <PhoneInput
          label="Phone Number"
          value={phone}
          onChange={setPhone}
          countryCode={countryCode}
          onCountryCodeChange={setCountryCode}
          required
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Billing Address</h3>
        <BillingAddressForm
          value={billingAddress}
          onChange={setBillingAddress}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">
          Preferred Language
          <span className="text-muted-foreground text-xs ml-2">(Optional)</span>
        </Label>
        <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
          <SelectTrigger id="language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
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
        label="Invoice Email(s)"
        value={invoiceEmails}
        onChange={setInvoiceEmails}
        placeholder="invoice@company.com"
      />

      <Separator />

      <div className="flex items-start space-x-3">
        <Checkbox
          id="terms"
          checked={acceptTerms}
          onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm font-normal leading-relaxed cursor-pointer">
          I accept the{" "}
          <a href="/terms" target="_blank" className="text-primary hover:underline">
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a href="/privacy" target="_blank" className="text-primary hover:underline">
            Privacy Policy
          </a>
          <span className="text-destructive ml-1">*</span>
        </Label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/auth/account-type')}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          ← Back to Account Selection
        </Button>

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
              Client Subscription - {pricing.currency} {pricing.amount}/{pricing.interval}
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
                Back
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={isLoading || (currentStep === 1 && !validateStep1()) || (currentStep === 2 && !validateStep2()) || (currentStep === 3 && !validateStep3())}
                className="px-8"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {currentStep === 3 ? 'Complete Signup' : 'Next'}
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

