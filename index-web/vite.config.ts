import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'

const httpsConfig = (() => {
  try {
    return {
      cert: fs.readFileSync('secrets/cert.pem'),
      key: fs.readFileSync('secrets/key.pem'),
    }
  } catch {
    console.warn('[vite] No SSL certificate found in secrets/. Run: npm run generate-cert')
    return undefined
  }
})()

export default defineConfig({
  base: '/',
  plugins: [tailwindcss(), react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) return 'vendor'
          if (id.includes('node_modules/@headlessui')) return 'ui'
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) return 'i18n'
        },
      },
    },
  },
  server: {
    https: httpsConfig,
    proxy: {
      '/api': {
        target: 'https://localhost:9000',
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
