import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../1-HomePage/others/components/ui/card';
import { Button } from '../1-HomePage/others/components/ui/button';
import { Input } from '../1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../1-HomePage/others/components/ui/tabs';
import { Badge } from '../1-HomePage/others/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../1-HomePage/others/components/ui/avatar';
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
  Calendar,
  DollarSign,
  Bookmark,
  ChevronRight
} from 'lucide-react';

interface Engineer {
  id: string;
  name: string;
  title: string;
  company?: string;
  location: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  avatar?: string;
  verified: boolean;
  sceLicense?: string;
  hourlyRate?: number;
  availability: 'available' | 'busy' | 'offline';
  completedProjects: number;
  responseTime: string;
  skills: string[];
  bio: string;
  portfolio?: string[];
  isBookmarked: boolean;
}

// Mock data
const mockEngineers: Engineer[] = [
  {
    id: '1',
    name: 'Ahmed Al-Rashid',
    title: 'Senior Structural Engineer',
    company: 'Saudi Aramco',
    location: 'Riyadh, Saudi Arabia',
    specialty: 'Structural Analysis',
    experience: '12 years',
    rating: 4.9,
    reviews: 47,
    avatar: '/api/placeholder/40/40',
    verified: true,
    sceLicense: 'SCE-12345',
    hourlyRate: 150,
    availability: 'available',
    completedProjects: 89,
    responseTime: '1 hour',
    skills: ['STAAD.Pro', 'ETABS', 'AutoCAD', 'Revit', 'SAP2000'],
    bio: 'Experienced structural engineer with expertise in high-rise buildings and infrastructure projects.',
    isBookmarked: false
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    title: 'Project Manager',
    company: 'Bechtel Corporation',
    location: 'Jeddah, Saudi Arabia',
    specialty: 'Project Management',
    experience: '8 years',
    rating: 4.7,
    reviews: 32,
    avatar: '/api/placeholder/40/40',
    verified: true,
    hourlyRate: 120,
    availability: 'available',
    completedProjects: 56,
    responseTime: '2 hours',
    skills: ['PMP', 'Agile', 'Scrum', 'Microsoft Project', 'Primavera'],
    bio: 'Certified project manager specializing in large-scale construction projects.',
    isBookmarked: true
  },
  {
    id: '3',
    name: 'Mohammed Al-Zahrani',
    title: 'Electrical Engineer',
    company: 'ACWA Power',
    location: 'Dammam, Saudi Arabia',
    specialty: 'Power Systems',
    experience: '6 years',
    rating: 4.8,
    reviews: 28,
    avatar: '/api/placeholder/40/40',
    verified: true,
    sceLicense: 'SCE-67890',
    hourlyRate: 100,
    availability: 'busy',
    completedProjects: 42,
    responseTime: '4 hours',
    skills: ['AutoCAD Electrical', 'Power System Analysis', 'ETAP', 'Smart Grid'],
    bio: 'Electrical engineer with focus on renewable energy and power distribution systems.',
    isBookmarked: false
  }
];

const specialties = ['All', 'Structural Engineering', 'Project Management', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'];

export default function BrowseEngineersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  const filteredEngineers = mockEngineers.filter(engineer => {
    const matchesSearch = engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         engineer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         engineer.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || engineer.specialty === selectedSpecialty;
    const matchesLocation = selectedLocation === 'All' || engineer.location.includes(selectedLocation);
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'available': return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'busy': return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case 'offline': return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
      default: return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Browse Engineers
          </h1>
          <p className="text-muted-foreground">Find the perfect engineer for your project</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button size="sm">
            <Users className="h-4 w-4 mr-2" />
            Post Job
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">{mockEngineers.length}</p>
                <p className="text-xs text-muted-foreground">Total Engineers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">{mockEngineers.filter(e => e.verified).length}</p>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">4.8</p>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">{mockEngineers.filter(e => e.availability === 'available').length}</p>
                <p className="text-xs text-muted-foreground">Available Now</p>
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
              placeholder="Search engineers by name, specialty, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedSpecialty} 
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
          <select 
            value={selectedLocation} 
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="All">All Locations</option>
            <option value="Riyadh">Riyadh</option>
            <option value="Jeddah">Jeddah</option>
            <option value="Dammam">Dammam</option>
          </select>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="rating">Sort by Rating</option>
            <option value="experience">Sort by Experience</option>
            <option value="rate">Sort by Rate</option>
            <option value="availability">Sort by Availability</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Engineers ({filteredEngineers.length})</TabsTrigger>
          <TabsTrigger value="verified">Verified ({mockEngineers.filter(e => e.verified).length})</TabsTrigger>
          <TabsTrigger value="available">Available Now ({mockEngineers.filter(e => e.availability === 'available').length})</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked ({mockEngineers.filter(e => e.isBookmarked).length})</TabsTrigger>
        </TabsList>

        {/* All Engineers Tab */}
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEngineers.map((engineer) => (
              <Card key={engineer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={engineer.avatar} alt={engineer.name} />
                          <AvatarFallback>{engineer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{engineer.name}</h3>
                            {engineer.verified && (
                              <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{engineer.title}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {getAvailabilityIcon(engineer.availability)}
                            <span className="text-xs text-muted-foreground">{engineer.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Bookmark className={`h-4 w-4 ${engineer.isBookmarked ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm font-medium">{engineer.rating}</p>
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">({engineer.reviews})</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{engineer.completedProjects}</p>
                        <p className="text-xs text-muted-foreground">Projects</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{engineer.experience}</p>
                        <p className="text-xs text-muted-foreground">Experience</p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {engineer.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {engineer.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{engineer.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Rate and Availability */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{engineer.hourlyRate} SAR/hr</p>
                        <p className="text-xs text-muted-foreground">Response: {engineer.responseTime}</p>
                      </div>
                      <Badge className={getAvailabilityColor(engineer.availability)}>
                        {engineer.availability}
                      </Badge>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-muted-foreground line-clamp-2">{engineer.bio}</p>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Verified Engineers Tab */}
        <TabsContent value="verified" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockEngineers.filter(e => e.verified).map((engineer) => (
              <Card key={engineer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={engineer.avatar} alt={engineer.name} />
                          <AvatarFallback>{engineer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{engineer.name}</h3>
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <p className="text-sm text-muted-foreground">{engineer.title}</p>
                          <p className="text-xs text-muted-foreground">{engineer.location}</p>
                        </div>
                      </div>
                      <Badge className={getAvailabilityColor(engineer.availability)}>
                        {engineer.availability}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{engineer.rating}</span>
                        <span className="text-sm text-muted-foreground">({engineer.reviews} reviews)</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{engineer.hourlyRate} SAR/hr</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Available Now Tab */}
        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockEngineers.filter(e => e.availability === 'available').map((engineer) => (
              <Card key={engineer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={engineer.avatar} alt={engineer.name} />
                          <AvatarFallback>{engineer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{engineer.name}</h3>
                            {engineer.verified && (
                              <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{engineer.title}</p>
                          <p className="text-xs text-muted-foreground">{engineer.location}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{engineer.rating}</span>
                        <span className="text-sm text-muted-foreground">({engineer.reviews} reviews)</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{engineer.hourlyRate} SAR/hr</p>
                        <p className="text-xs text-muted-foreground">Response: {engineer.responseTime}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Contact Now
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Bookmarked Tab */}
        <TabsContent value="bookmarked" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockEngineers.filter(e => e.isBookmarked).map((engineer) => (
              <Card key={engineer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={engineer.avatar} alt={engineer.name} />
                          <AvatarFallback>{engineer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{engineer.name}</h3>
                            {engineer.verified && (
                              <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{engineer.title}</p>
                          <p className="text-xs text-muted-foreground">{engineer.location}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Badge className="bg-blue-100 text-blue-800">
                          <Bookmark className="h-3 w-3 mr-1" />
                          Bookmarked
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{engineer.rating}</span>
                        <span className="text-sm text-muted-foreground">({engineer.reviews} reviews)</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{engineer.hourlyRate} SAR/hr</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
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

