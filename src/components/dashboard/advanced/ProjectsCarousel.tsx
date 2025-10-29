/**
 * ProjectsCarousel - Horizontal Scrolling Recent Projects
 *
 * Features:
 * - Horizontal carousel with XScroll
 * - Live Supabase project data
 * - Smooth animations
 * - Click to open Project Details panel
 * - Progress indicators and status badges
 *
 * @module components/dashboard/advanced
 * @version 1.0.0
 * @created January 28, 2025
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent } from '@/pages/1-HomePage/others/components/ui/card';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import {
  Building,
  Users,
  DollarSign,
  Clock,
  Eye,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from 'lucide-react';

export interface ProjectConfig {
  id: string;
  title: string;
  tasks: number;
  budget: string;
  progress: number;
  status: 'planning' | 'in-progress' | 'pending-review' | 'on-hold' | 'completed';
  description: string;
  type: string;
  location: string;
  created: string;
  lastUpdated: string;
  image?: string;
  startDate?: string;
  milestones?: { name: string; completed: boolean; date: string }[];
  engineers?: number;
}

interface ProjectsCarouselProps {
  projects: ProjectConfig[];
  onProjectClick: (project: ProjectConfig) => void;
  isLoading?: boolean;
}

const getStatusConfig = (status: ProjectConfig['status']) => {
  switch (status) {
    case 'in-progress':
      return { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20', label: 'In Progress' };
    case 'planning':
      return { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20', label: 'Planning' };
    case 'pending-review':
      return { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-500/20', label: 'Under Review' };
    case 'on-hold':
      return { bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-500/20', label: 'On Hold' };
    case 'completed':
      return { bg: 'bg-green-500/10', text: 'text-green-600', border: 'border-green-500/20', label: 'Completed' };
    default:
      return { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border', label: 'Unknown' };
  }
};

export function ProjectsCarousel({ projects, onProjectClick, isLoading = false }: ProjectsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const hasProjects = useMemo(() => Array.isArray(projects) && projects.length > 0, [projects]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) {
      return;
    }

    scrollElement.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) {
      return;
    }

    const scrollAmount = 420;
    scrollRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  let content: React.ReactNode;

  if (isLoading) {
    content = (
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3].map((placeholder) => (
          <Card key={placeholder} className="min-w-[400px] w-[400px] shrink-0">
            <CardContent className="p-4">
              <div className="space-y-3 animate-pulse">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="flex gap-4">
                  <div className="h-4 bg-muted rounded w-16" />
                  <div className="h-4 bg-muted rounded w-16" />
                </div>
                <div className="h-2 bg-muted rounded w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  } else if (!hasProjects) {
    content = (
      <Card>
        <CardContent className="p-8 text-center">
          <Building className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No recent projects</p>
        </CardContent>
      </Card>
    );
  } else {
    content = (
      <div className="relative">
        {showLeftArrow ? (
          <Button
            size="icon"
            variant="outline"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/98 backdrop-blur-md shadow-xl border-2 border-primary/20 hover:border-primary/40"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        ) : null}

        {showRightArrow ? (
          <Button
            size="icon"
            variant="outline"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/98 backdrop-blur-md shadow-xl border-2 border-primary/20 hover:border-primary/40"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        ) : null}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {projects.map((project) => {
            const statusConfig = getStatusConfig(project.status);

            return (
              <Card
                key={project.id}
                className="min-w-[400px] w-[400px] shrink-0 snap-start cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-border/50"
                onClick={() => onProjectClick(project)}
              >
                {project.image ? (
                  <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={`${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} text-xs font-medium px-2 py-1`}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </div>
                ) : null}

                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base line-clamp-2">{project.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[11px] px-2 py-1">
                        <Users className="h-3 w-3 mr-1" />
                        {project.engineers ?? project.tasks}
                      </Badge>
                      <Badge variant="outline" className="text-[11px] px-2 py-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {project.startDate ?? project.created}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Status</span>
                      <Badge className={`${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} text-[11px] px-2`}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Budget</span>
                      <span className="font-medium text-foreground flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-primary" />
                        {project.budget}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {project.location}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      Updated {project.lastUpdated}
                    </div>
                  </div>

                  {project.milestones && project.milestones.length > 0 ? (
                    <div className="space-y-2 bg-muted/40 rounded-lg p-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Milestones</span>
                        <span>
                          {project.milestones.filter((milestone) => milestone.completed).length}/{project.milestones.length} Completed
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {project.milestones.slice(0, 3).map((milestone) => (
                          <Badge
                            key={milestone.name}
                            variant={milestone.completed ? 'default' : 'outline'}
                            className="text-[10px] px-2 py-1"
                          >
                            <Briefcase className="h-3 w-3 mr-1" />
                            {milestone.name}
                          </Badge>
                        ))}
                        {project.milestones.length > 3 ? (
                          <Badge variant="outline" className="text-[10px] px-2 py-1">
                            +{project.milestones.length - 3} more
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Tasks</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {project.tasks} tasks
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return <>{content}</>;
}
