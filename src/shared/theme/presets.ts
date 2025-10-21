/**
 * Theme System - Preset Configurations
 * 
 * All 10 theme presets with complete token definitions.
 * Each preset includes 38 CSS variables (HSL format).
 * 
 * @version 2.0.0
 * @status Production Ready
 */

import { ThemePreset, LegacyThemePreset } from './types';

/**
 * Migration map from legacy theme names to new theme names
 */
export const LEGACY_THEME_MIGRATION: Record<LegacyThemePreset, ThemePreset> = {
  'light': 'light-green',
  'dark': 'neon-green',
  'sunset': 'sunset-orange',
  'abstract': 'ocean-blue',
  'nika': 'pink-magenta',
  'lagoon': 'cyan-lagoon',
  'dark-nature': 'forest-night',
  'full-gradient': 'purple-violet',
};

/**
 * Migrates a legacy theme name to the new theme name
 */
export function migrateLegacyTheme(theme: string): ThemePreset {
  if (theme in LEGACY_THEME_MIGRATION) {
    return LEGACY_THEME_MIGRATION[theme as LegacyThemePreset];
  }
  // If it's already a new theme name or unknown, return as-is (with fallback)
  return (theme as ThemePreset) || 'light-green';
}

export const THEME_PRESETS: Record<ThemePreset, Record<string, string>> = {
  // ============================================================================
  // LIGHT GREEN THEME - Clean and bright with forest green accent
  // ============================================================================
  'light-green': {
    '--background': '0 0% 100%',
    '--foreground': '0 0% 9%',
    '--card': '0 0% 96.1%',
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
    '--input-background': '0 0% 100%',
    '--input-foreground': '0 0% 9%',
    '--input-placeholder': '0 0% 45%',
    '--ring': '142 65% 47%',
    '--sidebar-background': '0 0% 98%',
    '--sidebar-foreground': '0 0% 9%',
    '--sidebar-primary': '142 65% 47%',
    '--sidebar-primary-foreground': '0 0% 100%',
    '--sidebar-accent': '142 65% 47%',
    '--sidebar-accent-foreground': '0 0% 98%',
    '--sidebar-border': '0 0% 90%',
    '--sidebar-ring': '142 65% 47%',
  },

  // ============================================================================
  // NEON GREEN THEME - Dark mode with vibrant green accent
  // ============================================================================
  'neon-green': {
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
    '--input-background': '0 0% 6%',
    '--input-foreground': '0 0% 95%',
    '--input-placeholder': '0 0% 60%',
    '--ring': '142 65% 47%',
    '--sidebar-background': '0 0% 6%',
    '--sidebar-foreground': '0 0% 95%',
    '--sidebar-primary': '142 65% 47%',
    '--sidebar-primary-foreground': '0 0% 100%',
    '--sidebar-accent': '142 65% 47%',
    '--sidebar-accent-foreground': '0 0% 95%',
    '--sidebar-border': '0 0% 15%',
    '--sidebar-ring': '142 65% 47%',
  },

  // ============================================================================
  // DARK RAINBOW THEME - Dark mode with vibrant rainbow gradient
  // ============================================================================
  'dark-rainbow': {
    '--background': '0 0% 3%',
    '--foreground': '0 0% 95%',
    '--card': '0 0% 6%',
    '--card-foreground': '0 0% 95%',
    '--popover': '0 0% 6%',
    '--popover-foreground': '0 0% 95%',
    '--primary': '180 100% 40%', // Darker cyan-blue for better text contrast
    '--primary-foreground': '0 0% 100%',
    '--primary-light': '200 100% 45%', // Darker blue
    '--primary-dark': '160 100% 35%', // Darker green
    '--secondary': '0 0% 6%',
    '--secondary-foreground': '0 0% 95%',
    '--muted': '0 0% 6%',
    '--muted-foreground': '0 0% 65%',
    '--accent': '0 0% 6%',
    '--accent-foreground': '0 0% 95%',
    '--success': '120 100% 40%', // Darker green
    '--success-foreground': '0 0% 100%',
    '--warning': '60 100% 45%', // Darker yellow (middle of blue-green mix)
    '--warning-foreground': '0 0% 100%',
    '--destructive': '0 100% 50%', // Darker red
    '--destructive-foreground': '0 0% 100%',
    '--info': '200 100% 45%', // Darker blue
    '--info-foreground': '0 0% 100%',
    '--border': '0 0% 15%',
    '--input': '0 0% 15%',
    '--input-background': '0 0% 6%',
    '--input-foreground': '0 0% 95%',
    '--input-placeholder': '0 0% 60%',
    '--ring': '180 100% 40%', // Darker cyan-blue ring
    '--sidebar-background': '0 0% 6%',
    '--sidebar-foreground': '0 0% 95%',
    '--sidebar-primary': '180 100% 40%',
    '--sidebar-primary-foreground': '0 0% 100%',
    '--sidebar-accent': '180 100% 40%',
    '--sidebar-accent-foreground': '0 0% 95%',
    '--sidebar-border': '0 0% 15%',
    '--sidebar-ring': '180 100% 40%',
  },

  // ============================================================================
  // WAZEER THEME - Earth Tones (Saudi Heritage)
  // ============================================================================
  wazeer: {
    '--background': '0 0% 100%',
    '--foreground': '20 25% 30%', // Warm brown for text
    '--card': '30 15% 92%',
    '--card-foreground': '20 25% 30%', // Warm brown for text
    '--popover': '0 0% 100%',
    '--popover-foreground': '20 25% 30%', // Warm brown for text
    '--primary': '160 30% 30%', // Mid earth tone green
    '--primary-foreground': '0 0% 100%',
    '--primary-light': '160 25% 42%', // Lighter sage green
    '--primary-dark': '160 35% 20%', // Darker forest green
    '--secondary': '20 25% 35%',
    '--secondary-foreground': '0 0% 100%',
    '--muted': '30 15% 92%',
    '--muted-foreground': '20 25% 45%', // Medium brown for muted text
    '--accent': '30 15% 92%',
    '--accent-foreground': '20 25% 30%', // Warm brown for text
    '--success': '142 60% 35%', // Forest green success
    '--success-foreground': '0 0% 100%',
    '--warning': '32 100% 42%',
    '--warning-foreground': '0 0% 100%',
    '--destructive': '4 65% 48%',
    '--destructive-foreground': '0 0% 100%',
    '--info': '200 70% 45%',
    '--info-foreground': '0 0% 100%',
    '--border': '30 15% 80%',
    '--input': '30 15% 80%',
    '--input-background': '0 0% 100%',
    '--input-foreground': '20 25% 30%', // Warm brown for text
    '--input-placeholder': '20 25% 45%', // Lighter brown for placeholder
    '--ring': '160 30% 30%',
    '--sidebar-background': '30 15% 92%',
    '--sidebar-foreground': '20 25% 30%', // Warm brown for text
    '--sidebar-primary': '160 30% 30%',
    '--sidebar-primary-foreground': '0 0% 100%',
    '--sidebar-accent': '160 30% 30%',
    '--sidebar-accent-foreground': '0 0% 100%',
    '--sidebar-border': '30 15% 80%',
    '--sidebar-ring': '160 30% 30%',
  },

  // ============================================================================
  // SUNSET ORANGE THEME - Warm sunset-inspired orange tones
  // ============================================================================
  'sunset-orange': {
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
    '--input-background': '0 0% 100%',
    '--input-foreground': '20 15% 20%',
    '--input-placeholder': '20 15% 40%',
    '--ring': '15 85% 50%',
    '--sidebar-background': '25 20% 95%',
    '--sidebar-foreground': '20 15% 20%',
    '--sidebar-primary': '15 85% 50%',
    '--sidebar-accent': '15 85% 50%',
    '--sidebar-accent-foreground': '25 15% 96%',
    '--sidebar-border': '25 20% 85%',
    '--sidebar-ring': '15 85% 50%',
  },

  // ============================================================================
  // OCEAN BLUE THEME - Deep ocean blue professional theme
  // ============================================================================
  'ocean-blue': {
    '--background': '0 0% 100%',
    '--foreground': '0 0% 0%',
    '--card': '0 0% 96.1%',
    '--card-foreground': '0 0% 0%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '0 0% 0%',
    '--primary': '203 64% 41%',
    '--primary-foreground': '0 0% 100%',
    '--primary-light': '203 60% 51%',
    '--primary-dark': '203 70% 31%',
    '--secondary': '0 0% 96%',
    '--secondary-foreground': '0 0% 0%',
    '--muted': '0 0% 96%',
    '--muted-foreground': '0 0% 45%',
    '--accent': '0 0% 96%',
    '--accent-foreground': '0 0% 0%',
    '--success': '120 60% 40%',
    '--warning': '35 100% 50%',
    '--destructive': '0 70% 50%',
    '--info': '200 80% 50%',
    '--border': '0 0% 90%',
    '--input': '0 0% 90%',
    '--input-background': '0 0% 100%',
    '--input-foreground': '0 0% 0%',
    '--input-placeholder': '0 0% 45%',
    '--ring': '203 64% 41%',
    '--sidebar-background': '0 0% 96%',
    '--sidebar-foreground': '0 0% 0%',
    '--sidebar-primary': '203 64% 41%',
    '--sidebar-accent': '203 64% 41%',
    '--sidebar-accent-foreground': '0 0% 100%',
    '--sidebar-border': '0 0% 90%',
    '--sidebar-ring': '203 64% 41%',
  },

  // ============================================================================
  // PINK MAGENTA THEME - Vibrant hot pink energy
  // ============================================================================
  'pink-magenta': {
    '--background': '0 0% 100%',
    '--foreground': '0 0% 0%',
    '--card': '0 0% 96.1%',
    '--card-foreground': '0 0% 0%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '0 0% 0%',
    '--primary': '355 85% 52%',
    '--primary-foreground': '0 0% 100%',
    '--primary-light': '355 85% 62%',
    '--primary-dark': '355 85% 42%',
    '--secondary': '0 0% 96%',
    '--secondary-foreground': '0 0% 0%',
    '--muted': '0 0% 96%',
    '--muted-foreground': '0 0% 45%',
    '--accent': '0 0% 96%',
    '--accent-foreground': '0 0% 0%',
    '--success': '120 60% 40%',
    '--warning': '35 100% 50%',
    '--destructive': '0 70% 50%',
    '--info': '200 80% 50%',
    '--border': '0 0% 90%',
    '--input': '0 0% 90%',
    '--input-background': '0 0% 100%',
    '--input-foreground': '0 0% 0%',
    '--input-placeholder': '0 0% 45%',
    '--ring': '355 85% 52%',
    '--sidebar-background': '0 0% 96%',
    '--sidebar-foreground': '0 0% 0%',
    '--sidebar-primary': '355 85% 52%',
    '--sidebar-accent': '355 85% 52%',
    '--sidebar-accent-foreground': '0 0% 100%',
    '--sidebar-border': '0 0% 90%',
    '--sidebar-ring': '355 85% 52%',
  },

  // ============================================================================
  // CYAN LAGOON THEME - Bright turquoise ocean lagoon
  // ============================================================================
  'cyan-lagoon': {
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
    '--input-background': '0 0% 100%',
    '--input-foreground': '180 20% 20%',
    '--input-placeholder': '180 20% 40%',
    '--ring': '180 60% 50%',
    '--sidebar-background': '180 15% 95%',
    '--sidebar-foreground': '180 20% 20%',
    '--sidebar-primary': '180 60% 50%',
    '--sidebar-accent': '180 60% 50%',
    '--sidebar-accent-foreground': '180 15% 96%',
    '--sidebar-border': '180 15% 85%',
    '--sidebar-ring': '180 60% 50%',
  },

  // ============================================================================
  // FOREST NIGHT THEME - Deep forest green darkness
  // ============================================================================
  'forest-night': {
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
    '--input-background': '0 0% 3%',
    '--input-foreground': '120 20% 95%',
    '--input-placeholder': '120 20% 60%',
    '--ring': '120 60% 40%',
    '--sidebar-background': '0 0% 5%',
    '--sidebar-foreground': '120 20% 90%',
    '--sidebar-primary': '120 60% 40%',
    '--sidebar-accent': '120 60% 40%',
    '--sidebar-accent-foreground': '120 15% 92%',
    '--sidebar-border': '120 10% 15%',
    '--sidebar-ring': '120 60% 40%',
  },

  // ============================================================================
  // PURPLE VIOLET THEME - Vibrant purple gradient flow
  // ============================================================================
  'purple-violet': {
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
    '--input-background': '0 0% 100%',
    '--input-foreground': '300 20% 20%',
    '--input-placeholder': '300 20% 40%',
    '--ring': '270 100% 60%',
    '--sidebar-background': '0 0% 95%',
    '--sidebar-foreground': '0 0% 20%',
    '--sidebar-primary': '270 100% 60%',
    '--sidebar-accent': '270 100% 60%',
    '--sidebar-accent-foreground': '0 0% 95%',
    '--sidebar-border': '0 0% 85%',
    '--sidebar-ring': '270 100% 60%',
  },

  // ============================================================================
  // SEA-PURPLE THEME - Blue-Purple Ocean
  // ============================================================================
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
    '--input-background': '0 0% 100%',
    '--input-foreground': '250 20% 20%',
    '--input-placeholder': '250 20% 40%',
    '--ring': '250 60% 50%',
    '--sidebar-background': '250 15% 95%',
    '--sidebar-foreground': '250 20% 20%',
    '--sidebar-primary': '250 60% 50%',
    '--sidebar-accent': '250 60% 50%',
    '--sidebar-accent-foreground': '0 0% 95%',
    '--sidebar-border': '250 15% 85%',
    '--sidebar-ring': '250 60% 50%',
  },
};

/**
 * Theme Preset Metadata
 * Human-readable descriptions for each theme with color indicators
 */
export const THEME_METADATA: Record<ThemePreset, { name: string; description: string; icon: string; color: string }> = {
  'light-green': {
    name: 'Light Green',
    description: 'Clean and bright with forest green accent',
    icon: 'Sun',
    color: '#2d8659'
  },
  'neon-green': {
    name: 'Neon Green',
    description: 'Dark mode with vibrant green accent',
    icon: 'Moon',
    color: '#2d8659'
  },
  'dark-rainbow': {
    name: 'Dark Rainbow',
    description: 'Dark mode with vibrant blue-to-green gradient spectrum',
    icon: 'Sparkles',
    color: '#2b9e96' // Teal blue-green
  },
  wazeer: {
    name: 'Wazeer',
    description: 'Earth tones inspired by Saudi heritage',
    icon: 'Palmtree',
    color: '#3d6b56' // Updated to match new primary earth tone
  },
  'sunset-orange': {
    name: 'Sunset Orange',
    description: 'Warm sunset-inspired orange tones',
    icon: 'Sunset',
    color: '#f25c30'
  },
  'ocean-blue': {
    name: 'Ocean Blue',
    description: 'Deep ocean blue professional theme',
    icon: 'Waves',
    color: '#3676a8'
  },
  'pink-magenta': {
    name: 'Pink Magenta',
    description: 'Vibrant hot pink energy',
    icon: 'Sparkles',
    color: '#ea3982'
  },
  'cyan-lagoon': {
    name: 'Cyan Lagoon',
    description: 'Bright turquoise ocean lagoon',
    icon: 'Waves',
    color: '#40bfbf'
  },
  'forest-night': {
    name: 'Forest Night',
    description: 'Deep forest green darkness',
    icon: 'Trees',
    color: '#4d9966'
  },
  'purple-violet': {
    name: 'Purple Violet',
    description: 'Vibrant purple gradient flow',
    icon: 'Palette',
    color: '#9933ff'
  },
  'sea-purple': {
    name: 'Sea Purple',
    description: 'Blue-purple ocean depths',
    icon: 'Waves',
    color: '#6f5fbf'
  },
};

