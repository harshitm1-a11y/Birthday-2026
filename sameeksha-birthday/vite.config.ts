import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Base path configured for GitHub Pages repository: /Birthday-2026/
export default defineConfig({
  plugins: [react()],
  base: '/Birthday-2026/',
})
