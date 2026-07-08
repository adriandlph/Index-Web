import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import http from 'http'

const HTTPS_PORT = 5173
const HTTP_PORT = 5172

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

function httpRedirectPlugin(): import('vite').Plugin {
  let started = false
  return {
    name: 'http-redirect',
    configureServer() {
      if (started) return
      started = true
      http.createServer((req, res) => {
        const host = req.headers.host?.split(':')[0] || 'localhost'
        res.writeHead(301, { Location: `https://${host}:${HTTPS_PORT}${req.url}` })
        res.end()
      }).listen(HTTP_PORT, () => {
        console.log(`  ➜  HTTP:   http://localhost:${HTTP_PORT}/ (redirects to HTTPS)`)
      })
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [tailwindcss(), react(), httpRedirectPlugin()],
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
    port: HTTPS_PORT,
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
