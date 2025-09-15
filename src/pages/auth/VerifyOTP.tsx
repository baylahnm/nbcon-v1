import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/auth';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function VerifyOTP() {
  const [otp, setOTP] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCurrentProfile } = useAuthStore();

  useEffect(() => {
    const tempPhone = localStorage.getItem('nbcon_temp_phone');
    if (!tempPhone) {
      navigate('/auth/phone');
      return;
    }
    setPhone(tempPhone);
  }, [navigate]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      toast({
        title: "Verification code required",
        description: "Please enter the 6-digit code sent to your phone.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms'
      });

      if (error) throw error;

      // Clean up temp storage
      localStorage.removeItem('nbcon_temp_phone');

      // Check if user has a profile
      const profile = await getCurrentProfile();
      
      if (profile) {
        // Redirect based on role
        switch (profile.role) {
          case 'engineer':
            navigate('/engineer');
            break;
          case 'client':
            navigate('/client');
            break;
          case 'enterprise':
            navigate('/enterprise');
            break;
          default:
            navigate('/');
        }
      } else {
        // No profile, go to role selection
        navigate('/auth/role');
      }

      toast({
        title: "Welcome to nbcon!",
        description: "Your phone number has been verified successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
      });

      if (error) throw error;

      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your phone.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify Your Phone"
      subtitle={`Enter the 6-digit code sent to ${phone}`}
    >
      <form onSubmit={handleVerifyOTP} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="text-center text-lg tracking-widest"
            disabled={isLoading}
            maxLength={6}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300" 
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify & Continue
        </Button>

        <div className="flex items-center justify-between text-sm">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate('/auth/phone')}
            disabled={isLoading}
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResendOTP}
            disabled={isLoading}
          >
            Resend Code
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}