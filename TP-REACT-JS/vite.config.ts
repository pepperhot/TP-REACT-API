import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      '/iiif': {
        target: 'https://www.artic.edu',
        changeOrigin: true,
        headers: {
          'AIC-User-Agent': 'TP-REACT-JS',
          Referer: 'https://www.artic.edu/',
        },
      },
    },
  },
})
