import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sitemap({
      hostname: 'https://xopsconference.com',
      dynamicRoutes: [
        '/',
        '/summit',
        '/Summit',
        '/startup-pack',
        '/startup-pack-application',
        '/Sponsor',
        '/Patrocina',
        '/Organizer',
        '/Organizadores',
        '/Team',
        '/Equipo',
        '/agenda',
        '/mi-agenda',
        // Rutas de archivo para 2025
        '/archive/2025/Speakers2025',
        '/archive/2025/Events2025',
        '/archive/2025/Sponsor2025',
        // Rutas de archivo para 2024
        '/archive/2024/Speakers2024',
        '/archive/2024/Events2024',
        '/archive/2024/Sponsor2024',
        // Rutas de archivo para 2023
        '/archive/2023/Speakers2023',
        // Política y legal
        '/politica-de-privacidad',
        '/politica-de-cookies',
        '/terminos-de-servicio',
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