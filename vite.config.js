import { defineConfig } from 'vite';

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