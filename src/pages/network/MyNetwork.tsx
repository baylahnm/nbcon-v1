import { useState } from 'react';
import { useAuthStore } from '@/stores/auth';
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
  status: 'pending' | 'accepted' | 'declined';
  mutualConnections: number;
  reason: string;
}

interface ProfessionalEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'conference' | 'workshop' | 'seminar' | 'networking' | 'project_visit' | 'training';
  organizer: string;
  organizerLogo?: string;
  attendeeCount: number;
  maxAttendees?: number;
  isAttending: boolean;
  price?: string;
  image?: string;
  tags: string[];
  speakers?: string[];
  agenda?: string[];
  cpdPoints?: number;
  language: 'english' | 'arabic' | 'bilingual';
}

interface IndustryUpdate {
  id: string;
  title: string;
  content: string;
  summary: string;
  source: string;
  sourceLogo?: string;
  category: 'regulations' | 'projects' | 'technology' | 'careers' | 'sustainability' | 'innovation';
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  isRead: boolean;
  tags: string[];
  relatedProjects?: string[];
  attachments?: string[];
  author?: string;
  verified: boolean;
}

interface ProfessionalGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isJoined: boolean;
  category: 'association' | 'project' | 'technical' | 'regional' | 'professional_development';
  privacy: 'public' | 'private' | 'invite_only';
  avatar?: string;
  recentActivity: string;
  adminCount: number;
  founded: string;
  location?: string;
  website?: string;
  rules: string[];
  featuredPosts: number;
  upcomingEvents: number;
  certifications?: string[];
  requirements?: string[];
}

interface FeedPost {
  id: string;
  author: NetworkConnection;
  content: string;
  type: 'text' | 'image' | 'video' | 'article' | 'project' | 'achievement';
  media?: {
    type: 'image' | 'video' | 'document';
    url: string;
    caption?: string;
  };
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  tags: string[];
  visibility: 'public' | 'connections' | 'group';
  project?: string;
  company?: string;
}

interface Newsletter {
  id: string;
  title: string;
  publisher: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  category: 'industry' | 'technical' | 'regulations' | 'careers' | 'projects';
  subscriberCount: number;
  isSubscribed: boolean;
  lastIssue: string;
  avatar?: string;
  language: 'english' | 'arabic' | 'bilingual';
  featured?: boolean;
  rating: number;
}

// Authentic Saudi Engineering Data
const saudiConnections: NetworkConnection[] = [
  {
    id: "1",
    name: "Eng. Nasser Baylah",
    title: "Senior Structural Engineer",
    company: "NEOM Development Company",
    location: "Tabuk, Saudi Arabia",
    specialty: "Structural Engineering",
    experience: "12 years",
    verified: true,
    sceLicense: "SCE-2012-STR-0456",
    connectionDate: "2024-01-15",
    connectionStrength: "strong",
    mutualConnections: 15,
    isFollowing: true,
    lastActive: "2 hours ago",
    recentActivity: "Completed seismic analysis for NEOM residential complex",
    projects: 24,
    endorsements: 47,
    education: "MSc Civil Engineering, KFUPM",
    certifications: ["PMP", "SE", "LEED AP"]
  },
  {
    id: "2",
    name: "Dr. Fatima Al-Zahra",
    title: "Environmental Engineering Manager",
    company: "Red Sea Global (TRSDC)",
    location: "Jeddah, Saudi Arabia",
    specialty: "Environmental Engineering",
    experience: "8 years",
    verified: true,
    sceLicense: "SCE-2016-ENV-0234",
    connectionDate: "2024-02-10",
    connectionStrength: "medium",
    mutualConnections: 8,
    isFollowing: true,
    lastActive: "1 day ago",
    recentActivity: "Led sustainability certification for Red Sea project",
    projects: 18,
    endorsements: 32,
    education: "PhD Environmental Engineering, Stanford",
    certifications: ["PE", "LEED AP BD+C", "WELL AP"]
  },
  {
    id: "3",
    name: "Eng. Mohammed Bin Salman",
    title: "Project Director",
    company: "Saudi Aramco",
    location: "Dhahran, Saudi Arabia",
    specialty: "Civil Engineering",
    experience: "15 years",
    verified: true,
    sceLicense: "SCE-2009-CIV-0789",
    connectionDate: "2023-11-22",
    connectionStrength: "strong",
    mutualConnections: 22,
    isFollowing: true,
    lastActive: "3 hours ago",
    recentActivity: "Overseeing expansion of Aramco headquarters",
    projects: 31,
    endorsements: 68,
    education: "MSc Civil Engineering, MIT",
    certifications: ["PMP", "PE", "P.Eng"]
  },
  {
    id: "4",
    name: "Eng. Nora Al-Faisal",
    title: "Infrastructure Engineer",
    company: "Qiddiya Investment Company",
    location: "Riyadh, Saudi Arabia",
    specialty: "Infrastructure Engineering",
    experience: "6 years",
    verified: true,
    sceLicense: "SCE-2018-INF-0156",
    connectionDate: "2024-03-05",
    connectionStrength: "weak",
    mutualConnections: 4,
    isFollowing: false,
    lastActive: "5 hours ago",
    recentActivity: "Working on Qiddiya entertainment city infrastructure",
    projects: 12,
    endorsements: 19,
    education: "BSc Civil Engineering, KFUPM",
    certifications: ["PMP", "LEED GA"]
  },
  {
    id: "5",
    name: "Dr. Khalid Al-Mutairi",
    title: "Chief Technology Officer",
    company: "SABIC Engineering",
    location: "Jubail, Saudi Arabia",
    specialty: "Chemical Engineering",
    experience: "18 years",
    verified: true,
    sceLicense: "SCE-2006-CHM-0123",
    connectionDate: "2023-09-18",
    connectionStrength: "strong",
    mutualConnections: 18,
    isFollowing: true,
    lastActive: "1 hour ago",
    recentActivity: "Launched new sustainability initiative",
    projects: 42,
    endorsements: 89,
    education: "PhD Chemical Engineering, Cambridge",
    certifications: ["PE", "PMP", "Six Sigma Black Belt"]
  }
];

const connectionRequests: ConnectionRequest[] = [
  {
    id: "1",
    requester: {
      id: "6",
      name: "Eng. Sarah Al-Dosari",
      title: "Marine Engineer",
      company: "Saudi Ports Authority",
      verified: true
    },
    message: "Hi! I noticed we both work on coastal infrastructure projects. Would love to connect and share insights.",
    timestamp: "2024-12-28T08:30:00Z",
    status: "pending",
    mutualConnections: 7,
    reason: "Similar projects in marine engineering"
  },
  {
    id: "2",
    requester: {
      id: "7",
      name: "Dr. Omar Hassan",
      title: "Smart City Specialist",
      company: "King Abdullah Financial District",
      verified: true
    },
    message: "Looking forward to collaborating on smart infrastructure initiatives in Saudi Arabia.",
    timestamp: "2024-12-27T14:20:00Z",
    status: "pending",
    mutualConnections: 12,
    reason: "Mutual connections in smart city development"
  }
];

const professionalEvents: ProfessionalEvent[] = [
  {
    id: "1",
    title: "Saudi Engineering Excellence Summit 2025",
    description: "Annual summit showcasing innovative engineering solutions across Vision 2030 projects including NEOM, Red Sea, and Qiddiya",
    date: "2025-03-15",
    time: "09:00 AM",
    location: "King Abdulaziz Conference Center, Riyadh",
    type: "conference",
    organizer: "Saudi Council of Engineers",
    attendeeCount: 2500,
    isAttending: true,
    price: "850 SAR",
    tags: ["Vision 2030", "NEOM", "Innovation", "Sustainability"],
    speakers: ["Eng. Abdullah Al-Swaha", "Dr. Sarah Al-Suhaimi", "Prof. Ahmed Al-Ghamdi"],
    cpdPoints: 15,
    language: "bilingual"
  },
  {
    id: "2",
    title: "NEOM Smart City Infrastructure Workshop",
    description: "Exclusive workshop on cutting-edge smart infrastructure technologies being implemented in NEOM",
    date: "2025-02-20",
    time: "08:00 AM",
    location: "NEOM Innovation Center, Tabuk",
    type: "workshop",
    organizer: "NEOM Development Company",
    attendeeCount: 150,
    maxAttendees: 200,
    isAttending: false,
    price: "Free for verified engineers",
    tags: ["NEOM", "Smart Cities", "IoT", "AI"],
    cpdPoints: 8,
    language: "english"
  },
  {
    id: "3",
    title: "Red Sea Sustainability Engineering Tour",
    description: "Guided site visit showcasing sustainable engineering practices in the Red Sea Development project",
    date: "2025-01-25",
    time: "07:00 AM",
    location: "Red Sea Global, Jeddah",
    type: "project_visit",
    organizer: "Red Sea Global",
    attendeeCount: 75,
    maxAttendees: 100,
    isAttending: true,
    price: "Free",
    tags: ["Sustainability", "Marine Engineering", "Eco-friendly"],
    cpdPoints: 5,
    language: "bilingual"
  }
];

const industryUpdates: IndustryUpdate[] = [
  {
    id: "1",
    title: "SCE Announces New Professional Development Requirements",
    content: "The Saudi Council of Engineers has updated CPD requirements for all licensed engineers, mandating 40 hours annually including sustainability training.",
    summary: "New SCE CPD requirements include sustainability training",
    source: "Saudi Council of Engineers",
    category: "regulations",
    priority: "high",
    timestamp: "2024-12-28T10:00:00Z",
    isRead: false,
    tags: ["SCE", "CPD", "Regulations", "Professional Development"],
    verified: true
  },
  {
    id: "2",
    title: "NEOM Announces $500B Investment in Smart Infrastructure",
    content: "NEOM has secured additional funding for its smart city infrastructure, focusing on renewable energy, AI integration, and sustainable transportation systems.",
    summary: "NEOM secures $500B for smart infrastructure development",
    source: "NEOM Development Company",
    category: "projects",
    priority: "high",
    timestamp: "2024-12-27T15:30:00Z",
    isRead: false,
    tags: ["NEOM", "Smart Cities", "Investment", "Infrastructure"],
    relatedProjects: ["The Line", "Oxagon", "Trojena"],
    verified: true
  },
  {
    id: "3",
    title: "New Seismic Design Standards for High-Rise Buildings",
    content: "Updated seismic design guidelines for buildings over 100m in height, incorporating lessons learned from recent international projects.",
    summary: "Updated seismic design standards for high-rise buildings",
    source: "Saudi Building Code Committee",
    category: "regulations",
    priority: "medium",
    timestamp: "2024-12-26T09:15:00Z",
    isRead: true,
    tags: ["Seismic Design", "Building Codes", "Safety", "Standards"],
    verified: true
  }
];

const professionalGroups: ProfessionalGroup[] = [
  {
    id: "1",
    name: "Saudi Engineers Network",
    description: "Premier professional network for engineers across Saudi Arabia's major development projects",
    memberCount: 15420,
    isJoined: true,
    category: "association",
    privacy: "public",
    recentActivity: "2 hours ago",
    adminCount: 12,
    founded: "2019",
    location: "Riyadh",
    website: "www.saudiengineers.org.sa",
    rules: ["Professional conduct", "Respectful communication", "No spam"],
    featuredPosts: 45,
    upcomingEvents: 8,
    certifications: ["SCE Certified", "PMP Approved"]
  },
  {
    id: "2",
    name: "NEOM Engineering Community",
    description: "Exclusive community for engineers working on NEOM smart city projects",
    memberCount: 2847,
    isJoined: true,
    category: "project",
    privacy: "invite_only",
    recentActivity: "5 hours ago",
    adminCount: 8,
    founded: "2021",
    location: "Tabuk",
    rules: ["NDA compliance", "Project confidentiality", "Professional standards"],
    featuredPosts: 23,
    upcomingEvents: 5
  },
  {
    id: "3",
    name: "Women Engineers Saudi Arabia",
    description: "Empowering women in engineering across the Kingdom through mentorship and professional development",
    memberCount: 5670,
    isJoined: false,
    category: "professional_development",
    privacy: "public",
    recentActivity: "1 day ago",
    adminCount: 15,
    founded: "2018",
    location: "Multiple Cities",
    website: "www.wesa.org.sa",
    rules: ["Inclusive environment", "Mentorship focus", "Professional growth"],
    featuredPosts: 67,
    upcomingEvents: 12,
    requirements: ["Female engineer", "SCE license", "Professional references"]
  }
];

const sampleNewsletters: Newsletter[] = [
  {
    id: "1",
    title: "Saudi Engineering Weekly",
    publisher: "Saudi Council of Engineers",
    description: "Comprehensive weekly updates on engineering projects, regulations, and industry developments across Saudi Arabia",
    frequency: "weekly",
    category: "industry",
    subscriberCount: 28450,
    isSubscribed: true,
    lastIssue: "2024-12-23",
    language: "bilingual",
    featured: true,
    rating: 4.8
  },
  {
    id: "2",
    title: "NEOM Tech Insights",
    publisher: "NEOM Development Company",
    description: "Latest technological innovations and engineering breakthroughs in the NEOM smart city project",
    frequency: "monthly",
    category: "projects",
    subscriberCount: 15670,
    isSubscribed: true,
    lastIssue: "2024-12-20",
    language: "english",
    featured: true,
    rating: 4.9
  },
  {
    id: "3",
    title: "Structural Engineering Digest KSA",
    publisher: "Saudi Structural Engineers Association",
    description: "Technical articles, case studies, and best practices in structural engineering for Saudi Arabia",
    frequency: "monthly",
    category: "technical",
    subscriberCount: 12380,
    isSubscribed: false,
    lastIssue: "2024-12-15",
    language: "bilingual",
    rating: 4.7
  }
];

export default function MyNetwork() {
  const { profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState("connections");
  
  // Get current user data
  const currentUserName = getUserDisplayName(profile);
  const currentUserInitials = getUserInitials(profile);
  
  // Create dynamic connections with current user info
  const dynamicConnections = saudiConnections.map(conn => 
    conn.name === "Eng. Nasser Baylah" 
      ? { ...conn, name: `Eng. ${currentUserName}` }
      : conn
  );
  
  const [connections, setConnections] = useState<NetworkConnection[]>(dynamicConnections);
  const [requests, setRequests] = useState<ConnectionRequest[]>(connectionRequests);
  const [events, setEvents] = useState<ProfessionalEvent[]>(professionalEvents);
  const [updates, setUpdates] = useState<IndustryUpdate[]>(industryUpdates);
  const [groups, setGroups] = useState<ProfessionalGroup[]>(professionalGroups);
  const [newsletters, setNewsletters] = useState<Newsletter[]>(sampleNewsletters);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          My Network
        </h1>
        <p className="text-muted-foreground">
          Connect with engineering professionals across Saudi Arabia's Vision 2030 projects. Build meaningful relationships, share knowledge, and advance your career in the Kingdom's thriving engineering ecosystem.
        </p>
      </div>

      {/* Main Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-sidebar-border">
          <TabsList className="h-auto bg-transparent p-0 border-0 rounded-none w-full">
            <div className="flex items-center w-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-card hover:scrollbar-thumb-primary/80">
                <TabsTrigger
                  value="connections"
                  className="flex items-center gap-2 px-4 py-3 min-w-fit"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">My Connections</span>
                </TabsTrigger>
                <TabsTrigger
                  value="suggestions"
                  className="flex items-center gap-2 px-4 py-3 min-w-fit"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">People You May Know</span>
                </TabsTrigger>
                <TabsTrigger
                  value="requests"
                  className="flex items-center gap-2 px-4 py-3 min-w-fit"
                >
                  <UserCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Connection Requests</span>
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="flex items-center gap-2 px-4 py-3 min-w-fit"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Industry Events</span>
                </TabsTrigger>
                <TabsTrigger
                  value="updates"
                  className="flex items-center gap-2 px-4 py-3 min-w-fit"
                >
                  <Newspaper className="h-4 w-4" />
                  <span className="hidden sm:inline">Industry Updates</span>
                </TabsTrigger>
                <TabsTrigger
                  value="groups"
                  className="flex items-center gap-2 px-4 py-3 min-w-fit"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Professional Groups</span>
                </TabsTrigger>
            </div>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          <TabsContent value="connections" className="mt-0">
            <MyConnectionsTab connections={connections} setConnections={setConnections} />
          </TabsContent>

          <TabsContent value="suggestions" className="mt-0">
            <PeopleYouMayKnowTab />
          </TabsContent>

          <TabsContent value="requests" className="mt-0">
            <ConnectionRequestsTab requests={requests} setRequests={setRequests} />
          </TabsContent>

          <TabsContent value="events" className="mt-0">
            <IndustryEventsTab events={events} setEvents={setEvents} />
          </TabsContent>

          <TabsContent value="updates" className="mt-0">
            <IndustryUpdatesTab updates={updates} setUpdates={setUpdates} />
          </TabsContent>

          <TabsContent value="groups" className="mt-0">
            <ProfessionalGroupsTab groups={groups} setGroups={setGroups} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

// My Connections Tab Component
function MyConnectionsTab({ 
  connections, 
  setConnections 
}: { 
  connections: NetworkConnection[]; 
  setConnections: (connections: NetworkConnection[]) => void; 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStrength, setFilterStrength] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const filteredConnections = connections.filter(connection => {
    const matchesSearch = connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         connection.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         connection.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStrength = filterStrength === "all" || connection.connectionStrength === filterStrength;
    return matchesSearch && matchesStrength;
  });

  const handleFollow = (connectionId: string) => {
    setConnections(connections.map(conn => 
      conn.id === connectionId 
        ? { ...conn, isFollowing: !conn.isFollowing }
        : conn
    ));
  };

  const getConnectionStrengthColor = (strength: string) => {
    switch (strength) {
      case "strong": return "bg-success/10 text-success";
      case "medium": return "bg-warning/10 text-warning";
      case "weak": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Connections ({connections.length})</h2>
          <p className="text-muted-foreground">Manage your professional network and track connection strength</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <UserPlus className="h-4 w-4 mr-2" />
          Find New Connections
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search connections by name, company, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
            <Select value={filterStrength} onValueChange={setFilterStrength}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Connections</SelectItem>
                <SelectItem value="strong">Strong Connections</SelectItem>
                <SelectItem value="medium">Medium Connections</SelectItem>
                <SelectItem value="weak">Weak Connections</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Connected</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="strength">Connection Strength</SelectItem>
              </SelectContent>
            </Select>
        </div>
        </CardContent>
      </Card>

      {/* Connection Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{connections.length}</div>
            <div className="text-sm text-muted-foreground">Total Connections</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {connections.filter(c => c.connectionStrength === "strong").length}
                    </div>
            <div className="text-sm text-muted-foreground">Strong Connections</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-info">
              {connections.filter(c => c.verified).length}
                  </div>
            <div className="text-sm text-muted-foreground">Verified Engineers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {new Set(connections.map(c => c.company)).size}
                </div>
            <div className="text-sm text-muted-foreground">Companies</div>
          </CardContent>
        </Card>
        </div>

      {/* Connections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConnections.map((connection) => (
          <Card key={connection.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Profile Section */}
                <div className="relative">
                  <Avatar className="w-20 h-20 border-4 border-background">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg">
                      {connection.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
              </Avatar>
                  {connection.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-1">
                      <Shield className="w-4 h-4 text-primary-foreground" />
                </div>
                  )}
                </div>

                {/* Connection Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="font-semibold text-lg">{connection.name}</h3>
                    <Badge className={getConnectionStrengthColor(connection.connectionStrength)}>
                      {connection.connectionStrength}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-primary">{connection.title}</p>
                  <p className="text-sm text-muted-foreground">{connection.company}</p>
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {connection.location}
              </div>
            </div>
            
                {/* Professional Details */}
                <div className="space-y-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="outline">{connection.specialty}</Badge>
                    <Badge variant="secondary">{connection.experience}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>{connection.projects} projects completed</p>
                    <p>{connection.endorsements} endorsements</p>
                    <p>{connection.mutualConnections} mutual connections</p>
                  </div>
            </div>

                {/* Recent Activity */}
                {connection.recentActivity && (
                  <div className="bg-muted/50 rounded-lg p-3 w-full">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Recent Activity</span>
              </div>
                    <p className="text-xs text-left">{connection.recentActivity}</p>
                    <p className="text-xs text-muted-foreground text-left mt-1">
                      Last active: {connection.lastActive}
                    </p>
            </div>
                )}

                {/* SCE License */}
                {connection.sceLicense && (
                  <div className="bg-info/10 border border-info/20 rounded-lg p-2 w-full">
                    <div className="flex items-center gap-2">
                      <Award className="w-3 h-3 text-info" />
                      <span className="text-xs font-medium text-info">SCE Licensed</span>
              </div>
                    <p className="text-xs text-info/80">{connection.sceLicense}</p>
            </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 w-full">
                  <Button 
                    variant={connection.isFollowing ? "outline" : "default"}
                    size="sm"
                    className={`flex-1 ${!connection.isFollowing ? "bg-primary hover:bg-primary/90" : ""}`}
                    onClick={() => handleFollow(connection.id)}
                  >
                    {connection.isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Follow
                      </>
                    )}
              </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4" />
              </Button>
                  <Button variant="outline" size="sm" onClick={() => window.location.assign(`/engineer/network/${connection.id}`)}>
                    <MoreHorizontal className="w-4 h-4" />
              </Button>
      </div>

                {/* Connection Date */}
                <div className="text-xs text-muted-foreground">
                  Connected {new Date(connection.connectionDate).toLocaleDateString('en-SA')}
              </div>
                  </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connection Insights */}
          <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Connection Insights
              </CardTitle>
            </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Top Companies</h4>
              <div className="space-y-2">
                {Object.entries(
                  connections.reduce((acc, conn) => {
                    acc[conn.company] = (acc[conn.company] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                )
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([company, count]) => (
                    <div key={company} className="flex items-center justify-between">
                      <span className="text-sm">{company}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            <div>
              <h4 className="font-medium mb-3">Specialties</h4>
              <div className="space-y-2">
                {Object.entries(
                  connections.reduce((acc, conn) => {
                    acc[conn.specialty] = (acc[conn.specialty] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                )
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([specialty, count]) => (
                    <div key={specialty} className="flex items-center justify-between">
                      <span className="text-sm">{specialty}</span>
                      <Badge variant="outline">{count}</Badge>
              </div>
                  ))}
                </div>
                </div>
              </div>
            </CardContent>
          </Card>
    </div>
  );
}

// People You May Know Tab Component
function PeopleYouMayKnowTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompany, setFilterCompany] = useState("all");
  const [filterSpecialty, setFilterSpecialty] = useState("all");

  // AI-powered suggestions based on Saudi engineering context
  const suggestions = [
    {
      id: "6",
      name: "Eng. Sarah Al-Dosari",
      title: "Marine Engineer",
      company: "Saudi Ports Authority",
      location: "Jeddah, Saudi Arabia",
      specialty: "Marine Engineering",
      experience: "7 years",
      avatar: "/placeholder.svg",
      verified: true,
      sceLicense: "SCE-2017-MAR-0345",
      mutualConnections: 7,
      reason: "Similar projects in coastal infrastructure",
      confidence: 92,
      sharedInterests: ["Marine Engineering", "Infrastructure", "Sustainability"]
    },
    {
      id: "7",
      name: "Dr. Omar Hassan",
      title: "Smart City Specialist",
      company: "King Abdullah Financial District",
      location: "Riyadh, Saudi Arabia",
      specialty: "Smart Infrastructure",
      experience: "9 years",
      avatar: "/placeholder.svg",
      verified: true,
      sceLicense: "SCE-2015-SMT-0234",
      mutualConnections: 12,
      reason: "Mutual connections in smart city development",
      confidence: 88,
      sharedInterests: ["Smart Cities", "IoT", "AI Integration"]
    },
    {
      id: "8",
      name: "Eng. Layla Al-Mansouri",
      title: "Renewable Energy Engineer",
      company: "ACWA Power",
      location: "Riyadh, Saudi Arabia",
      specialty: "Renewable Energy",
      experience: "5 years",
      avatar: "/placeholder.svg",
      verified: true,
      sceLicense: "SCE-2019-REN-0156",
      mutualConnections: 5,
      reason: "Working on NEOM renewable energy projects",
      confidence: 85,
      sharedInterests: ["Renewable Energy", "NEOM", "Sustainability"]
    },
    {
      id: "9",
      name: "Dr. Abdullah Al-Shehri",
      title: "Transportation Engineer",
      company: "Saudi Railway Company",
      location: "Riyadh, Saudi Arabia",
      specialty: "Transportation Engineering",
      experience: "11 years",
      avatar: "/placeholder.svg",
      verified: true,
      sceLicense: "SCE-2013-TRN-0456",
      mutualConnections: 9,
      reason: "Connected through Saudi Engineering Excellence Summit",
      confidence: 78,
      sharedInterests: ["Transportation", "Infrastructure", "Vision 2030"]
    },
    {
      id: "10",
      name: "Eng. Mariam Al-Zahra",
      title: "Water Resources Engineer",
      company: "National Water Company",
      location: "Riyadh, Saudi Arabia",
      specialty: "Water Resources",
      experience: "6 years",
      avatar: "/placeholder.svg",
      verified: true,
      sceLicense: "SCE-2018-WAT-0234",
      mutualConnections: 4,
      reason: "Similar expertise in water infrastructure",
      confidence: 75,
      sharedInterests: ["Water Resources", "Infrastructure", "Environmental Engineering"]
    }
  ];

  const filteredSuggestions = suggestions.filter(suggestion => {
    const matchesSearch = suggestion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = filterCompany === "all" || suggestion.company === filterCompany;
    const matchesSpecialty = filterSpecialty === "all" || suggestion.specialty === filterSpecialty;
    return matchesSearch && matchesCompany && matchesSpecialty;
  });

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "bg-success/10 text-success";
    if (confidence >= 80) return "bg-info/10 text-info border-info/20";
    if (confidence >= 70) return "bg-warning/10 text-warning";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">People You May Know</h2>
          <p className="text-muted-foreground">AI-powered suggestions based on your network, projects, and interests</p>
        </div>
      <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Suggestion Settings
            </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
                placeholder="Search suggestions by name, company, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
            <Select value={filterCompany} onValueChange={setFilterCompany}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                <SelectItem value="NEOM Development Company">NEOM</SelectItem>
                <SelectItem value="Saudi Aramco">Aramco</SelectItem>
                <SelectItem value="Red Sea Global (TRSDC)">Red Sea Global</SelectItem>
                <SelectItem value="SABIC Engineering">SABIC</SelectItem>
                <SelectItem value="Qiddiya Investment Company">Qiddiya</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                <SelectItem value="Structural Engineering">Structural</SelectItem>
                <SelectItem value="Environmental Engineering">Environmental</SelectItem>
                <SelectItem value="Civil Engineering">Civil</SelectItem>
                <SelectItem value="Infrastructure Engineering">Infrastructure</SelectItem>
                <SelectItem value="Chemical Engineering">Chemical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-info/5 to-primary/5 border-sidebar-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full p-2">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">AI-Powered Recommendations</h4>
              <p className="text-sm text-muted-foreground">
                Our algorithm analyzes your connections, project history, and interests to suggest relevant professionals from Saudi Arabia's engineering community.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuggestions.map((suggestion) => (
          <Card key={suggestion.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Profile Section */}
                <div className="relative">
                  <Avatar className="w-20 h-20 border-4 border-background">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg">
                      {suggestion.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                </Avatar>
                  {suggestion.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-1">
                      <Shield className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>

                {/* Connection Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="font-semibold text-lg">{suggestion.name}</h3>
                    <Badge className={getConfidenceColor(suggestion.confidence)}>
                      {suggestion.confidence}% match
                    </Badge>
                    </div>
                  <p className="text-sm font-medium text-primary">{suggestion.title}</p>
                  <p className="text-sm text-muted-foreground">{suggestion.company}</p>
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {suggestion.location}
                    </div>
                  </div>

                {/* Professional Details */}
                <div className="space-y-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="outline">{suggestion.specialty}</Badge>
                    <Badge variant="secondary">{suggestion.experience}</Badge>
                    </div>
                  <div className="text-xs text-muted-foreground">
                    <p>{suggestion.mutualConnections} mutual connections</p>
                    </div>
                  </div>

                {/* AI Recommendation Reason */}
                <div className="bg-muted/50 rounded-lg p-3 w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-3 h-3 text-primary" />
                    <span className="text-xs font-medium text-primary">Why we recommend</span>
                  </div>
                  <p className="text-xs text-left mb-2">{suggestion.reason}</p>
                  <div className="flex flex-wrap gap-1">
                    {suggestion.sharedInterests.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  </div>

                {/* SCE License */}
                {suggestion.sceLicense && (
                  <div className="bg-info/10 border border-info/20 rounded-lg p-2 w-full">
                    <div className="flex items-center gap-2">
                      <Award className="w-3 h-3 text-info" />
                      <span className="text-xs font-medium text-info">SCE Licensed</span>
                    </div>
                    <p className="text-xs text-info/80">{suggestion.sceLicense}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 w-full">
                  <Button 
                    size="sm"
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <UserMinus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connection Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Networking Tips for Saudi Engineers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Professional Etiquette</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use formal titles (Eng., Dr.) when connecting</li>
                <li>• Mention mutual connections or shared projects</li>
                <li>• Respect cultural and professional boundaries</li>
                <li>• Highlight Vision 2030 project involvement</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Effective Messaging</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Reference specific Saudi engineering projects</li>
                <li>• Mention SCE license and certifications</li>
                <li>• Share relevant industry insights</li>
                <li>• Offer collaboration opportunities</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Connection Requests Tab Component
function ConnectionRequestsTab({ 
  requests, 
  setRequests 
}: { 
  requests: ConnectionRequest[]; 
  setRequests: (requests: ConnectionRequest[]) => void; 
}) {
  const handleAccept = (requestId: string) => {
    setRequests(requests.filter(req => req.id !== requestId));
    // Add to connections logic would go here
  };

  const handleDecline = (requestId: string) => {
    setRequests(requests.map(req => 
      req.id === requestId 
        ? { ...req, status: "declined" }
        : req
    ));
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Connection Requests ({requests.length})</h2>
          <p className="text-muted-foreground">Manage incoming connection requests from fellow engineers</p>
        </div>
        <div className="flex items-center gap-2">
          {requests.length > 0 && (
            <>
              <Button 
                className="bg-success hover:bg-success/90 text-success-foreground"
                onClick={() => requests.forEach(req => handleAccept(req.id))}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Accept All
        </Button>
              <Button 
                variant="outline"
                onClick={() => requests.forEach(req => handleDecline(req.id))}
              >
                <X className="h-4 w-4 mr-2" />
                Decline All
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Request Statistics */}
      {requests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{requests.length}</div>
              <div className="text-sm text-muted-foreground">Pending Requests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-info">
                {requests.filter(req => req.requester.verified).length}
                  </div>
              <div className="text-sm text-muted-foreground">Verified Engineers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round(requests.reduce((acc, req) => acc + req.mutualConnections, 0) / requests.length)}
                  </div>
              <div className="text-sm text-muted-foreground">Avg Mutual Connections</div>
            </CardContent>
          </Card>
                </div>
      )}

      {/* Requests List */}
      {requests.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Pending Requests</h3>
            <p className="text-muted-foreground mb-4">
              You're all caught up! New connection requests will appear here.
            </p>
            <Button className="bg-primary hover:bg-primary/90">
              <UserPlus className="h-4 w-4 mr-2" />
              Find People to Connect With
                  </Button>
              </CardContent>
            </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Requester Profile */}
                  <div className="flex-shrink-0">
                    <Avatar className="w-16 h-16 border-2 border-border">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {request.requester.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
      </div>

                  {/* Request Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{request.requester.name}</h3>
                          {request.requester.verified && (
                            <Badge className="bg-info/10 text-info border-info/20">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                  </div>
                        <p className="text-sm font-medium text-primary">{request.requester.title}</p>
                        <p className="text-sm text-muted-foreground">{request.requester.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{formatTime(request.timestamp)}</p>
                        <Badge variant="secondary" className="mt-1">
                          {request.mutualConnections} mutual connections
                        </Badge>
                  </div>
                </div>
                
                    {/* Connection Reason */}
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Connection Reason</span>
                  </div>
                      <p className="text-sm">{request.reason}</p>
                </div>

                    {/* Personal Message */}
                    {request.message && (
                      <div className="bg-info/10 border border-info/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="w-3 h-3 text-info" />
                          <span className="text-xs font-medium text-info">Personal Message</span>
                        </div>
                        <p className="text-sm text-info/80">{request.message}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                      <Button 
                        className="bg-success hover:bg-success/90 text-success-foreground"
                        onClick={() => handleAccept(request.id)}
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Accept
                </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleDecline(request.id)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                      <Button variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Networking Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Professional Networking Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">When to Accept</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Verified SCE licensed engineers</li>
                <li>• Professionals from Vision 2030 projects</li>
                <li>• Mutual connections in your field</li>
                <li>• Those with shared project interests</li>
                <li>• Industry professionals you've met at events</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Professional Boundaries</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Respect cultural and religious considerations</li>
                <li>• Maintain professional communication</li>
                <li>• Avoid discussing sensitive political topics</li>
                <li>• Focus on engineering and project discussions</li>
                <li>• Respect gender-appropriate networking</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Industry Events Tab Component
function IndustryEventsTab({ 
  events, 
  setEvents 
}: { 
  events: ProfessionalEvent[]; 
  setEvents: (events: ProfessionalEvent[]) => void; 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || event.type === filterType;
    const matchesLocation = filterLocation === "all" || event.location.includes(filterLocation);
    return matchesSearch && matchesType && matchesLocation;
  });

  const handleAttendEvent = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, isAttending: !event.isAttending, attendeeCount: event.isAttending ? event.attendeeCount - 1 : event.attendeeCount + 1 }
        : event
    ));
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "conference": return "bg-info/10 text-info border-info/20";
      case "workshop": return "bg-success/10 text-success";
      case "seminar": return "bg-accent/10 text-accent";
      case "networking": return "bg-warning/10 text-warning";
      case "project_visit": return "bg-primary/10 text-primary";
      case "training": return "bg-secondary/10 text-secondary";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/10 text-destructive";
      case "medium": return "bg-warning/10 text-warning";
      case "low": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Industry Events</h2>
          <p className="text-muted-foreground">Discover professional engineering events across Saudi Arabia's Vision 2030 projects</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            My Calendar
          </Button>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
      <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events by title, description, or organizer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Event Types</SelectItem>
                <SelectItem value="conference">Conferences</SelectItem>
                <SelectItem value="workshop">Workshops</SelectItem>
                <SelectItem value="seminar">Seminars</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
                <SelectItem value="project_visit">Project Visits</SelectItem>
                <SelectItem value="training">Training</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Riyadh">Riyadh</SelectItem>
                <SelectItem value="Jeddah">Jeddah</SelectItem>
                <SelectItem value="Dhahran">Dhahran</SelectItem>
                <SelectItem value="Tabuk">Tabuk</SelectItem>
                <SelectItem value="Jubail">Jubail</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date (Soonest)</SelectItem>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
                <SelectItem value="organizer">Organizer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Event Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{events.length}</div>
            <div className="text-sm text-muted-foreground">Total Events</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {events.filter(e => e.isAttending).length}
            </div>
            <div className="text-sm text-muted-foreground">Attending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-info">
              {events.filter(e => e.cpdPoints && e.cpdPoints > 0).length}
            </div>
            <div className="text-sm text-muted-foreground">CPD Events</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {events.filter(e => e.price === "Free" || e.price?.includes("Free")).length}
            </div>
            <div className="text-sm text-muted-foreground">Free Events</div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Featured Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.filter(e => e.attendeeCount > 1000).map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 bg-background rounded-lg border border-sidebar-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-xs text-primary font-medium">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</span>
                  <span className="text-sm font-bold text-primary">{new Date(event.date).getDate()}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{event.title}</h4>
                  <p className="text-xs text-muted-foreground mb-1">{event.organizer}</p>
        <div className="flex items-center gap-2">
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type.replace('_', ' ')}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {event.attendeeCount} attending
                    </Badge>
        </div>
        </div>
      </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* Event Date */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xs text-primary font-medium">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</span>
                    <span className="text-lg font-bold text-primary">{new Date(event.date).getDate()}</span>
                  </div>
                </div>
                
                {/* Event Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type.replace('_', ' ')}
                        </Badge>
                        {event.cpdPoints && (
                          <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                            {event.cpdPoints} CPD Points
                          </Badge>
                      )}
                    </div>
                      <p className="text-muted-foreground text-sm mb-2">{event.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                        <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                        <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                          <span>{event.attendeeCount} attending</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          <span className="capitalize">{event.language}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-sm font-medium">{event.price}</p>
                        <p className="text-xs text-muted-foreground">by {event.organizer}</p>
                      </div>
                      <Button 
                        size="sm"
                        variant={event.isAttending ? "outline" : "default"}
                        className={event.isAttending ? "" : "bg-primary hover:bg-primary/90"}
                        onClick={() => handleAttendEvent(event.id)}
                      >
                        {event.isAttending ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Attending
                          </>
                        ) : (
                          <>
                            <Calendar className="w-4 h-4 mr-2" />
                            Attend
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Event Tags */}
                  <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Hash className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                  {/* Speakers */}
                  {event.speakers && event.speakers.length > 0 && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Mic className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Featured Speakers</span>
                  </div>
                      <div className="flex flex-wrap gap-2">
                        {event.speakers.map((speaker, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {speaker}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Event Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Popular Event Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { type: "conference", label: "Conferences", count: 45, icon: <Users className="h-4 w-4" /> },
              { type: "workshop", label: "Workshops", count: 32, icon: <Target className="h-4 w-4" /> },
              { type: "seminar", label: "Seminars", count: 28, icon: <BookOpen className="h-4 w-4" /> },
              { type: "networking", label: "Networking", count: 19, icon: <UserPlus className="h-4 w-4" /> },
              { type: "project_visit", label: "Site Visits", count: 15, icon: <MapPin className="h-4 w-4" /> },
              { type: "training", label: "Training", count: 23, icon: <GraduationCap className="h-4 w-4" /> }
            ].map((category) => (
              <div key={category.type} className="flex flex-col items-center p-3 bg-background border border-sidebar-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="text-primary mb-2">{category.icon}</div>
                <h4 className="font-medium text-sm">{category.label}</h4>
                <p className="text-xs text-muted-foreground">{category.count} events</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Industry Updates Tab Component
function IndustryUpdatesTab({ 
  updates, 
  setUpdates 
}: { 
  updates: IndustryUpdate[]; 
  setUpdates: (updates: IndustryUpdate[]) => void; 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filteredUpdates = updates.filter(update => {
    const matchesSearch = update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || update.category === filterCategory;
    const matchesPriority = filterPriority === "all" || update.priority === filterPriority;
    const matchesReadStatus = !showUnreadOnly || !update.isRead;
    return matchesSearch && matchesCategory && matchesPriority && matchesReadStatus;
  });

  const handleMarkAsRead = (updateId: string) => {
    setUpdates(updates.map(update => 
      update.id === updateId 
        ? { ...update, isRead: true }
        : update
    ));
  };

  const handleMarkAllAsRead = () => {
    setUpdates(updates.map(update => ({ ...update, isRead: true })));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-muted text-muted-foreground border-border";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "regulations": return <Shield className="h-4 w-4" />;
      case "projects": return <Building2 className="h-4 w-4" />;
      case "technology": return <Zap className="h-4 w-4" />;
      case "careers": return <Briefcase className="h-4 w-4" />;
      case "sustainability": return <Globe className="h-4 w-4" />;
      case "innovation": return <Target className="h-4 w-4" />;
      default: return <Newspaper className="h-4 w-4" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Industry Updates</h2>
          <p className="text-muted-foreground">Stay informed with the latest engineering news, regulations, and project updates from Saudi Arabia</p>
        </div>
        <div className="flex items-center gap-2">
        <Button variant="outline">
          <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={handleMarkAllAsRead}
            disabled={updates.every(u => u.isRead)}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark All Read
        </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search updates by title, source, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="regulations">Regulations</SelectItem>
                <SelectItem value="projects">Projects</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="careers">Careers</SelectItem>
                <SelectItem value="sustainability">Sustainability</SelectItem>
                <SelectItem value="innovation">Innovation</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant={showUnreadOnly ? "default" : "outline"}
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              className={showUnreadOnly ? "bg-primary hover:bg-primary/90" : ""}
            >
              <Eye className="h-4 w-4 mr-2" />
              Unread Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Update Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{updates.length}</div>
            <div className="text-sm text-muted-foreground">Total Updates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {updates.filter(u => !u.isRead).length}
            </div>
            <div className="text-sm text-muted-foreground">Unread</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {updates.filter(u => u.priority === "high").length}
            </div>
            <div className="text-sm text-muted-foreground">High Priority</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-info">
              {updates.filter(u => u.verified).length}
            </div>
            <div className="text-sm text-muted-foreground">Verified Sources</div>
          </CardContent>
        </Card>
      </div>

      {/* Trending Topics */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-sidebar-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {["NEOM", "Vision 2030", "SCE Regulations", "Smart Cities", "Sustainability", "AI Integration", "Renewable Energy", "Infrastructure"].map((topic, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                <Hash className="w-3 h-3 mr-1" />
                {topic}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Updates List */}
      <div className="space-y-4">
        {filteredUpdates.map((update) => (
          <Card 
            key={update.id} 
            className={`hover:shadow-lg transition-shadow ${!update.isRead ? "border-l-4 border-l-primary" : ""}`}
          >
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* Update Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <div className="text-primary">
                      {getCategoryIcon(update.category)}
                    </div>
                  </div>
                </div>
                
                {/* Update Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`font-semibold text-lg ${!update.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                          {update.title}
                        </h3>
                        {!update.isRead && (
                          <Badge className="bg-primary text-primary-foreground">
                            New
                          </Badge>
                        )}
                        <Badge className={getPriorityColor(update.priority)}>
                          {update.priority}
                        </Badge>
                        {update.verified && (
                          <Badge className="bg-info/10 text-info border-info/20">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{update.summary}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Newspaper className="h-4 w-4" />
                          <span>{update.source}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(update.timestamp)}</span>
                      </div>
                        <div className="flex items-center gap-1">
                          <div className="text-primary">
                            {getCategoryIcon(update.category)}
                    </div>
                          <span className="capitalize">{update.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleMarkAsRead(update.id)}
                        disabled={update.isRead}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {update.isRead ? "Read" : "Mark Read"}
                      </Button>
                    </div>
                  </div>

                  {/* Update Tags */}
                  <div className="flex flex-wrap gap-2">
                    {update.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Hash className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Related Projects */}
                  {update.relatedProjects && update.relatedProjects.length > 0 && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Related Projects</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {update.relatedProjects.map((project, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {project}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Update Content Preview */}
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {update.content}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* News Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Trusted News Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Saudi Council of Engineers", verified: true, category: "Regulatory" },
              { name: "NEOM Development Company", verified: true, category: "Projects" },
              { name: "Saudi Aramco", verified: true, category: "Industry" },
              { name: "Ministry of Energy", verified: true, category: "Government" },
              { name: "Red Sea Global", verified: true, category: "Projects" },
              { name: "SABIC", verified: true, category: "Industry" },
              { name: "Qiddiya Investment", verified: true, category: "Projects" },
              { name: "Saudi Green Initiative", verified: true, category: "Sustainability" }
            ].map((source, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border border-sidebar-border rounded-lg">
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{source.name}</p>
                  <p className="text-xs text-muted-foreground">{source.category}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Professional Groups Tab Component
function ProfessionalGroupsTab({ 
  groups, 
  setGroups 
}: { 
  groups: ProfessionalGroup[]; 
  setGroups: (groups: ProfessionalGroup[]) => void; 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPrivacy, setFilterPrivacy] = useState("all");
  const [showMyGroupsOnly, setShowMyGroupsOnly] = useState(false);

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || group.category === filterCategory;
    const matchesPrivacy = filterPrivacy === "all" || group.privacy === filterPrivacy;
    const matchesMyGroups = !showMyGroupsOnly || group.isJoined;
    return matchesSearch && matchesCategory && matchesPrivacy && matchesMyGroups;
  });

  const handleJoinGroup = (groupId: string) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, isJoined: !group.isJoined, memberCount: group.isJoined ? group.memberCount - 1 : group.memberCount + 1 }
        : group
    ));
  };

  const getPrivacyColor = (privacy: string) => {
    switch (privacy) {
      case "public": return "bg-success/10 text-success";
      case "private": return "bg-warning/10 text-warning";
      case "invite_only": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "association": return <Award className="h-4 w-4" />;
      case "project": return <Building2 className="h-4 w-4" />;
      case "technical": return <Target className="h-4 w-4" />;
      case "regional": return <MapPin className="h-4 w-4" />;
      case "professional_development": return <GraduationCap className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Professional Groups</h2>
          <p className="text-muted-foreground">Join engineering associations, project communities, and professional development groups</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Manage Groups
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
            Create Group
            </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="association">Associations</SelectItem>
                <SelectItem value="project">Project Groups</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="regional">Regional</SelectItem>
                <SelectItem value="professional_development">Professional Development</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPrivacy} onValueChange={setFilterPrivacy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Privacy Levels</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="invite_only">Invite Only</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant={showMyGroupsOnly ? "default" : "outline"}
              onClick={() => setShowMyGroupsOnly(!showMyGroupsOnly)}
              className={showMyGroupsOnly ? "bg-primary hover:bg-primary/90" : ""}
            >
              <Users className="h-4 w-4 mr-2" />
              My Groups
            </Button>
          </div>
          </CardContent>
        </Card>

      {/* Group Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{groups.length}</div>
            <div className="text-sm text-muted-foreground">Total Groups</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {groups.filter(g => g.isJoined).length}
            </div>
            <div className="text-sm text-muted-foreground">Joined</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-info">
              {groups.reduce((acc, g) => acc + g.memberCount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {groups.filter(g => g.privacy === "public").length}
            </div>
            <div className="text-sm text-muted-foreground">Public Groups</div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Groups */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-sidebar-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Featured Groups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.filter(g => g.memberCount > 10000).map((group) => (
              <div key={group.id} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-sidebar-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <div className="text-primary">
                    {getCategoryIcon(group.category)}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{group.name}</h4>
                  <p className="text-xs text-muted-foreground mb-1">{group.category}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {group.memberCount.toLocaleString()} members
                    </Badge>
                    <Badge className={getPrivacyColor(group.privacy)}>
                      {group.privacy}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Groups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                {/* Group Header */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <div className="text-primary">
                      {getCategoryIcon(group.category)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{group.name}</h3>
                      <Badge className={getPrivacyColor(group.privacy)}>
                        {group.privacy}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{group.description}</p>
                  </div>
                </div>

                {/* Group Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-muted/50 rounded-lg p-2">
                    <div className="text-lg font-bold text-primary">{group.memberCount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Members</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2">
                    <div className="text-lg font-bold text-primary">{group.featuredPosts}</div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </div>
                </div>

                {/* Group Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Founded</span>
                    <span>{group.founded}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Location</span>
                    <span>{group.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Activity</span>
                    <span>{group.recentActivity}</span>
                  </div>
                </div>

                {/* Certifications */}
                {group.certifications && group.certifications.length > 0 && (
                  <div className="bg-info/10 border border-info/20 rounded-lg p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-3 h-3 text-info" />
                      <span className="text-xs font-medium text-info">Certifications</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {group.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm"
                    variant={group.isJoined ? "outline" : "default"}
                    className={`flex-1 ${!group.isJoined ? "bg-primary hover:bg-primary/90" : ""}`}
                    onClick={() => handleJoinGroup(group.id)}
                  >
                    {group.isJoined ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Joined
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Join Group
                      </>
                    )}
            </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
          </CardContent>
        </Card>
        ))}
      </div>

      {/* Group Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Popular Group Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { category: "association", label: "Associations", count: 45, icon: <Award className="h-4 w-4" /> },
              { category: "project", label: "Project Groups", count: 32, icon: <Building2 className="h-4 w-4" /> },
              { category: "technical", label: "Technical", count: 28, icon: <Target className="h-4 w-4" /> },
              { category: "regional", label: "Regional", count: 19, icon: <MapPin className="h-4 w-4" /> },
              { category: "professional_development", label: "Professional Dev", count: 23, icon: <GraduationCap className="h-4 w-4" /> }
            ].map((category) => (
              <div key={category.category} className="flex flex-col items-center p-3 bg-background border border-sidebar-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="text-primary mb-2">{category.icon}</div>
                <h4 className="font-medium text-sm">{category.label}</h4>
                <p className="text-xs text-muted-foreground">{category.count} groups</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

