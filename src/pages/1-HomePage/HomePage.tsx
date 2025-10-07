import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useAuthStore } from './others/stores/auth';
import { getUserDisplayName, getUserInitials } from './others/lib/userUtils';
import { Button } from './others/components/ui/button';
import { Card } from './others/components/ui/card';
import { Badge } from './others/components/ui/badge';
import { Separator } from './others/components/ui/separator';
import { ThemeToggle } from './others/components/ui/theme-toggle';
import { TypewriterText } from './others/components/ui/typewriter-text';
import StarBorder from './others/components/star-border/StarBorder';
import InteractiveSelector from './others/components/ui/interactive-selector';
import { HeroSection } from './others/components/ui/hero-section';
import { TrustStrip } from './others/components/sections/TrustStrip';
import { AIChatAssistant } from './others/components/sections/AIChatAssistant';
import { DashboardShowcase } from './others/components/sections/DashboardShowcase';
import { FeaturesSectionWithBentoGrid } from './others/components/ui/feature-section-with-bento-grid';
import Testimonials from './others/components/ui/testimonials-demo';
import PricingSection from './others/components/sections/PricingSection';
import { FAQSection } from './others/components/sections/FAQSection';
import { ContactSection } from './others/components/sections/ContactSection';
import { Footer } from './others/components/sections/Footer';
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
  Globe2,
  Phone,
  Clock,
  Award,
  Building,
  Wrench,
  Zap,
  ChevronLeft,
  ChevronRight,
  Cog,
  Home,
  Search,
  Map as MapIcon,
  Menu,
  X,
  Brain,
  Send,
  User,
  Mail,
  MessageCircle,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
} from 'lucide-react';

const HomePage = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [dashboardRole, setDashboardRole] = useState<'engineers' | 'clients' | 'enterprise'>('engineers');
  
  // Ref for horizontal scroll container
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Typewriter effect for hero title
  const [typedPlaceholder, setTypedPlaceholder] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);

  const typingTexts = [
    'Hire SCE-verified engineers in minutes.',
    'Find your next engineering project.',
    'Scale your engineering business.',
  ];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentText = typingTexts[typingIndex];
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setTypedPlaceholder(currentText.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (charIndex > 0) {
          setTypedPlaceholder(currentText.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
        } else {
        setIsDeleting(false);
          setTypingIndex((typingIndex + 1) % typingTexts.length);
    }
      }
    }, isDeleting ? 50 : 100);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [charIndex, isDeleting, typingIndex]);
  const [activeTab, setActiveTab] = useState<'clients' | 'engineers' | 'enterprises'>('clients');
  const [currentTestimonialPage, setCurrentTestimonialPage] = useState(0);
  
  // Handle testimonial scroll pagination
  useEffect(() => {
    const container = document.querySelector('.testimonials-scroll');
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const page = Math.round(scrollLeft / containerWidth);
      setCurrentTestimonialPage(page);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll functions for cards
  const scrollCards = useCallback((direction: 'left' | 'right') => {
    if (cardsContainerRef.current) {
      const scrollAmount = 300;
      const currentScroll = cardsContainerRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      cardsContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  }, []);

  // Update arrow visibility based on scroll position
  const updateArrowVisibility = useCallback(() => {
    if (cardsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = cardsContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    const container = cardsContainerRef.current;
    if (container) {
    container.addEventListener('scroll', updateArrowVisibility);
      updateArrowVisibility(); // Initial check
      
      return () => container.removeEventListener('scroll', updateArrowVisibility);
    }
  }, [updateArrowVisibility]);

  const { theme } = useTheme();
  const { profile } = useAuthStore();
  
  // Get current user data
  const currentUserName = getUserDisplayName(profile);
  const currentUserInitials = getUserInitials(profile);

  const isRTL = language === 'ar';

  const content = {
    en: {
      nav: {
        home: 'Home',
        features: 'Features',
        pricing: 'Pricing',
        about: 'About',
        contact: 'Contact',
        getStarted: 'Get Started',
        signIn: 'Sign In'
      },
      hero: {
        title: 'Hire SCE-verified engineers in minutes.',
        subtitle: 'nbocn is Saudi Arabia\'s engineering marketplace—AI matching, milestone escrow, ZATCA e-invoicing, and bilingual workflows for every project phase.',
        browse: 'Browse Engineers',
        features: ['SCE verification', 'Geofenced check-ins', 'Arabic/English', 'PDPL-ready'],
        microcopy: 'No credit card required. Cancel anytime.'
      },
      trust: {
        title: 'Trusted by Leading Companies',
        subtitle: 'Join thousands of satisfied clients who trust nbcon for their engineering needs'
      },
      dashboard: {
        title: 'Complete Project Management',
        subtitle: 'Everything you need to manage engineering projects from start to finish',
        features: ['Real-time tracking', 'Milestone payments', 'Document management', 'Team collaboration'],
        cta: 'Start Your Project'
      },
      contact: {
        title: 'Get In Touch',
        subtitle: 'Ready to start your engineering project? Let\'s talk.',
        form: {
          email: 'Email',
          submit: 'Send Message'
        },
        info: {
          email: 'hello@nbcon.app',
          phone: '+966 56 620 2179',
          address: 'Riyadh, Saudi Arabia'
        }
      },
      footer: {
        product: {
          title: 'Product',
          links: ['Features', 'Pricing', 'Security', 'Updates']
        },
        clients: {
          title: 'For Clients',
          links: ['Find Engineers', 'Post Projects', 'Enterprise', 'Support']
        },
        engineers: {
          title: 'For Engineers',
          links: ['Browse Jobs', 'Profile Setup', 'Verification', 'Resources']
        },
        copyright: '© 2024 nbocn. All rights reserved.'
      }
    },
    ar: {
      nav: {
        home: 'الرئيسية',
        features: 'المميزات',
        pricing: 'الأسعار',
        about: 'حول',
        contact: 'اتصل',
        getStarted: 'ابدأ الآن',
        signIn: 'تسجيل الدخول'
      },
      hero: {
        title: 'استأجر مهندسين معتمدين من الهيئة في دقائق.',
        subtitle: 'nbcon هو السوق الهندسي في المملكة العربية السعودية—مطابقة ذكية، ضمان المراحل، الفواتير الإلكترونية، وسير عمل ثنائي اللغة لكل مرحلة من مراحل المشروع.',
        browse: 'تصفح المهندسين',
        features: ['اعتماد الهيئة', 'تسجيل الوصول الجغرافي', 'عربي/إنجليزي', 'متوافق مع حماية البيانات'],
        microcopy: 'لا حاجة لبطاقة ائتمان. إلغاء في أي وقت.'
      },
      trust: {
        title: 'موثوق به من قبل الشركات الرائدة',
        subtitle: 'انضم إلى آلاف العملاء الراضين الذين يثقون في nbocn لاحتياجاتهم الهندسية'
      },
      dashboard: {
        title: 'إدارة المشاريع الكاملة',
        subtitle: 'كل ما تحتاجه لإدارة المشاريع الهندسية من البداية إلى النهاية',
        features: ['تتبع فوري', 'مدفوعات المراحل', 'إدارة المستندات', 'تعاون الفريق'],
        cta: 'ابدأ مشروعك'
      },
      contact: {
        title: 'تواصل معنا',
        subtitle: 'مستعد لبدء مشروعك الهندسي؟ دعنا نتحدث.',
        form: {
          email: 'البريد الإلكتروني',
          submit: 'إرسال الرسالة'
        },
        info: {
          email: 'hello@nbcon.app',
          phone: '+966 56 620 2179',
          address: 'الرياض، المملكة العربية السعودية'
        }
      },
      footer: {
        product: {
          title: 'المنتج',
          links: ['المميزات', 'الأسعار', 'الأمان', 'التحديثات']
        },
        clients: {
          title: 'للعملاء',
          links: ['البحث عن مهندسين', 'نشر مشاريع', 'المؤسسات', 'الدعم']
        },
        engineers: {
          title: 'للمهندسين',
          links: ['تصفح الوظائف', 'إعداد الملف', 'التحقق', 'الموارد']
        },
        copyright: '© 2024 nbocn. جميع الحقوق محفوظة.'
      }
    }
  };

  const t = content[language];

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : ''}`}>
                  
                  {/* Main Content */}
      <main>
        <HeroSection />
        <TrustStrip title={t.trust.title} />
        <AIChatAssistant />
        <DashboardShowcase 
          title={t.dashboard.title}
          subtitle={t.dashboard.subtitle}
          features={t.dashboard.features}
          cta={t.dashboard.cta}
        />
        <FeaturesSectionWithBentoGrid />
        <Testimonials />
        <PricingSection />
        <FAQSection />
        <ContactSection 
          language={language}
          contactData={t.contact}
        />
      </main>

      {/* Footer */}
      <Footer 
        footerData={t.footer}
      />
    </div>
  );
};

export default HomePage;