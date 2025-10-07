/**
 * Refactored examples showing how to use Option in existing codebase patterns
 */

import { Option } from './Option';

// BEFORE: Traditional null checking in TaskDetailDialog
export function oldTaskValidation(task: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!task) {
    errors.push('Task is required');
    return { isValid: false, errors };
  }
  
  if (!task.title || task.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (task.estimatedHours && isNaN(Number(task.estimatedHours))) {
    errors.push('Estimated hours must be a valid number');
  }
  
  return { isValid: errors.length === 0, errors };
}

// AFTER: Using Option for cleaner validation
export function newTaskValidation(task: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const taskOption = Option.ofNullable(task);
  
  if (taskOption.isEmpty()) {
    errors.push('Task is required');
    return { isValid: false, errors };
  }
  
  const taskData = taskOption.get();
  
  // Validate title
  Option.ofNullable(taskData.title)
    .filter(title => title.trim().length > 0)
    .ifPresentOrElse(
      () => {}, // Valid title
      () => errors.push('Title is required')
    );
  
  // Validate estimated hours
  Option.ofNullable(taskData.estimatedHours)
    .filter(hours => !isNaN(Number(hours)))
    .ifPresentOrElse(
      () => {}, // Valid hours
      () => errors.push('Estimated hours must be a valid number')
    );
  
  return { isValid: errors.length === 0, errors };
}

// BEFORE: Traditional error handling in CreateJob
export async function oldCreateJob(jobData: any) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData)
      .select()
      .single();

    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

// AFTER: Using Option for cleaner error handling
export async function newCreateJob(jobData: any): Promise<Option<any>> {
  return Option.fromPromise(
    supabase
      .from('jobs')
      .insert(jobData)
      .select()
      .single()
      .then(({ data, error }) => {
        if (error) throw error;
        return data;
      })
  );
}

// Usage example:
export async function handleJobCreation(jobData: any) {
  const result = await newCreateJob(jobData);
  
  result.ifPresentOrElse(
    (data) => {
      toast({
        title: "Job Created Successfully!",
        description: "Your job has been posted.",
      });
      navigate(`/client/myprojects`);
    },
    () => {
      toast({
        title: "Error",
        description: "Failed to create job. Please try again.",
        variant: "destructive"
      });
    }
  );
}

// BEFORE: Complex nested property access
export function oldGetUserInitials(user: any): string {
  if (user && user.profile) {
    const firstName = user.profile.firstName;
    const lastName = user.profile.lastName;
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
  }
  return user?.email?.charAt(0).toUpperCase() || 'U';
}

// AFTER: Using Option for safe property access
export function newGetUserInitials(user: any): string {
  return Option.ofNullable(user)
    .flatMap(u => Option.ofNullable(u.profile))
    .map(profile => `${profile.firstName?.charAt(0) || ''}${profile.lastName?.charAt(0) || ''}`)
    .filter(initials => initials.length > 0)
    .map(initials => initials.toUpperCase())
    .orElseGet(() => 
      Option.ofNullable(user?.email)
        .map(email => email.charAt(0).toUpperCase())
        .orElse('U')
    );
}

// BEFORE: Manual form data processing
export function oldProcessFormData(formData: any) {
  const processed = {
    title: formData.title?.trim() || '',
    description: formData.description?.trim() || '',
    budget: formData.budget ? parseFloat(formData.budget) : null,
    estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : null,
  };
  
  const errors = [];
  if (!processed.title) errors.push('Title is required');
  if (processed.budget && isNaN(processed.budget)) errors.push('Budget must be a valid number');
  if (processed.estimatedHours && isNaN(processed.estimatedHours)) errors.push('Estimated hours must be a valid number');
  
  return { processed, errors };
}

// AFTER: Using Option for form processing
export function newProcessFormData(formData: any) {
  const title = Option.ofNullable(formData.title)
    .map(t => t.trim())
    .filter(t => t.length > 0);
  
  const description = Option.ofNullable(formData.description)
    .map(d => d.trim())
    .orElse('');
  
  const budget = Option.ofNullable(formData.budget)
    .filter(b => !isNaN(Number(b)))
    .map(b => parseFloat(b));
  
  const estimatedHours = Option.ofNullable(formData.estimatedHours)
    .filter(h => !isNaN(Number(h)))
    .map(h => parseInt(h));
  
  const errors: string[] = [];
  
  if (title.isEmpty()) errors.push('Title is required');
  
  return {
    processed: {
      title: title.orElse(''),
      description,
      budget: budget.orElse(null),
      estimatedHours: estimatedHours.orElse(null),
    },
    errors,
    isValid: errors.length === 0
  };
}

// BEFORE: Complex conditional logic
export function oldGetTaskStatus(task: any): string {
  if (task) {
    if (task.completed) {
      return 'completed';
    } else if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const now = new Date();
      if (dueDate < now) {
        return 'overdue';
      } else {
        return 'pending';
      }
    } else {
      return 'pending';
    }
  }
  return 'unknown';
}

// AFTER: Using Option for cleaner conditional logic
export function newGetTaskStatus(task: any): string {
  return Option.ofNullable(task)
    .map(t => {
      if (t.completed) return 'completed';
      
      return Option.ofNullable(t.dueDate)
        .map(dueDate => {
          const due = new Date(dueDate);
          const now = new Date();
          return due < now ? 'overdue' : 'pending';
        })
        .orElse('pending');
    })
    .orElse('unknown');
}
