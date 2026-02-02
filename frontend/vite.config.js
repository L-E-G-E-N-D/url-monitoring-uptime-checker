import { defineConfig } from 'vite'
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/monitors': 'http://localhost:3000',
      '/auth': 'http://localhost:3000',
    },
  },
})
