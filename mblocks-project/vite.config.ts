import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // ...
    rollupOptions: {
      output: {
        // Certifique-se de que a opção "format" seja "es" ou "cjs"
        format: 'es',
      },
    },
  },
})
