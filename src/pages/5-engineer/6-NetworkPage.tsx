import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from './others/stores/auth';
import { getUserDisplayName, getUserInitials } from '../1-HomePage/others/lib/userUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../1-HomePage/others/components/ui/card';
import { Button } from '../1-HomePage/others/components/ui/button';
import { Input } from '../1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../1-HomePage/others/components/ui/tabs';
import { ScrollArea } from '../1-HomePage/others/components/ui/scroll-area';
import { Badge } from '../1-HomePage/others/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../1-HomePage/others/components/ui/avatar';
import { Separator } from '../1-HomePage/others/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../1-HomePage/others/components/ui/select';
import { AiMessagingContent } from '../1-HomePage/others/components/messaging/AiMessagingContent';
import { NetworkConnectionCard } from './others/features/network/components/NetworkConnectionCard';
import { ConnectionRequestCard } from './others/features/network/components/ConnectionRequestCard';
import { ActivityFeedItem } from './others/features/network/components/ActivityFeedItem';
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
  totalConnections: 247,
  newThisWeek: 8,
  pendingRequests: 2,
  mutualConnections: 156,
  profileViews: 89,
  endorsements: 34
};

// ============================================================================
// STAT CARD COMPONENT - MOUSE-TRACKING ANIMATION
// ============================================================================

interface StatCardProps {
  stat: {
    icon: React.ElementType;
    label: string;
    value: number;
    colors: {
      bg: string;
      icon: string;
      ring: string;
    };
    trend?: number;
  };
  StatIcon: React.ElementType;
}

function StatCardWithAnimation({ stat, StatIcon }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const angle = Math.atan2(y - centerY, x - centerX);
      card.style.setProperty('--rotation', `${angle}rad`);
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden transition-all duration-300"
      style={{
        '--rotation': '4.2rad',
        border: '2px solid transparent',
        borderRadius: '0.75rem',
        backgroundImage: `
          linear-gradient(hsl(var(--card)), hsl(var(--card))),
          linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      } as React.CSSProperties}
    >
      <Card className="bg-transparent border-0 group">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="bg-primary h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-md group-hover:scale-110 transition-transform">
                <StatIcon className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight">{stat.value}</p>
              {stat.trend ? (
                <div className="flex items-center gap-1 text-xs mt-1.5 font-medium text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+{stat.trend}%</span>
                </div>
              ) : (
                <div className="h-[20px] mt-1.5" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// MAIN NETWORK PAGE COMPONENT
// ============================================================================

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
      <AiMessagingContent 
        onBack={() => setShowMessaging(false)}
        conversationId={selectedConnection.id}
      />
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            My Network
          </h1>
          <p className="text-xs text-muted-foreground">Build and manage your professional connections</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh
          </Button>
          <Button size="sm" className="h-8 text-xs">
            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
            Find Connections
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { icon: Users, label: 'Total', value: mockStats.totalConnections, colors: { bg: 'bg-blue-500/10', icon: 'text-blue-600', ring: 'ring-blue-500/20' } },
          { icon: UserPlus, label: 'This Week', value: mockStats.newThisWeek, colors: { bg: 'bg-green-500/10', icon: 'text-green-600', ring: 'ring-green-500/20' }, trend: 12 },
          { icon: Bell, label: 'Pending', value: mockStats.pendingRequests, colors: { bg: 'bg-amber-500/10', icon: 'text-amber-600', ring: 'ring-amber-500/20' } },
          { icon: Heart, label: 'Mutual', value: mockStats.mutualConnections, colors: { bg: 'bg-purple-500/10', icon: 'text-purple-600', ring: 'ring-purple-500/20' } },
          { icon: Eye, label: 'Views', value: mockStats.profileViews, colors: { bg: 'bg-blue-500/10', icon: 'text-blue-600', ring: 'ring-blue-500/20' } },
          { icon: Award, label: 'Endorsements', value: mockStats.endorsements, colors: { bg: 'bg-green-500/10', icon: 'text-green-600', ring: 'ring-green-500/20' } }
        ].map((stat, index) => {
          const StatIcon = stat.icon;
          return (
            <StatCardWithAnimation 
              key={index} 
              stat={stat} 
              StatIcon={StatIcon} 
            />
          );
        })}
      </div>

      {/* Search and Filters */}
      <Card className="border-border/50">
        <CardContent className="p-2">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, company, specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                <SelectTrigger className="w-[180px] h-9 text-xs">
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
                <SelectTrigger className="w-[140px] h-9 text-xs">
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
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full grid grid-cols-3 gap-0 h-9">
          <TabsTrigger value="connections" className="text-xs">
            Connections ({mockConnections.length})
          </TabsTrigger>
          <TabsTrigger value="requests" className="text-xs">
            Requests ({mockConnectionRequests.length})
            {mockConnectionRequests.length > 0 && (
              <Badge className="ml-1.5 h-4 min-w-4 rounded-full px-1 text-[10px] bg-amber-500 text-white border-0">
                {mockConnectionRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-xs">
            Activity
          </TabsTrigger>
        </TabsList>

        {/* Connections Tab */}
        <TabsContent value="connections" className="space-y-4 mt-4">

          {/* Connections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConnections.map((connection) => (
              <NetworkConnectionCard
                key={connection.id}
                connection={connection}
                onMessage={(id) => handleMessage(connection)}
                onViewProfile={(id) => console.log('View profile:', id)}
                onEndorse={(id) => console.log('Endorse:', id)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Connection Requests Tab */}
        <TabsContent value="requests" className="space-y-4 mt-4">
          {mockConnectionRequests.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-base font-bold mb-2">No pending requests</h3>
                <p className="text-xs text-muted-foreground mb-6">
                  You're all caught up! When someone wants to connect, you'll see their request here.
                </p>
                <Button className="h-8 text-xs shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                  Find People to Connect
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {mockConnectionRequests.map((request) => (
                <ConnectionRequestCard
                  key={request.id}
                  request={request}
                  onAccept={handleAcceptRequest}
                  onDecline={handleDeclineRequest}
                  onViewProfile={(id) => console.log('View profile:', id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4 mt-4">
          <div className="space-y-3">
            {mockNetworkActivity.map((activity) => (
              <ActivityFeedItem
                key={activity.id}
                activity={activity}
                onClickRelated={(id) => console.log('Related clicked:', id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
