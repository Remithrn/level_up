import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow connections from outside
    port: 3000,      // Match the port with Docker
    watch: {
      usePolling: true,  // Enable polling to detect changes inside Docker
    },
    strictPort: true,    // Ensure the server fails if the port is already in use
    hmr: {
      port: 3000,        // Hot Module Replacement over the correct port
    },
  },
})
