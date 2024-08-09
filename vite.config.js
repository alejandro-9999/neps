import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/auditoria-medica/',
  plugins: [react()],
  build: {
    outDir: 'build/'
  },
  server: {
    historyApiFallback: true, // Este parámetro asegura que todas las rutas redirijan a index.html
  }
});
