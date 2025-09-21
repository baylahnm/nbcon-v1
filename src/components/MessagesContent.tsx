import { useState } from "react";
import { 
  MessageSquare,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Send,
  Smile,
  Image,
  FileText,
  Download,
  Building,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Pin,
  Archive,
  Trash2,
  Plus,
  Filter,
  Circle,
  Shield,
  Camera,
  Mic,
  MapPin,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
  type: "text" | "file" | "image" | "system";
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isRead: boolean;
  reactions?: { emoji: string; count: number; users: string[] }[];
}

interface Conversation {
  id: string;
  name: string;
  type: "project" | "direct" | "group";
  participants: Participant[];
  lastMessage: Message;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  projectId?: string;
  projectName?: string;
  avatar?: string;
  status: "online" | "offline" | "away";
}

interface Participant {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  company?: string;
}

const sampleConversations: Conversation[] = [
  {
    id: "1",
    name: "NEOM Smart City - Project Team",
    type: "project",
    participants: [
      { id: "u1", name: "Ahmed Al-Rashid", role: "Project Manager", status: "online", company: "NEOM Development" },
      { id: "u2", name: "Sarah Johnson", role: "Lead Engineer", status: "online", company: "NEOM Development" },
      { id: "u3", name: "Mohammad Al-Fahad", role: "Site Supervisor", status: "away", company: "NEOM Development" }
    ],
    lastMessage: {
      id: "m1",
      senderId: "u1",
      senderName: "Ahmed Al-Rashid",
      senderRole: "Project Manager",
      content: "The site survey report has been approved. Please proceed with Phase 2 design submissions.",
      timestamp: "2024-01-15T10:30:00Z",
      type: "text",
      isRead: false
    },
    unreadCount: 3,
    isPinned: true,
    isArchived: false,
    projectId: "p1",
    projectName: "NEOM Smart City Infrastructure",
    status: "online"
  },
  {
    id: "2",
    name: "Dr. Khalid Al-Mutairi",
    type: "direct",
    participants: [
      { id: "u4", name: "Dr. Khalid Al-Mutairi", role: "Technical Reviewer", status: "online", company: "Saudi Aramco" }
    ],
    lastMessage: {
      id: "m2",
      senderId: "u4",
      senderName: "Dr. Khalid Al-Mutairi",
      senderRole: "Technical Reviewer",
      content: "I've reviewed your mechanical systems design. Minor revisions needed on sections 3.2 and 4.1.",
      timestamp: "2024-01-15T09:45:00Z",
      type: "text",
      isRead: true
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    status: "online"
  },
  {
    id: "3",
    name: "Red Sea Development - Engineering",
    type: "group",
    participants: [
      { id: "u5", name: "Fatima Al-Zahra", role: "Environmental Engineer", status: "online", company: "Red Sea Global" },
      { id: "u6", name: "Omar Hassan", role: "Marine Engineer", status: "offline", company: "Red Sea Global" },
      { id: "u7", name: "Nadia Rahman", role: "Project Coordinator", status: "away", company: "Red Sea Global" }
    ],
    lastMessage: {
      id: "m3",
      senderId: "u5",
      senderName: "Fatima Al-Zahra",
      senderRole: "Environmental Engineer",
      content: "Environmental impact assessment completed. Uploading final report now.",
      timestamp: "2024-01-15T08:20:00Z",
      type: "file",
      fileName: "Environmental_Impact_Assessment_RedSea_Final.pdf",
      fileSize: 2.4 * 1024 * 1024,
      isRead: true
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    status: "online"
  },
  {
    id: "4",
    name: "Aramco Refinery - Safety Team",
    type: "project",
    participants: [
      { id: "u8", name: "Hassan Al-Qahtani", role: "Safety Manager", status: "online", company: "Saudi Aramco" },
      { id: "u9", name: "Ali Bin Rashid", role: "Safety Inspector", status: "online", company: "Saudi Aramco" }
    ],
    lastMessage: {
      id: "m4",
      senderId: "u8",
      senderName: "Hassan Al-Qahtani",
      senderRole: "Safety Manager",
      content: "Safety protocols have been updated. Please review before tomorrow's site visit.",
      timestamp: "2024-01-14T16:15:00Z",
      type: "text",
      isRead: true
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    projectId: "p2",
    projectName: "Aramco Refinery Expansion",
    status: "online"
  }
];

const sampleMessages: Message[] = [
  {
    id: "msg1",
    senderId: "u1",
    senderName: "Ahmed Al-Rashid",
    senderRole: "Project Manager",
    content: "Good morning team! I hope everyone is ready for today's milestone review meeting.",
    timestamp: "2024-01-15T08:00:00Z",
    type: "text",
    isRead: true
  },
  {
    id: "msg2",
    senderId: "current",
    senderName: "Nasser Baylah",
    senderRole: "Engineer",
    content: "Good morning Ahmed! Yes, I have the structural analysis report ready for presentation.",
    timestamp: "2024-01-15T08:05:00Z",
    type: "text",
    isRead: true
  },
  {
    id: "msg3",
    senderId: "u2",
    senderName: "Sarah Johnson",
    senderRole: "Lead Engineer",
    content: "I've uploaded the updated architectural drawings to the project folder.",
    timestamp: "2024-01-15T08:10:00Z",
    type: "file",
    fileName: "NEOM_Architectural_Drawings_v2.3.dwg",
    fileSize: 15.7 * 1024 * 1024,
    isRead: true
  },
  {
    id: "msg4",
    senderId: "system",
    senderName: "System",
    senderRole: "System",
    content: "Nasser Baylah has checked in to the NEOM site at 08:15 AM",
    timestamp: "2024-01-15T08:15:00Z",
    type: "system",
    isRead: true
  },
  {
    id: "msg5",
    senderId: "u3",
    senderName: "Mohammad Al-Fahad",
    senderRole: "Site Supervisor",
    content: "Site conditions are good for today's inspection. Weather is clear and all safety protocols are in place.",
    timestamp: "2024-01-15T08:30:00Z",
    type: "text",
    isRead: true
  },
  {
    id: "msg6",
    senderId: "current",
    senderName: "Nasser Baylah",
    senderRole: "Engineer",
    content: "Perfect! I'll start with the foundation inspection and work my way up to the structural elements.",
    timestamp: "2024-01-15T08:35:00Z",
    type: "text",
    isRead: true
  },
  {
    id: "msg7",
    senderId: "u1",
    senderName: "Ahmed Al-Rashid",
    senderRole: "Project Manager",
    content: "The site survey report has been approved. Please proceed with Phase 2 design submissions.",
    timestamp: "2024-01-15T10:30:00Z",
    type: "text",
    isRead: false,
    reactions: [{ emoji: "👍", count: 2, users: ["u2", "u3"] }]
  }
];

export function MessagesContent() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(sampleConversations[0]);
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unread" | "pinned" | "projects">("all");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: "current",
      senderName: "Nasser Baylah",
      senderRole: "Engineer",
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: "text",
      isRead: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString("en-SA");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const filteredConversations = sampleConversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = (() => {
      switch (filterType) {
        case "unread": return conv.unreadCount > 0;
        case "pinned": return conv.isPinned;
        case "projects": return conv.type === "project";
        default: return true;
      }
    })();

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 flex h-screen overflow-hidden">
      {/* Conversations Sidebar */}
      <div className={`${isCollapsed ? 'w-20' : 'w-80'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            {!isCollapsed && (
              <h1 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Messages
              </h1>
            )}
            {isCollapsed && (
              <div className="flex justify-center w-full">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
            )}
            <div className="flex items-center gap-2">
              {!isCollapsed && (
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="mr-2"
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative mb-3">
            {!isCollapsed ? (
              <>
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </>
            ) : (
              <div className="flex justify-center">
                <Button size="sm" variant="outline" className="p-2">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Filters */}
          {!isCollapsed && (
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conversations</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="pinned">Pinned</SelectItem>
                  <SelectItem value="projects">Projects</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center">
              <Button size="sm" variant="outline" className="p-2">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className={`${isCollapsed ? 'p-1' : 'p-2'} space-y-1`}>
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`${isCollapsed ? 'p-2' : 'p-3'} rounded-lg cursor-pointer transition-colors ${
                  selectedConversation.id === conversation.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                {!isCollapsed ? (
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {conversation.type === "project" ? (
                            <Building className="w-5 h-5" />
                          ) : conversation.type === "group" ? (
                            <Users className="w-5 h-5" />
                          ) : (
                            conversation.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(conversation.status)}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          <h4 className="font-medium truncate">{conversation.name}</h4>
                          {conversation.isPinned && <Pin className="w-3 h-3 text-muted-foreground" />}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-primary text-primary-foreground text-xs min-w-5 h-5 rounded-full flex items-center justify-center">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {conversation.projectName && (
                        <div className="text-xs text-muted-foreground mb-1">
                          {conversation.projectName}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground truncate flex-1">
                          {conversation.lastMessage.type === "file" ? (
                            <span className="flex items-center gap-1">
                              <Paperclip className="w-3 h-3" />
                              {conversation.lastMessage.fileName}
                            </span>
                          ) : (
                            conversation.lastMessage.content
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center relative">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {conversation.type === "project" ? (
                          <Building className="w-5 h-5" />
                        ) : conversation.type === "group" ? (
                          <Users className="w-5 h-5" />
                        ) : (
                          conversation.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(conversation.status)}`} />
                    {conversation.unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs min-w-4 h-4 rounded-full flex items-center justify-center p-0">
                        {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                      </Badge>
                    )}
                    {conversation.isPinned && (
                      <Pin className="absolute -top-1 -left-1 w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {selectedConversation.type === "project" ? (
                    <Building className="w-5 h-5" />
                  ) : selectedConversation.type === "group" ? (
                    <Users className="w-5 h-5" />
                  ) : (
                    selectedConversation.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{selectedConversation.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Circle className={`w-2 h-2 ${getStatusColor(selectedConversation.status)}`} />
                  <span>
                    {selectedConversation.type === "project" 
                      ? `${selectedConversation.participants.length} members`
                      : selectedConversation.type === "group"
                      ? `${selectedConversation.participants.length} participants`
                      : selectedConversation.status
                    }
                  </span>
                  {selectedConversation.projectName && (
                    <>
                      <span>•</span>
                      <span>{selectedConversation.projectName}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Phone className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Video className="w-4 h-4" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48" align="end">
                  <div className="space-y-1">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Star className="w-4 h-4 mr-2" />
                      Pin Conversation
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 bg-muted/30">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => {
              const isCurrentUser = message.senderId === "current";
              const isSystem = message.type === "system";

              if (isSystem) {
                return (
                  <div key={message.id} className="flex justify-center">
                    <div className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
                      {message.content}
                    </div>
                  </div>
                );
              }

              return (
                <div key={message.id} className={`flex gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  {!isCurrentUser && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-muted-foreground text-muted-foreground text-xs">
                        {message.senderName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`max-w-lg ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
                    {!isCurrentUser && (
                      <div className="text-sm font-medium mb-1">
                        {message.senderName}
                        <span className="text-xs text-muted-foreground ml-2">{message.senderRole}</span>
                      </div>
                    )}

                    <div className={`rounded-lg px-4 py-2 ${
                      isCurrentUser 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-background border border-border'
                    }`}>
                      {message.type === "file" ? (
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded ${isCurrentUser ? 'bg-primary/20' : 'bg-muted'}`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{message.fileName}</p>
                            <p className={`text-sm ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                              {message.fileSize && formatFileSize(message.fileSize)}
                            </p>
                          </div>
                          <Button size="sm" variant={isCurrentUser ? "ghost" : "outline"}>
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <p>{message.content}</p>
                      )}

                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {message.reactions.map((reaction, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {reaction.emoji} {reaction.count}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={`text-xs text-muted-foreground mt-1 ${isCurrentUser ? 'text-right' : ''}`}>
                      {formatTime(message.timestamp)}
                      {isCurrentUser && <CheckCircle className="w-3 h-3 inline ml-1" />}
                    </div>
                  </div>

                  {isCurrentUser && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">NB</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 bg-background border-t border-border">
          <div className="flex items-end gap-3 w-full max-w-full mx-auto">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Button size="sm" variant="outline">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Image className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <div className="relative">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="resize-none pr-20"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <Button size="sm" variant="ghost">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90" 
              disabled={!newMessage.trim()}
              onClick={handleSendMessage}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Participants Sidebar (Optional) */}
      <div className="w-64 bg-background border-l border-border p-4 hidden xl:block">
        <h3 className="font-medium mb-4">
          {selectedConversation.type === "project" ? "Project Team" : "Participants"}
        </h3>
        <div className="space-y-3">
          {selectedConversation.participants.map((participant) => (
            <div key={participant.id} className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-muted-foreground text-muted-foreground text-xs">
                    {participant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(participant.status)}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{participant.name}</p>
                <p className="text-xs text-muted-foreground truncate">{participant.role}</p>
                {participant.company && (
                  <p className="text-xs text-muted-foreground truncate">{participant.company}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedConversation.projectId && (
          <>
            <Separator className="my-4" />
            <div>
              <h4 className="font-medium mb-3">Project Info</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedConversation.projectName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Active Project</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span>SCE Compliant</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
