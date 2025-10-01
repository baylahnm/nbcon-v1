import { useState } from "react";
import { 
  HelpCircle,
  Search,
  Book,
  MessageCircle,
  Phone,
  Mail,
  Video,
  Download,
  ExternalLink,
  ChevronRight,
  User,
  CreditCard,
  Shield,
  Settings,
  MapPin,
  Building,
  FileText,
  Clock,
  Star,
  CheckCircle,
  AlertTriangle,
  Info,
  Globe,
  Headphones,
  Calendar,
  Zap,
  Award,
  Users,
  Camera,
  Upload,
  Eye,
  Lock,
  Smartphone,
  Wifi,
  PlayCircle,
  BookOpen,
  LifeBuoy,
  MessageSquare,
  Flag,
  AlertCircle,
  PhoneCall,
  Mail as MailIcon,
  MessageSquare as ChatIcon,
  Send,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  description: string;
  readTime: string;
  popularity: number;
  lastUpdated: string;
  tags: string[];
  content?: string;
  isArabic?: boolean;
}

interface SupportContact {
  type: "phone" | "email" | "chat" | "whatsapp" | "emergency";
  label: string;
  value: string;
  availability: string;
  language: string;
  priority: "high" | "medium" | "low";
  description?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  tags: string[];
  isArabic?: boolean;
}

const helpArticles: HelpArticle[] = [
  {
    id: "1",
    title: "Getting Started as a Saudi Engineer on nbcon",
    category: "Getting Started",
    description: "Complete guide to setting up your profile, SCE verification, and finding your first project",
    readTime: "8 min",
    popularity: 95,
    lastUpdated: "2024-12-28",
    tags: ["profile", "sce-verification", "onboarding"],
    isArabic: false
  },
  {
    id: "2",
    title: "Understanding Escrow Payments and Milestones",
    category: "Payments",
    description: "How milestone-based escrow works for engineering projects in Saudi Arabia",
    readTime: "12 min",
    popularity: 88,
    lastUpdated: "2024-12-27",
    tags: ["escrow", "milestones", "payments", "contracts"],
    isArabic: false
  },
  {
    id: "3", 
    title: "Site Check-in and Geofencing Requirements",
    category: "Site Management",
    description: "Using GPS check-in for Saudi engineering projects and safety compliance",
    readTime: "6 min",
    popularity: 92,
    lastUpdated: "2024-12-26",
    tags: ["check-in", "gps", "safety", "compliance"],
    isArabic: false
  },
  {
    id: "4",
    title: "Saudi Council of Engineers (SCE) Verification Process",
    category: "Verification",
    description: "Step-by-step guide to verifying your engineering credentials with SCE",
    readTime: "10 min",
    popularity: 85,
    lastUpdated: "2024-12-25",
    tags: ["sce", "verification", "credentials", "professional"],
    isArabic: false
  },
  {
    id: "5",
    title: "Project Documentation and Deliverable Uploads",
    category: "Project Management",
    description: "Best practices for uploading and managing engineering deliverables",
    readTime: "7 min",
    popularity: 78,
    lastUpdated: "2024-12-24",
    tags: ["deliverables", "documentation", "uploads", "quality"],
    isArabic: false
  },
  {
    id: "6",
    title: "دليل المبتدئين للمهندسين السعوديين على nbcon",
    category: "Getting Started",
    description: "دليل شامل لإعداد ملفك الشخصي والتحقق من شهادة الهيئة السعودية للمهندسين",
    readTime: "8 دقيقة",
    popularity: 92,
    lastUpdated: "2024-12-28",
    tags: ["ملف-شخصي", "تحقق-الهيئة", "بداية"],
    isArabic: true
  }
];

const supportContacts: SupportContact[] = [
  {
    type: "emergency",
    label: "Emergency Technical Support",
    value: "+966 11 234 5678",
    availability: "24/7",
    language: "Arabic, English",
    priority: "high",
    description: "Critical safety issues, system emergencies, payment disputes >50,000 SAR"
  },
  {
    type: "phone",
    label: "Riyadh Office Support",
    value: "+966 11 123 4567",
    availability: "Sun-Thu, 8AM-6PM AST",
    language: "Arabic, English",
    priority: "medium",
    description: "General support and account assistance"
  },
  {
    type: "whatsapp",
    label: "WhatsApp Support",
    value: "+966 55 123 4567",
    availability: "Sun-Thu, 8AM-8PM",
    language: "Arabic, English",
    priority: "medium",
    description: "Quick questions and general guidance"
  },
  {
    type: "email",
    label: "Email Support",
    value: "support@nbcon.sa",
    availability: "24-48 hours response",
    language: "Arabic, English",
    priority: "medium",
    description: "Detailed technical issues and documentation"
  },
  {
    type: "chat",
    label: "Live Chat",
    value: "Available on platform",
    availability: "Sun-Thu, 9AM-6PM",
    language: "Arabic, English",
    priority: "high",
    description: "Real-time assistance with platform features"
  }
];

const faqData: FAQ[] = [
  {
    id: "1",
    question: "How do I verify my Saudi Council of Engineers (SCE) credentials?",
    answer: "To verify your SCE credentials: 1) Go to Profile → Professional Info → SCE Verification, 2) Upload your valid SCE certificate and membership card, 3) Provide your SCE membership number, 4) Wait 24-48 hours for verification. You'll receive an email notification once approved.",
    category: "Verification",
    helpful: 156,
    tags: ["sce", "verification", "credentials"]
  },
  {
    id: "2", 
    question: "How does the escrow payment system work for projects?",
    answer: "Our escrow system protects both engineers and clients: 1) Client deposits full payment into escrow, 2) Payment is released in milestones as work is completed, 3) Each milestone requires client approval, 4) Funds are automatically transferred to your account upon approval, 5) Disputes are handled by our resolution team.",
    category: "Payments",
    helpful: 143,
    tags: ["escrow", "payments", "milestones"]
  },
  {
    id: "3",
    question: "What are the geofencing requirements for site check-in?",
    answer: "Site check-in requires: 1) GPS location services enabled, 2) Being within 50-100m of the project site (varies by project), 3) Completing the safety checklist, 4) Taking required site documentation photos. The system automatically verifies your location against the registered project coordinates.",
    category: "Site Management", 
    helpful: 128,
    tags: ["geofencing", "check-in", "gps", "safety"]
  },
  {
    id: "4",
    question: "Can I work on projects outside of Saudi Arabia?",
    answer: "Currently, nbcon focuses exclusively on engineering projects within Saudi Arabia. All projects must comply with Saudi engineering standards, regulations, and safety requirements. International expansion is planned for future phases.",
    category: "General",
    helpful: 95,
    tags: ["location", "projects", "saudi-arabia"]
  },
  {
    id: "5",
    question: "What types of engineering projects are available?",
    answer: "nbcon offers diverse engineering opportunities including: NEOM smart city development, Aramco oil & gas facilities, Red Sea tourism infrastructure, SABIC industrial projects, transportation systems, renewable energy installations, water treatment facilities, and residential/commercial construction projects across Saudi Arabia.",
    category: "Projects",
    helpful: 167,
    tags: ["projects", "engineering", "types", "opportunities"]
  },
  {
    id: "6",
    question: "كيف يمكنني التحقق من شهادة الهيئة السعودية للمهندسين؟",
    answer: "للتحقق من شهادة الهيئة: 1) اذهب إلى الملف الشخصي → المعلومات المهنية → التحقق من الهيئة، 2) ارفق شهادة الهيئة وبطاقة العضوية، 3) أدخل رقم عضوية الهيئة، 4) انتظر 24-48 ساعة للتحقق. ستتلقى إشعار بالبريد الإلكتروني عند الموافقة.",
    category: "Verification",
    helpful: 134,
    tags: ["الهيئة", "تحقق", "شهادة"],
    isArabic: true
  }
];

export function HelpSupportContent() {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    message: '',
    language: 'english'
  });

  const categories = [
    { id: "all", label: "All Topics", icon: Book },
    { id: "getting-started", label: "Getting Started", icon: User },
    { id: "payments", label: "Payments & Escrow", icon: CreditCard },
    { id: "site-management", label: "Site Management", icon: MapPin },
    { id: "verification", label: "SCE Verification", icon: Shield },
    { id: "project-management", label: "Projects", icon: Building },
    { id: "technical", label: "Technical Support", icon: Settings },
    { id: "safety", label: "Safety & Compliance", icon: AlertCircle }
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesCategory = activeCategory === "all" || 
      article.category.toLowerCase().replace(/\s+/g, "-") === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = activeCategory === "all" || 
      faq.category.toLowerCase().replace(/\s+/g, "-") === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getContactIcon = (type: string) => {
    switch (type) {
      case "phone": return Phone;
      case "email": return Mail;
      case "chat": return MessageCircle;
      case "whatsapp": return MessageSquare;
      case "emergency": return PhoneCall;
      default: return HelpCircle;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted text-muted-foreground border-sidebar-border";
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Support Request Sent",
        description: "We'll get back to you within 24 hours. Check your email for a confirmation.",
      });
      
      setContactForm({ subject: '', category: '', message: '', priority: 'medium', language: 'english' });
      setShowContactForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send support request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-6 pb-6 overflow-auto">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="space-y-2 pb-6 border-b">
        <h1 className="flex items-center gap-2 text-xl font-bold">
          <LifeBuoy className="h-5 w-5 text-primary" />
          Help & Support
        </h1>
          <p className="text-muted-foreground">
            Get help with your nbcon engineering marketplace experience in Saudi Arabia
          </p>
        </div>

        {/* Emergency Alert */}
        <Alert className="border-destructive/20 bg-destructive/5">
          <AlertDescription className="text-destructive">
            <strong>Emergency Support:</strong> For critical safety issues or system emergencies affecting active work sites, 
            call our 24/7 hotline at <strong>+966 11 234 5678</strong>. For payment disputes exceeding 50,000 SAR, contact our legal team immediately.
          </AlertDescription>
        </Alert>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search help articles, FAQs, and guides... (البحث في المقالات والأسئلة الشائعة...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Video className="w-8 h-8 text-info mx-auto mb-3" />
              <h3 className="mb-2">Video Tutorials</h3>
              <p className="text-sm text-muted-foreground">Watch step-by-step guides</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-success mx-auto mb-3" />
              <h3 className="mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground">Get instant help</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Download className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="mb-2">Downloads</h3>
              <p className="text-sm text-muted-foreground">Forms and guides</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowContactForm(true)}>
            <CardContent className="p-6 text-center">
              <Flag className="w-8 h-8 text-destructive mx-auto mb-3" />
              <h3 className="mb-2">Report Issue</h3>
              <p className="text-sm text-muted-foreground">Submit a support ticket</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="help-center" className="space-y-6">
          <TabsList className="h-auto bg-transparent p-0 border-b border-sidebar-border rounded-none w-full mb-6">
            <div className="flex items-center w-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-card hover:scrollbar-thumb-primary/80">
              <TabsTrigger 
                value="help-center"
                className="flex items-center gap-2 px-4 py-3 min-w-fit"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Help Center</span>
              </TabsTrigger>
              <TabsTrigger 
                value="faqs"
                className="flex items-center gap-2 px-4 py-3 min-w-fit"
              >
                <Book className="w-4 h-4" />
                <span className="hidden sm:inline">FAQs</span>
              </TabsTrigger>
              <TabsTrigger 
                value="contact"
                className="flex items-center gap-2 px-4 py-3 min-w-fit"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Contact Support</span>
              </TabsTrigger>
              <TabsTrigger 
                value="resources"
                className="flex items-center gap-2 px-4 py-3 min-w-fit"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Resources</span>
              </TabsTrigger>
            </div>
          </TabsList>

          {/* Help Center Tab */}
          <TabsContent value="help-center" className="space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Browse by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Button
                        key={category.id}
                        variant={activeCategory === category.id ? "default" : "outline"}
                        className={`h-auto p-4 flex flex-col items-center gap-2 ${
                          activeCategory === category.id ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
                        }`}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs text-center">{category.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Popular Articles */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeCategory === "all" ? "Popular Help Articles" : `${categories.find(c => c.id === activeCategory)?.label} Articles`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <div 
                      key={article.id}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors border-sidebar-border"
                      onClick={() => setSelectedArticle(article)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="hover:text-primary transition-colors">{article.title}</h3>
                          <Badge variant="secondary">{article.category}</Badge>
                          {article.popularity > 90 && (
                            <Badge className="bg-warning/10 text-warning border-warning/20">
                              <Star className="w-3 h-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                          {article.isArabic && (
                            <Badge className="bg-info/10 text-info border-info/20">
                              العربية
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{article.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {article.popularity}% helpful
                          </div>
                          <div>Updated {new Date(article.lastUpdated).toLocaleDateString('en-SA')}</div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {article.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground ml-4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Getting Started Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Quick Start Guide for Saudi Engineers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      step: "1",
                      title: "Create Your Profile",
                      description: "Set up your professional profile with SCE credentials",
                      icon: User,
                      color: "bg-info/10 text-info"
                    },
                    {
                      step: "2", 
                      title: "Browse Projects",
                      description: "Find engineering opportunities across Saudi Arabia",
                      icon: Building,
                      color: "bg-success/10 text-success"
                    },
                    {
                      step: "3",
                      title: "Start Working",
                      description: "Use site check-in and milestone tracking tools",
                      icon: CheckCircle,
                      color: "bg-primary/10 text-primary"
                    }
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.step} className="text-center p-4 border border-sidebar-border rounded-lg">
                        <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center mx-auto mb-3`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h4 className="mb-2">Step {item.step}: {item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-start gap-3">
                          <span>{faq.question}</span>
                          <Badge variant="outline" className="ml-2">{faq.category}</Badge>
                          {faq.isArabic && (
                            <Badge className="bg-info/10 text-info border-info/20">
                              العربية
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <p className="text-muted-foreground">{faq.answer}</p>
                          <div className="flex items-center justify-between pt-3 border-t">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="w-4 h-4 text-success" />
                              {faq.helpful} people found this helpful
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                👍 Helpful
                              </Button>
                              <Button variant="outline" size="sm">
                                👎 Not helpful
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
          </TabsContent>

          {/* Contact Support Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Methods</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {supportContacts.map((contact, index) => {
                    const Icon = getContactIcon(contact.type);
                    return (
                      <div key={index} className="flex items-start justify-between p-4 border border-sidebar-border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            contact.type === 'emergency' ? 'bg-destructive/10' : 'bg-primary/10'
                          }`}>
                            <Icon className={`w-4 h-4 ${
                              contact.type === 'emergency' ? 'text-destructive' : 'text-primary'
                            }`} />
                          </div>
                          <div>
                            <h4 className="mb-1">{contact.label}</h4>
                            <p className="text-sm text-muted-foreground mb-1">{contact.value}</p>
                            <p className="text-xs text-muted-foreground mb-1">{contact.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{contact.availability}</span>
                              <span>•</span>
                              <span>{contact.language}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={getPriorityColor(contact.priority)}>
                          {contact.priority}
                        </Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Submit Ticket */}
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Support Ticket</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your issue"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          value={contactForm.category} 
                          onValueChange={(value) => setContactForm({ ...contactForm, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">Technical Issue</SelectItem>
                            <SelectItem value="payment">Payment Problem</SelectItem>
                            <SelectItem value="account">Account Issue</SelectItem>
                            <SelectItem value="project">Project Dispute</SelectItem>
                            <SelectItem value="sce">SCE Verification</SelectItem>
                            <SelectItem value="safety">Safety Concern</SelectItem>
                            <SelectItem value="feature">Feature Request</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select 
                          value={contactForm.priority} 
                          onValueChange={(value) => setContactForm({ ...contactForm, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low - General question</SelectItem>
                            <SelectItem value="medium">Medium - Issue affecting work</SelectItem>
                            <SelectItem value="high">High - Critical business impact</SelectItem>
                            <SelectItem value="urgent">Urgent - System down/security issue</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Preferred Language</Label>
                      <Select 
                        value={contactForm.language} 
                        onValueChange={(value) => setContactForm({ ...contactForm, language: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="arabic">العربية (Arabic)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Description</Label>
                      <Textarea
                        id="message"
                        placeholder="Please provide detailed information about your issue..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        rows={5}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Send className="mr-2 h-4 w-4" />
                      Submit Ticket
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Downloads */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Downloads & Forms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Engineer Onboarding Guide", type: "PDF", size: "2.1 MB", downloads: 1240, language: "English/Arabic" },
                    { name: "SCE Verification Checklist", type: "PDF", size: "850 KB", downloads: 890, language: "Arabic" },
                    { name: "Safety Compliance Manual", type: "PDF", size: "4.2 MB", downloads: 2100, language: "English/Arabic" },
                    { name: "Project Documentation Template", type: "DOC", size: "1.5 MB", downloads: 760, language: "English" },
                    { name: "Payment Dispute Form", type: "PDF", size: "650 KB", downloads: 320, language: "Arabic/English" },
                    { name: "Site Check-in Procedures", type: "PDF", size: "1.2 MB", downloads: 1500, language: "English/Arabic" }
                  ].map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-sidebar-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-info" />
                        <div>
                          <h4 className="text-sm">{file.name}</h4>
                          <p className="text-xs text-muted-foreground">{file.type} • {file.size} • {file.downloads} downloads • {file.language}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Video Tutorials */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Video Tutorials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: "Complete Platform Overview", duration: "12:45", views: 5600, language: "Arabic/English" },
                    { title: "SCE Verification Process", duration: "8:30", views: 3200, language: "Arabic" },
                    { title: "Using Site Check-in Features", duration: "6:15", views: 2800, language: "English" },
                    { title: "Managing Project Milestones", duration: "10:20", views: 4100, language: "Arabic/English" },
                    { title: "Upload Deliverables Guide", duration: "7:45", views: 2600, language: "English" },
                    { title: "Emergency Procedures", duration: "5:30", views: 1800, language: "Arabic/English" }
                  ].map((video, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-sidebar-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <PlayCircle className="w-5 h-5 text-destructive" />
                        <div>
                          <h4 className="text-sm">{video.title}</h4>
                          <p className="text-xs text-muted-foreground">{video.duration} • {video.views} views • {video.language}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Video className="w-4 h-4 mr-2" />
                        Watch
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  System Status & Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-success/5 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <div>
                        <h4 className="text-success">All Systems Operational</h4>
                        <p className="text-sm text-success/80">Last checked: 2 minutes ago</p>
                      </div>
                    </div>
                    <Badge className="bg-success/10 text-success border-success/20">
                      99.9% Uptime
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <h4>Recent Updates</h4>
                    {[
                      { date: "2024-12-28", title: "Enhanced geofencing accuracy for NEOM projects", type: "improvement" },
                      { date: "2024-12-26", title: "New Arabic language support for safety checklists", type: "feature" },
                      { date: "2024-12-24", title: "Scheduled maintenance completed successfully", type: "maintenance" },
                      { date: "2024-12-22", title: "SCE verification process streamlined", type: "improvement" }
                    ].map((update, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border border-sidebar-border rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          update.type === "improvement" ? "bg-info" :
                          update.type === "feature" ? "bg-success" : "bg-warning"
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm">{update.title}</p>
                          <p className="text-xs text-muted-foreground">{update.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Engineer Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-sidebar-border rounded-lg">
                    <MessageSquare className="w-8 h-8 text-info mx-auto mb-3" />
                    <h4 className="mb-2">Discussion Forum</h4>
                    <p className="text-sm text-muted-foreground mb-3">Connect with fellow Saudi engineers</p>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Join Forum
                    </Button>
                  </div>

                  <div className="text-center p-4 border border-sidebar-border rounded-lg">
                    <Calendar className="w-8 h-8 text-success mx-auto mb-3" />
                    <h4 className="mb-2">Webinars</h4>
                    <p className="text-sm text-muted-foreground mb-3">Monthly engineering webinars</p>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Schedule
                    </Button>
                  </div>

                  <div className="text-center p-4 border border-sidebar-border rounded-lg">
                    <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h4 className="mb-2">Knowledge Base</h4>
                    <p className="text-sm text-muted-foreground mb-3">Engineering best practices</p>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Browse Articles
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Send us a detailed message and we'll get back to you within 24 hours
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="modal-subject">Subject</Label>
                    <Input
                      id="modal-subject"
                      placeholder="Brief description of your issue"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="modal-category">Category</Label>
                      <Select 
                        value={contactForm.category} 
                        onValueChange={(value) => setContactForm({ ...contactForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="payment">Payment Problem</SelectItem>
                          <SelectItem value="account">Account Issue</SelectItem>
                          <SelectItem value="project">Project Dispute</SelectItem>
                          <SelectItem value="sce">SCE Verification</SelectItem>
                          <SelectItem value="safety">Safety Concern</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="modal-priority">Priority</Label>
                      <Select 
                        value={contactForm.priority} 
                        onValueChange={(value) => setContactForm({ ...contactForm, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - General question</SelectItem>
                          <SelectItem value="medium">Medium - Issue affecting work</SelectItem>
                          <SelectItem value="high">High - Critical business impact</SelectItem>
                          <SelectItem value="urgent">Urgent - System down/security issue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modal-message">Message</Label>
                    <Textarea
                      id="modal-message"
                      placeholder="Please provide detailed information about your issue..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      rows={5}
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowContactForm(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}


