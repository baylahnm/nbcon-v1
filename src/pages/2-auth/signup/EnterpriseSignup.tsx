import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Users, CreditCard, FileText, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
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
import { PLAN_PRICING } from "@/pages/4-client/others/features/billing/lib/plans";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Company Info
  const [companyLegalName, setCompanyLegalName] = useState("");
  const [companyDomain, setCompanyDomain] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [industry, setIndustry] = useState("");
  const [crNumber, setCrNumber] = useState("");
  const [taxId, setTaxId] = useState("");

  // Step 2: Team & Contact
  const [teamSeats, setTeamSeats] = useState("");
  const [pocName, setPocName] = useState("");
  const [pocTitle, setPocTitle] = useState("");
  const [pocEmail, setPocEmail] = useState("");
  const [pocPhone, setPocPhone] = useState("");
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
  const [paymentMethod, setPaymentMethod] = useState({
    type: 'card' as const,
  });
  const [ssoSamlDomain, setSsoSamlDomain] = useState("");
  const [customRequirements, setCustomRequirements] = useState("");
  const [acceptNda, setAcceptNda] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const pricing = PLAN_PRICING.enterprise_monthly_120;
  const calculatedAmount = billingCycle === 'annual' ? pricing.amount * 12 * 0.9 : pricing.amount; // 10% annual discount

  const steps = [
    { id: 1, title: "Company Information", icon: Building2 },
    { id: 2, title: "Team & Contact", icon: Users },
    { id: 3, title: "Billing & Procurement", icon: FileText },
    { id: 4, title: "Payment & Terms", icon: CreditCard },
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

    setIsLoading(true);
    try {
      // TODO: Implement Supabase signup logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      navigate('/enterprise/dashboard');
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
        <Label htmlFor="company-domain">
          Company Domain
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="company-domain"
          value={companyDomain}
          onChange={(e) => setCompanyDomain(e.target.value)}
          placeholder="example.com"
        />
        <p className="text-xs text-muted-foreground">
          Used for SSO and email verification
        </p>
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
            Industry
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

      <div className="space-y-2">
        <Label htmlFor="tax-id">
          Tax ID (ZATCA)
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="tax-id"
          value={taxId}
          onChange={(e) => setTaxId(e.target.value)}
          placeholder="Enter Tax ID"
          maxLength={15}
        />
        <p className="text-xs text-muted-foreground">
          Required for enterprise accounts - will be validated
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="team-seats">
          Number of Team Seats
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="team-seats"
          type="number"
          min="5"
          value={teamSeats}
          onChange={(e) => setTeamSeats(e.target.value)}
          placeholder="Minimum 5 seats"
        />
        <p className="text-xs text-muted-foreground">
          Additional seats can be added later
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Point of Contact</h3>
        
        <div className="space-y-2">
          <Label htmlFor="poc-name">
            Full Name
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="poc-name"
            value={pocName}
            onChange={(e) => setPocName(e.target.value)}
            placeholder="Enter full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="poc-title">
            Title
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="poc-title"
            value={pocTitle}
            onChange={(e) => setPocTitle(e.target.value)}
            placeholder="e.g., Project Manager, Director"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="poc-email">
            Work Email
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="poc-email"
            type="email"
            value={pocEmail}
            onChange={(e) => setPocEmail(e.target.value)}
            placeholder="email@company.com"
          />
        </div>

        <PhoneInput
          label="Phone Number"
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
        <h3 className="text-sm font-semibold">Billing Address</h3>
        <BillingAddressForm
          value={billingAddress}
          onChange={setBillingAddress}
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="po-number">
          Procurement: PO Number
          <span className="text-muted-foreground text-xs ml-2">(Optional)</span>
        </Label>
        <Input
          id="po-number"
          value={poNumber}
          onChange={(e) => setPoNumber(e.target.value)}
          placeholder="Enter purchase order number"
        />
      </div>

      <MultiEmailInput
        label="Invoicing Email(s)"
        value={invoiceEmails}
        onChange={setInvoiceEmails}
        required
        placeholder="invoice@company.com"
      />

      <div className="space-y-3">
        <Label>
          Billing Cycle
          <span className="text-destructive ml-1">*</span>
        </Label>
        <RadioGroup value={billingCycle} onValueChange={(value) => setBillingCycle(value as 'monthly' | 'annual')}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="monthly" />
            <Label htmlFor="monthly" className="font-normal cursor-pointer">
              Monthly - SAR {pricing.amount}/month
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="annual" id="annual" />
            <Label htmlFor="annual" className="font-normal cursor-pointer">
              Annual - SAR {(pricing.amount * 12 * 0.9).toFixed(0)}/year 
              <span className="text-green-600 ml-2">(Save 10%)</span>
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
          SSO / SAML Domain
          <span className="text-muted-foreground text-xs ml-2">(Optional)</span>
        </Label>
        <Input
          id="sso-domain"
          value={ssoSamlDomain}
          onChange={(e) => setSsoSamlDomain(e.target.value)}
          placeholder="sso.company.com"
        />
        <p className="text-xs text-muted-foreground">
          Enterprise SSO configuration available after signup
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="custom-requirements">
          Custom Requirements
          <span className="text-muted-foreground text-xs ml-2">(Optional)</span>
        </Label>
        <Textarea
          id="custom-requirements"
          value={customRequirements}
          onChange={(e) => setCustomRequirements(e.target.value)}
          placeholder="Any specific requirements, integrations, or compliance needs..."
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
            I accept the{" "}
            <a href="/nda" target="_blank" className="text-primary hover:underline">
              Data Processing Agreement & NDA
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
              Enterprise Subscription - {pricing.currency} {billingCycle === 'annual' ? `${calculatedAmount.toFixed(0)}/year` : `${pricing.amount}/month`}
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
                Back
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
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {currentStep === 4 ? 'Complete Signup' : 'Next'}
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

