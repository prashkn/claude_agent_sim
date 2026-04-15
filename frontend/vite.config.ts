import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/agents": "http://localhost:8000",
      "/status": "http://localhost:8000",
    },
    hmr: {
      host: '10.0.0.247',
    },
  },
})
