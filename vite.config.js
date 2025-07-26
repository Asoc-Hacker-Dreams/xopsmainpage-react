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
        '/ponentes',
        '/agenda', 
        '/organizers',
        '/organizadores',
        '/patrocinadores',
        '/faq',
        '/colaboradores',
        '/ubicacion',
        '/Sponsor',
        '/Patrocina',
        '/Organizer',
        '/Team',
        '/Equipo',
        // Rutas de archivo
        '/archive/2024/Speakers2024',
        '/archive/2024/Sponsor2024',
        '/archive/2023/Speakers2023',
      ],
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
          icons: ['react-icons']
        }
      }
    },
    // Optimizaciones para Core Web Vitals
    minify: 'esbuild',
    target: 'esnext',
    cssMinify: true
  },
  server: {
    port: 3000,
    open: true
  },
  preview: {
    port: 3000
  }
})