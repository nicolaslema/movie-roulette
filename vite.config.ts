import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      'process.env.TMDB_API_KEY': JSON.stringify(env.TMDB_API_KEY),
    },
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return

            if (id.includes('react-dom') || id.includes('react/')) return 'vendor-react'
            if (id.includes('@tanstack/react-query')) return 'vendor-query'
            if (id.includes('framer-motion')) return 'vendor-motion'
            if (id.includes('@headlessui/react') || id.includes('react-icons')) return 'vendor-ui'
            if (id.includes('three') || id.includes('@react-three/fiber')) return 'vendor-three'

            return 'vendor-misc'
          },
        },
      },
    },
  }
})
