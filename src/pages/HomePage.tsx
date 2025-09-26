import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/stores/auth';
import { getUserDisplayName, getUserInitials } from '@/lib/userUtils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ui/theme-toggle';
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
  Heart
} from 'lucide-react';
import CalendarMini from '@/components/calendar/CalendarMini';
import { useCalendarStore } from '@/stores/useCalendarStore';

const HomePage = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
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
      <section className="py-20 px-4">
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
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent hero-title">
              {t.hero.title}
            </span>
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
            
            {/* Right Column - Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-green-600/10 rounded-2xl p-8 h-96 flex items-center justify-center">
                {/* Dashboard Preview */}
                <div className="w-full h-full bg-card rounded-xl shadow-2xl p-6 space-y-4">
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Live Dashboard</h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground">Active Jobs</div>
                      <div className="text-lg font-bold text-primary">12</div>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground">Earnings</div>
                      <div className="text-lg font-bold text-primary">$2,450</div>
                    </div>
                  </div>
                  
                  {/* Chart Area */}
                  <div className="flex-1 bg-muted rounded-lg p-3 flex items-end space-x-1">
                    <div className="bg-primary h-8 w-4 rounded-t"></div>
                    <div className="bg-primary h-12 w-4 rounded-t"></div>
                    <div className="bg-primary h-6 w-4 rounded-t"></div>
                    <div className="bg-primary h-10 w-4 rounded-t"></div>
                    <div className="bg-primary h-14 w-4 rounded-t"></div>
                    <div className="bg-primary h-8 w-4 rounded-t"></div>
                    <div className="bg-primary h-11 w-4 rounded-t"></div>
                  </div>
                  
                  {/* Recent Activity */}
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Recent Activity</div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-xs">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-foreground">Job completed</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-foreground">New message</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Search Form */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-center mb-8">Find Your Perfect Engineering Solution</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Type Selection */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input type="radio" id="quick-job" name="project-type" className="mr-2" defaultChecked />
                      <label htmlFor="quick-job" className="text-sm font-medium">Quick Job</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" id="advanced-project" name="project-type" className="mr-2" />
                      <label htmlFor="advanced-project" className="text-sm font-medium">Advanced Project</label>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Project Type</label>
                      <select className="w-full p-3 border border-sidebar-border rounded-lg bg-background">
                        <option>Select engineering discipline</option>
                        <option>Civil Engineering</option>
                        <option>Electrical Engineering</option>
                        <option>Mechanical Engineering</option>
                        <option>Architecture</option>
                        <option>Surveying</option>
                        <option>HSE</option>
                        <option>QA/QC</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <select className="w-full p-3 border border-sidebar-border rounded-lg bg-background">
                        <option>Select your city</option>
                        <option>Riyadh</option>
                        <option>Jeddah</option>
                        <option>Dammam</option>
                        <option>Mecca</option>
                        <option>Medina</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Timeline and Budget */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input type="radio" id="urgent" name="timeline" className="mr-2" />
                      <label htmlFor="urgent" className="text-sm font-medium">Urgent</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" id="flexible" name="timeline" className="mr-2" defaultChecked />
                      <label htmlFor="flexible" className="text-sm font-medium">Flexible</label>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Timeline</label>
                      <select className="w-full p-3 border border-sidebar-border rounded-lg bg-background">
                        <option>Select timeline</option>
                        <option>Within 1 week</option>
                        <option>1-2 weeks</option>
                        <option>1 month</option>
                        <option>2-3 months</option>
                        <option>6+ months</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Budget Range</label>
                      <select className="w-full p-3 border border-sidebar-border rounded-lg bg-background">
                        <option>Select budget range</option>
                        <option>Under SAR 1,000</option>
                        <option>SAR 1,000 - 5,000</option>
                        <option>SAR 5,000 - 10,000</option>
                        <option>SAR 10,000 - 25,000</option>
                        <option>SAR 25,000+</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Button size="lg" className="w-full sm:w-auto">
                  <Search className="w-4 h-4 mr-2" />
                  Search Engineers
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-medium mb-8 trust-title">{t.trust.title}</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            {/* Placeholder for company logos */}
            <div className="w-20 h-8 bg-muted-foreground/20 rounded"></div>
            <div className="w-24 h-8 bg-muted-foreground/20 rounded"></div>
            <div className="w-16 h-8 bg-muted-foreground/20 rounded"></div>
            <div className="w-28 h-8 bg-muted-foreground/20 rounded"></div>
            <div className="w-20 h-8 bg-muted-foreground/20 rounded"></div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
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

      {/* Popular Services Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Engineering Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A high-performing web-based engineering marketplace for any project size and complexity
            </p>
          </div>
          
          {/* Service Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button variant="default" className="px-6 py-3">Popular</Button>
            <Button variant="outline" className="px-6 py-3">Civil Engineering</Button>
            <Button variant="outline" className="px-6 py-3">Electrical</Button>
            <Button variant="outline" className="px-6 py-3">Mechanical</Button>
            <Button variant="outline" className="px-6 py-3">Architecture</Button>
          </div>
          
          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Service Card 1 */}
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Site Inspection</h3>
                <Heart className="w-5 h-5 text-muted-foreground hover:text-red-500 cursor-pointer" />
              </div>
              <div className="w-full h-32 bg-muted rounded-lg mb-4 flex items-center justify-center">
                <Building className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">SAR 150/day</span>
                <Button size="sm">Hire Now</Button>
              </div>
            </Card>

            {/* Service Card 2 */}
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Electrical Design</h3>
                <Heart className="w-5 h-5 text-muted-foreground hover:text-red-500 cursor-pointer" />
              </div>
              <div className="w-full h-32 bg-muted rounded-lg mb-4 flex items-center justify-center">
                <Zap className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">SAR 300/day</span>
                <Button size="sm">Hire Now</Button>
              </div>
            </Card>

            {/* Service Card 3 */}
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Structural Analysis</h3>
                <Heart className="w-5 h-5 text-muted-foreground hover:text-red-500 cursor-pointer" />
              </div>
              <div className="w-full h-32 bg-muted rounded-lg mb-4 flex items-center justify-center">
                <Cog className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">SAR 500/day</span>
                <Button size="sm">Hire Now</Button>
              </div>
            </Card>

            {/* Service Card 4 */}
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">HVAC Design</h3>
                <Heart className="w-5 h-5 text-muted-foreground hover:text-red-500 cursor-pointer" />
              </div>
              <div className="w-full h-32 bg-muted rounded-lg mb-4 flex items-center justify-center">
                <Home className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">SAR 250/day</span>
                <Button size="sm">Hire Now</Button>
              </div>
            </Card>

            {/* Service Card 5 */}
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Surveying</h3>
                <Heart className="w-5 h-5 text-muted-foreground hover:text-red-500 cursor-pointer" />
              </div>
              <div className="w-full h-32 bg-muted rounded-lg mb-4 flex items-center justify-center">
                <MapIcon className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">SAR 200/day</span>
                <Button size="sm">Hire Now</Button>
              </div>
            </Card>

            {/* Service Card 6 */}
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">HSE Consulting</h3>
                <Heart className="w-5 h-5 text-muted-foreground hover:text-red-500 cursor-pointer" />
              </div>
              <div className="w-full h-32 bg-muted rounded-lg mb-4 flex items-center justify-center">
                <Shield className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">SAR 180/day</span>
                <Button size="sm">Hire Now</Button>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg">
              Show More Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Testimonial 1 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
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
            <Card className="p-6 hover:shadow-lg transition-shadow">
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
            <Card className="p-6 hover:shadow-lg transition-shadow">
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
          </div>
          
          {/* Pagination Controls */}
          <div className="flex justify-center items-center space-x-4">
            <Button variant="outline" size="sm">
              <ArrowRight className="w-4 h-4 rotate-180" />
          </Button>
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="w-2 h-2 bg-muted-foreground/30 rounded-full"></div>
              <div className="w-2 h-2 bg-muted-foreground/30 rounded-full"></div>
            </div>
            <Button variant="outline" size="sm">
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

          <div className="flex items-center justify-center gap-3 mb-8">
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

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl transition-all duration-300 ${billing === 'annual' ? 'bg-[var(--primary)]' : 'bg-transparent'}`}>
            <div className="rounded-xl border-0 bg-[var(--surface)] p-6 h-full flex flex-col shadow-md shadow-[inset_0_4px_4px_hsl(var(--foreground)/0.1)] transition-transform duration-300 hover:shadow-[0_0_0_1px_var(--primary)] hover:-translate-y-1 clients-card">
              <h3 className="text-xl font-semibold mb-6 border-b-[0.5px] border-[var(--border)] pb-3">For Clients</h3>
              {billing === 'annual' && <div className="text-xs mb-3">(2 months free)</div>}
              <ul className="text-sm space-y-2 mb-4">
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Post unlimited jobs (quick, advanced, emergency)</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Request & compare quotes; one-tap acceptance</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Milestone escrow (fund/release) with full audit trail</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />ZATCA-compliant e-invoices (PDF + XML) and receipts</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Budget & milestone tracking with approvals</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />In-thread messages, files (100 MB), and voice notes</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Real-time site check-ins (geo-verified)</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Bilingual (EN/AR), full RTL + optional Hijri dates</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Basic analytics: spend, vendors, on-time delivery</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Email/chat support</li>
              </ul>
              <div className="text-xs text-muted-foreground mb-4">Best for: Owners, contractors, SMBs needing verified engineers fast.</div>
              <div className="mt-auto">
                <div className="text-2xl font-bold mb-2">{billing === 'annual' ? 'SAR 430' : 'SAR 43'} <span className="text-sm font-normal opacity-70">/ seat {billing === 'annual' ? '/ year' : '/ month'}</span></div>
                <Button className="w-full">Select Plan</Button>
              </div>
            </div>

            <div className="rounded-xl border-0 bg-[var(--surface)] p-6 h-full flex flex-col shadow-md shadow-[inset_0_4px_4px_hsl(var(--foreground)/0.1)] transition-transform duration-300 hover:shadow-[0_0_0_1px_var(--primary)] hover:-translate-y-1 engineers-card">
              <h3 className="text-xl font-semibold mb-6 border-b-[0.5px] border-[var(--border)] pb-3">For Engineers <span className="text-xs text-muted-foreground">(+35% from Client)</span></h3>
              {billing === 'annual' && <div className="text-xs mb-3">(2 months free)</div>}
              
              <ul className="text-sm space-y-2 mb-4">
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Smart matching to nearby jobs in your specialty</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Quote & bid manager with templates and reminders</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Geofenced check-in/out for site visits</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Deliverables hub with version control & approvals</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Instant payouts to IBAN + monthly statements</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Issue tax invoices (if enabled) with PDF/XML downloads</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Ratings & reviews; public portfolio profile</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Earnings dashboard (MTD/YTD, pending escrow, next payout)</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Bilingual messaging with AR↔EN translation</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Email/chat support</li>
              </ul>
              <div className="text-xs text-muted-foreground mb-4">Best for: Certified engineers and small firms building a steady pipeline.</div>
              <div className="mt-auto">
                <div className="text-2xl font-bold mb-2">{billing === 'annual' ? 'SAR 580.50' : 'SAR 58.05'} <span className="text-sm font-normal opacity-70">/ seat {billing === 'annual' ? '/ year' : '/ month'}</span></div>
                <Button className="w-full">Select Plan</Button>
              </div>
            </div>

            <div className="rounded-xl border-0 bg-[var(--surface)] p-6 h-full flex flex-col shadow-md shadow-[inset_0_4px_4px_hsl(var(--foreground)/0.1)] transition-transform duration-300 hover:shadow-[0_0_0_1px_var(--primary)] hover:-translate-y-1 enterprise-card">
              <h3 className="text-xl font-semibold mb-6 border-b-[0.5px] border-[var(--border)] pb-3">Enterprise <span className="text-xs text-muted-foreground">(+100% from Client)</span></h3>
              {billing === 'annual' && <div className="text-xs mb-3">(2 months free)</div>}
              
              <ul className="text-sm space-y-2 mb-4">
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />RFPs & multi-stage approvals (custom workflows)</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Team roles & seat management across projects</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Portfolio analytics: utilization, SLA, risk & compliance</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />SSO/SAML and enterprise policy controls</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Custom integrations (ERP, HR, storage)</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Priority support & guided onboarding</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Consolidated billing; cost centers & chargebacks</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Data export & scheduled email reports</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-0.5" />Vendor scorecards and audit-ready trails</li>
              </ul>
              <div className="text-xs text-muted-foreground mb-4">Best for: Large developers, enterprises, and government entities.</div>
              <div className="mt-auto">
                <div className="text-2xl font-bold mb-2">{billing === 'annual' ? 'SAR 860' : 'SAR 86'} <span className="text-sm font-normal opacity-70">/ seat {billing === 'annual' ? '/ year' : '/ month'}</span></div>
                <Button className="w-full">Contact sales</Button>
              </div>
            </div>
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
