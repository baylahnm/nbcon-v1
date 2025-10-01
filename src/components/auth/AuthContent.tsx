import { useState } from "react";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Building, 
  MapPin, 
  Globe,
  Shield,
  CheckCircle,
  ArrowRight,
  Languages,
  Briefcase
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Function to ensure user profile exists in database
const ensureUserProfileExists = async (user: AuthenticatedUser) => {
  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!existingProfile) {
      // Create profile if it doesn't exist
      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: user.id,
            role: user.role,
            first_name: user.name.split(' ')[0],
            last_name: user.name.split(' ').slice(1).join(' ') || '',
            email: user.email,
            phone: user.phone,
            location_city: user.location.split(',')[0]?.trim(),
            location_region: user.location.split(',').slice(1).join(',').trim() || '',
            preferred_language: user.language,
            theme_preference: 'light',
            rtl_enabled: user.language === 'ar'
          }
        ]);

      if (error) {
        console.error('Error creating user profile:', error);
      } else {
        console.log('User profile created successfully');
      }
    }
  } catch (error) {
    console.error('Error ensuring user profile exists:', error);
  }
};

interface AuthContentProps {
  onAuthSuccess: (user: AuthenticatedUser) => void;
  onNeedOTPVerification: (user: Partial<AuthenticatedUser>, method: 'sms' | 'email') => void;
  onBack?: () => void;
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

interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  location: string;
  company?: string;
  sceNumber?: string;
  language: 'ar' | 'en';
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
}

export function AuthContent({ onAuthSuccess, onNeedOTPVerification, onBack }: AuthContentProps) {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('en');

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Signup form state  
  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    location: '',
    company: '',
    sceNumber: '',
    language: 'en',
    agreeToTerms: false,
    subscribeNewsletter: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateSCENumber = (sceNumber: string) => {
    if (!sceNumber) return true; // Optional for non-engineers
    const sceRegex = /^SCE-\d{5,6}$/;
    return sceRegex.test(sceNumber);
  };

  const validateSaudiPhone = (phone: string) => {
    const phoneRegex = /^(\+966|0)?[5][0-9]{8}$/;
    return phoneRegex.test(phone);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!loginData.email) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = language === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email';
    }

    if (!loginData.password) {
      newErrors.password = language === 'ar' ? 'كلمة المرور مطلوبة' : 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful login
      const mockUser: AuthenticatedUser = {
        id: 'a938012d-b35b-40ab-91d4-bcbd5678216a', // Valid UUID format
        email: loginData.email,
        name: 'Nasser Baylah',
        role: 'engineer',
        isVerified: true,
        sceNumber: 'SCE-67892',
        company: 'NEOM Development Authority',
        location: 'Riyadh, Saudi Arabia',
        phone: '+966501234567',
        language: language,
        avatar: 'engineer-male-1'
      };

      // Ensure user profile exists in database
      await ensureUserProfileExists(mockUser);
      
      onAuthSuccess(mockUser);
    } catch (error) {
      setErrors({ 
        submit: language === 'ar' ? 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.' : 'Login failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!signupData.name.trim()) {
      newErrors.name = language === 'ar' ? 'الاسم الكامل مطلوب' : 'Full name is required';
    }

    if (!signupData.email) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!validateEmail(signupData.email)) {
      newErrors.email = language === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email';
    }

    if (!signupData.password) {
      newErrors.password = language === 'ar' ? 'كلمة المرور مطلوبة' : 'Password is required';
    } else if (!validatePassword(signupData.password)) {
      newErrors.password = language === 'ar' ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters';
    }

    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match';
    }

    if (!signupData.phone) {
      newErrors.phone = language === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required';
    } else if (!validateSaudiPhone(signupData.phone)) {
      newErrors.phone = language === 'ar' ? 'يرجى إدخال رقم هاتف سعودي صحيح' : 'Please enter a valid Saudi phone number';
    }

    if (!signupData.location) {
      newErrors.location = language === 'ar' ? 'الموقع مطلوب' : 'Location is required';
    }

    if (signupData.sceNumber && !validateSCENumber(signupData.sceNumber)) {
      newErrors.sceNumber = language === 'ar' ? 'يرجى إدخال رقم هيئة المهندسين صحيح (مثل: SCE-12345)' : 'Please enter a valid SCE number (e.g., SCE-12345)';
    }

    if (!signupData.agreeToTerms) {
      newErrors.terms = language === 'ar' ? 'يجب الموافقة على الشروط والأحكام' : 'You must agree to the Terms of Service';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For new users, redirect to OTP verification
      const partialUser: Partial<AuthenticatedUser> = {
        id: 'a938012d-b35b-40ab-91d4-bcbd5678216a', // Valid UUID format
        email: signupData.email,
        name: signupData.name,
        phone: signupData.phone,
        location: signupData.location,
        company: signupData.company,
        sceNumber: signupData.sceNumber,
        language: signupData.language,
        isVerified: false
      };

      // Determine OTP method based on available data
      const otpMethod = signupData.phone ? 'sms' : 'email';
      onNeedOTPVerification(partialUser, otpMethod);
    } catch (error) {
      setErrors({ 
        submit: language === 'ar' ? 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.' : 'Signup failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saudiCities = [
    'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Dhahran',
    'Tabuk', 'Abha', 'Najran', 'Jazan', 'Hail', 'Al Kharj', 'Taif',
    'Jubail', 'Yanbu', 'Al-Ahsa', 'Qassim', 'Arar', 'Sakakah'
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="w-full max-w-md">
        {/* Back Button */}
        {onBack && (
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
        )}

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

        {/* Main Auth Card */}
        <Card className="shadow-xl border-border/20">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <Building className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl text-foreground">
              {language === 'ar' ? 'مرحباً بك في nbcon' : 'Welcome to nbcon'}
            </CardTitle>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'منصة الهندسة الاحترافية في المملكة العربية السعودية'
                : 'Saudi Arabia\'s Professional Engineering Marketplace'
              }
            </p>
          </CardHeader>

          <CardContent>
            <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'login' | 'signup')}>
              <div className="border-b border-sidebar-border mb-6">
                <TabsList className="h-auto bg-transparent p-0 border-0 rounded-none w-full">
                  <div className="flex items-center w-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-card hover:scrollbar-thumb-primary/80">
                    <TabsTrigger value="login" className="flex items-center gap-2 px-4 py-3 min-w-fit">
                    {language === 'ar' ? 'تسجيل دخول' : 'Sign In'}
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="flex items-center gap-2 px-4 py-3 min-w-fit">
                    {language === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
                  </TabsTrigger>
                  </div>
                </TabsList>
              </div>

              {/* Login Form */}
              <TabsContent value="login">
                {/* Social Auth Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center justify-center gap-2 h-11"
                    onClick={() => console.log('Google login')}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Google</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center justify-center gap-2 h-11"
                    onClick={() => console.log('Facebook login')}
                  >
                    <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </Button>
                </div>

                <div className="relative mb-6">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                    {language === 'ar' ? 'أو' : 'or'}
                  </span>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        className="pl-10 bg-background border-primary/20 focus-visible:border-primary focus-visible:ring-primary/20"
                        autoComplete="username"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">
                      {language === 'ar' ? 'كلمة المرور' : 'Password'}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        className="pl-10 pr-10 bg-background border-primary/20 focus-visible:border-primary focus-visible:ring-primary/20"
                        autoComplete="current-password"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
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
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember"
                        checked={loginData.rememberMe}
                        onCheckedChange={(checked) => setLoginData({...loginData, rememberMe: !!checked})}
                      />
                      <Label htmlFor="remember" className="text-sm">
                        {language === 'ar' ? 'تذكرني' : 'Remember me'}
                      </Label>
                    </div>
                    <Button variant="link" className="text-sm p-0 h-auto">
                      {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                    </Button>
                  </div>

                  {errors.submit && (
                    <p className="text-sm text-destructive text-center">{errors.submit}</p>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        {language === 'ar' ? 'جاري تسجيل الدخول...' : 'Signing in...'}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {language === 'ar' ? 'تسجيل دخول' : 'Sign In'}
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Signup Form */}
              <TabsContent value="signup">
                {/* Social Auth Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center justify-center gap-2 h-11"
                    onClick={() => console.log('Google signup')}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Google</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center justify-center gap-2 h-11"
                    onClick={() => console.log('Facebook signup')}
                  >
                    <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </Button>
                </div>

                <div className="relative mb-6">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                    {language === 'ar' ? 'أو' : 'or'}
                  </span>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">
                      {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                        value={signupData.name}
                        onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                        className="pl-10 bg-input-background border-border"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                        value={signupData.email}
                        onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                        className="pl-10 bg-input-background border-border"
                        autoComplete="email"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">
                        {language === 'ar' ? 'كلمة المرور' : 'Password'}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'}
                          value={signupData.password}
                          onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                          className="pl-10 pr-10 bg-input-background border-border"
                          autoComplete="new-password"
                          dir={language === 'ar' ? 'rtl' : 'ltr'}
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
                      {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password">
                        {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="signup-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={language === 'ar' ? 'أكد كلمة المرور' : 'Confirm password'}
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                          className="pl-10 pr-10 bg-input-background border-border"
                          autoComplete="new-password"
                          dir={language === 'ar' ? 'rtl' : 'ltr'}
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
                      {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">
                      {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder={language === 'ar' ? '+966501234567' : '+966501234567'}
                        value={signupData.phone}
                        onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                        className="pl-10 bg-input-background border-border"
                        dir="ltr"
                      />
                    </div>
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-location">
                      {language === 'ar' ? 'الموقع' : 'Location'}
                    </Label>
                    <Select 
                      value={signupData.location} 
                      onValueChange={(value) => setSignupData({...signupData, location: value})}
                    >
                      <SelectTrigger className="bg-input-background border-border">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <SelectValue placeholder={language === 'ar' ? 'اختر مدينتك' : 'Select your city'} />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {saudiCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-company">
                      {language === 'ar' ? 'الشركة (اختياري)' : 'Company (Optional)'}
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signup-company"
                        type="text"
                        placeholder={language === 'ar' ? 'اسم الشركة' : 'Company name'}
                        value={signupData.company}
                        onChange={(e) => setSignupData({...signupData, company: e.target.value})}
                        className="pl-10 bg-input-background border-border"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-sce">
                      {language === 'ar' ? 'رقم هيئة المهندسين (اختياري)' : 'SCE Number (Optional)'}
                    </Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signup-sce"
                        type="text"
                        placeholder="SCE-12345"
                        value={signupData.sceNumber}
                        onChange={(e) => setSignupData({...signupData, sceNumber: e.target.value})}
                        className="pl-10 bg-input-background border-border"
                        dir="ltr"
                      />
                    </div>
                    {errors.sceNumber && <p className="text-sm text-destructive">{errors.sceNumber}</p>}
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' 
                        ? 'للمهندسين المسجلين في هيئة المهندسين السعودية'
                        : 'For registered Saudi Council of Engineers members'
                      }
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terms"
                        checked={signupData.agreeToTerms}
                        onCheckedChange={(checked) => setSignupData({...signupData, agreeToTerms: !!checked})}
                      />
                      <Label htmlFor="terms" className="text-sm leading-tight">
                        {language === 'ar' 
                          ? 'أوافق على الشروط والأحكام وسياسة الخصوصية'
                          : 'I agree to the Terms of Service and Privacy Policy'
                        }
                      </Label>
                    </div>
                    {errors.terms && <p className="text-sm text-destructive">{errors.terms}</p>}

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="newsletter"
                        checked={signupData.subscribeNewsletter}
                        onCheckedChange={(checked) => setSignupData({...signupData, subscribeNewsletter: !!checked})}
                      />
                      <Label htmlFor="newsletter" className="text-sm leading-tight text-muted-foreground">
                        {language === 'ar' 
                          ? 'أرغب في تلقي النشرة الإخبارية والتحديثات'
                          : 'Subscribe to newsletter and updates'
                        }
                      </Label>
                    </div>
                  </div>

                  {errors.submit && (
                    <p className="text-sm text-destructive text-center">{errors.submit}</p>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        {language === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating account...'}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {language === 'ar' ? 'إنشاء حساب' : 'Create Account'}
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Security Badge */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>
                  {language === 'ar' 
                    ? 'محمي بأعلى معايير الأمان'
                    : 'Protected by enterprise-grade security'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'فرص عمل' : 'Job Opportunities'}
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'معتمد من هيئة المهندسين' : 'SCE Verified'}
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'شبكة مهنية' : 'Professional Network'}
            </p>
          </div>
        </div>
      </div>
      </div>

      {/* Right Side - Dashboard Preview */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-primary/90 p-12 items-center justify-center relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-lg">
          {/* Header Text */}
          <div className="text-white mb-8">
            <h2 className="text-4xl font-bold mb-4">
              {language === 'ar' 
                ? 'الطريقة الأبسط لإدارة قوة العمل الهندسية'
                : 'The simplest way to manage your engineering workforce'
              }
            </h2>
            <p className="text-primary-foreground/80 text-lg">
              {language === 'ar'
                ? 'أدخل بياناتك للوصول إلى حسابك'
                : 'Enter your credentials to access your account'
              }
            </p>
          </div>

          {/* Dashboard Mockup */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Mockup Header */}
            <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <span className="text-sm text-muted-foreground">Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {language === 'ar' ? 'أحمد' : 'Ahmad'}
                </span>
              </div>
            </div>

            {/* Mockup Content */}
            <div className="p-6 space-y-4">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'الإنتاجية' : 'Productive Time'}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">+28%</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground">12.4 hr</div>
                  <div className="mt-2 h-8 flex items-end gap-1">
                    <div className="w-4 bg-primary/30 rounded-t" style={{height: '40%'}}></div>
                    <div className="w-4 bg-primary/50 rounded-t" style={{height: '60%'}}></div>
                    <div className="w-4 bg-primary/40 rounded-t" style={{height: '45%'}}></div>
                    <div className="w-4 bg-primary/60 rounded-t" style={{height: '75%'}}></div>
                    <div className="w-4 bg-primary rounded-t" style={{height: '90%'}}></div>
                  </div>
                </div>

                <div className="bg-accent/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'المشاريع' : 'Projects'}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-blue-600">+18%</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground">8.5</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {language === 'ar' ? '2 معلقة' : '2 pending'}
                  </div>
                </div>
              </div>

              {/* Team List */}
              <div className="bg-muted/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground">
                    {language === 'ar' ? 'الفريق' : 'Team Utilization'}
                  </span>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    {language === 'ar' ? 'عرض الكل' : 'View All'}
                  </Button>
                </div>
                <div className="space-y-2">
                  {[
                    { name: language === 'ar' ? 'سارة محمد' : 'Sarah Mohammed', progress: 65, color: 'bg-primary' },
                    { name: language === 'ar' ? 'خالد العلي' : 'Khalid Al-Ali', progress: 85, color: 'bg-green-500' },
                    { name: language === 'ar' ? 'فاطمة أحمد' : 'Fatima Ahmed', progress: 50, color: 'bg-yellow-500' },
                  ].map((member, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">{member.name[0]}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-foreground">{member.name}</div>
                        <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                          <div className={`${member.color} h-1.5 rounded-full`} style={{width: `${member.progress}%`}}></div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{member.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trusted By Logos */}
          <div className="mt-8 flex items-center justify-center gap-6 opacity-60">
            <span className="text-white text-sm font-semibold">ARAMCO</span>
            <span className="text-white text-sm font-semibold">NEOM</span>
            <span className="text-white text-sm font-semibold">SABIC</span>
            <span className="text-white text-sm font-semibold">PIF</span>
          </div>
        </div>
      </div>
    </div>
  );
}
