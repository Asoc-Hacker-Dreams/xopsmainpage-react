import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/xops/',
  build: {
    outDir: 'xops',
  },
  optimizeDeps: {
    include: [
      'react-bootstrap',  // Asegúrate de incluir react-bootstrap
    ],
  },
});