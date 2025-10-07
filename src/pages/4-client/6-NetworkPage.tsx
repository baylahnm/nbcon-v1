import { useState } from 'react';
import { useAuthStore } from './others/stores/auth';
import { getUserDisplayName, getUserInitials } from '@/lib/userUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessagingPage } from '@/pages/messaging/MessagingPage';
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  Calendar, 
  Mail,
  Search,
  Plus,
  Bell,
  Settings,
  MapPin,
  Building2,
  Star,
  Clock,
  TrendingUp,
  Filter,
  MoreHorizontal,
  Heart,
  Share2,
  Bookmark,
  Eye,
  ChevronRight,
  CheckCircle2,
  X,
  UserCheck,
  UserMinus,
  Send,
  ExternalLink,
  Hash,
  Play,
  FileText,
  Image as ImageIcon,
  Video,
  Mic,
  Award,
  Shield,
  Globe,
  Phone,
  Briefcase,
  GraduationCap,
  Target,
  Activity,
  BarChart3,
  BookOpen,
  Newspaper,
  Megaphone,
  Zap,
  RefreshCw
} from 'lucide-react';

// Comprehensive TypeScript interfaces for professional networking
interface NetworkConnection {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  specialty: string;
  experience: string;
  avatar?: string;
  verified: boolean;
  sceLicense?: string;
  connectionDate: string;
  connectionStrength: 'weak' | 'medium' | 'strong';
  mutualConnections: number;
  isFollowing: boolean;
  lastActive: string;
  recentActivity?: string;
  projects: number;
  endorsements: number;
  companyLogo?: string;
  education?: string;
  certifications?: string[];
}

interface ConnectionRequest {
  id: string;
  requester: {
    id: string;
    name: string;
    title: string;
    company: string;
    avatar?: string;
    verified: boolean;
  };
  message?: string;
  timestamp: string;
  mutualConnections: number;
}

interface NetworkActivity {
  id: string;
  type: 'connection' | 'project' | 'certification' | 'endorsement' | 'post';
  user: {
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  relatedTo?: string;
}

interface NetworkStats {
  totalConnections: number;
  newThisWeek: number;
  pendingRequests: number;
  mutualConnections: number;
  profileViews: number;
  endorsements: number;
}

// Mock data for demonstration
const mockConnections: NetworkConnection[] = [
  {
    id: '1',
    name: 'Ahmed Al-Rashid',
    title: 'Senior Structural Engineer',
    company: 'Saudi Aramco',
    location: 'Riyadh, Saudi Arabia',
    specialty: 'Structural Analysis',
    experience: '12 years',
    avatar: '/api/placeholder/40/40',
    verified: true,
    sceLicense: 'SCE-12345',
    connectionDate: '2024-01-15',
    connectionStrength: 'strong',
    mutualConnections: 8,
    isFollowing: true,
    lastActive: '2 hours ago',
    recentActivity: 'Completed structural analysis for NEOM project',
    projects: 45,
    endorsements: 23,
    education: 'MS Civil Engineering - KFUPM',
    certifications: ['PMP', 'PE License']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    title: 'Project Manager',
    company: 'Bechtel Corporation',
    location: 'Jeddah, Saudi Arabia',
    specialty: 'Project Management',
    experience: '8 years',
    avatar: '/api/placeholder/40/40',
    verified: true,
    connectionDate: '2024-02-03',
    connectionStrength: 'medium',
    mutualConnections: 3,
    isFollowing: false,
    lastActive: '1 day ago',
    projects: 28,
    endorsements: 15,
    education: 'MBA - Stanford University',
    certifications: ['PMP', 'Agile Certified']
  },
  {
    id: '3',
    name: 'Mohammed Al-Zahrani',
    title: 'Electrical Engineer',
    company: 'ACWA Power',
    location: 'Dammam, Saudi Arabia',
    specialty: 'Power Systems',
    experience: '6 years',
    avatar: '/api/placeholder/40/40',
    verified: true,
    sceLicense: 'SCE-67890',
    connectionDate: '2024-01-28',
    connectionStrength: 'weak',
    mutualConnections: 1,
    isFollowing: false,
    lastActive: '3 days ago',
    projects: 19,
    endorsements: 8,
    education: 'BS Electrical Engineering - KFUPM',
    certifications: ['PE License']
  }
];

const mockConnectionRequests: ConnectionRequest[] = [
  {
    id: 'req1',
    requester: {
      id: 'user4',
      name: 'Fatima Al-Mansouri',
      title: 'Civil Engineer',
      company: 'SABIC',
      avatar: '/api/placeholder/40/40',
      verified: true
    },
    message: 'Hi! I noticed we both work on renewable energy projects. Would love to connect!',
    timestamp: '2 hours ago',
    mutualConnections: 5
  },
  {
    id: 'req2',
    requester: {
      id: 'user5',
      name: 'David Chen',
      title: 'Mechanical Engineer',
      company: 'Fluor Corporation',
      avatar: '/api/placeholder/40/40',
      verified: false
    },
    message: 'Looking to expand my network in the Saudi market. Let\'s connect!',
    timestamp: '1 day ago',
    mutualConnections: 2
  }
];

const mockNetworkActivity: NetworkActivity[] = [
  {
    id: 'act1',
    type: 'connection',
    user: { name: 'Ahmed Al-Rashid', avatar: '/api/placeholder/32/32' },
    content: 'connected with Sarah Johnson',
    timestamp: '2 hours ago'
  },
  {
    id: 'act2',
    type: 'project',
    user: { name: 'Mohammed Al-Zahrani', avatar: '/api/placeholder/32/32' },
    content: 'completed a new solar power project',
    timestamp: '4 hours ago',
    relatedTo: 'ACWA Power Solar Farm'
  },
  {
    id: 'act3',
    type: 'certification',
    user: { name: 'Fatima Al-Mansouri', avatar: '/api/placeholder/32/32' },
    content: 'earned PMP certification',
    timestamp: '1 day ago'
  }
];

const mockStats: NetworkStats = {
  totalConnections: 156,
  newThisWeek: 5,
  pendingRequests: 2,
  mutualConnections: 89,
  profileViews: 45,
  endorsements: 12
};

export default function NetworkPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('connections');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showMessaging, setShowMessaging] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<NetworkConnection | null>(null);

  const filteredConnections = mockConnections.filter(connection => {
    const matchesSearch = connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         connection.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         connection.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterSpecialty === 'all' || connection.specialty === filterSpecialty;
    return matchesSearch && matchesFilter;
  });

  const handleAcceptRequest = (requestId: string) => {
    // Handle accept logic
    console.log('Accepting request:', requestId);
  };

  const handleDeclineRequest = (requestId: string) => {
    // Handle decline logic
    console.log('Declining request:', requestId);
  };

  const handleConnect = (connectionId: string) => {
    // Handle connect logic
    console.log('Connecting with:', connectionId);
  };

  const handleFollow = (connectionId: string) => {
    // Handle follow logic
    console.log('Following:', connectionId);
  };

  const handleMessage = (connection: NetworkConnection) => {
    setSelectedConnection(connection);
    setShowMessaging(true);
  };

  if (showMessaging && selectedConnection) {
    return (
      <MessagingPage 
        onBack={() => setShowMessaging(false)}
        recipient={selectedConnection}
      />
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            My Network
          </h1>
          <p className="text-muted-foreground">Build and manage your professional connections</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Find Connections
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">{mockStats.totalConnections}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">{mockStats.newThisWeek}</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">{mockStats.pendingRequests}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">{mockStats.mutualConnections}</p>
                <p className="text-xs text-muted-foreground">Mutual</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-indigo-600" />
              <div>
                <p className="text-sm font-medium">{mockStats.profileViews}</p>
                <p className="text-xs text-muted-foreground">Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">{mockStats.endorsements}</p>
                <p className="text-xs text-muted-foreground">Endorsements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="connections">Connections ({mockConnections.length})</TabsTrigger>
          <TabsTrigger value="requests">
            Requests ({mockConnectionRequests.length})
            {mockConnectionRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-4 w-4 rounded-full p-0 text-xs">
                {mockConnectionRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Connections Tab */}
        <TabsContent value="connections" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search connections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="Structural Analysis">Structural Analysis</SelectItem>
                  <SelectItem value="Project Management">Project Management</SelectItem>
                  <SelectItem value="Power Systems">Power Systems</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="mutual">Mutual Connections</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Connections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConnections.map((connection) => (
              <Card key={connection.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={connection.avatar} alt={connection.name} />
                      <AvatarFallback>{getUserInitials(connection.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{connection.name}</h3>
                        {connection.verified && (
                          <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{connection.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{connection.company}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{connection.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Specialty:</span>
                      <Badge variant="secondary">{connection.specialty}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Experience:</span>
                      <span>{connection.experience}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Mutual:</span>
                      <span>{connection.mutualConnections} connections</span>
                    </div>
                    {connection.recentActivity && (
                      <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                        <Activity className="h-3 w-3 inline mr-1" />
                        {connection.recentActivity}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleMessage(connection)}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleFollow(connection.id)}
                    >
                      {connection.isFollowing ? (
                        <UserCheck className="h-3 w-3" />
                      ) : (
                        <UserPlus className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Connection Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          {mockConnectionRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                <p className="text-muted-foreground">You're all caught up!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {mockConnectionRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={request.requester.avatar} alt={request.requester.name} />
                        <AvatarFallback>{getUserInitials(request.requester.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{request.requester.name}</h3>
                          {request.requester.verified && (
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{request.requester.title}</p>
                        <p className="text-sm text-muted-foreground">{request.requester.company}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {request.mutualConnections} mutual connections
                        </p>
                        {request.message && (
                          <p className="text-sm mt-2 p-2 bg-muted rounded">{request.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" onClick={() => handleAcceptRequest(request.id)}>
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeclineRequest(request.id)}
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <div className="space-y-4">
            {mockNetworkActivity.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                      <AvatarFallback>{getUserInitials(activity.user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user.name}</span>{' '}
                        {activity.content}
                      </p>
                      {activity.relatedTo && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Related to: {activity.relatedTo}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
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
