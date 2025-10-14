/**
 * Theme System - Default Token Definitions
 * 
 * Base theme tokens used across all presets.
 * These represent the complete set of CSS variables managed by the theme system.
 * 
 * @version 1.0.0
 * @status Production Ready
 */

import { ThemeToken } from './types';

export const THEME_TOKENS: ThemeToken[] = [
  // Core (2 tokens)
  { key: '--background', value: '0 0% 100%', description: 'Main background color', category: 'core' },
  { key: '--foreground', value: '0 0% 6%', description: 'Main text color', category: 'core' },
  
  // Card/Popover (4 tokens)
  { key: '--card', value: '0 0% 96.1%', description: 'Card background', category: 'card' },
  { key: '--card-foreground', value: '0 0% 6%', description: 'Card text color', category: 'card' },
  { key: '--popover', value: '0 0% 100%', description: 'Popover background', category: 'card' },
  { key: '--popover-foreground', value: '0 0% 6%', description: 'Popover text color', category: 'card' },
  
  // Primary (4 tokens)
  { key: '--primary', value: '142 65% 47%', description: 'Primary brand color', category: 'primary' },
  { key: '--primary-foreground', value: '0 0% 100%', description: 'Primary text color', category: 'primary' },
  { key: '--primary-light', value: '142 60% 57%', description: 'Light primary variant', category: 'primary' },
  { key: '--primary-dark', value: '142 70% 37%', description: 'Dark primary variant', category: 'primary' },
  
  // Secondary/Muted/Accent (6 tokens)
  { key: '--secondary', value: '0 0% 94%', description: 'Secondary background', category: 'secondary' },
  { key: '--secondary-foreground', value: '0 0% 6%', description: 'Secondary text color', category: 'secondary' },
  { key: '--muted', value: '0 0% 94%', description: 'Muted background', category: 'secondary' },
  { key: '--muted-foreground', value: '0 0% 45%', description: 'Muted text color', category: 'secondary' },
  { key: '--accent', value: '0 0% 94%', description: 'Accent background', category: 'secondary' },
  { key: '--accent-foreground', value: '0 0% 6%', description: 'Accent text color', category: 'secondary' },
  
  // Status (8 tokens)
  { key: '--success', value: '156 68% 37%', description: 'Success color', category: 'status' },
  { key: '--success-foreground', value: '0 0% 100%', description: 'Success text color', category: 'status' },
  { key: '--warning', value: '32 100% 42%', description: 'Warning color', category: 'status' },
  { key: '--warning-foreground', value: '0 0% 100%', description: 'Warning text color', category: 'status' },
  { key: '--destructive', value: '4 65% 48%', description: 'Destructive color', category: 'status' },
  { key: '--destructive-foreground', value: '0 0% 100%', description: 'Destructive text color', category: 'status' },
  { key: '--info', value: '217 92% 55%', description: 'Info color', category: 'status' },
  { key: '--info-foreground', value: '0 0% 100%', description: 'Info text color', category: 'status' },
  
  // UI (6 tokens)
  { key: '--border', value: '0 0% 90%', description: 'Border color', category: 'ui' },
  { key: '--input', value: '0 0% 90%', description: 'Input border color', category: 'ui' },
  { key: '--input-background', value: '0 0% 100%', description: 'Background color for text inputs, search boxes, and form fields', category: 'ui' },
  { key: '--input-foreground', value: '0 0% 6%', description: 'Text color inside input fields and form controls', category: 'ui' },
  { key: '--input-placeholder', value: '0 0% 45%', description: 'Placeholder text color for empty input fields', category: 'ui' },
  { key: '--ring', value: '142 65% 47%', description: 'Focus ring color', category: 'ui' },
  
  // Sidebar (8 tokens)
  { key: '--sidebar-background', value: '0 0% 94%', description: 'Sidebar background', category: 'sidebar' },
  { key: '--sidebar-foreground', value: '0 0% 6%', description: 'Sidebar text color', category: 'sidebar' },
  { key: '--sidebar-primary', value: '142 65% 47%', description: 'Sidebar primary color', category: 'sidebar' },
  { key: '--sidebar-primary-foreground', value: '0 0% 100%', description: 'Sidebar primary text color', category: 'sidebar' },
  { key: '--sidebar-accent', value: '0 0% 90%', description: 'Sidebar accent color', category: 'sidebar' },
  { key: '--sidebar-accent-foreground', value: '0 0% 6%', description: 'Sidebar accent text color', category: 'sidebar' },
  { key: '--sidebar-border', value: '0 0% 90%', description: 'Sidebar border color', category: 'sidebar' },
  { key: '--sidebar-ring', value: '142 65% 47%', description: 'Sidebar focus ring color', category: 'sidebar' },
];

/**
 * Total: 38 tokens per theme preset
 * Categories: core(2) + card(4) + primary(4) + secondary(6) + status(8) + ui(6) + sidebar(8)
 */

