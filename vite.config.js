import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',  // Asegúrate de reemplazar 'xopsmainpage-react' con el nombre correcto de tu repositorio
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react-bootstrap',  // Asegúrate de incluir react-bootstrap
    ],
  },
});
