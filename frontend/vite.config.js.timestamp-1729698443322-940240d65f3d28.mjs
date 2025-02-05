// vite.config.js
import { defineConfig } from "file:///app/node_modules/vite/dist/node/index.js";
import react from "file:///app/node_modules/@vitejs/plugin-react-swc/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    // Allow connections from outside
    port: 3e3,
    // Match the port with Docker
    watch: {
      usePolling: true
      // Enable polling to detect changes inside Docker
    },
    strictPort: true,
    // Ensure the server fails if the port is already in use
    hmr: {
      port: 3e3
      // Hot Module Replacement over the correct port
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9hcHAvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3YydcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogJzAuMC4wLjAnLCAvLyBBbGxvdyBjb25uZWN0aW9ucyBmcm9tIG91dHNpZGVcbiAgICBwb3J0OiAzMDAwLCAgICAgIC8vIE1hdGNoIHRoZSBwb3J0IHdpdGggRG9ja2VyXG4gICAgd2F0Y2g6IHtcbiAgICAgIHVzZVBvbGxpbmc6IHRydWUsICAvLyBFbmFibGUgcG9sbGluZyB0byBkZXRlY3QgY2hhbmdlcyBpbnNpZGUgRG9ja2VyXG4gICAgfSxcbiAgICBzdHJpY3RQb3J0OiB0cnVlLCAgICAvLyBFbnN1cmUgdGhlIHNlcnZlciBmYWlscyBpZiB0aGUgcG9ydCBpcyBhbHJlYWR5IGluIHVzZVxuICAgIGhtcjoge1xuICAgICAgcG9ydDogMzAwMCwgICAgICAgIC8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnQgb3ZlciB0aGUgY29ycmVjdCBwb3J0XG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThMLFNBQVMsb0JBQW9CO0FBQzNOLE9BQU8sV0FBVztBQUdsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFlBQVk7QUFBQTtBQUFBLElBQ2Q7QUFBQSxJQUNBLFlBQVk7QUFBQTtBQUFBLElBQ1osS0FBSztBQUFBLE1BQ0gsTUFBTTtBQUFBO0FBQUEsSUFDUjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
