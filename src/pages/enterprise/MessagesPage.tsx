import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Search, 
  Plus,
  MessageCircle,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Send,
  Users,
  Settings,
  Archive,
  Star,
  Pin,
  Bell,
  BellOff
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// import nasserAvatar from 'figma:asset/f2bc29563152738b3b8753fd7fa0f8faad491914.png';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: string;
  participantName: string;
  participantAvatar?: string;
  participantRole: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  isPinned?: boolean;
}

export function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const [newParticipant, setNewParticipant] = useState('');
  const [newSubject, setNewSubject] = useState('');

  // Sample conversations data
  const conversations: Conversation[] = [
    {
      id: '1',
      participantName: 'Nasser Baylah',
      participantAvatar: '/api/placeholder/32/32',
      participantRole: 'Project Manager',
      lastMessage: 'How are you doing today? Are you free tonight?',
      timestamp: '2m',
      unreadCount: 2,
      isOnline: true,
      isPinned: true
    },
    {
      id: '2',
      participantName: 'Engineering Team',
      participantRole: 'Team Channel',
      lastMessage: 'Updated the project specifications...',
      timestamp: '1h',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '3',
      participantName: 'Sarah Johnson',
      participantRole: 'Client Manager',
      lastMessage: 'Thanks for the update on the project',
      timestamp: '3h',
      unreadCount: 1,
      isOnline: true
    },
    {
      id: '4',
      participantName: 'Ahmed Al-Rashid',
      participantRole: 'Senior Engineer',
      lastMessage: 'The technical review is complete',
      timestamp: '1d',
      unreadCount: 0,
      isOnline: false
    }
  ];

  // Sample messages for the selected conversation
  const messages: Message[] = [
    {
      id: '1',
      senderId: '1',
      senderName: 'Nasser Baylah',
      senderAvatar: '/api/placeholder/32/32',
      content: 'I understand you\'re asking about our job, Could your payroll and my calendar for meeting with Alibaba project manager. Let me help you with that. Based on the information provided, I can offer some insights and recommendations. Would you like me to elaborate on any specific aspect?',
      timestamp: 'Jun 7, 11:43 PM',
      isOwn: false,
      status: 'read'
    },
    {
      id: '2',
      senderId: 'user',
      senderName: 'You',
      content: 'I understand you\'re asking about our. Let me help you with that. Based on the information provided, I can offer some insights and recommendations. Would you like me to elaborate on any specific aspect?',
      timestamp: 'Jun 7, 11:43 PM',
      isOwn: true,
      status: 'read'
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'Nasser Baylah',
      senderAvatar: '/api/placeholder/32/32',
      content: 'How are you doing today? Are you free tonight?',
      timestamp: 'Just now',
      isOwn: false,
      status: 'delivered'
    }
  ];

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold">Messages</h1>
              <p className="text-sm text-muted-foreground">
                Communicate with your team and clients
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button size="sm" className="gap-2" onClick={() => setIsNewConversationOpen(true)}>
            <Plus className="h-4 w-4" />
            New Conversation
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <ScrollArea className="flex-1">
                <div className="p-2">
                  <div className="text-xs font-medium text-muted-foreground px-2 py-2 uppercase tracking-wider">
                    All Conversations
                  </div>
                  
                  {conversations.map((conversation) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`
                        flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors
                        ${selectedConversation === conversation.id 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'hover:bg-muted/50'
                        }
                      `}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.participantAvatar} />
                          <AvatarFallback>
                            {conversation.participantName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                        )}
                        {conversation.isPinned && (
                          <Pin className="absolute -top-1 -right-1 h-3 w-3 text-primary" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{conversation.participantName}</p>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={(e) => { e.stopPropagation(); window.location.assign(`/enterprise/messages/${conversation.id}`); }}>Open</Button>
                            <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="h-5 w-5 p-0 text-xs rounded-full">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{conversation.participantRole}</p>
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
            {currentConversation && (
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={currentConversation.participantAvatar} />
                      <AvatarFallback>
                        {currentConversation.participantName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {currentConversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{currentConversation.participantName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {currentConversation.isOnline ? 'Active now' : currentConversation.participantRole}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Star className="h-4 w-4 mr-2" />
                        Star Conversation
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BellOff className="h-4 w-4 mr-2" />
                        Mute Notifications
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} group`}
                  >
                    <div className={`flex space-x-2 max-w-[70%] ${message.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {!message.isOwn && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.senderAvatar} />
                          <AvatarFallback>
                            {message.senderName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`space-y-1 ${message.isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className={`
                          px-4 py-2 rounded-2xl max-w-full break-words
                          ${message.isOwn 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                          }
                        `}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        
                        <div className={`flex items-center space-x-2 text-xs text-muted-foreground ${message.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <span>{message.timestamp}</span>
                          {message.isOwn && message.status && (
                            <div className="flex">
                              {message.status === 'sent' && <span>✓</span>}
                              {message.status === 'delivered' && <span>✓✓</span>}
                              {message.status === 'read' && <span className="text-blue-500">✓✓</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-end space-x-2">
                <Button variant="ghost" size="sm" className="shrink-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  size="sm" 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Participants Sidebar */}
        <div className="col-span-3 space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Participants
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Participants will appear here when project implementation.
              </p>
              
              {currentConversation && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 rounded-lg border">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentConversation.participantAvatar} />
                      <AvatarFallback>
                        {currentConversation.participantName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{currentConversation.participantName}</p>
                      <p className="text-xs text-muted-foreground">{currentConversation.participantRole}</p>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${currentConversation.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Users className="h-4 w-4" />
                  Create Group Chat
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Settings className="h-4 w-4" />
                  Chat Settings
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Archive className="h-4 w-4" />
                  Archived Messages
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Conversation Dialog */}
      <Dialog open={isNewConversationOpen} onOpenChange={setIsNewConversationOpen}>
        <DialogContent className="fixed right-0 top-0 h-svh w-[50vw] max-w-none translate-x-0 translate-y-0 left-auto grid overflow-hidden">
          <DialogHeader>
            <DialogTitle>Start New Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Participant</label>
              <Input
                placeholder="Enter name or email"
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Subject</label>
              <Input
                placeholder="Conversation subject (optional)"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewConversationOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                // Minimal stub: close dialog and (optionally) set a selected conversation
                setIsNewConversationOpen(false);
              }}
              disabled={!newParticipant.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}