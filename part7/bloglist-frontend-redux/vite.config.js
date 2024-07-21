import path from 'path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '#components': path.resolve(__dirname, './src/components'),
      '#reducers': path.resolve(__dirname, './src/reducers'),
      '#services': path.resolve(__dirname, './src/services'),
      '#screens': path.resolve(__dirname, './src/screens')
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3003",
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js',
  },
})
