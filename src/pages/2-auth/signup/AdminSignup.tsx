import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNamespace } from "@/pages/1-HomePage/others/lib/i18n/useNamespace";
import { Shield, Lock, CheckCircle, ArrowRight, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/pages/1-HomePage/others/components/ui/button";
import { Input } from "@/pages/1-HomePage/others/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/pages/1-HomePage/others/components/ui/card";
import { Label } from "@/pages/1-HomePage/others/components/ui/label";
import { Checkbox } from "@/pages/1-HomePage/others/components/ui/checkbox";
import { Separator } from "@/pages/1-HomePage/others/components/ui/separator";
import { Textarea } from "@/pages/1-HomePage/others/components/ui/textarea";
import { Alert, AlertDescription } from "@/pages/1-HomePage/others/components/ui/alert";
import { FileUploader } from "./components/FileUploader";
import { LanguageSwitcher } from "@/pages/1-HomePage/others/components/i18n/LanguageSwitcher";
import { useAuthStore } from "@/pages/2-auth/others/stores/auth";
import { createProfileOnly } from "@/pages/2-auth/others/utils/signup-helper";
import { useToast } from "@/pages/1-HomePage/others/components/ui/use-toast";
import { Mail } from "lucide-react";

const DEPARTMENTS = [
  'Engineering',
  'Operations',
  'Finance',
  'Legal',
  'IT & Security',
  'Human Resources',
  'Compliance',
  'Customer Support',
  'Executive',
  'Other'
];

export default function AdminSignup() {
  const navigate = useNavigate();
  const ready = useNamespace(['registration', 'common']);
  const { t } = useTranslation(['registration', 'common']);
  const { user, isAuthenticated, login } = useAuthStore();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading] = useState(false);

  // Personal Info - Pre-fill from authenticated user
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  // Step 1: Verification
  const [invitationToken, setInvitationToken] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [accessReason, setAccessReason] = useState("");

  // Step 2: Security
  const [idVerification, setIdVerification] = useState<File[]>([]);
  const [selfieVerification, setSelfieVerification] = useState<File[]>([]);
  const [acceptSecurityAgreement, setAcceptSecurityAgreement] = useState(false);

  const [tokenError, setTokenError] = useState("");

  if (!ready) return null;

  const steps = [
    { id: 1, title: "Verification", icon: Shield },
    { id: 2, title: "Security & Agreement", icon: Lock },
  ];

  const validateToken = async (token: string) => {
    // TODO: Implement actual token validation with Supabase
    if (token.length < 10) {
      setTokenError("Invalid invitation token");
      return false;
    }
    setTokenError("");
    return true;
  };

  const validateStep1 = () => {
    return fullName && invitationToken && workEmail && employeeId && department && accessReason && !tokenError;
  };

  const validateStep2 = () => {
    return (idVerification.length > 0 || selfieVerification.length > 0) && acceptSecurityAgreement;
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      
      // Validate token before proceeding
      const isValid = await validateToken(invitationToken);
      if (!isValid) return;
      
      setCurrentStep(2);
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
    if (!validateStep2()) return;

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
      // Split full name into first and last name
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Create profile only (user already authenticated)
      const result = await createProfileOnly({
        email: user.email,
        role: 'admin',
        firstName: firstName,
        lastName: lastName,
        phone: user.phone || '', // Admin might not have phone from initial signup
        locationCity: 'Riyadh', // Default
        locationRegion: 'Saudi Arabia',
        preferredLanguage: 'en',
      }, user.id);

      if (!result.success || !result.user) {
        toast({
          title: 'Profile Creation Failed',
          description: result.error || 'Failed to create admin profile. Please try again.',
          variant: 'destructive'
        });
        return;
      }

      // Set user in auth store
      login(result.user);

      // Show success message
      toast({
        title: 'Admin Account Created!',
        description: 'Welcome to nbcon admin panel.',
      });

      // Navigate to admin dashboard
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Admin signup failed:', error);
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
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {t('admin.alertMessage')}
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="full-name">
          Full Name
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="full-name"
          name="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
          autoComplete="name"
        />
      </div>

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
        <Label htmlFor="invitation-token">
          {t('admin.fields.invitationToken')}
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="invitation-token"
          name="invitation-token"
          value={invitationToken}
          onChange={(e) => {
            setInvitationToken(e.target.value);
            setTokenError("");
          }}
          onBlur={() => validateToken(invitationToken)}
          placeholder={t('admin.fields.invitationTokenPlaceholder')}
          className={tokenError ? "border-destructive" : ""}
        />
        {tokenError && (
          <p className="text-sm text-destructive">{tokenError}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="work-email">
          {t('admin.fields.workEmail')}
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="work-email"
          name="email"
          type="email"
          value={workEmail}
          onChange={(e) => setWorkEmail(e.target.value)}
          placeholder={t('admin.fields.workEmailPlaceholder')}
          autoComplete="email"
        />
        <p className="text-xs text-muted-foreground">
          {t('admin.fields.workEmailHint')}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="employee-id">
          {t('admin.fields.employeeId')}
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="employee-id"
          name="employee-id"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          placeholder={t('admin.fields.employeeIdPlaceholder')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">
          {t('admin.fields.department')}
          <span className="text-destructive ml-1">*</span>
        </Label>
        <select
          id="department"
          name="department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">{t('admin.fields.departmentPlaceholder')}</option>
          {t('admin.departments', { returnObjects: true }).map((dept: string) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="access-reason">
          {t('admin.fields.accessReason')}
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Textarea
          id="access-reason"
          name="access-reason"
          value={accessReason}
          onChange={(e) => setAccessReason(e.target.value)}
          placeholder={t('admin.fields.accessReasonPlaceholder')}
          className="min-h-[120px] resize-none"
        />
        <p className="text-xs text-muted-foreground">
          {t('admin.fields.accessReasonHint')}
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Enhanced security verification is required for admin accounts. Please provide ID verification and either a selfie or setup 2FA.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <FileUploader
          label="ID Verification (Upload your official ID)"
          accept="image/*,application/pdf"
          multiple
          required
          value={idVerification}
          onChange={setIdVerification}
          maxSize={10}
          helperText="Upload clear photos or scans of your government-issued ID"
        />

        <div className="flex items-center gap-4 my-4">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        <FileUploader
          label="Selfie Verification (Optional if ID uploaded)"
          accept="image/*"
          value={selfieVerification}
          onChange={setSelfieVerification}
          maxSize={5}
          helperText="Take a clear selfie holding your ID next to your face"
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Admin Security Requirements
          </h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span>2FA will be mandatory for your account</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span>All admin actions will be logged and audited</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span>Session timeout after 15 minutes of inactivity</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span>IP restrictions may apply based on organization policy</span>
            </li>
          </ul>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="security-agreement"
            checked={acceptSecurityAgreement}
            onCheckedChange={(checked) => setAcceptSecurityAgreement(checked as boolean)}
          />
          <Label htmlFor="security-agreement" className="text-sm font-normal leading-relaxed cursor-pointer">
            I have read and accept the{" "}
            <a href="/admin-policies" target="_blank" className="text-primary hover:underline">
              Admin Security Policies
            </a>
            {" "}and understand that violations may result in immediate access revocation and legal action.
            <span className="text-destructive ml-1">*</span>
          </Label>
        </div>
      </div>

      <Alert className="bg-blue-500/10 border-blue-500/20">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700 dark:text-blue-300">
          <strong>Note:</strong> Admin accounts are free but require approval. You'll receive an email once your request is reviewed (typically within 24-48 hours).
        </AlertDescription>
      </Alert>
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
          ← {t('admin.backToAccountSelection')}
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
                <div className={`w-24 h-0.5 mx-2 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-destructive/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-destructive rounded-xl flex items-center justify-center">
              {(() => {
                const StepIcon = steps[currentStep - 1]?.icon;
                return StepIcon ? <StepIcon className="w-8 h-8 text-destructive-foreground" /> : null;
              })()}
            </div>
            <CardTitle className="text-2xl">
              {currentStep === 1 ? t('admin.title') : steps[currentStep - 1]?.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t('admin.subtitle')}
            </p>
          </CardHeader>

          <CardContent>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}

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
                  (currentStep === 2 && !validateStep2())}
                className="px-8"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {currentStep === 2 ? 'Submit for Approval' : 'Next'}
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

