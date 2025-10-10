import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../1-HomePage/others/components/ui/card';
import { Button } from '../1-HomePage/others/components/ui/button';
import { Input } from '../1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../1-HomePage/others/components/ui/tabs';
import { Badge } from '../1-HomePage/others/components/ui/badge';
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
  ThumbsDown
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
  category: 'analysis' | 'design' | 'calculation' | 'documentation';
}

// Mock data
const mockTools: AITool[] = [
  {
    id: '1',
    name: 'Structural Analysis',
    description: 'Analyze structural elements and calculate loads',
    icon: Calculator,
    category: 'analysis'
  },
  {
    id: '2',
    name: 'Code Generation',
    description: 'Generate engineering code and specifications',
    icon: Code,
    category: 'documentation'
  },
  {
    id: '3',
    name: 'Design Optimization',
    description: 'Optimize designs for efficiency and cost',
    icon: Lightbulb,
    category: 'design'
  },
  {
    id: '4',
    name: 'Document Analysis',
    description: 'Analyze and extract data from documents',
    icon: FileText,
    category: 'documentation'
  }
];

const mockChatHistory: ChatMessage[] = [
  {
    id: '1',
    type: 'user',
    content: 'Can you help me calculate the moment of inertia for a rectangular beam?',
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    id: '2',
    type: 'assistant',
    content: 'I can help you calculate the moment of inertia for a rectangular beam. The formula is I = (b × h³) / 12, where b is the width and h is the height. What are the dimensions of your beam?',
    timestamp: new Date(Date.now() - 3550000)
  },
  {
    id: '3',
    type: 'user',
    content: 'The beam is 300mm wide and 600mm deep.',
    timestamp: new Date(Date.now() - 3500000)
  },
  {
    id: '4',
    type: 'assistant',
    content: 'For a rectangular beam with width b = 300mm and depth h = 600mm:\n\nI = (b × h³) / 12\nI = (300 × 600³) / 12\nI = (300 × 216,000,000) / 12\nI = 64,800,000,000 / 12\nI = 5.4 × 10⁹ mm⁴\n\nThis is approximately 0.0054 m⁴.',
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
        content: 'I understand your question. Let me help you with that engineering calculation. Could you provide more details about the specific parameters you\'re working with?',
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
            AI Engineering Assistant
          </h1>
          <p className="text-muted-foreground">Get instant help with engineering calculations, analysis, and design</p>
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
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Engineering Assistant</CardTitle>
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
                    placeholder="Ask me anything about engineering..."
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

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Structural Calculations</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Templates for common structural engineering calculations
                </p>
                <Button size="sm" className="w-full">Use Template</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold">Report Generation</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Generate engineering reports and documentation
                </p>
                <Button size="sm" className="w-full">Use Template</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold">Code Review</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Review and optimize engineering code
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
