import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',  // Changed from '/assets/' to '/'
  build: {
    outDir: '../static',  // Build directly to static folder
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Ensure consistent file names for caching
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  server: {
    proxy: {
      '/validate': 'http://localhost:8080'
    }
  }
})