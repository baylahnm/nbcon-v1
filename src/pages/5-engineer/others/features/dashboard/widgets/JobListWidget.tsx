import React from 'react';
import { Briefcase, MapPin, Clock, DollarSign, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Progress } from '../../../../../1-HomePage/others/components/ui/progress';
import { Widget } from '../types/widget';
import BaseWidget from './BaseWidget';

interface JobListWidgetProps {
  widget: Widget;
  isEditMode?: boolean;
  onConfigClick?: () => void;
}

export const JobListWidget: React.FC<JobListWidgetProps> = ({
  widget,
  isEditMode = false,
  onConfigClick
}) => {
  const config = widget.config;
  const maxItems = config.maxItems || 5;
  const showFilters = config.showFilters !== false;
  const showSearch = config.showSearch !== false;

  // Mock job data
  const jobs = [
    {
      id: 1,
      title: "Senior Structural Engineer",
      company: "Saudi Binladin Group",
      location: "Riyadh",
      salary: "25,000 - 35,000 SAR",
      type: "Contract",
      match: 95,
      postedAt: "2 days ago",
      status: "open"
    },
    {
      id: 2,
      title: "Civil Engineer - Infrastructure",
      company: "NEOM Development Authority",
      location: "NEOM",
      salary: "18,000 - 28,000 SAR",
      type: "Full-time",
      match: 88,
      postedAt: "1 week ago",
      status: "open"
    },
    {
      id: 3,
      title: "Environmental Consultant",
      company: "Red Sea Global",
      location: "Red Sea Coast",
      salary: "20,000 - 30,000 SAR",
      type: "Contract",
      match: 92,
      postedAt: "3 days ago",
      status: "open"
    },
    {
      id: 4,
      title: "MEP Engineer",
      company: "Modern Engineering",
      location: "Jeddah",
      salary: "22,000 - 32,000 SAR",
      type: "Full-time",
      match: 85,
      postedAt: "5 days ago",
      status: "open"
    },
    {
      id: 5,
      title: "Project Manager",
      company: "Al-Rashid Construction",
      location: "Dammam",
      salary: "30,000 - 40,000 SAR",
      type: "Full-time",
      match: 78,
      postedAt: "1 week ago",
      status: "open"
    }
  ];

  const displayedJobs = jobs.slice(0, maxItems);

  const getMatchColor = (match: number) => {
    if (match >= 90) return 'text-success';
    if (match >= 80) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getMatchBadgeVariant = (match: number) => {
    if (match >= 90) return 'default';
    if (match >= 80) return 'secondary';
    return 'outline';
  };

  return (
    <BaseWidget
      widget={widget}
      isEditMode={isEditMode}
      onConfigClick={onConfigClick}
      className="h-full"
    >
      <div className="h-full flex flex-col">
        {/* Header with Search and Filters */}
        {(showSearch || showFilters) && (
          <div className="mb-4 space-y-2">
            {showSearch && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full px-3 py-2 text-sm border border-sidebar-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}
            {showFilters && (
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">All</Badge>
                <Badge variant="secondary" className="text-xs">Contract</Badge>
                <Badge variant="outline" className="text-xs">Full-time</Badge>
              </div>
            )}
          </div>
        )}

        {/* Jobs List */}
        <div className="flex-1 space-y-3 overflow-y-auto">
          {displayedJobs.map((job) => (
            <Card key={job.id} className="p-3 hover:shadow-sm transition-shadow">
              <div className="space-y-2">
                {/* Job Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground truncate">
                      {job.title}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {job.company}
                    </p>
                  </div>
                  <Badge 
                    variant={getMatchBadgeVariant(job.match)}
                    className={`text-xs ${getMatchColor(job.match)}`}
                  >
                    {job.match}%
                  </Badge>
                </div>

                {/* Job Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {job.postedAt}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs font-medium text-success">
                      <DollarSign className="w-3 h-3" />
                      {job.salary}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {job.type}
                    </Badge>
                  </div>
                </div>

                {/* Action Button */}
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <Briefcase className="w-3 h-3 mr-1" />
                  View Details
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-sidebar-border">
          <Button variant="outline" size="sm" className="w-full text-xs">
            <Briefcase className="w-3 h-3 mr-1" />
            View All Jobs
          </Button>
        </div>
      </div>
    </BaseWidget>
  );
};

export default JobListWidget;
