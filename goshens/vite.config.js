import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Standalone GOSHENS app — isolated from the rest of the repository.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
    host: true,
  },
})
