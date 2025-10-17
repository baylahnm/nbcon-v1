import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../1-HomePage/others/components/ui/card';
import { Button } from '../1-HomePage/others/components/ui/button';
import { Input } from '../1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../1-HomePage/others/components/ui/tabs';
import { Badge } from '../1-HomePage/others/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../1-HomePage/others/components/ui/avatar';
import { Progress } from '../1-HomePage/others/components/ui/progress';
import { useAuthStore } from './others/stores/auth';
import { getUserDisplayName } from '@/pages/1-HomePage/others/lib/userUtils';
import { 
  Users, 
  Search, 
  MapPin, 
  Star, 
  MessageSquare, 
  Eye,
  CheckCircle2,
  Award,
  Briefcase,
  UserPlus,
  TrendingUp,
  Bell,
  UserCheck,
  Clock,
  X,
  Target,
  MoreVertical,
  Building2,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  Shield,
  Filter,
  ArrowUpRight,
  Heart,
  Share2,
  Sparkles,
  Zap
} from 'lucide-react';

// ============================================================================
// INTERFACES
// ============================================================================

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
  connectionStrength: 'strong' | 'medium' | 'weak';
  mutualConnections: number;
  projects: number;
  endorsements: number;
  rating: number;
  reviews: number;
  lastActive: string;
  isOnline?: boolean;
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
    specialty: string;
    location: string;
  };
  message?: string;
  timestamp: string;
  mutualConnections: number;
}

interface NetworkActivity {
  id: string;
  type: 'connection' | 'project' | 'certification' | 'endorsement' | 'post' | 'update';
  user: {
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  relatedTo?: string;
}

// ============================================================================
// MOCK DATA - Professional Engineering Network
// ============================================================================

const mockConnections: NetworkConnection[] = [
  {
    id: '1',
    name: 'Ahmed Al-Rashid',
    title: 'Senior Structural Engineer',
    company: 'Saudi Aramco',
    location: 'Riyadh',
    specialty: 'Structural Analysis',
    experience: '12 years',
    verified: true,
    sceLicense: 'SCE-SE-12345',
    connectionDate: 'Jan 15, 2024',
    connectionStrength: 'strong',
    mutualConnections: 24,
    projects: 156,
    endorsements: 47,
    rating: 4.9,
    reviews: 89,
    lastActive: '2h ago',
    isOnline: true
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    title: 'Project Manager (PMP)',
    company: 'Bechtel Corporation',
    location: 'Jeddah',
    specialty: 'Project Management',
    experience: '8 years',
    verified: true,
    connectionDate: 'Feb 3, 2024',
    connectionStrength: 'strong',
    mutualConnections: 18,
    projects: 92,
    endorsements: 34,
    rating: 4.8,
    reviews: 67,
    lastActive: '5h ago',
    isOnline: false
  },
  {
    id: '3',
    name: 'Mohammed Al-Zahrani',
    title: 'Electrical Engineer',
    company: 'ACWA Power',
    location: 'Dammam',
    specialty: 'Power Systems',
    experience: '6 years',
    verified: true,
    sceLicense: 'SCE-EE-67890',
    connectionDate: 'Jan 28, 2024',
    connectionStrength: 'medium',
    mutualConnections: 12,
    projects: 64,
    endorsements: 28,
    rating: 4.7,
    reviews: 52,
    lastActive: '1d ago',
    isOnline: false
  },
  {
    id: '4',
    name: 'Noura Al-Saud',
    title: 'Environmental Consultant',
    company: 'Red Sea Global',
    location: 'Riyadh',
    specialty: 'Environmental Engineering',
    experience: '10 years',
    verified: true,
    sceLicense: 'SCE-ENV-45678',
    connectionDate: 'Feb 10, 2024',
    connectionStrength: 'strong',
    mutualConnections: 31,
    projects: 118,
    endorsements: 56,
    rating: 4.9,
    reviews: 94,
    lastActive: '30m ago',
    isOnline: true
  },
  {
    id: '5',
    name: 'Khalid Al-Mansouri',
    title: 'Mechanical Engineer',
    company: 'SABIC',
    location: 'Jubail',
    specialty: 'HVAC Systems',
    experience: '7 years',
    verified: true,
    connectionDate: 'Jan 20, 2024',
    connectionStrength: 'medium',
    mutualConnections: 15,
    projects: 73,
    endorsements: 31,
    rating: 4.6,
    reviews: 58,
    lastActive: '3h ago',
    isOnline: false
  },
  {
    id: '6',
    name: 'Layla Hassan',
    title: 'Geotechnical Engineer',
    company: 'Parsons Corporation',
    location: 'Riyadh',
    specialty: 'Geotechnical Engineering',
    experience: '9 years',
    verified: true,
    sceLicense: 'SCE-GEO-98765',
    connectionDate: 'Feb 15, 2024',
    connectionStrength: 'strong',
    mutualConnections: 27,
    projects: 105,
    endorsements: 42,
    rating: 4.8,
    reviews: 76,
    lastActive: '1h ago',
    isOnline: true
  }
];

const mockConnectionRequests: ConnectionRequest[] = [
  {
    id: 'req1',
    requester: {
      id: 'user7',
      name: 'Fatima Al-Mansouri',
      title: 'Civil Engineer',
      company: 'SABIC Engineering',
      verified: true,
      specialty: 'Highway & Bridge Design',
      location: 'Riyadh'
    },
    message: 'Hi! I noticed we both work on infrastructure projects. Would love to connect and exchange insights on the latest Saudi Building Code updates.',
    timestamp: '2 hours ago',
    mutualConnections: 8
  },
  {
    id: 'req2',
    requester: {
      id: 'user8',
      name: 'David Chen',
      title: 'Process Engineer',
      company: 'Fluor Corporation',
      verified: false,
      specialty: 'Chemical Processing',
      location: 'Jubail'
    },
    message: 'Looking to expand my professional network in the Saudi engineering market. Interested in collaboration opportunities!',
    timestamp: '1 day ago',
    mutualConnections: 3
  }
];

const mockNetworkActivity: NetworkActivity[] = [
  {
    id: 'act1',
    type: 'endorsement',
    user: { name: 'Ahmed Al-Rashid' },
    content: 'endorsed you for Structural Design',
    timestamp: '2 hours ago'
  },
  {
    id: 'act2',
    type: 'project',
    user: { name: 'Sarah Johnson' },
    content: 'completed King Abdullah Financial District Tower 3',
    timestamp: '5 hours ago',
    relatedTo: 'KAFD Development Project'
  },
  {
    id: 'act3',
    type: 'certification',
    user: { name: 'Mohammed Al-Zahrani' },
    content: 'achieved LEED AP certification',
    timestamp: '1 day ago'
  },
  {
    id: 'act4',
    type: 'connection',
    user: { name: 'Noura Al-Saud' },
    content: 'connected with Dr. Khalid Al-Mutairi',
    timestamp: '2 days ago'
  },
  {
    id: 'act5',
    type: 'post',
    user: { name: 'Layla Hassan' },
    content: 'published article on foundation systems for coastal projects',
    timestamp: '3 days ago',
    relatedTo: 'Red Sea Development Technical Journal'
  },
  {
    id: 'act6',
    type: 'update',
    user: { name: 'Khalid Al-Mansouri' },
    content: 'updated professional profile with new HVAC certifications',
    timestamp: '4 days ago'
  }
];

// ============================================================================
// STAT CARD COMPONENT - EXACT DASHBOARD STYLE
// ============================================================================

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  trend
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string | number; 
  trend?: { value: number; isPositive: boolean };
}) {
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
        border: '2px solid transparent',
        borderRadius: '0.5rem',
        backgroundImage: `
          linear-gradient(hsl(var(--card)), hsl(var(--card))),
          linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
    >
      <Card className="bg-transparent border border-border/50">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="bg-gradient-to-t from-primary to-primary-dark h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-sm shadow-primary/50">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight">{value}</p>
              {trend && (
                <div className="flex items-center gap-1 text-xs mt-1.5 font-medium text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+{trend.value}%</span>
                </div>
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
  const { profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStrength, setFilterStrength] = useState<'all' | 'strong' | 'medium' | 'weak'>('all');

  const displayName = getUserDisplayName(profile);

  // Filter connections
  const filteredConnections = mockConnections.filter(connection => {
    const matchesSearch = connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         connection.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         connection.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStrength === 'all' || connection.connectionStrength === filterStrength;
    return matchesSearch && matchesFilter;
  });

  const getUserInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(p => p[0]).join('').slice(0, 2).toUpperCase();
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return { text: 'text-green-600', bg: 'bg-green-500/10' };
      case 'medium': return { text: 'text-amber-600', bg: 'bg-amber-500/10' };
      case 'weak': return { text: 'text-red-600', bg: 'bg-red-500/10' };
      default: return { text: 'text-muted-foreground', bg: 'bg-muted' };
    }
  };

  const getStrengthValue = (strength: string) => {
    switch (strength) {
      case 'strong': return 80;
      case 'medium': return 50;
      case 'weak': return 20;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-4">
        
        {/* Header */}
        <div className="pb-4 border-b border-border/40">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-0 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20 flex-shrink-0">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary text-white text-xl font-bold">
                    {displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h1 className="text-[18px] font-bold tracking-tight">
                    Professional Network
                  </h1>
                  <p className="text-muted-foreground text-[14px] mt-0.5">
                    {getCurrentDate()} • Build meaningful connections
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="h-8 text-xs">
                  <Search className="h-3.5 w-3.5 mr-1.5" />
                  Discover
                </Button>
                <Button className="h-8 text-xs shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                  Invite
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid - Exact BrowseEngineers Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total Connections"
            value={156}
            trend={{ value: 12, isPositive: true }}
          />
          
          <StatCard
            icon={UserPlus}
            label="New This Week"
            value={5}
            trend={{ value: 25, isPositive: true }}
          />
          
          <StatCard
            icon={Bell}
            label="Pending Requests"
            value={mockConnectionRequests.length}
          />
          
          <StatCard
            icon={Award}
            label="Endorsements"
            value={89}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="relative z-10 flex w-full rounded-xl bg-card border border-border pt-1 pr-1 pb-1 pl-1 gap-1 shadow-lg shadow-inner shadow-top">
            <TabsTrigger value="all" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">
              All Connections ({mockConnections.length})
            </TabsTrigger>
            <TabsTrigger value="requests" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">
              Requests ({mockConnectionRequests.length})
              {mockConnectionRequests.length > 0 && (
                <Badge className="ml-1.5 h-4 min-w-4 rounded-full px-1 text-[10px] bg-amber-500 text-white border-0">
                  {mockConnectionRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activity" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">
              Activity
            </TabsTrigger>
          </TabsList>

          {/* All Connections Tab */}
          <TabsContent value="all" className="space-y-4 mt-4">
            {/* Search & Filter Bar */}
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="flex gap-4">
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
                    <Button
                      variant={filterStrength === 'all' ? 'default' : 'outline'}
                      onClick={() => setFilterStrength('all')}
                      className="h-9 text-xs"
                    >
                      All
                    </Button>
                    <Button
                      variant={filterStrength === 'strong' ? 'default' : 'outline'}
                      onClick={() => setFilterStrength('strong')}
                      className="h-9 text-xs"
                    >
                      <Zap className="h-3.5 w-3.5 mr-1.5" />
                      Strong
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredConnections.map((connection) => {
                const strengthColors = getStrengthColor(connection.connectionStrength);
                
                return (
                  <Card 
                    key={connection.id} 
                    className="group border-border/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <CardContent className="p-4 space-y-4">
                      {/* Profile Section */}
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-16 w-16 ring-4 ring-primary/10">
                            <AvatarImage src={connection.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                              {getUserInitials(connection.name)}
                            </AvatarFallback>
                          </Avatar>
                          {connection.isOnline && (
                            <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-card" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-base font-bold line-clamp-1">{connection.name}</h3>
                            {connection.verified && (
                              <Badge className="bg-green-500/10 text-green-600 border-0 text-[10px] px-1.5 py-0 h-4 flex-shrink-0">
                                <CheckCircle2 className="h-3 w-3" />
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">{connection.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1 flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {connection.company}
                          </p>
                        </div>
                      </div>

                      {/* Connection Strength Progress */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Connection Strength</span>
                          <Badge className={`${strengthColors.bg} ${strengthColors.text} border-0 text-[10px] px-2 py-0 h-4`}>
                            {connection.connectionStrength}
                          </Badge>
                        </div>
                        <Progress 
                          value={getStrengthValue(connection.connectionStrength)} 
                          className="h-1.5 bg-muted"
                        />
                      </div>

                      {/* 3-Column Metadata */}
                      <div className="grid grid-cols-3 gap-4 py-3 border-y border-border/40">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
                            <Briefcase className="h-3 w-3" />
                            <span>Specialty</span>
                          </div>
                          <div className="font-medium text-xs line-clamp-1" title={connection.specialty}>
                            {connection.specialty}
                          </div>
                        </div>
                        
                        <div className="space-y-1 border-x border-border/40 px-2">
                          <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
                            <Award className="h-3 w-3" />
                            <span>Experience</span>
                          </div>
                          <div className="font-medium text-xs">{connection.experience}</div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
                            <Users className="h-3 w-3" />
                            <span>Mutual</span>
                          </div>
                          <div className="font-medium text-xs">{connection.mutualConnections}</div>
                        </div>
                      </div>

                      {/* Stats Bar */}
                      <div className="flex items-center justify-between py-2 bg-muted/20 px-3 rounded-lg">
                        <div className="flex items-center gap-1 text-xs">
                          <Briefcase className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{connection.projects}</span>
                          <span className="text-muted-foreground">projects</span>
                        </div>
                        <div className="h-3 w-px bg-border" />
                        <div className="flex items-center gap-1 text-xs">
                          <Award className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{connection.endorsements}</span>
                        </div>
                        <div className="h-3 w-px bg-border" />
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="font-medium">{connection.rating}</span>
                          <span className="text-muted-foreground">({connection.reviews})</span>
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{connection.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{connection.lastActive}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 h-7 text-[11px]"
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 h-7 text-[11px]"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Requests Tab */}
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
                  <Card 
                    key={request.id} 
                    className="border-border/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <CardContent className="p-4 space-y-4">
                      {/* Requester Info */}
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16 ring-4 ring-primary/10">
                          <AvatarImage src={request.requester.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                            {getUserInitials(request.requester.name)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-base font-bold">{request.requester.name}</h3>
                              {request.requester.verified && (
                                <Badge className="bg-green-500/10 text-green-600 border-0 text-[10px] px-1.5 py-0 h-4">
                                  <Shield className="h-3 w-3 mr-0.5" />
                                  SCE
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1">{request.requester.title}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <Building2 className="h-3 w-3" />
                              <span className="line-clamp-1">{request.requester.company}</span>
                              <span>•</span>
                              <MapPin className="h-3 w-3" />
                              <span>{request.requester.location}</span>
                            </div>
                          </div>

                          {/* Request Metadata */}
                          <div className="flex items-center gap-3 py-2 px-3 bg-muted/20 rounded-lg">
                            <div className="flex items-center gap-1 text-xs">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium">{request.mutualConnections}</span>
                              <span className="text-muted-foreground">mutual</span>
                            </div>
                            <div className="h-3 w-px bg-border" />
                            <div className="flex items-center gap-1 text-xs">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">{request.timestamp}</span>
                            </div>
                            <div className="h-3 w-px bg-border" />
                            <Badge variant="outline" className="text-[10px] px-2 py-0 h-4">
                              {request.requester.specialty}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      {request.message && (
                        <div className="bg-muted/30 p-4 rounded-lg border border-border/30">
                          <div className="flex items-start gap-2 mb-2">
                            <MessageSquare className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-muted-foreground font-medium">Connection Message</p>
                          </div>
                          <p className="text-sm leading-relaxed text-foreground/90">
                            "{request.message}"
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 h-8 text-xs shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                          Accept Request
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1 h-8 text-xs"
                        >
                          <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                          Reply
                        </Button>
                        <Button 
                          variant="outline"
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4 mt-4">
            {/* Activity Header Card */}
            <Card className="border-border/50">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary h-8 w-8 flex items-center justify-center rounded-lg shadow-sm">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Recent Activity</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Stay updated with your network</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Activity Feed */}
            <div className="space-y-3">
              {mockNetworkActivity.map((activity) => (
                <Card 
                  key={activity.id} 
                  className="border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Avatar with Type Badge */}
                      <div className="relative">
                        <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                          <AvatarImage src={activity.user.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                            {getUserInitials(activity.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center shadow-md ${
                          activity.type === 'connection' ? 'bg-blue-500' :
                          activity.type === 'project' ? 'bg-green-500' :
                          activity.type === 'certification' ? 'bg-purple-500' :
                          activity.type === 'endorsement' ? 'bg-amber-500' :
                          activity.type === 'post' ? 'bg-indigo-500' :
                          'bg-primary'
                        }`}>
                          {activity.type === 'connection' && <Users className="h-3 w-3 text-white" />}
                          {activity.type === 'project' && <Briefcase className="h-3 w-3 text-white" />}
                          {activity.type === 'certification' && <Award className="h-3 w-3 text-white" />}
                          {activity.type === 'endorsement' && <Star className="h-3 w-3 text-white" />}
                          {activity.type === 'post' && <Share2 className="h-3 w-3 text-white" />}
                          {activity.type === 'update' && <Sparkles className="h-3 w-3 text-white" />}
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <p className="text-sm leading-relaxed">
                          <span className="font-bold text-foreground">{activity.user.name}</span>{' '}
                          <span className="text-muted-foreground">{activity.content}</span>
                        </p>
                        
                        {activity.relatedTo && (
                          <div className="bg-muted/30 p-2.5 rounded-lg border border-border/30">
                            <div className="flex items-center gap-2">
                              <Target className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                              <p className="text-xs">
                                <span className="text-muted-foreground">Related to:</span>{' '}
                                <span className="font-medium text-foreground">{activity.relatedTo}</span>
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{activity.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
