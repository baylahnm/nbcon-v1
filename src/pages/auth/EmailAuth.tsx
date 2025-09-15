import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Eye, EyeOff, Globe, ArrowLeft, Phone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function EmailAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const navigate = useNavigate();
  const { toast } = useToast();

  const isRTL = language === 'ar';

  // Content for both languages
  const content = {
    en: {
      title: isLogin ? 'Welcome Back' : 'Create Account',
      subtitle: isLogin ? 'Sign in to your nbcon account' : 'Join the engineering excellence platform',
      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter your email',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      signIn: 'Sign In',
      signUp: 'Create Account',
      signingIn: 'Signing In...',
      creatingAccount: 'Creating Account...',
      noAccount: "Don't have an account? Sign up",
      hasAccount: 'Already have an account? Sign in',
      phoneOption: 'Continue with Phone instead',
      backToAuth: 'Back to Phone Auth'
    },
    ar: {
      title: isLogin ? 'أهلاً بعودتك' : 'إنشاء حساب',
      subtitle: isLogin ? 'سجل الدخول إلى حسابك في nbcon' : 'انضم إلى منصة التميز الهندسي',
      emailLabel: 'البريد الإلكتروني',
      emailPlaceholder: 'أدخل بريدك الإلكتروني',
      passwordLabel: 'كلمة المرور',
      passwordPlaceholder: 'أدخل كلمة المرور',
      signIn: 'تسجيل الدخول',
      signUp: 'إنشاء حساب',
      signingIn: 'جاري تسجيل الدخول...',
      creatingAccount: 'جاري إنشاء الحساب...',
      noAccount: 'ليس لديك حساب؟ سجل الآن',
      hasAccount: 'لديك حساب بالفعل؟ سجل الدخول',
      phoneOption: 'المتابعة بالجوال بدلاً من ذلك',
      backToAuth: 'العودة لتسجيل الدخول بالجوال'
    }
  };

  const t = content[language];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          toast({
            title: 'Login Failed',
            description: error.message,
            variant: 'destructive',
          });
          return;
        }
        
        toast({
          title: 'Welcome back!',
          description: 'You have been signed in successfully.',
        });
        
        navigate('/auth/role');
      } else {
        const redirectUrl = `${window.location.origin}/auth/role`;
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl
          }
        });
        
        if (error) {
          toast({
            title: 'Sign Up Failed',
            description: error.message,
            variant: 'destructive',
          });
          return;
        }
        
        toast({
          title: 'Check your email',
          description: 'We sent you a confirmation link to complete your registration.',
        });
      }
    } catch (error) {
      toast({
        title: 'Authentication Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header with Back Button and Language Toggle */}
      <div className="p-4 flex justify-between items-center">
        <Link to="/auth" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.backToAuth}
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-green-600 rounded-3xl mb-6 shadow-xl">
              <span className="text-3xl font-bold text-white">nb</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
            <p className="text-muted-foreground text-sm">{t.subtitle}</p>
          </div>
          
          {/* Auth Card */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">{t.emailLabel}</Label>
                <div className="relative">
                  <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4`} />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${isRTL ? 'pr-10' : 'pl-10'} h-12 text-lg`}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">{t.passwordLabel}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-lg pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-primary to-green-600 hover:shadow-lg transition-all duration-300 text-lg font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    {isLogin ? t.signingIn : t.creatingAccount}
                  </div>
                ) : (
                  isLogin ? t.signIn : t.signUp
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-primary hover:underline"
                >
                  {isLogin ? t.noAccount : t.hasAccount}
                </button>
              </div>

              <div className="relative">
                <Separator />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                  OR
                </span>
              </div>
              
              <Link to="/auth">
                <Button variant="outline" className="w-full h-12 gap-2" type="button">
                  <Phone className="w-4 h-4" />
                  {t.phoneOption}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}