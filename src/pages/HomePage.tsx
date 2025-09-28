import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/stores/auth';
import { getUserDisplayName, getUserInitials } from '@/lib/userUtils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { TypewriterText } from '@/components/ui/typewriter-text';
import { 
  Shield, 
  Briefcase, 
  CreditCard, 
  MessageSquare, 
  MapPin, 
  BarChart3, 
  Users, 
  Database,
  CheckCircle,
  Star,
  ArrowRight,
  Globe,
  Phone,
  Clock,
  Award,
  Building,
  Wrench,
  Zap,
  Cog,
  Home,
  Search,
  Map as MapIcon,
  Eye,
  TestTube,
  Heart,
  FileText,
  Target,
  MessageCircle,
  Camera,
  Upload,
  Bot,
  GraduationCap,
  CreditCard as CreditCardIcon,
  Package,
  FileSpreadsheet,
  TrendingUp,
  Settings,
  Truck
} from 'lucide-react';
import CalendarMini from '@/components/calendar/CalendarMini';
import { useCalendarStore } from '@/stores/useCalendarStore';

const HomePage = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [activeTab, setActiveTab] = useState<'clients' | 'engineers' | 'enterprises'>('clients');
  const [currentTestimonialPage, setCurrentTestimonialPage] = useState(0);
  
  // Handle testimonial scroll pagination
  useEffect(() => {
    const container = document.querySelector('.testimonials-scroll');
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = 384; // w-96 = 384px
      const gap = 24; // gap-6 = 24px
      const totalCardWidth = cardWidth + gap;
      
      // Calculate page based on scroll position
      // Page 0: 0-408px, Page 1: 408-816px, Page 2: 816px+
      let currentPage;
      if (scrollLeft < totalCardWidth) {
        currentPage = 0;
      } else if (scrollLeft < totalCardWidth * 2) {
        currentPage = 1;
      } else {
        currentPage = 2;
      }
      
      setCurrentTestimonialPage(currentPage);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const { theme } = useTheme();
  const { profile } = useAuthStore();
  const {
    currentDate,
    setCurrentDate,
    events,
    userRole,
    isHijri
  } = useCalendarStore();
  
  // Get current user data
  const currentUserName = getUserDisplayName(profile);
  const currentUserInitials = getUserInitials(profile);

  const isRTL = language === 'ar';

  // Content structure for both languages
  const content = {
    en: {
      nav: {
        product: 'Product',
        pricing: 'Pricing',
        forClients: 'For Clients',
        forEngineers: 'For Engineers',
        enterprise: 'Enterprise',
        help: 'Help',
        signIn: 'Sign In',
        getStarted: 'Get Started'
      },
      hero: {
        title: 'Hire SCE-verified engineers in minutes.',
        subtitle: 'nbcon is Saudi Arabia\'s engineering marketplace—AI matching, milestone escrow, ZATCA e-invoicing, and bilingual workflows for every project phase.',
        postJob: 'Post a Job',
        browse: 'Browse Engineers',
        features: ['SCE verification', 'Geofenced check-ins', 'Arabic/English', 'PDPL-ready'],
        microcopy: 'No credit card required. Cancel anytime.'
      },
      trust: {
        title: 'Trusted by builders, contractors, and property owners across KSA.'
      },
      features: {
        verified: {
          title: 'Verified Talent',
          desc: 'SCE credential checks and license tracking—trust built-in.'
        },
        jobs: {
          title: 'Jobs & Quotes',
          desc: 'Post jobs, compare quotes, and award in a click.'
        },
        escrow: {
          title: 'Escrow & Invoicing',
          desc: 'Milestone escrow with ZATCA-compliant e-invoices and 15% VAT.'
        },
        messaging: {
          title: 'Messaging & Files',
          desc: 'Real-time bilingual chat, voice notes, and secure file sharing.'
        },
        location: {
          title: 'Location & Check-Ins',
          desc: 'Geofenced check-in/out and verified site visits.'
        },
        analytics: {
          title: 'Analytics Dashboards',
          desc: 'Role-aware KPIs with predictive insights.'
        },
        enterprise: {
          title: 'Enterprise Controls',
          desc: 'Roles, approvals, cost centers, and audit trails.'
        },
        apis: {
          title: 'APIs & Exports',
          desc: 'Webhooks, CSV/PDF exports, and integration hooks.'
        }
      },
      disciplines: {
        title: 'Works for any discipline.',
        tags: ['Civil', 'Electrical', 'Mechanical', 'Architecture', 'Surveying', 'GIS', 'HSE', 'QA/QC']
      },
      social: {
        title: 'Trusted by teams delivering thousands of field hours.',
        subtitle: 'See how organizations across KSA hire faster and stay compliant with nbcon.',
        cta: 'Read case studies'
      },
      quickstart: {
        clients: {
          title: 'Start a job in minutes',
          steps: ['Post scope', 'Get quotes', 'Fund milestone', 'Track', 'Approve', 'Pay'],
          cta: 'Create Job'
        },
        engineers: {
          title: 'Win work and get paid on time',
          steps: ['Create profile', 'Verify SCE', 'Set service area', 'Get matched', 'Quote', 'Deliver'],
          cta: 'Join as Engineer'
        },
        enterprise: {
          title: 'Scale your field operations',
          steps: ['Invite team', 'Create RFPs', 'Approvals', 'Portfolio analytics', 'Integrations'],
          cta: 'Talk to Sales'
        }
      },
      dashboard: {
        title: 'Manage every project without leaving your dashboard.',
        subtitle: 'Quotes, milestones, invoices, check-ins, and messages—organized in one workspace with real-time updates.',
        features: ['One inbox for jobs & messages', 'Milestone approvals with escrow release', 'Finance snapshots and export'],
        cta: 'See the dashboard'
      },
      community: {
        title: 'Join the nbcon community',
        subtitle: 'Tips, success stories, and product updates—direct from the field.',
        testimonials: [
          'We hired in hours, not weeks—and stayed compliant.',
          'Check-ins and escrow removed delivery risk.'
        ],
        cta: 'Follow on X/LinkedIn • Read more stories'
      },
      finalCta: {
        title: 'Hire in minutes. Scale your delivery.',
        postJob: 'Post a Job',
        browse: 'Browse Engineers'
      },
      footer: {
        product: {
          title: 'Product',
          links: ['Features', 'Pricing', 'Dashboard', 'Mobile (soon)']
        },
        clients: {
          title: 'For Clients',
          links: ['Create Job', 'Quote Matrix', 'Compliance']
        },
        engineers: {
          title: 'For Engineers',
          links: ['Join', 'Verification', 'Payouts']
        },
        company: {
          title: 'Company',
          links: ['About', 'Careers', 'Contact']
        },
        legal: {
          title: 'Legal',
          links: ['Terms', 'Privacy (PDPL)', 'Cookies']
        },
        copyright: '© nbcon. Made in KSA. Vision 2030 aligned.'
      }
    },
    ar: {
      nav: {
        product: 'المنتج',
        pricing: 'التسعير',
        forClients: 'للعملاء',
        forEngineers: 'للمهندسين',
        enterprise: 'الشركات',
        help: 'المساعدة',
        signIn: 'تسجيل الدخول',
        getStarted: 'ابدأ الآن'
      },
      hero: {
        title: 'وظّف مهندسين مُعتمدين خلال دقائق.',
        subtitle: 'nbcon هو سوق الهندسة في السعودية—مطابقة بالذكاء الاصطناعي، حسابات ضامنة على مراحل، فواتير متوافقة مع الزكاة والدخل، وسير عمل ثنائي اللغة لكل مرحلة من مشروعك.',
        postJob: 'أنشئ وظيفة',
        browse: 'تصفّح المهندسين',
        features: ['تحقق من عضوية الهيئة', 'تسجيل دخول جغرافي', 'عربي/إنجليزي', 'متوافق مع PDPL'],
        microcopy: 'لا حاجة لبطاقة بنكية. يمكنك الإلغاء في أي وقت.'
      },
      trust: {
        title: 'موثوق من المطوّرين والمقاولين ومالكي العقارات في المملكة.'
      },
      features: {
        verified: {
          title: 'المواهب الموثقة',
          desc: 'التحقق من عضوية الهيئة وتتبع التراخيص—الثقة أولاً.'
        },
        jobs: {
          title: 'الوظائف والعروض',
          desc: 'أنشئ وظيفة، قارن العروض، وأسند بضغطة.'
        },
        escrow: {
          title: 'الضمان والفواتير',
          desc: 'حسابات ضامنة مرحلية مع فواتير متوافقة وضريبة ١٥٪.'
        },
        messaging: {
          title: 'المحادثات والملفات',
          desc: 'محادثات فورية ثنائية اللغة وملاحظات صوتية وملفات آمنة.'
        },
        location: {
          title: 'الموقع وتسجيل الدخول',
          desc: 'تسجيل دخول/خروج جغرافي وتحقق من الزيارات الميدانية.'
        },
        analytics: {
          title: 'لوحات التحليلات',
          desc: 'مؤشرات أداء حسب الدور وتحليلات تنبؤية.'
        },
        enterprise: {
          title: 'ضوابط الشركات',
          desc: 'صلاحيات واعتمادات ومراكز تكلفة ومسارات تدقيق.'
        },
        apis: {
          title: 'APIs والتصدير',
          desc: 'Webhooks وتصدير CSV/PDF ونقاط تكامل.'
        }
      },
      disciplines: {
        title: 'يعمل مع جميع التخصصات.',
        tags: ['مدني', 'كهرباء', 'ميكانيكا', 'عمارة', 'مسّاح', 'نظم معلومات جغرافية', 'سلامة', 'ضبط جودة']
      },
      social: {
        title: 'موثوق من فرق تنفّذ آلاف الساعات الميدانية.',
        subtitle: 'اكتشف كيف توظّف الجهات في المملكة بسرعة مع التزام كامل بالأنظمة عبر nbcon.',
        cta: 'اقرأ دراسات الحالة'
      },
      quickstart: {
        clients: {
          title: 'ابدأ وظيفة خلال دقائق',
          steps: ['أرسل المتطلبات', 'استلم العروض', 'موّل المرحلة', 'تتبّع', 'اعتمد', 'ادفع'],
          cta: 'أنشئ وظيفة'
        },
        engineers: {
          title: 'احصل على أعمال وتلقَّ المدفوعات في وقتها',
          steps: ['أنشئ بروفايل', 'تحقق من الهيئة', 'حدّد نطاق الخدمة', 'طابق الوظائف', 'قدّم عرضًا', 'سلّم'],
          cta: 'انضم كمهندس'
        },
        enterprise: {
          title: 'وسّع عملياتك الميدانية',
          steps: ['ادعُ الفريق', 'أنشئ RFP', 'الاعتمادات', 'تحليلات المحفظة', 'التكاملات'],
          cta: 'تحدث إلى المبيعات'
        }
      },
      dashboard: {
        title: 'أدِر كل مشروع من لوحة التحكم.',
        subtitle: 'عروض الأسعار والمراحل والفواتير وتسجيلات الدخول والمحادثات—كلها في مساحة عمل واحدة بتحديثات فورية.',
        features: ['صندوق موحّد للوظائف والمحادثات', 'اعتماد المراحل مع تحرير الضمان', 'ملخصات مالية وتصدير'],
        cta: 'شاهد الواجهة'
      },
      community: {
        title: 'انضم إلى مجتمع nbcon',
        subtitle: 'نصائح وقصص نجاح وتحديثات المنتج—من أرض الواقع.',
        testimonials: [
          '«وظّفنا خلال ساعات بدل أسابيع—وبامتثال كامل.»',
          '«التسجيل الجغرافي والضمان أنهيا مخاطر التسليم.»'
        ],
        cta: 'تابعنا على تويتر/لينكدإن • اقرأ المزيد من القصص'
      },
      finalCta: {
        title: 'وظّف خلال دقائق. نمِّ قدرتك على التسليم.',
        postJob: 'أنشئ وظيفة',
        browse: 'تصفّح المهندسين'
      },
      footer: {
        product: {
          title: 'المنتج',
          links: ['المزايا', 'التسعير', 'لوحة التحكم', 'الجوال (قريباً)']
        },
        clients: {
          title: 'للعملاء',
          links: ['إنشاء وظيفة', 'مصفوفة العروض', 'الامتثال']
        },
        engineers: {
          title: 'للمهندسين',
          links: ['انضم', 'التحقق', 'المدفوعات']
        },
        company: {
          title: 'الشركة',
          links: ['من نحن', 'الوظائف', 'اتصل بنا']
        },
        legal: {
          title: 'القانوني',
          links: ['الشروط', 'الخصوصية (PDPL)', 'الكوكيز']
        },
        copyright: '© nbcon. صُنع في السعودية. متوافق مع رؤية 2030.'
      }
    }
  };

  const t = content[language];

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">nb</span>
              </div>
              <span className="font-bold text-xl nbcon-logo">nbcon</span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6 nav-links">
              <Link to="#" className="text-sm font-medium hover:text-primary transition-colors">
                {t.nav.product}
              </Link>
              <a href="/#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                {t.nav.pricing}
              </a>
              <Link to="#" className="text-sm font-medium hover:text-primary transition-colors">
                {t.nav.forClients}
              </Link>
              <Link to="#" className="text-sm font-medium hover:text-primary transition-colors">
                {t.nav.forEngineers}
              </Link>
              <Link to="#" className="text-sm font-medium hover:text-primary transition-colors">
                {t.nav.enterprise}
              </Link>
              <Link to="#" className="text-sm font-medium hover:text-primary transition-colors">
                {t.nav.help}
              </Link>
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4 header-buttons">
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              >
                <Globe className="w-4 h-4 mr-1" />
                {language === 'en' ? 'عربي' : 'EN'}
              </Button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Auth Buttons */}
              <Link to="/auth">
                <Button variant="ghost" size="sm">
                  {t.nav.signIn}
                </Button>
              </Link>
              <Link to="/auth/role">
                <Button size="sm">
                  {t.nav.getStarted}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Two Column Layout */}
      <section className="pt-[200px] pb-[200px] px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
                <Shield className="w-4 h-4 mr-2" />
                100% Trusted Engineering Platform in Saudi Arabia
              </div>
              
              {/* Main Title */}
              <h1 className="text-4xl md:text-6xl font-bold leading-tight text-primary hero-title">
              {t.hero.title}
          </h1>
              
              {/* Subtitle */}
              <p className="text-xl text-muted-foreground leading-relaxed">
            {t.hero.subtitle}
          </p>
          
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/client/jobs/create">
              <Button size="lg" className="w-full sm:w-auto">
                {t.hero.postJob}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/client/browse">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-[var(--primary)] hover:border-[var(--primary)] browse-engineers-btn">
                {t.hero.browse}
              </Button>
            </Link>
          </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-4">
            {t.hero.features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                <CheckCircle className="w-3 h-3 mr-1" />
                {feature}
              </Badge>
            ))}
          </div>

          {/* Microcopy */}
          <p className="text-sm text-muted-foreground">
            {t.hero.microcopy}
          </p>
            </div>
            
            {/* Right Column - Interactive Dashboard */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-green-600/10 rounded-2xl p-6 h-[500px] overflow-hidden">
                {/* Full Dashboard Preview */}
                <div className="w-full h-full bg-card rounded-xl shadow-2xl flex">
                  {/* Sidebar */}
                  <div className="w-16 bg-sidebar-background border-r border-sidebar-border flex flex-col items-center py-4 space-y-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-xs">nb</span>
                    </div>
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Home className="w-4 h-4 text-primary" />
                    </div>
                    <div className="w-8 h-8 bg-sidebar-accent rounded-lg flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-sidebar-accent-foreground" />
                    </div>
                    <div className="w-8 h-8 bg-sidebar-background rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-sidebar-foreground" />
                    </div>
                    <div className="w-8 h-8 bg-sidebar-background rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-sidebar-foreground" />
                    </div>
                    <div className="w-8 h-8 bg-sidebar-background rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-sidebar-foreground" />
                    </div>
                  </div>
                  
                  {/* Main Content */}
                  <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="border-b border-sidebar-border p-4">
                  <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">Dashboard</h3>
                    <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  
                      {/* Role Tabs */}
                      <div className="flex space-x-1 mt-3">
                        <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-medium">
                          Engineers
                        </button>
                        <button className="px-3 py-1 bg-muted text-muted-foreground rounded text-xs font-medium">
                          Clients
                        </button>
                        <button className="px-3 py-1 bg-muted text-muted-foreground rounded text-xs font-medium">
                          Enterprise
                        </button>
                      </div>
                    </div>
                    
                    {/* Dashboard Content */}
                    <div className="flex-1 p-4 space-y-4 overflow-hidden">
                  {/* KPI Cards */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-primary/10 rounded-lg p-2">
                      <div className="text-xs text-muted-foreground">Active Jobs</div>
                          <div className="text-sm font-bold text-primary">8</div>
                    </div>
                        <div className="bg-primary/10 rounded-lg p-2">
                      <div className="text-xs text-muted-foreground">Earnings</div>
                          <div className="text-sm font-bold text-primary">SAR 18.5K</div>
                        </div>
                        <div className="bg-primary/10 rounded-lg p-2">
                          <div className="text-xs text-muted-foreground">Rating</div>
                          <div className="text-sm font-bold text-primary">4.8★</div>
                    </div>
                  </div>
                  
                      {/* Mini Chart */}
                      <div className="bg-muted rounded-lg p-2 flex items-end space-x-1 h-12">
                        <div className="bg-primary h-4 w-2 rounded-t"></div>
                        <div className="bg-primary h-6 w-2 rounded-t"></div>
                        <div className="bg-primary h-3 w-2 rounded-t"></div>
                        <div className="bg-primary h-5 w-2 rounded-t"></div>
                        <div className="bg-primary h-7 w-2 rounded-t"></div>
                        <div className="bg-primary h-4 w-2 rounded-t"></div>
                        <div className="bg-primary h-5 w-2 rounded-t"></div>
                  </div>
                  
                      {/* Recent Jobs */}
                  <div className="space-y-2">
                        <div className="text-xs text-muted-foreground font-medium">Recent Jobs</div>
                        <div className="space-y-1 max-h-20 overflow-hidden">
                          <div className="flex items-center space-x-2 text-xs p-1 bg-muted/50 rounded">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-foreground truncate">Site Inspection - Riyadh</span>
                      </div>
                          <div className="flex items-center space-x-2 text-xs p-1 bg-muted/50 rounded">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            <span className="text-foreground truncate">Electrical Design - Jeddah</span>
                      </div>
                          <div className="flex items-center space-x-2 text-xs p-1 bg-muted/50 rounded">
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                            <span className="text-foreground truncate">HVAC Review - Dammam</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground font-medium">Quick Actions</div>
                        <div className="flex space-x-1">
                          <button className="flex-1 bg-primary text-primary-foreground text-xs py-1 px-2 rounded text-center">
                            New Quote
                          </button>
                          <button className="flex-1 bg-muted text-muted-foreground text-xs py-1 px-2 rounded text-center">
                            Check-in
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            <TypewriterText 
              text={t.trust.title} 
              speed={80} 
              delay={500}
              className="text-2xl md:text-3xl font-bold"
            />
          </h2>
          <div className="relative overflow-hidden group">
            <div className="flex animate-scroll space-x-8 opacity-100 group-hover:pause-animation">
              {/* First set of logos */}
              <img src="/clintes-logos/Advanced.png" alt="Advanced" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Al-ajmi.png" alt="Al-ajmi" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Almajdouié.png" alt="Almajdouié" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Alrawaf.png" alt="Alrawaf" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/ALTAMIMI.png" alt="ALTAMIMI" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/ansab.png" alt="ansab" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Aramco.png" alt="Aramco" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/BOUTIQUE.png" alt="BOUTIQUE" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Cat Group.png" alt="Cat Group" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/El Seif.png" alt="El Seif" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/EQUATE.png" alt="EQUATE" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Euro Consult.png" alt="Euro Consult" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/GACA.png" alt="GACA" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Giza Systems.png" alt="Giza Systems" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Jabco.png" alt="Jabco" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/MAIADEN.png" alt="MAIADEN" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/MAS.png" alt="MAS" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Mastoura.png" alt="Mastoura" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Mobco.png" alt="Mobco" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/NCH.png" alt="NCH" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Neom.png" alt="Neom" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Nesma.png" alt="Nesma" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/PIF.png" alt="PIF" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Sabic.png" alt="Sabic" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/SAMA ENERGY.png" alt="SAMA ENERGY" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/SAR.png" alt="SAR" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Saudi Electricity company.png" alt="Saudi Electricity" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/SCTNH.png" alt="SCTNH" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Shibah Al Jazira.png" alt="Shibah Al Jazira" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Sinopec.png" alt="Sinopec" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Sipchem.png" alt="Sipchem" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/wsp.png" alt="WSP" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              
              {/* Duplicate set for seamless loop */}
              <img src="/clintes-logos/Advanced.png" alt="Advanced" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Al-ajmi.png" alt="Al-ajmi" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Almajdouié.png" alt="Almajdouié" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Alrawaf.png" alt="Alrawaf" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/ALTAMIMI.png" alt="ALTAMIMI" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/ansab.png" alt="ansab" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Aramco.png" alt="Aramco" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/BOUTIQUE.png" alt="BOUTIQUE" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Cat Group.png" alt="Cat Group" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/El Seif.png" alt="El Seif" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/EQUATE.png" alt="EQUATE" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Euro Consult.png" alt="Euro Consult" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/GACA.png" alt="GACA" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Giza Systems.png" alt="Giza Systems" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Jabco.png" alt="Jabco" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/MAIADEN.png" alt="MAIADEN" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/MAS.png" alt="MAS" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Mastoura.png" alt="Mastoura" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Mobco.png" alt="Mobco" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/NCH.png" alt="NCH" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Neom.png" alt="Neom" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Nesma.png" alt="Nesma" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/PIF.png" alt="PIF" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Sabic.png" alt="Sabic" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/SAMA ENERGY.png" alt="SAMA ENERGY" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/SAR.png" alt="SAR" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Saudi Electricity company.png" alt="Saudi Electricity" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/SCTNH.png" alt="SCTNH" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Shibah Al Jazira.png" alt="Shibah Al Jazira" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Sinopec.png" alt="Sinopec" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/Sipchem.png" alt="Sipchem" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
              <img src="/clintes-logos/wsp.png" alt="WSP" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
                    </div>
                    </div>
                  </div>
      </section>

      {/* AI Chat Assistant */}
      <section className="pt-[200px] pb-[200px] bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* AI Features - Left Column */}
              <div className="space-y-8">
                    <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">nbcon AI Assistant</h2>
                  <p className="text-xl text-muted-foreground">Your intelligent engineering project partner powered by advanced AI technology</p>
                    </div>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bot className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Smart Project Matching</h3>
                      <p className="text-muted-foreground">AI analyzes your requirements and instantly connects you with the most suitable engineers based on expertise, location, and availability.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Real-time Cost Estimation</h3>
                      <p className="text-muted-foreground">Get accurate project cost estimates based on current market rates, project complexity, and regional pricing data.</p>
                    </div>
                    </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                  </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Timeline Optimization</h3>
                      <p className="text-muted-foreground">AI suggests optimal project timelines considering resource availability, seasonal factors, and regulatory requirements.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Compliance Guidance</h3>
                      <p className="text-muted-foreground">Stay updated with SCE regulations, ZATCA requirements, and local building codes through AI-powered compliance assistance.</p>
                    </div>
                  </div>
                </div>
                    </div>
                    
              {/* Chat Interface - Right Column */}
              <div className="bg-gradient-to-br from-primary/10 to-green-600/10 rounded-2xl p-8 h-full flex items-center justify-center">
                <div className="w-full h-full bg-card rounded-xl shadow-2xl overflow-hidden max-w-xl flex flex-col">
                {/* Chat Header */}
                <div className="bg-primary/10 border-b border-sidebar-border p-4 relative flex-shrink-0">
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">AI</span>
                    </div>
                    <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-xl font-bold text-foreground">nbcon AI Assistant</h2>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-muted-foreground">Online</span>
                    </div>
                  </div>
                    <p className="text-sm text-muted-foreground">Ask me anything about engineering projects in Saudi Arabia</p>
                  </div>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="p-4 flex-1 overflow-y-auto space-y-4">
                {/* AI Welcome Message */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-xs font-bold">AI</span>
              </div>
                  <div className="bg-muted rounded-lg p-3 max-w-md">
                    <p className="text-sm text-foreground">
                      Hello! I'm your nbcon AI assistant. I can help you find the right engineers for your project, estimate costs, suggest timelines, and answer questions about engineering services in Saudi Arabia. What can I help you with today?
                    </p>
                    <span className="text-xs text-muted-foreground">Just now</span>
            </div>
          </div>
                  
                {/* Sample User Message */}
                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-primary rounded-lg p-3 max-w-md">
                    <p className="text-sm text-primary-foreground">
                      I need an electrical engineer for a residential project in Riyadh. Budget is around SAR 15,000 and I need it done within 2 weeks.
                    </p>
                    <span className="text-xs text-primary-foreground/70">Just now</span>
        </div>
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-muted-foreground text-xs font-bold">You</span>
                  </div>
                    </div>
                    
                {/* AI Response */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-xs font-bold">AI</span>
                    </div>
                  <div className="bg-muted rounded-lg p-3 max-w-md">
                    <p className="text-sm text-foreground">
                      Perfect! Based on your requirements, I found 12 qualified electrical engineers in Riyadh who can complete your project within 2 weeks. Here are my recommendations:
                    </p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Ahmed Al-Rashid</span>
                        <span className="text-primary font-medium">SAR 12,500</span>
                  </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Fatima Al-Zahra</span>
                        <span className="text-primary font-medium">SAR 14,000</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Mohammed Al-Sayed</span>
                        <span className="text-primary font-medium">SAR 13,200</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">Just now</span>
                  </div>
                </div>
              </div>
              
              {/* Chat Input */}
              <div className="border-t border-sidebar-border p-3 flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Ask about engineering projects, costs, timelines..."
                      className="w-full p-3 pr-12 border border-sidebar-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary">
                      <MessageSquare className="w-4 h-4" />
                    </button>
            </div>
                  <Button className="px-6">
                    <span className="hidden sm:inline">Send</span>
                    <ArrowRight className="w-4 h-4 sm:ml-2" />
                </Button>
              </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex space-x-4">
                    <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                      💡 Get project estimate
                    </button>
                    <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                      📍 Find local engineers
                    </button>
                    <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                      💰 Check pricing
                    </button>
            </div>
                  <span className="text-xs text-muted-foreground">Powered by nbcon AI</span>
          </div>
        </div>
              </div>
                </div>
              </div>
          </div>
        </div>
      </section>


      {/* How It Works Section */}
      <section className="py-[200px] px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A high-performing web-based engineering marketplace for any project size and complexity
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                <MapPin className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Choose Your Project</h3>
              <p className="text-muted-foreground">
                Post your engineering project with detailed requirements, timeline, and budget. Our AI will match you with verified engineers.
              </p>
              
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-transparent transform translate-x-8"></div>
            </div>
            
            {/* Step 2 */}
            <div className="text-center relative">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                <Clock className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Review & Select</h3>
              <p className="text-muted-foreground">
                Compare quotes from qualified engineers, check their SCE credentials, and select the best match for your project.
              </p>
              
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-transparent transform translate-x-8"></div>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Track & Complete</h3>
              <p className="text-muted-foreground">
                Monitor progress with real-time updates, milestone tracking, and secure payments. Get your project delivered on time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Popular Services */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Popular Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">A high-performing marketplace connecting certified engineers, clients, and enterprises—with transparent pricing, milestone payments, and built-in compliance.</p>
          </div>
          
          {/* Role Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-card rounded-lg p-1 border">
              <Button 
                variant={activeTab === 'clients' ? 'default' : 'ghost'} 
                className="px-8 py-3"
                onClick={() => setActiveTab('clients')}
              >
                Clients
              </Button>
              <Button 
                variant={activeTab === 'engineers' ? 'default' : 'ghost'} 
                className="px-8 py-3"
                onClick={() => setActiveTab('engineers')}
              >
                Engineers
              </Button>
              <Button 
                variant={activeTab === 'enterprises' ? 'default' : 'ghost'} 
                className="px-8 py-3"
                onClick={() => setActiveTab('enterprises')}
              >
                Enterprises
              </Button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="mb-12">
            {/* Clients Tab Content */}
            {activeTab === 'clients' && (
              <>
                <div className="text-center mb-0 pb-3">
                  <p className="text-lg text-muted-foreground">Instant access to verified engineers, transparent pricing, milestone-based payments, and quality assurance.</p>
                </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Browse Engineers */}
              <Card className="p-6 h-[600px] flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold">Browse Engineers</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Verified</span>
              </div>
                
                {/* Search Bar */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search engineers..."
                    className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
              </div>
                
                {/* Filter Chips */}
                <div className="flex flex-wrap gap-1 mb-4">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Civil</span>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">Electrical</span>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">Mechanical</span>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">+3</span>
                </div>
                
                {/* Engineer Preview Cards */}
                <div className="space-y-2 mb-4 flex-1">
                  {/* Engineer 1 */}
                  <div className="flex items-center space-x-3 p-2 bg-muted/30 rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">AM</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">Ahmed Mohammed</p>
                      <p className="text-xs text-muted-foreground">Civil Engineer • SCE Verified</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-primary">SAR 200/day</p>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground ml-1">4.9</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Engineer 2 */}
                  <div className="flex items-center space-x-3 p-2 bg-muted/30 rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">SA</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">Sarah Al-Rashid</p>
                      <p className="text-xs text-muted-foreground">Electrical Engineer • SCE Verified</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-primary">SAR 250/day</p>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground ml-1">4.8</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Button size="sm" className="w-full">View All Profiles</Button>
              </div>
            </Card>

              {/* Post a Project */}
              <Card className="p-6 h-[600px] flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Post a Project</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Wizard</span>
              </div>
                
                {/* Project Type Selection */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-medium text-muted-foreground">Choose Project Type:</p>
                  <div className="grid grid-cols-3 gap-1">
                    <button className="p-2 bg-primary/10 text-primary rounded-lg text-xs font-medium border border-primary/20">
                      Quick Job
                    </button>
                    <button className="p-2 bg-muted text-muted-foreground rounded-lg text-xs font-medium hover:bg-muted/80">
                      Advanced
                    </button>
                    <button className="p-2 bg-muted text-muted-foreground rounded-lg text-xs font-medium hover:bg-muted/80">
                      Emergency
                    </button>
              </div>
                </div>
                
                {/* Project Form Preview */}
                <div className="space-y-3 mb-4 flex-1">
                  {/* Project Title */}
                  <div>
                    <input
                      type="text"
                      placeholder="Project title..."
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  
                  {/* Location & Budget */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2 p-2 bg-muted/30 rounded-lg">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Riyadh"
                        className="flex-1 text-xs bg-transparent border-none focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-muted/30 rounded-lg">
                      <span className="text-xs text-muted-foreground">SAR</span>
                      <input
                        type="text"
                        placeholder="5000"
                        className="flex-1 text-xs bg-transparent border-none focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  {/* Category & Timeline */}
                  <div className="grid grid-cols-2 gap-2">
                    <select className="text-xs p-2 bg-muted/30 rounded-lg border-none focus:outline-none">
                      <option>Civil Engineering</option>
                      <option>Electrical</option>
                      <option>Mechanical</option>
                    </select>
                    <select className="text-xs p-2 bg-muted/30 rounded-lg border-none focus:outline-none">
                      <option>1-2 weeks</option>
                      <option>1 month</option>
                      <option>2+ months</option>
                    </select>
                  </div>
                </div>
                
                {/* Progress Indicator */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-muted-foreground">Step 1 of 3</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="w-2 h-2 bg-muted rounded-full"></div>
                    <div className="w-2 h-2 bg-muted rounded-full"></div>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Button size="sm" className="w-full">Continue Wizard</Button>
              </div>
            </Card>

              {/* Compare Proposals */}
              <Card className="p-6 h-[600px] flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Compare Proposals</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Side-by-Side</span>
              </div>
                
                {/* Proposal Comparison Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground">3 Proposals Received</span>
                  <div className="flex space-x-1">
                    <button className="w-2 h-2 bg-primary rounded-full"></button>
                    <button className="w-2 h-2 bg-muted rounded-full"></button>
                    <button className="w-2 h-2 bg-muted rounded-full"></button>
              </div>
                </div>
                
                {/* Side-by-Side Proposal Comparison */}
                <div className="space-y-2 mb-4 flex-1">
                  {/* Proposal 1 */}
                  <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">1</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">Eng. Ahmed Al-Rashid</p>
                        <p className="text-xs text-muted-foreground">Civil Engineer</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-primary">SAR 4,500</p>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground ml-1">4.9</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Proposal 2 */}
                  <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">2</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">Eng. Sarah Mohammed</p>
                        <p className="text-xs text-muted-foreground">Structural Engineer</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-primary">SAR 5,200</p>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground ml-1">4.8</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Proposal 3 */}
                  <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">3</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">Eng. Khalid Al-Zahra</p>
                        <p className="text-xs text-muted-foreground">Project Manager</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-primary">SAR 6,000</p>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground ml-1">4.7</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Comparison Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                    <p className="text-xs font-bold text-primary">2 weeks</p>
                    <p className="text-xs text-muted-foreground">Avg. Timeline</p>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                    <p className="text-xs font-bold text-primary">SAR 5.2K</p>
                    <p className="text-xs text-muted-foreground">Avg. Price</p>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                    <p className="text-xs font-bold text-primary">4.8★</p>
                    <p className="text-xs text-muted-foreground">Avg. Rating</p>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Button size="sm" className="w-full">Compare All Bids</Button>
              </div>
            </Card>

              {/* Track Milestones */}
              <Card className="p-6 h-[600px] flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Track Milestones</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Escrow</span>
              </div>
                
                {/* Project Progress Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground">Project Progress</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">On Track</span>
              </div>
                
                {/* Milestone Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">Overall Progress</span>
                    <span className="text-xs font-medium text-primary">60%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                </div>
                
                {/* Milestone List */}
                <div className="space-y-2 mb-4 flex-1">
                  {/* Milestone 1 - Completed */}
                  <div className="flex items-center space-x-3 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground">Project Kickoff</p>
                      <p className="text-xs text-muted-foreground">Completed • SAR 1,500 released</p>
                    </div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Paid</span>
                  </div>
                  
                  {/* Milestone 2 - In Progress */}
                  <div className="flex items-center space-x-3 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-foreground">2</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground">Design Phase</p>
                      <p className="text-xs text-muted-foreground">In Progress • SAR 2,000 in escrow</p>
                    </div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Pending</span>
                  </div>
                  
                  {/* Milestone 3 - Not Started */}
                  <div className="flex items-center space-x-3 p-2 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-muted-foreground">3</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground">Implementation</p>
                      <p className="text-xs text-muted-foreground">Not Started • SAR 1,000 pending</p>
                    </div>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">Locked</span>
                  </div>
                </div>
                
                {/* Escrow Summary */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                      <p className="text-xs font-bold text-primary">SAR 1,500</p>
                    <p className="text-xs text-muted-foreground">Released</p>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                      <p className="text-xs font-bold text-primary">SAR 3,000</p>
                    <p className="text-xs text-muted-foreground">In Escrow</p>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Button size="sm" className="w-full">Manage Milestones</Button>
              </div>
            </Card>

              {/* Real-time Messaging */}
              <Card className="p-6 h-[600px] flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Real-time Messaging</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Bilingual</span>
              </div>
                
                {/* Chat Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground">Active Chat</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600">Online</span>
              </div>
                </div>
                
                {/* Language Toggle */}
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-muted rounded-lg p-1 flex">
                    <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-medium">EN</button>
                    <button className="px-3 py-1 text-muted-foreground rounded text-xs font-medium">AR</button>
                  </div>
                </div>
                
                {/* Chat Messages Preview */}
                <div className="space-y-2 mb-4 flex-1 overflow-hidden">
                  {/* Engineer Message */}
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">E</span>
                    </div>
                    <div className="bg-muted/50 p-2 rounded-lg max-w-[80%]">
                      <p className="text-xs text-foreground">The site inspection is complete. I'll send the report shortly.</p>
                      <span className="text-xs text-muted-foreground">2m ago</span>
                    </div>
                  </div>
                  
                  {/* Client Message */}
                  <div className="flex justify-end items-start space-x-2">
                    <div className="bg-primary p-2 rounded-lg max-w-[80%] text-primary-foreground">
                      <p className="text-xs">Perfect! Please include the photos we discussed.</p>
                      <span className="text-xs text-primary-foreground/70">Just now</span>
                    </div>
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-700">C</span>
                    </div>
                  </div>
                  
                  {/* File Attachment Preview */}
                  <div className="flex items-center space-x-2 p-2 bg-muted/30 rounded-lg">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-foreground">inspection_report.pdf</span>
                    <span className="text-xs text-muted-foreground">(2.3 MB)</span>
                  </div>
                </div>
                
                {/* Message Input */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary">
                      <MessageCircle className="w-3 h-3" />
                    </button>
                  </div>
                  <button className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20">
                    <Upload className="w-4 h-4 text-primary" />
                  </button>
                </div>
                
                <div className="mt-auto">
                  <Button size="sm" className="w-full">Open Full Chat</Button>
              </div>
            </Card>

              {/* Compliance & Docs */}
              <Card className="p-6 h-[600px] flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Compliance & Docs</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">SCE / ZATCA</span>
              </div>
                
                {/* Compliance Status Header */}
                <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-muted-foreground">Compliance Status</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Verified</span>
              </div>
                
                {/* Document Categories */}
                <div className="space-y-2 mb-4 flex-1">
                  {/* SCE Credentials */}
                  <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">SCE Credentials</p>
                      <p className="text-xs text-muted-foreground">Professional Engineer License</p>
                    </div>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Valid</span>
                  </div>
                  
                  {/* ZATCA Invoice */}
                  <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">ZATCA Invoice</p>
                      <p className="text-xs text-muted-foreground">VAT 15% • Invoice #ZB-2024-001</p>
                    </div>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Generated</span>
                  </div>
                  
                  {/* Insurance Certificate */}
                  <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">Professional Insurance</p>
                      <p className="text-xs text-muted-foreground">Coverage: SAR 1M • Expires 12/2024</p>
                    </div>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Active</span>
                  </div>
                </div>
                
                {/* Compliance Summary */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                      <p className="text-xs font-bold text-primary">3/3</p>
                    <p className="text-xs text-muted-foreground">Documents Valid</p>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                      <p className="text-xs font-bold text-primary">15%</p>
                    <p className="text-xs text-muted-foreground">VAT Rate</p>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Button size="sm" className="w-full">View All Documents</Button>
              </div>
            </Card>
          </div>
              </>
            )}

            {/* Engineers Tab Content */}
            {activeTab === 'engineers' && (
              <>
                <div className="text-center mb-0 pb-3">
                  <p className="text-lg text-muted-foreground">Steady project pipeline, secure payments, professional growth, and streamlined operations.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {/* Jobs Nearby */}
             <Card className="p-6 h-[600px] flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
               <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold">Jobs Nearby</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Geo-matched</span>
                </div>
               
               {/* Location Filter */}
               <div className="relative mb-3">
                 <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <input
                   type="text"
                   placeholder="Current location: Riyadh"
                   className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                 />
               </div>
               
               {/* Job Categories */}
               <div className="flex flex-wrap gap-1 mb-4">
                 <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Civil</span>
                 <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">Electrical</span>
                 <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">Mechanical</span>
                 <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">+5</span>
               </div>
               
               {/* Available Jobs List */}
               <div className="space-y-2 mb-4 flex-1">
                 {/* Job 1 */}
                 <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                   <div className="flex items-center space-x-2">
                     <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                       <span className="text-xs font-bold text-primary-foreground">1</span>
                     </div>
                     <div>
                       <p className="text-xs font-medium text-foreground">Site Inspection</p>
                       <p className="text-xs text-muted-foreground">Riyadh • 2.1 km away</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="text-xs font-bold text-primary">SAR 800</p>
                     <span className="text-xs text-primary">Urgent</span>
                   </div>
                 </div>
                 
                 {/* Job 2 */}
                 <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                   <div className="flex items-center space-x-2">
                     <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                       <span className="text-xs font-bold text-primary-foreground">2</span>
                     </div>
                     <div>
                       <p className="text-xs font-medium text-foreground">Electrical Design</p>
                       <p className="text-xs text-muted-foreground">Jeddah • 5.3 km away</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="text-xs font-bold text-primary">SAR 1,200</p>
                     <span className="text-xs text-primary">2 days</span>
                   </div>
                 </div>
                 
                 {/* Job 3 */}
                 <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                   <div className="flex items-center space-x-2">
                     <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                       <span className="text-xs font-bold text-primary-foreground">3</span>
                     </div>
                     <div>
                       <p className="text-xs font-medium text-foreground">HVAC Review</p>
                       <p className="text-xs text-muted-foreground">Dammam • 8.7 km away</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="text-xs font-bold text-primary">SAR 950</p>
                     <span className="text-xs text-primary">1 week</span>
                   </div>
                 </div>
               </div>
               
               {/* Job Stats */}
               <div className="grid grid-cols-2 gap-2 mb-4">
                 <div className="text-center p-2 bg-muted/30 rounded-lg">
                   <p className="text-xs font-bold text-primary">12</p>
                   <p className="text-xs text-muted-foreground">Nearby Jobs</p>
                 </div>
                 <div className="text-center p-2 bg-muted/30 rounded-lg">
                   <p className="text-xs font-bold text-primary">SAR 980</p>
                   <p className="text-xs text-muted-foreground">Avg. Rate</p>
                 </div>
               </div>
               
               <div className="mt-auto">
                 <Button size="sm" className="w-full">View All Jobs</Button>
               </div>
                    </Card>

                  {/* Check-In & Verification */}
                  <Card className="p-6 h-[600px] flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold">Check-In & Verification</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Geofenced</span>
                </div>
                
                {/* Current Location */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground">Current Location</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600">Verified</span>
                  </div>
                </div>
                
                {/* Location Details */}
                <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                  <MapPin className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground">Riyadh Construction Site</p>
                      <p className="text-xs text-muted-foreground">24.7136°N, 46.6753°E • 150m radius</p>
                    </div>
                  </div>
                </div>
                
                {/* Check-In Options */}
                <div className="space-y-2 mb-4 flex-1">
                  <div className="text-xs font-medium text-muted-foreground mb-2">Check-In Methods:</div>
                  
                  {/* GPS Check-In */}
                  <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">GPS Check-In</p>
                        <p className="text-xs text-muted-foreground">Automatic location verification</p>
                      </div>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Ready</span>
                  </div>
                  
                  {/* Photo Check-In */}
                  <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Camera className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">Photo Verification</p>
                        <p className="text-xs text-muted-foreground">Site photo with timestamp</p>
                      </div>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Available</span>
                  </div>
                  
                  {/* QR Code Check-In */}
                  <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">QR Code Scan</p>
                        <p className="text-xs text-muted-foreground">Site-specific QR verification</p>
                      </div>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Active</span>
                  </div>
                </div>
                
                {/* Session Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                    <p className="text-xs font-bold text-primary">2h 15m</p>
                    <p className="text-xs text-muted-foreground">Session Time</p>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                    <p className="text-xs font-bold text-primary">3</p>
                    <p className="text-xs text-muted-foreground">Check-ins Today</p>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Button size="sm" className="w-full">Start Check-In</Button>
                </div>
              </Card>

                  {/* Upload Deliverables */}
            <Card className="p-6 h-[600px] flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold">Upload Deliverables</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Versioned</span>
              </div>
              
              {/* Project Selection */}
              <div className="mb-3">
                <select className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Select Project: Riyadh Office Complex</option>
                  <option>Jeddah Residential Tower</option>
                  <option>Dammam Industrial Plant</option>
                </select>
              </div>
              
              {/* File Type Categories */}
              <div className="flex flex-wrap gap-1 mb-4">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">CAD</span>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">PDF</span>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">Images</span>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">+3</span>
              </div>
              
              {/* Recent Uploads */}
              <div className="space-y-2 mb-4 flex-1">
                <div className="text-xs font-medium text-muted-foreground mb-2">Recent Uploads:</div>
                
                {/* File 1 */}
                <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">Structural_Plan_v2.1.dwg</p>
                      <p className="text-xs text-muted-foreground">CAD • 2.3 MB • 2 hours ago</p>
                    </div>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">v2.1</span>
                </div>
                
                {/* File 2 */}
                <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">Site_Inspection_Report.pdf</p>
                      <p className="text-xs text-muted-foreground">PDF • 1.8 MB • 5 hours ago</p>
                    </div>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Final</span>
                </div>
                
                {/* File 3 */}
                <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Camera className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">Foundation_Photos.zip</p>
                      <p className="text-xs text-muted-foreground">Images • 15.2 MB • 1 day ago</p>
                    </div>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Draft</span>
                </div>
              </div>
              
              {/* Upload Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <p className="text-xs font-bold text-primary">24</p>
                  <p className="text-xs text-muted-foreground">Files Uploaded</p>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <p className="text-xs font-bold text-primary">156 MB</p>
                  <p className="text-xs text-muted-foreground">Total Size</p>
                </div>
              </div>
              
              <div className="mt-auto">
                <Button size="sm" className="w-full">Upload New Files</Button>
              </div>
                   </Card>

                  {/* AI Proposal Assist */}
                  <Card className="p-6 h-[600px] flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold">AI Proposal Assist</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">AI Assist</span>
                </div>
                
                {/* AI Status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground">AI Assistant</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-orange-600">Ready</span>
                  </div>
                </div>
                
                {/* Project Input */}
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Enter project description..."
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                
                {/* AI Suggestions */}
                <div className="space-y-2 mb-4 flex-1">
                  <div className="text-xs font-medium text-muted-foreground mb-2">AI Suggestions:</div>
                  
                  {/* Suggestion 1 */}
                  <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">Pricing Template</p>
                        <p className="text-xs text-muted-foreground">SAR 250-400/day for civil work</p>
                      </div>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Apply</span>
                  </div>
                  
                  {/* Suggestion 2 */}
                  <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">Method Statement</p>
                        <p className="text-xs text-muted-foreground">Standard inspection procedures</p>
                      </div>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Use</span>
                  </div>
                  
                  {/* Suggestion 3 */}
                  <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">Timeline Estimate</p>
                        <p className="text-xs text-muted-foreground">5-7 days for site inspection</p>
                      </div>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Accept</span>
                  </div>
                </div>
                
                {/* AI Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                    <p className="text-xs font-bold text-primary">12</p>
                    <p className="text-xs text-muted-foreground">Proposals Generated</p>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                    <p className="text-xs font-bold text-primary">85%</p>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Button size="sm" className="w-full">Generate Proposal</Button>
                </div>
              </Card>

                  {/* Learning & CPD */}
            <Card className="p-6 h-[600px] flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold">Learning & CPD</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Certificates</span>
              </div>
              
              {/* CPD Progress */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted-foreground">CPD Hours This Year</span>
                  <span className="text-xs font-medium text-primary">24/40</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
              
              {/* Course Categories */}
              <div className="flex flex-wrap gap-1 mb-4">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Technical</span>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">Safety</span>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">Management</span>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">+5</span>
              </div>
              
              {/* Available Courses */}
              <div className="space-y-2 mb-4 flex-1">
                <div className="text-xs font-medium text-muted-foreground mb-2">Available Courses:</div>
                
                {/* Course 1 */}
                <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">Advanced Structural Design</p>
                      <p className="text-xs text-muted-foreground">8 CPD Hours • Starts Monday</p>
                    </div>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Enroll</span>
                </div>
                
                {/* Course 2 */}
                <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">HSE Management Systems</p>
                      <p className="text-xs text-muted-foreground">6 CPD Hours • Self-paced</p>
                    </div>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Start</span>
                </div>
                
                {/* Course 3 */}
                <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">Project Management</p>
                      <p className="text-xs text-muted-foreground">12 CPD Hours • Live sessions</p>
                    </div>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Waitlist</span>
                </div>
              </div>
              
              {/* Learning Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <p className="text-xs font-bold text-primary">3</p>
                  <p className="text-xs text-muted-foreground">Certificates</p>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <p className="text-xs font-bold text-primary">16</p>
                  <p className="text-xs text-muted-foreground">Hours to Goal</p>
                </div>
              </div>
              
              <div className="mt-auto">
                <Button size="sm" className="w-full">Browse All Courses</Button>
              </div>
                   </Card>

                  {/* Fast Payouts */}
                  <Card className="p-6 h-[600px] flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold">Fast Payouts</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Escrow</span>
                </div>
                
                {/* Account Status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground">Account Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600">Verified</span>
                  </div>
                </div>
                
                {/* Payment Methods */}
                <div className="space-y-2 mb-4">
                  <div className="text-xs font-medium text-muted-foreground mb-2">Payment Methods:</div>
                  
                  {/* Bank Transfer */}
                  <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <CreditCardIcon className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">Bank Transfer</p>
                        <p className="text-xs text-muted-foreground">Riyad Bank • ****1234</p>
                      </div>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Primary</span>
                  </div>
                  
                  {/* Digital Wallet */}
                  <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <CreditCardIcon className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">STC Pay</p>
                        <p className="text-xs text-muted-foreground">Instant transfer</p>
                      </div>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Available</span>
                  </div>
                </div>
                
                {/* Recent Payouts */}
                <div className="space-y-2 mb-4 flex-1">
                  <div className="text-xs font-medium text-muted-foreground mb-2">Recent Payouts:</div>
                  
                  {/* Payout 1 */}
                  <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">✓</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">Riyadh Office Project</p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-primary">SAR 3,200</p>
                      <span className="text-xs text-primary">Completed</span>
                    </div>
                  </div>
                  
                </div>
                
                {/* Earnings Summary */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                    <p className="text-xs font-bold text-primary">SAR 7,500</p>
                    <p className="text-xs text-muted-foreground">This Month</p>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded-lg">
                    <p className="text-xs font-bold text-primary">SAR 45,200</p>
                    <p className="text-xs text-muted-foreground">Total YTD</p>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Button size="sm" className="w-full">View Earnings</Button>
                </div>
              </Card>
                </div>
              </>
            )}

            {/* Enterprises Tab Content */}
            {activeTab === 'enterprises' && (
              <>
                <div className="text-center mb-0 pb-3">
                  <p className="text-lg text-muted-foreground">Workforce optimization, compliance management, and comprehensive analytics.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Team & Projects */}
                      <Card className="p-6 h-[600px] flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold">Team & Projects</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Timesheets</span>
                        </div>
                        
                        {/* Team Overview */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-muted-foreground">Active Team</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">24 Members</span>
                        </div>
                        
                        {/* Team Members Preview */}
                        <div className="space-y-2 mb-4 flex-1">
                          {/* Team Member 1 */}
                          <div className="flex items-center space-x-3 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-primary-foreground">AM</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">Ahmed Mohammed</p>
                              <p className="text-xs text-muted-foreground">Project Manager • 40h/week</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-medium text-primary">Active</p>
                              <div className="flex items-center">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-muted-foreground ml-1">4.9</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Team Member 2 */}
                          <div className="flex items-center space-x-3 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-primary-foreground">SA</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">Sarah Al-Rashid</p>
                              <p className="text-xs text-muted-foreground">Senior Engineer • 35h/week</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-medium text-primary">Active</p>
                              <div className="flex items-center">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-muted-foreground ml-1">4.8</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Team Stats */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="text-center p-2 bg-muted/30 rounded-lg">
                            <p className="text-xs font-bold text-primary">24</p>
                            <p className="text-xs text-muted-foreground">Total Members</p>
                          </div>
                          <div className="text-center p-2 bg-muted/30 rounded-lg">
                            <p className="text-xs font-bold text-primary">18</p>
                            <p className="text-xs text-muted-foreground">Active Projects</p>
                          </div>
                        </div>
                        
                        <div className="mt-auto">
                          <Button size="sm" className="w-full">Open Portfolio</Button>
                        </div>
                      </Card>

                  {/* Procurement & Vendors */}
                      <Card className="p-6 h-[600px] flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold">Procurement & Vendors</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Vendors</span>
                        </div>
                        
                        {/* Vendor Status Header */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-muted-foreground">Vendor Network</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">47 Active</span>
                        </div>
                        
                        {/* Vendor Categories */}
                        <div className="space-y-2 mb-4 flex-1">
                          {/* Vendor 1 */}
                          <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-primary-foreground">E</span>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-foreground">Equipment Suppliers</p>
                                <p className="text-xs text-muted-foreground">12 vendors • Avg. 4.7★</p>
                              </div>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Active</span>
                          </div>
                          
                          {/* Vendor 2 */}
                          <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-primary-foreground">M</span>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-foreground">Materials & Supplies</p>
                                <p className="text-xs text-muted-foreground">18 vendors • Avg. 4.8★</p>
                              </div>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Active</span>
                          </div>
                          
                          {/* Vendor 3 */}
                          <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-primary-foreground">S</span>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-foreground">Service Providers</p>
                                <p className="text-xs text-muted-foreground">17 vendors • Avg. 4.6★</p>
                              </div>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Active</span>
                          </div>
                        </div>
                        
                        {/* Procurement Stats */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="text-center p-2 bg-muted/30 rounded-lg">
                            <p className="text-xs font-bold text-primary">SAR 2.1M</p>
                            <p className="text-xs text-muted-foreground">This Month</p>
                          </div>
                          <div className="text-center p-2 bg-muted/30 rounded-lg">
                            <p className="text-xs font-bold text-primary">47</p>
                            <p className="text-xs text-muted-foreground">Active RFPs</p>
                          </div>
                        </div>
                        
                        <div className="mt-auto">
                          <Button size="sm" className="w-full">Manage Vendors</Button>
                        </div>
                      </Card>

                  {/* Payroll & HR */}
                      <Card className="p-6 h-[600px] flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold">Payroll & HR</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Employers</span>
                        </div>
                        
                        {/* HR Status Header */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-muted-foreground">HR Overview</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Compliant</span>
                        </div>
                        
                        {/* Employee Status Cards */}
                        <div className="space-y-2 mb-4 flex-1">
                          {/* Employee 1 */}
                          <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-primary-foreground">K</span>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-foreground">Khalid Al-Zahra</p>
                                <p className="text-xs text-muted-foreground">Senior Engineer • 5 days leave</p>
                              </div>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Active</span>
                          </div>
                          
                          {/* Employee 2 */}
                          <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-primary-foreground">F</span>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-foreground">Fatima Mohammed</p>
                                <p className="text-xs text-muted-foreground">Project Manager • 2 days leave</p>
                              </div>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Active</span>
                          </div>
                          
                          {/* Employee 3 */}
                          <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-primary-foreground">M</span>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-foreground">Mohammed Al-Sheikh</p>
                                <p className="text-xs text-muted-foreground">Junior Engineer • On leave</p>
                              </div>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Leave</span>
                          </div>
                        </div>
                        
                        {/* HR Stats */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="text-center p-2 bg-muted/30 rounded-lg">
                            <p className="text-xs font-bold text-primary">68%</p>
                            <p className="text-xs text-muted-foreground">Saudization</p>
                          </div>
                          <div className="text-center p-2 bg-muted/30 rounded-lg">
                            <p className="text-xs font-bold text-primary">SAR 180K</p>
                            <p className="text-xs text-muted-foreground">Monthly Payroll</p>
                          </div>
                        </div>
                        
                        <div className="mt-auto">
                          <Button size="sm" className="w-full">Open HR</Button>
                        </div>
                      </Card>

                  {/* Analytics & Reports */}
                      <Card className="p-6 h-[600px] flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold">Analytics & Reports</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Reports</span>
                        </div>
                        
                        {/* Analytics Header */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-muted-foreground">Performance Metrics</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        
                        {/* Key Metrics */}
                        <div className="space-y-2 mb-4 flex-1">
                          {/* Metric 1 */}
                          <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <TrendingUp className="w-3 h-3 text-primary-foreground" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-foreground">Revenue Growth</p>
                                <p className="text-xs text-muted-foreground">Q4 2024 vs Q3</p>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-primary">+12%</span>
                          </div>
                          
                          {/* Metric 2 */}
                          <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Users className="w-3 h-3 text-primary-foreground" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-foreground">Team Utilization</p>
                                <p className="text-xs text-muted-foreground">Current month</p>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-primary">87%</span>
                          </div>
                          
                          {/* Metric 3 */}
                          <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Target className="w-3 h-3 text-primary-foreground" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-foreground">Project Delivery</p>
                                <p className="text-xs text-muted-foreground">On-time completion</p>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-primary">94%</span>
                          </div>
                        </div>
                        
                        {/* Analytics Summary */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="text-center p-2 bg-muted/30 rounded-lg">
                            <p className="text-xs font-bold text-primary">SAR 2.8M</p>
                            <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                          </div>
                          <div className="text-center p-2 bg-muted/30 rounded-lg">
                            <p className="text-xs font-bold text-primary">18</p>
                            <p className="text-xs text-muted-foreground">Active Projects</p>
                          </div>
                        </div>
                        
                        <div className="mt-auto">
                          <Button size="sm" className="w-full">View Dashboards</Button>
                        </div>
                      </Card>

                  {/* Compliance Suite */}
                      <Card className="p-6 h-[600px] flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold">Compliance Suite</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Compliance</span>
                        </div>
                        
                        {/* Compliance Status Header */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-muted-foreground">Compliance Status</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">100%</span>
                        </div>
                        
                        {/* Compliance Categories */}
                        <div className="space-y-2 mb-4 flex-1">
                          {/* SCE Compliance */}
                          <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-primary-foreground" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-foreground">SCE Compliance</p>
                                <p className="text-xs text-muted-foreground">24/24 engineers verified</p>
                              </div>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Valid</span>
                          </div>
                          
                          {/* ZATCA Compliance */}
                          <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <FileText className="w-4 h-4 text-primary-foreground" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-foreground">ZATCA Invoicing</p>
                                <p className="text-xs text-muted-foreground">VAT 15% • All invoices compliant</p>
                              </div>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Active</span>
                          </div>
                          
                          {/* Insurance Coverage */}
                          <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Shield className="w-4 h-4 text-primary-foreground" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-foreground">Professional Insurance</p>
                                <p className="text-xs text-muted-foreground">Coverage: SAR 5M • Expires 12/2024</p>
                              </div>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Active</span>
                          </div>
                        </div>
                        
                        {/* Compliance Summary */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="text-center p-2 bg-muted/30 rounded-lg">
                            <p className="text-xs font-bold text-green-600">100%</p>
                            <p className="text-xs text-muted-foreground">Compliance Rate</p>
                          </div>
                          <div className="text-center p-2 bg-muted/30 rounded-lg">
                            <p className="text-xs font-bold text-blue-600">3/3</p>
                            <p className="text-xs text-muted-foreground">Certifications</p>
                          </div>
                        </div>
                        
                        <div className="mt-auto">
                          <Button size="sm" className="w-full">Review Compliance</Button>
                        </div>
                      </Card>

                  {/* Procurement Equipment */}
                      <Card className="p-6 h-[600px] flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold">Procurement Equipment</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Equipment</span>
                        </div>
                        
                        {/* Equipment Status Header */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-muted-foreground">Equipment Inventory</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">156 Items</span>
                        </div>
                        
                        {/* Equipment Categories */}
                        <div className="space-y-2 mb-4 flex-1">
                          {/* Heavy Machinery */}
                          <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Settings className="w-3 h-3 text-primary-foreground" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-foreground">Heavy Machinery</p>
                                <p className="text-xs text-muted-foreground">12 excavators • 8 cranes</p>
                              </div>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Operational</span>
                          </div>
                          
                          {/* Tools & Instruments */}
                          <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Wrench className="w-3 h-3 text-primary-foreground" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-foreground">Tools & Instruments</p>
                                <p className="text-xs text-muted-foreground">45 power tools • 23 measuring</p>
                              </div>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Available</span>
                          </div>
                          
                          {/* Safety Equipment */}
                          <div className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Shield className="w-3 h-3 text-primary-foreground" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-foreground">Safety Equipment</p>
                                <p className="text-xs text-muted-foreground">68 helmets • 45 vests</p>
                              </div>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Compliant</span>
                          </div>
                        </div>
                        
                        {/* Equipment Summary */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="text-center p-2 bg-muted/30 rounded-lg">
                            <p className="text-xs font-bold text-primary">SAR 4.2M</p>
                            <p className="text-xs text-muted-foreground">Total Value</p>
                          </div>
                          <div className="text-center p-2 bg-muted/30 rounded-lg">
                            <p className="text-xs font-bold text-primary">92%</p>
                            <p className="text-xs text-muted-foreground">Utilization</p>
                          </div>
                        </div>
                        
                        <div className="mt-auto">
                          <Button size="sm" className="w-full">Manage Equipment</Button>
                        </div>
                      </Card>
                </div>
              </>
            )}
          </div>

          {/* Popular Services Preview */}
          <div className="py-[200px]">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Popular Services</h3>
              <p className="text-muted-foreground">Quick access to our most requested engineering services</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {/* Site Inspection */}
              <Card className="group relative overflow-hidden bg-card backdrop-blur-sm border border-border shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                      <Building className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">150</span>
                      <span className="text-sm text-muted-foreground ml-1">SAR/day</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-card-foreground mb-2">Site Inspection</h4>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    Comprehensive site assessment and inspection services for construction projects
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    Hire Now
                  </Button>
                </div>
              </Card>

              {/* Electrical Design */}
              <Card className="group relative overflow-hidden bg-card backdrop-blur-sm border border-border shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">300</span>
                      <span className="text-sm text-muted-foreground ml-1">SAR/day</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-card-foreground mb-2">Electrical Design</h4>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    Professional electrical system design and engineering solutions
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    Hire Now
                  </Button>
                </div>
              </Card>

              {/* Structural Analysis */}
              <Card className="group relative overflow-hidden bg-card backdrop-blur-sm border border-border shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                      <Cog className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">500</span>
                      <span className="text-sm text-muted-foreground ml-1">SAR/day</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-card-foreground mb-2">Structural Analysis</h4>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    Advanced structural engineering and analysis for complex projects
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    Hire Now
                  </Button>
                </div>
              </Card>

              {/* HVAC Design */}
              <Card className="group relative overflow-hidden bg-card backdrop-blur-sm border border-border shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                      <Home className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">250</span>
                      <span className="text-sm text-muted-foreground ml-1">SAR/day</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-card-foreground mb-2">HVAC Design</h4>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    Energy-efficient heating, ventilation, and air conditioning systems
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    Hire Now
                  </Button>
                </div>
              </Card>

              {/* Surveying */}
              <Card className="group relative overflow-hidden bg-card backdrop-blur-sm border border-border shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                      <MapIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">200</span>
                      <span className="text-sm text-muted-foreground ml-1">SAR/day</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-card-foreground mb-2">Surveying</h4>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    Precision land surveying and mapping services for construction
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    Hire Now
                  </Button>
                </div>
              </Card>

              {/* HSE Consulting */}
              <Card className="group relative overflow-hidden bg-card backdrop-blur-sm border border-border shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">180</span>
                      <span className="text-sm text-muted-foreground ml-1">SAR/day</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-card-foreground mb-2">HSE Consulting</h4>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    Health, Safety, and Environment consulting for workplace compliance
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    Hire Now
                  </Button>
                </div>
              </Card>

              {/* Drone Surveying */}
              <Card className="group relative overflow-hidden bg-card backdrop-blur-sm border border-border shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                      <Camera className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">TBD</span>
                      <span className="text-sm text-muted-foreground ml-1">SAR/day</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-card-foreground mb-2">Drone Surveying</h4>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    Advanced aerial surveying and mapping using drone technology
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    Hire Now
                  </Button>
                </div>
              </Card>

              {/* Equipment Maintenance */}
              <Card className="group relative overflow-hidden bg-card backdrop-blur-sm border border-border shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                      <Wrench className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">TBD</span>
                      <span className="text-sm text-muted-foreground ml-1">SAR/day</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-card-foreground mb-2">Equipment Maintenance</h4>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    Professional maintenance and repair services for construction equipment
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    Hire Now
                  </Button>
                </div>
              </Card>
            </div>

            {/* Show More Button */}
          <div className="text-center">
              <Button variant="outline" className="px-6 py-3">
              Show More Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-32 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-green-600/10 rounded-2xl p-8 h-96 flex items-center justify-center">
                {/* Platform Preview */}
                <div className="w-full h-full bg-card rounded-xl shadow-2xl p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Platform Overview</h3>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-primary/10 rounded-lg p-3 text-center">
                      <div className="text-xs text-muted-foreground">Verified Engineers</div>
                      <div className="text-lg font-bold text-primary">2,500+</div>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-3 text-center">
                      <div className="text-xs text-muted-foreground">Projects Completed</div>
                      <div className="text-lg font-bold text-primary">15,000+</div>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-3 text-center">
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                      <div className="text-lg font-bold text-primary">98.5%</div>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-3 text-center">
                      <div className="text-xs text-muted-foreground">Avg. Response</div>
                      <div className="text-lg font-bold text-primary">2.3h</div>
                    </div>
                  </div>
                  
                  {/* Feature List */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-foreground">SCE Verified</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-foreground">Secure Payments</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-foreground">24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose nbcon?</h2>
                <p className="text-xl text-muted-foreground">
                  A high-performing web-based engineering marketplace for any project size and complexity
                </p>
              </div>
              
              <div className="space-y-6">
                {/* Feature 1 */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">24/7 Customer Support</h3>
                    <p className="text-muted-foreground">
                      Get instant help whenever you need it. Our dedicated support team is available around the clock to assist with any questions or issues.
                    </p>
                  </div>
                </div>
                
                {/* Feature 2 */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Best Price Guaranteed</h3>
                    <p className="text-muted-foreground">
                      We ensure competitive pricing for all engineering services. If you find a better price elsewhere, we'll match it.
                    </p>
                  </div>
                </div>
                
                {/* Feature 3 */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Nationwide Coverage</h3>
                    <p className="text-muted-foreground">
                      Access verified engineers across all major cities in Saudi Arabia. From Riyadh to Jeddah, we've got you covered.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Thousands of Happy Customers</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A high-performing web-based engineering marketplace for any project size and complexity
            </p>
          </div>
          
           {/* Testimonial Cards */}
           <div className="flex overflow-x-auto gap-6 mb-12 pb-4 scrollbar-hide testimonials-scroll">
             {/* Testimonial 1 */}
             <Card className="p-6 hover:shadow-lg transition-shadow flex-shrink-0 w-96">
               <div className="flex items-center mb-4">
                 <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                   <span className="text-primary font-bold text-lg">{currentUserInitials}</span>
                 </div>
                 <div>
                   <h4 className="font-semibold">{currentUserName}</h4>
                   <p className="text-sm text-muted-foreground">Riyadh, Saudi Arabia</p>
                 </div>
                 <div className="ml-auto flex items-center">
                   <Star className="w-4 h-4 fill-primary text-primary" />
                   <span className="ml-1 text-sm font-medium">4.8</span>
                 </div>
               </div>
               <p className="text-muted-foreground italic">
                 "Wow... I am very happy to use this platform, it turned out to be more than my expectations and so far there have been no problems. nbcon always the best."
               </p>
             </Card>
             
             {/* Testimonial 2 */}
             <Card className="p-6 hover:shadow-lg transition-shadow flex-shrink-0 w-96">
               <div className="flex items-center mb-4">
                 <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                   <span className="text-primary font-bold text-lg">SM</span>
                 </div>
                 <div>
                   <h4 className="font-semibold">Sarah Mohammed</h4>
                   <p className="text-sm text-muted-foreground">Jeddah, Saudi Arabia</p>
                 </div>
                 <div className="ml-auto flex items-center">
                   <Star className="w-4 h-4 fill-primary text-primary" />
                   <span className="ml-1 text-sm font-medium">5.0</span>
                 </div>
               </div>
               <p className="text-muted-foreground italic">
                 "The verification process and milestone payments gave me complete confidence. I found the perfect engineer for my project within hours."
               </p>
             </Card>
             
             {/* Testimonial 3 */}
             <Card className="p-6 hover:shadow-lg transition-shadow flex-shrink-0 w-96">
               <div className="flex items-center mb-4">
                 <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                   <span className="text-primary font-bold text-lg">KA</span>
                 </div>
                 <div>
                   <h4 className="font-semibold">Khalid Al-Mansouri</h4>
                   <p className="text-sm text-muted-foreground">Dammam, Saudi Arabia</p>
                 </div>
                 <div className="ml-auto flex items-center">
                   <Star className="w-4 h-4 fill-primary text-primary" />
                   <span className="ml-1 text-sm font-medium">4.9</span>
                 </div>
               </div>
               <p className="text-muted-foreground italic">
                 "As an engineer, this platform has transformed my business. Steady work, secure payments, and professional clients. Highly recommended!"
               </p>
             </Card>
             
             {/* Testimonial 4 */}
             <Card className="p-6 hover:shadow-lg transition-shadow flex-shrink-0 w-96">
               <div className="flex items-center mb-4">
                 <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                   <span className="text-primary font-bold text-lg">AR</span>
                 </div>
                 <div>
                   <h4 className="font-semibold">Ahmed Al-Rashid</h4>
                   <p className="text-sm text-muted-foreground">Mecca, Saudi Arabia</p>
                 </div>
                 <div className="ml-auto flex items-center">
                   <Star className="w-4 h-4 fill-primary text-primary" />
                   <span className="ml-1 text-sm font-medium">4.7</span>
                 </div>
               </div>
               <p className="text-muted-foreground italic">
                 "The bilingual support and RTL interface made it so easy to use. I can communicate with engineers in both Arabic and English seamlessly."
               </p>
             </Card>
             
             {/* Testimonial 5 */}
             <Card className="p-6 hover:shadow-lg transition-shadow flex-shrink-0 w-96">
               <div className="flex items-center mb-4">
                 <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                   <span className="text-primary font-bold text-lg">FZ</span>
                 </div>
                 <div>
                   <h4 className="font-semibold">Fatima Al-Zahra</h4>
                   <p className="text-sm text-muted-foreground">Medina, Saudi Arabia</p>
                 </div>
                 <div className="ml-auto flex items-center">
                   <Star className="w-4 h-4 fill-primary text-primary" />
                   <span className="ml-1 text-sm font-medium">5.0</span>
                 </div>
               </div>
               <p className="text-muted-foreground italic">
                 "Outstanding platform! The geo-verified check-ins and real-time tracking gave me complete peace of mind during my construction project."
               </p>
             </Card>
             
             {/* Testimonial 6 */}
             <Card className="p-6 hover:shadow-lg transition-shadow flex-shrink-0 w-96">
               <div className="flex items-center mb-4">
                 <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                   <span className="text-primary font-bold text-lg">MA</span>
                 </div>
                 <div>
                   <h4 className="font-semibold">Mohammed Al-Sheikh</h4>
                   <p className="text-sm text-muted-foreground">Tabuk, Saudi Arabia</p>
                 </div>
                 <div className="ml-auto flex items-center">
                   <Star className="w-4 h-4 fill-primary text-primary" />
                   <span className="ml-1 text-sm font-medium">4.8</span>
                 </div>
               </div>
               <p className="text-muted-foreground italic">
                 "Excellent service and support. The platform's compliance features and secure payment system make it the best choice for engineering projects."
               </p>
             </Card>
           </div>
          
          {/* Pagination Controls */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const container = document.querySelector('.testimonials-scroll');
                if (container) {
                  const newPage = Math.max(0, currentTestimonialPage - 1);
                  setCurrentTestimonialPage(newPage);
                  // Scroll by 2 cards (768px) when going back from page 2 to page 0
                  const scrollDistance = currentTestimonialPage === 2 ? -768 : -384;
                  container.scrollBy({ left: scrollDistance, behavior: 'smooth' });
                }
              }}
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
            </Button>
            <div className="flex space-x-2">
              {[0, 1, 2].map((page) => (
                <div
                  key={page}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    currentTestimonialPage === page
                      ? 'bg-primary'
                      : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const container = document.querySelector('.testimonials-scroll');
                if (container) {
                  const newPage = Math.min(2, currentTestimonialPage + 1);
                  setCurrentTestimonialPage(newPage);
                  // Scroll by 2 cards (768px) to show last 2 cards on second click
                  const scrollDistance = currentTestimonialPage === 0 ? 768 : 384;
                  container.scrollBy({ left: scrollDistance, behavior: 'smooth' });
                }
              }}
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>


      {/* Dashboard Showcase */}
      <section className="pt-[200px] pb-[400px] px-[16px]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">{t.dashboard.title}</h2>
              <p className="text-lg text-muted-foreground mb-6">{t.dashboard.subtitle}</p>
              <ul className="space-y-3 mb-8">
                {t.dashboard.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button>
                {t.dashboard.cta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="bg-muted rounded-lg p-6 h-64 flex items-center justify-center">
              <div className="w-full h-full bg-card rounded-lg shadow-lg p-4">
                <CalendarMini
                  currentDate={currentDate}
                  onDateSelect={(d)=> setCurrentDate(d)}
                  events={events}
                  isHijri={isHijri}
                  userRole={userRole}
                  onEventSelect={() => {}}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-[200px] px-[16px]">
        <div className="container mx-auto p-0">
          <div className="max-w mx-auto text-center mb-6">
            <h2 className="text-3xl font-bold mb-3">Pricing</h2>
            <p className="text-muted-foreground">
              Get started with <strong>nbcon</strong>—the Saudi-first engineering marketplace—for fast hiring, secure payments, and compliant operations.
            </p>
          </div>

            <div className="flex items-center justify-center gap-3 mb-8 pb-8">
            <button
              type="button"
              role="switch"
              aria-checked={billing === 'annual'}
              data-state={billing === 'annual' ? 'checked' : 'unchecked'}
              onClick={() => setBilling((b)=> b === 'monthly' ? 'annual' : 'monthly')}
              className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Toggle billing period"
            >
              <span
                data-state={billing === 'annual' ? 'checked' : 'unchecked'}
                className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
              />
            </button>
            <span className="text-sm text-muted-foreground">{billing === 'annual' ? 'Annually' : 'Monthly'}</span>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-xl transition-all duration-300 ${billing === 'annual' ? 'bg-[var(--primary)]' : 'bg-transparent'}`}>
            <div className="relative p-4 border border-border shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl bg-card flex flex-col h-full clients-card">
              <div className="text-center mb-0 pt-6">
                <h3 className="text-2xl mb-2 text-foreground font-bold">For Clients</h3>
                <p className="text-base text-muted-foreground mb-4 border-b border-border pb-6">Perfect for owners, contractors, and SMBs needing verified engineers fast</p>
              </div>
              <div className="space-y-2 pt-3 pb-6">
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Unlimited Job Posting - Quick, advanced, and emergency projects</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Smart Quote Management - Compare & accept with one tap</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Secure Escrow System - Milestone-based payments with full audit trail</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">ZATCA Compliance - Automated e-invoices (PDF + XML) & receipts</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Project Tracking - Budget & milestone monitoring with approvals</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Rich Communication - Messages, files (100MB), & voice notes</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Geo-Verified Check-ins - Real-time site attendance tracking</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Bilingual Support - English/Arabic with RTL & Hijri dates</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Performance Analytics - Track spending, vendors & delivery metrics</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">24/7 Support - Email & chat assistance</span>
                </div>
              </div>
              
              <div className="mt-auto pt-3 border-t border-border">
                {billing === 'annual' && <div className="text-xs mb-2 text-primary font-medium text-center">(2 months free)</div>}
                
                <div className="text-center mb-0 pb-2">
                  <span className="text-2xl text-foreground font-bold">{billing === 'annual' ? 'SAR 450' : 'SAR 45'}</span>
                  <span className="text-sm text-muted-foreground">/{billing === 'annual' ? 'year' : 'month'}</span>
                </div>
                
                <Button 
                  className="w-full py-2 text-sm transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground border-0 shadow-xl hover:shadow-2xl"
                >
                  Select Plan
                </Button>
              </div>
            </div>

            <div className="relative p-4 border-2 border-primary shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl bg-card flex flex-col h-full engineers-card">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 py-2 px-4">
                <Star className="w-4 h-4 mr-1" />
                Most Popular
              </Badge>
              
              <div className="text-center mb-0 pt-6">
                <h3 className="text-2xl mb-2 text-foreground font-bold">For Engineers</h3>
                <p className="text-base text-muted-foreground mb-4 border-b border-border pb-6">Perfect for certified engineers and small firms building a steady pipeline</p>
              </div>
              
              <div className="space-y-2 pt-3 pb-6">
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Smart Job Matching - Find nearby jobs in your specialty</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Quote Management - Templates, reminders & bid tracking</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Geofenced Check-ins - Automated site visit tracking</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Deliverables Hub - Version control & approval workflows</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Instant Payouts - Direct IBAN transfers + monthly statements</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Tax Invoice Generation - PDF/XML downloads when enabled</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Portfolio & Reviews - Public profile with ratings system</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Earnings Dashboard - MTD/YTD tracking & escrow status</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Bilingual Communication - AR↔EN translation support</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">24/7 Support - Email & chat assistance</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Mobile App Access - Full platform on iOS & Android</span>
                </div>
              </div>
              
              <div className="mt-auto pt-3 border-t border-border">
                {billing === 'annual' && <div className="text-xs mb-2 text-primary font-medium text-center">(2 months free)</div>}

                <div className="text-center mb-0 pb-2">
                  <span className="text-2xl text-foreground font-bold">{billing === 'annual' ? 'SAR 600' : 'SAR 60'}</span>
                  <span className="text-sm text-muted-foreground">/{billing === 'annual' ? 'year' : 'month'}</span>
                </div>

                <Button
                  className="w-full py-2 text-sm transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground border-0 shadow-xl hover:shadow-2xl"
                >
                  Select Plan
                </Button>
              </div>
            </div>

            <div className="relative p-4 border border-border shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl bg-card flex flex-col h-full enterprise-card">
              <div className="text-center mb-0 pt-6">
                <h3 className="text-2xl mb-2 text-foreground font-bold">Enterprise</h3>
                <p className="text-base text-muted-foreground mb-4 border-b border-border pb-6">Perfect for large developers, enterprises, and government entities</p>
              </div>
              
              <div className="space-y-2 pt-3 pb-6">
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Advanced RFP Management - Multi-stage approvals & custom workflows</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Team Management - Role-based access & seat allocation</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Portfolio Analytics - Utilization, SLA, risk & compliance tracking</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Enterprise Security - SSO/SAML & policy controls</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Custom Integrations - ERP, HR, storage system connections</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Priority Support - Dedicated onboarding & assistance</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Consolidated Billing - Cost centers & chargeback management</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Advanced Reporting - Data export & scheduled reports</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">Vendor Management - Scorecards & audit-ready documentation</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">White-Label Solutions - Custom branding & domain options</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">API Access - Full platform integration capabilities</span>
                </div>
              </div>
              
              <div className="mt-auto pt-3 border-t border-border">
                {billing === 'annual' && <div className="text-xs mb-2 text-primary font-medium text-center">(2 months free)</div>}
                
                <div className="text-center mb-0 pb-2">
                  <span className="text-2xl text-foreground font-bold">{billing === 'annual' ? 'SAR 1200' : 'SAR 120'}</span>
                  <span className="text-sm text-muted-foreground">/{billing === 'annual' ? 'year' : 'month'}</span>
                </div>
                
                <Button 
                  className="w-full py-2 text-sm transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground border-0 shadow-xl hover:shadow-2xl"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about nbcon and our engineering platform
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <Card className="p-0">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                  <h3 className="text-lg font-semibold text-left">How does nbcon verify engineers?</h3>
                  <div className="ml-4 flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                  </div>
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-muted-foreground">
                    nbcon verifies all engineers through SCE (Saudi Council of Engineers) credential checks, 
                    professional insurance validation, and background verification. We also conduct ongoing 
                    compliance monitoring to ensure all engineers maintain their professional standards.
                  </p>
                </div>
              </details>
            </Card>

            <Card className="p-0">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                  <h3 className="text-lg font-semibold text-left">What payment methods are accepted?</h3>
                  <div className="ml-4 flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                  </div>
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-muted-foreground">
                    We accept all major payment methods including credit cards, bank transfers, and digital wallets. 
                    All payments are processed securely with escrow protection until project milestones are completed 
                    and verified.
                  </p>
                </div>
              </details>
            </Card>

            <Card className="p-0">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                  <h3 className="text-lg font-semibold text-left">How does the milestone tracking work?</h3>
                  <div className="ml-4 flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                  </div>
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-muted-foreground">
                    Projects are broken down into clear milestones with defined deliverables. Engineers upload 
                    their work and provide progress updates. Clients review and approve milestones before 
                    payments are released from escrow, ensuring quality and transparency.
                  </p>
                </div>
              </details>
            </Card>

            <Card className="p-0">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                  <h3 className="text-lg font-semibold text-left">Is there a mobile app available?</h3>
                  <div className="ml-4 flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                  </div>
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-muted-foreground">
                    Yes! nbcon is fully responsive and works seamlessly on mobile devices. We also offer 
                    progressive web app (PWA) functionality, allowing you to install the app on your phone 
                    for quick access to projects, messages, and check-ins.
                  </p>
                </div>
              </details>
            </Card>

            <Card className="p-0">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                  <h3 className="text-lg font-semibold text-left">How do I get started as a client?</h3>
                  <div className="ml-4 flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                  </div>
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-muted-foreground">
                    Getting started is easy! Simply create your account, complete your profile, and post your 
                    first project. Our AI will help match you with qualified engineers based on your specific 
                    requirements and location preferences.
                  </p>
                </div>
              </details>
            </Card>

            <Card className="p-0">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                  <h3 className="text-lg font-semibold text-left">What types of engineering projects are supported?</h3>
                  <div className="ml-4 flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                  </div>
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-muted-foreground">
                    nbcon supports all major engineering disciplines including Civil, Electrical, Mechanical, 
                    Structural, HVAC, and Environmental Engineering. We cover projects from residential to 
                    large-scale industrial and infrastructure developments.
                  </p>
                </div>
              </details>
            </Card>

            <Card className="p-0">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                  <h3 className="text-lg font-semibold text-left">How does the AI assistant help with projects?</h3>
                  <div className="ml-4 flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                  </div>
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-muted-foreground">
                    Our AI assistant provides real-time cost estimation, timeline optimization, compliance 
                    guidance, and smart project matching. It analyzes project requirements and suggests 
                    the best engineers based on expertise, location, and availability.
                  </p>
                </div>
              </details>
            </Card>

            <Card className="p-0">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                  <h3 className="text-lg font-semibold text-left">What support is available for enterprise clients?</h3>
                  <div className="ml-4 flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                  </div>
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-muted-foreground">
                    Enterprise clients receive dedicated account management, custom integrations, advanced 
                    analytics and reporting, priority support, and tailored compliance solutions. We also 
                    offer on-site training and implementation support.
                  </p>
                </div>
              </details>
            </Card>

            <Card className="p-0">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                  <h3 className="text-lg font-semibold text-left">How secure is my project data?</h3>
                  <div className="ml-4 flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                  </div>
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-muted-foreground">
                    Security is our top priority. All data is encrypted in transit and at rest using industry-standard 
                    encryption. We comply with Saudi data protection regulations and maintain strict access controls 
                    with regular security audits and monitoring.
                  </p>
                </div>
              </details>
            </Card>

            <Card className="p-0">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                  <h3 className="text-lg font-semibold text-left">Can I cancel or modify my subscription anytime?</h3>
                  <div className="ml-4 flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                  </div>
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-muted-foreground">
                    Yes, you have complete flexibility with your subscription. You can upgrade, downgrade, 
                    or cancel your plan at any time through your account settings. Changes take effect at 
                    the next billing cycle, and there are no cancellation fees.
                  </p>
                </div>
              </details>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t.community.title}</h2>
          <p className="text-lg text-muted-foreground mb-12">{t.community.subtitle}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
            {t.community.testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">"{testimonial}"</p>
              </Card>
            ))}
          </div>

          <Button variant="outline">
            {t.community.cta}
          </Button>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">{t.finalCta.title}</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/client/jobs/create">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                {t.finalCta.postJob}
              </Button>
            </Link>
            <Link to="/client/browse">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                {t.finalCta.browse}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">nb</span>
                </div>
                <span className="font-bold text-xl">nbcon</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Saudi Arabia's premier engineering marketplace connecting verified professionals with clients through AI-powered matching and secure milestone payments.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                  <Globe className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                  <Users className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.product.title}</h4>
              <ul className="space-y-3">
                {t.footer.product.links.map((link, index) => (
                  <li key={index}>
                    <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Clients */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.clients.title}</h4>
              <ul className="space-y-3">
                {t.footer.clients.links.map((link, index) => (
                  <li key={index}>
                    <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Engineers */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.engineers.title}</h4>
              <ul className="space-y-3">
                {t.footer.engineers.links.map((link, index) => (
                  <li key={index}>
                    <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              {t.footer.copyright}
            </p>
              <div className="flex space-x-6">
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Follow us:</span>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  <Globe className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  <Users className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
