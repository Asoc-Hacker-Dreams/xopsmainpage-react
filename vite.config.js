import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'
import { ROUTES } from './scripts/prerender-routes.mjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sitemap({
      hostname: 'https://xopsconference.com',
      dynamicRoutes: ROUTES,
      // Generar sitemap.xml automáticamente
      outDir: 'dist',
      // public/robots.txt es la fuente de verdad (incluye las reglas de
      // AI crawlers). El plugin lo sobrescribía con una versión genérica.
      generateRobotsTxt: false,
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          bootstrap: ['bootstrap', 'react-bootstrap'],
        }
      }
    }
  }
})