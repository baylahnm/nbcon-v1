import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// AI Generation Helper Functions
const generateConstructionTasksFromPrompt = (prompt: string): CreateGanttTask[] => {
  const lowerPrompt = prompt.toLowerCase();
  const tasks: CreateGanttTask[] = [];
  
  // Extract project type and timeline
  const isOffice = lowerPrompt.includes('office') || lowerPrompt.includes('building');
  const isResidential = lowerPrompt.includes('house') || lowerPrompt.includes('residential');
  const isInfrastructure = lowerPrompt.includes('road') || lowerPrompt.includes('bridge') || lowerPrompt.includes('infrastructure');
  
  // Extract start date (default to March if mentioned)
  const startDate = lowerPrompt.includes('march') ? '2025-03-01' : '2025-03-01';
  
  // Generate tasks based on project type
  if (isOffice || isResidential) {
    // Building construction phases
    tasks.push({
      project_id: '', // Will be set by caller
      title: 'Site Preparation & Foundation',
      description: 'Clear site, survey, and prepare foundation',
      start_date: startDate,
      end_date: addDays(startDate, 30),
      duration: 30,
      priority: 'high',
      task_type: 'phase',
      crew_size: 8,
      estimated_hours: 240,
      cost_estimate: 75000
    });
    
    tasks.push({
      project_id: '',
      title: 'Foundation Complete',
      description: 'Foundation milestone achieved',
      start_date: addDays(startDate, 30),
      end_date: addDays(startDate, 30),
      duration: 0,
      priority: 'high',
      task_type: 'milestone',
      crew_size: 0,
      is_milestone: true
    });
    
    tasks.push({
      project_id: '',
      title: 'Structural Framing',
      description: 'Steel/concrete frame construction',
      start_date: addDays(startDate, 35),
      end_date: addDays(startDate, 90),
      duration: 55,
      priority: 'high',
      task_type: 'phase',
      crew_size: 12,
      estimated_hours: 660,
      cost_estimate: 200000
    });
    
    tasks.push({
      project_id: '',
      title: 'MEP Installation',
      description: 'Mechanical, Electrical, Plumbing systems',
      start_date: addDays(startDate, 95),
      end_date: addDays(startDate, 150),
      duration: 55,
      priority: 'high',
      task_type: 'phase',
      crew_size: 15,
      estimated_hours: 825,
      cost_estimate: 180000
    });
    
    tasks.push({
      project_id: '',
      title: 'Interior Finishing',
      description: 'Drywall, flooring, fixtures, paint',
      start_date: addDays(startDate, 155),
      end_date: addDays(startDate, 200),
      duration: 45,
      priority: 'medium',
      task_type: 'phase',
      crew_size: 10,
      estimated_hours: 450,
      cost_estimate: 120000
    });
    
    tasks.push({
      project_id: '',
      title: 'Final Inspection & Handover',
      description: 'Quality inspection and project handover',
      start_date: addDays(startDate, 205),
      end_date: addDays(startDate, 220),
      duration: 15,
      priority: 'high',
      task_type: 'phase',
      crew_size: 5,
      estimated_hours: 75,
      cost_estimate: 25000
    });
  }
  
  if (isInfrastructure) {
    // Infrastructure construction phases
    tasks.push({
      project_id: '',
      title: 'Design & Planning',
      description: 'Engineering design and regulatory approvals',
      start_date: startDate,
      end_date: addDays(startDate, 60),
      duration: 60,
      priority: 'high',
      task_type: 'phase',
      crew_size: 5,
      estimated_hours: 300,
      cost_estimate: 100000
    });
    
    tasks.push({
      project_id: '',
      title: 'Site Preparation',
      description: 'Clearing, grading, and utility relocation',
      start_date: addDays(startDate, 65),
      end_date: addDays(startDate, 90),
      duration: 25,
      priority: 'high',
      task_type: 'phase',
      crew_size: 10,
      estimated_hours: 200,
      cost_estimate: 80000
    });
    
    tasks.push({
      project_id: '',
      title: 'Construction',
      description: 'Main construction work',
      start_date: addDays(startDate, 95),
      end_date: addDays(startDate, 200),
      duration: 105,
      priority: 'high',
      task_type: 'phase',
      crew_size: 20,
      estimated_hours: 1680,
      cost_estimate: 500000
    });
    
    tasks.push({
      project_id: '',
      title: 'Testing & Commissioning',
      description: 'System testing and commissioning',
      start_date: addDays(startDate, 205),
      end_date: addDays(startDate, 220),
      duration: 15,
      priority: 'high',
      task_type: 'phase',
      crew_size: 8,
      estimated_hours: 120,
      cost_estimate: 50000
    });
  }
  
  return tasks;
};

const addDays = (dateString: string, days: number): string => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// Types
export interface GanttProject {
  id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  created_by: string;
  project_type: 'construction' | 'renovation' | 'infrastructure' | 'residential' | 'commercial';
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  budget?: number;
  currency: string;
  location?: string;
  is_template: boolean;
  template_name?: string;
  created_at: string;
  updated_at: string;
}

export interface GanttTask {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  duration?: number; // days
  progress: number; // 0-100
  parent_id?: string;
  sort_order: number;
  is_milestone: boolean;
  is_critical_path: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  task_type: 'task' | 'milestone' | 'phase' | 'deliverable';
  crew_size: number;
  estimated_hours?: number;
  actual_hours?: number;
  cost_estimate?: number;
  actual_cost?: number;
  created_at: string;
  updated_at: string;
}

export interface GanttDependency {
  id: string;
  from_task_id: string;
  to_task_id: string;
  dependency_type: 'finish-to-start' | 'start-to-start' | 'finish-to-finish' | 'start-to-finish';
  lag_days: number;
  created_at: string;
}

export interface GanttResource {
  id: string;
  project_id: string;
  name: string;
  role: string;
  hourly_rate?: number;
  availability_schedule?: any;
  skills: string[];
  contact_info?: any;
  created_at: string;
  updated_at: string;
}

export interface GanttTaskAssignment {
  id: string;
  task_id: string;
  resource_id: string;
  assigned_hours?: number;
  start_date?: string;
  end_date?: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

export interface GanttChangeOrder {
  id: string;
  project_id: string;
  change_number: string;
  title: string;
  description?: string;
  scope_changes?: string;
  cost_impact?: number;
  schedule_impact_days?: number;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  requested_by?: string;
  approved_by?: string;
  requested_at: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface GanttPunchListItem {
  id: string;
  project_id: string;
  task_id?: string;
  item_description: string;
  location?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'completed' | 'verified';
  assigned_to?: string;
  due_date?: string;
  completed_date?: string;
  notes?: string;
  photos?: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGanttProject {
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  project_type: 'construction' | 'renovation' | 'infrastructure' | 'residential' | 'commercial';
  budget?: number;
  currency?: string;
  location?: string;
  is_template?: boolean;
  template_name?: string;
}

export interface CreateGanttTask {
  project_id: string;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  duration?: number;
  parent_id?: string;
  is_milestone?: boolean;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  task_type?: 'task' | 'milestone' | 'phase' | 'deliverable';
  crew_size?: number;
  estimated_hours?: number;
  cost_estimate?: number;
}

// Store interface
interface GanttStore {
  // Data
  projects: GanttProject[];
  tasks: GanttTask[];
  dependencies: GanttDependency[];
  resources: GanttResource[];
  taskAssignments: GanttTaskAssignment[];
  changeOrders: GanttChangeOrder[];
  punchList: GanttPunchListItem[];
  
  // UI State
  selectedProject: string | null;
  selectedTask: string | null;
  isGenerating: boolean;
  viewMode: 'gantt' | 'calendar' | 'kanban';
  zoomLevel: 'day' | 'week' | 'month' | 'quarter';
  
  // Actions
  setSelectedProject: (projectId: string | null) => void;
  setSelectedTask: (taskId: string | null) => void;
  setViewMode: (mode: 'gantt' | 'calendar' | 'kanban') => void;
  setZoomLevel: (level: 'day' | 'week' | 'month' | 'quarter') => void;
  
  // Project actions
  createProject: (project: CreateGanttProject) => Promise<string>;
  updateProject: (projectId: string, updates: Partial<GanttProject>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  duplicateProject: (projectId: string, newName: string) => Promise<string>;
  saveAsTemplate: (projectId: string, templateName: string) => Promise<void>;
  
  // Task actions
  createTask: (task: CreateGanttTask) => Promise<string>;
  updateTask: (taskId: string, updates: Partial<GanttTask>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (taskId: string, newStartDate: string, newEndDate: string) => Promise<void>;
  duplicateTask: (taskId: string) => Promise<string>;
  
  // Dependency actions
  addDependency: (fromTaskId: string, toTaskId: string, type?: string) => Promise<string>;
  removeDependency: (dependencyId: string) => Promise<void>;
  updateDependency: (dependencyId: string, updates: Partial<GanttDependency>) => Promise<void>;
  
  // Resource actions
  createResource: (projectId: string, resource: Partial<GanttResource>) => Promise<string>;
  updateResource: (resourceId: string, updates: Partial<GanttResource>) => Promise<void>;
  deleteResource: (resourceId: string) => Promise<void>;
  assignResourceToTask: (taskId: string, resourceId: string, hours?: number) => Promise<void>;
  unassignResourceFromTask: (taskId: string, resourceId: string) => Promise<void>;
  
  // Change order actions
  createChangeOrder: (projectId: string, changeOrder: Partial<GanttChangeOrder>) => Promise<string>;
  updateChangeOrder: (changeOrderId: string, updates: Partial<GanttChangeOrder>) => Promise<void>;
  approveChangeOrder: (changeOrderId: string, approvedBy: string) => Promise<void>;
  
  // Punch list actions
  createPunchListItem: (projectId: string, item: Partial<GanttPunchListItem>) => Promise<string>;
  updatePunchListItem: (itemId: string, updates: Partial<GanttPunchListItem>) => Promise<void>;
  completePunchListItem: (itemId: string) => Promise<void>;
  
  // AI actions
  generateGanttFromPrompt: (prompt: string, projectId?: string) => Promise<void>;
  optimizeSchedule: (projectId: string) => Promise<void>;
  identifyCriticalPath: (projectId: string) => Promise<void>;
  
  // Utility actions
  getTasksForProject: (projectId: string) => GanttTask[];
  getDependenciesForTask: (taskId: string) => GanttDependency[];
  getResourcesForProject: (projectId: string) => GanttResource[];
  getCriticalPathTasks: (projectId: string) => GanttTask[];
  calculateProjectProgress: (projectId: string) => number;
  exportToPDF: (projectId: string) => Promise<void>;
  exportToExcel: (projectId: string) => Promise<void>;
}

// Sample data for development
const sampleProjects: GanttProject[] = [
  {
    id: '1',
    name: '3-Story Office Building',
    description: 'Modern office complex with parking garage',
    start_date: '2025-03-01',
    end_date: '2025-12-15',
    created_by: 'user-1',
    project_type: 'commercial',
    status: 'planning',
    budget: 2500000,
    currency: 'SAR',
    location: 'Riyadh, Saudi Arabia',
    is_template: false,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
];

const sampleTasks: GanttTask[] = [
  {
    id: '1',
    project_id: '1',
    title: 'Site Preparation',
    description: 'Clear site and prepare foundation',
    start_date: '2025-03-01',
    end_date: '2025-03-15',
    duration: 14,
    progress: 0,
    sort_order: 1,
    is_milestone: false,
    is_critical_path: true,
    priority: 'high',
    task_type: 'phase',
    crew_size: 8,
    estimated_hours: 112,
    cost_estimate: 50000,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    project_id: '1',
    title: 'Foundation Work',
    description: 'Pour concrete foundation and basement',
    start_date: '2025-03-16',
    end_date: '2025-04-30',
    duration: 45,
    progress: 0,
    parent_id: '1',
    sort_order: 2,
    is_milestone: false,
    is_critical_path: true,
    priority: 'high',
    task_type: 'task',
    crew_size: 12,
    estimated_hours: 360,
    cost_estimate: 150000,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '3',
    project_id: '1',
    title: 'Foundation Complete',
    description: 'Foundation milestone achieved',
    start_date: '2025-04-30',
    end_date: '2025-04-30',
    duration: 0,
    progress: 0,
    parent_id: '1',
    sort_order: 3,
    is_milestone: true,
    is_critical_path: true,
    priority: 'high',
    task_type: 'milestone',
    crew_size: 0,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
];

const sampleDependencies: GanttDependency[] = [
  {
    id: '1',
    from_task_id: '1',
    to_task_id: '2',
    dependency_type: 'finish-to-start',
    lag_days: 0,
    created_at: '2025-01-01T00:00:00Z'
  }
];

// Store implementation
export const useGanttStore = create<GanttStore>()(
  persist(
    (set, get) => ({
      // Initial state
      projects: sampleProjects,
      tasks: sampleTasks,
      dependencies: sampleDependencies,
      resources: [],
      taskAssignments: [],
      changeOrders: [],
      punchList: [],
      
      selectedProject: null,
      selectedTask: null,
      isGenerating: false,
      viewMode: 'gantt',
      zoomLevel: 'week',
      
      // UI actions
      setSelectedProject: (projectId) => set({ selectedProject: projectId }),
      setSelectedTask: (taskId) => set({ selectedTask: taskId }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setZoomLevel: (level) => set({ zoomLevel: level }),
      
      // Project actions
      createProject: async (projectData) => {
        const newProject: GanttProject = {
          id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...projectData,
          created_by: 'current-user', // This should come from auth store
          status: 'planning',
          currency: projectData.currency || 'SAR',
          is_template: projectData.is_template || false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        set(state => ({
          projects: [...state.projects, newProject]
        }));
        
        return newProject.id;
      },
      
      updateProject: async (projectId, updates) => {
        set(state => ({
          projects: state.projects.map(project =>
            project.id === projectId 
              ? { ...project, ...updates, updated_at: new Date().toISOString() }
              : project
          )
        }));
      },
      
      deleteProject: async (projectId) => {
        set(state => ({
          projects: state.projects.filter(p => p.id !== projectId),
          tasks: state.tasks.filter(t => t.project_id !== projectId),
          dependencies: state.dependencies.filter(d => 
            !state.tasks.some(t => t.id === d.from_task_id || t.id === d.to_task_id)
          )
        }));
      },
      
      duplicateProject: async (projectId, newName) => {
        const originalProject = get().projects.find(p => p.id === projectId);
        if (!originalProject) throw new Error('Project not found');
        
        const duplicatedProject: GanttProject = {
          ...originalProject,
          id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: newName,
          status: 'planning',
          is_template: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        set(state => ({
          projects: [...state.projects, duplicatedProject]
        }));
        
        return duplicatedProject.id;
      },
      
      saveAsTemplate: async (projectId, templateName) => {
        const project = get().projects.find(p => p.id === projectId);
        if (!project) throw new Error('Project not found');
        
        const template: GanttProject = {
          ...project,
          id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: templateName,
          is_template: true,
          template_name: templateName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        set(state => ({
          projects: [...state.projects, template]
        }));
      },
      
      // Task actions
      createTask: async (taskData) => {
        const newTask: GanttTask = {
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...taskData,
          progress: 0,
          sort_order: get().tasks.filter(t => t.project_id === taskData.project_id).length,
          is_milestone: taskData.is_milestone || false,
          is_critical_path: false,
          priority: taskData.priority || 'medium',
          task_type: taskData.task_type || 'task',
          crew_size: taskData.crew_size || 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        set(state => ({
          tasks: [...state.tasks, newTask]
        }));
        
        return newTask.id;
      },
      
      updateTask: async (taskId, updates) => {
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === taskId 
              ? { ...task, ...updates, updated_at: new Date().toISOString() }
              : task
          )
        }));
      },
      
      deleteTask: async (taskId) => {
        set(state => ({
          tasks: state.tasks.filter(t => t.id !== taskId),
          dependencies: state.dependencies.filter(d => 
            d.from_task_id !== taskId && d.to_task_id !== taskId
          )
        }));
      },
      
      moveTask: async (taskId, newStartDate, newEndDate) => {
        const task = get().tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const duration = Math.ceil(
          (new Date(newEndDate).getTime() - new Date(newStartDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        await get().updateTask(taskId, {
          start_date: newStartDate,
          end_date: newEndDate,
          duration
        });
      },
      
      duplicateTask: async (taskId) => {
        const originalTask = get().tasks.find(t => t.id === taskId);
        if (!originalTask) throw new Error('Task not found');
        
        const duplicatedTask: GanttTask = {
          ...originalTask,
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: `${originalTask.title} (Copy)`,
          progress: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        set(state => ({
          tasks: [...state.tasks, duplicatedTask]
        }));
        
        return duplicatedTask.id;
      },
      
      // Dependency actions
      addDependency: async (fromTaskId, toTaskId, type = 'finish-to-start') => {
        const newDependency: GanttDependency = {
          id: `dep-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          from_task_id: fromTaskId,
          to_task_id: toTaskId,
          dependency_type: type as any,
          lag_days: 0,
          created_at: new Date().toISOString()
        };
        
        set(state => ({
          dependencies: [...state.dependencies, newDependency]
        }));
        
        return newDependency.id;
      },
      
      removeDependency: async (dependencyId) => {
        set(state => ({
          dependencies: state.dependencies.filter(d => d.id !== dependencyId)
        }));
      },
      
      updateDependency: async (dependencyId, updates) => {
        set(state => ({
          dependencies: state.dependencies.map(dep =>
            dep.id === dependencyId ? { ...dep, ...updates } : dep
          )
        }));
      },
      
      // Resource actions (simplified for now)
      createResource: async (projectId, resourceData) => {
        const newResource: GanttResource = {
          id: `resource-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          project_id: projectId,
          name: resourceData.name || '',
          role: resourceData.role || '',
          skills: resourceData.skills || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        set(state => ({
          resources: [...state.resources, newResource]
        }));
        
        return newResource.id;
      },
      
      updateResource: async (resourceId, updates) => {
        set(state => ({
          resources: state.resources.map(resource =>
            resource.id === resourceId 
              ? { ...resource, ...updates, updated_at: new Date().toISOString() }
              : resource
          )
        }));
      },
      
      deleteResource: async (resourceId) => {
        set(state => ({
          resources: state.resources.filter(r => r.id !== resourceId)
        }));
      },
      
      assignResourceToTask: async (taskId, resourceId, hours) => {
        const newAssignment: GanttTaskAssignment = {
          id: `assignment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          task_id: taskId,
          resource_id: resourceId,
          assigned_hours: hours,
          status: 'assigned',
          created_at: new Date().toISOString()
        };
        
        set(state => ({
          taskAssignments: [...state.taskAssignments, newAssignment]
        }));
      },
      
      unassignResourceFromTask: async (taskId, resourceId) => {
        set(state => ({
          taskAssignments: state.taskAssignments.filter(
            assignment => !(assignment.task_id === taskId && assignment.resource_id === resourceId)
          )
        }));
      },
      
      // Change order actions (simplified)
      createChangeOrder: async (projectId, changeOrderData) => {
        const newChangeOrder: GanttChangeOrder = {
          id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          project_id: projectId,
          change_number: changeOrderData.change_number || `CO-${Date.now()}`,
          title: changeOrderData.title || '',
          status: 'pending',
          requested_by: 'current-user',
          requested_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...changeOrderData
        };
        
        set(state => ({
          changeOrders: [...state.changeOrders, newChangeOrder]
        }));
        
        return newChangeOrder.id;
      },
      
      updateChangeOrder: async (changeOrderId, updates) => {
        set(state => ({
          changeOrders: state.changeOrders.map(co =>
            co.id === changeOrderId 
              ? { ...co, ...updates, updated_at: new Date().toISOString() }
              : co
          )
        }));
      },
      
      approveChangeOrder: async (changeOrderId, approvedBy) => {
        await get().updateChangeOrder(changeOrderId, {
          status: 'approved',
          approved_by: approvedBy,
          approved_at: new Date().toISOString()
        });
      },
      
      // Punch list actions (simplified)
      createPunchListItem: async (projectId, itemData) => {
        const newItem: GanttPunchListItem = {
          id: `punch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          project_id: projectId,
          item_description: itemData.item_description || '',
          priority: itemData.priority || 'medium',
          status: 'open',
          created_by: 'current-user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...itemData
        };
        
        set(state => ({
          punchList: [...state.punchList, newItem]
        }));
        
        return newItem.id;
      },
      
      updatePunchListItem: async (itemId, updates) => {
        set(state => ({
          punchList: state.punchList.map(item =>
            item.id === itemId 
              ? { ...item, ...updates, updated_at: new Date().toISOString() }
              : item
          )
        }));
      },
      
      completePunchListItem: async (itemId) => {
        await get().updatePunchListItem(itemId, {
          status: 'completed',
          completed_date: new Date().toISOString()
        });
      },
      
      // AI actions (enhanced implementations)
      generateGanttFromPrompt: async (prompt, projectId) => {
        set({ isGenerating: true });
        
        try {
          // This would integrate with the AI service
          console.log('Generating Gantt from prompt:', prompt);
          
          // Simulate AI generation with construction-specific tasks
          const constructionTasks = generateConstructionTasksFromPrompt(prompt);
          
          // Add generated tasks to the project
          for (const taskData of constructionTasks) {
            await get().createTask({
              project_id: projectId,
              ...taskData
            });
          }
          
          set({ isGenerating: false });
        } catch (error) {
          console.error('AI generation failed:', error);
          set({ isGenerating: false });
        }
      },
      
      optimizeSchedule: async (projectId) => {
        console.log('Optimizing schedule for project:', projectId);
      },
      
      identifyCriticalPath: async (projectId) => {
        console.log('Identifying critical path for project:', projectId);
      },
      
      // Utility functions
      getTasksForProject: (projectId) => {
        return get().tasks.filter(t => t.project_id === projectId);
      },
      
      getDependenciesForTask: (taskId) => {
        return get().dependencies.filter(d => 
          d.from_task_id === taskId || d.to_task_id === taskId
        );
      },
      
      getResourcesForProject: (projectId) => {
        return get().resources.filter(r => r.project_id === projectId);
      },
      
      getCriticalPathTasks: (projectId) => {
        return get().tasks.filter(t => 
          t.project_id === projectId && t.is_critical_path
        );
      },
      
      calculateProjectProgress: (projectId) => {
        const projectTasks = get().getTasksForProject(projectId);
        if (projectTasks.length === 0) return 0;
        
        const totalProgress = projectTasks.reduce((sum, task) => sum + task.progress, 0);
        return totalProgress / projectTasks.length;
      },
      
      exportToPDF: async (projectId) => {
        console.log('Exporting project to PDF:', projectId);
      },
      
      exportToExcel: async (projectId) => {
        console.log('Exporting project to Excel:', projectId);
      }
    }),
    {
      name: 'gantt-store',
      version: 1
    }
  )
);
