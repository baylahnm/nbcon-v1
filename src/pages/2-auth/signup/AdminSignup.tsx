import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const DEPARTMENTS = [
  'Engineering', 'Operations', 'IT & Systems', 'Finance', 
  'HR', 'Legal', 'Executive', 'Customer Support', 'Other'
];

export default function AdminSignup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

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
    return invitationToken && workEmail && employeeId && department && accessReason && !tokenError;
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

    setIsLoading(true);
    try {
      // TODO: Implement Supabase admin signup logic with verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Admin accounts require manual approval
      navigate('/admin/pending-approval');
    } catch (error) {
      console.error('Admin signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Admin access requires a valid invitation token from an authorized system administrator.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="invitation-token">
          Admin Invitation Token
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="invitation-token"
          value={invitationToken}
          onChange={(e) => {
            setInvitationToken(e.target.value);
            setTokenError("");
          }}
          onBlur={() => validateToken(invitationToken)}
          placeholder="Enter your invitation token"
          className={tokenError ? "border-destructive" : ""}
        />
        {tokenError && (
          <p className="text-sm text-destructive">{tokenError}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="work-email">
          Work Email (must match org domain)
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="work-email"
          type="email"
          value={workEmail}
          onChange={(e) => setWorkEmail(e.target.value)}
          placeholder="admin@organization.com"
        />
        <p className="text-xs text-muted-foreground">
          Email will be verified against organization domain
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="employee-id">
          Employee ID
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="employee-id"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          placeholder="Enter your employee ID"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">
          Department / Team
          <span className="text-destructive ml-1">*</span>
        </Label>
        <select
          id="department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Select department</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="access-reason">
          Reason for Elevated Access
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Textarea
          id="access-reason"
          value={accessReason}
          onChange={(e) => setAccessReason(e.target.value)}
          placeholder="Explain why you need admin access and your role responsibilities..."
          className="min-h-[120px] resize-none"
        />
        <p className="text-xs text-muted-foreground">
          This will be reviewed by system administrators
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
              {steps[currentStep - 1]?.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Admin Account - Free (Requires Approval)
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

