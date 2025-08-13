import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  root: '.',
  publicDir: 'public',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    exclude: ['@rollup/rollup-linux-x64-gnu']
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      external: ['@rollup/rollup-linux-x64-gnu'],
      // Add file limit configuration to avoid too many open files
      maxParallelFileOps: 3,
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          recharts: ['recharts'],
          framer: ['framer-motion']
        }
      }
    }
  }
})