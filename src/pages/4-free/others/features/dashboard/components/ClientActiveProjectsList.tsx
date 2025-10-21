import { useState, useEffect, useId, useRef, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Progress } from '../../../../../1-HomePage/others/components/ui/progress';
import { Building, Calendar, Users, Eye, FolderOpen, TrendingUp, ChevronUp, ChevronDown, DollarSign, Clock, X, MapPin, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOutsideClick } from '../../../../../1-HomePage/others/hooks/use-outside-click';
import XScroll from '../../../../../1-HomePage/others/components/ui/x-scroll';

interface Project {
  id: string;
  name: string;
  engineers: number;
  progress: number;
  status: 'in-progress' | 'planning' | 'review' | 'completed';
  nextMilestone: string;
  deadline: string;
  budget: string;
  image?: string;
  description?: string;
  location?: string;
  startDate?: string;
  milestones?: { name: string; completed: boolean; date: string }[];
}

interface ClientActiveProjectsListProps {
  projects?: Project[];
}

const defaultProjects: Project[] = [
  {
    id: '1',
    name: 'Al-Khobar Commercial Center',
    engineers: 5,
    progress: 68,
    status: 'in-progress',
    nextMilestone: 'Structural Design Phase 2',
    deadline: 'Dec 28, 2025',
    budget: '850,000 SAR',
    image: '/dashboardShowcase/Project Management.png',
    description: 'Multi-purpose commercial development in Al-Khobar featuring retail spaces, office buildings, and entertainment facilities. The project includes structural engineering, MEP design, and full construction oversight.',
    location: 'Al-Khobar, Eastern Province',
    startDate: 'Mar 15, 2025',
    milestones: [
      { name: 'Initial Design Review', completed: true, date: 'Apr 10, 2025' },
      { name: 'Structural Design Phase 1', completed: true, date: 'Jun 22, 2025' },
      { name: 'MEP Integration', completed: true, date: 'Sep 05, 2025' },
      { name: 'Structural Design Phase 2', completed: false, date: 'Dec 28, 2025' },
      { name: 'Final Construction Documents', completed: false, date: 'Feb 15, 2026' },
    ]
  },
  {
    id: '2',
    name: 'Riyadh Metro Extension',
    engineers: 3,
    progress: 25,
    status: 'planning',
    nextMilestone: 'Environmental Impact Study',
    deadline: 'Jan 15, 2026',
    budget: '2,100,000 SAR',
    image: '/dashboardShowcase/Real-time Cost Estimation.png',
    description: 'Extension of the Riyadh Metro system including new stations, track infrastructure, and integration with existing lines. Requires civil engineering, geotechnical studies, and environmental compliance.',
    location: 'Riyadh, Riyadh Province',
    startDate: 'Oct 01, 2025',
    milestones: [
      { name: 'Site Survey & Analysis', completed: true, date: 'Oct 15, 2025' },
      { name: 'Environmental Impact Study', completed: false, date: 'Jan 15, 2026' },
      { name: 'Preliminary Design', completed: false, date: 'Mar 20, 2026' },
      { name: 'Detailed Engineering', completed: false, date: 'Jun 30, 2026' },
    ]
  },
  {
    id: '3',
    name: 'NEOM Infrastructure Phase 2',
    engineers: 8,
    progress: 42,
    status: 'in-progress',
    nextMilestone: 'Foundation Review',
    deadline: 'Feb 10, 2026',
    budget: '3,500,000 SAR',
    image: '/dashboardShowcase/Smart Engineer Matching.png',
    description: 'Large-scale infrastructure development for NEOM smart city including roads, utilities, telecommunications, and sustainable energy systems. Multi-disciplinary engineering effort with emphasis on innovation.',
    location: 'NEOM, Tabuk Province',
    startDate: 'Jul 01, 2025',
    milestones: [
      { name: 'Conceptual Planning', completed: true, date: 'Jul 20, 2025' },
      { name: 'Site Preparation', completed: true, date: 'Sep 10, 2025' },
      { name: 'Foundation Review', completed: false, date: 'Feb 10, 2026' },
      { name: 'Infrastructure Build', completed: false, date: 'May 15, 2026' },
      { name: 'System Integration', completed: false, date: 'Aug 30, 2026' },
    ]
  },
  {
    id: '4',
    name: 'Jeddah Waterfront Development',
    engineers: 6,
    progress: 85,
    status: 'review',
    nextMilestone: 'Final Quality Inspection',
    deadline: 'Nov 30, 2025',
    budget: '1,750,000 SAR',
    image: '/dashboardShowcase/Quality Assurance.png',
    description: 'Coastal development project featuring mixed-use buildings, promenade infrastructure, and marine facilities along the Red Sea. Final review phase with emphasis on quality assurance and handover preparation.',
    location: 'Jeddah, Makkah Province',
    startDate: 'Jan 15, 2025',
    milestones: [
      { name: 'Coastal Engineering Study', completed: true, date: 'Feb 20, 2025' },
      { name: 'Marine Structure Design', completed: true, date: 'Apr 30, 2025' },
      { name: 'Building Construction', completed: true, date: 'Aug 15, 2025' },
      { name: 'Final Quality Inspection', completed: false, date: 'Nov 30, 2025' },
      { name: 'Project Handover', completed: false, date: 'Dec 15, 2025' },
    ]
  },
  {
    id: '5',
    name: 'Dammam Industrial Complex',
    engineers: 4,
    progress: 15,
    status: 'planning',
    nextMilestone: 'Geotechnical Survey',
    deadline: 'Mar 20, 2026',
    budget: '1,200,000 SAR',
    image: '/dashboardShowcase/SCE Compliance.png',
    description: 'Industrial facility development with focus on SCE compliance, environmental regulations, and sustainable industrial practices. Currently in early planning and survey phase.',
    location: 'Dammam, Eastern Province',
    startDate: 'Oct 20, 2025',
    milestones: [
      { name: 'Initial Feasibility Study', completed: true, date: 'Nov 05, 2025' },
      { name: 'Geotechnical Survey', completed: false, date: 'Mar 20, 2026' },
      { name: 'Environmental Compliance Review', completed: false, date: 'May 10, 2026' },
      { name: 'Detailed Engineering Design', completed: false, date: 'Jul 25, 2026' },
      { name: 'Construction Phase Planning', completed: false, date: 'Sep 15, 2026' },
    ]
  },
];

export const ClientActiveProjectsList = memo(function ClientActiveProjectsList({ projects = defaultProjects }: ClientActiveProjectsListProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const expandedRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // Close on Escape key
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActiveProject(null);
      }
    }

    if (activeProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeProject]);

  // Close on outside click
  useOutsideClick(expandedRef, () => setActiveProject(null));

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'in-progress':
        return { bg: 'bg-primary/10', text: 'text-primary', label: 'In Progress' };
      case 'planning':
        return { bg: 'bg-amber-500/10', text: 'text-amber-600', label: 'Planning' };
      case 'review':
        return { bg: 'bg-purple-500/10', text: 'text-purple-600', label: 'Under Review' };
      case 'completed':
        return { bg: 'bg-green-500/10', text: 'text-green-600', label: 'Completed' };
      default:
        return { bg: 'bg-gray-500/10', text: 'text-gray-600', label: 'Unknown' };
    }
  };

  return (
    <>
      {/* Expanded Project Modal */}
      <AnimatePresence>
        {activeProject && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            {/* Expanded Card */}
            <div className="fixed inset-0 grid place-items-center z-[60] p-4">
              <motion.div
                layoutId={`project-card-${activeProject.id}-${id}`}
                ref={expandedRef}
                className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-card border-2 border-border/50 rounded-2xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {/* Close Button */}
                <motion.button
                  className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-background/95 backdrop-blur-sm border border-border/50 flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-lg"
                  onClick={() => setActiveProject(null)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>

                {/* Header */}
                <div className="p-4 border-b border-primary/20 bg-gradient-to-r from-primary via-primary-dark to-primary shadow-sm shadow-primary/50">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <motion.h2
                        layoutId={`project-title-${activeProject.id}-${id}`}
                        className="text-base font-bold tracking-tight mb-2 text-primary-foreground"
                      >
                        {activeProject.name}
                      </motion.h2>
                      <p className="text-sm text-primary-foreground/90 leading-relaxed">
                        {activeProject.description}
                      </p>
                    </div>
                    <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-xs shrink-0">
                      {getStatusColor(activeProject.status).label}
                    </Badge>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/40">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-1">
                        <MapPin className="h-3 w-3" />
                        <span>Location</span>
                      </div>
                      <p className="text-sm font-medium">{activeProject.location}</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/40">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-1">
                        <Users className="h-3 w-3" />
                        <span>Team</span>
                      </div>
                      <p className="text-sm font-medium">{activeProject.engineers} Engineers</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/40">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-1">
                        <DollarSign className="h-3 w-3" />
                        <span>Budget</span>
                      </div>
                      <p className="text-sm font-medium">{activeProject.budget}</p>
                    </div>
                    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/40">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-1">
                        <Calendar className="h-3 w-3" />
                        <span>Started</span>
                      </div>
                      <p className="text-sm font-medium">{activeProject.startDate}</p>
                    </div>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Progress Section */}
                  <div className="space-y-4">
                    <h3 className="text-base font-bold tracking-tight flex items-center gap-4">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Overall Progress
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Project Completion</span>
                        <span className="font-bold text-primary">{activeProject.progress}%</span>
                      </div>
                      <Progress value={activeProject.progress} className="h-3" />
                    </div>
                  </div>

                  {/* Milestones */}
                  {activeProject.milestones && activeProject.milestones.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold tracking-tight flex items-center gap-4">
                        <FileText className="h-4 w-4 text-primary" />
                        Project Milestones
                      </h3>
                      <div className="space-y-4">
                        {activeProject.milestones.map((milestone, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`flex items-start gap-4 p-4 rounded-lg border ${
                              milestone.completed 
                                ? 'bg-green-500/5 border-green-500/20' 
                                : 'bg-muted/30 border-border/40'
                            }`}
                          >
                            <div className={`mt-0.5 ${milestone.completed ? 'text-green-600' : 'text-muted-foreground'}`}>
                              <CheckCircle2 className={`h-4 w-4 ${milestone.completed ? 'fill-green-600' : ''}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${milestone.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {milestone.name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {milestone.completed ? 'Completed' : 'Scheduled'}: {milestone.date}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next Milestone */}
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-center gap-4 text-xs text-primary font-medium mb-2">
                      <Clock className="h-3 w-3" />
                      <span>NEXT MILESTONE</span>
                    </div>
                    <p className="text-sm font-bold">{activeProject.nextMilestone}</p>
                    <p className="text-xs text-muted-foreground mt-1">Due {activeProject.deadline}</p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-border/40 bg-muted/30 flex gap-4">
                  <Button asChild variant="outline" className="flex-1 h-9 text-xs">
                    <Link to={`/free/myprojects/${activeProject.id}`}>
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      View Full Details
                    </Link>
                  </Button>
                  <Button className="flex-1 h-9 text-xs">
                    <Users className="h-3.5 w-3.5 mr-1.5" />
                    Manage Team
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Main Card */}
      <Card 
        className="group hover:shadow-lg transition-all duration-300 border-border/50 gap-0"
        style={{
          border: '2px solid transparent',
          borderRadius: '0.75rem',
          backgroundImage: `
            linear-gradient(hsl(var(--card)), hsl(var(--card))),
            linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
          `,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        <CardHeader className="p-4 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-t from-primary to-primary-dark h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-sm shadow-primary/50">
                <FolderOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-base font-bold tracking-tight">Active Projects</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Click any project to expand details
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                <Link to="/free/myprojects">
                  <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                  View All
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isCollapsed && (
          <CardContent className="p-4 bg-background rounded-b-xl">
            <div className="projects-scroll">
              <XScroll>
                <div className="flex space-x-4 p-1 pb-4">
                  {projects.map((project) => {
                    const statusColor = getStatusColor(project.status);
                    
                    return (
                      <motion.div
                        key={project.id}
                        layoutId={`project-card-${project.id}-${id}`}
                        onClick={() => setActiveProject(project)}
                        className="cursor-pointer flex-shrink-0"
                        style={{ width: '320px' }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border-border/50 overflow-hidden h-full">
                    <CardContent className="p-0">
                      {/* Project Image */}
                      {project.image && (
                        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                          <img
                            src={project.image}
                            alt={project.name}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          
                          {/* Status Badge on Image */}
                          <div className="absolute top-3 left-3">
                            <Badge className={`${statusColor.bg} ${statusColor.text} border-0 text-xs`}>
                              {statusColor.label}
                            </Badge>
                          </div>
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="p-4 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <motion.h4 
                              layoutId={`project-title-${project.id}-${id}`}
                              className="font-semibold text-sm leading-tight line-clamp-1"
                            >
                              {project.name}
                            </motion.h4>
                            <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{project.engineers} Engineers</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                <span>{project.budget}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>

                        {/* Footer Info */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/40">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span className="line-clamp-1">Next: {project.nextMilestone}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                            <Clock className="h-3 w-3" />
                            <span>Due {project.deadline}</span>
                          </div>
                        </div>

                        {/* Tap to Expand Hint */}
                        <div className="pt-2 text-center">
                          <p className="text-[10px] text-muted-foreground">
                            Click to view full details
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </XScroll>
            </div>
          </CardContent>
        )}
      </Card>
    </>
  );
});

export default ClientActiveProjectsList;

