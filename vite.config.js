import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// https://ja.vitejs.dev/config/server-options.html
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
})
