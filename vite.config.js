import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    include: [
      'react-bootstrap',  // Asegúrate de incluir react-bootstrap
    ],
  },
});