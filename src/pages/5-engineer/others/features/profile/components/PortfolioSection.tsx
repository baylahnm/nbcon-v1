import { useState } from 'react';
import { 
  FolderOpen, 
  Plus, 
  Grid3x3, 
  List, 
  Star, 
  DollarSign,
  Calendar,
  Building2,
  Eye,
  Filter
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../../1-HomePage/others/components/ui/tabs';

interface PortfolioSectionProps {
  isEditMode?: boolean;
}

interface Project {
  id: string;
  name: string;
  clientName: string;
  clientCompany: string;
  category: 'commercial' | 'residential' | 'infrastructure' | 'industrial';
  role: string;
  value: number;
  durationMonths: number;
  startDate: string;
  status: 'completed' | 'in_progress';
  thumbnailUrl?: string;
  technologies: string[];
  rating: number;
  isFeatured: boolean;
}

export function PortfolioSection({ isEditMode = false }: PortfolioSectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data
  const projects: Project[] = [
    {
      id: '1',
      name: 'NEOM Smart City Infrastructure Phase 1',
      clientName: 'Mohammed Al-Zahrani',
      clientCompany: 'NEOM Development Company',
      category: 'infrastructure',
      role: 'Lead Structural Engineer',
      value: 450000,
      durationMonths: 8,
      startDate: '2024-02-01',
      status: 'completed',
      technologies: ['SAP2000', 'AutoCAD', 'Revit', 'ETABS'],
      rating: 5.0,
      isFeatured: true
    },
    {
      id: '2',
      name: 'King Fahd Stadium Renovation',
      clientName: 'Fahad Al-Otaibi',
      clientCompany: 'Ministry of Sports',
      category: 'commercial',
      role: 'Structural Consultant',
      value: 275000,
      durationMonths: 6,
      startDate: '2023-08-01',
      status: 'completed',
      technologies: ['ETABS', 'Revit BIM', 'SAP2000'],
      rating: 4.8,
      isFeatured: true
    },
    {
      id: '3',
      name: 'Red Sea Marina Resort',
      clientName: 'Sarah Johnson',
      clientCompany: 'Red Sea Global',
      category: 'commercial',
      role: 'Senior Structural Engineer',
      value: 185000,
      durationMonths: 5,
      startDate: '2023-01-15',
      status: 'completed',
      technologies: ['AutoCAD', 'Revit', 'Manual Calculations'],
      rating: 4.9,
      isFeatured: false
    },
    {
      id: '4',
      name: 'Residential Complex - Al Nakheel District',
      clientName: 'Omar Hassan',
      clientCompany: 'Al Rajhi Development',
      category: 'residential',
      role: 'Structural Engineer',
      value: 125000,
      durationMonths: 4,
      startDate: '2022-09-01',
      status: 'completed',
      technologies: ['AutoCAD', 'ETABS'],
      rating: 4.7,
      isFeatured: false
    },
    {
      id: '5',
      name: 'Industrial Warehouse Expansion',
      clientName: 'Khalid Al-Mansour',
      clientCompany: 'Saudi Logistics Co.',
      category: 'industrial',
      role: 'Consulting Engineer',
      value: 95000,
      durationMonths: 3,
      startDate: '2024-08-01',
      status: 'in_progress',
      technologies: ['SAP2000', 'AutoCAD'],
      rating: 0,
      isFeatured: false
    },
    {
      id: '6',
      name: 'Shopping Mall Foundation Design',
      clientName: 'Abdullah Al-Faisal',
      clientCompany: 'Arabian Centers',
      category: 'commercial',
      role: 'Lead Engineer',
      value: 220000,
      durationMonths: 7,
      startDate: '2022-01-01',
      status: 'completed',
      technologies: ['SAP2000', 'Revit BIM', 'ETABS'],
      rating: 4.9,
      isFeatured: true
    }
  ];

  const categories = [
    { value: 'all', label: 'All Projects', count: projects.length },
    { value: 'commercial', label: 'Commercial', count: projects.filter(p => p.category === 'commercial').length },
    { value: 'residential', label: 'Residential', count: projects.filter(p => p.category === 'residential').length },
    { value: 'infrastructure', label: 'Infrastructure', count: projects.filter(p => p.category === 'infrastructure').length },
    { value: 'industrial', label: 'Industrial', count: projects.filter(p => p.category === 'industrial').length },
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderProjectCard = (project: Project) => (
    <div
      key={project.id}
      className="group/project relative overflow-hidden rounded-lg border border-border/40 bg-gradient-to-br from-card to-card/50 hover:shadow-md hover:border-primary/20 transition-all duration-300"
      style={project.isFeatured ? {
        borderWidth: '2px',
        borderColor: 'transparent',
        backgroundImage: `
          linear-gradient(hsl(var(--card)), hsl(var(--card))),
          linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, transparent 50%)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box'
      } : {}}
    >
      {/* Project Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
        {project.thumbnailUrl ? (
          <img 
            src={project.thumbnailUrl} 
            alt={project.name}
            className="h-full w-full object-cover group-hover/project:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-center p-6">
            <FolderOpen className="h-16 w-16 text-primary/40 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">No image</p>
          </div>
        )}
        
        {/* Featured Badge */}
        {project.isFeatured && (
          <Badge className="absolute top-3 right-3 bg-amber-500 text-white border-0 shadow-md text-xs px-2.5 py-1">
            <Star className="h-3 w-3 mr-1 fill-white" />
            Featured
          </Badge>
        )}

        {/* Status Badge */}
        {project.status === 'in_progress' && (
          <Badge className="absolute top-3 left-3 bg-blue-500 text-white border-0 shadow-md text-xs px-2.5 py-1">
            In Progress
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <div>
          <h3 className="text-base font-semibold mb-1 line-clamp-2">{project.name}</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Building2 className="h-3 w-3" />
            {project.clientCompany}
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground py-2 border-y border-border/30">
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-3 w-3 text-emerald-600" />
            <span className="font-medium text-emerald-600">{formatCurrency(project.value)}</span>
          </div>
          <div className="h-3 w-px bg-border/40" />
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>{project.durationMonths} months</span>
          </div>
        </div>

        {/* Role */}
        <div>
          <span className="text-xs text-muted-foreground">Role: </span>
          <span className="text-xs font-medium">{project.role}</span>
        </div>

        {/* Rating (if completed) */}
        {project.status === 'completed' && project.rating > 0 && (
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold">{project.rating}</span>
            <span className="text-xs text-muted-foreground">/5.0</span>
          </div>
        )}

        {/* Technologies */}
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 3).map((tech) => (
            <Badge 
              key={tech}
              variant="outline" 
              className="text-xs px-2 py-0 h-5 bg-muted/50"
            >
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 3 && (
            <Badge variant="outline" className="text-xs px-2 py-0 h-5">
              +{project.technologies.length - 3}
            </Badge>
          )}
        </div>

        {/* Action */}
        <Button 
          variant="outline" 
          size="sm"
          className="w-full shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-xs h-8 mt-2"
        >
          <Eye className="h-3 w-3 mr-1.5" />
          View Details
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500/10 p-2.5 rounded-xl ring-1 ring-indigo-500/20 group-hover:scale-110 transition-transform">
            <FolderOpen className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-base font-bold">Project Portfolio</h2>
            <p className="text-xs text-muted-foreground">{projects.length} total projects</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => setViewMode('grid')}
              className="h-7 w-7 p-0"
            >
              <Grid3x3 className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
              className="h-7 w-7 p-0"
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
          {isEditMode && (
            <Button size="sm" variant="outline" className="text-xs h-8">
              <Plus className="h-3 w-3 mr-1.5" />
              Add Project
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Filters */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="w-full grid grid-cols-5 gap-0">
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value} className="text-xs">
                {cat.label}
                <Badge variant="outline" className="ml-1.5 text-[9px] px-1.5 py-0 h-4">
                  {cat.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            {/* Grid View */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.map(renderProjectCard)}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-5 rounded-lg border border-border/40 bg-gradient-to-br from-card to-card/50 hover:shadow-md hover:border-primary/20 transition-all duration-300"
                  >
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="w-32 h-32 flex-shrink-0 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        {project.thumbnailUrl ? (
                          <img 
                            src={project.thumbnailUrl} 
                            alt={project.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <FolderOpen className="h-12 w-12 text-primary/40" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-base font-semibold mb-1">{project.name}</h3>
                            <p className="text-xs text-muted-foreground">{project.clientCompany}</p>
                          </div>
                          {project.isFeatured && (
                            <Badge className="bg-amber-500/10 text-amber-600 border-0 ring-1 ring-amber-500/20 text-xs">
                              <Star className="h-3 w-3 mr-1 fill-amber-600" />
                              Featured
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs">
                          <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                            <DollarSign className="h-3 w-3" />
                            {formatCurrency(project.value)}
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {project.durationMonths} months
                          </div>
                          <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                            {project.role}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.map((tech) => (
                            <Badge 
                              key={tech}
                              variant="outline" 
                              className="text-xs px-2 py-0 h-5 bg-muted/50"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>

                        {project.status === 'completed' && project.rating > 0 && (
                          <div className="flex items-center gap-1.5 pt-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-bold">{project.rating}</span>
                            <span className="text-xs text-muted-foreground">/5.0</span>
                          </div>
                        )}

                        <Button 
                          variant="outline" 
                          size="sm"
                          className="shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-xs h-7 mt-2"
                        >
                          <Eye className="h-3 w-3 mr-1.5" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold mb-2">No projects in this category</h3>
            <p className="text-xs text-muted-foreground mb-6">
              Try selecting a different category or add your first project
            </p>
            {isEditMode && (
              <Button size="sm" className="text-xs">
                <Plus className="h-3 w-3 mr-1.5" />
                Add Project
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

