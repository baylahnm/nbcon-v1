/**
 * Shared Auth Types
 * 
 * Centralized authentication and authorization type definitions
 * used across all portals and components.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import type { SubscriptionTier } from './subscription';

export type UserRole = 'engineer' | 'client' | 'enterprise' | 'admin';

export const ROLE_BASE_PATHS: Record<UserRole, string> = {
  engineer: '/engineer',
  client: '/free',
  enterprise: '/enterprise',
  admin: '/admin',
};

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  sceNumber?: string;
  company?: string;
  location: string;
  phone: string;
  language: 'ar' | 'en';
  avatar?: string;
  email_confirmed_at?: string | null;
  source?: 'mock' | 'supabase';
  phone_confirmed_at?: string | null;
}

export interface UserPermissions {
  canAccessAITools: boolean;
  canManageProjects: boolean;
  canPostJobs: boolean;
  canAccessFinance: boolean;
  canAccessAnalytics: boolean;
  canManageTeams: boolean;
  subscriptionTier?: SubscriptionTier;
}

