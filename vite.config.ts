import { fileURLToPath, URL } from 'node:url'
import { defineConfig }    from 'vite'
import vue                 from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => ({
  base: '/',
  plugins: [vue()].filter(Boolean),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
}))