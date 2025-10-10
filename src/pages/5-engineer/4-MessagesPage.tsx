import { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Plus, 
  User, 
  Building,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Clock,
  CheckCheck
} from 'lucide-react';
import { Card, CardContent } from '../1-HomePage/others/components/ui/card';
import { Button } from '../1-HomePage/others/components/ui/button';
import { Input } from '../1-HomePage/others/components/ui/input';
import { Badge } from '../1-HomePage/others/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../1-HomePage/others/components/ui/avatar';
import { ScrollArea } from '../1-HomePage/others/components/ui/scroll-area';
import { Separator } from '../1-HomePage/others/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '../1-HomePage/others/components/ui/tabs';

interface Conversation {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  project?: string;
}

interface Message {
  id: string;
  sender: 'me' | 'them';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

const sampleConversations: Conversation[] = [
  {
    id: '1',
    name: 'Ahmed Al-Mansour',
    role: 'Project Manager',
    company: 'NEOM Company',
    avatar: '',
    lastMessage: 'The foundation report looks excellent. When can you deliver the phase 2 designs?',
    timestamp: '2 min ago',
    unread: 2,
    online: true,
    project: 'NEOM Smart City'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Engineering Director',
    company: 'Saudi Aramco',
    avatar: '',
    lastMessage: 'Perfect! The system analysis meets all our requirements.',
    timestamp: '1 hour ago',
    unread: 0,
    online: true,
    project: 'Aramco Refinery'
  },
  {
    id: '3',
    name: 'Mohammed Al-Zahrani',
    role: 'Client Liaison',
    company: 'Red Sea Global',
    avatar: '',
    lastMessage: 'Thank you for the quick turnaround on the environmental assessment.',
    timestamp: '3 hours ago',
    unread: 1,
    online: false,
    project: 'Red Sea Marina'
  },
  {
    id: '4',
    name: 'Fatima Al-Rashid',
    role: 'Procurement Officer',
    company: 'Ministry of Sports',
    avatar: '',
    lastMessage: 'We need to discuss the timeline for the stadium renovation project.',
    timestamp: 'Yesterday',
    unread: 0,
    online: false,
    project: 'National Stadium'
  },
  {
    id: '5',
    name: 'Omar Hassan',
    role: 'Technical Lead',
    company: 'Bechtel Corporation',
    avatar: '',
    lastMessage: 'Can you send me the updated structural calculations?',
    timestamp: '2 days ago',
    unread: 0,
    online: false,
  }
];

const sampleMessages: Message[] = [
  {
    id: 'm1',
    sender: 'them',
    content: 'Hi! I reviewed your initial site survey for the NEOM project. Very comprehensive work!',
    timestamp: '10:30 AM',
    status: 'read'
  },
  {
    id: 'm2',
    sender: 'me',
    content: 'Thank you! I made sure to cover all the geotechnical aspects and environmental considerations.',
    timestamp: '10:32 AM',
    status: 'read'
  },
  {
    id: 'm3',
    sender: 'them',
    content: 'The foundation report looks excellent. When can you deliver the phase 2 designs?',
    timestamp: '10:35 AM',
    status: 'read'
  },
  {
    id: 'm4',
    sender: 'me',
    content: 'I can have the architectural drawings and structural calculations ready by next Friday. The MEP designs will follow the week after.',
    timestamp: '10:38 AM',
    status: 'delivered'
  }
];

export function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filteredConversations = sampleConversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.project?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'unread' && conv.unread > 0);
    return matchesSearch && matchesFilter;
  });

  const totalUnread = sampleConversations.reduce((sum, conv) => sum + conv.unread, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl ring-1 ring-primary/20">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Messages</h1>
              <p className="text-muted-foreground text-xs mt-0.5">
                Communicate with clients and team members
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {totalUnread > 0 && (
              <Badge variant="secondary" className="text-xs">
                {totalUnread} Unread
              </Badge>
            )}
            <Button size="sm" className="text-xs h-8 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <Plus className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations Sidebar */}
          <Card className="lg:col-span-1 flex flex-col h-full">
            <CardContent className="p-0 flex flex-col h-full">
              {/* Search and Filters */}
              <div className="p-4 space-y-3 border-b border-border/40">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-9 text-xs h-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')} className="w-full">
                  <TabsList className="w-full grid grid-cols-2 h-8">
                    <TabsTrigger value="all" className="text-xs">
                      All ({sampleConversations.length})
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="text-xs">
                      Unread ({totalUnread})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Conversations List */}
              <ScrollArea className="flex-1">
                <div className="p-2">
                  {filteredConversations.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">No conversations found</p>
                      <p className="text-xs text-muted-foreground mt-1">Start a new conversation to connect</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredConversations.map((conv) => (
                        <div
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv)}
                          className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedConversation?.id === conv.id
                              ? 'bg-primary/10 ring-1 ring-primary/20'
                              : 'hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <Avatar className="h-11 w-11">
                                <AvatarImage src={conv.avatar} />
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                                  {conv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              {conv.online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-background" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-0.5">
                                <h4 className="font-semibold text-sm truncate">{conv.name}</h4>
                                <span className="text-[10px] text-muted-foreground shrink-0">{conv.timestamp}</span>
                              </div>
                              <p className="text-[10px] text-muted-foreground mb-1">
                                {conv.role} • {conv.company}
                              </p>
                              {conv.project && (
                                <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 mb-1">
                                  {conv.project}
                                </Badge>
                              )}
                              <p className="text-xs text-foreground/80 line-clamp-1">{conv.lastMessage}</p>
                            </div>
                            {conv.unread > 0 && (
                              <Badge className="bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center text-[9px] shrink-0">
                                {conv.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col h-full">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedConversation.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                          {selectedConversation.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      {selectedConversation.online && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-background" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{selectedConversation.name}</h3>
                      <p className="text-[10px] text-muted-foreground">
                        {selectedConversation.role} • {selectedConversation.company}
                        {selectedConversation.online && <span className="text-green-600 ml-1">● Online</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Info className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {/* Date Separator */}
                    <div className="flex items-center gap-3 my-4">
                      <Separator className="flex-1" />
                      <span className="text-[10px] text-muted-foreground font-medium">Today, 10:30 AM</span>
                      <Separator className="flex-1" />
                    </div>

                    {/* Messages */}
                    {sampleMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-end gap-2 max-w-[70%] ${msg.sender === 'me' ? 'flex-row-reverse' : 'flex-row'}`}>
                          {msg.sender === 'them' && (
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-[10px]">
                                {selectedConversation.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <div
                              className={`px-4 py-2.5 rounded-2xl ${
                                msg.sender === 'me'
                                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                                  : 'bg-muted rounded-bl-sm'
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{msg.content}</p>
                            </div>
                            <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-[9px] text-muted-foreground">{msg.timestamp}</span>
                              {msg.sender === 'me' && (
                                <CheckCheck className={`h-3 w-3 ${msg.status === 'read' ? 'text-primary' : 'text-muted-foreground'}`} />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Composer */}
                <div className="p-4 border-t border-border/40">
                  <div className="flex items-end gap-2">
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 shrink-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 shrink-0">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="resize-none text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            // Handle send message
                            setNewMessage('');
                          }
                        }}
        />
      </div>
                    <Button 
                      size="sm" 
                      className="h-9 text-xs shadow-md hover:shadow-xl transition-all"
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-4 w-4 mr-1.5" />
                      Send
                    </Button>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-2 ml-20">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              </>
            ) : (
              // Empty State
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="bg-muted/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">Select a conversation</h3>
                  <p className="text-xs text-muted-foreground mb-6">
                    Choose a conversation from the list to start messaging
                  </p>
                  <Button size="sm" className="text-xs h-8">
                    <Plus className="h-4 w-4 mr-2" />
                    Start New Conversation
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
