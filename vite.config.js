Repos/XOps/xopsmainpage-react/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://xopsconference.com',
      dynamicRoutes: [
        '/',
        '/about',
        '/speakers',
        '/schedule',
        '/contact',
        '/Organizer',
        '/Sponsor',
        // Rutas de archivo para 2024
        '/archive/2024/Home2024',
        '/archive/2024/Events2024',
        '/archive/2024/SpeakersSection2024',
        '/archive/2024/Sponsor2024',
        '/archive/2024/Organizer2024',
        // Rutas de archivo para 2023
        '/archive/2023/Home2023',
        '/archive/2023/Events2023',
        '/archive/2023/SpeakersSection2023',
        '/archive/2023/Sponsor2023',
        '/archive/2023/Organizer2023',

        // Añade todas tus rutas aquí
      ],
      // Generar sitemap.xml automáticamente
      outDir: 'dist',
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