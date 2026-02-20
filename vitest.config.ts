import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      '**/*.e2e.{test,spec}.{ts,tsx}',
      '**/*.e2e.{test,spec}.ts',
      '**/*.e2e.{test,spec}.tsx',
      '**/*.e2e.spec.{ts,tsx}',
      '**/*.e2e.test.{ts,tsx}',
      'tests/**',
      'playwright-report/**',
      'test-results/**',
      'node_modules/**',
      'dist/**',
    ],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
