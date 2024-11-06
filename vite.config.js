import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/xops/',
  optimizeDeps: {
    include: [
      'react-bootstrap',  // Asegúrate de incluir react-bootstrap
    ],
  },
});