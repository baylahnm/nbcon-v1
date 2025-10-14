import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../../1-HomePage/others/components/ui/dialog';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Input } from '../../../../../1-HomePage/others/components/ui/input';
import { Label } from '../../../../../1-HomePage/others/components/ui/label';
import { Switch } from '../../../../../1-HomePage/others/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../../../../1-HomePage/others/components/ui/select';
import { 
  Filter, 
  X, 
  Users, 
  Briefcase, 
  Building2, 
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Target,
  CheckCircle,
  Video,
  Presentation,
  FileText
} from 'lucide-react';

interface EnterpriseCalendarFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnterpriseCalendarFilters({ isOpen, onClose }: EnterpriseCalendarFiltersProps) {
  const [filters, setFilters] = useState({
    eventTypes: [] as string[],
    departments: [] as string[],
    teams: [] as string[],
    locations: [] as string[],
    participants: [] as string[],
    dateRange: {
      start: '',
      end: ''
    },
    showCompleted: true,
    showCancelled: false,
    showRecurring: true,
    priority: 'all' as 'all' | 'high' | 'medium' | 'low'
  });

  const eventTypes = [
    { id: 'meeting', name: 'Meetings', icon: Users, color: 'text-blue-600' },
    { id: 'project', name: 'Project Reviews', icon: Briefcase, color: 'text-green-600' },
    { id: 'deadline', name: 'Deadlines', icon: Target, color: 'text-red-600' },
    { id: 'task', name: 'Tasks', icon: CheckCircle, color: 'text-purple-600' },
    { id: 'conference', name: 'Conferences', icon: Video, color: 'text-indigo-600' },
    { id: 'presentation', name: 'Presentations', icon: Presentation, color: 'text-amber-600' },
    { id: 'client-meeting', name: 'Client Meetings', icon: Building2, color: 'text-emerald-600' },
    { id: 'team-meeting', name: 'Team Meetings', icon: Users, color: 'text-cyan-600' },
    { id: 'review', name: 'Reviews', icon: FileText, color: 'text-orange-600' }
  ];

  const departments = [
    { id: 'engineering', name: 'Engineering' },
    { id: 'project-management', name: 'Project Management' },
    { id: 'quality-assurance', name: 'Quality Assurance' },
    { id: 'procurement', name: 'Procurement' },
    { id: 'finance', name: 'Finance' },
    { id: 'hr', name: 'Human Resources' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'sales', name: 'Sales' }
  ];

  const teams = [
    { id: 'structural', name: 'Structural Engineering' },
    { id: 'mechanical', name: 'Mechanical Engineering' },
    { id: 'electrical', name: 'Electrical Engineering' },
    { id: 'civil', name: 'Civil Engineering' },
    { id: 'project-managers', name: 'Project Managers' },
    { id: 'quality-team', name: 'Quality Team' },
    { id: 'procurement-team', name: 'Procurement Team' },
    { id: 'finance-team', name: 'Finance Team' }
  ];

  const locations = [
    { id: 'riyadh', name: 'Riyadh' },
    { id: 'jeddah', name: 'Jeddah' },
    { id: 'dammam', name: 'Dammam' },
    { id: 'neom', name: 'NEOM' },
    { id: 'red-sea', name: 'Red Sea' },
    { id: 'virtual', name: 'Virtual/Online' },
    { id: 'client-site', name: 'Client Site' },
    { id: 'office', name: 'Office' }
  ];

  const handleEventTypeToggle = (eventType: string) => {
    setFilters(prev => ({
      ...prev,
      eventTypes: prev.eventTypes.includes(eventType)
        ? prev.eventTypes.filter(t => t !== eventType)
        : [...prev.eventTypes, eventType]
    }));
  };

  const handleDepartmentToggle = (department: string) => {
    setFilters(prev => ({
      ...prev,
      departments: prev.departments.includes(department)
        ? prev.departments.filter(d => d !== department)
        : [...prev.departments, department]
    }));
  };

  const handleTeamToggle = (team: string) => {
    setFilters(prev => ({
      ...prev,
      teams: prev.teams.includes(team)
        ? prev.teams.filter(t => t !== team)
        : [...prev.teams, team]
    }));
  };

  const handleLocationToggle = (location: string) => {
    setFilters(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location]
    }));
  };

  const handleApplyFilters = () => {
    // TODO: Apply filters to calendar store
    console.log('Applying filters:', filters);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({
      eventTypes: [],
      departments: [],
      teams: [],
      locations: [],
      participants: [],
      dateRange: { start: '', end: '' },
      showCompleted: true,
      showCancelled: false,
      showRecurring: true,
      priority: 'all'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Enterprise Calendar Filters
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Types */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Event Types</Label>
            <div className="grid grid-cols-2 gap-2">
              {eventTypes.map((type) => {
                const IconComponent = type.icon;
                const isSelected = filters.eventTypes.includes(type.id);
                return (
                  <Button
                    key={type.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() => handleEventTypeToggle(type.id)}
                  >
                    <IconComponent className={`h-3 w-3 mr-2 ${type.color}`} />
                    {type.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Departments */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Departments</Label>
            <div className="grid grid-cols-2 gap-2">
              {departments.map((dept) => {
                const isSelected = filters.departments.includes(dept.id);
                return (
                  <Button
                    key={dept.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() => handleDepartmentToggle(dept.id)}
                  >
                    <Building2 className="h-3 w-3 mr-2" />
                    {dept.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Teams */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Teams</Label>
            <div className="grid grid-cols-2 gap-2">
              {teams.map((team) => {
                const isSelected = filters.teams.includes(team.id);
                return (
                  <Button
                    key={team.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() => handleTeamToggle(team.id)}
                  >
                    <Users className="h-3 w-3 mr-2" />
                    {team.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Locations */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Locations</Label>
            <div className="grid grid-cols-2 gap-2">
              {locations.map((location) => {
                const isSelected = filters.locations.includes(location.id);
                return (
                  <Button
                    key={location.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() => handleLocationToggle(location.id)}
                  >
                    <MapPin className="h-3 w-3 mr-2" />
                    {location.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Date Range</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Start Date</Label>
                <Input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: e.target.value }
                  }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">End Date</Label>
                <Input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: e.target.value }
                  }))}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Priority */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Priority</Label>
            <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value as any }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Options</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Show Completed Events</Label>
                <Switch
                  checked={filters.showCompleted}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showCompleted: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Show Cancelled Events</Label>
                <Switch
                  checked={filters.showCancelled}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showCancelled: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Show Recurring Events</Label>
                <Switch
                  checked={filters.showRecurring}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showRecurring: checked }))}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleApplyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear All
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
