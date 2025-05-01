import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
    emptyOutDir: true,
    // Make sure manifest.json and icons are copied to the dist folder
    assetsInlineLimit: 0,
    copyPublicDir: true,
  },
})
