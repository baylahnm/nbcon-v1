import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  TestTube
} from 'lucide-react';

const HomePage = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

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
              <span className="font-bold text-xl">nbcon</span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="#" className="text-sm font-medium hover:text-primary transition-colors">
                {t.nav.product}
              </Link>
              <Link to="#" className="text-sm font-medium hover:text-primary transition-colors">
                {t.nav.pricing}
              </Link>
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
            <div className="flex items-center space-x-4">
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

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
              {t.hero.title}
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {t.hero.subtitle}
          </p>
          
          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/client/jobs/create">
              <Button size="lg" className="w-full sm:w-auto">
                {t.hero.postJob}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/client/browse">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                {t.hero.browse}
              </Button>
            </Link>
          </div>

          {/* Support Bullets */}
          <div className="flex flex-wrap justify-center gap-4 mb-4">
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
      </section>

      {/* Trust Strip */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-medium mb-8">{t.trust.title}</p>
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

      {/* Feature Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature Card 1 - Verified Talent */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Shield className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{t.features.verified.title}</h3>
              <p className="text-sm text-muted-foreground">{t.features.verified.desc}</p>
            </Card>

            {/* Feature Card 2 - Jobs & Quotes */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Briefcase className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{t.features.jobs.title}</h3>
              <p className="text-sm text-muted-foreground">{t.features.jobs.desc}</p>
            </Card>

            {/* Feature Card 3 - Escrow & Invoicing */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CreditCard className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{t.features.escrow.title}</h3>
              <p className="text-sm text-muted-foreground">{t.features.escrow.desc}</p>
            </Card>

            {/* Feature Card 4 - Messaging & Files */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <MessageSquare className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{t.features.messaging.title}</h3>
              <p className="text-sm text-muted-foreground">{t.features.messaging.desc}</p>
            </Card>

            {/* Feature Card 5 - Location & Check-ins */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <MapPin className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{t.features.location.title}</h3>
              <p className="text-sm text-muted-foreground">{t.features.location.desc}</p>
            </Card>

            {/* Feature Card 6 - Analytics Dashboards */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <BarChart3 className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{t.features.analytics.title}</h3>
              <p className="text-sm text-muted-foreground">{t.features.analytics.desc}</p>
            </Card>

            {/* Feature Card 7 - Enterprise Controls */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Users className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{t.features.enterprise.title}</h3>
              <p className="text-sm text-muted-foreground">{t.features.enterprise.desc}</p>
            </Card>

            {/* Feature Card 8 - APIs & Exports */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Database className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{t.features.apis.title}</h3>
              <p className="text-sm text-muted-foreground">{t.features.apis.desc}</p>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link to="/features" className="text-primary hover:underline">
              Learn more →
            </Link>
          </div>
        </div>
      </section>

      {/* Works With Disciplines */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">{t.disciplines.title}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {t.disciplines.tags.map((tag, index) => {
              const icons = [Building, Zap, Cog, Home, Search, MapIcon, Shield, Eye];
              const Icon = icons[index % icons.length];
              return (
                <Badge key={index} variant="outline" className="px-4 py-2">
                  <Icon className="w-4 h-4 mr-2" />
                  {tag}
                </Badge>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">{t.social.title}</h2>
          <p className="text-lg text-muted-foreground mb-8">{t.social.subtitle}</p>
          <Button variant="outline">
            {t.social.cta}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Quickstart Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Start in seconds</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Clients */}
            <Card className="p-6">
              <div className="text-center mb-4">
                <Briefcase className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-xl font-semibold mb-2">{t.quickstart.clients.title}</h3>
              </div>
              <div className="space-y-2 mb-6">
                {t.quickstart.clients.steps.map((step, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
              <Link to="/client/jobs/create" className="block">
                <Button className="w-full">
                  {t.quickstart.clients.cta}
                </Button>
              </Link>
            </Card>

            {/* For Engineers */}
            <Card className="p-6">
              <div className="text-center mb-4">
                <Wrench className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-xl font-semibold mb-2">{t.quickstart.engineers.title}</h3>
              </div>
              <div className="space-y-2 mb-6">
                {t.quickstart.engineers.steps.map((step, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
              <Link to="/auth/profile/engineer" className="block">
                <Button className="w-full">
                  {t.quickstart.engineers.cta}
                </Button>
              </Link>
            </Card>

            {/* For Enterprise */}
            <Card className="p-6">
              <div className="text-center mb-4">
                <Building className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-xl font-semibold mb-2">{t.quickstart.enterprise.title}</h3>
              </div>
              <div className="space-y-2 mb-6">
                {t.quickstart.enterprise.steps.map((step, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
              <Button className="w-full" variant="outline">
                {t.quickstart.enterprise.cta}
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Showcase */}
      <section className="py-20 px-4">
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
            <div className="bg-muted rounded-lg p-8 h-64 flex items-center justify-center">
              <BarChart3 className="w-24 h-24 text-muted-foreground" />
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
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            {/* Product */}
            <div>
              <h4 className="font-semibold mb-3">{t.footer.product.title}</h4>
              <ul className="space-y-2">
                {t.footer.product.links.map((link, index) => (
                  <li key={index}>
                    <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Clients */}
            <div>
              <h4 className="font-semibold mb-3">{t.footer.clients.title}</h4>
              <ul className="space-y-2">
                {t.footer.clients.links.map((link, index) => (
                  <li key={index}>
                    <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Engineers */}
            <div>
              <h4 className="font-semibold mb-3">{t.footer.engineers.title}</h4>
              <ul className="space-y-2">
                {t.footer.engineers.links.map((link, index) => (
                  <li key={index}>
                    <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-3">{t.footer.company.title}</h4>
              <ul className="space-y-2">
                {t.footer.company.links.map((link, index) => (
                  <li key={index}>
                    <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-3">{t.footer.legal.title}</h4>
              <ul className="space-y-2">
                {t.footer.legal.links.map((link, index) => (
                  <li key={index}>
                    <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">nb</span>
              </div>
              <span className="font-semibold">nbcon</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
