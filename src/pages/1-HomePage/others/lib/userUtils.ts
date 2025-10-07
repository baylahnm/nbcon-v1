import { UserProfile } from '../../stores/auth';

/**
 * Get the user's display name from profile data
 */
export const getUserDisplayName = (profile: UserProfile | null): string => {
  if (!profile) return 'User';
  
  // Try first_name and last_name first (from profile data)
  if (profile.first_name && profile.last_name) {
    return `${profile.first_name} ${profile.last_name}`;
  }
  
  if (profile.first_name) {
    return profile.first_name;
  }
  
  // Fallback to name field
  if (profile.name) {
    return profile.name;
  }
  
  // Last resort - use email prefix
  if (profile.email) {
    return profile.email.split('@')[0];
  }
  
  return 'User';
};

/**
 * Get the user's initials from profile data
 */
export const getUserInitials = (profile: UserProfile | null): string => {
  if (!profile) return 'U';
  
  const firstName = profile.first_name || '';
  const lastName = profile.last_name || '';
  
  if (firstName && lastName) {
    return `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
  }
  
  if (firstName) {
    return firstName.slice(0, 2).toUpperCase();
  }
  
  if (profile.name) {
    const nameParts = profile.name.split(' ').filter(Boolean);
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return profile.name.slice(0, 2).toUpperCase();
  }
  
  if (profile.email) {
    const emailPrefix = profile.email.split('@')[0];
    return emailPrefix.slice(0, 2).toUpperCase();
  }
  
  return 'U';
};

/**
 * Get the user's role display name
 */
export const getUserRoleDisplay = (profile: UserProfile | null): string => {
  if (!profile?.role) return 'User';
  
  const roleMap: Record<string, string> = {
    engineer: 'Engineer',
    client: 'Client',
    enterprise: 'Enterprise',
    admin: 'Administrator'
  };
  
  return roleMap[profile.role] || profile.role;
};

/**
 * Get the user's profile image URL
 */
export const getUserProfileImage = (profile: UserProfile | null): string | null => {
  if (!profile) return null;
  
  // Try avatar_url first (from profile data)
  if (profile.avatar_url) {
    return profile.avatar_url;
  }
  
  // Fallback to avatar field
  if (profile.avatar) {
    return profile.avatar;
  }
  
  return null;
};
