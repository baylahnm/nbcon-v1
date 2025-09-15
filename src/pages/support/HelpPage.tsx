import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/stores/auth';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Search,
  Lightbulb,
  Shield,
  CreditCard,
  Users,
  Briefcase,
  Send,
  ExternalLink,
  CheckCircle2,
  Clock,
  Star,
  Loader2
} from 'lucide-react';

const FAQ_CATEGORIES = [
  { id: 'general', label: 'General', icon: HelpCircle },
  { id: 'account', label: 'Account & Profile', icon: Users },
  { id: 'jobs', label: 'Jobs & Projects', icon: Briefcase },
  { id: 'payments', label: 'Payments & Billing', icon: CreditCard },
  { id: 'security', label: 'Security & Privacy', icon: Shield },
];

const FAQ_DATA = {
  general: [
    {
      question: "What is nbcon and how does it work?",
      answer: "nbcon is Saudi Arabia's premier platform connecting certified engineers with clients who need engineering services. Clients post projects, engineers submit quotes, and work gets done securely through our platform."
    },
    {
      question: "How do I get started on nbcon?",
      answer: "Simply sign up with your email or phone number, choose your role (Engineer or Client), complete your profile, and you're ready to start. Engineers can browse jobs, while clients can post projects and browse engineer profiles."
    },
    {
      question: "Is nbcon available throughout Saudi Arabia?",
      answer: "Yes! nbcon serves all major cities across Saudi Arabia including Riyadh, Jeddah, Dammam, Mecca, Medina, and many others. Our platform helps you find local engineers or work with clients nationwide."
    },
    {
      question: "What types of engineering services are available?",
      answer: "We cover all major engineering disciplines including Civil, Structural, Mechanical, Electrical, Environmental, Geotechnical, Transportation, and more. From quick inspections to complex design projects."
    }
  ],
  account: [
    {
      question: "How do I verify my engineering license?",
      answer: "Upload your SCE (Saudi Council of Engineers) license number in your profile. Our team will verify it within 24-48 hours. Verified engineers get a special badge and higher visibility."
    },
    {
      question: "Can I change my account type from Client to Engineer?",
      answer: "Currently, you'll need to create a new account to switch roles. Contact our support team for assistance with this process."
    },
    {
      question: "How do I update my profile information?",
      answer: "Go to Settings > Profile to update your personal information, professional details, and preferences. Changes are saved automatically."
    },
    {
      question: "I forgot my password. How do I reset it?",
      answer: "On the login page, click 'Forgot Password' and enter your email. You'll receive a reset link to create a new password."
    }
  ],
  jobs: [
    {
      question: "How do I post a job as a client?",
      answer: "Click 'Post New Job' from your dashboard, fill in the project details, budget, and requirements. Your job will be visible to qualified engineers immediately."
    },
    {
      question: "How do engineers submit quotes?",
      answer: "Engineers can view your job posting and click 'Submit Quote' to send you a detailed proposal with pricing and timeline."
    },
    {
      question: "What happens after I accept a quote?",
      answer: "Once you accept a quote, you can communicate directly with the engineer through our messaging system to coordinate the work."
    },
    {
      question: "Can I edit my job posting after publishing?",
      answer: "Yes, you can edit job details as long as no quotes have been accepted. Once work begins, major changes require mutual agreement."
    }
  ],
  payments: [
    {
      question: "How does payment work on nbcon?",
      answer: "Payment features are coming soon! Currently, you arrange payment directly with the engineer. We're developing secure escrow and milestone-based payments."
    },
    {
      question: "What payment methods will be supported?",
      answer: "We'll support bank transfers, credit cards, and popular Saudi payment methods like STC Pay and Apple Pay when our payment system launches."
    },
    {
      question: "Are there any fees for using nbcon?",
      answer: "nbcon is currently free to use for both engineers and clients. We may introduce optional premium features in the future."
    }
  ],
  security: [
    {
      question: "How do you verify engineers?",
      answer: "We verify SCE licenses, check professional credentials, and maintain a rating system based on completed projects and client feedback."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we use industry-standard encryption and security measures. Your data is stored securely and never shared without your permission."
    },
    {
      question: "How do I report a problem with an engineer or client?",
      answer: "Use the 'Report Issue' button in your conversation or contact our support team directly. We investigate all reports promptly."
    }
  ]
};

const SUPPORT_CHANNELS = [
  {
    title: "Live Chat",
    description: "Get instant help from our support team",
    icon: MessageSquare,
    action: "Start Chat",
    status: "Online",
    color: "text-success"
  },
  {
    title: "Email Support",
    description: "Send us a detailed message",
    icon: Mail,
    action: "Send Email",
    contact: "support@nbcon.sa",
    color: "text-primary"
  },
  {
    title: "Phone Support",
    description: "Speak directly with our team",
    icon: Phone,
    action: "Call Now",
    contact: "+966 11 234 5678",
    hours: "Sun-Thu: 9AM-6PM",
    color: "text-accent"
  }
];

export default function HelpPage() {
  const { profile } = useAuthStore();
  const { toast } = useToast();
  
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: '',
    message: '',
    priority: 'normal',
  });

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
      
      setContactForm({ subject: '', category: '', message: '', priority: 'normal' });
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

  const filteredFAQs = FAQ_DATA[activeCategory as keyof typeof FAQ_DATA]?.filter(
    faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <HelpCircle className="h-8 w-8 text-primary" />
          Help & Support
        </h1>
        <p className="text-muted-foreground">
          Get help with nbcon and find answers to common questions
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {SUPPORT_CHANNELS.map((channel) => {
          const Icon = channel.icon;
          return (
            <Card key={channel.title} className="hover:shadow-medium transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg bg-muted ${channel.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{channel.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {channel.description}
                    </p>
                    {channel.contact && (
                      <p className="text-sm font-mono text-primary mb-1">
                        {channel.contact}
                      </p>
                    )}
                    {channel.hours && (
                      <p className="text-xs text-muted-foreground mb-3">
                        {channel.hours}
                      </p>
                    )}
                    {channel.status && (
                      <Badge variant="outline" className="text-success border-success/20 bg-success/5 mb-3">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {channel.status}
                      </Badge>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (channel.title === "Email Support") {
                          setShowContactForm(true);
                        } else {
                          toast({
                            title: "Coming Soon",
                            description: `${channel.title} will be available soon!`,
                          });
                        }
                      }}
                    >
                      {channel.action}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQ Section */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <div className="border-b">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="inline-flex h-12 items-center justify-start rounded-none border-0 bg-transparent p-0">
              {FAQ_CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="inline-flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    {category.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </ScrollArea>
        </div>

        <div className="mt-6 space-y-6">
          {/* FAQ Content */}
          <div>
            {FAQ_CATEGORIES.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      {category.label} - Frequently Asked Questions
                    </CardTitle>
                    <CardDescription>
                      Find answers to common questions about {category.label.toLowerCase()}
                    </CardDescription>
                    
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search FAQs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const categoryFAQs = FAQ_DATA[category.id as keyof typeof FAQ_DATA]?.filter(
                        faq => 
                          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
                      ) || [];

                      return categoryFAQs.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                          {categoryFAQs.map((faq, index) => (
                            <AccordionItem key={index} value={`faq-${index}`}>
                              <AccordionTrigger className="text-left">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-muted-foreground">
                                {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      ) : (
                        <div className="text-center py-8">
                          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="font-medium mb-2">No results found</h3>
                          <p className="text-sm text-muted-foreground">
                            Try adjusting your search or browse different categories
                          </p>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </div>

          {/* Quick Tips - Moved Down */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-accent" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border border-accent/20 bg-accent/5 rounded-md">
                    <p className="text-sm">
                      <strong>Pro Tip:</strong> Complete your profile to get better visibility and more opportunities!
                    </p>
                  </div>
                  <div className="p-4 border border-info/20 bg-info/5 rounded-md">
                    <p className="text-sm">
                      <strong>Did you know?</strong> Verified engineers get 3x more job inquiries.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Send us a detailed message and we'll get back to you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
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
                        {FAQ_CATEGORIES.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.label}
                          </SelectItem>
                        ))}
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
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

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

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Please provide as much detail as possible about your issue..."
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
                  <Button type="submit" disabled={isSubmitting} className="bg-gradient-primary">
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

      {/* Resources Section */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
          <CardDescription>
            Helpful links and documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="h-auto p-4 flex-col gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-medium">User Guide</span>
              <span className="text-xs text-muted-foreground">Complete platform guide</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-medium">Safety Guidelines</span>
              <span className="text-xs text-muted-foreground">Best practices & safety</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col gap-2">
              <Star className="h-6 w-6 text-primary" />
              <span className="font-medium">Success Stories</span>
              <span className="text-xs text-muted-foreground">Learn from others</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}