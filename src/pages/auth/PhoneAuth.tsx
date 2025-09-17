import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Phone, Mail, Globe, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function PhoneAuth() {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const navigate = useNavigate();
  const { toast } = useToast();

  const isRTL = language === 'ar';

  // Content for both languages
  const content = {
    en: {
      title: 'Welcome to nbcon',
      subtitle: 'Engineering Excellence Platform for Saudi Arabia',
      phoneLabel: 'Phone Number',
      phonePlaceholder: '+966 50 123 4567',
      sendCode: 'Send Verification Code',
      smsNote: "We'll send you a verification code via SMS",
      terms: 'By continuing, you agree to our Terms of Service and Privacy Policy',
      emailOption: 'Continue with Email instead',
      backHome: 'Back to Home'
    },
    ar: {
      title: 'أهلاً بك في nbcon',
      subtitle: 'منصة التميز الهندسي للمملكة العربية السعودية',
      phoneLabel: 'رقم الجوال',
      phonePlaceholder: '+966 50 123 4567',
      sendCode: 'إرسال رمز التحقق',
      smsNote: 'سنرسل لك رمز التحقق عبر الرسائل النصية',
      terms: 'بالمتابعة، أنت توافق على شروط الخدمة وسياسة الخصوصية',
      emailOption: 'المتابعة بالبريد الإلكتروني بدلاً من ذلك',
      backHome: 'العودة للرئيسية'
    }
  };

  const t = content[language];

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
    <div className={`min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header with Back Button and Language Toggle */}
      <div className="p-4 flex justify-between items-center">
        <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.backHome}
        </Link>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="gap-2"
        >
          <Globe className="w-4 h-4" />
          {language === 'en' ? 'عربي' : 'EN'}
        </Button>
      </div>

      {/* Main Auth Content */}
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          {/* Logo and Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-green-600 rounded-3xl mb-6 shadow-xl auth-logo">
              <span className="text-3xl font-bold text-white">nb</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2 auth-title">{t.title}</h1>
            <p className="text-muted-foreground text-sm">{t.subtitle}</p>
          </div>
          
          {/* Auth Card */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">{t.phoneLabel}</Label>
                <div className="relative">
                  <Phone className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t.phonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`${isRTL ? 'pr-10' : 'pl-10'} h-12 text-lg hover:border-[var(--primary)] auth-phone-input`}
                    disabled={isLoading}
                    dir="ltr" // Keep phone numbers LTR even in Arabic
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {t.smsNote}
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-green-600 hover:shadow-lg transition-all duration-300 text-lg font-medium auth-submit-btn" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {t.sendCode}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <Separator />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                  OR
                </span>
              </div>
              
              <Link to="/auth/email">
                <Button variant="outline" className="w-full h-12 gap-4 mt-[16px] hover:border-[var(--primary)] auth-email-btn" type="button">
                  <Mail className="w-4 h-4" />
                  {t.emailOption}
                </Button>
              </Link>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t.terms}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}