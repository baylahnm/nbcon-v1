import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FolderOpen, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Calendar,
  MapPin,
  TrendingUp,
  TrendingDown,
  Download,
  Upload,
  Users,
  FileText
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  client: string;
  engineer?: string;
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  budget: number;
  currency: string;
  location: string;
  category: string;
  createdAt: string;
  deadline?: string;
  completedAt?: string;
  progress: number;
  proposals: number;
  isUrgent: boolean;
  isFeatured: boolean;
}

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Structural Analysis for NEOM Infrastructure',
    description: 'Comprehensive structural analysis for the new NEOM infrastructure development',
    client: 'NEOM Company',
    engineer: 'Ahmed Al-Rashid',
    status: 'in_progress',
    budget: 50000,
    currency: 'SAR',
    location: 'NEOM, Saudi Arabia',
    category: 'Structural Engineering',
    createdAt: '2024-01-15',
    deadline: '2024-03-15',
    progress: 65,
    proposals: 12,
    isUrgent: false,
    isFeatured: true
  },
  {
    id: '2',
    title: 'Riyadh Metro Extension Design',
    description: 'Design and engineering for the new metro extension in Riyadh',
    client: 'Saudi Aramco',
    engineer: 'Sarah Johnson',
    status: 'completed',
    budget: 75000,
    currency: 'SAR',
    location: 'Riyadh, Saudi Arabia',
    category: 'Civil Engineering',
    createdAt: '2024-01-10',
    deadline: '2024-02-28',
    completedAt: '2024-02-25',
    progress: 100,
    proposals: 8,
    isUrgent: false,
    isFeatured: false
  },
  {
    id: '3',
    title: 'Renewable Energy System Design',
    description: 'Design and implementation of solar power system for industrial facility',
    client: 'ACWA Power',
    status: 'open',
    budget: 30000,
    currency: 'SAR',
    location: 'Jeddah, Saudi Arabia',
    category: 'Electrical Engineering',
    createdAt: '2024-01-20',
    deadline: '2024-04-20',
    progress: 0,
    proposals: 15,
    isUrgent: true,
    isFeatured: false
  },
  {
    id: '4',
    title: 'HVAC System for Office Building',
    description: 'Complete HVAC system design for 20-story office building',
    client: 'SABIC',
    engineer: 'Mohammed Al-Zahrani',
    status: 'disputed',
    budget: 40000,
    currency: 'SAR',
    location: 'Dammam, Saudi Arabia',
    category: 'Mechanical Engineering',
    createdAt: '2024-01-12',
    deadline: '2024-03-12',
    progress: 80,
    proposals: 6,
    isUrgent: false,
    isFeatured: false
  }
];

const projectCategories = ['All', 'Structural Engineering', 'Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Project Management'];
const projectStatuses = ['All', 'Draft', 'Open', 'In Progress', 'Completed', 'Cancelled', 'Disputed'];

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || project.status === selectedStatus.toLowerCase().replace(' ', '_');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'disputed': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="h-3 w-3" />;
      case 'open': return <Clock className="h-3 w-3" />;
      case 'in_progress': return <Clock className="h-3 w-3" />;
      case 'completed': return <CheckCircle2 className="h-3 w-3" />;
      case 'cancelled': return <AlertCircle className="h-3 w-3" />;
      case 'disputed': return <AlertCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const totalProjects = mockProjects.length;
  const activeProjects = mockProjects.filter(p => p.status === 'in_progress').length;
  const completedProjects = mockProjects.filter(p => p.status === 'completed').length;
  const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-primary" />
            Project Management
          </h1>
          <p className="text-muted-foreground">Manage all platform projects and their status</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Projects
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">{totalProjects}</p>
                <p className="text-xs text-muted-foreground">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">{activeProjects}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">{completedProjects}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">{totalBudget.toLocaleString()} SAR</p>
                <p className="text-xs text-muted-foreground">Total Budget</p>
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
              placeholder="Search projects by title, description, or client..."
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
            {projectCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            {projectStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
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
          <TabsTrigger value="all">All Projects ({filteredProjects.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({mockProjects.filter(p => p.status === 'in_progress').length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({mockProjects.filter(p => p.status === 'completed').length})</TabsTrigger>
          <TabsTrigger value="disputed">Disputed ({mockProjects.filter(p => p.status === 'disputed').length})</TabsTrigger>
        </TabsList>

        {/* All Projects Tab */}
        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <FolderOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{project.title}</h3>
                            {project.isUrgent && (
                              <Badge variant="destructive" className="text-xs">
                                Urgent
                              </Badge>
                            )}
                            {project.isFeatured && (
                              <Badge variant="default" className="text-xs">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{project.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{project.client}</span>
                            </div>
                            {project.engineer && (
                              <div className="flex items-center gap-1">
                                <span>Engineer: {project.engineer}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{project.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Created {project.createdAt}</span>
                            </div>
                          </div>
                          {project.deadline && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <Clock className="h-3 w-3" />
                              <span>Deadline: {project.deadline}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(project.status)}>
                            {getStatusIcon(project.status)}
                            <span className="ml-1 capitalize">{project.status.replace('_', ' ')}</span>
                          </Badge>
                          <Badge variant="outline">{project.category}</Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="font-medium">{project.budget.toLocaleString()} {project.currency}</div>
                          <div className="text-muted-foreground">{project.proposals} proposals</div>
                          {project.progress > 0 && (
                            <div className="text-muted-foreground">{project.progress}% complete</div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Active Projects Tab */}
        <TabsContent value="active" className="space-y-4">
          <div className="space-y-4">
            {mockProjects.filter(p => p.status === 'in_progress').map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <FolderOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{project.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{project.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{project.client}</span>
                            </div>
                            {project.engineer && (
                              <div className="flex items-center gap-1">
                                <span>Engineer: {project.engineer}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{project.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right">
                        <div className="space-y-1 text-sm">
                          <div className="font-medium">{project.budget.toLocaleString()} {project.currency}</div>
                          <div className="text-muted-foreground">{project.progress}% complete</div>
                          {project.deadline && (
                            <div className="text-muted-foreground">Due: {project.deadline}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Completed Projects Tab */}
        <TabsContent value="completed" className="space-y-4">
          <div className="space-y-4">
            {mockProjects.filter(p => p.status === 'completed').map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <FolderOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{project.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{project.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{project.client}</span>
                            </div>
                            {project.engineer && (
                              <div className="flex items-center gap-1">
                                <span>Engineer: {project.engineer}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Completed {project.completedAt}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right">
                        <div className="space-y-1 text-sm">
                          <div className="font-medium">{project.budget.toLocaleString()} {project.currency}</div>
                          <div className="text-muted-foreground">100% complete</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Disputed Projects Tab */}
        <TabsContent value="disputed" className="space-y-4">
          <div className="space-y-4">
            {mockProjects.filter(p => p.status === 'disputed').map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{project.title}</h3>
                            <Badge variant="destructive">Disputed</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{project.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{project.client}</span>
                            </div>
                            {project.engineer && (
                              <div className="flex items-center gap-1">
                                <span>Engineer: {project.engineer}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              <span>Requires Resolution</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right">
                        <div className="space-y-1 text-sm">
                          <div className="font-medium">{project.budget.toLocaleString()} {project.currency}</div>
                          <div className="text-muted-foreground">{project.progress}% complete</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="destructive">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
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
  );
}
