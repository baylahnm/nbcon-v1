import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface KanbanColumn {
  id: string;
  title: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string; // Changed from union type to string for dynamic columns
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  assignees: string[];
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  projectId?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  attachments?: string[];
}

export interface KanbanFilters {
  categories: string[];
  priorities: string[];
  assignees: string[];
  search: string;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface Assignee {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  role: string;
  department: string;
}

// Default Columns Data
const defaultColumns: KanbanColumn[] = [
  { id: 'all-jobs', title: 'All Jobs', order: 0, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'draft', title: 'Draft', order: 1, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'to-do', title: 'To-do', order: 2, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'quoted', title: 'Quoted', order: 3, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'in-progress', title: 'In Progress', order: 4, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'completed', title: 'Completed', order: 5, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'in-review', title: 'In Review', order: 6, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 'cancelled', title: 'Cancelled', order: 7, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }
];

// Saudi Engineering Sample Data
const sampleAssignees: Assignee[] = [
  { id: '1', name: 'Current User', initials: 'CU', role: 'Senior Structural Engineer', department: 'NEOM Development' },
  { id: '2', name: 'Dr. Khalid Al-Mutairi', initials: 'KM', role: 'Lead MEP Engineer', department: 'Aramco Projects' },
  { id: '3', name: 'Fatima Al-Zahra', initials: 'FZ', role: 'Environmental Engineer', department: 'Red Sea Global' },
  { id: '4', name: 'Omar Hassan', initials: 'OH', role: 'Civil Engineer', department: 'SABIC Engineering' },
  { id: '5', name: 'Sarah Al-Dosari', initials: 'SD', role: 'Project Manager', department: 'Saudi Railway Company' },
  { id: '6', name: 'Mohammed Bin Rashid', initials: 'MR', role: 'Smart City Specialist', department: 'Qiddiya Development' },
  { id: '7', name: 'Noura Al-Mansouri', initials: 'NM', role: 'Quality Assurance Engineer', department: 'SEC Projects' },
  { id: '8', name: 'Abdullah Al-Shehri', initials: 'AS', role: 'Safety Engineer', department: 'NWC Infrastructure' }
];

const sampleCategories = [
  'Structural Engineering',
  'MEP Systems',
  'Civil Infrastructure',
  'Environmental Impact',
  'Smart City Solutions',
  'Quality Assurance',
  'Safety Compliance',
  'Project Management'
];

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'NEOM Smart City - Structural Analysis',
    description: 'Perform comprehensive structural analysis for the main residential tower in NEOM smart city project. Include seismic load calculations and wind resistance analysis.',
    status: 'in-progress',
    priority: 'High',
    category: 'Structural Engineering',
    assignees: ['1', '3'],
    dueDate: '2024-02-15',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    projectId: 'NEOM-001',
    estimatedHours: 40,
    actualHours: 25,
    tags: ['NEOM', 'Structural', 'Analysis'],
    attachments: ['structural-calc.pdf']
  },
  {
    id: '2',
    title: 'Red Sea Resort - MEP Design Review',
    description: 'Review MEP system designs for the luxury resort complex. Focus on energy efficiency and sustainability requirements.',
    status: 'in-review',
    priority: 'Medium',
    category: 'MEP Systems',
    assignees: ['2', '5'],
    dueDate: '2024-02-20',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-22',
    projectId: 'RSG-002',
    estimatedHours: 32,
    actualHours: 32,
    tags: ['Red Sea', 'MEP', 'Sustainability'],
    attachments: ['mep-designs.dwg']
  },
  {
    id: '3',
    title: 'Riyadh Metro - Environmental Assessment',
    description: 'Conduct environmental impact assessment for Phase 2 of Riyadh Metro expansion. Include noise pollution and air quality analysis.',
    status: 'to-do',
    priority: 'High',
    category: 'Environmental Impact',
    assignees: ['3', '8'],
    dueDate: '2024-03-01',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18',
    projectId: 'RMT-003',
    estimatedHours: 48,
    actualHours: 0,
    tags: ['Metro', 'Environmental', 'Assessment']
  },
  {
    id: '4',
    title: 'Qiddiya Theme Park - Safety Protocols',
    description: 'Develop comprehensive safety protocols for the new Qiddiya theme park attractions. Include emergency response procedures.',
    status: 'completed',
    priority: 'High',
    category: 'Safety Compliance',
    assignees: ['8', '7'],
    dueDate: '2024-01-30',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-28',
    projectId: 'QID-004',
    estimatedHours: 24,
    actualHours: 28,
    tags: ['Qiddiya', 'Safety', 'Protocols'],
    attachments: ['safety-manual.pdf']
  },
  {
    id: '5',
    title: 'Aramco Refinery - Quality Control',
    description: 'Implement quality control measures for the new Aramco refinery expansion project. Ensure compliance with international standards.',
    status: 'in-progress',
    priority: 'Medium',
    category: 'Quality Assurance',
    assignees: ['7', '4'],
    dueDate: '2024-02-25',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-21',
    projectId: 'ARF-005',
    estimatedHours: 36,
    actualHours: 18,
    tags: ['Aramco', 'Quality', 'Standards']
  },
  {
    id: '6',
    title: 'Saudi Railway Network - Feasibility Study',
    description: 'Draft initial feasibility study for the new high-speed railway network connecting major cities.',
    status: 'draft',
    priority: 'Medium',
    category: 'Project Management',
    assignees: ['5'],
    dueDate: '2024-03-15',
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25',
    projectId: 'SRN-006',
    estimatedHours: 60,
    actualHours: 0,
    tags: ['Railway', 'Feasibility', 'Study']
  },
  {
    id: '7',
    title: 'King Abdullah Financial District - HVAC Design',
    description: 'Prepare detailed quotation for HVAC system design and installation.',
    status: 'quoted',
    priority: 'High',
    category: 'MEP Systems',
    assignees: ['2', '6'],
    dueDate: '2024-02-28',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-22',
    projectId: 'KAFD-007',
    estimatedHours: 45,
    actualHours: 0,
    tags: ['KAFD', 'HVAC', 'Design']
  },
  {
    id: '8',
    title: 'AlUla Heritage Site - Water Management',
    description: 'Water management system design was cancelled due to archaeological site restrictions.',
    status: 'cancelled',
    priority: 'Low',
    category: 'Civil Infrastructure',
    assignees: ['4'],
    dueDate: '2024-02-10',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-25',
    projectId: 'ALU-008',
    estimatedHours: 30,
    actualHours: 5,
    tags: ['AlUla', 'Water', 'Heritage']
  },
  {
    id: '9',
    title: 'test1',
    description: 'Description must be at least 10 characters',
    status: 'to-do',
    priority: 'Medium',
    category: 'Structural Engineering',
    assignees: ['1'],
    dueDate: '2024-09-23',
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25',
    projectId: 'test1',
    estimatedHours: 10,
    actualHours: 0,
    tags: []
  }
];

// Store Interface
interface KanbanStore {
  // State
  tasks: Task[];
  columns: KanbanColumn[];
  filters: KanbanFilters;
  availableCategories: string[];
  availableAssignees: Assignee[];
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: string) => void;
  completeTask: (id: string) => void;
  
  // Column Actions
  addColumn: (column: Omit<KanbanColumn, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateColumn: (id: string, updates: Partial<KanbanColumn>) => void;
  deleteColumn: (id: string) => void;
  reorderColumns: (columnIds: string[]) => void;
  
  // Filter Actions
  setFilters: (filters: KanbanFilters) => void;
  clearFilters: () => void;
  
  // Computed
  getTasksByStatus: () => Record<string, Task[]>;
  getFilteredTasks: () => Task[];
  getSortedColumns: () => KanbanColumn[];
  getTaskAnalytics: () => {
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    byCategory: Record<string, number>;
    overdue: number;
    completedThisWeek: number;
  };
}

// Filter Logic
const applyFilters = (tasks: Task[], filters: KanbanFilters): Task[] => {
  return tasks.filter(task => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(task.category)) {
      return false;
    }

    // Priority filter
    if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
      return false;
    }

    // Assignee filter
    if (filters.assignees.length > 0) {
      const hasMatchingAssignee = task.assignees.some(assigneeId => 
        filters.assignees.includes(assigneeId)
      );
      if (!hasMatchingAssignee) return false;
    }

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      const taskDate = new Date(task.dueDate);
      if (filters.dateRange.start && taskDate < new Date(filters.dateRange.start)) {
        return false;
      }
      if (filters.dateRange.end && taskDate > new Date(filters.dateRange.end)) {
        return false;
      }
    }

    return true;
  });
};

// Store Implementation
export const useKanbanStore = create<KanbanStore>()(
  persist(
    (set, get) => ({
      // Initial State
      tasks: sampleTasks,
      columns: defaultColumns,
      filters: {
        categories: [],
        priorities: [],
        assignees: [],
        search: '',
        dateRange: { start: '', end: '' }
      },
      availableCategories: sampleCategories,
      availableAssignees: sampleAssignees,

      // Actions
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        set(state => ({
          tasks: [...state.tasks, newTask]
        }));

        // Analytics tracking
        console.log('Task created:', newTask);
      },

      updateTask: (id, updates) => {
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === id 
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          )
        }));

        // Analytics tracking
        console.log('Task updated:', { id, updates });
      },

      deleteTask: (id) => {
        set(state => ({
          tasks: state.tasks.filter(task => task.id !== id)
        }));

        // Analytics tracking
        console.log('Task deleted:', { id });
      },

      moveTask: (id, newStatus) => {
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === id 
              ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
              : task
          )
        }));

        // Analytics tracking
        console.log('Task moved:', { id, newStatus });
      },

      completeTask: (id) => {
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === id 
              ? { ...task, status: 'completed', updatedAt: new Date().toISOString() }
              : task
          )
        }));

        // Analytics tracking
        console.log('Task completed:', { id });
      },

      // Column Actions
      addColumn: (columnData) => {
        const { columns } = get();
        const newColumn: KanbanColumn = {
          ...columnData,
          id: `column-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        set(state => ({
          columns: [...state.columns, newColumn]
        }));

        // Analytics tracking
        console.log('Column created:', newColumn);
      },

      updateColumn: (id, updates) => {
        set(state => ({
          columns: state.columns.map(column =>
            column.id === id 
              ? { ...column, ...updates, updatedAt: new Date().toISOString() }
              : column
          )
        }));

        // Analytics tracking
        console.log('Column updated:', { id, updates });
      },

      deleteColumn: (id) => {
        const { tasks } = get();
        const hasTasks = tasks.some(task => task.status === id);
        
        if (hasTasks) {
          console.warn('Cannot delete column with tasks');
          return;
        }

        set(state => ({
          columns: state.columns.filter(column => column.id !== id)
        }));

        // Analytics tracking
        console.log('Column deleted:', { id });
      },

      reorderColumns: (columnIds) => {
        set(state => ({
          columns: columnIds.map((id, index) => {
            const column = state.columns.find(c => c.id === id);
            return column ? { ...column, order: index, updatedAt: new Date().toISOString() } : null;
          }).filter(Boolean) as KanbanColumn[]
        }));

        // Analytics tracking
        console.log('Columns reordered:', columnIds);
      },

      setFilters: (filters) => {
        set({ filters });
      },

      clearFilters: () => {
        set({
          filters: {
            categories: [],
            priorities: [],
            assignees: [],
            search: '',
            dateRange: { start: '', end: '' }
          }
        });
      },

      // Computed Properties
      getTasksByStatus: () => {
        const { tasks, filters, columns } = get();
        const filteredTasks = applyFilters(tasks, filters);
        
        // Create dynamic object based on available columns
        const tasksByStatus: Record<string, Task[]> = {};
        
        // Initialize all columns with empty arrays
        columns.forEach(column => {
          tasksByStatus[column.id] = [];
        });
        
        // Special handling for 'All Jobs' column - show all tasks
        const allJobsColumn = columns.find(col => col.id === 'all-jobs');
        if (allJobsColumn) {
          tasksByStatus['all-jobs'] = filteredTasks;
        }
        
        // Distribute tasks to their respective columns
        filteredTasks.forEach(task => {
          if (task.status !== 'all-jobs' && tasksByStatus[task.status]) {
            tasksByStatus[task.status].push(task);
          }
        });
        
        return tasksByStatus;
      },

      getFilteredTasks: () => {
        const { tasks, filters } = get();
        return applyFilters(tasks, filters);
      },

      getSortedColumns: () => {
        const { columns } = get();
        return [...columns].sort((a, b) => a.order - b.order);
      },

      getTaskAnalytics: () => {
        const { tasks } = get();
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const analytics = {
          total: tasks.length,
          byStatus: {} as Record<string, number>,
          byPriority: {} as Record<string, number>,
          byCategory: {} as Record<string, number>,
          overdue: 0,
          completedThisWeek: 0
        };

        tasks.forEach(task => {
          // Status analytics
          analytics.byStatus[task.status] = (analytics.byStatus[task.status] || 0) + 1;
          
          // Priority analytics
          analytics.byPriority[task.priority] = (analytics.byPriority[task.priority] || 0) + 1;
          
          // Category analytics
          analytics.byCategory[task.category] = (analytics.byCategory[task.category] || 0) + 1;
          
          // Overdue tasks
          if (task.status !== 'completed' && new Date(task.dueDate) < now) {
            analytics.overdue++;
          }
          
          // Completed this week
          if (task.status === 'completed' && new Date(task.updatedAt) > oneWeekAgo) {
            analytics.completedThisWeek++;
          }
        });

        return analytics;
      }
    }),
    {
      name: 'kanban-store',
      partialize: (state) => ({
        tasks: state.tasks,
        columns: state.columns,
        filters: state.filters
      })
    }
  )
);

// Convenience hooks
export const useKanbanTasks = () => useKanbanStore(state => ({
  tasks: state.tasks,
  tasksByStatus: state.getTasksByStatus(),
  filteredTasks: state.getFilteredTasks(),
  analytics: state.getTaskAnalytics()
}));

export const useKanbanFilters = () => useKanbanStore(state => ({
  filters: state.filters,
  setFilters: state.setFilters,
  clearFilters: state.clearFilters,
  availableCategories: state.availableCategories,
  availableAssignees: state.availableAssignees
}));

export const useKanbanActions = () => useKanbanStore(state => ({
  addTask: state.addTask,
  updateTask: state.updateTask,
  deleteTask: state.deleteTask,
  moveTask: state.moveTask,
  completeTask: state.completeTask,
  addColumn: state.addColumn,
  updateColumn: state.updateColumn,
  deleteColumn: state.deleteColumn,
  reorderColumns: state.reorderColumns
}));
