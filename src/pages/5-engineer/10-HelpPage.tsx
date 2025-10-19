import { useState, useRef, useEffect, useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../1-HomePage/others/components/ui/card';
import { Button } from '../1-HomePage/others/components/ui/button';
import { Input } from '../1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../1-HomePage/others/components/ui/tabs';
import { Badge } from '../1-HomePage/others/components/ui/badge';
import { useOutsideClick } from '../1-HomePage/others/hooks/use-outside-click';
import { 
  HelpCircle, 
  Search, 
  MessagesSquare, 
  PhoneCall, 
  Send, 
  FileText, 
  PlayCircle, 
  BookOpen,
  ChevronRight,
  ExternalLink,
  Star,
  Clock,
  Users,
  Zap,
  Shield,
  CheckCircle2,
  X,
  ThumbsUp,
  Share2
} from 'lucide-react';

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  helpful: number;
  tags: string[];
  lastUpdated: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

// Mock data
const mockArticles: HelpArticle[] = [
  {
    id: '1',
    title: 'How to Complete Your Engineer Profile',
    category: 'Profile Setup',
    excerpt: 'Learn how to set up your engineer profile to attract more clients and projects.',
    content: `# Complete Your Engineer Profile

Your professional profile is the first impression clients have of you. A complete, well-crafted profile significantly increases your chances of being hired.

## Step 1: Basic Information
Start with your basic professional details:
- Full name and professional title
- Current city and willing to travel radius
- Professional headshot (high-quality photo)
- Contact information (phone, email)

## Step 2: Professional Summary
Write a compelling summary (200-300 words) that highlights:
- Your engineering specialization
- Years of experience
- Notable projects or achievements
- What makes you unique as an engineer

## Step 3: Skills & Expertise
Add your technical skills with proficiency levels:
- Primary engineering software (AutoCAD, Revit, etc.)
- Specialized skills (structural analysis, HVAC design, etc.)
- Soft skills (project management, client communication)

## Step 4: Certifications
Upload and verify your professional credentials:
- SCE License (required for Saudi engineers)
- PMP, LEED, or other certifications
- University degrees and transcripts

## Step 5: Portfolio
Showcase your best work:
- Upload project photos and descriptions
- Include technical drawings or reports
- Highlight measurable results

## Pro Tips:
✓ Complete profiles get 3x more job invitations
✓ Update your availability status regularly
✓ Respond to inquiries within 24 hours
✓ Ask clients for reviews after successful projects`,
    helpful: 45,
    tags: ['profile', 'setup', 'verification'],
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    title: 'Understanding Project Payments',
    category: 'Payments',
    excerpt: 'Everything you need to know about how payments work on the platform.',
    content: `# Understanding Project Payments

Our secure payment system protects both engineers and clients through milestone-based escrow payments.

## How Payment Works

### 1. Project Agreement
When you're hired, the client deposits the project budget into escrow. This guarantees you'll be paid once milestones are completed.

### 2. Milestone Structure
Projects are divided into milestones:
- Each milestone has specific deliverables
- Payment is released per milestone
- Typical milestones: 30% design, 40% development, 30% final delivery

### 3. Milestone Completion
When you complete a milestone:
1. Upload your deliverables
2. Submit for client review
3. Client has 5 days to approve or request revisions
4. Payment automatically releases upon approval

### 4. Payment Processing
- Payments process within 3-5 business days
- Funds transfer to your registered bank account
- Platform fee (10%) is deducted automatically

## Payment Methods
- Bank transfer (recommended)
- Local Saudi banks
- International wire transfer (additional fees apply)

## Important Notes
⚠️ Never accept payment outside the platform
⚠️ All work must be documented in the platform
⚠️ Keep communication in-platform for protection

## Dispute Resolution
If there's a payment dispute:
1. Contact support within 7 days
2. Provide evidence of completed work
3. Our team mediates and reviews
4. Resolution typically within 10 business days`,
    helpful: 38,
    tags: ['payments', 'earnings', 'withdrawal'],
    lastUpdated: '2024-01-10'
  },
  {
    id: '3',
    title: 'Getting Your SCE License Verified',
    category: 'Verification',
    excerpt: 'Step-by-step guide to verify your Saudi Council of Engineers license.',
    content: `# Getting Your SCE License Verified

SCE (Saudi Council of Engineers) verification is required for all engineers practicing in Saudi Arabia.

## Why Verification Matters
✓ Builds trust with clients
✓ Required for government projects
✓ Increases your job applications by 5x
✓ Higher hourly rates (verified engineers earn 40% more)

## Required Documents
1. Valid SCE License Certificate
2. National ID or Iqama
3. Engineering degree certificates
4. Recent passport-size photo

## Verification Steps

### Step 1: Prepare Documents
- Scan your SCE license at 300 DPI or higher
- Ensure all text is clearly readable
- File format: PDF or JPG
- Maximum file size: 10 MB

### Step 2: Submit for Verification
1. Go to Settings → Verification
2. Upload your SCE license
3. Enter your license number
4. Add supporting documents
5. Click "Submit for Verification"

### Step 3: Review Process
Our team verifies licenses within:
- Standard: 2-3 business days
- Express (Premium): 24 hours

We check:
- License authenticity with SCE database
- Expiration date (must be valid)
- Name matches your profile
- Specialization matches your claimed expertise

### Step 4: Approval
Once approved:
- Green verified badge on your profile
- Access to premium job listings
- Higher search ranking
- Trust score increase

## Common Issues
❌ Blurry or low-quality scans
❌ Expired licenses
❌ Name mismatch
❌ Incomplete documentation

## Need Help?
Contact our verification team: verify@nbcon.org
Response time: 24 hours`,
    helpful: 52,
    tags: ['sce', 'verification', 'license'],
    lastUpdated: '2024-01-12'
  }
];

const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'How do I apply for projects?',
    answer: 'To apply for projects, browse the available jobs section, review project details, and click "Apply Now" to submit your proposal.',
    category: 'Projects',
    helpful: 67
  },
  {
    id: '2',
    question: 'What are the platform fees?',
    answer: 'The platform charges a 10% service fee on completed projects. This fee is automatically deducted from your earnings.',
    category: 'Payments',
    helpful: 43
  },
  {
    id: '3',
    question: 'How long does payment take?',
    answer: 'Payments are typically processed within 3-5 business days after project completion and client approval.',
    category: 'Payments',
    helpful: 55
  },
  {
    id: '4',
    question: 'Can I work on multiple projects?',
    answer: 'Yes, you can work on multiple projects simultaneously, as long as you can meet all project deadlines and quality requirements.',
    category: 'Projects',
    helpful: 41
  }
];

const helpCategories = [
  'All',
  'Profile Setup',
  'Projects',
  'Payments',
  'Verification',
  'Platform Usage',
  'Technical Support'
];

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState('articles');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedArticle, setExpandedArticle] = useState<HelpArticle | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [expandedQuickAction, setExpandedQuickAction] = useState<string | null>(null);

  // Refs for animated gradient cards
  const quickAction1Ref = useRef<HTMLDivElement>(null);
  const quickAction2Ref = useRef<HTMLDivElement>(null);
  const quickAction3Ref = useRef<HTMLDivElement>(null);
  const quickAction4Ref = useRef<HTMLDivElement>(null);
  const expandedRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // Handle expandable article interactions
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setExpandedArticle(null);
      }
    }

    if (expandedArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expandedArticle]);

  useOutsideClick(expandedRef, () => {
    setExpandedArticle(null);
  });

  // Add mouse tracking for animated gradient on quick action cards
  useEffect(() => {
    const cards = [quickAction1Ref, quickAction2Ref, quickAction3Ref, quickAction4Ref];
    
    const handlers = cards.map(ref => {
      const card = ref.current;
      if (!card) return null;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angle = Math.atan2(y - centerY, x - centerX);
        card.style.setProperty('--rotation', `${angle}rad`);
      };

      card.addEventListener('mousemove', handleMouseMove);
      return { card, handleMouseMove };
    });

    return () => {
      handlers.forEach(handler => {
        if (handler) {
          handler.card.removeEventListener('mousemove', handler.handleMouseMove);
        }
      });
    };
  }, []);

  const filteredArticles = mockArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border/40">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="bg-primary h-10 w-10 flex items-center justify-center rounded-xl shadow-md flex-shrink-0">
            <HelpCircle className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-[18px] font-bold tracking-tight">Help & Support</h1>
            <p className="text-[14px] text-muted-foreground">Find answers and get support for your engineering work</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-[36px] text-xs">
            <MessagesSquare className="h-4 w-4 mr-2" />
            Live Chat
          </Button>
          <Button size="sm" className="h-[36px] text-xs">
            <PhoneCall className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Live Chat */}
        <div
          ref={quickAction1Ref}
          className="relative overflow-hidden transition-all duration-300 cursor-pointer"
          onClick={() => setExpandedQuickAction(expandedQuickAction === 'chat' ? null : 'chat')}
          style={{
            '--rotation': '4.2rad',
            border: '2px solid transparent',
            borderRadius: '0.5rem',
            backgroundImage: `
              linear-gradient(hsl(var(--card)), hsl(var(--card))),
              linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
            `,
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          } as React.CSSProperties}
        >
          <Card className="bg-transparent border border-border/50">
            <CardContent className="p-4 text-center">
              <div className="bg-blue-500/10 h-12 w-12 mx-auto mb-3 flex items-center justify-center rounded-xl ring-1 ring-blue-500/20">
                <MessagesSquare className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-base mb-1">Live Chat</h3>
              <p className="text-xs text-muted-foreground">Get instant help</p>
              
              <AnimatePresence>
                {expandedQuickAction === 'chat' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-border/40 text-left space-y-2">
                      <p className="text-xs text-foreground/80">
                        <strong>Availability:</strong> 24/7
                      </p>
                      <p className="text-xs text-foreground/80">
                        <strong>Response:</strong> Instant
                      </p>
                      <p className="text-xs text-foreground/80">
                        Chat with our support team in real-time for immediate assistance.
                      </p>
                      <Button 
                        size="sm" 
                        className="w-full mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Open chat
                        }}
                      >
                        <MessagesSquare className="h-3 w-3 mr-1" />
                        Start Chat
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {expandedQuickAction !== 'chat' && (
                <p className="text-[10px] text-muted-foreground mt-2 italic">
                  Click for details
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Phone Support */}
        <div
          ref={quickAction2Ref}
          className="relative overflow-hidden transition-all duration-300 cursor-pointer"
          onClick={() => setExpandedQuickAction(expandedQuickAction === 'phone' ? null : 'phone')}
          style={{
            '--rotation': '4.2rad',
            border: '2px solid transparent',
            borderRadius: '0.5rem',
            backgroundImage: `
              linear-gradient(hsl(var(--card)), hsl(var(--card))),
              linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
            `,
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          } as React.CSSProperties}
        >
          <Card className="bg-transparent border border-border/50">
            <CardContent className="p-4 text-center">
              <div className="bg-success/10 h-12 w-12 mx-auto mb-3 flex items-center justify-center rounded-xl ring-1 ring-success/20">
                <PhoneCall className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-bold text-base mb-1">Phone Support</h3>
              <p className="text-xs text-muted-foreground">Call us directly</p>
              
              <AnimatePresence>
                {expandedQuickAction === 'phone' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-border/40 text-left space-y-2">
                      <p className="text-xs text-foreground/80">
                        <strong>Main:</strong> +966 11 234 5678
                      </p>
                      <p className="text-xs text-foreground/80">
                        <strong>Support:</strong> +966 50 123 4567
                      </p>
                      <p className="text-xs text-foreground/80">
                        <strong>Hours:</strong> Sun-Thu: 9AM-6PM
                      </p>
                      <p className="text-xs text-foreground/80">
                        Available during business hours for technical support and account assistance.
                      </p>
                      <Button 
                        size="sm" 
                        className="w-full mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = 'tel:+966112345678';
                        }}
                      >
                        <PhoneCall className="h-3 w-3 mr-1" />
                        Call Now
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {expandedQuickAction !== 'phone' && (
                <p className="text-[10px] text-muted-foreground mt-2 italic">
                  Click for details
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Email Support */}
        <div
          ref={quickAction3Ref}
          className="relative overflow-hidden transition-all duration-300 cursor-pointer"
          onClick={() => setExpandedQuickAction(expandedQuickAction === 'email' ? null : 'email')}
          style={{
            '--rotation': '4.2rad',
            border: '2px solid transparent',
            borderRadius: '0.5rem',
            backgroundImage: `
              linear-gradient(hsl(var(--card)), hsl(var(--card))),
              linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
            `,
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          } as React.CSSProperties}
        >
          <Card className="bg-transparent border border-border/50">
            <CardContent className="p-4 text-center">
              <div className="bg-purple-500/10 h-12 w-12 mx-auto mb-3 flex items-center justify-center rounded-xl ring-1 ring-purple-500/20">
                <Send className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-base mb-1">Email Support</h3>
              <p className="text-xs text-muted-foreground">Send us a message</p>
              
              <AnimatePresence>
                {expandedQuickAction === 'email' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-border/40 text-left space-y-2">
                      <p className="text-xs text-foreground/80">
                        <strong>General:</strong> support@nbcon.org
                      </p>
                      <p className="text-xs text-foreground/80">
                        <strong>Technical:</strong> tech@nbcon.org
                      </p>
                      <p className="text-xs text-foreground/80">
                        <strong>Response:</strong> Within 24 hours
                      </p>
                      <p className="text-xs text-foreground/80">
                        Email us for non-urgent inquiries. Include your account number for faster service.
                      </p>
                      <Button 
                        size="sm" 
                        className="w-full mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = 'mailto:support@nbcon.org';
                        }}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Send Email
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {expandedQuickAction !== 'email' && (
                <p className="text-[10px] text-muted-foreground mt-2 italic">
                  Click for details
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Video Tutorials */}
        <div
          ref={quickAction4Ref}
          className="relative overflow-hidden transition-all duration-300 cursor-pointer"
          onClick={() => setExpandedQuickAction(expandedQuickAction === 'video' ? null : 'video')}
          style={{
            '--rotation': '4.2rad',
            border: '2px solid transparent',
            borderRadius: '0.5rem',
            backgroundImage: `
              linear-gradient(hsl(var(--card)), hsl(var(--card))),
              linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
            `,
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          } as React.CSSProperties}
        >
          <Card className="bg-transparent border border-border/50">
            <CardContent className="p-4 text-center">
              <div className="bg-red-500/10 h-12 w-12 mx-auto mb-3 flex items-center justify-center rounded-xl ring-1 ring-red-500/20">
                <PlayCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-bold text-base mb-1">Video Tutorials</h3>
              <p className="text-xs text-muted-foreground">Watch guides</p>
              
              <AnimatePresence>
                {expandedQuickAction === 'video' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-border/40 text-left space-y-2">
                      <p className="text-xs text-foreground/80">
                        <strong>Library:</strong> 50+ tutorials
                      </p>
                      <p className="text-xs text-foreground/80">
                        <strong>Topics:</strong> Profile setup, bidding, payments
                      </p>
                      <p className="text-xs text-foreground/80">
                        <strong>Duration:</strong> 3-15 minutes each
                      </p>
                      <p className="text-xs text-foreground/80">
                        Step-by-step video guides covering all platform features.
                      </p>
                      <Button 
                        size="sm" 
                        className="w-full mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Navigate to tutorials
                        }}
                      >
                        <PlayCircle className="h-3 w-3 mr-1" />
                        Browse Videos
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {expandedQuickAction !== 'video' && (
                <p className="text-[10px] text-muted-foreground mt-2 italic">
                  Click for details
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help articles, FAQs, and guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground rounded-md text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          >
            {helpCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="relative z-10 flex w-full rounded-xl bg-card border border-border pt-1 pr-1 pb-1 pl-1 gap-1 shadow-lg shadow-inner shadow-top">
          <TabsTrigger value="articles" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground">Help Articles</TabsTrigger>
          <TabsTrigger value="faq" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground">FAQ</TabsTrigger>
          <TabsTrigger value="contact" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground">Contact Support</TabsTrigger>
        </TabsList>

        {/* Help Articles Tab */}
        <TabsContent value="articles" className="space-y-4">
          <Card 
            className="group hover:shadow-lg transition-all duration-300 border-border/50 gap-0"
            style={{
              border: '2px solid transparent',
              borderRadius: '0.75rem',
              backgroundImage: `
                linear-gradient(hsl(var(--card)), hsl(var(--card))),
                linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
              `,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-t from-primary to-primary-dark h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-sm shadow-primary/50">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold tracking-tight">Help Articles</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Browse our knowledge base</p>
                  </div>
                </div>
                <Badge className="h-5 min-w-5 rounded-full px-2 font-mono tabular-nums text-xs">
                  {filteredArticles.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4 bg-background rounded-b-xl">
              {filteredArticles.map((article) => (
                <motion.div
                  key={article.id}
                  layoutId={`article-${article.id}-${id}`}
                  onClick={() => setExpandedArticle(article)}
                  className="cursor-pointer"
                >
                  <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{article.category}</Badge>
                            <span className="text-xs text-muted-foreground">
                              Updated {article.lastUpdated}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                          <p className="text-muted-foreground mb-3">{article.excerpt}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {article.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{article.helpful} found helpful</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-2 italic">
                            Click to read full article
                          </p>
                        </div>
                        <div className="ml-4">
                          <Button size="sm">
                            Read Article
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4">
          <Card 
            className="group hover:shadow-lg transition-all duration-300 border-border/50 gap-0"
            style={{
              border: '2px solid transparent',
              borderRadius: '0.75rem',
              backgroundImage: `
                linear-gradient(hsl(var(--card)), hsl(var(--card))),
                linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
              `,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-t from-primary to-primary-dark h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-sm shadow-primary/50">
                    <HelpCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold tracking-tight">Frequently Asked Questions</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Quick answers to common questions</p>
                  </div>
                </div>
                <Badge className="h-5 min-w-5 rounded-full px-2 font-mono tabular-nums text-xs">
                  {filteredFAQs.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4 bg-background rounded-b-xl">
              <p className="text-xs text-muted-foreground mb-2 italic">
                Click any question to expand the answer
              </p>
              {filteredFAQs.map((faq) => {
                const isExpanded = expandedFAQ === faq.id;
                return (
                  <Card 
                    key={faq.id} 
                    className="hover:shadow-md hover:-translate-y-0.5 transition-all border-border/50 cursor-pointer overflow-hidden"
                    onClick={() => setExpandedFAQ(isExpanded ? null : faq.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">{faq.category}</Badge>
                            </div>
                            <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                              {faq.question}
                              <ChevronRight 
                                className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${
                                  isExpanded ? 'rotate-90' : ''
                                }`}
                              />
                            </h3>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-3 border-t border-border/40 space-y-3">
                                <p className="text-sm text-foreground/80 leading-relaxed">
                                  {faq.answer}
                                </p>

                                <div className="flex items-center gap-2 pt-2">
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Handle helpful action
                                    }}
                                  >
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    Helpful ({faq.helpful})
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Handle not helpful action
                                    }}
                                  >
                                    Not Helpful
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {!isExpanded && (
                          <p className="text-[10px] text-muted-foreground italic">
                            Click to see answer
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Support Tab */}
        <TabsContent value="contact" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Contact Methods */}
            <Card 
              className="group hover:shadow-lg transition-all duration-300 border-border/50 gap-0"
              style={{
                border: '2px solid transparent',
                borderRadius: '0.75rem',
                backgroundImage: `
                  linear-gradient(hsl(var(--card)), hsl(var(--card))),
                  linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
                `,
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
            >
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-t from-primary to-primary-dark h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-sm shadow-primary/50">
                    <MessagesSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold tracking-tight">Get in Touch</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Choose your preferred way to contact us</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4 bg-background rounded-b-xl">
                <div className="flex items-center gap-3 p-3 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="bg-blue-500/10 h-10 w-10 flex items-center justify-center rounded-lg ring-1 ring-blue-500/20 flex-shrink-0">
                    <MessagesSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm">Live Chat</h3>
                    <p className="text-xs text-muted-foreground">Get instant help from our support team</p>
                    <p className="text-xs text-success font-medium">Available now</p>
                  </div>
                  <Button className="h-7 text-xs">Start Chat</Button>
                </div>

                <div className="flex items-center gap-3 p-3 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="bg-success/10 h-10 w-10 flex items-center justify-center rounded-lg ring-1 ring-success/20 flex-shrink-0">
                    <PhoneCall className="h-5 w-5 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm">Phone Support</h3>
                    <p className="text-xs text-muted-foreground">Call us for immediate assistance</p>
                    <p className="text-xs text-muted-foreground">+966 11 123 4567</p>
                  </div>
                  <Button variant="outline" className="h-7 text-xs">Call Now</Button>
                </div>

                <div className="flex items-center gap-3 p-3 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="bg-purple-500/10 h-10 w-10 flex items-center justify-center rounded-lg ring-1 ring-purple-500/20 flex-shrink-0">
                    <Send className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm">Email Support</h3>
                    <p className="text-xs text-muted-foreground">Send us a detailed message</p>
                    <p className="text-xs text-muted-foreground">support@nbcon.app</p>
                  </div>
                  <Button variant="outline" className="h-7 text-xs">Send Email</Button>
                </div>
              </CardContent>
            </Card>

            {/* Support Form */}
            <Card 
              className="group hover:shadow-lg transition-all duration-300 border-border/50 gap-0"
              style={{
                border: '2px solid transparent',
                borderRadius: '0.75rem',
                backgroundImage: `
                  linear-gradient(hsl(var(--card)), hsl(var(--card))),
                  linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
                `,
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
            >
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-t from-primary to-primary-dark h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-sm shadow-primary/50">
                    <Send className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold tracking-tight">Send us a Message</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Describe your issue and we'll get back to you</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 bg-background rounded-b-xl">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <input
                      type="text"
                      placeholder="Brief description of your issue"
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <select className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm">
                      <option>General Inquiry</option>
                      <option>Technical Issue</option>
                      <option>Payment Problem</option>
                      <option>Account Issue</option>
                      <option>Feature Request</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Priority</label>
                    <select className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Describe your issue in detail..."
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm resize-none"
                    />
                  </div>
                  <Button className="w-full">Send Message</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Hours */}
          <Card 
            className="group hover:shadow-lg transition-all duration-300 border-border/50 gap-0"
            style={{
              border: '2px solid transparent',
              borderRadius: '0.75rem',
              backgroundImage: `
                linear-gradient(hsl(var(--card)), hsl(var(--card))),
                linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
              `,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
            >
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-t from-primary to-primary-dark h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-sm shadow-primary/50">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold tracking-tight">Support Hours</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">When you can reach our support team</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 bg-background rounded-b-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border border-border/50 rounded-lg">
                  <div className="bg-blue-500/10 h-12 w-12 mx-auto mb-3 flex items-center justify-center rounded-xl ring-1 ring-blue-500/20">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-base mb-1">Live Chat</h3>
                  <p className="text-xs text-muted-foreground">24/7 Available</p>
                </div>
                <div className="text-center p-4 border border-border/50 rounded-lg">
                  <div className="bg-success/10 h-12 w-12 mx-auto mb-3 flex items-center justify-center rounded-xl ring-1 ring-success/20">
                    <PhoneCall className="h-6 w-6 text-success" />
                  </div>
                  <h3 className="font-bold text-base mb-1">Phone Support</h3>
                  <p className="text-xs text-muted-foreground">Sun-Thu: 9AM-6PM</p>
                  <p className="text-xs text-muted-foreground">Fri-Sat: 10AM-4PM</p>
                </div>
                <div className="text-center p-4 border border-border/50 rounded-lg">
                  <div className="bg-purple-500/10 h-12 w-12 mx-auto mb-3 flex items-center justify-center rounded-xl ring-1 ring-purple-500/20">
                    <Send className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-base mb-1">Email Support</h3>
                  <p className="text-xs text-muted-foreground">Response within 24h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>

      {/* Expanded Article Modal */}
      <AnimatePresence>
        {expandedArticle && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 md:p-8">
              <motion.div
                ref={expandedRef}
                layoutId={`article-${expandedArticle.id}-${id}`}
                className="w-full max-w-4xl bg-card rounded-xl shadow-2xl my-8"
              >
                {/* Modal Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-primary via-primary-dark to-primary backdrop-blur-md px-6 py-4 rounded-t-xl border-b border-primary/20 shadow-sm shadow-primary/50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-xs">
                          {expandedArticle.category}
                        </Badge>
                        <span className="text-xs text-primary-foreground/80">
                          Updated {expandedArticle.lastUpdated}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-primary-foreground mb-1">
                        {expandedArticle.title}
                      </h2>
                      <p className="text-sm text-primary-foreground/90">
                        {expandedArticle.excerpt}
                      </p>
                    </div>
                    <button
                      onClick={() => setExpandedArticle(null)}
                      className="p-2 hover:bg-primary-foreground/20 rounded-lg transition-colors flex-shrink-0"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5 text-primary-foreground" />
                    </button>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {expandedArticle.tags.map((tag) => (
                      <Badge key={tag} className="bg-primary-foreground/15 text-primary-foreground border-0 text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6 bg-background/60 rounded-b-xl max-h-[70vh] overflow-y-auto">
                  {/* Article Content */}
                  <div className="prose prose-sm max-w-none">
                    <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {expandedArticle.content.split('\n').map((line, idx) => {
                        // Heading level 1
                        if (line.startsWith('# ')) {
                          return (
                            <h1 key={idx} className="text-2xl font-bold mt-6 mb-4 text-foreground">
                              {line.replace('# ', '')}
                            </h1>
                          );
                        }
                        // Heading level 2
                        if (line.startsWith('## ')) {
                          return (
                            <h2 key={idx} className="text-xl font-bold mt-5 mb-3 text-foreground">
                              {line.replace('## ', '')}
                            </h2>
                          );
                        }
                        // Heading level 3
                        if (line.startsWith('### ')) {
                          return (
                            <h3 key={idx} className="text-lg font-semibold mt-4 mb-2 text-foreground">
                              {line.replace('### ', '')}
                            </h3>
                          );
                        }
                        // Bullet points
                        if (line.startsWith('- ')) {
                          return (
                            <li key={idx} className="ml-6 mb-1 text-foreground/80">
                              {line.replace('- ', '')}
                            </li>
                          );
                        }
                        // Numbered lists
                        if (/^\d+\.\s/.test(line)) {
                          return (
                            <li key={idx} className="ml-6 mb-1 text-foreground/80 list-decimal">
                              {line.replace(/^\d+\.\s/, '')}
                            </li>
                          );
                        }
                        // Check marks and warnings
                        if (line.startsWith('✓')) {
                          return (
                            <p key={idx} className="flex items-center gap-2 mb-2 text-success">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>{line.replace('✓', '')}</span>
                            </p>
                          );
                        }
                        if (line.startsWith('⚠️')) {
                          return (
                            <p key={idx} className="flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-400">
                              <Shield className="h-4 w-4" />
                              <span>{line.replace('⚠️', '')}</span>
                            </p>
                          );
                        }
                        if (line.startsWith('❌')) {
                          return (
                            <p key={idx} className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400">
                              <X className="h-4 w-4" />
                              <span>{line.replace('❌', '')}</span>
                            </p>
                          );
                        }
                        // Empty lines
                        if (line.trim() === '') {
                          return <div key={idx} className="h-2" />;
                        }
                        // Normal paragraphs
                        return (
                          <p key={idx} className="mb-2 text-foreground/80">
                            {line}
                          </p>
                        );
                      })}
                    </div>
                  </div>

                  {/* Helpful Section */}
                  <div className="border-t border-border/40 pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-foreground">
                            {expandedArticle.helpful} people found this helpful
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Helpful
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Related Articles */}
                  <div className="border-t border-border/40 pt-6">
                    <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Related Articles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {mockArticles
                        .filter((a) => a.id !== expandedArticle.id)
                        .slice(0, 2)
                        .map((article) => (
                          <div
                            key={article.id}
                            onClick={() => setExpandedArticle(article)}
                            className="p-3 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          >
                            <Badge variant="outline" className="text-[10px] mb-2">
                              {article.category}
                            </Badge>
                            <h4 className="font-semibold text-sm mb-1">{article.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {article.excerpt}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
