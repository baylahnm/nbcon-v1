import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNamespace } from "@/pages/1-HomePage/others/lib/i18n/useNamespace";
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
import { LanguageSwitcher } from "@/pages/1-HomePage/others/components/i18n/LanguageSwitcher";

export default function EngineerSignup() {
  const navigate = useNavigate();
  const ready = useNamespace(['registration', 'common']);
  const { t } = useTranslation(['registration', 'common']);
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

  if (!ready) return null;

  const pricing = PLAN_PRICING.engineer_monthly_60;

  const steps = [
    { id: 1, title: t('registration:steps.professionalDetails'), icon: User },
    { id: 2, title: t('registration:steps.licenseVerification'), icon: Award },
    { id: 3, title: t('registration:steps.taxContactDetails'), icon: Shield },
    { id: 4, title: t('registration:steps.paymentTerms'), icon: CreditCard },
  ];

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
          {t('registration:engineer.fields.fullName')}
          <span className="text-destructive ml-1">{t('registration:common.required')}</span>
        </Label>
        <Input
          id="full-name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={t('registration:engineer.fields.fullNamePlaceholder')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialization">
          {t('registration:engineer.fields.specialization')}
          <span className="text-destructive ml-1">{t('registration:common.required')}</span>
        </Label>
        <Select 
          value={specializations[0] || ''} 
          onValueChange={(value) => setSpecializations([value])}
        >
          <SelectTrigger id="specialization">
            <SelectValue placeholder={t('registration:engineer.fields.specializationPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="structural">Structural Engineering</SelectItem>
            <SelectItem value="civil">Civil Engineering</SelectItem>
            <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
            <SelectItem value="electrical">Electrical Engineering</SelectItem>
            <SelectItem value="environmental">Environmental Engineering</SelectItem>
            <SelectItem value="chemical">Chemical Engineering</SelectItem>
            <SelectItem value="petroleum">Petroleum Engineering</SelectItem>
            <SelectItem value="industrial">Industrial Engineering</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="years-experience">
          {t('registration:engineer.fields.yearsExperience')}
          <span className="text-destructive ml-1">{t('registration:common.required')}</span>
        </Label>
        <Select value={yearsExperience} onValueChange={setYearsExperience}>
          <SelectTrigger id="years-experience">
            <SelectValue placeholder={t('registration:engineer.fields.yearsExperiencePlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-2">{t('registration:engineer.yearsOptions.0-2')}</SelectItem>
            <SelectItem value="3-5">{t('registration:engineer.yearsOptions.3-5')}</SelectItem>
            <SelectItem value="6-10">{t('registration:engineer.yearsOptions.6-10')}</SelectItem>
            <SelectItem value="11-15">{t('registration:engineer.yearsOptions.11-15')}</SelectItem>
            <SelectItem value="15+">{t('registration:engineer.yearsOptions.15+')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <PhoneInput
        label={t('registration:engineer.fields.phone')}
        value={phone}
        onChange={setPhone}
        countryCode={countryCode}
        onCountryCodeChange={setCountryCode}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">
            {t('registration:engineer.fields.city')}
            <span className="text-destructive ml-1">{t('registration:common.required')}</span>
          </Label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger id="city">
              <SelectValue placeholder={t('registration:engineer.fields.cityPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="riyadh">Riyadh</SelectItem>
              <SelectItem value="jeddah">Jeddah</SelectItem>
              <SelectItem value="mecca">Mecca</SelectItem>
              <SelectItem value="medina">Medina</SelectItem>
              <SelectItem value="dammam">Dammam</SelectItem>
              <SelectItem value="khobar">Khobar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">
            {t('registration:engineer.fields.region')}
            <span className="text-destructive ml-1">{t('registration:common.required')}</span>
          </Label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger id="region">
              <SelectValue placeholder={t('registration:engineer.fields.regionPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="riyadh">Riyadh</SelectItem>
              <SelectItem value="makkah">Makkah</SelectItem>
              <SelectItem value="madinah">Madinah</SelectItem>
              <SelectItem value="eastern">Eastern Province</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>
            {t('registration:engineer.fields.serviceRadius')}
            <span className="text-muted-foreground text-xs ml-2">{t('registration:common.optional')}</span>
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
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="license-number">
          {t('registration:engineer.fields.licenseNumber')}
          <span className="text-destructive ml-1">{t('registration:common.required')}</span>
        </Label>
        <Input
          id="license-number"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          placeholder={t('registration:engineer.fields.licenseNumberPlaceholder')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="issuing-authority">
          {t('registration:engineer.fields.issuingAuthority')}
          <span className="text-destructive ml-1">{t('registration:common.required')}</span>
        </Label>
        <Input
          id="issuing-authority"
          value={issuingAuthority}
          onChange={(e) => setIssuingAuthority(e.target.value)}
          placeholder={t('registration:engineer.fields.issuingAuthorityPlaceholder')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="license-expiry">
          {t('registration:engineer.fields.licenseExpiry')}
          <span className="text-destructive ml-1">{t('registration:common.required')}</span>
        </Label>
        <Input
          id="license-expiry"
          type="date"
          value={licenseExpiry}
          onChange={(e) => setLicenseExpiry(e.target.value)}
          style={{
            colorScheme: 'light dark',
            accentColor: 'hsl(var(--primary))',
          }}
          className="[&::-webkit-calendar-picker-indicator]:cursor-pointer"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="portfolio-url">
          {t('registration:engineer.fields.portfolioUrl')}
          <span className="text-muted-foreground text-xs ml-2">{t('registration:common.optional')}</span>
        </Label>
        <Input
          id="portfolio-url"
          type="url"
          value={portfolioUrl}
          onChange={(e) => setPortfolioUrl(e.target.value)}
          placeholder={t('registration:engineer.fields.portfolioUrlPlaceholder')}
        />
      </div>

      <FileUploader
        label={t('registration:engineer.fields.profilePhoto')}
        accept="image/*"
        value={profilePhoto}
        onChange={setProfilePhoto}
        maxSize={5}
      />

      <div className="space-y-3">
        <Label>
          {t('registration:engineer.fields.languages')}
          <span className="text-muted-foreground text-xs ml-2">{t('registration:common.optional')}</span>
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {['Arabic', 'English', 'French', 'German', 'Spanish', 'Urdu'].map((lang) => (
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
        label={t('registration:engineer.fields.idVerification')}
        accept="image/*,application/pdf"
        multiple
        required
        value={idVerification}
        onChange={setIdVerification}
        maxSize={10}
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
                accountType: t('auth:accountType.engineer.name'),
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

