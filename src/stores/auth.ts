import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STORAGE_KEY = 'nbcon_user';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: 'engineer' | 'client' | 'enterprise' | 'admin';
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

export interface EngineerProfileDetails {
  specializations?: string[];
  years_experience?: number;
  hourly_rate?: number;
  daily_rate?: number;
  availability_status?: string;
  sce_license_number?: string;
}

export interface UserProfile extends AuthenticatedUser {
  user_id?: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  location_city?: string;
  location_region?: string;
  avatar_url?: string;
  preferred_language?: string;
  theme_preference?: string;
  rtl_enabled?: boolean;
  engineer_profiles?: EngineerProfileDetails | null;
  created_at?: string;
  updated_at?: string;
}


const normalizeUser = (user: AuthenticatedUser): AuthenticatedUser => ({
  ...user,
  source: user.source ?? 'mock',
});

interface AuthState {
  user: AuthenticatedUser | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: AuthenticatedUser | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  login: (user: AuthenticatedUser) => void;
  logout: () => void;
  signOut: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  updateUser: (updates: Partial<AuthenticatedUser>) => void;
}

const safeLocalStorageSet = (user: AuthenticatedUser | null) => {
  if (typeof window === 'undefined') return;
  if (user) {
    const normalized = normalizeUser(user);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};

const createProfileFromUser = (user: AuthenticatedUser): UserProfile => {
  const nameParts = (user.name || '').trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ')
    || undefined;
  const locationParts = (user.location || '').split(',').map(part => part.trim()).filter(Boolean);
  const city = locationParts[0];
  const region = locationParts.slice(1).join(', ') || undefined;

  return {
    ...user,
    user_id: user.id,
    first_name: firstName || user.name,
    last_name: lastName,
    location_city: city,
    location_region: region,
    avatar_url: user.avatar,
    preferred_language: user.language,
    theme_preference: 'light',
    rtl_enabled: false,
    engineer_profiles: null,
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: true,
      isInitialized: false,

      setUser: (user) => {
        if (user) {
          const normalizedUser = normalizeUser(user);
          const profile = createProfileFromUser(normalizedUser);
          set({
            user: normalizedUser,
            profile,
            isAuthenticated: true,
          });
          safeLocalStorageSet(normalizedUser);
        } else {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
          });
          safeLocalStorageSet(null);
        }
      },

      setProfile: (profile) => set({ profile }),

      login: (user) => {
        const normalizedUser = normalizeUser(user);
        const profile = createProfileFromUser(normalizedUser);
        set({
          user: normalizedUser,
          profile,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
        safeLocalStorageSet(normalizedUser);
      },

      logout: () => {
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        });
        safeLocalStorageSet(null);
      },

      signOut: async () => {
        get().logout();
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setInitialized: (initialized) => set({ isInitialized: initialized }),

      updateUser: (updates) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const mergedUser: AuthenticatedUser = { ...currentUser, ...updates };
        const normalizedUser = normalizeUser(mergedUser);
        const currentProfile = get().profile;
        const baseProfile = createProfileFromUser(normalizedUser);
        const updatedProfile: UserProfile = {
          ...baseProfile,
          ...currentProfile,
          ...updates,
        };

        set({
          user: normalizedUser,
          profile: updatedProfile,
          isAuthenticated: true,
        });
        safeLocalStorageSet(normalizedUser);
      },
    }),
    {
      name: 'nbcon-auth-storage',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
        isInitialized: state.isInitialized,
      }),
    }
  )
);

export const getStoredUser = (): AuthenticatedUser | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }
    const parsed = JSON.parse(stored) as AuthenticatedUser;
    return normalizeUser(parsed);
  } catch {
    return null;
  }
};

export const clearStoredUser = (): void => {
  safeLocalStorageSet(null);
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('nbcon-auth-storage');
  }
};

export const isAuthenticated = (): boolean => {
  const user = getStoredUser();
  return !!(user && user.isVerified);
};

export const getUserRole = (): string | null => {
  const user = getStoredUser();
  return user?.role || null;
};

export const requiresAuth = (path: string): boolean => {
  const publicPaths = ['/', '/home', '/auth', '/auth/email', '/auth/phone', '/auth/verify', '/auth/role', '/auth/profile'];
  return !publicPaths.includes(path);
};

export const initializeAuth = () => {
  const { setUser, setLoading, setInitialized } = useAuthStore.getState();

  const syncFromStorage = () => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    setLoading(false);
    setInitialized(true);
  };

  if (typeof window === 'undefined') {
    syncFromStorage();
    return () => {};
  }

  setLoading(true);
  syncFromStorage();

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      syncFromStorage();
    }
  };

  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener('storage', handleStorage);
  };
};
