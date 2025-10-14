import { create } from 'zustand';
// import nasserAvatar from 'figma:asset/f2bc29563152738b3b8753fd7fa0f8faad491914.png';
import { 
  User, 
  Project, 
  ProjectMember, 
  Task, 
  TaskAssignee, 
  TaskComment, 
  TaskSubmission, 
  Notification,
  ActivityItem,
  ProjectWithDetails,
  TaskWithDetails,
  ProjectRole,
  TaskStatus,
  TaskPriority,
  ProjectStatus
} from '../../../6-enterprise/others/types/EnterpriseTypes';

interface CreateProjectInput {
  name: string;
  subtitle?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  category?: string;
  status?: ProjectStatus;
  budgetMin?: number;
  budgetMax?: number;
  currency?: string;
  calendarEventIds?: string[];
}

// Mock data
const mockUsers: User[] = [
  { 
    id: '1', 
    name: 'Nasser Baylah', 
    email: 'nasser@nbcon.com', 
    avatar: '/api/placeholder/40/40',
    specialty: 'Project Management',
    yearsOfExperience: 12,
    company: 'NBCon Construction',
    phoneNumber: '+966 50 123 4567',
    availabilityStatus: 'free',
    isOnline: true
  },
  { 
    id: '2', 
    name: 'Ahmed Al-Rashid', 
    email: 'ahmed@nbcon.com', 
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    specialty: 'Civil Engineering',
    yearsOfExperience: 15,
    company: 'NBCon Construction',
    phoneNumber: '+966 50 234 5678',
    availabilityStatus: 'busy',
    isOnline: true
  },
  { 
    id: '3', 
    name: 'Mohammed Al-Zahrani', 
    email: 'mohammed@nbcon.com', 
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&crop=face',
    specialty: 'Structural Engineering',
    yearsOfExperience: 10,
    company: 'NBCon Construction',
    phoneNumber: '+966 50 345 6789',
    availabilityStatus: 'free',
    isOnline: false
  },
  { 
    id: '4', 
    name: 'Fatima Al-Mansouri', 
    email: 'fatima@nbcon.com', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    specialty: 'Architecture',
    yearsOfExperience: 8,
    company: 'NBCon Construction',
    phoneNumber: '+966 50 456 7890',
    availabilityStatus: 'free',
    isOnline: true
  },
  { 
    id: '5', 
    name: 'Khalid Al-Shehri', 
    email: 'khalid@nbcon.com', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    specialty: 'MEP Engineering',
    yearsOfExperience: 14,
    company: 'NBCon Construction',
    phoneNumber: '+966 50 567 8901',
    availabilityStatus: 'busy',
    isOnline: false
  },
  { 
    id: '6', 
    name: 'Layla Al-Harbi', 
    email: 'layla@nbcon.com', 
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
    specialty: 'Safety Management',
    yearsOfExperience: 6,
    company: 'NBCon Construction',
    phoneNumber: '+966 50 678 9012',
    availabilityStatus: 'free',
    isOnline: true
  }
];

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'NEOM Smart City Phase 1',
    subtitle: 'Infrastructure development and smart building construction',
    ownerId: '1',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Aramco Refinery Expansion',
    subtitle: 'Petrochemical facility upgrade and safety improvements',
    ownerId: '2',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '3',
    name: 'Red Sea Resort Complex',
    subtitle: 'Luxury resort construction with marine infrastructure',
    ownerId: '3',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  }
];

const mockProjectMembers: ProjectMember[] = [
  { projectId: '1', userId: '1', role: 'owner', createdAt: '2024-01-15T00:00:00Z' },
  { projectId: '1', userId: '2', role: 'manager', createdAt: '2024-01-15T00:00:00Z' },
  { projectId: '1', userId: '3', role: 'engineer', createdAt: '2024-01-15T00:00:00Z' },
  { projectId: '1', userId: '4', role: 'engineer', createdAt: '2024-01-15T00:00:00Z' },
  { projectId: '2', userId: '2', role: 'owner', createdAt: '2024-01-10T00:00:00Z' },
  { projectId: '2', userId: '5', role: 'engineer', createdAt: '2024-01-10T00:00:00Z' },
  { projectId: '2', userId: '6', role: 'engineer', createdAt: '2024-01-10T00:00:00Z' },
  { projectId: '3', userId: '3', role: 'owner', createdAt: '2024-01-05T00:00:00Z' },
  { projectId: '3', userId: '4', role: 'manager', createdAt: '2024-01-05T00:00:00Z' },
  { projectId: '3', userId: '6', role: 'engineer', createdAt: '2024-01-05T00:00:00Z' },
];

const mockTasks: Task[] = [
  {
    id: '1',
    projectId: '1',
    title: 'Foundation Excavation & Preparation',
    description: 'Complete site preparation and foundation excavation for Phase 1 buildings',
    status: 'in_progress',
    priority: 'high',
    createdBy: '1',
    dueDate: '2024-02-01',
    progress: 75,
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '2',
    projectId: '1',
    title: 'Structural Steel Installation',
    description: 'Install primary structural steel framework for smart buildings',
    status: 'todo',
    priority: 'high',
    createdBy: '2',
    dueDate: '2024-02-15',
    progress: 0,
    createdAt: '2024-01-17T00:00:00Z',
    updatedAt: '2024-01-17T00:00:00Z'
  },
  {
    id: '3',
    projectId: '1',
    title: 'MEP Systems Installation',
    description: 'Install mechanical, electrical, and plumbing systems',
    status: 'done',
    priority: 'medium',
    createdBy: '3',
    progress: 100,
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z'
  },
  {
    id: '4',
    projectId: '2',
    title: 'Safety System Upgrade',
    description: 'Install new fire suppression and emergency response systems',
    status: 'in_progress',
    priority: 'high',
    createdBy: '2',
    dueDate: '2024-02-10',
    progress: 45,
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '5',
    projectId: '2',
    title: 'Process Equipment Installation',
    description: 'Install new petrochemical processing equipment',
    status: 'todo',
    priority: 'high',
    createdBy: '5',
    dueDate: '2024-03-01',
    progress: 0,
    createdAt: '2024-01-19T00:00:00Z',
    updatedAt: '2024-01-19T00:00:00Z'
  },
  {
    id: '6',
    projectId: '3',
    title: 'Marine Infrastructure Design',
    description: 'Design and plan marine infrastructure for resort complex',
    status: 'in_progress',
    priority: 'medium',
    createdBy: '3',
    dueDate: '2024-02-20',
    progress: 60,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  }
];

const mockTaskAssignees: TaskAssignee[] = [
  { taskId: '1', userId: '2', assignedAt: '2024-01-16T00:00:00Z' },
  { taskId: '1', userId: '3', assignedAt: '2024-01-16T00:00:00Z' },
  { taskId: '2', userId: '3', assignedAt: '2024-01-17T00:00:00Z' },
  { taskId: '2', userId: '4', assignedAt: '2024-01-17T00:00:00Z' },
  { taskId: '3', userId: '5', assignedAt: '2024-01-12T00:00:00Z' },
  { taskId: '4', userId: '5', assignedAt: '2024-01-18T00:00:00Z' },
  { taskId: '4', userId: '6', assignedAt: '2024-01-18T00:00:00Z' },
  { taskId: '5', userId: '5', assignedAt: '2024-01-19T00:00:00Z' },
  { taskId: '6', userId: '4', assignedAt: '2024-01-15T00:00:00Z' },
  { taskId: '6', userId: '6', assignedAt: '2024-01-15T00:00:00Z' },
];

interface TeamStore {
  // Data
  users: User[];
  projects: Project[];
  projectMembers: ProjectMember[];
  tasks: Task[];
  taskAssignees: TaskAssignee[];
  taskComments: TaskComment[];
  taskSubmissions: TaskSubmission[];
  notifications: Notification[];
  activities: ActivityItem[];
  
  // UI State
  currentUserId: string;
  selectedProject: string | null;
  editingProject: string | null;
  notificationCount: number;
  
  // Actions
  setCurrentUser: (userId: string) => void;
  setSelectedProject: (projectId: string | null) => void;
  setEditingProject: (projectId: string | null) => void;
  
  // Project actions
  createProject: (input: CreateProjectInput) => Project;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  addProjectMember: (projectId: string, userId: string, role: ProjectRole) => void;
  updateMemberRole: (projectId: string, userId: string, role: ProjectRole) => void;
  removeMember: (projectId: string, userId: string) => void;
  
  // Task actions
  createTask: (projectId: string, task: Partial<Task> & { title: string }) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  assignTask: (taskId: string, userIds: string[]) => void;
  updateTaskProgress: (taskId: string, progress: number) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  addTaskComment: (taskId: string, body: string) => void;
  addTaskSubmission: (taskId: string, note?: string, attachmentUrl?: string) => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (notificationId: string) => void;
  clearNotifications: () => void;
  
  // Computed getters
  getProjectsWithDetails: () => ProjectWithDetails[];
  getProjectById: (id: string) => ProjectWithDetails | undefined;
  getTasksForProject: (projectId: string) => TaskWithDetails[];
  getUserRole: (projectId: string, userId: string) => ProjectRole | null;
  getUnreadNotifications: () => Notification[];
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  // Initial data
  users: mockUsers,
  projects: mockProjects,
  projectMembers: mockProjectMembers,
  tasks: mockTasks,
  taskAssignees: mockTaskAssignees,
  taskComments: [],
  taskSubmissions: [],
  notifications: [],
  activities: [],
  
  // UI State
  currentUserId: '1', // Default to John Doe
  selectedProject: null,
  editingProject: null,
  notificationCount: 0,
  
  // Actions
  setCurrentUser: (userId) => set({ currentUserId: userId }),
  setSelectedProject: (projectId) => set({ selectedProject: projectId }),
  setEditingProject: (projectId) => set({ editingProject: projectId }),
  
  // Project actions
  createProject: (input) => {
    const timestamp = new Date().toISOString();
    const newProject: Project = {
      id: Date.now().toString(),
      name: input.name,
      subtitle: input.subtitle,
      ownerId: get().currentUserId,
      createdAt: timestamp,
      updatedAt: timestamp,
      startDate: input.startDate,
      endDate: input.endDate,
      location: input.location,
      category: input.category,
      status: input.status ?? 'planning',
      budgetMin: input.budgetMin,
      budgetMax: input.budgetMax,
      currency: input.currency,
      calendarEventIds: input.calendarEventIds ?? []
    };
    
    const newMember: ProjectMember = {
      projectId: newProject.id,
      userId: get().currentUserId,
      role: 'owner',
      createdAt: timestamp
    };
    
    set(state => ({
      projects: [...state.projects, newProject],
      projectMembers: [...state.projectMembers, newMember]
    }));
    
    return newProject;
  },
  
  updateProject: (projectId, updates) => {
    set(state => ({
      projects: state.projects.map(p => 
        p.id === projectId 
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      )
    }));
  },
  
  deleteProject: (projectId) => {
    set(state => ({
      projects: state.projects.filter(p => p.id !== projectId),
      projectMembers: state.projectMembers.filter(pm => pm.projectId !== projectId),
      tasks: state.tasks.filter(t => t.projectId !== projectId),
      taskAssignees: state.taskAssignees.filter(ta => 
        !state.tasks.find(t => t.id === ta.taskId && t.projectId === projectId)
      )
    }));
  },
  
  addProjectMember: (projectId, userId, role) => {
    const newMember: ProjectMember = {
      projectId,
      userId,
      role,
      createdAt: new Date().toISOString()
    };
    
    set(state => ({
      projectMembers: [...state.projectMembers, newMember]
    }));
  },
  
  updateMemberRole: (projectId, userId, role) => {
    set(state => ({
      projectMembers: state.projectMembers.map(pm =>
        pm.projectId === projectId && pm.userId === userId
          ? { ...pm, role }
          : pm
      )
    }));
  },
  
  removeMember: (projectId, userId) => {
    set(state => ({
      projectMembers: state.projectMembers.filter(pm =>
        !(pm.projectId === projectId && pm.userId === userId)
      )
    }));
  },
  
  // Task actions
  createTask: (projectId, taskData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      projectId,
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      createdBy: get().currentUserId,
      dueDate: taskData.dueDate,
      progress: taskData.progress || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    set(state => ({
      tasks: [...state.tasks, newTask]
    }));
    
    // Notify relevant users
    const { projectMembers, users, addNotification } = get();
    const projectMemberIds = projectMembers
      .filter(pm => pm.projectId === projectId)
      .map(pm => pm.userId);
    
    const currentUser = users.find(u => u.id === get().currentUserId);
    
    projectMemberIds.forEach(userId => {
      if (userId !== get().currentUserId) {
        addNotification({
          userId,
          type: 'task_assigned',
          payload: {
            projectId,
            taskId: newTask.id,
            title: `New task: ${newTask.title}`,
            by: currentUser?.name || 'Unknown',
            message: `${currentUser?.name} created a new task`
          }
        });
      }
    });
    
    return newTask.id;
  },
  
  updateTask: (taskId, updates) => {
    const oldTask = get().tasks.find(t => t.id === taskId);
    set(state => ({
      tasks: state.tasks.map(t => 
        t.id === taskId 
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t
      )
    }));
    
    // Handle notifications for status changes
    if (updates.status && oldTask && oldTask.status !== updates.status) {
      const { taskAssignees, users, addNotification, currentUserId } = get();
      const assigneeIds = taskAssignees
        .filter(ta => ta.taskId === taskId)
        .map(ta => ta.userId);
      
      const currentUser = users.find(u => u.id === currentUserId);
      
      [...assigneeIds, oldTask.createdBy].forEach(userId => {
        if (userId !== currentUserId) {
          addNotification({
            userId,
            type: 'status_changed',
            payload: {
              taskId,
              title: `Task status updated: ${oldTask.title}`,
              by: currentUser?.name || 'Unknown',
              message: `Status changed from ${oldTask.status} to ${updates.status}`
            }
          });
        }
      });
    }
  },
  
  deleteTask: (taskId) => {
    set(state => ({
      tasks: state.tasks.filter(t => t.id !== taskId),
      taskAssignees: state.taskAssignees.filter(ta => ta.taskId !== taskId),
      taskComments: state.taskComments.filter(tc => tc.taskId !== taskId),
      taskSubmissions: state.taskSubmissions.filter(ts => ts.taskId !== taskId)
    }));
  },
  
  assignTask: (taskId, userIds) => {
    // Remove existing assignments
    set(state => ({
      taskAssignees: state.taskAssignees.filter(ta => ta.taskId !== taskId)
    }));
    
    // Add new assignments
    const newAssignments: TaskAssignee[] = userIds.map(userId => ({
      taskId,
      userId,
      assignedAt: new Date().toISOString()
    }));
    
    set(state => ({
      taskAssignees: [...state.taskAssignees, ...newAssignments]
    }));
    
    // Notify assigned users
    const { tasks, users, addNotification, currentUserId } = get();
    const task = tasks.find(t => t.id === taskId);
    const currentUser = users.find(u => u.id === currentUserId);
    
    if (task) {
      userIds.forEach(userId => {
        if (userId !== currentUserId) {
          addNotification({
            userId,
            type: 'task_assigned',
            payload: {
              taskId,
              title: `You were assigned to: ${task.title}`,
              by: currentUser?.name || 'Unknown',
              message: `${currentUser?.name} assigned you to a task`
            }
          });
        }
      });
    }
  },
  
  updateTaskProgress: (taskId, progress) => {
    get().updateTask(taskId, { progress });
  },
  
  updateTaskStatus: (taskId, status) => {
    get().updateTask(taskId, { status });
  },
  
  addTaskComment: (taskId, body) => {
    const newComment: TaskComment = {
      id: Date.now().toString(),
      taskId,
      userId: get().currentUserId,
      body,
      createdAt: new Date().toISOString()
    };
    
    set(state => ({
      taskComments: [...state.taskComments, newComment]
    }));
  },
  
  addTaskSubmission: (taskId, note, attachmentUrl) => {
    const newSubmission: TaskSubmission = {
      id: Date.now().toString(),
      taskId,
      submittedBy: get().currentUserId,
      note,
      attachmentUrl,
      createdAt: new Date().toISOString()
    };
    
    set(state => ({
      taskSubmissions: [...state.taskSubmissions, newSubmission]
    }));
    
    // Notify relevant users
    const { tasks, taskAssignees, users, addNotification, currentUserId } = get();
    const task = tasks.find(t => t.id === taskId);
    const assigneeIds = taskAssignees
      .filter(ta => ta.taskId === taskId)
      .map(ta => ta.userId);
    
    const currentUser = users.find(u => u.id === currentUserId);
    
    if (task) {
      [...assigneeIds, task.createdBy].forEach(userId => {
        if (userId !== currentUserId) {
          addNotification({
            userId,
            type: 'submission',
            payload: {
              taskId,
              title: `New submission for: ${task.title}`,
              by: currentUser?.name || 'Unknown',
              message: `${currentUser?.name} submitted work`
            }
          });
        }
      });
    }
  },
  
  // Notification actions
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    set(state => ({
      notifications: [...state.notifications, newNotification],
      notificationCount: state.notificationCount + 1
    }));
  },
  
  markNotificationRead: (notificationId) => {
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === notificationId
          ? { ...n, readAt: new Date().toISOString() }
          : n
      ),
      notificationCount: Math.max(0, state.notificationCount - 1)
    }));
  },
  
  clearNotifications: () => {
    set({ notifications: [], notificationCount: 0 });
  },
  
  // Computed getters
  getProjectsWithDetails: () => {
    const { projects, projectMembers, users, tasks, taskAssignees } = get();
    
    return projects.map(project => {
      const members = projectMembers
        .filter(pm => pm.projectId === project.id)
        .map(pm => ({
          ...pm,
          user: users.find(u => u.id === pm.userId)!
        }));
      
      const projectTasks = tasks.filter(t => t.projectId === project.id);
      const completedTasks = projectTasks.filter(t => t.status === 'done').length;
      const completionPercentage = projectTasks.length > 0 
        ? Math.round((completedTasks / projectTasks.length) * 100)
        : 0;
      
      const tasksWithDetails: TaskWithDetails[] = projectTasks.map(task => ({
        ...task,
        assignees: taskAssignees
          .filter(ta => ta.taskId === task.id)
          .map(ta => users.find(u => u.id === ta.userId)!)
          .filter(Boolean),
        creator: users.find(u => u.id === task.createdBy)!,
        submissions: get().taskSubmissions.filter(ts => ts.taskId === task.id),
        comments: get().taskComments.filter(tc => tc.taskId === task.id)
      }));
      
      return {
        ...project,
        owner: users.find(u => u.id === project.ownerId)!,
        members,
        tasks: tasksWithDetails,
        completionPercentage,
        openTasksCount: projectTasks.filter(t => t.status !== 'done').length
      };
    });
  },
  
  getProjectById: (id) => {
    return get().getProjectsWithDetails().find(p => p.id === id);
  },
  
  getTasksForProject: (projectId) => {
    const project = get().getProjectById(projectId);
    return project?.tasks || [];
  },
  
  getUserRole: (projectId, userId) => {
    const member = get().projectMembers.find(pm => 
      pm.projectId === projectId && pm.userId === userId
    );
    return member?.role || null;
  },
  
  getUnreadNotifications: () => {
    return get().notifications
      .filter(n => n.userId === get().currentUserId && !n.readAt)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}));