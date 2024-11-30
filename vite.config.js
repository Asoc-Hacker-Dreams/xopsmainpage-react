import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',  // Asegúrate de reemplazar 'xopsmainpage-react' con el nombre correcto de tu repositorio
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react-bootstrap',  // Asegúrate de incluir react-bootstrap
    ],
  },
});