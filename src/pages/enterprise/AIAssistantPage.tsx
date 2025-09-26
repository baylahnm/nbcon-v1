import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot,
  Send,
  Plus,
  Search,
  Clock,
  FileText,
  BarChart3,
  Users,
  Calendar,
  Star,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Sparkles,
  MessageSquare,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// import aiImage from 'figma:asset/04282a75d7db8dcfefe0fbc8e50066e318ab464d.png';

interface AIMessage {
  id: string;
  content: string;
  timestamp: string;
  isUser: boolean;
  type?: 'text' | 'suggestion' | 'action';
  actions?: string[];
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  isStarred?: boolean;
}

interface QuickPrompt {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

export function AIAssistantPage() {
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Sample conversations
  const conversations: Conversation[] = [
    {
      id: '1',
      title: 'Project Planning Discussion',
      lastMessage: 'Let me help you with that. Based on the information provided...',
      timestamp: '2m ago',
      isStarred: true
    },
    {
      id: '2',
      title: 'Team Performance Analysis',
      lastMessage: 'Here\'s a summary of your team\'s performance metrics...',
      timestamp: '1h ago'
    },
    {
      id: '3',
      title: 'Budget Optimization',
      lastMessage: 'I can suggest several strategies to optimize your budget...',
      timestamp: '3h ago'
    }
  ];

  // Sample messages for the current conversation
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      content: 'Can you create new event in my calendar for meeting with Alibaba project manager?',
      timestamp: '2:30 PM',
      isUser: true
    },
    {
      id: '2',
      content: 'I understand you\'re asking about our job. Could your payroll and my calendar for meeting with Alibaba project manager. Let me help you with that. Based on the information provided, I can offer some insights and recommendations. Would you like me to elaborate on any specific aspect?',
      timestamp: '2:31 PM',
      isUser: false,
      type: 'suggestion',
      actions: ['Schedule Meeting', 'View Calendar', 'Contact Manager']
    },
    {
      id: '3',
      content: 'I understand you\'re asking about our. Let me help you with that. Based on the information provided, I can offer some insights and recommendations. Would you like me to elaborate on any specific aspect?',
      timestamp: '2:32 PM',
      isUser: true
    },
    {
      id: '4',
      content: 'I understand you\'re asking about aid. Let me help you with that. Based on the information provided, I can offer some insights and recommendations. Would you like me to elaborate on any specific aspect?',
      timestamp: '2:33 PM',
      isUser: false,
      type: 'suggestion',
      actions: ['Generate Report', 'Schedule Follow-up', 'Export Data']
    }
  ]);

  // Quick prompts for different categories
  const quickPrompts: QuickPrompt[] = [
    {
      id: '1',
      title: 'Project Status Summary',
      description: 'Get a comprehensive overview of all active projects',
      icon: <BarChart3 className="h-4 w-4" />,
      category: 'Projects'
    },
    {
      id: '2',
      title: 'Team Performance Analysis',
      description: 'Analyze team productivity and identify improvement areas',
      icon: <Users className="h-4 w-4" />,
      category: 'Team'
    },
    {
      id: '3',
      title: 'Budget Forecast',
      description: 'Generate budget predictions for upcoming quarters',
      icon: <TrendingUp className="h-4 w-4" />,
      category: 'Finance'
    },
    {
      id: '4',
      title: 'Schedule Optimization',
      description: 'Optimize meeting schedules and resource allocation',
      icon: <Calendar className="h-4 w-4" />,
      category: 'Planning'
    },
    {
      id: '5',
      title: 'Risk Assessment',
      description: 'Identify potential risks in current projects',
      icon: <AlertCircle className="h-4 w-4" />,
      category: 'Analysis'
    },
    {
      id: '6',
      title: 'Compliance Check',
      description: 'Review compliance status across all departments',
      icon: <CheckCircle className="h-4 w-4" />,
      category: 'Compliance'
    }
  ];

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      content: currentMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        content: `I understand your request about "${currentMessage}". Based on our enterprise data and current project status, I can provide detailed insights and recommendations. Would you like me to analyze specific aspects or generate actionable reports?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
        type: 'suggestion',
        actions: ['Generate Report', 'Schedule Meeting', 'Create Task']
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickPrompt = (prompt: QuickPrompt) => {
    setCurrentMessage(prompt.title);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="p-6 h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold">AI Assistant</h1>
              <p className="text-sm text-muted-foreground">
                Your intelligent enterprise companion for project management
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100%-5rem)]">
        {/* Conversations Sidebar */}
        <div className="col-span-3 space-y-4">
          <Card className="h-full">
            <CardContent className="p-0 h-full flex flex-col">
              {/* Search */}
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Recent Conversations */}
              <ScrollArea className="flex-1">
                <div className="p-2">
                  <div className="text-xs font-medium text-muted-foreground px-2 py-2 uppercase tracking-wider">
                    Recent Conversations
                  </div>
                  
                  {conversations.map((conversation) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`
                        flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors
                        ${selectedConversation === conversation.id 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'hover:bg-muted/50'
                        }
                      `}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate text-sm">{conversation.title}</p>
                          <div className="flex items-center space-x-1">
                            {conversation.isStarred && (
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            )}
                            <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="col-span-6">
          <Card className="h-full flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">AI Assistant</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    Online and ready to help
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Star className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      Export Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Star className="h-4 w-4 mr-2" />
                      Star Conversation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} group`}
                  >
                    <div className={`flex space-x-3 max-w-[85%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {!message.isUser && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                            <Bot className="h-4 w-4 text-primary-foreground" />
                          </div>
                        </Avatar>
                      )}
                      
                      <div className={`space-y-2 ${message.isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className={`
                          px-4 py-3 rounded-2xl max-w-full break-words
                          ${message.isUser 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted border border-border'
                          }
                        `}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>

                        {/* Action buttons for AI messages */}
                        {!message.isUser && message.actions && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {message.actions.map((action, actionIndex) => (
                              <Button 
                                key={actionIndex}
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-xs"
                              >
                                {action}
                              </Button>
                            ))}
                          </div>
                        )}

                        {/* Message footer */}
                        <div className={`flex items-center space-x-2 text-xs text-muted-foreground ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <span>{message.timestamp}</span>
                          {!message.isUser && (
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <ThumbsDown className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex space-x-3">
                      <Avatar className="h-8 w-8">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                      </Avatar>
                      <div className="bg-muted px-4 py-3 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-end space-x-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Ask me anything about your projects, team, or analytics..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-10 min-h-[44px] py-3"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                
                <Button 
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim()}
                  className="shrink-0 h-11"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Tabs defaultValue="prompts" className="w-full">
                <div className="border-b border-sidebar-border mb-3">
                  <TabsList className="h-auto bg-transparent p-0 border-0 rounded-none w-full">
                    <TabsTrigger value="prompts" className="flex items-center gap-2 px-4 py-3 min-w-fit text-xs">Prompts</TabsTrigger>
                    <TabsTrigger value="recent" className="flex items-center gap-2 px-4 py-3 min-w-fit text-xs">Recent</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="prompts" className="space-y-2">
                  {quickPrompts.slice(0, 4).map((prompt) => (
                    <motion.div
                      key={prompt.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full p-3 h-auto text-left justify-start"
                        onClick={() => handleQuickPrompt(prompt)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {prompt.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{prompt.title}</p>
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {prompt.description}
                            </p>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </TabsContent>

                <TabsContent value="recent" className="space-y-2">
                  <div className="text-xs text-muted-foreground text-center py-4">
                    Recent actions will appear here
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* AI Capabilities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Project Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Budget Forecasting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Team Performance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Risk Assessment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Schedule Optimization</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}