// Core types for the Team Management System
export type ProjectRole = 'owner' | 'manager' | 'engineer' | 'client' | 'viewer';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationType = 'task_assigned' | 'task_updated' | 'status_changed' | 'submission' | 'mention';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  specialty: string;
  yearsOfExperience: number;
  company: string;
  phoneNumber: string;
  availabilityStatus: 'busy' | 'free';
  isOnline: boolean;
}

export interface Project {
  id: string;
  name: string;
  subtitle?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  projectId: string;
  userId: string;
  role: ProjectRole;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdBy: string;
  dueDate?: string;
  progress: number; // 0-100
  createdAt: string;
  updatedAt: string;
}

export interface TaskAssignee {
  taskId: string;
  userId: string;
  assignedAt: string;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  submittedBy: string;
  note?: string;
  attachmentUrl?: string;
  createdAt: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  body: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  payload: {
    projectId?: string;
    taskId?: string;
    title: string;
    by: string;
    message: string;
  };
  readAt?: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  projectId: string;
  taskId?: string;
  userId: string;
  type: 'task_created' | 'task_updated' | 'status_changed' | 'submission_added' | 'comment_added' | 'user_assigned';
  data: Record<string, any>;
  createdAt: string;
}

// Extended types with relationships
export interface TaskWithDetails extends Task {
  assignees: User[];
  creator: User;
  submissions: TaskSubmission[];
  comments: TaskComment[];
}

export interface ProjectWithDetails extends Project {
  owner: User;
  members: (ProjectMember & { user: User })[];
  tasks: TaskWithDetails[];
  completionPercentage: number;
  openTasksCount: number;
}