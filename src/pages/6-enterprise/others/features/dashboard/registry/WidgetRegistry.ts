import { WidgetLibraryItem, WidgetType } from '../types/widget';
import { 
  BarChart3, 
  TrendingUp, 
  Table, 
  Bot, 
  Briefcase, 
  DollarSign, 
  CheckCircle, 
  Plus, 
  Calendar, 
  MessageSquare, 
  Target,
  FileText
} from 'lucide-react';

export const WIDGET_REGISTRY: WidgetLibraryItem[] = [
  {
    type: WidgetType.STATS_CARD,
    name: 'Stats Card',
    description: 'Display key metrics and statistics',
    icon: 'BarChart3',
    category: 'Analytics',
    defaultConfig: {
      title: 'New Stats Card',
      showTitle: true,
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      padding: 16,
      borderRadius: 8,
      dataSource: 'manual',
      value: '0',
      label: 'Metric',
      trend: '+0%',
      trendDirection: 'up'
    },
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 1 },
    maxSize: { w: 6, h: 4 }
  },
  {
    type: WidgetType.CHART,
    name: 'Chart',
    description: 'Visualize data with various chart types',
    icon: 'TrendingUp',
    category: 'Analytics',
    defaultConfig: {
      title: 'New Chart',
      showTitle: true,
      chartType: 'line',
      dataSource: 'manual',
      xAxisLabel: 'X Axis',
      yAxisLabel: 'Y Axis',
      showLegend: true,
      showGrid: true,
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      padding: 16,
      borderRadius: 8
    },
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
    maxSize: { w: 12, h: 8 }
  },
  {
    type: WidgetType.TABLE,
    name: 'Data Table',
    description: 'Display tabular data with sorting and filtering',
    icon: 'Table',
    category: 'Data',
    defaultConfig: {
      title: 'New Table',
      showTitle: true,
      dataSource: 'manual',
      columns: [
        { key: 'name', label: 'Name', type: 'string' },
        { key: 'value', label: 'Value', type: 'number' },
        { key: 'status', label: 'Status', type: 'string' }
      ],
      showPagination: true,
      pageSize: 10,
      showSearch: true,
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      padding: 16,
      borderRadius: 8
    },
    defaultSize: { w: 8, h: 6 },
    minSize: { w: 4, h: 4 },
    maxSize: { w: 12, h: 10 }
  },
  {
    type: WidgetType.AI_ASSISTANT,
    name: 'AI Assistant',
    description: 'Interactive AI chat interface',
    icon: 'Bot',
    category: 'Tools',
    defaultConfig: {
      title: 'AI Assistant',
      showTitle: true,
      isCompact: false,
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      padding: 16,
      borderRadius: 8,
      maxHeight: 400
    },
    defaultSize: { w: 4, h: 6 },
    minSize: { w: 3, h: 4 },
    maxSize: { w: 8, h: 10 }
  },
  {
    type: WidgetType.JOB_LIST,
    name: 'Job List',
    description: 'Display available jobs and applications',
    icon: 'Briefcase',
    category: 'Jobs',
    defaultConfig: {
      title: 'Available Jobs',
      showTitle: true,
      dataSource: 'jobs',
      showFilters: true,
      showSearch: true,
      maxItems: 5,
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      padding: 16,
      borderRadius: 8
    },
    defaultSize: { w: 6, h: 5 },
    minSize: { w: 4, h: 4 },
    maxSize: { w: 10, h: 8 }
  },
  {
    type: WidgetType.FINANCIAL_OVERVIEW,
    name: 'Financial Overview',
    description: 'Display financial metrics and earnings',
    icon: 'DollarSign',
    category: 'Finance',
    defaultConfig: {
      title: 'Financial Overview',
      showTitle: true,
      dataSource: 'financial',
      showCharts: true,
      showBreakdown: true,
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      padding: 16,
      borderRadius: 8
    },
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
    maxSize: { w: 10, h: 6 }
  },
  {
    type: WidgetType.TASK_LIST,
    name: 'Task List',
    description: 'Manage tasks and milestones',
    icon: 'CheckCircle',
    category: 'Productivity',
    defaultConfig: {
      title: 'My Tasks',
      showTitle: true,
      dataSource: 'tasks',
      showFilters: true,
      showPriority: true,
      showDueDate: true,
      maxItems: 10,
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      padding: 16,
      borderRadius: 8
    },
    defaultSize: { w: 4, h: 6 },
    minSize: { w: 3, h: 4 },
    maxSize: { w: 8, h: 10 }
  },
  {
    type: WidgetType.QUICK_ACTIONS,
    name: 'Quick Actions',
    description: 'Shortcut buttons for common actions',
    icon: 'Plus',
    category: 'Tools',
    defaultConfig: {
      title: 'Quick Actions',
      showTitle: true,
      actions: [
        { label: 'Browse Jobs', icon: 'Briefcase', link: '/jobs' },
        { label: 'Check In', icon: 'MapPin', link: '/checkin' },
        { label: 'Upload', icon: 'Upload', link: '/upload' },
        { label: 'Messages', icon: 'MessageSquare', link: '/messages' }
      ],
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      padding: 16,
      borderRadius: 8
    },
    defaultSize: { w: 6, h: 3 },
    minSize: { w: 4, h: 2 },
    maxSize: { w: 10, h: 5 }
  },
  {
    type: WidgetType.CALENDAR,
    name: 'Calendar',
    description: 'Display calendar events and schedule',
    icon: 'Calendar',
    category: 'Productivity',
    defaultConfig: {
      title: 'Calendar',
      showTitle: true,
      dataSource: 'calendar',
      view: 'month',
      showWeekends: true,
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      padding: 16,
      borderRadius: 8
    },
    defaultSize: { w: 8, h: 6 },
    minSize: { w: 6, h: 4 },
    maxSize: { w: 12, h: 8 }
  },
  {
    type: WidgetType.MESSAGES,
    name: 'Messages',
    description: 'Display recent messages and conversations',
    icon: 'MessageSquare',
    category: 'Communication',
    defaultConfig: {
      title: 'Messages',
      showTitle: true,
      dataSource: 'messages',
      maxItems: 5,
      showUnreadCount: true,
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      padding: 16,
      borderRadius: 8
    },
    defaultSize: { w: 4, h: 5 },
    minSize: { w: 3, h: 4 },
    maxSize: { w: 8, h: 8 }
  },
  {
    type: WidgetType.PROJECT_PROGRESS,
    name: 'Project Progress',
    description: 'Track project milestones and progress',
    icon: 'Target',
    category: 'Projects',
    defaultConfig: {
      title: 'Project Progress',
      showTitle: true,
      dataSource: 'projects',
      showProgress: true,
      showMilestones: true,
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      padding: 16,
      borderRadius: 8
    },
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
    maxSize: { w: 10, h: 6 }
  },
  {
    type: WidgetType.CUSTOM_HTML,
    name: 'Custom HTML',
    description: 'Add custom HTML content',
    icon: 'FileText',
    category: 'Custom',
    defaultConfig: {
      title: 'Custom Content',
      showTitle: true,
      htmlContent: '<div>Enter your custom HTML here</div>',
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      padding: 16,
      borderRadius: 8
    },
    defaultSize: { w: 4, h: 3 },
    minSize: { w: 2, h: 2 },
    maxSize: { w: 12, h: 10 }
  }
];

export const WIDGET_CATEGORIES = [
  'All',
  'Analytics',
  'Data',
  'Tools',
  'Jobs',
  'Finance',
  'Productivity',
  'Communication',
  'Projects',
  'Custom'
];

export const getWidgetByType = (type: WidgetType): WidgetLibraryItem | undefined => {
  return WIDGET_REGISTRY.find(widget => widget.type === type);
};

export const getWidgetsByCategory = (category: string): WidgetLibraryItem[] => {
  if (category === 'All') {
    return WIDGET_REGISTRY;
  }
  return WIDGET_REGISTRY.filter(widget => widget.category === category);
};

export const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    BarChart3,
    TrendingUp,
    Table,
    Bot,
    Briefcase,
    DollarSign,
    CheckCircle,
    Plus,
    Calendar,
    MessageSquare,
    Target,
    FileText
  };
  return iconMap[iconName] || BarChart3;
};
