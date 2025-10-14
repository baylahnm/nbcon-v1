import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../../1-HomePage/others/components/ui/dialog';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Input } from '../../../../../1-HomePage/others/components/ui/input';
import { Label } from '../../../../../1-HomePage/others/components/ui/label';
import { Textarea } from '../../../../../1-HomePage/others/components/ui/textarea';
import { Switch } from '../../../../../1-HomePage/others/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../../../../1-HomePage/others/components/ui/select';
import { 
  X, 
  Users, 
  Briefcase, 
  Target, 
  CheckCircle, 
  Video, 
  Presentation,
  Building2,
  FileText,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  UserPlus,
  Bell,
  Repeat,
  Globe
} from 'lucide-react';
import type { CalendarEvent } from '../../../../../5-engineer/others/stores/useCalendarStore';

interface EnterpriseCreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Omit<CalendarEvent, 'id'>) => void;
  initialDate?: Date;
}

export default function EnterpriseCreateEventDialog({
  isOpen,
  onClose,
  onSave,
  initialDate = new Date()
}: EnterpriseCreateEventDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'meeting' as 'meeting' | 'project' | 'deadline' | 'task' | 'conference' | 'presentation' | 'client-meeting' | 'team-meeting' | 'review',
    startTime: initialDate,
    endTime: new Date(initialDate.getTime() + 60 * 60 * 1000), // 1 hour later
    location: '',
    participants: [] as string[],
    department: '',
    team: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    isRecurring: false,
    recurrencePattern: 'none' as 'none' | 'daily' | 'weekly' | 'monthly',
    sendNotifications: true,
    isPublic: false,
    requiresApproval: false
  });

  const eventTypes = [
    { id: 'meeting', name: 'Meeting', icon: Users, color: 'text-blue-600' },
    { id: 'project', name: 'Project Review', icon: Briefcase, color: 'text-green-600' },
    { id: 'deadline', name: 'Deadline', icon: Target, color: 'text-red-600' },
    { id: 'task', name: 'Task', icon: CheckCircle, color: 'text-purple-600' },
    { id: 'conference', name: 'Conference', icon: Video, color: 'text-indigo-600' },
    { id: 'presentation', name: 'Presentation', icon: Presentation, color: 'text-amber-600' },
    { id: 'client-meeting', name: 'Client Meeting', icon: Building2, color: 'text-emerald-600' },
    { id: 'team-meeting', name: 'Team Meeting', icon: Users, color: 'text-cyan-600' },
    { id: 'review', name: 'Review', icon: FileText, color: 'text-orange-600' }
  ];

  const departments = [
    { id: 'engineering', name: 'Engineering' },
    { id: 'project-management', name: 'Project Management' },
    { id: 'quality-assurance', name: 'Quality Assurance' },
    { id: 'procurement', name: 'Procurement' },
    { id: 'finance', name: 'Finance' },
    { id: 'hr', name: 'Human Resources' }
  ];

  const teams = [
    { id: 'structural', name: 'Structural Engineering' },
    { id: 'mechanical', name: 'Mechanical Engineering' },
    { id: 'electrical', name: 'Electrical Engineering' },
    { id: 'civil', name: 'Civil Engineering' },
    { id: 'project-managers', name: 'Project Managers' },
    { id: 'quality-team', name: 'Quality Team' }
  ];

  const handleSave = () => {
    if (!formData.title.trim()) {
      return;
    }

    const eventData: Omit<CalendarEvent, 'id'> = {
      title: formData.title,
      description: formData.description,
      startTime: formData.startTime,
      endTime: formData.endTime,
      type: formData.type,
      location: formData.location,
      participants: formData.participants,
      // Add enterprise-specific fields
      department: formData.department,
      team: formData.team,
      priority: formData.priority,
      isRecurring: formData.isRecurring,
      recurrencePattern: formData.recurrencePattern,
      sendNotifications: formData.sendNotifications,
      isPublic: formData.isPublic,
      requiresApproval: formData.requiresApproval
    };

    onSave(eventData);
  };

  const formatDateTime = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  const handleDateTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const newDate = new Date(value);
    setFormData(prev => ({
      ...prev,
      [field]: newDate
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Create Enterprise Event
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Event Title *</Label>
              <Input
                placeholder="Enter event title..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold">Event Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <IconComponent className={`h-4 w-4 ${type.color}`} />
                          {type.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-semibold">Description</Label>
              <Textarea
                placeholder="Enter event description..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold">Start Date & Time *</Label>
                <Input
                  type="datetime-local"
                  value={formatDateTime(formData.startTime)}
                  onChange={(e) => handleDateTimeChange('startTime', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">End Date & Time *</Label>
                <Input
                  type="datetime-local"
                  value={formatDateTime(formData.endTime)}
                  onChange={(e) => handleDateTimeChange('endTime', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Location & Participants */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Location</Label>
              <Input
                placeholder="Enter location or meeting link..."
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold">Participants</Label>
              <Input
                placeholder="Enter participant emails (comma-separated)..."
                value={formData.participants.join(', ')}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  participants: e.target.value.split(',').map(p => p.trim()).filter(p => p) 
                }))}
                className="mt-1"
              />
            </div>
          </div>

          {/* Enterprise-Specific Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold">Department</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-semibold">Team</Label>
                <Select value={formData.team} onValueChange={(value) => setFormData(prev => ({ ...prev, team: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Recurring Event */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Recurring Event</Label>
              <Switch
                checked={formData.isRecurring}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecurring: checked }))}
              />
            </div>

            {formData.isRecurring && (
              <div>
                <Label className="text-sm font-semibold">Recurrence Pattern</Label>
                <Select value={formData.recurrencePattern} onValueChange={(value) => setFormData(prev => ({ ...prev, recurrencePattern: value as any }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Recurrence</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Send Notifications</Label>
              <Switch
                checked={formData.sendNotifications}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendNotifications: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Public Event</Label>
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Requires Approval</Label>
              <Switch
                checked={formData.requiresApproval}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requiresApproval: checked }))}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleSave} className="flex-1" disabled={!formData.title.trim()}>
              Create Event
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
