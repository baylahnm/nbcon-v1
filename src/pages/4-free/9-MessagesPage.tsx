import { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Plus, 
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  CheckCheck,
  ChevronLeft,
  ChevronRight
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

// Sample conversations - Client talking to Engineers
const sampleConversations: Conversation[] = [
  {
    id: '1',
    name: 'Ahmed Al-Rashid',
    role: 'Senior Structural Engineer',
    company: 'Independent Consultant',
    avatar: '',
    lastMessage: 'I can start the structural analysis next Monday. Would that timeline work for your project?',
    timestamp: '2 min ago',
    unread: 2,
    online: true,
    project: 'Al-Khobar Commercial Center'
  },
  {
    id: '2',
    name: 'Fatima Al-Zahra',
    role: 'Electrical Engineer',
    company: 'nbcon Verified',
    avatar: '',
    lastMessage: 'The electrical design for phase 1 is ready for your review.',
    timestamp: '1 hour ago',
    unread: 0,
    online: true,
    project: 'Riyadh Metro Extension'
  },
  {
    id: '3',
    name: 'Mohammed Al-Mansour',
    role: 'HVAC Specialist',
    company: 'Climate Control Experts',
    avatar: '',
    lastMessage: 'Thank you for choosing me. I have completed the HVAC survey report.',
    timestamp: '3 hours ago',
    unread: 1,
    online: false,
    project: 'NEOM Infrastructure'
  },
  {
    id: '4',
    name: 'Khalid Al-Saud',
    role: 'Civil Engineer',
    company: 'SCE License #12345',
    avatar: '',
    lastMessage: 'The site inspection is scheduled for Thursday at 9 AM. See you there!',
    timestamp: 'Yesterday',
    unread: 0,
    online: false,
    project: 'Jeddah Highway Expansion'
  },
  {
    id: '5',
    name: 'Noura Al-Qahtani',
    role: 'Project Manager',
    company: 'Engineering Solutions Ltd',
    avatar: '',
    lastMessage: 'Can we schedule a call to discuss the project timeline?',
    timestamp: '2 days ago',
    unread: 0,
    online: false,
  }
];

const sampleMessages: Message[] = [
  {
    id: 'm1',
    sender: 'them',
    content: 'Hello! Thank you for considering me for the Al-Khobar project. I have reviewed the project requirements.',
    timestamp: '10:30 AM',
    status: 'read'
  },
  {
    id: 'm2',
    sender: 'me',
    content: 'Great! Do you have experience with commercial buildings of this scale?',
    timestamp: '10:32 AM',
    status: 'read'
  },
  {
    id: 'm3',
    sender: 'them',
    content: 'Yes, I have worked on 15+ commercial projects over the past 8 years, including 3 in Al-Khobar. I can provide references if needed.',
    timestamp: '10:35 AM',
    status: 'read'
  },
  {
    id: 'm4',
    sender: 'me',
    content: 'Perfect! When would you be available to start the structural analysis?',
    timestamp: '10:38 AM',
    status: 'read'
  },
  {
    id: 'm5',
    sender: 'them',
    content: 'I can start the structural analysis next Monday. Would that timeline work for your project?',
    timestamp: '10:40 AM',
    status: 'delivered'
  }
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredConversations = sampleConversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.project?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'unread' && conv.unread > 0);
    return matchesSearch && matchesFilter;
  });

  const totalUnread = sampleConversations.reduce((sum, conv) => sum + conv.unread, 0);

  return (
    <div className="flex h-screen bg-background">

      {/* Sidebar */}
      <div className={`${isCollapsed ? 'w-20' : 'w-80'} border-r border-sidebar-border bg-muted/30 flex flex-col transition-all duration-300`}>
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-4">
            {!isCollapsed ? (
              <h1 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Messages
              </h1>
            ) : (
              <div className="flex justify-center w-full">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {!isCollapsed && (
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Messages</div>
                    <div className="text-xs text-muted-foreground">Communicate with engineers</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {/* Handle new message */}}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Search and Filters */}
        {!isCollapsed && (
          <div className="p-4 space-y-3 border-b border-sidebar-border">
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
              <TabsList className="relative z-10 flex w-full rounded-xl bg-card border border-border pt-1 pr-1 pb-1 pl-1 gap-1 shadow-lg shadow-inner shadow-top">
                <TabsTrigger value="all" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-accent/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">
                  All ({sampleConversations.length})
                </TabsTrigger>
                <TabsTrigger value="unread" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-accent/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">
                  Unread ({totalUnread})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Conversations List */}
        <div className={`${isCollapsed ? 'p-2' : 'p-4'} flex-1`}>
          <ScrollArea className="flex-1 h-full">
            <div className="space-y-1">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No conversations found</p>
                  <p className="text-xs text-muted-foreground mt-1">Start a new conversation to connect with engineers</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
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
                      {!isCollapsed && (
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
                      )}
                      {conv.unread > 0 && (
                        <Badge className="bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center text-[9px] shrink-0">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="font-medium">
                  {selectedConversation?.name || 'Messages'}
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {selectedConversation ? (
                    <>
                      <Badge variant="outline" className="text-xs">
                        {selectedConversation.role} • {selectedConversation.company}
                      </Badge>
                      {selectedConversation.online && (
                        <Badge variant="outline" className="text-xs text-green-600">
                          Online
                        </Badge>
                      )}
                    </>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Select a conversation
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedConversation && (
                <>
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Info className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 h-0">
          <div className="space-y-4">
            {selectedConversation ? (
              <>
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
              </>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  Choose a conversation from the list to start messaging with engineers
                </p>
                <div className="flex gap-2">
                  <Button onClick={() => {/* Handle new conversation */}}>
                    <Plus className="w-4 h-4 mr-2" />
                    Start New Conversation
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Message Composer */}
        {selectedConversation && (
          <div className="p-4 border-t border-sidebar-border bg-background">
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
        )}
      </div>
    </div>
  );
}
