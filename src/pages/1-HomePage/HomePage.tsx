import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import { useNamespace } from './others/lib/i18n/useNamespace';
import { useAuthStore } from './others/stores/auth';
import { getUserDisplayName, getUserInitials } from './others/lib/userUtils';
import { Button } from './others/components/ui/button';
import { Card } from './others/components/ui/card';
import { Badge } from './others/components/ui/badge';
import { Separator } from './others/components/ui/separator';
import { ThemeToggle } from './others/components/ui/theme-toggle';
import { LanguageSwitcher } from './others/components/i18n/LanguageSwitcher';
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
  // i18n hooks - MUST be called first before any conditional returns
  const ready = useNamespace(['homepage', 'common']);
  const { t, i18n } = useTranslation(['homepage', 'common']);
  
  // All other hooks MUST be called in consistent order
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
    t('homepage:hero.typingTexts.hire'),
    t('homepage:hero.typingTexts.find'),
    t('homepage:hero.typingTexts.scale'),
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

  const isRTL = i18n.language === 'ar';

  // Early return AFTER all hooks are called (Rules of Hooks compliance)
  if (!ready) return null;

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : ''}`}>
                  
                  {/* Main Content */}
      <main>
        <HeroSection />
        <TrustStrip title={t('homepage:trust.title')} />
        <AIChatAssistant />
        <DashboardShowcase 
          title={t('homepage:dashboard.title')}
          subtitle={t('homepage:dashboard.subtitle')}
          features={[
            t('homepage:dashboard.features.realtime'),
            t('homepage:dashboard.features.milestone'),
            t('homepage:dashboard.features.documents'),
            t('homepage:dashboard.features.collaboration')
          ]}
          cta={t('homepage:dashboard.cta')}
        />
        <FeaturesSectionWithBentoGrid />
        <Testimonials />
        <PricingSection />
        <FAQSection />
        <ContactSection 
          language={i18n.language}
          contactData={{
            title: t('homepage:contact.title'),
            subtitle: t('homepage:contact.subtitle'),
            form: {
              email: t('homepage:contact.form.email'),
              submit: t('homepage:contact.form.submit')
            },
            info: {
              email: t('homepage:contact.info.email'),
              phone: t('homepage:contact.info.phone'),
              address: t('homepage:contact.info.address')
            }
          }}
        />
      </main>

      {/* Footer */}
      <Footer 
        footerData={{
          product: {
            title: t('homepage:footer.product.title'),
            links: [
              t('homepage:footer.product.features'),
              t('homepage:footer.product.pricing'),
              t('homepage:footer.product.security'),
              t('homepage:footer.product.updates')
            ]
          },
          clients: {
            title: t('homepage:footer.clients.title'),
            links: [
              t('homepage:footer.clients.findEngineers'),
              t('homepage:footer.clients.postProjects'),
              t('homepage:footer.clients.enterprise'),
              t('homepage:footer.clients.support')
            ]
          },
          engineers: {
            title: t('homepage:footer.engineers.title'),
            links: [
              t('homepage:footer.engineers.browseJobs'),
              t('homepage:footer.engineers.profileSetup'),
              t('homepage:footer.engineers.verification'),
              t('homepage:footer.engineers.resources')
            ]
          },
          copyright: t('homepage:footer.copyright')
        }}
      />
    </div>
  );
};

export default HomePage;