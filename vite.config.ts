import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/english-quiz-github-pages/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: [/^src\/server\/.*/],
    },
  },
})
