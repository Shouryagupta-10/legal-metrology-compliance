import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'geist/font/sans': path.resolve(__dirname, 'src/fonts/sans.ts'),
      'geist/font/mono': path.resolve(__dirname, 'src/fonts/mono.ts'),
      'geist/font/pixel': path.resolve(__dirname, 'src/fonts/pixel.ts')
    }
  },
  server: {
    port: 5173,
    host: true,
    cors: true,
    allowedHosts: true
  },
  preview: {
    port: 5173,
    host: true,
    cors: true,
    allowedHosts: true
  }
});