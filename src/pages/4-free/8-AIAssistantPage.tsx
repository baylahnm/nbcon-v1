import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/1-HomePage/others/components/ui/tabs';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Upload, 
  Download, 
  Lightbulb, 
  Code, 
  Calculator,
  FileText,
  Search,
  Sparkles,
  MessageSquare,
  History,
  Star,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Users,
  Briefcase,
  DollarSign,
  Calendar
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: string[];
}

interface AITool {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'project' | 'hiring' | 'planning' | 'analysis';
}

// Mock data
const mockTools: AITool[] = [
  {
    id: '1',
    name: 'Project Planning',
    description: 'Create detailed project plans and timelines',
    icon: Calendar,
    category: 'project'
  },
  {
    id: '2',
    name: 'Engineer Matching',
    description: 'Find the best engineers for your project',
    icon: Users,
    category: 'hiring'
  },
  {
    id: '3',
    name: 'Budget Estimation',
    description: 'Estimate project costs and budgets',
    icon: DollarSign,
    category: 'analysis'
  },
  {
    id: '4',
    name: 'Project Templates',
    description: 'Generate project templates and documentation',
    icon: FileText,
    category: 'planning'
  }
];

const mockChatHistory: ChatMessage[] = [
  {
    id: '1',
    type: 'user',
    content: 'I need help planning a structural engineering project for a new office building.',
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    id: '2',
    type: 'assistant',
    content: 'I\'d be happy to help you plan your structural engineering project! To create the best plan for your office building, I\'ll need some details:\n\n1. What\'s the size and height of the building?\n2. What\'s your preferred location?\n3. What\'s your estimated budget range?\n4. Do you have any specific structural requirements?\n\nOnce I have this information, I can help you create a detailed project plan, find suitable engineers, and estimate costs.',
    timestamp: new Date(Date.now() - 3550000)
  },
  {
    id: '3',
    type: 'user',
    content: 'It\'s a 10-story office building in Riyadh, budget around 5M SAR.',
    timestamp: new Date(Date.now() - 3500000)
  },
  {
    id: '4',
    type: 'assistant',
    content: 'Perfect! For a 10-story office building in Riyadh with a 5M SAR budget, here\'s what I recommend:\n\n**Project Timeline:** 12-18 months\n**Key Phases:**\n- Design & Planning: 3-4 months\n- Permits & Approvals: 2-3 months\n- Construction: 6-8 months\n- Testing & Handover: 1-2 months\n\n**Recommended Engineers:**\n- Structural Engineer (SCE Licensed)\n- MEP Engineer\n- Civil Engineer\n\n**Estimated Costs:**\n- Design & Engineering: 400-600K SAR\n- Construction: 3.5-4M SAR\n- Permits & Approvals: 100-200K SAR\n\nWould you like me to help you find qualified engineers or create a detailed project timeline?',
    timestamp: new Date(Date.now() - 3450000)
  }
];

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(mockChatHistory);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I understand your project needs. Let me help you with that. Could you provide more specific details about your requirements?',
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            AI Project Assistant
          </h1>
          <p className="text-muted-foreground">Get help with project planning, engineer matching, and budget estimation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <History className="h-4 w-4 mr-2" />
            Chat History
          </Button>
          <Button size="sm">
            <Sparkles className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      </div>

      {/* AI Tools Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mockTools.map((tool) => (
          <Card key={tool.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <tool.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold text-sm mb-1">{tool.name}</h3>
              <p className="text-xs text-muted-foreground">{tool.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
          <TabsTrigger value="tools">AI Tools</TabsTrigger>
          <TabsTrigger value="templates">Project Templates</TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Project Assistant</CardTitle>
                  <Badge variant="secondary">Online</Badge>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline">
                    <Upload className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {chatHistory.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`p-3 rounded-lg ${
                        msg.type === 'user' 
                          ? 'bg-primary text-primary-foreground ml-12' 
                          : 'bg-muted mr-12'
                      }`}>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                        <div className={`text-xs mt-2 opacity-70 ${
                          msg.type === 'user' ? 'text-right' : 'text-left'
                        }`}>
                          {msg.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      {msg.type === 'assistant' && (
                        <div className="flex gap-1 mt-2 ml-12">
                          <Button size="sm" variant="ghost" className="h-6 px-2">
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 px-2">
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 px-2"
                            onClick={() => copyToClipboard(msg.content)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Describe your project needs or ask for help..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-20"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={toggleRecording}
                  >
                    {isRecording ? (
                      <MicOff className="h-4 w-4 text-red-600" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button onClick={handleSendMessage} disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Tools Tab */}
        <TabsContent value="tools" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockTools.map((tool) => (
              <Card key={tool.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <tool.icon className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge variant="outline">{tool.category}</Badge>
                    <div className="space-y-2">
                      <Button size="sm" className="w-full">
                        Use Tool
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Project Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Office Building</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Complete project template for office building construction
                </p>
                <Button size="sm" className="w-full">Use Template</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold">Budget Calculator</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Estimate costs for various project types
                </p>
                <Button size="sm" className="w-full">Use Template</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold">Team Planning</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Plan your engineering team structure
                </p>
                <Button size="sm" className="w-full">Use Template</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

