import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 3002
  },
  build: {
    target: ['chrome87', 'edge88', 'es2021', 'firefox78', 'safari14']
  },
  plugins: [react()]
});
