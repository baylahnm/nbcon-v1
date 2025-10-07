import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../1-HomePage/others/components/ui/card';
import { Button } from '../1-HomePage/others/components/ui/button';
import { Input } from '../1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../1-HomePage/others/components/ui/tabs';
import { Badge } from '../1-HomePage/others/components/ui/badge';
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
  CheckCircle2
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
    content: 'Detailed guide on setting up your engineer profile...',
    helpful: 45,
    tags: ['profile', 'setup', 'verification'],
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    title: 'Understanding Project Payments',
    category: 'Payments',
    excerpt: 'Everything you need to know about how payments work on the platform.',
    content: 'Payment process explanation...',
    helpful: 38,
    tags: ['payments', 'earnings', 'withdrawal'],
    lastUpdated: '2024-01-10'
  },
  {
    id: '3',
    title: 'Getting Your SCE License Verified',
    category: 'Verification',
    excerpt: 'Step-by-step guide to verify your Saudi Council of Engineers license.',
    content: 'SCE verification process...',
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
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            Help & Support
          </h1>
          <p className="text-muted-foreground">Find answers and get support for your engineering work</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Live Chat
          </Button>
          <Button size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold text-sm mb-1">Live Chat</h3>
            <p className="text-xs text-muted-foreground">Get instant help</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Phone className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold text-sm mb-1">Phone Support</h3>
            <p className="text-xs text-muted-foreground">Call us directly</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Mail className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold text-sm mb-1">Email Support</h3>
            <p className="text-xs text-muted-foreground">Send us a message</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Video className="h-8 w-8 mx-auto mb-2 text-red-600" />
            <h3 className="font-semibold text-sm mb-1">Video Tutorials</h3>
            <p className="text-xs text-muted-foreground">Watch guides</p>
          </CardContent>
        </Card>
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
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            {helpCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="articles">Help Articles</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
        </TabsList>

        {/* Help Articles Tab */}
        <TabsContent value="articles" className="space-y-4">
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
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
            ))}
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4">
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <Card key={faq.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{faq.category}</Badge>
                        </div>
                        <h3 className="font-semibold mb-2">{faq.question}</h3>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost">
                        <Star className="h-3 w-3 mr-1" />
                        Helpful ({faq.helpful})
                      </Button>
                      <Button size="sm" variant="ghost">
                        Not Helpful
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contact Support Tab */}
        <TabsContent value="contact" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Get in Touch</CardTitle>
                <CardDescription>Choose your preferred way to contact us</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted cursor-pointer">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold">Live Chat</h3>
                    <p className="text-sm text-muted-foreground">Get instant help from our support team</p>
                    <p className="text-xs text-green-600">Available now</p>
                  </div>
                  <Button size="sm">Start Chat</Button>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted cursor-pointer">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold">Phone Support</h3>
                    <p className="text-sm text-muted-foreground">Call us for immediate assistance</p>
                    <p className="text-xs text-muted-foreground">+966 11 123 4567</p>
                  </div>
                  <Button size="sm" variant="outline">Call Now</Button>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted cursor-pointer">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold">Email Support</h3>
                    <p className="text-sm text-muted-foreground">Send us a detailed message</p>
                    <p className="text-xs text-muted-foreground">support@nbcon.com</p>
                  </div>
                  <Button size="sm" variant="outline">Send Email</Button>
                </div>
              </CardContent>
            </Card>

            {/* Support Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Send us a Message</CardTitle>
                <CardDescription>Describe your issue and we'll get back to you</CardDescription>
              </CardHeader>
              <CardContent>
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Support Hours</CardTitle>
              <CardDescription>When you can reach our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold mb-1">Live Chat</h3>
                  <p className="text-sm text-muted-foreground">24/7 Available</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Phone className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-semibold mb-1">Phone Support</h3>
                  <p className="text-sm text-muted-foreground">Sun-Thu: 9AM-6PM</p>
                  <p className="text-xs text-muted-foreground">Fri-Sat: 10AM-4PM</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Mail className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-semibold mb-1">Email Support</h3>
                  <p className="text-sm text-muted-foreground">Response within 24h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
