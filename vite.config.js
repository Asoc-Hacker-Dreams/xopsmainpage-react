import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import sitemap from 'vite-plugin-sitemap' // Removido temporalmente por problemas con robots.txt

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Plugin sitemap removido temporalmente - se creará sitemap manual en public/
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
