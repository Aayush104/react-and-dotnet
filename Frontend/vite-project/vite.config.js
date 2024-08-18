import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7252',
        changeOrigin: true,
        secure: false, // Set to true if the backend uses a valid SSL certificate
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/hub': {
        target: 'https://localhost:7252',
        changeOrigin: true,
        secure: false, // Set to true if the backend uses a valid SSL certificate
        rewrite: (path) => path.replace(/^\/hub/, '/hub'),
      },
    },
  },
});
