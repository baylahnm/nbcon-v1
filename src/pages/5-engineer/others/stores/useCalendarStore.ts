import { create } from 'zustand';

export type CalendarView = 'month' | 'week' | 'day' | 'agenda';
export type UserRole = 'client' | 'engineer' | 'enterprise' | 'admin';
export type EventType = 'job' | 'milestone' | 'visit' | 'invoice' | 'call' | 'payout';
export type EventStatus = 'draft' | 'open' | 'quoted' | 'in-progress' | 'completed' | 'cancelled' | 'scheduled';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  allDay: boolean;
  type: EventType;
  status: EventStatus;
  location: string;
  client: string;
  assignees: Array<{
    id: string;
    name: string;
    initials: string;
  }>;
  amount: number; // in SAR
  priority: 'High' | 'Medium' | 'Low';
  projectId?: string;
  isRecurring: boolean;
  tags: string[];
}

export interface CalendarFilters {
  eventTypes: EventType[];
  statuses: EventStatus[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  roleContext: 'mine' | 'team' | 'company';
  cities: string[];
  searchTerm: string;
  projectIds: string[];
}

const mockEvents: CalendarEvent[] = [
  // Sunday 14th - All Day Events
  {
    id: '1',
    title: 'National Stadium Renovation',
    description: 'Complete structural assessment and renovation planning for King Fahd Stadium',
    startTime: new Date(2025, 8, 14, 0, 0),
    endTime: new Date(2025, 8, 14, 23, 59),
    allDay: true,
    type: 'job',
    status: 'in-progress',
    location: 'Riyadh',
    client: 'Ministry of Sports',
    assignees: [
      { id: '1', name: 'Ahmed Al-Fahad', initials: 'AF' },
      { id: '2', name: 'Fatima Al-Zahra', initials: 'FZ' }
    ],
    amount: 275000,
    priority: 'High',
    projectId: 'PROJ-001',
    isRecurring: false,
    tags: ['structural', 'renovation', 'stadium']
  },

  // Monday 15th
  {
    id: '2',
    title: 'NEOM Smart City Infrastructure',
    description: 'Initial planning and design phase for smart city infrastructure',
    startTime: new Date(2025, 8, 15, 0, 0),
    endTime: new Date(2025, 8, 15, 23, 59),
    allDay: true,
    type: 'job',
    status: 'open',
    location: 'NEOM',
    client: 'NEOM Company',
    assignees: [
      { id: '3', name: 'Omar Al-Farouq', initials: 'OF' },
      { id: '4', name: 'Sara Al-Mansouri', initials: 'SM' }
    ],
    amount: 450000,
    priority: 'High',
    projectId: 'PROJ-002',
    isRecurring: false,
    tags: ['smart-city', 'infrastructure', 'neom']
  },
  {
    id: '3',
    title: 'Emergency Call - Dam Inspection',
    description: 'Urgent dam safety inspection due to recent weather conditions',
    startTime: new Date(2025, 8, 15, 8, 0),
    endTime: new Date(2025, 8, 15, 9, 30),
    allDay: false,
    type: 'call',
    status: 'open',
    location: 'Dammam',
    client: 'Ministry of Water',
    assignees: [
      { id: '5', name: 'Khalid Al-Cheikh', initials: 'KC' }
    ],
    amount: 5000,
    priority: 'High',
    projectId: 'PROJ-003',
    isRecurring: false,
    tags: ['emergency', 'dam', 'inspection']
  },

  // Tuesday 16th
  {
    id: '4',
    title: 'Site Inspection - Residential Complex',
    description: 'Quality control inspection for new residential development',
    startTime: new Date(2025, 8, 16, 7, 0),
    endTime: new Date(2025, 8, 16, 11, 0),
    allDay: false,
    type: 'visit',
    status: 'in-progress',
    location: 'Jeddah',
    client: 'Al-Rajhi Construction',
    assignees: [
      { id: '6', name: 'Noura Al-Ghamdi', initials: 'NG' },
      { id: '7', name: 'Mohammed Al-Rashid', initials: 'MR' }
    ],
    amount: 15000,
    priority: 'Medium',
    projectId: 'PROJ-004',
    isRecurring: false,
    tags: ['inspection', 'residential', 'quality']
  },
  {
    id: '5',
    title: 'Morning Briefing - Aramco',
    description: 'Weekly project status briefing with Aramco stakeholders',
    startTime: new Date(2025, 8, 16, 8, 30),
    endTime: new Date(2025, 8, 16, 9, 30),
    allDay: false,
    type: 'call',
    status: 'completed',
    location: 'Dhahran',
    client: 'Saudi Aramco',
    assignees: [
      { id: '8', name: 'Aisha Al-Qahtani', initials: 'AQ' }
    ],
    amount: 0,
    priority: 'Medium',
    projectId: 'PROJ-005',
    isRecurring: true,
    tags: ['briefing', 'aramco', 'weekly']
  },
  {
    id: '6',
    title: 'Team Standup - NEOM Project',
    description: 'Daily standup meeting for NEOM infrastructure team',
    startTime: new Date(2025, 8, 16, 9, 0),
    endTime: new Date(2025, 8, 16, 10, 0),
    allDay: false,
    type: 'call',
    status: 'completed',
    location: 'Virtual',
    client: 'NEOM Company',
    assignees: [
      { id: '9', name: 'Yousef Al-Nasser', initials: 'YN' },
      { id: '10', name: 'Rania Al-Faisal', initials: 'RF' }
    ],
    amount: 0,
    priority: 'Low',
    projectId: 'PROJ-002',
    isRecurring: true,
    tags: ['standup', 'neom', 'daily']
  },
  {
    id: '7',
    title: 'Structural Review - Metro Project',
    description: 'Engineering review for Riyadh metro tunnel construction',
    startTime: new Date(2025, 8, 16, 10, 0),
    endTime: new Date(2025, 8, 16, 13, 0),
    allDay: false,
    type: 'job',
    status: 'in-progress',
    location: 'Riyadh',
    client: 'Riyadh Metro Company',
    assignees: [
      { id: '11', name: 'Hassan Al-Mutairi', initials: 'HM' },
      { id: '12', name: 'Lamia Al-Saud', initials: 'LS' }
    ],
    amount: 32000,
    priority: 'High',
    projectId: 'PROJ-006',
    isRecurring: false,
    tags: ['metro', 'structural', 'review']
  },
  {
    id: '8',
    title: 'Electrical Design Workshop',
    description: 'Workshop on electrical systems design for SABIC facility',
    startTime: new Date(2025, 8, 16, 11, 0),
    endTime: new Date(2025, 8, 16, 14, 0),
    allDay: false,
    type: 'job',
    status: 'in-progress',
    location: 'Riyadh',
    client: 'SABIC',
    assignees: [
      { id: '13', name: 'Saeed Al-Eid', initials: 'SE' },
      { id: '14', name: 'Nada Al-Khateeb', initials: 'NK' }
    ],
    amount: 22000,
    priority: 'Medium',
    projectId: 'PROJ-007',
    isRecurring: false,
    tags: ['electrical', 'analysis', 'sabic']
  },
  {
    id: '9',
    title: 'HVAC Design Review',
    description: 'Mechanical engineering review for shopping mall HVAC system',
    startTime: new Date(2025, 8, 16, 14, 0),
    endTime: new Date(2025, 8, 16, 18, 0),
    allDay: false,
    type: 'job',
    status: 'in-progress',
    location: 'Jeddah',
    client: 'Majid Al Futtaim',
    assignees: [
      { id: '15', name: 'Rami Al-Mahmoud', initials: 'RM' },
      { id: '16', name: 'Jawad Al-Rashid', initials: 'JR' }
    ],
    amount: 35000,
    priority: 'Medium',
    projectId: 'PROJ-008',
    isRecurring: false,
    tags: ['hvac', 'design', 'mechanical']
  },
  {
    id: '10',
    title: 'Client Presentation - Metro Extension',
    description: 'Final presentation for Riyadh Metro extension project',
    startTime: new Date(2025, 8, 16, 15, 0),
    endTime: new Date(2025, 8, 16, 16, 30),
    allDay: false,
    type: 'call',
    status: 'completed',
    location: 'Riyadh',
    client: 'Riyadh Metro Company',
    assignees: [
      { id: '17', name: 'Mona Al-Sheikh', initials: 'MS' },
      { id: '18', name: 'Abdulaziz Al-Zahrani', initials: 'AZ' }
    ],
    amount: 185000,
    priority: 'High',
    projectId: 'PROJ-009',
    isRecurring: false,
    tags: ['presentation', 'metro', 'client']
  },

  // Wednesday 17th
  {
    id: '11',
    title: 'Quality Control - Petrochemical Plant',
    description: 'Safety and quality inspection at SABIC petrochemical facility',
    startTime: new Date(2025, 8, 17, 6, 0),
    endTime: new Date(2025, 8, 17, 14, 0),
    allDay: false,
    type: 'visit',
    status: 'in-progress',
    location: 'Jubail',
    client: 'SABIC',
    assignees: [
      { id: '19', name: 'Bushra Al-Turki', initials: 'BT' },
      { id: '20', name: 'Sami Al-Harbi', initials: 'SH' }
    ],
    amount: 45000,
    priority: 'High',
    projectId: 'PROJ-010',
    isRecurring: false,
    tags: ['quality', 'petrochemical', 'safety']
  },

  // Thursday 18th
  {
    id: '12',
    title: 'Foundation Engineering - Red Sea Project',
    description: 'Geotechnical foundation assessment for Red Sea development',
    startTime: new Date(2025, 8, 18, 8, 0),
    endTime: new Date(2025, 8, 18, 16, 0),
    allDay: false,
    type: 'job',
    status: 'in-progress',
    location: 'Red Sea',
    client: 'Red Sea Global',
    assignees: [
      { id: '21', name: 'Dina Al-Rashid', initials: 'DR' },
      { id: '22', name: 'Ghassan Al-Shehri', initials: 'GS' }
    ],
    amount: 42000,
    priority: 'High',
    projectId: 'PROJ-011',
    isRecurring: false,
    tags: ['foundation', 'geotechnical', 'red-sea']
  },

  // Friday 19th
  {
    id: '13',
    title: 'Weekend Emergency - Oil Refinery',
    description: 'Emergency maintenance call for oil refinery equipment',
    startTime: new Date(2025, 8, 19, 10, 0),
    endTime: new Date(2025, 8, 19, 15, 0),
    allDay: false,
    type: 'call',
    status: 'open',
    location: 'Ras Tanura',
    client: 'Saudi Aramco',
    assignees: [
      { id: '23', name: 'Pamela Al-Yousef', initials: 'PY' }
    ],
    amount: 65000,
    priority: 'High',
    projectId: 'PROJ-012',
    isRecurring: false,
    tags: ['emergency', 'oil', 'refinery']
  },
  {
    id: '14',
    title: 'Invoice Reminder - Solar Farm',
    description: 'Follow-up on outstanding payment for solar energy project',
    startTime: new Date(2025, 8, 19, 12, 30),
    endTime: new Date(2025, 8, 19, 14, 0),
    allDay: false,
    type: 'invoice',
    status: 'open',
    location: 'Tabuk',
    client: 'ACWA Power',
    assignees: [
      { id: '24', name: 'Tariq Al-Mutairi', initials: 'TM' }
    ],
    amount: 18000,
    priority: 'Medium',
    projectId: 'PROJ-013',
    isRecurring: false,
    tags: ['invoice', 'solar', 'payment']
  },
  {
    id: '15',
    title: 'Red Sea Project Review',
    description: 'Monthly project review meeting for Red Sea development',
    startTime: new Date(2025, 8, 19, 13, 0),
    endTime: new Date(2025, 8, 19, 17, 0),
    allDay: false,
    type: 'call',
    status: 'in-progress',
    location: 'Virtual',
    client: 'Red Sea Global',
    assignees: [
      { id: '25', name: 'Layla Al-Sabah', initials: 'LS' },
      { id: '26', name: 'Faisal Al-Harbi', initials: 'FH' }
    ],
    amount: 38000,
    priority: 'Medium',
    projectId: 'PROJ-011',
    isRecurring: true,
    tags: ['review', 'red-sea', 'monthly']
  },
  {
    id: '16',
    title: 'Weekly Payout - Multiple Projects',
    description: 'Weekly payment processing for completed project milestones',
    startTime: new Date(2025, 8, 19, 14, 0),
    endTime: new Date(2025, 8, 19, 15, 0),
    allDay: false,
    type: 'payout',
    status: 'completed',
    location: 'System',
    client: 'Multiple Clients',
    assignees: [
      { id: '27', name: 'Noura Al-Turki', initials: 'NT' }
    ],
    amount: 125000,
    priority: 'High',
    projectId: 'PAY-001',
    isRecurring: true,
    tags: ['payout', 'weekly', 'milestone']
  },

  // Saturday 20th
  {
    id: '17',
    title: 'Site Visit - NEOM Construction',
    description: 'Weekly site visit to monitor NEOM construction progress',
    startTime: new Date(2025, 8, 20, 8, 0),
    endTime: new Date(2025, 8, 20, 12, 0),
    allDay: false,
    type: 'visit',
    status: 'scheduled',
    location: 'NEOM',
    client: 'NEOM Company',
    assignees: [
      { id: '28', name: 'Majed Al-Rashid', initials: 'MR' },
      { id: '29', name: 'Hala Al-Sheikh', initials: 'HS' }
    ],
    amount: 25000,
    priority: 'Medium',
    projectId: 'PROJ-002',
    isRecurring: true,
    tags: ['site-visit', 'neom', 'weekly']
  },
  {
    id: '18',
    title: 'Project Planning - Vision 2030',
    description: 'Strategic planning session for Vision 2030 infrastructure projects',
    startTime: new Date(2025, 8, 20, 14, 0),
    endTime: new Date(2025, 8, 20, 18, 0),
    allDay: false,
    type: 'call',
    status: 'scheduled',
    location: 'Riyadh',
    client: 'Vision 2030 Office',
    assignees: [
      { id: '30', name: 'Waleed Al-Zahrani', initials: 'WZ' },
      { id: '31', name: 'Reem Al-Ghamdi', initials: 'RG' }
    ],
    amount: 0,
    priority: 'High',
    projectId: 'PROJ-014',
    isRecurring: false,
    tags: ['planning', 'vision-2030', 'strategic']
  }
];

const createInitialFilters = (): CalendarFilters => ({
  eventTypes: [],
  statuses: [],
  dateRange: { start: null, end: null },
  roleContext: 'mine',
  cities: [],
  searchTerm: '',
  projectIds: [],
});

const computeFilteredEvents = (events: CalendarEvent[], filters: CalendarFilters) => {
  const searchTerm = filters.searchTerm.trim().toLowerCase();

  return events.filter(event => {
    if (searchTerm) {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.client.toLowerCase().includes(searchTerm) ||
        event.location.toLowerCase().includes(searchTerm) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm));

      if (!matchesSearch) {
        return false;
      }
    }

    if (filters.eventTypes.length > 0 && !filters.eventTypes.includes(event.type)) {
      return false;
    }

    if (filters.statuses.length > 0 && !filters.statuses.includes(event.status)) {
      return false;
    }

    if (filters.projectIds.length > 0) {
      if (!event.projectId || !filters.projectIds.includes(event.projectId)) {
        return false;
      }
    }

    if (filters.dateRange.start && event.startTime < filters.dateRange.start) {
      return false;
    }

    if (filters.dateRange.end && event.startTime > filters.dateRange.end) {
      return false;
    }

    if (filters.cities.length > 0 && !filters.cities.includes(event.location)) {
      return false;
    }

    return true;
  });
};

export interface CalendarStore {
  currentDate: Date;
  view: CalendarView;
  userRole: UserRole;
  isHijri: boolean;
  filters: CalendarFilters;
  showFilters: boolean;
  selectedEvent: CalendarEvent | null;
  events: CalendarEvent[];
  allEvents: CalendarEvent[];
  setCurrentDate: (date: Date) => void;
  setView: (view: CalendarView) => void;
  setUserRole: (role: UserRole) => void;
  setIsHijri: (value: boolean) => void;
  updateFilters: (filters: Partial<CalendarFilters>) => void;
  clearFilters: () => void;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  setShowFilters: (show: boolean) => void;
  addEvent: (eventData: Omit<CalendarEvent, 'id'>) => CalendarEvent;
  updateEvent: (eventId: string, eventData: Partial<CalendarEvent>) => void;
  deleteEvent: (eventId: string) => void;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getEventsForWeek: (startDate: Date) => CalendarEvent[];
  getEventsForMonth: (date: Date) => CalendarEvent[];
  getEventsForProject: (projectId: string) => CalendarEvent[];
  getEventTypeColor: (type: EventType) => string;
  getStatusColor: (status: EventStatus) => string;
  formatCurrency: (amount: number) => string;
}

export const useCalendarStore = create<CalendarStore>((set, get) => {
  const initialFilters = createInitialFilters();
  const initialAllEvents = [...mockEvents];

  return {
    currentDate: new Date(),
    view: 'month',
    userRole: 'engineer',
    isHijri: false,
    filters: initialFilters,
    showFilters: false,
    selectedEvent: null,
    events: computeFilteredEvents(initialAllEvents, initialFilters),
    allEvents: initialAllEvents,
    setCurrentDate: (date) => set({ currentDate: date }),
    setView: (view) => set({ view }),
    setUserRole: (role) => set({ userRole: role }),
    setIsHijri: (value) => set({ isHijri: value }),
    updateFilters: (newFilters) => set(state => {
      const filters = { ...state.filters, ...newFilters };
      return {
        filters,
        events: computeFilteredEvents(state.allEvents, filters),
      };
    }),
    clearFilters: () => set(state => {
      const filters = createInitialFilters();
      return {
        filters,
        events: computeFilteredEvents(state.allEvents, filters),
      };
    }),
    setSelectedEvent: (event) => set({ selectedEvent: event }),
    setShowFilters: (show) => set({ showFilters: show }),
    addEvent: (eventData) => {
      const newEvent: CalendarEvent = {
        ...eventData,
        id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      };
      set(state => {
        const allEvents = [...state.allEvents, newEvent].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
        return {
          allEvents,
          events: computeFilteredEvents(allEvents, state.filters),
        };
      });
      return newEvent;
    },
    updateEvent: (eventId, eventData) => set(state => {
      const allEvents = state.allEvents
        .map(event => (event.id === eventId ? { ...event, ...eventData } : event))
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
      const selectedEvent =
        state.selectedEvent?.id === eventId
          ? { ...state.selectedEvent, ...eventData } as CalendarEvent
          : state.selectedEvent;
      return {
        allEvents,
        events: computeFilteredEvents(allEvents, state.filters),
        selectedEvent,
      };
    }),
    deleteEvent: (eventId) => set(state => {
      const allEvents = state.allEvents.filter(event => event.id !== eventId);
      const selectedEvent = state.selectedEvent?.id === eventId ? null : state.selectedEvent;
      return {
        allEvents,
        events: computeFilteredEvents(allEvents, state.filters),
        selectedEvent,
      };
    }),
    getEventsForDate: (date) => {
      const dayString = date.toDateString();
      return get().events.filter(event => event.startTime.toDateString() === dayString);
    },
    getEventsForWeek: (startDate) => {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      return get().events.filter(event => event.startTime >= start && event.startTime <= endDate);
    },
    getEventsForMonth: (date) => {
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      return get().events.filter(event => event.startTime >= startOfMonth && event.startTime <= endOfMonth);
    },
    getEventsForProject: (projectId) => {
      return get()
        .allEvents
        .filter(event => event.projectId === projectId)
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    },
    getEventTypeColor: (type) => {
      const colors: Record<EventType, string> = {
        job: 'bg-primary/10 text-primary border-primary/20',
        milestone: 'bg-success/10 text-success border-success/20',
        visit: 'bg-warning/10 text-warning border-warning/20',
        invoice: 'bg-destructive/10 text-destructive border-destructive/20',
        call: 'bg-info/10 text-info border-info/20',
        payout: 'bg-accent/10 text-accent border-accent/20',
      };
      return colors[type] || 'bg-muted text-muted-foreground border-border';
    },
    getStatusColor: (status) => {
      const colors: Record<EventStatus, string> = {
        draft: 'bg-muted text-muted-foreground',
        open: 'bg-info/10 text-info',
        quoted: 'bg-warning/10 text-warning',
        'in-progress': 'bg-primary/10 text-primary',
        completed: 'bg-success/10 text-success',
        cancelled: 'bg-destructive/10 text-destructive',
        scheduled: 'bg-info/10 text-info',
      };
      return colors[status] || 'bg-muted text-muted-foreground';
    },
    formatCurrency: (amount) => new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(amount),
  };
});
