import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar as CalendarIcon, X, Filter } from 'lucide-react';
import { useCalendarStore, EventType, EventStatus } from '@/stores/useCalendarStore';
import { useTeamStore } from '@/hooks/useTeamStore';

interface CalendarFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalendarFilters({ isOpen, onClose }: CalendarFiltersProps) {
  const {
    filters,
    updateFilters,
    clearFilters,
    getEventTypeColor,
    getStatusColor
  } = useCalendarStore();

  const { getProjectsWithDetails } = useTeamStore();
  const projects = getProjectsWithDetails();

  const [localFilters, setLocalFilters] = useState(filters);
  
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const eventTypes: { value: EventType; label: string }[] = [
    { value: 'job', label: 'Job' },
    { value: 'milestone', label: 'Milestone' },
    { value: 'visit', label: 'Visit' },
    { value: 'invoice', label: 'Invoice' },
    { value: 'call', label: 'Call' },
    { value: 'payout', label: 'Payout' }
  ];

  const eventStatuses: { value: EventStatus; label: string }[] = [
    { value: 'draft', label: 'Draft' },
    { value: 'open', label: 'Open' },
    { value: 'quoted', label: 'Quoted' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'scheduled', label: 'Scheduled' }
  ];

  const saudiCities = [
    'Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina', 'Tabuk', 'Buraidah',
    'Khamis Mushait', 'Al-Hufuf', 'Al-Mubarraz', 'Ha\'il', 'Najran',
    'Al-Kharj', 'Al-Qatif', 'Jubail', 'Yanbu', 'Abha', 'Al-Taif',
    'NEOM', 'Red Sea', 'Virtual'
  ];

  const roleContexts = [
    { value: 'mine', label: 'My Items' },
    { value: 'team', label: 'Team Items' },
    { value: 'company', label: 'Company Items' }
  ];

  const handleEventTypeChange = (eventType: EventType, checked: boolean) => {
    const newEventTypes = checked
      ? [...localFilters.eventTypes, eventType]
      : localFilters.eventTypes.filter(type => type !== eventType);
    
    setLocalFilters(prev => ({
      ...prev,
      eventTypes: newEventTypes
    }));
  };

  const handleStatusChange = (status: EventStatus, checked: boolean) => {
    const newStatuses = checked
      ? [...localFilters.statuses, status]
      : localFilters.statuses.filter(s => s !== status);
    
    setLocalFilters(prev => ({
      ...prev,
      statuses: newStatuses
    }));
  };

  const handleCityChange = (city: string, checked: boolean) => {
    const newCities = checked
      ? [...localFilters.cities, city]
      : localFilters.cities.filter(c => c !== city);
    
    setLocalFilters(prev => ({
      ...prev,
      cities: newCities
    }));
  };

  const handleProjectChange = (projectId: string, checked: boolean) => {
    const newProjectIds = checked
      ? Array.from(new Set([...localFilters.projectIds, projectId]))
      : localFilters.projectIds.filter(id => id !== projectId);
    
    setLocalFilters(prev => ({
      ...prev,
      projectIds: newProjectIds
    }));
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    const date = value ? new Date(value) : null;
    setLocalFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: date
      }
    }));
  };

  const applyFilters = () => {
    updateFilters(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      eventTypes: [],
      statuses: [],
      dateRange: { start: null, end: null },
      roleContext: 'mine' as const,
      cities: [],
      searchTerm: '',
      projectIds: []
    };
    setLocalFilters(clearedFilters);
    clearFilters();
  };

  const getActiveFiltersCount = () => {
    return (
      localFilters.eventTypes.length +
      localFilters.statuses.length +
      localFilters.cities.length +
      localFilters.projectIds.length +
      (localFilters.dateRange.start ? 1 : 0) +
      (localFilters.dateRange.end ? 1 : 0) +
      (localFilters.searchTerm ? 1 : 0)
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Calendar Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Term</Label>
            <Input
              id="search"
              placeholder="Search events..."
              value={localFilters.searchTerm}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                searchTerm: e.target.value
              }))}
            />
          </div>

          {/* Event Types */}
          <div className="space-y-3">
            <Label>Event Types</Label>
            <div className="grid grid-cols-2 gap-2">
              {eventTypes.map(type => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.value}`}
                    checked={localFilters.eventTypes.includes(type.value)}
                    onCheckedChange={(checked) => 
                      handleEventTypeChange(type.value, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`type-${type.value}`}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Badge className={`text-xs ${getEventTypeColor(type.value)}`}>
                      {type.label}
                    </Badge>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Event Statuses */}
          <div className="space-y-3">
            <Label>Event Status</Label>
            <div className="grid grid-cols-2 gap-2">
              {eventStatuses.map(status => (
                <div key={status.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status.value}`}
                    checked={localFilters.statuses.includes(status.value)}
                    onCheckedChange={(checked) => 
                      handleStatusChange(status.value, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`status-${status.value}`}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Badge className={`text-xs ${getStatusColor(status.value)}`}>
                      {status.label}
                    </Badge>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <Label>Date Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={localFilters.dateRange.start?.toISOString().split('T')[0] || ''}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={localFilters.dateRange.end?.toISOString().split('T')[0] || ''}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Role Context */}
          <div className="space-y-2">
            <Label>Role Context</Label>
            <Select
              value={localFilters.roleContext}
              onValueChange={(value) => setLocalFilters(prev => ({
                ...prev,
                roleContext: value as 'mine' | 'team' | 'company'
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleContexts.map(context => (
                  <SelectItem key={context.value} value={context.value}>
                    {context.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Projects */}
          <div className="space-y-3">
            <Label>Projects</Label>
            <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-1">
              {projects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No projects available yet.</p>
              ) : (
                projects.map(project => (
                  <div key={project.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`project-${project.id}`}
                      checked={localFilters.projectIds.includes(project.id)}
                      onCheckedChange={(checked) =>
                        handleProjectChange(project.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={`project-${project.id}`} className="text-sm">
                      {project.name}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cities */}
          <div className="space-y-3">
            <Label>Cities</Label>
            <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-1">
              {saudiCities.map(city => (
                <div key={city} className="flex items-center space-x-2">
                  <Checkbox
                    id={`city-${city}`}
                    checked={localFilters.cities.includes(city)}
                    onCheckedChange={(checked) => 
                      handleCityChange(city, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`city-${city}`}
                    className="text-sm"
                  >
                    {city}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handleClearFilters}>
              Clear All
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={applyFilters} className="bg-gradient-primary">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
