import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Shield, 
  Clock, 
  Mail, 
  Phone,
  CheckCircle,
  RefreshCw,
  Languages
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useThemeStore } from "@/stores/theme";

interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: 'engineer' | 'client' | 'enterprise' | 'admin';
  isVerified: boolean;
  sceNumber?: string;
  company?: string;
  location: string;
  phone: string;
  language: 'ar' | 'en';
  avatar?: string;
}

interface VerifyOTPContentProps {
  user: Partial<AuthenticatedUser>;
  otpMethod: 'sms' | 'email';
  onOTPVerified: (user: Partial<AuthenticatedUser>) => void;
  onBack: () => void;
  onResendOTP: () => void;
}

export default function VerifyOTPContent({ 
  user, 
  otpMethod, 
  onOTPVerified, 
  onBack, 
  onResendOTP 
}: VerifyOTPContentProps) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [language, setLanguage] = useState<'ar' | 'en'>(user.language || 'en');
  const { toast } = useToast();
  const themeStore = useThemeStore();

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim() || otp.length < 6) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'يرجى إدخال رمز التحقق الصحيح' : 'Please enter a valid verification code',
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Verify OTP with Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        token: otp,
        type: 'email',
        email: user.email
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // OTP verified successfully
        const verifiedUser = {
          ...user,
          id: data.user.id,
          email: data.user.email || user.email,
          isVerified: true
        };

        toast({
          title: language === 'ar' ? 'تم التحقق بنجاح' : 'Verification Successful',
          description: language === 'ar' ? 'تم التحقق من حسابك بنجاح' : 'Your account has been verified successfully',
        });

        onOTPVerified(verifiedUser);
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast({
        title: language === 'ar' ? 'خطأ في التحقق' : 'Verification Failed',
        description: error.message || (language === 'ar' ? 'رمز التحقق غير صحيح' : 'Invalid verification code'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setResendCooldown(60); // 60 seconds cooldown
    onResendOTP();
    
    toast({
      title: language === 'ar' ? 'تم إرسال الرمز' : 'Code Sent',
      description: language === 'ar' 
        ? 'تم إرسال رمز تحقق جديد إلى ' + (otpMethod === 'email' ? user.email : user.phone)
        : `New verification code sent to ${otpMethod === 'email' ? user.email : user.phone}`,
    });
  };

  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - OTP Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <div className="flex justify-start mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              {language === 'ar' ? 'رجوع' : 'Back'}
            </Button>
          </div>

          {/* Language Toggle */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-card border border-sidebar-border rounded-lg p-1">
              <Button
                variant={language === 'en' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('en')}
                className="text-sm"
              >
                English
              </Button>
              <Button
                variant={language === 'ar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('ar')}
                className="text-sm"
              >
                العربية
              </Button>
            </div>
          </div>

          {/* Main OTP Card */}
          <Card className="shadow-xl border-border/20">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl text-foreground">
                {language === 'ar' ? 'التحقق من الحساب' : 'Verify Your Account'}
              </CardTitle>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'أدخل رمز التحقق المرسل إلى حسابك'
                  : 'Enter the verification code sent to your account'
                }
              </p>
            </CardHeader>

            <CardContent>
              {/* Contact Info */}
              <div className={`flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {otpMethod === 'email' ? (
                  <Mail className="w-4 h-4" />
                ) : (
                  <Phone className="w-4 h-4" />
                )}
                <span>
                  {otpMethod === 'email' ? user.email : user.phone}
                </span>
              </div>

              <form onSubmit={handleOTPSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                    {language === 'ar' ? 'رمز التحقق' : 'Verification Code'}
                  </Label>
                  
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                      onComplete={(value) => {
                        setOtp(value);
                        if (value.length === 6) {
                          handleOTPSubmit({ preventDefault: () => {} } as React.FormEvent);
                        }
                      }}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="bg-background" />
                        <InputOTPSlot index={1} className="bg-background" />
                        <InputOTPSlot index={2} className="bg-background" />
                        <InputOTPSlot index={3} className="bg-background" />
                        <InputOTPSlot index={4} className="bg-background" />
                        <InputOTPSlot index={5} className="bg-background" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-3"
                  disabled={isLoading || otp.length < 6}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{language === 'ar' ? 'جاري التحقق...' : 'Verifying...'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>{language === 'ar' ? 'تحقق من الرمز' : 'Verify Code'}</span>
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center space-y-4 mt-6">
                <div className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'لم تستلم الرمز؟' : "Didn't receive the code?"}
                </div>
                
                <Button
                  variant="outline"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="w-full"
                >
                  {resendCooldown > 0 ? (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {language === 'ar' 
                          ? `إعادة الإرسال خلال ${resendCooldown}ث`
                          : `Resend in ${resendCooldown}s`
                        }
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      <span>{language === 'ar' ? 'إعادة إرسال الرمز' : 'Resend Code'}</span>
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 items-center justify-center p-8">
        <div className="text-center space-y-6 text-primary-foreground">
          <div className="w-24 h-24 mx-auto bg-primary-foreground/10 rounded-full flex items-center justify-center">
            <Shield className="w-12 h-12 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {language === 'ar' ? 'nbcon' : 'nbcon'}
            </h2>
            <p className="text-lg opacity-90">
              {language === 'ar' 
                ? 'منصة الهندسة الاحترافية في المملكة العربية السعودية'
                : 'Saudi Arabia\'s Professional Engineering Marketplace'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
