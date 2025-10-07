import { useState } from "react";
import { 
  User,
  Building,
  MapPin,
  Phone,
  Mail,
  Shield,
  ArrowRight,
  ArrowLeft,
  Camera,
  Upload,
  CheckCircle,
  Award,
  Briefcase,
  Globe,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface ProfileSetupProps {
  user: AuthenticatedUser;
  onProfileComplete: (user: AuthenticatedUser) => void;
  onBack: () => void;
  shouldExitOnBack?: boolean;
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

interface ProfileData {
  bio: string;
  specialties: string[];
  experience: string;
  education: string;
  certifications: string[];
  portfolio: string;
  availability: string;
  hourlyRate?: string;
  projectBudget?: string;
  companySize?: string;
  industryFocus: string[];
}

export function ProfileSetup({ user, onProfileComplete, onBack, shouldExitOnBack = false }: ProfileSetupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [language] = useState<'ar' | 'en'>(user.language || 'en');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    bio: '',
    specialties: [],
    experience: '',
    education: '',
    certifications: [],
    portfolio: '',
    availability: '',
    hourlyRate: '',
    projectBudget: '',
    companySize: '',
    industryFocus: []
  });

  const engineeringSpecialties = [
    'Structural Engineering', 'Civil Engineering', 'Mechanical Engineering',
    'Electrical Engineering', 'Environmental Engineering', 'Chemical Engineering',
    'Petroleum Engineering', 'Industrial Engineering', 'Software Engineering',
    'Project Management', 'Quality Assurance', 'Safety Engineering'
  ];

  const clientIndustries = [
    'Construction', 'Oil & Gas', 'Renewable Energy', 'Manufacturing',
    'Infrastructure', 'Real Estate', 'Technology', 'Healthcare',
    'Education', 'Transportation', 'Water & Utilities', 'Mining'
  ];

  const experienceLevels = [
    { value: 'entry', label: { en: 'Entry Level (0-2 years)', ar: 'مبتدئ (0-2 سنوات)' } },
    { value: 'mid', label: { en: 'Mid Level (3-5 years)', ar: 'متوسط (3-5 سنوات)' } },
    { value: 'senior', label: { en: 'Senior Level (6-10 years)', ar: 'كبير (6-10 سنوات)' } },
    { value: 'expert', label: { en: 'Expert Level (10+ years)', ar: 'خبير (10+ سنوات)' } }
  ];

  const availabilityOptions = [
    { value: 'full-time', label: { en: 'Full Time', ar: 'دوام كامل' } },
    { value: 'part-time', label: { en: 'Part Time', ar: 'دوام جزئي' } },
    { value: 'contract', label: { en: 'Contract Basis', ar: 'عقد' } },
    { value: 'consultation', label: { en: 'Consultation Only', ar: 'استشارات فقط' } }
  ];

  const companySizes = [
    { value: 'startup', label: { en: 'Startup (1-10 employees)', ar: 'شركة ناشئة (1-10 موظفين)' } },
    { value: 'small', label: { en: 'Small (11-50 employees)', ar: 'صغيرة (11-50 موظف)' } },
    { value: 'medium', label: { en: 'Medium (51-200 employees)', ar: 'متوسطة (51-200 موظف)' } },
    { value: 'large', label: { en: 'Large (200+ employees)', ar: 'كبيرة (200+ موظف)' } }
  ];

  const steps = [
    {
      id: 1,
      title: { en: 'Basic Information', ar: 'المعلومات الأساسية' },
      description: { en: 'Tell us about yourself', ar: 'أخبرنا عن نفسك' }
    },
    {
      id: 2,
      title: { en: 'Professional Details', ar: 'التفاصيل المهنية' },
      description: { en: 'Your expertise and experience', ar: 'خبرتك وتخصصك' }
    },
    {
      id: 3,
      title: { en: 'Preferences', ar: 'التفضيلات' },
      description: { en: 'Work preferences and availability', ar: 'تفضيلات العمل والتوفر' }
    }
  ];

  const handleSpecialtyToggle = (specialty: string) => {
    setProfileData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleIndustryToggle = (industry: string) => {
    setProfileData(prev => ({
      ...prev,
      industryFocus: prev.industryFocus.includes(industry)
        ? prev.industryFocus.filter(i => i !== industry)
        : [...prev.industryFocus, industry]
    }));
  };

  const handleCertificationAdd = (cert: string) => {
    if (cert.trim() && !profileData.certifications.includes(cert.trim())) {
      setProfileData(prev => ({
        ...prev,
        certifications: [...prev.certifications, cert.trim()]
      }));
    }
  };

  const handleCertificationRemove = (cert: string) => {
    setProfileData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== cert)
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const completeUser: AuthenticatedUser = {
        ...user,
        // Add profile data to user object
        avatar: avatarPreview || user.avatar || `user-${user.role}-1`
      };

      onProfileComplete(completeUser);
    } catch (error) {
      console.error('Profile setup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <div className="text-center">
        <div className="relative inline-block">
          <Avatar className="w-24 h-24 border-4 border-border">
            <AvatarImage src={avatarPreview || `/avatars/${user.avatar || `user-${user.role}-1`}.jpg`} />
            <AvatarFallback className="text-lg">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <Button
            size="sm"
            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
            variant="secondary"
            onClick={() => document.getElementById('avatar-input')?.click()}
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {language === 'ar' ? 'انقر لتغيير الصورة' : 'Click to change photo'}
        </p>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">
          {language === 'ar' ? 'نبذة شخصية' : 'Professional Bio'}
        </Label>
        <Textarea
          id="bio"
          placeholder={language === 'ar' ? 'اكتب نبذة عن نفسك وخبراتك المهنية...' : 'Tell us about yourself and your professional experience...'}
          value={profileData.bio}
          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
          className="min-h-[120px] resize-none"
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        />
        <p className="text-xs text-muted-foreground">
          {language === 'ar' ? 'أخبر الآخرين عن خبرتك وأهدافك المهنية' : 'Help others understand your expertise and professional goals'}
        </p>
      </div>

      {/* Education */}
      <div className="space-y-2">
        <Label htmlFor="education">
          {language === 'ar' ? 'التعليم' : 'Education'}
        </Label>
        <Input
          id="education"
          placeholder={language === 'ar' ? 'مثال: بكالوريوس هندسة مدنية - جامعة الملك سعود' : 'e.g., Bachelor of Civil Engineering - King Saud University'}
          value={profileData.education}
          onChange={(e) => setProfileData(prev => ({ ...prev, education: e.target.value }))}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Portfolio */}
      <div className="space-y-2">
        <Label htmlFor="portfolio">
          {language === 'ar' ? 'الموقع الشخصي/معرض الأعمال' : 'Portfolio/Personal Website'}
        </Label>
        <Input
          id="portfolio"
          type="url"
          placeholder="https://your-portfolio.com"
          value={profileData.portfolio}
          onChange={(e) => setProfileData(prev => ({ ...prev, portfolio: e.target.value }))}
          dir="ltr"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Experience Level */}
      <div className="space-y-2">
        <Label>
          {language === 'ar' ? 'مستوى الخبرة' : 'Experience Level'}
        </Label>
        <Select 
          value={profileData.experience} 
          onValueChange={(value) => setProfileData(prev => ({ ...prev, experience: value }))}
        >
          <SelectTrigger className="bg-background text-foreground [&_svg]:text-primary">
            <SelectValue placeholder={language === 'ar' ? 'اختر مستوى خبرتك' : 'Select your experience level'} />
          </SelectTrigger>
          <SelectContent className="bg-background text-foreground">
            {experienceLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label[language]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Specialties (for engineers) */}
      {user.role === 'engineer' && (
        <div className="space-y-3">
          <Label>
            {language === 'ar' ? 'التخصصات' : 'Specialties'}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {engineeringSpecialties.map((specialty) => (
              <Button
                key={specialty}
                variant={profileData.specialties.includes(specialty) ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSpecialtyToggle(specialty)}
                className="justify-start text-sm"
              >
                {specialty}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Industry Focus (for clients/enterprise) */}
      {(user.role === 'client' || user.role === 'enterprise') && (
        <div className="space-y-3">
          <Label>
            {language === 'ar' ? 'القطاعات المستهدفة' : 'Target Industries'}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {clientIndustries.map((industry) => (
              <Button
                key={industry}
                variant={profileData.industryFocus.includes(industry) ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleIndustryToggle(industry)}
                className="justify-start text-sm"
              >
                {industry}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      <div className="space-y-3">
        <Label>
          {language === 'ar' ? 'الشهادات' : 'Certifications'}
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder={language === 'ar' ? 'أضف شهادة جديدة' : 'Add new certification'}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCertificationAdd(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
          <input
            id="certifications-input"
            type="file"
            accept="application/pdf,image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (!files.length) return;
              const names = files.map(f => f.name);
              names.forEach((n) => handleCertificationAdd(n));
              // Reset input so same files can be re-selected if needed
              e.currentTarget.value = '';
            }}
          />
          <Button
            type="button"
            onClick={() => document.getElementById('certifications-input')?.click()}
          >
            <Upload className="w-4 h-4" />
          </Button>
        </div>
        {profileData.certifications.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {profileData.certifications.map((cert, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {cert}
                <button
                  onClick={() => handleCertificationRemove(cert)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Availability */}
      <div className="space-y-2">
        <Label>
          {language === 'ar' ? 'التوفر' : 'Availability'}
        </Label>
        <Select 
          value={profileData.availability} 
          onValueChange={(value) => setProfileData(prev => ({ ...prev, availability: value }))}
        >
          <SelectTrigger className="bg-background text-foreground [&_svg]:text-primary">
            <SelectValue placeholder={language === 'ar' ? 'اختر نوع التوفر' : 'Select your availability'} />
          </SelectTrigger>
          <SelectContent className="bg-background text-foreground">
            {availabilityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label[language]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rate/Budget based on role */}
      {user.role === 'engineer' && (
        <div className="space-y-2">
          <Label htmlFor="hourlyRate">
            {language === 'ar' ? 'المعدل بالساعة (اختياري)' : 'Hourly Rate (Optional)'}
          </Label>
          <Input
            id="hourlyRate"
            type="number"
            placeholder="500"
            value={profileData.hourlyRate}
            onChange={(e) => setProfileData(prev => ({ ...prev, hourlyRate: e.target.value }))}
            dir="ltr"
          />
          <p className="text-xs text-muted-foreground">
            {language === 'ar' ? 'بالريال السعودي' : 'In Saudi Riyals'}
          </p>
        </div>
      )}

      {(user.role === 'client' || user.role === 'enterprise') && (
        <>
          <div className="space-y-2">
            <Label htmlFor="projectBudget">
              {language === 'ar' ? 'ميزانية المشروع المتوقعة' : 'Expected Project Budget'}
            </Label>
            <Select 
              value={profileData.projectBudget} 
              onValueChange={(value) => setProfileData(prev => ({ ...prev, projectBudget: value }))}
            >
              <SelectTrigger className="bg-background text-foreground [&_svg]:text-primary">
                <SelectValue placeholder={language === 'ar' ? 'اختر نطاق الميزانية' : 'Select budget range'} />
              </SelectTrigger>
              <SelectContent className="bg-background text-foreground">
                <SelectItem value="under-50k">{language === 'ar' ? 'أقل من 50,000 ريال' : 'Under 50,000 SAR'}</SelectItem>
                <SelectItem value="50k-100k">{language === 'ar' ? '50,000 - 100,000 ريال' : '50,000 - 100,000 SAR'}</SelectItem>
                <SelectItem value="100k-500k">{language === 'ar' ? '100,000 - 500,000 ريال' : '100,000 - 500,000 SAR'}</SelectItem>
                <SelectItem value="500k-1m">{language === 'ar' ? '500,000 - 1,000,000 ريال' : '500,000 - 1,000,000 SAR'}</SelectItem>
                <SelectItem value="over-1m">{language === 'ar' ? 'أكثر من 1,000,000 ريال' : 'Over 1,000,000 SAR'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {user.role === 'enterprise' && (
            <div className="space-y-2">
              <Label>
                {language === 'ar' ? 'حجم الشركة' : 'Company Size'}
              </Label>
              <Select 
                value={profileData.companySize} 
                onValueChange={(value) => setProfileData(prev => ({ ...prev, companySize: value }))}
              >
                <SelectTrigger className="bg-background text-foreground [&_svg]:text-primary">
                  <SelectValue placeholder={language === 'ar' ? 'اختر حجم الشركة' : 'Select company size'} />
                </SelectTrigger>
                <SelectContent className="bg-background text-foreground">
                  {companySizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label[language]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
                <div className={`w-16 h-0.5 mx-2 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-border/20">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl text-foreground">
              {steps[currentStep - 1].title[language]}
            </CardTitle>
            <p className="text-muted-foreground">
              {steps[currentStep - 1].description[language]}
            </p>
          </CardHeader>

          <CardContent>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <Separator className="my-6" />

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => {
                  if (shouldExitOnBack || currentStep === 1) {
                    onBack();
                  } else {
                    setCurrentStep(currentStep - 1);
                  }
                }}
                className="px-8"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                {language === 'ar' ? 'رجوع' : 'Back'}
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={isLoading}
                className="px-8"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {currentStep === 3 
                      ? (language === 'ar' ? 'إنهاء الإعداد' : 'Complete Setup')
                      : (language === 'ar' ? 'التالي' : 'Next')
                    }
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'ملف تعريفي احترافي' : 'Professional Profile'}
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'توصيات ذكية' : 'Smart Recommendations'}
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
  );
}
