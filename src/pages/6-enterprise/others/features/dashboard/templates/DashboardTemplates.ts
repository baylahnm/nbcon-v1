import { DashboardLayout, WidgetType } from '../types/widget';

export const DASHBOARD_TEMPLATES: DashboardLayout[] = [
  {
    id: 'engineer-default',
    userId: '',
    name: 'Engineer Default',
    isDefault: true,
    description: 'Default dashboard for engineers with essential widgets',
    widgets: [
      {
        id: 'welcome-header',
        type: WidgetType.STATS_CARD,
        title: 'Welcome Back',
        position: { x: 0, y: 0, w: 4, h: 2 },
        config: {
          title: 'Welcome Back',
          value: '5',
          label: 'Active Projects',
          trend: '+12%',
          trendDirection: 'up',
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'ai-assistant',
        type: WidgetType.AI_ASSISTANT,
        title: 'AI Assistant',
        position: { x: 4, y: 0, w: 4, h: 4 },
        config: {
          title: 'AI Assistant',
          isCompact: false,
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'quick-actions',
        type: WidgetType.QUICK_ACTIONS,
        title: 'Quick Actions',
        position: { x: 8, y: 0, w: 4, h: 2 },
        config: {
          title: 'Quick Actions',
          actions: [
            { label: 'Browse Jobs', icon: 'Briefcase', link: '/engineer/jobs', color: 'text-blue-600' },
            { label: 'Check In', icon: 'MapPin', link: '/engineer/checkin', color: 'text-green-600' },
            { label: 'Upload', icon: 'Upload', link: '/engineer/upload', color: 'text-purple-600' },
            { label: 'Messages', icon: 'MessageSquare', link: '/engineer/messages', color: 'text-orange-600' }
          ],
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'job-list',
        type: WidgetType.JOB_LIST,
        title: 'Available Jobs',
        position: { x: 0, y: 2, w: 6, h: 4 },
        config: {
          title: 'Available Jobs',
          maxItems: 5,
          showFilters: true,
          showSearch: true,
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'financial-overview',
        type: WidgetType.FINANCIAL_OVERVIEW,
        title: 'Financial Overview',
        position: { x: 6, y: 2, w: 6, h: 4 },
        config: {
          title: 'Financial Overview',
          showCharts: true,
          showBreakdown: true,
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'task-list',
        type: WidgetType.TASK_LIST,
        title: 'My Tasks',
        position: { x: 0, y: 6, w: 6, h: 4 },
        config: {
          title: 'My Tasks',
          maxItems: 8,
          showFilters: true,
          showPriority: true,
          showDueDate: true,
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'performance-chart',
        type: WidgetType.CHART,
        title: 'Performance',
        position: { x: 6, y: 6, w: 6, h: 4 },
        config: {
          title: 'Performance',
          chartType: 'line',
          xAxisLabel: 'Month',
          yAxisLabel: 'Revenue (SAR)',
          showLegend: true,
          showGrid: true,
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    gridConfig: {
      cols: 12,
      rowHeight: 60,
      margin: [10, 10],
      containerPadding: [10, 10],
      isDraggable: true,
      isResizable: true,
      isBounded: true
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'minimal',
    userId: '',
    name: 'Minimal',
    isDefault: false,
    description: 'Clean minimal dashboard with essential widgets only',
    widgets: [
      {
        id: 'ai-assistant-minimal',
        type: WidgetType.AI_ASSISTANT,
        title: 'AI Assistant',
        position: { x: 0, y: 0, w: 6, h: 4 },
        config: {
          title: 'AI Assistant',
          isCompact: false,
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'quick-actions-minimal',
        type: WidgetType.QUICK_ACTIONS,
        title: 'Quick Actions',
        position: { x: 6, y: 0, w: 6, h: 4 },
        config: {
          title: 'Quick Actions',
          actions: [
            { label: 'Browse Jobs', icon: 'Briefcase', link: '/engineer/jobs', color: 'text-blue-600' },
            { label: 'Check In', icon: 'MapPin', link: '/engineer/checkin', color: 'text-green-600' },
            { label: 'Upload', icon: 'Upload', link: '/engineer/upload', color: 'text-purple-600' },
            { label: 'Messages', icon: 'MessageSquare', link: '/engineer/messages', color: 'text-orange-600' }
          ],
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    gridConfig: {
      cols: 12,
      rowHeight: 60,
      margin: [10, 10],
      containerPadding: [10, 10],
      isDraggable: true,
      isResizable: true,
      isBounded: true
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'analytics-focused',
    userId: '',
    name: 'Analytics Focused',
    isDefault: false,
    description: 'Dashboard focused on analytics and performance metrics',
    widgets: [
      {
        id: 'revenue-stats',
        type: WidgetType.STATS_CARD,
        title: 'Monthly Revenue',
        position: { x: 0, y: 0, w: 3, h: 2 },
        config: {
          title: 'Monthly Revenue',
          value: '594,900 SAR',
          label: 'This Month',
          trend: '+22%',
          trendDirection: 'up',
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'projects-stats',
        type: WidgetType.STATS_CARD,
        title: 'Active Projects',
        position: { x: 3, y: 0, w: 3, h: 2 },
        config: {
          title: 'Active Projects',
          value: '5',
          label: 'In Progress',
          trend: '+1',
          trendDirection: 'up',
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'tasks-stats',
        type: WidgetType.STATS_CARD,
        title: 'Completed Tasks',
        position: { x: 6, y: 0, w: 3, h: 2 },
        config: {
          title: 'Completed Tasks',
          value: '24',
          label: 'This Week',
          trend: '+8',
          trendDirection: 'up',
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'efficiency-stats',
        type: WidgetType.STATS_CARD,
        title: 'Efficiency',
        position: { x: 9, y: 0, w: 3, h: 2 },
        config: {
          title: 'Efficiency',
          value: '94%',
          label: 'Average',
          trend: '+3%',
          trendDirection: 'up',
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'performance-chart-large',
        type: WidgetType.CHART,
        title: 'Performance Trends',
        position: { x: 0, y: 2, w: 8, h: 4 },
        config: {
          title: 'Performance Trends',
          chartType: 'line',
          xAxisLabel: 'Month',
          yAxisLabel: 'Revenue (SAR)',
          showLegend: true,
          showGrid: true,
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'financial-breakdown',
        type: WidgetType.FINANCIAL_OVERVIEW,
        title: 'Financial Breakdown',
        position: { x: 8, y: 2, w: 4, h: 4 },
        config: {
          title: 'Financial Breakdown',
          showCharts: true,
          showBreakdown: true,
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    gridConfig: {
      cols: 12,
      rowHeight: 60,
      margin: [10, 10],
      containerPadding: [10, 10],
      isDraggable: true,
      isResizable: true,
      isBounded: true
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const getTemplateById = (id: string): DashboardLayout | undefined => {
  return DASHBOARD_TEMPLATES.find(template => template.id === id);
};

export const getTemplatesByRole = (role: string): DashboardLayout[] => {
  switch (role) {
    case 'engineer':
      return DASHBOARD_TEMPLATES;
    case 'client':
      return DASHBOARD_TEMPLATES.filter(t => t.id === 'minimal');
    case 'enterprise':
      return DASHBOARD_TEMPLATES.filter(t => t.id === 'analytics-focused');
    default:
      return DASHBOARD_TEMPLATES;
  }
};
