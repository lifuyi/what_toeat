import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2018',
    rollupOptions: {
      output: {
        manualChunks: {
          'recharts': ['recharts'],
          'react-vendor': ['react', 'react-dom']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true
  },
  server: {
    hmr: {
      overlay: false
    }
  }
})