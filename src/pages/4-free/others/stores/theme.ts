/**
 * Client Theme Store - MIGRATED TO SHARED
 * 
 * This store now uses the shared theme system from src/shared/stores/theme.ts
 * All theme logic, presets, and tokens are centralized.
 * 
 * This wrapper maintains backward compatibility for existing client code.
 * Any client component importing from this file will automatically use the shared store.
 * 
 * @version 2.0.0
 * @status Migrated
 * @migration-date January 15, 2025
 * @backup Available in git history if rollback needed
 */

import { useThemeStore as useSharedThemeStore } from '../../../../shared/stores/theme';

/**
 * Client Theme Store
 * Now a thin wrapper around the shared theme store
 */
export const useThemeStore = useSharedThemeStore;

/**
 * Re-export types for backward compatibility
 * All client components can continue using these imports
 */
export type {
  ThemeMode,
  ThemePreset,
  ThemeToken,
  ThemeTokenCategory,
} from '../../../../shared/theme/types';

/**
 * Re-export constants for backward compatibility
 * Theme presets and tokens are now centralized
 */
export {
  THEME_TOKENS,
  THEME_PRESETS,
  THEME_METADATA,
} from '../../../../shared/stores/theme';
