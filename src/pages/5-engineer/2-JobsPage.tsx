import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../1-HomePage/others/components/ui/card';
import { Button } from '../1-HomePage/others/components/ui/button';
import { Input } from '../1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../1-HomePage/others/components/ui/tabs';
import { Badge } from '../1-HomePage/others/components/ui/badge';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Search, 
  Filter,
  Star,
  Users,
  Calendar,
  Bookmark,
  Eye,
  Send,
  CheckCircle2,
  X,
  AlertCircle
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  postedDate: string;
  deadline: string;
  status: 'open' | 'applied' | 'shortlisted' | 'rejected' | 'closed';
  category: string;
  experience: string;
  isBookmarked: boolean;
  companyLogo?: string;
  skills: string[];
  clientRating?: number;
  budget?: number;
}

// Mock data
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Structural Engineer',
    company: 'Saudi Aramco',
    location: 'Riyadh, Saudi Arabia',
    type: 'full-time',
    salary: {
      min: 15000,
      max: 25000,
      currency: 'SAR'
    },
    description: 'Lead structural analysis and design for major infrastructure projects in the Kingdom.',
    requirements: [
      'Bachelor\'s degree in Civil/Structural Engineering',
      'Minimum 8 years experience',
      'SCE license required',
      'Proficiency in STAAD.Pro, ETABS'
    ],
    postedDate: '2024-01-15',
    deadline: '2024-02-15',
    status: 'applied',
    category: 'Structural Engineering',
    experience: '8+ years',
    isBookmarked: true,
    skills: ['STAAD.Pro', 'ETABS', 'AutoCAD', 'Revit'],
    clientRating: 4.8
  },
  {
    id: '2',
    title: 'Project Manager - Renewable Energy',
    company: 'ACWA Power',
    location: 'Jeddah, Saudi Arabia',
    type: 'full-time',
    salary: {
      min: 12000,
      max: 20000,
      currency: 'SAR'
    },
    description: 'Manage large-scale renewable energy projects across the region.',
    requirements: [
      'PMP certification preferred',
      '5+ years project management experience',
      'Renewable energy background',
      'Strong leadership skills'
    ],
    postedDate: '2024-01-20',
    deadline: '2024-02-20',
    status: 'open',
    category: 'Project Management',
    experience: '5+ years',
    isBookmarked: false,
    skills: ['Project Management', 'Renewable Energy', 'Leadership', 'Agile'],
    clientRating: 4.6
  },
  {
    id: '3',
    title: 'Electrical Design Engineer',
    company: 'NEOM',
    location: 'Tabuk, Saudi Arabia',
    type: 'contract',
    budget: 8000,
    description: 'Design electrical systems for smart city infrastructure.',
    requirements: [
      'Electrical Engineering degree',
      '3+ years design experience',
      'AutoCAD Electrical proficiency',
      'Smart grid knowledge preferred'
    ],
    postedDate: '2024-01-25',
    deadline: '2024-02-25',
    status: 'shortlisted',
    category: 'Electrical Engineering',
    experience: '3+ years',
    isBookmarked: true,
    skills: ['AutoCAD Electrical', 'Smart Grid', 'Power Systems', 'Design'],
    clientRating: 4.9
  }
];

const jobCategories = ['All', 'Structural Engineering', 'Project Management', 'Electrical Engineering', 'Mechanical Engineering'];

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState('available');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('all');

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesType = selectedType === 'all' || job.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return <Send className="h-3 w-3" />;
      case 'shortlisted': return <CheckCircle2 className="h-3 w-3" />;
      case 'rejected': return <X className="h-3 w-3" />;
      case 'closed': return <AlertCircle className="h-3 w-3" />;
      default: return <Eye className="h-3 w-3" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            Engineering Jobs
          </h1>
          <p className="text-muted-foreground">Find your next engineering opportunity</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button size="sm">
            <Briefcase className="h-4 w-4 mr-2" />
            Job Alerts
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">{mockJobs.filter(j => j.status === 'open').length}</p>
                <p className="text-xs text-muted-foreground">Available Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">{mockJobs.filter(j => j.status === 'applied').length}</p>
                <p className="text-xs text-muted-foreground">Applied</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">{mockJobs.filter(j => j.status === 'shortlisted').length}</p>
                <p className="text-xs text-muted-foreground">Shortlisted</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">{mockJobs.filter(j => j.isBookmarked).length}</p>
                <p className="text-xs text-muted-foreground">Bookmarked</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Available Jobs ({mockJobs.filter(j => j.status === 'open').length})</TabsTrigger>
          <TabsTrigger value="applied">Applied ({mockJobs.filter(j => j.status === 'applied').length})</TabsTrigger>
          <TabsTrigger value="shortlisted">Shortlisted ({mockJobs.filter(j => j.status === 'shortlisted').length})</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked ({mockJobs.filter(j => j.isBookmarked).length})</TabsTrigger>
        </TabsList>

        {/* Available Jobs Tab */}
        <TabsContent value="available" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs by title, company, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {jobCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {filteredJobs.filter(job => job.status === 'open').map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{job.title}</h3>
                            <Badge variant="outline">{job.type.replace('-', ' ')}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {job.experience}
                            </div>
                            {job.salary && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} {job.salary.currency}
                              </div>
                            )}
                            {job.budget && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {job.budget.toLocaleString()} {job.salary?.currency || 'SAR'}
                              </div>
                            )}
                            {job.clientRating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {job.clientRating}
                              </div>
                            )}
                          </div>
                          <p className="text-sm mb-3 line-clamp-2">{job.description}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {job.skills.slice(0, 4).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {job.skills.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{job.skills.length - 4} more
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Posted {job.postedDate}</span>
                            <span>•</span>
                            <span>Deadline {job.deadline}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Bookmark className={`h-3 w-3 ${job.isBookmarked ? 'fill-current' : ''}`} />
                      </Button>
                      <Button size="sm">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Applied Jobs Tab */}
        <TabsContent value="applied" className="space-y-4">
          <div className="space-y-4">
            {mockJobs.filter(job => job.status === 'applied').map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{job.title}</h3>
                            <Badge className={getStatusColor(job.status)}>
                              {getStatusIcon(job.status)}
                              <span className="ml-1 capitalize">{job.status}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                          <p className="text-sm text-muted-foreground mb-3">{job.location}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Applied on {job.postedDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        View Application
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Shortlisted Jobs Tab */}
        <TabsContent value="shortlisted" className="space-y-4">
          <div className="space-y-4">
            {mockJobs.filter(job => job.status === 'shortlisted').map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{job.title}</h3>
                            <Badge className={getStatusColor(job.status)}>
                              {getStatusIcon(job.status)}
                              <span className="ml-1 capitalize">{job.status}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                          <p className="text-sm text-muted-foreground mb-3">{job.location}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Shortlisted on {job.postedDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm">
                        Contact Client
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Bookmarked Jobs Tab */}
        <TabsContent value="bookmarked" className="space-y-4">
          <div className="space-y-4">
            {mockJobs.filter(job => job.isBookmarked).map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{job.title}</h3>
                            <Badge variant="outline">
                              <Bookmark className="h-3 w-3 mr-1" />
                              Bookmarked
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                          <p className="text-sm text-muted-foreground mb-3">{job.location}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Posted {job.postedDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Bookmark className="h-3 w-3 fill-current" />
                      </Button>
                      <Button size="sm">
                        Apply Now
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
