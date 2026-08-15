import { defineConfig } from 'vite';

export default defineConfig({
  // Vitest compatible test configuration
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['tests/**/*.test.ts']
  }
} as any);
