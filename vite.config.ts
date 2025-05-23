import { fileURLToPath, URL } from 'node:url'
import { defineConfig }    from 'vite'
import vue                 from '@vitejs/plugin-vue'
import vueDevTools         from 'vite-plugin-vue-devtools'

export default defineConfig(({ command }) => ({
  base: '/',
  plugins: [
    vue(),
    command === 'serve' && vueDevTools(),
  ].filter(Boolean),

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