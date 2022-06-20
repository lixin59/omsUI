import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: ['chrome87', 'edge88', 'es2021', 'firefox78', 'safari14']
  },
  plugins: [react()]
});
