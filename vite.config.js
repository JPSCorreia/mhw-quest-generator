import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/mhw-quest-generator/', // Define o nome do repositório aqui
  build: {
    outDir: 'dist', // Pasta de saída do build para o Vite
  },
  assetsInclude: ['**/*.webp'],
})
