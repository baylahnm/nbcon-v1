import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCurrency } from '@/hooks/useCurrency';
import { ProjectData } from '@/types/project';
import { 
  X, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar,
  Shield,
  CheckCircle,
  AlertCircle,
  FileText,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarPreviewProps {
  projectData: ProjectData;
  onClose: () => void;
}

const SidebarPreview: React.FC<SidebarPreviewProps> = ({ projectData, onClose }) => {
  const { formatAmount } = useCurrency();

  const getCompletionStatus = () => {
    const sections = ['basics', 'scope', 'requirements', 'timeline', 'compliance'];
    const completedSections = sections.filter(section => {
      switch (section) {
        case 'basics':
          return projectData.basics?.title && projectData.basics?.category;
        case 'scope':
          return projectData.scope?.description && projectData.scope?.deliverables?.length;
        case 'requirements':
          return projectData.requirements?.experience && projectData.requirements?.skills?.length;
        case 'timeline':
          return projectData.timeline?.startDate && projectData.timeline?.endDate;
        case 'compliance':
          return true; // Optional section
        default:
          return false;
      }
    });
    
    return {
      completed: completedSections.length,
      total: sections.length,
      percentage: Math.round((completedSections.length / sections.length) * 100)
    };
  };

  const status = getCompletionStatus();

  return (
    <motion.div
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed right-0 top-0 h-full w-80 bg-background border-l border-sidebar-border shadow-lg z-40 overflow-hidden"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <h3 className="text-lg font-semibold">Project Preview</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Project Title */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Title</h4>
                <p className="text-sm">
                  {projectData.basics?.title || 'No title set'}
                </p>
              </div>
              
              {projectData.basics?.category && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Category</h4>
                  <Badge variant="outline" className="text-xs">
                    {projectData.basics.category}
                  </Badge>
                </div>
              )}

              {projectData.basics?.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{projectData.basics.location}</span>
                  {projectData.basics.isRemote && (
                    <Badge variant="secondary" className="text-xs">Remote</Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Budget & Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Budget & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {projectData.basics?.budget && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Budget Range</h4>
                  <p className="text-sm font-medium">
                    {formatAmount(projectData.basics.budget.min)} - {formatAmount(projectData.basics.budget.max)} {projectData.basics.budget.currency}
                  </p>
                </div>
              )}

              {projectData.basics?.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {projectData.basics.duration.weeks} weeks
                    {projectData.basics.duration.flexible && ' (flexible)'}
                  </span>
                </div>
              )}

              {projectData.timeline?.startDate && projectData.timeline?.endDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(projectData.timeline.startDate).toLocaleDateString()} - {new Date(projectData.timeline.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Requirements Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {projectData.requirements?.experience && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Experience Level</h4>
                  <p className="text-sm">{projectData.requirements.experience}</p>
                </div>
              )}

              {projectData.requirements?.skills && projectData.requirements.skills.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Required Skills</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {projectData.requirements.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {projectData.requirements.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{projectData.requirements.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                {projectData.requirements?.portfolio && (
                  <Badge variant="outline" className="text-xs">Portfolio Required</Badge>
                )}
                {projectData.requirements?.interviews && (
                  <Badge variant="outline" className="text-xs">Interviews</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Compliance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {projectData.compliance?.sceRequired && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">SCE Certification</span>
                </div>
              )}
              {projectData.compliance?.hseRequired && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">HSE Compliance</span>
                </div>
              )}
              {projectData.compliance?.insuranceNeeded && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Professional Insurance</span>
                </div>
              )}
              {projectData.compliance?.securityClearance && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Security Clearance</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Completion Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {status.completed}/{status.total} sections
                </span>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${status.percentage}%` }}
                />
              </div>
              
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">{status.percentage}%</span>
                <p className="text-xs text-muted-foreground">Complete</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default SidebarPreview;
