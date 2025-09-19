import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useTheme } from 'next-themes';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemePreset = 'light' | 'dark' | 'wazeer' | 'sunset' | 'abstract' | 'dotted-indigo' | 'lagoon' | 'dark-nature' | 'full-gradient' | 'sea-purple';

export interface ThemeToken {
  key: string;
  value: string;
  description: string;
  category: 'core' | 'card' | 'primary' | 'secondary' | 'status' | 'ui' | 'sidebar';
}

export interface ThemeState {
  mode: ThemeMode;
  preset: ThemePreset;
  custom: Record<string, string>;
  applied: Record<string, string>;
  isOrgLocked: boolean;
  orgDefault: {
    preset: ThemePreset;
    custom: Record<string, string>;
  } | null;
  
  // Actions
  setMode: (mode: ThemeMode) => void;
  applyPreset: (preset: ThemePreset) => void;
  updateToken: (key: string, value: string) => void;
  resetSection: (category: string) => void;
  resetAll: () => void;
  importTheme: (data: { mode: ThemeMode; preset: ThemePreset; custom: Record<string, string> }) => void;
  exportTheme: () => { mode: ThemeMode; preset: ThemePreset; custom: Record<string, string> };
  randomize: () => void;
  save: () => Promise<void>;
  setOrgDefault: (preset: ThemePreset, custom: Record<string, string>) => Promise<void>;
  lockOrgTheme: (locked: boolean) => Promise<void>;
}

// Default theme tokens based on your CSS variables
export const THEME_TOKENS: ThemeToken[] = [
  // Core
  { key: '--background', value: '0 0% 100%', description: 'Main background color', category: 'core' },
  { key: '--foreground', value: '0 0% 6%', description: 'Main text color', category: 'core' },
  
  // Card/Popover
  { key: '--card', value: '0 0% 94%', description: 'Card background', category: 'card' },
  { key: '--card-foreground', value: '0 0% 6%', description: 'Card text color', category: 'card' },
  { key: '--popover', value: '0 0% 100%', description: 'Popover background', category: 'card' },
  { key: '--popover-foreground', value: '0 0% 6%', description: 'Popover text color', category: 'card' },
  
  // Primary
  { key: '--primary', value: '142 65% 47%', description: 'Primary brand color', category: 'primary' },
  { key: '--primary-foreground', value: '0 0% 100%', description: 'Primary text color', category: 'primary' },
  { key: '--primary-light', value: '142 60% 57%', description: 'Light primary variant', category: 'primary' },
  { key: '--primary-dark', value: '142 70% 37%', description: 'Dark primary variant', category: 'primary' },
  
  // Secondary/Muted/Accent
  { key: '--secondary', value: '0 0% 94%', description: 'Secondary background', category: 'secondary' },
  { key: '--secondary-foreground', value: '0 0% 6%', description: 'Secondary text color', category: 'secondary' },
  { key: '--muted', value: '0 0% 94%', description: 'Muted background', category: 'secondary' },
  { key: '--muted-foreground', value: '0 0% 45%', description: 'Muted text color', category: 'secondary' },
  { key: '--accent', value: '0 0% 94%', description: 'Accent background', category: 'secondary' },
  { key: '--accent-foreground', value: '0 0% 6%', description: 'Accent text color', category: 'secondary' },
  
  // Status
  { key: '--success', value: '156 68% 37%', description: 'Success color', category: 'status' },
  { key: '--success-foreground', value: '0 0% 100%', description: 'Success text color', category: 'status' },
  { key: '--warning', value: '32 100% 42%', description: 'Warning color', category: 'status' },
  { key: '--warning-foreground', value: '0 0% 100%', description: 'Warning text color', category: 'status' },
  { key: '--destructive', value: '4 65% 48%', description: 'Destructive color', category: 'status' },
  { key: '--destructive-foreground', value: '0 0% 100%', description: 'Destructive text color', category: 'status' },
  { key: '--info', value: '217 92% 55%', description: 'Info color', category: 'status' },
  { key: '--info-foreground', value: '0 0% 100%', description: 'Info text color', category: 'status' },
  
  // UI
  { key: '--border', value: '0 0% 90%', description: 'Border color', category: 'ui' },
  { key: '--input', value: '0 0% 90%', description: 'Input border color', category: 'ui' },
  { key: '--ring', value: '142 65% 47%', description: 'Focus ring color', category: 'ui' },
  
  // Sidebar
  { key: '--sidebar-background', value: '0 0% 94%', description: 'Sidebar background', category: 'sidebar' },
  { key: '--sidebar-foreground', value: '0 0% 6%', description: 'Sidebar text color', category: 'sidebar' },
  { key: '--sidebar-primary', value: '142 65% 47%', description: 'Sidebar primary color', category: 'sidebar' },
  { key: '--sidebar-primary-foreground', value: '0 0% 100%', description: 'Sidebar primary text color', category: 'sidebar' },
  { key: '--sidebar-accent', value: '0 0% 90%', description: 'Sidebar accent color', category: 'sidebar' },
  { key: '--sidebar-accent-foreground', value: '0 0% 6%', description: 'Sidebar accent text color', category: 'sidebar' },
  { key: '--sidebar-border', value: '0 0% 90%', description: 'Sidebar border color', category: 'sidebar' },
  { key: '--sidebar-ring', value: '142 65% 47%', description: 'Sidebar focus ring color', category: 'sidebar' },
];

// Preset theme configurations
export const THEME_PRESETS: Record<ThemePreset, Record<string, string>> = {
  light: {
    '--background': '0 0% 100%',
    '--foreground': '0 0% 9%',
    '--card': '0 0% 100%',
    '--card-foreground': '0 0% 9%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '0 0% 9%',
    '--primary': '142 65% 47%',
    '--primary-foreground': '0 0% 100%',
    '--primary-light': '142 60% 57%',
    '--primary-dark': '142 70% 37%',
    '--secondary': '0 0% 96%',
    '--secondary-foreground': '0 0% 9%',
    '--muted': '0 0% 96%',
    '--muted-foreground': '0 0% 45%',
    '--accent': '0 0% 96%',
    '--accent-foreground': '0 0% 9%',
    '--success': '156 68% 37%',
    '--success-foreground': '0 0% 100%',
    '--warning': '32 100% 42%',
    '--warning-foreground': '0 0% 100%',
    '--destructive': '4 65% 48%',
    '--destructive-foreground': '0 0% 100%',
    '--info': '217 92% 55%',
    '--info-foreground': '0 0% 100%',
    '--border': '0 0% 90%',
    '--input': '0 0% 90%',
    '--ring': '142 65% 47%',
    '--sidebar-background': '0 0% 98%',
    '--sidebar-foreground': '0 0% 9%',
    '--sidebar-primary': '142 65% 47%',
    '--sidebar-primary-foreground': '0 0% 100%',
    '--sidebar-accent': '0 0% 96%',
    '--sidebar-accent-foreground': '0 0% 9%',
    '--sidebar-border': '0 0% 90%',
    '--sidebar-ring': '142 65% 47%',
  },
  dark: {
    '--background': '0 0% 3%',
    '--foreground': '0 0% 95%',
    '--card': '0 0% 6%',
    '--card-foreground': '0 0% 95%',
    '--popover': '0 0% 6%',
    '--popover-foreground': '0 0% 95%',
    '--primary': '142 65% 47%',
    '--primary-foreground': '0 0% 100%',
    '--primary-light': '142 60% 57%',
    '--primary-dark': '142 70% 37%',
    '--secondary': '0 0% 6%',
    '--secondary-foreground': '0 0% 95%',
    '--muted': '0 0% 6%',
    '--muted-foreground': '0 0% 65%',
    '--accent': '0 0% 6%',
    '--accent-foreground': '0 0% 95%',
    '--success': '156 68% 37%',
    '--success-foreground': '0 0% 100%',
    '--warning': '32 100% 42%',
    '--warning-foreground': '0 0% 100%',
    '--destructive': '4 65% 48%',
    '--destructive-foreground': '0 0% 100%',
    '--info': '217 92% 55%',
    '--info-foreground': '0 0% 100%',
    '--border': '0 0% 15%',
    '--input': '0 0% 15%',
    '--ring': '142 65% 47%',
    '--sidebar-background': '0 0% 3%',
    '--sidebar-foreground': '0 0% 95%',
    '--sidebar-primary': '142 65% 47%',
    '--sidebar-primary-foreground': '0 0% 100%',
    '--sidebar-accent': '0 0% 6%',
    '--sidebar-accent-foreground': '0 0% 95%',
    '--sidebar-border': '0 0% 15%',
    '--sidebar-ring': '142 65% 47%',
  },
  wazeer: {
    '--background': '0 0% 100%',
    '--foreground': '160 30% 25%',
    '--card': '30 15% 92%',
    '--card-foreground': '20 25% 35%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '160 30% 25%',
    '--primary': '160 30% 25%',
    '--primary-foreground': '0 0% 100%',
    '--primary-light': '160 25% 35%',
    '--primary-dark': '160 35% 15%',
    '--secondary': '20 25% 35%',
    '--secondary-foreground': '0 0% 100%',
    '--muted': '30 15% 92%',
    '--muted-foreground': '20 25% 35%',
    '--accent': '30 15% 92%',
    '--accent-foreground': '160 30% 25%',
    '--success': '160 30% 25%',
    '--success-foreground': '0 0% 100%',
    '--warning': '32 100% 42%',
    '--warning-foreground': '0 0% 100%',
    '--destructive': '4 65% 48%',
    '--destructive-foreground': '0 0% 100%',
    '--info': '217 92% 55%',
    '--info-foreground': '0 0% 100%',
    '--border': '30 15% 80%',
    '--input': '30 15% 80%',
    '--ring': '160 30% 25%',
    '--sidebar-background': '30 15% 92%',
    '--sidebar-foreground': '20 25% 35%',
    '--sidebar-primary': '160 30% 25%',
    '--sidebar-primary-foreground': '0 0% 100%',
    '--sidebar-accent': '160 30% 25%',
    '--sidebar-accent-foreground': '0 0% 100%',
    '--sidebar-border': '30 15% 80%',
    '--sidebar-ring': '160 30% 25%',
  },
  sunset: {
    '--background': '0 0% 100%',
    '--foreground': '20 15% 20%',
    '--card': '25 20% 95%',
    '--card-foreground': '20 15% 20%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '20 15% 20%',
    '--primary': '15 85% 50%',
    '--primary-foreground': '0 0% 100%',
    '--primary-light': '15 80% 60%',
    '--primary-dark': '15 90% 40%',
    '--secondary': '25 20% 90%',
    '--secondary-foreground': '20 15% 20%',
    '--muted': '25 20% 95%',
    '--muted-foreground': '20 15% 50%',
    '--accent': '25 20% 90%',
    '--accent-foreground': '20 15% 20%',
    '--success': '120 60% 40%',
    '--warning': '35 100% 50%',
    '--destructive': '0 70% 50%',
    '--info': '200 80% 50%',
    '--border': '25 20% 85%',
    '--input': '25 20% 85%',
    '--ring': '15 85% 50%',
    '--sidebar-background': '25 20% 95%',
    '--sidebar-foreground': '20 15% 20%',
    '--sidebar-primary': '15 85% 50%',
    '--sidebar-accent': '25 20% 90%',
    '--sidebar-border': '25 20% 85%',
    '--sidebar-ring': '15 85% 50%',
  },
  abstract: {
    '--background': '0 0% 100%',
    '--foreground': '280 20% 20%',
    '--card': '280 15% 95%',
    '--card-foreground': '280 20% 20%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '280 20% 20%',
    '--primary': '280 60% 50%',
    '--primary-foreground': '0 0% 100%',
    '--primary-light': '280 55% 60%',
    '--primary-dark': '280 65% 40%',
    '--secondary': '280 15% 90%',
    '--secondary-foreground': '280 20% 20%',
    '--muted': '280 15% 95%',
    '--muted-foreground': '280 20% 50%',
    '--accent': '280 15% 90%',
    '--accent-foreground': '280 20% 20%',
    '--success': '120 60% 40%',
    '--warning': '35 100% 50%',
    '--destructive': '0 70% 50%',
    '--info': '200 80% 50%',
    '--border': '280 15% 85%',
    '--input': '280 15% 85%',
    '--ring': '280 60% 50%',
    '--sidebar-background': '280 15% 95%',
    '--sidebar-foreground': '280 20% 20%',
    '--sidebar-primary': '280 60% 50%',
    '--sidebar-accent': '280 15% 90%',
    '--sidebar-border': '280 15% 85%',
    '--sidebar-ring': '280 60% 50%',
  },
  'dotted-indigo': {
    '--background': '0 0% 100%',
    '--foreground': '240 20% 20%',
    '--card': '240 15% 95%',
    '--card-foreground': '240 20% 20%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '240 20% 20%',
    '--primary': '240 60% 50%',
    '--primary-foreground': '0 0% 100%',
    '--primary-light': '240 55% 60%',
    '--primary-dark': '240 65% 40%',
    '--secondary': '240 15% 90%',
    '--secondary-foreground': '240 20% 20%',
    '--muted': '240 15% 95%',
    '--muted-foreground': '240 20% 50%',
    '--accent': '240 15% 90%',
    '--accent-foreground': '240 20% 20%',
    '--success': '120 60% 40%',
    '--warning': '35 100% 50%',
    '--destructive': '0 70% 50%',
    '--info': '200 80% 50%',
    '--border': '240 15% 85%',
    '--input': '240 15% 85%',
    '--ring': '240 60% 50%',
    '--sidebar-background': '240 15% 95%',
    '--sidebar-foreground': '240 20% 20%',
    '--sidebar-primary': '240 60% 50%',
    '--sidebar-accent': '240 15% 90%',
    '--sidebar-border': '240 15% 85%',
    '--sidebar-ring': '240 60% 50%',
  },
  lagoon: {
    '--background': '0 0% 100%',
    '--foreground': '180 20% 20%',
    '--card': '180 15% 95%',
    '--card-foreground': '180 20% 20%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '180 20% 20%',
    '--primary': '180 60% 50%',
    '--primary-foreground': '0 0% 100%',
    '--primary-light': '180 55% 60%',
    '--primary-dark': '180 65% 40%',
    '--secondary': '180 15% 90%',
    '--secondary-foreground': '180 20% 20%',
    '--muted': '180 15% 95%',
    '--muted-foreground': '180 20% 50%',
    '--accent': '180 15% 90%',
    '--accent-foreground': '180 20% 20%',
    '--success': '120 60% 40%',
    '--warning': '35 100% 50%',
    '--destructive': '0 70% 50%',
    '--info': '200 80% 50%',
    '--border': '180 15% 85%',
    '--input': '180 15% 85%',
    '--ring': '180 60% 50%',
    '--sidebar-background': '180 15% 95%',
    '--sidebar-foreground': '180 20% 20%',
    '--sidebar-primary': '180 60% 50%',
    '--sidebar-accent': '180 15% 90%',
    '--sidebar-border': '180 15% 85%',
    '--sidebar-ring': '180 60% 50%',
  },
  'dark-nature': {
    '--background': '0 0% 5%',
    '--foreground': '120 20% 90%',
    '--card': '120 10% 10%',
    '--card-foreground': '120 20% 90%',
    '--popover': '120 10% 10%',
    '--popover-foreground': '120 20% 90%',
    '--primary': '120 60% 40%',
    '--primary-foreground': '0 0% 100%',
    '--primary-light': '120 55% 50%',
    '--primary-dark': '120 65% 30%',
    '--secondary': '120 10% 15%',
    '--secondary-foreground': '120 20% 90%',
    '--muted': '120 10% 10%',
    '--muted-foreground': '120 20% 60%',
    '--accent': '120 10% 15%',
    '--accent-foreground': '120 20% 90%',
    '--success': '120 60% 40%',
    '--warning': '35 100% 50%',
    '--destructive': '0 70% 50%',
    '--info': '200 80% 50%',
    '--border': '120 10% 15%',
    '--input': '120 10% 15%',
    '--ring': '120 60% 40%',
    '--sidebar-background': '0 0% 5%',
    '--sidebar-foreground': '120 20% 90%',
    '--sidebar-primary': '120 60% 40%',
    '--sidebar-accent': '120 10% 15%',
    '--sidebar-border': '120 10% 15%',
    '--sidebar-ring': '120 60% 40%',
  },
  'full-gradient': {
    '--background': '0 0% 100%',
    '--foreground': '0 0% 20%',
    '--card': '0 0% 95%',
    '--card-foreground': '0 0% 20%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '0 0% 20%',
    '--primary': '270 100% 60%',
    '--primary-foreground': '0 0% 100%',
    '--primary-light': '270 95% 70%',
    '--primary-dark': '270 100% 50%',
    '--secondary': '0 0% 90%',
    '--secondary-foreground': '0 0% 20%',
    '--muted': '0 0% 95%',
    '--muted-foreground': '0 0% 50%',
    '--accent': '0 0% 90%',
    '--accent-foreground': '0 0% 20%',
    '--success': '120 60% 40%',
    '--warning': '35 100% 50%',
    '--destructive': '0 70% 50%',
    '--info': '200 80% 50%',
    '--border': '0 0% 85%',
    '--input': '0 0% 85%',
    '--ring': '270 100% 60%',
    '--sidebar-background': '0 0% 95%',
    '--sidebar-foreground': '0 0% 20%',
    '--sidebar-primary': '270 100% 60%',
    '--sidebar-accent': '0 0% 90%',
    '--sidebar-border': '0 0% 85%',
    '--sidebar-ring': '270 100% 60%',
  },
  'sea-purple': {
    '--background': '0 0% 100%',
    '--foreground': '250 20% 20%',
    '--card': '250 15% 95%',
    '--card-foreground': '250 20% 20%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '250 20% 20%',
    '--primary': '250 60% 50%',
    '--primary-foreground': '0 0% 100%',
    '--primary-light': '250 55% 60%',
    '--primary-dark': '250 65% 40%',
    '--secondary': '250 15% 90%',
    '--secondary-foreground': '250 20% 20%',
    '--muted': '250 15% 95%',
    '--muted-foreground': '250 20% 50%',
    '--accent': '250 15% 90%',
    '--accent-foreground': '250 20% 20%',
    '--success': '120 60% 40%',
    '--warning': '35 100% 50%',
    '--destructive': '0 70% 50%',
    '--info': '200 80% 50%',
    '--border': '250 15% 85%',
    '--input': '250 15% 85%',
    '--ring': '250 60% 50%',
    '--sidebar-background': '250 15% 95%',
    '--sidebar-foreground': '250 20% 20%',
    '--sidebar-primary': '250 60% 50%',
    '--sidebar-accent': '250 15% 90%',
    '--sidebar-border': '250 15% 85%',
    '--sidebar-ring': '250 60% 50%',
  },
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      preset: 'light',
      custom: {},
      applied: {},
      isOrgLocked: false,
      orgDefault: null,

      setMode: (mode) => {
        set({ mode });
        // Apply theme immediately
        const { preset, custom } = get();
        get().applyPreset(preset);
      },

      applyPreset: (preset) => {
        const presetTokens = THEME_PRESETS[preset];
        const { custom } = get();
        
        // Merge preset with custom overrides
        const applied = { ...presetTokens, ...custom };
        
        // Apply to CSS variables
        Object.entries(applied).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
        
        // Also update legacy CSS variables for backward compatibility
        const legacyMappings = {
          '--color-primary': applied['--primary'] ? `hsl(${applied['--primary']})` : '#27c862',
          '--bg': applied['--background'] ? `hsl(${applied['--background']})` : '#efefef',
          '--surface': applied['--card'] ? `hsl(${applied['--card']})` : '#efefef',
          '--fg': applied['--foreground'] ? `hsl(${applied['--foreground']})` : '#101010',
          '--border': applied['--border'] ? `hsl(${applied['--border']})` : '#e6e6e6',
        };
        
        Object.entries(legacyMappings).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
        
        // Update next-themes if available
        if (typeof window !== 'undefined' && window.document) {
          // Set the theme classes on the document element (both raw and theme- prefixed for compatibility)
          const rawClass = preset;
          const aliasClass = preset === 'wazeer' ? 'wazeer' : '';
          document.documentElement.className = document.documentElement.className
            .replace(/(?:^|\s)(light|dark|wazeer|wazeer|sunset|abstract|dotted-indigo|lagoon|dark-nature|full-gradient|sea-purple)(?=\s|$)/g, '')
            .replace(/theme-\w+/g, '')
            .replace(/\s+/g, ' ')
            .trim() + ` ${rawClass} ${aliasClass} theme-${preset}`;
        }
        
        set({ preset, applied });
      },

      updateToken: (key, value) => {
        const { custom, preset } = get();
        const newCustom = { ...custom, [key]: value };
        
        // Apply immediately
        document.documentElement.style.setProperty(key, value);
        
        // Update applied tokens
        const applied = { ...THEME_PRESETS[preset], ...newCustom };
        
        // Also update legacy CSS variables if this affects them
        const legacyMappings: Record<string, string> = {};
        if (key === '--primary') {
          legacyMappings['--color-primary'] = `hsl(${value})`;
        } else if (key === '--background') {
          legacyMappings['--bg'] = `hsl(${value})`;
        } else if (key === '--card') {
          legacyMappings['--surface'] = `hsl(${value})`;
        } else if (key === '--foreground') {
          legacyMappings['--fg'] = `hsl(${value})`;
        } else if (key === '--border') {
          legacyMappings['--border'] = `hsl(${value})`;
        }
        
        Object.entries(legacyMappings).forEach(([legacyKey, legacyValue]) => {
          document.documentElement.style.setProperty(legacyKey, legacyValue);
        });
        
        set({ custom: newCustom, applied });
      },

      resetSection: (category) => {
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
        
        // Also update legacy CSS variables
        const legacyMappings = {
          '--color-primary': applied['--primary'] ? `hsl(${applied['--primary']})` : '#27c862',
          '--bg': applied['--background'] ? `hsl(${applied['--background']})` : '#efefef',
          '--surface': applied['--card'] ? `hsl(${applied['--card']})` : '#efefef',
          '--fg': applied['--foreground'] ? `hsl(${applied['--foreground']})` : '#101010',
          '--border': applied['--border'] ? `hsl(${applied['--border']})` : '#e6e6e6',
        };
        
        Object.entries(legacyMappings).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
        
        set({ custom: newCustom, applied });
      },

      resetAll: () => {
        const { preset } = get();
        const applied = THEME_PRESETS[preset];
        
        // Apply preset tokens
        Object.entries(applied).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
        
        // Also update legacy CSS variables
        const legacyMappings = {
          '--color-primary': applied['--primary'] ? `hsl(${applied['--primary']})` : '#27c862',
          '--bg': applied['--background'] ? `hsl(${applied['--background']})` : '#efefef',
          '--surface': applied['--card'] ? `hsl(${applied['--card']})` : '#efefef',
          '--fg': applied['--foreground'] ? `hsl(${applied['--foreground']})` : '#101010',
          '--border': applied['--border'] ? `hsl(${applied['--border']})` : '#e6e6e6',
        };
        
        Object.entries(legacyMappings).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
        
        set({ custom: {}, applied });
      },

      importTheme: (data) => {
        const { mode, preset, custom } = data;
        
        // Apply the imported theme
        const applied = { ...THEME_PRESETS[preset], ...custom };
        Object.entries(applied).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
        
        // Also update legacy CSS variables
        const legacyMappings = {
          '--color-primary': applied['--primary'] ? `hsl(${applied['--primary']})` : '#27c862',
          '--bg': applied['--background'] ? `hsl(${applied['--background']})` : '#efefef',
          '--surface': applied['--card'] ? `hsl(${applied['--card']})` : '#efefef',
          '--fg': applied['--foreground'] ? `hsl(${applied['--foreground']})` : '#101010',
          '--border': applied['--border'] ? `hsl(${applied['--border']})` : '#e6e6e6',
        };
        
        Object.entries(legacyMappings).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
        
        set({ mode, preset, custom, applied });
      },

      exportTheme: () => {
        const { mode, preset, custom } = get();
        return { mode, preset, custom };
      },

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
        
        // Also update legacy CSS variables
        const legacyMappings = {
          '--color-primary': applied['--primary'] ? `hsl(${applied['--primary']})` : '#27c862',
          '--bg': applied['--background'] ? `hsl(${applied['--background']})` : '#efefef',
          '--surface': applied['--card'] ? `hsl(${applied['--card']})` : '#efefef',
          '--fg': applied['--foreground'] ? `hsl(${applied['--foreground']})` : '#101010',
          '--border': applied['--border'] ? `hsl(${applied['--border']})` : '#e6e6e6',
        };
        
        Object.entries(legacyMappings).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
        
        set({ custom: randomCustom, applied });
      },

      save: async () => {
        // TODO: Implement Supabase persistence
        console.log('Saving theme settings...');
      },

      setOrgDefault: async (preset, custom) => {
        // TODO: Implement organization default setting
        console.log('Setting org default theme...');
      },

      lockOrgTheme: async (locked) => {
        // TODO: Implement organization theme locking
        console.log('Locking org theme:', locked);
      },
    }),
    {
      name: 'nbcon-theme-storage',
      partialize: (state) => ({
        mode: state.mode,
        preset: state.preset,
        custom: state.custom,
      }),
    }
  )
);
