import { create } from 'zustand';
import { supabase } from '@/shared/supabase/client';

// Engineer interface matching UI needs
interface Engineer {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  title: string;
  specialty: string;
  experience_years: number;
  hourly_rate: number;
  avatar_url?: string;
  location_city?: string;
  bio?: string;
  sce_license?: string;
  is_verified: boolean;
  created_at: string;
}

interface EngineersStore {
  // State
  engineers: Engineer[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadEngineers: () => Promise<void>;
  clearError: () => void;
}

export const useEngineersStore = create<EngineersStore>((set, get) => ({
  // Initial state
  engineers: [],
  isLoading: false,
  error: null,

  // Load engineers from database
  loadEngineers: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // TODO: Regenerate Supabase types to include engineer_profiles table
      // For now, cast to any to bypass type checking
      const { data, error } = await (supabase as any)
        .from('engineer_profiles')
        .select(`
          *,
          profile:profiles!engineer_profiles_user_id_fkey(
            user_id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('[Engineers] Error loading engineers:', error);
        throw new Error(`Failed to load engineers: ${error.message}`);
      }
      
      // Transform to Engineer format
      const engineers: Engineer[] = (data || []).map((eng: any) => ({
        id: eng.id,
        user_id: eng.user_id,
        first_name: eng.profile?.first_name || 'Engineer',
        last_name: eng.profile?.last_name || '',
        title: eng.title || 'Engineer',
        specialty: eng.specialty || 'General Engineering',
        experience_years: eng.experience_years || 0,
        hourly_rate: Number(eng.hourly_rate) || 100,
        avatar_url: eng.profile?.avatar_url,
        location_city: eng.location_city,
        bio: eng.bio,
        sce_license: eng.sce_license,
        is_verified: eng.sce_verified || false,
        created_at: eng.created_at
      }));
      
      set({ 
        engineers, 
        isLoading: false 
      });
      
      console.log(`[Engineers] Loaded ${engineers.length} engineers`);
    } catch (error: any) {
      console.error('[Engineers] Exception loading engineers:', error);
      set({ 
        error: error.message || 'Failed to load engineers', 
        isLoading: false,
        engineers: [] 
      });
    }
  },

  // Clear error state
  clearError: () => set({ error: null }),
}));

