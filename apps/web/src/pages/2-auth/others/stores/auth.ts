/**
 * Auth Store for apps/web
 * 
 * Re-export wrapper for root src auth store.
 * In tests, this module is mocked via vitest.
 * 
 * Phase D: Testing & Documentation
 */

// In production, this should resolve to the root src auth store
// For now, we export a type-compatible interface that can be mocked
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role?: 'engineer' | 'client' | 'enterprise' | 'admin';
  is_admin?: boolean;
  isVerified: boolean;
  sceNumber?: string;
  company?: string;
  location: string;
  phone: string;
  language: 'ar' | 'en';
  avatar?: string;
  subscriptionTier?: string;
  subscription_tier?: string;
  subscriptionStatus?: string;
  [key: string]: any;
}

export interface UserProfile extends AuthenticatedUser {
  user_id?: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  [key: string]: any;
}

interface AuthState {
  user: AuthenticatedUser | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser?: (user: AuthenticatedUser | null) => void;
  setProfile?: (profile: UserProfile | null) => void;
  login?: (user: AuthenticatedUser) => void;
  logout?: () => void;
  signOut?: () => Promise<void>;
}

// Minimal store implementation - in production this should import from root src
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, profile: null, isAuthenticated: false }),
      signOut: async () => {
        set({ user: null, profile: null, isAuthenticated: false });
      },
    }),
    { name: 'nbcon_auth' }
  )
);
