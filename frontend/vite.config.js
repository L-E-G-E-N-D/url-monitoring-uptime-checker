import { defineConfig } from 'vite'
import reactPlugin from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactPlugin()],
})
