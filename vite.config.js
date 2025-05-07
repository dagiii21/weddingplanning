import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path'; // Add this import

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  plugins: [react()],
server: {
host: true,
strictPort: true,
port: 8000,
},
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@config': path.resolve(__dirname, './src/config'),
      '@services': path.resolve(__dirname, './src/services')
    }
  }
});