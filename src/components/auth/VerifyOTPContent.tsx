import { useState, useEffect, useRef } from "react";
import { 
  Shield,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  Phone,
  Mail,
  Clock,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface VerifyOTPContentProps {
  user: Partial<AuthenticatedUser>;
  otpMethod: 'sms' | 'email';
  onOTPVerified: (user: Partial<AuthenticatedUser>) => void;
  onBack: () => void;
  onResendOTP: () => void;
}

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

export function VerifyOTPContent({ user, otpMethod, onOTPVerified, onBack, onResendOTP }: VerifyOTPContentProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [language] = useState<'ar' | 'en'>(user.language || 'en');
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(''); // Clear error when user types

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      setError('');
      
      // Focus last input
      inputRefs.current[5]?.focus();
      
      // Auto-submit
      handleVerifyOTP(pastedData);
    }
  };

  const handleVerifyOTP = async (otpCode: string = otp.join('')) => {
    if (otpCode.length !== 6) {
      setError(language === 'ar' ? 'يرجى إدخال رمز التحقق المكون من 6 أرقام' : 'Please enter the 6-digit verification code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock verification - in real app, verify with backend
      if (otpCode === '123456' || otpCode === '000000') { // Mock valid codes
        const verifiedUser = {
          ...user,
          isVerified: true
        };
        onOTPVerified(verifiedUser);
      } else {
        setError(language === 'ar' ? 'رمز التحقق غير صحيح' : 'Invalid verification code');
        // Clear OTP on error
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError(language === 'ar' ? 'حدث خطأ في التحقق' : 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onResendOTP();
      setTimeLeft(300); // Reset timer
      setCanResend(false);
      setOtp(['', '', '', '', '', '']); // Clear current OTP
      setError('');
      inputRefs.current[0]?.focus();
    } catch (error) {
      setError(language === 'ar' ? 'فشل في إعادة الإرسال' : 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  const getMaskedContact = () => {
    if (otpMethod === 'sms' && user.phone) {
      // Mask phone number: +966501234567 -> +966****4567
      const phone = user.phone;
      if (phone.length > 4) {
        return phone.slice(0, -4).replace(/\d/g, '*') + phone.slice(-4);
      }
      return phone;
    } else if (otpMethod === 'email' && user.email) {
      // Mask email: john@example.com -> j***@example.com
      const [local, domain] = user.email.split('@');
      if (local.length > 1) {
        return local[0] + '*'.repeat(local.length - 1) + '@' + domain;
      }
      return user.email;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 bg-card border border-sidebar-border rounded-lg p-1">
            <Button
              variant={language === 'en' ? 'default' : 'ghost'}
              size="sm"
              className="text-sm"
            >
              English
            </Button>
            <Button
              variant={language === 'ar' ? 'default' : 'ghost'}
              size="sm"
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
              {language === 'ar' ? 'تحقق من هويتك' : 'Verify Your Identity'}
            </CardTitle>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? `تم إرسال رمز التحقق إلى ${getMaskedContact()}`
                : `Verification code sent to ${getMaskedContact()}`
              }
            </p>
            
            {/* Method indicator */}
            <div className="flex justify-center mt-3">
              <Badge variant="secondary" className="flex items-center gap-2">
                {otpMethod === 'sms' ? (
                  <>
                    <Phone className="w-3 h-3" />
                    {language === 'ar' ? 'رسالة نصية' : 'SMS'}
                  </>
                ) : (
                  <>
                    <Mail className="w-3 h-3" />
                    {language === 'ar' ? 'بريد إلكتروني' : 'Email'}
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {/* OTP Input Fields */}
              <div className="space-y-2">
                <div className="text-center text-sm text-muted-foreground mb-4">
                  {language === 'ar' ? 'أدخل الرمز المكون من 6 أرقام' : 'Enter the 6-digit code'}
                </div>
                
                <div 
                  className="flex justify-center gap-2"
                  dir="ltr" // Always LTR for OTP inputs
                >
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => inputRefs.current[index] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="w-12 h-12 text-center text-lg font-medium bg-input-background border-border"
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive justify-center mt-3">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </div>

              {/* Timer and Resend */}
              <div className="text-center space-y-3">
                {timeLeft > 0 ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      {language === 'ar' 
                        ? `إعادة الإرسال خلال ${formatTime(timeLeft)}`
                        : `Resend code in ${formatTime(timeLeft)}`
                      }
                    </span>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {language === 'ar' ? 'إعادة إرسال الرمز' : 'Resend Code'}
                  </Button>
                )}
              </div>

              {/* Verify Button */}
              <Button 
                onClick={() => handleVerifyOTP()}
                disabled={isLoading || otp.some(digit => digit === '')}
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {language === 'ar' ? 'جاري التحقق...' : 'Verifying...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {language === 'ar' ? 'تحقق من الرمز' : 'Verify Code'}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>

              {/* Back Button */}
              <Button 
                variant="outline" 
                onClick={onBack}
                className="w-full"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'رجوع' : 'Back'}
              </Button>
            </div>

            {/* Security Notice */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>
                  {language === 'ar' 
                    ? 'رمز التحقق صالح لمدة 5 دقائق'
                    : 'Verification code expires in 5 minutes'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {language === 'ar' 
              ? 'لم تستلم الرمز؟ تحقق من مجلد الرسائل غير المرغوب فيها أو جرب طريقة أخرى'
              : 'Didn\'t receive the code? Check your spam folder or try a different method'
            }
          </p>
        </div>

        {/* Debug Info (Remove in production) */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground text-center">
          <p className="font-medium mb-1">
            {language === 'ar' ? 'للاختبار استخدم:' : 'For testing, use:'}
          </p>
          <p>123456 {language === 'ar' ? '(صحيح)' : '(valid)'} • 000000 {language === 'ar' ? '(صحيح)' : '(valid)'}</p>
        </div>
      </div>
    </div>
  );
}
