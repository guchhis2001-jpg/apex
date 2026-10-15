import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// PREVIEW=1 builds with relative paths (for hosting under a sub-path) and shows a concept-preview banner.
const preview = process.env.PREVIEW === '1';

export default defineConfig({
  base: preview ? './' : '/',
  define: { 'import.meta.env.VITE_PREVIEW': JSON.stringify(preview ? '1' : '0') },
  plugins: [react()],
  resolve: { alias: { '@data': path.resolve(__dirname, 'data'), '@': path.resolve(__dirname, 'src') } },
  build: { target: 'es2020', cssCodeSplit: false, assetsDir: 'app' },
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
});
