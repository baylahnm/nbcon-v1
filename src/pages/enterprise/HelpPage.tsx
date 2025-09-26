import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  HelpCircle,
  Search,
  Phone,
  MessageSquare,
  Mail,
  Clock,
  Star,
  ChevronRight,
  BookOpen,
  FileText,
  Users,
  Video,
  Download,
  AlertTriangle,
  CheckCircle,
  X,
  Send,
  Paperclip,
  MessageCircle,
  Headphones,
  Shield,
  Settings,
  CreditCard,
  Globe,
  Zap,
  Target,
  Building,
  UserCheck,
  MapPin,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface KnowledgeArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  readTime: string;
  views: number;
  helpful: number;
  lastUpdated: string;
  tags: string[];
  language: 'en' | 'ar';
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  views: number;
}

interface SupportTicket {
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  email: string;
  attachments: File[];
}

export function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: 'مرحباً! أنا مساعد دعم شركة نيوم الهندسية. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date().toLocaleTimeString(),
      avatar: undefined,
      name: 'Support Assistant'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [supportTicket, setSupportTicket] = useState<SupportTicket>({
    subject: '',
    category: '',
    priority: 'medium',
    description: '',
    email: '',
    attachments: []
  });

  // Knowledge base articles with Saudi engineering context
  const knowledgeArticles: KnowledgeArticle[] = [
    {
      id: '1',
      title: 'Getting Started with NEOM Engineering Platform',
      description: 'Complete guide to setting up your engineering profile and accessing project management tools.',
      category: 'Getting Started',
      content: 'Step-by-step instructions for new team members...',
      readTime: '5 min',
      views: 1247,
      helpful: 89,
      lastUpdated: '2024-09-20',
      tags: ['onboarding', 'setup', 'profile'],
      language: 'en'
    },
    {
      id: '2',
      title: 'Project Budget Management and SAR Tracking',
      description: 'Learn how to manage project budgets, track expenses, and generate financial reports in Saudi Riyal.',
      category: 'Finance',
      content: 'Budget management best practices...',
      readTime: '8 min',
      views: 892,
      helpful: 76,
      lastUpdated: '2024-09-18',
      tags: ['budget', 'SAR', 'finance', 'tracking'],
      language: 'en'
    },
    {
      id: '3',
      title: 'Saudi Building Code Compliance Checklist',
      description: 'Essential checklist for ensuring your engineering projects comply with Saudi Building Code requirements.',
      category: 'Compliance',
      content: 'Compliance requirements and standards...',
      readTime: '12 min',
      views: 654,
      helpful: 92,
      lastUpdated: '2024-09-15',
      tags: ['compliance', 'building code', 'saudi', 'standards'],
      language: 'en'
    },
    {
      id: '4',
      title: 'Team Collaboration Tools and Video Conferencing',
      description: 'How to use built-in messaging, video calls, and document sharing for remote engineering teams.',
      category: 'Collaboration',
      content: 'Collaboration tools overview...',
      readTime: '6 min',
      views: 743,
      helpful: 68,
      lastUpdated: '2024-09-10',
      tags: ['collaboration', 'video', 'messaging', 'remote'],
      language: 'en'
    },
    {
      id: '5',
      title: 'دليل إدارة المشاريع الهندسية في المملكة العربية السعودية',
      description: 'دليل شامل لإدارة المشاريع الهندسية وفقاً للمعايير والأنظمة السعودية مع أفضل الممارسات.',
      category: 'Project Management',
      content: 'إرشادات إدارة المشاريع...',
      readTime: '15 min',
      views: 1156,
      helpful: 94,
      lastUpdated: '2024-09-12',
      tags: ['إدارة المشاريع', 'هندسة', 'السعودية', 'معايير'],
      language: 'ar'
    }
  ];

  // FAQ data with Saudi engineering context
  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I reset my password?',
      answer: 'You can reset your password by clicking on "Forgot Password" on the login page. You\'ll receive an email with reset instructions within a few minutes. Make sure to check your spam folder if you don\'t see the email.',
      category: 'Account',
      helpful: 156,
      views: 2340
    },
    {
      id: '2',
      question: 'What are the supported file formats for project documents?',
      answer: 'We support PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, DWG, DXF, and common image formats (JPG, PNG, GIF). Files must be under 50MB each. For CAD files, we recommend using the latest AutoCAD format.',
      category: 'Documents',
      helpful: 89,
      views: 1870
    },
    {
      id: '3',
      question: 'How is billing calculated for engineering services?',
      answer: 'Billing is calculated based on project milestones, hourly rates, or fixed project fees as agreed in your contract. All payments are processed in Saudi Riyal (SAR). You can view detailed billing information in the Finance section.',
      category: 'Billing',
      helpful: 134,
      views: 1650
    },
    {
      id: '4',
      question: 'Can I invite external consultants to collaborate on projects?',
      answer: 'Yes, you can invite external consultants as guest users. They will have limited access to specific project areas you designate. External users must accept terms of service and may require additional verification.',
      category: 'Collaboration',
      helpful: 78,
      views: 1420
    },
    {
      id: '5',
      question: 'What safety protocols are required for on-site work?',
      answer: 'All on-site work must follow Saudi OSHA guidelines and company safety standards. This includes proper PPE, site check-ins via GPS, safety briefings, and incident reporting. Refer to our Safety Compliance guide for detailed requirements.',
      category: 'Safety',
      helpful: 167,
      views: 2100
    },
    {
      id: '6',
      question: 'How do I generate compliance reports for Saudi authorities?',
      answer: 'Navigate to Reports > Compliance Reports in the main menu. You can generate reports for Ministry of Municipal and Rural Affairs, Saudi Building Code compliance, and environmental impact assessments. Reports are automatically formatted for Saudi regulatory requirements.',
      category: 'Compliance',
      helpful: 112,
      views: 980
    },
    {
      id: '7',
      question: 'Is the platform available in Arabic?',
      answer: 'Yes, the platform supports both English and Arabic languages. You can switch languages in your profile settings. Technical documentation and engineering standards are available in both languages to comply with Saudi regulations.',
      category: 'Language',
      helpful: 203,
      views: 1750
    },
    {
      id: '8',
      question: 'What are the system requirements for optimal performance?',
      answer: 'For best performance, we recommend: Chrome/Safari/Edge (latest versions), 4GB RAM minimum, stable internet connection (5+ Mbps), and WebGL support for 3D CAD viewing. Mobile apps are available for iOS and Android.',
      category: 'Technical',
      helpful: 67,
      views: 890
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: knowledgeArticles.length },
    { id: 'getting-started', name: 'Getting Started', count: 12 },
    { id: 'finance', name: 'Finance & Billing', count: 8 },
    { id: 'compliance', name: 'Compliance', count: 15 },
    { id: 'collaboration', name: 'Collaboration', count: 6 },
    { id: 'technical', name: 'Technical Support', count: 18 },
    { id: 'safety', name: 'Safety', count: 9 }
  ];

  const filteredArticles = knowledgeArticles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
      article.category.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: chatMessages.length + 1,
        type: 'user',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString(),
        avatar: undefined,
        name: 'You'
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: chatMessages.length + 2,
          type: 'bot',
          message: 'شكراً لتواصلك معنا. سأقوم بالبحث عن المعلومات المطلوبة وسأعود إليك قريباً. هل يمكنك تقديم المزيد من التفاصيل؟',
          timestamp: new Date().toLocaleTimeString(),
          avatar: undefined,
          name: 'Support Assistant'
        };
        setChatMessages(prev => [...prev, botResponse]);
      }, 1500);
    }
  };

  const handleSubmitTicket = () => {
    if (supportTicket.subject && supportTicket.description && supportTicket.email) {
      toast.success('Support ticket submitted successfully! We\'ll get back to you within 24 hours.');
      setSupportTicket({
        subject: '',
        category: '',
        priority: 'medium',
        description: '',
        email: '',
        attachments: []
      });
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const markHelpful = (type: 'article' | 'faq', id: string, helpful: boolean) => {
    toast.success(helpful ? 'Marked as helpful' : 'Feedback recorded');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold">Help & Support</h1>
              <p className="text-sm text-muted-foreground">
                Get help with your engineering platform and project management tools
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="gap-2">
            <Phone className="h-4 w-4" />
            Emergency: +966 11 234-5678
          </Button>
        </div>
      </div>

      {/* Knowledge Base Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Knowledge Base Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search help articles, guides, and documentation... (e.g., 'budget tracking', 'saudi compliance')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="gap-2"
              >
                {category.name}
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-medium">Search Results ({filteredArticles.length + filteredFAQs.length})</h4>
              
              {filteredArticles.map((article) => (
                <div key={`article-${article.id}`} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <h5 className="font-medium">{article.title}</h5>
                      {article.language === 'ar' && (
                        <Badge variant="outline" className="text-xs">عربي</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{article.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{article.readTime} read</span>
                      <span>{article.views} views</span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {article.helpful}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}

              {filteredFAQs.map((faq) => (
                <div key={`faq-${faq.id}`} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      <h5 className="font-medium">{faq.question}</h5>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>FAQ</span>
                      <span>{faq.views} views</span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {faq.helpful}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FAQ Accordion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-start justify-between w-full">
                      <span className="text-left">{faq.question}</span>
                      <Badge variant="outline" className="ml-2 text-xs shrink-0">
                        {faq.category}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-3">
                      <p className="text-muted-foreground">{faq.answer}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{faq.views} views</span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {faq.helpful} helpful
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-green-600"
                            onClick={() => markHelpful('faq', faq.id, true)}
                          >
                            <ThumbsUp className="h-3 w-3" />
                            Helpful
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1"
                            onClick={() => markHelpful('faq', faq.id, false)}
                          >
                            <ThumbsDown className="h-3 w-3" />
                            Not helpful
                          </Button>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.sa"
                  value={supportTicket.email}
                  onChange={(e) => setSupportTicket(prev => ({...prev, email: e.target.value}))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={supportTicket.category} 
                  onValueChange={(value) => setSupportTicket(prev => ({...prev, category: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="billing">Billing & Payments</SelectItem>
                    <SelectItem value="account">Account Access</SelectItem>
                    <SelectItem value="compliance">Compliance & Regulations</SelectItem>
                    <SelectItem value="projects">Project Management</SelectItem>
                    <SelectItem value="safety">Safety & Security</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your issue"
                  value={supportTicket.subject}
                  onChange={(e) => setSupportTicket(prev => ({...prev, subject: e.target.value}))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={supportTicket.priority} 
                  onValueChange={(value: any) => setSupportTicket(prev => ({...prev, priority: value}))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Please provide detailed information about your issue, including any error messages and steps to reproduce..."
                rows={4}
                value={supportTicket.description}
                onChange={(e) => setSupportTicket(prev => ({...prev, description: e.target.value}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" className="gap-2">
                <Paperclip className="h-4 w-4" />
                Attach Files
              </Button>
              <Button onClick={handleSubmitTicket} className="gap-2">
                <Send className="h-4 w-4" />
                Submit Ticket
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium">Other Ways to Get Help</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start gap-2" onClick={() => setChatOpen(true)}>
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  Live Chat Support
                </Button>
                
                <Button variant="outline" className="justify-start gap-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  Call Support
                </Button>
                
                <Button variant="outline" className="justify-start gap-2">
                  <Video className="h-4 w-4 text-purple-600" />
                  Video Tutorials
                </Button>
                
                <Button variant="outline" className="justify-start gap-2">
                  <Download className="h-4 w-4 text-orange-600" />
                  Documentation
                </Button>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Support Hours</span>
                </div>
                <p className="text-muted-foreground">
                  Sunday - Thursday: 8:00 AM - 6:00 PM (AST)<br />
                  Emergency Support: 24/7 for critical issues
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Articles */}
      {!searchQuery && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Popular Help Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {knowledgeArticles.slice(0, 4).map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                >
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium truncate">{article.title}</h4>
                      {article.language === 'ar' && (
                        <Badge variant="outline" className="text-xs">عربي</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <span>{article.readTime}</span>
                      <span>{article.views} views</span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {article.helpful}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Chat Widget */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Live Support Chat
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="h-80 border rounded-lg p-4 overflow-y-auto space-y-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex space-x-2",
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.type === 'bot' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">SA</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-xs rounded-lg p-3 text-sm",
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <p>{message.message}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                  {message.type === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Type your message... (Arabic/English supported)"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              Average response time: 2-5 minutes
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}