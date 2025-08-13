import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      // Ensure external dependencies are properly bundled
      external: []
    }
  },
  optimizeDeps: {
    include: ['react-icons/fi', 'recharts', 'framer-motion']
  }
});