/**
 * ProjectDetailsPanel - Right Sidebar Project Details
 * 
 * Features:
 * - Conditional/dismissible right sidebar (380px width)
 * - Rich project metadata display
 * - Milestones timeline with progress
 * - Action buttons for common tasks
 * - Smooth slide-in/out animations
 * 
 * @module components/dashboard/advanced
 * @version 1.0.0
 * @created January 28, 2025
 */

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { Separator } from '@/pages/1-HomePage/others/components/ui/separator';
import { 
  X, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText, 
  Eye, 
  MessageSquare, 
  TrendingUp,
  CheckCircle2,
  Circle,
  Building,
  Clock
} from 'lucide-react';
import { ProjectConfig } from './ProjectsCarousel';

interface ProjectDetailsPanelProps {
  project: ProjectConfig | null;
  isOpen: boolean;
  onClose: () => void;
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

/**
 * ProjectDetailsPanel Component
 * 
 * Slide-in right sidebar showing detailed project information
 */
export function ProjectDetailsPanel({ project, isOpen, onClose }: ProjectDetailsPanelProps) {
  if (!project) return null;

  const statusConfig = getStatusConfig(project.status);
  const completedMilestones = project.milestones?.filter(m => m.completed).length || 0;
  const totalMilestones = project.milestones?.length || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Slide-in Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full lg:w-[380px] bg-background border-l border-border shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header with Close Button */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight line-clamp-2">{project.title}</h2>
                  <p className="text-xs text-muted-foreground mt-1">{project.type}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full -mt-1"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Status Badge */}
              <div>
                <Badge className={`${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} text-xs font-medium`}>
                  {statusConfig.label}
                </Badge>
              </div>

              {/* Description */}
              {project.description && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Project Overview</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>
              )}

              <Separator />

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="text-xs">Location</span>
                  </div>
                  <p className="text-sm font-medium">{project.location}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="text-xs">Budget</span>
                  </div>
                  <p className="text-sm font-medium">{project.budget}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span className="text-xs">Team Size</span>
                  </div>
                  <p className="text-sm font-medium">{project.engineers || project.tasks} members</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs">Started</span>
                  </div>
                  <p className="text-sm font-medium">{project.startDate || project.created}</p>
                </div>
              </div>

              <Separator />

              {/* Progress Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Overall Progress</h3>
                  <span className="text-sm font-bold text-primary">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2.5" />
              </div>

              <Separator />

              {/* Milestones Timeline */}
              {project.milestones && project.milestones.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Milestones</h3>
                    <span className="text-xs text-muted-foreground">
                      {completedMilestones}/{totalMilestones} completed
                    </span>
                  </div>

                  <div className="space-y-3">
                    {project.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {/* Status Icon */}
                        <div className="mt-0.5">
                          {milestone.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>

                        {/* Milestone Info */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            milestone.completed ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {milestone.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{milestone.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button className="w-full h-9 text-xs" onClick={(e) => { e.stopPropagation(); }}>
                  <Eye className="h-3.5 w-3.5 mr-2" />
                  View Full Details
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs" onClick={(e) => { e.stopPropagation(); }}>
                    <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs" onClick={(e) => { e.stopPropagation(); }}>
                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                    Reports
                  </Button>
                </div>
              </div>

              {/* Last Updated Footer */}
              <div className="pt-4 border-t border-border/40">
                <p className="text-xs text-muted-foreground text-center">
                  Last updated: {project.lastUpdated}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

