import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: '.osdo/results/coverage',
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70
      },
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '*.config.js',
        'src/main.jsx',
        'src/index.js',
        'public/',
        '.osdo/',
        'scripts/'
      ]
    },
    outputFile: {
      json: '.osdo/results/test-results.json',
      junit: '.osdo/results/junit.xml'
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
