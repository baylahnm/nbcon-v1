import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/1-HomePage/others/components/ui/tabs';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  Phone, 
  Mail, 
  FileText, 
  Video, 
  BookOpen,
  ChevronRight,
  ExternalLink,
  Star,
  Clock,
  Users,
  Zap,
  Shield,
  CheckCircle2,
  Briefcase,
  DollarSign,
  Calendar
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
    title: 'How to Post Your First Project',
    category: 'Getting Started',
    excerpt: 'Learn how to create and post your first engineering project on the platform.',
    content: 'Detailed guide on posting your first project...',
    helpful: 67,
    tags: ['project', 'posting', 'getting-started'],
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    title: 'Understanding Project Payments',
    category: 'Payments',
    excerpt: 'Everything you need to know about project payments and invoicing.',
    content: 'Payment process explanation...',
    helpful: 45,
    tags: ['payments', 'billing', 'invoices'],
    lastUpdated: '2024-01-10'
  },
  {
    id: '3',
    title: 'Finding the Right Engineer',
    category: 'Hiring',
    excerpt: 'Tips and tricks for finding the perfect engineer for your project.',
    content: 'Engineer selection guide...',
    helpful: 52,
    tags: ['hiring', 'engineers', 'selection'],
    lastUpdated: '2024-01-12'
  },
  {
    id: '4',
    title: 'Managing Project Timelines',
    category: 'Project Management',
    excerpt: 'Learn how to effectively manage project timelines and milestones.',
    content: 'Timeline management tips...',
    helpful: 38,
    tags: ['timeline', 'management', 'milestones'],
    lastUpdated: '2024-01-08'
  }
];

const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'How do I post a new project?',
    answer: 'To post a new project, go to the "Post Job" section, fill in the project details, requirements, and budget. Then review and publish your project.',
    category: 'Getting Started',
    helpful: 89
  },
  {
    id: '2',
    question: 'What are the platform fees?',
    answer: 'The platform charges a 5% service fee on completed projects. This fee is automatically deducted from your payment.',
    category: 'Payments',
    helpful: 67
  },
  {
    id: '3',
    question: 'How do I communicate with engineers?',
    answer: 'You can communicate with engineers through the built-in messaging system, video calls, or direct contact information once connected.',
    category: 'Communication',
    helpful: 54
  },
  {
    id: '4',
    question: 'Can I modify my project after posting?',
    answer: 'Yes, you can edit your project details, requirements, and budget at any time before selecting an engineer.',
    category: 'Project Management',
    helpful: 43
  },
  {
    id: '5',
    question: 'How long does it take to find an engineer?',
    answer: 'Typically, you\'ll receive proposals within 24-48 hours. The exact time depends on your project requirements and the availability of suitable engineers.',
    category: 'Hiring',
    helpful: 71
  }
];

const helpCategories = [
  'All',
  'Getting Started',
  'Project Management',
  'Payments',
  'Hiring',
  'Communication',
  'Technical Support'
];

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState('articles');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Refs for animated gradient cards
  const quickAction1Ref = useRef<HTMLDivElement>(null);
  const quickAction2Ref = useRef<HTMLDivElement>(null);
  const quickAction3Ref = useRef<HTMLDivElement>(null);
  const quickAction4Ref = useRef<HTMLDivElement>(null);

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
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border/40">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="bg-primary h-10 w-10 flex items-center justify-center rounded-xl shadow-md flex-shrink-0">
              <HelpCircle className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[18px] font-bold tracking-tight">Help & Support</h1>
              <p className="text-[14px] text-muted-foreground mt-0.5">Find answers and get support for your projects</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-8 text-xs">
              <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
              Live Chat
            </Button>
            <Button className="h-8 text-xs">
              <Phone className="h-3.5 w-3.5 mr-1.5" />
              Contact Support
            </Button>
          </div>
        </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          ref={quickAction1Ref}
          className="relative overflow-hidden transition-all duration-300 cursor-pointer"
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
              <div className="bg-primary/10 h-12 w-12 mx-auto mb-3 flex items-center justify-center rounded-xl ring-1 ring-primary/20">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-base mb-1">Live Chat</h3>
              <p className="text-xs text-muted-foreground">Get instant help</p>
            </CardContent>
          </Card>
        </div>

        <div
          ref={quickAction2Ref}
          className="relative overflow-hidden transition-all duration-300 cursor-pointer"
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
              <div className="bg-green-500/10 h-12 w-12 mx-auto mb-3 flex items-center justify-center rounded-xl ring-1 ring-green-500/20">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-base mb-1">Phone Support</h3>
              <p className="text-xs text-muted-foreground">Call us directly</p>
            </CardContent>
          </Card>
        </div>

        <div
          ref={quickAction3Ref}
          className="relative overflow-hidden transition-all duration-300 cursor-pointer"
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
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-base mb-1">Email Support</h3>
              <p className="text-xs text-muted-foreground">Send us a message</p>
            </CardContent>
          </Card>
        </div>

        <div
          ref={quickAction4Ref}
          className="relative overflow-hidden transition-all duration-300 cursor-pointer"
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
                <Video className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-bold text-base mb-1">Video Tutorials</h3>
              <p className="text-xs text-muted-foreground">Watch guides</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help articles, FAQs, and guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 px-3 py-2 border border-input bg-background rounded-md text-xs"
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
          <TabsTrigger value="articles" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">Help Articles</TabsTrigger>
          <TabsTrigger value="faq" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">FAQ</TabsTrigger>
          <TabsTrigger value="contact" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">Contact Support</TabsTrigger>
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
                <Card key={article.id} className="border-border/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <CardContent className="p-4 bg-background">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">{article.category}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Updated {article.lastUpdated}
                        </span>
                      </div>
                      <h3 className="font-bold text-base mb-2">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{article.excerpt}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{article.helpful} found helpful</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button className="h-8 text-xs">
                        Read Article
                        <ChevronRight className="h-3.5 w-3.5 ml-1.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="border-border/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <CardContent className="p-4 bg-background">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">{faq.category}</Badge>
                        </div>
                        <h3 className="font-bold text-base mb-2">{faq.question}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" className="h-7 text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Helpful ({faq.helpful})
                      </Button>
                      <Button variant="ghost" className="h-7 text-xs">
                        Not Helpful
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold tracking-tight">Get in Touch</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Choose your preferred way to contact us</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4 bg-background rounded-b-xl">
                <div className="flex items-center gap-3 p-3 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="bg-primary/10 h-12 w-12 flex items-center justify-center rounded-xl ring-1 ring-primary/20 flex-shrink-0">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm">Live Chat</h3>
                    <p className="text-xs text-muted-foreground">Get instant help from our support team</p>
                    <p className="text-xs text-green-600 font-medium">Available now</p>
                  </div>
                  <Button className="h-7 text-xs">Start Chat</Button>
                </div>

                <div className="flex items-center gap-3 p-3 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="bg-green-500/10 h-12 w-12 flex items-center justify-center rounded-xl ring-1 ring-green-500/20 flex-shrink-0">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm">Phone Support</h3>
                    <p className="text-xs text-muted-foreground">Call us for immediate assistance</p>
                    <p className="text-xs text-muted-foreground">+966 11 123 4567</p>
                  </div>
                  <Button variant="outline" className="h-7 text-xs">Call Now</Button>
                </div>

                <div className="flex items-center gap-3 p-3 border border-border/50 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="bg-purple-500/10 h-12 w-12 flex items-center justify-center rounded-xl ring-1 ring-purple-500/20 flex-shrink-0">
                    <Mail className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm">Email Support</h3>
                    <p className="text-xs text-muted-foreground">Send us a detailed message</p>
                    <p className="text-xs text-muted-foreground">support@nbcon.com</p>
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
                    <Mail className="h-6 w-6 text-white" />
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
                    <label className="text-xs font-medium mb-2 block">Subject</label>
                    <input
                      type="text"
                      placeholder="Brief description of your issue"
                      className="w-full h-8 px-3 py-2 border border-input bg-background rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-2 block">Category</label>
                    <select className="w-full h-8 px-3 py-2 border border-input bg-background rounded-md text-sm">
                      <option>General Inquiry</option>
                      <option>Project Issue</option>
                      <option>Payment Problem</option>
                      <option>Account Issue</option>
                      <option>Feature Request</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-2 block">Priority</label>
                    <select className="w-full h-8 px-3 py-2 border border-input bg-background rounded-md text-sm">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-2 block">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Describe your issue in detail..."
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm resize-none"
                    />
                  </div>
                  <Button className="w-full h-8 text-xs">Send Message</Button>
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
            <CardContent className="p-4 bg-background rounded-b-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border border-border/50 rounded-lg">
                  <div className="bg-primary/10 h-12 w-12 mx-auto mb-3 flex items-center justify-center rounded-xl ring-1 ring-primary/20">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-base mb-1">Live Chat</h3>
                  <p className="text-xs text-muted-foreground">24/7 Available</p>
                </div>
                <div className="text-center p-4 border border-border/50 rounded-lg">
                  <div className="bg-green-500/10 h-12 w-12 mx-auto mb-3 flex items-center justify-center rounded-xl ring-1 ring-green-500/20">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-base mb-1">Phone Support</h3>
                  <p className="text-xs text-muted-foreground">Sun-Thu: 9AM-6PM</p>
                  <p className="text-xs text-muted-foreground">Fri-Sat: 10AM-4PM</p>
                </div>
                <div className="text-center p-4 border border-border/50 rounded-lg">
                  <div className="bg-purple-500/10 h-12 w-12 mx-auto mb-3 flex items-center justify-center rounded-xl ring-1 ring-purple-500/20">
                    <Mail className="h-6 w-6 text-purple-600" />
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
    </div>
  );
}

