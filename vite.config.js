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
        '/ponentes',
        '/schedule',
        '/agenda',
        '/contact',
        '/contacto',
        '/organizer',
        '/organizadores',
        '/team',
        '/equipo',
        '/sponsor',
        '/patrocina',
        // Rutas de archivo para 2024
        '/archive/2024/Speakers2024',
        '/archive/2024/Sponsor2024',
        // Rutas de archivo para 2023
        '/archive/2023/Speakers2023',

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