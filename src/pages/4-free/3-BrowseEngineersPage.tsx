import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../1-HomePage/others/components/ui/card';
import { Button } from '../1-HomePage/others/components/ui/button';
import { Input } from '../1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../1-HomePage/others/components/ui/tabs';
import { Badge } from '../1-HomePage/others/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../1-HomePage/others/components/ui/avatar';
import { Progress } from '../1-HomePage/others/components/ui/progress';
import { 
  Users, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  MessageSquare, 
  Eye,
  CheckCircle2,
  Award,
  Briefcase,
  DollarSign,
  Bookmark,
  TrendingUp,
  Building2,
  Zap,
  Target,
  Calculator,
  Map as MapIcon,
  List
} from 'lucide-react';

interface Engineer {
  id: string;
  name: string;
  title: string;
  company?: string;
  location: string;
  specialty: string;
  experience: number; // years
  rating: number;
  reviews: number;
  avatar?: string;
  verified: boolean;
  sceLicense?: string;
  hourlyRate: number;
  availability: 'available' | 'busy' | 'offline';
  completedProjects: number;
  responseTime: string;
  skills: string[];
  bio: string;
  isBookmarked: boolean;
  matchScore?: number; // 0-100
}

// Mock data - enhanced with more engineers
const mockEngineers: Engineer[] = [
  {
    id: '1',
    name: 'Ahmed Al-Rashid',
    title: 'Senior Structural Engineer',
    company: 'Saudi Aramco',
    location: 'Riyadh',
    specialty: 'Structural Analysis',
    experience: 12,
    rating: 4.9,
    reviews: 47,
    verified: true,
    sceLicense: 'SCE-12345',
    hourlyRate: 150,
    availability: 'available',
    completedProjects: 89,
    responseTime: '< 1 hour',
    skills: ['STAAD.Pro', 'ETABS', 'AutoCAD', 'Revit', 'SAP2000'],
    bio: 'Experienced structural engineer with expertise in high-rise buildings and infrastructure projects.',
    isBookmarked: false,
    matchScore: 95
  },
  {
    id: '2',
    name: 'Fatima Al-Zahra',
    title: 'Project Manager (PMP)',
    company: 'Bechtel Corporation',
    location: 'Jeddah',
    specialty: 'Project Management',
    experience: 8,
    rating: 4.7,
    reviews: 32,
    verified: true,
    hourlyRate: 120,
    availability: 'available',
    completedProjects: 56,
    responseTime: '< 2 hours',
    skills: ['PMP', 'Agile', 'Scrum', 'MS Project', 'Primavera'],
    bio: 'Certified project manager specializing in large-scale construction projects.',
    isBookmarked: true,
    matchScore: 88
  },
  {
    id: '3',
    name: 'Mohammed Al-Zahrani',
    title: 'Electrical Engineer',
    company: 'ACWA Power',
    location: 'Dammam',
    specialty: 'Power Systems',
    experience: 6,
    rating: 4.8,
    reviews: 28,
    verified: true,
    sceLicense: 'SCE-67890',
    hourlyRate: 100,
    availability: 'busy',
    completedProjects: 42,
    responseTime: '< 4 hours',
    skills: ['AutoCAD Electrical', 'Power Systems', 'ETAP', 'Smart Grid'],
    bio: 'Electrical engineer with focus on renewable energy and power distribution systems.',
    isBookmarked: false,
    matchScore: 78
  },
  {
    id: '4',
    name: 'Noura Al-Saud',
    title: 'Environmental Consultant',
    company: 'Red Sea Global',
    location: 'Riyadh',
    specialty: 'Environmental Engineering',
    experience: 10,
    rating: 4.9,
    reviews: 41,
    verified: true,
    sceLicense: 'SCE-45678',
    hourlyRate: 140,
    availability: 'available',
    completedProjects: 67,
    responseTime: '< 1 hour',
    skills: ['Environmental Impact', 'Sustainability', 'LEED', 'ISO 14001'],
    bio: 'LEED-certified environmental consultant specializing in sustainable development.',
    isBookmarked: true,
    matchScore: 92
  },
  {
    id: '5',
    name: 'Khalid Al-Mansouri',
    title: 'Mechanical Engineer',
    company: 'SABIC',
    location: 'Jubail',
    specialty: 'HVAC Systems',
    experience: 7,
    rating: 4.6,
    reviews: 24,
    verified: true,
    hourlyRate: 110,
    availability: 'available',
    completedProjects: 38,
    responseTime: '< 3 hours',
    skills: ['HVAC Design', 'AutoCAD MEP', 'Energy Modeling', 'CFD Analysis'],
    bio: 'Mechanical engineer specializing in HVAC and energy-efficient building systems.',
    isBookmarked: false,
    matchScore: 85
  },
  {
    id: '6',
    name: 'Laila Al-Harbi',
    title: 'Civil Engineer',
    company: 'Saudi Binladin Group',
    location: 'Mecca',
    specialty: 'Infrastructure',
    experience: 9,
    rating: 4.8,
    reviews: 36,
    verified: true,
    sceLicense: 'SCE-23456',
    hourlyRate: 130,
    availability: 'available',
    completedProjects: 52,
    responseTime: '< 2 hours',
    skills: ['Civil3D', 'Road Design', 'Drainage Systems', 'Surveying'],
    bio: 'Civil engineer with extensive experience in urban infrastructure and road networks.',
    isBookmarked: false,
    matchScore: 81
  }
];

export default function BrowseEngineersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [engineers, setEngineers] = useState(mockEngineers);

  // Filter engineers
  const filteredEngineers = engineers.filter(engineer => {
    const matchesSearch = engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         engineer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         engineer.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || engineer.specialty.includes(selectedSpecialty);
    const matchesLocation = selectedLocation === 'All' || engineer.location.includes(selectedLocation);
    
    // Filter by tab
    if (activeTab === 'verified') return matchesSearch && matchesSpecialty && matchesLocation && engineer.verified;
    if (activeTab === 'available') return matchesSearch && matchesSpecialty && matchesLocation && engineer.availability === 'available';
    if (activeTab === 'bookmarked') return matchesSearch && matchesSpecialty && matchesLocation && engineer.isBookmarked;
    
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  // Sort engineers by match score
  const sortedEngineers = [...filteredEngineers].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  const handleBookmark = (engineerId: string) => {
    setEngineers(prev => prev.map(eng => 
      eng.id === engineerId ? { ...eng, isBookmarked: !eng.isBookmarked } : eng
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl ring-1 ring-primary/20">
              <Users className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Browse Engineers</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Find the perfect engineer for your project
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setViewMode('grid')}
            >
              <List className="h-3.5 w-3.5 mr-1.5" />
              List View
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setViewMode('map')}
            >
              <MapIcon className="h-3.5 w-3.5 mr-1.5" />
              Map View
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            className="relative overflow-hidden transition-all duration-300"
            style={{
              border: '2px solid transparent',
              borderRadius: '0.5rem',
              backgroundImage: `
                linear-gradient(hsl(var(--card)), hsl(var(--card))),
                linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
              `,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <Card className="bg-transparent border-0">
              <CardContent className="p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="bg-primary h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-md">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Total Engineers</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold tracking-tight">{engineers.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">In your area</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div
            className="relative overflow-hidden transition-all duration-300"
            style={{
              border: '2px solid transparent',
              borderRadius: '0.5rem',
              backgroundImage: `
                linear-gradient(hsl(var(--card)), hsl(var(--card))),
                linear-gradient(135deg, hsl(142 65% 47% / 0.15) 0%, transparent 60%)
              `,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <Card className="bg-transparent border-0">
              <CardContent className="p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="bg-green-500/10 h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-md ring-1 ring-green-500/20">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">SCE Verified</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold tracking-tight">{engineers.filter(e => e.verified).length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Certified engineers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div
            className="relative overflow-hidden transition-all duration-300"
            style={{
              border: '2px solid transparent',
              borderRadius: '0.5rem',
              backgroundImage: `
                linear-gradient(hsl(var(--card)), hsl(var(--card))),
                linear-gradient(135deg, hsl(251 91% 60% / 0.15) 0%, transparent 60%)
              `,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <Card className="bg-transparent border-0">
              <CardContent className="p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="bg-blue-500/10 h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-md ring-1 ring-blue-500/20">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Available Now</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold tracking-tight">{engineers.filter(e => e.availability === 'available').length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Ready to start</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div
            className="relative overflow-hidden transition-all duration-300"
            style={{
              border: '2px solid transparent',
              borderRadius: '0.5rem',
              backgroundImage: `
                linear-gradient(hsl(var(--card)), hsl(var(--card))),
                linear-gradient(135deg, hsl(48 96% 53% / 0.15) 0%, transparent 60%)
              `,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <Card className="bg-transparent border-0">
              <CardContent className="p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="bg-yellow-500/10 h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-md ring-1 ring-yellow-500/20">
                      <Star className="h-5 w-5 text-yellow-600" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Avg Rating</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold tracking-tight">4.8</p>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search engineers by name, specialty, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={selectedSpecialty} 
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-xs h-10"
            >
              <option value="All">All Specialties</option>
              <option value="Structural">Structural Engineering</option>
              <option value="Project">Project Management</option>
              <option value="Electrical">Electrical Engineering</option>
              <option value="Mechanical">Mechanical Engineering</option>
              <option value="Civil">Civil Engineering</option>
              <option value="Environmental">Environmental Engineering</option>
            </select>
            <select 
              value={selectedLocation} 
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-xs h-10"
            >
              <option value="All">All Locations</option>
              <option value="Riyadh">Riyadh</option>
              <option value="Jeddah">Jeddah</option>
              <option value="Dammam">Dammam</option>
              <option value="Mecca">Mecca</option>
              <option value="Jubail">Jubail</option>
            </select>
            <Button variant="outline" size="sm" className="h-10 text-xs">
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="all" className="text-xs">
              All Engineers ({mockEngineers.length})
            </TabsTrigger>
            <TabsTrigger value="verified" className="text-xs">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              SCE Verified ({mockEngineers.filter(e => e.verified).length})
            </TabsTrigger>
            <TabsTrigger value="available" className="text-xs">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Available ({mockEngineers.filter(e => e.availability === 'available').length})
            </TabsTrigger>
            <TabsTrigger value="bookmarked" className="text-xs">
              <Bookmark className="h-3.5 w-3.5 mr-1.5" />
              Saved ({mockEngineers.filter(e => e.isBookmarked).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {/* Results count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Found <span className="font-semibold text-foreground">{sortedEngineers.length}</span> engineers
              </p>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                Sort by Match
              </Button>
            </div>

            {/* Engineer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedEngineers.map((engineer) => (
                <Card 
                  key={engineer.id}
                  className="group hover:shadow-xl transition-all duration-300 border-2 border-border/50 hover:border-primary/30 overflow-hidden gap-0"
                >
                  {/* Header with Match Score */}
                  <div className="relative bg-gradient-to-br from-muted to-muted/50 p-4">
                    {engineer.matchScore && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-primary text-primary-foreground text-xs font-bold">
                          <Target className="h-3 w-3 mr-1" />
                          {engineer.matchScore}% Match
                        </Badge>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3">
                      <Avatar className="h-16 w-16 ring-4 ring-background">
                        <AvatarImage src={engineer.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                          {engineer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base line-clamp-1">{engineer.name}</h3>
                          {engineer.verified && (
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{engineer.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${
                            engineer.availability === 'available' ? 'bg-green-500' :
                            engineer.availability === 'busy' ? 'bg-amber-500' :
                            'bg-gray-500'
                          }`} />
                          <span className="text-xs text-muted-foreground">{engineer.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-4 space-y-4">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 py-3 border-y border-border/40">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-0.5 mb-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-sm">{engineer.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{engineer.reviews} reviews</p>
                      </div>
                      <div className="text-center border-x border-border/40">
                        <div className="font-bold text-sm mb-1">{engineer.completedProjects}</div>
                        <p className="text-xs text-muted-foreground">Projects</p>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-sm mb-1">{engineer.experience}y</div>
                        <p className="text-xs text-muted-foreground">Experience</p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Top Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {engineer.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                            {skill}
                          </Badge>
                        ))}
                        {engineer.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{engineer.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm leading-relaxed text-foreground/80 line-clamp-2">
                      {engineer.bio}
                    </p>

                    {/* Rate and Response Time */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div>
                        <p className="font-bold text-sm text-primary">{engineer.hourlyRate} SAR/hr</p>
                        <p className="text-xs text-muted-foreground">Responds in {engineer.responseTime}</p>
                      </div>
                      <Badge className={`text-xs ${
                        engineer.availability === 'available' 
                          ? 'bg-green-500/10 text-green-600 border-0' 
                          : 'bg-amber-500/10 text-amber-600 border-0'
                      }`}>
                        {engineer.availability === 'available' ? 'Available' : 'Busy'}
                      </Badge>
                    </div>

                    {/* Quick Insights Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10"
                      >
                        <Calculator className="h-3 w-3 mr-1" />
                        Cost Estimate
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10"
                      >
                        <Briefcase className="h-3 w-3 mr-1" />
                        Portfolio
                      </Button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 h-8 text-xs shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
                      >
                        <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                        Contact
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleBookmark(engineer.id)}
                      >
                        <Bookmark className={`h-3.5 w-3.5 ${engineer.isBookmarked ? 'fill-current text-primary' : ''}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => navigate(`/free/engineer/${engineer.id}`)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {sortedEngineers.length === 0 && (
              <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed border-border/50">
                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium mb-1">No engineers found</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSpecialty('All');
                    setSelectedLocation('All');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
