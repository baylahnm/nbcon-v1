import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Phone } from 'lucide-react';

export default function PhoneAuth() {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
        options: {
          shouldCreateUser: true,
        }
      });

      if (error) throw error;

      // Store phone for verification step
      localStorage.setItem('nbcon_temp_phone', phone);
      
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code.",
      });
      
      navigate('/auth/verify');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome to nbcon"
      subtitle="Enter your phone number to get started"
    >
      <form onSubmit={handleSendOTP} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="+966 50 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            We'll send you a verification code via SMS
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300" 
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Verification Code
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </AuthLayout>
  );
}