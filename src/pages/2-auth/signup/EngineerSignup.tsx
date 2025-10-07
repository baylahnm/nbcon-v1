import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Award, Shield, CreditCard, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/pages/1-HomePage/others/components/ui/button";
import { Input } from "@/pages/1-HomePage/others/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/pages/1-HomePage/others/components/ui/card";
import { Label } from "@/pages/1-HomePage/others/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/pages/1-HomePage/others/components/ui/select";
import { Checkbox } from "@/pages/1-HomePage/others/components/ui/checkbox";
import { Separator } from "@/pages/1-HomePage/others/components/ui/separator";
import { Slider } from "@/pages/1-HomePage/others/components/ui/slider";
import { PhoneInput } from "./components/PhoneInput";
import { VATFields } from "./components/VATFields";
import { PaymentMethodSelector } from "./components/PaymentMethodSelector";
import { FileUploader } from "./components/FileUploader";
import { PLAN_PRICING } from "@/pages/4-client/others/features/billing/lib/plans";

const SPECIALIZATIONS = [
  'Structural Engineering', 'Civil Engineering', 'Mechanical Engineering',
  'Electrical Engineering', 'Environmental Engineering', 'Chemical Engineering',
  'Petroleum Engineering', 'Industrial Engineering', 'Geotechnical Engineering',
  'Water Resources', 'Transportation Engineering', 'Construction Management'
];

const SAUDI_CITIES = [
  'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Dhahran',
  'Jubail', 'Yanbu', 'Tabuk', 'Abha', 'Khamis Mushait', 'Al-Ahsa', 'Buraidah'
];

const SAUDI_REGIONS = [
  'Riyadh', 'Makkah', 'Madinah', 'Eastern Province', 'Asir', 
  'Tabuk', 'Qassim', 'Ha\'il', 'Northern Borders', 'Jazan', 
  'Najran', 'Al Bahah', 'Al Jouf'
];

const LANGUAGES = [
  'Arabic', 'English', 'French', 'German', 'Spanish', 'Urdu', 'Hindi', 'Filipino'
];

export default function EngineerSignup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Personal Info
  const [fullName, setFullName] = useState("");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [yearsExperience, setYearsExperience] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+966");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [serviceRadius, setServiceRadius] = useState([50]);

  // Step 2: Professional
  const [licenseNumber, setLicenseNumber] = useState("");
  const [issuingAuthority, setIssuingAuthority] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File[]>([]);
  const [languages, setLanguages] = useState<string[]>(['Arabic', 'English']);

  // Step 3: Tax & Verification
  const [isVatRegistered, setIsVatRegistered] = useState(false);
  const [taxId, setTaxId] = useState("");
  const [idVerification, setIdVerification] = useState<File[]>([]);

  // Step 4: Payment & Terms
  const [paymentMethod, setPaymentMethod] = useState({
    type: 'card' as const,
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

  const pricing = PLAN_PRICING.engineer_monthly_60;

  const steps = [
    { id: 1, title: "Personal Information", icon: User },
    { id: 2, title: "Professional Details", icon: Award },
    { id: 3, title: "Tax & Verification", icon: Shield },
    { id: 4, title: "Payment & Terms", icon: CreditCard },
  ];

  const toggleSpecialization = (spec: string) => {
    setSpecializations(prev => 
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const toggleLanguage = (lang: string) => {
    setLanguages(prev => 
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const validateStep1 = () => {
    return fullName && specializations.length > 0 && yearsExperience && phone && city && region;
  };

  const validateStep2 = () => {
    return licenseNumber && issuingAuthority && licenseExpiry;
  };

  const validateStep3 = () => {
    return idVerification.length > 0;
  };

  const validateStep4 = () => {
    return acceptTerms;
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
      
      navigate('/engineer/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full-name">
          Full Name
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="full-name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
        />
      </div>

      <div className="space-y-3">
        <Label>
          Professional Title / Specialization
          <span className="text-destructive ml-1">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {SPECIALIZATIONS.map((spec) => (
            <Button
              key={spec}
              type="button"
              variant={specializations.includes(spec) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleSpecialization(spec)}
              className="justify-start text-sm h-auto py-2"
            >
              {spec}
            </Button>
          ))}
        </div>
        {specializations.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Selected: {specializations.join(', ')}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="years-experience">
          Years of Experience
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="years-experience"
          type="number"
          min="0"
          max="50"
          value={yearsExperience}
          onChange={(e) => setYearsExperience(e.target.value)}
          placeholder="Enter years of experience"
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">
            City
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger id="city">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {SAUDI_CITIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">
            Region
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger id="region">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {SAUDI_REGIONS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>
            Service Radius
            <span className="text-muted-foreground text-xs ml-2">(Optional)</span>
          </Label>
          <span className="text-sm font-medium">{serviceRadius[0]} km</span>
        </div>
        <Slider
          value={serviceRadius}
          onValueChange={setServiceRadius}
          min={10}
          max={200}
          step={10}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          How far are you willing to travel for projects?
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="license-number">
          License / Certification Number
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="license-number"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          placeholder="Enter license or certification number"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="issuing-authority">
          Issuing Authority
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="issuing-authority"
          value={issuingAuthority}
          onChange={(e) => setIssuingAuthority(e.target.value)}
          placeholder="e.g., Saudi Council of Engineers (SCE)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="license-expiry">
          License Expiry Date
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="license-expiry"
          type="date"
          value={licenseExpiry}
          onChange={(e) => setLicenseExpiry(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="portfolio-url">
          Portfolio URL
          <span className="text-muted-foreground text-xs ml-2">(Optional)</span>
        </Label>
        <Input
          id="portfolio-url"
          type="url"
          value={portfolioUrl}
          onChange={(e) => setPortfolioUrl(e.target.value)}
          placeholder="https://your-portfolio.com"
        />
      </div>

      <FileUploader
        label="Profile Photo"
        accept="image/*"
        value={profilePhoto}
        onChange={setProfilePhoto}
        maxSize={5}
        helperText="Upload a professional photo (max 5MB)"
      />

      <div className="space-y-3">
        <Label>
          Languages
          <span className="text-muted-foreground text-xs ml-2">(Optional)</span>
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {LANGUAGES.map((lang) => (
            <Button
              key={lang}
              type="button"
              variant={languages.includes(lang) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleLanguage(lang)}
              className="justify-start text-sm"
            >
              {lang}
            </Button>
          ))}
        </div>
        {languages.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Selected: {languages.join(', ')}
          </p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <VATFields
        isRegistered={isVatRegistered}
        onRegisteredChange={setIsVatRegistered}
        taxId={taxId}
        onTaxIdChange={setTaxId}
      />

      <Separator />

      <FileUploader
        label="ID Verification (National ID / Iqama / Passport)"
        accept="image/*,application/pdf"
        multiple
        required
        value={idVerification}
        onChange={setIdVerification}
        maxSize={10}
        helperText="Upload clear photos or scans of your ID (both sides if applicable)"
      />
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <PaymentMethodSelector
        value={paymentMethod}
        onChange={setPaymentMethod}
        amount={pricing.amount}
        currency={pricing.currency}
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
              Engineer Subscription - {pricing.currency} {pricing.amount}/{pricing.interval}
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

