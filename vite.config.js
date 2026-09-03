import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Use relative base so the same build works on GitHub Pages (subpath) and Render (root).
// Set VITE_BASE=/markdeck/ at build time for GitHub Pages.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    },
    watch: {
      ignored: ['**/.cache/**']
    }
  }
})
