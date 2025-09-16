import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Shield, 
  FileText, 
  Camera, 
  User,
  Building2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  required: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

export default function VerificationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const verificationSteps: VerificationStep[] = [
    {
      id: 'id_upload',
      title: 'Upload Government ID',
      description: 'Upload a clear photo of your Saudi National ID or Iqama',
      status: 'completed',
      required: true,
      icon: FileText
    },
    {
      id: 'sce_verification',
      title: 'SCE License Verification',
      description: 'Link your Saudi Council of Engineers membership',
      status: 'in_progress',
      required: true,
      icon: Building2
    },
    {
      id: 'face_verification',
      title: 'Face Verification',
      description: 'Take a selfie to match with your ID photo',
      status: 'pending',
      required: true,
      icon: Camera
    },
    {
      id: 'address_proof',
      title: 'Address Proof',
      description: 'Upload utility bill or bank statement (optional)',
      status: 'pending',
      required: false,
      icon: User
    }
  ];

  const completedSteps = verificationSteps.filter(step => step.status === 'completed').length;
  const progressPercentage = (completedSteps / verificationSteps.filter(step => step.required).length) * 100;

  const handleFileUpload = async (stepId: string, file: File) => {
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      toast({
        title: "File Uploaded",
        description: "Your document has been uploaded successfully and is under review.",
      });
      setIsUploading(false);
    }, 2000);
  };

  const handleStepAction = (step: VerificationStep) => {
    if (step.status === 'completed') return;
    
    setCurrentStep(verificationSteps.findIndex(s => s.id === step.id));
    
    if (step.id === 'sce_verification') {
      // Simulate SCE verification process
      toast({
        title: "SCE Verification",
        description: "Redirecting to SCE portal for verification...",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" style={{ color: '#27c862' }} />
          Identity Verification
        </h1>
        <p className="text-muted-foreground mt-1">
          Complete your verification to access all platform features and build trust with clients.
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Verification Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{completedSteps} of {verificationSteps.filter(s => s.required).length} required steps</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                {progressPercentage === 100 ? 'Verification Complete!' : 'Complete all required steps to verify your identity'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Steps */}
      <div className="grid gap-4">
        {verificationSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Card key={step.id} className={`shadow-md ${step.status === 'in_progress' ? 'ring-2 ring-primary' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${step.status === 'completed' ? 'bg-green-100' : step.status === 'in_progress' ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                    <Icon className={`h-6 w-6 ${step.status === 'completed' ? 'text-green-600' : step.status === 'in_progress' ? 'text-yellow-600' : 'text-gray-400'}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(step.status)}
                        {getStatusBadge(step.status)}
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    
                    {step.required && (
                      <Badge variant="outline" className="mb-4">Required</Badge>
                    )}
                    
                    {step.status !== 'completed' && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleStepAction(step)}
                          disabled={isUploading}
                          className="bg-[#27c862] hover:bg-[#22b358] text-black"
                        >
                          {isUploading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              Processing...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              {step.status === 'pending' ? 'Start' : 'Continue'}
                            </div>
                          )}
                        </Button>
                        
                        {step.id === 'sce_verification' && (
                          <Button variant="outline" className="px-4 py-1">
                            <Building2 className="h-4 w-4 mr-2" />
                            Visit SCE Portal
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Verification Benefits */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Why Verify Your Identity?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Access to premium job opportunities</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Build trust with potential clients</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Priority support and faster payouts</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Compliance with Saudi regulations</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Enhanced profile visibility</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">Access to enterprise projects</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
