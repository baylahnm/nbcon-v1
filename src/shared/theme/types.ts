/**
 * Theme System - Type Definitions
 * 
 * Shared types for the unified theme system across all roles.
 * 
 * @version 1.0.0
 * @status Production Ready
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export type ThemePreset = 
  | 'light-green' 
  | 'neon-green' 
  | 'dark-rainbow'
  | 'wazeer' 
  | 'sunset-orange' 
  | 'ocean-blue' 
  | 'pink-magenta' 
  | 'cyan-lagoon' 
  | 'forest-night' 
  | 'purple-violet' 
  | 'sea-purple';

// Legacy theme names for backward compatibility
export type LegacyThemePreset = 
  | 'light' 
  | 'dark' 
  | 'sunset' 
  | 'abstract' 
  | 'nika' 
  | 'lagoon' 
  | 'dark-nature' 
  | 'full-gradient';

export type ThemeTokenCategory = 
  | 'core' 
  | 'card' 
  | 'primary' 
  | 'secondary' 
  | 'status' 
  | 'ui' 
  | 'sidebar';

export interface ThemeToken {
  key: string;
  value: string;
  description: string;
  category: ThemeTokenCategory;
}

export interface ThemeState {
  mode: ThemeMode;
  preset: ThemePreset;
  custom: Record<string, string>;
  applied: Record<string, string>;
  
  // Actions
  setMode: (mode: ThemeMode) => void;
  applyPreset: (preset: ThemePreset) => void;
  updateToken: (key: string, value: string) => void;
  resetSection: (category: ThemeTokenCategory) => void;
  resetAll: () => void;
  importTheme: (data: { mode: ThemeMode; preset: ThemePreset; custom: Record<string, string> }) => void;
  exportTheme: () => { mode: ThemeMode; preset: ThemePreset; custom: Record<string, string> };
  randomize: () => void;
  save: () => Promise<void>;
}

export interface ThemeExport {
  version: string;
  mode: ThemeMode;
  preset: ThemePreset;
  custom: Record<string, string>;
  exportedAt: string;
}

