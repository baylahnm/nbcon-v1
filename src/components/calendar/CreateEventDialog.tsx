import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CalendarEvent, EventType, EventStatus } from '@/stores/useCalendarStore';
import { useThemeStore } from '@/stores/theme';
import { Calendar, Clock, MapPin, Users, DollarSign, Tag, Building, Briefcase, Target, HardHat, FileText, Phone, CreditCard, CalendarIcon, ClockIcon } from 'lucide-react';

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  initialDate?: Date;
}

// Theme-aware label component
const ThemedLabel = ({ 
  htmlFor, 
  children, 
  themeTokens 
}: { 
  htmlFor: string; 
  children: React.ReactNode; 
  themeTokens: any;
}) => (
  <Label 
    htmlFor={htmlFor}
    style={{ color: `hsl(${themeTokens['--foreground'] || '0 0% 3.9%'})` }}
  >
    {children}
  </Label>
);

// Theme-aware datetime input component
const ThemedDateTimeInput = ({ 
  id, 
  type, 
  value, 
  onChange, 
  error, 
  themeTokens 
}: { 
  id: string; 
  type: 'date' | 'datetime-local'; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  error?: string;
  themeTokens: any;
}) => {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        {type === 'date' ? (
          <CalendarIcon 
            className="h-4 w-4" 
            style={{ 
              color: `hsl(${themeTokens['--muted-foreground'] || '0 0% 45%'})` 
            }} 
          />
        ) : (
          <ClockIcon 
            className="h-4 w-4" 
            style={{ 
              color: `hsl(${themeTokens['--muted-foreground'] || '0 0% 45%'})` 
            }} 
          />
        )}
      </div>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`pl-10 ${error ? 'border-red-500' : ''}`}
        data-themed-datetime="true"
        style={{
          backgroundColor: `hsl(${themeTokens['--background'] || '0 0% 100%'})`,
          borderColor: error 
            ? `hsl(${themeTokens['--destructive'] || '4 65% 48%'})`
            : `hsl(${themeTokens['--border'] || '0 0% 90%'})`,
          color: `hsl(${themeTokens['--foreground'] || '0 0% 3.9%'})`,
          // @ts-ignore - CSS custom property
          '--tw-ring-color': `hsl(${themeTokens['--ring'] || '142 65% 47%'})`,
          transition: 'all 0.2s ease-in-out',
          // Custom properties for datetime picker
          '--date-picker-bg': `hsl(${themeTokens['--background'] || '0 0% 100%'})`,
          '--date-picker-text': `hsl(${themeTokens['--foreground'] || '0 0% 3.9%'})`,
          '--date-picker-border': `hsl(${themeTokens['--border'] || '0 0% 90%'})`,
          '--date-picker-accent': `hsl(${themeTokens['--primary'] || '142 65% 47%'})`,
          '--date-picker-muted': `hsl(${themeTokens['--muted'] || '0 0% 96%'})`
        }}
        onMouseEnter={(e) => {
          const target = e.target as HTMLInputElement;
          if (!target.matches(':focus')) {
            target.style.borderColor = `hsl(${themeTokens['--ring'] || '142 65% 47%'} / 0.5)`;
          }
        }}
        onMouseLeave={(e) => {
          const target = e.target as HTMLInputElement;
          if (!target.matches(':focus')) {
            target.style.borderColor = error 
              ? `hsl(${themeTokens['--destructive'] || '4 65% 48%'})`
              : `hsl(${themeTokens['--border'] || '0 0% 90%'})`;
          }
        }}
        onFocus={(e) => {
          const target = e.target as HTMLInputElement;
          target.style.borderColor = `hsl(${themeTokens['--ring'] || '142 65% 47%'})`;
          target.style.boxShadow = `0 0 0 2px hsl(${themeTokens['--ring'] || '142 65% 47%'} / 0.2)`;
        }}
        onBlur={(e) => {
          const target = e.target as HTMLInputElement;
          target.style.borderColor = error 
            ? `hsl(${themeTokens['--destructive'] || '4 65% 48%'})`
            : `hsl(${themeTokens['--border'] || '0 0% 90%'})`;
          target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
};

// Theme-aware icon component
const EventTypeIcon = ({ type, themeTokens }: { type: EventType; themeTokens: any }) => {
  const getIconStyle = (type: EventType) => {
    const styles = {
      job: {
        color: `hsl(${themeTokens['--info'] || '217 92% 55%'})`,
        backgroundColor: `hsl(${themeTokens['--info'] || '217 92% 55%'} / 0.1)`,
        borderColor: `hsl(${themeTokens['--info'] || '217 92% 55%'} / 0.2)`
      },
      milestone: {
        color: `hsl(${themeTokens['--success'] || '156 68% 37%'})`,
        backgroundColor: `hsl(${themeTokens['--success'] || '156 68% 37%'} / 0.1)`,
        borderColor: `hsl(${themeTokens['--success'] || '156 68% 37%'} / 0.2)`
      },
      visit: {
        color: `hsl(${themeTokens['--warning'] || '32 100% 42%'})`,
        backgroundColor: `hsl(${themeTokens['--warning'] || '32 100% 42%'} / 0.1)`,
        borderColor: `hsl(${themeTokens['--warning'] || '32 100% 42%'} / 0.2)`
      },
      invoice: {
        color: `hsl(${themeTokens['--destructive'] || '4 65% 48%'})`,
        backgroundColor: `hsl(${themeTokens['--destructive'] || '4 65% 48%'} / 0.1)`,
        borderColor: `hsl(${themeTokens['--destructive'] || '4 65% 48%'} / 0.2)`
      },
      call: {
        color: `hsl(270 70% 50%)`,
        backgroundColor: `hsl(270 70% 50% / 0.1)`,
        borderColor: `hsl(270 70% 50% / 0.2)`
      },
      payout: {
        color: `hsl(${themeTokens['--primary'] || '142 65% 47%'})`,
        backgroundColor: `hsl(${themeTokens['--primary'] || '142 65% 47%'} / 0.1)`,
        borderColor: `hsl(${themeTokens['--primary'] || '142 65% 47%'} / 0.2)`
      }
    };
    return styles[type] || styles.job;
  };

  const iconStyle = getIconStyle(type);
  const iconProps = {
    className: "h-4 w-4",
    style: { 
      color: iconStyle.color,
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
    }
  };

  const iconComponents = {
    job: <Briefcase {...iconProps} />,
    milestone: <Target {...iconProps} />,
    visit: <HardHat {...iconProps} />,
    invoice: <FileText {...iconProps} />,
    call: <Phone {...iconProps} />,
    payout: <CreditCard {...iconProps} />
  };

  return (
    <div 
      className="w-6 h-6 rounded-md flex items-center justify-center border transition-all duration-200 hover:scale-110"
      style={{
        backgroundColor: iconStyle.backgroundColor,
        borderColor: iconStyle.borderColor
      }}
    >
      {iconComponents[type]}
    </div>
  );
};

const eventTypes: { value: EventType; label: string }[] = [
  { value: 'job', label: 'Job' },
  { value: 'milestone', label: 'Milestone' },
  { value: 'visit', label: 'Site Visit' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'call', label: 'Call/Meeting' },
  { value: 'payout', label: 'Payout' }
];

const eventStatuses: { value: EventStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'open', label: 'Open' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

const getPriorityStyle = (priority: string, themeTokens: any) => {
  const styles = {
    High: {
      backgroundColor: `hsl(${themeTokens['--destructive'] || '4 65% 48%'} / 0.1)`,
      color: `hsl(${themeTokens['--destructive'] || '4 65% 48%'})`,
      borderColor: `hsl(${themeTokens['--destructive'] || '4 65% 48%'} / 0.2)`
    },
    Medium: {
      backgroundColor: `hsl(${themeTokens['--warning'] || '32 100% 42%'} / 0.1)`,
      color: `hsl(${themeTokens['--warning'] || '32 100% 42%'})`,
      borderColor: `hsl(${themeTokens['--warning'] || '32 100% 42%'} / 0.2)`
    },
    Low: {
      backgroundColor: `hsl(${themeTokens['--success'] || '156 68% 37%'} / 0.1)`,
      color: `hsl(${themeTokens['--success'] || '156 68% 37%'})`,
      borderColor: `hsl(${themeTokens['--success'] || '156 68% 37%'} / 0.2)`
    }
  };
  return styles[priority as keyof typeof styles] || styles.Medium;
};

const saudiCities = [
  'Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina', 'Tabuk', 'Buraidah',
  'Khamis Mushait', 'Al-Hufuf', 'Al-Mubarraz', 'Ha\'il', 'Najran',
  'Al-Kharj', 'Al-Qatif', 'Jubail', 'Yanbu', 'Abha', 'Al-Taif',
  'NEOM', 'Red Sea', 'Virtual'
];

const mockAssignees = [
  { id: '1', name: 'Ahmed Al-Fahad', initials: 'AF' },
  { id: '2', name: 'Fatima Al-Zahra', initials: 'FZ' },
  { id: '3', name: 'Omar Al-Farouq', initials: 'OF' },
  { id: '4', name: 'Sara Al-Mansouri', initials: 'SM' },
  { id: '5', name: 'Khalid Al-Cheikh', initials: 'KC' },
  { id: '6', name: 'Noura Al-Ghamdi', initials: 'NG' },
  { id: '7', name: 'Mohammed Al-Rashid', initials: 'MR' },
  { id: '8', name: 'Aisha Al-Qahtani', initials: 'AQ' }
];

export default function CreateEventDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  initialDate 
}: CreateEventDialogProps) {
  const { applied: themeTokens } = useThemeStore();
  
  // Inject custom CSS for datetime picker theming
  useEffect(() => {
    const styleId = 'datetime-picker-theme';
    let existingStyle = document.getElementById(styleId);
    
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Datetime picker theming */
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-calendar-picker-indicator,
      input[data-themed-datetime="true"][type="date"]::-webkit-calendar-picker-indicator {
        background: transparent;
        color: ${themeTokens['--muted-foreground'] || 'hsl(0 0% 45%)'};
        cursor: pointer;
        padding: 6px;
        border-radius: 6px;
        transition: all 0.2s ease;
        width: 20px;
        height: 20px;
        margin-right: 4px;
        opacity: 0.8;
      }
      
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-calendar-picker-indicator:hover,
      input[data-themed-datetime="true"][type="date"]::-webkit-calendar-picker-indicator:hover {
        background: ${themeTokens['--muted'] || 'hsl(0 0% 96%)'};
        color: ${themeTokens['--primary'] || 'hsl(142 65% 47%)'};
        opacity: 1;
        transform: scale(1.05);
      }
      
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-calendar-picker-indicator:active,
      input[data-themed-datetime="true"][type="date"]::-webkit-calendar-picker-indicator:active {
        background: ${themeTokens['--primary'] || 'hsl(142 65% 47%)'};
        color: ${themeTokens['--primary-foreground'] || 'hsl(0 0% 100%)'};
        transform: scale(0.95);
      }
      
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-datetime-edit,
      input[data-themed-datetime="true"][type="date"]::-webkit-datetime-edit {
        color: ${themeTokens['--foreground'] || 'hsl(0 0% 3.9%)'};
      }
      
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-datetime-edit-fields-wrapper,
      input[data-themed-datetime="true"][type="date"]::-webkit-datetime-edit-fields-wrapper {
        background: transparent;
      }
      
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-datetime-edit-text,
      input[data-themed-datetime="true"][type="date"]::-webkit-datetime-edit-text {
        color: ${themeTokens['--muted-foreground'] || 'hsl(0 0% 45%)'};
      }
      
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-datetime-edit-month-field,
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-datetime-edit-day-field,
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-datetime-edit-year-field,
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-datetime-edit-hour-field,
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-datetime-edit-minute-field,
      input[data-themed-datetime="true"][type="date"]::-webkit-datetime-edit-month-field,
      input[data-themed-datetime="true"][type="date"]::-webkit-datetime-edit-day-field,
      input[data-themed-datetime="true"][type="date"]::-webkit-datetime-edit-year-field {
        color: ${themeTokens['--foreground'] || 'hsl(0 0% 3.9%)'};
        background: transparent;
        border-radius: 4px;
        padding: 2px 4px;
        transition: all 0.2s ease;
      }
      
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-datetime-edit-month-field:hover,
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-datetime-edit-day-field:hover,
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-datetime-edit-year-field:hover,
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-datetime-edit-hour-field:hover,
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-datetime-edit-minute-field:hover,
      input[data-themed-datetime="true"][type="date"]::-webkit-datetime-edit-month-field:hover,
      input[data-themed-datetime="true"][type="date"]::-webkit-datetime-edit-day-field:hover,
      input[data-themed-datetime="true"][type="date"]::-webkit-datetime-edit-year-field:hover {
        background: ${themeTokens['--muted'] || 'hsl(0 0% 96%)'};
      }
      
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-datetime-edit-month-field:focus,
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-datetime-edit-day-field:focus,
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-datetime-edit-year-field:focus,
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-datetime-edit-hour-field:focus,
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-datetime-edit-minute-field:focus,
      input[data-themed-datetime="true"][type="date"]::-webkit-datetime-edit-month-field:focus,
      input[data-themed-datetime="true"][type="date"]::-webkit-datetime-edit-day-field:focus,
      input[data-themed-datetime="true"][type="date"]::-webkit-datetime-edit-year-field:focus {
        background: ${themeTokens['--primary'] || 'hsl(142 65% 47%)'};
        color: ${themeTokens['--primary-foreground'] || 'hsl(0 0% 100%)'};
        outline: none;
      }
      
      /* Firefox datetime picker styling */
      input[data-themed-datetime="true"][type="datetime-local"],
      input[data-themed-datetime="true"][type="date"] {
        color-scheme: ${themeTokens['--background']?.includes('0 0% 0%') || themeTokens['--background']?.includes('0 0% 5%') ? 'dark' : 'light'};
      }
      
      /* Additional picker icon enhancements */
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-calendar-picker-indicator:focus,
      input[data-themed-datetime="true"][type="date"]::-webkit-calendar-picker-indicator:focus {
        outline: 2px solid ${themeTokens['--ring'] || 'hsl(142 65% 47%)'};
        outline-offset: 2px;
      }
      
      /* Custom icon styling for better visibility */
      input[data-themed-datetime="true"][type="date"]::-webkit-calendar-picker-indicator::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 16px;
        height: 16px;
        background: currentColor;
        mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'/%3E%3Cline x1='16' y1='2' x2='16' y2='6'/%3E%3Cline x1='8' y1='2' x2='8' y2='6'/%3E%3Cline x1='3' y1='10' x2='21' y2='10'/%3E%3C/svg%3E") no-repeat center;
        mask-size: contain;
      }
      
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-calendar-picker-indicator::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 16px;
        height: 16px;
        background: currentColor;
        mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpolyline points='12,6 12,12 16,14'/%3E%3C/svg%3E") no-repeat center;
        mask-size: contain;
      }
      
      /* Ensure the native icon is hidden when using custom styling */
      input[data-themed-datetime="true"][type="datetime-local"]::-webkit-calendar-picker-indicator,
      input[data-themed-datetime="true"][type="date"]::-webkit-calendar-picker-indicator {
        -webkit-appearance: none;
        appearance: none;
        background-image: none;
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [themeTokens]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: initialDate ? initialDate.toISOString().slice(0, 16) : '',
    endTime: initialDate ? new Date(initialDate.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16) : '',
    allDay: false,
    type: 'job' as EventType,
    status: 'open' as EventStatus,
    location: '',
    client: '',
    assignees: [] as Array<{ id: string; name: string; initials: string }>,
    amount: 0,
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    projectId: '',
    isRecurring: false,
    tags: [] as string[]
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAssigneeToggle = (assignee: { id: string; name: string; initials: string }) => {
    setFormData(prev => ({
      ...prev,
      assignees: prev.assignees.some(a => a.id === assignee.id)
        ? prev.assignees.filter(a => a.id !== assignee.id)
        : [...prev.assignees, assignee]
    }));
  };

  const handleTagAdd = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime && new Date(formData.startTime) >= new Date(formData.endTime)) {
      newErrors.endTime = 'End time must be after start time';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.client.trim()) {
      newErrors.client = 'Client is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const eventData: Omit<CalendarEvent, 'id'> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
      allDay: formData.allDay,
      type: formData.type,
      status: formData.status,
      location: formData.location.trim(),
      client: formData.client.trim(),
      assignees: formData.assignees,
      amount: formData.amount,
      priority: formData.priority,
      projectId: formData.projectId.trim() || undefined,
      isRecurring: formData.isRecurring,
      tags: formData.tags
    };

    onSave(eventData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      startTime: initialDate ? initialDate.toISOString().slice(0, 16) : '',
      endTime: initialDate ? new Date(initialDate.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16) : '',
      allDay: false,
      type: 'job',
      status: 'open',
      location: '',
      client: '',
      assignees: [],
      amount: 0,
      priority: 'Medium',
      projectId: '',
      isRecurring: false,
      tags: []
    });
    setErrors({});
    setNewTag('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="fixed right-0 top-0 h-svh w-[50vw] max-w-none translate-x-0 translate-y-0 left-auto grid overflow-y-auto"
        style={{
          backgroundColor: `hsl(${themeTokens['--background'] || '0 0% 100%'})`,
          borderColor: `hsl(${themeTokens['--border'] || '0 0% 90%'})`
        }}
      >
        <DialogHeader>
          <DialogTitle 
            className="flex items-center gap-2"
            style={{ color: `hsl(${themeTokens['--foreground'] || '0 0% 3.9%'})` }}
          >
            <Calendar 
              className="h-5 w-5" 
              style={{ color: `hsl(${themeTokens['--primary'] || '142 65% 47%'})` }}
            />
            Create New Event
          </DialogTitle>
          <DialogDescription
            style={{ color: `hsl(${themeTokens['--muted-foreground'] || '0 0% 45%'})` }}
          >
            Add a new event to your calendar. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 
              className="text-lg font-medium"
              style={{ color: `hsl(${themeTokens['--foreground'] || '0 0% 3.9%'})` }}
            >
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <ThemedLabel htmlFor="title" themeTokens={themeTokens}>
                  Title *
                </ThemedLabel>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter event title"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <ThemedLabel htmlFor="type" themeTokens={themeTokens}>
                  Event Type
                </ThemedLabel>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue>
                      {formData.type && (
                        <span className="flex items-center gap-2">
                          <EventTypeIcon type={formData.type} themeTokens={themeTokens} />
                          {eventTypes.find(t => t.value === formData.type)?.label}
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center gap-2">
                          <EventTypeIcon type={type.value} themeTokens={themeTokens} />
                          {type.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <ThemedLabel htmlFor="description" themeTokens={themeTokens}>
                Description
              </ThemedLabel>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter event description"
                rows={3}
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <h3 
              className="text-lg font-medium"
              style={{ color: `hsl(${themeTokens['--foreground'] || '0 0% 3.9%'})` }}
            >
              Date & Time
            </h3>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="allDay"
                checked={formData.allDay}
                onCheckedChange={(checked) => handleInputChange('allDay', checked)}
              />
              <ThemedLabel htmlFor="allDay" themeTokens={themeTokens}>
                All Day Event
              </ThemedLabel>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <ThemedLabel htmlFor="startTime" themeTokens={themeTokens}>
                  Start Time *
                </ThemedLabel>
                <ThemedDateTimeInput
                  id="startTime"
                  type={formData.allDay ? 'date' : 'datetime-local'}
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  error={errors.startTime}
                  themeTokens={themeTokens}
                />
                {errors.startTime && <p className="text-sm text-red-500">{errors.startTime}</p>}
              </div>

              <div className="space-y-2">
                <ThemedLabel htmlFor="endTime" themeTokens={themeTokens}>
                  End Time *
                </ThemedLabel>
                <ThemedDateTimeInput
                  id="endTime"
                  type={formData.allDay ? 'date' : 'datetime-local'}
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  error={errors.endTime}
                  themeTokens={themeTokens}
                />
                {errors.endTime && <p className="text-sm text-red-500">{errors.endTime}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isRecurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => handleInputChange('isRecurring', checked)}
              />
              <ThemedLabel htmlFor="isRecurring" themeTokens={themeTokens}>
                Recurring Event
              </ThemedLabel>
            </div>
          </div>

          {/* Location & Client */}
          <div className="space-y-4">
            <h3 
              className="text-lg font-medium"
              style={{ color: `hsl(${themeTokens['--foreground'] || '0 0% 3.9%'})` }}
            >
              Location & Client
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <ThemedLabel htmlFor="location" themeTokens={themeTokens}>
                  Location *
                </ThemedLabel>
                <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                  <SelectTrigger className={errors.location ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {saudiCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        <span className="flex items-center gap-2">
                          <MapPin 
                            className="h-4 w-4" 
                            style={{ color: `hsl(${themeTokens['--muted-foreground'] || '0 0% 45%'})` }}
                          />
                          {city}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
              </div>

              <div className="space-y-2">
                <ThemedLabel htmlFor="client" themeTokens={themeTokens}>
                  Client *
                </ThemedLabel>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) => handleInputChange('client', e.target.value)}
                  placeholder="Enter client name"
                  className={errors.client ? 'border-red-500' : ''}
                />
                {errors.client && <p className="text-sm text-red-500">{errors.client}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <ThemedLabel htmlFor="projectId" themeTokens={themeTokens}>
                Project ID
              </ThemedLabel>
              <Input
                id="projectId"
                value={formData.projectId}
                onChange={(e) => handleInputChange('projectId', e.target.value)}
                placeholder="Enter project ID (optional)"
              />
            </div>
          </div>

          {/* Assignees */}
          <div className="space-y-4">
            <h3 
              className="text-lg font-medium"
              style={{ color: `hsl(${themeTokens['--foreground'] || '0 0% 3.9%'})` }}
            >
              Assignees
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {mockAssignees.map((assignee) => {
                const isSelected = formData.assignees.some(a => a.id === assignee.id);
                return (
                  <div
                    key={assignee.id}
                    className="p-2 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md"
                    style={{
                      backgroundColor: isSelected 
                        ? `hsl(${themeTokens['--primary'] || '142 65% 47%'})`
                        : `hsl(${themeTokens['--background'] || '0 0% 100%'})`,
                      color: isSelected 
                        ? `hsl(${themeTokens['--primary-foreground'] || '0 0% 100%'})`
                        : `hsl(${themeTokens['--foreground'] || '0 0% 3.9%'})`,
                      borderColor: isSelected 
                        ? `hsl(${themeTokens['--primary'] || '142 65% 47%'})`
                        : `hsl(${themeTokens['--border'] || '0 0% 90%'})`,
                      boxShadow: isSelected 
                        ? `0 0 0 2px hsl(${themeTokens['--primary'] || '142 65% 47%'} / 0.2)`
                        : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = `hsl(${themeTokens['--muted'] || '0 0% 96%'})`;
                        e.currentTarget.style.borderColor = `hsl(${themeTokens['--primary'] || '142 65% 47%'} / 0.3)`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = `hsl(${themeTokens['--background'] || '0 0% 100%'})`;
                        e.currentTarget.style.borderColor = `hsl(${themeTokens['--border'] || '0 0% 90%'})`;
                      }
                    }}
                    onClick={() => handleAssigneeToggle(assignee)}
                  >
                    <div className="text-center">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mx-auto mb-1"
                        style={{
                          backgroundColor: isSelected 
                            ? `hsl(${themeTokens['--primary-foreground'] || '0 0% 100%'} / 0.2)`
                            : `hsl(${themeTokens['--muted'] || '0 0% 96%'})`,
                          color: isSelected 
                            ? `hsl(${themeTokens['--primary-foreground'] || '0 0% 100%'})`
                            : `hsl(${themeTokens['--muted-foreground'] || '0 0% 45%'})`
                        }}
                      >
                        {assignee.initials}
                      </div>
                      <div className="text-xs truncate">{assignee.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Financial & Priority */}
          <div className="space-y-4">
            <h3 
              className="text-lg font-medium"
              style={{ color: `hsl(${themeTokens['--foreground'] || '0 0% 3.9%'})` }}
            >
              Financial & Priority
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <ThemedLabel htmlFor="amount" themeTokens={themeTokens}>
                  Amount (SAR)
                </ThemedLabel>
                <div className="relative">
                  <DollarSign 
                    className="absolute left-3 top-3 h-4 w-4" 
                    style={{ color: `hsl(${themeTokens['--muted-foreground'] || '0 0% 45%'})` }}
                  />
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <ThemedLabel htmlFor="priority" themeTokens={themeTokens}>
                  Priority
                </ThemedLabel>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['High', 'Medium', 'Low'].map((priority) => {
                      const priorityStyle = getPriorityStyle(priority, themeTokens);
                      return (
                        <SelectItem key={priority} value={priority}>
                          <span className="flex items-center gap-2">
                            <Badge 
                              style={priorityStyle}
                              className="border"
                            >
                              {priority}
                            </Badge>
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <ThemedLabel htmlFor="status" themeTokens={themeTokens}>
                Status
              </ThemedLabel>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 
              className="text-lg font-medium"
              style={{ color: `hsl(${themeTokens['--foreground'] || '0 0% 3.9%'})` }}
            >
              Tags
            </h3>
            
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && handleTagAdd()}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleTagAdd}
                style={{
                  borderColor: `hsl(${themeTokens['--border'] || '0 0% 90%'})`,
                  color: `hsl(${themeTokens['--foreground'] || '0 0% 3.9%'})`
                }}
              >
                <Tag 
                  className="h-4 w-4" 
                  style={{ color: `hsl(${themeTokens['--muted-foreground'] || '0 0% 45%'})` }}
                />
              </Button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor: `hsl(${themeTokens['--muted'] || '0 0% 96%'})`,
                      color: `hsl(${themeTokens['--muted-foreground'] || '0 0% 45%'})`,
                      borderColor: `hsl(${themeTokens['--border'] || '0 0% 90%'})`
                    }}
                    onClick={() => handleTagRemove(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            style={{
              borderColor: `hsl(${themeTokens['--border'] || '0 0% 90%'})`,
              color: `hsl(${themeTokens['--foreground'] || '0 0% 3.9%'})`,
              backgroundColor: `hsl(${themeTokens['--background'] || '0 0% 100%'})`
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-gradient-primary"
            style={{
              backgroundColor: `hsl(${themeTokens['--primary'] || '142 65% 47%'})`,
              color: `hsl(${themeTokens['--primary-foreground'] || '0 0% 100%'})`
            }}
          >
            Create Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
