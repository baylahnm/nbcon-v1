/**
 * Theme System - Shared Store
 * 
 * Single source of truth for theme management across all roles.
 * This replaces the duplicated theme stores in each role directory.
 * 
 * Features:
 * - 10 theme presets with descriptive color names
 * - Automatic migration from legacy theme names
 * - Custom token overrides
 * - Persistent storage
 * - Import/export capabilities
 * - Randomize function for testing
 * 
 * @version 2.0.0
 * @status Production Ready
 * @updated January 21, 2025 - Theme name updates
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeState, ThemeMode, ThemePreset, ThemeTokenCategory } from '../theme/types';
import { THEME_TOKENS } from '../theme/tokens';
import { THEME_PRESETS, migrateLegacyTheme } from '../theme/presets';

/**
 * Shared Theme Store
 * 
 * Usage:
 * ```tsx
 * import { useThemeStore } from '@/shared/stores/theme';
 * 
 * function MyComponent() {
 *   const { preset, applyPreset } = useThemeStore();
 *   return <Button onClick={() => applyPreset('wazeer')}>Switch Theme</Button>;
 * }
 * ```
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // ========================================================================
      // STATE
      // ========================================================================
      mode: 'system',
      preset: 'wazeer', // Default theme: Wazeer (Saudi Heritage earth tones)
      custom: {},
      applied: {},

      // ========================================================================
      // ACTIONS
      // ========================================================================

      /**
       * Set theme mode (light/dark/system)
       * System mode auto-detects OS preference
       */
      setMode: (mode: ThemeMode) => {
        set({ mode });
        
        // Apply theme immediately based on mode
        const { preset } = get();
        
        if (mode === 'system') {
          // Detect OS preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const effectivePreset = prefersDark ? 'neon-green' : 'light-green';
          get().applyPreset(effectivePreset);
        } else if (mode === 'light') {
          get().applyPreset('light-green');
        } else if (mode === 'dark') {
          get().applyPreset('neon-green');
        } else {
          get().applyPreset(preset);
        }
      },

      /**
       * Apply a theme preset
       * Merges preset with custom token overrides
       */
      applyPreset: (preset: ThemePreset) => {
        const presetTokens = THEME_PRESETS[preset];
        const { custom } = get();
        
        // Merge preset with custom overrides
        const applied = { ...presetTokens, ...custom };
        
        // Apply to CSS variables on document root
        Object.entries(applied).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
        
        // Apply theme class to document for theme-specific CSS rules
        document.documentElement.className = preset;
        
        set({ preset, applied });
      },

      /**
       * Update a single token value
       * Creates a custom override that persists across preset changes
       */
      updateToken: (key: string, value: string) => {
        const { custom, preset } = get();
        const newCustom = { ...custom, [key]: value };
        
        // Apply immediately to DOM
        document.documentElement.style.setProperty(key, value);
        
        // Update applied tokens
        const applied = { ...THEME_PRESETS[preset], ...newCustom };
        
        set({ custom: newCustom, applied });
      },

      /**
       * Reset all tokens in a specific category
       * Removes custom overrides for the category, reverts to preset
       */
      resetSection: (category: ThemeTokenCategory) => {
        const { preset, custom } = get();
        const sectionTokens = THEME_TOKENS.filter(token => token.category === category);
        const newCustom = { ...custom };
        
        // Remove custom overrides for this section
        sectionTokens.forEach(token => {
          delete newCustom[token.key];
        });
        
        // Reapply preset with remaining custom overrides
        const applied = { ...THEME_PRESETS[preset], ...newCustom };
        Object.entries(applied).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
        
        set({ custom: newCustom, applied });
      },

      /**
       * Reset all custom token overrides
       * Reverts to pure preset
       */
      resetAll: () => {
        const { preset } = get();
        const applied = THEME_PRESETS[preset];
        
        // Apply preset tokens to DOM
        Object.entries(applied).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
        
        set({ custom: {}, applied });
      },

      /**
       * Import theme configuration
       * Useful for sharing themes or loading saved configurations
       */
      importTheme: (data) => {
        const { mode, preset, custom } = data;
        
        // Validate preset exists
        if (!THEME_PRESETS[preset]) {
          console.error(`Unknown preset: ${preset}`);
          return;
        }
        
        // Apply the imported theme
        const applied = { ...THEME_PRESETS[preset], ...custom };
        Object.entries(applied).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
        
        document.documentElement.className = preset;
        
        set({ mode, preset, custom, applied });
      },

      /**
       * Export current theme configuration
       * Returns JSON-serializable object
       */
      exportTheme: () => {
        const { mode, preset, custom } = get();
        return { mode, preset, custom };
      },

      /**
       * Randomize theme colors
       * Generates random accent colors while keeping backgrounds legible
       */
      randomize: () => {
        const { preset } = get();
        const randomCustom: Record<string, string> = {};
        
        // Randomize accent colors only (keep background/foreground legible)
        const accentTokens = THEME_TOKENS.filter(token => 
          token.category === 'primary' || 
          token.category === 'secondary' ||
          token.category === 'status'
        );
        
        accentTokens.forEach(token => {
          // Skip foreground colors (keep them readable)
          if (token.key.includes('-foreground')) return;
          
          if (token.key.includes('primary')) {
            const hue = Math.floor(Math.random() * 360);
            const saturation = 60 + Math.floor(Math.random() * 40);
            const lightness = 40 + Math.floor(Math.random() * 30);
            randomCustom[token.key] = `${hue} ${saturation}% ${lightness}%`;
          } else if (token.key.includes('success')) {
            const hue = 120 + Math.floor(Math.random() * 60);
            const saturation = 60 + Math.floor(Math.random() * 40);
            const lightness = 35 + Math.floor(Math.random() * 25);
            randomCustom[token.key] = `${hue} ${saturation}% ${lightness}%`;
          } else if (token.key.includes('warning')) {
            randomCustom[token.key] = `${30 + Math.floor(Math.random() * 30)} 100% 50%`;
          } else if (token.key.includes('destructive')) {
            randomCustom[token.key] = `${Math.floor(Math.random() * 30)} 70% 50%`;
          } else if (token.key.includes('info')) {
            randomCustom[token.key] = `${180 + Math.floor(Math.random() * 60)} 80% 50%`;
          }
        });
        
        // Apply randomized theme
        const applied = { ...THEME_PRESETS[preset], ...randomCustom };
        Object.entries(applied).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
        
        set({ custom: randomCustom, applied });
      },

      /**
       * Save theme to backend
       * TODO: Implement Supabase persistence when user profiles support theme storage
       */
      save: async () => {
        const { mode, preset, custom } = get();
        
        try {
          // TODO: Save to Supabase user preferences
          console.log('[Theme Store] Saving theme settings:', { mode, preset, customCount: Object.keys(custom).length });
          
          // For now, persistence is handled by zustand persist middleware
          return Promise.resolve();
        } catch (error) {
          console.error('[Theme Store] Failed to save theme:', error);
          throw error;
        }
      },
    }),
    {
      name: 'nbcon-theme-storage',
      version: 1,
      partialize: (state) => ({
        mode: state.mode,
        preset: state.preset,
        custom: state.custom,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Migrate legacy theme names to new names
          const migratedPreset = migrateLegacyTheme(state.preset);
          
          // Update state if migration occurred
          if (migratedPreset !== state.preset) {
            console.log('[Theme Store] Migrating theme:', state.preset, '→', migratedPreset);
            state.preset = migratedPreset;
          }
          
          // Apply the restored theme after hydration
          console.log('[Theme Store] Rehydrating theme:', state.preset);
          state.applyPreset(state.preset);
        }
      },
    }
  )
);

/**
 * Initialize theme on app load
 * Call this once in your app entry point (main.tsx or App.tsx)
 */
export const initializeTheme = () => {
  const store = useThemeStore.getState();
  
  // Migrate legacy theme if needed
  const migratedPreset = migrateLegacyTheme(store.preset);
  
  // Apply stored theme or default
  if (migratedPreset) {
    store.applyPreset(migratedPreset);
  } else {
    store.applyPreset('light-green');
  }
  
  // Listen for OS theme changes if in system mode
  if (store.mode === 'system') {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', (e) => {
      const effectivePreset = e.matches ? 'neon-green' : 'light-green';
      store.applyPreset(effectivePreset);
    });
  }
};

/**
 * Re-export for convenience
 */
export { THEME_PRESETS, THEME_METADATA } from '../theme/presets';
export { THEME_TOKENS } from '../theme/tokens';
export type { ThemeMode, ThemePreset, ThemeToken, ThemeTokenCategory } from '../theme/types';

