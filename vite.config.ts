import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './' permite publicar la vista previa en cualquier ruta (rutas relativas).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { assetsInlineLimit: 0, chunkSizeWarningLimit: 900 },
})
