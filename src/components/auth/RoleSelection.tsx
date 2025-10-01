import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building,
  User,
  Users,
  Shield,
  ArrowRight,
  CheckCircle,
  Briefcase,
  Award,
  Globe,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RoleSelectionProps {
  user: Partial<AuthenticatedUser>;
  onRoleSelected: (user: AuthenticatedUser) => void;
  onBack: () => void;
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

interface RoleOption {
  id: 'engineer' | 'client' | 'enterprise';
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  icon: React.ReactNode;
  features: {
    en: string[];
    ar: string[];
  };
  popular?: boolean;
  verified?: boolean;
}

export function RoleSelection({ user, onRoleSelected, onBack }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<'engineer' | 'client' | 'enterprise' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language] = useState<'ar' | 'en'>(user.language || 'en');
  const navigate = useNavigate();

  const roleOptions: RoleOption[] = [
    {
      id: 'engineer',
      title: {
        en: 'Professional Engineer',
        ar: 'مهندس محترف'
      },
      description: {
        en: 'Join as a certified engineer to find projects, showcase expertise, and grow your career',
        ar: 'انضم كمهندس معتمد للعثور على المشاريع وإظهار الخبرة وتطوير مسيرتك المهنية'
      },
      icon: <Building className="w-6 h-6" />,
      features: {
        en: [
          'Access to exclusive engineering projects',
          'SCE verification and certification',
          'Professional networking opportunities',
          'CPD and training programs',
          'Project bidding and proposals'
        ],
        ar: [
          'الوصول إلى مشاريع هندسية حصرية',
          'التحقق من هيئة المهندسين والشهادات',
          'فرص الشبكات المهنية',
          'برامج التطوير المهني والتدريب',
          'تقديم العطاءات والمقترحات للمشاريع'
        ]
      },
      popular: true,
      verified: !!user.sceNumber
    },
    {
      id: 'client',
      title: {
        en: 'Project Client',
        ar: 'عميل مشروع'
      },
      description: {
        en: 'Find qualified engineers and contractors for your engineering projects and requirements',
        ar: 'اعثر على مهندسين ومقاولين مؤهلين لمشاريعك الهندسية ومتطلباتك'
      },
      icon: <User className="w-6 h-6" />,
      features: {
        en: [
          'Post project requirements',
          'Browse verified engineers',
          'Compare proposals and portfolios',
          'Direct messaging with professionals',
          'Project management tools'
        ],
        ar: [
          'نشر متطلبات المشاريع',
          'تصفح المهندسين المعتمدين',
          'مقارنة المقترحات والمحافظ',
          'الرسائل المباشرة مع المحترفين',
          'أدوات إدارة المشاريع'
        ]
      }
    },
    {
      id: 'enterprise',
      title: {
        en: 'Enterprise Partner',
        ar: 'شريك مؤسسي'
      },
      description: {
        en: 'For companies and organizations seeking comprehensive engineering solutions',
        ar: 'للشركات والمنظمات التي تبحث عن حلول هندسية شاملة'
      },
      icon: <Users className="w-6 h-6" />,
      features: {
        en: [
          'Bulk project management',
          'Dedicated account manager',
          'Custom enterprise solutions',
          'Advanced analytics and reporting',
          'Priority support and consultation'
        ],
        ar: [
          'إدارة المشاريع بالجملة',
          'مدير حساب مخصص',
          'حلول مؤسسية مخصصة',
          'التحليلات والتقارير المتقدمة',
          'الدعم والاستشارة ذات الأولوية'
        ]
      },
      verified: !!user.company
    }
  ];

  const handleRoleSelection = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    
    try {
      const userId = user.id || 'a938012d-b35b-40ab-91d4-bcbd5678216a';

      const completeUser: AuthenticatedUser = {
        id: userId,
        email: user.email || '',
        name: user.name || '',
        role: selectedRole,
        isVerified: user.isVerified || false,
        sceNumber: user.sceNumber,
        company: user.company,
        location: user.location || '',
        phone: user.phone || '',
        language: language,
        avatar: `user-${selectedRole}-1`
      };

      // Let parent component (AuthenticationSystem) handle the routing logic
      onRoleSelected(completeUser);
    } catch (error) {
      console.error('Role selection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
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

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {language === 'ar' ? 'اختر نوع حسابك' : 'Choose Your Account Type'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {language === 'ar' 
              ? 'اختر الدور الذي يناسب احتياجاتك المهنية'
              : 'Select the role that best fits your professional needs'
            }
          </p>
        </div>

        {/* Role Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roleOptions.map((role) => (
            <Card 
              key={role.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedRole === role.id 
                  ? 'ring-2 ring-primary border-primary' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className="relative">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                    selectedRole === role.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {role.icon}
                  </div>
                  
                  {/* Popular Badge */}
                  {role.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      {language === 'ar' ? 'شائع' : 'Popular'}
                    </Badge>
                  )}
                  
                  {/* Verified Badge */}
                  {role.verified && (
                    <Badge variant="secondary" className="absolute -top-2 -left-2 bg-success/10 text-success">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {language === 'ar' ? 'معتمد' : 'Verified'}
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-xl">
                  {role.title[language]}
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  {role.description[language]}
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-foreground">
                    {language === 'ar' ? 'المميزات الرئيسية:' : 'Key Features:'}
                  </h4>
                  <ul className="space-y-2">
                    {role.features[language].map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {selectedRole === role.id && (
                  <div className="mt-4 pt-4 border-t border-sidebar-border">
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <CheckCircle className="w-4 h-4" />
                      {language === 'ar' ? 'محدد' : 'Selected'}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth')}
            className="px-8"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            {language === 'ar' ? 'رجوع' : 'Back'}
          </Button>
          
          <Button 
            onClick={handleRoleSelection}
            disabled={!selectedRole || isLoading}
            className="px-8"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {language === 'ar' ? 'متابعة' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {language === 'ar' 
              ? 'يمكنك تغيير نوع حسابك لاحقاً في الإعدادات'
              : 'You can change your account type later in settings'
            }
          </p>
        </div>

        {/* Features Overview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-medium">
              {language === 'ar' ? 'مشاريع حقيقية' : 'Real Projects'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' 
                ? 'اعمل على مشاريع حقيقية من رؤية 2030'
                : 'Work on real projects from Vision 2030'
              }
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-medium">
              {language === 'ar' ? 'شهادات معتمدة' : 'Certified Professionals'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' 
                ? 'جميع المهندسين معتمدون من هيئة المهندسين'
                : 'All engineers are SCE certified'
              }
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-medium">
              {language === 'ar' ? 'شبكة عالمية' : 'Global Network'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' 
                ? 'اتصل بالمهندسين في جميع أنحاء المملكة'
                : 'Connect with engineers across the Kingdom'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
