import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@data': path.resolve(__dirname, 'data'), '@': path.resolve(__dirname, 'src') } },
  build: { target: 'es2020', cssCodeSplit: false, assetsDir: '_app' },
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
});
