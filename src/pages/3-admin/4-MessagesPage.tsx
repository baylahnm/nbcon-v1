import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/1-HomePage/others/components/ui/tabs';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/pages/1-HomePage/others/components/ui/avatar';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Trash2,
  Flag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Calendar,
  Download,
  Upload,
  Shield,
  Mail
} from 'lucide-react';

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    role: 'engineer' | 'client' | 'enterprise' | 'admin';
    avatar?: string;
  };
  recipient: {
    id: string;
    name: string;
    role: 'engineer' | 'client' | 'enterprise' | 'admin';
    avatar?: string;
  };
  subject: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'flagged';
  isImportant: boolean;
  attachments?: string[];
  projectId?: string;
}

interface MessageStats {
  totalMessages: number;
  unreadMessages: number;
  flaggedMessages: number;
  todayMessages: number;
}

// Mock data
const mockMessages: Message[] = [
  {
    id: '1',
    sender: {
      id: 'user1',
      name: 'Ahmed Al-Rashid',
      role: 'engineer',
      avatar: '/api/placeholder/32/32'
    },
    recipient: {
      id: 'user2',
      name: 'NEOM Company',
      role: 'client',
      avatar: '/api/placeholder/32/32'
    },
    subject: 'Project Update - Structural Analysis Progress',
    content: 'I have completed the preliminary structural analysis for the NEOM infrastructure project. Please review the attached documents and let me know if you have any questions.',
    timestamp: '2024-01-20 14:30',
    status: 'read',
    isImportant: false,
    projectId: 'proj1'
  },
  {
    id: '2',
    sender: {
      id: 'user3',
      name: 'Sarah Johnson',
      role: 'client',
      avatar: '/api/placeholder/32/32'
    },
    recipient: {
      id: 'user1',
      name: 'Ahmed Al-Rashid',
      role: 'engineer',
      avatar: '/api/placeholder/32/32'
    },
    subject: 'Urgent: Budget Approval Needed',
    content: 'We need to approve the additional budget for the Riyadh Metro extension project. Please review the revised estimates and confirm your availability for a meeting tomorrow.',
    timestamp: '2024-01-20 10:15',
    status: 'read',
    isImportant: true,
    projectId: 'proj2'
  },
  {
    id: '3',
    sender: {
      id: 'user4',
      name: 'Mohammed Al-Zahrani',
      role: 'engineer',
      avatar: '/api/placeholder/32/32'
    },
    recipient: {
      id: 'user5',
      name: 'ACWA Power',
      role: 'enterprise',
      avatar: '/api/placeholder/32/32'
    },
    subject: 'Inappropriate Language in Messages',
    content: 'I have been receiving inappropriate messages from this user. Please investigate this matter.',
    timestamp: '2024-01-19 16:45',
    status: 'flagged',
    isImportant: true,
    attachments: ['screenshot1.png', 'screenshot2.png']
  },
  {
    id: '4',
    sender: {
      id: 'user6',
      name: 'Fatima Al-Mansouri',
      role: 'engineer',
      avatar: '/api/placeholder/32/32'
    },
    recipient: {
      id: 'user7',
      name: 'SABIC',
      role: 'enterprise',
      avatar: '/api/placeholder/32/32'
    },
    subject: 'Project Proposal Submission',
    content: 'I am submitting my proposal for the HVAC system design project. Please find the detailed proposal attached.',
    timestamp: '2024-01-19 09:20',
    status: 'delivered',
    isImportant: false,
    projectId: 'proj4'
  }
];

const messageStatuses = ['All', 'Sent', 'Delivered', 'Read', 'Flagged'];
const messageTypes = ['All', 'Project Related', 'General', 'Support', 'Dispute'];

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const filteredMessages = mockMessages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.recipient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || message.status === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-yellow-100 text-yellow-800';
      case 'read': return 'bg-green-100 text-green-800';
      case 'flagged': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Mail className="h-3 w-3" />;
      case 'delivered': return <CheckCircle2 className="h-3 w-3" />;
      case 'read': return <CheckCircle2 className="h-3 w-3" />;
      case 'flagged': return <AlertCircle className="h-3 w-3" />;
      default: return <Mail className="h-3 w-3" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'engineer': return 'bg-blue-100 text-blue-800';
      case 'client': return 'bg-green-100 text-green-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const mockStats: MessageStats = {
    totalMessages: mockMessages.length,
    unreadMessages: mockMessages.filter(m => m.status === 'delivered').length,
    flaggedMessages: mockMessages.filter(m => m.status === 'flagged').length,
    todayMessages: mockMessages.filter(m => m.timestamp.includes('2024-01-20')).length
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            Message Management
          </h1>
          <p className="text-muted-foreground">Monitor and manage all platform communications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Messages
          </Button>
          <Button size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Moderation Tools
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">{mockStats.totalMessages}</p>
                <p className="text-xs text-muted-foreground">Total Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">{mockStats.unreadMessages}</p>
                <p className="text-xs text-muted-foreground">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">{mockStats.flaggedMessages}</p>
                <p className="text-xs text-muted-foreground">Flagged</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">{mockStats.todayMessages}</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages by subject, content, or participants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            {messageStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            {messageTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Messages ({filteredMessages.length})</TabsTrigger>
          <TabsTrigger value="flagged">Flagged ({mockMessages.filter(m => m.status === 'flagged').length})</TabsTrigger>
          <TabsTrigger value="important">Important ({mockMessages.filter(m => m.isImportant).length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({mockMessages.filter(m => m.status === 'delivered').length})</TabsTrigger>
        </TabsList>

        {/* All Messages Tab */}
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {filteredMessages.map((message, index) => (
                  <div key={message.id} className={`flex items-start justify-between p-4 ${index !== filteredMessages.length - 1 ? 'border-b' : ''}`}>
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                          <AvatarFallback>{message.sender.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground">→</span>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={message.recipient.avatar} alt={message.recipient.name} />
                          <AvatarFallback>{message.recipient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{message.subject}</h3>
                          {message.isImportant && (
                            <Badge variant="destructive" className="text-xs">
                              Important
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-muted-foreground">
                            {message.sender.name} ({message.sender.role}) → {message.recipient.name} ({message.recipient.role})
                          </span>
                          <Badge className={getRoleColor(message.sender.role)} variant="outline">
                            {message.sender.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{message.content}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {message.timestamp}
                          </div>
                          {message.projectId && (
                            <div className="flex items-center gap-1">
                              <span>Project: {message.projectId}</span>
                            </div>
                          )}
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span>{message.attachments.length} attachments</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right">
                        <Badge className={getStatusColor(message.status)}>
                          {getStatusIcon(message.status)}
                          <span className="ml-1 capitalize">{message.status}</span>
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {message.status === 'flagged' && (
                          <Button size="sm" variant="destructive">
                            <Flag className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flagged Messages Tab */}
        <TabsContent value="flagged" className="space-y-4">
          <div className="space-y-4">
            {mockMessages.filter(m => m.status === 'flagged').map((message) => (
              <Card key={message.id} className="border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                          <AvatarFallback>{message.sender.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground">→</span>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={message.recipient.avatar} alt={message.recipient.name} />
                          <AvatarFallback>{message.recipient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{message.subject}</h3>
                          <Badge variant="destructive">Flagged</Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-muted-foreground">
                            {message.sender.name} ({message.sender.role}) → {message.recipient.name} ({message.recipient.role})
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{message.content}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {message.timestamp}
                          </div>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span>{message.attachments.length} attachments</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="destructive">
                        <Shield className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Important Messages Tab */}
        <TabsContent value="important" className="space-y-4">
          <div className="space-y-4">
            {mockMessages.filter(m => m.isImportant).map((message) => (
              <Card key={message.id} className="border-yellow-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                          <AvatarFallback>{message.sender.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground">→</span>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={message.recipient.avatar} alt={message.recipient.name} />
                          <AvatarFallback>{message.recipient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{message.subject}</h3>
                          <Badge variant="destructive">Important</Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-muted-foreground">
                            {message.sender.name} ({message.sender.role}) → {message.recipient.name} ({message.recipient.role})
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{message.content}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {message.timestamp}
                          </div>
                          {message.projectId && (
                            <div className="flex items-center gap-1">
                              <span>Project: {message.projectId}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Unread Messages Tab */}
        <TabsContent value="unread" className="space-y-4">
          <div className="space-y-4">
            {mockMessages.filter(m => m.status === 'delivered').map((message) => (
              <Card key={message.id} className="border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                          <AvatarFallback>{message.sender.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground">→</span>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={message.recipient.avatar} alt={message.recipient.name} />
                          <AvatarFallback>{message.recipient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{message.subject}</h3>
                          <Badge variant="secondary">Unread</Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-muted-foreground">
                            {message.sender.name} ({message.sender.role}) → {message.recipient.name} ({message.recipient.role})
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{message.content}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {message.timestamp}
                          </div>
                          {message.projectId && (
                            <div className="flex items-center gap-1">
                              <span>Project: {message.projectId}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Mark Read
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

