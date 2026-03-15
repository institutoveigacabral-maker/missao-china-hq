import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'json-summary'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/react-app/components'),
      '@utils': resolve(__dirname, 'src/react-app/utils'),
      '@hooks': resolve(__dirname, 'src/react-app/hooks'),
      '@pages': resolve(__dirname, 'src/react-app/pages'),
      '@providers': resolve(__dirname, 'src/react-app/providers'),
      '@contexts': resolve(__dirname, 'src/react-app/contexts'),
    },
  },
});
