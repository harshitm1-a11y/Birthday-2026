import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Automatically detect platform: Vercel/Netlify use root '/', GitHub Pages uses '/Birthday-2026/'
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';
const isNetlify = process.env.NETLIFY === 'true';
const base = isVercel || isNetlify ? '/' : '/Birthday-2026/';

export default defineConfig({
  plugins: [react()],
  base,
})
