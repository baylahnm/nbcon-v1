import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, MessageSquare, Paperclip, Eye, Search, Filter, ChevronDown } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  assignees: Array<{
    id: string;
    name: string;
    initials: string;
  }>;
  comments: number;
  attachments: number;
  tasks: number;
  status: 'all' | 'draft' | 'open' | 'quoted' | 'todo' | 'on-progress' | 'in-review' | 'completed' | 'cancelled';
}

const mockProjects: Project[] = [
  // Draft projects
  {
    id: '1',
    title: 'NEOM Smart City Infrastructure',
    description: 'Initial planning phase for smart city infrastructure in NEOM.',
    category: 'Civil',
    priority: 'High',
    assignees: [
      { id: '1', name: 'Ahmed Al-Fahad', initials: 'AF' }
    ],
    comments: 0,
    attachments: 2,
    tasks: 1,
    status: 'draft'
  },
  {
    id: '2',
    title: 'Vision 2030 Energy Grid',
    description: 'Preliminary design for renewable energy grid system.',
    category: 'Energy',
    priority: 'High',
    assignees: [
      { id: '2', name: 'Fatima Al-Zahra', initials: 'FZ' }
    ],
    comments: 1,
    attachments: 3,
    tasks: 2,
    status: 'draft'
  },
  // Open projects
  {
    id: '3',
    title: 'Riyadh Metro Extension',
    description: 'New metro line extension project in Riyadh city center.',
    category: 'Civil',
    priority: 'High',
    assignees: [
      { id: '3', name: 'Omar Al-Farouq', initials: 'OF' },
      { id: '4', name: 'Sara Al-Mansouri', initials: 'SM' }
    ],
    comments: 3,
    attachments: 8,
    tasks: 5,
    status: 'open'
  },
  {
    id: '4',
    title: 'Jeddah Port Expansion',
    description: 'Port infrastructure expansion and modernization project.',
    category: 'Industrial',
    priority: 'Medium',
    assignees: [
      { id: '5', name: 'Khalid Al-Cheikh', initials: 'KC' }
    ],
    comments: 2,
    attachments: 6,
    tasks: 4,
    status: 'open'
  },
  // Quoted projects
  {
    id: '5',
    title: 'Dammam Airport Terminal',
    description: 'New terminal design and construction for Dammam Airport.',
    category: 'Structural',
    priority: 'High',
    assignees: [
      { id: '6', name: 'Noura Al-Ghamdi', initials: 'NG' },
      { id: '7', name: 'Mohammed Al-Rashid', initials: 'MR' }
    ],
    comments: 4,
    attachments: 12,
    tasks: 6,
    status: 'quoted'
  },
  {
    id: '6',
    title: 'AlUla Heritage Site Development',
    description: 'Infrastructure development for UNESCO heritage site.',
    category: 'Environmental',
    priority: 'Medium',
    assignees: [
      { id: '8', name: 'Aisha Al-Qahtani', initials: 'AQ' }
    ],
    comments: 1,
    attachments: 4,
    tasks: 3,
    status: 'quoted'
  },
  // To-do projects
  {
    id: '7',
    title: 'Structural Assessment - Villa Complex',
    description: 'Conduct structural integrity assessment for 15-unit villa complex in Riyadh.',
    category: 'Structural',
    priority: 'High',
    assignees: [
      { id: '9', name: 'Yousef Al-Nasser', initials: 'YN' },
      { id: '10', name: 'Rania Al-Faisal', initials: 'RF' }
    ],
    comments: 2,
    attachments: 5,
    tasks: 3,
    status: 'todo'
  },
  {
    id: '8',
    title: 'Geofencing Integration',
    description: 'Implement location-based check-in system for field engineers.',
    category: 'Mobile App',
    priority: 'Medium',
    assignees: [
      { id: '11', name: 'Hassan Al-Mutairi', initials: 'HM' },
      { id: '12', name: 'Jana Al-Sabah', initials: 'JA' }
    ],
    comments: 1,
    attachments: 3,
    tasks: 3,
    status: 'todo'
  },
  {
    id: '9',
    title: 'SCE Credential Verification',
    description: 'Saudi Council of Engineers API integration for engineer verification.',
    category: 'Platform',
    priority: 'High',
    assignees: [
      { id: '13', name: 'Saeed Al-Eid', initials: 'SE' },
      { id: '14', name: 'Nada Al-Khateeb', initials: 'NK' }
    ],
    comments: 0,
    attachments: 4,
    tasks: 3,
    status: 'todo'
  },
  // In Progress projects
  {
    id: '10',
    title: 'Bridge Load Analysis',
    description: 'Detailed load-bearing analysis for highway bridge maintenance project.',
    category: 'Civil',
    priority: 'High',
    assignees: [
      { id: '15', name: 'Rami Al-Mahmoud', initials: 'RM' },
      { id: '16', name: 'Jawad Al-Rashid', initials: 'JR' }
    ],
    comments: 4,
    attachments: 8,
    tasks: 3,
    status: 'on-progress'
  },
  {
    id: '11',
    title: 'Milestone Payment System',
    description: 'Escrow-based payment system for project milestones.',
    category: 'Platform',
    priority: 'Medium',
    assignees: [
      { id: '17', name: 'Mona Al-Sheikh', initials: 'MS' },
      { id: '18', name: 'Abdulaziz Al-Zahrani', initials: 'AZ' }
    ],
    comments: 2,
    attachments: 6,
    tasks: 3,
    status: 'on-progress'
  },
  {
    id: '12',
    title: 'HVAC System Design Review',
    description: 'Mechanical engineering review for shopping mall HVAC system.',
    category: 'Mechanical',
    priority: 'Medium',
    assignees: [
      { id: '19', name: 'Bushra Al-Turki', initials: 'BT' },
      { id: '20', name: 'Sami Al-Harbi', initials: 'SH' }
    ],
    comments: 1,
    attachments: 5,
    tasks: 3,
    status: 'on-progress'
  },
  // In Review projects
  {
    id: '13',
    title: 'Electrical Grid Assessment',
    description: 'Power distribution analysis for residential development.',
    category: 'Electrical',
    priority: 'High',
    assignees: [
      { id: '21', name: 'Dina Al-Rashid', initials: 'DR' },
      { id: '22', name: 'Ghassan Al-Shehri', initials: 'GS' }
    ],
    comments: 3,
    attachments: 9,
    tasks: 3,
    status: 'in-review'
  },
  {
    id: '14',
    title: 'AI Matching Algorithm',
    description: 'Engineer-client matching system based on skills and location.',
    category: 'Platform',
    priority: 'Medium',
    assignees: [
      { id: '23', name: 'Pamela Al-Yousef', initials: 'PY' }
    ],
    comments: 2,
    attachments: 4,
    tasks: 3,
    status: 'in-review'
  },
  // Completed projects
  {
    id: '15',
    title: 'Real-time Project Tracking',
    description: 'GPS-based tracking system for field engineers and project progress.',
    category: 'Mobile App',
    priority: 'High',
    assignees: [
      { id: '24', name: 'Tariq Al-Mutairi', initials: 'TM' },
      { id: '25', name: 'Layla Al-Sabah', initials: 'LS' }
    ],
    comments: 5,
    attachments: 12,
    tasks: 3,
    status: 'completed'
  },
  {
    id: '16',
    title: 'Foundation Analysis - Riyadh Metro',
    description: 'Geotechnical foundation assessment for metro station construction.',
    category: 'Geotechnical',
    priority: 'High',
    assignees: [
      { id: '26', name: 'Faisal Al-Harbi', initials: 'FH' },
      { id: '27', name: 'Noura Al-Turki', initials: 'NT' }
    ],
    comments: 7,
    attachments: 15,
    tasks: 3,
    status: 'completed'
  },
  {
    id: '17',
    title: 'Water Treatment Plant Inspection',
    description: 'Environmental compliance and efficiency assessment.',
    category: 'Environmental',
    priority: 'Medium',
    assignees: [
      { id: '28', name: 'Majed Al-Rashid', initials: 'MR' },
      { id: '29', name: 'Hala Al-Sheikh', initials: 'HS' }
    ],
    comments: 4,
    attachments: 8,
    tasks: 3,
    status: 'completed'
  },
  {
    id: '18',
    title: 'Solar Panel Efficiency Analysis',
    description: 'Renewable energy assessment for government buildings.',
    category: 'Energy',
    priority: 'Medium',
    assignees: [
      { id: '30', name: 'Waleed Al-Zahrani', initials: 'WZ' },
      { id: '31', name: 'Reem Al-Ghamdi', initials: 'RG' }
    ],
    comments: 3,
    attachments: 6,
    tasks: 3,
    status: 'completed'
  },
  // Cancelled projects
  {
    id: '19',
    title: 'Old Airport Renovation',
    description: 'Renovation project cancelled due to budget constraints.',
    category: 'Civil',
    priority: 'Low',
    assignees: [
      { id: '32', name: 'Khalid Al-Mutairi', initials: 'KM' }
    ],
    comments: 1,
    attachments: 2,
    tasks: 1,
    status: 'cancelled'
  },
  {
    id: '20',
    title: 'Legacy System Migration',
    description: 'Project cancelled due to technical feasibility issues.',
    category: 'Platform',
    priority: 'Medium',
    assignees: [
      { id: '33', name: 'Salma Al-Fahad', initials: 'SF' }
    ],
    comments: 2,
    attachments: 3,
    tasks: 2,
    status: 'cancelled'
  }
];

const columns = [
  { id: 'all', title: 'All Jobs', count: 0 },
  { id: 'draft', title: 'Draft', count: 0 },
  { id: 'open', title: 'Open', count: 0 },
  { id: 'quoted', title: 'Quoted', count: 0 },
  { id: 'todo', title: 'To-do', count: 0 },
  { id: 'on-progress', title: 'In Progress', count: 0 },
  { id: 'in-review', title: 'In Review', count: 0 },
  { id: 'completed', title: 'Completed', count: 0 },
  { id: 'cancelled', title: 'Cancelled', count: 0 }
];

const getCategoryColor = (category: string) => {
  const colors = {
    'Structural': 'bg-amber-100 text-amber-800',
    'Civil': 'bg-blue-100 text-blue-800',
    'Mechanical': 'bg-green-100 text-green-800',
    'Electrical': 'bg-yellow-100 text-yellow-800',
    'Industrial': 'bg-purple-100 text-purple-800',
    'Geotechnical': 'bg-orange-100 text-orange-800',
    'Environmental': 'bg-emerald-100 text-emerald-800',
    'Energy': 'bg-cyan-100 text-cyan-800',
    'Platform': 'bg-violet-100 text-violet-800',
    'Mobile App': 'bg-indigo-100 text-indigo-800'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const getPriorityColor = (priority: string) => {
  const colors = {
    'High': 'bg-red-100 text-red-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-green-100 text-green-800'
  };
  return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const statusFilters = [
  { value: 'all', label: 'All Jobs' },
  { value: 'draft', label: 'Draft' },
  { value: 'open', label: 'Open' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'todo', label: 'To-do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'in_review', label: 'In Review' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function KanbanBoard() {
  const [projects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedColumns, setExpandedColumns] = useState<Set<string>>(new Set());

  const toggleColumnExpansion = (columnId: string) => {
    setExpandedColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnId)) {
        newSet.delete(columnId);
      } else {
        newSet.add(columnId);
      }
      return newSet;
    });
  };

  // Calculate counts for each column
  const columnCounts = columns.map(column => ({
    ...column,
    count: column.id === 'all' 
      ? projects.length 
      : projects.filter(project => project.status === column.id).length
  }));

  const getProjectsByStatus = (status: string) => {
    const statusProjects = status === 'all' 
      ? projects 
      : projects.filter(project => project.status === status);
    
    if (!searchTerm) return statusProjects;
    
    return statusProjects.filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.assignees.some(assignee => 
        assignee.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search engineering projects by discipline, location, or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px] h-10">
                  <SelectValue placeholder="All Jobs" />
                </SelectTrigger>
                <SelectContent>
                  {statusFilters.map((filter) => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" className="bg-gradient-primary h-10">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>
          </div>

          <div className="text-left py-0 mt-4">
            <h2 className="text-base font-medium text-muted-foreground">
              Engineering project management board to track progress across all active assignments.
            </h2>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {columnCounts.map((column) => (
          <div key={column.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-muted-foreground">
                {column.title} ({column.count})
              </h3>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {(() => {
                const projectsInColumn = getProjectsByStatus(column.id);
                const isExpanded = expandedColumns.has(column.id);
                const displayProjects = isExpanded ? projectsInColumn : projectsInColumn.slice(0, 3);
                const hasMoreProjects = projectsInColumn.length > 3;
                
                return (
                  <>
                    {displayProjects.map((project) => (
                      <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-sm leading-tight mb-2">
                                {project.title}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {project.description}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${getCategoryColor(project.category)}`}
                              >
                                {project.category}
                              </Badge>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${getPriorityColor(project.priority)}`}
                              >
                                {project.priority}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex -space-x-2">
                                {project.assignees.slice(0, 3).map((assignee) => (
                                  <Avatar key={assignee.id} className="h-6 w-6 border-2 border-background">
                                    <AvatarFallback className="text-xs bg-gradient-primary text-primary-foreground">
                                      {assignee.initials}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                                {project.assignees.length > 3 && (
                                  <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                    <span className="text-xs text-muted-foreground">
                                      +{project.assignees.length - 3}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  <span>{project.comments}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Paperclip className="h-3 w-3" />
                                  <span>{project.attachments}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  <span>{project.tasks}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {hasMoreProjects && (
                      <div className="flex justify-center pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleColumnExpansion(column.id)}
                          className="text-xs"
                        >
                          {isExpanded ? 'Collapse' : 'View More'}
                        </Button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
