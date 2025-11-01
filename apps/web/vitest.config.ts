import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

/**
 * Vitest configuration for apps/web
 * 
 * Phase D: Testing & Documentation
 * Unified test harness with jsdom environment and path aliases
 * 
 * @see docs/nbcon-new-plan/2 6 - 🧪 Phase D Testing & Documentation (Section 6)
 */
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup/vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.next', '.cache'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/*.d.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      // Mirror tsconfig.base.json path aliases
      '@app': path.resolve(__dirname, './src/app'),
      '@app/*': path.resolve(__dirname, './src/app/*'),
      '@components': path.resolve(__dirname, './src/components'),
      '@components/*': path.resolve(__dirname, './src/components/*'),
      '@ai': path.resolve(__dirname, './src/ai'),
      '@ai/*': path.resolve(__dirname, './src/ai/*'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@shared/*': path.resolve(__dirname, './src/shared/*'),
      '@services': path.resolve(__dirname, './src/shared/services'),
      '@services/*': path.resolve(__dirname, './src/shared/services/*'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@hooks/*': path.resolve(__dirname, './src/hooks/*'),
      '@config': path.resolve(__dirname, './src/config'),
      '@config/*': path.resolve(__dirname, './src/config/*'),
      // Also support @ alias pointing to src
      '@': path.resolve(__dirname, './src'),
      '@/*': path.resolve(__dirname, './src/*'),
      // Root src directory access (for cross-app imports)
      '@root': path.resolve(__dirname, '../../src'),
      '@root/*': path.resolve(__dirname, '../../src/*'),
    },
  },
});

