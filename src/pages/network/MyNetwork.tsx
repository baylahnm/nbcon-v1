import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
  X
} from 'lucide-react';

export default function MyNetwork() {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          My Network
        </h1>
        <p className="text-muted-foreground">
          Connect with fellow engineers, join professional groups, and stay updated with industry events and insights across Saudi Arabia's engineering community.
        </p>
      </div>

      {/* Main Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="inline-flex h-12 items-center justify-start rounded-none border-0 bg-transparent p-0">
              <TabsTrigger
                value="feed"
                className="inline-flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
              >
                <Users className="h-4 w-4" />
                My Feed
              </TabsTrigger>
              <TabsTrigger
                value="following"
                className="inline-flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
              >
                <UserPlus className="h-4 w-4" />
                Following
              </TabsTrigger>
              <TabsTrigger
                value="groups"
                className="inline-flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
              >
                <Users className="h-4 w-4" />
                Groups
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="inline-flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
              >
                <Calendar className="h-4 w-4" />
                Events
              </TabsTrigger>
              <TabsTrigger
                value="newsletters"
                className="inline-flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
              >
                <Mail className="h-4 w-4" />
                Newsletters
              </TabsTrigger>
            </TabsList>
          </ScrollArea>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {/* My Feed Tab */}
          <TabsContent value="feed" className="mt-0">
            <MyFeedTab />
          </TabsContent>

          {/* Following Tab */}
          <TabsContent value="following" className="mt-0">
            <FollowingTab />
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="mt-0">
            <GroupsTab />
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-0">
            <EventsTab />
          </TabsContent>

          {/* Newsletters Tab */}
          <TabsContent value="newsletters" className="mt-0">
            <NewslettersTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

// My Feed Tab Component
function MyFeedTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Main Feed Content */}
      <div className="lg:col-span-8">
        {/* Search and Actions */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search for friends, groups, pages" 
              className="pl-10"
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add New Post
          </Button>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback>NB</AvatarFallback>
          </Avatar>
        </div>

        {/* Stories */}
        <div className="mb-6">
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-2">
              {['x_ae-23b', 'ma', 'saylortiwift', 'johndoe', 'maryjane2', 'obama', 'x_ae-21', 'x_ae-23b'].map((user, index) => (
                <div key={index} className="flex flex-col items-center gap-2 min-w-0">
                  <div className="h-16 w-16 rounded-full bg-gradient-primary p-0.5">
                    <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                      <Avatar className="h-14 w-14">
                        <AvatarFallback className="text-xs">{user.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground truncate max-w-16">{user}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Feed Post */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground">NB</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">Naseer Baylah</h3>
                  <Badge variant="secondary" className="text-xs">Land Surveyor</Badge>
                </div>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm leading-relaxed">
                GIS mapping uses software to visualize and analyze location data. By layering information like demographics and infrastructure on a map, it reveals spatial patterns for informed decisions in various industries. #nbcon #ksa #machinelearning #GIS #Survey
              </p>
            </div>

            <div className="mb-4">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt="GIS mapping visualization" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-4">
                <span>12 Likes</span>
                <span>25 Comments</span>
                <span>187 Share</span>
                <span>8 Saved</span>
              </div>
            </div>

            <Separator className="mb-4" />

            <div className="flex items-center gap-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground">U</AvatarFallback>
              </Avatar>
              <Input 
                placeholder="Write your comment..." 
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="lg:col-span-4">
        <div className="space-y-6">
          {/* Friend Suggestions */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Friend Suggestions</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs">
                  See All →
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Julia Smith', username: '@juliasmith' },
                { name: 'Vermillion D. Gray', username: '@vermillion' },
                { name: 'Mai Senpai', username: '@maisenpai' },
                { name: 'Azunyan U. Wu', username: '@azunyan' },
                { name: 'Barack Babama', username: '@barack' }
              ].map((person, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-gradient-primary text-primary-foreground">{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{person.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{person.username}</p>
                  </div>
                  <Button size="sm" className="h-7 px-2">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Profile Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Profile Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['A1', 'A2', 'A3', 'A4'].map((initials, index) => (
                    <Avatar key={index} className="h-6 w-6 border-2 border-background">
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">+1,158 Followers</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium">23% vs last month</span>
              </div>
              <p className="text-xs text-muted-foreground">
                You gained a substantial amount of followers this month!
              </p>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Friend's Birthday</p>
                  <p className="text-xs text-muted-foreground">Jun 25, 2028</p>
                </div>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Bell className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Following Tab Component
function FollowingTab() {
  const [filter, setFilter] = useState('all');
  
  const engineers = [
    {
      id: 1,
      name: 'Ahmed Al-Rashid',
      title: 'Senior Structural Engineer',
      company: 'Saudi Aramco',
      location: 'Riyadh, Saudi Arabia',
      specialty: 'Structural Engineering',
      projects: 24,
      avatar: '/placeholder.svg',
      isFollowing: true,
      lastActive: '2 hours ago',
      recentActivity: 'Completed NEOM residential complex project'
    },
    {
      id: 2,
      name: 'Fatima Al-Zahra',
      title: 'Electrical Systems Engineer',
      company: 'NEOM',
      location: 'Tabuk, Saudi Arabia',
      specialty: 'Electrical Engineering',
      projects: 18,
      avatar: '/placeholder.svg',
      isFollowing: true,
      lastActive: '1 day ago',
      recentActivity: 'Earned PMP certification'
    },
    {
      id: 3,
      name: 'Mohammed Bin Salman',
      title: 'Civil Engineering Consultant',
      company: 'Royal Commission',
      location: 'Jeddah, Saudi Arabia',
      specialty: 'Civil Engineering',
      projects: 31,
      avatar: '/placeholder.svg',
      isFollowing: true,
      lastActive: '3 hours ago',
      recentActivity: 'Published research on sustainable construction'
    },
    {
      id: 4,
      name: 'Nora Al-Faisal',
      title: 'Environmental Engineer',
      company: 'Saudi Green Initiative',
      location: 'Riyadh, Saudi Arabia',
      specialty: 'Environmental Engineering',
      projects: 12,
      avatar: '/placeholder.svg',
      isFollowing: true,
      lastActive: '5 hours ago',
      recentActivity: 'Led green building certification project'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Following (4)</h2>
          <p className="text-muted-foreground">Engineers you're following and their recent activity</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <UserPlus className="h-4 w-4 mr-2" />
          Discover Engineers
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <div className="flex gap-2">
          {['All', 'Active Today', 'New Posts', 'Project Updates'].map((filterOption) => (
            <Button
              key={filterOption}
              variant={filter === filterOption.toLowerCase().replace(' ', '') ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption.toLowerCase().replace(' ', ''))}
            >
              {filterOption}
            </Button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search followed engineers..." 
          className="pl-10"
        />
      </div>

      {/* Engineer Cards */}
      <div className="grid gap-4">
        {engineers.map((engineer) => (
          <Card key={engineer.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={engineer.avatar} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">{engineer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{engineer.name}</h3>
                      <p className="text-muted-foreground">{engineer.title}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Following
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      <span>{engineer.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{engineer.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{engineer.specialty}</Badge>
                    <span className="text-sm text-muted-foreground">{engineer.projects} projects completed</span>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Last active: {engineer.lastActive}</span>
                    </div>
                    <p className="text-sm">{engineer.recentActivity}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Groups Tab Component
function GroupsTab() {
  const [myGroups, setMyGroups] = useState([
    {
      id: 1,
      name: 'Saudi Civil Engineers Association',
      description: 'Professional network for civil engineers across the Kingdom',
      members: 2847,
      category: 'Professional Association',
      activity: 'Very Active',
      image: '/placeholder.svg',
      isJoined: true
    },
    {
      id: 2,
      name: 'NEOM Engineering Projects',
      description: 'Discussion group for engineers working on NEOM mega-city projects',
      members: 1205,
      category: 'Project-Specific',
      activity: 'Active',
      image: '/placeholder.svg',
      isJoined: true
    },
    {
      id: 3,
      name: 'Women Engineers Saudi Arabia',
      description: 'Empowering women in engineering across the Kingdom',
      members: 1567,
      category: 'Community',
      activity: 'Very Active',
      image: '/placeholder.svg',
      isJoined: true
    }
  ]);

  const [discoverGroups, setDiscoverGroups] = useState([
    {
      id: 4,
      name: 'Structural Engineering KSA',
      description: 'Knowledge sharing and best practices for structural engineers',
      members: 892,
      category: 'Technical',
      activity: 'Moderate',
      image: '/placeholder.svg',
      isJoined: false
    },
    {
      id: 5,
      name: 'Green Building & Sustainability',
      description: 'Sustainable engineering practices and green construction',
      members: 743,
      category: 'Environmental',
      activity: 'Active',
      image: '/placeholder.svg',
      isJoined: false
    }
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Engineering Groups</h2>
          <p className="text-muted-foreground">Connect with professional groups and collaborate on projects</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* My Groups */}
      <div>
        <h3 className="text-lg font-semibold mb-4">My Groups ({myGroups.length})</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {myGroups.map((group) => (
            <Card key={group.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{group.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{group.members} members</span>
                    <Badge variant={group.activity === 'Very Active' ? 'default' : group.activity === 'Active' ? 'secondary' : 'outline'}>
                      {group.activity}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs">{group.category}</Badge>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Discuss
                  </Button>
                  <Button size="sm" className="flex-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Joined
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Discover Groups */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Discover Groups</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {discoverGroups.map((group) => (
            <Card key={group.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{group.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{group.members} members</span>
                    <Badge variant={group.activity === 'Very Active' ? 'default' : group.activity === 'Active' ? 'secondary' : 'outline'}>
                      {group.activity}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs">{group.category}</Badge>
                </div>

                <Button size="sm" className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join Group
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Discover More Groups */}
      <Card className="bg-muted/50">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold mb-2">Discover More Groups</h3>
          <p className="text-muted-foreground mb-4">
            Join specialized engineering groups based on your expertise and interests.
          </p>
          <Button variant="outline">
            Browse All Groups
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Events Tab Component
function EventsTab() {
  const events = [
    {
      id: 1,
      title: 'Saudi Engineering Excellence Summit 2024',
      description: 'Annual summit showcasing innovative engineering solutions and networking opportunities',
      date: 'Friday, March 15, 2024',
      time: '09:00 AM',
      location: 'King Fahd University, Dhahran',
      organizer: 'Saudi Council of Engineers',
      attendees: 485,
      image: '/placeholder.svg',
      tags: ['Conference', 'Free'],
      isRegistered: true
    },
    {
      id: 2,
      title: 'Structural Design Workshop: Seismic Safety',
      description: 'Hands-on workshop covering latest seismic design standards and safety protocols',
      date: 'Friday, March 22, 2024',
      time: '02:00 PM',
      location: 'Riyadh Convention Center',
      organizer: 'Structural Engineers KSA',
      attendees: 128,
      image: '/placeholder.svg',
      tags: ['Workshop', '500 SAR'],
      isRegistered: false
    },
    {
      id: 3,
      title: 'NEOM Smart City Tech Meetup',
      description: 'Informal networking and tech discussions for NEOM project engineers',
      date: 'Thursday, March 28, 2024',
      time: '06:00 PM',
      location: 'NEOM Bay, Tabuk',
      organizer: 'NEOM Engineering Division',
      attendees: 67,
      image: '/placeholder.svg',
      tags: ['Meetup', 'Free'],
      isRegistered: true
    },
    {
      id: 4,
      title: 'Women in Engineering Leadership Forum',
      description: 'Empowering women engineers through leadership development and mentorship',
      date: 'Friday, April 5, 2024',
      time: '10:00 AM',
      location: 'Princess Nourah University, Riyadh',
      organizer: 'Women Engineers Saudi Arabia',
      attendees: 203,
      image: '/placeholder.svg',
      tags: ['Forum', 'Free'],
      isRegistered: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Upcoming Engineering Events</h2>
          <p className="text-muted-foreground">Discover and join engineering events across Saudi Arabia</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by:</span>
        </div>
        <div className="flex gap-2">
          {['All', 'Conferences', 'Workshops', 'Meetups', 'Free Events'].map((filter) => (
            <Button key={filter} variant="outline" size="sm">
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid gap-6">
        {events.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="h-24 w-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <p className="text-muted-foreground">{event.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                      {event.isRegistered ? (
                        <Button size="sm" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Registered
                        </Button>
                      ) : (
                        <Button size="sm">
                          Register
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Organized by: {event.organizer}</span>
                    <div className="flex gap-1">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant={tag === 'Free' ? 'default' : 'secondary'} className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stay Updated */}
      <Card className="bg-muted/50">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold mb-2">Stay Updated with Industry Events</h3>
          <p className="text-muted-foreground mb-4">
            Get notified about new engineering events, workshops, and conferences in your area.
          </p>
          <Button>
            <Bell className="h-4 w-4 mr-2" />
            Enable Event Notifications
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Newsletters Tab Component
function NewslettersTab() {
  const newsletters = [
    {
      id: 1,
      title: 'Engineering Weekly KSA',
      rating: 4.8,
      description: 'Weekly insights on engineering projects, innovations, and career opportunities across Saudi Arabia',
      subscribers: 15420,
      frequency: 'Weekly',
      publisher: 'Saudi Engineering Council',
      category: 'Industry News',
      latestUpdate: 'Vision 2030 Infrastructure Updates',
      image: '/placeholder.svg',
      isSubscribed: true
    },
    {
      id: 2,
      title: 'NEOM Engineering Digest',
      rating: 4.9,
      description: 'Exclusive updates on NEOM\'s mega-projects, smart city technologies, and engineering breakthroughs',
      subscribers: 8950,
      frequency: 'Bi-weekly',
      publisher: 'NEOM Media',
      category: 'Project Updates',
      latestUpdate: 'The Line: Latest Construction Milestones',
      image: '/placeholder.svg',
      isSubscribed: true
    },
    {
      id: 3,
      title: 'Structural Engineer\'s Journal',
      rating: 4.7,
      description: 'Technical articles, case studies, and best practices for structural engineering professionals',
      subscribers: 6730,
      frequency: 'Monthly',
      publisher: 'Professional Engineering Media',
      category: 'Technical',
      latestUpdate: 'Seismic Design Guidelines for High-Rise Buildings',
      image: '/placeholder.svg',
      isSubscribed: false
    },
    {
      id: 4,
      title: 'Women Engineers Network',
      rating: 4.6,
      description: 'Career development, success stories, and mentorship opportunities for women in engineering',
      subscribers: 4280,
      frequency: 'Monthly',
      publisher: 'WE-KSA Foundation',
      category: 'Career Development',
      latestUpdate: 'Leadership Spotlight: Breaking Barriers in Engineering',
      image: '/placeholder.svg',
      isSubscribed: true
    },
    {
      id: 5,
      title: 'Green Engineering Today',
      rating: 4.5,
      description: 'Sustainable engineering practices, environmental innovations, and green building technologies',
      subscribers: 3950,
      frequency: 'Weekly',
      publisher: 'Sustainable KSA',
      category: 'Sustainability',
      latestUpdate: 'Solar Energy Integration in Mega Projects',
      image: '/placeholder.svg',
      isSubscribed: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Engineering Newsletters</h2>
          <p className="text-muted-foreground">Stay informed with industry insights and professional development content</p>
        </div>
        <Button variant="outline">
          <Bell className="h-4 w-4 mr-2" />
          Manage Subscriptions
        </Button>
      </div>

      {/* Newsletter Cards */}
      <div className="grid gap-4">
        {newsletters.map((newsletter) => (
          <Card key={newsletter.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="h-16 w-16 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                  <img 
                    src={newsletter.image} 
                    alt={newsletter.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{newsletter.title}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-muted-foreground">{newsletter.rating}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm">{newsletter.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      {newsletter.isSubscribed ? (
                        <Button size="sm" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Subscribed
                        </Button>
                      ) : (
                        <Button size="sm">
                          <Mail className="h-4 w-4 mr-2" />
                          Subscribe
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                    <span>{newsletter.subscribers.toLocaleString()} subscribers</span>
                    <span>{newsletter.frequency}</span>
                    <span>by {newsletter.publisher}</span>
                    <Badge variant="outline" className="w-fit">{newsletter.category}</Badge>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Latest: </span>
                    <span className="font-medium">{newsletter.latestUpdate}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-muted/50">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">Create Your Newsletter</h3>
            <p className="text-muted-foreground mb-4">
              Share your engineering expertise with the community.
            </p>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Start Publishing
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">Newsletter Recommendations</h3>
            <p className="text-muted-foreground mb-4">
              Discover newsletters based on your interests and expertise.
            </p>
            <Button variant="outline">
              <ChevronRight className="h-4 w-4 mr-2" />
              Get Recommendations
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
