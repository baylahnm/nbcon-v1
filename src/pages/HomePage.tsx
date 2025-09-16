import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
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
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const { theme } = useTheme();

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

      {/* Hero Section */}
      <section className="py-[200px] px-[16px]">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent hero-title">
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
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#27c862] hover:border-[#27c862] browse-engineers-btn">
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

      {/* Feature Grid */}
      <section className="py-[200px] px-[16px]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 feature-cards">
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
          <h2 className="text-2xl font-bold mb-8 disciplines-title">{t.disciplines.title}</h2>
          <div className="flex flex-wrap justify-center gap-3 disciplines-badges">
            {t.disciplines.tags.map((tag, index) => {
              const icons = [Building, Zap, Cog, Home, Search, MapIcon, Shield, Eye];
              const Icon = icons[index % icons.length];
              return (
                <Badge key={index} variant="outline" className="px-4 py-2 border-0 hover:shadow-[0_0_0_1px_#27c862]">
                  <Icon className="w-4 h-4 mr-2" />
                  {tag}
                </Badge>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-[200px] px-[16px]">
        <div className="container mx-auto text-center max-w">
          <h2 className="text-3xl font-bold mb-4 social-title">{t.social.title}</h2>
          <p className="text-lg text-muted-foreground mb-8">{t.social.subtitle}</p>
          <Button variant="outline" className="border-[#27c862] hover:text-[#27c862] social-cta-btn">
            {t.social.cta}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>


      {/* Dashboard Showcase */}
      <section className="py-[200px] px-[16px]">
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
              <img 
                src={theme === 'dark' ? "/Dashboard/2.png" : theme === 'warm' ? "/Dashboard/2-warm.png" : "/Dashboard/2-light.png"} 
                alt="Dashboard" 
                className="w-100 h-100 shadow-[0_4px_4px_rgba(0,0,0,0.1)]" 
              />
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
              onClick={() => setBilling((b)=> b === 'monthly' ? 'annual' : 'monthly')}
              className={`relative h-6 w-12 rounded-full border border-[var(--border)] transition-colors billing-toggle ${billing==='annual' ? 'bg-[#27c862]' : 'bg-[var(--surface)]'}`}
              aria-label="Toggle billing period"
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full shadow shadow-[inset_0_4px_4px_rgba(0,0,0,0.1)] transition-transform ${billing==='annual' ? 'translate-x-6 bg-[#e8e8e8]' : 'bg-[#e8e8e8]'}`}
              />
            </button>
            <span className="text-sm text-muted-foreground">{billing === 'annual' ? 'Annually' : 'Monthly'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border-0 bg-[var(--surface)] p-6 h-full flex flex-col shadow-md shadow-[inset_0_4px_4px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:shadow-[0_0_0_1px_#27c862] hover:-translate-y-1 clients-card">
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

            <div className="rounded-xl border-0 bg-[var(--surface)] p-6 h-full flex flex-col shadow-md shadow-[inset_0_4px_4px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:shadow-[0_0_0_1px_#27c862] hover:-translate-y-1 engineers-card">
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

            <div className="rounded-xl border-0 bg-[var(--surface)] p-6 h-full flex flex-col shadow-md shadow-[inset_0_4px_4px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:shadow-[0_0_0_1px_#27c862] hover:-translate-y-1 enterprise-card">
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
