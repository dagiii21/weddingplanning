import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    strictPort: true,
    port: 8000,
    allowedHosts: ['weddingplanning-3.onrender.com']
  },
  preview: {
    host: true,
    port: process.env.PORT || 4173,
    strictPort: true,
    allowedHosts: [
      'weddingplanning-3.onrender.com',
      'localhost' // keep for local development
    ]
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@config': resolve(__dirname, './src/config'),
      '@services': resolve(__dirname, './src/services')
    }
  }
});