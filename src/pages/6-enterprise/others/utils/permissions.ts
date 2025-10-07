// Simple permissions utility for enterprise features
export const can = (action: string, resource: string, userRole?: string): boolean => {
  // For now, allow all actions for enterprise users
  // This can be expanded with proper role-based permissions later
  return true;
};

export const hasPermission = (permission: string, userRole?: string): boolean => {
  // For now, allow all permissions for enterprise users
  return true;
};

export const canModifyTask = (task: any, userRole?: string): boolean => {
  // For now, allow all task modifications for enterprise users
  return true;
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-800';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'Low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'In Progress':
      return 'bg-blue-100 text-blue-800';
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getRoleColor = (role: string): string => {
  switch (role) {
    case 'Project Manager':
      return 'bg-purple-100 text-purple-800';
    case 'Engineer':
      return 'bg-blue-100 text-blue-800';
    case 'Designer':
      return 'bg-green-100 text-green-800';
    case 'Reviewer':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
