import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Esto es importante para que funcione en subdirectorios
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  server: {
    proxy: {
      '/api/whatsapp': {
        target: `${process.env.VITE_SUPABASE_URL}/functions/v1/whatsapp-api`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/whatsapp/, ''),
        headers: {
          'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    }
  }
});