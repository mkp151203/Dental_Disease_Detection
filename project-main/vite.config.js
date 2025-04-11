import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to Flask backend
      '/predict': 'http://localhost:5000',
      '/outputs': 'http://localhost:5000',
    },
  },
})
